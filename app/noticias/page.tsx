import type { Metadata } from "next";
import NoticiasList from "@/components/noticias/NoticiasList";

export const metadata: Metadata = {
  title: "Noticias",
  alternates: { canonical: "/noticias" },
  description:
    "Sala de prensa de Tuterritorio: avances de la actualización catastral multipropósito de Valledupar, avalúos, trámites y comunidad.",
};

export default function NoticiasPage() {
  return (
    <>
      <NoticiasList />

      {/* Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-musicos.jpg)", ["--band-m" as string]: "url(/assets/foto-musicos-m.jpg)", backgroundPosition: "center 55%" }}
      >
        <div className="atg-wrap">
          <h2>El territorio también es noticia</h2>
          <p>Sigue de cerca los avances de la actualización catastral, los operativos de campo y las jornadas con la comunidad de Valledupar.</p>
          <a className="atg-pill" href="/contactos">Contáctanos</a>
        </div>
      </section>
    </>
  );
}
