"use client";

import { useEffect, useRef, useState } from "react";
import type { News } from "@/lib/content";
import { NEWS_CATEGORIES, CATEGORY_BADGE } from "@/lib/content";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  initial: News | null; // null = nueva noticia
  onCancel: () => void;
  onSave: (item: News) => void | Promise<void>;
};

function makeId(): string {
  return "n-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

const DEFAULT_BADGE = "var(--tt-blue-700)";

export default function NewsEditor({ initial, onCancel, onSave }: Props) {
  const { notify } = useAuth();
  const [form, setForm] = useState<News>(
    initial ?? {
      id: makeId(),
      categoria: "",
      badge: DEFAULT_BADGE,
      fecha: "",
      titulo: "",
      extracto: "",
      imagen: "",
    }
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

  function set<K extends keyof News>(k: K, v: News[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      notify("El archivo debe ser una imagen", "error");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error al subir");
      set("imagen", json.url);
      notify("Imagen cargada");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudo subir la imagen", "error");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imagen) {
      notify("Agrega una imagen para la noticia", "error");
      return;
    }
    setBusy(true);
    const cat = form.categoria.trim();
    // Color del badge: usa el de una categoría conocida si coincide; si no, conserva el actual.
    const badge = CATEGORY_BADGE[cat] || form.badge || DEFAULT_BADGE;
    await onSave({ ...form, categoria: cat, badge });
    setBusy(false);
  }

  return (
    <div className="tt-modal-overlay" onClick={onCancel}>
      <form
        className="tt-modal news-editor"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar noticia" : "Nueva noticia"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="ne-head">
          <div>
            <span className="ne-kicker">Sala de prensa · Tuterritorio</span>
            <h2>{initial ? "Editar noticia" : "Nueva noticia"}</h2>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="ne-body">
          {/* Imagen: arrastrar/soltar o explorador */}
          <div className="ne-field">
            <span className="ne-label">Imagen de la noticia</span>
            {form.imagen ? (
              <div className="up-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imagen} alt="Vista previa" />
                <div className="up-preview-bar">
                  <button type="button" className="adm-btn ghost sm" onClick={() => fileRef.current?.click()}>Cambiar</button>
                  <button type="button" className="adm-btn danger sm" onClick={() => set("imagen", "")}>Quitar</button>
                </div>
                {uploading && <div className="up-loading">Subiendo…</div>}
              </div>
            ) : (
              <div
                className={`up-zone${drag ? " drag" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
              >
                <span className="up-ic" aria-hidden="true">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
                  </svg>
                </span>
                <strong>{uploading ? "Subiendo imagen…" : "Arrastra una imagen o haz clic para subir"}</strong>
                <span className="up-hint">JPG, PNG o WebP · hasta 8 MB</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
                e.target.value = "";
              }}
            />
          </div>

          <label className="ne-field">
            <span className="ne-label">Título</span>
            <input className="ne-input" value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Escribe el titular de la noticia" required />
          </label>

          <div className="ne-row">
            <label className="ne-field">
              <span className="ne-label">Categoría</span>
              <input
                className="ne-input"
                value={form.categoria}
                onChange={(e) => set("categoria", e.target.value)}
                placeholder="Ej: Actualización catastral"
                list="ne-cats"
                required
              />
              <datalist id="ne-cats">
                {NEWS_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <label className="ne-field">
              <span className="ne-label">Fecha</span>
              <input className="ne-input" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} placeholder="12 de junio de 2026" required />
            </label>
          </div>

          <label className="ne-field">
            <span className="ne-label">Extracto</span>
            <textarea className="ne-input" rows={4} value={form.extracto} onChange={(e) => set("extracto", e.target.value)} placeholder="Resumen breve que verán los ciudadanos" required />
          </label>
        </div>

        <div className="ne-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy || uploading}>
            {busy ? "Guardando…" : initial ? "Guardar cambios" : "Publicar noticia"}
          </button>
        </div>
      </form>
    </div>
  );
}
