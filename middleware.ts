import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Ruta secreta del panel de administración.
 *
 * El nombre real de la ruta vive SOLO en la variable de entorno `ADMIN_PATH`
 * (en Vercel), nunca en el código (el repo es público). El panel interno está
 * en `/admin`, pero:
 *   - Acceso directo a `/admin` → 404 (no se puede entrar por ahí).
 *   - Acceso a `/<ADMIN_PATH>` → se reescribe internamente a `/admin`.
 *
 * Si `ADMIN_PATH` no está configurada, se mantiene el comportamiento normal
 * (acceso por `/admin`) para no quedar sin acceso por accidente.
 */
const ADMIN_PATH = process.env.ADMIN_PATH;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!ADMIN_PATH) return NextResponse.next();

  // Bloquea el acceso directo al panel interno.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // La ruta secreta reescribe (internamente) al panel.
  if (pathname === `/${ADMIN_PATH}`) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Se ejecuta en rutas de página; excluye API, internos de Next y archivos.
  matcher: ["/((?!api/|_next/|assets/|.*\\.).*)"],
};
