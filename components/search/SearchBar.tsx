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

/** Páginas y secciones fijas del sitio, con texto en español e inglés. */
const STATIC_ITEMS: Item[] = [
  { title: "Inicio", titleEn: "Home", desc: "Consulta tu predio: linderos, área y avalúo.", descEn: "Check your property: boundaries, area and appraisal.", keywords: "catastro multipropósito impuesto predial · cadastre property tax", href: "/", cat: "Inicio", catEn: "Home" },
  { title: "Nosotros", titleEn: "About us", desc: "Quiénes somos, misión y funciones.", descEn: "Who we are, mission and functions.", keywords: "gestor catastral objetivos · cadastral manager mission vision", href: "/nosotros", cat: "Nosotros", catEn: "About" },
  { title: "Nuestro equipo", titleEn: "Our team", desc: "El equipo de Tuterritorio.", descEn: "The Tuterritorio team.", keywords: "liderazgo integrantes técnico jurídico · staff leadership members", href: "/nosotros/equipo", cat: "Nosotros", catEn: "About" },
  { title: "Trámites y servicios", titleEn: "Procedures and services", desc: "Trámites y productos catastrales.", descEn: "Cadastral procedures and products.", keywords: "incorporación rectificación desenglobe englobe inscripción avalúo cambio de propietario certificado · area registration change of owner certificate", href: "/servicios", cat: "Servicios", catEn: "Services" },
  { title: "Atención a la ciudadanía", titleEn: "Citizen services", desc: "Canales de atención, trámites y PQRSD.", descEn: "Service channels, procedures and complaints.", keywords: "carta de trato digno preguntas frecuentes · customer service channels faq", href: "/atencion-ciudadania", cat: "Atención", catEn: "Attention" },
  { title: "Transparencia", titleEn: "Transparency", desc: "Transparencia y acceso a la información pública.", descEn: "Transparency and access to public information.", keywords: "contratación planeación datos abiertos participa · contracting planning open data participate", href: "/transparencia", cat: "Transparencia", catEn: "Transparency" },
  { title: "Normativas", titleEn: "Regulations", desc: "Leyes, decretos y resoluciones.", descEn: "Laws, decrees and resolutions.", keywords: "acuerdos marco legal igac · legal framework", href: "/recursos/normativas", cat: "Recursos", catEn: "Resources" },
  { title: "ABC Catastral", titleEn: "Cadastral glossary", desc: "Glosario de términos catastrales.", descEn: "Glossary of cadastral terms.", keywords: "definiciones conceptos abc · definitions concepts", href: "/recursos/glosario", cat: "Recursos", catEn: "Resources" },
  { title: "Noticias", titleEn: "News", desc: "Sala de prensa y novedades.", descEn: "Press room and updates.", keywords: "actualización catastral comunidad · press updates community", href: "/noticias", cat: "Noticias", catEn: "News" },
  { title: "Contactos", titleEn: "Contact", desc: "Dirección, teléfono, correo y horario.", descEn: "Address, phone, email and opening hours.", keywords: "sede mapa ubicación atención · office hours map location", href: "/contactos", cat: "Contactos", catEn: "Contact" },
  { title: "PQRSD", titleEn: "Complaints (PQRSD)", desc: "Radica peticiones, quejas y reclamos.", descEn: "File petitions, complaints and claims.", keywords: "sugerencias denuncias solicitud · requests suggestions reports", href: "/pqrsd", cat: "Contactos", catEn: "Contact" },
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
