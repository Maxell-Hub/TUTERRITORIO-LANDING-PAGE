"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AdminPage() {
  const { user, loading, login, logout, notify } = useAuth();
  const [usr, setUsr] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const userRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) userRef.current?.focus();
  }, [loading, user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await login(usr, pass);
    setBusy(false);
    if (res.ok) {
      notify("Inicio de Sesión Exitoso");
    } else {
      setError(res.error || "No se pudo iniciar sesión");
    }
  }

  return (
    <section className="admin-auth">
      <div className="admin-auth-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="admin-logo" src="/assets/logo-imagotipo.png" alt="Tuterritorio" />
        <span className="admin-ribbon" />

        {user ? (
          <>
            <h1 className="admin-welcome">¡Hola, {user}!</h1>
            <p className="admin-sub">Sesión iniciada como administrador</p>
            <div className="admin-panel">
              <p className="admin-help">
                Entra a cualquier sección y verás los botones para agregar o editar
                contenido directamente sobre la página.
              </p>
              <div className="admin-links">
                <Link className="adm-btn" href="/noticias">Gestionar Noticias</Link>
                <Link className="adm-btn ghost" href="/recursos/normativas">Normativas</Link>
                <Link className="adm-btn ghost" href="/recursos/glosario">Glosario</Link>
                <Link className="adm-btn ghost" href="/">Ir al inicio</Link>
              </div>
              <button type="button" className="adm-btn danger" onClick={() => logout()}>
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <>
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
            </form>
          </>
        )}
      </div>
    </section>
  );
}
