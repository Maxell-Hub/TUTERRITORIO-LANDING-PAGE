import type { Metadata } from "next";
import { TPageATG, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Normativa — Transparencia",
  alternates: { canonical: "/transparencia/normativa" },
  description: "Normas generales y reglamentarias que rigen a Tuterritorio y proyectos normativos para comentarios.",
};

export default function NormativaPage() {
  return (
    <TPageATG
      title="Normativa"
      lead="Marco legal que regula la gestión catastral y su aplicación en Valledupar."
      eyebrow="Sección 2"
    >
      <Apartado titulo="2.1 Normas generales y reglamentarias">
        <p>Las leyes, decretos, resoluciones y acuerdos que rigen la gestión catastral están publicados en la sección de Normativas, donde puedes consultarlos y descargarlos.</p>
        <RecursoExistente href="/recursos/normativas">Ver normativas</RecursoExistente>
      </Apartado>

      <Apartado titulo="2.2 Proyectos normativos para comentarios">
        <PendienteContenido titulo="Proyectos de actos administrativos en consulta" descripcion="Proyectos normativos abiertos a comentarios de la ciudadanía, pendientes de cargar por la entidad." />
      </Apartado>
    </TPageATG>
  );
}
