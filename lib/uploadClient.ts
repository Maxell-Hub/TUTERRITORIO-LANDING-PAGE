/**
 * Sube un archivo (imagen o documento) y devuelve su URL pública.
 *
 * 1) Intenta subida DIRECTA a Vercel Blob desde el navegador (producción).
 *    No pasa por la función serverless, así que no hay límite de 4.5 MB.
 * 2) Si falla (p. ej. en local sin Blob), usa el respaldo /api/upload-local.
 *
 * Lanza Error con un mensaje claro si ninguna vía funciona.
 */
export async function uploadFile(file: File): Promise<string> {
  // 1) Subida directa a Vercel Blob.
  try {
    const { upload } = await import("@vercel/blob/client");
    const blob = await upload(`uploads/${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: file.type || undefined,
    });
    return blob.url;
  } catch {
    // 2) Respaldo: subir al servidor (local / servidor Node propio).
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload-local", { method: "POST", body: data });

    const text = await res.text();
    let json: { url?: string; error?: string } | null = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    if (!res.ok || !json?.url) {
      throw new Error(
        json?.error ||
          "No se pudo subir el archivo. Si estás en Vercel, conecta el almacenamiento Blob en Storage."
      );
    }
    return json.url;
  }
}
