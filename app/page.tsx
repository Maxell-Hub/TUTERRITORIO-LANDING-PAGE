import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import EnlacesInteres from "@/components/home/EnlacesInteres";
import ConfidenceBand from "@/components/home/ConfidenceBand";
import VisorGeografico from "@/components/home/VisorGeografico";

export const metadata: Metadata = {
  title: { absolute: "Tuterritorio — Catastro Multipropósito de Valledupar" },
  description:
    "Consulta tu predio en Valledupar: linderos, área y avalúo catastral. Realiza trámites catastrales, radica tu PQRSD y consulta el impuesto predial con Tuterritorio, gestor catastral de Valledupar.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <EnlacesInteres />
      <ConfidenceBand />
      <VisorGeografico />
    </>
  );
}
