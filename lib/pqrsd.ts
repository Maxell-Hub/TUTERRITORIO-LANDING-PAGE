// Lógica del seguimiento de PQRSD sobre la base de datos.
import { sql, ensureSchema, isDbConfigured } from "@/lib/db";

export const ESTADOS = ["Recibida", "En trámite", "Resuelta", "Cerrada"] as const;
export type Estado = (typeof ESTADOS)[number];

export type Adjunto = { nombre: string; url: string; tamano?: number };

export type Pqrsd = {
  id: number;
  tipo: string;
  nombre: string;
  doc_tipo: string | null;
  documento: string | null;
  correo: string | null;
  telefono: string | null;
  asunto: string | null;
  descripcion: string | null;
  estado: Estado;
  adjuntos: Adjunto[];
  historial: { estado: string; respuesta?: string | null; por?: string; en: string }[];
  respuesta: string | null;
  respondido_en: string | null;
  fecha_limite: string | null;
  creado_en: string;
};

/** Días hábiles para responder según la ley (Ley 1755/2015, término general 15). */
const DIAS_HABILES: Record<string, number> = {
  Petición: 15,
  Queja: 15,
  Reclamo: 15,
  Sugerencia: 15,
  Denuncia: 15,
};

/** Suma días HÁBILES (excluye fines de semana; no excluye festivos aún). */
function sumarDiasHabiles(desde: Date, dias: number): Date {
  const d = new Date(desde);
  let sumados = 0;
  while (sumados < dias) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) sumados++;
  }
  return d;
}

export type NuevaPqrsd = {
  tipo: string;
  nombre: string;
  doc_tipo?: string;
  documento?: string;
  correo?: string;
  telefono?: string;
  asunto?: string;
  descripcion?: string;
  adjuntos?: Adjunto[];
  autorizacion_fecha?: string;
};

/** Crea una PQRSD y calcula la fecha límite. Devuelve el id interno. */
export async function crearPqrsd(data: NuevaPqrsd): Promise<{ id: number; fechaLimite: string }> {
  if (!sql) throw new Error("Base de datos no configurada");
  await ensureSchema();

  const fechaLimite = sumarDiasHabiles(new Date(), DIAS_HABILES[data.tipo] ?? 15)
    .toISOString()
    .slice(0, 10);

  const historial = JSON.stringify([{ estado: "Recibida", en: new Date().toISOString() }]);
  const adjuntos = JSON.stringify(data.adjuntos ?? []);

  const rows = (await sql`INSERT INTO pqrsd
    (tipo, nombre, doc_tipo, documento, correo, telefono, asunto, descripcion, adjuntos, historial, fecha_limite, autorizacion_fecha)
    VALUES (${data.tipo}, ${data.nombre}, ${data.doc_tipo ?? null}, ${data.documento ?? null},
            ${data.correo ?? null}, ${data.telefono ?? null}, ${data.asunto ?? null}, ${data.descripcion ?? null},
            ${adjuntos}::jsonb, ${historial}::jsonb, ${fechaLimite}, ${data.autorizacion_fecha ?? null})
    RETURNING id`) as { id: number }[];

  return { id: rows[0].id, fechaLimite };
}

/** Lista las PQRSD más recientes (para el panel de administrador). */
export async function listarPqrsd(limite = 500): Promise<Pqrsd[]> {
  if (!sql) return [];
  await ensureSchema();
  return (await sql`SELECT * FROM pqrsd ORDER BY id DESC LIMIT ${limite}`) as Pqrsd[];
}

/** Actualiza el estado (y opcionalmente una respuesta) y registra el historial. */
export async function actualizarEstado(
  id: number,
  estado: Estado,
  respuesta: string | null,
  por: string
): Promise<Pqrsd | null> {
  if (!sql) return null;
  await ensureSchema();
  const entry = JSON.stringify([{ estado, respuesta: respuesta || null, por, en: new Date().toISOString() }]);
  const rows = (await sql`UPDATE pqrsd SET
      estado = ${estado},
      respuesta = COALESCE(${respuesta}, respuesta),
      respondido_en = CASE WHEN ${estado} IN ('Resuelta','Cerrada') THEN now() ELSE respondido_en END,
      historial = historial || ${entry}::jsonb
    WHERE id = ${id}
    RETURNING *`) as Pqrsd[];
  return rows[0] ?? null;
}

export { isDbConfigured };
