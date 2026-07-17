/**
 * Footer institucional global. Idéntico al de INICIO pero LIMPIO:
 * - Solo red social Instagram (se eliminaron X y Facebook).
 * - Se eliminaron los enlaces de políticas redundantes.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contacto" className="site-footer">
      <div className="footer-wrap">
        <div className="footer-card">
          <div className="footer-top">
            <img src="/assets/logo-tuterritorio-v.png" alt="Tuterritorio" className="logo-light-only" loading="lazy" decoding="async" width={320} height={284} style={{ height: 92, width: "auto", objectFit: "contain" }} />
            <img src="/assets/logo-tuterritorio-v-blanco.png" alt="" aria-hidden="true" className="logo-dark-only" loading="lazy" decoding="async" width={320} height={284} style={{ height: 92, width: "auto", objectFit: "contain" }} />
            <div className="footer-marks">
              <img src="/assets/escudo-valledupar.png" alt="Escudo de Valledupar" loading="lazy" decoding="async" width={120} height={195} style={{ height: 60, width: "auto", display: "block" }} />
              <span className="sep" />
              <img src="/assets/escudo-colombia-new.png" alt="Escudo de Colombia" loading="lazy" decoding="async" width={49} height={102} style={{ height: 56, width: "auto", display: "block" }} />
              <img src="/assets/bandera-tricolor.png" alt="Bandera de Colombia" loading="lazy" decoding="async" width={261} height={178} style={{ height: 34, width: "auto", display: "block" }} />
            </div>
          </div>

          <h3>Sede Principal</h3>
          <div className="footer-data">
            <div><b>NIT:</b> 901996731-8</div>
            <div><b>Dirección:</b> Calle 16 #9-48, Edificio Caja Agraria - Oficina 1301 Valledupar, Cesar</div>
            <div><b>Horario de atención:</b> Lunes a Viernes de 8:00 a.m. - 12:00 m. y 2:00 p.m. - 6:00 p.m.</div>
            <div style={{ marginTop: 6 }}><b>Correo contacto:</b> <a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a></div>
          </div>

          {/* Footer limpio: SOLO Instagram */}
          <div className="footer-social">
            <a className="gc-social" href="https://www.instagram.com/tuterritorio_catrastro?igsh=MWt3a2J0M2tqOG5sZA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Tuterritorio">
              <span className="ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </span>
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Enlaces legales obligatorios */}
      <nav className="footer-legal" aria-label="Enlaces legales">
        <a href="/politica-tratamiento-datos">Política de privacidad</a>
        <span aria-hidden="true">·</span>
        <a href="/terminos-y-condiciones">Términos y condiciones</a>
        <span aria-hidden="true">·</span>
        <a href="/accesibilidad">Accesibilidad</a>
        <span aria-hidden="true">·</span>
        <a href="/mapa-del-sitio">Mapa del sitio</a>
      </nav>

      <p className="footer-resp">
        Los contenidos de este sitio están bajo la responsabilidad de <span translate="no" className="notranslate">Tuterritorio</span>, gestor catastral del municipio de Valledupar.
      </p>
      <p className="footer-copy">
        © {year} <span translate="no" className="notranslate">Tuterritorio</span> — Catastro Multipropósito de Valledupar. Todos los derechos reservados.
      </p>

    </footer>
  );
}
