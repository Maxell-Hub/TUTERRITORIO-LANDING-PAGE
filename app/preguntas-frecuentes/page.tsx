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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero institucional con la trama catastral de la marca */}
      <section className="fq-hero">
        <div className="fq-hero-inner">
          <span className="rec-eyebrow">Atención a la ciudadanía</span>
          <h1>Preguntas frecuentes</h1>
          <span className="fq-hero-ribbon" aria-hidden="true" />
          <p>
            Resuelve tus dudas sobre trámites catastrales, avalúos, impuesto predial y PQRSD.
            Busca por palabra clave o explora por categoría.
          </p>
        </div>
      </section>

      {/* Buscador, pestañas y acordeones (interactivo) */}
      <section className="fq-section">
        <FaqExplorer />
      </section>
    </>
  );
}
