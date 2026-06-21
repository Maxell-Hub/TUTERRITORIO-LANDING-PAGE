/**
 * Footer institucional global. Idéntico al de INICIO pero LIMPIO:
 * - Solo red social Instagram (se eliminaron X y Facebook).
 * - Se eliminaron los enlaces de políticas redundantes.
 */
export default function Footer() {
  return (
    <footer id="contacto" className="site-footer">
      <div className="footer-wrap">
        <div className="footer-card">
          <div className="footer-top">
            <img src="/assets/logo-tuterritorio-footer.png" alt="Tuterritorio" style={{ height: 92, width: "auto", objectFit: "contain", display: "block" }} />
            <div className="footer-marks">
              <img src="/assets/escudo-valledupar.png" alt="Escudo de Valledupar" style={{ height: 60, display: "block" }} />
              <span className="sep" />
              <img src="/assets/escudo-colombia-new.png" alt="Escudo de Colombia" style={{ height: 56, display: "block" }} />
              <img src="/assets/bandera-tricolor.png" alt="Bandera de Colombia" style={{ height: 34, display: "block" }} />
            </div>
          </div>

          <h3>Sede Principal</h3>
          <div className="footer-data">
            <div><b>NIT:</b> 901996731-8</div>
            <div><b>Dirección:</b> Calle 16 #9-48, Edificio Caja Agraria - Oficina 1301 Valledupar, Cesar</div>
            <div><b>Horario de atención:</b> Lunes a Viernes de 8:00 a.m. - 12:00 m. y 2:00 p.m. - 5:00 p.m.</div>
            <div><b>Teléfono:</b> +(57)(605) 5885761</div>
            <div><b>Servicio a la ciudadanía:</b> +(57)(605) 5885761 Ext. 100</div>
            <div style={{ marginTop: 6 }}><b>Denuncias:</b> <a href="mailto:denuncias@tuterritorio.gov.co">denuncias@tuterritorio.gov.co</a></div>
            <div><b>Correo contacto:</b> <a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a></div>
          </div>

          {/* Footer limpio: SOLO Instagram */}
          <div className="footer-social">
            <a className="gc-social" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Tuterritorio">
              <span className="ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.1" fill="#fff" stroke="none" />
                </svg>
              </span>
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* gov.co bottom bar */}
      <div className="govco-bottom">
        <div className="govco-bottom-row">
          <img src="/assets/co-colombia.png" alt="CO — Colombia" style={{ height: 46, display: "block" }} />
          <span className="sep" />
          <img src="/assets/govco-white.png" alt="gov.co" style={{ height: 30, display: "block" }} />
        </div>
      </div>
    </footer>
  );
}
