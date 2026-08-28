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
      <link rel="preload" as="image" href="/assets/inicio/foto-panoramica2.webp" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/inicio/foto-panoramica3-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* 1 · Hero fotográfico */}
      <section className="atg-hero" id="consultar" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/inicio/foto-panoramica2.webp)", ["--hero-m" as string]: "url(/assets/inicio/foto-panoramica3-m.webp)" }}>
        <h1>
          {/* El espacio vive DENTRO del span notranslate: Google recorta el espacio
              del texto traducido y "ensure" quedaba pegado a "Tuterritorio". */}
          Conoce tu predio,<br />asegura<span className="b notranslate" translate="no">{" Tuterritorio"}</span>
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
                  <img src="/assets/inicio/foto-ortofoto2.webp" srcSet="/assets/inicio/foto-ortofoto2-m.webp 1080w, /assets/inicio/foto-ortofoto2.webp 1600w" sizes="(max-width: 900px) 100vw, 640px" alt="Ortofoto de Valledupar con la malla predial" loading="lazy" decoding="async" width={1600} height={1067} />
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
                <img className="atg-mock-photo" src="/assets/inicio/foto-archivo2.webp" srcSet="/assets/inicio/foto-archivo2-m.webp 860w, /assets/inicio/foto-archivo2.webp 1600w" sizes="(max-width: 900px) 100vw, 640px" alt="Funcionario consultando expedientes en el archivo catastral" width={1200} height={800} loading="lazy" decoding="async" />
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
              <div className="n"><CountUp value={4340} prefix="+" /></div>
              <Editable as="div" id="home.stat1-d" className="d">Trámites finalizados</Editable>
            </div>
            <div className="atg-stat reveal">
              <div className="n"><CountUp value={83} suffix="%" /></div>
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
