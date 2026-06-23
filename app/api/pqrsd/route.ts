import { NextResponse } from "next/server";
import { Resend } from "resend";

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

const TO = process.env.PQRSD_TO || "sistemas@atghub.co";
const FROM = process.env.PQRSD_FROM || process.env.CONTACT_FROM || "Tuterritorio <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  // Anti-spam: honeypot relleno = bot (respuesta neutra).
  if (typeof body._honey === "string" && body._honey.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
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

  // Validación de correo.
  if (!EMAIL_RE.test(String(body.correo))) {
    return NextResponse.json({ ok: false, error: "Correo inválido" }, { status: 422 });
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
  const radicado = `TT-${Date.now()}`;

  const text =
    `Nueva PQRSD — Tuterritorio\n\n` +
    `Tipo: ${body.tipo}\nNombre: ${body.nombre}\n` +
    `Documento: ${body.tipoDocumento} ${body.documento}\n` +
    `Correo: ${body.correo}\nTeléfono: ${body.telefono || "—"}\nDirección: ${body.direccion || "—"}\n\n` +
    `Asunto: ${body.asunto}\n\nDescripción:\n${body.descripcion}\n\nRadicado: ${radicado}`;

  const row = (label: string, value: string, link?: string) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #eef1f3;color:#6C757D;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid #eef1f3;color:#163A4C;font-weight:bold;">${link ? `<a href="${link}" style="color:#3B85A5;text-decoration:none;">${value}</a>` : value}</td>
    </tr>`;

  const html = `
  <body style="margin:0;background:#eef3f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f6;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 34px rgba(14,34,51,.12);">
          <tr><td style="background:#0C222F;padding:28px 32px;">
            <div style="color:#8FBE4E;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">Tuterritorio · Catastro de Valledupar</div>
            <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:8px;">Nueva PQRSD radicada</div>
          </td></tr>
          <tr><td style="padding:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="height:6px;line-height:6px;font-size:0;background:#4E97B6;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#6AA070;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#8FBE4E;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#F0B63B;">&nbsp;</td>
              <td style="height:6px;line-height:6px;font-size:0;background:#D83744;">&nbsp;</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:30px 32px;">
            <p style="margin:0 0 22px;color:#4B4B4B;font-size:15px;line-height:1.6;">Se radicó una nueva solicitud (<strong>${tipo}</strong>) desde el formulario de PQRSD del sitio.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              ${row("Tipo de solicitud", tipo)}
              ${row("Nombre", nombre)}
              ${row("Documento", `${tipoDocumento} ${documento}`)}
              ${row("Correo", correo, `mailto:${correo}`)}
              ${row("Teléfono", telefono)}
              ${row("Dirección", direccion)}
              ${row("Asunto", asunto)}
            </table>
            <div style="margin-top:24px;color:#6C757D;font-size:12px;font-weight:bold;letter-spacing:.5px;text-transform:uppercase;">Descripción</div>
            <div style="margin-top:8px;background:#f6f9fa;border-left:4px solid #3B85A5;border-radius:8px;padding:16px 18px;color:#333333;font-size:15px;line-height:1.7;">${descripcion}</div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr>
              <td style="border-radius:10px;background:#163A4C;">
                <a href="mailto:${correo}?subject=Respuesta%20a%20tu%20PQRSD%20${radicado}%20-%20Tuterritorio" style="display:inline-block;padding:13px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;">Responder a ${nombre}</a>
              </td>
            </tr></table>
          </td></tr>
          <tr><td style="background:#f6f9fa;padding:18px 32px;border-top:1px solid #eef1f3;">
            <div style="color:#9AA3AB;font-size:12px;line-height:1.5;">Radicado <strong style="color:#6C757D;">${radicado}</strong> · PQRSD generada automáticamente desde el sitio web de Tuterritorio.</div>
          </td></tr>
        </table>
        <div style="color:#9AA3AB;font-size:11px;margin-top:16px;">Tuterritorio — Oficina de Catastro Multipropósito de Valledupar</div>
      </td></tr>
    </table>
  </body>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin clave configurada (p. ej. en local): no se envía, pero no se rompe.
    console.warn("[PQRSD] RESEND_API_KEY no configurada — el correo NO se envió.", { nombre, correo, asunto });
    return NextResponse.json({ ok: true, radicado, warning: "email-no-configurado" }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: String(body.correo),
      subject: `PQRSD ${tipo} — ${nombre} (${radicado})`,
      html,
      text,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("[PQRSD] Error al enviar correo:", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo radicar en este momento. Intenta más tarde." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, radicado }, { status: 200 });
}
