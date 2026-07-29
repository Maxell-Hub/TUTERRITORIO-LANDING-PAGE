/**
 * Aviso institucional: recuerda al ciudadano que Tuterritorio es el Operador
 * Catastral (apoyo técnico) y que los trámites que requieren acto administrativo
 * se radican ante el Gestor Catastral (Municipio de Valledupar). El cuerpo
 * (`AvisoGestorBody`) se reutiliza en la tarjeta fija (Servicios) y en el modal
 * de PQRSD. Decreto 148 de 2020.
 */
const GESTOR_EMAIL = "atencionalcontribuyente@valledupar-cesar.gov.co";

const TRAMITES_GESTOR = [
  "Mutaciones catastrales: cambio de propietario, englobes, desenglobes, nuevas construcciones, demoliciones o cambios de uso.",
  "Rectificaciones de área, linderos o corrección de datos.",
  "Revisiones de avalúo catastral.",
  "Certificados y certificaciones catastrales oficiales.",
];

/** Contenido del aviso (ícono + texto), sin contenedor. */
export function AvisoGestorBody({ nota }: { nota?: string }) {
  return (
    <>
      <div className="aviso-gestor__icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
      </div>
      <div className="aviso-gestor__body">
        <h2 id="aviso-gestor-titulo" className="aviso-gestor__title">
          ¿Tu solicitud es un trámite catastral? Radícala ante el Gestor
        </h2>
        <p className="aviso-gestor__text">
          Tuterritorio S.A.S es el <strong>Operador Catastral</strong> del municipio de Valledupar: brindamos
          el apoyo técnico, tecnológico y de campo de la gestión catastral, pero <strong>no expedimos actos
          administrativos ni modificamos la base catastral oficial</strong> (Decreto 148 de 2020).
        </p>
        <p className="aviso-gestor__text">
          Si tu solicitud requiere una decisión formal —como las siguientes—, debes radicarla directamente
          ante el <strong>Gestor Catastral (Municipio de Valledupar)</strong>:
        </p>
        <ul className="aviso-gestor__list">
          {TRAMITES_GESTOR.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="aviso-gestor__cta">
          <span className="aviso-gestor__cta-label">Correo habilitado para la recepción de solicitudes ante el gestor catastral:</span>
          <a className="aviso-gestor__mail" href={`mailto:${GESTOR_EMAIL}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {GESTOR_EMAIL}
          </a>
        </div>
        {nota && <p className="aviso-gestor__nota">{nota}</p>}
      </div>
    </>
  );
}

/** Tarjeta fija (usada como disclaimer en Trámites y servicios). */
export default function AvisoGestorCatastral({ nota }: { nota?: string }) {
  return (
    <aside className="aviso-gestor reveal" role="note" aria-labelledby="aviso-gestor-titulo">
      <AvisoGestorBody nota={nota} />
    </aside>
  );
}
