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

/* Colores corporativos que se alternan por tarjeta (número), como en el diseño
   original del sitio. El texto del relleno al pasar el cursor es blanco en
   TODAS las tarjetas (incluidas las amarillas, a pedido del usuario). */
const T_COLORS: { accent: string; fg: string }[] = [
  { accent: "#4E8654", fg: "#ffffff" }, // verde corporativo
  { accent: "#3B85A5", fg: "#ffffff" }, // azul corporativo
  { accent: "#F0B63B", fg: "#ffffff" }, // amarillo (acento)
];

/**
 * Hub de Transparencia — hero fotográfico ATG seguido del índice de secciones
 * con las tarjetas del diseño original del sitio (t-card: número de color,
 * borde de acento y flecha, con hover que rellena el número).
 */
export default function TransparenciaPage() {
  return (
    <>
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-alcaldia.jpg)", backgroundPosition: "center 22%" }}
      >
        <h1>Transparencia y acceso a la información pública</h1>
        <p className="sub">
          Información pública de Tuterritorio, gestor catastral del municipio de Valledupar, organizada conforme a la
          Resolución MinTIC 1519 de 2020 y la Ley 1712 de 2014.
        </p>
      </section>

      <section className="atg-band">
        <div className="atg-wrap">
          <div className="t-grid" style={{ marginTop: 0 }}>
            {SUBSECCIONES.map((s, i) => {
              const c = T_COLORS[i % T_COLORS.length];
              return (
                <Link key={s.href} href={s.href} className="t-card reveal" style={{ ["--accent" as string]: c.accent, ["--num-fg" as string]: c.fg }}>
                  <span className="t-num">{s.n}</span>
                  <span className="t-card-body">
                    <span className="t-card-title">{s.titulo}</span>
                    <span className="t-card-desc">{s.desc}</span>
                  </span>
                  <span className="t-card-go" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-centro.jpg)", backgroundPosition: "center 45%" }}
      >
        <div className="atg-wrap">
          <h2>La información pública, al alcance de todos</h2>
          <p>Si no encuentras un documento o necesitas más información, escríbenos: cada solicitud queda con radicado y tiempos de respuesta según la ley.</p>
          <a className="atg-pill" href="/pqrsd">Radicar una PQRSD</a>
        </div>
      </section>
    </>
  );
}
