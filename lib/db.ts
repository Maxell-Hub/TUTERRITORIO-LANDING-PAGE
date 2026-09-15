// Conexión a la base de datos (Neon Postgres) para el seguimiento de PQRSD.
// Se activa SOLO si hay cadena de conexión (la integración de Vercel/Neon inyecta
// DATABASE_URL / POSTGRES_URL). Sin ella, isDbConfigured es false y todo el
// seguimiento queda inerte: los formularios siguen funcionando como antes.
import { neon } from "@neondatabase/serverless";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED;

export const isDbConfigured = !!url;

// Función SQL con template tags (o null si no hay base de datos).
export const sql = url ? neon(url) : null;

let schemaReady = false;

/** Crea la tabla y la secuencia del radicado si no existen (idempotente). */
export async function ensureSchema(): Promise<void> {
  if (!sql || schemaReady) return;
  await sql`CREATE SEQUENCE IF NOT EXISTS pqrsd_rad_seq START 1`;
  await sql`CREATE TABLE IF NOT EXISTS pqrsd (
    id              BIGSERIAL PRIMARY KEY,
    radicado        TEXT UNIQUE NOT NULL,
    tipo            TEXT NOT NULL,
    nombre          TEXT NOT NULL,
    doc_tipo        TEXT,
    documento       TEXT,
    correo          TEXT,
    telefono        TEXT,
    asunto          TEXT,
    descripcion     TEXT,
    estado          TEXT NOT NULL DEFAULT 'Recibida',
    adjuntos        JSONB NOT NULL DEFAULT '[]'::jsonb,
    historial       JSONB NOT NULL DEFAULT '[]'::jsonb,
    respuesta       TEXT,
    respondido_en   TIMESTAMPTZ,
    fecha_limite    DATE,
    autorizacion_fecha TIMESTAMPTZ,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  schemaReady = true;
}
