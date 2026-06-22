import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

/**
 * Respaldo de subida para entornos con disco escribible (desarrollo local o
 * servidor Node propio). Guarda el archivo en public/uploads y devuelve su ruta.
 * En Vercel (serverless) esto no funciona; ahí se usa /api/upload (Vercel Blob).
 */

const MAX_BYTES = 20 * 1024 * 1024;

function safeName(original: string): string {
  const ext = (original.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const base =
    original
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "archivo";
  return `${base}-${Date.now()}.${ext}`;
}

export async function POST(req: Request) {
  const store = await cookies();
  if (!verifyToken(store.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f && typeof f !== "string") file = f as File;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!file) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "El archivo no puede superar los 20 MB" }, { status: 400 });
  }

  try {
    const filename = safeName(file.name || "archivo.bin");
    const buf = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buf);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar el archivo. En producción conecta Vercel Blob." },
      { status: 500 }
    );
  }
}
