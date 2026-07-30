import type { Metadata } from "next";
import ContactoForm from "@/components/contacto/ContactoForm";
import Editable from "@/components/admin/Editable";

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
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/contactos/foto-canales2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/contactos/foto-canales2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* 1 · Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/contactos/foto-canales2.webp)", ["--hero-m" as string]: "url(/assets/contactos/foto-canales2-m.webp)", backgroundPosition: "center 9%" }}>
        <Editable as="h1" id="cont.h1">Contáctenos</Editable>
        <p className="sub">
          <Editable as="span" id="cont.hero-sub" multiline>Conectamos personas, transformamos lugares. Escríbenos tu solicitud sobre tu predio y un miembro de nuestro equipo te responderá. También puedes visitarnos en nuestra sede principal.</Editable>
        </p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="#formulario"><Editable as="span" id="cont.hero-cta1">Escríbenos</Editable></a>
          <a className="atg-pill ghost" href="#mapa"><Editable as="span" id="cont.hero-cta2">Cómo llegar</Editable></a>
        </div>
      </section>

      {/* 2 · Formulario de contacto */}
      <section className="atg-band" id="formulario">
        <div className="atg-wrap">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <Editable as="h2" id="cont.form-h2">Cuéntanos qué necesitas</Editable>
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
              <Editable as="h2" id="cont.sede-h2">Edificio Caja Agraria — Oficina 1301</Editable>
              <Editable as="p" id="cont.sede-p">Calle 16 #9-48, en pleno centro de Valledupar, Cesar.</Editable>
              <ul>
                <Editable as="li" id="cont.sede-li1">Atención presencial de lunes a viernes</Editable>
                <Editable as="li" id="cont.sede-li2">De 8:00 a.m. - 12:00 m. y 2:00 p.m. - 6:00 p.m.</Editable>
              </ul>
              <a className="atg-pill" href="https://maps.app.goo.gl/M3GqdiRtVDRVe9NFA" target="_blank" rel="noopener noreferrer"><Editable as="span" id="cont.sede-cta">Ver en Google Maps</Editable></a>
            </div>
            <img className="photo" src="/assets/contactos/img-caja2.webp" srcSet="/assets/contactos/img-caja2-m.webp 860w, /assets/contactos/img-caja2.webp 1600w" sizes="(max-width: 900px) 100vw, 640px" alt="Sede de Tuterritorio — Edificio Caja Agraria, Valledupar" loading="lazy" decoding="async" width={1300} height={865} />
          </div>

          <div className="atg-mock reveal" style={{ marginTop: 40 }}>
            <iframe title="Mapa Sede Tuterritorio" className="map-embed" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ display: "block", width: "100%", height: 420, border: 0 }} />
          </div>
        </div>
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/contactos/foto-obelisco2.webp)", ["--band-m" as string]: "url(/assets/contactos/foto-obelisco2-m.webp)", backgroundPosition: "center 30%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="cont.cierre-h2">También puedes radicar en línea</Editable>
          <Editable as="p" id="cont.cierre-p" multiline>Si prefieres no desplazarte, radica tu petición, queja o reclamo desde cualquier lugar y haz seguimiento con tu número de radicado.</Editable>
          <a className="atg-pill" href="/pqrsd"><Editable as="span" id="cont.cierre-cta">Radicar una PQRSD</Editable></a>
        </div>
      </section>
    </>
  );
}
