"use client";

import { useRef, useState } from "react";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NOMBRE_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ.]{1,}){1,}$/;

type Values = {
  nombre: string;
  cedula: string;
  correo: string;
  telefono: string;
  mensaje: string;
  autorizacion: boolean;
};

const EMPTY: Values = { nombre: "", cedula: "", correo: "", telefono: "", mensaje: "", autorizacion: false };

const FIELD_ORDER: (keyof Values)[] = ["nombre", "cedula", "correo", "telefono", "mensaje", "autorizacion"];

/** Limita lo que el usuario puede escribir según el campo (estricto al teclear). */
function filterInput(name: keyof Values, value: string): string {
  switch (name) {
    case "nombre":
      return value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.]/g, "");
    case "cedula":
      return value.replace(/\D/g, "");
    case "telefono":
      return value.replace(/[^0-9+()\-\s]/g, "");
    default:
      return value;
  }
}

/** Valida un campo y devuelve el mensaje de error ("" si es válido). */
function validateField(name: keyof Values, v: Values): string {
  const val = typeof v[name] === "string" ? (v[name] as string).trim() : v[name];

  switch (name) {
    case "nombre":
      if (!val) return "El nombre completo es obligatorio.";
      if (!NOMBRE_RE.test(val as string)) return "Ingresa nombres y apellidos (solo letras).";
      return "";
    case "cedula": {
      if (!val) return "La cédula es obligatoria.";
      const s = val as string;
      if (!/^\d+$/.test(s)) return "Solo se permiten dígitos.";
      if (s.length < 6 || s.length > 10) return "Entre 6 y 10 dígitos, sin puntos ni comas.";
      return "";
    }
    case "correo":
      if (!val) return "El correo electrónico es obligatorio.";
      if (!EMAIL_RE.test(val as string)) return "Ingresa un correo válido (ej: nombre@dominio.com).";
      return "";
    case "telefono": {
      if (!val) return ""; // opcional
      const digits = (val as string).replace(/\D/g, "");
      if (digits.length !== 7 && digits.length !== 10)
        return "Teléfono inválido: 7 dígitos (fijo) o 10 (celular).";
      return "";
    }
    case "mensaje":
      if (!val) return "El mensaje es obligatorio.";
      if ((val as string).length < 20) return "Describe tu mensaje con al menos 20 caracteres.";
      return "";
    case "autorizacion":
      return v.autorizacion ? "" : "Debes autorizar el tratamiento de tus datos.";
    default:
      return "";
  }
}

export default function ContactoForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeyRef = useRef<HTMLInputElement>(null);

  function setField(name: keyof Values, raw: string) {
    const value = filterInput(name, raw);
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validateField(name, next) }));
  }

  function onBlur(name: keyof Values) {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validateField(name, values) }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Honeypot anti-bot.
    if (honeyRef.current?.value) return;

    // Validación completa.
    const newErrors: Partial<Record<keyof Values, string>> = {};
    for (const f of FIELD_ORDER) {
      const msg = validateField(f, values);
      if (msg) newErrors[f] = msg;
    }
    setErrors(newErrors);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));

    const firstBad = FIELD_ORDER.find((f) => newErrors[f]);
    if (firstBad) {
      const el = document.querySelector<HTMLElement>(`[data-field="${firstBad}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus?.();
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, autorizacion: "Sí" }),
      });
      if (!res.ok) {
        let msg = "No se pudo enviar el mensaje. Intenta de nuevo.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {
          /* respuesta sin JSON */
        }
        throw new Error(msg);
      }
      setSent(true);
      const sec = document.getElementById("formulario");
      if (sec) window.scrollTo({ top: Math.max(0, sec.offsetTop - 90), behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setSent(false);
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
          <button className="ct-reset" onClick={resetForm}>Enviar otro mensaje</button>
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

      <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <input ref={honeyRef} type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />

        <div className="ct-field">
          <label htmlFor="ct-nombre">Nombre completo <span style={{ color: "var(--tt-red-500)" }}>*</span></label>
          <input
            id="ct-nombre" className={`ct-input${touched.nombre && errors.nombre ? " is-invalid" : ""}`}
            name="nombre" data-field="nombre" placeholder="Ej: Juan Carlos Pérez Gómez" autoComplete="name"
            value={values.nombre} onChange={(e) => setField("nombre", e.target.value)} onBlur={() => onBlur("nombre")}
          />
          {touched.nombre && errors.nombre
            ? <span className="pq-error">{errors.nombre}</span>
            : <span className="pq-hint">Solo letras. Nombres y apellidos completos.</span>}
        </div>

        <div className="ct-row2">
          <div className="ct-field">
            <label htmlFor="ct-cedula">Cédula <span style={{ color: "var(--tt-red-500)" }}>*</span></label>
            <input
              id="ct-cedula" className={`ct-input${touched.cedula && errors.cedula ? " is-invalid" : ""}`}
              name="cedula" data-field="cedula" inputMode="numeric" placeholder="Tu número de cédula"
              value={values.cedula} onChange={(e) => setField("cedula", e.target.value)} onBlur={() => onBlur("cedula")}
            />
            {touched.cedula && errors.cedula
              ? <span className="pq-error">{errors.cedula}</span>
              : <span className="pq-hint">Entre 6 y 10 dígitos, sin puntos ni comas.</span>}
          </div>
          <div className="ct-field">
            <label htmlFor="ct-correo">Correo electrónico <span style={{ color: "var(--tt-red-500)" }}>*</span></label>
            <input
              id="ct-correo" className={`ct-input${touched.correo && errors.correo ? " is-invalid" : ""}`}
              type="email" name="correo" data-field="correo" placeholder="nombre@dominio.com" autoComplete="email"
              value={values.correo} onChange={(e) => setField("correo", e.target.value)} onBlur={() => onBlur("correo")}
            />
            {touched.correo && errors.correo
              ? <span className="pq-error">{errors.correo}</span>
              : <span className="pq-hint">Formato: nombre@dominio.com</span>}
          </div>
        </div>

        <div className="ct-field">
          <label htmlFor="ct-tel">Teléfono</label>
          <input
            id="ct-tel" className={`ct-input${touched.telefono && errors.telefono ? " is-invalid" : ""}`}
            type="tel" name="telefono" data-field="telefono" inputMode="tel" placeholder="300 000 0000"
            value={values.telefono} onChange={(e) => setField("telefono", e.target.value)} onBlur={() => onBlur("telefono")}
          />
          {touched.telefono && errors.telefono
            ? <span className="pq-error">{errors.telefono}</span>
            : <span className="pq-hint">Celular: 10 dígitos · Fijo: 7 dígitos.</span>}
        </div>

        <div className="ct-field">
          <label htmlFor="ct-msg">Mensaje <span style={{ color: "var(--tt-red-500)" }}>*</span></label>
          <textarea
            id="ct-msg" className={`ct-input${touched.mensaje && errors.mensaje ? " is-invalid" : ""}`}
            name="mensaje" data-field="mensaje" rows={5} placeholder="Cuéntanos en qué podemos ayudarte…"
            value={values.mensaje} onChange={(e) => setField("mensaje", e.target.value)} onBlur={() => onBlur("mensaje")}
          />
          {touched.mensaje && errors.mensaje
            ? <span className="pq-error">{errors.mensaje}</span>
            : <span className="pq-hint">Mínimo 20 caracteres.</span>}
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "400 0.875rem/1.5 var(--font-sans)", color: "var(--tt-gray-700)", cursor: "pointer" }}>
          <input
            type="checkbox" name="autorizacion" data-field="autorizacion" checked={values.autorizacion}
            onChange={(e) => { setValues((v) => ({ ...v, autorizacion: e.target.checked })); setTouched((t) => ({ ...t, autorizacion: true })); setErrors((er) => ({ ...er, autorizacion: e.target.checked ? "" : "Debes autorizar el tratamiento de tus datos." })); }}
            style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--tt-blue-700)", flex: "none" }}
          />
          <span>Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de Tuterritorio. <span style={{ color: "var(--tt-red-500)" }}>*</span></span>
        </label>
        {touched.autorizacion && errors.autorizacion && <span className="pq-error">{errors.autorizacion}</span>}

        <button type="submit" className="ct-submit" disabled={sending}>
          {sending ? "Enviando…" : "Enviar mensaje"}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      </form>
    </div>
  );
}
