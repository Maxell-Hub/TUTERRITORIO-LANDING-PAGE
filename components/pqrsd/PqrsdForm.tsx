"use client";

import { useRef, useState } from "react";
import PrivacyNotice from "@/components/legal/PrivacyNotice";

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

/* ---- Anexos (documentos de soporte) ---- */
const MAX_FILES = 3;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // 4 MB en total (límite del servidor)
const FILE_EXTS = ["pdf", "jpg", "jpeg", "png", "webp", "doc", "docx"];
const FILE_ACCEPT = FILE_EXTS.map((e) => `.${e}`).join(",");

const fmtSize = (b: number) =>
  b >= 1024 * 1024 ? `${(b / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

const extOf = (name: string) => (name.split(".").pop() || "").toLowerCase();

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
  const [archivos, setArchivos] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeyRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setFileError(null);
    let next = [...archivos];
    for (const f of Array.from(list)) {
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue; // duplicado
      if (!FILE_EXTS.includes(extOf(f.name))) {
        setFileError(`"${f.name}" no está permitido. Formatos: PDF, JPG, PNG, WEBP, DOC y DOCX.`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        setFileError(`Puedes adjuntar máximo ${MAX_FILES} archivos.`);
        break;
      }
      next = [...next, f];
    }
    const total = next.reduce((s, f) => s + f.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      setFileError(`Los anexos no pueden superar ${fmtSize(MAX_TOTAL_BYTES)} en total.`);
      return;
    }
    setArchivos(next);
    if (fileRef.current) fileRef.current.value = ""; // permite volver a elegir el mismo archivo
  }

  function removeFile(i: number) {
    setArchivos((a) => a.filter((_, j) => j !== i));
    setFileError(null);
  }

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
      // Se envía como multipart/form-data para incluir los anexos.
      const fd = new FormData();
      for (const [k, v] of Object.entries(values)) fd.append(k, String(v));
      fd.set("autorizacion", "Sí");
      // Prueba del consentimiento: fecha y hora exactas de la autorización (Ley 1581/2012).
      fd.set("autorizacionFecha", new Date().toISOString());
      for (const f of archivos) fd.append("archivos", f, f.name);
      const res = await fetch("/api/pqrsd", { method: "POST", body: fd });
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
    setArchivos([]);
    setFileError(null);
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
            type="text" name="nombre" data-field="nombre" placeholder="Ej: Juan Carlos Pérez Gómez"
            value={values.nombre} onChange={(e) => setField("nombre", e.target.value)} onBlur={() => onBlur("nombre")}
            autoComplete="name"
          />
          {touched.nombre && errors.nombre
            ? <span className="pq-error">{errors.nombre}</span>
            : <span className="pq-hint">Solo letras. Nombres y apellidos completos.</span>}
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
          {touched.tipoDocumento && errors.tipoDocumento
            ? <span className="pq-error">{errors.tipoDocumento}</span>
            : <span className="pq-hint">Selecciona una opción de la lista.</span>}
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
            type="email" name="correo" data-field="correo" placeholder="nombre@dominio.com"
            value={values.correo} onChange={(e) => setField("correo", e.target.value)} onBlur={() => onBlur("correo")}
            autoComplete="email"
          />
          {touched.correo && errors.correo
            ? <span className="pq-error">{errors.correo}</span>
            : <span className="pq-hint">Formato: nombre@dominio.com</span>}
        </label>

        <label className="pq-field">
          <span className="pq-label">Teléfono</span>
          <input
            className={`pq-input${touched.telefono && errors.telefono ? " is-invalid" : ""}`}
            type="tel" name="telefono" data-field="telefono" inputMode="tel" placeholder="Ej: 3001234567"
            value={values.telefono} onChange={(e) => setField("telefono", e.target.value)} onBlur={() => onBlur("telefono")}
          />
          {touched.telefono && errors.telefono
            ? <span className="pq-error">{errors.telefono}</span>
            : <span className="pq-hint">Celular: 10 dígitos · Fijo: 7 dígitos.</span>}
        </label>

        <label className="pq-field">
          <span className="pq-label">Dirección</span>
          <input
            className={`pq-input${touched.direccion && errors.direccion ? " is-invalid" : ""}`}
            type="text" name="direccion" data-field="direccion" placeholder="Ej: Calle 16 #9-48"
            value={values.direccion} onChange={(e) => setField("direccion", e.target.value)} onBlur={() => onBlur("direccion")}
            autoComplete="street-address"
          />
          {touched.direccion && errors.direccion
            ? <span className="pq-error">{errors.direccion}</span>
            : <span className="pq-hint">Dirección de notificación (opcional).</span>}
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
        {touched.descripcion && errors.descripcion
          ? <span className="pq-error">{errors.descripcion}</span>
          : <span className="pq-hint">Mínimo 20 caracteres.</span>}
      </label>

      {/* Anexos: documentos de soporte de la solicitud */}
      <div className="pq-field" style={{ marginTop: 18 }}>
        <span className="pq-label">Documentos y anexos <span style={{ fontWeight: 400, color: "var(--tt-gray-500)" }}>(opcional)</span></span>
        <input
          ref={fileRef}
          id="pq-archivos"
          type="file"
          multiple
          accept={FILE_ACCEPT}
          className="sr-only pq-file-input"
          onChange={(e) => addFiles(e.target.files)}
        />
        <label htmlFor="pq-archivos" className="pq-drop">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
          </svg>
          <span><b>Adjunta tus documentos</b> — haz clic para seleccionarlos</span>
          <span className="pq-drop-hint">Hasta {MAX_FILES} archivos ({fmtSize(MAX_TOTAL_BYTES)} en total) · PDF, JPG, PNG, WEBP, DOC, DOCX</span>
        </label>
        {archivos.length > 0 && (
          <ul className="pq-filelist" aria-label="Archivos adjuntos">
            {archivos.map((f, i) => (
              <li key={`${f.name}-${f.size}`} className="pq-fileitem">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
                </svg>
                <span className="pq-filename">{f.name}</span>
                <span className="pq-filesize">{fmtSize(f.size)}</span>
                <button type="button" className="pq-fileremove" aria-label={`Quitar ${f.name}`} onClick={() => removeFile(i)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        {fileError
          ? <span className="pq-error" role="alert">{fileError}</span>
          : <span className="pq-hint">Adjunta soportes como la cédula, escrituras, certificados o fotos relacionadas con tu solicitud.</span>}
      </div>

      <div style={{ marginTop: 22 }}><PrivacyNotice /></div>

      <label className="consent-label" style={{ marginTop: 14 }}>
        <input
          type="checkbox" name="autorizacion" data-field="autorizacion" checked={values.autorizacion} required
          aria-invalid={touched.autorizacion && !!errors.autorizacion ? true : undefined}
          aria-describedby={touched.autorizacion && errors.autorizacion ? "pq-autorizacion-msg" : undefined}
          onChange={(e) => { setValues((v) => ({ ...v, autorizacion: e.target.checked })); setTouched((t) => ({ ...t, autorizacion: true })); setErrors((er) => ({ ...er, autorizacion: e.target.checked ? "" : "Debes autorizar el tratamiento de tus datos." })); }}
        />
        <span>
          Autorizo de manera previa, expresa e informada el tratamiento de mis datos personales
          conforme a la{" "}
          <a href="/politica-tratamiento-datos" target="_blank" rel="noopener">Política de Tratamiento de Datos Personales</a>{" "}
          de Tuterritorio y a la Ley 1581 de 2012. <span className="req">*</span>
        </span>
      </label>
      {touched.autorizacion && errors.autorizacion && <div id="pq-autorizacion-msg" className="pq-error" role="alert">{errors.autorizacion}</div>}

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
