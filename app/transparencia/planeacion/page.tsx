import type { Metadata } from "next";
import { TPageATG, Apartado } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Planeación, presupuesto e informes — Transparencia",
  alternates: { canonical: "/transparencia/planeacion" },
  description: "Plan de acción, presupuesto, ejecución presupuestal e informes de gestión de Tuterritorio.",
};

export default function PlaneacionPage() {
  return (
    <TPageATG
      title="Planeación, presupuesto e informes"
      lead="Instrumentos de planeación y rendición de cuentas de la entidad."
      eyebrow="Sección 4"
      photo="foto-alfonso2"
      photoPos="center 48%"
    >
      <Apartado titulo="4.1 Plan de acción">
        <PendienteContenido titulo="Plan de acción anual" descripcion="Plan de acción de la vigencia pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="4.2 Presupuesto asignado">
        <PendienteContenido titulo="Presupuesto general asignado" descripcion="Presupuesto de la vigencia pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="4.3 Ejecución presupuestal">
        <PendienteContenido titulo="Informe de ejecución presupuestal" descripcion="Ejecución presupuestal pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="4.4 Informes de gestión">
        <PendienteContenido titulo="Informes de gestión y resultados" descripcion="Informes de gestión pendientes de cargar por la entidad." />
      </Apartado>
    </TPageATG>
  );
}
