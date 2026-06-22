"use client";

import { useEffect, useState } from "react";

/**
 * Pantalla de carga inicial.
 * - Aparece el imagotipo.
 * - El texto "Tuterritorio" se revela de izquierda a derecha.
 * - Al terminar de cargar, el texto desaparece de derecha a izquierda y la
 *   pantalla se desvanece.
 * Se monta una sola vez (en el layout): no reaparece al navegar entre páginas.
 */
export default function Splash() {
  const [out, setOut] = useState(false); // el texto sale (derecha → izquierda)
  const [fade, setFade] = useState(false); // se desvanece toda la pantalla
  const [gone, setGone] = useState(false); // se desmonta

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 1600);
    const t2 = setTimeout(() => setFade(true), 2200);
    const t3 = setTimeout(() => setGone(true), 2750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`splash${out ? " splash-out" : ""}${fade ? " splash-fade" : ""}`}
      role="status"
      aria-label="Cargando Tuterritorio"
    >
      <div className="splash-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="splash-mark" src="/assets/logo-imagotipo.png" alt="Tuterritorio" />
        <span className="splash-word">Tuterritorio</span>
      </div>
      <span className="splash-bar"><span /></span>
    </div>
  );
}
