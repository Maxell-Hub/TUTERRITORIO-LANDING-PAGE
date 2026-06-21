import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";

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

const LIDERAZGO = [
  { g: "linear-gradient(135deg,#1E5167,#0C222F)", pill: "Dirección General", pillBg: "#EAF1F4", pillC: "#2A6580", role: "Directora(or) General" },
  { g: "linear-gradient(135deg,#3E6E44,#2E5E38)", pill: "Gestión Catastral", pillBg: "#EAF1EC", pillC: "#2E5E38", role: "Jefe de la Oficina de Gestión Catastral" },
];

const AREAS = [
  { c: "#3B85A5", t: "Topografía y campo", meta: "Levantamiento, reconocimiento predial y verificación de linderos · 8 integrantes", n: 8, icon: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></> },
  { c: "#4E8654", t: "Jurídica", meta: "Mutaciones, trámites y seguridad jurídica de la propiedad · 5 integrantes", n: 5, icon: <><path d="M3 21h18M6 21V8l6-4 6 4v13M9 21v-6h6v6" /></> },
  { c: "#E0A526", t: "Sistemas y datos", meta: "Información geográfica, bases de datos y plataformas digitales · 6 integrantes", n: 6, icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></> },
  { c: "#D83744", t: "Atención al ciudadano", meta: "Orientación, recepción de solicitudes y acompañamiento · 6 integrantes", n: 6, icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> },
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

      {/* Liderazgo */}
      <section className="sec-pad" style={{ background: "#fff" }}>
        <div className="sec-wrap">
          <div className="reveal" style={{ maxWidth: "46rem", margin: "0 auto 48px", textAlign: "center" }}>
            <span className="eyebrow-b">Liderazgo</span>
            <Editable as="h2" id="equipo.lead-title" className="h2-nos">Quienes orientan nuestra gestión</Editable>
            <span className="ribbon5 center" style={{ marginTop: 18, width: 110, height: 4 }} />
          </div>
          <div className="lead-grid reveal">
            {LIDERAZGO.map((l) => (
              <div key={l.pill} className="member lift lead-card">
                <div className="lead-photo" style={{ background: l.g, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserIcon size={56} stroke="rgba(255,255,255,.55)" sw={1.5} />
                </div>
                <div style={{ padding: "26px 24px 30px" }}>
                  <span className="lead-pill" style={{ background: l.pillBg, color: l.pillC }}>{l.pill}</span>
                  <h3 style={{ margin: "14px 0 0", font: "700 1.3125rem/1.25 var(--font-sans)", color: "var(--tt-navy-700)" }}>Nombre Apellido</h3>
                  <p style={{ margin: "6px 0 0", font: "400 0.9375rem/1.4 var(--font-sans)", color: "var(--tt-gray-500)" }}>{l.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo técnico (por áreas) */}
      <section className="sec-pad" style={{ background: "var(--tt-gray-50)", paddingBottom: "clamp(5rem,9vw,8rem)" }}>
        <div className="sec-wrap">
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
            <div style={{ maxWidth: "46rem" }}>
              <span className="eyebrow-b">Equipo técnico</span>
              <Editable as="h2" id="equipo.tech-title" className="h2-nos">Un equipo interdisciplinario</Editable>
              <p style={{ margin: "16px 0 0", font: "400 1.0625rem/1.6 var(--font-sans)", color: "var(--tt-gray-700)" }}><Editable as="span" id="equipo.tech-intro" multiline>Más de 25 profesionales organizados por áreas de especialidad, trabajando de forma coordinada en cada etapa del proceso catastral.</Editable></p>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ font: "800 clamp(2.6rem,5vw,3.6rem)/1 var(--font-sans)", color: "#3B85A5" }}>+25</span>
              <span style={{ font: "600 0.9375rem/1.2 var(--font-sans)", color: "var(--tt-gray-500)" }}>profesionales</span>
            </div>
          </div>

          <div className="team-stack">
            {AREAS.map((area) => (
              <div key={area.t} className="reveal team-area" style={{ borderLeft: `5px solid ${area.c}` }}>
                <div className="head">
                  <span className="ic" style={{ background: area.c }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{area.icon}</svg>
                  </span>
                  <div>
                    <h3>{area.t}</h3>
                    <p className="meta">{area.meta}</p>
                  </div>
                </div>
                <div className="avatar-grid">
                  {Array.from({ length: area.n }).map((_, i) => (
                    <div key={i} className="member">
                      <div className="avatar-ph"><UserIcon size={34} stroke="#A9B6BF" sw={1.6} /></div>
                      <span className="cap">Nombre Apellido<small className="role">Cargo / perfil</small></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ margin: "22px 0 0", font: "400 0.875rem/1.5 var(--font-sans)", color: "#9AA3AB" }}>* Áreas e integrantes son referenciales; las fotos y nombres se reemplazan con datos reales (idealmente desde el CMS).</p>
        </div>
      </section>
    </>
  );
}
