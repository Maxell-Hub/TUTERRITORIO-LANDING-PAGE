"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Muestra un aviso como modal que aparece al entrar a la página y se cierra con
 * la «x», con clic en el fondo o con la tecla Escape, con animación de entrada y
 * salida. El contenido se pasa como `children`; `labelledBy` es el id del título
 * dentro del contenido (para aria-labelledby).
 */
export default function AvisoGestorModal({
  children,
  labelledBy,
}: {
  children: React.ReactNode;
  labelledBy: string;
}) {
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  // Cierra reproduciendo la animación de salida antes de desmontar.
  function requestClose() {
    if (closing) return;
    setClosing(true);
    timerRef.current = setTimeout(() => setOpen(false), 230);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") requestClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={`aviso-modal-overlay${closing ? " is-closing" : ""}`} onMouseDown={requestClose}>
      <div
        className="aviso-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="aviso-modal__close" onClick={requestClose} aria-label="Cerrar aviso">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <div className="aviso-modal__content">{children}</div>
      </div>
    </div>,
    document.body
  );
}
