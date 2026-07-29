"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchItems, type SearchItem } from "@/lib/searchIndex";

export default function BuscarResults() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [dynamic, setDynamic] = useState<SearchItem[]>([]);
  const loadedRef = useRef(false);

  // Mantiene el campo sincronizado con la URL (por si se comparte el enlace).
  useEffect(() => { setQ(params.get("q") || ""); }, [params]);

  // Carga el contenido editable (noticias, normativas, glosario, equipo) una vez.
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    (async () => {
      try {
        const [noticias, normativas, glosario, equipo] = await Promise.all([
          fetch("/api/content/noticias").then((r) => r.json()).catch(() => []),
          fetch("/api/content/normativas").then((r) => r.json()).catch(() => []),
          fetch("/api/content/glosario").then((r) => r.json()).catch(() => []),
          fetch("/api/content/equipo").then((r) => r.json()).catch(() => []),
        ]);
        const items: SearchItem[] = [];
        if (Array.isArray(noticias)) noticias.forEach((n: { id?: string; titulo?: string; extracto?: string }) => n?.titulo && items.push({ title: n.titulo, desc: n.extracto || "", href: n.id ? `/noticias/${n.id}` : "/noticias", cat: "Noticia" }));
        if (Array.isArray(normativas)) normativas.forEach((n: { id?: string; code?: string; desc?: string }) => n?.code && items.push({ title: n.code, desc: n.desc || "", href: n.id ? `/recursos/normativas#${n.id}` : "/recursos/normativas", cat: "Normativa" }));
        if (Array.isArray(glosario)) glosario.forEach((t: { id?: string; term?: string; def?: string }) => t?.term && items.push({ title: t.term, desc: t.def || "", href: t.id ? `/recursos/glosario#${t.id}` : "/recursos/glosario", cat: "Glosario" }));
        if (Array.isArray(equipo)) equipo.forEach((m: { id?: string; name?: string; role?: string; area?: string }) => m?.name && items.push({ title: m.name, desc: `${m.role || ""} ${m.area || ""}`.trim(), href: m.id ? `/nosotros/equipo#${m.id}` : "/nosotros/equipo", cat: "Equipo" }));
        setDynamic(items);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const term = q.trim();
  const results = useMemo(() => searchItems(q, dynamic, 60), [q, dynamic]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(term ? `/buscar?q=${encodeURIComponent(term)}` : "/buscar");
  }

  return (
    <>
      <form className="buscar-form" role="search" aria-label="Buscar en el sitio" onSubmit={onSubmit}>
        <svg className="buscar-form-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar en el sitio…"
          aria-label="Términos de búsqueda"
          autoFocus
        />
        <button type="submit">Buscar</button>
      </form>

      {term ? (
        results.length > 0 ? (
          <>
            <p className="buscar-count">{results.length} {results.length === 1 ? "resultado" : "resultados"} para «{term}»</p>
            <ul className="buscar-list">
              {results.map((r, i) => (
                <li key={`${r.href}-${i}`}>
                  <a className="buscar-item" href={r.href}>
                    <span className="buscar-cat">{r.cat}</span>
                    <span className="buscar-title">{r.title}</span>
                    {r.desc && <span className="buscar-desc">{r.desc}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="buscar-empty">No encontramos resultados para «{term}». Intenta con otras palabras.</p>
        )
      ) : (
        <p className="buscar-empty">Escribe un término para buscar páginas, trámites, normativas, noticias y más.</p>
      )}
    </>
  );
}
