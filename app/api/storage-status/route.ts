import { NextResponse } from "next/server";
import { isBlobConfigured, isServerless } from "@/lib/store";

/**
 * Diagnóstico de almacenamiento (sin exponer secretos).
 * Abre /api/storage-status en el navegador para saber si el despliegue actual
 * tiene conectado el Blob (BLOB_READ_WRITE_TOKEN presente) y si corre en Vercel.
 */
export async function GET() {
  return NextResponse.json({
    isServerless,
    isBlobConfigured,
    persistencia: isBlobConfigured
      ? "Vercel Blob (los cambios se guardan y persisten)"
      : isServerless
      ? "Archivos /data en Vercel (SOLO LECTURA → guardar fallará). Conecta el Blob y haz Redeploy."
      : "Archivos /data locales (ok en desarrollo)",
  });
}
