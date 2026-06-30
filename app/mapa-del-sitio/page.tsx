import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mapa del sitio",
  description:
    "Mapa del sitio web de Tuterritorio — Catastro Multipropósito de Valledupar: índice de todas las secciones y páginas.",
  alternates: { canonical: "/mapa-del-sitio" },
};

const GRUPOS: { titulo: string; enlaces: { href: string; label: string }[] }[] = [
  {
    titulo: "Institucional",
    enlaces: [
      { href: "/", label: "Inicio" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/nosotros/equipo", label: "Nuestro Equipo" },
      { href: "/noticias", label: "Noticias" },
    ],
  },
  {
    titulo: "Atención y servicios a la ciudadanía",
    enlaces: [
      { href: "/atencion-ciudadania", label: "Atención a la ciudadanía" },
      { href: "/servicios", label: "Trámites y servicios" },
      { href: "/pqrsd", label: "Radica tu PQRSD" },
      { href: "/contactos", label: "Contáctenos" },
    ],
  },
  {
    titulo: "Transparencia y acceso a la información pública",
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
    titulo: "Recursos",
    enlaces: [
      { href: "/recursos/normativas", label: "Normativas" },
      { href: "/recursos/glosario", label: "ABC Catastral" },
    ],
  },
  {
    titulo: "Información legal",
    enlaces: [
      { href: "/politica-tratamiento-datos", label: "Política de Tratamiento de Datos" },
      { href: "/terminos-y-condiciones", label: "Términos y Condiciones" },
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
        <p className="legal-lead">Índice de todas las secciones del sitio de Tuterritorio.</p>

        <div className="legal-body">
          <nav aria-label="Mapa del sitio" className="sitemap-grid">
            {GRUPOS.map((g) => (
              <div key={g.titulo} className="sitemap-group">
                <h2>{g.titulo}</h2>
                <ul>
                  {g.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link href={e.href}>{e.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
