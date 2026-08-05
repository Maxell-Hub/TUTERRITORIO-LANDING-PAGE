"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Editable from "@/components/admin/Editable";
import TeamEditor from "@/components/nosotros/TeamEditor";
import type { Member } from "@/lib/content";
import { DEFAULT_EQUIPO } from "@/lib/content";
import { saveContent } from "@/lib/saveContent";
import { useScrollToHash } from "@/lib/useScrollToHash";

const UserIcon = ({ size = 26, stroke = "rgba(255,255,255,.6)", sw = 1.5 }: { size?: number; stroke?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
const Pencil = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const Trash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);
const Plus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);

/** Muestra el nombre como: primer nombre + primer apellido + inicial del
 *  segundo apellido con punto. Ej.: "Lulia Cristina Maestre Arcia" → "Lulia Maestre A." */
function nombreCorto(full: string): string {
  const p = (full || "").trim().split(/\s+/).filter(Boolean);
  if (p.length <= 2) return full.trim();
  return `${p[0]} ${p[p.length - 2]} ${p[p.length - 1][0].toUpperCase()}.`;
}

export default function EquipoTeam() {
  const { user, notify } = useAuth();
  const [members, setMembers] = useState<Member[]>(DEFAULT_EQUIPO);
  const [editing, setEditing] = useState<Member | null>(null);
  const [creatingArea, setCreatingArea] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/content/equipo")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d)) setMembers(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function persist(next: Member[]) {
    setMembers(next);
    try {
      await saveContent("equipo", next);
      notify("Cambios guardados");
    } catch (e) {
      notify(e instanceof Error ? e.message : "No se pudieron guardar los cambios", "error");
    }
  }

  function handleSave(item: Member) {
    const exists = members.some((m) => m.id === item.id);
    const next = exists ? members.map((m) => (m.id === item.id ? item : m)) : [...members, item];
    persist(next);
    setEditing(null);
    setCreatingArea(null);
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este integrante?")) return;
    persist(members.filter((m) => m.id !== id));
  }

  useScrollToHash(members);

  const isAdmin = !!user;
  const direccion = members.filter((m) => m.area === "Dirección");
  const directivo = members.filter((m) => m.area !== "Dirección");

  return (
    <>
      {/* Estructura del equipo: Gerencia (destacada) + equipo directivo */}
      <section className="atg-band" id="equipo">
        <div className="atg-wrap">
          <div className="reveal" style={{ maxWidth: "46rem", margin: "0 auto 40px", textAlign: "center" }}>
            <Editable as="h2" id="equipo.lead-title">Quienes orientan nuestra gestión</Editable>
          </div>

          {isAdmin && (
            <div className="adm-bar" style={{ justifyContent: "center", padding: "0 0 22px" }}>
              <span className="adm-flag">Modo administrador</span>
              <button className="adm-btn" onClick={() => { setEditing(null); setCreatingArea("Dirección"); }}><Plus /> Agregar en Gerencia</button>
              <button className="adm-btn" onClick={() => { setEditing(null); setCreatingArea("Equipo directivo"); }}><Plus /> Agregar cargo</button>
            </div>
          )}

          {/* Gerencia destacada: tarjeta con foto arriba, nombre y cargo debajo */}
          <div className="eq-lead reveal">
            {direccion.map((m) => (
              <div id={m.id} key={m.id} className="eq-card member">
                <div className="eq-photo">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name || m.role} />
                  ) : (
                    <UserIcon size={58} />
                  )}
                </div>
                <div className="eq-cap">
                  <h3>{m.name ? nombreCorto(m.name) : m.role}</h3>
                  <p>{m.name ? m.role : "Por designar"}</p>
                </div>
                {isAdmin && (
                  <div className="adm-actions">
                    <button className="adm-btn ghost sm" onClick={() => { setCreatingArea(null); setEditing(m); }} aria-label="Editar"><Pencil /></button>
                    <button className="adm-btn danger sm" onClick={() => handleDelete(m.id)} aria-label="Eliminar"><Trash /></button>
                  </div>
                )}
              </div>
            ))}
            {direccion.length === 0 && <p style={{ color: "var(--tt-gray-500)" }}>Sin Gerencia asignada aún.</p>}
          </div>

          {/* Equipo directivo: encabezado + grilla de cargos */}
          {(directivo.length > 0 || isAdmin) && (
            <div className="eq-tech reveal">
              <div className="eq-tech-head">
                <div>
                  <span className="eq-eyebrow">Equipo directivo</span>
                  <Editable as="h2" id="equipo.tech-title">Un equipo interdisciplinario</Editable>
                  <Editable as="p" id="equipo.tech-sub" className="eq-sub" multiline>Las jefaturas y coordinaciones que dirigen cada área del catastro multipropósito de Valledupar, trabajando de forma coordinada en cada etapa del proceso.</Editable>
                </div>
                <div className="eq-count" aria-hidden="true">
                  <span className="num">{directivo.length}</span>
                  <span className="lbl">cargos<br />directivos</span>
                </div>
              </div>

              <div className="eq-grid">
                {directivo.map((m) => (
                  <div id={m.id} key={m.id} className="eq-member member">
                    <div className="eq-member-photo">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt={m.name || m.role} />
                      ) : (
                        <UserIcon size={40} />
                      )}
                    </div>
                    <h4>{m.name ? nombreCorto(m.name) : m.role}</h4>
                    {m.name ? <p>{m.role}</p> : <p className="pend">Por designar</p>}
                    {isAdmin && (
                      <div className="adm-actions">
                        <button className="adm-btn ghost sm" onClick={() => { setCreatingArea(null); setEditing(m); }} aria-label="Editar"><Pencil /></button>
                        <button className="adm-btn danger sm" onClick={() => handleDelete(m.id)} aria-label="Eliminar"><Trash /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {(creatingArea !== null || editing) && (
        <TeamEditor
          initial={editing}
          defaultArea={creatingArea ?? undefined}
          onCancel={() => { setEditing(null); setCreatingArea(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
