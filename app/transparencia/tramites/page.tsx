import type { Metadata } from "next";
import { TPage, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";
import ExternalLink from "@/components/common/ExternalLink";

export const metadata: Metadata = {
  title: "Trámites y servicios — Transparencia",
  alternates: { canonical: "/transparencia/tramites" },
  description: "Listado de trámites y servicios catastrales de Tuterritorio, con enlace al SUIT.",
};

export default function TramitesTransparenciaPage() {
  return (
    <TPage
      title="Trámites y servicios"
      lead="Trámites y servicios catastrales disponibles para la ciudadanía."
    >
      <Apartado titulo="5.1 Listado de trámites y servicios">
        <p>El listado completo de trámites y productos catastrales (con requisitos, tiempos y costos) está publicado en la sección de Trámites y servicios del sitio.</p>
        <RecursoExistente href="/servicios">Ver trámites y servicios catastrales</RecursoExistente>
      </Apartado>

      <Apartado titulo="5.2 Trámites inscritos en el SUIT">
        <p>Los trámites de la entidad están inscritos en el Sistema Único de Información de Trámites (SUIT) del Estado colombiano.</p>
        <p className="t-extlink">
          <ExternalLink href="https://www.suit.gov.co" ariaLabel="Consultar los trámites en el SUIT">
            Consultar en el SUIT
          </ExternalLink>
        </p>
      </Apartado>
    </TPage>
  );
}
