import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeContent, isBlobConfigured } from "@/lib/store";
import { defaultFor } from "@/lib/content";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

/**
 * Mantenimiento (solo administrador): resincroniza el contenido del Blob con el
 * contenido ACTUAL del código (defaultFor). Se usa cuando el Blob quedó con
 * contenido viejo (p. ej. al reconectar el Blob y quedar noticias antiguas).
 *
 * Uso, estando logueado como admin, en el navegador:
 *   /api/admin/resync?key=noticias      → resincroniza solo noticias
 *   /api/admin/resync?key=all           → resincroniza todo el contenido
 *
 * Escribe SIEMPRE el contenido del código, así que es seguro: deja producción
 * igual a lo que está publicado en el repositorio.
 */
const KEYS = ["noticias", "equipo", "normativas", "glosario", "faq", "tramites", "overrides"];

export async function GET(req: Request) {
  const store = await cookies();
  if (!verifyToken(store.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado. Inicia sesión como administrador." }, { status: 401 });
  }
  if (!isBlobConfigured) {
    return NextResponse.json({ error: "El Blob no está conectado en este despliegue." }, { status: 400 });
  }

  const key = new URL(req.url).searchParams.get("key") || "";
  const targets = key === "all" ? KEYS : KEYS.includes(key) ? [key] : [];
  if (targets.length === 0) {
    return NextResponse.json(
      { error: `Falta ?key=. Válidos: ${KEYS.join(", ")} o all.` },
      { status: 400 }
    );
  }

  const done: string[] = [];
  const failed: Record<string, string> = {};
  for (const k of targets) {
    try {
      await writeContent(k, defaultFor(k));
      done.push(k);
    } catch (err) {
      failed[k] = err instanceof Error ? err.message : String(err);
    }
  }
  return NextResponse.json({
    ok: Object.keys(failed).length === 0,
    resincronizado: done,
    ...(Object.keys(failed).length ? { fallidos: failed } : {}),
    nota: "Producción quedó igual al contenido del código. Recarga las páginas para verlo.",
  });
}
