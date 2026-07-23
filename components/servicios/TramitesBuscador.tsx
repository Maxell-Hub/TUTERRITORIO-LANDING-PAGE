"use client";

import { useEffect, useState } from "react";

/**
 * Buscador de trámites: filtra en vivo las tarjetas .tr-card del grid
 * (cada una lleva su texto de búsqueda en data-buscar, normalizado sin tildes
 * y con términos equivalentes en inglés para la versión traducida del sitio).
 * No re-renderiza las tarjetas — solo las muestra/oculta en el DOM.
 */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function readLang(): "es" | "en" {
  if (typeof document === "undefined") return "es";
  const m = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
  return m && m[1] === "en" ? "en" : "es";
}

export default function TramitesBuscador() {
  const [q, setQ] = useState("");
  const [total, setTotal] = useState(0);
  const [visibles, setVisibles] = useState(0);
  const [lang, setLang] = useState<"es" | "en">("es");

  useEffect(() => setLang(readLang()), []);

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

  // Textos de la interfaz según el idioma (Google Translate no traduce los
  // atributos placeholder/aria-label; el estado con conteos lo escribimos
  // nosotros en el idioma correcto y queda protegido con notranslate).
  const T = lang === "en"
    ? {
        placeholder: "Search procedures: appraisal, merger, owner…",
        label: "Search procedures and services",
        match: (v: number, t: number) => `${v} of ${t} procedures match your search.`,
        none: "No procedures match. Try another word or write to us via PQRSD.",
        all: (t: number) => `${t} procedures and services available.`,
      }
    : {
        placeholder: "Busca tu trámite: avalúo, englobe, propietario…",
        label: "Buscar entre los trámites y servicios",
        match: (v: number, t: number) => `${v} de ${t} trámites coinciden con tu búsqueda.`,
        none: "Ningún trámite coincide. Intenta con otra palabra o escríbenos por PQRSD.",
        all: (t: number) => `${t} trámites y servicios disponibles.`,
      };

  return (
    <div className="trb reveal">
      <div className="fq-search">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={T.placeholder}
          aria-label={T.label}
        />
      </div>
      <p className={`trb-meta${lang === "en" ? " notranslate" : ""}`} translate={lang === "en" ? "no" : undefined} role="status">
        {q.trim() ? (visibles > 0 ? T.match(visibles, total) : T.none) : T.all(total)}
      </p>
    </div>
  );
}
