"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SITE_URL = "https://www.tuterritorio.gov.co";

/** Etiquetas legibles por segmento de ruta. */
const LABELS: Record<string, string> = {
  "nosotros": "Nosotros",
  "equipo": "Nuestro Equipo",
  "atencion-ciudadania": "Atención a la ciudadanía",
  "contactos": "Contactos",
  "servicios": "Trámites y servicios",
  "pqrsd": "PQRSD",
  "preguntas-frecuentes": "Preguntas frecuentes",
  "noticias": "Noticias",
  "recursos": "Recursos",
  "normativas": "Normativas",
  "glosario": "Glosario",
  "transparencia": "Transparencia y acceso a la información pública",
  "tramites": "Trámites",
  "contratacion": "Contratación",
  "grupos-interes": "Grupos de interés",
  "informacion-entidad": "Información de la entidad",
  "normativa": "Normativa",
  "reporte-informacion": "Reporte de información",
  "planeacion": "Planeación",
  "datos-abiertos": "Datos abiertos",
  "proteccion-datos": "Protección de datos",
  "participa": "Participa",
  "mapa-del-sitio": "Mapa del sitio",
  "politica-tratamiento-datos": "Política de tratamiento de datos",
  "terminos-y-condiciones": "Términos y condiciones",
  "accesibilidad": "Accesibilidad",
};

/** Rutas de sección que NO tienen página propia (no se enlazan). */
const NON_PAGE = new Set<string>(["/recursos"]);
/** Primeros segmentos donde no se muestran breadcrumbs. */
const HIDDEN_FIRST = new Set<string>(["buscar", "acceso"]);

function prettify(seg: string): string {
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function labelFor(seg: string, parent: string): string {
  if (LABELS[seg]) return LABELS[seg];
  if (parent === "noticias") return "Noticia"; // detalle de noticia (ruta dinámica)
  return prettify(seg);
}

const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  if (pathname === "/") return null;

  const segs = pathname.split("/").filter(Boolean);
  if (segs.length === 0 || HIDDEN_FIRST.has(segs[0])) return null;

  type Crumb = { name: string; href: string; isPage: boolean };
  const crumbs: Crumb[] = [{ name: "Inicio", href: "/", isPage: true }];
  let acc = "";
  segs.forEach((seg, i) => {
    acc += "/" + seg;
    crumbs.push({ name: labelFor(seg, i > 0 ? segs[i - 1] : ""), href: acc, isPage: !NON_PAGE.has(acc) });
  });

  // Datos estructurados: solo los niveles que corresponden a una página real.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs
      .filter((c) => c.isPage)
      .map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: c.name,
        item: SITE_URL + (c.href === "/" ? "" : c.href),
      })),
  };

  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <div className="bc-wrap">
        <ol>
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.href}>
                {i > 0 && <span className="bc-sep" aria-hidden="true">›</span>}
                {last ? (
                  <span aria-current="page">{c.name}</span>
                ) : c.isPage ? (
                  <Link href={c.href}>
                    {i === 0 ? (
                      <>
                        <HomeIcon />
                        <span>{c.name}</span>
                      </>
                    ) : (
                      c.name
                    )}
                  </Link>
                ) : (
                  <span className="bc-plain">{c.name}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
