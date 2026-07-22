"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  title: string;
  titleEn?: string;
  desc?: string;
  descEn?: string;
  keywords?: string; // solo para coincidencias (no se muestra)
  href: string;
  cat: string;
  catEn?: string;
};

const norm = (s: string) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function readLang(): "es" | "en" {
  if (typeof document === "undefined") return "es";
  const m = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
  return m && m[1] === "en" ? "en" : "es";
}

/** Páginas y secciones fijas del sitio, con texto en español e inglés.
 *  Cubre TODO el sitio actual: páginas del menú, las 10 subsecciones de
 *  Transparencia, recursos, legales y documentos clave. */
const STATIC_ITEMS: Item[] = [
  { title: "Inicio", titleEn: "Home", desc: "Consulta tu predio: linderos, área y avalúo.", descEn: "Check your property: boundaries, area and appraisal.", keywords: "catastro multipropósito impuesto predial visor · cadastre property tax viewer", href: "/", cat: "Inicio", catEn: "Home" },
  { title: "Nosotros", titleEn: "About us", desc: "Quiénes somos, misión, visión, funciones y etapas del proceso catastral.", descEn: "Who we are, mission, vision, functions and cadastral process stages.", keywords: "gestor catastral objetivos operador formación actualización conservación difusión instalaciones video · cadastral manager mission vision stages", href: "/nosotros", cat: "Nosotros", catEn: "About" },
  { title: "Nuestro equipo", titleEn: "Our team", desc: "El equipo de Tuterritorio: liderazgo y equipo técnico.", descEn: "The Tuterritorio team: leadership and technical staff.", keywords: "liderazgo integrantes técnico jurídico · staff leadership members", href: "/nosotros/equipo", cat: "Nosotros", catEn: "About" },
  { title: "Trámites y servicios", titleEn: "Procedures and services", desc: "Los 18 trámites y productos catastrales, con requisitos, tiempos y costos.", descEn: "The 18 cadastral procedures and products, with requirements, times and costs.", keywords: "incorporación rectificación desenglobe englobe inscripción avalúo mutación cambio de propietario certificado costos · area registration change of owner certificate costs", href: "/servicios", cat: "Servicios", catEn: "Services" },
  { title: "Atención a la ciudadanía", titleEn: "Citizen services", desc: "Canales de atención, preguntas frecuentes y carta de trato digno.", descEn: "Service channels, FAQ and dignified treatment charter.", keywords: "elige cómo quieres que te atendamos sede horarios · customer service channels", href: "/atencion-ciudadania", cat: "Atención", catEn: "Attention" },
  { title: "Carta de trato digno", titleEn: "Dignified treatment charter", desc: "Documento con los derechos de los ciudadanos y los medios para garantizarlos (PDF).", descEn: "Document with citizens' rights and the means to guarantee them (PDF).", keywords: "derechos deberes ley 1437 documento pdf · rights duties charter", href: "/atencion-ciudadania#carta-trato-digno", cat: "Atención", catEn: "Attention" },
  { title: "Preguntas frecuentes", titleEn: "Frequently asked questions", desc: "Respuestas sobre trámites, avalúos, impuesto predial y PQRSD.", descEn: "Answers about procedures, appraisals, property tax and complaints.", keywords: "faq dudas abc cédula catastral tiempos respuestas · faq questions answers", href: "/preguntas-frecuentes", cat: "Atención", catEn: "Attention" },
  { title: "Transparencia", titleEn: "Transparency", desc: "Transparencia y acceso a la información pública (Ley 1712, Res. 1519).", descEn: "Transparency and access to public information.", keywords: "información pública mintic índice · public information index", href: "/transparencia", cat: "Transparencia", catEn: "Transparency" },
  { title: "Información de la entidad", titleEn: "Entity information", desc: "Contacto, sedes, normograma, estructura orgánica y directorio.", descEn: "Contact, offices, legal framework, structure and directory.", keywords: "organigrama entes de control horarios transparencia 1 · structure directory", href: "/transparencia/informacion-entidad", cat: "Transparencia", catEn: "Transparency" },
  { title: "Normativa (Transparencia)", titleEn: "Regulations (Transparency)", desc: "Normas que rigen la entidad y proyectos normativos.", descEn: "Rules governing the entity and draft regulations.", keywords: "leyes decretos transparencia 2 · laws decrees", href: "/transparencia/normativa", cat: "Transparencia", catEn: "Transparency" },
  { title: "Contratación", titleEn: "Procurement", desc: "Plan Anual de Adquisiciones, ejecución contractual y SECOP II.", descEn: "Annual procurement plan and SECOP II.", keywords: "contratos licitaciones paa secop transparencia 3 · contracts bidding", href: "/transparencia/contratacion", cat: "Transparencia", catEn: "Transparency" },
  { title: "Planeación, presupuesto e informes", titleEn: "Planning, budget and reports", desc: "Plan de acción, presupuesto y ejecución presupuestal.", descEn: "Action plan, budget and budget execution.", keywords: "informes de gestión transparencia 4 · management reports", href: "/transparencia/planeacion", cat: "Transparencia", catEn: "Transparency" },
  { title: "Trámites (Transparencia)", titleEn: "Procedures (Transparency)", desc: "Listado de trámites y servicios con enlace al SUIT.", descEn: "List of procedures and services with SUIT link.", keywords: "suit transparencia 5 · procedures list", href: "/transparencia/tramites", cat: "Transparencia", catEn: "Transparency" },
  { title: "Participa", titleEn: "Participate", desc: "Espacios de participación ciudadana: diagnóstico, planeación, control social y rendición de cuentas.", descEn: "Citizen participation: diagnosis, planning, social control and accountability.", keywords: "participación ciudadana fases control social rendición de cuentas transparencia 6 · citizen participation accountability", href: "/transparencia/participa", cat: "Transparencia", catEn: "Transparency" },
  { title: "Datos abiertos", titleEn: "Open data", desc: "Conjuntos de datos publicados en datos.gov.co.", descEn: "Datasets published on datos.gov.co.", keywords: "open data transparencia 7 · datasets", href: "/transparencia/datos-abiertos", cat: "Transparencia", catEn: "Transparency" },
  { title: "Información para grupos de interés", titleEn: "Information for stakeholders", desc: "Información para poblaciones y grupos específicos.", descEn: "Information for specific populations and groups.", keywords: "niños jóvenes étnicos transparencia 8 · stakeholders", href: "/transparencia/grupos-interes", cat: "Transparencia", catEn: "Transparency" },
  { title: "Obligación de reporte de información", titleEn: "Mandatory reporting", desc: "Información que la entidad reporta a organismos de control.", descEn: "Information reported to control bodies.", keywords: "contraloría procuraduría transparencia 9 · reporting control", href: "/transparencia/reporte-informacion", cat: "Transparencia", catEn: "Transparency" },
  { title: "Protección de datos personales", titleEn: "Personal data protection", desc: "Política de tratamiento de datos y derechos de los titulares.", descEn: "Data processing policy and data subjects' rights.", keywords: "habeas data ley 1581 transparencia 10 · privacy data protection", href: "/transparencia/proteccion-datos", cat: "Transparencia", catEn: "Transparency" },
  { title: "Normativas", titleEn: "Regulations", desc: "Leyes, decretos y resoluciones del catastro.", descEn: "Cadastral laws, decrees and resolutions.", keywords: "acuerdos marco legal igac recursos · legal framework", href: "/recursos/normativas", cat: "Recursos", catEn: "Resources" },
  { title: "ABC Catastral", titleEn: "Cadastral glossary", desc: "Glosario con los términos clave del catastro, con buscador.", descEn: "Glossary of key cadastral terms, searchable.", keywords: "definiciones conceptos abc glosario · definitions concepts", href: "/recursos/glosario", cat: "Recursos", catEn: "Resources" },
  { title: "Noticias", titleEn: "News", desc: "Sala de prensa y novedades del catastro.", descEn: "Press room and cadastre updates.", keywords: "actualización catastral comunidad prensa · press updates community", href: "/noticias", cat: "Noticias", catEn: "News" },
  { title: "Contáctenos", titleEn: "Contact us", desc: "Formulario de contacto, sede, horario y mapa para llegar.", descEn: "Contact form, office, opening hours and map.", keywords: "sede caja agraria mapa ubicación escribir teléfono correo cómo llegar · office hours map location phone email", href: "/contactos", cat: "Contactos", catEn: "Contact" },
  { title: "PQRSD", titleEn: "Complaints (PQRSD)", desc: "Radica peticiones, quejas, reclamos, sugerencias y denuncias en línea.", descEn: "File petitions, complaints, claims, suggestions and reports online.", keywords: "radicado formulario solicitud denuncias sugerencias · requests suggestions reports filing", href: "/pqrsd", cat: "Contactos", catEn: "Contact" },
  { title: "Mapa del sitio", titleEn: "Site map", desc: "Todas las páginas del sitio organizadas por sección.", descEn: "All site pages organized by section.", keywords: "navegación índice páginas · navigation index", href: "/mapa-del-sitio", cat: "Sitio", catEn: "Site" },
  { title: "Accesibilidad", titleEn: "Accessibility", desc: "Declaración de accesibilidad web del sitio.", descEn: "Web accessibility statement.", keywords: "wcag contraste teclado lector de pantalla · accessibility screen reader keyboard", href: "/accesibilidad", cat: "Sitio", catEn: "Site" },
  { title: "Política de tratamiento de datos", titleEn: "Data processing policy", desc: "Política de privacidad y tratamiento de datos personales.", descEn: "Privacy and personal data processing policy.", keywords: "privacidad habeas data ley 1581 · privacy policy", href: "/politica-tratamiento-datos", cat: "Sitio", catEn: "Site" },
  { title: "Términos y condiciones", titleEn: "Terms and conditions", desc: "Términos y condiciones de uso del sitio.", descEn: "Website terms and conditions of use.", keywords: "condiciones legales uso · legal terms", href: "/terminos-y-condiciones", cat: "Sitio", catEn: "Site" },
];

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [dynamic, setDynamic] = useState<Item[]>([]);
  const [lang, setLang] = useState<"es" | "en">("es");
  const loadedRef = useRef(false);

  useEffect(() => setLang(readLang()), []);

  // Muestra el campo correcto según el idioma activo.
  const dTitle = (it: Item) => (lang === "en" && it.titleEn ? it.titleEn : it.title);
  const dDesc = (it: Item) => (lang === "en" && it.descEn ? it.descEn : it.desc || "");
  const dCat = (it: Item) => (lang === "en" && it.catEn ? it.catEn : it.cat);

  // Carga (una sola vez, al enfocar) el contenido editable para incluirlo.
  async function loadIndex() {
    if (loadedRef.current) return;
    loadedRef.current = true;
    try {
      const [noticias, normativas, glosario, equipo] = await Promise.all([
        fetch("/api/content/noticias").then((r) => r.json()).catch(() => []),
        fetch("/api/content/normativas").then((r) => r.json()).catch(() => []),
        fetch("/api/content/glosario").then((r) => r.json()).catch(() => []),
        fetch("/api/content/equipo").then((r) => r.json()).catch(() => []),
      ]);
      const items: Item[] = [];
      if (Array.isArray(noticias)) noticias.forEach((n: { id?: string; titulo?: string; extracto?: string }) => n?.titulo && items.push({ title: n.titulo, desc: n.extracto || "", href: n.id ? `/noticias#${n.id}` : "/noticias", cat: "Noticia" }));
      if (Array.isArray(normativas)) normativas.forEach((n: { id?: string; code?: string; desc?: string }) => n?.code && items.push({ title: n.code, desc: n.desc || "", href: n.id ? `/recursos/normativas#${n.id}` : "/recursos/normativas", cat: "Normativa" }));
      if (Array.isArray(glosario)) glosario.forEach((t: { id?: string; term?: string; def?: string }) => t?.term && items.push({ title: t.term, desc: t.def || "", href: t.id ? `/recursos/glosario#${t.id}` : "/recursos/glosario", cat: "Glosario" }));
      if (Array.isArray(equipo)) equipo.forEach((m: { id?: string; name?: string; role?: string; area?: string }) => m?.name && items.push({ title: m.name, desc: `${m.role || ""} ${m.area || ""}`, href: m.id ? `/nosotros/equipo#${m.id}` : "/nosotros/equipo", cat: "Equipo" }));
      setDynamic(items);
    } catch {
      /* ignore */
    }
  }

  const results = useMemo(() => {
    const nq = norm(q).trim();
    if (!nq) return [];
    const words = nq.split(/\s+/);
    const all = [...STATIC_ITEMS, ...dynamic];
    return all
      .map((it) => {
        const hayTitle = norm(`${it.title} ${it.titleEn || ""}`);
        const hay = hayTitle + " " + norm(`${it.desc || ""} ${it.descEn || ""} ${it.keywords || ""} ${it.cat} ${it.catEn || ""}`);
        const matches = words.every((w) => hay.includes(w));
        if (!matches) return null;
        const score = words.every((w) => hayTitle.includes(w)) ? 0 : 1;
        return { it, score };
      })
      .filter(Boolean)
      .sort((a, b) => a!.score - b!.score)
      .slice(0, 8)
      .map((r) => r!.it);
  }, [q, dynamic]);

  function go(href: string) {
    setQ("");
    setFocused(false);
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length) go(results[0].href);
  }

  const showResults = focused && q.trim().length > 0;

  return (
    <div className="gc-search-wrap">
      <form className="gc-search" role="search" aria-label="Buscar en el sitio" onSubmit={onSubmit}>
        <span className="seg" aria-hidden="true">General</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { setFocused(true); loadIndex(); }}
          onBlur={() => setFocused(false)}
          placeholder="Buscar en el sitio…"
          aria-label="Términos de búsqueda"
        />
        <button type="submit" className="go-btn" title="Buscar" aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        </button>
      </form>

      {showResults && (
        <div className="search-results" role="listbox">
          {results.length > 0 ? (
            results.map((r, i) => (
              <a
                key={`${r.href}-${i}`}
                href={r.href}
                className="sr-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => { e.preventDefault(); go(r.href); }}
              >
                <span className="sr-cat">{dCat(r)}</span>
                <span className="sr-body">
                  <span className="sr-title">{dTitle(r)}</span>
                  {dDesc(r) && <span className="sr-snippet">{dDesc(r)}</span>}
                </span>
              </a>
            ))
          ) : (
            <div className="search-empty">No encontramos resultados para “{q}”.</div>
          )}
        </div>
      )}
    </div>
  );
}
