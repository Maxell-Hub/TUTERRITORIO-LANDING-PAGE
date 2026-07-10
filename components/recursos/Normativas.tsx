"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import NormEditor from "@/components/recursos/NormEditor";
import type { Norm } from "@/lib/content";
import { DEFAULT_NORMATIVAS, NORM_CATEGORIES } from "@/lib/content";
import { saveContent } from "@/lib/saveContent";
import { useScrollToHash } from "@/lib/useScrollToHash";

const TONE: Record<string, { accent: string; soft: string }> = {
  Ley: { accent: "var(--tt-blue-700)", soft: "color-mix(in srgb, var(--tt-blue-700) 12%, #fff)" },
  Decreto: { accent: "var(--tt-green-600)", soft: "color-mix(in srgb, var(--tt-green-600) 13%, #fff)" },
  Resolución: { accent: "var(--tt-amber-600)", soft: "color-mix(in srgb, var(--tt-amber-500) 18%, #fff)" },
  Acuerdo: { accent: "var(--tt-teal-600)", soft: "color-mix(in srgb, var(--tt-teal-600) 13%, #fff)" },
};
const fallbackTone = { accent: "var(--tt-gray-500)", soft: "var(--tt-gray-100)" };

/** Tipo de norma (etiqueta de la fila), deducido del nombre/código. */
function typeOf(code: string): string {
  const c = code.trim().toLowerCase();
  if (c.startsWith("ley")) return "Ley";
  if (c.startsWith("decreto")) return "Decreto";
  if (c.startsWith("resoluci")) return "Resolución";
  if (c.includes("acuerdo") || c.includes("estatuto")) return "Acuerdo";
  return "Norma";
}

/** Año de expedición (para ordenar de más reciente a más antigua). */
function yearOf(code: string): number {
  const m = code.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : 0;
}

/** Categoría temática de la norma. Si viene con la categorización anterior
 *  (por tipo: Leyes/Decretos/…) — p. ej. datos ya guardados desde el panel —
 *  se deduce el tema a partir de su nombre y descripción. */
function catOf(n: Norm): string {
  if (NORM_CATEGORIES.includes(n.cat)) return n.cat;
  const t = `${n.code} ${n.desc}`.toLowerCase();
  if (/datos personales/.test(t)) return "Protección de datos";
  if (/predial|tributari|fiscos/.test(t)) return "Impuesto predial";
  if (/municipal|acuerdo/.test(t)) return "Normativa municipal";
  return "Gestión catastral";
}

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);

const CATS = ["Todas", ...NORM_CATEGORIES];

export default function Normativas() {
  const { user, notify } = useAuth();
  const [cat, setCat] = useState("Todas");
  const [norms, setNorms] = useState<Norm[]>(DEFAULT_NORMATIVAS);
  const [editing, setEditing] = useState<Norm | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/content/normativas")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d)) setNorms(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function persist(next: Norm[]) {
    setNorms(next);
    try {
      await saveContent("normativas", next);
      notify("Cambios guardados");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudieron guardar los cambios", "error");
    }
  }

  function handleSave(item: Norm) {
    const exists = norms.some((n) => n.id === item.id);
    const next = exists ? norms.map((n) => (n.id === item.id ? item : n)) : [...norms, item];
    persist(next);
    setEditing(null);
    setCreating(false);
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta normativa? Esta acción no se puede deshacer.")) return;
    persist(norms.filter((n) => n.id !== id));
  }

  useScrollToHash(norms);

  // De más reciente a más antigua (las normas sin año quedan al final).
  const ordered = [...norms].sort((a, b) => yearOf(b.code) - yearOf(a.code));
  const list = cat === "Todas" ? ordered : ordered.filter((n) => catOf(n) === cat);
  const isAdmin = !!user;

  return (
    <>
      {isAdmin && (
        <div className="adm-bar" style={{ padding: "0 0 16px" }}>
          <span className="adm-flag">Modo administrador</span>
          <button className="adm-btn" onClick={() => setCreating(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Agregar normativa
          </button>
        </div>
      )}

      <div className="flt-row">
        {CATS.map((label) => {
          const count = label === "Todas" ? norms.length : norms.filter((n) => catOf(n) === label).length;
          const active = label === cat;
          return (
            <button
              key={label}
              className="flt-chip"
              onClick={() => setCat(label)}
              aria-pressed={active}
              style={{
                background: active ? "#163A4C" : "#fff",
                color: active ? "#fff" : "var(--tt-gray-700)",
                border: `1px solid ${active ? "#163A4C" : "var(--border-subtle)"}`,
              }}
            >
              {label}
              <span className="flt-count" style={{ background: active ? "rgba(255,255,255,.22)" : "#F2F2F2", color: active ? "#fff" : "var(--tt-gray-500)" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {list.length > 0 ? (
        <div className="norm-list">
          {list.map((n) => {
            const tag = typeOf(n.code);
            const tone = TONE[tag] ?? fallbackTone;
            return (
              <div id={n.id} className="norm-row" key={n.id} style={{ borderLeft: `5px solid ${tone.accent}` }}>
                <span className="norm-tag" style={{ background: tone.soft, color: tone.accent }}>{tag}</span>
                <div>
                  <div className="norm-code">{n.code}</div>
                  <p className="norm-desc">{n.desc}</p>
                </div>
                {isAdmin ? (
                  <div className="adm-actions">
                    <button className="adm-btn ghost sm" onClick={() => setEditing(n)}><PencilIcon /> Editar</button>
                    <button className="adm-btn danger sm" onClick={() => handleDelete(n.id)}><TrashIcon /></button>
                  </div>
                ) : (
                  <a className="norm-link" href={n.href} target="_blank" rel="noopener noreferrer">
                    Ver documento
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rec-empty">No hay normativas en esta categoría.</div>
      )}

      {(creating || editing) && (
        <NormEditor
          initial={editing}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
