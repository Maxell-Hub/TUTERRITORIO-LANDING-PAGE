import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import EquipoTeam from "@/components/nosotros/EquipoTeam";

export const metadata: Metadata = {
  title: "Nuestro Equipo",
  alternates: { canonical: "/nosotros/equipo" },
  description:
    "Conoce al equipo humano de Tuterritorio: liderazgo y equipo técnico interdisciplinario que opera el catastro de Valledupar.",
};

// Nodos de la red (sin íconos): círculos con colores corporativos, deriva suave y anillo pulsante.
const NODES = [
  { l: 50, t: 50, s: 96, c: "#3B85A5", hl: "#74BAD3", a: "tt-driftA 7s",   sh: "0 16px 36px rgba(59,133,165,.42)" },
  { l: 20, t: 22, s: 60, c: "#4E8654", hl: "#86C28D", a: "tt-driftB 6.2s", sh: "0 12px 26px rgba(78,134,84,.38)" },
  { l: 82, t: 20, s: 58, c: "#1E5167", hl: "#4A86A1", a: "tt-driftA 6.8s", sh: "0 12px 26px rgba(30,81,103,.42)" },
  { l: 86, t: 74, s: 64, c: "#F0B63B", hl: "#F8D689", a: "tt-driftB 7.4s", sh: "0 12px 26px rgba(240,182,59,.44)" },
  { l: 18, t: 78, s: 54, c: "#4E8654", hl: "#86C28D", a: "tt-driftA 6.5s", sh: "0 10px 22px rgba(78,134,84,.36)" },
  { l: 14, t: 50, s: 46, c: "#3B85A5", hl: "#74BAD3", a: "tt-driftB 5.8s", sh: "0 9px 20px rgba(59,133,165,.38)" },
];

export default function EquipoPage() {
  return (
    <>
      {/* Hero Equipo */}
      <section className="equipo-hero">
        <div style={{ position: "absolute", top: -120, right: -40, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(240,182,59,.20), rgba(240,182,59,0) 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -140, left: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(89,169,196,.16), rgba(89,169,196,0) 70%)", pointerEvents: "none" }} />
        <div className="equipo-hero-grid">
          <div className="reveal">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", font: "700 0.75rem/1 var(--font-sans)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#74BAD3" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#74BAD3" }} /> Nuestro equipo
            </span>
            <h1>Detrás de cada predio,<br /><span className="cy">hay un equipo</span> que lo hace posible</h1>
            <Editable as="p" id="equipo.intro" multiline>Un equipo humano y comprometido que trabaja cada día para que conocer y cuidar tu territorio sea más fácil, cercano y transparente.</Editable>
            <span className="ribbon5" style={{ margin: "26px 0 0", width: 140 }} />
          </div>

          <div className="hero-net reveal">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="net-lines">
              <g stroke="rgba(89,169,196,.45)" strokeWidth="0.4" fill="none" strokeLinecap="round" strokeDasharray="2 2.4">
                <line x1="50" y1="50" x2="20" y2="22" /><line x1="50" y1="50" x2="82" y2="20" />
                <line x1="50" y1="50" x2="86" y2="74" /><line x1="50" y1="50" x2="18" y2="78" />
                <line x1="50" y1="50" x2="14" y2="50" /><line x1="20" y1="22" x2="82" y2="20" />
                <line x1="86" y1="74" x2="18" y2="78" />
              </g>
            </svg>
            {NODES.map((n, i) => (
              <span key={i} className="net-node" style={{ left: `${n.l}%`, top: `${n.t}%`, width: n.s, height: n.s, color: n.c, background: `radial-gradient(circle at 34% 30%, ${n.hl}, ${n.c})`, boxShadow: n.sh, animation: `${n.a} ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      </section>

      {/* Liderazgo + Equipo técnico (editable por el administrador) */}
      <EquipoTeam />
    </>
  );
}
