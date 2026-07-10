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
    id: "n-2026-06-12",
    categoria: "Actualización catastral",
    badge: "var(--tt-green-600)",
    fecha: "12 de junio de 2026",
    titulo:
      "Inicia la actualización catastral 2026 en las comunas del norte de Valledupar",
    extracto:
      "Los equipos de reconocimiento predial de Tuterritorio comenzaron el levantamiento de información en las comunas 5 y 6. El operativo actualizará linderos, áreas y destino económico de más de 18.000 predios urbanos.",
    imagen: "/assets/valledupar-panorama.jpg",
  },
  {
    id: "n-2026-05-30",
    categoria: "Comunidad",
    badge: "var(--tt-teal-500)",
    fecha: "30 de mayo de 2026",
    titulo: "Tuterritorio ha atendido a 2.713 usuarios en lo que va de 2026",
    extracto:
      "La oficina de gestión catastral y los canales en línea acompañan a cada vez más ciudadanos en sus trámites catastrales y de avalúo.",
    imagen: "/assets/valledupar-2.png",
  },
];

/* ------------------------------------------------------------------ */
/* NORMATIVAS                                                          */
/* ------------------------------------------------------------------ */

export type Norm = { id: string; cat: string; code: string; desc: string; href: string };

/** Categorización temática (lo que la norma significa para el ciudadano),
 *  en lugar de la anterior por tipo de norma (Leyes/Decretos/…). */
export const NORM_CATEGORIES = ["Gestión catastral", "Impuesto predial", "Protección de datos", "Normativa municipal"];

/* Ordenadas de más reciente a más antigua (las normas municipales sin año, al final). */
export const DEFAULT_NORMATIVAS: Norm[] = [
  { id: "norm-008", cat: "Gestión catastral", code: "Resolución 1149 de 2021 — IGAC", desc: "Adopta las especificaciones técnicas para los productos de la gestión catastral multipropósito.", href: "https://www.igac.gov.co" },
  { id: "norm-006", cat: "Gestión catastral", code: "Decreto 148 de 2020", desc: "Reglamenta la gestión catastral y define los roles de gestores y operadores catastrales.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=108609" },
  { id: "norm-009", cat: "Gestión catastral", code: "Resolución 509 de 2020 — IGAC", desc: "Establece las condiciones para la habilitación de los gestores catastrales en el territorio nacional.", href: "https://www.igac.gov.co" },
  { id: "norm-010", cat: "Gestión catastral", code: "Resolución 388 de 2020 — IGAC", desc: "Define las especificaciones técnicas para el levantamiento y los productos catastrales.", href: "https://www.igac.gov.co" },
  { id: "norm-011", cat: "Gestión catastral", code: "Resolución 471 de 2020 — IGAC", desc: "Fija los estándares y procedimientos para el levantamiento catastral con enfoque multipropósito.", href: "https://www.igac.gov.co" },
  { id: "norm-001", cat: "Gestión catastral", code: "Ley 1955 de 2019", desc: "Plan Nacional de Desarrollo 2018–2022. Establece el catastro multipropósito y su prestación como servicio público.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=93970" },
  { id: "norm-005", cat: "Gestión catastral", code: "Decreto 1983 de 2019", desc: "Reglamenta la prestación del servicio público de gestión catastral con enfoque multipropósito.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=102767" },
  { id: "norm-007", cat: "Gestión catastral", code: "Decreto 1170 de 2015", desc: "Decreto Único Reglamentario del sector administrativo de información estadística (DANE–IGAC).", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=77345" },
  { id: "norm-004", cat: "Protección de datos", code: "Ley 1581 de 2012", desc: "Régimen general de protección de datos personales, aplicable al tratamiento de la información catastral.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981" },
  { id: "norm-003", cat: "Impuesto predial", code: "Ley 44 de 1990", desc: "Crea el Impuesto Predial Unificado y regula su liquidación a partir del avalúo catastral.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=296" },
  { id: "norm-002", cat: "Impuesto predial", code: "Ley 14 de 1983", desc: "Fortalece los fiscos municipales y fija las bases técnicas para la formación y el avalúo catastral.", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=267" },
  { id: "norm-012", cat: "Normativa municipal", code: "Acuerdo Municipal — Gestor Catastral", desc: "Habilita a Valledupar para asumir la gestión catastral de su territorio a través de Tuterritorio.", href: "#" },
  { id: "norm-013", cat: "Impuesto predial", code: "Estatuto Tributario Municipal", desc: "Regula el Impuesto Predial Unificado y demás tributos del municipio de Valledupar.", href: "#" },
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

/** Grupos del equipo. El primero es el liderazgo; el resto son áreas técnicas. */
export const TEAM_AREAS = [
  "Liderazgo",
  "Topografía y campo",
  "Jurídica",
  "Sistemas y datos",
  "Atención al ciudadano",
];

export const DEFAULT_EQUIPO: Member[] = [
  { id: "m-l1", name: "Nombre Apellido", role: "Directora(or) General", area: "Liderazgo" },
  { id: "m-l2", name: "Nombre Apellido", role: "Jefe de la Oficina de Gestión Catastral", area: "Liderazgo" },
  { id: "m-t1", name: "Nombre Apellido", role: "Topógrafo", area: "Topografía y campo" },
  { id: "m-t2", name: "Nombre Apellido", role: "Reconocedor predial", area: "Topografía y campo" },
  { id: "m-j1", name: "Nombre Apellido", role: "Abogada(o)", area: "Jurídica" },
  { id: "m-j2", name: "Nombre Apellido", role: "Analista jurídico", area: "Jurídica" },
  { id: "m-s1", name: "Nombre Apellido", role: "Ingeniera(o) de sistemas", area: "Sistemas y datos" },
  { id: "m-s2", name: "Nombre Apellido", role: "Analista SIG", area: "Sistemas y datos" },
  { id: "m-a1", name: "Nombre Apellido", role: "Atención al ciudadano", area: "Atención al ciudadano" },
  { id: "m-a2", name: "Nombre Apellido", role: "Orientadora(or)", area: "Atención al ciudadano" },
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
