import ExternalLink from "@/components/common/ExternalLink";

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Iconos de cada servicio (estilo línea, Lucide) */
const ICONS: Record<string, React.ReactNode> = {
  predio: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  tramite: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></>,
  pqrsd: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>,
  predial: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
};
const Icon = ({ name }: { name: string }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const LINKS = [
  {
    icon: "predio",
    accent: "var(--tt-blue-700)",
    title: "Consulta tu predio",
    desc: "Verifica los linderos, el área, el uso y el avalúo catastral de tu predio.",
    cta: "Consultar",
    href: "https://catastroenlinea.com.co/sig.aspx",
    external: true,
  },
  {
    icon: "tramite",
    accent: "var(--tt-green-600)",
    title: "Trámites y servicios",
    desc: "Actualiza, corrige y solicita tus productos catastrales en línea.",
    cta: "Ver trámites",
    href: "/servicios",
    external: false,
  },
  {
    icon: "pqrsd",
    accent: "var(--tt-navy-700)",
    title: "PQRSD",
    desc: "Radica peticiones, quejas, reclamos, sugerencias y denuncias.",
    cta: "Radicar",
    href: "/pqrsd",
    external: false,
  },
  {
    icon: "predial",
    accent: "var(--tt-amber-600)",
    title: "Impuesto predial",
    desc: "Consulta el estado de tu impuesto predial y los puntos de pago.",
    cta: "Consultar",
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
            <h2 className="sec-title">Servicios en línea</h2>
            <p className="sec-sub">Consulta, gestiona y haz seguimiento a la información de tu predio de forma ágil y segura, sin desplazarte.</p>
          </div>
          <span className="ribbon-bar" />
        </div>

        <div className="svc-grid">
          {LINKS.map((l) => {
            const inner = (
              <>
                <span className="svc-ic"><Icon name={l.icon} /></span>
                <h3 className="svc-title">{l.title}</h3>
                <p className="svc-desc">{l.desc}</p>
                <span className="svc-link">{l.cta} <Arrow /></span>
              </>
            );
            // Enlaces externos (no-.gov.co) → aviso de salida del sitio oficial.
            return l.external ? (
              <ExternalLink key={l.title} href={l.href} className="svc-card reveal" ariaLabel={l.title} style={{ ["--accent" as string]: l.accent }}>
                {inner}
              </ExternalLink>
            ) : (
              <a key={l.title} href={l.href} className="svc-card reveal" style={{ ["--accent" as string]: l.accent }}>
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
