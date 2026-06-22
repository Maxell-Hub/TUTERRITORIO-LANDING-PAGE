import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

/**
 * Subida DIRECTA del navegador a Vercel Blob (no pasa el archivo por la función,
 * así no aplica el límite de 4.5 MB de los endpoints serverless). El cliente usa
 * `upload()` de @vercel/blob/client apuntando a esta ruta, que solo genera el
 * token de subida tras verificar que hay sesión de administrador.
 *
 * Requiere que el proyecto tenga Vercel Blob conectado (variable
 * BLOB_READ_WRITE_TOKEN). En local sin Blob, el cliente usa /api/upload-local.
 */
export async function POST(request: Request): Promise<Response> {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const store = await cookies();
        if (!verifyToken(store.get(SESSION_COOKIE)?.value)) {
          throw new Error("No autorizado");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif",
            "application/pdf",
          ],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20 MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        /* sin post-proceso */
      },
    });
    return Response.json(json);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Error al subir" },
      { status: 400 }
    );
  }
}
