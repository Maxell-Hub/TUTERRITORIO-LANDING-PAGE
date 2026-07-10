import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mapa del sitio",
  description:
    "Mapa del sitio web de Tuterritorio — Catastro Multipropósito de Valledupar: índice de todas las secciones y páginas.",
  alternates: { canonical: "/mapa-del-sitio" },
};

const GRUPOS: { titulo: string; desc: string; accent: string; enlaces: { href: string; label: string }[] }[] = [
  {
    titulo: "Institucional",
    desc: "Quiénes somos, nuestro equipo y las novedades de la entidad.",
    accent: "#0C222F",
    enlaces: [
      { href: "/", label: "Inicio" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/nosotros/equipo", label: "Nuestro equipo" },
      { href: "/noticias", label: "Noticias" },
    ],
  },
  {
    titulo: "Atención y servicios a la ciudadanía",
    desc: "Trámites, canales de atención y radicación de solicitudes.",
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
    desc: "Material de consulta para entender el catastro y su marco legal.",
    accent: "#4E8654",
    enlaces: [
      { href: "/recursos/normativas", label: "Normativas" },
      { href: "/recursos/glosario", label: "ABC Catastral (glosario)" },
    ],
  },
  {
    titulo: "Transparencia y acceso a la información pública",
    desc: "Información pública de la entidad según la Ley 1712 de 2014 y la Resolución 1519 de 2020.",
    accent: "#F0B63B",
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
    desc: "Políticas y condiciones de uso de este sitio web.",
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
    <section className="legal-hero">
      <div className="legal-wrap">
        <span className="legal-eyebrow">Navegación</span>
        <h1>Mapa del sitio</h1>
        <p className="legal-lead">
          Índice organizado de todas las secciones y páginas del sitio de Tuterritorio, agrupadas por tema.
        </p>

        <div className="legal-body">
          <nav aria-label="Mapa del sitio" className="sitemap-index">
            {GRUPOS.map((g) => (
              <section key={g.titulo} className="sitemap-group" style={{ ["--accent" as string]: g.accent }}>
                <div className="sitemap-head">
                  <h2>{g.titulo}</h2>
                  <span className="sitemap-count">{g.enlaces.length} {g.enlaces.length === 1 ? "página" : "páginas"}</span>
                </div>
                <p className="sitemap-desc">{g.desc}</p>
                <ul>
                  {g.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link href={e.href}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        {e.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
