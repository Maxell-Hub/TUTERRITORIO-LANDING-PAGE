/**
 * Aviso informativo sobre trámites y servicios catastrales (Decreto 148 de 2020):
 * diferencia de competencias entre el Gestor Catastral (Municipio de Valledupar)
 * y el Operador Catastral (Tuterritorio S.A.S). Se usa como tarjeta fija y como
 * modal de entrada en la página de Trámites y servicios.
 */
const GESTOR_EMAIL = "atencionalcontribuyente@valledupar-cesar.gov.co";

/** Contenido del aviso (ícono + texto), sin contenedor. */
export function AvisoTramitesBody({ titleId = "aviso-tramites-titulo" }: { titleId?: string }) {
  return (
    <>
      <div className="aviso-gestor__icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
      </div>
      <div className="aviso-gestor__body">
        <h2 id={titleId} className="aviso-gestor__title">
          Aviso informativo sobre trámites y servicios catastrales
        </h2>
        <p className="aviso-gestor__text">
          Tuterritorio S.A.S actúa exclusivamente como <strong>Operador Catastral del Municipio de
          Valledupar</strong>.
        </p>
        <p className="aviso-gestor__text">
          La información, catálogo y requisitos de trámites presentados en esta sección se publican con
          fines exclusivamente <strong>informativos, orientativos y de consulta ciudadana</strong>. Le
          recordamos a todos los usuarios y propietarios las diferencias de competencia establecidas en el
          Decreto 148 de 2020:
        </p>
        <ul className="aviso-gestor__list">
          <li>
            <strong>Gestor Catastral (Municipio de Valledupar):</strong> es la autoridad pública legalmente
            facultada y responsable de recibir, evaluar, sustanciar, expedir resoluciones administrativas y
            formalizar las mutaciones catastrales, rectificaciones de área y linderos, revisiones de avalúo
            y certificación oficial de los predios.
          </li>
          <li>
            <strong>Operador Catastral (Tuterritorio S.A.S):</strong> brinda el apoyo técnico, tecnológico y
            de campo necesario para la toma de datos e insumos. Apoyamos operativamente la gestión, pero no
            emitimos actos administrativos, resoluciones formales ni aprobaciones jurídicas de cambios en la
            base catastral.
          </li>
        </ul>
        <p className="aviso-gestor__text">
          <strong>¿Dónde radicar formalmente tus trámites catastrales?</strong> Para dar inicio oficial a
          cualquiera de los trámites o mutaciones listados a continuación, debes enviar tus requisitos
          únicamente al correo oficial habilitado por el Gestor Catastral:
        </p>
        <div className="aviso-gestor__cta">
          <a className="aviso-gestor__mail" href={`mailto:${GESTOR_EMAIL}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {GESTOR_EMAIL}
          </a>
        </div>
      </div>
    </>
  );
}

/** Tarjeta fija del disclaimer (visible mientras se navega la sección). */
export default function AvisoTramitesCard() {
  return (
    <aside className="aviso-gestor reveal" role="note" aria-labelledby="aviso-tramites-card-titulo">
      <AvisoTramitesBody titleId="aviso-tramites-card-titulo" />
    </aside>
  );
}
