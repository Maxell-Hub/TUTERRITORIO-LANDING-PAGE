"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchItems, type SearchItem } from "@/lib/searchIndex";

function readLang(): "es" | "en" {
  if (typeof document === "undefined") return "es";
  const m = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
  return m && m[1] === "en" ? "en" : "es";
}

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [dynamic, setDynamic] = useState<SearchItem[]>([]);
  const [lang, setLang] = useState<"es" | "en">("es");
  const loadedRef = useRef(false);

  useEffect(() => setLang(readLang()), []);

  // Muestra el campo correcto según el idioma activo.
  const dTitle = (it: SearchItem) => (lang === "en" && it.titleEn ? it.titleEn : it.title);
  const dDesc = (it: SearchItem) => (lang === "en" && it.descEn ? it.descEn : it.desc || "");
  const dCat = (it: SearchItem) => (lang === "en" && it.catEn ? it.catEn : it.cat);

  // Textos de la interfaz del buscador según el idioma (los atributos como
  // placeholder y aria-label NO los traduce Google Translate).
  const T = lang === "en"
    ? { placeholder: "Search the site…", formLabel: "Search the site", inputLabel: "Search terms", button: "Search", empty: (query: string) => `No results found for “${query}”.` }
    : { placeholder: "Buscar en el sitio…", formLabel: "Buscar en el sitio", inputLabel: "Términos de búsqueda", button: "Buscar", empty: (query: string) => `No encontramos resultados para “${query}”.` };

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
      const items: SearchItem[] = [];
      if (Array.isArray(noticias)) noticias.forEach((n: { id?: string; titulo?: string; extracto?: string }) => n?.titulo && items.push({ title: n.titulo, desc: n.extracto || "", href: n.id ? `/noticias/${n.id}` : "/noticias", cat: "Noticia", catEn: "News" }));
      if (Array.isArray(normativas)) normativas.forEach((n: { id?: string; code?: string; desc?: string }) => n?.code && items.push({ title: n.code, desc: n.desc || "", href: n.id ? `/recursos/normativas#${n.id}` : "/recursos/normativas", cat: "Normativa", catEn: "Regulation" }));
      if (Array.isArray(glosario)) glosario.forEach((t: { id?: string; term?: string; def?: string }) => t?.term && items.push({ title: t.term, desc: t.def || "", href: t.id ? `/recursos/glosario#${t.id}` : "/recursos/glosario", cat: "Glosario", catEn: "Glossary" }));
      if (Array.isArray(equipo)) equipo.forEach((m: { id?: string; name?: string; role?: string; area?: string }) => m?.name && items.push({ title: m.name, desc: `${m.role || ""} ${m.area || ""}`, href: m.id ? `/nosotros/equipo#${m.id}` : "/nosotros/equipo", cat: "Equipo", catEn: "Team" }));
      setDynamic(items);
    } catch {
      /* ignore */
    }
  }

  const results = useMemo(() => searchItems(q, dynamic, 8), [q, dynamic]);

  function go(href: string) {
    setQ("");
    setFocused(false);
    router.push(href);
  }

  // Enter (o el botón) lleva a la página de resultados completa /buscar.
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    go(`/buscar?q=${encodeURIComponent(term)}`);
  }

  const showResults = focused && q.trim().length > 0;

  return (
    <div className="gc-search-wrap">
      <form className="gc-search" role="search" aria-label={T.formLabel} onSubmit={onSubmit}>
        <span className="seg" aria-hidden="true">General</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { setFocused(true); loadIndex(); }}
          onBlur={() => setFocused(false)}
          placeholder={T.placeholder}
          aria-label={T.inputLabel}
        />
        <button type="submit" className="go-btn" title={T.button} aria-label={T.button}>
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
            <div className="search-empty">{T.empty(q)}</div>
          )}
        </div>
      )}
    </div>
  );
}
