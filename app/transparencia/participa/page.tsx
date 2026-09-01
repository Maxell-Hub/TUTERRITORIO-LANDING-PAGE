import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Participa — Transparencia",
  alternates: { canonical: "/transparencia/participa" },
  description: "Espacios de participación ciudadana en la gestión de Tuterritorio: diagnóstico, planeación, ejecución, control y rendición de cuentas.",
};

const SITE_URL = "https://tuterritorio.gov.co";

/* La tarjeta de fase (4.4) usa la clase .fase-card de globals.css,
   con estilos propios para modo claro y oscuro. */

/**
 * Participa (Transparencia) — estructura del diseño ATG:
 * hero fotográfico tintado → grid de fases de participación →
 * feature de control social (PQRSD) → panel de rendición de cuentas →
 * franja de cierre con CTA.
 */
export default function ParticipaPage() {
  // Datos estructurados de ruta de exploración (Inicio › Transparencia › Participa).
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Transparencia y acceso a la información pública", item: `${SITE_URL}/transparencia` },
      { "@type": "ListItem", position: 3, name: "Participa" },
    ],
  };

  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/transparencia/foto-socializacion4.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/transparencia/foto-socializacion4-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/transparencia/foto-socializacion4.webp)", ["--hero-m" as string]: "url(/assets/transparencia/foto-socializacion4-m.webp)", backgroundPosition: "center 40%" }}
      >
        <h1>
          Tu voz también<br />construye el territorio
        </h1>
        <p className="sub">
          <Editable as="span" id="part.hero-sub" multiline>Espacios para que la ciudadanía participe en las distintas fases de la gestión de la entidad.</Editable>
        </p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="/pqrsd"><Editable as="span" id="part.hero-cta1">Radicar una PQRSD</Editable></a>
          <a className="atg-pill ghost" href="/transparencia"><Editable as="span" id="part.hero-cta2">Volver a Transparencia</Editable></a>
        </div>
      </section>

      {/* 2 · Grid: fases de participación */}
      <section className="atg-band" id="fases">
        <div className="atg-wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <Editable as="h2" id="part.fases-h2">Participa en la gestión de la entidad</Editable>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,560px)", justifyContent: "center" }}>
            {/* 4.4 — control social vía PQRSD */}
            <div id="control-social" className="fase-card reveal">
              <Editable as="h3" id="part.control-h3">4.4 Control y evaluación de la gestión</Editable>
              <Editable as="p" id="part.control-p" multiline>Ejerce control social: presenta tus peticiones, quejas, reclamos, sugerencias y denuncias con radicado inmediato y tiempos de respuesta según la ley.</Editable>
              <a className="atg-pill" href="/pqrsd" style={{ marginTop: "auto", alignSelf: "flex-start" }}><Editable as="span" id="part.control-cta">Radicar una PQRSD</Editable></a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/transparencia/foto-iglesia2.webp)", ["--band-m" as string]: "url(/assets/transparencia/foto-iglesia2-m.webp)", backgroundPosition: "center 8%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="part.cierre-h2">La participación fortalece el catastro</Editable>
          <Editable as="p" id="part.cierre-p" multiline>Tus aportes, observaciones y solicitudes ayudan a construir un catastro multipropósito más transparente y cercano a la ciudadanía.</Editable>
          <a className="atg-pill" href="/contactos"><Editable as="span" id="part.cierre-cta">Contáctanos</Editable></a>
        </div>
      </section>
    </>
  );
}
