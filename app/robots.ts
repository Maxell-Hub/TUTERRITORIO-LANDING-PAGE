import type { MetadataRoute } from "next";

const SITE_URL = "https://www.tuterritorio.gov.co";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No indexar el panel admin, las rutas de API ni las páginas
        // intermedias de protección de correos de Cloudflare.
        disallow: ["/admin", "/api/", "/cdn-cgi/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
