import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function safeName(original: string): string {
  const ext = (original.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const base =
    original
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // quita acentos
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "imagen";
  return `${base}-${Date.now()}.${ext}`;
}

export async function POST(req: Request) {
  // Solo administradores autenticados pueden subir imágenes.
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

  if (!file) {
    return NextResponse.json({ error: "No se recibió ninguna imagen" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen no puede superar los 8 MB" }, { status: 400 });
  }

  const filename = safeName(file.name || "imagen.jpg");
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  // Producción (Vercel): subir a Vercel Blob.
  if (token) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`noticias/${filename}`, file, {
      access: "public",
      contentType: file.type,
      token,
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local / servidor Node: guardar en public/uploads.
  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buf);
  return NextResponse.json({ url: `/uploads/${filename}` });
}
