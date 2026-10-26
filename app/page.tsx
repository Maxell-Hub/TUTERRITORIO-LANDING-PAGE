import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import EnlacesInteres from "@/components/home/EnlacesInteres";
import NoticiasRecientes from "@/components/home/NoticiasRecientes";
import CountUp from "@/components/site/CountUp";

export const metadata: Metadata = {
  title: { absolute: "Tuterritorio - Catastro Multipropósito de Valledupar" },
  description:
    "Consulta tu predio en Valledupar: linderos, área y avalúo catastral. Realiza trámites catastrales, radica tu PQRSD y consulta el impuesto predial con Tuterritorio, operador catastral de Valledupar.",
  alternates: { canonical: "/" },
};

/**
 * Inicio — estructura del diseño ATG:
 * hero fotográfico tintado → feature (visor) → feature invertida (trámites)
 * → declaración → tres pilares con foto → cifras → panel de integración
 * → franja fotográfica de cierre.
 */
export default function HomePage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/inicio/foto-panoramica2-v2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/inicio/foto-panoramica3-m-v2.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* 1 · Hero fotográfico
          La imagen del hero es el elemento LCP. Se pinta como <img> real (no como
          background-image CSS) con fetchPriority alto: el navegador la trata como
          imagen prioritaria y la pinta apenas se decodifica, sin esperar a la
          hidratación. Así el LCP baja de ~4,5s a ~1,5s en móvil. El <picture>
          sirve la variante liviana -m en celular; el tinte va como capa aparte. */}
      <section className="atg-hero atg-hero--img" id="consultar">
        <picture className="atg-hero-bg" aria-hidden="true">
          <source media="(max-width: 720px)" srcSet="/assets/inicio/foto-panoramica3-m-v2.webp" />
          <img src="/assets/inicio/foto-panoramica2-v2.webp" alt="" fetchPriority="high" decoding="async" />
        </picture>
        <span className="atg-hero-tint" aria-hidden="true" />
        <h1 className="hero-h1">
          {/* Entrada por líneas (solo transform → no retrasa el LCP). El espacio vive DENTRO del span notranslate: Google recorta el espacio
              del texto traducido y "ensure" quedaba pegado a "Tuterritorio". */}
          <span className="hl">Conoce tu predio,</span>
          <span className="hl">asegura<span className="b notranslate" translate="no">{" Tuterritorio"}</span></span>
        </h1>
        <Editable as="p" id="home.intro" className="sub" multiline>
          Consulta la información catastral oficial de tu propiedad en Valledupar como linderos, área, avalúo y estado de tus trámites en un solo lugar.
        </Editable>
      </section>

      {/* 2 · Feature: visor geográfico */}
      <section className="atg-band" id="visor">
        <div className="atg-wrap">
          <div className="atg-feature">
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <div className="atg-map-body">
                  <img src="/assets/inicio/foto-ortofoto2-v3.webp" srcSet="/assets/inicio/foto-ortofoto2-m-v3.webp 860w, /assets/inicio/foto-ortofoto2-v3.webp 1280w" sizes="(max-width: 900px) 100vw, 640px" alt="Ortofoto de Valledupar con la malla predial" loading="lazy" decoding="async" width={1280} height={733} />
                </div>
              </div>
            </div>
            <div className="atg-copy reveal">
              <Editable as="h2" id="home.visor-h2">Todo el territorio, en un visor vivo</Editable>
              <Editable as="p" id="home.visor-p" multiline>
                Cartografía predial completa de Valledupar: 6 sectores catastrales en el área urbana, 25 corregimientos en zona rural y resguardos indígenas en la Sierra Nevada.
              </Editable>
              <ul>
                <Editable as="li" id="home.visor-li1">Zonas físicas, económicas y usos del suelo por capas</Editable>
                <Editable as="li" id="home.visor-li2">Consulta ciudadana del predio en línea</Editable>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Feature invertida: trámites */}
      <section className="atg-band" id="tramites-detalle">
        <div className="atg-wrap">
          <div className="atg-feature flip">
            <div className="atg-copy reveal">
              <Editable as="h2" id="home.tramites-h2">Tus trámites, con requisitos y tiempos claros</Editable>
              <Editable as="p" id="home.tramites-p" multiline>
                Actualiza, corrige y consulta la información de predios y propietarios. Cada trámite indica sus requisitos y su tiempo de respuesta en días hábiles.
              </Editable>
              <ul>
                <Editable as="li" id="home.tramites-li1">Mutaciones, englobes, desenglobes y rectificaciones</Editable>
                <Editable as="li" id="home.tramites-li2">Radica tu PQRSD y consulta su estado en línea</Editable>
                <Editable as="li" id="home.tramites-li3">Atención presencial en la sede principal</Editable>
              </ul>
              <a className="atg-pill" href="/servicios"><Editable as="span" id="home.cta-tramites">Ver los trámites</Editable></a>
            </div>
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <img className="atg-mock-photo" src="/assets/inicio/foto-archivo2-v3.webp" srcSet="/assets/inicio/foto-archivo2-m-v3.webp 860w, /assets/inicio/foto-archivo2-v3.webp 1280w" sizes="(max-width: 900px) 100vw, 640px" alt="Funcionario consultando expedientes en el archivo catastral" width={1280} height={855} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Enlaces de interés (información original del sitio) */}
      <EnlacesInteres />

      {/* 6 · Cifras */}
      <section className="atg-band atg-stats-band">
        <div className="atg-wrap">
          <div className="atg-stats">
            <div className="atg-stat reveal">
              <div className="n"><CountUp value={6370} prefix="+" /></div>
              <Editable as="div" id="home.stat1-d" className="d">Trámites finalizados</Editable>
            </div>
            <div className="atg-stat reveal">
              <div className="n"><CountUp value={93} suffix="%" /></div>
              <Editable as="div" id="home.stat2-d" className="d">Efectividad operativa</Editable>
            </div>
            <div className="atg-stat reveal">
              <div className="n"><CountUp value={6} duration={1200} /> + <CountUp value={25} /></div>
              <Editable as="div" id="home.stat3-d" className="d">Sectores urbanos y corregimientos rurales</Editable>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Noticias recientes */}
      <NoticiasRecientes />

      {/* 8 · Franja fotográfica de cierre */}
      <section className="atg-photo-band">
        <div className="atg-wrap">
          <Editable as="h2" id="home.cierre-h2">Hecho para el territorio de Valledupar</Editable>
          <Editable as="p" id="home.cierre-p" multiline>
            Del área urbana a los corregimientos de la Sierra Nevada, Tuterritorio acompaña al municipio en su camino hacia un catastro multipropósito, moderno y eficiente.
          </Editable>
          <a className="atg-pill" href="/contactos"><Editable as="span" id="home.cta-contacto">Contáctanos</Editable></a>
        </div>
      </section>
    </>
  );
}
