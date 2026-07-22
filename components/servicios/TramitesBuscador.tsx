"use client";

import { useEffect, useState } from "react";

/**
 * Buscador de trámites: filtra en vivo las tarjetas .tr-card del grid
 * (cada una lleva su texto de búsqueda en data-buscar, normalizado sin tildes).
 * No re-renderiza las tarjetas — solo las muestra/oculta en el DOM.
 */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function TramitesBuscador() {
  const [q, setQ] = useState("");
  const [total, setTotal] = useState(0);
  const [visibles, setVisibles] = useState(0);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".tr-card[data-buscar]"));
    setTotal(cards.length);
    const words = norm(q.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const c of cards) {
      const show = words.every((w) => (c.dataset.buscar || "").includes(w));
      c.style.display = show ? "" : "none";
      if (show) count++;
    }
    setVisibles(count);
  }, [q]);

  return (
    <div className="trb reveal">
      <div className="fq-search">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca tu trámite: avalúo, englobe, propietario…"
          aria-label="Buscar entre los trámites y servicios"
        />
      </div>
      <p className="trb-meta" role="status">
        {q.trim()
          ? visibles > 0
            ? `${visibles} de ${total} trámites coinciden con tu búsqueda.`
            : "Ningún trámite coincide. Intenta con otra palabra o escríbenos por PQRSD."
          : `${total} trámites y servicios disponibles.`}
      </p>
    </div>
  );
}
