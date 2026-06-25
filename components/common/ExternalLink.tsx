"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Enlace a sitio externo (no-.gov.co) con aviso de salida del sitio oficial.
 * Al hacer clic muestra un modal accesible de confirmación (Decreto 620/2020,
 * buenas prácticas de portales gubernamentales). Lleva rel="noopener noreferrer".
 */
export default function ExternalLink({
  href,
  className,
  children,
  ariaLabel,
  style,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href={href}
        className={className}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ? `${ariaLabel} (abre un sitio externo)` : undefined}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
        <span className="sr-only"> (sitio externo)</span>
      </a>

      {open && (
        <div
          className="ext-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ext-modal-title"
          aria-describedby="ext-modal-desc"
          onClick={() => setOpen(false)}
        >
          <div className="ext-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ext-modal-ic" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>
            </div>
            <h2 id="ext-modal-title">Estás saliendo del sitio oficial</h2>
            <p id="ext-modal-desc">
              Vas a ir a un sitio externo que <b>no</b> forma parte de
              {" "}<b>tuterritorio.gov.co</b>. Tuterritorio no se hace responsable de su contenido ni
              de sus políticas de privacidad.
            </p>
            <p className="ext-modal-url">{href}</p>
            <div className="ext-modal-actions">
              <button ref={cancelRef} type="button" className="ext-cancel" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <a
                className="ext-continue"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                Continuar al sitio externo
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
