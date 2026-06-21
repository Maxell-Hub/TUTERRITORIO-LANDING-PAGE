"use client";

import { useState } from "react";

const TIPOS = ["Petición", "Queja", "Reclamo", "Sugerencia", "Denuncia"];
const DOCS = ["Cédula de ciudadanía", "Cédula de extranjería", "NIT", "Pasaporte"];

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function PqrsdForm() {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Anti-spam (honeypot): si el campo oculto trae valor, descartamos.
    if (data._honey) return;

    setSending(true);
    try {
      const res = await fetch("/api/pqrsd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("No se pudo radicar. Intenta de nuevo.");
      setOk(true);
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="pq-form" onSubmit={onSubmit} noValidate={false}>
      {/* honeypot anti-bot */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

      {ok && (
        <div className="pq-ok" role="status">
          ✅ Tu PQRSD fue radicada correctamente. Recibirás respuesta al correo registrado.
        </div>
      )}
      {error && (
        <div className="pq-ok" role="alert" style={{ background: "#fdecec", borderColor: "var(--tt-red-500)", color: "var(--tt-red-600)" }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: 26 }}>
        <h2>Formulario de radicación</h2>
        <p className="pq-note">Los campos marcados con <span className="req">*</span> son obligatorios.</p>
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: "0 0 26px" }}>
        <legend className="pq-legend">Tipo de solicitud <span className="req">*</span></legend>
        <div className="pq-radios">
          {TIPOS.map((t, i) => (
            <label className="pq-chip" key={t}>
              <input type="radio" name="tipo" value={t} required={i === 0} /> {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="pq-grid">
        <label className="pq-field">
          <span className="pq-label">Nombre completo <span className="req">*</span></span>
          <input className="pq-input" type="text" name="nombre" required placeholder="Nombres y apellidos" />
        </label>
        <label className="pq-field">
          <span className="pq-label">Tipo de documento <span className="req">*</span></span>
          <select className="pq-input" name="tipoDocumento" required defaultValue="">
            <option value="" disabled>Selecciona…</option>
            {DOCS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="pq-field">
          <span className="pq-label">Número de documento <span className="req">*</span></span>
          <input className="pq-input" type="text" name="documento" required placeholder="Sin puntos ni comas" />
        </label>
        <label className="pq-field">
          <span className="pq-label">Correo electrónico <span className="req">*</span></span>
          <input className="pq-input" type="email" name="correo" required placeholder="tucorreo@ejemplo.com" />
        </label>
        <label className="pq-field">
          <span className="pq-label">Teléfono</span>
          <input className="pq-input" type="tel" name="telefono" placeholder="Celular o fijo" />
        </label>
        <label className="pq-field">
          <span className="pq-label">Dirección</span>
          <input className="pq-input" type="text" name="direccion" placeholder="Dirección de notificación" />
        </label>
      </div>

      <label className="pq-field" style={{ marginTop: 18 }}>
        <span className="pq-label">Asunto <span className="req">*</span></span>
        <input className="pq-input" type="text" name="asunto" required placeholder="Resumen breve de tu solicitud" />
      </label>

      <label className="pq-field" style={{ marginTop: 18 }}>
        <span className="pq-label">Descripción de la solicitud <span className="req">*</span></span>
        <textarea className="pq-input" name="descripcion" required rows={6}
          placeholder="Describe con el mayor detalle posible tu petición, queja, reclamo, sugerencia o denuncia."
          style={{ resize: "vertical", minHeight: 140 }} />
      </label>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 11, marginTop: 22, font: "var(--fw-regular) var(--fs-sm)/1.5 var(--font-sans)", color: "var(--tt-gray-700)", cursor: "pointer" }}>
        <input type="checkbox" name="autorizacion" value="Sí" required style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--tt-green-600)", flex: "none" }} />
        <span>Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de Tuterritorio y la Ley 1581 de 2012. <span className="req">*</span></span>
      </label>

      <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
        <button type="submit" className="pq-submit" disabled={sending}>
          {sending ? "Enviando…" : "Radicar PQRSD"} <Arrow />
        </button>
        <a href="/" style={{ font: "var(--fw-semibold) var(--fs-sm)/1 var(--font-sans)", color: "var(--tt-gray-700)", textDecoration: "none" }}>
          Volver al inicio
        </a>
      </div>
    </form>
  );
}
