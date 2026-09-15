// Sentry — inicialización del lado del CLIENTE (navegador). Next 15.3+ carga
// este archivo automáticamente. El DSN debe ser público (NEXT_PUBLIC_SENTRY_DSN).
//
// Config LIVIANA a propósito (rendimiento móvil): solo captura de ERRORES.
// Sin performance tracing ni session replay en el navegador (eso agranda el
// bundle y no lo necesitamos aquí; las trazas de rendimiento del servidor van
// aparte y no pesan en el cliente).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0, // sin tracing en el cliente → bundle más liviano
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    enabled: process.env.NODE_ENV === "production",
  });
}
