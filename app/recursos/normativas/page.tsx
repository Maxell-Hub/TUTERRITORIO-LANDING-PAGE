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
      <section className="rec-hero">
        <div className="rec-glow" style={{ top: -90, right: "6%", width: 320, height: 320, borderRadius: "40% 60% 63% 37% / 41% 44% 56% 59%", background: "radial-gradient(circle at 35% 35%, rgba(143,190,78,.30), rgba(143,190,78,0) 70%)", filter: "blur(10px)", animation: "tt-floatA 16s ease-in-out infinite" }} />
        <div className="rec-glow" style={{ bottom: -70, right: "26%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(89,169,196,.28), rgba(89,169,196,0) 70%)", filter: "blur(8px)", animation: "tt-floatB 20s ease-in-out infinite" }} />
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
