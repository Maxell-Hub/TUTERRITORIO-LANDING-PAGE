import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { listarPqrsd, actualizarEstado, isDbConfigured, ESTADOS, type Estado } from "@/lib/pqrsd";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

/** Lista las PQRSD (panel de administrador). */
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!isDbConfigured) {
    return NextResponse.json({ configurada: false, pqrsd: [] });
  }
  try {
    const pqrsd = await listarPqrsd();
    return NextResponse.json({ configurada: true, pqrsd });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error al leer" }, { status: 500 });
  }
}

/** Actualiza el estado (y opcionalmente registra una respuesta) de una PQRSD. */
export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!isDbConfigured) return NextResponse.json({ error: "Base de datos no conectada" }, { status: 400 });

  let body: { id?: number; estado?: string; respuesta?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = Number(body.id);
  const estado = body.estado as Estado;
  if (!id || !ESTADOS.includes(estado)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 422 });
  }

  try {
    const row = await actualizarEstado(id, estado, body.respuesta?.trim() || null, session.user);
    if (!row) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    return NextResponse.json({ ok: true, pqrsd: row });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error al actualizar" }, { status: 500 });
  }
}
