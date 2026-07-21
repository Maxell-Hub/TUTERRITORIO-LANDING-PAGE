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
      {/* 1 · Hero fotográfico */}
      {/* IMAGEN PENDIENTE: foto grupal del equipo de Tuterritorio (en la sede o en campo)
          para reemplazar foto-archivo.jpg como fondo del hero. */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-archivo.jpg)" }}
      >
        <h1>
          Detrás de cada predio,<br />hay <span className="b">un equipo</span> que lo hace posible
        </h1>
        <Editable as="p" id="equipo.intro" className="sub" multiline>
          Estas son las personas que levantan, revisan y responden por la información catastral de tu predio, en campo y en oficina.
        </Editable>
        <div className="atg-cta-row">
          <a className="atg-pill" href="#liderazgo">Conoce el liderazgo</a>
          <a className="atg-pill ghost" href="#equipo-tecnico">Ver el equipo técnico</a>
        </div>
      </section>

      {/* 2-3 · Liderazgo + Equipo técnico (editable por el administrador) */}
      <EquipoTeam />

      {/* 4 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-mulata.jpg)", backgroundPosition: "center 42%" }}
      >
        <div className="atg-wrap">
          <h2>Un equipo que responde por tu predio</h2>
          <p>En campo y en oficina, cada integrante trabaja para que la información catastral de Valledupar sea confiable y esté al día.</p>
          <a className="atg-pill" href="/contactos">Contáctanos</a>
        </div>
      </section>
    </>
  );
}
