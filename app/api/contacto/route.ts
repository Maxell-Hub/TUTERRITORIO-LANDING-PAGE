import { NextResponse } from "next/server";

/**
 * Endpoint de contacto (reemplaza el mailto del prototipo).
 * Valida en servidor + anti-spam (honeypot). En producción: rate-limit (Cloudflare +
 * @upstash/ratelimit) y envío de correo real a contactenos@tuterritorio.gov.co.
 */
const REQUIRED = ["nombre", "correo", "mensaje", "autorizacion"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

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

  // TODO (producción): enviar correo a contactenos@tuterritorio.gov.co.
  console.log("[CONTACTO] Nuevo mensaje:", { nombre: body.nombre, correo: body.correo });

  return NextResponse.json({ ok: true, radicado: `CT-${Date.now()}` }, { status: 200 });
}
