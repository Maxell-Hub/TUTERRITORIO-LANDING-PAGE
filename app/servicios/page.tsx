import type { Metadata } from "next";
import Image from "next/image";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Trámites y servicios",
  alternates: { canonical: "/servicios" },
  description:
    "Trámites y productos catastrales de Tuterritorio (Catastro de Valledupar): actualiza, corrige y consulta información de predios y propietarios.",
};

/* ---- Foto temática por tipo de trámite (cada tarjeta lleva su imagen) ----
   Imágenes de Unsplash (licencia libre), optimizadas por next/image. */
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=70`;
const PHOTOS: Record<string, string> = {
  areacatastral: U("photo-1448630360428-65456885c650"), // vista aérea urbana
  arearegistral: U("photo-1500382017468-9049fed747ef"), // campos / terreno rural
  desenglobe: U("photo-1574323347407-f5e1ad6d020b"),    // parcelas aéreas divididas
  englobe: U("photo-1524661135-423995f22d0b"),           // mapa / territorio
  inscripcion: U("photo-1568605114967-8130f3a36994"),    // casa / vivienda
  revision: U("photo-1554224155-6726b3ff858f"),          // avalúo / finanzas
  destino: U("photo-1486406146926-c627a92ad1ab"),        // edificios / uso del suelo
  direccion: U("photo-1560518883-ce09059eeffa"),         // vivienda / dirección
  nombre: U("photo-1450101499163-c8848c66ca85"),         // firmar / escribir
  documento: U("photo-1554224154-26032ffc0d07"),         // documentos
  propietario: U("photo-1582407947304-fd86f028f716"),    // llaves / propietario
  matricula: U("photo-1486325212027-8081e485255e"),      // plano / blueprint
};

/* ===========================================================================
   DISEÑO DE LA TARJETA — cambia este valor para probar cada estilo:
     "numero"  → número índice grande con acento de color (sin íconos ni fotos)
     "foto"    → portada con fotografía real (Unsplash)
     "grafica" → portada con degradado temático + ilustración (sin fotos)
     "icono"   → ícono grande a color sobre fondo tenue (sin fotos)
   =========================================================================== */
const DESIGN: "numero" | "foto" | "grafica" | "icono" = "numero";

/* Colores corporativos para los números (rotan por tarjeta). */
const BRAND = ["var(--tt-navy-700)", "var(--tt-blue-700)", "var(--tt-green-600)", "var(--tt-lime-500)"];

/* ---- Íconos de línea (estilo Lucide) para las variantes "grafica" e "icono" ---- */
const ICONS: Record<string, React.ReactNode> = {
  areacatastral: <><path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z" /><path d="M7.5 10.5l1.5 1.5M10.5 7.5l2 2M13.5 4.5l1.5 1.5" /></>,
  arearegistral: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M10.5 13.5 8 16l-.5 2.5 2.5-.5 2.5-2.5a1 1 0 0 0 0-1.4l-.6-.6a1 1 0 0 0-1.4 0Z" /></>,
  desenglobe: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></>,
  englobe: <><path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" /><rect x="8" y="8" width="8" height="8" rx="1" /></>,
  inscripcion: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><path d="M12 7v6M9 10h6" /></>,
  revision: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7" /><path d="M14 2v6h6" /><circle cx="16" cy="16" r="3" /><path d="m21 21-1.5-1.5" /></>,
  destino: <><path d="M3 21h18M5 21V10l7-5 7 5v11" /><path d="M9 21v-6h6v6" /><path d="M3 10h18" /></>,
  direccion: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  nombre: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 12 0v1" /><path d="M18 8h4M20 6v4" /></>,
  documento: <><rect x="2" y="4" width="20" height="16" rx="2" /><circle cx="8" cy="11" r="2.4" /><path d="M4.5 17a3.5 3.5 0 0 1 7 0" /><path d="M14 9h5M14 13h5M14 16h3" /></>,
  propietario: <><path d="M16 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  matricula: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></>,
};
const BigIcon = ({ name }: { name: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {ICONS[name] ?? <circle cx="12" cy="12" r="9" />}
  </svg>
);

/* ---- Tema de color por tipo de trámite (degradado para "grafica", tinte para "icono") ---- */
const THEMES: Record<string, { grad: string; tint: string; ink: string }> = {
  areacatastral: { grad: "linear-gradient(135deg,#2a7fc0,#0b2133)", tint: "#e3eef8", ink: "#1d6fb8" },
  arearegistral: { grad: "linear-gradient(135deg,#2fa873,#0e5a3a)", tint: "#e1f3ea", ink: "#1f8b56" },
  desenglobe:    { grad: "linear-gradient(135deg,#2ba0c0,#11475e)", tint: "#e0f1f6", ink: "#1c84a3" },
  englobe:       { grad: "linear-gradient(135deg,#4884cc,#1b3a66)", tint: "#e6edf9", ink: "#2f63ad" },
  inscripcion:   { grad: "linear-gradient(135deg,#36b07c,#155e3f)", tint: "#e2f4ec", ink: "#1f9162" },
  revision:      { grad: "linear-gradient(135deg,#e0a534,#9a6410)", tint: "#fbf0d9", ink: "#b27d18" },
  destino:       { grad: "linear-gradient(135deg,#5b8def,#22357f)", tint: "#e7ecfb", ink: "#3f63c9" },
  direccion:     { grad: "linear-gradient(135deg,#2bb6a8,#115e58)", tint: "#dff4f1", ink: "#1b938a" },
  nombre:        { grad: "linear-gradient(135deg,#7090c8,#2b3f6b)", tint: "#e8edf7", ink: "#4d6aa6" },
  documento:     { grad: "linear-gradient(135deg,#5180b8,#1f3a5c)", tint: "#e5edf6", ink: "#3a679c" },
  propietario:   { grad: "linear-gradient(135deg,#3fae70,#155e3a)", tint: "#e2f3ea", ink: "#22925d" },
  matricula:     { grad: "linear-gradient(135deg,#647596,#2b3548)", tint: "#eaedf3", ink: "#4d5b78" },
};
const themeOf = (k: string) => THEMES[k] ?? THEMES.matricula;

/* ---- Documentos compartidos (texto exacto del handoff/PDF) ---- */
const docSolicitud = "Solicitud del trámite con datos de notificación (celular, correo y dirección)";
const docIdentidad = "Copia del documento de identidad del propietario";
const docEscritura = "Copia de la escritura pública";
const docCLT = "Copia del certificado de libertad y tradición actualizado";
const docCLT30 = "Copia del certificado de libertad y tradición actualizado (no mayor a 30 días)";
const docPredioRural = "Plano topográfico con medidas legibles y cuadro de coordenadas en formato DWG versión 2007, georreferenciado en Magna Sirgas (predios rurales)";
const planos = "Copia de planos en escala original, aprobados por curaduría u oficina de planeación";
const ph = "PH: copia de la escritura del reglamento de propiedad horizontal, sus modificaciones y planos (cuando aplique)";

type Tramite = { icon: string; title: string; desc: string; tiempo: string; costo: string; reqs: string[] };

const productosDocs = ["Fotocopia de la cédula", "Certificado de libertad y tradición o recibo del impuesto predial"];

const TRAMITES: Tramite[] = [
  // Sin costo — Hasta 2 meses
  { icon: "areacatastral", title: "Incorporación de área", desc: "Registro inicial del área de un predio dentro de la base catastral.", tiempo: "Hasta 2 meses", costo: "Sin costo", reqs: [docSolicitud, docIdentidad, docEscritura, docCLT, docPredioRural] },
  { icon: "arearegistral", title: "Rectificación de área", desc: "Corrección del área del terreno cuando difiere de la realidad física o registral.", tiempo: "Hasta 2 meses", costo: "Sin costo", reqs: [docSolicitud, docIdentidad, docEscritura, docCLT, docPredioRural] },
  { icon: "desenglobe", title: "Desenglobe", desc: "División de un predio en dos o más inmuebles independientes.", tiempo: "Hasta 2 meses", costo: "Sin costo", reqs: [docSolicitud, docCLT, docEscritura, planos, ph, docPredioRural] },
  { icon: "englobe", title: "Englobe", desc: "Unificación de dos o más predios en un solo inmueble.", tiempo: "Hasta 2 meses", costo: "Sin costo", reqs: [docSolicitud, docCLT, docEscritura, planos, ph, docPredioRural] },
  { icon: "inscripcion", title: "Inscripción de predio", desc: "Registro inicial de un predio o mejora dentro de la información catastral.", tiempo: "Hasta 2 meses", costo: "Sin costo", reqs: [docSolicitud, docIdentidad, docCLT30, "Copia de escritura pública o resolución de adjudicación", docPredioRural] },
  { icon: "revision", title: "Avalúo catastral", desc: "Revisión del avalúo catastral; debe presentarse por escrito indicando la(s) vigencia(s) objeto de petición.", tiempo: "Hasta 2 meses", costo: "Sin costo", reqs: ["Solicitud por escrito con precisión de la(s) vigencia(s) objeto de petición", "Pruebas que fundamenten las variaciones por cambios físicos, valorización o cambios de uso o mercado inmobiliario", "Planos, certificaciones de autoridades, orto/aerofotografías, avalúos comerciales o escrituras que demuestren los cambios"] },
  // Sin costo — Hasta 1 mes
  { icon: "destino", title: "Cambio de destino", desc: "Actualización del uso o destino económico asignado al predio.", tiempo: "Hasta 1 mes", costo: "Sin costo", reqs: [docSolicitud, docIdentidad, docCLT] },
  // Sin costo — Hasta 15 días
  { icon: "direccion", title: "Rectificación de dirección", desc: "Corrección de la dirección o nomenclatura registrada del predio.", tiempo: "Hasta 15 días", costo: "Sin costo", reqs: [docSolicitud, docIdentidad, "Certificado de nomenclatura"] },
  { icon: "nombre", title: "Rectificación de nombre", desc: "Corrección del nombre del propietario en la base catastral.", tiempo: "Hasta 15 días", costo: "Sin costo", reqs: [docSolicitud, docIdentidad] },
  { icon: "documento", title: "Rectificación de documento de identidad", desc: "Corrección del número o tipo de documento del propietario.", tiempo: "Hasta 15 días", costo: "Sin costo", reqs: [docSolicitud, docIdentidad] },
  { icon: "propietario", title: "Cambio de propietario", desc: "Actualización catastral cuando el predio cambia de dueño.", tiempo: "Hasta 15 días", costo: "Sin costo", reqs: [docSolicitud, docIdentidad, docCLT30] },
  // Productos catastrales — Con costo, Hasta 15 días
  { icon: "matricula", title: "Certificado plano predial", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días", costo: "$52.500", reqs: productosDocs },
  { icon: "documento", title: "Certificado catastral especial", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días", costo: "$52.200", reqs: productosDocs },
  { icon: "matricula", title: "Fotocopia de la ficha predial", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días", costo: "$68.500", reqs: productosDocs },
  { icon: "areacatastral", title: "Carta catastral urbana", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días", costo: "$57.900", reqs: productosDocs },
  { icon: "arearegistral", title: "Carta catastral rural", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días", costo: "$76.400", reqs: productosDocs },
  { icon: "inscripcion", title: "Certificado catastral nacional", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días", costo: "$10.000", reqs: productosDocs },
];

const period = (s: string) => (s.trim().endsWith(".") ? s : s + ".");

const Clock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const Check = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function ServiciosPage() {
  return (
    <>
      {/* Banner de título */}
      <section className="serv-banner">
        <div className="blobA" />
        <div className="blobB" />
        <div className="serv-banner-row">
          <div style={{ maxWidth: "40rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 999, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)", font: "700 0.75rem/1 var(--font-sans)", letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tt-lime-400)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
              Catastro Multipropósito · Valledupar
            </span>
            <Editable as="h1" id="serv.title">Trámites y servicios</Editable>
            <span style={{ display: "block", height: 5, width: 132, borderRadius: 999, background: "var(--ribbon)", margin: "18px 0" }} />
            <p style={{ margin: 0, maxWidth: "44em", font: "400 1.125rem/1.6 var(--font-sans)", color: "rgba(255,255,255,.84)" }}><Editable as="span" id="serv.intro" multiline>Actualiza, corrige y consulta información de predios y propietarios de manera ágil, segura y confiable.</Editable></p>
          </div>
          <div className="serv-count">
            <span style={{ font: "800 clamp(2rem,4vw,2.8rem)/1 var(--font-sans)", color: "var(--tt-lime-400)" }}>17</span>
            <span style={{ font: "500 0.875rem/1.3 var(--font-sans)", color: "rgba(255,255,255,.86)" }}>trámites y<br />productos</span>
          </div>
        </div>
      </section>

      {/* Grilla de trámites */}
      <section id="tramites" className="serv-section">
        <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto" }}>
          <div className="serv-head">
            <span className="bar" />
            <Editable as="h2" id="serv.section-title">Selecciona el trámite que necesitas</Editable>
            <span style={{ marginLeft: 6, font: "500 0.875rem/1 var(--font-sans)", color: "var(--tt-gray-500)" }}>Pasa el cursor (o enfoca con teclado) sobre cada tarjeta para ver los documentos requeridos.</span>
          </div>

          <div className="tr-grid">
            {TRAMITES.map((t, i) => (
              <div className={`tr-card design-${DESIGN}`} key={i} tabIndex={0} aria-label={`${t.title}. ${t.tiempo}, ${t.costo}.`}
                style={DESIGN === "numero" ? ({ ["--accent" as string]: BRAND[i % BRAND.length] }) : undefined}>
                <div className="tr-face">
                  {DESIGN === "numero" && (
                    <div className="tr-numhead">
                      <span className="tr-index">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`tr-cost-n ${t.costo === "Sin costo" ? "free" : "paid"}`}>{t.costo}</span>
                    </div>
                  )}
                  {DESIGN === "foto" && (
                    <div className="tr-cover">
                      <Image className="tr-cover-img" src={PHOTOS[t.icon] ?? PHOTOS.matricula} alt="" fill sizes="(max-width: 700px) 100vw, 320px" />
                      <span className={`tr-cost ${t.costo === "Sin costo" ? "free" : "paid"}`}>{t.costo}</span>
                    </div>
                  )}
                  {DESIGN === "grafica" && (
                    <div className="tr-cover tr-cover-g" style={{ background: themeOf(t.icon).grad }}>
                      <span className="tr-glyph-bg" aria-hidden="true"><BigIcon name={t.icon} /></span>
                      <span className="tr-glyph"><BigIcon name={t.icon} /></span>
                      <span className={`tr-cost ${t.costo === "Sin costo" ? "free" : "paid"}`}>{t.costo}</span>
                    </div>
                  )}
                  {DESIGN === "icono" && (
                    <div className="tr-iconwrap" style={{ background: themeOf(t.icon).tint, color: themeOf(t.icon).ink }}>
                      <span className="tr-glyph-lg"><BigIcon name={t.icon} /></span>
                    </div>
                  )}
                  <div className="tr-body">
                    <h3 className="tr-title">{t.title}</h3>
                    <p className="tr-desc">{t.desc}</p>
                    <div className="tr-facemeta">
                      <span className="tr-tag"><Clock /> {t.tiempo}</span>
                      {DESIGN === "icono" && (
                        <span className={`tr-tag ${t.costo === "Sin costo" ? "free" : ""}`}>{t.costo}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="tr-detail">
                  <span className="lbl">Documentos requeridos</span>
                  <ul className="tr-reqs">
                    {t.reqs.map((r, j) => (
                      <li key={j}><Check /> {period(r)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="serv-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <Editable as="span" id="serv.precio-nota">Los valores de los trámites y productos catastrales son establecidos por la Alcaldía de Valledupar y pueden variar según la vigencia.</Editable>
          </p>
        </div>
      </section>
    </>
  );
}
