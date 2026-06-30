"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// URL del Google Form de "Cuéntanos tu experiencia". Reemplázala por la real.
const FEEDBACK_URL = "https://forms.gle/REEMPLAZAR-CON-TU-FORMULARIO";

function readLang(): "es" | "en" {
  if (typeof document === "undefined") return "es";
  const m = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
  return m && m[1] === "en" ? "en" : "es";
}

export default function FloatingActions() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [langSpin, setLangSpin] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
    setLang(readLang());
  }, []);

  // Si el usuario no ha elegido tema manualmente, sigue el modo del sistema en vivo.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem("tt-theme")) return; // respeta la elección manual
      } catch { /* ignore */ }
      document.documentElement.classList.toggle("dark", e.matches);
      setDark(e.matches);
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Al navegar (Next cambia de página sin recargar), el contenido nuevo aparece
  // en español hasta que Google lo retraduce. Reaplicamos la traducción para que
  // la página se mantenga completamente traducida sin volver al español.
  useEffect(() => {
    if (readLang() !== "en") return;
    let tries = 0;
    const id = window.setInterval(() => {
      const sel = document.querySelector("select.goog-te-combo") as HTMLSelectElement | null;
      if (sel) {
        if (sel.value !== "en") {
          sel.value = "en";
          sel.dispatchEvent(new Event("change"));
        }
        window.clearInterval(id);
      }
      if (++tries > 25) window.clearInterval(id);
    }, 120);
    return () => window.clearInterval(id);
  }, [pathname]);

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("tt-theme", isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
    setDark(isDark);
  }

  function toggleLang() {
    if (langSpin) return;
    const next = lang === "es" ? "en" : "es";
    const value = `/es/${next}`;
    // Cookie que lee el widget de Google Translate (con y sin dominio).
    document.cookie = `googtrans=${value};path=/`;
    const host = window.location.hostname;
    document.cookie = `googtrans=${value};path=/;domain=.${host}`;
    // Deja ver el giro del ícono antes de recargar.
    setLangSpin(true);
    window.setTimeout(() => window.location.reload(), 340);
  }

  return (
    <div className="fab-stack" aria-label="Acciones rápidas">
      {/* Idioma */}
      <button
        type="button"
        className="fab fab-lang"
        onClick={toggleLang}
        aria-label={lang === "es" ? "Cambiar idioma a inglés" : "Cambiar idioma a español"}
        title={lang === "es" ? "English" : "Español"}
      >
        <svg className={`fab-ic${langSpin ? " spin" : ""}`} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        <span className="fab-badge">{mounted ? (lang === "es" ? "EN" : "ES") : ""}</span>
        <span className="fab-tip">{lang === "es" ? "English" : "Español"}</span>
      </button>

      {/* Tema claro / oscuro */}
      <button
        type="button"
        className="fab fab-theme"
        onClick={toggleTheme}
        aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
        aria-pressed={dark}
        title={dark ? "Modo claro" : "Modo oscuro"}
      >
        {mounted && dark ? (
          <svg key="sun" className="fab-ic-swap" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        ) : (
          <svg key="moon" className="fab-ic-swap" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        )}
        <span className="fab-tip">{mounted && dark ? "Modo claro" : "Modo oscuro"}</span>
      </button>

      {/* Cuéntanos tu experiencia (Google Form) */}
      <a
        className="fab fab-feedback"
        href={FEEDBACK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cuéntanos tu experiencia (abre un formulario externo)"
        title="Cuéntanos tu experiencia"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></svg>
        <span className="fab-tip">Cuéntanos tu experiencia</span>
      </a>
    </div>
  );
}
