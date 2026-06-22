"use client";

import { useEffect } from "react";

/**
 * Desplaza la página hasta el elemento indicado en el hash de la URL
 * (p. ej. /recursos/glosario#g-001) y lo resalta brevemente.
 *
 * Se llama pasando una dependencia que cambia cuando el contenido ya está
 * renderizado (por ejemplo, el arreglo de datos cargado desde la API), para
 * que el elemento exista al momento de desplazarse. También reacciona a
 * cambios de hash (búsqueda estando ya en la misma página).
 */
export function useScrollToHash(dep: unknown) {
  useEffect(() => {
    function scrollToHash() {
      const hash = decodeURIComponent((window.location.hash || "").slice(1));
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return;
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("sr-flash");
        window.setTimeout(() => el.classList.remove("sr-flash"), 1900);
      });
    }
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [dep]);
}
