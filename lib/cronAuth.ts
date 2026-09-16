/**
 * Verifica que una petición venga del Cron de Vercel (y no de un visitante).
 *
 * Vercel añade la cabecera `Authorization: Bearer <CRON_SECRET>` a las llamadas
 * programadas SOLO si existe la variable de entorno CRON_SECRET. Por seguridad,
 * si no está configurada, los crons NO se ejecutan (devuelven 401): así las
 * rutas nunca quedan abiertas al público por accidente.
 */
export function verifyCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export const isCronConfigured = !!process.env.CRON_SECRET;
