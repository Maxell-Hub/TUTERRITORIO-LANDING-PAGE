"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FAQ_GRUPOS } from "@/components/faq/faq-data";

/** Búsqueda tolerante: minúsculas y sin acentos (como el buscador del glosario). */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export default function FaqExplorer() {
  const [tab, setTab] = useState("Todas");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  const q = norm(query.trim());

  // Lista plana con su grupo, filtrada por pestaña y por búsqueda.
  const results = useMemo(() => {
    const all = FAQ_GRUPOS.flatMap((g) => g.faqs.map((f) => ({ ...f, grupo: g })));
    return all.filter(
      (f) =>
        (tab === "Todas" || f.grupo.titulo === tab) &&
        (!q || norm(`${f.q} ${f.aText}`).includes(q))
    );
  }, [tab, q]);

  const total = FAQ_GRUPOS.reduce((s, g) => s + g.faqs.length, 0);

  return (
    <div className="fq-body">
      {/* Buscador flotante sobre el hero */}
      <div className="fq-search-card">
        <div className="fq-search">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe tu duda: avalúo, cédula, tiempos, PQRSD…"
            aria-label="Buscar en las preguntas frecuentes"
          />
          {query && (
            <button type="button" className="fq-clear" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <span className="fq-search-meta" role="status">
          {q ? `${results.length} de ${total} preguntas coinciden` : `${total} preguntas frecuentes`}
        </span>
      </div>

      {/* Pestañas por categoría */}
      <div className="fq-tabs" role="tablist" aria-label="Categorías de preguntas">
        <button
          type="button"
          className={`fq-tab${tab === "Todas" ? " on" : ""}`}
          onClick={() => setTab("Todas")}
          aria-pressed={tab === "Todas"}
          style={{ ["--accent" as string]: "#163A4C" }}
        >
          Todas
          <span className="fq-tab-count">{total}</span>
        </button>
        {FAQ_GRUPOS.map((g) => (
          <button
            key={g.titulo}
            type="button"
            className={`fq-tab${tab === g.titulo ? " on" : ""}`}
            onClick={() => setTab(g.titulo)}
            aria-pressed={tab === g.titulo}
            style={{ ["--accent" as string]: g.accent }}
          >
            {g.corto}
            <span className="fq-tab-count">{g.faqs.length}</span>
          </button>
        ))}
      </div>

      {/* Preguntas */}
      {results.length > 0 ? (
        <div className="fq-list">
          {results.map((f, i) => {
            const isOpen = open.includes(f.id);
            return (
              <article
                key={f.id}
                className={`fq-card${isOpen ? " open" : ""}`}
                style={{ ["--accent" as string]: f.grupo.accent }}
              >
                <button
                  type="button"
                  className="fq-qbtn"
                  aria-expanded={isOpen}
                  aria-controls={`fq-a-${f.id}`}
                  onClick={() => toggle(f.id)}
                >
                  <span className="fq-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="fq-qtext">
                    {f.q}
                    <span className="fq-cat">{f.grupo.corto}</span>
                  </span>
                  <span className="fq-plus" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                <div id={`fq-a-${f.id}`} className="fq-answer" role="region" aria-label={f.q}>
                  <div className="fq-answer-inner">
                    <p>{f.a}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="fq-none">
          <p>No encontramos preguntas que coincidan con <b>«{query}»</b>{tab !== "Todas" ? " en esta categoría" : ""}.</p>
          <button type="button" onClick={() => { setQuery(""); setTab("Todas"); }}>Ver todas las preguntas</button>
        </div>
      )}

      {/* CTA final */}
      <div className="fq-cta">
        <div>
          <h2>¿No encontraste tu respuesta?</h2>
          <p>Escríbenos y te responderemos dentro de los términos de ley.</p>
        </div>
        <div className="fq-cta-actions">
          <Link href="/pqrsd" className="fq-cta-btn solid">Radica tu PQRSD</Link>
          <Link href="/contactos" className="fq-cta-btn ghost">Canales de atención</Link>
        </div>
      </div>
    </div>
  );
}
