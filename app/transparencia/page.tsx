import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparencia y acceso a la información pública",
  alternates: { canonical: "/transparencia" },
  description:
    "Sección de Transparencia y Acceso a la Información Pública de Tuterritorio — Catastro Multipropósito de Valledupar, conforme a la Resolución MinTIC 1519 de 2020.",
};

const SUBSECCIONES: { n: string; href: string; titulo: string; desc: string }[] = [
  { n: "1", href: "/transparencia/informacion-entidad", titulo: "Información de la entidad", desc: "Mecanismos de contacto, sedes y horarios, normograma, estructura orgánica, directorio y entes de control." },
  { n: "2", href: "/transparencia/normativa", titulo: "Normativa", desc: "Normas generales y reglamentarias que rigen la entidad y proyectos normativos para comentarios." },
  { n: "3", href: "/transparencia/contratacion", titulo: "Contratación", desc: "Plan Anual de Adquisiciones, ejecución contractual y enlace al SECOP II." },
  { n: "4", href: "/transparencia/planeacion", titulo: "Planeación, presupuesto e informes", desc: "Plan de acción, presupuesto, ejecución presupuestal e informes de gestión." },
  { n: "5", href: "/transparencia/tramites", titulo: "Trámites y servicios", desc: "Listado de trámites y servicios catastrales, con enlace al SUIT." },
  { n: "6", href: "/transparencia/participa", titulo: "Participa", desc: "Espacios de participación ciudadana en la gestión de la entidad." },
  { n: "7", href: "/transparencia/datos-abiertos", titulo: "Datos abiertos", desc: "Conjuntos de datos publicados en el portal datos.gov.co." },
  { n: "8", href: "/transparencia/grupos-interes", titulo: "Información para grupos de interés", desc: "Información dirigida a poblaciones y grupos de interés específicos." },
  { n: "9", href: "/transparencia/reporte-informacion", titulo: "Obligación de reporte de información", desc: "Información que la entidad debe reportar por ley a organismos de control." },
  { n: "10", href: "/transparencia/proteccion-datos", titulo: "Protección de datos personales", desc: "Política de tratamiento de datos personales y derechos de los titulares." },
];

/**
 * Hub de Transparencia — estructura ATG: hero fotográfico tintado
 * (foto de la Alcaldía) seguido de una banda con el índice de secciones
 * como grid de tarjetas enlazadas.
 */
export default function TransparenciaPage() {
  return (
    <>
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atg/foto-alcaldia.jpg)" }}
      >
        <span className="atg-eyebrow">Transparencia · <b>Ley 1712 de 2014</b></span>
        <h1>Transparencia y acceso a la información pública</h1>
        <p className="sub">
          Información pública de Tuterritorio, gestor catastral del municipio de Valledupar, organizada conforme a la
          Resolución MinTIC 1519 de 2020 y la Ley 1712 de 2014.
        </p>
      </section>

      <section className="atg-band">
        <div className="atg-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {SUBSECCIONES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                style={{
                  display: "block",
                  background: "var(--tt-white)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "var(--shadow-sm)",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <span style={{ display: "block", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "var(--tt-blue-700)", marginBottom: 10 }}>
                  {s.n.padStart(2, "0")}
                </span>
                <span style={{ display: "block", fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: "var(--tt-navy-700)" }}>
                  {s.titulo}
                </span>
                <span style={{ display: "block", marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "var(--tt-gray-500)" }}>
                  {s.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
