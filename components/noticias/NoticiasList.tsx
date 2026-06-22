"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import NewsEditor from "@/components/noticias/NewsEditor";
import type { News } from "@/lib/content";
import { DEFAULT_NOTICIAS } from "@/lib/content";
import { saveContent } from "@/lib/saveContent";

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);

export default function NoticiasList() {
  const { user, notify } = useAuth();
  const [cat, setCat] = useState("Todas");
  const [news, setNews] = useState<News[]>(DEFAULT_NOTICIAS);
  const [editing, setEditing] = useState<News | null>(null);
  const [creating, setCreating] = useState(false);

  // Carga las noticias guardadas (del servidor).
  useEffect(() => {
    let alive = true;
    fetch("/api/content/noticias")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d)) setNews(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function persist(next: News[]) {
    setNews(next);
    try {
      await saveContent("noticias", next);
      notify("Cambios guardados");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudieron guardar los cambios", "error");
    }
  }

  function handleSave(item: News) {
    const exists = news.some((n) => n.id === item.id);
    const next = exists ? news.map((n) => (n.id === item.id ? item : n)) : [item, ...news];
    persist(next);
    setEditing(null);
    setCreating(false);
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta noticia? Esta acción no se puede deshacer.")) return;
    persist(news.filter((n) => n.id !== id));
  }

  const chips = ["Todas", ...Array.from(new Set(news.map((n) => n.categoria).filter(Boolean)))];
  const filtered = cat === "Todas" ? news : news.filter((n) => n.categoria === cat);
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const isAdmin = !!user;

  return (
    <>
      <section className="news-header">
        <div className="news-header-inner">
          <span style={{ font: "700 0.75rem/1 var(--font-sans)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--tt-blue-700)" }}>
            Sala de prensa · Tuterritorio
          </span>
          <h1>Noticias</h1>
          <div className="news-ribbon" />
          <p className="news-sub">
            Sigue de cerca los avances de la <b>actualización catastral multipropósito</b> de Valledupar:
            operativos de campo, nuevos avalúos y los trámites que mantienen tu predio al día.
          </p>

          {isAdmin && (
            <div className="adm-bar" style={{ padding: "14px 0 0" }}>
              <span className="adm-flag">Modo administrador</span>
              <button className="adm-btn" onClick={() => setCreating(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Agregar noticia
              </button>
            </div>
          )}

          <div className="news-chips">
            {chips.map((label) => {
              const active = label === cat;
              return (
                <button
                  key={label}
                  className="news-chip"
                  onClick={() => setCat(label)}
                  aria-pressed={active}
                  style={{
                    background: active ? "var(--tt-navy-700)" : "#fff",
                    color: active ? "#fff" : "var(--tt-gray-700)",
                    border: `1px solid ${active ? "var(--tt-navy-700)" : "var(--border-subtle)"}`,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Noticia destacada */}
      {featured ? (
        <section className="news-feat-section">
          <a href="#" className="feat-card" onClick={(e) => isAdmin && e.preventDefault()}>
            {isAdmin && (
              <div className="adm-card-actions">
                <button className="adm-btn ghost sm" onClick={(e) => { e.preventDefault(); setEditing(featured); }}><PencilIcon /> Editar</button>
                <button className="adm-btn danger sm" onClick={(e) => { e.preventDefault(); handleDelete(featured.id); }}><TrashIcon /> Eliminar</button>
              </div>
            )}
            <div className="feat-imgwrap">
              <Image className="feat-img" src={featured.imagen} alt={featured.titulo} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
              <span className="news-badge" style={{ background: featured.badge }}>{featured.categoria}</span>
            </div>
            <div className="feat-body">
              <span className="news-date">{featured.fecha}</span>
              <h2>{featured.titulo}</h2>
              <p>{featured.extracto}</p>
              <span className="news-leer">Leer noticia completa <Arrow /></span>
            </div>
          </a>
        </section>
      ) : (
        <section className="news-feat-section">
          <div className="rec-empty" style={{ maxWidth: "var(--container-wide)", margin: "0 auto" }}>No hay noticias en esta categoría.</div>
        </section>
      )}

      {/* Más noticias */}
      {rest.length > 0 && (
        <section className="news-grid-section">
          <div className="news-grid-inner">
            <div className="news-grid-head">
              <h2>Más noticias</h2>
              <div className="rule" />
            </div>
            <div className="news-grid">
              {rest.map((n) => (
                <a href="#" className="news-card" key={n.id} onClick={(e) => isAdmin && e.preventDefault()}>
                  {isAdmin && (
                    <div className="adm-card-actions">
                      <button className="adm-btn ghost sm" onClick={(e) => { e.preventDefault(); setEditing(n); }}><PencilIcon /></button>
                      <button className="adm-btn danger sm" onClick={(e) => { e.preventDefault(); handleDelete(n.id); }}><TrashIcon /></button>
                    </div>
                  )}
                  <div className="news-card-imgwrap">
                    <Image className="news-card-img" src={n.imagen} alt={n.titulo} fill sizes="(max-width: 700px) 100vw, 380px" />
                    <span className="news-card-badge" style={{ background: n.badge }}>{n.categoria}</span>
                  </div>
                  <div className="news-card-body">
                    <span className="news-date">{n.fecha}</span>
                    <h3>{n.titulo}</h3>
                    <p>{n.extracto}</p>
                    <span className="news-leer" style={{ marginTop: 4 }}>Leer más <Arrow size={16} /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {(creating || editing) && (
        <NewsEditor
          initial={editing}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
