"use client";

import { useEffect, useState } from "react";
import type { Faq } from "@/lib/content";
import { FAQ_CATEGORIES } from "@/lib/content";

type Props = {
  initial: Faq | null; // null = nueva pregunta
  onCancel: () => void;
  onSave: (item: Faq) => void | Promise<void>;
};

function makeId(): string {
  return "faq-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

export default function FaqEditor({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Faq>(
    initial ?? { id: makeId(), cat: FAQ_CATEGORIES[0], q: "", a: "" }
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  function set<K extends keyof Faq>(k: K, v: Faq[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await onSave({ ...form, cat: form.cat.trim(), q: form.q.trim(), a: form.a.trim() });
    setBusy(false);
  }

  return (
    <div className="tt-modal-overlay" onClick={onCancel}>
      <form
        className="tt-modal news-editor"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar pregunta" : "Nueva pregunta"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="ne-head">
          <div>
            <span className="ne-kicker">Preguntas frecuentes · Tuterritorio</span>
            <h2>{initial ? "Editar pregunta" : "Nueva pregunta"}</h2>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="ne-body">
          <label className="ne-field">
            <span className="ne-label">Categoría</span>
            <input
              className="ne-input"
              value={form.cat}
              onChange={(e) => set("cat", e.target.value)}
              placeholder="Ej: Trámites catastrales"
              list="faq-cats"
              required
            />
            <datalist id="faq-cats">
              {FAQ_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <label className="ne-field">
            <span className="ne-label">Pregunta</span>
            <input className="ne-input" value={form.q} onChange={(e) => set("q", e.target.value)} placeholder="Escribe la pregunta" required />
          </label>

          <label className="ne-field">
            <span className="ne-label">Respuesta</span>
            <textarea className="ne-input" rows={7} value={form.a} onChange={(e) => set("a", e.target.value)} placeholder="Escribe la respuesta. Puedes separar párrafos con una línea en blanco." required />
          </label>
        </div>

        <div className="ne-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy}>
            {busy ? "Guardando…" : initial ? "Guardar cambios" : "Agregar pregunta"}
          </button>
        </div>
      </form>
    </div>
  );
}
