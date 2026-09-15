// Punto de instrumentación del servidor (Next.js). Carga la config de Sentry
// según el runtime y expone onRequestError para capturar errores de servidor.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captura los errores lanzados en componentes de servidor, rutas y acciones.
export const onRequestError = Sentry.captureRequestError;
