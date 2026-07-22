import type { Metadata } from "next";
import ContactoForm from "@/components/contacto/ContactoForm";

export const metadata: Metadata = {
  title: "Contáctenos",
  alternates: { canonical: "/contactos" },
  description:
    "Escríbenos tu solicitud sobre tu predio, visita nuestra sede en Valledupar o encuéntranos en el mapa. Estamos para servirte.",
};

const MAP_SRC =
  "https://www.google.com/maps?q=Calle%2016%20%239-48%2C%20Edificio%20Caja%20Agraria%2C%20Valledupar%2C%20Cesar&output=embed";

export default function ContactosPage() {
  return (
    <>
      {/* HERO */}
      <section className="ct-hero">
        <svg className="ct-swoosh" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0 120 L0 64 C 360 8 1080 8 1440 64 L1440 120 Z" fill="#fff" /></svg>

        <div className="ct-hero-grid">
          <div>
            <p className="ct-eyebrow">Estamos para servirte</p>
            <h1>Contáctenos</h1>
            <div className="ribbon" />
            <p>Conectamos personas, transformamos lugares. Escríbenos tu solicitud sobre tu predio y un miembro de nuestro equipo te responderá. También puedes visitarnos en nuestra sede principal.</p>
            <a href="#formulario" className="ct-cta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              Escríbenos
            </a>
          </div>

          {/* Escena animada de contacto */}
          <div className="ct-scene" aria-hidden="true">
            <svg width="320" height="320" viewBox="0 0 320 320" style={{ position: "absolute", opacity: 0.5 }}>
              <circle className="ct-arc" cx="160" cy="160" r="120" fill="none" stroke="var(--tt-amber-500)" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" style={{ animation: "ct-dash 3s linear infinite" }} />
            </svg>
            <div className="ct-badge">
              <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="var(--tt-blue-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8" /><path d="M8 13h5" /></svg>
            </div>
            <div className="ct-bubble" style={{ top: 30, right: 28, background: "var(--tt-amber-500)", borderRadius: "14px 14px 14px 4px", animation: "ct-float1 5s var(--ease-soft) infinite" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--tt-navy-900)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <div className="ct-bubble" style={{ bottom: 44, left: 22, background: "var(--tt-green-600)", borderRadius: "14px 14px 4px 14px", animation: "ct-float2 6s var(--ease-soft) infinite" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO + SEDE */}
      <section id="formulario" className="ct-form-section">
        <div className="ct-grid">
          <ContactoForm />

          <div className="ct-sede">
            <h2 style={{ marginBottom: 16 }}>Nuestra sede</h2>
            <div className="ct-sede-card">
              <img src="/assets/img-caja.jpg" alt="Sede de Tuterritorio — Edificio Caja Agraria, Valledupar" loading="lazy" decoding="async" width={1300} height={865} style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
              <div className="ct-sede-foot">
                <span className="ct-sede-pin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <div>
                  <p style={{ margin: "0 0 3px", font: "700 1rem/1.3 var(--font-sans)", color: "var(--tt-navy-700)" }}>Edificio Caja Agraria — Oficina 1301</p>
                  <p style={{ margin: 0, font: "400 0.875rem/1.5 var(--font-sans)", color: "var(--tt-gray-700)" }}>Calle 16 #9-48, en pleno centro de Valledupar, Cesar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="ct-map-section">
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <div className="ct-map-head">
            <div>
              <h2>¿Cómo llegar?</h2>
              <div style={{ width: 100, height: 4, borderRadius: 3, background: "var(--ribbon)" }} />
            </div>
            <a className="ct-maps-btn" href="https://maps.app.goo.gl/M3GqdiRtVDRVe9NFA" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              Ver en Google Maps
            </a>
          </div>
          <div className="ct-map-frame">
            <iframe title="Mapa Sede Tuterritorio" className="map-embed" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-obelisco.jpg)", backgroundPosition: "center 45%" }}
      >
        <div className="atg-wrap">
          <h2>También puedes radicar en línea</h2>
          <p>Si prefieres no desplazarte, radica tu petición, queja o reclamo desde cualquier lugar y haz seguimiento con tu número de radicado.</p>
          <a className="atg-pill" href="/pqrsd">Radicar una PQRSD</a>
        </div>
      </section>
    </>
  );
}
