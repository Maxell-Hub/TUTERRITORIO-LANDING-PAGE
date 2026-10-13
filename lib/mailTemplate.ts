/**
 * Plantilla de los correos que la ciudadanía genera (PQRSD y contacto).
 *
 * Dirección de diseño: "carta institucional cálida", no tarjeta de dashboard.
 * - Tipografía Poppins (nombre/títulos) + Open Sans (cuerpo, humanista y legible).
 * - Neutros CÁLIDOS (papel sand) en vez del gris azulado frío.
 * - Nada de barra de acento sobre tarjeta redondeada, emojis-insignia ni pills:
 *   el tipo se distingue por una ETIQUETA tipografiada + una línea de acento y el
 *   color del botón. Un solo acento, usado con moderación.
 * Compatibilidad: tablas + estilos en línea; las fuentes cargan por @import para
 * los clientes que lo permiten y caen a stacks del sistema en el resto.
 * Los valores interpolados deben venir YA escapados por quien llama.
 */

const SITE = "https://www.tuterritorio.gov.co";
const LOGO = `${SITE}/assets/global/logo-tuterritorio-v.png`;
const ENTIDAD = "Operador Catastral de Valledupar";

// Neutros cálidos + marca.
const C = {
  paper: "#f1ece3",   // fondo alrededor de la carta (sand cálido)
  sheet: "#ffffff",   // la "hoja"
  ink: "#2b2721",     // tinta cálida casi negra
  soft: "#6f685c",    // texto secundario cálido
  faint: "#9a9488",   // etiquetas tenues
  line: "#ece6db",    // hairline cálido
  wash: "#faf7f2",    // tinte cálido para el bloque de mensaje
  navy: "#163A4C",    // wordmark
};

const H = "'Poppins','Segoe UI',Arial,sans-serif";       // títulos / nombre
const B = "'Open Sans','Segoe UI',Arial,Helvetica,sans-serif"; // cuerpo

export type Fila = { label: string; value: string; href?: string };
/** accent: un color hex ("#...") del tipo, o "green". */
export type Bloque = { label: string; html: string; accent?: string };

/** Identidad por TIPO (color de acento + etiqueta tipografiada). Sin emojis. */
export const TIPOS = {
  pqrsd: { color: "#B26B1E", badge: "PQRSD" },            // ámbar cálido
  contacto: { color: "#2F7E9E", badge: "Mensaje ciudadano" }, // azul
} as const;

export type EmailOpts = {
  preheader: string;
  /** Color de acento del tipo (hex). */
  accent: string;
  /** Etiqueta del tipo (p. ej. "PQRSD · Petición", "Mensaje ciudadano"). */
  badge: string;
  titulo: string;
  intro: string;
  fecha?: string;
  filas: Fila[];
  bloques?: Bloque[];
  cta?: { href: string; label: string };
  consentAt?: string;
  notaPie?: string;
};

function filasHtml(filas: Fila[]): string {
  return filas
    .map((f, i) => {
      const borde = i === filas.length - 1 ? "" : `border-bottom:1px solid ${C.line};`;
      const val = f.href
        ? `<a href="${f.href}" style="color:${C.ink};text-decoration:none;border-bottom:1px solid ${C.line};">${f.value}</a>`
        : f.value;
      return `<tr>
        <td style="padding:10px 0;${borde}color:${C.faint};font-size:13px;font-family:${B};width:132px;vertical-align:top;">${f.label}</td>
        <td style="padding:10px 0;${borde}color:${C.ink};font-size:14.5px;font-weight:600;font-family:${B};vertical-align:top;">${val}</td>
      </tr>`;
    })
    .join("");
}

function bloqueHtml(b: Bloque, accentDefault: string): string {
  const col = !b.accent ? accentDefault : b.accent === "green" ? "#4E8654" : b.accent;
  return `
    <div style="margin:26px 0 0;color:${C.faint};font-size:11.5px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;font-family:${B};">${b.label}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:9px;"><tr>
      <td style="width:3px;background:${col};font-size:0;line-height:0;">&nbsp;</td>
      <td style="background:${C.wash};padding:15px 18px;color:${C.ink};font-size:15px;line-height:1.72;font-family:${B};">${b.html}</td>
    </tr></table>`;
}

export function renderEmail(opts: EmailOpts): string {
  const accent = opts.accent;
  const fecha =
    opts.fecha ||
    new Date().toLocaleDateString("es-CO", { timeZone: "America/Bogota", day: "2-digit", month: "long", year: "numeric" });

  const bloques = (opts.bloques || []).map((b) => bloqueHtml(b, accent)).join("");

  const cta = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px 0 4px;"><tr>
        <td style="border-radius:8px;background:${accent};">
          <a href="${opts.cta.href}" style="display:inline-block;padding:13px 28px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14.5px;font-family:${B};">${opts.cta.label}</a>
        </td>
      </tr></table>`
    : "";

  const consent = opts.consentAt
    ? `<p style="margin:14px 0 0;color:${C.faint};font-size:12px;line-height:1.6;font-family:${B};">Autorización de tratamiento de datos: sí (vía web) · Consentimiento registrado el ${opts.consentAt}</p>`
    : "";

  const notaPie = opts.notaPie
    ? `<p style="margin:4px 0 0;color:${C.faint};font-size:12px;line-height:1.6;font-family:${B};">${opts.notaPie}</p>`
    : "";

  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Open+Sans:wght@400;600;700&display=swap');
  body,table,td,a,p,div,span,h1 { font-family:${B}; }
  a { text-decoration:none; }
  @media (max-width:620px){ .sheet{width:100%!important;} .pad{padding-left:26px!important;padding-right:26px!important;} }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};">
    <tr><td align="center" style="padding:34px 14px 40px;">
      <table role="presentation" class="sheet" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.sheet};border:1px solid ${C.line};border-radius:10px;">

        <!-- Membrete: logo + etiqueta del tipo -->
        <tr><td class="pad" style="padding:30px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;">
              <img src="${LOGO}" alt="Tuterritorio" height="42" style="height:42px;width:auto;display:block;border:0;">
            </td>
            <td style="vertical-align:middle;text-align:right;">
              <div style="color:${accent};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;font-family:${H};">${opts.badge}</div>
              <div style="color:${C.faint};font-size:12px;margin-top:4px;font-family:${B};">${fecha}</div>
            </td>
          </tr></table>
        </td></tr>

        <!-- Regla del membrete -->
        <tr><td class="pad" style="padding:18px 40px 0;">
          <div style="height:1px;background:${C.line};font-size:0;line-height:0;">&nbsp;</div>
        </td></tr>

        <!-- Cuerpo -->
        <tr><td class="pad" style="padding:24px 40px 34px;">
          <h1 style="margin:0;color:${C.ink};font-size:23px;font-weight:700;line-height:1.3;font-family:${H};">${opts.titulo}</h1>
          <div style="width:34px;height:3px;background:${accent};margin:12px 0 0;border-radius:2px;font-size:0;line-height:0;">&nbsp;</div>
          <p style="margin:16px 0 24px;color:${C.soft};font-size:15px;line-height:1.7;font-family:${B};">${opts.intro}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filasHtml(opts.filas)}</table>

          ${bloques}
          ${cta}
        </td></tr>

        <!-- Pie institucional -->
        <tr><td class="pad" style="padding:22px 40px 30px;border-top:1px solid ${C.line};">
          <div style="color:${C.navy};font-size:15px;font-weight:600;font-family:${H};">Tuterritorio</div>
          <div style="color:${C.soft};font-size:13px;margin-top:2px;font-family:${B};">${ENTIDAD}</div>
          <div style="color:${C.faint};font-size:12.5px;line-height:1.6;margin-top:8px;font-family:${B};">Calle 16 #9-48, Edificio Caja Agraria · Oficina 1301 · Valledupar, Cesar · NIT 901996731-8</div>
          ${consent}
          ${notaPie}
        </td></tr>

      </table>
      <div style="color:${C.faint};font-size:11.5px;margin-top:16px;font-family:${B};">Tuterritorio · ${SITE.replace("https://", "")}</div>
    </td></tr>
  </table>
</body></html>`;
}
