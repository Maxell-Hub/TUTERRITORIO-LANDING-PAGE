"use client";

import { useEffect } from "react";

/**
 * Garantiza que toda navegación por clic/tap arranque al principio de la
 * página (algunos navegadores conservan la posición del scroll anterior).
 * Vive en app/template.tsx, que se vuelve a montar en cada navegación.
 *
 * Excepciones respetadas:
 * - Enlaces con ancla (#seccion): se deja que el navegador vaya al ancla.
 * - Atrás/adelante del navegador: se conserva la restauración de posición.
 * - Carga inicial/recarga: el navegador decide (restaura la posición).
 */
let cargaInicial = true;
let navegacionAtras = false;

if (typeof window !== "undefined" && !(window as unknown as { __stWired?: boolean }).__stWired) {
  (window as unknown as { __stWired?: boolean }).__stWired = true;
  window.addEventListener("popstate", () => {
    navegacionAtras = true;
  });
}

export default function ScrollTop() {
  useEffect(() => {
    if (cargaInicial) {
      cargaInicial = false;
      return;
    }
    if (navegacionAtras) {
      navegacionAtras = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, []);
  return null;
}
