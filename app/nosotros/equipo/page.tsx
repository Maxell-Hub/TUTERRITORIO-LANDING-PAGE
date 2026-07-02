import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import EquipoTeam from "@/components/nosotros/EquipoTeam";

export const metadata: Metadata = {
  title: "Nuestro Equipo",
  alternates: { canonical: "/nosotros/equipo" },
  description:
    "Conoce al equipo humano de Tuterritorio: liderazgo y equipo técnico interdisciplinario que opera el catastro de Valledupar.",
};

// El equipo sobre el territorio: personas (círculos con colores corporativos)
// ubicadas en los cruces de calles de un plano catastral, conectadas entre sí
// por las mismas calles. Deriva suave y anillo pulsante.
const NODES = [
  { l: 50, t: 46, s: 96, c: "#3B85A5", hl: "#74BAD3", a: "tt-driftA 7s",   sh: "0 16px 36px rgba(59,133,165,.42)" },
  { l: 22, t: 20, s: 60, c: "#4E8654", hl: "#86C28D", a: "tt-driftB 6.2s", sh: "0 12px 26px rgba(78,134,84,.38)" },
  { l: 80, t: 22, s: 58, c: "#1E5167", hl: "#4A86A1", a: "tt-driftA 6.8s", sh: "0 12px 26px rgba(30,81,103,.42)" },
  { l: 84, t: 76, s: 64, c: "#F0B63B", hl: "#F8D689", a: "tt-driftB 7.4s", sh: "0 12px 26px rgba(240,182,59,.44)" },
  { l: 18, t: 74, s: 54, c: "#4E8654", hl: "#86C28D", a: "tt-driftA 6.5s", sh: "0 10px 22px rgba(78,134,84,.36)" },
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
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="net-lines">
              {/* Plano catastral: calles quebradas y predios tintados */}
              <path d="M54 50 L78 53 L80 72 L54 74 Z" fill="#F0B63B" fillOpacity=".16" />
              <path d="M26 24 L48 27 L46 42 L22 44 Z" fill="#8FBE4E" fillOpacity=".12" />
              <path d="M56 27 L76 26 L78 46 L54 42 Z" fill="#59A9C4" fillOpacity=".1" />
              <g stroke="rgba(255,255,255,.16)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
                <path d="M-2 24 L22 20 L52 24 L80 22 L102 26" vectorEffect="non-scaling-stroke" />
                <path d="M-2 50 L18 48 L50 46 L82 50 L102 46" vectorEffect="non-scaling-stroke" />
                <path d="M-2 72 L18 74 L50 78 L84 76 L102 72" vectorEffect="non-scaling-stroke" />
                <path d="M20 -2 L22 20 L18 48 L18 74 L20 102" vectorEffect="non-scaling-stroke" />
                <path d="M52 -2 L52 24 L50 46 L50 78 L48 102" vectorEffect="non-scaling-stroke" />
                <path d="M80 -2 L80 22 L82 50 L84 76 L86 102" vectorEffect="non-scaling-stroke" />
              </g>
              {/* Recorridos del equipo: se conectan entre sí por las calles */}
              <g className="net-routes" stroke="rgba(116,186,211,.6)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 5">
                <path d="M22 20 L52 24 L50 46" vectorEffect="non-scaling-stroke" />
                <path d="M80 22 L82 50 L50 46" vectorEffect="non-scaling-stroke" />
                <path d="M18 74 L18 48 L50 46" vectorEffect="non-scaling-stroke" />
                <path d="M84 76 L50 78 L50 46" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
            {NODES.map((n, i) => (
              <span key={i} className="net-node" style={{ left: `${n.l}%`, top: `${n.t}%`, width: n.s, height: n.s, color: n.c, background: `radial-gradient(circle at 34% 30%, ${n.hl}, ${n.c})`, boxShadow: n.sh, animation: `${n.a} ease-in-out infinite` }}>
                <svg width={Math.round(n.s * 0.46)} height={Math.round(n.s * 0.46)} viewBox="0 0 24 24" fill="none" stroke={n.c === "#F0B63B" ? "#0C222F" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21c0-4.2 3.4-6.5 7.5-6.5s7.5 2.3 7.5 6.5" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Liderazgo + Equipo técnico (editable por el administrador) */}
      <EquipoTeam />
    </>
  );
}
