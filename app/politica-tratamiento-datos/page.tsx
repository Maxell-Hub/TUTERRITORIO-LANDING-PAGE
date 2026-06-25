import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales",
  description:
    "Política de Tratamiento y Protección de Datos Personales de Tuterritorio — Catastro Multipropósito de Valledupar, conforme a la Ley 1581 de 2012 y normas concordantes.",
  alternates: { canonical: "/politica-tratamiento-datos" },
};

export default function PoliticaDatosPage() {
  return (
    <section className="legal-hero">
      <div className="legal-wrap">
        <span className="legal-eyebrow">Protección de datos personales</span>
        <h1>Política de Tratamiento y Protección de Datos Personales</h1>
        <p className="legal-lead">Tuterritorio — Catastro Multipropósito de Valledupar</p>

        <ul className="legal-meta">
          <li><b>Fecha de expedición:</b> 【DD/MM/AAAA】</li>
          <li><b>Última actualización:</b> 25 de junio de 2026</li>
          <li><b>Versión:</b> 1.0</li>
          <li><b>Acto administrativo de adopción:</b> 【Resolución/Acuerdo N.° ___ de ___】</li>
        </ul>

        <div className="legal-body">
          <h2 id="responsable">1. Identificación del Responsable</h2>
          <table className="legal-table">
            <caption className="sr-only">Datos de identificación del responsable del tratamiento</caption>
            <tbody>
              <tr><th scope="row">Razón social</th><td>Tuterritorio — Catastro Multipropósito de Valledupar</td></tr>
              <tr><th scope="row">NIT</th><td>901.996.731-8</td></tr>
              <tr><th scope="row">Domicilio</th><td>Calle 16 #9-48, Edificio Caja Agraria, Of. 1301, Valledupar, Cesar</td></tr>
              <tr><th scope="row">Correo protección de datos</th><td>【protecciondedatos@tuterritorio.gov.co】</td></tr>
              <tr><th scope="row">Correo general</th><td><a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a></td></tr>
            </tbody>
          </table>

          <h2 id="marco-legal">2. Marco legal y normativo</h2>
          <p>
            Constitución Política (art. 15), Ley Estatutaria 1581 de 2012, Decreto 1377 de 2013,
            Decreto 1074 de 2015, Decreto 1081 de 2015, Ley 1712 de 2014 y normas concordantes sobre
            Hábeas Data.
          </p>

          <h2 id="definiciones">3. Definiciones</h2>
          <p>
            Autorización, Base de datos, Dato personal, Dato sensible, Encargado, Responsable, Titular,
            Tratamiento, Transferencia/Transmisión — conforme al art. 3 de la Ley 1581 de 2012.
          </p>

          <h2 id="principios">4. Principios</h2>
          <p>
            Legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación
            restringida, seguridad y confidencialidad (art. 4, Ley 1581 de 2012).
          </p>

          <h2 id="finalidades">5. Finalidades del tratamiento</h2>
          <ol className="legal-list">
            <li>Atender y responder PQRSD.</li>
            <li>Gestionar solicitudes de información, contacto y atención.</li>
            <li>Adelantar trámites y servicios catastrales (consulta de predios, linderos, área, avalúo, mutaciones).</li>
            <li>Notificar respuestas y actuaciones, y demás finalidades asociadas a la gestión catastral cuando el trámite lo requiera.</li>
          </ol>

          <h2 id="datos">6. Datos que se recolectan y datos sensibles</h2>
          <p>
            Se recolecta información de identificación y contacto y, cuando el trámite lo requiera,
            información predial/catastral. Datos sensibles: no se solicitan de forma rutinaria; si un
            trámite lo requiere, su entrega es facultativa y previa autorización expresa específica.
          </p>

          <h2 id="derechos">7. Derechos del Titular (art. 8, Ley 1581)</h2>
          <ol className="legal-list legal-list-alpha">
            <li>Conocer, actualizar y rectificar.</li>
            <li>Solicitar prueba de la autorización.</li>
            <li>Ser informado del uso.</li>
            <li>Presentar quejas ante la SIC.</li>
            <li>Revocar la autorización y/o solicitar supresión.</li>
            <li>Acceder gratuitamente a sus datos.</li>
          </ol>

          <h2 id="procedimiento">8. Procedimiento para consultas y reclamos</h2>
          <p>
            <b>Canales:</b> correo 【protecciondedatos@tuterritorio.gov.co】, presencial
            (Calle 16 #9-48, Of. 1301) y formulario{" "}
            <a href="/pqrsd">tuterritorio.gov.co/pqrsd</a>.
          </p>
          <table className="legal-table">
            <caption className="sr-only">Plazos de respuesta para consultas y reclamos</caption>
            <thead>
              <tr><th scope="col">Tipo</th><th scope="col">Plazo</th><th scope="col">Prórroga</th></tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Consultas (art. 14)</th>
                <td>Máximo 10 días hábiles</td>
                <td>5 días</td>
              </tr>
              <tr>
                <th scope="row">Reclamos (art. 15)</th>
                <td>Resolución en máximo 15 días hábiles. Si está incompleto, requerimiento en 5 días; desistimiento a los 2 meses.</td>
                <td>8 días</td>
              </tr>
            </tbody>
          </table>

          <h2 id="autorizacion">9. Autorización</h2>
          <p>
            Previa, expresa e informada, por medios físicos o electrónicos (casilla de verificación),
            con conservación de prueba (fecha, hora, canal). Excepciones del art. 10 de la Ley 1581.
          </p>

          <h2 id="encargados">10. Encargados y transferencia internacional</h2>
          <p>
            Tuterritorio usa proveedores de hosting y CDN que actúan como Encargados, con servidores
            que pueden ubicarse fuera de Colombia (p. ej. EE. UU.), adoptando las garantías de los
            arts. 24-26 de la Ley 1581 y los contratos de transmisión correspondientes.
            【Listar Encargados específicos: hosting, procesador de formularios, plataformas de
            consulta predial e impuesto predial】.
          </p>

          <h2 id="ninos">11. Datos de niños, niñas y adolescentes</h2>
          <p>
            Solo procede atendiendo su interés superior y con autorización del representante legal
            (art. 7, Ley 1581; Sentencia C-748 de 2011).
          </p>

          <h2 id="seguridad">12. Medidas de seguridad</h2>
          <p>
            Medidas técnicas, humanas y administrativas razonables (cifrado HTTPS/TLS, control de
            accesos, políticas internas) en el marco del MSPI.
          </p>

          <h2 id="vigencia">13. Vigencia</h2>
          <p>
            Rige desde su publicación; las bases se conservan mientras sea necesario o por los términos
            legales. Cambios sustanciales se comunican en el sitio web.
          </p>
        </div>
      </div>
    </section>
  );
}
