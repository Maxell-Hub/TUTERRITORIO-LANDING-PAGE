/** @type {import('next').NextConfig} */
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
};

export default nextConfig;
