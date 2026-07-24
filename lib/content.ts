/**
 * Tipos y contenido por defecto (semilla) del sitio editable.
 *
 * Cada "key" corresponde a un archivo /data/<key>.json. Si el archivo no existe
 * todavía, se usa este valor por defecto, de modo que el sitio siempre muestra
 * contenido aunque el administrador no haya editado nada.
 */

export type News = {
  id: string;
  categoria: string;
  badge: string;
  fecha: string;
  titulo: string;
  extracto: string;
  imagen: string;
  /** Texto completo de la noticia (párrafos separados por línea en blanco).
   *  Si falta, la página de detalle muestra el extracto. */
  cuerpo?: string;
};

export const NEWS_CATEGORIES = [
  "Actualización catastral",
  "Avalúos",
  "Trámites",
  "Comunidad",
];

/** Paleta sugerida por categoría para el badge de la noticia. */
export const CATEGORY_BADGE: Record<string, string> = {
  "Actualización catastral": "var(--tt-green-600)",
  "Avalúos": "var(--tt-blue-700)",
  "Trámites": "var(--tt-amber-600)",
  "Comunidad": "var(--tt-teal-500)",
};

export const DEFAULT_NOTICIAS: News[] = [
  {
    id: "n-2026-07-24",
    categoria: "Actualización catastral",
    badge: "var(--tt-green-600)",
    fecha: "24 de julio de 2026",
    titulo:
      "Las mesas colaborativas continúan acercando el Catastro Multipropósito a la comunidad en Valledupar",
    extracto:
      "Las jornadas avanzan esta semana en Brisas de La Popa (Comuna 5): orientación personalizada sobre los procesos catastrales y registro de información de las construcciones y ocupaciones del sector.",
    imagen: "/assets/noticias/noticia-mesas.webp",
    cuerpo:
      "El proceso de Actualización Catastral con Enfoque Multipropósito continúa fortaleciendo su presencia en los barrios de Valledupar a través de las mesas colaborativas, una estrategia que busca acercar el servicio público de catastro a la ciudadanía. Durante esta semana, las jornadas se desarrollan en el sector de Brisas de La Popa, en la Comuna 5, donde los habitantes han recibido orientación personalizada para resolver inquietudes sobre los diferentes procesos catastrales y aportar información relacionada con las construcciones y ocupaciones existentes en el sector.\n\nEstos espacios promueven un trabajo cercano entre la comunidad y el equipo técnico encargado del proceso, permitiendo complementar y validar la información catastral con el apoyo de quienes habitan el territorio. Además de facilitar el acceso a este servicio, las mesas colaborativas y las jornadas de inscripción de informalidad constituyen una oportunidad para que las personas que ocupan o tienen derechos sobre construcciones ubicadas en predios que no cuentan con una situación de propiedad plenamente formalizada puedan registrar y actualizar su información dentro de la base catastral.\n\nEs importante recordar que el catastro no otorga títulos de propiedad, no legaliza predios ni resuelve conflictos de dominio. Su función es recopilar y mantener actualizada la información física, jurídica y económica de los inmuebles, conforme a la realidad observada en el territorio.\n\nLas jornadas continuarán realizándose en diferentes sectores de la ciudad, con el propósito de seguir acercando el catastro multipropósito a más familias vallenatas y consolidar un proceso participativo, transparente y al servicio de la comunidad.",
  },
  {
    id: "n-2026-07-24-usuarios",
    categoria: "Comunidad",
    badge: "var(--tt-teal-500)",
    fecha: "24 de julio de 2026",
    titulo: "Tuterritorio ha atendido a 5.741 usuarios en lo que va de 2026",
    extracto:
      "La oficina de gestión catastral y los canales en línea acompañan a cada vez más ciudadanos en sus trámites catastrales y de avalúo.",
    imagen: "/assets/noticias/noticia-usuarios.webp",
    cuerpo:
      "En lo corrido de 2026, Tuterritorio ha atendido a 5.741 usuarios entre la sede principal y los canales en línea. La cifra refleja la confianza creciente de la ciudadanía en el gestor catastral del municipio y el esfuerzo del equipo por dar respuesta oportuna a cada solicitud.\n\nLos trámites más frecuentes son el cambio de propietario, las rectificaciones de área y de datos del propietario, y la expedición de certificados catastrales. Cada trámite tiene definidos sus requisitos y tiempos de respuesta, que puedes consultar en la sección de Trámites y servicios.\n\nRecuerda que también puedes radicar tus peticiones, quejas, reclamos, sugerencias y denuncias a través del formulario PQRSD de este sitio, con radicado inmediato y seguimiento en línea. Nuestro compromiso es que la información catastral de Valledupar esté al día y al servicio de todos.",
  },
];

/* ------------------------------------------------------------------ */
/* NORMATIVAS                                                          */
/* ------------------------------------------------------------------ */

export type Norm = { id: string; cat: string; code: string; desc: string; href: string };

/** Categorización estilo normograma institucional. */
export const NORM_CATEGORIES = ["Normas generales aplicables", "Resoluciones y actas internas", "Manuales, políticas y reglamentos"];

/* Ordenadas de más reciente a más antigua (las normas sin año, al final). */
export const DEFAULT_NORMATIVAS: Norm[] = [
  { id: "norm-008", cat: "Normas generales aplicables", code: "Resolución 1149 de 2021 — IGAC", desc: "Adopta las especificaciones técnicas para los productos de la gestión catastral multipropósito.", href: "https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/normograma/resolucion-1149-de-2021" },
  { id: "norm-006", cat: "Normas generales aplicables", code: "Decreto 148 de 2020", desc: "Reglamenta la gestión catastral y define los roles de gestores y operadores catastrales.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=108609" },
  { id: "norm-009", cat: "Normas generales aplicables", code: "Resolución 509 de 2020 — IGAC", desc: "Establece las condiciones para la habilitación de los gestores catastrales en el territorio nacional.", href: "https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/normograma/resolucion-no-509-de-2020" },
  { id: "norm-010", cat: "Normas generales aplicables", code: "Resolución 388 de 2020 — IGAC", desc: "Define las especificaciones técnicas para el levantamiento y los productos catastrales.", href: "https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/normograma/resolucion-no-388-de-2020" },
  { id: "norm-011", cat: "Normas generales aplicables", code: "Resolución 471 de 2020 — IGAC", desc: "Fija los estándares y procedimientos para el levantamiento catastral con enfoque multipropósito.", href: "https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/normograma/resolucion-no-471-de-2020" },
  { id: "norm-001", cat: "Normas generales aplicables", code: "Ley 1955 de 2019", desc: "Plan Nacional de Desarrollo 2018–2022. Establece el catastro multipropósito y su prestación como servicio público.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=93970" },
  { id: "norm-005", cat: "Normas generales aplicables", code: "Decreto 1983 de 2019", desc: "Reglamenta la prestación del servicio público de gestión catastral con enfoque multipropósito.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=102767" },
  { id: "norm-007", cat: "Normas generales aplicables", code: "Decreto 1170 de 2015", desc: "Decreto Único Reglamentario del sector administrativo de información estadística (DANE–IGAC).", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=77345" },
  { id: "norm-004", cat: "Normas generales aplicables", code: "Ley 1581 de 2012", desc: "Régimen general de protección de datos personales, aplicable al tratamiento de la información catastral.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981" },
  { id: "norm-003", cat: "Normas generales aplicables", code: "Ley 44 de 1990", desc: "Crea el Impuesto Predial Unificado y regula su liquidación a partir del avalúo catastral.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=296" },
  { id: "norm-002", cat: "Normas generales aplicables", code: "Ley 14 de 1983", desc: "Fortalece los fiscos municipales y fija las bases técnicas para la formación y el avalúo catastral.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=267" },
  { id: "norm-012", cat: "Normas generales aplicables", code: "Acuerdo Municipal — Gestor Catastral", desc: "Habilita a Valledupar para asumir la gestión catastral de su territorio a través de Tuterritorio.", href: "#" },
  { id: "norm-013", cat: "Normas generales aplicables", code: "Estatuto Tributario Municipal", desc: "Regula el Impuesto Predial Unificado y demás tributos del municipio de Valledupar.", href: "#" },
  { id: "norm-014", cat: "Manuales, políticas y reglamentos", code: "Política de Tratamiento de Datos Personales", desc: "Política institucional de Tuterritorio para el tratamiento de datos personales, conforme a la Ley 1581 de 2012.", href: "/politica-tratamiento-datos" },
];

/* ------------------------------------------------------------------ */
/* GLOSARIO                                                            */
/* ------------------------------------------------------------------ */

export type GlossMore = { label: string; text: string };
export type Term = { id: string; term: string; def: string; more?: GlossMore[] };

export const DEFAULT_GLOSARIO: Term[] = [
  { id: "g-001", term: "Actualización catastral", def: "Proceso mediante el cual se renueva la información de los predios para que refleje sus condiciones físicas, jurídicas y económicas actuales." },
  { id: "g-002", term: "Alcaldía", def: "Es el edificio, sede u órgano administrativo que representa institucionalmente al municipio.", more: [
    { label: "Función", text: "Administra los recursos públicos locales y presta servicios esenciales como agua potable, recolección de basura, mantenimiento de espacios públicos y seguridad." },
    { label: "Liderazgo", text: "Está dirigida por un alcalde, elegido por voto popular, quien se encarga de cumplir y hacer cumplir las leyes locales y nacionales." },
    { label: "Más información", text: "Consulta la guía de la Rama Ejecutiva – Orden Municipal, publicada por el Departamento Administrativo de la Función Pública." },
  ] },
  { id: "g-003", term: "Área construida", def: "Suma de las superficies cubiertas de las edificaciones de un predio, medida sobre cada piso o nivel." },
  { id: "g-004", term: "Área de terreno", def: "Extensión superficial del suelo de un predio, delimitada por sus linderos y expresada en metros cuadrados o hectáreas." },
  { id: "g-005", term: "Avalúo catastral", def: "Valor asignado oficialmente a un predio por la autoridad catastral; sirve de base para liquidar el impuesto predial." },
  { id: "g-006", term: "Avalúo comercial", def: "Estimación del valor de mercado de un predio en una fecha determinada, realizada por un perito conforme a normas vigentes." },
  { id: "g-026", term: "Barrido predial", def: "Recorrido sistemático de campo, predio por predio, para capturar y verificar en terreno la información catastral de una zona." },
  { id: "g-027", term: "Cabida", def: "Medida de la superficie de un predio según consta en su escritura o registro; puede diferir del área catastral medida en terreno." },
  { id: "g-028", term: "Cartografía catastral", def: "Conjunto de mapas y planos que representan la ubicación, forma y linderos de los predios de un territorio." },
  { id: "g-007", term: "Catastro multipropósito", def: "Sistema de información territorial que integra datos físicos, jurídicos y económicos del predio para múltiples usos públicos." },
  { id: "g-008", term: "Cédula catastral", def: "Documento que identifica un predio y reúne sus datos catastrales principales, como número predial, área y avalúo." },
  { id: "g-029", term: "Certificado de libertad y tradición", def: "Documento de la Oficina de Registro que muestra la historia jurídica de un inmueble: propietarios, hipotecas y limitaciones." },
  { id: "g-009", term: "Conservación catastral", def: "Conjunto de operaciones que mantienen al día la información catastral entre procesos de formación o actualización." },
  { id: "g-030", term: "Coordenadas (Magna Sirgas)", def: "Sistema de referencia oficial de Colombia para ubicar con precisión cualquier punto del territorio sobre el predio." },
  { id: "g-031", term: "Desenglobe", def: "División de un predio en dos o más predios independientes, cada uno con su propia identificación catastral." },
  { id: "g-010", term: "Destino económico", def: "Clasificación del uso predominante de un predio (residencial, comercial, industrial, agropecuario, entre otros)." },
  { id: "g-032", term: "Englobe", def: "Unificación de dos o más predios colindantes en uno solo, con una nueva identificación catastral." },
  { id: "g-033", term: "Escritura pública", def: "Documento otorgado ante notario que da fe de actos como la compraventa o hipoteca de un inmueble." },
  { id: "g-011", term: "Formación catastral", def: "Conjunto de operaciones para identificar, describir y valorar por primera vez los predios de una zona." },
  { id: "g-034", term: "Georreferenciación", def: "Proceso de asignar coordenadas geográficas reales a un predio o mapa para ubicarlo con exactitud sobre el terreno." },
  { id: "g-012", term: "Gestor catastral", def: "Entidad pública habilitada para prestar el servicio de gestión catastral en un territorio; en Valledupar, Tuterritorio." },
  { id: "g-013", term: "IGAC", def: "Instituto Geográfico Agustín Codazzi; máxima autoridad catastral y reguladora del catastro en Colombia." },
  { id: "g-014", term: "Impuesto predial unificado", def: "Tributo municipal anual que grava la propiedad o posesión de un predio, calculado sobre su avalúo catastral." },
  { id: "g-035", term: "Interrelación catastro-registro", def: "Vinculación de la información del catastro con la del registro público para que ambos sistemas coincidan sobre cada predio." },
  { id: "g-015", term: "Linderos", def: "Líneas que delimitan un predio y lo separan de los predios vecinos y de los bienes de uso público." },
  { id: "g-036", term: "Manzana catastral", def: "Conjunto de predios delimitado por vías o accidentes geográficos, usado como unidad de referencia en la cartografía urbana." },
  { id: "g-016", term: "Matrícula inmobiliaria", def: "Folio único que la Oficina de Registro asigna a un inmueble para llevar su historia jurídica." },
  { id: "g-017", term: "Mejora", def: "Construcción o edificación levantada sobre un predio que incrementa su valor; puede pertenecer a un tercero distinto del dueño del suelo." },
  { id: "g-018", term: "Municipio", def: "Es una entidad territorial conformada por una población determinada y un área geográfica que incluye zonas urbanas y rurales.", more: [
    { label: "Función", text: "Es la base de la organización político-administrativa del Estado, diseñada para estar más cerca de los ciudadanos y gestionar sus necesidades de primera línea." },
    { label: "Más información", text: "Consulta la guía de la Rama Ejecutiva – Orden Municipal, publicada por el Departamento Administrativo de la Función Pública." },
  ] },
  { id: "g-019", term: "Mutación", def: "Cambio en los datos de un predio —área, propietario, linderos o uso— que debe reportarse a la autoridad catastral." },
  { id: "g-037", term: "Nomenclatura", def: "Sistema de direcciones —números y nombres de vías— que identifica la ubicación de un predio." },
  { id: "g-020", term: "Número predial nacional", def: "Código único de 30 dígitos que identifica de forma inequívoca cada predio del país." },
  { id: "g-038", term: "Posesión", def: "Tenencia material de un predio con ánimo de dueño, aunque no se cuente con el título de propiedad." },
  { id: "g-021", term: "Predio", def: "Inmueble que pertenece a una o varias personas y está delimitado por sus linderos; unidad básica del catastro." },
  { id: "g-039", term: "Propiedad horizontal", def: "Régimen en el que coexisten bienes privados (apartamentos, locales) y bienes comunes en un mismo edificio o conjunto." },
  { id: "g-022", term: "PSE", def: "Proveedor de Servicios Electrónicos; plataforma para realizar pagos en línea, como el del impuesto predial." },
  { id: "g-040", term: "Reconocimiento predial", def: "Verificación en campo de las características físicas de un predio: construcciones, usos y linderos." },
  { id: "g-041", term: "SNR", def: "Superintendencia de Notariado y Registro; entidad que vigila el registro público de la propiedad inmobiliaria en Colombia." },
  { id: "g-023", term: "Trámite catastral", def: "Solicitud que realiza el ciudadano para crear, modificar o corregir la información catastral de su predio." },
  { id: "g-042", term: "Vigencia fiscal", def: "Año para el cual rige un avalúo catastral y se liquida el impuesto predial." },
  { id: "g-024", term: "Zona homogénea física", def: "Área con características de suelo, topografía y servicios similares, usada como base del avalúo." },
  { id: "g-025", term: "Zona homogénea geoeconómica", def: "Área con un valor de la tierra homogéneo, definida para asignar avalúos de forma equitativa." },
];

/* ------------------------------------------------------------------ */
/* EQUIPO (Nuestro Equipo)                                             */
/* ------------------------------------------------------------------ */

export type Member = { id: string; name: string; role: string; area: string; photo?: string };

/** Grupos del equipo: la Gerencia (destacada) y el equipo directivo. */
export const TEAM_AREAS = [
  "Dirección",
  "Equipo directivo",
];

/* Estructura organizacional de Tuterritorio: la Gerencia encabeza y el resto
 * son las jefaturas y coordinaciones. El nombre es opcional (se completa desde
 * el panel de administración); si falta, la tarjeta muestra solo el cargo. */
export const DEFAULT_EQUIPO: Member[] = [
  { id: "m-ger", name: "Lulia Cristina Maestre Arcia", role: "Gerente", area: "Dirección", photo: "/assets/equipo/lulia-maestre.jpg" },
  { id: "m-th", name: "", role: "Profesional de Talento Humano", area: "Equipo directivo" },
  { id: "m-jur", name: "", role: "Jefe Jurídico", area: "Equipo directivo" },
  { id: "m-sig", name: "", role: "Jefe de Sistemas de Información Geográfica", area: "Equipo directivo" },
  { id: "m-eco", name: "", role: "Jefe de Estudios Económicos", area: "Equipo directivo" },
  { id: "m-adm", name: "", role: "Coordinador Administrativo", area: "Equipo directivo" },
  { id: "m-con", name: "", role: "Contador", area: "Equipo directivo" },
];

/**
 * "overrides": mapa de id de texto -> valor editado. Lo usan los componentes
 * <Editable> para reemplazar textos puntuales en Inicio, Nosotros, Servicios,
 * Normativas y Glosario sin tener que modelar cada página por separado.
 */
export type Overrides = Record<string, string>;
export const DEFAULT_OVERRIDES: Overrides = {};

/** Devuelve el valor por defecto para una key de contenido conocida. */
export function defaultFor(key: string): unknown {
  if (key === "noticias") return DEFAULT_NOTICIAS;
  if (key === "normativas") return DEFAULT_NORMATIVAS;
  if (key === "glosario") return DEFAULT_GLOSARIO;
  if (key === "equipo") return DEFAULT_EQUIPO;
  if (key === "overrides") return DEFAULT_OVERRIDES;
  return null;
}
