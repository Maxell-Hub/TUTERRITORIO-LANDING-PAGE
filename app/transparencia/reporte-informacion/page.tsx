import type { Metadata } from "next";
import { TPageATG, Apartado } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Obligación de reporte de información — Transparencia",
  alternates: { canonical: "/transparencia/reporte-informacion" },
  description: "Información que Tuterritorio debe reportar por ley a organismos de control y entidades del Estado.",
};

export default function ReporteInformacionPage() {
  return (
    <TPageATG
      title="Obligación de reporte de información"
      lead="Información que la entidad reporta a organismos de control y entidades del Estado en cumplimiento de la ley."
      eyebrow="Sección 9"
    >
      <Apartado titulo="9.1 Información reportada por la entidad">
        <PendienteContenido titulo="Reportes de ley" descripcion="Relación de los reportes que la entidad presenta por obligación legal, pendiente de cargar por la entidad." />
      </Apartado>
    </TPageATG>
  );
}
