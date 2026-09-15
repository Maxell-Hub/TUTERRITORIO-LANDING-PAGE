// Sentry — inicialización del lado del SERVIDOR (Node).
// Solo se activa si hay DSN (lo inyecta la integración de Vercel). Sin DSN queda
// inerte: no envía nada y no rompe nada.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Muestreo de trazas de rendimiento (10% para no gastar cuota).
    tracesSampleRate: 0.1,
    // Solo reporta en producción; en local no ensucia el panel.
    enabled: process.env.NODE_ENV === "production",
  });
}
