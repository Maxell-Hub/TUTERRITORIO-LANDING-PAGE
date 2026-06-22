"use client";

import { useEffect, useState } from "react";

/**
 * Pantalla de carga inicial con el logo animado. Aparece al cargar el sitio,
 * hace una animación con el logo y se desvanece. Se monta una sola vez (en el
 * layout), así que no reaparece en la navegación entre páginas del cliente.
 */
export default function Splash() {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHide(true), 1300); // empieza a desvanecer
    const t2 = setTimeout(() => setGone(true), 2000); // se desmonta tras la transición
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`splash${hide ? " splash-hide" : ""}`} role="status" aria-label="Cargando">
      <div className="splash-stage">
        <span className="splash-ring" />
        <span className="splash-ring two" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="splash-logo" src="/assets/logo-full-white.png" alt="Tuterritorio" />
      </div>
      <span className="splash-bar"><span /></span>
    </div>
  );
}
