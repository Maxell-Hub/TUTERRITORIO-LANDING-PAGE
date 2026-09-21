import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import { verifyCron } from "@/lib/cronAuth";
import { sendReport, reportLayout, resumen, seccion, nota, listaItems } from "@/lib/reportMail";
import { readContent, isBlobConfigured } from "@/lib/store";
import { defaultFor } from "@/lib/content";
import { kv } from "@/lib/kv";
import { sql, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const SITE = "https://www.tuterritorio.gov.co";
const CLAVES = ["noticias", "equipo", "normativas", "glosario", "faq", "tramites", "overrides"];
// User-Agent de navegador real: sin esto, varios sitios de gobierno (funcionpublica,
// supernotariado…) rechazan las peticiones automáticas y daban falsos positivos.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

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

// Errores de certificado SSL: significan que el servidor RESPONDIÓ (presentó un
// cert), solo que Node no puede verificar la cadena. NO es un enlace roto — los
// navegadores lo abren bien. Se marcan como accesibles (-1).
const CERT_CODES = new Set([
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "CERT_HAS_EXPIRED",
  "ERR_TLS_CERT_ALTNAME_INVALID",
]);

/**
 * Verifica un enlace. Usa User-Agent de navegador; prueba HEAD y luego GET
 * (parcial). 2xx/3xx = OK. Errores de certificado = accesible (-1). Devuelve el
 * estado, -1 si el cert no se pudo verificar (accesible), o 0 si no respondió.
 *
 * Clave: `redirect: "manual"`. Un 3xx YA significa que el enlace vive; seguir la
 * redirección lleva a URLs de sesión (p. ej. los ORDS de impuesto predial) que se
 * cuelgan y daban falsos "roto". Con manual, el 302 se cuenta como OK sin seguirlo.
 */
async function checar(url: string): Promise<number> {
  const intentos: RequestInit[] = [
    { method: "HEAD" },
    { method: "GET", headers: { Range: "bytes=0-2047" } },
  ];
  for (const opts of intentos) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 13000);
    try {
      const res = await fetch(url, {
        ...opts,
        redirect: "manual",
        signal: ctrl.signal,
        headers: { "user-agent": UA, accept: "*/*", ...(opts.headers || {}) },
      });
      clearTimeout(t);
      if (res.status < 400) return res.status; // 2xx/3xx = OK (vive)
      if (opts.method === "GET") return res.status; // 4xx/5xx real tras GET
      // si HEAD dio 4xx/5xx, se intenta GET (muchos sitios rechazan HEAD)
    } catch (e) {
      clearTimeout(t);
      const code = (e as { cause?: { code?: string } })?.cause?.code;
      if (code && CERT_CODES.has(code)) return -1; // cert no verificable = accesible
      // otro error de red con este método: se intenta el siguiente
    }
  }
  return 0;
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
        const html = await (await fetch(`${SITE}${p}`, { headers: { "user-agent": UA } })).text();
        for (const e of extraerEnlaces(html)) enlaces.add(e);
      } catch { /* ignora */ }
    })
  );

  const lista = [...enlaces].slice(0, 200);
  const resultados = await Promise.all(lista.map(async (u) => ({ url: u, status: await checar(u) })));
  const rotos = resultados.filter((r) => r.status === 0 || r.status >= 400);

  const enlacesHtml = rotos.length
    ? nota(`<b>${rotos.length} enlace(s) con problema</b> de ${lista.length} revisados:`, "alert") +
      listaItems(rotos.map((r) => `${r.url} &rarr; ${r.status === 0 ? "sin respuesta / timeout" : "HTTP " + r.status}`))
    : nota(`<b>✓ Los ${lista.length} enlaces externos y documentos responden bien.</b>`, "ok");

  // 2) Detección de cambios en documentos oficiales (PDFs/docs): compara
  //    tamaño y fecha con la última vez y avisa si cambiaron.
  const docs = lista.filter((u) => /\.(pdf|docx?|xlsx?)$/i.test(u));
  const cambios: string[] = [];
  if (kv) {
    for (const u of docs) {
      try {
        const res = await fetch(u, { method: "HEAD", redirect: "follow", headers: { "user-agent": UA } });
        const firma = `${res.headers.get("content-length") || "?"}|${res.headers.get("last-modified") || "?"}`;
        const prev = await kv.get<string>(`doc:${u}`);
        if (prev && prev !== firma) cambios.push(u);
        await kv.set(`doc:${u}`, firma);
      } catch { /* ignora */ }
    }
  }
  const cambiosHtml = cambios.length
    ? nota(`<b>${cambios.length} documento(s) cambiaron</b> desde la última revisión:`, "warn") +
      listaItems(cambios)
    : nota(`<b>✓ Ningún documento oficial cambió.</b>`, "ok");

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

  // Tono global del reporte: rojo si hay enlaces rotos, ámbar si cambió algún
  //   documento, verde si todo está bien.
  const tono: "ok" | "warn" | "alert" = rotos.length ? "alert" : cambios.length ? "warn" : "ok";
  const fechaLarga = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  const tarjetas = resumen([
    { etiqueta: "Enlaces OK", valor: `${lista.length - rotos.length}/${lista.length}`, tono: rotos.length ? "alert" : "ok" },
    { etiqueta: "Docs. cambiados", valor: `${cambios.length}`, tono: cambios.length ? "warn" : "ok" },
    { etiqueta: "Respaldo", valor: backupUrl ? "Guardado" : "Adjunto", tono: "ok" },
    { etiqueta: "Adjuntos huérfanos", valor: `${huerfanos}`, tono: huerfanos ? "warn" : "ok" },
  ]);

  const cuerpo =
    `<p style="margin:0 0 4px;color:#6b7a83;font-size:13.5px;">Resumen de la revisión automática de esta semana:</p>` +
    tarjetas +
    seccion("Enlaces externos y documentos", rotos.length ? "alert" : "ok") + enlacesHtml +
    seccion("Cambios en documentos oficiales", cambios.length ? "warn" : "ok") + cambiosHtml +
    seccion("Respaldo del contenido", "ok") +
    nota(`Se adjunta la copia del contenido editable (noticias, equipo, textos…)${backupUrl ? ". También quedó guardada, versionada, en el almacenamiento del sitio." : "."}`, "ok") +
    (huerfanos
      ? seccion("Mantenimiento", "warn") +
        nota(`Hay <b>${huerfanos}</b> adjunto(s) huérfano(s) en el almacenamiento (archivos de PQRSD que ya ningún registro referencia). Se pueden limpiar cuando quieras.`, "warn")
      : "");

  await sendReport(
    `Reporte semanal del sitio — ${fecha}`,
    reportLayout("Reporte semanal del sitio", cuerpo, {
      subtitulo: "Revisión automática de enlaces, documentos y respaldo",
      fecha: fechaLarga,
      tono,
      preheader: rotos.length
        ? `${rotos.length} enlace(s) requieren revisión`
        : cambios.length
        ? `${cambios.length} documento(s) oficiales cambiaron`
        : "Todo en orden esta semana",
    }),
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
