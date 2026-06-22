"use client";

import { useEffect, useRef, useState } from "react";
import type { Norm } from "@/lib/content";
import { NORM_CATEGORIES } from "@/lib/content";
import { useAuth } from "@/components/auth/AuthProvider";
import { uploadFile } from "@/lib/uploadClient";

type Props = {
  initial: Norm | null; // null = nueva
  onCancel: () => void;
  onSave: (item: Norm) => void | Promise<void>;
};

function makeId(): string {
  return "norm-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

const hasDoc = (href: string) => !!href && href !== "#";

export default function NormEditor({ initial, onCancel, onSave }: Props) {
  const { notify } = useAuth();
  const [form, setForm] = useState<Norm>(
    initial ?? { id: makeId(), cat: NORM_CATEGORIES[0], code: "", desc: "", href: "" }
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      set("href", url);
      notify("Documento cargado");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudo subir el documento", "error");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
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
        className="tt-modal news-editor"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar normativa" : "Nueva normativa"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="ne-head">
          <div>
            <span className="ne-kicker">Recursos · Marco legal</span>
            <h2>{initial ? "Editar normativa" : "Nueva normativa"}</h2>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="ne-body">
          <label className="ne-field">
            <span className="ne-label">Categoría</span>
            <select className="ne-input" value={form.cat} onChange={(e) => set("cat", e.target.value)}>
              {NORM_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="ne-field">
            <span className="ne-label">Nombre / código</span>
            <input className="ne-input" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="Ej: Ley 1955 de 2019" required />
          </label>

          <label className="ne-field">
            <span className="ne-label">Descripción</span>
            <textarea className="ne-input" rows={3} value={form.desc} onChange={(e) => set("desc", e.target.value)} placeholder="¿De qué trata la norma?" required />
          </label>

          {/* Documento: enlace o archivo */}
          <div className="ne-field">
            <span className="ne-label">Documento de la norma</span>

            <div className="ne-doc">
              <div className="ne-doc-opt">
                <span className="ne-doc-tag">Opción 1 · Enlace</span>
                <input
                  className="ne-input"
                  type="url"
                  value={hasDoc(form.href) && /^https?:\/\//.test(form.href) ? form.href : ""}
                  onChange={(e) => set("href", e.target.value)}
                  placeholder="https://... (URL de la ley)"
                />
              </div>

              <div className="ne-doc-or"><span>o</span></div>

              <div className="ne-doc-opt">
                <span className="ne-doc-tag">Opción 2 · Subir documento</span>
                <div
                  className={`up-zone compact${drag ? " drag" : ""}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
                >
                  <span className="up-ic" aria-hidden="true">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6M9 15l3-3 3 3" />
                    </svg>
                  </span>
                  <strong>{uploading ? "Subiendo…" : "Arrastra el archivo o haz clic"}</strong>
                  <span className="up-hint">PDF o imagen · hasta 20 MB</span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf,image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {hasDoc(form.href) && (
              <div className="ne-doc-current">
                <a href={form.href} target="_blank" rel="noopener noreferrer">Ver documento adjunto</a>
                <button type="button" className="adm-btn danger sm" onClick={() => set("href", "")}>Quitar</button>
              </div>
            )}
          </div>
        </div>

        <div className="ne-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy || uploading}>
            {busy ? "Guardando…" : initial ? "Guardar cambios" : "Agregar normativa"}
          </button>
        </div>
      </form>
    </div>
  );
}
