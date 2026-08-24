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
  const byArea = (a: string) => members.filter((m) => m.area === a);
  const direccion = byArea("Dirección");
  const tuterritorio = byArea("Equipo Tuterritorio");
  const contratistas = byArea("Contratistas");
  const alcaldia = byArea("Alcaldía");

  /** Tarjeta de persona (grilla): foto cuadrada con animación al pasar el mouse. */
  const MemberCard = (m: Member) => (
    <div id={m.id} key={m.id} className="eq-member">
      <div className="eq-member-photo">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo} alt={m.name || m.role} loading="lazy" decoding="async" />
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
  );

  return (
    <>
      <section className="atg-band" id="equipo">
        <div className="atg-wrap">
          <div className="reveal" style={{ maxWidth: "46rem", margin: "0 auto 40px", textAlign: "center" }}>
            <Editable as="h2" id="equipo.lead-title">Quienes orientan nuestra gestión</Editable>
          </div>

          {isAdmin && (
            <div className="adm-bar" style={{ justifyContent: "center", padding: "0 0 22px", flexWrap: "wrap" }}>
              <span className="adm-flag">Modo administrador</span>
              <button className="adm-btn" onClick={() => { setEditing(null); setCreatingArea("Dirección"); }}><Plus /> Dirección</button>
              <button className="adm-btn" onClick={() => { setEditing(null); setCreatingArea("Equipo Tuterritorio"); }}><Plus /> Equipo Tuterritorio</button>
              <button className="adm-btn" onClick={() => { setEditing(null); setCreatingArea("Contratistas"); }}><Plus /> Contratista</button>
              <button className="adm-btn" onClick={() => { setEditing(null); setCreatingArea("Alcaldía"); }}><Plus /> Alcaldía</button>
            </div>
          )}

          {/* 1 · Dirección destacada: Gerencia + Jefatura de la Oficina de Gestión Catastral */}
          <div className="eq-lead reveal">
            {direccion.map((m) => (
              <div id={m.id} key={m.id} className="eq-card">
                <div className="eq-photo">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name || m.role} decoding="async" />
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
            {direccion.length === 0 && <p style={{ color: "var(--tt-gray-500)" }}>Sin Dirección asignada aún.</p>}
          </div>

          {/* 2 · Equipo Tuterritorio: las jefaturas propias del operador */}
          {(tuterritorio.length > 0 || isAdmin) && (
            <div className="eq-block reveal">
              <div className="eq-tech-head">
                <div>
                  <span className="eq-eyebrow">Equipo Tuterritorio</span>
                  <Editable as="h2" id="equipo.tt-title">Las jefaturas que dirigen el operador</Editable>
                  <Editable as="p" id="equipo.tt-sub" className="eq-sub" multiline>Los cargos directivos que lideran la gestión jurídica, administrativa y financiera del catastro multipropósito de Valledupar.</Editable>
                </div>
              </div>
              <div className="eq-grid">{tuterritorio.map(MemberCard)}</div>
            </div>
          )}

          {/* 3 · Contratistas (equipo operativo) */}
          {(contratistas.length > 0 || isAdmin) && (
            <div className="eq-block reveal">
              <div className="eq-tech-head">
                <div>
                  <span className="eq-eyebrow">Equipo operativo</span>
                  <Editable as="h2" id="equipo.contract-title">Nuestro equipo de contratistas</Editable>
                  <Editable as="p" id="equipo.contract-sub" className="eq-sub" multiline>El talento humano que ejecuta en campo y oficina cada etapa del proceso catastral, de la mano de la Gerencia.</Editable>
                </div>
                <div className="eq-count" aria-hidden="true">
                  <span className="num">{contratistas.length}</span>
                  <span className="lbl">contratistas</span>
                </div>
              </div>
              <div className="eq-grid">{contratistas.map(MemberCard)}</div>
            </div>
          )}
        </div>
      </section>

      {/* 4 · Alcaldía: aliado institucional (no hace parte del equipo de Tuterritorio) */}
      {(alcaldia.length > 0 || isAdmin) && (
        <section className="atg-band eq-ally-band" id="oficina-gestion-catastral">
          <div className="atg-wrap">
            <div className="eq-ally-head reveal">
              <span className="eq-ally-tag">Aliado institucional</span>
              <Editable as="h2" id="equipo.ally-title">La Oficina de Gestión Catastral del municipio</Editable>
              <Editable as="p" id="equipo.ally-note" className="eq-ally-note" multiline>La Oficina de Gestión Catastral de la Alcaldía de Valledupar funciona en nuestra sede, por lo que día a día trabajamos hombro a hombro con su equipo. Estas personas son servidores públicos del municipio —no hacen parte del equipo de Tuterritorio—, y su labor es clave para la gestión catastral del territorio.</Editable>
            </div>
            <div className="eq-grid eq-grid-ally reveal">{alcaldia.map(MemberCard)}</div>
          </div>
        </section>
      )}

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
