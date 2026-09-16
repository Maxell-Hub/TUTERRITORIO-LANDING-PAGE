import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import { verifyCron } from "@/lib/cronAuth";
import { sendReport, reportLayout } from "@/lib/reportMail";
import { readContent, isBlobConfigured } from "@/lib/store";
import { defaultFor } from "@/lib/content";
import { kv } from "@/lib/kv";
import { sql, isDbConfigured } from "@/lib/db";

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

  // 2) Detección de cambios en documentos oficiales (PDFs/docs): compara
  //    tamaño y fecha con la última vez y avisa si cambiaron.
  const docs = lista.filter((u) => /\.(pdf|docx?|xlsx?)$/i.test(u));
  const cambios: string[] = [];
  if (kv) {
    for (const u of docs) {
      try {
        const res = await fetch(u, { method: "HEAD", redirect: "follow" });
        const firma = `${res.headers.get("content-length") || "?"}|${res.headers.get("last-modified") || "?"}`;
        const prev = await kv.get<string>(`doc:${u}`);
        if (prev && prev !== firma) cambios.push(u);
        await kv.set(`doc:${u}`, firma);
      } catch { /* ignora */ }
    }
  }
  const cambiosHtml = cambios.length
    ? `<p style="color:#E7A32E;"><b>${cambios.length} documento(s) cambiaron</b> desde la última revisión:</p><ul>${cambios.map((u) => `<li>${u}</li>`).join("")}</ul>`
    : `<p style="color:#4E8654;"><b>✓ Ningún documento oficial cambió.</b></p>`;

  // 3) Respaldo del contenido editable (noticias, equipo, textos…).
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

  // 3b) Guarda el respaldo VERSIONADO en el Blob (conserva los últimos 12).
  let backupUrl: string | null = null;
  if (isBlobConfigured) {
    try {
      const r = await put(`backups/respaldo-${fecha}.json`, adjunto, {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });
      backupUrl = r.url;
      const { blobs } = await list({ prefix: "backups/respaldo-" });
      const viejos = blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1)).slice(12);
      for (const b of viejos) await del(b.url);
    } catch (e) {
      console.error("[cron] Error al versionar respaldo en Blob:", e);
    }
  }

  // 4) Reporte de adjuntos huérfanos en el Blob (archivos de PQRSD que ya no
  //    referencia ningún registro). Solo REPORTA, no borra.
  let huerfanos = 0;
  if (isBlobConfigured && isDbConfigured && sql) {
    try {
      const { blobs } = await list({ prefix: "pqrsd/" });
      const rows = (await sql`SELECT adjuntos FROM pqrsd`) as { adjuntos: { url: string }[] }[];
      const usados = new Set<string>();
      for (const row of rows) for (const a of row.adjuntos || []) usados.add(a.url);
      huerfanos = blobs.filter((b) => !usados.has(b.url)).length;
    } catch (e) {
      console.error("[cron] Error al revisar adjuntos huérfanos:", e);
    }
  }

  const cuerpo =
    `<h3 style="margin:0 0 8px;color:#163A4C;">Enlaces del sitio</h3>${enlacesHtml}` +
    `<hr style="border:none;border-top:1px solid #eef1f3;margin:18px 0;">` +
    `<h3 style="margin:0 0 8px;color:#163A4C;">Documentos oficiales</h3>${cambiosHtml}` +
    `<hr style="border:none;border-top:1px solid #eef1f3;margin:18px 0;">` +
    `<h3 style="margin:0 0 8px;color:#163A4C;">Respaldo del contenido</h3>` +
    `<p>Se adjunta la copia del contenido editable${backupUrl ? " (también guardada versionada en el almacenamiento)" : ""}.</p>` +
    (huerfanos ? `<p style="color:#5b6b74;">Adjuntos huérfanos en el almacenamiento: <b>${huerfanos}</b> (archivos de PQRSD ya sin referencia; se pueden limpiar).</p>` : "");

  await sendReport(
    `Reporte semanal del sitio — ${fecha}`,
    reportLayout("Reporte semanal del sitio", cuerpo),
    [{ filename: `respaldo-contenido-${fecha}.json`, content: adjunto }]
  );

  return NextResponse.json({
    ok: true,
    enlacesRevisados: lista.length,
    enlacesRotos: rotos.length,
    documentosCambiados: cambios.length,
    respaldoBytes: adjunto.length,
    respaldoVersionado: !!backupUrl,
    adjuntosHuerfanos: huerfanos,
  });
}
