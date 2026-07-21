import type { Metadata } from "next";
import Editable from "@/components/admin/Editable";
import EnlacesInteres from "@/components/home/EnlacesInteres";

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
                <div className="atg-map-body" role="img" aria-label="Ortofoto de Valledupar con la malla predial">
                </div>
              </div>
            </div>
            <div className="atg-copy reveal">
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
      <section className="atg-band" id="tramites-detalle">
        <div className="atg-wrap">
          <div className="atg-feature flip">
            <div className="atg-copy reveal">
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
                <img className="atg-mock-photo" src="/assets/foto-archivo.jpg" alt="Funcionario consultando expedientes en el archivo catastral" width={1200} height={800} loading="lazy" decoding="async" />
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
            <img className="photo" src="/assets/foto-panoramica.jpg" alt="Panorámica de Valledupar con la Sierra Nevada al fondo" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* 8 · Franja fotográfica de cierre */}
      <section className="atg-photo-band">
        <div className="atg-wrap">
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
