"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Item = { title: string; text: string; href: string; cat: string };

const norm = (s: string) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Páginas y secciones fijas del sitio. El campo `text` incluye palabras clave
 *  en español e inglés para que la búsqueda funcione también al cambiar de idioma. */
const STATIC_ITEMS: Item[] = [
  { title: "Inicio", text: "consulta tu predio catastro multipropósito valledupar avalúo impuesto predial linderos área · home consult your property cadastre cadastral appraisal property tax boundaries area", href: "/", cat: "Inicio" },
  { title: "Nosotros", text: "quiénes somos misión visión funciones objetivos proceso catastral gestor · about us who we are mission vision functions objectives cadastral manager", href: "/nosotros", cat: "Nosotros" },
  { title: "Nuestro equipo", text: "liderazgo equipo técnico topografía jurídica sistemas atención al ciudadano integrantes · our team staff leadership members technical legal", href: "/nosotros/equipo", cat: "Nosotros" },
  { title: "Trámites y servicios", text: "incorporación de área rectificación desenglobe englobe inscripción de predio avalúo catastral cambio de destino cambio de propietario certificado plano predial carta catastral ficha predial · procedures services formalities area rectification property registration appraisal change of owner cadastral certificate", href: "/servicios", cat: "Servicios" },
  { title: "Atención a la ciudadanía", text: "atención al ciudadano canales de atención servicios trámites pqrsd carta de trato digno preguntas frecuentes · citizen attention customer service channels procedures faq", href: "/atencion-ciudadania", cat: "Atención" },
  { title: "Transparencia", text: "transparencia y acceso a la información pública contratación planeación datos abiertos participa · transparency access to public information contracting planning open data participate accountability", href: "/transparencia", cat: "Transparencia" },
  { title: "Normativas", text: "leyes decretos resoluciones acuerdos marco legal catastro igac · regulations laws decrees resolutions legal framework", href: "/recursos/normativas", cat: "Recursos" },
  { title: "ABC Catastral", text: "glosario términos definiciones conceptos catastro abc · glossary terms definitions concepts cadastral", href: "/recursos/glosario", cat: "Recursos" },
  { title: "Noticias", text: "sala de prensa actualización catastral comunidad avalúos trámites · news press room updates community", href: "/noticias", cat: "Noticias" },
  { title: "Contactos", text: "dirección teléfono correo sede horario de atención mapa ubicación · contact address phone email office opening hours map location", href: "/contactos", cat: "Contactos" },
  { title: "PQRSD", text: "peticiones quejas reclamos sugerencias denuncias radicar solicitud · complaints claims requests petitions suggestions reports file a request", href: "/pqrsd", cat: "Contactos" },
];

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [dynamic, setDynamic] = useState<Item[]>([]);
  const loadedRef = useRef(false);

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
      if (Array.isArray(noticias)) noticias.forEach((n: { id?: string; titulo?: string; extracto?: string }) => n?.titulo && items.push({ title: n.titulo, text: n.extracto || "", href: n.id ? `/noticias#${n.id}` : "/noticias", cat: "Noticia" }));
      if (Array.isArray(normativas)) normativas.forEach((n: { id?: string; code?: string; desc?: string }) => n?.code && items.push({ title: n.code, text: n.desc || "", href: n.id ? `/recursos/normativas#${n.id}` : "/recursos/normativas", cat: "Normativa" }));
      if (Array.isArray(glosario)) glosario.forEach((t: { id?: string; term?: string; def?: string }) => t?.term && items.push({ title: t.term, text: t.def || "", href: t.id ? `/recursos/glosario#${t.id}` : "/recursos/glosario", cat: "Glosario" }));
      if (Array.isArray(equipo)) equipo.forEach((m: { id?: string; name?: string; role?: string; area?: string }) => m?.name && items.push({ title: m.name, text: `${m.role || ""} ${m.area || ""}`, href: m.id ? `/nosotros/equipo#${m.id}` : "/nosotros/equipo", cat: "Equipo" }));
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
        const hayTitle = norm(it.title);
        const hay = hayTitle + " " + norm(it.text) + " " + norm(it.cat);
        const matches = words.every((w) => hay.includes(w));
        if (!matches) return null;
        // Prioriza coincidencias en el título.
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
                <span className="sr-cat">{r.cat}</span>
                <span className="sr-body">
                  <span className="sr-title">{r.title}</span>
                  {r.text && <span className="sr-snippet">{r.text}</span>}
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
