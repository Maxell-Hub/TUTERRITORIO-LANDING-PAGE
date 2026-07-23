"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Garantiza que toda navegación por clic/tap arranque al principio de la
 * página (en producción ni el template se remonta ni Next hace el scroll
 * automático, así que la posición del scroll se quedaba donde estaba).
 * Reacciona al cambio de ruta con usePathname y guarda la última ruta a
 * nivel de módulo, de modo que funciona igual se remonte o no el template.
 *
 * Excepciones respetadas:
 * - Enlaces con ancla (#seccion): se deja que el navegador vaya al ancla.
 * - Atrás/adelante del navegador: se conserva la restauración de posición.
 * - Carga inicial/recarga: el navegador decide (restaura la posición).
 */
let ultimaRuta: string | null = null;
let navegacionAtras = false;

if (typeof window !== "undefined" && !(window as unknown as { __stWired?: boolean }).__stWired) {
  (window as unknown as { __stWired?: boolean }).__stWired = true;
  window.addEventListener("popstate", () => {
    navegacionAtras = true;
  });
}

export default function ScrollTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (ultimaRuta === null) {
      // Carga inicial: el navegador decide la posición.
      ultimaRuta = pathname;
      return;
    }
    if (pathname === ultimaRuta) return; // remontaje sin cambio de ruta
    ultimaRuta = pathname;
    if (navegacionAtras) {
      navegacionAtras = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
