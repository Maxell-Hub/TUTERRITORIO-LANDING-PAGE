"use client";

import { useRef, useState } from "react";

const TIPOS = ["Petición", "Queja", "Reclamo", "Sugerencia", "Denuncia"];
const DOCS = ["Cédula de ciudadanía", "Cédula de extranjería", "NIT", "Pasaporte"];

/** Reglas de formato por tipo de documento. */
const DOC_RULES: Record<string, { mode: "num" | "alnum"; min: number; max: number; hint: string }> = {
  "Cédula de ciudadanía": { mode: "num", min: 6, max: 10, hint: "Entre 6 y 10 dígitos, sin puntos ni comas." },
  "Cédula de extranjería": { mode: "num", min: 6, max: 10, hint: "Entre 6 y 10 dígitos." },
  "NIT": { mode: "num", min: 9, max: 10, hint: "9 o 10 dígitos, sin dígito de verificación." },
  "Pasaporte": { mode: "alnum", min: 6, max: 12, hint: "Entre 6 y 12 caracteres (letras y números)." },
};

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NOMBRE_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ.]{1,}){1,}$/;

type Values = {
  tipo: string;
  nombre: string;
  tipoDocumento: string;
  documento: string;
  correo: string;
  telefono: string;
  direccion: string;
  asunto: string;
  descripcion: string;
  autorizacion: boolean;
};

const EMPTY: Values = {
  tipo: "", nombre: "", tipoDocumento: "", documento: "", correo: "",
  telefono: "", direccion: "", asunto: "", descripcion: "", autorizacion: false,
};

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Limita lo que el usuario puede escribir según el campo (estricto al teclear). */
function filterInput(name: keyof Values, value: string, tipoDoc: string): string {
  switch (name) {
    case "nombre":
      return value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.]/g, "");
    case "documento": {
      const mode = DOC_RULES[tipoDoc]?.mode ?? "num";
      return mode === "alnum"
        ? value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
        : value.replace(/\D/g, "");
    }
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
    case "tipo":
      return val ? "" : "Selecciona el tipo de solicitud.";
    case "nombre":
      if (!val) return "El nombre completo es obligatorio.";
      if (!NOMBRE_RE.test(val as string)) return "Ingresa nombres y apellidos (solo letras).";
      return "";
    case "tipoDocumento":
      return val ? "" : "Selecciona el tipo de documento.";
    case "documento": {
      if (!v.tipoDocumento) return "Primero selecciona el tipo de documento.";
      if (!val) return "El número de documento es obligatorio.";
      const rule = DOC_RULES[v.tipoDocumento];
      const s = val as string;
      const okChars = rule.mode === "num" ? /^\d+$/.test(s) : /^[A-Za-z0-9]+$/.test(s);
      if (!okChars) return rule.mode === "num" ? "Solo se permiten dígitos." : "Solo letras y números.";
      if (s.length < rule.min || s.length > rule.max) return rule.hint;
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
    case "direccion":
      if (!val) return ""; // opcional
      if ((val as string).length < 5) return "Ingresa una dirección válida.";
      return "";
    case "asunto":
      if (!val) return "El asunto es obligatorio.";
      if ((val as string).length < 5) return "El asunto debe tener al menos 5 caracteres.";
      return "";
    case "descripcion":
      if (!val) return "La descripción es obligatoria.";
      if ((val as string).length < 20) return "Describe tu solicitud con al menos 20 caracteres.";
      return "";
    case "autorizacion":
      return v.autorizacion ? "" : "Debes autorizar el tratamiento de tus datos.";
    default:
      return "";
  }
}

const FIELD_ORDER: (keyof Values)[] = [
  "tipo", "nombre", "tipoDocumento", "documento", "correo", "telefono",
  "direccion", "asunto", "descripcion", "autorizacion",
];

export default function PqrsdForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeyRef = useRef<HTMLInputElement>(null);

  function setField(name: keyof Values, raw: string) {
    const value = filterInput(name, raw, name === "documento" ? values.tipoDocumento : "");
    const next = { ...values, [name]: value };
    // Si cambia el tipo de documento, re-filtra el número ya escrito.
    if (name === "tipoDocumento") {
      next.documento = filterInput("documento", values.documento, value);
    }
    setValues(next);
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validateField(name, next) }));
    if (name === "tipoDocumento" && touched.documento)
      setErrors((e) => ({ ...e, documento: validateField("documento", next) }));
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
      const res = await fetch("/api/pqrsd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, autorizacion: "Sí" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "No se pudo radicar. Intenta de nuevo.");
      setOk(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    setOk(false);
  }

  // ---- Pantalla de éxito (estilo Contáctenos) ----
  if (ok) {
    return (
      <div className="pq-form">
        <div className="ct-success">
          <div className="ct-success-ring">
            <span className="ring" />
            <span className="disc">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
          </div>
          <h3>¡PQRSD radicada!</h3>
          <p>
            Tu solicitud fue enviada correctamente a nuestro equipo. Recibirás respuesta al correo
            registrado dentro de los términos de ley.
          </p>
          <button className="ct-reset" onClick={resetForm}>Radicar otra solicitud</button>
        </div>
      </div>
    );
  }

  const docHint = DOC_RULES[values.tipoDocumento]?.hint ?? "Sin puntos ni comas.";

  return (
    <form className="pq-form" onSubmit={onSubmit} noValidate>
      {/* honeypot anti-bot */}
      <input ref={honeyRef} type="text" name="_honey" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

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
        <div className="pq-radios" data-field="tipo" tabIndex={-1}>
          {TIPOS.map((t) => (
            <label className="pq-chip" key={t}>
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={values.tipo === t}
                onChange={() => { setField("tipo", t); setTouched((s) => ({ ...s, tipo: true })); setErrors((e) => ({ ...e, tipo: "" })); }}
              /> {t}
            </label>
          ))}
        </div>
        {touched.tipo && errors.tipo && <div className="pq-error">{errors.tipo}</div>}
      </fieldset>

      <div className="pq-grid">
        <label className="pq-field">
          <span className="pq-label">Nombre completo <span className="req">*</span></span>
          <input
            className={`pq-input${touched.nombre && errors.nombre ? " is-invalid" : ""}`}
            type="text" name="nombre" data-field="nombre" placeholder="Nombres y apellidos"
            value={values.nombre} onChange={(e) => setField("nombre", e.target.value)} onBlur={() => onBlur("nombre")}
            autoComplete="name"
          />
          {touched.nombre && errors.nombre && <span className="pq-error">{errors.nombre}</span>}
        </label>

        <label className="pq-field">
          <span className="pq-label">Tipo de documento <span className="req">*</span></span>
          <select
            className={`pq-input${touched.tipoDocumento && errors.tipoDocumento ? " is-invalid" : ""}`}
            name="tipoDocumento" data-field="tipoDocumento"
            value={values.tipoDocumento} onChange={(e) => setField("tipoDocumento", e.target.value)} onBlur={() => onBlur("tipoDocumento")}
          >
            <option value="" disabled>Selecciona…</option>
            {DOCS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {touched.tipoDocumento && errors.tipoDocumento && <span className="pq-error">{errors.tipoDocumento}</span>}
        </label>

        <label className="pq-field">
          <span className="pq-label">Número de documento <span className="req">*</span></span>
          <input
            className={`pq-input${touched.documento && errors.documento ? " is-invalid" : ""}`}
            type="text" name="documento" data-field="documento"
            inputMode={DOC_RULES[values.tipoDocumento]?.mode === "alnum" ? "text" : "numeric"}
            placeholder={docHint}
            value={values.documento} onChange={(e) => setField("documento", e.target.value)} onBlur={() => onBlur("documento")}
          />
          {touched.documento && errors.documento
            ? <span className="pq-error">{errors.documento}</span>
            : <span className="pq-hint">{docHint}</span>}
        </label>

        <label className="pq-field">
          <span className="pq-label">Correo electrónico <span className="req">*</span></span>
          <input
            className={`pq-input${touched.correo && errors.correo ? " is-invalid" : ""}`}
            type="email" name="correo" data-field="correo" placeholder="tucorreo@ejemplo.com"
            value={values.correo} onChange={(e) => setField("correo", e.target.value)} onBlur={() => onBlur("correo")}
            autoComplete="email"
          />
          {touched.correo && errors.correo && <span className="pq-error">{errors.correo}</span>}
        </label>

        <label className="pq-field">
          <span className="pq-label">Teléfono</span>
          <input
            className={`pq-input${touched.telefono && errors.telefono ? " is-invalid" : ""}`}
            type="tel" name="telefono" data-field="telefono" inputMode="tel" placeholder="Celular (10 dígitos) o fijo (7)"
            value={values.telefono} onChange={(e) => setField("telefono", e.target.value)} onBlur={() => onBlur("telefono")}
          />
          {touched.telefono && errors.telefono && <span className="pq-error">{errors.telefono}</span>}
        </label>

        <label className="pq-field">
          <span className="pq-label">Dirección</span>
          <input
            className={`pq-input${touched.direccion && errors.direccion ? " is-invalid" : ""}`}
            type="text" name="direccion" data-field="direccion" placeholder="Dirección de notificación"
            value={values.direccion} onChange={(e) => setField("direccion", e.target.value)} onBlur={() => onBlur("direccion")}
            autoComplete="street-address"
          />
          {touched.direccion && errors.direccion && <span className="pq-error">{errors.direccion}</span>}
        </label>
      </div>

      <label className="pq-field" style={{ marginTop: 18 }}>
        <span className="pq-label">Asunto <span className="req">*</span></span>
        <input
          className={`pq-input${touched.asunto && errors.asunto ? " is-invalid" : ""}`}
          type="text" name="asunto" data-field="asunto" placeholder="Resumen breve de tu solicitud"
          value={values.asunto} onChange={(e) => setField("asunto", e.target.value)} onBlur={() => onBlur("asunto")}
        />
        {touched.asunto && errors.asunto && <span className="pq-error">{errors.asunto}</span>}
      </label>

      <label className="pq-field" style={{ marginTop: 18 }}>
        <span className="pq-label">Descripción de la solicitud <span className="req">*</span></span>
        <textarea
          className={`pq-input${touched.descripcion && errors.descripcion ? " is-invalid" : ""}`}
          name="descripcion" data-field="descripcion" rows={6}
          placeholder="Describe con el mayor detalle posible tu petición, queja, reclamo, sugerencia o denuncia."
          style={{ resize: "vertical", minHeight: 140 }}
          value={values.descripcion} onChange={(e) => setField("descripcion", e.target.value)} onBlur={() => onBlur("descripcion")}
        />
        {touched.descripcion && errors.descripcion && <span className="pq-error">{errors.descripcion}</span>}
      </label>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 11, marginTop: 22, font: "var(--fw-regular) var(--fs-sm)/1.5 var(--font-sans)", color: "var(--tt-gray-700)", cursor: "pointer" }}>
        <input
          type="checkbox" name="autorizacion" data-field="autorizacion" checked={values.autorizacion}
          onChange={(e) => { setValues((v) => ({ ...v, autorizacion: e.target.checked })); setTouched((t) => ({ ...t, autorizacion: true })); setErrors((er) => ({ ...er, autorizacion: e.target.checked ? "" : "Debes autorizar el tratamiento de tus datos." })); }}
          style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--tt-green-600)", flex: "none" }}
        />
        <span>Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de Tuterritorio y la Ley 1581 de 2012. <span className="req">*</span></span>
      </label>
      {touched.autorizacion && errors.autorizacion && <div className="pq-error">{errors.autorizacion}</div>}

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
