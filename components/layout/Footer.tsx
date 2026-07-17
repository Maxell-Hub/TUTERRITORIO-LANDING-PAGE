/**
 * Footer institucional global — estilo ATG.
 * Grid de 5 columnas (Marca / Sitio / Atención / Normativa / Contacto)
 * sobre fondo claro, con barra inferior de copyright + enlaces legales.
 * Conserva: id="contacto" (anclas /#contacto), Instagram exacto,
 * párrafo de responsabilidad y spans notranslate.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contacto" className="aft-footer">
      <div className="aft-wrap">
        <div className="aft-grid">

          {/* 1. Marca */}
          <div className="aft-col aft-brand">
            <img src="/assets/logo-tuterritorio-v.png" alt="Tuterritorio" className="logo-light-only" loading="lazy" decoding="async" width={320} height={284} style={{ height: 48, width: "auto", objectFit: "contain" }} />
            <img src="/assets/logo-tuterritorio-v-blanco.png" alt="" aria-hidden="true" className="logo-dark-only" loading="lazy" decoding="async" width={320} height={284} style={{ height: 48, width: "auto", objectFit: "contain" }} />
            <p className="aft-desc">Gestor catastral del municipio de Valledupar. Catastro Multipropósito.</p>
            <div className="aft-marks">
              <img src="/assets/escudo-valledupar.png" alt="Escudo de Valledupar" loading="lazy" decoding="async" width={120} height={195} style={{ height: 40, width: "auto", display: "block" }} />
              <img src="/assets/escudo-colombia-new.png" alt="Escudo de Colombia" loading="lazy" decoding="async" width={49} height={102} style={{ height: 38, width: "auto", display: "block" }} />
              <img src="/assets/bandera-tricolor.png" alt="Bandera de Colombia" loading="lazy" decoding="async" width={261} height={178} style={{ height: 22, width: "auto", display: "block" }} />
            </div>
          </div>

          {/* 2. Sitio */}
          <nav className="aft-col" aria-label="Sitio">
            <h4 className="aft-h4">Sitio</h4>
            <ul className="aft-list">
              <li><a href="/">Inicio</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/servicios">Trámites y servicios</a></li>
              <li><a href="/noticias">Noticias</a></li>
            </ul>
          </nav>

          {/* 3. Atención */}
          <nav className="aft-col" aria-label="Atención">
            <h4 className="aft-h4">Atención</h4>
            <ul className="aft-list">
              <li><a href="/pqrsd">PQRSD</a></li>
              <li><a href="/preguntas-frecuentes">Preguntas frecuentes</a></li>
              <li><a href="/contactos">Contactos</a></li>
              <li><a href="/transparencia">Transparencia</a></li>
            </ul>
          </nav>

          {/* 4. Normativa */}
          <div className="aft-col">
            <h4 className="aft-h4">Normativa</h4>
            <ul className="aft-list aft-mono">
              <li>Ley 1712 de 2014</li>
              <li>Res. MinTIC 1519/2020</li>
              <li>Catastro multipropósito</li>
            </ul>
          </div>

          {/* 5. Contacto */}
          <div className="aft-col">
            <h4 className="aft-h4">Contacto</h4>
            <address className="aft-address">
              <div><b>NIT:</b> 901996731-8</div>
              <div>Calle 16 #9-48, Edificio Caja Agraria - Oficina 1301 Valledupar, Cesar</div>
              <div>Lunes a Viernes de 8:00 a.m. - 12:00 m. y 2:00 p.m. - 6:00 p.m.</div>
              <div><a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a></div>
              <div>
                <a className="aft-social" href="https://www.instagram.com/tuterritorio_catrastro?igsh=MWt3a2J0M2tqOG5sZA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Tuterritorio">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                  Instagram
                </a>
              </div>
            </address>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="aft-bottom">
          <p className="aft-copy">
            © {year} <span translate="no" className="notranslate">Tuterritorio</span> — Catastro Multipropósito de Valledupar. Todos los derechos reservados.
          </p>
          <nav className="aft-legal" aria-label="Enlaces legales">
            <a href="/politica-tratamiento-datos">Política de privacidad</a>
            <span aria-hidden="true">·</span>
            <a href="/terminos-y-condiciones">Términos y condiciones</a>
            <span aria-hidden="true">·</span>
            <a href="/accesibilidad">Accesibilidad</a>
            <span aria-hidden="true">·</span>
            <a href="/mapa-del-sitio">Mapa del sitio</a>
          </nav>
        </div>

        <p className="aft-resp">
          Los contenidos de este sitio están bajo la responsabilidad de <span translate="no" className="notranslate">Tuterritorio</span>, gestor catastral del municipio de Valledupar.
        </p>
      </div>
    </footer>
  );
}
