"use client";

import { useEffect, useState } from "react";
import type { News } from "@/lib/content";
import { NEWS_CATEGORIES, CATEGORY_BADGE } from "@/lib/content";

type Props = {
  initial: News | null; // null = nueva noticia
  onCancel: () => void;
  onSave: (item: News) => void | Promise<void>;
};

function makeId(): string {
  return "n-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

export default function NewsEditor({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<News>(
    initial ?? {
      id: makeId(),
      categoria: NEWS_CATEGORIES[0],
      badge: CATEGORY_BADGE[NEWS_CATEGORIES[0]],
      fecha: "",
      titulo: "",
      extracto: "",
      imagen: "/assets/valledupar-panorama.jpg",
    }
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

  function set<K extends keyof News>(k: K, v: News[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    // Sincroniza el color del badge con la categoría elegida.
    const item = { ...form, badge: CATEGORY_BADGE[form.categoria] || form.badge };
    await onSave(item);
    setBusy(false);
  }

  return (
    <div className="tt-modal-overlay" onClick={onCancel}>
      <form
        className="tt-modal adm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar noticia" : "Nueva noticia"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="login-head">
          <div>
            <h2>{initial ? "Editar noticia" : "Nueva noticia"}</h2>
            <p>Completa la información que verán los ciudadanos</p>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="adm-modal-body">
          <label className="adm-fld">
            <span>Título</span>
            <input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} required />
          </label>

          <label className="adm-fld">
            <span>Categoría</span>
            <select value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
              {NEWS_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="adm-fld">
            <span>Fecha (texto, ej: 12 de junio de 2026)</span>
            <input value={form.fecha} onChange={(e) => set("fecha", e.target.value)} placeholder="12 de junio de 2026" required />
          </label>

          <label className="adm-fld">
            <span>Extracto</span>
            <textarea value={form.extracto} onChange={(e) => set("extracto", e.target.value)} required />
          </label>

          <label className="adm-fld">
            <span>Imagen (ruta o URL)</span>
            <input value={form.imagen} onChange={(e) => set("imagen", e.target.value)} placeholder="/assets/valledupar-2.png" />
          </label>
        </div>

        <div className="adm-modal-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy}>
            {busy ? "Guardando…" : "Guardar noticia"}
          </button>
        </div>
      </form>
    </div>
  );
}
