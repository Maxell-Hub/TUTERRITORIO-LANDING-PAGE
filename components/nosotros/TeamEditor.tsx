"use client";

import { useEffect, useRef, useState } from "react";
import type { Member } from "@/lib/content";
import { TEAM_AREAS } from "@/lib/content";
import { useAuth } from "@/components/auth/AuthProvider";
import { uploadFile } from "@/lib/uploadClient";

type Props = {
  initial: Member | null;
  defaultArea?: string;
  onCancel: () => void;
  onSave: (item: Member) => void | Promise<void>;
};

function makeId(): string {
  return "m-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

export default function TeamEditor({ initial, defaultArea, onCancel, onSave }: Props) {
  const { notify } = useAuth();
  const [form, setForm] = useState<Member>(
    initial ?? { id: makeId(), name: "", role: "", area: defaultArea || TEAM_AREAS[0], photo: "" }
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

  function set<K extends keyof Member>(k: K, v: Member[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      notify("La foto debe ser una imagen", "error");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(file);
      set("photo", url);
      notify("Foto cargada");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudo subir la foto", "error");
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
    await onSave({ ...form, name: form.name.trim(), role: form.role.trim() });
    setBusy(false);
  }

  return (
    <div className="tt-modal-overlay" onClick={onCancel}>
      <form
        className="tt-modal news-editor"
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Editar integrante" : "Nuevo integrante"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="ne-head">
          <div>
            <span className="ne-kicker">Nosotros · Nuestro equipo</span>
            <h2>{initial ? "Editar integrante" : "Nuevo integrante"}</h2>
          </div>
          <button type="button" className="tt-modal-close" aria-label="Cerrar" onClick={onCancel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="ne-body">
          <div className="ne-field">
            <span className="ne-label">Foto (opcional)</span>
            {form.photo ? (
              <div className="up-preview" style={{ aspectRatio: "1 / 1", maxWidth: 160 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photo} alt="Vista previa" />
                <div className="up-preview-bar">
                  <button type="button" className="adm-btn ghost sm" onClick={() => fileRef.current?.click()}>Cambiar</button>
                  <button type="button" className="adm-btn danger sm" onClick={() => set("photo", "")}>Quitar</button>
                </div>
                {uploading && <div className="up-loading">Subiendo…</div>}
              </div>
            ) : (
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
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                </span>
                <strong>{uploading ? "Subiendo…" : "Arrastra una foto o haz clic"}</strong>
                <span className="up-hint">JPG, PNG o WebP</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </div>

          <label className="ne-field">
            <span className="ne-label">Nombre</span>
            <input className="ne-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nombre y apellido" required />
          </label>

          <div className="ne-row">
            <label className="ne-field">
              <span className="ne-label">Cargo / perfil</span>
              <input className="ne-input" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Ej: Topógrafa" required />
            </label>
            <label className="ne-field">
              <span className="ne-label">Área</span>
              <select className="ne-input" value={form.area} onChange={(e) => set("area", e.target.value)}>
                {TEAM_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="ne-foot">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={busy || uploading}>
            {busy ? "Guardando…" : initial ? "Guardar cambios" : "Agregar integrante"}
          </button>
        </div>
      </form>
    </div>
  );
}
