"use client";

import { useEffect, useState } from "react";
import type { Term, GlossMore } from "@/lib/content";

type Props = {
  initial: Term | null; // null = nuevo
  onCancel: () => void;
  onSave: (item: Term) => void | Promise<void>;
};

function makeId(): string {
  return "g-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

export default function GlosarioEditor({ initial, onCancel, onSave }: Props) {
  const [term, setTerm] = useState(initial?.term ?? "");
  const [def, setDef] = useState(initial?.def ?? "");
  const [more, setMore] = useState<GlossMore[]>(initial?.more ?? []);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  function setMoreField(i: number, k: keyof GlossMore, v: string) {
    setMore((arr) => arr.map((m, j) => (j === i ? { ...m, [k]: v } : m)));
  }
  function addMore() {
    setMore((arr) => [...arr, { label: "", text: "" }]);
  }
  function removeMore(i: number) {
    setMore((arr) => arr.filter((_, j) => j !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const cleanedMore = more
      .map((m) => ({ label: m.label.trim(), text: m.text.trim() }))
      .filter((m) => m.label || m.text);
    const item: Term = {
      id: initial?.id ?? makeId(),
      term: term.trim(),
      def: def.trim(),
      ...(cleanedMore.length ? { more: cleanedMore } : {}),
    };
    await onSave(item);
    setBusy(false);
  }

  return (
    <div className="tt-modal-overlay" onClick={onCancel}>
      <form
        className="tt-modal news-editor"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar término" : "Nuevo término"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="ne-head">
          <div>
            <span className="ne-kicker">Recursos · ABC Catastral</span>
            <h2>{initial ? "Editar término" : "Nuevo término"}</h2>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="ne-body">
          <label className="ne-field">
            <span className="ne-label">Término</span>
            <input className="ne-input" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Ej: Avalúo catastral" required />
          </label>

          <label className="ne-field">
            <span className="ne-label">Definición</span>
            <textarea className="ne-input" rows={3} value={def} onChange={(e) => setDef(e.target.value)} placeholder="Explicación en lenguaje claro" required />
          </label>

          <div className="ne-field">
            <span className="ne-label">Detalles adicionales (opcional — aparecen en “Ver más”)</span>
            {more.map((m, i) => (
              <div key={i} className="gl-more-row">
                <input
                  className="ne-input"
                  value={m.label}
                  onChange={(e) => setMoreField(i, "label", e.target.value)}
                  placeholder="Título (ej: Función)"
                />
                <textarea
                  className="ne-input"
                  rows={2}
                  value={m.text}
                  onChange={(e) => setMoreField(i, "text", e.target.value)}
                  placeholder="Texto del detalle"
                />
                <button type="button" className="adm-btn danger sm" onClick={() => removeMore(i)} aria-label="Quitar detalle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            <button type="button" className="adm-btn ghost sm" onClick={addMore} style={{ alignSelf: "flex-start" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              Agregar detalle
            </button>
          </div>
        </div>

        <div className="ne-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy}>
            {busy ? "Guardando…" : initial ? "Guardar cambios" : "Agregar término"}
          </button>
        </div>
      </form>
    </div>
  );
}
