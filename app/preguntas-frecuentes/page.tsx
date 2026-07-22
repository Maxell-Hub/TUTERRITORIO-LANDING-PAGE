import type { Metadata } from "next";
import FaqExplorer from "@/components/faq/FaqExplorer";
import { FAQ_GRUPOS } from "@/components/faq/faq-data";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  alternates: { canonical: "/preguntas-frecuentes" },
  description:
    "Respuestas a las preguntas más frecuentes sobre trámites catastrales, avalúos, impuesto predial y PQRSD ante Tuterritorio — Catastro Multipropósito de Valledupar.",
};

export default function PreguntasFrecuentesPage() {
  // Datos estructurados FAQPage (schema.org) para los buscadores.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GRUPOS.flatMap((g) =>
      g.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.aText },
      }))
    ),
  };

  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/foto-preguntas.jpg" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/foto-preguntas-m.jpg" media="(max-width: 720px)" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-preguntas.jpg)", ["--hero-m" as string]: "url(/assets/foto-preguntas-m.jpg)", backgroundPosition: "center 55%" }}>
        <h1>Preguntas frecuentes</h1>
        <p className="sub">
          Resuelve tus dudas sobre trámites catastrales, avalúos, impuesto predial y PQRSD.
          Busca por palabra clave o explora por categoría.
        </p>
      </section>

      {/* Buscador, pestañas y acordeones (interactivo) */}
      <section className="fq-section">
        <FaqExplorer />
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-poporos.jpg)", ["--band-m" as string]: "url(/assets/foto-poporos-m.jpg)", backgroundPosition: "center 55%" }}
      >
        <div className="atg-wrap">
          <h2>¿No encontraste tu respuesta?</h2>
          <p>Escríbenos por cualquiera de nuestros canales y un miembro del equipo resolverá tu duda sobre tu predio o tu trámite.</p>
          <a className="atg-pill" href="/contactos">Contáctanos</a>
        </div>
      </section>
    </>
  );
}
