import { NextResponse } from "next/server";
import tls from "node:tls";
import net from "node:net";
import { verifyCron } from "@/lib/cronAuth";
import { sendReport, reportLayout } from "@/lib/reportMail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const SITE = "https://www.tuterritorio.gov.co";
const HOST = "www.tuterritorio.gov.co";

// Páginas clave que deben responder 200.
const PAGINAS = ["/", "/servicios", "/pqrsd", "/contactos", "/transparencia", "/nosotros/equipo", "/noticias"];

// Umbral de aviso para el certificado SSL (días).
const SSL_AVISO_DIAS = 21;
// Umbral de aviso para el vencimiento del dominio (días).
const DOMINIO_AVISO_DIAS = 45;

/** Días para que venza el dominio (WHOIS, best-effort; puede no aplicar a .gov.co). */
function diasDominio(): Promise<number | null> {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "whois.nic.co", port: 43, timeout: 8000 });
    let data = "";
    socket.on("connect", () => socket.write("tuterritorio.gov.co\r\n"));
    socket.on("data", (d) => (data += d.toString()));
    socket.on("end", () => {
      const m =
        data.match(/Registry Expiry Date:\s*([0-9T:.\-Z]+)/i) ||
        data.match(/Expir\w+ Date:\s*([0-9T:.\-Z/]+)/i);
      if (!m) return resolve(null);
      const dias = Math.floor((new Date(m[1]).getTime() - Date.now()) / 86_400_000);
      resolve(Number.isNaN(dias) ? null : dias);
    });
    socket.on("error", () => resolve(null));
    socket.on("timeout", () => { socket.destroy(); resolve(null); });
  });
}

async function checarPagina(path: string): Promise<{ path: string; ok: boolean; status: number }> {
  try {
    const res = await fetch(`${SITE}${path}?cron=${Date.now()}`, { redirect: "manual" });
    return { path, ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch {
    return { path, ok: false, status: 0 };
  }
}

/** Días que faltan para que venza el certificado SSL del sitio. */
function diasSSL(): Promise<number | null> {
  return new Promise((resolve) => {
    const socket = tls.connect({ host: HOST, port: 443, servername: HOST, timeout: 8000 }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert || !cert.valid_to) return resolve(null);
      const dias = Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / 86_400_000);
      resolve(dias);
    });
    socket.on("error", () => resolve(null));
    socket.on("timeout", () => { socket.destroy(); resolve(null); });
  });
}

export async function GET(req: Request) {
  if (!verifyCron(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const paginas = await Promise.all(PAGINAS.map(checarPagina));
  const caidas = paginas.filter((p) => !p.ok);
  const [ssl, dominio] = await Promise.all([diasSSL(), diasDominio()]);

  const problemas: string[] = [];
  if (caidas.length) {
    problemas.push(
      `<p style="color:#D83744;"><b>Páginas con problema:</b></p><ul>${caidas
        .map((c) => `<li>${c.path} → HTTP ${c.status || "sin respuesta"}</li>`)
        .join("")}</ul>`
    );
  }
  if (ssl !== null && ssl <= SSL_AVISO_DIAS) {
    problemas.push(`<p style="color:#E7A32E;"><b>El certificado SSL vence en ${ssl} días.</b> Revisa la renovación en Cloudflare/Vercel.</p>`);
  }
  if (dominio !== null && dominio <= DOMINIO_AVISO_DIAS) {
    problemas.push(`<p style="color:#E7A32E;"><b>El dominio vence en ${dominio} días.</b> Gestiona la renovación con el registrador.</p>`);
  }

  // Solo se envía correo si hay algo que reportar (evita ruido diario).
  if (problemas.length) {
    await sendReport(
      "⚠️ Chequeo diario del sitio — atención requerida",
      reportLayout("Chequeo diario del sitio", problemas.join(""))
    );
  }

  return NextResponse.json({
    ok: true,
    paginasRevisadas: paginas.length,
    caidas: caidas.map((c) => c.path),
    sslDias: ssl,
    dominioDias: dominio,
    correoEnviado: problemas.length > 0,
  });
}
