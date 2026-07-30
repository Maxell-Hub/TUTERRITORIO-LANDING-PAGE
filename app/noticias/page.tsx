import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
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
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/noticias/foto-musicos2.webp)", ["--band-m" as string]: "url(/assets/noticias/foto-musicos2-m.webp)", backgroundPosition: "center 55%" }}
      >
        <div className="atg-wrap">
          <Editable as="h2" id="noticias.cierre-h2">El territorio también es noticia</Editable>
          <Editable as="p" id="noticias.cierre-p" multiline>Sigue de cerca los avances de la actualización catastral, los operativos de campo y las jornadas con la comunidad de Valledupar.</Editable>
          <a className="atg-pill" href="/contactos"><Editable as="span" id="noticias.cierre-cta">Contáctanos</Editable></a>
        </div>
      </section>
    </>
  );
}
