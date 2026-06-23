"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Header institucional global (3 franjas: gov.co + marca + nav).
 * - El buscador SOLO aparece en la página de Inicio (requisito).
 * - El menú usa scroll-spy en Inicio. Cuando integremos las demás secciones,
 *   estos `href` pasarán a rutas reales (/nosotros, /servicios, ...).
 */

type NavItem = {
  label: string;
  href: string;
  target?: string; // ancla de sección para scroll-spy en Inicio
  match?: string; // prefijo de ruta para marcar activo fuera de Inicio
  drop?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Inicio", href: "/", target: "#top" },
  {
    label: "Nosotros",
    href: "/nosotros",
    target: "#visor",
    match: "/nosotros",
    drop: [
      { label: "Acerca de la Oficina", href: "/nosotros" },
      { label: "Nuestro Equipo", href: "/nosotros/equipo" },
    ],
  },
  { label: "Servicios", href: "/servicios", target: "#tramites", match: "/servicios" },
  {
    label: "Recursos",
    href: "/recursos/normativas",
    match: "/recursos",
    drop: [
      { label: "Normativas", href: "/recursos/normativas" },
      { label: "Glosario catastral", href: "/recursos/glosario" },
    ],
  },
  { label: "Noticias", href: "/noticias", match: "/noticias" },
  { label: "Contacto", href: "/contactos", match: "/contactos" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [navH, setNavH] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Cuando el "sentinel" (justo encima del menú) sale por arriba de la pantalla,
  // el menú pasa a fijo arriba. Usamos IntersectionObserver (sin jank de scroll).
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (navRef.current) setNavH(navRef.current.offsetHeight);
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), {
      threshold: 0,
    });
    io.observe(sentinel);
    const onResize = () => navRef.current && setNavH(navRef.current.offsetHeight);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Marca activo según la página actual: en Inicio siempre "Inicio";
  // en las demás, por prefijo de ruta.
  const isActive = (item: NavItem) =>
    isHome ? item.href === "/" : !!item.match && pathname.startsWith(item.match);

  // Cierra el menú móvil al cambiar de ruta.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Bloquea el scroll del body y permite cerrar con Escape mientras el menú está abierto.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header id="top">
      {/* gov.co top bar */}
      <div className="govco-bar">
        <div className="govco-bar-row">
          <a href="https://www.gov.co" aria-label="Portal del Estado Colombiano gov.co" style={{ display: "inline-flex", alignItems: "center" }}>
            <img src="/assets/govco-white.png" alt="gov.co" style={{ height: 32, display: "block" }} />
          </a>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span className="gc-welcome">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" />
                </svg>
                Bienvenido, {user}
              </span>
              <span style={{ width: 1, height: 18, background: "rgba(255,255,255,.45)" }} />
              <button type="button" className="gc-auth gc-auth-btn" onClick={() => logout()}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>

      {/* Barra unificada: logos (izq) · menú (centro) · buscador (der). Se fija al hacer scroll. */}
      <div ref={sentinelRef} aria-hidden="true" className="mainnav-sentinel" />
      <nav ref={navRef} className={`mainnav${stuck ? " is-stuck" : ""}`} aria-label="Navegación principal">
        <div className="mainnav-row">
          {/* Logos (izquierda) */}
          <div className="brand-logos">
            <a href="/" aria-label="Ir al inicio" style={{ display: "inline-flex" }}>
              <img src="/assets/logo-tuterritorio-v.png" alt="Tuterritorio" style={{ height: 66, width: "auto", objectFit: "contain", display: "block" }} />
            </a>
            <span className="brand-sep" />
            <a
              href="https://www.valledupar-cesar.gov.co/micro-site/8529E318-DCA9-F011-BFB4-08BFB81D5CA8/7839157F-F4DC-F011-AB1D-C45AB1C9846A"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Alcaldía de Valledupar — Catastro (abre en una pestaña nueva)"
              style={{ display: "inline-flex" }}
            >
              <img src="/assets/logo-catastro-vpar.png" alt="Alcaldía de Valledupar — Catastro" style={{ height: 56, width: 136, objectFit: "cover", display: "block", marginBottom: 12 }} />
            </a>
          </div>

          {/* Menú de navegación (centro) */}
          <div className="mainnav-links">
            {NAV.map((item) =>
              item.drop ? (
                <div className="mn-item" key={item.label}>
                  <a
                    href={item.href}
                    className={`mn-link${isActive(item) ? " on" : ""}`}
                  >
                    {item.label}
                    <svg className="mn-caret" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </a>
                  <div className="mn-drop">
                    {item.drop.map((d) => (
                      <a href={d.href} key={d.label}>{d.label}</a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`mn-link${isActive(item) ? " on" : ""}`}
                  aria-current={isActive(item) ? "page" : undefined}
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Buscador + hamburguesa (derecha) */}
          <div className="mainnav-actions">
            <SearchBar />
            <button
              type="button"
              className="nav-burger"
              aria-label="Abrir menú de navegación"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>
      {/* Espaciador: ocupa el alto de la barra cuando se fija, para que el contenido no salte */}
      <div aria-hidden="true" style={{ height: stuck ? navH : 0 }} />

      {/* Menú móvil: panel lateral deslizante */}
      <div
        className={`nav-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-nav"
        className={`nav-drawer${menuOpen ? " open" : ""}`}
        aria-label="Navegación principal"
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer-head">
          <span className="nav-drawer-title">Menú</span>
          <button
            type="button"
            className="nav-close"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="nav-drawer-search">
          <SearchBar />
        </div>
        <nav className="nav-drawer-list">
          {NAV.map((item) => (
            <div key={item.label} className="nd-group">
              <a
                href={item.href}
                className={`nd-link${isActive(item) ? " on" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
              {item.drop && (
                <div className="nd-sub">
                  {item.drop.map((d) => (
                    <a href={d.href} key={d.label} onClick={() => setMenuOpen(false)}>
                      {d.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </header>
  );
}
