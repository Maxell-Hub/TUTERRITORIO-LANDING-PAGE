import type { Metadata } from "next";
import Link from "next/link";
import { Apartado, RecursoExistente } from "@/components/transparencia/Transparencia";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Atención y servicios a la ciudadanía",
  alternates: { canonical: "/atencion-ciudadania" },
  description:
    "Canales de atención, trámites y servicios, PQRSD, preguntas frecuentes y carta de trato digno de Tuterritorio — Catastro Multipropósito de Valledupar.",
};

const ACCESOS: { icon: React.ReactNode; accent: string; href: string; title: string; desc: string }[] = [
  {
    accent: "#3B85A5",
    href: "/servicios",
    title: "Trámites y servicios",
    desc: "Consulta los trámites y productos catastrales con sus requisitos, tiempos y costos.",
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></>,
  },
  {
    accent: "#4E8654",
    href: "/contactos",
    title: "Canales de atención",
    desc: "Escríbenos, llámanos o visítanos. Conoce nuestra sede y horarios de atención.",
    icon: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></>,
  },
  {
    accent: "#0C222F",
    href: "/pqrsd",
    title: "Radica tu PQRSD",
    desc: "Peticiones, quejas, reclamos, sugerencias y denuncias ante la entidad.",
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>,
  },
];

export default function AtencionCiudadaniaPage() {
  return (
    <section className="legal-hero">
      <div className="legal-wrap">
        <span className="legal-eyebrow">Atención a la ciudadanía</span>
        <h1>Atención y servicios a la ciudadanía</h1>
        <p className="legal-lead">
          Todos los canales para hacer trámites, comunicarte con nosotros y ejercer tus derechos, en un solo lugar.
        </p>

        <div className="t-grid">
          {ACCESOS.map((a) => (
            <Link key={a.href} href={a.href} className="t-card" style={{ ["--accent" as string]: a.accent }}>
              <span className="t-num" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg>
              </span>
              <span className="t-card-body">
                <span className="t-card-title">{a.title}</span>
                <span className="t-card-desc">{a.desc}</span>
              </span>
              <span className="t-card-go" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="legal-body">
          <Apartado titulo="Preguntas frecuentes">
            <p>Respuestas a las dudas más comunes de la ciudadanía sobre trámites catastrales, avalúos, impuesto predial y PQRSD.</p>
            <RecursoExistente href="/preguntas-frecuentes">Ver preguntas frecuentes</RecursoExistente>
          </Apartado>

          <Apartado titulo="Carta de trato digno al ciudadano">
            <p>Documento que describe los derechos de los ciudadanos y los medios para garantizarlos en su relación con la entidad (Ley 1437 de 2011, art. 7).</p>
            <PendienteContenido titulo="Carta de trato digno" descripcion="Documento pendiente de cargar por la entidad." />
          </Apartado>
        </div>
      </div>
    </section>
  );
}
