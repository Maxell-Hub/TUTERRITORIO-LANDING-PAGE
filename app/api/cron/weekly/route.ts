import { NextResponse } from "next/server";
import { verifyCron } from "@/lib/cronAuth";
import { sendReport, reportLayout } from "@/lib/reportMail";
import { readContent } from "@/lib/store";
import { defaultFor } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const SITE = "https://www.tuterritorio.gov.co";
const CLAVES = ["noticias", "equipo", "normativas", "glosario", "faq", "tramites", "overrides"];

/** Extrae los enlaces http(s) de un HTML. */
function extraerEnlaces(html: string): string[] {
  const out = new Set<string>();
  const re = /href="(https?:\/\/[^"]+|\/[^"]+\.(?:pdf|docx?|xlsx?))"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    let url = m[1];
    if (url.startsWith("/")) url = SITE + url;
    // Solo revisamos externos y documentos (los internos ya se sirven prerenderizados).
    if (!url.startsWith(SITE) || /\.(pdf|docx?|xlsx?)$/i.test(url)) out.add(url.split("#")[0]);
  }
  return [...out];
}

/** Verifica un enlace (HEAD, con respaldo GET). Devuelve el estado o 0. */
async function checar(url: string): Promise<number> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    return res.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(t);
  }
}

export async function GET(req: Request) {
  if (!verifyCron(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // 1) Enlaces rotos: recolecta enlaces externos/documentos de las páginas del sitemap.
  const paginas = [
    "/", "/nosotros", "/nosotros/equipo", "/servicios", "/pqrsd", "/contactos",
    "/atencion-ciudadania", "/preguntas-frecuentes", "/noticias", "/recursos/normativas",
    "/recursos/glosario", "/transparencia", "/transparencia/informacion-entidad",
    "/transparencia/normativa", "/transparencia/tramites", "/transparencia/datos-abiertos",
    "/transparencia/grupos-interes", "/transparencia/reporte-informacion",
    "/transparencia/proteccion-datos", "/transparencia/participa",
  ];
  const enlaces = new Set<string>();
  await Promise.all(
    paginas.map(async (p) => {
      try {
        const html = await (await fetch(`${SITE}${p}`)).text();
        for (const e of extraerEnlaces(html)) enlaces.add(e);
      } catch { /* ignora */ }
    })
  );

  const lista = [...enlaces].slice(0, 200);
  const resultados = await Promise.all(lista.map(async (u) => ({ url: u, status: await checar(u) })));
  const rotos = resultados.filter((r) => r.status === 0 || r.status >= 400);

  const enlacesHtml = rotos.length
    ? `<p style="color:#D83744;"><b>${rotos.length} enlace(s) con problema</b> (de ${lista.length} revisados):</p><ul>${rotos
        .map((r) => `<li>${r.url} → ${r.status === 0 ? "sin respuesta/timeout" : "HTTP " + r.status}</li>`)
        .join("")}</ul>`
    : `<p style="color:#4E8654;"><b>✓ Todos los ${lista.length} enlaces externos/documentos responden bien.</b></p>`;

  // 2) Respaldo del contenido editable (noticias, equipo, textos…).
  const respaldo: Record<string, unknown> = { generado: new Date().toISOString() };
  for (const k of CLAVES) {
    try {
      respaldo[k] = await readContent(k, defaultFor(k));
    } catch {
      respaldo[k] = null;
    }
  }
  const fecha = new Date().toISOString().slice(0, 10);
  const adjunto = Buffer.from(JSON.stringify(respaldo, null, 2), "utf-8");

  const cuerpo =
    `<h3 style="margin:0 0 8px;color:#163A4C;">Enlaces del sitio</h3>${enlacesHtml}` +
    `<hr style="border:none;border-top:1px solid #eef1f3;margin:18px 0;">` +
    `<h3 style="margin:0 0 8px;color:#163A4C;">Respaldo del contenido</h3>` +
    `<p>Se adjunta una copia del contenido editable (noticias, equipo, textos, normativas, glosario, FAQ y trámites) a la fecha.</p>`;

  await sendReport(
    `Reporte semanal del sitio — ${fecha}`,
    reportLayout("Reporte semanal del sitio", cuerpo),
    [{ filename: `respaldo-contenido-${fecha}.json`, content: adjunto }]
  );

  return NextResponse.json({
    ok: true,
    enlacesRevisados: lista.length,
    enlacesRotos: rotos.length,
    respaldoBytes: adjunto.length,
  });
}
