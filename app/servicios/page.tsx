import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: "Trámites y servicios — Tuterritorio",
  description:
    "Trámites y productos catastrales de Tuterritorio (Catastro de Valledupar): actualiza, corrige y consulta información de predios y propietarios.",
};

/* ---- Mapa de íconos (line, estilo Lucide) tomado del handoff ---- */
const P = (d: string) => <path d={d} />;
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

const Icon = ({ name }: { name: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {ICONS[name] ?? <circle cx="12" cy="12" r="9" />}
  </svg>
);

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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tt-lime-400)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
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
              <div className="tr-card" key={i} tabIndex={0} aria-label={`${t.title}. ${t.tiempo}, ${t.costo}.`}>
                <div className="tr-face">
                  <span className="tr-ic"><Icon name={t.icon} /></span>
                  <h3 className="tr-title">{t.title}</h3>
                  <p className="tr-desc">{t.desc}</p>
                  <div className="tr-facemeta">
                    <span className="tr-tag"><Clock /> {t.tiempo}</span>
                    <span className="tr-tag">{t.costo}</span>
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
