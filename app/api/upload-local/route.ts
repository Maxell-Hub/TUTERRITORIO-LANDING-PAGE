import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { isBlobConfigured } from "@/lib/store";

/**
 * Subida de archivos del panel (imágenes de noticias/equipo).
 *
 * - En Vercel / con el store de Blob conectado (BLOB_STORE_ID o
 *   BLOB_READ_WRITE_TOKEN): sube con `put()` del SDK, el MISMO mecanismo que
 *   ya persiste el contenido editable. Funciona con el modelo nuevo de store
 *   conectado, que solo expone BLOB_STORE_ID (no hace falta el token de subida
 *   directa que exige /api/upload).
 * - En local / servidor Node con disco escribible (sin Blob): guarda el archivo
 *   en public/uploads y devuelve su ruta.
 *
 * Nota: al pasar por la función serverless, el cuerpo está limitado a ~4.5 MB
 * en Vercel. Para imágenes de la web es suficiente; para archivos mayores se
 * usaría la subida directa (/api/upload), que requiere BLOB_READ_WRITE_TOKEN.
 */

const MAX_BYTES = 20 * 1024 * 1024;

// Solo se aceptan los mismos formatos que la ruta de Vercel Blob (/api/upload).
// Evita subir HTML/SVG/JS que se servirían desde el propio origen (XSS almacenado).
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "pdf"]);
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "application/pdf",
]);

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

  // Allowlist de formato: extensión y tipo MIME declarado deben estar permitidos.
  const ext = (file.name?.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!ALLOWED_EXT.has(ext) || !ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Formatos aceptados: JPG, PNG, WebP, GIF, AVIF o PDF." },
      { status: 415 }
    );
  }

  const filename = safeName(file.name || "archivo.bin");

  // 1) Con Blob conectado (Vercel): sube con put() — mismo mecanismo que el contenido.
  if (isBlobConfigured) {
    try {
      const buf = Buffer.from(await file.arrayBuffer());
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      const blob = await put(`uploads/${filename}`, buf, {
        access: "public",
        contentType: file.type || undefined,
        addRandomSuffix: true,
        ...(token ? { token } : {}),
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error("[upload] Error al subir a Blob:", detail);
      return NextResponse.json(
        { error: "No se pudo subir la imagen al almacenamiento. Intenta de nuevo." },
        { status: 502 }
      );
    }
  }

  // 2) Sin Blob (local / servidor Node con disco escribible): guarda en public/uploads.
  try {
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
