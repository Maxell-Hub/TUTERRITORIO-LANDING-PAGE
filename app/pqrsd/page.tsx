import type { Metadata } from "next";
import PqrsdForm from "@/components/pqrsd/PqrsdForm";

export const metadata: Metadata = {
  title: "Radica tu PQRSD — Tuterritorio",
  description:
    "Presenta tus Peticiones, Quejas, Reclamos, Sugerencias y Denuncias ante Tuterritorio, catastro de Valledupar.",
};

export default function PqrsdPage() {
  return (
    <>
      <section className="pq-hero">
        <div className="dots" />
        <div className="pq-hero-inner">
          <span className="hero-eyebrow">Atención a la ciudadanía</span>
          <h1>Radica tu PQRSD</h1>
          <p>
            Presenta tus Peticiones, Quejas, Reclamos, Sugerencias y Denuncias ante Tuterritorio.
            Completa el formulario y nuestro equipo dará trámite a tu solicitud.
          </p>
        </div>
      </section>

      <section className="pq-section">
        <div className="pq-form-wrap">
          <PqrsdForm />
        </div>
      </section>
    </>
  );
}
