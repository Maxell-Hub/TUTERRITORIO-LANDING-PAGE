import { promises as fs } from "fs";
import path from "path";

/**
 * Almacenamiento de contenido basado en archivos JSON dentro de /data.
 *
 * Funciona en desarrollo y en cualquier servidor Node (next start). En hostings
 * "serverless" de solo lectura (Vercel/Netlify) el disco no es escribible: en ese
 * caso habría que cambiar este módulo por una base de datos (es el único archivo
 * que tendría que adaptarse — toda la app usa readContent/writeContent).
 */

const DATA_DIR = path.join(process.cwd(), "data");

export const KEY_RE = /^[a-z0-9-]+$/;

function fileFor(key: string): string {
  return path.join(DATA_DIR, `${key}.json`);
}

export async function readContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(fileFor(key), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeContent(key: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(key), JSON.stringify(value, null, 2), "utf8");
}
