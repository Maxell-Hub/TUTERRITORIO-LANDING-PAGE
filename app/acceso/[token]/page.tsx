import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";

// Nunca indexar el panel.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Acceso al panel por ruta secreta: /acceso/<ADMIN_PATH>.
 * El token se valida en el SERVIDOR contra la variable de entorno `ADMIN_PATH`
 * (nunca se envía al cliente). Si no coincide → 404, así no se revela nada.
 */
export default async function AccesoPanel({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const expected = process.env.ADMIN_PATH;
  if (!expected || token !== expected) notFound();
  return <AdminLogin />;
}
