import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import RevealManager from "@/components/motion/RevealManager";
import AuthProvider from "@/components/auth/AuthProvider";
import { OverridesProvider } from "@/components/admin/Editable";
import SiteChrome from "@/components/layout/SiteChrome";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FloatingActions from "@/components/site/FloatingActions";
import GoogleTranslate from "@/components/site/GoogleTranslate";

// Outfit auto-hospedada por Next (no se llama a Google Fonts en runtime)
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const SITE_URL = "https://www.tuterritorio.gov.co";
const SITE_NAME = "Tuterritorio";
const DESCRIPTION =
  "Catastro Multipropósito de Valledupar. Consulta la información de tu predio (linderos, área y avalúo), realiza trámites catastrales, radica tu PQRSD y consulta el impuesto predial. Operado por Tuterritorio.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tuterritorio — Catastro Multipropósito de Valledupar",
    template: "%s — Tuterritorio",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "catastro Valledupar",
    "catastro multipropósito",
    "consultar predio Valledupar",
    "avalúo catastral",
    "impuesto predial Valledupar",
    "trámites catastrales",
    "PQRSD Valledupar",
    "gestor catastral Cesar",
    "Tuterritorio",
    "información predial",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "government",
  alternates: { canonical: "/" },
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Tuterritorio — Catastro Multipropósito de Valledupar",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tuterritorio — Catastro Multipropósito de Valledupar",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

// Datos estructurados (JSON-LD) para buscadores: organización gubernamental + sitio web.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: SITE_NAME,
    alternateName: "Catastro Multipropósito de Valledupar",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/assets/banner-bienvenidos.png`,
    description: DESCRIPTION,
    email: "contactenos@tuterritorio.gov.co",
    telephone: "+576055885761",
    taxID: "901996731-8",
    areaServed: { "@type": "City", name: "Valledupar" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 16 #9-48, Edificio Caja Agraria - Oficina 1301",
      addressLocality: "Valledupar",
      addressRegion: "Cesar",
      addressCountry: "CO",
    },
    sameAs: ["https://www.instagram.com/tuterritorio_catrastro/"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-CO",
    publisher: { "@type": "GovernmentOrganization", name: SITE_NAME },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        {/* Aplica el tema antes de pintar (evita parpadeo). Usa la preferencia
            guardada si existe; si no, sigue el modo del sistema operativo. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('tt-theme');if(t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <OverridesProvider>
            <SiteChrome>{children}</SiteChrome>
          </OverridesProvider>
        </AuthProvider>
        <RevealManager />
        <FloatingActions />
        <GoogleTranslate />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
