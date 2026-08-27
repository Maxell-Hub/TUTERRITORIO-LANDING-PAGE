/** Índice de búsqueda del sitio, compartido por el buscador del encabezado
 *  (SearchBar) y la página de resultados (/buscar). */

export type SearchItem = {
  title: string;
  titleEn?: string;
  desc?: string;
  descEn?: string;
  keywords?: string; // solo para coincidencias (no se muestra)
  href: string;
  cat: string;
  catEn?: string;
};

export const normSearch = (s: string) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Páginas y secciones fijas del sitio, con texto en español e inglés.
 *  Cubre TODO el sitio actual: páginas del menú, las 10 subsecciones de
 *  Transparencia, recursos, legales y documentos clave. */
export const STATIC_ITEMS: SearchItem[] = [
  { title: "Inicio", titleEn: "Home", desc: "Consulta tu predio: linderos, área y avalúo.", descEn: "Check your property: boundaries, area and appraisal.", keywords: "catastro multipropósito impuesto predial visor · cadastre property tax viewer", href: "/", cat: "Inicio", catEn: "Home" },
  { title: "Nosotros", titleEn: "About us", desc: "Quiénes somos, misión, visión, funciones y etapas del proceso catastral.", descEn: "Who we are, mission, vision, functions and cadastral process stages.", keywords: "operador catastral objetivos formación actualización conservación difusión instalaciones video · cadastral operator mission vision stages", href: "/nosotros", cat: "Nosotros", catEn: "About" },
  { title: "Nuestro equipo", titleEn: "Our team", desc: "El equipo de Tuterritorio: liderazgo y equipo técnico.", descEn: "The Tuterritorio team: leadership and technical staff.", keywords: "liderazgo integrantes técnico jurídico · staff leadership members", href: "/nosotros/equipo", cat: "Nosotros", catEn: "About" },
  { title: "Trámites y servicios", titleEn: "Procedures and services", desc: "Los 18 trámites y productos catastrales, con requisitos, tiempos y costos.", descEn: "The 18 cadastral procedures and products, with requirements, times and costs.", keywords: "incorporación rectificación desenglobe englobe inscripción avalúo mutación cambio de propietario certificado costos · area registration change of owner certificate costs subdivision merger appraisal valuation address name correction property record urban rural chart free", href: "/servicios", cat: "Servicios", catEn: "Services" },
  { title: "Atención a la ciudadanía", titleEn: "Citizen services", desc: "Canales de atención, preguntas frecuentes y carta de trato digno.", descEn: "Service channels, FAQ and dignified treatment charter.", keywords: "elige cómo quieres que te atendamos sede horarios · customer service channels", href: "/atencion-ciudadania", cat: "Atención", catEn: "Attention" },
  { title: "Carta de trato digno", titleEn: "Dignified treatment charter", desc: "Documento con los derechos de los ciudadanos y los medios para garantizarlos (PDF).", descEn: "Document with citizens' rights and the means to guarantee them (PDF).", keywords: "derechos deberes ley 1437 documento pdf · rights duties charter", href: "/atencion-ciudadania#carta-trato-digno", cat: "Atención", catEn: "Attention" },
  { title: "Preguntas frecuentes", titleEn: "Frequently asked questions", desc: "Respuestas sobre trámites, avalúos, impuesto predial y PQRSD.", descEn: "Answers about procedures, appraisals, property tax and complaints.", keywords: "faq dudas abc cédula catastral tiempos respuestas · faq questions answers", href: "/preguntas-frecuentes", cat: "Atención", catEn: "Attention" },
  { title: "Transparencia", titleEn: "Transparency", desc: "Transparencia y acceso a la información pública (Ley 1712, Res. 1519).", descEn: "Transparency and access to public information.", keywords: "información pública mintic índice · public information index", href: "/transparencia", cat: "Transparencia", catEn: "Transparency" },
  { title: "Información de la entidad", titleEn: "Entity information", desc: "Contacto, sedes, normograma, estructura orgánica y directorio.", descEn: "Contact, offices, legal framework, structure and directory.", keywords: "organigrama entes de control horarios transparencia 1 · structure directory", href: "/transparencia/informacion-entidad", cat: "Transparencia", catEn: "Transparency" },
  { title: "Normativa (Transparencia)", titleEn: "Regulations (Transparency)", desc: "Normas que rigen la entidad y proyectos normativos.", descEn: "Rules governing the entity and draft regulations.", keywords: "leyes decretos transparencia 2 · laws decrees", href: "/transparencia/normativa", cat: "Transparencia", catEn: "Transparency" },
  { title: "Trámites (Transparencia)", titleEn: "Procedures (Transparency)", desc: "Listado de trámites y servicios con enlace al SUIT.", descEn: "List of procedures and services with SUIT link.", keywords: "suit transparencia 5 · procedures list", href: "/transparencia/tramites", cat: "Transparencia", catEn: "Transparency" },
  { title: "Participa", titleEn: "Participate", desc: "Espacios de participación ciudadana: diagnóstico, planeación, control social y rendición de cuentas.", descEn: "Citizen participation: diagnosis, planning, social control and accountability.", keywords: "participación ciudadana fases control social rendición de cuentas transparencia 6 · citizen participation accountability", href: "/transparencia/participa", cat: "Transparencia", catEn: "Transparency" },
  { title: "Datos abiertos", titleEn: "Open data", desc: "Conjuntos de datos publicados en datos.gov.co.", descEn: "Datasets published on datos.gov.co.", keywords: "open data transparencia 7 · datasets", href: "/transparencia/datos-abiertos", cat: "Transparencia", catEn: "Transparency" },
  { title: "Información para grupos de interés", titleEn: "Information for stakeholders", desc: "Información para poblaciones y grupos específicos.", descEn: "Information for specific populations and groups.", keywords: "niños jóvenes étnicos transparencia 8 · stakeholders", href: "/transparencia/grupos-interes", cat: "Transparencia", catEn: "Transparency" },
  { title: "Obligación de reporte de información", titleEn: "Mandatory reporting", desc: "Información que la entidad reporta a organismos de control.", descEn: "Information reported to control bodies.", keywords: "contraloría procuraduría transparencia 9 · reporting control", href: "/transparencia/reporte-informacion", cat: "Transparencia", catEn: "Transparency" },
  { title: "Protección de datos personales", titleEn: "Personal data protection", desc: "Política de tratamiento de datos y derechos de los titulares.", descEn: "Data processing policy and data subjects' rights.", keywords: "habeas data ley 1581 transparencia 10 · privacy data protection", href: "/transparencia/proteccion-datos", cat: "Transparencia", catEn: "Transparency" },
  { title: "Normativas", titleEn: "Regulations", desc: "Leyes, decretos y resoluciones del catastro.", descEn: "Cadastral laws, decrees and resolutions.", keywords: "acuerdos marco legal igac recursos normograma · legal framework", href: "/recursos/normativas", cat: "Recursos", catEn: "Resources" },
  { title: "ABC Catastral", titleEn: "Cadastral glossary", desc: "Glosario con los términos clave del catastro, con buscador.", descEn: "Glossary of key cadastral terms, searchable.", keywords: "definiciones conceptos abc glosario · definitions concepts", href: "/recursos/glosario", cat: "Recursos", catEn: "Resources" },
  { title: "Noticias", titleEn: "News", desc: "Sala de prensa y novedades del catastro.", descEn: "Press room and cadastre updates.", keywords: "actualización catastral comunidad prensa · press updates community", href: "/noticias", cat: "Noticias", catEn: "News" },
  { title: "Contáctenos", titleEn: "Contact us", desc: "Formulario de contacto, sede, horario y mapa para llegar.", descEn: "Contact form, office, opening hours and map.", keywords: "sede caja agraria mapa ubicación escribir teléfono correo cómo llegar · office hours map location phone email", href: "/contactos", cat: "Contactos", catEn: "Contact" },
  { title: "PQRSD", titleEn: "Complaints (PQRSD)", desc: "Radica peticiones, quejas, reclamos, sugerencias y denuncias en línea.", descEn: "File petitions, complaints, claims, suggestions and reports online.", keywords: "radicado formulario solicitud denuncias sugerencias · requests suggestions reports filing", href: "/pqrsd", cat: "Contactos", catEn: "Contact" },
  { title: "Mapa del sitio", titleEn: "Site map", desc: "Todas las páginas del sitio organizadas por sección.", descEn: "All site pages organized by section.", keywords: "navegación índice páginas · navigation index", href: "/mapa-del-sitio", cat: "Sitio", catEn: "Site" },
  { title: "Accesibilidad", titleEn: "Accessibility", desc: "Declaración de accesibilidad web del sitio.", descEn: "Web accessibility statement.", keywords: "wcag contraste teclado lector de pantalla · accessibility screen reader keyboard", href: "/accesibilidad", cat: "Sitio", catEn: "Site" },
  { title: "Política de tratamiento de datos", titleEn: "Data processing policy", desc: "Política de privacidad y tratamiento de datos personales.", descEn: "Privacy and personal data processing policy.", keywords: "privacidad habeas data ley 1581 · privacy policy", href: "/politica-tratamiento-datos", cat: "Sitio", catEn: "Site" },
  { title: "Términos y condiciones", titleEn: "Terms and conditions", desc: "Términos y condiciones de uso del sitio.", descEn: "Website terms and conditions of use.", keywords: "condiciones legales uso · legal terms", href: "/terminos-y-condiciones", cat: "Sitio", catEn: "Site" },
];

/** Filtra y ordena por relevancia (coincidencia en título primero). */
export function searchItems(q: string, extra: SearchItem[] = [], limit?: number): SearchItem[] {
  const nq = normSearch(q).trim();
  if (!nq) return [];
  const words = nq.split(/\s+/);
  const all = [...STATIC_ITEMS, ...extra];
  const ranked = all
    .map((it) => {
      const hayTitle = normSearch(`${it.title} ${it.titleEn || ""}`);
      const hay = hayTitle + " " + normSearch(`${it.desc || ""} ${it.descEn || ""} ${it.keywords || ""} ${it.cat} ${it.catEn || ""}`);
      if (!words.every((w) => hay.includes(w))) return null;
      const score = words.every((w) => hayTitle.includes(w)) ? 0 : 1;
      return { it, score };
    })
    .filter((r): r is { it: SearchItem; score: number } => r !== null)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.it);
  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}
