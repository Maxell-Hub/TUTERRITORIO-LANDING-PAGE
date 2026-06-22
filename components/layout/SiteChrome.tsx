"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Decide si mostrar la estructura del sitio (encabezado, pie, etc.).
 * En /admin se devuelve solo el contenido: una página independiente (en blanco)
 * con el formulario de inicio de sesión.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname === "/admin" || pathname.startsWith("/admin/");

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
