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

// Paleta de la marca.
const C = {
  navy: "#0C222F",
  navy2: "#163A4C",
  ink: "#2b3a42",
  gray: "#6b7a83",
  line: "#e6ecf0",
  soft: "#f4f8fa",
  ok: "#3f8a52",
  warn: "#c9871a",
  alert: "#cf3745",
  blue: "#3B85A5",
};

type Tono = "ok" | "warn" | "alert";
const ACENTO: Record<Tono, string> = { ok: "#8FBE4E", warn: "#E7A32E", alert: "#D83744" };
const ETIQUETA: Record<Tono, string> = { ok: "Todo en orden", warn: "Requiere atención", alert: "Atención inmediata" };

type LayoutOpts = { subtitulo?: string; fecha?: string; tono?: Tono; preheader?: string };

/**
 * Envoltura HTML del correo, compatible con clientes de correo (tablas + estilos
 * en línea). El color de la cinta superior y la etiqueta de estado cambian según
 * `tono`. Firma retro-compatible: reportLayout(titulo, cuerpo) sigue funcionando.
 */
export function reportLayout(titulo: string, cuerpoHtml: string, opts: LayoutOpts = {}): string {
  const tono: Tono = opts.tono || "ok";
  const acento = ACENTO[tono];
  const fecha = opts.fecha || new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  const preheader = opts.preheader || opts.subtitulo || "Reporte automático del sitio web de Tuterritorio";

  return `<body style="margin:0;padding:0;background:#eaf0f3;">
    <!-- preheader oculto (texto de vista previa en la bandeja) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf0f3;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
      <tr><td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 38px rgba(14,34,51,.14);">

          <!-- Cinta de acento -->
          <tr><td style="height:5px;background:${acento};font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Cabecera -->
          <tr><td style="background:${C.navy};padding:24px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;">
                <div style="color:${acento};font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;">Tuterritorio · Automatización</div>
                <div style="color:#ffffff;font-size:21px;font-weight:bold;margin-top:7px;line-height:1.25;">${titulo}</div>
                ${opts.subtitulo ? `<div style="color:#a9bcc7;font-size:13px;margin-top:5px;">${opts.subtitulo}</div>` : ""}
              </td>
              <td style="vertical-align:middle;text-align:right;white-space:nowrap;">
                <span style="display:inline-block;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);color:#ffffff;font-size:11px;font-weight:bold;padding:7px 13px;border-radius:999px;">● ${ETIQUETA[tono]}</span>
              </td>
            </tr></table>
          </td></tr>

          <!-- Cuerpo -->
          <tr><td style="padding:26px 32px 30px;color:${C.ink};font-size:14px;line-height:1.62;">${cuerpoHtml}</td></tr>

          <!-- Pie -->
          <tr><td style="background:${C.soft};padding:18px 32px;border-top:1px solid ${C.line};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="color:${C.gray};font-size:12px;line-height:1.5;">
                <b style="color:${C.navy2};">Tuterritorio</b> — Catastro Multipropósito de Valledupar<br>
                Reporte automático del sitio · ${fecha}
              </td>
              <td style="text-align:right;vertical-align:bottom;">
                <a href="https://www.tuterritorio.gov.co" style="color:${C.blue};font-size:12px;font-weight:bold;text-decoration:none;">tuterritorio.gov.co →</a>
              </td>
            </tr></table>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </body>`;
}

// ---- Bloques reutilizables para armar el cuerpo de los reportes ----

type Tarjeta = { etiqueta: string; valor: string; tono: Tono };

/** Fila de tarjetas de "resumen a un vistazo" (2 por fila en pantallas chicas). */
export function resumen(tarjetas: Tarjeta[]): string {
  const celda = (t: Tarjeta) => {
    const col = t.tono === "ok" ? C.ok : t.tono === "warn" ? C.warn : C.alert;
    const bg = t.tono === "ok" ? "#eef6f0" : t.tono === "warn" ? "#fbf3e3" : "#fdeef0";
    return `<td width="50%" style="padding:6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${col}22;border-radius:12px;">
        <tr><td style="padding:14px 16px;">
          <div style="color:${col};font-size:22px;font-weight:bold;line-height:1;">${t.valor}</div>
          <div style="color:${C.gray};font-size:12px;margin-top:6px;text-transform:uppercase;letter-spacing:.4px;">${t.etiqueta}</div>
        </td></tr>
      </table>
    </td>`;
  };
  const filas: string[] = [];
  for (let i = 0; i < tarjetas.length; i += 2) {
    filas.push(`<tr>${celda(tarjetas[i])}${tarjetas[i + 1] ? celda(tarjetas[i + 1]) : '<td width="50%"></td>'}</tr>`);
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:2px 0 8px;">${filas.join("")}</table>`;
}

/** Encabezado de sección con punto de color según el estado. */
export function seccion(titulo: string, tono: Tono): string {
  const col = tono === "ok" ? C.ok : tono === "warn" ? C.warn : C.alert;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 10px;">
    <tr>
      <td width="12" style="vertical-align:middle;"><span style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${col};"></span></td>
      <td style="padding-left:9px;color:${C.navy2};font-size:15px;font-weight:bold;">${titulo}</td>
    </tr>
  </table>`;
}

/** Línea de nota/estado dentro de una sección. */
export function nota(html: string, tono: Tono = "ok"): string {
  const col = tono === "ok" ? C.ok : tono === "warn" ? C.warn : C.alert;
  return `<p style="margin:0 0 6px;color:${col};font-size:13.5px;">${html}</p>`;
}

/** Lista de elementos (p. ej. enlaces con problema). */
export function listaItems(items: string[]): string {
  if (!items.length) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">${items
    .map(
      (it) =>
        `<tr><td style="padding:8px 12px;background:${C.soft};border:1px solid ${C.line};border-radius:8px;font-size:12.5px;color:${C.ink};word-break:break-all;">${it}</td></tr><tr><td style="height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>`
    )
    .join("")}</table>`;
}
