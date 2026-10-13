// Envía correos de reporte de las automatizaciones (crons) usando Resend.
// Mismo lenguaje visual que los correos ciudadanos (lib/mailTemplate.ts):
// carta cálida, Poppins + Open Sans, neutros sand, sin cabecera oscura ni emojis.
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

const SITE = "https://www.tuterritorio.gov.co";
const LOGO = `${SITE}/assets/global/logo-tuterritorio-v.png`;
const ENTIDAD = "Operador Catastral de Valledupar";

// Neutros cálidos + marca (igual que mailTemplate).
const C = {
  paper: "#f1ece3", sheet: "#ffffff", ink: "#2b2721", soft: "#6f685c",
  faint: "#9a9488", line: "#ece6db", wash: "#faf7f2", navy: "#163A4C",
};
const H = "'Poppins','Segoe UI',Arial,sans-serif";
const B = "'Open Sans','Segoe UI',Arial,Helvetica,sans-serif";

type Tono = "ok" | "warn" | "alert";
const TONO: Record<Tono, string> = { ok: "#4E8654", warn: "#B26B1E", alert: "#C14434" };
const TINTE: Record<Tono, string> = { ok: "#eef4ee", warn: "#f7efe3", alert: "#f8ece9" };
const ETIQUETA: Record<Tono, string> = { ok: "Todo en orden", warn: "Requiere atención", alert: "Atención inmediata" };

type LayoutOpts = { subtitulo?: string; fecha?: string; tono?: Tono; preheader?: string };

/**
 * Envoltura HTML del reporte (tablas + estilos en línea). El acento sigue el
 * `tono` (ok/warn/alert). Firma retro-compatible: reportLayout(titulo, cuerpo).
 */
export function reportLayout(titulo: string, cuerpoHtml: string, opts: LayoutOpts = {}): string {
  const tono: Tono = opts.tono || "ok";
  const acento = TONO[tono];
  const fecha = opts.fecha || new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  const preheader = opts.preheader || opts.subtitulo || "Reporte automático del sitio web de Tuterritorio";

  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Open+Sans:wght@400;600;700&display=swap');
  body,table,td,a,p,div,span,h1 { font-family:${B}; }
  a { text-decoration:none; }
  @media (max-width:620px){ .sheet{width:100%!important;} .pad{padding-left:26px!important;padding-right:26px!important;} .tile{display:block!important;width:100%!important;} }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};">
    <tr><td align="center" style="padding:34px 14px 40px;">
      <table role="presentation" class="sheet" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.sheet};border:1px solid ${C.line};border-radius:10px;">

        <!-- Membrete -->
        <tr><td class="pad" style="padding:30px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;">
              <img src="${LOGO}" alt="Tuterritorio" height="42" style="height:42px;width:auto;display:block;border:0;">
            </td>
            <td style="vertical-align:middle;text-align:right;">
              <div style="color:${C.soft};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;font-family:${H};">Reporte del sitio</div>
              <div style="color:${C.faint};font-size:12px;margin-top:4px;font-family:${B};">${fecha}</div>
            </td>
          </tr></table>
        </td></tr>

        <tr><td class="pad" style="padding:18px 40px 0;"><div style="height:1px;background:${C.line};font-size:0;line-height:0;">&nbsp;</div></td></tr>

        <!-- Título + estado -->
        <tr><td class="pad" style="padding:24px 40px 0;">
          <h1 style="margin:0;color:${C.ink};font-size:23px;font-weight:700;line-height:1.3;font-family:${H};">${titulo}</h1>
          <div style="width:34px;height:3px;background:${acento};margin:12px 0 0;border-radius:2px;font-size:0;line-height:0;">&nbsp;</div>
          ${opts.subtitulo ? `<p style="margin:14px 0 0;color:${C.soft};font-size:15px;line-height:1.7;font-family:${B};">${opts.subtitulo}</p>` : ""}
          <p style="margin:12px 0 0;font-family:${B};font-size:14px;"><span style="color:${acento};font-weight:700;">● ${ETIQUETA[tono]}</span></p>
        </td></tr>

        <!-- Cuerpo -->
        <tr><td class="pad" style="padding:8px 40px 34px;color:${C.ink};font-size:14.5px;line-height:1.68;font-family:${B};">${cuerpoHtml}</td></tr>

        <!-- Pie -->
        <tr><td class="pad" style="padding:22px 40px 30px;border-top:1px solid ${C.line};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:top;">
              <div style="color:${C.navy};font-size:15px;font-weight:600;font-family:${H};">Tuterritorio</div>
              <div style="color:${C.soft};font-size:13px;margin-top:2px;font-family:${B};">${ENTIDAD}</div>
              <div style="color:${C.faint};font-size:12.5px;margin-top:6px;font-family:${B};">Reporte automático del sitio · ${fecha}</div>
            </td>
            <td style="vertical-align:bottom;text-align:right;">
              <a href="${SITE}" style="color:${TONO.ok};font-size:12.5px;font-weight:700;font-family:${B};">tuterritorio.gov.co →</a>
            </td>
          </tr></table>
        </td></tr>

      </table>
      <div style="color:${C.faint};font-size:11.5px;margin-top:16px;font-family:${B};">Tuterritorio · ${SITE.replace("https://", "")}</div>
    </td></tr>
  </table>
</body></html>`;
}

// ---- Bloques reutilizables para el cuerpo del reporte ----

type Tarjeta = { etiqueta: string; valor: string; tono: Tono };

/** Fila de tarjetas de "resumen a un vistazo" (2 por fila). */
export function resumen(tarjetas: Tarjeta[]): string {
  const celda = (t: Tarjeta) => {
    const col = TONO[t.tono];
    return `<td class="tile" width="50%" style="padding:6px;vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINTE[t.tono]};border-radius:10px;"><tr>
        <td style="padding:15px 16px;">
          <div style="color:${col};font-size:23px;font-weight:700;line-height:1;font-family:${H};">${t.valor}</div>
          <div style="color:${C.soft};font-size:12px;margin-top:7px;letter-spacing:.3px;font-family:${B};">${t.etiqueta}</div>
        </td>
      </tr></table>
    </td>`;
  };
  const filas: string[] = [];
  for (let i = 0; i < tarjetas.length; i += 2) {
    filas.push(`<tr>${celda(tarjetas[i])}${tarjetas[i + 1] ? celda(tarjetas[i + 1]) : '<td width="50%"></td>'}</tr>`);
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 2px;">${filas.join("")}</table>`;
}

/** Encabezado de sección con marca de color según el estado. */
export function seccion(titulo: string, tono: Tono): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 10px;"><tr>
    <td width="20" style="vertical-align:middle;"><div style="width:11px;height:3px;background:${TONO[tono]};border-radius:2px;font-size:0;line-height:0;">&nbsp;</div></td>
    <td style="color:${C.ink};font-size:16px;font-weight:600;font-family:${H};">${titulo}</td>
  </tr></table>`;
}

/** Línea de nota/estado dentro de una sección. */
export function nota(html: string, tono: Tono = "ok"): string {
  return `<p style="margin:0 0 6px;color:${TONO[tono]};font-size:14px;line-height:1.6;font-family:${B};">${html}</p>`;
}

/** Lista de elementos (p. ej. enlaces con problema). */
export function listaItems(items: string[]): string {
  if (!items.length) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">${items
    .map(
      (it) =>
        `<tr><td style="padding:10px 14px;background:${C.wash};border-left:3px solid ${C.line};font-size:12.5px;color:${C.ink};font-family:${B};word-break:break-all;">${it}</td></tr><tr><td style="height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>`
    )
    .join("")}</table>`;
}
