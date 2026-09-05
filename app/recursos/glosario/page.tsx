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
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/recursos/foto-recursos4.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/recursos/foto-recursos4-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/recursos/foto-recursos4.webp)", ["--hero-m" as string]: "url(/assets/recursos/foto-recursos4-m.webp)", backgroundPosition: "center 40%" }}>
        <Editable as="h1" id="glos.h1">ABC Catastral</Editable>
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
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/recursos/foto-pilonera2.webp)", ["--band-m" as string]: "url(/assets/recursos/foto-pilonera2-m.webp)", backgroundPosition: "center 37%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="glos.cierre-h2">Aplica lo aprendido en tu trámite</Editable>
          <Editable as="p" id="glos.cierre-p" multiline>Conoce los trámites y productos catastrales disponibles, con sus requisitos y tiempos de respuesta.</Editable>
          <a className="atg-pill" href="/servicios"><Editable as="span" id="glos.cierre-cta">Ver trámites y servicios</Editable></a>
        </div>
      </section>
    </>
  );
}
