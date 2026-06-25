import type { Metadata } from "next";

// El panel nunca debe indexarse en buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
