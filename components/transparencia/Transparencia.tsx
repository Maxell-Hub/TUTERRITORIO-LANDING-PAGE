import Link from "next/link";

const SITE_URL = "https://tuterritorio.gov.co";

/**
 * Plantilla compartida de las páginas de Transparencia. Reutiliza el patrón
 * visual de las páginas legales (.legal-hero / .legal-wrap / .legal-body) para
 * mantener la coherencia del sitio sin crear estilos nuevos.
 */
export function TPage({
  title,
  lead,
  eyebrow = "Transparencia y acceso a la información pública",
  children,
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  // Datos estructurados de ruta de exploración (Inicio › Transparencia › sección).
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Transparencia y acceso a la información pública", item: `${SITE_URL}/transparencia` },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };
  return (
    <section className="legal-hero t-hero">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="legal-wrap">
        <Link href="/transparencia" className="t-back">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          Volver a Transparencia
        </Link>
        <span className="legal-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {lead && <p className="legal-lead">{lead}</p>}
        <div className="legal-body">{children}</div>
      </div>
    </section>
  );
}

/**
 * Variante ATG de la plantilla de Transparencia: hero fotográfico tintado con
 * la foto de la Alcaldía (identidad institucional consistente) seguido de una
 * banda clara con el contenido. TPage se conserva sin cambios para las páginas
 * que aún usan el patrón legal.
 */
export function TPageATG({
  title,
  lead,
  eyebrow,
  children,
}: {
  title: string;
  lead?: string;
  /** Parte destacada del eyebrow: «Transparencia · <b>{eyebrow}</b>». */
  eyebrow: string;
  children: React.ReactNode;
}) {
  // Datos estructurados de ruta de exploración (Inicio › Transparencia › sección).
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Transparencia y acceso a la información pública", item: `${SITE_URL}/transparencia` },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };
  return (
    <>
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-alcaldia.jpg)" }}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <h1>{title}</h1>
        {lead && <p className="sub">{lead}</p>}
      </section>
      <section className="atg-band">
        <div className="atg-wrap" style={{ maxWidth: 880 }}>
          <Link href="/transparencia" className="t-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            Volver a Transparencia
          </Link>
          <div className="legal-body">{children}</div>
        </div>
      </section>
    </>
  );
}

/** Apartado con título (h2) dentro de una página de Transparencia.
 *  Se presenta como un panel/tarjeta para una lectura clara y organizada. */
export function Apartado({ titulo, id, children }: { titulo: string; id?: string; children: React.ReactNode }) {
  return (
    <section className="t-apt" id={id}>
      <h2 className="t-apt-title">{titulo}</h2>
      <div className="t-apt-body">{children}</div>
    </section>
  );
}

/** Enlace a un recurso/página que YA existe en el sitio (reutilización). */
export function RecursoExistente({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p className="t-reuse">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19" /></svg>
      <Link href={href}>{children}</Link>
    </p>
  );
}
