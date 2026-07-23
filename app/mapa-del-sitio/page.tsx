import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mapa del sitio",
  description:
    "Mapa del sitio web de Tuterritorio — Catastro Multipropósito de Valledupar: índice de todas las secciones y páginas.",
  alternates: { canonical: "/mapa-del-sitio" },
};

const GRUPOS: { titulo: string; accent: string; enlaces: { href: string; label: string }[] }[] = [
  {
    titulo: "Institucional",
    accent: "#163A4C",
    enlaces: [
      { href: "/", label: "Inicio" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/nosotros/equipo", label: "Nuestro equipo" },
      { href: "/noticias", label: "Noticias" },
    ],
  },
  {
    titulo: "Atención y servicios a la ciudadanía",
    accent: "#3B85A5",
    enlaces: [
      { href: "/atencion-ciudadania", label: "Atención a la ciudadanía" },
      { href: "/servicios", label: "Trámites y servicios" },
      { href: "/pqrsd", label: "Radica tu PQRSD" },
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
      { href: "/contactos", label: "Contáctenos" },
    ],
  },
  {
    titulo: "Recursos",
    accent: "#4E8654",
    enlaces: [
      { href: "/recursos/normativas", label: "Normativas" },
      { href: "/recursos/glosario", label: "ABC Catastral (glosario)" },
    ],
  },
  {
    titulo: "Transparencia y acceso a la información pública",
    accent: "#B9831A",
    enlaces: [
      { href: "/transparencia", label: "Inicio de Transparencia" },
      { href: "/transparencia/informacion-entidad", label: "Información de la entidad" },
      { href: "/transparencia/normativa", label: "Normativa" },
      { href: "/transparencia/contratacion", label: "Contratación" },
      { href: "/transparencia/planeacion", label: "Planeación, presupuesto e informes" },
      { href: "/transparencia/tramites", label: "Trámites y servicios" },
      { href: "/transparencia/participa", label: "Participa" },
      { href: "/transparencia/datos-abiertos", label: "Datos abiertos" },
      { href: "/transparencia/grupos-interes", label: "Información para grupos de interés" },
      { href: "/transparencia/reporte-informacion", label: "Obligación de reporte de información" },
      { href: "/transparencia/proteccion-datos", label: "Protección de datos personales" },
    ],
  },
  {
    titulo: "Información legal",
    accent: "#6C757D",
    enlaces: [
      { href: "/politica-tratamiento-datos", label: "Política de tratamiento de datos" },
      { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
      { href: "/accesibilidad", label: "Accesibilidad" },
      { href: "/mapa-del-sitio", label: "Mapa del sitio" },
    ],
  },
];

export default function MapaDelSitioPage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/foto-mapa.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/foto-mapa-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-mapa.webp)", ["--hero-m" as string]: "url(/assets/foto-mapa-m.webp)", backgroundPosition: "center 35%" }}>
        <h1>Mapa del sitio</h1>
        <p className="sub">
          Índice organizado de todas las secciones y páginas del sitio de Tuterritorio, agrupadas por tema.
        </p>
      </section>

      <section className="legal-hero">
        <div className="legal-wrap">
          <div className="legal-body">
          <nav aria-label="Mapa del sitio" className="sitemap-grid">
            {GRUPOS.map((g) => (
              <section key={g.titulo} className="sitemap-group" style={{ ["--accent" as string]: g.accent }}>
                <h2>{g.titulo}</h2>
                <span className="sitemap-bar" aria-hidden="true" />
                <ul>
                  {g.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link href={e.href}>{e.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
          </div>
        </div>
      </section>
    </>
  );
}
