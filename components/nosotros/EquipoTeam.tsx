"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Editable from "@/components/admin/Editable";
import TeamEditor from "@/components/nosotros/TeamEditor";
import type { Member } from "@/lib/content";
import { DEFAULT_EQUIPO } from "@/lib/content";
import { saveContent } from "@/lib/saveContent";
import { useScrollToHash } from "@/lib/useScrollToHash";

const UserIcon = ({ size = 26, stroke = "#fff", sw = 2 }: { size?: number; stroke?: string; sw?: number }) => (
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

/** Tarjeta de integrante: foto grande arriba, nombre y cargo debajo. */
function PersonCard({ m, isAdmin, onEdit, onDelete }: { m: Member; isAdmin: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <div id={m.id} className="person-card member lift">
      <div className="person-photo">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo} alt={m.name || m.role} />
        ) : (
          <UserIcon size={52} stroke="rgba(255,255,255,.6)" sw={1.4} />
        )}
      </div>
      <div className="person-body">
        <h4>{m.name || m.role}</h4>
        <p className="prole">{m.name ? m.role : "Por designar"}</p>
        {isAdmin && (
          <div className="adm-actions" style={{ justifyContent: "center", marginTop: 6 }}>
            <button className="adm-btn ghost sm" onClick={onEdit} aria-label="Editar"><Pencil /></button>
            <button className="adm-btn danger sm" onClick={onDelete} aria-label="Eliminar"><Trash /></button>
          </div>
        )}
      </div>
    </div>
  );
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
      {/* Estructura del equipo: Gerencia + equipo directivo */}
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

          {/* Gerencia destacada */}
          <div className="equipo-lead reveal">
            {direccion.map((m) => (
              <PersonCard key={m.id} m={m} isAdmin={isAdmin}
                onEdit={() => { setCreatingArea(null); setEditing(m); }}
                onDelete={() => handleDelete(m.id)} />
            ))}
            {direccion.length === 0 && <p style={{ color: "var(--tt-gray-500)" }}>Sin Gerencia asignada aún.</p>}
          </div>

          {/* Equipo directivo */}
          {(directivo.length > 0 || isAdmin) && (
            <>
              <div className="equipo-sub reveal">
                <span className="equipo-sub-line" aria-hidden="true" />
                <span className="equipo-sub-label">Equipo directivo</span>
                <span className="equipo-sub-line" aria-hidden="true" />
              </div>
              <div className="equipo-roles reveal">
                {directivo.map((m) => (
                  <PersonCard key={m.id} m={m} isAdmin={isAdmin}
                    onEdit={() => { setCreatingArea(null); setEditing(m); }}
                    onDelete={() => handleDelete(m.id)} />
                ))}
              </div>
            </>
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
