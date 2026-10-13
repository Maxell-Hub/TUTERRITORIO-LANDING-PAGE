import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitAsync, clientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { crearPqrsd, isDbConfigured } from "@/lib/pqrsd";
import { put } from "@vercel/blob";
import { renderEmail, TIPOS } from "@/lib/mailTemplate";

/**
 * Endpoint para radicar PQRSD: valida en servidor, aplica anti-spam (honeypot)
 * y envía la solicitud por correo a la oficina usando Resend.
 *
 * Variables de entorno:
 *  - RESEND_API_KEY  (obligatoria para enviar de verdad)
 *  - PQRSD_TO        (destino; por defecto sistemas@atghub.co)
 *  - PQRSD_FROM / CONTACT_FROM  (remitente verificado en Resend)
 */

const REQUIRED = ["tipo", "nombre", "tipoDocumento", "documento", "correo", "asunto", "descripcion", "autorizacion"];

// Destino fijo (no depende de variables de Vercel).
const TO = "contactenos@tuterritorio.gov.co";
const FROM = process.env.PQRSD_FROM || process.env.CONTACT_FROM || "Tuterritorio <no-responder@tuterritorio.gov.co>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Longitud máxima por campo (anti-abuso y Res. 1519/2020, Anexo 3 num. 5.ii).
const MAX_LEN: Record<string, number> = {
  tipo: 40,
  nombre: 120,
  tipoDocumento: 30,
  documento: 20,
  correo: 254,
  telefono: 30,
  direccion: 200,
  asunto: 200,
  descripcion: 5000,
};

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Anexos: allowlist de extensiones/MIME (alineada con /api/upload) y límites de tamaño.
const MAX_FILES = 3;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // 4 MB en total (límite de cuerpo en serverless)
const FILE_EXTS = new Set(["pdf", "jpg", "jpeg", "png", "webp", "doc", "docx"]);
const FILE_MIMES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const extOf = (name: string) => (name.split(".").pop() || "").toLowerCase();
/** Evita encabezados/HTML raros en el nombre del archivo adjunto. */
const safeName = (name: string) => name.replace(/[^\w.\-() áéíóúüñÁÉÍÓÚÜÑ]/g, "_").slice(0, 120);

export async function POST(req: Request) {
  // Anti-spam/abuso: máx. 5 radicaciones por IP cada 10 minutos.
  if (!(await rateLimitAsync(`pqrsd:${clientIp(req)}`, 5, 10 * 60_000))) {
    return NextResponse.json(
      { ok: false, error: "Has enviado varias solicitudes. Espera unos minutos antes de intentar de nuevo." },
      { status: 429 }
    );
  }

  // Acepta multipart/form-data (formulario con anexos) y JSON (compatibilidad).
  let body: Record<string, unknown>;
  const files: File[] = [];
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    let fd: FormData;
    try {
      fd = await req.formData();
    } catch {
      return NextResponse.json({ ok: false, error: "Formulario inválido" }, { status: 400 });
    }
    body = {};
    for (const [k, v] of fd.entries()) {
      if (k === "archivos") {
        if (v instanceof File && v.size > 0) files.push(v);
      } else {
        body[k] = String(v);
      }
    }
    // Validación de anexos: cantidad, tipo y tamaño total.
    if (files.length > MAX_FILES) {
      return NextResponse.json({ ok: false, error: `Máximo ${MAX_FILES} archivos adjuntos.` }, { status: 422 });
    }
    const invalid = files.find((f) => !FILE_EXTS.has(extOf(f.name)) || (f.type && !FILE_MIMES.has(f.type)));
    if (invalid) {
      return NextResponse.json(
        { ok: false, error: "Tipo de archivo no permitido. Formatos: PDF, JPG, PNG, WEBP, DOC y DOCX." },
        { status: 415 }
      );
    }
    const total = files.reduce((s, f) => s + f.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      return NextResponse.json({ ok: false, error: "Los anexos superan el tamaño máximo (4 MB en total)." }, { status: 413 });
    }
  } else {
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
    }
  }

  // Anti-spam: honeypot relleno = bot (respuesta neutra).
  if (typeof body._honey === "string" && body._honey.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Captcha (Cloudflare Turnstile). Solo bloquea si está configurado el secret.
  if (!(await verifyTurnstile(body["cf-turnstile-response"] as string, clientIp(req)))) {
    return NextResponse.json(
      { ok: false, error: "No se pudo verificar que eres una persona. Recarga la página e inténtalo de nuevo." },
      { status: 400 }
    );
  }

  // Validación de obligatorios.
  const faltantes = REQUIRED.filter((k) => {
    const v = body[k];
    return v === undefined || v === null || String(v).trim() === "";
  });
  if (faltantes.length) {
    return NextResponse.json(
      { ok: false, error: `Faltan campos obligatorios: ${faltantes.join(", ")}` },
      { status: 422 }
    );
  }

  // Validación de longitud máxima por campo.
  const excedidos = Object.keys(MAX_LEN).filter((k) => String(body[k] ?? "").length > MAX_LEN[k]);
  if (excedidos.length) {
    return NextResponse.json(
      { ok: false, error: `Campos demasiado largos: ${excedidos.join(", ")}` },
      { status: 422 }
    );
  }

  // Validación de correo.
  if (!EMAIL_RE.test(String(body.correo))) {
    return NextResponse.json({ ok: false, error: "Correo inválido" }, { status: 422 });
  }

  // --- Seguimiento en base de datos (Neon), si está conectada ---
  // Guarda la PQRSD (sin número de radicado) y sube los anexos al Blob.
  // Si algo falla aquí, NO se bloquea la radicación: se continúa con el correo.
  if (isDbConfigured) {
    try {
      const adjuntos = await Promise.all(
        files.map(async (f) => {
          // URL con sufijo aleatorio = enlace no adivinable (solo visible para el admin).
          const { url } = await put(`pqrsd/${safeName(f.name)}`, f, { access: "public", addRandomSuffix: true });
          return { nombre: safeName(f.name), url, tamano: f.size };
        })
      );
      await crearPqrsd({
        tipo: String(body.tipo),
        nombre: String(body.nombre),
        doc_tipo: String(body.tipoDocumento || ""),
        documento: String(body.documento || ""),
        correo: String(body.correo || ""),
        telefono: String(body.telefono || ""),
        asunto: String(body.asunto || ""),
        descripcion: String(body.descripcion || ""),
        adjuntos,
        autorizacion_fecha: body.autorizacionFecha ? String(body.autorizacionFecha) : undefined,
      });
    } catch (e) {
      console.error("[PQRSD] Error al guardar en la base de datos:", e);
    }
  }

  const tipo = esc(body.tipo);
  const nombre = esc(body.nombre);
  const tipoDocumento = esc(body.tipoDocumento);
  const documento = esc(body.documento);
  const correo = esc(body.correo);
  const telefono = esc(body.telefono) || "—";
  const direccion = esc(body.direccion) || "—";
  const asunto = esc(body.asunto);
  const descripcion = esc(body.descripcion).replace(/\n/g, "<br>");

  // Prueba del consentimiento (Ley 1581/2012): fecha y hora de la autorización.
  const consentAt = body.autorizacionFecha
    ? new Date(String(body.autorizacionFecha)).toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium", timeStyle: "short" })
    : "—";

  const anexosTxt = files.length
    ? files.map((f) => `- ${f.name} (${Math.max(1, Math.round(f.size / 1024))} KB)`).join("\n")
    : "Sin anexos";

  const text =
    `Nueva PQRSD — Tuterritorio\n\n` +
    `Tipo: ${body.tipo}\nNombre: ${body.nombre}\n` +
    `Documento: ${body.tipoDocumento} ${body.documento}\n` +
    `Correo: ${body.correo}\nTeléfono: ${body.telefono || "—"}\nDirección: ${body.direccion || "—"}\n\n` +
    `Asunto: ${body.asunto}\n\nDescripción:\n${body.descripcion}\n\n` +
    `Anexos:\n${anexosTxt}\n\n` +
    `Autorización de tratamiento de datos: Sí (vía web)\nFecha y hora del consentimiento: ${consentAt}`;

  const anexosHtml = files.length
    ? files.map((f) => `${esc(f.name)} <span style="color:#9a9488;">· ${Math.max(1, Math.round(f.size / 1024))} KB</span>`).join("<br>")
    : "La persona no adjuntó documentos.";

  const html = renderEmail({
    preheader: `Nueva PQRSD (${tipo}) de ${nombre} — ${asunto}`,
    accent: TIPOS.pqrsd.color,
    badge: `${TIPOS.pqrsd.badge} · ${tipo}`,
    titulo: "Nueva PQRSD radicada",
    intro: `<strong>${nombre}</strong> radicó una nueva solicitud (<strong>${tipo}</strong>) a través del formulario de PQRSD del sitio. A continuación están sus datos y lo que solicita.`,
    filas: [
      { label: "Tipo de solicitud", value: tipo },
      { label: "Nombre", value: nombre },
      { label: "Documento", value: `${tipoDocumento} ${documento}` },
      { label: "Correo", value: correo, href: `mailto:${correo}` },
      { label: "Teléfono", value: telefono },
      { label: "Dirección", value: direccion },
      { label: "Asunto", value: asunto },
    ],
    bloques: [
      { label: "Descripción", html: descripcion, accent: TIPOS.pqrsd.color },
      { label: `Anexos (${files.length})`, html: anexosHtml, accent: "green" },
    ],
    cta: { href: `mailto:${correo}?subject=Respuesta%20a%20tu%20PQRSD%20-%20Tuterritorio`, label: `Responder a ${nombre}` },
    consentAt,
    notaPie: "PQRSD generada automáticamente desde el sitio web de Tuterritorio.",
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin clave configurada (p. ej. en local): no se envía, pero no se rompe.
    // No se registran datos personales en los logs (minimización, Ley 1581/2012).
    console.warn("[PQRSD] RESEND_API_KEY no configurada — el correo NO se envió.");
    return NextResponse.json({ ok: true, warning: "email-no-configurado" }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    // Los anexos del ciudadano viajan como adjuntos del correo.
    const attachments = await Promise.all(
      files.map(async (f) => ({
        filename: safeName(f.name),
        content: Buffer.from(await f.arrayBuffer()),
      }))
    );
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: String(body.correo),
      // El asunto no es HTML: se usa el valor sin escapar (Resend lo codifica).
      subject: `PQRSD ${String(body.tipo).trim()} — ${String(body.nombre).trim()}`,
      html,
      text,
      ...(attachments.length ? { attachments } : {}),
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    // Se registra el detalle en el servidor, pero NO se expone al cliente.
    console.error("[PQRSD] Error al enviar correo:", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo radicar en este momento. Intenta más tarde." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
