import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readContent, writeContent, KEY_RE, isBlobConfigured, isServerless } from "@/lib/store";
import { defaultFor } from "@/lib/content";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

type Ctx = { params: Promise<{ key: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { key } = await params;
  if (!KEY_RE.test(key)) {
    return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
  }
  const data = await readContent(key, defaultFor(key));
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { key } = await params;
  if (!KEY_RE.test(key)) {
    return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
  }

  const store = await cookies();
  const session = verifyToken(store.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    await writeContent(key, body);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[content] Error al guardar:", key, detail);

    // Diagnóstico claro según el entorno:
    let error: string;
    if (isServerless && !isBlobConfigured) {
      // En Vercel pero sin token de Blob en ESTE despliegue (no se conectó o falta Redeploy).
      error =
        "El almacenamiento Blob no está conectado a este despliegue. En Vercel: Storage → conecta el Blob al proyecto, asegúrate de que la variable BLOB_READ_WRITE_TOKEN esté en el entorno de Producción y haz un nuevo Deploy (Redeploy).";
    } else {
      // Blob configurado u otro entorno: mostramos la causa real.
      error = `No se pudo guardar: ${detail}`;
    }
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
