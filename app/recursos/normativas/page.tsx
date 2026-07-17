import type { Metadata } from "next";
import Normativas from "@/components/recursos/Normativas";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Normativas",
  alternates: { canonical: "/recursos/normativas" },
  description:
    "Marco legal del catastro multipropósito: leyes, decretos, resoluciones y acuerdos que regulan la gestión catastral en Colombia y Valledupar.",
};

export default function NormativasPage() {
  return (
    <>
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atg/foto-ortofoto.jpg)" }}>
        <span className="atg-eyebrow">Recursos · <b>Marco legal</b></span>
        <h1>Normativas</h1>
        <Editable as="p" id="norm.hero-intro" className="sub" multiline>Leyes, decretos, resoluciones y acuerdos que regulan la gestión catastral en Colombia y su aplicación en Valledupar. Consulta y descarga la norma que necesitas.</Editable>
      </section>

      <section id="normativas" className="atg-band">
        <div className="atg-wrap">
          <Normativas />
        </div>
      </section>
    </>
  );
}
