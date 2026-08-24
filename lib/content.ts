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
      "En lo corrido de 2026, Tuterritorio ha atendido a 5.741 usuarios entre la sede principal y los canales en línea. La cifra refleja la confianza creciente de la ciudadanía en el operador catastral del municipio y el esfuerzo del equipo por dar respuesta oportuna a cada solicitud.\n\nLos trámites más frecuentes son el cambio de propietario, las rectificaciones de área y de datos del propietario, y la expedición de certificados catastrales. Cada trámite tiene definidos sus requisitos y tiempos de respuesta, que puedes consultar en la sección de Trámites y servicios.\n\nRecuerda que también puedes radicar tus peticiones, quejas, reclamos, sugerencias y denuncias a través del formulario PQRSD de este sitio, con radicado inmediato y seguimiento en línea. Nuestro compromiso es que la información catastral de Valledupar esté al día y al servicio de todos.",
  },
];

/* ------------------------------------------------------------------ */
/* NORMATIVAS                                                          */
/* ------------------------------------------------------------------ */

export type Norm = { id: string; cat: string; code: string; desc: string; href: string };

/** Categorización estilo normograma institucional. */
export const NORM_CATEGORIES = ["Normas generales aplicables", "Manuales, políticas y reglamentos"];

/* Normograma de la Gestión Catastral Multipropósito. Ordenadas de más reciente
   a más antigua (las normas sin año, al final). */
export const DEFAULT_NORMATIVAS: Norm[] = [
  { id: "norm-101", cat: "Normas generales aplicables", code: "Decreto 106 de 2025 — Municipio de Valledupar", desc: "Adiciona y modifica el manual específico de funciones y competencias laborales para los empleos de la planta de personal de la administración central del municipio de Valledupar.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=259623" },
  { id: "norm-102", cat: "Normas generales aplicables", code: "Acuerdo 027 de 2024 — Estatuto Tributario Municipal", desc: "Modifica y actualiza el estatuto tributario del municipio de Valledupar (Acuerdo 022 del 16 de diciembre de 2022).", href: "https://concejodevalledupar.gov.co/wp-content/uploads/2024/03/Acuerdo-027-de-2024.pdf" },
  { id: "norm-103", cat: "Normas generales aplicables", code: "Ley 2294 de 2023 — Plan Nacional de Desarrollo 2022-2026", desc: "Dicta medidas de eficiencia, modernización e interoperabilidad de la gestión catastral con el ordenamiento territorial y fija lineamientos sobre los límites a los incrementos del Impuesto Predial Unificado.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=209510" },
  { id: "norm-104", cat: "Normas generales aplicables", code: "Resolución Única IGAC 1040 de 2023", desc: "Reglamentación técnica y operativa integral de la gestión catastral multipropósito en Colombia. Unifica y actualiza los estándares para los procesos de formación, actualización, conservación y difusión catastral. Modificada por las Resoluciones 746 de 2024 y 794 de 2026.", href: "https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/normograma/resolucion-1040-de-2023" },
  { id: "norm-105", cat: "Normas generales aplicables", code: "Resolución IGAC 486 de 2021", desc: "Acto administrativo del IGAC mediante el cual se habilitó formalmente al Municipio de Valledupar para asumir la prestación del servicio público de gestión catastral en su jurisdicción.", href: "https://vlex.com.co/vid/resolucion-numero-486-2021-871017598" },
  { id: "norm-106", cat: "Normas generales aplicables", code: "Resolución Conjunta SNR 1101 / IGAC 11344 de 2020", desc: "Establece los lineamientos técnicos y jurídicos para la ejecución de procedimientos catastrales con efectos registrales: corrección de áreas y linderos y rectificación de información entre el Catastro y el Registro de Instrumentos Públicos.", href: "https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/normograma/resolucion-conjunta-igac-1101-snr-11344-de-2020" },
  { id: "norm-107", cat: "Normas generales aplicables", code: "Decreto 148 de 2020", desc: "Reglamenta y precisa las condiciones de prestación del servicio público catastral. Define las competencias, facultades y responsabilidades de los Gestores Catastrales frente a las labores operativas y de campo de los Operadores Catastrales.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=108609" },
  { id: "norm-108", cat: "Normas generales aplicables", code: "Resolución IGAC 471 de 2020", desc: "Fija las especificaciones técnicas mínimas y los estándares de calidad para la generación de los productos de cartografía básica oficial de Colombia, insumo del levantamiento catastral. Modificada por la Resolución 529 de 2020.", href: "https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/normograma/resolucion-no-471-de-2020" },
  { id: "norm-109", cat: "Normas generales aplicables", code: "Ley 1955 de 2019 — Plan Nacional de Desarrollo 2018-2022", desc: "Descentraliza la función catastral, transformándola oficialmente en un servicio público y estableciendo las bases del enfoque multipropósito en el país.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=93970" },
  { id: "norm-110", cat: "Normas generales aplicables", code: "Decreto 1983 de 2019", desc: "Reglamenta la gestión catastral como servicio público, definiendo los requisitos para los esquemas de habilitación de gestores territoriales y la contratación de operadores catastrales.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=102767" },
  { id: "norm-111", cat: "Normas generales aplicables", code: "Decreto 1170 de 2015", desc: "Decreto Único Reglamentario del Sector Administrativo de Información Estadística (DANE–IGAC). Compila las disposiciones vigentes aplicables al servicio público catastral y estadístico a nivel nacional.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=77345" },
  { id: "norm-112", cat: "Normas generales aplicables", code: "Ley 1712 de 2014", desc: "Ley de Transparencia y del Derecho de Acceso a la Información Pública Nacional. Regula la publicidad de los trámites y define los límites de reserva legal sobre ciertos datos sensibles.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=56882" },
  { id: "norm-113", cat: "Normas generales aplicables", code: "Ley 1581 de 2012", desc: "Régimen General de Protección de Datos Personales (Habeas Data). De estricto cumplimiento en la recolección, tratamiento, custodia y confidencialidad de la información.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981" },
  { id: "norm-114", cat: "Normas generales aplicables", code: "Ley 44 de 1990", desc: "Crea el Impuesto Predial Unificado (IPU) y establece las directrices para la aplicación de la base gravable a partir de los avalúos generados por la gestión catastral.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=296" },
  { id: "norm-115", cat: "Normas generales aplicables", code: "Ley 14 de 1983", desc: "Ley de fortalecimiento de los fiscos de las entidades territoriales. Establece las bases técnicas de la formación, actualización y conservación de los avalúos catastrales en los municipios.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=267" },
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
  { id: "g-012", term: "Gestor catastral", def: "Entidad pública habilitada para prestar el servicio de gestión catastral en un territorio. En Valledupar el gestor catastral es el municipio (Alcaldía), y Tuterritorio actúa como su operador catastral." },
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

/* VISTA PREVIA (rama equipo-fotos-preview): 22 fotos sin fondo, sin nombres ni
 * cargos, solo para ver cómo lucen en el diseño. No fusionar a producción. */
export const DEFAULT_EQUIPO: Member[] = [
  { id: "ff-01", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-01.webp" },
  { id: "ff-02", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-02.webp" },
  { id: "ff-03", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-03.webp" },
  { id: "ff-04", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-04.webp" },
  { id: "ff-05", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-05.webp" },
  { id: "ff-06", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-06.webp" },
  { id: "ff-07", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-07.webp" },
  { id: "ff-08", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-08.webp" },
  { id: "ff-09", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-09.webp" },
  { id: "ff-10", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-10.webp" },
  { id: "ff-11", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-11.webp" },
  { id: "ff-12", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-12.webp" },
  { id: "ff-13", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-13.webp" },
  { id: "ff-14", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-14.webp" },
  { id: "ff-15", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-15.webp" },
  { id: "ff-16", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-16.webp" },
  { id: "ff-17", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-17.webp" },
  { id: "ff-18", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-18.webp" },
  { id: "ff-19", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-19.webp" },
  { id: "ff-20", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-20.webp" },
  { id: "ff-21", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-21.webp" },
  { id: "ff-22", name: "", role: "", area: "Equipo", photo: "/assets/equipo/personas-preview/ff-22.webp" },
];

/**
 * "overrides": mapa de id de texto -> valor editado. Lo usan los componentes
 * <Editable> para reemplazar textos puntuales en Inicio, Nosotros, Servicios,
 * Normativas y Glosario sin tener que modelar cada página por separado.
 */
export type Overrides = Record<string, string>;
export const DEFAULT_OVERRIDES: Overrides = {};

/* ------------------------------------------------------------------ */
/* PREGUNTAS FRECUENTES (FAQ)                                          */
/* ------------------------------------------------------------------ */

export type Faq = { id: string; cat: string; q: string; a: string };

/** Categorías del FAQ con su etiqueta corta y color de acento. */
export const FAQ_CATS: { titulo: string; corto: string; accent: string }[] = [
  { titulo: "Trámites catastrales", corto: "Trámites", accent: "#3B85A5" },
  { titulo: "Avalúo catastral e impuesto predial", corto: "Avalúos e impuesto", accent: "#4E8654" },
  { titulo: "PQRSD y atención a la ciudadanía", corto: "PQRSD", accent: "#F0B63B" },
  { titulo: "Sobre la entidad", corto: "La entidad", accent: "#2A5A70" },
];
export const FAQ_CATEGORIES = FAQ_CATS.map((c) => c.titulo);

export const DEFAULT_FAQ: Faq[] = [
  { id: "docs-tramite", cat: "Trámites catastrales", q: "¿Qué documentos necesito para hacer un trámite catastral?", a: "Para la mayoría de los trámites necesitas la solicitud del trámite con tus datos de notificación (celular, correo y dirección) y la fotocopia de la cédula de quien realiza el trámite (propietario, poseedor u ocupante, según el caso). Según el trámite pueden pedirse además la escritura pública, el certificado de libertad y tradición actualizado o planos. Consulta el detalle de cada trámite en la página de Trámites y servicios." },
  { id: "tiempos-tramite", cat: "Trámites catastrales", q: "¿Cuánto tarda la respuesta de un trámite?", a: "Depende del tipo de trámite: las rectificaciones sencillas (nombre, documento, dirección y cambio de propietario) tardan hasta 15 días hábiles; el cambio de destino hasta 30 días hábiles; los trámites que requieren revisión técnica (englobe, desenglobe, áreas e inscripciones) hasta 60 días hábiles, y la revisión del avalúo catastral hasta 90 días hábiles. El tiempo de cada trámite aparece en su tarjeta en Trámites y servicios." },
  { id: "costo-tramite", cat: "Trámites catastrales", q: "¿Los trámites catastrales tienen costo?", a: "No. Los trámites catastrales son gratuitos. Los que tienen costo son los productos catastrales (certificados, cartas catastrales y fichas prediales), cuyos valores son establecidos por la Alcaldía de Valledupar y se pagan directamente a ella mediante su cuenta bancaria oficial o los datáfonos dispuestos para tal fin." },
  { id: "donde-radicar", cat: "Trámites catastrales", q: "¿Dónde radico mi trámite?", a: "De manera presencial en nuestra sede: Calle 16 #9-48, Edificio Caja Agraria — Oficina 1301, Valledupar (Cesar), de lunes a viernes de 8:00 a. m. a 12:00 m. y de 2:00 p. m. a 6:00 p. m. En Canales de atención encuentras el mapa, el teléfono y el correo institucional." },
  { id: "que-es-avaluo", cat: "Avalúo catastral e impuesto predial", q: "¿Qué es el avalúo catastral y para qué sirve?", a: "Es el valor oficial que la autoridad catastral asigna a tu predio a partir de sus características físicas, jurídicas y económicas. Sirve, entre otros usos, como base para liquidar el impuesto predial unificado. Encuentras más términos explicados en el ABC Catastral." },
  { id: "revision-avaluo", cat: "Avalúo catastral e impuesto predial", q: "¿Puedo pedir la revisión del avalúo de mi predio?", a: "Sí. La solicitud se presenta por escrito, indicando la(s) vigencia(s) objeto de la petición y acompañada de las pruebas que fundamenten la variación (planos, certificaciones, avalúos comerciales o escrituras). El trámite tarda hasta 90 días hábiles y no tiene costo." },
  { id: "cobro-predial", cat: "Avalúo catastral e impuesto predial", q: "¿Tuterritorio cobra el impuesto predial?", a: "No. Tuterritorio determina el avalúo catastral, que es la base del impuesto, pero la liquidación y el recaudo del impuesto predial unificado corresponden a la Alcaldía de Valledupar (Secretaría de Hacienda). Cualquier pago del impuesto se hace directamente ante la Alcaldía." },
  { id: "radicar-pqrsd", cat: "PQRSD y atención a la ciudadanía", q: "¿Cómo radico una petición, queja, reclamo, sugerencia o denuncia (PQRSD)?", a: "Puedes radicarla en línea desde el formulario de PQRSD del sitio web, sin salir de casa. También puedes hacerlo por los canales de atención (correo institucional o de manera presencial en la sede)." },
  { id: "anexos-pqrsd", cat: "PQRSD y atención a la ciudadanía", q: "¿Puedo adjuntar documentos a mi PQRSD?", a: "Sí. El formulario permite adjuntar hasta 3 archivos (máximo 4 MB en total) en formatos PDF, JPG, PNG, WEBP, DOC o DOCX: por ejemplo la cédula, escrituras, certificados o fotos que soporten tu solicitud." },
  { id: "tiempos-pqrsd", cat: "PQRSD y atención a la ciudadanía", q: "¿En cuánto tiempo responden mi PQRSD?", a: "Dentro de los términos de la Ley 1755 de 2015: por regla general, las peticiones se resuelven en 15 días hábiles; las solicitudes de documentos e información en 10 días hábiles, y las consultas en 30 días hábiles, contados desde el día siguiente a la radicación. La respuesta llega al correo que registres en el formulario." },
  { id: "que-es-tuterritorio", cat: "Sobre la entidad", q: "¿Qué es Tuterritorio?", a: "Es el operador catastral del municipio de Valledupar: la entidad encargada de operar el catastro con enfoque multipropósito, es decir, de mantener actualizada la información física, jurídica y económica de los predios del municipio. Conoce más en la página Nosotros." },
  { id: "catastro-multiproposito", cat: "Sobre la entidad", q: "¿Qué es el catastro multipropósito?", a: "Es un sistema de información del territorio que integra los datos físicos, jurídicos y económicos de cada predio para múltiples usos públicos: planeación del territorio, seguridad jurídica de la propiedad, finanzas municipales y políticas de desarrollo." },
  { id: "quien-vigila", cat: "Sobre la entidad", q: "¿Quién vigila y controla a Tuterritorio?", a: "El IGAC (Instituto Geográfico Agustín Codazzi) es la máxima autoridad catastral del país y regula la prestación del servicio, y la SNR (Superintendencia de Notariado y Registro) ejerce la inspección, vigilancia y control sobre los gestores catastrales. Más información en Información de la entidad (Transparencia)." },
];

/* ------------------------------------------------------------------ */
/* TRÁMITES Y SERVICIOS                                                */
/* ------------------------------------------------------------------ */

export type Tramite = { id: string; title: string; desc: string; tiempo: string; costo: string; reqs: string[]; en?: string };

const _docSolicitud = "Solicitud del trámite con datos de notificación (celular, correo y dirección)";
const _docIdentidad = "Fotocopia de la cédula de quien realiza el trámite (propietario, poseedor u ocupante, según el caso)";
const _docEscritura = "Copia de la escritura pública";
const _docCLT = "Copia del certificado de libertad y tradición actualizado";
const _docCLT30 = "Copia del certificado de libertad y tradición actualizado (no mayor a 30 días)";
const _docPredioRural = "Plano topográfico con medidas legibles y cuadro de coordenadas en formato DWG versión 2007, georreferenciado en Magna Sirgas (predios rurales)";
const _planos = "Copia de planos en escala original, aprobados por curaduría u oficina de planeación";
const _ph = "PH: copia de la escritura del reglamento de propiedad horizontal, sus modificaciones y planos (cuando aplique)";
const _productosDocs = ["Fotocopia de la cédula de quien solicita el producto (propietario, poseedor u ocupante, según el caso)", "Certificado de libertad y tradición o recibo del impuesto predial"];

export const DEFAULT_TRAMITES: Tramite[] = [
  { id: "t-incorporacion-area", title: "Incorporación de área", desc: "Registro inicial del área de un predio dentro de la base catastral.", tiempo: "Hasta 60 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad, _docEscritura, _docCLT, _docPredioRural], en: "area incorporation initial registration of property area cadastral database deed" },
  { id: "t-rectificacion-area", title: "Rectificación de área", desc: "Corrección del área del terreno cuando difiere de la realidad física o registral.", tiempo: "Hasta 60 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad, _docEscritura, _docCLT, _docPredioRural], en: "area rectification correction of land area physical registry" },
  { id: "t-desenglobe", title: "Desenglobe", desc: "División de un predio en dos o más inmuebles independientes.", tiempo: "Hasta 60 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docCLT, _docEscritura, _planos, _ph, _docPredioRural], en: "subdivision split division of a property into independent parcels" },
  { id: "t-englobe", title: "Englobe", desc: "Unificación de dos o más predios en un solo inmueble.", tiempo: "Hasta 60 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docCLT, _docEscritura, _planos, _ph, _docPredioRural], en: "merger consolidation unification of parcels into one property" },
  { id: "t-inscripcion-predio", title: "Inscripción de predio", desc: "Registro inicial de un predio o mejora dentro de la información catastral.", tiempo: "Hasta 60 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad, _docCLT30, "Copia de escritura pública o resolución de adjudicación", _docPredioRural], en: "property registration enrollment of a parcel or improvement" },
  { id: "t-avaluo", title: "Avalúo catastral", desc: "Revisión del avalúo catastral; debe presentarse por escrito indicando la(s) vigencia(s) objeto de petición.", tiempo: "Hasta 90 días hábiles", costo: "Sin costo", reqs: ["Solicitud por escrito con precisión de la(s) vigencia(s) objeto de petición", "Pruebas que fundamenten las variaciones por cambios físicos, valorización o cambios de uso o mercado inmobiliario", "Planos, certificaciones de autoridades, orto/aerofotografías, avalúos comerciales o escrituras que demuestren los cambios"], en: "cadastral appraisal valuation review assessment value" },
  { id: "t-cambio-destino", title: "Cambio de destino", desc: "Actualización del uso o destino económico asignado al predio.", tiempo: "Hasta 30 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad, _docCLT], en: "change of use economic destination land use update" },
  { id: "t-rectif-direccion", title: "Rectificación de dirección", desc: "Corrección de la dirección o nomenclatura registrada del predio.", tiempo: "Hasta 15 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad, "Certificado de nomenclatura"], en: "address correction rectification nomenclature street" },
  { id: "t-rectif-nombre", title: "Rectificación de nombre", desc: "Corrección del nombre del propietario en la base catastral.", tiempo: "Hasta 15 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad], en: "name correction rectification owner name" },
  { id: "t-rectif-documento", title: "Rectificación de documento de identidad", desc: "Corrección del número o tipo de documento del propietario.", tiempo: "Hasta 15 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad], en: "identity document correction id number rectification" },
  { id: "t-cambio-propietario", title: "Cambio de propietario", desc: "Actualización catastral cuando el predio cambia de dueño.", tiempo: "Hasta 15 días hábiles", costo: "Sin costo", reqs: [_docSolicitud, _docIdentidad, _docCLT30], en: "change of owner ownership transfer new owner" },
  { id: "t-cert-plano-predial", title: "Certificado plano predial", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días hábiles", costo: "$52.500", reqs: _productosDocs, en: "property plan certificate map blueprint download" },
  { id: "t-cert-especial", title: "Certificado catastral especial", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días hábiles", costo: "$52.200", reqs: _productosDocs, en: "special cadastral certificate download" },
  { id: "t-cert-avaluo", title: "Certificado avalúo catastral", desc: "Certificación oficial del avalúo catastral vigente del predio, para descarga o entrega física.", tiempo: "Hasta 5 días hábiles", costo: "$52.200", reqs: _productosDocs, en: "cadastral appraisal certificate official valuation" },
  { id: "t-fotocopia-ficha", title: "Fotocopia de la ficha predial", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días hábiles", costo: "$68.500", reqs: _productosDocs, en: "property record card copy photocopy" },
  { id: "t-carta-urbana", title: "Carta catastral urbana", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días hábiles", costo: "$57.900", reqs: _productosDocs, en: "urban cadastral map chart city" },
  { id: "t-carta-rural", title: "Carta catastral rural", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días hábiles", costo: "$76.400", reqs: _productosDocs, en: "rural cadastral map chart countryside" },
  { id: "t-cert-nacional", title: "Certificado catastral nacional", desc: "Producto catastral disponible para descarga o entrega física.", tiempo: "Hasta 15 días hábiles", costo: "$10.000", reqs: _productosDocs, en: "national cadastral certificate download" },
];

/** Devuelve el valor por defecto para una key de contenido conocida. */
export function defaultFor(key: string): unknown {
  if (key === "noticias") return DEFAULT_NOTICIAS;
  if (key === "normativas") return DEFAULT_NORMATIVAS;
  if (key === "glosario") return DEFAULT_GLOSARIO;
  if (key === "equipo") return DEFAULT_EQUIPO;
  if (key === "overrides") return DEFAULT_OVERRIDES;
  if (key === "faq") return DEFAULT_FAQ;
  if (key === "tramites") return DEFAULT_TRAMITES;
  return null;
}
