import crypto from "crypto";

/**
 * Autenticación del administrador del sitio.
 *
 * Credenciales y clave de firma se leen de variables de entorno
 * (`TT_ADMIN_USER`, `TT_ADMIN_PASS`, `TT_AUTH_SECRET`) — nunca van en el código.
 *
 * Endurecimiento (seguridad):
 *  - NO hay secreto por defecto: si `TT_AUTH_SECRET` falta o es débil, se niega
 *    todo acceso (fail-closed). Evita tokens falsificables.
 *  - Comparaciones en tiempo constante (mitiga ataques de temporización).
 *  - El token de sesión lleva expiración propia (`exp`), no solo la cookie.
 */

const RAW_SECRET = process.env.TT_AUTH_SECRET || "";
// El secreto debe existir y ser razonablemente largo. Si no, el sistema queda
// "cerrado" (no autentica a nadie) en lugar de usar un valor inseguro conocido.
const SECRET_OK = RAW_SECRET.length >= 16;
const SECRET = RAW_SECRET;

export const ADMIN_USER = (process.env.TT_ADMIN_USER || "admin").toLowerCase();
const ADMIN_PASS = process.env.TT_ADMIN_PASS || "";

export const SESSION_COOKIE = "tt_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas
const TOKEN_TTL_MS = SESSION_MAX_AGE * 1000;

/** Comparación de cadenas en tiempo constante. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** ¿Está bien configurado el entorno de autenticación? */
export const authConfigured = SECRET_OK && ADMIN_PASS.length > 0;

export function checkCredentials(user: string, pass: string): boolean {
  // Entorno mal configurado (sin secreto fuerte o sin contraseña) → denegar.
  if (!authConfigured) return false;
  const userOk = safeEqual((user || "").trim().toLowerCase(), ADMIN_USER);
  const passOk = safeEqual(pass || "", ADMIN_PASS);
  return userOk && passOk;
}

/** Crea un token firmado (HMAC) con usuario y expiración. */
export function createToken(user: string): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ u: user, r: "admin", exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Verifica firma y expiración del token; devuelve el usuario o null. */
export function verifyToken(token?: string | null): { user: string } | null {
  if (!SECRET_OK || !token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data?.u) return null;
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null; // expirado
    return { user: data.u as string };
  } catch {
    return null;
  }
}
