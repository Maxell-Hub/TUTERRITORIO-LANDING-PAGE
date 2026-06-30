import type { Metadata } from "next";
import { TPage, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Participa — Transparencia",
  alternates: { canonical: "/transparencia/participa" },
  description: "Espacios de participación ciudadana en la gestión de Tuterritorio: diagnóstico, planeación, ejecución, control y rendición de cuentas.",
};

export default function ParticipaPage() {
  return (
    <TPage
      title="Participa"
      lead="Espacios para que la ciudadanía participe en las distintas fases de la gestión de la entidad."
    >
      <Apartado titulo="6.1 Diagnóstico e identificación de problemas">
        <PendienteContenido titulo="Espacios de diagnóstico participativo" descripcion="Información pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="6.2 Planeación y presupuesto participativo">
        <PendienteContenido titulo="Espacios de planeación participativa" descripcion="Información pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="6.3 Ejecución de programas y proyectos">
        <PendienteContenido titulo="Participación en la ejecución" descripcion="Información pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="6.4 Control y evaluación de la gestión">
        <p>Puedes ejercer control social y presentar peticiones, quejas, reclamos, sugerencias y denuncias a través del canal de PQRSD.</p>
        <RecursoExistente href="/pqrsd">Radicar una PQRSD</RecursoExistente>
      </Apartado>

      <Apartado titulo="6.5 Rendición de cuentas">
        <PendienteContenido titulo="Rendición de cuentas a la ciudadanía" descripcion="Cronograma e informes de rendición de cuentas pendientes de cargar por la entidad." />
      </Apartado>
    </TPage>
  );
}
