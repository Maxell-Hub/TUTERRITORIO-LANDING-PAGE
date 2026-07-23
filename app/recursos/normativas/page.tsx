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
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/foto-normativas5.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/foto-normativas5-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-normativas5.webp)", ["--hero-m" as string]: "url(/assets/foto-normativas5-m.webp)" }}>
        <h1>Normativas</h1>
        <Editable as="p" id="norm.hero-intro" className="sub" multiline>Leyes, decretos, resoluciones y acuerdos que regulan la gestión catastral en Colombia y su aplicación en Valledupar. Consulta y descarga la norma que necesitas.</Editable>
      </section>

      <section id="normativas" className="atg-band">
        <div className="atg-wrap">
          <Normativas />
        </div>
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-madres.webp)", ["--band-m" as string]: "url(/assets/foto-madres-m.webp)", backgroundPosition: "center 45%" }}
      >
        <div className="atg-wrap">
          <h2>¿Términos que no conoces?</h2>
          <p>Consulta el ABC Catastral: el glosario con los conceptos clave para entender la normativa y tus trámites.</p>
          <a className="atg-pill" href="/recursos/glosario">Ver el ABC Catastral</a>
        </div>
      </section>
    </>
  );
}
