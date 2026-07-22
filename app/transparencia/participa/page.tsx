import type { Metadata } from "next";
import PendienteContenido from "@/components/common/PendienteContenido";

export const metadata: Metadata = {
  title: "Participa — Transparencia",
  alternates: { canonical: "/transparencia/participa" },
  description: "Espacios de participación ciudadana en la gestión de Tuterritorio: diagnóstico, planeación, ejecución, control y rendición de cuentas.",
};

const SITE_URL = "https://tuterritorio.gov.co";

/** Fases de participación aún sin espacios habilitados (6.1 a 6.3). */
const FASES_PENDIENTES: { titulo: string; pendiente: string }[] = [
  { titulo: "6.1 Diagnóstico e identificación de problemas", pendiente: "Espacios de diagnóstico participativo" },
  { titulo: "6.2 Planeación y presupuesto participativo", pendiente: "Espacios de planeación participativa" },
  { titulo: "6.3 Ejecución de programas y proyectos", pendiente: "Participación en la ejecución" },
];

/* Las tarjetas de fase (6.1 a 6.5) usan la clase .fase-card de globals.css,
   con estilos propios para modo claro y oscuro. */

/**
 * Participa (Transparencia) — estructura del diseño ATG:
 * hero fotográfico tintado → grid de fases de participación →
 * feature de control social (PQRSD) → panel de rendición de cuentas →
 * franja de cierre con CTA.
 */
export default function ParticipaPage() {
  // Datos estructurados de ruta de exploración (Inicio › Transparencia › Participa).
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Transparencia y acceso a la información pública", item: `${SITE_URL}/transparencia` },
      { "@type": "ListItem", position: 3, name: "Participa" },
    ],
  };

  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/foto-socializacion.jpg" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/foto-socializacion-m.jpg" media="(max-width: 720px)" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-socializacion.jpg)", ["--hero-m" as string]: "url(/assets/foto-socializacion-m.jpg)", backgroundPosition: "center 62%" }}
      >
        <h1>
          Tu voz también<br />construye el territorio
        </h1>
        <p className="sub">
          Espacios para que la ciudadanía participe en las distintas fases de la gestión de la entidad.
        </p>
        <div className="atg-cta-row">
          <a className="atg-pill" href="/pqrsd">Radicar una PQRSD</a>
          <a className="atg-pill ghost" href="/transparencia">Volver a Transparencia</a>
        </div>
      </section>

      {/* 2 · Grid: fases de participación */}
      <section className="atg-band" id="fases">
        <div className="atg-wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <h2>Participa en cada fase de la gestión</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {FASES_PENDIENTES.map((f) => (
              <div key={f.titulo} className="fase-card reveal">
                <h3>{f.titulo}</h3>
                <PendienteContenido titulo={f.pendiente} descripcion="Información pendiente de cargar por la entidad." />
              </div>
            ))}

            {/* 6.4 — única fase con espacio ya disponible: control social vía PQRSD */}
            <div id="control-social" className="fase-card reveal">
              <h3>6.4 Control y evaluación de la gestión</h3>
              <p>
                Ejerce control social: presenta tus peticiones, quejas, reclamos, sugerencias y denuncias con radicado inmediato y tiempos de respuesta según la ley.
              </p>
              <a className="atg-pill" href="/pqrsd" style={{ marginTop: "auto", alignSelf: "flex-start" }}>Radicar una PQRSD</a>
            </div>

            <div id="rendicion-de-cuentas" className="fase-card reveal">
              <h3>6.5 Rendición de cuentas</h3>
              <PendienteContenido titulo="Rendición de cuentas a la ciudadanía" descripcion="Cronograma e informes de rendición de cuentas pendientes de cargar por la entidad." />
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-iglesia.jpg)", ["--band-m" as string]: "url(/assets/foto-iglesia-m.jpg)", backgroundPosition: "center 8%" }}
      >
        <div className="atg-wrap">
          <h2>La participación fortalece el catastro</h2>
          <p>
            Tus aportes, observaciones y solicitudes ayudan a construir un catastro multipropósito más transparente y cercano a la ciudadanía.
          </p>
          <a className="atg-pill" href="/contactos">Contáctanos</a>
        </div>
      </section>
    </>
  );
}
