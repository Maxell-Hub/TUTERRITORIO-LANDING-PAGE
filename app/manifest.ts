import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tuterritorio — Catastro Multipropósito de Valledupar",
    short_name: "Tuterritorio",
    description:
      "Consulta tu predio, realiza trámites catastrales y radica tu PQRSD en Valledupar.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0C222F",
    lang: "es-CO",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
