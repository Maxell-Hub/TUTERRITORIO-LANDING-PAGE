/**
 * Limitador de tasa.
 *
 * - Si hay Upstash Redis conectado (variables UPSTASH_REDIS_REST_URL y
 *   UPSTASH_REDIS_REST_TOKEN, que Vercel inyecta al conectar la integración),
 *   usa un contador COMPARTIDO entre todas las instancias serverless →
 *   límite global estricto y real.
 * - Si NO está conectado, cae automáticamente al limitador en memoria de abajo
 *   (por instancia y efímero): "mejor esfuerzo" para frenar spam básico.
 *
 * Usar `rateLimitAsync` en las rutas (con `await`). El `rateLimit` síncrono se
 * conserva como respaldo interno.
 */
import { Redis } from "@upstash/redis";

// La integración de Upstash/KV en Vercel puede inyectar las credenciales con
// distintos nombres según cómo se conecte. Aceptamos los dos esquemas comunes.
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis =
  REDIS_URL && REDIS_TOKEN ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;

/** ¿Está activo el limitador compartido (Upstash)? */
export const isSharedRateLimit = !!redis;

/**
 * Diagnóstico del limitador: dice qué backend se usa y, si es Upstash, hace un
 * ping real (set/get) para confirmar que responde. Solo para uso administrativo.
 */
export async function rateLimitStatus(): Promise<{ backend: string; upstash: boolean; ok: boolean }> {
  if (!redis) {
    return { backend: "En memoria (por instancia, mejor esfuerzo)", upstash: false, ok: true };
  }
  try {
    await redis.set("rl:healthcheck", Date.now(), { ex: 30 });
    const v = await redis.get("rl:healthcheck");
    return { backend: "Upstash Redis (compartido y estricto)", upstash: true, ok: v != null };
  } catch (e) {
    return {
      backend: `Upstash configurado pero SIN conexión: ${e instanceof Error ? e.message : String(e)}`,
      upstash: true,
      ok: false,
    };
  }
}

/**
 * Límite de tasa recomendado (async). Usa Upstash si está disponible; si no,
 * o si Upstash fallara, usa el respaldo en memoria para NO bloquear el formulario.
 * Devuelve true si se permite la petición; false si superó el límite.
 */
export async function rateLimitAsync(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (!redis) return rateLimit(key, limit, windowMs);
  try {
    const k = `rl:${key}`;
    const count = await redis.incr(k);
    // Al primer golpe de la ventana, fija el vencimiento.
    if (count === 1) await redis.pexpire(k, windowMs);
    return count <= limit;
  } catch {
    // Si Redis no responde, no dejamos el formulario inservible: respaldo local.
    return rateLimit(key, limit, windowMs);
  }
}

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();
let lastSweep = 0;

/** IP del cliente a partir de las cabeceras (Vercel pone x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Devuelve true si la petición está permitida; false si superó el límite.
 * @param key    Identificador (p. ej. `login:<ip>`).
 * @param limit  Máximo de peticiones por ventana.
 * @param windowMs  Tamaño de la ventana en ms.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Limpieza ocasional de buckets vencidos (evita crecer sin límite).
  if (now - lastSweep > 60_000) {
    lastSweep = now;
    for (const [k, b] of buckets) if (now > b.reset) buckets.delete(k);
  }

  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}
