import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Endpoint de contacto: valida, aplica anti-spam (honeypot) y envía el mensaje
 * por correo a la oficina usando Resend.
 *
 * Variables de entorno:
 *  - RESEND_API_KEY  (obligatoria para enviar de verdad)
 *  - CONTACT_TO      (destino; por defecto sistemas@atghub.co)
 *  - CONTACT_FROM    (remitente verificado en Resend; por defecto el de pruebas)
 */
const REQUIRED = ["nombre", "correo", "mensaje", "autorizacion"];

const TO = process.env.CONTACT_TO || "sistemas@atghub.co";
const FROM = process.env.CONTACT_FROM || "Tuterritorio <onboarding@resend.dev>";

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
  const correo = esc(body.correo);
  const telefono = esc(body.telefono) || "—";
  const mensaje = esc(body.mensaje).replace(/\n/g, "<br>");
  const radicado = `CT-${Date.now()}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A">
      <div style="background:linear-gradient(135deg,#0C222F,#1E5167);color:#fff;padding:22px 24px;border-radius:12px 12px 0 0">
        <div style="font-weight:800;font-size:18px">Nuevo mensaje de contacto</div>
        <div style="opacity:.8;font-size:13px;margin-top:4px">Tuterritorio · Radicado ${radicado}</div>
      </div>
      <div style="border:1px solid #E2E6E9;border-top:none;border-radius:0 0 12px 12px;padding:22px 24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#6C757D;width:120px">Nombre</td><td style="padding:8px 0;font-weight:600">${nombre}</td></tr>
          <tr><td style="padding:8px 0;color:#6C757D">Correo</td><td style="padding:8px 0"><a href="mailto:${correo}">${correo}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6C757D">Teléfono</td><td style="padding:8px 0">${telefono}</td></tr>
        </table>
        <div style="margin-top:16px;color:#6C757D;font-size:13px">Mensaje</div>
        <div style="margin-top:6px;padding:14px 16px;background:#F8F9FA;border-radius:10px;font-size:14px;line-height:1.6">${mensaje}</div>
      </div>
    </div>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin clave configurada (p. ej. en local): no se envía, pero no se rompe.
    console.warn("[CONTACTO] RESEND_API_KEY no configurada — el correo NO se envió.", { nombre, correo });
    return NextResponse.json({ ok: true, radicado, warning: "email-no-configurado" }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: String(body.correo),
      subject: `Contacto Tuterritorio — ${nombre}`,
      html,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("[CONTACTO] Error al enviar correo:", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el mensaje en este momento. Intenta más tarde." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, radicado }, { status: 200 });
}
