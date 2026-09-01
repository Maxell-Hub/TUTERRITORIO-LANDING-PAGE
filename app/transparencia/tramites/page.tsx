import type { Metadata } from "next";
import { TPageATG, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";

export const metadata: Metadata = {
  title: "Trámites y servicios — Transparencia",
  alternates: { canonical: "/transparencia/tramites" },
  description: "Listado de trámites y servicios catastrales de Tuterritorio, con enlace al SUIT.",
};

export default function TramitesTransparenciaPage() {
  return (
    <TPageATG
      editKey="transp-tramites"
      title="Trámites y servicios"
      lead="Trámites y servicios catastrales disponibles para la ciudadanía."
      eyebrow="Sección 3"
      photo="transparencia/foto-terminal2"
      photoPos="center 58%"
    >
      <Apartado titulo="3.1 Listado de trámites y servicios">
        <p>El listado completo de trámites y productos catastrales (con requisitos, tiempos y costos) está publicado en la sección de Trámites y servicios del sitio.</p>
        <RecursoExistente href="/servicios">Ver trámites y servicios catastrales</RecursoExistente>
      </Apartado>
    </TPageATG>
  );
}
