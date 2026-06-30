import type { Metadata } from "next";
import { TPage, Apartado } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";
import ExternalLink from "@/components/common/ExternalLink";

export const metadata: Metadata = {
  title: "Datos abiertos — Transparencia",
  alternates: { canonical: "/transparencia/datos-abiertos" },
  description: "Conjuntos de datos abiertos publicados por Tuterritorio en el portal datos.gov.co.",
};

export default function DatosAbiertosPage() {
  return (
    <TPage
      title="Datos abiertos"
      lead="Conjuntos de datos que la entidad publica en formato abierto y reutilizable."
    >
      <Apartado titulo="7.1 Portal de datos abiertos del Estado">
        <p>Los conjuntos de datos abiertos de la entidad se publican en el portal oficial datos.gov.co.</p>
        <p className="t-extlink">
          <ExternalLink href="https://www.datos.gov.co" ariaLabel="Ir al portal datos.gov.co">
            Ir a datos.gov.co
          </ExternalLink>
        </p>
      </Apartado>

      <Apartado titulo="7.2 Listado de conjuntos de datos publicados">
        <PendienteContenido titulo="Inventario de datos abiertos" descripcion="Listado de conjuntos de datos publicados, pendiente de cargar por la entidad." />
      </Apartado>
    </TPage>
  );
}
