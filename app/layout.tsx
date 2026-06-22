import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RevealManager from "@/components/motion/RevealManager";
import AuthProvider from "@/components/auth/AuthProvider";
import { OverridesProvider } from "@/components/admin/Editable";
import SiteChrome from "@/components/layout/SiteChrome";

// Inter auto-hospedada por Next (no se llama a Google Fonts en runtime)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tuterritorio — Consulta tu predio en Valledupar",
  description:
    "Catastro multipropósito de Valledupar. Consulta tu predio, paga el impuesto predial y radica tu PQRSD.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <AuthProvider>
          <OverridesProvider>
            <SiteChrome>{children}</SiteChrome>
          </OverridesProvider>
        </AuthProvider>
        <RevealManager />
      </body>
    </html>
  );
}
