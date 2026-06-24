import type { Metadata } from "next";
import Glosario from "@/components/recursos/Glosario";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "ABC Catastral — Tuterritorio",
  description:
    "Diccionario de términos del catastro multipropósito: busca y filtra los conceptos clave explicados en lenguaje claro.",
};

export default function GlosarioPage() {
  return (
    <>
      <section className="rec-hero rec-hero-abc">
        <div className="rec-hero-inner">
          <span className="rec-eyebrow">Recursos · Términos clave</span>
          <h1>ABC Catastral</h1>
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
