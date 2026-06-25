"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Splash from "@/components/layout/Splash";

/**
 * Formulario de inicio de sesión del panel. Se renderiza desde la ruta secreta
 * `/acceso/<ADMIN_PATH>` (validada en el servidor). No hay ruta `/admin` pública.
 */
export default function AdminLogin() {
  const { user, login, notify } = useAuth();
  const router = useRouter();
  const [booting, setBooting] = useState(true); // animación al entrar
  const [usr, setUsr] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const userRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!booting && !user) userRef.current?.focus();
  }, [booting, user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await login(usr, pass);
    if (res.ok) {
      notify("Inicio de Sesión Exitoso");
    } else {
      setBusy(false);
      setError(res.error || "No se pudo iniciar sesión");
    }
  }

  if (booting) return <Splash onFinish={() => setBooting(false)} />;
  if (user) return <Splash onFinish={() => router.replace("/")} />;

  return (
    <section className="admin-auth">
      <span className="admin-blob a" aria-hidden="true" />
      <span className="admin-blob b" aria-hidden="true" />
      <span className="admin-blob c" aria-hidden="true" />

      <div className="admin-auth-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="admin-logo" src="/assets/logo-imagotipo.png" alt="Tuterritorio" />
        <span className="admin-ribbon" />

        <h1 className="admin-welcome">¡Bienvenido a Tuterritorio!</h1>
        <p className="admin-sub">Panel de administración · Inicia sesión para continuar</p>
        <form className="admin-form" onSubmit={onSubmit}>
          <label className="fld">
            <span>Usuario</span>
            <input
              ref={userRef}
              type="text"
              value={usr}
              onChange={(e) => setUsr(e.target.value)}
              autoComplete="username"
              placeholder="Ingresar usuario"
              required
            />
          </label>
          <label className="fld">
            <span>Contraseña</span>
            <div className="fld-pass">
              <input
                type={showPass ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                placeholder="Ingresar contraseña"
                required
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><path d="m2 2 20 20" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={busy}>
            {busy ? "Verificando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}
