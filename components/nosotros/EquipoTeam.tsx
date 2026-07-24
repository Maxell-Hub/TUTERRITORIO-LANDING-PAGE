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

/* Ícono de línea según el cargo (por palabras clave), con respaldo genérico.
   Así las jefaturas conocidas muestran un ícono adecuado y cualquier cargo
   nuevo que agregue el administrador cae en un ícono por defecto. */
function roleIcon(role: string) {
  const r = role.toLowerCase();
  const p = (d: React.ReactNode) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
  );
  if (/talento|humano|personal/.test(r)) return p(<><path d="M16 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
  if (/jur[ií]dic|legal|abog/.test(r)) return p(<><path d="M12 3v18" /><path d="M5 7h14" /><path d="m5 7-2 5a3 3 0 0 0 6 0Z" /><path d="m19 7-2 5a3 3 0 0 0 6 0Z" /><path d="M7 21h10" /></>);
  if (/sistema|geogr[áa]f|sig|informaci[óo]n|dato/.test(r)) return p(<><path d="m3 7 9-4 9 4-9 4Z" /><path d="m3 12 9 4 9-4" /><path d="m3 17 9 4 9-4" /></>);
  if (/econ[óo]mic|estudio|aval[úu]o|financ/.test(r)) return p(<><path d="M3 3v18h18" /><path d="m7 14 3-3 3 3 5-6" /></>);
  if (/administrativ|coordinac|gesti[óo]n/.test(r)) return p(<><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>);
  if (/contad|contab/.test(r)) return p(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6" /><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" /></>);
  if (/geren|direc/.test(r)) return p(<><path d="M12 2 15 8l6 .5-4.5 4 1.4 6L12 15.5 6.1 18.5l1.4-6L3 8.5 9 8Z" /></>);
  return p(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
}

// Colores corporativos que rotan por tarjeta de cargo.
const ROLE_COLORS = ["#3B85A5", "#4E8654", "#F0B63B", "#163A4C", "#2F6B86", "#4E8654", "#3B85A5"];

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
            <p style={{ margin: "16px 0 0", font: "400 0.9375rem/1.7 var(--font-sans)", color: "var(--tt-gray-500)" }}>
              <Editable as="span" id="equipo.lead-intro" multiline>La estructura de Tuterritorio: la Gerencia y las jefaturas que dirigen cada área del catastro multipropósito de Valledupar.</Editable>
            </p>
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
              <div id={m.id} key={m.id} className="equipo-lead-card">
                <div className="equipo-lead-photo">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name || m.role} />
                  ) : (
                    <UserIcon size={54} stroke="rgba(255,255,255,.6)" sw={1.5} />
                  )}
                </div>
                <div className="equipo-lead-body">
                  <span className="equipo-lead-badge">{m.role}</span>
                  {m.name && <h3>{m.name}</h3>}
                  <p>Encabeza la gestión catastral de Valledupar y representa a Tuterritorio ante la ciudadanía y los entes de control.</p>
                  {isAdmin && (
                    <div className="adm-actions" style={{ marginTop: 14 }}>
                      <button className="adm-btn ghost sm" onClick={() => { setCreatingArea(null); setEditing(m); }}><Pencil /> Editar</button>
                      <button className="adm-btn danger sm" onClick={() => handleDelete(m.id)}><Trash /></button>
                    </div>
                  )}
                </div>
              </div>
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
                {directivo.map((m, i) => {
                  const c = ROLE_COLORS[i % ROLE_COLORS.length];
                  return (
                    <div id={m.id} key={m.id} className="role-card member lift">
                      <span className="role-ic" style={{ background: c }}>{roleIcon(m.role)}</span>
                      <h4>{m.role}</h4>
                      {m.name ? <p className="rname">{m.name}</p> : <p className="rname pend">Por designar</p>}
                      {isAdmin && (
                        <div className="adm-actions" style={{ marginTop: 4 }}>
                          <button className="adm-btn ghost sm" onClick={() => { setCreatingArea(null); setEditing(m); }} aria-label="Editar"><Pencil /></button>
                          <button className="adm-btn danger sm" onClick={() => handleDelete(m.id)} aria-label="Eliminar"><Trash /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
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
