"use client";

import { useState } from "react";

export default function ContactoForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    if (data._honey) return; // anti-spam

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("No se pudo enviar el mensaje. Intenta de nuevo.");
      setSent(true);
      const sec = document.getElementById("formulario");
      if (sec) window.scrollTo({ top: Math.max(0, sec.offsetTop - 90), behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="ct-card">
        <div className="ct-success">
          <div className="ct-success-ring">
            <span className="ring" />
            <span className="disc">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
          </div>
          <h3>¡Mensaje enviado!</h3>
          <p>Gracias por escribirnos. Tu mensaje fue enviado a nuestro equipo y te responderemos en un plazo máximo de 15 días hábiles.</p>
          <button className="ct-reset" onClick={() => setSent(false)}>Enviar otro mensaje</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-card">
      <h2>Envíanos un mensaje</h2>
      <p style={{ margin: "0 0 28px", font: "400 0.875rem/1.5 var(--font-sans)", color: "var(--tt-gray-500)" }}>
        Los campos marcados con <span style={{ color: "var(--tt-red-500)" }}>*</span> son obligatorios.
      </p>

      {error && (
        <div className="rec-empty" role="alert" style={{ padding: "12px 16px", marginBottom: 16, color: "var(--tt-red-600)", background: "#fdecec", borderRadius: 10, textAlign: "left" }}>⚠️ {error}</div>
      )}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />

        <div className="ct-field">
          <label htmlFor="ct-nombre">Nombre completo <span style={{ color: "var(--tt-red-500)" }}>*</span></label>
          <input id="ct-nombre" className="ct-input" required name="nombre" placeholder="Tu nombre y apellido" />
        </div>

        <div className="ct-row2">
          <div className="ct-field">
            <label htmlFor="ct-correo">Correo electrónico <span style={{ color: "var(--tt-red-500)" }}>*</span></label>
            <input id="ct-correo" className="ct-input" required type="email" name="correo" placeholder="tucorreo@ejemplo.com" />
          </div>
          <div className="ct-field">
            <label htmlFor="ct-tel">Teléfono</label>
            <input id="ct-tel" className="ct-input" type="tel" name="telefono" placeholder="+(57) 300 000 0000" />
          </div>
        </div>

        <div className="ct-field">
          <label htmlFor="ct-msg">Mensaje <span style={{ color: "var(--tt-red-500)" }}>*</span></label>
          <textarea id="ct-msg" className="ct-input" required name="mensaje" rows={5} placeholder="Cuéntanos en qué podemos ayudarte…" />
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "400 0.875rem/1.5 var(--font-sans)", color: "var(--tt-gray-700)", cursor: "pointer" }}>
          <input required type="checkbox" name="autorizacion" value="Sí" style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--tt-blue-700)", flex: "none" }} />
          <span>Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de Tuterritorio.</span>
        </label>

        <button type="submit" className="ct-submit" disabled={sending}>
          {sending ? "Enviando…" : "Enviar mensaje"}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      </form>
    </div>
  );
}
