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
          <span className="rec-eyebrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tt-lime-400)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M9.2 9a2.8 2.8 0 0 1 5.5.7c0 1.8-2.7 2.3-2.7 3.8" /><path d="M12 17h.01" />
            </svg>
            Atención a la ciudadanía
          </span>
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
