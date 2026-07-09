/**
 * Marcador de espacio para foto (SOLO staging / previsualización).
 *
 * Muestra —con la proporción correcta— dónde irá una imagen real, sin usar
 * fotos de stock. Sirve para ver cómo se acomoda el diseño antes de tener la
 * fotografía institucional definitiva. Cuando llegue la foto real, se reemplaza
 * este componente por un <Image>/<img> en el mismo lugar.
 */
type Props = {
  /** Qué foto irá aquí (se muestra como etiqueta). */
  label: string;
  /** Pista de encuadre/uso, p. ej. "Panorámica · fachada de la sede". */
  hint?: string;
  /** Proporción CSS (aspect-ratio), p. ej. "16 / 9", "3 / 2", "4 / 5". */
  ratio?: string;
  className?: string;
};

const Camera = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export default function PhotoSlot({ label, hint, ratio = "16 / 9", className = "" }: Props) {
  return (
    <div
      className={`photoslot ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Espacio reservado para foto: ${label}`}
    >
      <span className="photoslot-tag">Espacio para foto</span>
      <Camera />
      <span className="photoslot-label">{label}</span>
      {hint && <span className="photoslot-hint">{hint}</span>}
    </div>
  );
}
