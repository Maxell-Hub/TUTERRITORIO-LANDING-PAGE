const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const LINKS = [
  {
    n: "01",
    accent: "var(--tt-blue-700)",
    title: "Consulta tu predio",
    desc: "Verifica la información catastral de tu predio: linderos, área, uso y avalúo registrado.",
    href: "https://catastroenlinea.com.co/sig.aspx",
    external: true,
  },
  {
    n: "02",
    accent: "var(--tt-green-600)",
    title: "PQRSD",
    desc: "Radica tus peticiones, quejas, reclamos, sugerencias y denuncias ante la entidad.",
    href: "/pqrsd",
    external: false,
  },
  {
    n: "03",
    accent: "var(--tt-amber-500)",
    title: "Impuesto predial",
    desc: "Consulta el estado de tu impuesto predial y los puntos de atención para el pago.",
    href: "https://valledupar.taxationsmart.co/ords/f?p=150000:4:11500931490867:::4:P4_ID_IMPSTO,P4_ID_IMPSTO_SBMPSTO:101,1011",
    external: true,
  },
];

export default function EnlacesInteres() {
  return (
    <section id="tramites" className="section-gray">
      <div className="section-inner">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">Accesos rápidos</span>
            <h2 className="sec-title">Enlaces de interés</h2>
          </div>
          <span className="ribbon-bar" />
        </div>

        <div className="enlaces-list">
          {LINKS.map((l) => (
            <a
              key={l.n}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="enlace-row reveal"
              style={{ ["--accent" as string]: l.accent }}
            >
              <span className="enlace-num">{l.n}</span>
              <div className="enlace-body">
                <h3 className="et">{l.title}</h3>
                <p className="ed">{l.desc}</p>
              </div>
              <span className="enlace-arrow"><Arrow /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
