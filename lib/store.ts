import { promises as fs } from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

/**
 * Almacenamiento de contenido editable.
 *
 * - En Vercel (u otro entorno con la variable BLOB_READ_WRITE_TOKEN): usa
 *   Vercel Blob, que SÍ persiste y es visible para todos los visitantes,
 *   incluso en hosting serverless de solo lectura.
 * - En local / servidor Node propio (sin esa variable): usa archivos JSON en
 *   /data, sin necesidad de configurar nada.
 *
 * Toda la app usa readContent / writeContent, así que el resto del código no
 * cambia según el entorno.
 */

export const KEY_RE = /^[a-z0-9-]+$/;

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const useBlob = !!BLOB_TOKEN;

/** ¿Está configurado el almacenamiento Blob en este despliegue? */
export const isBlobConfigured = useBlob;
/** ¿Corremos en Vercel (sistema de archivos de solo lectura, salvo /tmp)? */
export const isServerless = !!process.env.VERCEL;

const DATA_DIR = path.join(process.cwd(), "data");
function fileFor(key: string): string {
  return path.join(DATA_DIR, `${key}.json`);
}

/* ---- Implementación con archivos (local / servidor Node) ---- */
async function readFs<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(fileFor(key), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
async function writeFs(key: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(key), JSON.stringify(value, null, 2), "utf8");
}

/* ---- Implementación con Vercel Blob (producción serverless) ---- */
async function readBlob<T>(key: string, fallback: T): Promise<T> {
  try {
    const name = `${key}.json`;
    const { blobs } = await list({ prefix: name, token: BLOB_TOKEN });
    const match = blobs.find((b) => b.pathname === name);
    if (!match) return fallback;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
async function writeBlob(key: string, value: unknown): Promise<void> {
  await put(`${key}.json`, JSON.stringify(value, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function readContent<T>(key: string, fallback: T): Promise<T> {
  return useBlob ? readBlob(key, fallback) : readFs(key, fallback);
}

export async function writeContent(key: string, value: unknown): Promise<void> {
  return useBlob ? writeBlob(key, value) : writeFs(key, value);
}
