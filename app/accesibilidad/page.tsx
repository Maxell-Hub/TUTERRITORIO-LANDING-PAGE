import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Declaración de Accesibilidad",
  description:
    "Declaración de accesibilidad del sitio de Tuterritorio S.A.S — Operador Catastral del Municipio de Valledupar, con nivel de conformidad WCAG 2.1 AA / NTC 5854 y mecanismo para reportar barreras.",
  alternates: { canonical: "/accesibilidad" },
};

export default function AccesibilidadPage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/legales/foto-accesibilidad2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/legales/foto-accesibilidad2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/legales/foto-accesibilidad2.webp)", ["--hero-m" as string]: "url(/assets/legales/foto-accesibilidad2-m.webp)", backgroundPosition: "center 50%" }}>
        <Editable as="h1" id="legal-acc.h1">Declaración de Accesibilidad Web</Editable>
        <p className="sub"><Editable as="span" id="legal-acc.sub">Tuterritorio S.A.S — Operador Catastral del Municipio de Valledupar</Editable></p>
      </section>

      <section className="legal-hero">
        <div className="legal-wrap">
        <ul className="legal-meta">
          <li><b>Última actualización:</b> 29 de julio de 2026</li>
          <li><b>Estándar de referencia:</b> WCAG 2.1 nivel AA · NTC 5854</li>
          <li><b>Estado de conformidad:</b> Parcialmente conforme (en mejora continua)</li>
        </ul>

        <div className="legal-body">
          <h2 id="compromiso">1. Compromiso institucional</h2>
          <p>
            Tuterritorio S.A.S, en su calidad de Operador Catastral del Municipio de Valledupar, se
            compromete a garantizar que su portal web oficial sea accesible e incluyente para todas las
            personas, independientemente de sus capacidades físicas, sensoriales o cognitivas, o de la
            tecnología de asistencia que utilicen.
          </p>
          <p>
            Cumplimos con los lineamientos fijados por el Ministerio de Tecnologías de la Información y las
            Comunicaciones (MinTIC) en la Resolución 1519 de 2020, la Ley Estatutaria de Discapacidad (Ley
            1618 de 2013), la Ley de Transparencia (Ley 1712 de 2014) y la Norma Técnica Colombiana{" "}
            <b>NTC 5854</b>, aplicando las pautas internacionales de accesibilidad web <b>WCAG 2.1</b> en su
            nivel <b>AA</b>.
          </p>

          <h2 id="medidas">2. Medidas y características técnicas adoptadas</h2>
          <p>Para garantizar la navegabilidad y la eliminación de barreras digitales, nuestro portal incluye las siguientes características técnicas:</p>
          <ul className="legal-list legal-list-disc">
            <li><b>Estructura semántica correcta:</b> organización jerárquica clara de encabezados (<code>&lt;h1&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>).</li>
            <li><b>Contraste y diseño:</b> relación de contraste de color en texto e imagen que cumple la proporción mínima de <b>4.5:1</b> (AA) para facilitar la lectura a personas con baja visión o daltonismo.</li>
            <li><b>Navegación por teclado:</b> foco visualmente identificable y navegabilidad completa mediante teclado, incluido un atajo directo mediante el enlace «Saltar al contenido principal».</li>
            <li><b>Formularios accesibles:</b> todos los campos de los formularios de atención y PQRSD cuentan con etiquetas <code>&lt;label&gt;</code> debidamente asociadas, así como atributos de accesibilidad (<code>aria-invalid</code>, <code>aria-describedby</code>, <code>role=&quot;alert&quot;</code>) para la lectura de mensajes de validación y error.</li>
            <li><b>Contenido multimedia e imágenes:</b> incorporación de texto alternativo (<code>alt</code>) descriptivo en imágenes con carga informativa y etiquetas específicas (<code>&lt;th scope&gt;</code>) en las tablas de datos.</li>
            <li><b>Diseño adaptable y movimiento:</b> el sitio respeta las preferencias del sistema operativo del usuario, incluido el modo de movimiento reducido (<code>prefers-reduced-motion</code>) y un diseño responsivo adaptable a diferentes pantallas y lectores de pantalla.</li>
          </ul>

          <h2 id="limitaciones">3. Contenido no accesible o limitaciones técnicas</h2>
          <p>
            Trabajamos de manera permanente para mantener la conformidad del sitio. Sin embargo,
            reconocemos la existencia de las siguientes limitaciones temporales:
          </p>
          <ol className="legal-list">
            <li><b>Herramientas y mapas de terceros:</b> componentes embebidos de visores cartográficos o mapas interactivos externos (como Google Maps o geovisores de terceros) que pueden presentar barreras de navegación por teclado o lectura táctil.</li>
            <li><b>Documentos históricos o adjuntos:</b> es posible que algunos documentos escaneados antiguos, mapas o cartografía en formato PDF no cuenten con la capa de texto OCR o las etiquetas de lectura accesible requeridas.</li>
          </ol>
          <p>
            Si requiere algún documento o información en un formato accesible alternativo, podrá solicitarlo
            formalmente a través de nuestros canales de atención.
          </p>

          <h2 id="reporte">4. Canales de reporte de barreras y atención a usuarios</h2>
          <p>
            Si presenta dificultades para acceder a algún contenido, identifica una barrera de accesibilidad
            o requiere información en un formato alternativo, agradecemos nos lo informe indicando la
            dirección web (URL), la descripción de la falla detectada y el dispositivo o tecnología de
            asistencia utilizada.
          </p>
          <ul className="legal-list legal-list-disc">
            <li><b>Correo electrónico:</b> <a href="mailto:contactenos@tuterritorio.gov.co?subject=Reporte%20de%20barrera%20de%20accesibilidad">contactenos@tuterritorio.gov.co</a></li>
            <li><b>Formulario PQRSD web:</b> <a href="/pqrsd">tuterritorio.gov.co/pqrsd</a> (indicar «Accesibilidad web» en el asunto).</li>
            <li><b>Teléfono:</b> (605) 5885761 Ext. 100</li>
            <li><b>Atención presencial:</b> Calle 16 #9-48, Edificio Caja Agraria, Of. 1301, Valledupar, Cesar.</li>
          </ul>
          <p>
            <b>Tiempo de respuesta:</b> todos los reportes relacionados con barreras de accesibilidad digital
            serán tramitados bajo los plazos legales aplicables al derecho de petición (PQRSD),
            garantizando una respuesta oportuna y una alternativa técnica cuando sea procedente.
          </p>
        </div>
        </div>
      </section>
    </>
  );
}
