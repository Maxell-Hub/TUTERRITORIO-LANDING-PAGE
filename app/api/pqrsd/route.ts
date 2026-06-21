import { NextResponse } from "next/server";

/**
 * Endpoint propio para radicar PQRSD (reemplaza el FormSubmit del prototipo).
 * Aquí va: validación en servidor + anti-spam (honeypot) + (pendiente) rate-limit
 * y envío de correo real a la entidad. Mantiene el backend bajo nuestro control.
 *
 * TODO (producción):
 *  - Rate limiting por IP (Cloudflare + @upstash/ratelimit).
 *  - Envío de correo (Nodemailer/Resend) y/o radicación en el sistema documental.
 *  - Validación robusta con zod.
 */

const REQUIRED = ["tipo", "nombre", "tipoDocumento", "documento", "correo", "asunto", "descripcion", "autorizacion"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  // Anti-spam: honeypot relleno = bot.
  if (typeof body._honey === "string" && body._honey.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 }); // respuesta neutra
  }

  // Validación de obligatorios.
  const faltantes = REQUIRED.filter((k) => {
    const v = body[k];
    return v === undefined || v === null || String(v).trim() === "";
  });
  if (faltantes.length) {
    return NextResponse.json(
      { ok: false, error: `Faltan campos obligatorios: ${faltantes.join(", ")}` },
      { status: 422 }
    );
  }

  // Validación de correo.
  const correo = String(body.correo);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return NextResponse.json({ ok: false, error: "Correo inválido" }, { status: 422 });
  }

  // TODO: aquí se enviaría el correo / se radicaría en el sistema documental.
  // Por ahora registramos en el log del servidor (visible en la terminal de dev).
  console.log("[PQRSD] Nueva radicación:", {
    tipo: body.tipo, nombre: body.nombre, correo, asunto: body.asunto,
  });

  return NextResponse.json({ ok: true, radicado: `TT-${Date.now()}` }, { status: 200 });
}
