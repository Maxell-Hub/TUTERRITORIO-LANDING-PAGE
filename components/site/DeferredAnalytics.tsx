"use client";

import { useEffect } from "react";

/**
 * Carga Google Analytics (gtag.js) FUERA de la ruta crítica: solo tras la
 * primera interacción del usuario (toque, clic, teclado o scroll) o, como
 * respaldo, a los 4 s de inactividad. gtag ejecuta ~390 ms de CPU al cargar;
 * sacarlo del arranque baja el TBT y mejora el INP en móvil sin perder la
 * analítica (Vercel Analytics sigue contando las vistas al instante).
 */
const GA_ID = "G-1W6H8R3KJV";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function DeferredAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    let loaded = false;
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

    const load = () => {
      if (loaded) return;
      loaded = true;
      cleanup();

      const s = document.createElement("script");
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      s.async = true;
      document.head.appendChild(s);

      window.dataLayer = window.dataLayer || [];
      const gtag = (...args: unknown[]) => {
        window.dataLayer!.push(args);
      };
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", GA_ID);
    };

    const hasRic = typeof window.requestIdleCallback === "function";

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load));
      if (hasRic) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };

    // Carga al primer gesto del usuario (lo necesita de inmediato)…
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    // …o cuando el navegador esté realmente ocioso tras hidratar (no en un punto
    // fijo), para no competir con el arranque ni penalizar el INP del primer
    // toque. `timeout`/5 s garantizan que no se pospone indefinidamente.
    const idleId = hasRic
      ? window.requestIdleCallback(load, { timeout: 10000 })
      : window.setTimeout(load, 5000);

    return cleanup;
  }, []);

  return null;
}
