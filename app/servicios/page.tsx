import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import TramitesBuscador from "@/components/servicios/TramitesBuscador";
import TramitesGrid from "@/components/servicios/TramitesGrid";
import AvisoGestorModal from "@/components/site/AvisoGestorModal";
import { AvisoTramitesBody } from "@/components/site/AvisoTramites";
import { readContent } from "@/lib/store";
import { DEFAULT_TRAMITES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Trámites y servicios",
  alternates: { canonical: "/servicios" },
  description:
    "Trámites y productos catastrales de Tuterritorio (Catastro de Valledupar): actualiza, corrige y consulta información de predios y propietarios.",
};

const SITE_URL = "https://www.tuterritorio.gov.co";

/**
 * Servicios — estructura del diseño ATG:
 * hero fotográfico tintado → banda con la grilla de trámites (editable por el
 * administrador) → franja fotográfica de cierre con CTA a PQRSD.
 */
export default async function ServiciosPage() {
  // Lee el catálogo de trámites del contenido editable (o las semillas).
  const tramites = await readContent("tramites", DEFAULT_TRAMITES);

  // Datos estructurados: servicio público catastral + catálogo de trámites.
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: "Trámites y servicios catastrales",
    serviceType: "Gestión catastral multipropósito",
    description:
      "Trámites y productos catastrales de Tuterritorio (Catastro Multipropósito de Valledupar): incorporación y rectificación de área, englobe, desenglobe, cambios de propietario y destino, y certificados catastrales.",
    url: `${SITE_URL}/servicios`,
    areaServed: { "@type": "City", name: "Valledupar" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}/servicios`,
      servicePhone: "+576055885761",
    },
    provider: { "@type": "GovernmentOrganization", name: "Tuterritorio", url: SITE_URL },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de trámites catastrales",
      itemListElement: tramites.map((t) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: t.title, description: t.desc },
        ...(t.costo === "Sin costo" ? { price: 0, priceCurrency: "COP" } : {}),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* Aviso modal que aparece al entrar a Trámites y servicios */}
      <AvisoGestorModal labelledBy="aviso-tramites-modal-titulo">
        <AvisoTramitesBody titleId="aviso-tramites-modal-titulo" />
      </AvisoGestorModal>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/servicios/foto-tramites2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/servicios/foto-tramites2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/servicios/foto-tramites2.webp)", ["--hero-m" as string]: "url(/assets/servicios/foto-tramites2-m.webp)", backgroundPosition: "center 45%" }}
      >
        <Editable as="h1" id="serv.title">Trámites y servicios</Editable>
        <p className="sub"><Editable as="span" id="serv.intro" multiline>Actualiza, corrige y consulta la información de predios y propietarios. Cada trámite indica sus requisitos y su tiempo de respuesta en días hábiles.</Editable></p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="#tramites"><Editable as="span" id="serv.hero-cta1">Ver los trámites</Editable></a>
          <a className="atg-pill ghost" href="/pqrsd"><Editable as="span" id="serv.hero-cta2">Radicar una PQRSD</Editable></a>
        </div>
      </section>

      {/* 2 · Banda: grilla de trámites */}
      <section className="atg-band" id="tramites">
        <div className="atg-wrap">
          <div className="reveal" style={{ maxWidth: "46rem" }}>
            <Editable as="h2" id="serv.section-title">Selecciona el trámite que necesitas</Editable>
            <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--tt-gray-500)" }}>
              <Editable as="span" id="serv.section-intro" multiline>¿Quieres saber qué necesitas? Haz clic o pasa el cursor sobre un trámite para ver sus documentos y requisitos.</Editable>
            </p>
          </div>

          {/* Buscador en vivo de trámites */}
          <TramitesBuscador />

          {/* Grilla de trámites (editable por el administrador) */}
          <TramitesGrid />

          <p className="serv-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <Editable as="span" id="serv.precio-nota">Los valores de los productos catastrales son establecidos por la Alcaldía de Valledupar, entidad ante la cual se realiza el pago de forma directa mediante su cuenta bancaria oficial o los datáfonos dispuestos para tal fin.</Editable>
          </p>
        </div>
      </section>

      {/* 3 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/servicios/foto-plaza2.webp)", ["--band-m" as string]: "url(/assets/servicios/foto-plaza2-m.webp)", backgroundPosition: "center 10%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="serv.cierre-h2">¿No encontraste lo que buscabas?</Editable>
          <Editable as="p" id="serv.cierre-p" multiline>Radica tu petición, queja, reclamo, sugerencia o denuncia. Cada solicitud queda con radicado y tiempos de respuesta según la ley.</Editable>
          <a className="atg-pill" href="/pqrsd"><Editable as="span" id="serv.cierre-cta">Radicar una PQRSD</Editable></a>
        </div>
      </section>
    </>
  );
}
