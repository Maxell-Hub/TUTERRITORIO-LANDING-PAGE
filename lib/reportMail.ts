// Envía correos de reporte de las automatizaciones (crons) usando Resend.
import { Resend } from "resend";

const TO = process.env.REPORTS_TO || "contactenos@tuterritorio.gov.co";
const FROM = process.env.PQRSD_FROM || process.env.CONTACT_FROM || "Tuterritorio <no-responder@tuterritorio.gov.co>";

type Adjunto = { filename: string; content: Buffer };

/** Envía un correo (HTML) de reporte, opcionalmente con adjuntos. */
export async function sendReport(subject: string, html: string, attachments?: Adjunto[]): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[cron] RESEND_API_KEY no configurada — no se envió el reporte:", subject);
    return false;
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject,
      html,
      ...(attachments?.length ? { attachments } : {}),
    });
    if (error) throw new Error(error.message);
    return true;
  } catch (e) {
    console.error("[cron] Error al enviar reporte:", e);
    return false;
  }
}

/** Envoltura HTML sencilla y con la identidad del sitio. */
export function reportLayout(titulo: string, cuerpoHtml: string): string {
  return `<body style="margin:0;background:#eef3f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:26px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 34px rgba(14,34,51,.12);">
          <tr><td style="background:#0C222F;padding:22px 30px;">
            <div style="color:#8FBE4E;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">Tuterritorio · Automatización</div>
            <div style="color:#fff;font-size:20px;font-weight:bold;margin-top:6px;">${titulo}</div>
          </td></tr>
          <tr><td style="padding:26px 30px;color:#333;font-size:14px;line-height:1.6;">${cuerpoHtml}</td></tr>
          <tr><td style="background:#f6f9fa;padding:14px 30px;border-top:1px solid #eef1f3;color:#9AA3AB;font-size:12px;">Reporte automático del sitio web de Tuterritorio.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>`;
}
