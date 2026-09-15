/**
 * Verificación de Cloudflare Turnstile (captcha) en el servidor.
 *
 * - Si NO hay TURNSTILE_SECRET_KEY (aún no configurado), devuelve true: no
 *   bloquea los formularios (quedan como estaban).
 * - Si hay secret pero Cloudflare no responde, también devuelve true (fail-open):
 *   evita dejar los formularios inservibles por una caída del servicio; el
 *   honeypot y el rate limit siguen protegiendo.
 * - Con secret y token válido → true; token ausente/ inválido → false.
 */
export const isTurnstileConfigured = !!process.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token: string | null | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // no configurado → no bloquear
  if (!token) return false; // configurado pero sin token → rechazar

  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (ip) form.set("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    // Cloudflare no respondió: no bloqueamos (fail-open).
    return true;
  }
}
