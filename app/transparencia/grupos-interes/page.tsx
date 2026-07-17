import type { Metadata } from "next";
import { TPageATG, Apartado } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Información para grupos de interés — Transparencia",
  alternates: { canonical: "/transparencia/grupos-interes" },
  description: "Información de Tuterritorio dirigida a poblaciones y grupos de interés específicos.",
};

export default function GruposInteresPage() {
  return (
    <TPageATG
      title="Información para grupos de interés"
      lead="Contenidos dirigidos a poblaciones y grupos de interés específicos."
      eyebrow="Sección 8"
    >
      <Apartado titulo="8.1 Información dirigida a niños, niñas y adolescentes">
        <PendienteContenido titulo="Contenido para niñas, niños y adolescentes" descripcion="Información pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="8.2 Información dirigida a otros grupos de interés">
        <PendienteContenido titulo="Contenido para grupos de interés" descripcion="Información dirigida a poblaciones específicas (por ejemplo, propietarios, gremios o comunidades), pendiente de cargar por la entidad." />
      </Apartado>
    </TPageATG>
  );
}
