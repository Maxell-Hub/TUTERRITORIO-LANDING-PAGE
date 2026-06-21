"use client";

import { useEffect, useState } from "react";
import type { Norm } from "@/lib/content";
import { NORM_CATEGORIES } from "@/lib/content";

type Props = {
  initial: Norm | null; // null = nueva
  onCancel: () => void;
  onSave: (item: Norm) => void | Promise<void>;
};

function makeId(): string {
  return "norm-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

export default function NormEditor({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Norm>(
    initial ?? { id: makeId(), cat: NORM_CATEGORIES[0], code: "", desc: "", href: "" }
  );
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

  function set<K extends keyof Norm>(k: K, v: Norm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await onSave({ ...form, href: form.href.trim() || "#" });
    setBusy(false);
  }

  return (
    <div className="tt-modal-overlay" onClick={onCancel}>
      <form
        className="tt-modal adm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar normativa" : "Nueva normativa"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="login-head">
          <div>
            <h2>{initial ? "Editar normativa" : "Nueva normativa"}</h2>
            <p>Leyes, decretos, resoluciones y acuerdos</p>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="adm-modal-body">
          <label className="adm-fld">
            <span>Categoría</span>
            <select value={form.cat} onChange={(e) => set("cat", e.target.value)}>
              {NORM_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="adm-fld">
            <span>Nombre / código (ej: Ley 1955 de 2019)</span>
            <input value={form.code} onChange={(e) => set("code", e.target.value)} required />
          </label>
          <label className="adm-fld">
            <span>Descripción</span>
            <textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} required />
          </label>
          <label className="adm-fld">
            <span>Enlace al documento (URL)</span>
            <input value={form.href} onChange={(e) => set("href", e.target.value)} placeholder="https://…" />
          </label>
        </div>

        <div className="adm-modal-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy}>
            {busy ? "Guardando…" : "Guardar normativa"}
          </button>
        </div>
      </form>
    </div>
  );
}
