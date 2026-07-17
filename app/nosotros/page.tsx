import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Nosotros",
  alternates: { canonical: "/nosotros" },
  description:
    "Tuterritorio, operador del Catastro Multipropósito de Valledupar: quiénes somos, nuestras funciones, misión, visión, objetivos y el proceso catastral.",
};

/**
 * Nosotros — estructura del diseño ATG:
 * hero fotográfico tintado → quiénes somos (feature) → misión y visión
 * → funciones (grid de tarjetas) → objetivos (feature invertida)
 * → declaración + etapas del proceso → instalaciones (video)
 * → franja fotográfica de cierre.
 */

// Acentos ATG (azul · verde · naranja) que ciclan en tarjetas y numeraciones.
const ACC = ["var(--tt-blue-600)", "var(--tt-green-500)", "var(--tt-amber-500)"];

const FUNCIONES = [
  { n: "01", t: "Identificación predial", d: "Identificamos física, jurídica y económicamente cada predio del municipio de Valledupar." },
  { n: "02", t: "Actualización de avalúos", d: "Mantenemos al día el avalúo catastral que sirve de base para trámites y tributos." },
  { n: "03", t: "Trámites y mutaciones", d: "Gestionamos mutaciones, rectificaciones y demás trámites catastrales con plena validez legal." },
  { n: "04", t: "Información para la planeación", d: "Entregamos los datos con los que el municipio ordena su territorio y toma decisiones." },
  { n: "05", t: "Atención a la ciudadanía", d: "Respondemos cada consulta y solicitud con lenguaje claro y tiempos definidos." },
  { n: "06", t: "Articulación institucional", d: "Trabajamos junto a la Alcaldía de Valledupar para que la información catastral y la municipal siempre coincidan." },
];

const OBJETIVOS = [
  { n: "01", t: "Mantener actualizada la información catastral de todo el municipio." },
  { n: "02", t: "Garantizar la seguridad jurídica de la propiedad de los ciudadanos." },
  { n: "03", t: "Fortalecer la planeación y el ordenamiento territorial con datos reales." },
  { n: "04", t: "Fortalecer las finanzas públicas locales con información justa y equitativa." },
  { n: "05", t: "Acercar el catastro a la ciudadanía con atención oportuna y transparente." },
];

const ETAPAS = [
  { n: "01", t: "Formación", d: "Identificación, recolección e incorporación inicial de la información de la totalidad de los predios." },
  { n: "02", t: "Actualización", d: "Identificación, recolección y registro de cambios o inconsistencias en los predios durante un periodo determinado." },
  { n: "03", t: "Conservación", d: "Mantenimiento permanente y gestión continua de la base de información catastral." },
  { n: "04", t: "Difusión", d: "Disponibilidad y acceso a la información catastral para su consulta y uso por parte de los ciudadanos." },
];

// Tarjeta caja blanca sobre banda gris (reusa .atg-mock para heredar el modo oscuro).
const card: CSSProperties = { padding: 24, borderRadius: 16, boxShadow: "var(--shadow-sm)" };
const cardNum: CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".15em" };
const cardH3: CSSProperties = { margin: "10px 0 8px", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--tt-ink)" };
const cardP: CSSProperties = { margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "var(--tt-gray-500)" };

export default function NosotrosPage() {
  return (
    <>
      {/* 1 · Hero fotográfico */}
      <section
        className="atg-hero"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atg/foto-alcaldia.jpg)" }}
      >
        <span className="atg-eyebrow">Nosotros · <b>Catastro Multipropósito</b></span>
        <h1>
          <Editable as="span" id="nos.title">El catastro de Valledupar, al día y en un solo lugar</Editable>
        </h1>
        <Editable as="p" id="nos.intro2" className="sub" multiline>
          Conocer nuestro territorio para construir nuestro futuro: ese es el propósito que guía cada uno de nuestros procesos y servicios a la ciudadanía.
        </Editable>
        <div className="atg-cta-row">
          <a className="atg-pill" href="/nosotros/equipo">Conoce al equipo</a>
          <a className="atg-pill ghost" href="/servicios">Trámites y servicios</a>
        </div>
      </section>

      {/* 2 · Feature: quiénes somos */}
      <section className="atg-band" id="quienes-somos">
        <div className="atg-wrap">
          <div className="atg-feature">
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <div className="atg-mock-bar" aria-hidden="true">
                  <span className="d" /><span className="d" /><span className="d" />
                  <span className="title">nosotros — tuterritorio.gov.co</span>
                </div>
                <img
                  className="atg-mock-photo"
                  src="/assets/atg/foto-banderas.jpg"
                  alt="Banderas de Colombia, el Cesar y Valledupar en la sede de Tuterritorio"
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>01</b> · Quiénes somos</span>
              <h2>El operador del Catastro Multipropósito de Valledupar</h2>
              <p>
                Tuterritorio S.A.S es el operador del <b style={{ color: "var(--tt-ink)" }}>Catastro Multipropósito</b> del municipio de Valledupar. Identificamos, actualizamos y custodiamos la información de cada predio para garantizar seguridad jurídica, equidad y una mejor planeación del territorio.
              </p>
              <ul>
                <li>Información física, jurídica y económica de cada predio</li>
                <li>Datos con plena validez legal para trámites y tributos</li>
                <li>Trabajo articulado con la Alcaldía de Valledupar</li>
              </ul>
              <a className="atg-pill" href="/nosotros/equipo">Conoce al equipo</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Misión y visión */}
      <section className="atg-band" id="mision-vision">
        <div className="atg-wrap">
          <div className="reveal" style={{ maxWidth: "46rem" }}>
            <span className="atg-eyebrow" style={{ display: "block", marginBottom: 14 }}><b>02</b> · Misión y visión</span>
            <h2>Lo que nos mueve cada día</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginTop: 40 }}>
            <article className="atg-mock reveal" style={card}>
              <h3 style={{ ...cardH3, margin: "0 0 10px", fontSize: 19, color: "var(--tt-blue-600)" }}>Misión</h3>
              <p style={{ ...cardP, fontSize: 14.5 }}>
                <Editable as="span" id="nos.mision" multiline>Operar el catastro multipropósito de Valledupar y mantener la información de cada predio completa, actualizada y disponible para la ciudadanía y la administración municipal.</Editable>
              </p>
            </article>
            <article className="atg-mock reveal" style={card}>
              <h3 style={{ ...cardH3, margin: "0 0 10px", fontSize: 19, color: "var(--tt-green-600)" }}>Visión</h3>
              <p style={{ ...cardP, fontSize: 14.5 }}>
                <Editable as="span" id="nos.vision" multiline>Que cualquier persona en Valledupar pueda conocer y confiar en la información de su predio, y que el municipio planee su territorio sobre datos reales.</Editable>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4 · Funciones: grid de tarjetas */}
      <section className="atg-band" id="funciones">
        <div className="atg-wrap">
          <div className="reveal" style={{ maxWidth: "46rem" }}>
            <span className="atg-eyebrow" style={{ display: "block", marginBottom: 14 }}><b>03</b> · Nuestras funciones</span>
            <Editable as="h2" id="nos.func-title">Lo que hacemos</Editable>
            <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--tt-gray-500)" }}>
              <Editable as="span" id="nos.func-intro" multiline>Nos ocupamos de todo el ciclo catastral del municipio: del levantamiento de la información en campo a la respuesta de cada trámite ciudadano.</Editable>
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginTop: 44 }}>
            {FUNCIONES.map((f, i) => (
              <article key={f.n} className="atg-mock reveal" style={card}>
                <span style={{ ...cardNum, color: ACC[i % ACC.length] }}>{f.n}</span>
                <h3 style={cardH3}>{f.t}</h3>
                <p style={cardP}>{f.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Feature invertida: objetivos */}
      <section className="atg-band" id="objetivos">
        <div className="atg-wrap">
          <div className="atg-feature flip">
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>04</b> · Objetivos</span>
              <h2>Hacia dónde trabajamos</h2>
              <p>Cinco compromisos que orientan nuestra gestión catastral y nuestro servicio diario a la ciudadanía de Valledupar.</p>
              <a className="atg-pill" href="/servicios">Ver los trámites</a>
            </div>
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <div className="atg-mock-bar" aria-hidden="true">
                  <span className="d" /><span className="d" /><span className="d" />
                  <span className="title">objetivos — tuterritorio.gov.co</span>
                </div>
                <div style={{ padding: "10px 24px" }}>
                  {OBJETIVOS.map((o, i) => (
                    <div
                      key={o.n}
                      style={{ display: "flex", gap: 18, alignItems: "baseline", padding: "15px 0", borderBottom: i < OBJETIVOS.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
                    >
                      <span style={{ ...cardNum, color: ACC[i % ACC.length] }}>{o.n}</span>
                      <p style={{ ...cardP, fontSize: 14 }}>{o.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Declaración: el proceso catastral */}
      <section className="atg-statement">
        <div className="atg-wrap">
          <span className="atg-eyebrow">El proceso <b>catastral</b></span>
          <h2>Etapas del Proceso Catastral</h2>
          <p>Así avanzamos, paso a paso, hasta tener un catastro actualizado y al servicio de la gente.</p>
        </div>
      </section>

      {/* 7 · Etapas: grid de tarjetas */}
      <section className="atg-band" id="proceso">
        <div className="atg-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {ETAPAS.map((e, i) => (
              <article key={e.n} className="atg-mock reveal" style={card}>
                <span style={{ ...cardNum, color: ACC[i % ACC.length] }}>{e.n}</span>
                <h3 style={cardH3}>{e.t}</h3>
                <p style={cardP}>{e.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · Feature invertida: instalaciones con video */}
      <section className="atg-band" id="instalaciones">
        <div className="atg-wrap">
          <div className="atg-feature flip">
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>05</b> · Nuestras instalaciones</span>
              <h2>Conoce dónde te atendemos</h2>
              <p>Te invitamos a recorrer las oficinas y los espacios donde trabajamos cada día al servicio de la ciudadanía de Valledupar.</p>
              <ul>
                <li>Atención presencial para consultas y trámites catastrales</li>
                <li>Lunes a viernes en la sede principal</li>
              </ul>
              <a className="atg-pill" href="/contactos">Contáctanos</a>
            </div>
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <div className="atg-mock-bar" aria-hidden="true">
                  <span className="d" /><span className="d" /><span className="d" />
                  <span className="title">instalaciones — tuterritorio.gov.co</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", padding: 20, background: "var(--tt-gray-50)" }}>
                  {/* Video vertical (9:16) de las instalaciones */}
                  <div style={{ position: "relative", width: "min(100%, 300px)", aspectRatio: "9 / 16", borderRadius: 10, overflow: "hidden", background: "#0C222F" }}>
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      aria-label="Video de las instalaciones de Tuterritorio"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    >
                      <source src="/assets/instalaciones.mp4" type="video/mp4" />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 · Franja fotográfica de cierre */}
      <section
        className="atg-photo-band"
        style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/atg/foto-panoramica.jpg)" }}
      >
        <div className="atg-wrap">
          <span className="atg-eyebrow">Estamos <b>para atenderte</b></span>
          <h2>Visítanos en nuestra sede principal</h2>
          <p>Aquí atendemos en persona cada consulta y trámite catastral, de lunes a viernes.</p>
          <a className="atg-pill" href="/contactos">Cómo llegar</a>
        </div>
      </section>
    </>
  );
}
