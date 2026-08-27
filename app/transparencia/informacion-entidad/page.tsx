import type { Metadata } from "next";
import { TPageATG, Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";

export const metadata: Metadata = {
  title: "Información de la entidad — Transparencia",
  alternates: { canonical: "/transparencia/informacion-entidad" },
  description: "Mecanismos de contacto, sedes, horarios, normograma, estructura orgánica, directorio y entes de control de Tuterritorio.",
};

export default function InformacionEntidadPage() {
  return (
    <TPageATG
      editKey="transp-informacion-entidad"
      title="Información de la entidad"
      lead="Datos básicos de Tuterritorio como operador catastral del municipio de Valledupar."
      eyebrow="Sección 1"
      photo="transparencia/foto-caja2"
      photoPos="center 45%"
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
      </Apartado>

      <Apartado titulo="1.6 Entes que ejercen control sobre la entidad">
        <p>
          Como operador catastral, Tuterritorio está sujeto a la regulación y a la inspección, vigilancia y
          control de las siguientes entidades del orden nacional:
        </p>
        <div className="ente-grid">
          <article className="ente-card">
            <span className="ente-sigla" style={{ ["--accent" as string]: "#4E8654" }}>IGAC</span>
            <h3>Instituto Geográfico Agustín Codazzi</h3>
            <p>
              Máxima autoridad catastral del país. Regula la gestión catastral con enfoque multipropósito,
              habilita a los gestores catastrales y define las especificaciones técnicas del servicio
              (Ley 1955 de 2019 y Decreto 148 de 2020).
            </p>
            <a href="https://www.igac.gov.co" target="_blank" rel="noopener noreferrer">
              www.igac.gov.co
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
          </article>
          <article className="ente-card">
            <span className="ente-sigla" style={{ ["--accent" as string]: "#3B85A5" }}>SNR</span>
            <h3>Superintendencia de Notariado y Registro</h3>
            <p>
              Ejerce la inspección, vigilancia y control sobre los gestores y operadores catastrales en la
              prestación del servicio público de gestión catastral (Decreto 148 de 2020).
            </p>
            <a href="https://www.supernotariado.gov.co" target="_blank" rel="noopener noreferrer">
              www.supernotariado.gov.co
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
          </article>
        </div>
      </Apartado>
    </TPageATG>
  );
}
