import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
  description:
    "Términos y condiciones de uso del sitio web de Tuterritorio S.A.S — Operador Catastral del Municipio de Valledupar.",
  alternates: { canonical: "/terminos-y-condiciones" },
};

export default function TerminosPage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/legales/foto-tratamiento2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/legales/foto-tratamiento2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/legales/foto-tratamiento2.webp)", ["--hero-m" as string]: "url(/assets/legales/foto-tratamiento2-m.webp)", backgroundPosition: "center 45%" }}>
        <h1>Términos y Condiciones de Uso del Sitio Web</h1>
        <p className="sub">Tuterritorio S.A.S — Operador Catastral del Municipio de Valledupar</p>
      </section>

      <section className="legal-hero">
        <div className="legal-wrap">
        <ul className="legal-meta">
          <li><b>Última actualización:</b> 29 de julio de 2026</li>
          <li><b>Entidad:</b> Tuterritorio S.A.S (NIT 901.996.731-8)</li>
        </ul>

        <div className="legal-body">
          <h2 id="objeto">1. Objeto y aceptación</h2>
          <p>
            El presente documento regula el acceso, navegación y uso del sitio web oficial de Tuterritorio
            S.A.S (en adelante, «el sitio web»), entidad que actúa en calidad de Operador Catastral de la
            ciudad de Valledupar.
          </p>
          <p>
            Al acceder, consultar o utilizar los servicios y formularios de este sitio web, el ciudadano o
            usuario declara haber leído, entendido y aceptado de manera plena e incondicional los presentes
            Términos y Condiciones. Si el usuario no está de acuerdo con cualquiera de estas disposiciones,
            deberá abstenerse de utilizar el portal.
          </p>

          <h2 id="alcance">2. Definición del servicio y alcance del sitio web</h2>
          <p>
            El sitio web de Tuterritorio S.A.S tiene como finalidad principal proporcionar información
            institucional y poner a disposición canales virtuales de atención ciudadana (PQRSD).
          </p>
          <p className="legal-note">
            <b>Aviso importante sobre validez jurídica:</b> la información presentada en este portal es de
            carácter informativo y operativo. Los trámites, certificaciones y expedición de actos
            administrativos oficiales con efectos jurídicos y catastrales se sujetan a las formalidades
            establecidas en la Resolución IGAC 1040 de 2023 y son expedidos formalmente por la autoridad
            competente (Gestor Catastral — Municipio de Valledupar).
          </p>

          <h2 id="obligaciones">3. Condiciones de uso y obligaciones del usuario</h2>
          <p>El usuario se compromete a hacer un uso adecuado, lícito y de buena fe del sitio web y de sus contenidos. En particular, se obliga a:</p>
          <ul className="legal-list legal-list-disc">
            <li><b>Veracidad de la información:</b> suministrar datos exactos, veraces y actualizados en los formularios de atención, PQRSD o radicaciones técnicas. La entrega de información falsa, la suplantación de identidad o la alteración de documentos estará sujeta a las sanciones civiles, administrativas y penales previstas en la ley colombiana.</li>
            <li><b>Uso técnico responsable:</b> abstenerse de realizar cualquier acción que pueda dañar, inutilizar, sobrecargar, deteriorar o vulnerar la seguridad de la infraestructura tecnológica del portal (incluyendo intentos de acceso no autorizado, inyección de código malicioso o ataques informáticos).</li>
            <li><b>Destino institucional:</b> no utilizar los contenidos publicados con fines ilícitos, comerciales no autorizados o contrarios al ordenamiento jurídico.</li>
          </ul>

          <h2 id="informacion">4. Información publicada</h2>
          <p>
            Tuterritorio S.A.S realiza esfuerzos permanentes para garantizar que la información publicada en
            el portal web sea precisa, clara y actualizada. Sin embargo:
          </p>
          <ol className="legal-list">
            <li>No se garantiza la ausencia absoluta de errores tipográficos, imprecisiones técnicas o desactualizaciones involuntarias.</li>
            <li>La Entidad se reserva el derecho de modificar, actualizar, corregir o retirar cualquier contenido, formulario o sección del sitio web en cualquier momento y sin previo aviso, en cumplimiento de sus planes de mejora técnica o cambios normativos.</li>
          </ol>

          <h2 id="propiedad">5. Propiedad intelectual</h2>
          <p>
            Todos los elementos contenidos en este sitio web —incluyendo de manera enunciativa pero no
            limitativa: logotipos, marcas, diseños, textos, gráficos, interfaces, código fuente, imágenes y
            datos cartográficos o geográficos producidos por la Entidad— son propiedad de Tuterritorio S.A.S
            o cuentan con las licencias correspondientes para su uso, estando protegidos por las leyes
            colombianas e internacionales sobre derechos de autor y propiedad industrial.
          </p>
          <p>
            Queda estrictamente prohibida la comercialización, transformación o redistribución no autorizada
            de los sistemas de información geográficos o bases de datos de la Entidad.
          </p>

          <h2 id="enlaces">6. Enlaces a sitios web de terceros</h2>
          <p>
            Para mayor facilidad del usuario, el sitio web puede contener enlaces (links) o botones que
            redireccionan a páginas externas operadas por terceros o por otras entidades del Estado (por
            ejemplo, portales de consulta del IGAC, la Superintendencia de Notariado y Registro, o la
            plataforma del Impuesto Predial de la Alcaldía de Valledupar).
          </p>
          <ul className="legal-list legal-list-disc">
            <li>Tuterritorio S.A.S no ejerce control ni asume responsabilidad alguna sobre la disponibilidad, contenidos, políticas de privacidad o términos de uso de dichos sitios externos.</li>
            <li>Al hacer clic en un enlace externo y abandonar nuestro portal, el usuario quedará sujeto a las condiciones legales de la página de destino.</li>
          </ul>

          <h2 id="datos">7. Protección de datos personales</h2>
          <p>
            El tratamiento de los datos personales recolectados a través de los formularios de atención,
            canales virtuales o trámites técnicos del sitio se rige estrictamente por la{" "}
            <a href="/politica-tratamiento-datos">Política de Tratamiento y Protección de Datos Personales</a>{" "}
            de Tuterritorio S.A.S y las disposiciones de la Ley Estatutaria 1581 de 2012 y sus decretos
            reglamentarios.
          </p>

          <h2 id="responsabilidad">8. Limitación de responsabilidad</h2>
          <p>En la máxima medida permitida por la ley colombiana, Tuterritorio S.A.S no será responsable por:</p>
          <ol className="legal-list">
            <li>Daños, pérdidas o perjuicios directos o indirectos derivados de la imposibilidad temporal de acceder o utilizar el sitio web debido a mantenimientos técnicos programados, fallas en las redes de telecomunicaciones o causas de fuerza mayor.</li>
            <li>Inconvenientes generados por virus, vulnerabilidades u otros elementos dañinos introducidos por terceros en los equipos o redes del usuario.</li>
            <li>El uso indebido, inadecuado o fraudulento que terceros o usuarios hagan de la información publicada en el sitio.</li>
          </ol>

          <h2 id="disponibilidad">9. Disponibilidad y mantenimiento del servicio</h2>
          <p>
            La Entidad busca mantener la continuidad del servicio web las 24 horas del día. No obstante, por
            razones operativas, de ciberseguridad o de actualización de la infraestructura tecnológica, el
            servicio podrá ser suspendido temporalmente sin que esto genere derecho a indemnización alguna a
            favor del usuario.
          </p>

          <h2 id="ley">10. Ley aplicable y jurisdicción</h2>
          <p>
            Los presentes Términos y Condiciones se rigen e interpretan de conformidad con las leyes de la
            República de Colombia. Cualquier controversia, reclamo o desacuerdo derivado del uso de este
            sitio web que no pueda ser resuelto de forma directa será sometido a la jurisdicción de los
            jueces y tribunales competentes de la República de Colombia.
          </p>

          <h2 id="contacto">11. Canales de contacto</h2>
          <p>
            Para cualquier duda, sugerencia o reclamación relacionada con los presentes Términos y
            Condiciones de Uso, los usuarios pueden comunicarse a través de los siguientes canales oficiales
            de atención: correo electrónico{" "}
            <a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a> · (605)
            5885761 Ext. 100.
          </p>
        </div>
        </div>
      </section>
    </>
  );
}
