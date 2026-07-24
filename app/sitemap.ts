import type { MetadataRoute } from "next";
import { readContent } from "@/lib/store";
import { defaultFor, type News } from "@/lib/content";

const SITE_URL = "https://www.tuterritorio.gov.co";

// Se regenera cada hora para recoger las noticias nuevas del gestor de contenido.
export const revalidate = 3600;

/** Fecha de la noticia a partir de su id (n-AAAA-MM-DD…) o del texto de fecha. */
function fechaNoticia(n: News, fallback: Date): Date {
  const m = n.id.match(/^n-(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const estaticas: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  // Una entrada por cada noticia publicada (/noticias/[id]), para que Google
  // pueda encontrarlas e indexarlas individualmente.
  let noticias: News[] = [];
  try {
    const data = await readContent("noticias", defaultFor("noticias"));
    if (Array.isArray(data)) noticias = data as News[];
  } catch {
    /* si falla la lectura, el sitemap conserva solo las páginas fijas */
  }
  const detalleNoticias: MetadataRoute.Sitemap = noticias
    .filter((n) => n?.id)
    .map((n) => ({
      url: `${SITE_URL}/noticias/${n.id}`,
      lastModified: fechaNoticia(n, now),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...estaticas, ...detalleNoticias];
}
