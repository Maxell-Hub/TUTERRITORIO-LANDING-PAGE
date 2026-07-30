import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import FaqExplorer from "@/components/faq/FaqExplorer";
import { readContent } from "@/lib/store";
import { DEFAULT_FAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  alternates: { canonical: "/preguntas-frecuentes" },
  description:
    "Respuestas a las preguntas más frecuentes sobre trámites catastrales, avalúos, impuesto predial y PQRSD ante Tuterritorio — Catastro Multipropósito de Valledupar.",
};

export default async function PreguntasFrecuentesPage() {
  // Lee las preguntas del contenido editable (o las semillas por defecto).
  const faqs = await readContent("faq", DEFAULT_FAQ);
  // Datos estructurados FAQPage (schema.org) para los buscadores.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/faq/foto-preguntas2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/faq/foto-preguntas2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/faq/foto-preguntas2.webp)", ["--hero-m" as string]: "url(/assets/faq/foto-preguntas2-m.webp)", backgroundPosition: "center 55%" }}>
        <Editable as="h1" id="faq.h1">Preguntas frecuentes</Editable>
        <p className="sub">
          <Editable as="span" id="faq.hero-sub" multiline>Resuelve tus dudas sobre trámites catastrales, avalúos, impuesto predial y PQRSD. Busca por palabra clave o explora por categoría.</Editable>
        </p>
      </section>

      {/* Buscador, pestañas y acordeones (interactivo) */}
      <section className="fq-section">
        <FaqExplorer />
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/faq/foto-poporos2.webp)", ["--band-m" as string]: "url(/assets/faq/foto-poporos2-m.webp)", backgroundPosition: "center 55%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="faq.cierre-h2">¿No encontraste tu respuesta?</Editable>
          <Editable as="p" id="faq.cierre-p" multiline>Escríbenos por cualquiera de nuestros canales y un miembro del equipo resolverá tu duda sobre tu predio o tu trámite.</Editable>
          <a className="atg-pill" href="/contactos"><Editable as="span" id="faq.cierre-cta">Contáctanos</Editable></a>
        </div>
      </section>
    </>
  );
}
