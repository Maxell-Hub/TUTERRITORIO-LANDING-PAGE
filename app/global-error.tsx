"use client";

// Captura de errores de renderizado de React en el App Router: reporta a Sentry
// y muestra una pantalla mínima de error. Solo se muestra ante fallos graves que
// rompen el layout raíz.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "48px 20px", textAlign: "center", color: "#163A4C" }}>
        <h1 style={{ fontSize: 24, margin: "0 0 10px" }}>Algo salió mal</h1>
        <p style={{ color: "#5b6b74", margin: "0 0 22px" }}>
          Ocurrió un error inesperado. Intenta de nuevo; si persiste, vuelve más tarde.
        </p>
        <button
          onClick={() => reset()}
          style={{ background: "#163A4C", color: "#fff", border: "none", padding: "11px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
