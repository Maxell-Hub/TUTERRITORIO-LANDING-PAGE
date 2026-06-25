"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Decide si mostrar la estructura del sitio (encabezado, pie, etc.).
 * En el panel (segmento "admin") se devuelve solo el contenido: una página
 * independiente con el formulario de inicio de sesión. Se usa el SEGMENTO
 * renderizado (no la URL) para que funcione aunque se entre por la ruta secreta.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const bare = segment === "admin";

  if (bare) return <>{children}</>;

  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      {/* Barra de progreso de scroll (colores de marca) */}
      <div id="scrollProg" />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
