import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitAsync, clientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { renderEmail, TIPOS } from "@/lib/mailTemplate";

/**
 * Endpoint de contacto: valida, aplica anti-spam (honeypot) y envía el mensaje
 * por correo a la oficina usando Resend.
 *
 * Variables de entorno:
 *  - RESEND_API_KEY  (obligatoria para enviar de verdad)
 *  - CONTACT_TO      (destino; por defecto sistemas@atghub.co)
 *  - CONTACT_FROM    (remitente verificado en Resend; por defecto el de pruebas)
 */
const REQUIRED = ["nombre", "cedula", "correo", "mensaje", "autorizacion"];

// Destino fijo (no depende de la variable CONTACT_TO de Vercel).
const TO = "contactenos@tuterritorio.gov.co";
const FROM = process.env.CONTACT_FROM || "Tuterritorio <no-responder@tuterritorio.gov.co>";

// Longitud máxima por campo (anti-abuso y Res. 1519/2020, Anexo 3 num. 5.ii).
const MAX_LEN: Record<string, number> = {
  nombre: 120,
  cedula: 20,
  correo: 254,
  telefono: 30,
  mensaje: 5000,
};

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(req: Request) {
  // Anti-spam/abuso: máx. 5 envíos por IP cada 10 minutos.
  if (!(await rateLimitAsync(`contacto:${clientIp(req)}`, 5, 10 * 60_000))) {
    return NextResponse.json(
      { ok: false, error: "Has enviado varios mensajes. Espera unos minutos antes de intentar de nuevo." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  // Anti-spam: si el honeypot viene lleno, fingimos éxito y no hacemos nada.
  if (typeof body._honey === "string" && body._honey.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Captcha (Cloudflare Turnstile). Solo bloquea si está configurado el secret.
  if (!(await verifyTurnstile(body["cf-turnstile-response"] as string, clientIp(req)))) {
    return NextResponse.json(
      { error: "No se pudo verificar que eres una persona. Recarga la página e inténtalo de nuevo." },
      { status: 400 }
    );
  }

  const faltantes = REQUIRED.filter((k) => {
    const v = body[k];
    return v === undefined || v === null || String(v).trim() === "";
  });
  if (faltantes.length) {
    return NextResponse.json({ ok: false, error: `Faltan campos: ${faltantes.join(", ")}` }, { status: 422 });
  }

  // Validación de longitud máxima por campo.
  const excedidos = Object.keys(MAX_LEN).filter((k) => String(body[k] ?? "").length > MAX_LEN[k]);
  if (excedidos.length) {
    return NextResponse.json(
      { ok: false, error: `Campos demasiado largos: ${excedidos.join(", ")}` },
      { status: 422 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.correo))) {
    return NextResponse.json({ ok: false, error: "Correo inválido" }, { status: 422 });
  }

  const nombre = esc(body.nombre);
  const cedula = esc(body.cedula);
  const correo = esc(body.correo);
  const telefono = esc(body.telefono) || "—";
  const mensaje = esc(body.mensaje).replace(/\n/g, "<br>");

  // Prueba del consentimiento (Ley 1581/2012): fecha y hora de la autorización.
  const consentAt = body.autorizacionFecha
    ? new Date(String(body.autorizacionFecha)).toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium", timeStyle: "short" })
    : "—";

  // Versión de texto plano (mejora la entregabilidad / evita spam).
  const text =
    `Nuevo mensaje de contacto — Tuterritorio\n\n` +
    `Nombre: ${body.nombre}\nCédula: ${body.cedula}\nCorreo: ${body.correo}\nTeléfono: ${body.telefono || "—"}\n\n` +
    `Mensaje:\n${body.mensaje}\n\n` +
    `Autorización de tratamiento de datos: Sí (vía web)\nFecha y hora del consentimiento: ${consentAt}`;

  const html = renderEmail({
    preheader: `Nuevo mensaje de ${nombre}${body.mensaje ? ` — ${String(body.mensaje).slice(0, 80)}` : ""}`,
    accent: TIPOS.contacto.color,
    badge: TIPOS.contacto.badge,
    badgeIcon: TIPOS.contacto.icon,
    titulo: "Nuevo mensaje de contacto",
    intro: `Recibiste un nuevo mensaje desde el formulario <strong>Envíanos un mensaje</strong> del sitio. Puedes responder directamente a <strong>${nombre}</strong>.`,
    filas: [
      { label: "Nombre", value: nombre },
      { label: "Cédula", value: cedula },
      { label: "Correo", value: correo, href: `mailto:${correo}` },
      { label: "Teléfono", value: telefono },
    ],
    bloques: [{ label: "Mensaje", html: mensaje, accent: TIPOS.contacto.color }],
    cta: { href: `mailto:${correo}?subject=Respuesta%20a%20tu%20mensaje%20-%20Tuterritorio`, label: `Responder a ${nombre}` },
    consentAt,
    notaPie: "Mensaje generado automáticamente desde el sitio web de Tuterritorio.",
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin clave configurada (p. ej. en local): no se envía, pero no se rompe.
    // No se registran datos personales en los logs (minimización, Ley 1581/2012).
    console.warn("[CONTACTO] RESEND_API_KEY no configurada — el correo NO se envió.");
    return NextResponse.json({ ok: true, warning: "email-no-configurado" }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: String(body.correo),
      // El asunto no es HTML: se usa el valor sin escapar (Resend lo codifica).
      subject: `Contacto Tuterritorio — ${String(body.nombre).trim()}`,
      html,
      text,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    // Se registra el detalle en el servidor, pero NO se expone al cliente.
    console.error("[CONTACTO] Error al enviar correo:", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el mensaje en este momento. Intenta más tarde." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
