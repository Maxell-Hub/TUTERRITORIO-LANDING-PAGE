import type { Metadata } from "next";
import NoticiasList from "@/components/noticias/NoticiasList";

export const metadata: Metadata = {
  title: "Noticias",
  alternates: { canonical: "/noticias" },
  description:
    "Sala de prensa de Tuterritorio: avances de la actualización catastral multipropósito de Valledupar, avalúos, trámites y comunidad.",
};

export default function NoticiasPage() {
  return <NoticiasList />;
}
