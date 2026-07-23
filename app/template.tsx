import ScrollTop from "@/components/site/ScrollTop";

/**
 * Template raíz: se vuelve a montar en cada navegación, de modo que el
 * contenido de CADA página entra con la animación .page-enter (fade + subida),
 * igual que la entrada escalonada del texto de los heros. ScrollTop asegura
 * que cada navegación por clic arranque al principio de la página.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter">
      <ScrollTop />
      {children}
    </div>
  );
}
