import Image from "next/image";
import Editable from "@/components/admin/Editable";
import ExternalLink from "@/components/common/ExternalLink";

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tt-lime-400)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function Hero() {
  return (
    <section id="consultar" className="hero">
      <div className="hero-dots" />
      <div className="hero-blobA" />
      <div className="hero-blobB" />

      <div className="hero-map">
        <Image
          src="/assets/mapa-valledupar-pot.png"
          alt="Mapa de la estructura ecológica y comunas de Valledupar"
          fill
          priority
          sizes="(max-width: 860px) 0px, 50vw"
        />
      </div>
      <div className="hm-fade" />

      <div className="hero-inner">
        <div className="hero-copy">
          <Editable as="span" id="home.eyebrow" className="hero-eyebrow">Catastro Multipropósito · Valledupar</Editable>
          <h1>
            Conoce tu predio,<br />
            asegura{" "}
            <span className="hero-tu">
              <span className="green">Tuterritorio</span>
            </span>
          </h1>
          <Editable as="p" id="home.intro" multiline>
            Consulta la información catastral oficial de tu propiedad en Valledupar como linderos, área, avalúo y estado de tus trámites en un solo lugar.
          </Editable>
          <div className="hero-cta">
            <ExternalLink href="https://catastroenlinea.com.co/sig.aspx" className="btn-hero primary" ariaLabel="Consulta tu predio en línea">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Consulta tu predio
            </ExternalLink>
            <a href="/servicios" className="btn-hero ghost">
              Realiza un trámite
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>

          <div className="hero-feats">
            <div className="hero-feat"><span className="chk"><Check /></span> <Editable as="span" id="home.feat1">Información oficial y actualizada</Editable></div>
            <div className="hero-feat"><span className="chk"><Check /></span> <Editable as="span" id="home.feat2">Atención presencial personalizada</Editable></div>
          </div>
          <span className="hero-ribbon" />
        </div>
      </div>
    </section>
  );
}
