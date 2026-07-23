import type { Metadata } from "next";
import { TPageATG, Apartado } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";
import ExternalLink from "@/components/common/ExternalLink";

export const metadata: Metadata = {
  title: "Contratación — Transparencia",
  alternates: { canonical: "/transparencia/contratacion" },
  description: "Plan Anual de Adquisiciones, ejecución contractual y enlace al SECOP II de Tuterritorio.",
};

export default function ContratacionPage() {
  return (
    <TPageATG
      title="Contratación"
      lead="Información sobre la actividad contractual de la entidad."
      eyebrow="Sección 3"
      photo="foto-viajero"
      photoPos="center 52%"
    >
      <Apartado titulo="3.1 Plan Anual de Adquisiciones (PAA)">
        <PendienteContenido titulo="Plan Anual de Adquisiciones" descripcion="PAA de la vigencia pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="3.2 Publicación de la ejecución contractual">
        <PendienteContenido titulo="Ejecución de contratos" descripcion="Información de ejecución contractual pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="3.3 Procesos en el SECOP II">
        <p>Los procesos de contratación de la entidad se publican en el Sistema Electrónico de Contratación Pública (SECOP II).</p>
        <p className="t-extlink">
          <ExternalLink href="https://www.colombiacompra.gov.co/secop-ii" ariaLabel="Consultar en el SECOP II">
            Consultar en el SECOP II
          </ExternalLink>
        </p>
      </Apartado>
    </TPageATG>
  );
}
