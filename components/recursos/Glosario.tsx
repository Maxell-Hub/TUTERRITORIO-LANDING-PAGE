"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import GlosarioEditor from "@/components/recursos/GlosarioEditor";
import type { Term } from "@/lib/content";
import { DEFAULT_GLOSARIO } from "@/lib/content";
import { saveContent } from "@/lib/saveContent";

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

const BADGES = ["var(--tt-blue-700)", "var(--tt-green-600)", "var(--tt-teal-600)", "var(--tt-navy-700)", "var(--tt-amber-600)", "var(--tt-red-500)"];

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);

export default function Glosario() {
  const { user, notify } = useAuth();
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState("Todas");
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const [glossary, setGlossary] = useState<Term[]>(DEFAULT_GLOSARIO);
  const [editing, setEditing] = useState<Term | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/content/glosario")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d)) setGlossary(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function persist(next: Term[]) {
    setGlossary(next);
    try {
      await saveContent("glosario", next);
      notify("Cambios guardados");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudieron guardar los cambios", "error");
    }
  }

  function handleSave(item: Term) {
    const exists = glossary.some((t) => t.id === item.id);
    const next = exists ? glossary.map((t) => (t.id === item.id ? item : t)) : [...glossary, item];
    // Mantiene el glosario ordenado alfabéticamente.
    next.sort((a, b) => norm(a.term).localeCompare(norm(b.term)));
    persist(next);
    setEditing(null);
    setCreating(false);
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este término? Esta acción no se puede deshacer.")) return;
    persist(glossary.filter((t) => t.id !== id));
  }

  const withInitial = glossary.map((t) => ({ ...t, initial: norm(t.term).charAt(0).toUpperCase() }));
  const nq = norm(q);
  const initials = ["Todas", ...Array.from(new Set(withInitial.map((t) => t.initial))).sort()];

  let terms = withInitial;
  if (letter !== "Todas") terms = terms.filter((t) => t.initial === letter);
  if (nq) terms = terms.filter((t) => norm(t.term).includes(nq) || norm(t.def).includes(nq) || (t.more || []).some((f) => norm(f.text).includes(nq)));

  const isAdmin = !!user;

  return (
    <>
      {isAdmin && (
        <div className="adm-bar" style={{ padding: "0 0 16px" }}>
          <span className="adm-flag">Modo administrador</span>
          <button className="adm-btn" onClick={() => setCreating(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Agregar término
          </button>
        </div>
      )}

      <div className="gl-toolbar">
        <div className="gl-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tt-gray-500)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca un término…"
            aria-label="Buscar en el glosario"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Limpiar búsqueda">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <span className="gl-count">{terms.length} {terms.length === 1 ? "término" : "términos"}</span>
      </div>

      <div className="az-row">
        {initials.map((label) => {
          const active = label === letter;
          return (
            <button
              key={label}
              className="az-btn"
              onClick={() => setLetter(label)}
              aria-pressed={active}
              style={{
                background: active ? "#4E8654" : "#fff",
                color: active ? "#fff" : "var(--tt-gray-700)",
                border: `1px solid ${active ? "#4E8654" : "var(--border-subtle)"}`,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {terms.length > 0 ? (
        <div className="gl-grid">
          {terms.map((t, i) => {
            const more = t.more || [];
            const expandable = more.length > 0 || t.def.length > 130;
            const open = openTerm === t.term;
            return (
              <div className="term-card" key={t.id}>
                <span className="term-badge" style={{ background: BADGES[i % BADGES.length] }}>{t.initial}</span>
                <h3 className="term-name">{t.term}</h3>
                <p className={`term-def${expandable && !open ? " term-clamp" : ""}`}>{t.def}</p>
                {open && more.length > 0 && (
                  <div className="term-more">
                    {more.map((f, j) => (
                      <div key={j}>
                        <div className="mf-label">{f.label}</div>
                        <div className="mf-text">{f.text}</div>
                      </div>
                    ))}
                  </div>
                )}
                {expandable && (
                  <button className="term-toggle" onClick={() => setOpenTerm(open ? null : t.term)} aria-expanded={open}>
                    {open ? "Ver menos" : "Ver más"}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none" }}><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                )}
                {isAdmin && (
                  <div className="adm-actions" style={{ marginTop: 12 }}>
                    <button className="adm-btn ghost sm" onClick={() => setEditing(t)}><PencilIcon /> Editar</button>
                    <button className="adm-btn danger sm" onClick={() => handleDelete(t.id)}><TrashIcon /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rec-empty">No encontramos términos para tu búsqueda.</div>
      )}

      {(creating || editing) && (
        <GlosarioEditor
          initial={editing}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
