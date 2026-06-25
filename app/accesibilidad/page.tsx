import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Declaración de Accesibilidad",
  description:
    "Declaración de accesibilidad del sitio de Tuterritorio — Catastro Multipropósito de Valledupar, con nivel de conformidad WCAG 2.1 AA / NTC 5854 y mecanismo para reportar barreras.",
  alternates: { canonical: "/accesibilidad" },
};

export default function AccesibilidadPage() {
  return (
    <section className="legal-hero">
      <div className="legal-wrap">
        <span className="legal-eyebrow">Accesibilidad</span>
        <h1>Declaración de Accesibilidad</h1>
        <p className="legal-lead">Tuterritorio — Catastro Multipropósito de Valledupar</p>

        <ul className="legal-meta">
          <li><b>Última actualización:</b> 25 de junio de 2026</li>
          <li><b>Estándar de referencia:</b> WCAG 2.1 nivel AA · NTC 5854</li>
          <li><b>Estado de conformidad:</b> Parcialmente conforme (en mejora continua)</li>
        </ul>

        <div className="legal-body">
          <h2 id="compromiso">1. Compromiso</h2>
          <p>
            Tuterritorio se compromete a que este sitio web sea accesible para todas las personas,
            incluidas aquellas con discapacidad, conforme a la Resolución MinTIC 1519 de 2020, la
            Ley 1712 de 2014, la Ley 1618 de 2013 y la Norma Técnica Colombiana <b>NTC 5854</b>,
            que adopta las pautas <b>WCAG 2.1</b> en su nivel <b>AA</b>.
          </p>

          <h2 id="medidas">2. Medidas adoptadas</h2>
          <ul className="legal-list legal-list-disc">
            <li>Estructura semántica con jerarquía correcta de encabezados (h1 › h2 › h3).</li>
            <li>Contraste de color que cumple la relación mínima <b>4.5:1</b> (texto normal) AA.</li>
            <li>Foco visible y navegación completa con teclado (incluido el enlace «Saltar al contenido»).</li>
            <li>Formularios con etiquetas <code>&lt;label&gt;</code> asociadas y mensajes de error accesibles
              (<code>aria-invalid</code>, <code>aria-describedby</code>, <code>role=&quot;alert&quot;</code>).</li>
            <li>Imágenes con texto alternativo y tablas con encabezados (<code>&lt;th scope&gt;</code>).</li>
            <li>Respeto a la preferencia de movimiento reducido del sistema (<code>prefers-reduced-motion</code>).</li>
          </ul>

          <h2 id="limitaciones">3. Contenido no accesible o limitaciones</h2>
          <p>
            Algunos contenidos embebidos de terceros (por ejemplo, el mapa de Google) o documentos
            adjuntos pueden no cumplir totalmente el nivel AA. Trabajamos de forma continua para
            corregir estas barreras.
          </p>

          <h2 id="reporte">4. ¿Encontraste una barrera? Repórtala</h2>
          <p>
            Si encuentras dificultades para acceder a algún contenido o función, por favor avísanos
            para corregirlo. Indícanos la página, el problema y, si puedes, el dispositivo o tecnología
            de asistencia que usas.
          </p>
          <ul className="legal-list legal-list-disc">
            <li><b>Correo:</b> <a href="mailto:contactenos@tuterritorio.gov.co?subject=Reporte%20de%20barrera%20de%20accesibilidad">contactenos@tuterritorio.gov.co</a></li>
            <li><b>Formulario:</b> <a href="/pqrsd">Radica una PQRSD</a> indicando «accesibilidad» en el asunto.</li>
            <li><b>Teléfono:</b> (605) 5885761 Ext. 100</li>
            <li><b>Presencial:</b> Calle 16 #9-48, Edificio Caja Agraria, Of. 1301, Valledupar, Cesar.</li>
          </ul>
          <p>
            Daremos respuesta a tu reporte dentro de los términos de ley aplicables a las PQRSD.
          </p>
        </div>
      </div>
    </section>
  );
}
