import type { Metadata } from "next";
import Link from "next/link";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Atención y servicios a la ciudadanía",
  alternates: { canonical: "/atencion-ciudadania" },
  description:
    "Canales de atención, trámites y servicios, PQRSD, preguntas frecuentes y carta de trato digno de Tuterritorio — Catastro Multipropósito de Valledupar.",
};

const ACCESOS: { icon: React.ReactNode; accent: string; href: string; title: string; desc: string }[] = [
  {
    accent: "#3B85A5",
    href: "/servicios",
    title: "Trámites y servicios",
    desc: "Consulta los trámites y productos catastrales con sus requisitos, tiempos y costos.",
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></>,
  },
  {
    accent: "#4E8654",
    href: "/contactos",
    title: "Canales de atención",
    desc: "Escríbenos, llámanos o visítanos. Conoce nuestra sede y horarios de atención.",
    icon: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></>,
  },
  {
    accent: "#0C222F",
    href: "/pqrsd",
    title: "Radica tu PQRSD",
    desc: "Peticiones, quejas, reclamos, sugerencias y denuncias ante la entidad.",
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>,
  },
];

/** Estilos compartidos de las tarjetas blancas del grid de canales. */
const cardStyle: React.CSSProperties = {
  background: "var(--tt-white)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 16,
  padding: 24,
  boxShadow: "var(--shadow-sm)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  textDecoration: "none",
};

/**
 * Atención a la ciudadanía — estructura del diseño ATG:
 * hero fotográfico tintado → grid de canales → feature de preguntas
 * frecuentes → panel de carta de trato digno → franja de cierre con CTA.
 */
export default function AtencionCiudadaniaPage() {
  return (
    <>
      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atg/foto-panoramica.jpg)" }}
      >
        <span className="atg-eyebrow">Atención <b>a la ciudadanía</b></span>
        <h1>
          Atención y servicios<br />a la ciudadanía
        </h1>
        <p className="sub">
          Todos los canales para hacer trámites, comunicarte con nosotros y ejercer tus derechos, en un solo lugar.
        </p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="/pqrsd">Radica tu PQRSD</a>
          <a className="atg-pill ghost" href="/contactos">Canales de atención</a>
        </div>
      </section>

      {/* 2 · Grid de canales de atención */}
      <section className="atg-band" id="canales">
        <div className="atg-wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="atg-eyebrow" style={{ display: "block", marginBottom: 14 }}><b>01</b> · Canales de atención</span>
            <h2>Elige cómo quieres que te atendamos</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {ACCESOS.map((a) => (
              <Link key={a.href} href={a.href} className="reveal" style={cardStyle}>
                <span
                  aria-hidden="true"
                  style={{ width: 44, height: 44, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", background: a.accent, color: "#fff" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg>
                </span>
                <span style={{ font: "700 17px/1.3 var(--font-sans)", letterSpacing: "-0.01em", color: "var(--tt-navy-700)" }}>{a.title}</span>
                <span style={{ font: "400 13.5px/1.65 var(--font-sans)", color: "var(--tt-gray-500)" }}>{a.desc}</span>
              </Link>
            ))}

            {/* Sede, horarios y correo (datos oficiales del pie de página) */}
            <div className="reveal" style={cardStyle}>
              <span
                aria-hidden="true"
                style={{ width: 44, height: 44, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#F0B63B", color: "#fff" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </span>
              <span style={{ font: "700 17px/1.3 var(--font-sans)", letterSpacing: "-0.01em", color: "var(--tt-navy-700)" }}>Sede y horarios</span>
              <span style={{ font: "400 13.5px/1.65 var(--font-sans)", color: "var(--tt-gray-500)" }}>
                Calle 16 #9-48, Edificio Caja Agraria — Oficina 1301, Valledupar (Cesar).<br />
                Lunes a viernes de 8:00 a. m. a 12:00 m. y de 2:00 p. m. a 6:00 p. m.<br />
                <a href="mailto:contactenos@tuterritorio.gov.co" style={{ color: "var(--tt-blue-700)" }}>contactenos@tuterritorio.gov.co</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Feature: preguntas frecuentes */}
      <section className="atg-band" id="preguntas-frecuentes">
        <div className="atg-wrap">
          <div className="atg-feature flip">
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>02</b> · Preguntas frecuentes</span>
              <h2>Resuelve tus dudas sin salir de casa</h2>
              <p>
                Respuestas a las dudas más comunes de la ciudadanía sobre trámites catastrales, avalúos, impuesto predial y PQRSD.
              </p>
              <ul>
                <li>Trámites catastrales y avalúos</li>
                <li>Impuesto predial</li>
                <li>PQRSD y canales de atención</li>
              </ul>
              <a className="atg-pill" href="/preguntas-frecuentes">Ver preguntas frecuentes</a>
            </div>
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <div className="atg-mock-bar" aria-hidden="true">
                  <span className="d" /><span className="d" /><span className="d" />
                  <span className="title">preguntas-frecuentes — tuterritorio.gov.co</span>
                </div>
                {/* IMAGEN PENDIENTE: foto de atención al público en ventanilla de la sede */}
                <div style={{ height: 300, background: "var(--tt-gray-200)" }} role="img" aria-label="Imagen pendiente: atención al público en ventanilla" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Panel: carta de trato digno */}
      <section className="atg-band" id="carta-trato-digno">
        <div className="atg-wrap">
          <div className="atg-panel">
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>03</b> · Carta de trato digno</span>
              <h2>Tus derechos, por escrito</h2>
              <p>
                Documento que describe los derechos de los ciudadanos y los medios para garantizarlos en su relación con la entidad (Ley 1437 de 2011, art. 7).
              </p>
              <PendienteContenido titulo="Carta de trato digno" descripcion="Documento pendiente de cargar por la entidad." />
            </div>
            <img className="photo" src="/assets/atg/foto-alcaldia.jpg" alt="Fachada de la Alcaldía de Valledupar" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* 5 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atg/foto-territorio.jpg)" }}
      >
        <div className="atg-wrap">
          <span className="atg-eyebrow">Estamos <b>para servirte</b></span>
          <h2>¿No encontraste lo que buscabas?</h2>
          <p>
            Radica tu petición, queja, reclamo, sugerencia o denuncia: cada solicitud queda con radicado y tiempos de respuesta según la ley.
          </p>
          <a className="atg-pill" href="/pqrsd">Radicar una PQRSD</a>
        </div>
      </section>
    </>
  );
}
