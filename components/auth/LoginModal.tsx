"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { login, notify } = useAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const userRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await login(user, pass);
    setBusy(false);
    if (res.ok) {
      notify("Inicio de Sesión Exitoso");
      onClose();
    } else {
      setError(res.error || "No se pudo iniciar sesión");
    }
  }

  return (
    <div className="tt-modal-overlay" onClick={onClose}>
      <div
        className="tt-modal login-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-head">
          <div>
            <h2 id="login-title">Iniciar sesión</h2>
            <p>Acceso para administradores de Tuterritorio</p>
          </div>
          <button className="tt-modal-close" aria-label="Cerrar" onClick={onClose}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="fld">
            <span>Usuario</span>
            <input
              ref={userRef}
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              placeholder="Ingresar usuario"
              required
            />
          </label>
          <label className="fld">
            <span>Contraseña</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              placeholder="Ingresar contraseña"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={busy}>
            {busy ? "Verificando…" : "Ingresar"}
          </button>
          <p className="login-note">
            El registro de administrador ya está creado. Si olvidaste tus datos,
            contacta al área de Sistemas.
          </p>
        </form>
      </div>
    </div>
  );
}
