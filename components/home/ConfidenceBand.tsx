import PhotoSlot from "@/components/site/PhotoSlot";

/**
 * Banda de confianza (SOLO staging / previsualización).
 *
 * Muestra dónde iría una fila de 3 fotos reales (equipo · campo · atención)
 * que dan identidad y confianza en la página de inicio, debajo del hero.
 * Cuando existan las fotos definitivas, se reemplazan los marcadores.
 */
export default function ConfidenceBand() {
  return (
    <section style={{ padding: "clamp(2.5rem,5vw,4rem) clamp(1rem,5vw,64px)" }}>
      <div className="section-inner">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">Quiénes lo hacen posible</span>
            <h2 className="sec-title">Un equipo real al servicio de Valledupar</h2>
          </div>
          <span className="ribbon-bar" />
        </div>
        <div className="reveal confidence-grid">
          <PhotoSlot label="Nuestro equipo" hint="Retrato del equipo o de un grupo trabajando" ratio="4 / 5" />
          <PhotoSlot label="Trabajo en campo" hint="Levantamiento predial con GPS o estación" ratio="4 / 5" />
          <PhotoSlot label="Atención al ciudadano" hint="Un funcionario orientando a una persona" ratio="4 / 5" />
        </div>
      </div>
    </section>
  );
}
