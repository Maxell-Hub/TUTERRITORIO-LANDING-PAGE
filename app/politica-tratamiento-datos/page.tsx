import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales",
  description:
    "Política de Tratamiento y Protección de Datos Personales de Tuterritorio S.A.S — Operador Catastral del Municipio de Valledupar, conforme a la Ley 1581 de 2012 y normas concordantes.",
  alternates: { canonical: "/politica-tratamiento-datos" },
};

export default function PoliticaDatosPage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/legales/foto-politica2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/legales/foto-politica2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/legales/foto-politica2.webp)", ["--hero-m" as string]: "url(/assets/legales/foto-politica2-m.webp)", backgroundPosition: "center 50%" }}>
        <h1>Política de Tratamiento y Protección de Datos Personales</h1>
        <p className="sub">Tuterritorio S.A.S — Operador Catastral del Municipio de Valledupar</p>
      </section>

      <section className="legal-hero">
        <div className="legal-wrap">
        <ul className="legal-meta">
          <li><b>Última actualización:</b> 29 de julio de 2026</li>
          <li><b>Versión:</b> 2.0</li>
        </ul>

        <div className="legal-body">
          <h2 id="identificacion">1. Identificación del Tratante de la Información</h2>
          <table className="legal-table">
            <caption className="sr-only">Datos de identificación del Operador Catastral</caption>
            <tbody>
              <tr><th scope="row">Razón social</th><td>Tuterritorio S.A.S — Operador Catastral</td></tr>
              <tr><th scope="row">NIT</th><td>901.996.731-8</td></tr>
              <tr><th scope="row">Domicilio</th><td>Calle 16 #9-48, Edificio Caja Agraria, Of. 1301, Valledupar, Cesar</td></tr>
              <tr><th scope="row">Correo electrónico</th><td><a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a></td></tr>
              <tr><th scope="row">Teléfono</th><td>(605) 5885761 Ext. 100</td></tr>
              <tr><th scope="row">Rol en el servicio</th><td>Operador Catastral contratado por el Gestor Catastral (Municipio de Valledupar)</td></tr>
            </tbody>
          </table>

          <h2 id="marco-legal">2. Marco legal y normativo</h2>
          <p>
            La presente política se rige por el Artículo 15 de la Constitución Política, la Ley
            Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único 1074 de
            2015), la Ley 1712 de 2014 (Transparencia y Acceso a la Información Pública) y las normas
            técnicas del servicio público catastral: Decreto 148 de 2020 y Resolución Única IGAC 1040 de
            2023.
          </p>

          <h2 id="principios">3. Principios rectores</h2>
          <p>
            El tratamiento de datos en Tuterritorio S.A.S en su calidad de Operador Catastral se rige por
            los principios del Artículo 4 de la Ley 1581 de 2012: legalidad, finalidad, libertad,
            veracidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.
          </p>

          <h2 id="finalidades">4. Finalidades del tratamiento de datos</h2>
          <p>
            En el marco de la ejecución de las actividades técnicas e insumos requeridos por el Gestor
            Catastral de Valledupar, los datos personales y prediales recolectados por Tuterritorio S.A.S
            serán utilizados para las siguientes finalidades:
          </p>
          <ul className="legal-list legal-list-disc">
            <li><b>Operación y campo (técnica):</b> adelantar el levantamiento catastral de campo, georreferenciación, digitalización, gestión de insumos cartográficos y validación técnica de linderos, áreas y aspectos físicos/económicos de los predios.</li>
            <li><b>Gestión de insumos para el Gestor:</b> organizar, procesar y transmitir la información recopilada al Gestor Catastral (Municipio de Valledupar) para la toma de decisiones y expedición de actos administrativos.</li>
            <li><b>Atención ciudadana operativa:</b> recibir, direccionar y dar trámite a las Peticiones, Quejas, Reclamos, Sugerencias y Denuncias (PQRSD) asociadas a las visitas técnicas de campo e insumos recolectados.</li>
            <li><b>Interoperabilidad:</b> garantizar la transmisión segura de los datos técnicos procesados hacia los repositorios del IGAC, la Superintendencia de Notariado y Registro (SNR) y la administración municipal cuando así lo requiera.</li>
          </ul>

          <h2 id="excepciones">5. Excepciones a la autorización</h2>
          <p>
            En virtud del Artículo 10 de la Ley 1581 de 2012 y el Decreto 148 de 2020, Tuterritorio
            S.A.S en su calidad de Operador Catastral no requerirá autorización previa del Titular para
            la recolección y tratamiento de la información predial y personal de campo, en tanto dicha
            labor corresponda al cumplimiento del contrato de operación para la prestación de un servicio
            público derivado de mandatos constitucionales y legales.
          </p>

          <h2 id="datos-sensibles">6. Datos sensibles y menores de edad</h2>
          <p>
            Tuterritorio S.A.S no recolecta de forma rutinaria datos sensibles (origen racial, afiliación
            política, salud, biométricos). Si en la caracterización de un predio se requiriera un dato
            sensible para programas sociales del Estado, se informará al ciudadano su carácter
            estrictamente facultativo y se solicitará autorización previa.
          </p>
          <p>
            <b>Niños, niñas y adolescentes:</b> la recolección de datos prediales vinculados a menores de
            edad (por ejemplo, titulaciones o herencias) se procesará bajo los estándares del interés
            superior del menor y la debida representación de su tutor legal.
          </p>

          <h2 id="derechos">7. Derechos de los titulares (art. 8, Ley 1581 de 2012)</h2>
          <ol className="legal-list">
            <li>Conocer, actualizar y rectificar sus datos ante el Operador (o por intermedio de este frente al Gestor).</li>
            <li>Solicitar prueba de la autorización otorgada (cuando aplique).</li>
            <li>Ser informado del uso dado a sus datos personales en las operaciones de campo y oficina.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) en caso de detectar un uso indebido de su información.</li>
            <li>Revocar o solicitar la supresión de datos no sujetos a reserva legal ni necesarios para el censo catastral.</li>
            <li>Acceder de forma gratuita a sus datos procesados.</li>
          </ol>

          <h2 id="canales">8. Canales y tiempos para consultas y reclamos</h2>
          <p>Para ejercer los derechos de Hábeas Data sobre el tratamiento operativo, los canales habilitados son:</p>
          <ul className="legal-list legal-list-disc">
            <li><b>Correo electrónico:</b> <a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a></li>
            <li><b>Oficina presencial:</b> Calle 16 #9-48, Edificio Caja Agraria, Of. 1301, Valledupar, Cesar.</li>
            <li><b>Formulario de PQRSD web:</b> <a href="/pqrsd">tuterritorio.gov.co/pqrsd</a></li>
          </ul>
          <table className="legal-table">
            <caption className="sr-only">Plazos de respuesta para consultas y reclamos</caption>
            <thead>
              <tr><th scope="col">Tipo de trámite</th><th scope="col">Plazo de respuesta</th><th scope="col">Prórroga legal</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Consultas de datos</th><td>Máximo 10 días hábiles</td><td>Hasta 5 días hábiles adicionales</td></tr>
              <tr><th scope="row">Reclamos o rectificaciones</th><td>Máximo 15 días hábiles</td><td>Hasta 8 días hábiles adicionales</td></tr>
            </tbody>
          </table>
          <p>
            Si la solicitud ingresada atañe a una decisión de competencia exclusiva del Gestor Catastral
            —como una mutación catastral—, Tuterritorio S.A.S la remitirá de inmediato al Municipio de
            Valledupar, informando al ciudadano.
          </p>

          <h2 id="encargados">9. Encargados tecnológicos y transmisión internacional</h2>
          <p>
            Para la operación de sus plataformas digitales y la recepción de insumos, Tuterritorio S.A.S
            se apoya en proveedores de infraestructura (Encargados) que cumplen con altos estándares de
            seguridad y que pueden alojar información fuera del territorio colombiano bajo las garantías
            de la Ley 1581 de 2012:
          </p>
          <ul className="legal-list legal-list-disc">
            <li><b>Vercel Inc. (EE. UU.):</b> alojamiento web y red de contenido (CDN).</li>
            <li><b>Cloudflare, Inc. (EE. UU.):</b> seguridad, mitigación de riesgos web y DNS.</li>
            <li><b>Resend (EE. UU.):</b> infraestructura de envío de correos electrónicos transaccionales sobre las PQRSD.</li>
          </ul>

          <h2 id="cookies">10. Uso de cookies</h2>
          <p>
            El portal de Tuterritorio utiliza cookies estrictamente técnicas y de seguridad (vía
            Cloudflare y Vercel) necesarias para la estabilidad del portal y el correcto funcionamiento de
            los formularios de atención. No comerciamos ni perfilamos datos para fines comerciales.
          </p>

          <h2 id="seguridad">11. Seguridad de la información operativa</h2>
          <p>
            Tuterritorio S.A.S cuenta con medidas de seguridad físicas, técnicas y organizacionales
            enmarcadas en el Modelo de Seguridad y Privacidad de la Información (MSPI). Esto incluye
            cifrado HTTPS/TLS en la web, protocolos de almacenamiento seguro de la cartografía y
            confidencialidad firmada por todo el personal de campo y de sistemas.
          </p>

          <h2 id="vigencia">12. Vigencia y modificaciones</h2>
          <p>
            Esta política entra en vigencia a partir de su publicación oficial. Las bases de datos
            operativas se mantendrán durante la vigencia de la operación catastral delegada y los plazos
            legalmente fijados por la ley de archivos del Estado. Cualquier cambio sustancial será
            comunicado oportunamente en el portal web.
          </p>
        </div>
        </div>
      </section>
    </>
  );
}
