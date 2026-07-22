import type { Metadata } from "next";
import PqrsdForm from "@/components/pqrsd/PqrsdForm";

export const metadata: Metadata = {
  title: "Radica tu PQRSD",
  alternates: { canonical: "/pqrsd" },
  description:
    "Presenta tus Peticiones, Quejas, Reclamos, Sugerencias y Denuncias ante Tuterritorio, catastro de Valledupar.",
};

/**
 * PQRSD — estructura del diseño ATG:
 * hero fotográfico tintado → banda con el formulario de radicación
 * → franja fotográfica de cierre con CTA a preguntas frecuentes.
 */
export default function PqrsdPage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/foto-radica.jpg" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/foto-radica-m.jpg" media="(max-width: 720px)" fetchPriority="high" />
      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-radica.jpg)", ["--hero-m" as string]: "url(/assets/foto-radica-m.jpg)", backgroundPosition: "center 30%" }}
      >
        <h1>Radica tu PQRSD</h1>
        <p className="sub">
          Presenta tus Peticiones, Quejas, Reclamos, Sugerencias y Denuncias ante Tuterritorio.
          Completa el formulario y nuestro equipo dará trámite a tu solicitud.
        </p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="#formulario">Diligenciar el formulario</a>
          <a className="atg-pill ghost" href="/preguntas-frecuentes">Preguntas frecuentes</a>
        </div>
      </section>

      {/* 2 · Banda: formulario de radicación */}
      <section className="atg-band" id="formulario">
        <div className="atg-wrap">
          <div className="reveal" style={{ maxWidth: 880, margin: "0 auto" }}>
            <PqrsdForm />
          </div>
        </div>
      </section>

      {/* 3 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-juglares.jpg)", backgroundPosition: "center 83%" }}
      >
        <div className="atg-wrap">
          <h2>Resuelve tus dudas antes de radicar</h2>
          <p>Consulta el ABC catastral y las respuestas a las preguntas más comunes sobre trámites, avalúos y el catastro de Valledupar.</p>
          <a className="atg-pill" href="/preguntas-frecuentes">Ver preguntas frecuentes</a>
        </div>
      </section>
    </>
  );
}
