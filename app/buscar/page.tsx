import type { Metadata } from "next";
import { Suspense } from "react";
import Editable from "@/components/admin/Editable";
import BuscarResults from "@/components/search/BuscarResults";

export const metadata: Metadata = {
  title: "Buscar en el sitio",
  description:
    "Busca páginas, trámites, normativas, noticias y términos del catastro en el sitio de Tuterritorio, operador catastral de Valledupar.",
  alternates: { canonical: "/buscar" },
  // Las páginas de resultados de búsqueda no se indexan (buena práctica SEO).
  robots: { index: false, follow: true },
};

export default function BuscarPage() {
  return (
    <section className="atg-band">
      <div className="atg-wrap buscar-wrap">
        <Editable as="h1" id="buscar.h1" className="buscar-h1">Buscar en el sitio</Editable>
        <Suspense fallback={<p className="buscar-empty">Cargando…</p>}>
          <BuscarResults />
        </Suspense>
      </div>
    </section>
  );
}
