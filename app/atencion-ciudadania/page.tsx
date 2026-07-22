import type { Metadata } from "next";
import Link from "next/link";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Atención y servicios a la ciudadanía",
  alternates: { canonical: "/atencion-ciudadania" },
  description:
    "Canales de atención, trámites y servicios, PQRSD, preguntas frecuentes y carta de trato digno de Tuterritorio — Catastro Multipropósito de Valledupar.",
};

/* Canales de atención — mismas tarjetas numeradas del hub de Transparencia
   (t-card: número de color, borde de acento y flecha), sin íconos. */
const ACCESOS: { accent: string; href: string; title: string; desc: string }[] = [
  {
    accent: "#4E8654",
    href: "/servicios",
    title: "Trámites y servicios",
    desc: "Consulta los trámites y productos catastrales con sus requisitos, tiempos y costos.",
  },
  {
    accent: "#3B85A5",
    href: "/contactos",
    title: "Canales de atención",
    desc: "Escríbenos, llámanos o visítanos. Conoce nuestra sede y horarios de atención.",
  },
  {
    accent: "#F0B63B",
    href: "/pqrsd",
    title: "Radica tu PQRSD",
    desc: "Peticiones, quejas, reclamos, sugerencias y denuncias ante la entidad.",
  },
];

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
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-atencion.jpg)", backgroundPosition: "center 15%" }}
      >
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
            <h2>Elige cómo quieres que te atendamos</h2>
          </div>
          <div className="t-grid" style={{ marginTop: 0 }}>
            {ACCESOS.map((a, i) => (
              <Link key={a.href} href={a.href} className="t-card reveal" style={{ ["--accent" as string]: a.accent, ["--num-fg" as string]: "#ffffff" }}>
                <span className="t-num">{i + 1}</span>
                <span className="t-card-body">
                  <span className="t-card-title">{a.title}</span>
                  <span className="t-card-desc">{a.desc}</span>
                </span>
                <span className="t-card-go" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
            ))}

            {/* Sede, horarios y correo (datos oficiales del pie de página) */}
            <div className="t-card reveal" style={{ ["--accent" as string]: "#4E8654", ["--num-fg" as string]: "#ffffff", cursor: "default" }}>
              <span className="t-num">4</span>
              <span className="t-card-body">
                <span className="t-card-title">Sede y horarios</span>
                <span className="t-card-desc">
                  Calle 16 #9-48, Edificio Caja Agraria — Oficina 1301, Valledupar (Cesar).<br />
                  Lunes a viernes de 8:00 a. m. a 12:00 m. y de 2:00 p. m. a 6:00 p. m.<br />
                  <a href="mailto:contactenos@tuterritorio.gov.co" style={{ color: "var(--tt-blue-700)" }}>contactenos@tuterritorio.gov.co</a>
                </span>
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
              <h2>Tus derechos, por escrito</h2>
              <p>
                Documento que describe los derechos de los ciudadanos y los medios para garantizarlos en su relación con la entidad (Ley 1437 de 2011, art. 7).
              </p>
              <PendienteContenido titulo="Carta de trato digno" descripcion="Documento pendiente de cargar por la entidad." />
            </div>
            <img className="photo" src="/assets/foto-alcaldia.jpg" alt="Fachada de la Alcaldía de Valledupar" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* 5 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-mayo.jpg)", backgroundPosition: "center 55%" }}
      >
        <div className="atg-wrap">
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
