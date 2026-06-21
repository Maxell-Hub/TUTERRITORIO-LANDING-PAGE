import crypto from "crypto";

/**
 * Autenticación del administrador del sitio.
 *
 * Las credenciales y la clave de firma se leen de variables de entorno
 * (archivo `.env.local`, que NO se sube al repositorio). Así la contraseña no
 * queda escrita en el código fuente. Variables: `TT_ADMIN_USER`,
 * `TT_ADMIN_PASS`, `TT_AUTH_SECRET`.
 */

const SECRET =
  process.env.TT_AUTH_SECRET || "tuterritorio-dev-secret-cambiar-en-produccion";

export const ADMIN_USER = (process.env.TT_ADMIN_USER || "admin").toLowerCase();
const ADMIN_PASS = process.env.TT_ADMIN_PASS || "";

export const SESSION_COOKIE = "tt_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

export function checkCredentials(user: string, pass: string): boolean {
  // Si no hay contraseña configurada en el entorno, no se permite el acceso.
  if (!ADMIN_PASS) return false;
  return (user || "").trim().toLowerCase() === ADMIN_USER && pass === ADMIN_PASS;
}

/** Crea un token firmado (HMAC) con el nombre de usuario. */
export function createToken(user: string): string {
  const payload = Buffer.from(JSON.stringify({ u: user, r: "admin" })).toString(
    "base64url"
  );
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Verifica el token y devuelve el usuario, o null si no es válido. */
export function verifyToken(token?: string | null): { user: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  // Comparación en tiempo constante.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data?.u) return null;
    return { user: data.u as string };
  } catch {
    return null;
  }
}
