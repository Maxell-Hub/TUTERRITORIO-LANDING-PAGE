import type { Metadata } from "next";
import { TPage, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";

export const metadata: Metadata = {
  title: "Protección de datos personales — Transparencia",
  alternates: { canonical: "/transparencia/proteccion-datos" },
  description: "Política de tratamiento de datos personales y derechos de los titulares en Tuterritorio.",
};

export default function ProteccionDatosPage() {
  return (
    <TPage
      title="Protección de datos personales"
      lead="Tratamiento de datos personales conforme a la Ley 1581 de 2012."
    >
      <Apartado titulo="10.1 Política de Tratamiento de Datos Personales">
        <p>Tuterritorio cuenta con su Política de Tratamiento de Datos Personales, donde se describen las finalidades, los derechos de los titulares y los canales para ejercerlos.</p>
        <RecursoExistente href="/politica-tratamiento-datos">Ver la Política de Tratamiento de Datos Personales</RecursoExistente>
      </Apartado>

      <Apartado titulo="10.2 Derechos de los titulares y canales de atención">
        <p>Los titulares pueden conocer, actualizar, rectificar y solicitar la supresión de sus datos, así como revocar la autorización, a través de los canales oficiales de la entidad.</p>
        <RecursoExistente href="/contactos">Canales de atención</RecursoExistente>
      </Apartado>
    </TPage>
  );
}
