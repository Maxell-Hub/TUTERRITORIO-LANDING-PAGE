"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Editable from "@/components/admin/Editable";
import TeamEditor from "@/components/nosotros/TeamEditor";
import type { Member } from "@/lib/content";
import { DEFAULT_EQUIPO } from "@/lib/content";

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

const AREAS: { key: string; c: string; meta: string; icon: React.ReactNode }[] = [
  { key: "Topografía y campo", c: "#3B85A5", meta: "Levantamiento, reconocimiento predial y verificación de linderos", icon: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></> },
  { key: "Jurídica", c: "#4E8654", meta: "Mutaciones, trámites y seguridad jurídica de la propiedad", icon: <><path d="M3 21h18M6 21V8l6-4 6 4v13M9 21v-6h6v6" /></> },
  { key: "Sistemas y datos", c: "#E0A526", meta: "Información geográfica, bases de datos y plataformas digitales", icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></> },
  { key: "Atención al ciudadano", c: "#D83744", meta: "Orientación, recepción de solicitudes y acompañamiento", icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> },
];

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
      const res = await fetch("/api/content/equipo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error();
      notify("Cambios guardados");
    } catch {
      notify("No se pudieron guardar los cambios", "error");
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

  const isAdmin = !!user;
  const lead = members.filter((m) => m.area === "Liderazgo");
  const techCount = members.filter((m) => m.area !== "Liderazgo").length;

  return (
    <>
      {/* Liderazgo */}
      <section className="sec-pad" style={{ background: "#fff" }}>
        <div className="sec-wrap">
          <div className="reveal" style={{ maxWidth: "46rem", margin: "0 auto 40px", textAlign: "center" }}>
            <span className="eyebrow-b">Liderazgo</span>
            <Editable as="h2" id="equipo.lead-title" className="h2-nos">Quienes orientan nuestra gestión</Editable>
            <span className="ribbon5 center" style={{ marginTop: 18, width: 110, height: 4 }} />
          </div>

          {isAdmin && (
            <div className="adm-bar" style={{ justifyContent: "center", padding: "0 0 22px" }}>
              <span className="adm-flag">Modo administrador</span>
              <button className="adm-btn" onClick={() => { setEditing(null); setCreatingArea("Liderazgo"); }}><Plus /> Agregar líder</button>
            </div>
          )}

          <div className="lead-grid">
            {lead.map((m) => (
              <div key={m.id} className="member lift lead-card">
                <div className="lead-photo" style={{ background: "linear-gradient(135deg,#1E5167,#0C222F)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <UserIcon size={56} stroke="rgba(255,255,255,.55)" sw={1.5} />
                  )}
                </div>
                <div style={{ padding: "26px 24px 30px" }}>
                  <h3 style={{ margin: 0, font: "700 1.3125rem/1.25 var(--font-sans)", color: "var(--tt-navy-700)" }}>{m.name}</h3>
                  <p style={{ margin: "6px 0 0", font: "400 0.9375rem/1.4 var(--font-sans)", color: "var(--tt-gray-500)" }}>{m.role}</p>
                  {isAdmin && (
                    <div className="adm-actions" style={{ marginTop: 14 }}>
                      <button className="adm-btn ghost sm" onClick={() => { setCreatingArea(null); setEditing(m); }}><Pencil /> Editar</button>
                      <button className="adm-btn danger sm" onClick={() => handleDelete(m.id)}><Trash /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {lead.length === 0 && <p style={{ color: "var(--tt-gray-500)" }}>Sin integrantes de liderazgo aún.</p>}
          </div>
        </div>
      </section>

      {/* Equipo técnico */}
      <section className="sec-pad" style={{ background: "var(--tt-gray-50)", paddingBottom: "clamp(5rem,9vw,8rem)" }}>
        <div className="sec-wrap">
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
            <div style={{ maxWidth: "46rem" }}>
              <span className="eyebrow-b">Equipo técnico</span>
              <Editable as="h2" id="equipo.tech-title" className="h2-nos">Un equipo interdisciplinario</Editable>
              <p style={{ margin: "16px 0 0", font: "400 1.0625rem/1.6 var(--font-sans)", color: "var(--tt-gray-700)" }}>
                <Editable as="span" id="equipo.tech-intro" multiline>Profesionales organizados por áreas de especialidad, trabajando de forma coordinada en cada etapa del proceso catastral.</Editable>
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ font: "800 clamp(2.6rem,5vw,3.6rem)/1 var(--font-sans)", color: "#3B85A5" }}>{techCount}</span>
              <span style={{ font: "600 0.9375rem/1.2 var(--font-sans)", color: "var(--tt-gray-500)" }}>profesionales</span>
            </div>
          </div>

          <div className="team-stack">
            {AREAS.map((area) => {
              const list = members.filter((m) => m.area === area.key);
              return (
                <div key={area.key} className="team-area" style={{ borderLeft: `5px solid ${area.c}` }}>
                  <div className="head">
                    <span className="ic" style={{ background: area.c }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{area.icon}</svg>
                    </span>
                    <div>
                      <h3>{area.key}</h3>
                      <p className="meta">{area.meta} · {list.length} {list.length === 1 ? "integrante" : "integrantes"}</p>
                    </div>
                    {isAdmin && (
                      <button className="adm-btn sm" style={{ marginLeft: "auto" }} onClick={() => { setEditing(null); setCreatingArea(area.key); }}><Plus /> Agregar</button>
                    )}
                  </div>
                  <div className="avatar-grid">
                    {list.map((m) => (
                      <div key={m.id} className="member">
                        <div className="avatar-ph" style={{ position: "relative", overflow: "hidden" }}>
                          {m.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.photo} alt={m.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <UserIcon size={34} stroke="#A9B6BF" sw={1.6} />
                          )}
                        </div>
                        <span className="cap">{m.name}<small className="role">{m.role}</small></span>
                        {isAdmin && (
                          <div className="adm-actions" style={{ justifyContent: "center", marginTop: 8 }}>
                            <button className="adm-btn ghost sm" onClick={() => { setCreatingArea(null); setEditing(m); }} aria-label="Editar"><Pencil /></button>
                            <button className="adm-btn danger sm" onClick={() => handleDelete(m.id)} aria-label="Eliminar"><Trash /></button>
                          </div>
                        )}
                      </div>
                    ))}
                    {list.length === 0 && <div style={{ color: "var(--tt-gray-500)", font: "400 0.9rem/1.4 var(--font-sans)" }}>Sin integrantes aún.</div>}
                  </div>
                </div>
              );
            })}
          </div>
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
