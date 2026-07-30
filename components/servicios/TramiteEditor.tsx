"use client";

import { useEffect, useState } from "react";
import type { Tramite } from "@/lib/content";

type Props = {
  initial: Tramite | null; // null = nuevo trámite
  onCancel: () => void;
  onSave: (item: Tramite) => void | Promise<void>;
};

function makeId(): string {
  return "t-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

export default function TramiteEditor({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Tramite>(
    initial ?? { id: makeId(), title: "", desc: "", tiempo: "Hasta 15 días hábiles", costo: "Sin costo", reqs: [], en: "" }
  );
  // Requisitos como texto (uno por línea) para editar cómodo.
  const [reqsText, setReqsText] = useState((initial?.reqs ?? []).join("\n"));
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

  function set<K extends keyof Tramite>(k: K, v: Tramite[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const reqs = reqsText.split("\n").map((s) => s.trim()).filter(Boolean);
    await onSave({ ...form, title: form.title.trim(), desc: form.desc.trim(), tiempo: form.tiempo.trim(), costo: form.costo.trim(), reqs, en: (form.en ?? "").trim() });
    setBusy(false);
  }

  return (
    <div className="tt-modal-overlay" onClick={onCancel}>
      <form
        className="tt-modal news-editor"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar trámite" : "Nuevo trámite"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="ne-head">
          <div>
            <span className="ne-kicker">Trámites y servicios · Tuterritorio</span>
            <h2>{initial ? "Editar trámite" : "Nuevo trámite"}</h2>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="ne-body">
          <label className="ne-field">
            <span className="ne-label">Nombre del trámite</span>
            <input className="ne-input" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ej: Cambio de propietario" required />
          </label>

          <label className="ne-field">
            <span className="ne-label">Descripción</span>
            <textarea className="ne-input" rows={2} value={form.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Breve descripción del trámite" required />
          </label>

          <div className="ne-row">
            <label className="ne-field">
              <span className="ne-label">Tiempo de respuesta</span>
              <input className="ne-input" value={form.tiempo} onChange={(e) => set("tiempo", e.target.value)} placeholder="Ej: Hasta 15 días hábiles" required />
            </label>
            <label className="ne-field">
              <span className="ne-label">Costo</span>
              <input className="ne-input" value={form.costo} onChange={(e) => set("costo", e.target.value)} placeholder='"Sin costo" o un valor, p. ej. $52.500' required />
            </label>
          </div>

          <label className="ne-field">
            <span className="ne-label">Documentos requeridos (uno por línea)</span>
            <textarea className="ne-input" rows={6} value={reqsText} onChange={(e) => setReqsText(e.target.value)} placeholder={"Solicitud del trámite…\nFotocopia de la cédula…\nCopia de la escritura pública…"} required />
          </label>

          <label className="ne-field">
            <span className="ne-label">Palabras clave para la búsqueda (opcional, incluye términos en inglés)</span>
            <input className="ne-input" value={form.en ?? ""} onChange={(e) => set("en", e.target.value)} placeholder="Ej: change of owner ownership transfer" />
          </label>
        </div>

        <div className="ne-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy}>
            {busy ? "Guardando…" : initial ? "Guardar cambios" : "Agregar trámite"}
          </button>
        </div>
      </form>
    </div>
  );
}
