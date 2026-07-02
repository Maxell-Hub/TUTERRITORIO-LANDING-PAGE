import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import EquipoTeam from "@/components/nosotros/EquipoTeam";

export const metadata: Metadata = {
  title: "Nuestro Equipo",
  alternates: { canonical: "/nosotros/equipo" },
  description:
    "Conoce al equipo humano de Tuterritorio: liderazgo y equipo técnico interdisciplinario que opera el catastro de Valledupar.",
};

// El equipo orbitando el territorio: el imagotipo al centro y las personas
// (círculos con colores corporativos) girando a su alrededor en dos anillos.
// Cada anillo gira a su ritmo; los íconos se mantienen siempre derechos.
const RINGS: { cls: string; people: { deg: number; s: number; c: string; hl: string; sh: string }[] }[] = [
  {
    cls: "a1",
    people: [
      { deg: 0,   s: 58, c: "#4E8654", hl: "#86C28D", sh: "0 12px 26px rgba(78,134,84,.38)" },
      { deg: 120, s: 54, c: "#3B85A5", hl: "#74BAD3", sh: "0 12px 26px rgba(59,133,165,.42)" },
      { deg: 240, s: 56, c: "#F0B63B", hl: "#F8D689", sh: "0 12px 26px rgba(240,182,59,.44)" },
    ],
  },
  {
    cls: "a2",
    people: [
      { deg: 60,  s: 52, c: "#1E5167", hl: "#4A86A1", sh: "0 12px 26px rgba(30,81,103,.42)" },
      { deg: 180, s: 50, c: "#4E8654", hl: "#86C28D", sh: "0 10px 22px rgba(78,134,84,.36)" },
      { deg: 300, s: 54, c: "#3B85A5", hl: "#74BAD3", sh: "0 12px 26px rgba(59,133,165,.42)" },
    ],
  },
];

export default function EquipoPage() {
  return (
    <>
      {/* Hero Equipo */}
      <section className="equipo-hero">
        <div className="equipo-hero-grid">
          <div className="reveal">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", font: "700 0.75rem/1 var(--font-sans)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#74BAD3" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#74BAD3" }} /> Nuestro equipo
            </span>
            <h1>Detrás de cada predio,<br /><span className="cy">hay un equipo</span> que lo hace posible</h1>
            <Editable as="p" id="equipo.intro" multiline>Un equipo humano y comprometido que trabaja cada día para que conocer y cuidar tu territorio sea más fácil, cercano y transparente.</Editable>
            <span className="ribbon5" style={{ margin: "26px 0 0", width: 140 }} />
          </div>

          <div className="hero-net reveal" aria-hidden="true">
            <div className="eq-orbita">
              <div className="eq-centro">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo-imagotipo-tr.png" alt="" />
              </div>
              {RINGS.map((ring) => (
                <div className={`eq-anillo ${ring.cls}`} key={ring.cls}>
                  {ring.people.map((p) => (
                    <span className="eq-radio" key={p.deg} style={{ "--rot": `${p.deg}deg` } as React.CSSProperties}>
                      <span className="eq-persona" style={{ width: p.s, height: p.s, background: `radial-gradient(circle at 34% 30%, ${p.hl}, ${p.c})`, boxShadow: p.sh }}>
                        <svg width={Math.round(p.s * 0.46)} height={Math.round(p.s * 0.46)} viewBox="0 0 24 24" fill="none" stroke={p.c === "#F0B63B" ? "#0C222F" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4.5 21c0-4.2 3.4-6.5 7.5-6.5s7.5 2.3 7.5 6.5" />
                        </svg>
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liderazgo + Equipo técnico (editable por el administrador) */}
      <EquipoTeam />
    </>
  );
}
