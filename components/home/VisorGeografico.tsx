"use client";

import Image from "next/image";
import { useState } from "react";

type Sector = { zone: string; name: string; c: string; left: number; top: number };

// Sectores catastrales de Valledupar (mapa oficial). Posiciones de los puntos
// sobre el mapa en %. El detalle de barrios/uso se completará con datos oficiales.
// `left`/`top` en %: cada punto queda debajo de su recuadro "SECTOR N", separado.
const SC: Record<number, Sector> = {
  4: { zone: "Norte", name: "Sector 4", c: "#E0867D", left: 50, top: 33 },
  5: { zone: "Occidente", name: "Sector 5", c: "#E29B92", left: 22, top: 37 },
  1: { zone: "Centro", name: "Sector 1", c: "#97BEDB", left: 35, top: 52 },
  2: { zone: "Oriente", name: "Sector 2", c: "#86C0A0", left: 66, top: 66 },
  6: { zone: "Sur-occidente", name: "Sector 6", c: "#E3C56B", left: 36, top: 74 },
  3: { zone: "Sur", name: "Sector 3", c: "#B79BD4", left: 50, top: 83 },
};

const ORDER = [4, 5, 1, 2, 6, 3];

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tt-green-600)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function VisorGeografico() {
  const [active, setActive] = useState<number | null>(null);
  const tip = active ? SC[active] : null;

  return (
    <section id="visor" className="visor">
      <div className="visor-dots" />
      <div className="visor-inner">
        <div className="visor-grid">
          {/* izquierda: texto */}
          <div className="reveal">
            <span className="visor-tag"><span className="ln" />Visor geográfico</span>
            <h2>Explora tu territorio:<br />Valledupar al detalle</h2>
            <p>
              Para la gestión catastral, el área urbana de Valledupar se organiza en{" "}
              <b style={{ color: "var(--tt-navy-700)", fontWeight: 700 }}>6 sectores catastrales</b>, y su
              territorio se complementa con una amplia zona rural de corregimientos y resguardos indígenas
              en la Sierra Nevada. Pasa el cursor sobre cada sector para ubicarlo.
            </p>
            <ul className="visor-list">
              <li><span className="chk"><Check /></span><span className="txt">6 sectores catastrales en el área urbana</span></li>
              <li><span className="chk"><Check /></span><span className="txt">25 corregimientos en zona rural</span></li>
              <li><span className="chk"><Check /></span><span className="txt">Resguardos indígenas en la Sierra Nevada</span></li>
            </ul>
          </div>

          {/* derecha: mapa interactivo */}
          <div
            className="reveal cm-stage"
            onMouseLeave={() => setActive(null)}
          >
            <Image className="cm-mapimg is-sectores" src="/assets/Valledupar_Sectores_Catastral.png" alt="Mapa de sectores catastrales de Valledupar" width={1098} height={842} sizes="(max-width: 600px) 100vw, 520px" />

            {ORDER.map((n) => {
              const d = SC[n];
              return (
                <button
                  key={n}
                  className={`cm-dot${active === n ? " on" : ""}`}
                  style={{ left: `${d.left}%`, top: `${d.top}%`, ["--c" as string]: d.c }}
                  aria-label={d.name}
                  onMouseEnter={() => setActive(n)}
                  onFocus={() => setActive(n)}
                  onClick={(e) => { e.preventDefault(); setActive(n); }}
                >
                  <i />
                </button>
              );
            })}

            {tip && (
              <div
                className={`cm-tip show${tip.top < 42 ? " below" : ""}`}
                style={{ left: `${tip.left}%`, top: `${tip.top}%`, ["--c" as string]: tip.c }}
                role="status"
              >
                <div className="ct-zone">{tip.zone}</div>
                <div className="ct-name">{tip.name}</div>
                <div className="ct-label">Ubicación en la ciudad</div>
                <div className="ct-use">{tip.zone} del área urbana</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
