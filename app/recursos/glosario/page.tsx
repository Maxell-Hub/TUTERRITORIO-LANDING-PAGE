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
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-recursos.jpg)", backgroundPosition: "center 15%" }}>
        <h1>ABC Catastral</h1>
        <Editable as="p" id="glos.hero-intro" className="sub" multiline>Entiende los términos clave del catastro multipropósito explicados en lenguaje claro. Busca por palabra o filtra por inicial.</Editable>
      </section>

      <section id="glosario" className="atg-band">
        <div className="atg-wrap">
          <Glosario />
        </div>
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-pilonera.jpg)", backgroundPosition: "center 60%" }}
      >
        <div className="atg-wrap">
          <h2>Aplica lo aprendido en tu trámite</h2>
          <p>Conoce los trámites y productos catastrales disponibles, con sus requisitos y tiempos de respuesta.</p>
          <a className="atg-pill" href="/servicios">Ver trámites y servicios</a>
        </div>
      </section>
    </>
  );
}
