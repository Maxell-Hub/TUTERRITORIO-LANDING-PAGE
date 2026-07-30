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
      <link rel="preload" as="image" href="/assets/recursos/foto-normativas5.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/recursos/foto-normativas5-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/recursos/foto-normativas5.webp)", ["--hero-m" as string]: "url(/assets/recursos/foto-normativas5-m.webp)" }}>
        <Editable as="h1" id="norm.h1">Normativas</Editable>
        <Editable as="p" id="norm.hero-intro" className="sub" multiline>Leyes, decretos, resoluciones, acuerdos y demás disposiciones normativas que regulan la Gestión Catastral Multipropósito en Colombia, así como la normativa aplicable a las actividades desarrolladas por el municipio de Valledupar en su calidad de Gestor Catastral. Consulta y descarga la norma que necesitas.</Editable>
      </section>

      <section id="normativas" className="atg-band">
        <div className="atg-wrap">
          <Editable as="h2" id="norm.section-title" className="norm-title">Normograma del Gestor Catastral</Editable>
          <Normativas />
        </div>
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/recursos/foto-madres2.webp)", ["--band-m" as string]: "url(/assets/recursos/foto-madres2-m.webp)", backgroundPosition: "center 45%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="norm.cierre-h2">¿Términos que no conoces?</Editable>
          <Editable as="p" id="norm.cierre-p" multiline>Consulta el ABC Catastral: el glosario con los conceptos clave para entender la normativa y tus trámites.</Editable>
          <a className="atg-pill" href="/recursos/glosario"><Editable as="span" id="norm.cierre-cta">Ver el ABC Catastral</Editable></a>
        </div>
      </section>
    </>
  );
}
