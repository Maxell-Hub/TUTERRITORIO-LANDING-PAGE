import type { Metadata } from "next";
import { TPage, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Información de la entidad — Transparencia",
  alternates: { canonical: "/transparencia/informacion-entidad" },
  description: "Mecanismos de contacto, sedes, horarios, normograma, estructura orgánica, directorio y entes de control de Tuterritorio.",
};

export default function InformacionEntidadPage() {
  return (
    <TPage
      title="Información de la entidad"
      lead="Datos básicos de Tuterritorio como gestor catastral del municipio de Valledupar."
    >
      <Apartado titulo="1.1 Mecanismos de contacto">
        <p>Los canales oficiales de atención (correo, teléfono y formulario) están disponibles en la página de contacto.</p>
        <RecursoExistente href="/contactos">Ver canales de contacto</RecursoExistente>
      </Apartado>

      <Apartado titulo="1.2 Ubicación física, sedes y horarios de atención">
        <p>La dirección de la sede principal y el horario de atención al público se publican en la página de contacto y en el pie de página del sitio.</p>
        <RecursoExistente href="/contactos">Ver sede y horarios de atención</RecursoExistente>
      </Apartado>

      <Apartado titulo="1.3 Normograma">
        <p>El marco normativo que rige la gestión catastral está disponible en la sección de Normativas.</p>
        <RecursoExistente href="/recursos/normativas">Ver normativas</RecursoExistente>
        <PendienteContenido titulo="Normograma institucional consolidado" descripcion="Tabla normativa propia de la entidad pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="1.4 Estructura orgánica / organigrama">
        <PendienteContenido titulo="Organigrama de la entidad" descripcion="Estructura orgánica pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="1.5 Directorio de funcionarios y contratistas">
        <PendienteContenido titulo="Directorio institucional" descripcion="Directorio de funcionarios y contratistas pendiente de cargar por la entidad." />
      </Apartado>

      <Apartado titulo="1.6 Entes que ejercen control sobre la entidad">
        <PendienteContenido titulo="Organismos de control y vigilancia" descripcion="Listado de entes de control que vigilan a la entidad, pendiente de cargar por la entidad." />
      </Apartado>
    </TPage>
  );
}
