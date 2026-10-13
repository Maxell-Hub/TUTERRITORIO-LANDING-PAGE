/**
 * Plantilla corporativa compartida para los correos que la ciudadanía genera
 * (PQRSD y contacto). Pensada como "papel membretado": logo, hairline de marca,
 * tipografía de la página (Poppins con respaldo del sistema), buena jerarquía y
 * aire — no un simple recuadro.
 *
 * Compatibilidad: tablas + estilos en línea (Gmail, Outlook, Apple Mail…). La
 * fuente Poppins se carga por @import para los clientes que lo permiten (Apple
 * Mail, iOS); el resto cae con elegancia a 'Segoe UI'/Arial. Los valores que se
 * interpolan deben venir YA escapados por quien llama.
 */

const SITE = "https://www.tuterritorio.gov.co";
const LOGO = `${SITE}/assets/global/logo-tuterritorio-v.png`;
const ENTIDAD = "Operador Catastral de Valledupar";

// Paleta de la marca.
const C = {
  navy: "#0C222F",
  navy2: "#163A4C",
  ink: "#2b3a42",
  gray: "#6b7a83",
  grayL: "#8a97a0",
  line: "#e8edf0",
  soft: "#f5f8fa",
  blue: "#3B85A5",
  green: "#4E8654",
  lime: "#8FBE4E",
};

const FONT = "'Poppins','Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export type Fila = { label: string; value: string; href?: string };
/** accent: "blue" | "green" | un color hex ("#...") para usar el del tipo. */
export type Bloque = { label: string; html: string; accent?: "blue" | "green" | string };

/**
 * Identidad visual por TIPO de correo, para reconocerlo de un vistazo:
 * cada uno tiene color de acento, insignia (pill) e ícono propios.
 * Los reportes automáticos usan su propia plantilla (lib/reportMail.ts) con la
 * misma familia de insignia pero en color pizarra.
 */
export const TIPOS = {
  pqrsd: { color: "#C8821A", badge: "PQRSD", icon: "📋" },       // dorado → solicitud formal
  contacto: { color: "#3B85A5", badge: "MENSAJE DE CONTACTO", icon: "✉️" }, // azul → comunicación
} as const;

export type EmailOpts = {
  /** Texto de vista previa en la bandeja (oculto en el cuerpo). */
  preheader: string;
  /** Color de acento del tipo (hex) — identifica el correo de un vistazo. */
  accent: string;
  /** Insignia corta del tipo (p. ej. "PQRSD", "MENSAJE DE CONTACTO"). */
  badge: string;
  /** Ícono (emoji) de la insignia. */
  badgeIcon?: string;
  /** Título grande del correo (p. ej. "Nueva PQRSD radicada"). */
  titulo: string;
  /** Frase introductoria (puede llevar <strong>). */
  intro: string;
  /** Fecha mostrada en la cabecera (por defecto, hoy en es-CO). */
  fecha?: string;
  /** Datos en filas etiqueta/valor. */
  filas: Fila[];
  /** Bloques de texto destacados (mensaje, descripción, anexos…). */
  bloques?: Bloque[];
  /** Botón de acción principal. */
  cta?: { href: string; label: string };
  /** Fecha/hora del consentimiento (para el pie legal). */
  consentAt?: string;
  /** Nota del pie (p. ej. "PQRSD generada automáticamente…"). */
  notaPie?: string;
};

function filasHtml(filas: Fila[]): string {
  return filas
    .map((f, i) => {
      const last = i === filas.length - 1;
      const borde = last ? "" : `border-bottom:1px solid ${C.line};`;
      const val = f.href
        ? `<a href="${f.href}" style="color:${C.blue};text-decoration:none;font-weight:600;">${f.value}</a>`
        : f.value;
      return `<tr>
        <td style="padding:12px 0;${borde}color:${C.gray};font-size:13px;width:140px;vertical-align:top;">${f.label}</td>
        <td style="padding:12px 0;${borde}color:${C.navy2};font-size:14px;font-weight:600;vertical-align:top;">${val}</td>
      </tr>`;
    })
    .join("");
}

function bloqueHtml(b: Bloque): string {
  const col = !b.accent ? C.blue : b.accent.startsWith("#") ? b.accent : b.accent === "green" ? C.green : C.blue;
  return `
    <div style="margin:24px 0 0;color:${C.grayL};font-size:11.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;">${b.label}</div>
    <div style="margin-top:9px;background:${C.soft};border:1px solid ${C.line};border-left:3px solid ${col};border-radius:10px;padding:16px 18px;color:${C.ink};font-size:14.5px;line-height:1.7;">${b.html}</div>`;
}

export function renderEmail(opts: EmailOpts): string {
  const fecha =
    opts.fecha ||
    new Date().toLocaleDateString("es-CO", { timeZone: "America/Bogota", day: "2-digit", month: "long", year: "numeric" });

  const bloques = (opts.bloques || []).map(bloqueHtml).join("");

  const accent = opts.accent;
  const icon = opts.badgeIcon ? `${opts.badgeIcon} ` : "";

  const cta = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 2px;"><tr>
        <td style="border-radius:10px;background:${C.navy2};">
          <a href="${opts.cta.href}" style="display:inline-block;padding:13px 30px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;font-family:${FONT};">${opts.cta.label}</a>
        </td>
      </tr></table>`
    : "";

  const consent = opts.consentAt
    ? `<div style="color:${C.gray};font-size:12px;line-height:1.6;"><strong style="color:${C.navy2};">Autorización de tratamiento de datos:</strong> Sí (vía web) · <strong style="color:${C.navy2};">Consentimiento:</strong> ${opts.consentAt}</div>`
    : "";

  const notaPie = opts.notaPie
    ? `<div style="color:${C.grayL};font-size:12px;line-height:1.6;margin-top:6px;">${opts.notaPie}</div>`
    : "";

  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  body,table,td,a,p,div,span,h1,h2 { font-family:${FONT}; }
  a { text-decoration:none; }
  @media (max-width:620px){ .card{width:100%!important;} .pad{padding-left:22px!important;padding-right:22px!important;} }
</style>
</head>
<body style="margin:0;padding:0;background:#eef3f6;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f6;">
    <tr><td align="center" style="padding:30px 12px;">
      <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid ${C.line};border-radius:16px;overflow:hidden;box-shadow:0 14px 40px rgba(14,34,51,.10);">

        <!-- Barra superior del color del tipo: identifica el correo de un vistazo -->
        <tr><td style="height:7px;line-height:7px;font-size:0;background:${accent};">&nbsp;</td></tr>

        <!-- Membrete: logo + insignia del tipo + fecha -->
        <tr><td class="pad" style="padding:22px 34px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;">
              <img src="${LOGO}" alt="Tuterritorio" height="44" style="height:44px;width:auto;display:block;border:0;">
            </td>
            <td style="vertical-align:middle;text-align:right;">
              <span style="display:inline-block;background:${accent};color:#ffffff;font-size:11.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:6px 13px;border-radius:999px;">${icon}${opts.badge}</span>
              <div style="color:${C.grayL};font-size:12px;margin-top:7px;">${ENTIDAD} · ${fecha}</div>
            </td>
          </tr></table>
        </td></tr>

        <!-- Cuerpo -->
        <tr><td class="pad" style="padding:8px 34px 30px;border-top:1px solid ${C.line};">
          <h1 style="margin:18px 0 4px;color:${C.navy};font-size:21px;font-weight:700;line-height:1.3;">${opts.titulo}</h1>
          <p style="margin:0 0 22px;color:${C.gray};font-size:14.5px;line-height:1.65;">${opts.intro}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filasHtml(opts.filas)}</table>

          ${bloques}
          ${cta}
        </td></tr>

        <!-- Pie institucional -->
        <tr><td class="pad" style="background:${C.soft};padding:20px 34px;border-top:1px solid ${C.line};">
          <div style="color:${C.navy2};font-size:13px;font-weight:700;">Tuterritorio <span style="color:${C.gray};font-weight:400;">— ${ENTIDAD}</span></div>
          <div style="color:${C.gray};font-size:12px;line-height:1.6;margin-top:3px;">Calle 16 #9-48, Edificio Caja Agraria · Oficina 1301 · Valledupar, Cesar · NIT 901996731-8</div>
          ${consent ? `<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>${consent}` : ""}
          ${notaPie}
        </td></tr>

      </table>
      <div style="color:${C.grayL};font-size:11px;margin-top:14px;font-family:${FONT};">Tuterritorio — ${ENTIDAD} · ${SITE.replace("https://", "")}</div>
    </td></tr>
  </table>
</body></html>`;
}
