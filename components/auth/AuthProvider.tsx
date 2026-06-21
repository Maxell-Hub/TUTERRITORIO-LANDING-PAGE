"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthCtx = {
  user: string | null;
  loading: boolean;
  login: (user: string, pass: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  notify: (message: string, tone?: "ok" | "error") => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

type Toast = { id: number; message: string; tone: "ok" | "error" };

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Carga la sesión actual al montar.
  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setUser(d?.user ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const notify = useCallback((message: string, tone: "ok" | "error" = "ok") => {
    // id incremental sin Date.now/Math.random para mantenerlo simple.
    setToasts((prev) => {
      const id = (prev[prev.length - 1]?.id ?? 0) + 1;
      const next = [...prev, { id, message, tone }];
      // Auto-remoción tras 3.2s.
      setTimeout(() => {
        setToasts((cur) => cur.filter((t) => t.id !== id));
      }, 3200);
      return next;
    });
  }, []);

  const login = useCallback(
    async (u: string, p: string) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: u, pass: p }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data?.error || "No se pudo iniciar sesión" };
        }
        setUser(data.user);
        return { ok: true };
      } catch {
        return { ok: false, error: "Error de conexión" };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setUser(null);
    notify("Sesión cerrada");
  }, [notify]);

  return (
    <Ctx.Provider value={{ user, loading, login, logout, notify }}>
      {children}
      <div className="tt-toast-wrap" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`tt-toast ${t.tone}`} role="status">
            <span className="tt-toast-ic" aria-hidden="true">
              {t.tone === "ok" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              )}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
