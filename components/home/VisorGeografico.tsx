"use client";

import Image from "next/image";
import { useState } from "react";

type Comuna = { zone: string; name: string; c: string; uso: string; s: string[]; left: number; top: number; margin: string };

// Datos del handoff (objeto CM). Posiciones de los puntos sobre el mapa.
const CM: Record<number, Comuna> = {
  5: { zone: "Nor-occidente", name: "Comuna 5", c: "#E5A398", uso: "Residencial y mixto", s: ["Garupal", "Los Cardonales", "Villa Lucía", "Bello Horizonte"], left: 21, top: 25, margin: "55px 0 0 5px" },
  6: { zone: "Norte", name: "Comuna 6", c: "#97BEDB", uso: "Residencial y comercial", s: ["San Carlos", "Pontevedra", "Villa del Rosario", "San Joaquín"], left: 43, top: 18, margin: "60px 0 0 11px" },
  1: { zone: "Centro · Nor-oriente", name: "Comuna 1", c: "#E3C56B", uso: "Comercial e institucional", s: ["Centro", "Loperena", "Cañaguate", "Las Delicias"], left: 62, top: 38, margin: "48px 0 0 -14px" },
  4: { zone: "Sur-occidente", name: "Comuna 4", c: "#8FC6A8", uso: "Residencial y dotacional", s: ["La Popa", "Los Cortijos", "San Jerónimo", "Las Acacias"], left: 26, top: 48, margin: "60px 0 0 -3px" },
  3: { zone: "Sur", name: "Comuna 3", c: "#C3AEDD", uso: "Residencial en expansión", s: ["La Nevada", "Zumba", "El Páramo", "Rincón de Zuruma"], left: 46, top: 66, margin: "70px 0 0 1px" },
  2: { zone: "Sur-oriente", name: "Comuna 2", c: "#E8B68C", uso: "Residencial consolidado", s: ["Doce de Octubre", "Panamá", "Los Milagros", "San Fernando"], left: 73, top: 56, margin: "67px 0 0" },
};

const ORDER = [5, 6, 1, 4, 3, 2];

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tt-green-600)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function VisorGeografico() {
  const [active, setActive] = useState<number | null>(null);
  const tip = active ? CM[active] : null;

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
              Valledupar, capital del departamento del Cesar, organiza su área urbana en{" "}
              <b style={{ color: "var(--tt-navy-700)", fontWeight: 700 }}>6 comunas</b> y complementa su territorio
              con una amplia zona rural de corregimientos y resguardos indígenas en la Sierra Nevada.
              Pasa el cursor sobre cada comuna para conocerla.
            </p>
            <ul className="visor-list">
              <li><span className="chk"><Check /></span><span className="txt">6 comunas en el área urbana</span></li>
              <li><span className="chk"><Check /></span><span className="txt">25 corregimientos en zona rural</span></li>
              <li><span className="chk"><Check /></span><span className="txt">Resguardos indígenas en la Sierra Nevada</span></li>
            </ul>
          </div>

          {/* derecha: mapa interactivo */}
          <div
            className="reveal cm-stage"
            onMouseLeave={() => setActive(null)}
          >
            <Image className="cm-mapimg" src="/assets/valledupar-comunas.png" alt="Mapa de comunas de Valledupar" width={750} height={784} sizes="(max-width: 600px) 100vw, 520px" />

            {ORDER.map((n) => {
              const d = CM[n];
              return (
                <button
                  key={n}
                  className={`cm-dot${active === n ? " on" : ""}`}
                  style={{ left: `${d.left}%`, top: `${d.top}%`, ["--c" as string]: d.c, margin: d.margin }}
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
                <div className="ct-label">Uso predominante</div>
                <div className="ct-use">{tip.uso}</div>
                <div className="ct-label">Zonas destacadas</div>
                <div className="cm-pills">
                  {tip.s.map((z) => <span key={z}>{z}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
