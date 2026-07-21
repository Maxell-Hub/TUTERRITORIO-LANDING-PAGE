import type { Metadata } from "next";
import Glosario from "@/components/recursos/Glosario";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "ABC Catastral",
  alternates: { canonical: "/recursos/glosario" },
  description:
    "Diccionario de términos del catastro multipropósito: busca y filtra los conceptos clave explicados en lenguaje claro.",
};

export default function GlosarioPage() {
  return (
    <>
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-finca.jpg)" }}>
        <h1>ABC Catastral</h1>
        <Editable as="p" id="glos.hero-intro" className="sub" multiline>Entiende los términos clave del catastro multipropósito explicados en lenguaje claro. Busca por palabra o filtra por inicial.</Editable>
      </section>

      <section id="glosario" className="atg-band">
        <div className="atg-wrap">
          <Glosario />
        </div>
      </section>
    </>
  );
}
