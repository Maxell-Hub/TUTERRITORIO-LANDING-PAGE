"use client";

import { useEffect, useState } from "react";
import type { Tramite } from "@/lib/content";
import { DEFAULT_TRAMITES } from "@/lib/content";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveContent } from "@/lib/saveContent";
import TramiteEditor from "@/components/servicios/TramiteEditor";

/* Colores corporativos para los números (rotan por tarjeta). */
const BRAND = ["#4E8654", "#3B85A5", "#F0B63B"];

/** Texto de búsqueda normalizado (sin tildes), con términos en inglés. */
const buscarDe = (t: Tramite) =>
  `${t.title} ${t.desc} ${t.reqs.join(" ")} ${t.costo} ${t.en || ""} ${t.costo === "Sin costo" ? "free no cost" : "cost fee price"} business days`
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const period = (s: string) => (s.trim().endsWith(".") ? s : s + ".");

const Clock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const Check = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);

export default function TramitesGrid() {
  const { user, notify } = useAuth();
  const [tramites, setTramites] = useState<Tramite[]>(DEFAULT_TRAMITES);
  const [editing, setEditing] = useState<Tramite | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/content/tramites")
      .then((r) => r.json())
      .then((d) => { if (alive && Array.isArray(d)) setTramites(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const isAdmin = !!user;

  async function persist(next: Tramite[]) {
    setTramites(next);
    try {
      await saveContent("tramites", next);
      notify("Cambios guardados");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudieron guardar los cambios", "error");
    }
  }

  function handleSave(item: Tramite) {
    const exists = tramites.some((t) => t.id === item.id);
    const next = exists ? tramites.map((t) => (t.id === item.id ? item : t)) : [...tramites, item];
    persist(next);
    setEditing(null);
    setCreating(false);
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este trámite? Esta acción no se puede deshacer.")) return;
    persist(tramites.filter((t) => t.id !== id));
  }

  return (
    <>
      {isAdmin && (
        <div className="adm-bar" style={{ justifyContent: "center", padding: "0 0 18px" }}>
          <span className="adm-flag">Modo administrador</span>
          <button className="adm-btn" onClick={() => setCreating(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Agregar trámite
          </button>
        </div>
      )}

      <div className="tr-grid" style={{ marginTop: 32 }}>
        {tramites.map((t, i) => (
          <div
            className="tr-card design-numero"
            key={t.id}
            tabIndex={0}
            data-buscar={buscarDe(t)}
            aria-label={`${t.title}. ${t.tiempo}, ${t.costo}.`}
            style={{ ["--accent" as string]: BRAND[i % BRAND.length] }}
          >
            <div className="tr-face">
              <div className="tr-numhead">
                <span className="tr-index">{String(i + 1).padStart(2, "0")}</span>
                <span className={`tr-cost-n ${t.costo === "Sin costo" ? "free" : "paid"}`}>{t.costo}</span>
              </div>
              <div className="tr-body">
                <h3 className="tr-title">{t.title}</h3>
                <p className="tr-desc">{t.desc}</p>
                <div className="tr-facemeta">
                  <span className="tr-tag"><Clock /> {t.tiempo}</span>
                </div>
              </div>
            </div>
            <div className="tr-detail">
              <span className="lbl">Documentos requeridos</span>
              <ul className="tr-reqs">
                {t.reqs.map((r, j) => (
                  <li key={j}><Check /> {period(r)}</li>
                ))}
              </ul>
              {isAdmin && (
                <div className="adm-actions" style={{ marginTop: 14 }}>
                  <button className="adm-btn ghost sm" onClick={() => setEditing(t)}><PencilIcon /> Editar</button>
                  <button className="adm-btn danger sm" onClick={() => handleDelete(t.id)}><TrashIcon /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <TramiteEditor
          initial={editing}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
