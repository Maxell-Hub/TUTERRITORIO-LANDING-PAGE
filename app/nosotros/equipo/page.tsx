import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import EquipoTeam from "@/components/nosotros/EquipoTeam";

export const metadata: Metadata = {
  title: "Nuestro Equipo",
  alternates: { canonical: "/nosotros/equipo" },
  description:
    "Conoce al equipo humano de Tuterritorio: liderazgo y equipo técnico interdisciplinario que opera el catastro de Valledupar.",
};

/**
 * Nuestro Equipo — estructura del diseño ATG:
 * hero fotográfico tintado → liderazgo (banda) → equipo técnico (banda)
 * → franja fotográfica de cierre. Las bandas del equipo las renderiza
 * EquipoTeam (miembros administrables desde el modo administrador).
 */
export default function EquipoPage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/equipo/foto-equipo2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/equipo/foto-equipo2-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/equipo/foto-equipo2.webp)", ["--hero-m" as string]: "url(/assets/equipo/foto-equipo2-m.webp)", backgroundPosition: "center 40%" }}
      >
        <h1>
          Detrás de cada predio,<br />hay <span style={{ color: "#fff" }}>un equipo</span> que lo hace posible
        </h1>
        <Editable as="p" id="equipo.intro" className="sub" multiline>
          Conoce al equipo que apoya el desarrollo de las actividades técnicas y operativas de la gestión catastral, tanto en campo como en oficina, contribuyendo al levantamiento, revisión, procesamiento y actualización de la información catastral, de acuerdo con los procedimientos y lineamientos establecidos.
        </Editable>
        <div className="atg-cta-row">
          <a className="atg-pill" href="#equipo"><Editable as="span" id="equipo.hero-cta1">Conoce al equipo</Editable></a>
          <a className="atg-pill ghost" href="/contactos"><Editable as="span" id="equipo.hero-cta2">Contáctanos</Editable></a>
        </div>
      </section>

      {/* 2-3 · Liderazgo + Equipo técnico (editable por el administrador) */}
      <EquipoTeam />

      {/* 4 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/equipo/foto-mulata2.webp)", ["--band-m" as string]: "url(/assets/equipo/foto-mulata2-m.webp)", backgroundPosition: "center 42%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="equipo.cierre-h2">Un equipo que trabaja por una mejor información catastral</Editable>
          <Editable as="p" id="equipo.cierre-p" multiline>En campo y en oficina, nuestro equipo desarrolla las actividades a su cargo, contribuyendo al adecuado desarrollo de los procesos técnicos y operativos relacionados con la información catastral del municipio, de acuerdo con los procedimientos y lineamientos establecidos.</Editable>
          <a className="atg-pill" href="/contactos"><Editable as="span" id="equipo.cierre-cta">Contáctanos</Editable></a>
        </div>
      </section>
    </>
  );
}
