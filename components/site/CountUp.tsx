"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Número que "cuenta" desde 0 hasta su valor cuando entra en pantalla
 * (cifras del Inicio). El HTML del servidor trae el valor final (SEO y
 * sin JavaScript se ve completo); con JavaScript se pone en 0 y anima
 * al hacerse visible. Con prefers-reduced-motion se muestra fijo.
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1800,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => n.toLocaleString("es-CO");
  const [display, setDisplay] = useState(() => fmt(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;
    setDisplay(fmt(0));
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // arranca rápido y frena al final
          setDisplay(fmt(Math.round(value * eased)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className="notranslate" translate="no" style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}{display}{suffix}
    </span>
  );
}
