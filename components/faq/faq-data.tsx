import Link from "next/link";

/**
 * Contenido de Preguntas Frecuentes.
 * `a` es la respuesta con enlaces (JSX) y `aText` su versión en texto plano,
 * usada en los datos estructurados FAQPage (schema.org) y en la búsqueda.
 */
export type Faq = { id: string; q: string; a: React.ReactNode; aText: string };
export type FaqGrupo = { titulo: string; corto: string; accent: string; icon: React.ReactNode; faqs: Faq[] };

export const FAQ_GRUPOS: FaqGrupo[] = [
  {
    titulo: "Trámites catastrales",
    corto: "Trámites",
    accent: "#3B85A5",
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></>,
    faqs: [
      {
        id: "docs-tramite",
        q: "¿Qué documentos necesito para hacer un trámite catastral?",
        a: (
          <>
            Para la mayoría de los trámites necesitas la <b>solicitud del trámite</b> con tus datos de
            notificación (celular, correo y dirección) y la <b>fotocopia de la cédula</b> de quien realiza
            el trámite (propietario, poseedor u ocupante, según el caso). Según el trámite pueden pedirse
            además la escritura pública, el certificado de libertad y tradición actualizado o planos.
            Consulta el detalle de cada trámite en{" "}
            <Link href="/servicios">Trámites y servicios</Link>.
          </>
        ),
        aText:
          "Para la mayoría de los trámites necesitas la solicitud del trámite con tus datos de notificación (celular, correo y dirección) y la fotocopia de la cédula de quien realiza el trámite (propietario, poseedor u ocupante, según el caso). Según el trámite pueden pedirse además la escritura pública, el certificado de libertad y tradición actualizado o planos. Consulta el detalle de cada trámite en la página de Trámites y servicios.",
      },
      {
        id: "tiempos-tramite",
        q: "¿Cuánto tarda la respuesta de un trámite?",
        a: (
          <>
            Depende del tipo de trámite: las rectificaciones sencillas (nombre, documento, dirección y
            cambio de propietario) tardan <b>hasta 15 días</b>; el cambio de destino <b>hasta 1 mes</b>;
            los trámites que requieren revisión técnica (englobe, desenglobe, áreas e inscripciones){" "}
            <b>hasta 2 meses</b>, y la revisión del <b>avalúo catastral hasta 3 meses</b>. El tiempo de
            cada trámite aparece en su tarjeta en <Link href="/servicios">Trámites y servicios</Link>.
          </>
        ),
        aText:
          "Depende del tipo de trámite: las rectificaciones sencillas (nombre, documento, dirección y cambio de propietario) tardan hasta 15 días; el cambio de destino hasta 1 mes; los trámites que requieren revisión técnica (englobe, desenglobe, áreas e inscripciones) hasta 2 meses, y la revisión del avalúo catastral hasta 3 meses.",
      },
      {
        id: "costo-tramite",
        q: "¿Los trámites catastrales tienen costo?",
        a: (
          <>
            No. Los <b>trámites catastrales son gratuitos</b>. Los que tienen costo son los{" "}
            <b>productos catastrales</b> (certificados, cartas catastrales y fichas prediales), cuyos
            valores son establecidos por la Alcaldía de Valledupar y se pagan directamente a ella mediante
            su cuenta bancaria oficial o los datáfonos dispuestos para tal fin.
          </>
        ),
        aText:
          "No. Los trámites catastrales son gratuitos. Los que tienen costo son los productos catastrales (certificados, cartas catastrales y fichas prediales), cuyos valores son establecidos por la Alcaldía de Valledupar y se pagan directamente a ella.",
      },
      {
        id: "donde-radicar",
        q: "¿Dónde radico mi trámite?",
        a: (
          <>
            De manera presencial en nuestra sede: <b>Calle 16 #9-48, Edificio Caja Agraria — Oficina 1301</b>,
            Valledupar (Cesar), de lunes a viernes de 8:00 a. m. a 12:00 m. y de 2:00 p. m. a 6:00 p. m. En{" "}
            <Link href="/contactos">Canales de atención</Link> encuentras el mapa, el teléfono y el correo
            institucional.
          </>
        ),
        aText:
          "De manera presencial en nuestra sede: Calle 16 #9-48, Edificio Caja Agraria — Oficina 1301, Valledupar (Cesar), de lunes a viernes de 8:00 a. m. a 12:00 m. y de 2:00 p. m. a 6:00 p. m.",
      },
    ],
  },
  {
    titulo: "Avalúo catastral e impuesto predial",
    corto: "Avalúos e impuesto",
    accent: "#4E8654",
    icon: <><path d="M3 21h18M5 21V10l7-5 7 5v11" /><path d="M9 21v-6h6v6" /><path d="M3 10h18" /></>,
    faqs: [
      {
        id: "que-es-avaluo",
        q: "¿Qué es el avalúo catastral y para qué sirve?",
        a: (
          <>
            Es el <b>valor oficial</b> que la autoridad catastral asigna a tu predio a partir de sus
            características físicas, jurídicas y económicas. Sirve, entre otros usos, como base para
            liquidar el <b>impuesto predial unificado</b>. Encuentras más términos explicados en el{" "}
            <Link href="/recursos/glosario">ABC Catastral</Link>.
          </>
        ),
        aText:
          "Es el valor oficial que la autoridad catastral asigna a tu predio a partir de sus características físicas, jurídicas y económicas. Sirve, entre otros usos, como base para liquidar el impuesto predial unificado.",
      },
      {
        id: "revision-avaluo",
        q: "¿Puedo pedir la revisión del avalúo de mi predio?",
        a: (
          <>
            Sí. La solicitud se presenta <b>por escrito</b>, indicando la(s) vigencia(s) objeto de la
            petición y acompañada de las pruebas que fundamenten la variación (planos, certificaciones,
            avalúos comerciales o escrituras). El trámite tarda <b>hasta 3 meses</b> y no tiene costo.
          </>
        ),
        aText:
          "Sí. La solicitud se presenta por escrito, indicando la(s) vigencia(s) objeto de la petición y acompañada de las pruebas que fundamenten la variación. El trámite tarda hasta 3 meses y no tiene costo.",
      },
      {
        id: "cobro-predial",
        q: "¿Tuterritorio cobra el impuesto predial?",
        a: (
          <>
            No. Tuterritorio determina el <b>avalúo catastral</b>, que es la base del impuesto, pero la{" "}
            <b>liquidación y el recaudo</b> del impuesto predial unificado corresponden a la Alcaldía de
            Valledupar (Secretaría de Hacienda). Cualquier pago del impuesto se hace directamente ante la
            Alcaldía.
          </>
        ),
        aText:
          "No. Tuterritorio determina el avalúo catastral, que es la base del impuesto, pero la liquidación y el recaudo del impuesto predial unificado corresponden a la Alcaldía de Valledupar (Secretaría de Hacienda).",
      },
    ],
  },
  {
    titulo: "PQRSD y atención a la ciudadanía",
    corto: "PQRSD",
    accent: "#F0B63B",
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>,
    faqs: [
      {
        id: "radicar-pqrsd",
        q: "¿Cómo radico una petición, queja, reclamo, sugerencia o denuncia (PQRSD)?",
        a: (
          <>
            Puedes radicarla en línea desde el <Link href="/pqrsd">formulario de PQRSD</Link>, sin salir de
            casa. También puedes hacerlo por los <Link href="/contactos">canales de atención</Link>{" "}
            (correo institucional o de manera presencial en la sede).
          </>
        ),
        aText:
          "Puedes radicarla en línea desde el formulario de PQRSD del sitio web. También por el correo institucional o de manera presencial en la sede.",
      },
      {
        id: "anexos-pqrsd",
        q: "¿Puedo adjuntar documentos a mi PQRSD?",
        a: (
          <>
            Sí. El formulario permite adjuntar <b>hasta 3 archivos</b> (máximo 4 MB en total) en formatos
            PDF, JPG, PNG, WEBP, DOC o DOCX: por ejemplo la cédula, escrituras, certificados o fotos que
            soporten tu solicitud.
          </>
        ),
        aText:
          "Sí. El formulario permite adjuntar hasta 3 archivos (máximo 4 MB en total) en formatos PDF, JPG, PNG, WEBP, DOC o DOCX.",
      },
      {
        id: "tiempos-pqrsd",
        q: "¿En cuánto tiempo responden mi PQRSD?",
        a: (
          <>
            Dentro de los términos de la <b>Ley 1755 de 2015</b>: por regla general, las peticiones se
            resuelven en <b>15 días hábiles</b>; las solicitudes de documentos e información en{" "}
            <b>10 días hábiles</b>, y las consultas en <b>30 días hábiles</b>, contados desde el día
            siguiente a la radicación. La respuesta llega al correo que registres en el formulario.
          </>
        ),
        aText:
          "Dentro de los términos de la Ley 1755 de 2015: por regla general, las peticiones se resuelven en 15 días hábiles; las solicitudes de documentos e información en 10 días hábiles, y las consultas en 30 días hábiles.",
      },
    ],
  },
  {
    titulo: "Sobre la entidad",
    corto: "La entidad",
    accent: "#2A5A70",
    icon: <><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 9h.01M15 9h.01M9 12h.01M15 12h.01M9 15h.01M15 15h.01" /></>,
    faqs: [
      {
        id: "que-es-tuterritorio",
        q: "¿Qué es Tuterritorio?",
        a: (
          <>
            Es el <b>gestor catastral del municipio de Valledupar</b>: la entidad encargada de operar el
            catastro con enfoque multipropósito, es decir, de mantener actualizada la información física,
            jurídica y económica de los predios del municipio. Conoce más en{" "}
            <Link href="/nosotros">Nosotros</Link>.
          </>
        ),
        aText:
          "Es el gestor catastral del municipio de Valledupar: la entidad encargada de operar el catastro con enfoque multipropósito, es decir, de mantener actualizada la información física, jurídica y económica de los predios del municipio.",
      },
      {
        id: "catastro-multiproposito",
        q: "¿Qué es el catastro multipropósito?",
        a: (
          <>
            Es un <b>sistema de información del territorio</b> que integra los datos físicos, jurídicos y
            económicos de cada predio para múltiples usos públicos: planeación del territorio, seguridad
            jurídica de la propiedad, finanzas municipales y políticas de desarrollo.
          </>
        ),
        aText:
          "Es un sistema de información del territorio que integra los datos físicos, jurídicos y económicos de cada predio para múltiples usos públicos: planeación del territorio, seguridad jurídica de la propiedad, finanzas municipales y políticas de desarrollo.",
      },
      {
        id: "quien-vigila",
        q: "¿Quién vigila y controla a Tuterritorio?",
        a: (
          <>
            El <b>IGAC</b> (Instituto Geográfico Agustín Codazzi) es la máxima autoridad catastral del país
            y regula la prestación del servicio, y la <b>SNR</b> (Superintendencia de Notariado y Registro)
            ejerce la inspección, vigilancia y control sobre los gestores catastrales. Más información en{" "}
            <Link href="/transparencia/informacion-entidad">Información de la entidad</Link>.
          </>
        ),
        aText:
          "El IGAC (Instituto Geográfico Agustín Codazzi) es la máxima autoridad catastral del país y regula la prestación del servicio, y la SNR (Superintendencia de Notariado y Registro) ejerce la inspección, vigilancia y control sobre los gestores catastrales.",
      },
    ],
  },
];
