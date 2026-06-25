/**
 * Limitador de tasa simple (ventana fija) en memoria.
 *
 * Nota importante: en serverless (Vercel) la memoria es POR INSTANCIA y efímera,
 * así que esto es "mejor esfuerzo" — frena ataques básicos de fuerza bruta/spam,
 * pero no es un límite global estricto. Para protección robusta y compartida
 * entre instancias, usar Vercel KV / Upstash Ratelimit (ver SECURITY.md).
 */

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
