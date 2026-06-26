import type { Metadata } from "next";
import Image from "next/image";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Nosotros",
  alternates: { canonical: "/nosotros" },
  description:
    "Tuterritorio, operador del Catastro Multipropósito de Valledupar: quiénes somos, nuestras funciones, misión, visión, objetivos y el proceso catastral.",
};

// Bento asimétrico: número de sección, color de acento (paleta institucional),
// tamaño de tarjeta (lg≈65% · md≈50% · sm≈35%) y, en ámbar, un tono de enlace legible.
const FUNCIONES = [
  { n: "01", c: "#0C222F", cls: "fn-lg", t: "Identificación predial", d: "Identificamos física, jurídica y económicamente cada predio del municipio de Valledupar.", icon: <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></> },
  { n: "02", c: "#2F6B4F", cls: "fn-sm", t: "Actualización de avalúos", d: "Mantenemos al día el avalúo catastral como base confiable para trámites y tributos.", icon: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></> },
  { n: "03", c: "#F0B63B", cl: "#9A7416", cls: "fn-md", t: "Trámites y mutaciones", d: "Gestionamos mutaciones, rectificaciones y demás trámites catastrales con plena validez legal.", icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 15l2 2 4-4" /></> },
  { n: "04", c: "#C83B45", cls: "fn-md", t: "Información para la planeación", d: "Entregamos datos confiables que orientan el ordenamiento y las decisiones del territorio.", icon: <><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" /><rect x="12" y="7" width="3" height="10" /><rect x="17" y="13" width="3" height="4" /></> },
  { n: "05", c: "#2F6B4F", cls: "fn-sm", t: "Atención a la ciudadanía", d: "Acompañamos al ciudadano en cada consulta y solicitud, con cercanía y respuestas claras.", icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> },
  { n: "06", c: "#0C222F", cls: "fn-lg", t: "Articulación institucional", d: "Trabajamos junto a la Alcaldía de Valledupar para un catastro coordinado y confiable.", icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
];

const OBJETIVOS = [
  { n: "01", c: "#3B85A5", t: "Mantener actualizada la información catastral de todo el municipio." },
  { n: "02", c: "#4E8654", t: "Garantizar la seguridad jurídica de la propiedad de los ciudadanos." },
  { n: "03", c: "#F0B63B", t: "Fortalecer la planeación y el ordenamiento territorial con datos reales." },
  { n: "04", c: "#3B85A5", t: "Fortalecer las finanzas públicas locales con información justa y equitativa." },
  { n: "05", c: "#4E8654", t: "Acercar el catastro a la ciudadanía con atención oportuna y transparente." },
];

const ETAPAS = [
  { c: "#1E5167", t: "Formación", d: "Identificación, recolección e incorporación inicial de la información de la totalidad de los predios.", icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h6" /></> },
  { c: "#3B85A5", t: "Actualización", d: "Identificación, recolección y registro de cambios o inconsistencias en los predios durante un periodo determinado.", icon: <><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></> },
  { c: "#4E8654", t: "Conservación", d: "Mantenimiento permanente y gestión continua de la base de información catastral.", icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></> },
  { c: "#F0B63B", t: "Difusión", d: "Disponibilidad y acceso a la información catastral para su consulta y uso por parte de los ciudadanos.", icon: <><circle cx="12" cy="12" r="2" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14M19.07 4.93a10 10 0 0 1 0 14.14M7.76 7.76a6 6 0 0 0 0 8.48M16.24 7.76a6 6 0 0 1 0 8.48" /></> },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Banner (versión clara y versión adaptada al modo oscuro) */}
      <section className="nos-banner" style={{ background: "#0C222F" }}>
        <Image src="/assets/banner-bienvenidos.png" alt="Bienvenidos a Tu Territorio — Conectamos personas, transformamos lugares" width={1642} height={584} priority sizes="100vw" className="b-light" />
        <Image src="/assets/banner-bienvenidos-dark.png" alt="" aria-hidden="true" width={1642} height={584} sizes="100vw" className="b-dark" />
      </section>

      {/* Quiénes somos */}
      <section className="sec-pad" style={{ background: "#fff" }}>
        <div className="sec-wrap">
          <div className="reveal" data-dir="left" style={{ maxWidth: "54rem" }}>
            <span className="eyebrow-b">Nosotros</span>
            <h1 style={{ margin: "14px 0 0", font: "700 clamp(1.9rem,3.6vw,2.6rem)/1.15 var(--font-sans)", color: "var(--tt-navy-700)" }}><Editable as="span" id="nos.title">Un catastro moderno al servicio de Valledupar</Editable></h1>
            <span className="ribbon5" style={{ margin: "18px 0 0" }} />
            <p style={{ margin: "26px 0 0", font: "400 1.125rem/1.65 var(--font-sans)", color: "var(--tt-gray-700)" }}>Tuterritorio es el operador del <b style={{ color: "var(--tt-navy-700)" }}>Catastro Multipropósito</b> del municipio de Valledupar. Identificamos, actualizamos y custodiamos la información de cada predio para garantizar seguridad jurídica, equidad y una mejor planeación del territorio.</p>
            <p style={{ margin: "18px 0 0", font: "400 1.0625rem/1.65 var(--font-sans)", color: "var(--tt-gray-500)" }}><Editable as="span" id="nos.intro2" multiline>Conocer nuestro territorio para construir nuestro futuro: ese es el propósito que guía cada uno de nuestros procesos y servicios a la ciudadanía.</Editable></p>
          </div>
        </div>
      </section>

      {/* Lo que hacemos / Funciones — composición Bento asimétrica */}
      <section className="sec-pad" style={{ background: "#fff" }}>
        <div className="sec-wrap">
          <div className="reveal" style={{ maxWidth: "46rem" }}>
            <Editable as="h2" id="nos.func-title" className="h2-nos">Lo que hacemos</Editable>
            <p style={{ margin: "16px 0 0", font: "400 1.0625rem/1.6 var(--font-sans)", color: "var(--tt-gray-700)" }}><Editable as="span" id="nos.func-intro" multiline>Gestionamos de forma integral el catastro del municipio, desde el levantamiento de la información hasta la atención de cada trámite ciudadano.</Editable></p>
          </div>
          <div className="func-bento">
            {FUNCIONES.map((f) => (
              <article key={f.t} className={`reveal func-card ${f.cls}`} style={{ "--c": f.c } as React.CSSProperties}>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Misión / Visión */}
      <section className="sec-pad mv-section" style={{ position: "relative", color: "#fff", overflow: "hidden" }}>
        <div className="mv-split reveal">
          <div className="mv-col">
            <h2 className="mv-title">Misión</h2>
            <span className="mv-accent" aria-hidden="true" />
            <p className="mv-text"><Editable as="span" id="nos.mision" multiline>Gestionar de manera integral el catastro multipropósito de Valledupar, generando información predial confiable y actualizada al servicio de la ciudadanía y la administración municipal.</Editable></p>
          </div>
          <span className="mv-line" aria-hidden="true" />
          <div className="mv-col">
            <h2 className="mv-title">Visión</h2>
            <span className="mv-accent" aria-hidden="true" />
            <p className="mv-text"><Editable as="span" id="nos.vision" multiline>Ser un catastro moderno, transparente y cercano, que impulse el desarrollo, la equidad y la planeación sostenible del territorio de Valledupar.</Editable></p>
          </div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="sec-pad" style={{ background: "#fff" }}>
        <div className="sec-wrap">
          <div className="obj-grid">
            <div className="reveal" data-dir="left">
              <span className="eyebrow-b">Objetivos</span>
              <h2 style={{ margin: "14px 0 0", font: "700 clamp(1.9rem,3.4vw,2.5rem)/1.15 var(--font-sans)", color: "var(--tt-navy-700)" }}>Hacia dónde trabajamos</h2>
              <span className="ribbon5" style={{ margin: "18px 0 0" }} />
              <p style={{ margin: "24px 0 0", font: "400 1.0625rem/1.65 var(--font-sans)", color: "var(--tt-gray-500)" }}>Cinco compromisos que orientan nuestra gestión catastral y nuestro servicio diario a la ciudadanía de Valledupar.</p>
            </div>
            <div className="reveal" data-dir="right" style={{ display: "flex", flexDirection: "column" }}>
              {OBJETIVOS.map((o) => (
                <div key={o.n} className="obj-row">
                  <span className="obj-num" style={{ color: o.c }}>{o.n}</span>
                  <p>{o.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Etapas del proceso */}
      <section className="sec-pad" style={{ background: "linear-gradient(180deg,#E8F1F5 0%,#F3F8FA 100%)" }}>
        <div className="sec-wrap">
          <div className="reveal" style={{ textAlign: "center", maxWidth: "44rem", margin: "0 auto 56px" }}>
            <h2 className="h2-nos">Etapas del proceso catastral</h2>
            <p style={{ margin: "14px 0 0", font: "400 1.0625rem/1.6 var(--font-sans)", color: "var(--tt-gray-500)" }}>Así avanzamos, paso a paso, hasta tener un catastro actualizado y al servicio de la gente.</p>
            <span className="ribbon5 center" style={{ marginTop: 18, width: 110, height: 4 }} />
          </div>
          <div className="etapas-stairs reveal">
            {ETAPAS.map((e, i) => (
              <div key={e.t} className="stair" style={{ "--c": e.c, "--h": `${40 + i * 20}%` } as React.CSSProperties}>
                <div className="stair-track">
                  <div className="stair-fill" />
                </div>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestras instalaciones */}
      <section className="sec-pad" style={{ background: "#fff", paddingBottom: "clamp(5rem,9vw,8rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="inst-grid">
            <div className="reveal" data-dir="left">
              <span className="eyebrow-b">Nuestras instalaciones</span>
              <h2 style={{ margin: "14px 0 0", font: "700 clamp(1.9rem,3.4vw,2.5rem)/1.15 var(--font-sans)", color: "var(--tt-navy-700)" }}>Conoce dónde te atendemos</h2>
              <span className="ribbon5" style={{ margin: "18px 0 0" }} />
              <p style={{ margin: "24px 0 0", font: "400 1.125rem/1.65 var(--font-sans)", color: "var(--tt-gray-700)" }}>Te invitamos a recorrer las oficinas y los espacios donde trabajamos cada día al servicio de la ciudadanía de Valledupar.</p>
              <p style={{ margin: "16px 0 0", font: "400 1.0625rem/1.65 var(--font-sans)", color: "var(--tt-gray-500)" }}>Un equipo cercano y comprometido, listo para acompañarte en cada consulta y trámite catastral.</p>
            </div>
            {/* Video vertical (9:16) de las instalaciones */}
            <div className="reveal video-frame" data-dir="right">
              <video
                controls
                playsInline
                preload="metadata"
                aria-label="Video de las instalaciones de Tuterritorio"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "#0C222F" }}
              >
                <source src="/assets/instalaciones.mp4" type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
