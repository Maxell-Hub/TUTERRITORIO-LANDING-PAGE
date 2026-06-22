import type { Metadata } from "next";
import Glosario from "@/components/recursos/Glosario";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Glosario catastral — Tuterritorio",
  description:
    "Diccionario de términos del catastro multipropósito: busca y filtra los conceptos clave explicados en lenguaje claro.",
};

export default function GlosarioPage() {
  return (
    <>
      <section className="rec-hero">
        <div className="rec-glow" style={{ top: -90, right: "6%", width: 320, height: 320, borderRadius: "40% 60% 63% 37% / 41% 44% 56% 59%", background: "radial-gradient(circle at 35% 35%, rgba(143,190,78,.30), rgba(143,190,78,0) 70%)", filter: "blur(10px)", animation: "tt-floatA 16s ease-in-out infinite" }} />
        <div className="rec-glow" style={{ bottom: -70, right: "26%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(89,169,196,.28), rgba(89,169,196,0) 70%)", filter: "blur(8px)", animation: "tt-floatB 20s ease-in-out infinite" }} />
        <div className="rec-hero-inner">
          <span className="rec-eyebrow">Recursos · Términos clave</span>
          <h1>Glosario catastral</h1>
          <Editable as="p" id="glos.hero-intro" multiline>Entiende los términos clave del catastro multipropósito explicados en lenguaje claro. Busca por palabra o filtra por inicial.</Editable>
          <span style={{ display: "block", height: 5, width: 140, borderRadius: 999, background: "var(--ribbon)", marginTop: 30 }} />
        </div>
      </section>

      <section id="glosario" className="rec-section green">
        <div className="rec-wrap">
          <Glosario />
        </div>
      </section>
    </>
  );
}
