import type { Metadata } from "next";
import Normativas from "@/components/recursos/Normativas";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Normativas — Tuterritorio",
  description:
    "Marco legal del catastro multipropósito: leyes, decretos, resoluciones y acuerdos que regulan la gestión catastral en Colombia y Valledupar.",
};

export default function NormativasPage() {
  return (
    <>
      <section className="rec-hero rec-hero-norm">
        <div className="rec-hero-inner">
          <span className="rec-eyebrow">Recursos · Marco legal</span>
          <h1>Normativas</h1>
          <Editable as="p" id="norm.hero-intro" multiline>Leyes, decretos, resoluciones y acuerdos que regulan la gestión catastral en Colombia y su aplicación en Valledupar. Consulta y descarga la norma que necesitas.</Editable>
          <span style={{ display: "block", height: 5, width: 140, borderRadius: 999, background: "var(--ribbon)", marginTop: 30 }} />
        </div>
      </section>

      <section id="normativas" className="rec-section blue">
        <div className="rec-wrap">
          <Normativas />
        </div>
      </section>
    </>
  );
}
