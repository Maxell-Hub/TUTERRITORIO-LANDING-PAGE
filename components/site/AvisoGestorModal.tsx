"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AvisoGestorBody } from "./AvisoGestorCatastral";

/**
 * Muestra el aviso al Gestor como un modal que aparece al entrar a la página
 * (p. ej. «Radica tu PQRSD») y se cierra con la «x», con clic en el fondo o con
 * la tecla Escape.
 */
export default function AvisoGestorModal({ nota }: { nota?: string }) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="aviso-modal-overlay" onMouseDown={() => setOpen(false)}>
      <div
        className="aviso-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aviso-gestor-titulo"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="aviso-modal__close" onClick={() => setOpen(false)} aria-label="Cerrar aviso">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <div className="aviso-modal__content">
          <AvisoGestorBody nota={nota} />
        </div>
      </div>
    </div>,
    document.body
  );
}
