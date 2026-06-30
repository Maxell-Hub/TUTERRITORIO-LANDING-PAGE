/**
 * Marcador de contenido pendiente de cargar por la entidad.
 * Se usa en las secciones de Transparencia donde aún no hay documento/dato
 * oficial. NO inventa información: solo señala qué falta y por qué.
 */
export default function PendienteContenido({
  titulo,
  descripcion = "Documento pendiente de cargar por la entidad.",
}: {
  titulo: string;
  descripcion?: string;
}) {
  return (
    <div className="pend-card" role="note">
      <span className="pend-ic" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 18v-4M12 11h.01" />
        </svg>
      </span>
      <div>
        <p className="pend-title">{titulo}</p>
        <p className="pend-desc">{descripcion}</p>
      </div>
    </div>
  );
}
