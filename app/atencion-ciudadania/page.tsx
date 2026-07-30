import type { Metadata } from "next";
import Link from "next/link";
import PendienteContenido from "@/components/common/PendienteContenido";
import Editable from "@/components/admin/Editable";

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
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/atencion/foto-atencion2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/atencion/foto-atencion2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atencion/foto-atencion2.webp)", ["--hero-m" as string]: "url(/assets/atencion/foto-atencion2-m.webp)", backgroundPosition: "center 15%" }}
      >
        <h1>
          Atención y servicios<br />a la ciudadanía
        </h1>
        <p className="sub">
          <Editable as="span" id="aten.hero-sub" multiline>Todos los canales para hacer trámites, comunicarte con nosotros y ejercer tus derechos, en un solo lugar.</Editable>
        </p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="/pqrsd"><Editable as="span" id="aten.hero-cta1">Radica tu PQRSD</Editable></a>
          <a className="atg-pill ghost" href="/contactos"><Editable as="span" id="aten.hero-cta2">Canales de atención</Editable></a>
        </div>
      </section>

      {/* 2 · Grid de canales de atención */}
      <section className="atg-band" id="canales">
        <div className="atg-wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <Editable as="h2" id="aten.canales-h2">Elige cómo quieres que te atendamos</Editable>
          </div>
          <div className="t-grid" style={{ marginTop: 0 }}>
            {ACCESOS.map((a, i) => (
              <Link key={a.href} href={a.href} className="t-card reveal" style={{ ["--accent" as string]: a.accent, ["--num-fg" as string]: "#ffffff" }}>
                <span className="t-num">{i + 1}</span>
                <span className="t-card-body">
                  <span className="t-card-title"><Editable as="span" id={`aten.acceso-${i}-title`}>{a.title}</Editable></span>
                  <span className="t-card-desc"><Editable as="span" id={`aten.acceso-${i}-desc`}>{a.desc}</Editable></span>
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
                <span className="t-card-title"><Editable as="span" id="aten.sede-title">Sede y horarios</Editable></span>
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
              <Editable as="h2" id="aten.faq-h2">Resuelve tus dudas sin salir de casa</Editable>
              <Editable as="p" id="aten.faq-p" multiline>Respuestas a las dudas más comunes de la ciudadanía sobre trámites catastrales, avalúos, impuesto predial y PQRSD.</Editable>
              <ul>
                <Editable as="li" id="aten.faq-li1">Trámites catastrales y avalúos</Editable>
                <Editable as="li" id="aten.faq-li2">Impuesto predial</Editable>
                <Editable as="li" id="aten.faq-li3">PQRSD y canales de atención</Editable>
              </ul>
              <a className="atg-pill" href="/preguntas-frecuentes"><Editable as="span" id="aten.faq-cta">Ver preguntas frecuentes</Editable></a>
            </div>
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <img className="atg-mock-photo" src="/assets/atencion/foto-dudas2.webp" srcSet="/assets/atencion/foto-dudas2-m.webp 860w, /assets/atencion/foto-dudas2.webp 1600w" sizes="(max-width: 900px) 100vw, 640px" alt="Ciudadano de Valledupar caminando por el centro de la ciudad" width={1600} height={1065} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Panel: carta de trato digno */}
      <section className="atg-band" id="carta-trato-digno">
        <div className="atg-wrap">
          <div className="atg-panel flip">
            <img className="photo" src="/assets/atencion/foto-digno2.webp" srcSet="/assets/atencion/foto-digno2-m.webp 860w, /assets/atencion/foto-digno2.webp 1600w" sizes="(max-width: 900px) 100vw, 640px" alt="Ciudadano leyendo la prensa en un parque de Valledupar" loading="lazy" decoding="async" />
            <div className="atg-copy reveal">
              <Editable as="h2" id="aten.carta-h2">Tus derechos, por escrito</Editable>
              <Editable as="p" id="aten.carta-p" multiline>Documento que describe los derechos de los ciudadanos y los medios para garantizarlos en su relación con la entidad (Ley 1437 de 2011, art. 7).</Editable>
              <a className="atg-pill" href="/docs/carta-trato-digno.pdf" target="_blank" rel="noopener noreferrer">
                <Editable as="span" id="aten.carta-cta">Ver la carta de trato digno (PDF)</Editable>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atencion/foto-mayo2.webp)", ["--band-m" as string]: "url(/assets/atencion/foto-mayo2-m.webp)", backgroundPosition: "center 55%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="aten.cierre-h2">¿No encontraste lo que buscabas?</Editable>
          <Editable as="p" id="aten.cierre-p" multiline>Radica tu petición, queja, reclamo, sugerencia o denuncia: cada solicitud queda con radicado y tiempos de respuesta según la ley.</Editable>
          <a className="atg-pill" href="/pqrsd"><Editable as="span" id="aten.cierre-cta">Radicar una PQRSD</Editable></a>
        </div>
      </section>
    </>
  );
}
