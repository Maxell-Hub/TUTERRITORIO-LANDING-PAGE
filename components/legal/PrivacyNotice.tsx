/**
 * Aviso de privacidad (versión corta) para los formularios que recolectan datos
 * personales (PQRSD y Contáctenos). Cumple Ley 1581/2012 y Decreto 1377/2013.
 */
export default function PrivacyNotice() {
  return (
    <div className="privacy-notice" role="note">
      <p>
        <b>Responsable:</b> Tuterritorio — Catastro Multipropósito de Valledupar
        (NIT 901.996.731-8), Calle 16 #9-48, Of. 1301, Valledupar. Correo:
        {" "}<a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a>.
        Sus datos serán tratados para atender su solicitud (PQRSD, contacto o trámite catastral),
        notificarle la respuesta y cumplir obligaciones legales. Usted puede conocer, actualizar,
        rectificar y suprimir sus datos y revocar la autorización escribiendo a ese correo. Consulte la{" "}
        <a href="/politica-tratamiento-datos">Política de Tratamiento de Datos</a>.
      </p>
    </div>
  );
}
