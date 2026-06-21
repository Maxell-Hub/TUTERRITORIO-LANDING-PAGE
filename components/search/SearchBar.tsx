"use client";

import { useState } from "react";

/**
 * Buscador institucional. Por requisito, SOLO se monta en la página de Inicio.
 * Aquí queda cableado a /api/search (full-text de todo el sitio) — pendiente de
 * conectar el índice real cuando integremos las demás secciones + CMS.
 */
export default function SearchBar() {
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    // TODO: navegar a /buscar?q=... cuando exista el índice de búsqueda
    window.location.href = `/buscar?q=${encodeURIComponent(q.trim())}`;
  }

  return (
    <form className="gc-search" role="search" aria-label="Buscar en el sitio" onSubmit={onSubmit}>
      <button type="button" className="seg" aria-label="Categoría de búsqueda: General">
        General
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Realiza búsqueda..."
        aria-label="Términos de búsqueda"
      />
      <button type="button" className="ic-btn" title="Búsqueda por voz" aria-label="Búsqueda por voz">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <path d="M12 17v4" />
        </svg>
      </button>
      <button type="submit" className="go-btn" title="Buscar" aria-label="Buscar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  );
}
