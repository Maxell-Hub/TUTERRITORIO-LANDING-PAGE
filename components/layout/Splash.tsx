"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pantalla de carga con el logo animado:
 * - Aparece el imagotipo.
 * - El texto "Tuterritorio" se revela de izquierda a derecha.
 * - Al terminar, el texto desaparece de derecha a izquierda y se desvanece.
 *
 * Llama a `onFinish` cuando termina. Se usa SOLO en /admin (al entrar y al
 * iniciar sesión), no en el resto del sitio.
 */
export default function Splash({ onFinish }: { onFinish?: () => void }) {
  const [out, setOut] = useState(false); // el texto sale (derecha → izquierda)
  const [fade, setFade] = useState(false); // se desvanece la pantalla
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 1400);
    const t2 = setTimeout(() => setFade(true), 2000);
    const t3 = setTimeout(() => onFinishRef.current?.(), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      className={`splash${out ? " splash-out" : ""}${fade ? " splash-fade" : ""}`}
      role="status"
      aria-label="Cargando Tuterritorio"
    >
      <span className="splash-blob a" aria-hidden="true" />
      <span className="splash-blob b" aria-hidden="true" />
      <span className="splash-blob c" aria-hidden="true" />
      <span className="splash-blob d" aria-hidden="true" />

      <div className="splash-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="splash-mark" src="/assets/logo-imagotipo-tr.png" alt="Tuterritorio" />
        <span className="splash-word">Tuterritorio</span>
      </div>
      <span className="splash-bar"><span /></span>
    </div>
  );
}
