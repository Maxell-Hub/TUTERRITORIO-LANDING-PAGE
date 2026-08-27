import type { Metadata } from "next";
import { TPageATG, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";

export const metadata: Metadata = {
  title: "Normativa — Transparencia",
  alternates: { canonical: "/transparencia/normativa" },
  description: "Normas generales y reglamentarias que rigen a Tuterritorio y proyectos normativos para comentarios.",
};

export default function NormativaPage() {
  return (
    <TPageATG
      editKey="transp-normativa"
      title="Normativa"
      lead="Marco legal que regula la gestión catastral y su aplicación en Valledupar."
      eyebrow="Sección 2"
      photo="transparencia/foto-sirena2"
      photoPos="center 55%"
    >
      <Apartado titulo="2.1 Normas generales y reglamentarias">
        <p>Las leyes, decretos, resoluciones y acuerdos que rigen la gestión catastral están publicados en la sección de Normativas, donde puedes consultarlos y descargarlos.</p>
        <RecursoExistente href="/recursos/normativas">Ver normativas</RecursoExistente>
      </Apartado>
    </TPageATG>
  );
}
