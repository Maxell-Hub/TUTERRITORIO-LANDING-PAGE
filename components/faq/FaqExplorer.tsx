"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Faq } from "@/lib/content";
import { DEFAULT_FAQ, FAQ_CATS } from "@/lib/content";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveContent } from "@/lib/saveContent";
import FaqEditor from "@/components/faq/FaqEditor";

/** Búsqueda tolerante: minúsculas y sin acentos (como el buscador del glosario). */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const accentFor = (cat: string) => FAQ_CATS.find((c) => c.titulo === cat)?.accent ?? "#3B85A5";
const cortoFor = (cat: string) => FAQ_CATS.find((c) => c.titulo === cat)?.corto ?? cat;

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);

export default function FaqExplorer() {
  const { user, notify } = useAuth();
  const [faqs, setFaqs] = useState<Faq[]>(DEFAULT_FAQ);
  const [tab, setTab] = useState("Todas");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string[]>([]);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/content/faq")
      .then((r) => r.json())
      .then((d) => { if (alive && Array.isArray(d)) setFaqs(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const isAdmin = !!user;

  async function persist(next: Faq[]) {
    setFaqs(next);
    try {
      await saveContent("faq", next);
      notify("Cambios guardados");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudieron guardar los cambios", "error");
    }
  }

  function handleSave(item: Faq) {
    const exists = faqs.some((f) => f.id === item.id);
    const next = exists ? faqs.map((f) => (f.id === item.id ? item : f)) : [...faqs, item];
    persist(next);
    setEditing(null);
    setCreating(false);
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta pregunta? Esta acción no se puede deshacer.")) return;
    persist(faqs.filter((f) => f.id !== id));
  }

  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  const q = norm(query.trim());

  const results = useMemo(
    () =>
      faqs.filter(
        (f) =>
          (tab === "Todas" || f.cat === tab) &&
          (!q || norm(`${f.q} ${f.a}`).includes(q))
      ),
    [faqs, tab, q]
  );

  const total = faqs.length;

  return (
    <div className="fq-body">
      {isAdmin && (
        <div className="adm-bar" style={{ justifyContent: "center", marginBottom: 18 }}>
          <span className="adm-flag">Modo administrador</span>
          <button className="adm-btn" onClick={() => setCreating(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Agregar pregunta
          </button>
        </div>
      )}

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
        {FAQ_CATS.map((g) => {
          const count = faqs.filter((f) => f.cat === g.titulo).length;
          return (
            <button
              key={g.titulo}
              type="button"
              className={`fq-tab${tab === g.titulo ? " on" : ""}`}
              onClick={() => setTab(g.titulo)}
              aria-pressed={tab === g.titulo}
              style={{ ["--accent" as string]: g.accent }}
            >
              {g.corto}
              <span className="fq-tab-count">{count}</span>
            </button>
          );
        })}
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
                style={{ ["--accent" as string]: accentFor(f.cat) }}
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
                    <span className="fq-cat">{cortoFor(f.cat)}</span>
                  </span>
                  <span className="fq-plus" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                <div id={`fq-a-${f.id}`} className="fq-answer" role="region" aria-label={f.q}>
                  <div className="fq-answer-inner">
                    <p style={{ whiteSpace: "pre-line" }}>{f.a}</p>
                    {isAdmin && (
                      <div className="adm-actions" style={{ marginTop: 14 }}>
                        <button className="adm-btn ghost sm" onClick={() => setEditing(f)}><PencilIcon /> Editar</button>
                        <button className="adm-btn danger sm" onClick={() => handleDelete(f.id)}><TrashIcon /></button>
                      </div>
                    )}
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
          <Link href="/pqrsd" className="atg-pill">Radica tu PQRSD</Link>
          <Link href="/contactos" className="atg-pill ghost">Canales de atención</Link>
        </div>
      </div>

      {(creating || editing) && (
        <FaqEditor
          initial={editing}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
