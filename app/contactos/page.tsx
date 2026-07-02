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

          {/* Escena animada: tu mensaje viaja en avión de papel por una ruta
              punteada hasta el pin de nuestra sede */}
          <div className="ct-scene" aria-hidden="true">
            <svg className="ct-map" viewBox="0 0 440 340" fill="none">
              {/* Ruta de vuelo punteada (el guion fluye hacia la sede) */}
              <path
                id="ct-vuelo"
                className="ctp-route"
                d="M104 242 C 168 168, 236 216, 278 172 C 302 147, 316 126, 326 108"
                stroke="rgba(255,255,255,.4)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="3 11"
              />
              {/* Mensaje de origen: burbuja de chat que flota */}
              <g className="ctp-bubble">
                <rect x="40" y="212" width="70" height="50" rx="13" fill="#fff" />
                <path d="M58 262 l-9 14 18-5 Z" fill="#fff" />
                <g stroke="var(--tt-blue-700)" strokeWidth="3" strokeLinecap="round">
                  <path d="M54 230 h42" />
                  <path d="M54 243 h26" />
                </g>
              </g>
              {/* Destino: nuestra sede (pin) con ondas de llegada */}
              <circle className="ctp-ring" cx="348" cy="88" r="42" stroke="var(--tt-amber-500)" strokeWidth="2" />
              <circle className="ctp-ring r2" cx="348" cy="88" r="42" stroke="var(--tt-amber-500)" strokeWidth="2" />
              <circle cx="348" cy="88" r="36" fill="#fff" />
              <path d="M348 68c-9.4 0-17 7.3-17 16.3 0 11.6 17 25.7 17 25.7s17-14.1 17-25.7c0-9-7.6-16.3-17-16.3Z" fill="var(--tt-green-600)" />
              <circle cx="348" cy="85" r="6" fill="#fff" />
              {/* Avión de papel que recorre la ruta */}
              <g className="ctp-plane">
                <polygon points="2,0 -24,11 -14,0 -24,-11" fill="var(--tt-amber-500)" stroke="#0C222F" strokeWidth="2" strokeLinejoin="round" />
                <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#ct-vuelo" />
                </animateMotion>
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
