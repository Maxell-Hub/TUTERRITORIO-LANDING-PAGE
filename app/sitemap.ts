import type { MetadataRoute } from "next";

const SITE_URL = "https://tuterritorio.gov.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/servicios", priority: 0.9, freq: "monthly" },
    { path: "/pqrsd", priority: 0.9, freq: "monthly" },
    { path: "/contactos", priority: 0.8, freq: "monthly" },
    { path: "/nosotros", priority: 0.7, freq: "monthly" },
    { path: "/nosotros/equipo", priority: 0.6, freq: "monthly" },
    { path: "/noticias", priority: 0.8, freq: "weekly" },
    { path: "/recursos/normativas", priority: 0.6, freq: "monthly" },
    { path: "/recursos/glosario", priority: 0.6, freq: "monthly" },
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
