"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Splash from "@/components/layout/Splash";

export default function AdminPage() {
  const { user, login, notify } = useAuth();
  const router = useRouter();
  const [booting, setBooting] = useState(true); // animación al entrar a /admin
  const [usr, setUsr] = useState("");
  const [pass, setPass] = useState("");
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
      // `user` pasa a estar definido → se muestra el splash y luego entra al sitio.
      notify("Inicio de Sesión Exitoso");
    } else {
      setBusy(false);
      setError(res.error || "No se pudo iniciar sesión");
    }
  }

  // Splash al entrar a /admin.
  if (booting) return <Splash onFinish={() => setBooting(false)} />;
  // Con sesión: splash de "entrando" y luego al sitio para editar.
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
      </div>
    </section>
  );
}
