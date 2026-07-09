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
  {
    label: "Atención a la ciudadanía",
    href: "/atencion-ciudadania",
    match: "/atencion-ciudadania",
    drop: [
      { label: "Atención y servicios", href: "/atencion-ciudadania" },
      { label: "Trámites y servicios", href: "/servicios" },
      { label: "Canales de atención", href: "/contactos" },
      { label: "Radica tu PQRSD", href: "/pqrsd" },
    ],
  },
  { label: "Transparencia", href: "/transparencia", match: "/transparencia" },
  { label: "Participa", href: "/transparencia/participa", match: "/transparencia/participa" },
  {
    label: "Recursos",
    href: "/recursos/normativas",
    match: "/recursos",
    drop: [
      { label: "Normativas", href: "/recursos/normativas" },
      { label: "ABC Catastral", href: "/recursos/glosario" },
    ],
  },
  { label: "Noticias", href: "/noticias", match: "/noticias" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [stuck, setStuck] = useState(false);
  const [returning, setReturning] = useState(false);
  const [navH, setNavH] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Cuando el "sentinel" (justo encima del menú) sale por arriba de la pantalla,
  // el menú pasa a fijo arriba. Al volver arriba, animamos su regreso al lugar.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (navRef.current) setNavH(navRef.current.offsetHeight);
    if (!sentinel) return;
    let prev = false;
    let t: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        const next = !e.isIntersecting;
        setStuck(next);
        if (prev && !next) {
          // Regresó arriba: dispara la animación suave de vuelta a su sitio.
          setReturning(true);
          window.clearTimeout(t);
          t = window.setTimeout(() => setReturning(false), 480);
        }
        prev = next;
      },
      { threshold: 0 }
    );
    io.observe(sentinel);
    const onResize = () => navRef.current && setNavH(navRef.current.offsetHeight);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, []);

  // Marca activo según la página actual: en Inicio siempre "Inicio"; en las
  // demás, por el prefijo de ruta MÁS específico (evita doble resaltado cuando
  // una ruta es prefijo de otra, p. ej. /transparencia vs /transparencia/participa).
  const bestMatchLen = isHome
    ? 0
    : NAV.reduce((best, it) => (it.match && pathname.startsWith(it.match) && it.match.length > best ? it.match.length : best), 0);
  const isActive = (item: NavItem) =>
    isHome
      ? item.href === "/"
      : !!item.match && pathname.startsWith(item.match) && item.match.length === bestMatchLen;

  // Cierra el menú móvil (y colapsa los submenús) al cambiar de ruta.
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroups([]);
  }, [pathname]);

  const toggleGroup = (label: string) =>
    setOpenGroups((g) => (g.includes(label) ? g.filter((l) => l !== label) : [...g, label]));

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
          <a href="https://www.gov.co" target="_blank" rel="noopener noreferrer" aria-label="Portal del Estado Colombiano gov.co (abre en una pestaña nueva)" style={{ display: "inline-flex", alignItems: "center" }}>
            <img src="/assets/govco-white.png" alt="gov.co" style={{ width: 98.35, height: 30, display: "block" }} />
          </a>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span className="gc-welcome">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" />
                </svg>
                Bienvenido, admin
              </span>
              <span style={{ width: 1, height: 18, background: "rgba(255,255,255,.45)" }} />
              <button type="button" className="gc-auth gc-auth-btn" onClick={() => logout()}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>

      {/* Barra unificada: logos (izq) · menú (centro) · buscador (der). Se fija al hacer scroll. */}
      <div ref={sentinelRef} aria-hidden="true" className="mainnav-sentinel" />
      <nav ref={navRef} className={`mainnav${stuck ? " is-stuck" : ""}${returning ? " is-returning" : ""}`} aria-label="Navegación principal">
        <div className="mainnav-row">
          {/* Logos (izquierda) */}
          <div className="brand-logos">
            <a href="/" aria-label="Ir al inicio" style={{ display: "inline-flex" }}>
              <img src="/assets/logo-tuterritorio-v.png" alt="Tuterritorio" className="logo-tt logo-light-only" />
              <img src="/assets/logo-tuterritorio-v-blanco.png" alt="" aria-hidden="true" className="logo-tt logo-dark-only" />
            </a>
            <span className="brand-sep" />
            <a
              href="https://www.valledupar-cesar.gov.co/micro-site/8529E318-DCA9-F011-BFB4-08BFB81D5CA8/7839157F-F4DC-F011-AB1D-C45AB1C9846A"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Alcaldía de Valledupar — Catastro (abre en una pestaña nueva)"
              style={{ display: "inline-flex" }}
            >
              <img src="/assets/logo-catastro-vpar.png" alt="Alcaldía de Valledupar — Catastro" className="logo-cat logo-light-only" />
              <img src="/assets/logo-catastro-vpar-blanco.png" alt="" aria-hidden="true" className="logo-cat logo-dark-only" />
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
                    aria-current={isActive(item) ? "page" : undefined}
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
          {NAV.map((item) => {
            const expanded = openGroups.includes(item.label);
            return (
              <div key={item.label} className={`nd-group${item.drop ? " has-sub" : ""}${expanded ? " open" : ""}`}>
                {item.drop ? (
                  <button
                    type="button"
                    className={`nd-link nd-toggle${isActive(item) ? " on" : ""}`}
                    aria-expanded={expanded}
                    aria-controls={`nd-sub-${item.label}`}
                    onClick={() => toggleGroup(item.label)}
                  >
                    {item.label}
                    <svg className="nd-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`nd-link${isActive(item) ? " on" : ""}`}
                    aria-current={isActive(item) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
                {item.drop && expanded && (
                  <div id={`nd-sub-${item.label}`} className="nd-sub">
                    {item.drop.map((d) => (
                      <a href={d.href} key={d.label} onClick={() => setMenuOpen(false)}>
                        {d.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </header>
  );
}
