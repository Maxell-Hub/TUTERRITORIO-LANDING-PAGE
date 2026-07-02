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

          {/* Escena animada: plano catastral con el pin de "encuéntranos"
              sobre el predio ámbar, en el lenguaje del imagotipo */}
          <div className="ct-scene" aria-hidden="true">
            <svg className="ct-map" viewBox="0 0 440 380" fill="none">
              {/* Hoja del plano */}
              <rect x="28" y="44" width="384" height="292" rx="18" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" />
              {/* Predios tintados */}
              <path className="ctm-parcel" d="M164 142 L284 152 L288 224 L168 236 Z" fill="#F0B63B" />
              <path d="M40 146 L140 140 L146 238 L40 230 Z" fill="#8FBE4E" fillOpacity=".22" />
              <path d="M304 152 L400 144 L400 226 L308 224 Z" fill="#59A9C4" fillOpacity=".2" />
              {/* Calles */}
              <g stroke="rgba(255,255,255,.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M28 138 L152 130 L294 142 L412 132" />
                <path d="M28 240 L158 248 L298 234 L412 246" />
                <path d="M148 44 L152 130 L158 248 L150 336" />
                <path d="M290 44 L294 142 L298 234 L304 336" />
              </g>
              {/* Sombra, ondas de ubicación y pin */}
              <ellipse className="ctm-shadow" cx="226" cy="194" rx="13" ry="4.5" fill="rgba(0,0,0,.32)" />
              <circle className="ctm-ring" cx="226" cy="190" r="24" stroke="#F0B63B" strokeWidth="2" />
              <circle className="ctm-ring r2" cx="226" cy="190" r="24" stroke="#F0B63B" strokeWidth="2" />
              <g className="ctm-pin">
                <path d="M226 106c-21 0-36 15-36 35 0 24 36 49 36 49s36-25 36-49c0-20-15-35-36-35Z" fill="var(--tt-amber-500)" stroke="#0C222F" strokeWidth="3" />
                <circle cx="226" cy="142" r="12" fill="#0C222F" />
              </g>
            </svg>
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
              <img src="/assets/img-caja.jpg" alt="Sede de Tuterritorio — Edificio Caja Agraria, Valledupar" style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
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
            <iframe title="Mapa Sede Tuterritorio" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
    </>
  );
}
