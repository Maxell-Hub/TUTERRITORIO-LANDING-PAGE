/** @type {import('next').NextConfig} */

// Content-Security-Policy ajustada a lo que el sitio realmente usa:
//  - scripts/estilos propios (Next usa algunos inline → 'unsafe-inline')
//  - Vercel Analytics / Speed Insights (va.vercel-scripts.com, vitals)
//  - mapa de Google embebido (frame www.google.com)
//  - imágenes propias, data:, blob: y https (el admin puede pegar URLs)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com https://www.google.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://translate.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://www.gstatic.com https://fonts.gstatic.com",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://translate.googleapis.com https://translate-pa.googleapis.com https://translate.google.com https://www.google.com",
  "frame-src 'self' https://www.google.com https://maps.google.com https://translate.google.com https://translate.googleapis.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Sirve AVIF/WebP automáticamente (mucho más livianos).
    formats: ["image/avif", "image/webp"],
    // Permite optimizar imágenes externas que el administrador pegue como URL
    // (por ejemplo, en una noticia). Las imágenes locales de /assets no necesitan esto.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Cabeceras de seguridad aplicadas a todas las rutas.
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
