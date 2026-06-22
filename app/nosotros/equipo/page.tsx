import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import EquipoTeam from "@/components/nosotros/EquipoTeam";

export const metadata: Metadata = {
  title: "Nuestro Equipo — Tuterritorio",
  description:
    "Conoce al equipo humano de Tuterritorio: liderazgo y equipo técnico interdisciplinario que opera el catastro de Valledupar.",
};

const NODES = [
  { l: 50, t: 50, s: 96, c: "#3B85A5", a: "tt-bobA 7s", sw: 40, sh: "0 12px 28px rgba(59,133,165,.36)", b: 4 },
  { l: 20, t: 22, s: 62, c: "#4E8654", a: "tt-bobB 6.2s", sw: 26, sh: "0 10px 22px rgba(78,134,84,.34)", b: 4 },
  { l: 82, t: 20, s: 58, c: "#59A9C4", a: "tt-bobA 6.8s", sw: 24, sh: "0 10px 22px rgba(89,169,196,.34)", b: 4 },
  { l: 86, t: 74, s: 64, c: "#F0B63B", a: "tt-bobB 7.4s", sw: 26, sh: "0 10px 22px rgba(240,182,59,.4)", b: 4 },
  { l: 18, t: 78, s: 56, c: "#D83744", a: "tt-bobA 6.5s", sw: 24, sh: "0 10px 22px rgba(216,55,68,.32)", b: 4 },
  { l: 14, t: 50, s: 46, c: "#8FBE4E", a: "tt-bobB 5.8s", sw: 20, sh: "0 8px 18px rgba(143,190,78,.36)", b: 3 },
];

const UserIcon = ({ size = 26, stroke = "#fff", sw = 2 }: { size?: number; stroke?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);

export default function EquipoPage() {
  return (
    <>
      {/* Hero Equipo */}
      <section className="equipo-hero">
        <div style={{ position: "absolute", top: -120, right: -40, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(240,182,59,.20), rgba(240,182,59,0) 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -140, left: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(89,169,196,.16), rgba(89,169,196,0) 70%)", pointerEvents: "none" }} />
        <div className="equipo-hero-grid">
          <div className="reveal">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", font: "700 0.75rem/1 var(--font-sans)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#8FBE4E" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8FBE4E" }} /> Nuestro equipo
            </span>
            <h1>Detrás de cada predio,<br /><span className="cy">hay un equipo</span> que lo hace posible</h1>
            <Editable as="p" id="equipo.intro" multiline>Un equipo humano y comprometido que trabaja cada día para que conocer y cuidar tu territorio sea más fácil, cercano y transparente.</Editable>
            <span className="ribbon5" style={{ margin: "26px 0 0", width: 140 }} />
          </div>

          <div className="hero-net reveal">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="net-lines">
              <g stroke="rgba(143,190,78,.45)" strokeWidth="0.4" fill="none" strokeLinecap="round" strokeDasharray="2 2.4">
                <line x1="50" y1="50" x2="20" y2="22" /><line x1="50" y1="50" x2="82" y2="20" />
                <line x1="50" y1="50" x2="86" y2="74" /><line x1="50" y1="50" x2="18" y2="78" />
                <line x1="50" y1="50" x2="14" y2="50" /><line x1="20" y1="22" x2="82" y2="20" />
                <line x1="86" y1="74" x2="18" y2="78" />
              </g>
            </svg>
            {NODES.map((n, i) => (
              <span key={i} className="net-node" style={{ left: `${n.l}%`, top: `${n.t}%`, width: n.s, height: n.s, background: n.c, boxShadow: n.sh, borderWidth: n.b, animation: `${n.a} ease-in-out infinite` }}>
                <UserIcon size={n.sw} sw={n.s <= 46 ? 2.2 : 2} />
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
