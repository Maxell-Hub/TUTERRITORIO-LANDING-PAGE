"use client";

import { useRef, useState } from "react";

type Item = { n: string; c: string; t: string; d: string };

/**
 * "Lo que hacemos" como slider de tarjetas apiladas: la tarjeta activa va al
 * centro a tamaño completo y las demás se escalan y desplazan detrás (efecto
 * baraja). Se navega con los puntos o haciendo clic/tap en una tarjeta lateral.
 * Sin íconos: cada tarjeta lleva su número en el color corporativo.
 */
export default function FuncionesSlider({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const move = (dir: number) => setActive((prev) => Math.min(items.length - 1, Math.max(0, prev + dir)));

  return (
    <div
      className="cs-wrap reveal"
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx < -45) move(1);
        else if (dx > 45) move(-1);
        startX.current = null;
      }}
    >
      <div className="cs">
        {items.map((f, idx) => {
          const off = idx - active;
          const a = Math.abs(off);
          const s = Math.sign(off);
          let tx = 0, sc = 1, z = 50, op = 1;
          if (a === 1) { tx = s * 72; sc = 0.85; z = 40; }
          else if (a === 2) { tx = s * 124; sc = 0.7; z = 30; }
          else if (a >= 3) { tx = s * 140; sc = 0.62; z = 10; op = 0; }
          const isOn = off === 0;
          return (
            <div
              key={f.t}
              className={`cs-cell${isOn ? " on" : ""}`}
              style={{ transform: `translateX(${tx}px) scale(${sc})`, zIndex: z, opacity: op }}
              aria-hidden={!isOn}
            >
              <article className="cs-card" style={{ ["--c" as string]: f.c }}>
                <span className="cs-num">{f.n}</span>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </article>
              {!isOn && op > 0 && (
                <button className="cs-hit" onClick={() => setActive(idx)} aria-label={`Ver ${f.t}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="cs-dots" role="tablist" aria-label="Funciones">
        {items.map((f, idx) => (
          <button
            key={f.t}
            className={`cs-dot${idx === active ? " on" : ""}`}
            style={idx === active ? { background: f.c } : undefined}
            onClick={() => setActive(idx)}
            aria-label={`Ver ${f.t}`}
            aria-current={idx === active}
          />
        ))}
      </div>
    </div>
  );
}
