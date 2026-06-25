import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/rateLimit";

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

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(req: Request) {
  // Anti-spam/abuso: máx. 5 envíos por IP cada 10 minutos.
  if (!rateLimit(`contacto:${clientIp(req)}`, 5, 10 * 60_000)) {
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

  const faltantes = REQUIRED.filter((k) => {
    const v = body[k];
    return v === undefined || v === null || String(v).trim() === "";
  });
  if (faltantes.length) {
    return NextResponse.json({ ok: false, error: `Faltan campos: ${faltantes.join(", ")}` }, { status: 422 });
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

  const html = `
  <body style="margin:0;background:#eef3f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f6;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 34px rgba(14,34,51,.12);">
          <!-- Encabezado -->
          <tr><td style="background:#0C222F;padding:28px 32px;">
            <div style="color:#8FBE4E;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">Tuterritorio · Catastro de Valledupar</div>
            <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:8px;">Nuevo mensaje de contacto</div>
          </td></tr>
          <!-- Cinta multicolor de marca -->
          <tr><td style="padding:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="height:6px;line-height:6px;font-size:0;background:#4E97B6;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#6AA070;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#8FBE4E;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#F0B63B;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#D83744;">&nbsp;</td>
            </tr></table>
          </td></tr>
          <!-- Cuerpo -->
          <tr><td style="padding:30px 32px;">
            <p style="margin:0 0 22px;color:#4B4B4B;font-size:15px;line-height:1.6;">Recibiste un nuevo mensaje desde el formulario de contacto del sitio.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:11px 0;border-bottom:1px solid #eef1f3;color:#6C757D;width:120px;vertical-align:top;">Nombre</td>
                <td style="padding:11px 0;border-bottom:1px solid #eef1f3;color:#163A4C;font-weight:bold;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding:11px 0;border-bottom:1px solid #eef1f3;color:#6C757D;vertical-align:top;">Cédula</td>
                <td style="padding:11px 0;border-bottom:1px solid #eef1f3;color:#1A1A1A;">${cedula}</td>
              </tr>
              <tr>
                <td style="padding:11px 0;border-bottom:1px solid #eef1f3;color:#6C757D;vertical-align:top;">Correo</td>
                <td style="padding:11px 0;border-bottom:1px solid #eef1f3;"><a href="mailto:${correo}" style="color:#3B85A5;text-decoration:none;font-weight:bold;">${correo}</a></td>
              </tr>
              <tr>
                <td style="padding:11px 0;color:#6C757D;vertical-align:top;">Teléfono</td>
                <td style="padding:11px 0;color:#1A1A1A;">${telefono}</td>
              </tr>
            </table>
            <div style="margin-top:24px;color:#6C757D;font-size:12px;font-weight:bold;letter-spacing:.5px;text-transform:uppercase;">Mensaje</div>
            <div style="margin-top:8px;background:#f6f9fa;border-left:4px solid #3B85A5;border-radius:8px;padding:16px 18px;color:#333333;font-size:15px;line-height:1.7;">${mensaje}</div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr>
              <td style="border-radius:10px;background:#163A4C;">
                <a href="mailto:${correo}?subject=Respuesta%20a%20tu%20mensaje%20-%20Tuterritorio" style="display:inline-block;padding:13px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;">Responder a ${nombre}</a>
              </td>
            </tr></table>
          </td></tr>
          <!-- Pie -->
          <tr><td style="background:#f6f9fa;padding:18px 32px;border-top:1px solid #eef1f3;">
            <div style="color:#6C757D;font-size:12px;line-height:1.5;"><strong>Autorización de datos:</strong> Sí (vía web) · <strong>Fecha del consentimiento:</strong> ${consentAt}</div>
            <div style="color:#9AA3AB;font-size:12px;line-height:1.5;margin-top:6px;">Mensaje generado automáticamente desde el sitio web de Tuterritorio.</div>
          </td></tr>
        </table>
        <div style="color:#9AA3AB;font-size:11px;margin-top:16px;">Tuterritorio — Oficina de Catastro Multipropósito de Valledupar</div>
      </td></tr>
    </table>
  </body>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin clave configurada (p. ej. en local): no se envía, pero no se rompe.
    console.warn("[CONTACTO] RESEND_API_KEY no configurada — el correo NO se envió.", { nombre, correo });
    return NextResponse.json({ ok: true, warning: "email-no-configurado" }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: String(body.correo),
      subject: `Contacto Tuterritorio — ${nombre}`,
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
