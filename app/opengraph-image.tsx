import { ImageResponse } from "next/og";

// Imagen de previsualización al compartir el sitio (redes/WhatsApp). 1200×630.
export const alt = "Tuterritorio — Catastro Multipropósito de Valledupar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RIBBON = ["#4E97B6", "#6AA070", "#8FBE4E", "#F0B63B", "#D83744"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background: "linear-gradient(135deg,#0C222F 0%,#163A4C 55%,#1E5167 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#8FBE4E",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Catastro Multipropósito · Valledupar
        </div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 800, marginTop: 18, letterSpacing: -2 }}>
          Tuterritorio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: "rgba(255,255,255,0.86)",
            marginTop: 18,
            maxWidth: 940,
            lineHeight: 1.3,
          }}
        >
          Consulta tu predio, realiza trámites catastrales y radica tu PQRSD.
        </div>
        <div style={{ display: "flex", marginTop: 56 }}>
          {RIBBON.map((c) => (
            <div key={c} style={{ width: 96, height: 12, background: c, borderRadius: 6, marginRight: 12 }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
