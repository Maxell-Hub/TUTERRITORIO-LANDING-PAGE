import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

/**
 * Prueba (solo administrador): envía un error de ejemplo a Sentry para confirmar
 * que la integración funciona. Debe aparecer en el panel de Sentry → Issues.
 */
export async function GET() {
  const store = await cookies();
  if (!verifyToken(store.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return NextResponse.json(
      { ok: false, error: "No hay DSN de Sentry en este despliegue (¿falta conectar o Redeploy?)." },
      { status: 400 }
    );
  }

  const id = Sentry.captureException(
    new Error("Prueba de Sentry (intencional) — " + new Date().toISOString())
  );
  await Sentry.flush(2500);

  return NextResponse.json({
    ok: true,
    eventId: id,
    mensaje: "Error de prueba enviado. Revisa Sentry → Issues (puede tardar ~1 min en aparecer).",
  });
}
