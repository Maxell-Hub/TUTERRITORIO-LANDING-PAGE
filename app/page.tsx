import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";

export const metadata: Metadata = {
  title: { absolute: "Tuterritorio — Catastro Multipropósito de Valledupar" },
  description:
    "Consulta tu predio en Valledupar: linderos, área y avalúo catastral. Realiza trámites catastrales, radica tu PQRSD y consulta el impuesto predial con Tuterritorio, gestor catastral de Valledupar.",
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
      {/* 1 · Hero fotográfico */}
      <section className="atg-hero" id="consultar">
        <Editable as="span" id="home.eyebrow" className="atg-eyebrow">Catastro Multipropósito · Valledupar</Editable>
        <h1>
          Conoce tu predio,<br />asegura <span className="b notranslate" translate="no">Tuterritorio</span>
        </h1>
        <Editable as="p" id="home.intro" className="sub" multiline>
          Consulta la información catastral oficial de tu propiedad en Valledupar como linderos, área, avalúo y estado de tus trámites en un solo lugar.
        </Editable>
        <div className="atg-cta-row">
          <a className="atg-pill" href="/servicios">Consulta tu predio</a>
          <a className="atg-pill ghost" href="/#visor">Conocer la plataforma</a>
        </div>
      </section>

      {/* 2 · Feature: visor geográfico */}
      <section className="atg-band" id="visor">
        <div className="atg-wrap">
          <div className="atg-feature">
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <div className="atg-mock-bar" aria-hidden="true">
                  <span className="d" /><span className="d" /><span className="d" />
                  <span className="title">visor — tuterritorio.gov.co</span>
                </div>
                <div className="atg-map-body" role="img" aria-label="Ortofoto de Valledupar con la malla predial">
                  <div className="atg-layers" aria-hidden="true">
                    <span><i>●</i> Predios</span>
                    <span><i>●</i> Ortofoto_Valledupar_1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>01</b> · Visor geográfico</span>
              <h2>Todo el territorio, en un visor vivo</h2>
              <Editable as="p" id="home.visor-p" multiline>
                Cartografía predial completa de Valledupar: 6 sectores catastrales en el área urbana, 25 corregimientos en zona rural y resguardos indígenas en la Sierra Nevada.
              </Editable>
              <ul>
                <li>Zonas físicas, económicas y usos del suelo por capas</li>
                <li>Consulta ciudadana del predio en línea</li>
              </ul>
              <a className="atg-pill" href="/servicios">Consulta tu predio</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Feature invertida: trámites */}
      <section className="atg-band" id="tramites">
        <div className="atg-wrap">
          <div className="atg-feature flip">
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>02</b> · Trámites catastrales</span>
              <h2>Tus trámites, con requisitos y tiempos claros</h2>
              <Editable as="p" id="home.tramites-p" multiline>
                Actualiza, corrige y consulta la información de predios y propietarios. Cada trámite indica sus requisitos y su tiempo de respuesta en días hábiles.
              </Editable>
              <ul>
                <li>Mutaciones, englobes, desenglobes y rectificaciones</li>
                <li>Radica tu PQRSD y consulta su estado en línea</li>
                <li>Atención presencial en la sede principal</li>
              </ul>
              <a className="atg-pill" href="/servicios">Ver los trámites</a>
            </div>
            <div className="atg-visual reveal">
              <div className="atg-mock">
                <img className="atg-mock-photo" src="/assets/atg/foto-archivo.jpg" alt="Funcionario consultando expedientes en el archivo catastral" width={1200} height={800} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Declaración centrada */}
      <section className="atg-statement">
        <div className="atg-wrap">
          <span className="atg-eyebrow">La sinergia <b>A · T · G</b></span>
          <h2>Una sinergia que transforma la gestión catastral</h2>
          <Editable as="p" id="home.sinergia-p" multiline>
            Cada territorio tiene tres pilares. Tuterritorio los integra en un ecosistema digital único, para que la información catastral de Valledupar deje de estar dispersa y se convierta en una herramienta de decisión.
          </Editable>
        </div>
      </section>

      {/* 5 · Tres pilares con foto */}
      <section className="atg-band">
        <div className="atg-wrap">
          <div className="atg-pillars">
            <article className="atg-pcard a reveal">
              <div className="pfoto" role="img" aria-label="Fachada de la Alcaldía de Valledupar" />
              <div className="pbox">
                <h3>Autoridad local</h3>
                <p>La que decide. Trámites, resoluciones e indicadores en un solo lugar para la ciudadanía y la administración de Valledupar.</p>
                <a className="more" href="/nosotros"><span className="line" aria-hidden="true" /><em>Conocer más</em></a>
              </div>
            </article>
            <article className="atg-pcard t reveal">
              <div className="pfoto" role="img" aria-label="Predio rural con corrales y cercas de madera" />
              <div className="pbox">
                <h3>Terrenos</h3>
                <p>Los que sustentan el desarrollo. Cada predio con su información física, jurídica y económica unificada y trazable.</p>
                <a className="more" href="/servicios"><span className="line" aria-hidden="true" /><em>Conocer más</em></a>
              </div>
            </article>
            <article className="atg-pcard g reveal">
              <div className="pfoto" role="img" aria-label="Río Guatapurí entre rocas y vegetación" />
              <div className="pbox">
                <h3>Geografía</h3>
                <p>La que lo define todo. Cartografía viva sobre estándares geoespaciales, conectada con la realidad del territorio.</p>
                <a className="more" href="/#visor"><span className="line" aria-hidden="true" /><em>Conocer más</em></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 6 · Cifras */}
      <section className="atg-band atg-stats-band">
        <div className="atg-wrap">
          <div className="atg-stats">
            <div className="atg-stat reveal">
              <div className="n">+4.340</div>
              <div className="d">Trámites finalizados</div>
            </div>
            <div className="atg-stat reveal">
              <div className="n">83%</div>
              <div className="d">Efectividad operativa</div>
            </div>
            <div className="atg-stat reveal">
              <div className="n">6 + 25</div>
              <div className="d">Sectores urbanos y corregimientos rurales</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Panel: atención y PQRSD */}
      <section className="atg-band" id="pqrsd-panel">
        <div className="atg-wrap">
          <div className="atg-panel">
            <div className="atg-copy reveal">
              <span className="atg-eyebrow"><b>03</b> · Atención a la ciudadanía</span>
              <h2>Estamos para atenderte</h2>
              <Editable as="p" id="home.atencion-p" multiline>
                Radica tus peticiones, quejas, reclamos, sugerencias y denuncias, o visítanos en la sede principal. Cada solicitud queda con radicado y tiempos de respuesta según la ley.
              </Editable>
              <ul>
                <li>PQRSD en línea con radicado inmediato</li>
                <li>Preguntas frecuentes y ABC catastral</li>
                <li>Lunes a viernes de 8:00 a.m. a 6:00 p.m.</li>
              </ul>
              <a className="atg-pill" href="/pqrsd">Radicar una PQRSD</a>
            </div>
            <img className="photo" src="/assets/atg/foto-panoramica.jpg" alt="Panorámica de Valledupar con la Sierra Nevada al fondo" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* 8 · Franja fotográfica de cierre */}
      <section className="atg-photo-band">
        <div className="atg-wrap">
          <span className="atg-eyebrow">Hecho <b>para Valledupar</b></span>
          <h2>Hecho para el territorio de Valledupar</h2>
          <Editable as="p" id="home.cierre-p" multiline>
            Del área urbana a los corregimientos de la Sierra Nevada, Tuterritorio acompaña al municipio en su camino hacia un catastro multipropósito, moderno y eficiente.
          </Editable>
          <a className="atg-pill" href="/contactos">Contáctanos</a>
        </div>
      </section>
    </>
  );
}
