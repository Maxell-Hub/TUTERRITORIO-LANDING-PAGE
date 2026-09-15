"use client";

import { useEffect, useMemo, useState } from "react";

const ESTADOS = ["Recibida", "En trámite", "Resuelta", "Cerrada"] as const;
type Estado = (typeof ESTADOS)[number];

type Adjunto = { nombre: string; url: string; tamano?: number };
type Pqrsd = {
  id: number;
  radicado: string;
  tipo: string;
  nombre: string;
  doc_tipo: string | null;
  documento: string | null;
  correo: string | null;
  telefono: string | null;
  asunto: string | null;
  descripcion: string | null;
  estado: Estado;
  adjuntos: Adjunto[];
  respuesta: string | null;
  fecha_limite: string | null;
  creado_en: string;
};

const COLOR: Record<Estado, string> = {
  "Recibida": "#3B85A5",
  "En trámite": "#E7A32E",
  "Resuelta": "#4E8654",
  "Cerrada": "#5b6b74",
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}
function vencida(fechaLimite: string | null, estado: Estado) {
  if (!fechaLimite || estado === "Resuelta" || estado === "Cerrada") return false;
  return new Date(fechaLimite) < new Date(new Date().toDateString());
}

export default function PqrsdAdmin() {
  const [items, setItems] = useState<Pqrsd[]>([]);
  const [estado, setEstado] = useState<"loading" | "ok" | "unauth" | "nodb" | "error">("loading");
  const [fEstado, setFEstado] = useState<string>("Todas");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Pqrsd | null>(null);

  async function load() {
    setEstado("loading");
    try {
      const r = await fetch("/api/admin/pqrsd", { cache: "no-store" });
      if (r.status === 401) return setEstado("unauth");
      const d = await r.json();
      if (!r.ok) return setEstado("error");
      if (!d.configurada) return setEstado("nodb");
      setItems(Array.isArray(d.pqrsd) ? d.pqrsd : []);
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  }
  useEffect(() => { load(); }, []);

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((p) => {
      if (fEstado !== "Todas" && p.estado !== fEstado) return false;
      if (t && !(`${p.radicado} ${p.nombre} ${p.documento ?? ""} ${p.asunto ?? ""} ${p.tipo}`.toLowerCase().includes(t))) return false;
      return true;
    });
  }, [items, fEstado, q]);

  if (estado === "loading") return <p style={{ color: "#5b6b74" }}>Cargando PQRSD…</p>;
  if (estado === "unauth")
    return <p style={{ color: "#5b6b74" }}>Debes <a href="/acceso" style={{ color: "#3B85A5" }}>iniciar sesión como administrador</a> para ver el panel de PQRSD.</p>;
  if (estado === "nodb")
    return <p style={{ color: "#5b6b74" }}>La base de datos (Neon) aún no está conectada. Conéctala en Vercel → Storage y vuelve a intentar.</p>;
  if (estado === "error") return <p style={{ color: "#D83744" }}>No se pudo cargar. <button onClick={load}>Reintentar</button></p>;

  const conteo = (e: string) => items.filter((p) => e === "Todas" || p.estado === e).length;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      {/* Filtros */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
        {["Todas", ...ESTADOS].map((e) => (
          <button key={e} onClick={() => setFEstado(e)}
            style={{ padding: "7px 13px", borderRadius: 999, cursor: "pointer", fontWeight: 600, fontSize: 13,
              border: `1px solid ${fEstado === e ? "#163A4C" : "#d6e4ec"}`,
              background: fEstado === e ? "#163A4C" : "#fff", color: fEstado === e ? "#fff" : "#5b6b74" }}>
            {e} ({conteo(e)})
          </button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar radicado, nombre, cédula…"
          style={{ marginLeft: "auto", padding: "9px 12px", borderRadius: 10, border: "1px solid #d6e4ec", minWidth: 240, fontSize: 14 }} />
        <button onClick={load} title="Actualizar" style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #d6e4ec", background: "#fff", cursor: "pointer" }}>↻</button>
      </div>

      {filtradas.length === 0 ? (
        <p style={{ color: "#5b6b74" }}>No hay PQRSD que coincidan.</p>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #e4e9ed", borderRadius: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 760 }}>
            <thead>
              <tr style={{ background: "#f5f8fa", textAlign: "left", color: "#5b6b74" }}>
                <th style={{ padding: "11px 14px" }}>Radicado</th>
                <th style={{ padding: "11px 14px" }}>Fecha</th>
                <th style={{ padding: "11px 14px" }}>Tipo</th>
                <th style={{ padding: "11px 14px" }}>Ciudadano</th>
                <th style={{ padding: "11px 14px" }}>Estado</th>
                <th style={{ padding: "11px 14px" }}>Límite</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((p) => (
                <tr key={p.id} onClick={() => setSel(p)}
                  style={{ borderTop: "1px solid #eef1f3", cursor: "pointer", background: sel?.id === p.id ? "#eef6fa" : "#fff" }}>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#163A4C", whiteSpace: "nowrap" }}>{p.radicado}</td>
                  <td style={{ padding: "11px 14px", whiteSpace: "nowrap", color: "#5b6b74" }}>{fmt(p.creado_en)}</td>
                  <td style={{ padding: "11px 14px" }}>{p.tipo}</td>
                  <td style={{ padding: "11px 14px" }}>{p.nombre}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ background: COLOR[p.estado], color: "#fff", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{p.estado}</span>
                  </td>
                  <td style={{ padding: "11px 14px", whiteSpace: "nowrap", color: vencida(p.fecha_limite, p.estado) ? "#D83744" : "#5b6b74", fontWeight: vencida(p.fecha_limite, p.estado) ? 700 : 400 }}>
                    {fmt(p.fecha_limite)}{vencida(p.fecha_limite, p.estado) ? " ⚠" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sel && <Detalle p={sel} onClose={() => setSel(null)} onSaved={(u) => { setItems((xs) => xs.map((x) => x.id === u.id ? u : x)); setSel(u); }} />}
    </div>
  );
}

function Detalle({ p, onClose, onSaved }: { p: Pqrsd; onClose: () => void; onSaved: (u: Pqrsd) => void }) {
  const [estado, setEstado] = useState<Estado>(p.estado);
  const [respuesta, setRespuesta] = useState(p.respuesta ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function guardar() {
    setSaving(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/pqrsd", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, estado, respuesta }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "No se pudo guardar");
      onSaved(d.pqrsd);
      setMsg("Guardado ✓");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(12,34,47,.5)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 16px", overflow: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 620, width: "100%", padding: 26, boxShadow: "0 20px 50px rgba(12,34,47,.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "#5b6b74", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>{p.tipo}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#163A4C" }}>{p.radicado}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f0f4f6", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        <dl style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "8px 12px", margin: "18px 0", fontSize: 14 }}>
          <dt style={{ color: "#5b6b74" }}>Ciudadano</dt><dd style={{ margin: 0 }}>{p.nombre}</dd>
          <dt style={{ color: "#5b6b74" }}>Documento</dt><dd style={{ margin: 0 }}>{p.doc_tipo} {p.documento}</dd>
          <dt style={{ color: "#5b6b74" }}>Correo</dt><dd style={{ margin: 0 }}><a href={`mailto:${p.correo}`} style={{ color: "#3B85A5" }}>{p.correo}</a></dd>
          <dt style={{ color: "#5b6b74" }}>Teléfono</dt><dd style={{ margin: 0 }}>{p.telefono || "—"}</dd>
          <dt style={{ color: "#5b6b74" }}>Radicada</dt><dd style={{ margin: 0 }}>{fmt(p.creado_en)}</dd>
          <dt style={{ color: "#5b6b74" }}>Fecha límite</dt><dd style={{ margin: 0, color: vencida(p.fecha_limite, p.estado) ? "#D83744" : "#163A4C", fontWeight: 700 }}>{fmt(p.fecha_limite)}{vencida(p.fecha_limite, p.estado) ? " (vencida)" : ""}</dd>
          <dt style={{ color: "#5b6b74" }}>Asunto</dt><dd style={{ margin: 0 }}>{p.asunto}</dd>
        </dl>

        <div style={{ background: "#f6f9fa", borderLeft: "4px solid #3B85A5", borderRadius: 8, padding: "12px 16px", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#333" }}>{p.descripcion}</div>

        {p.adjuntos?.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: "#5b6b74", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Anexos</div>
            {p.adjuntos.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginRight: 10, marginBottom: 6, color: "#3B85A5", fontSize: 14 }}>📎 {a.nombre}</a>
            ))}
          </div>
        )}

        <hr style={{ border: "none", borderTop: "1px solid #eef1f3", margin: "20px 0" }} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 14, color: "#5b6b74", fontWeight: 600 }}>Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value as Estado)} style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #d6e4ec", fontSize: 14 }}>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <textarea value={respuesta} onChange={(e) => setRespuesta(e.target.value)} placeholder="Nota interna o respuesta (opcional)…" rows={3}
          style={{ width: "100%", marginTop: 12, padding: "10px 12px", borderRadius: 10, border: "1px solid #d6e4ec", fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <button onClick={guardar} disabled={saving} style={{ background: "#163A4C", color: "#fff", border: "none", padding: "11px 22px", borderRadius: 10, fontWeight: 700, cursor: "pointer", opacity: saving ? .6 : 1 }}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          {msg && <span style={{ fontSize: 14, color: msg.includes("✓") ? "#4E8654" : "#D83744" }}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
