import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */

// Content-Security-Policy ajustada a lo que el sitio realmente usa:
//  - scripts/estilos propios (Next usa algunos inline → 'unsafe-inline')
//  - Vercel Analytics / Speed Insights (va.vercel-scripts.com, vitals)
//  - mapa de Google embebido (frame www.google.com)
//  - imágenes propias, data:, blob: y https (el admin puede pegar URLs)
// En desarrollo Next.js necesita 'unsafe-eval' (source maps / Fast Refresh);
// en producción NO se incluye, la política queda igual de estricta.
const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devEval} https://va.vercel-scripts.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com https://www.google.com https://apis.google.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://translate.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://www.gstatic.com https://fonts.gstatic.com",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://translate.googleapis.com https://translate-pa.googleapis.com https://translate.google.com https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io",
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
  // "0" es el valor seguro recomendado hoy: el auditor XSS de los navegadores fue
  // retirado (llegaba a crear vulnerabilidades); la protección real la da la CSP.
  // Se fija explícitamente por cumplimiento de la Res. MinTIC 1519/2020 (Anexo 3, num. 14).
  { key: "X-XSS-Protection", value: "0" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // El cliente solo lee variables NEXT_PUBLIC_*. Si la integración de Vercel puso
  // el DSN de Sentry como SENTRY_DSN (server), lo exponemos también al cliente.
  env: {
    NEXT_PUBLIC_SENTRY_DSN:
      process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || "",
  },
  experimental: {
    // Inserta el CSS en el HTML en vez de un <link> bloqueante: elimina la
    // solicitud que bloquea el primer renderizado (~300 ms en 4G lenta).
    inlineCss: true,
  },
  images: {
    // Servimos las imágenes tal cual (ya son WebP optimizadas en /assets) SIN pasar
    // por el optimizador de imágenes de Vercel. Motivo: cuando su cuota mensual se
    // agota (o hay una incidencia), next/image devolvía error y las fotos de Noticias
    // se rompían (se veía solo el texto alt). Al desactivarlo, las fotos siempre
    // cargan y no se consume cuota de optimización.
    unoptimized: true,
    // Permite imágenes externas que el administrador pegue como URL (p. ej. en una noticia).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Cabeceras de seguridad aplicadas a todas las rutas.
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // El video institucional es contenido de apoyo, no tiene página propia
      // de reproducción: se le indica a Google que no lo indexe como video
      // (resuelve el aviso "El vídeo no está en una página de visualización").
      {
        source: "/assets/nosotros/instalaciones.mp4",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      // Caché de las imágenes y documentos estáticos: 1 año e inmutable.
      // REGLA: al reemplazar un archivo hay que RENOMBRARLO (p. ej. foto-x2.jpg);
      // con el mismo nombre el navegador/CDN seguiría sirviendo la copia vieja.
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/docs/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

// Envuelve la config con Sentry. La subida de source maps solo ocurre si existe
// SENTRY_AUTH_TOKEN (lo pone la integración de Vercel); sin él, se omite sin fallar.
export default withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
  widenClientFileUpload: true,
  // Solo sube source maps si hay token (lo pone la integración de Vercel).
  // Sin token, se omite la subida y el build NO falla.
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
