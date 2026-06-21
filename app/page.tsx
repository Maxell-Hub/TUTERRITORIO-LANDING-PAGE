import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import EnlacesInteres from "@/components/home/EnlacesInteres";
import VisorGeografico from "@/components/home/VisorGeografico";

export const metadata: Metadata = {
  title: "Inicio - Tuterritorio",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <EnlacesInteres />
      <VisorGeografico />
    </>
  );
}
