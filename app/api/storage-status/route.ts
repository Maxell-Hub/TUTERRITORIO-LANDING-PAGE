import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isBlobConfigured, isServerless } from "@/lib/store";
import { rateLimitStatus } from "@/lib/rateLimit";
import { isDbConfigured } from "@/lib/db";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

/**
 * Diagnóstico de almacenamiento (sin secretos). Solo para administradores:
 * evita exponer detalles de la infraestructura a cualquier visitante.
 */
export async function GET() {
  const store = await cookies();
  if (!verifyToken(store.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const rl = await rateLimitStatus();
  // Nombres (NO valores) de variables de entorno relacionadas con Redis/Upstash/KV,
  // para diagnosticar por qué no se detecta la conexión. Es seguro: solo nombres.
  const envKeys = Object.keys(process.env)
    .filter((k) => /UPSTASH|REDIS|KV_|SENTRY|TURNSTILE|DATABASE|POSTGRES|NEON/i.test(k))
    .sort();
  return NextResponse.json({
    isServerless,
    isBlobConfigured,
    persistencia: isBlobConfigured
      ? "Vercel Blob (los cambios se guardan y persisten)"
      : isServerless
      ? "Archivos /data en Vercel (SOLO LECTURA → guardar fallará). Conecta el Blob y haz Redeploy."
      : "Archivos /data locales (ok en desarrollo)",
    rateLimit: rl,
    baseDatos: isDbConfigured ? "Neon Postgres (conectada) — seguimiento de PQRSD activo" : "No conectada (el seguimiento de PQRSD queda inactivo)",
    variablesDetectadas: envKeys.length ? envKeys : "(ninguna variable de servicios en Production)",
  });
}
