import type { MetadataRoute } from "next";

const SITE_URL = "https://tuterritorio.gov.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/servicios", priority: 0.9, freq: "monthly" },
    { path: "/pqrsd", priority: 0.9, freq: "monthly" },
    { path: "/atencion-ciudadania", priority: 0.8, freq: "monthly" },
    { path: "/preguntas-frecuentes", priority: 0.7, freq: "monthly" },
    { path: "/contactos", priority: 0.8, freq: "monthly" },
    { path: "/nosotros", priority: 0.7, freq: "monthly" },
    { path: "/nosotros/equipo", priority: 0.6, freq: "monthly" },
    { path: "/noticias", priority: 0.8, freq: "weekly" },
    { path: "/recursos/normativas", priority: 0.6, freq: "monthly" },
    { path: "/recursos/glosario", priority: 0.6, freq: "monthly" },
    // Transparencia y acceso a la información pública (Resolución MinTIC 1519 de 2020)
    { path: "/transparencia", priority: 0.8, freq: "monthly" },
    { path: "/transparencia/informacion-entidad", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/normativa", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/contratacion", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/planeacion", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/tramites", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/participa", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/datos-abiertos", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/grupos-interes", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/reporte-informacion", priority: 0.5, freq: "monthly" },
    { path: "/transparencia/proteccion-datos", priority: 0.5, freq: "monthly" },
    { path: "/politica-tratamiento-datos", priority: 0.4, freq: "yearly" },
    { path: "/terminos-y-condiciones", priority: 0.3, freq: "yearly" },
    { path: "/accesibilidad", priority: 0.3, freq: "yearly" },
    { path: "/mapa-del-sitio", priority: 0.3, freq: "yearly" },
  ];

  return pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
