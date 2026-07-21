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
      {/* 1 · Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-canales.jpg)", backgroundPosition: "center 55%" }}>
        <h1>Contáctenos</h1>
        <p className="sub">
          Conectamos personas, transformamos lugares. Escríbenos tu solicitud sobre tu predio
          y un miembro de nuestro equipo te responderá. También puedes visitarnos en nuestra sede principal.
        </p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="#formulario">Escríbenos</a>
          <a className="atg-pill ghost" href="#mapa">Cómo llegar</a>
        </div>
      </section>

      {/* 2 · Canales de atención: tarjetas de datos de contacto */}
      <section className="atg-band">
        <div className="atg-wrap">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2>Todos los canales, a tu alcance</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            <div className="atg-mock reveal" style={{ padding: "26px 24px" }}>
              <div className="atg-copy">
                <p>Edificio Caja Agraria — Oficina 1301, Calle 16 #9-48, en pleno centro de Valledupar, Cesar.</p>
              </div>
            </div>
            <div className="atg-mock reveal" style={{ padding: "26px 24px" }}>
              <div className="atg-copy">
                <p>Lunes a viernes de 8:00 a.m. a 6:00 p.m.</p>
              </div>
            </div>
            <div className="atg-mock reveal" style={{ padding: "26px 24px" }}>
              <div className="atg-copy">
                <p><a href="mailto:contactenos@tuterritorio.gov.co" style={{ color: "inherit" }}>contactenos@tuterritorio.gov.co</a></p>
              </div>
            </div>
            <div className="atg-mock reveal" style={{ padding: "26px 24px" }}>
              <div className="atg-copy">
                <p>(605) 5885761 Ext. 100</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Formulario de contacto */}
      <section className="atg-band" id="formulario">
        <div className="atg-wrap">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2>Cuéntanos qué necesitas</h2>
          </div>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <ContactoForm />
          </div>
        </div>
      </section>

      {/* 4 · Sede y mapa */}
      <section className="atg-band" id="mapa">
        <div className="atg-wrap">
          <div className="atg-panel reveal">
            <div className="atg-copy">
              <h2>Edificio Caja Agraria — Oficina 1301</h2>
              <p>Calle 16 #9-48, en pleno centro de Valledupar, Cesar.</p>
              <ul>
                <li>Atención presencial de lunes a viernes</li>
                <li>De 8:00 a.m. a 6:00 p.m.</li>
              </ul>
              <a className="atg-pill" href="https://maps.app.goo.gl/M3GqdiRtVDRVe9NFA" target="_blank" rel="noopener noreferrer">Ver en Google Maps</a>
            </div>
            <img className="photo" src="/assets/img-caja.jpg" alt="Sede de Tuterritorio — Edificio Caja Agraria, Valledupar" loading="lazy" decoding="async" width={1300} height={865} />
          </div>

          <div className="atg-mock reveal" style={{ marginTop: 40 }}>
            <iframe title="Mapa Sede Tuterritorio" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ display: "block", width: "100%", height: 420, border: 0 }} />
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
