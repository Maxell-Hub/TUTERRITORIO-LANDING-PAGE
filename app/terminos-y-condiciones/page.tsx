import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
  description:
    "Términos y condiciones de uso del sitio web de Tuterritorio — Catastro Multipropósito de Valledupar.",
  alternates: { canonical: "/terminos-y-condiciones" },
};

export default function TerminosPage() {
  return (
    <>
      {/* Precarga del hero (LCP): React eleva este <link> al <head> */}
      <link rel="preload" as="image" href="/assets/foto-tratamiento.jpg" media="(min-width: 721px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/foto-tratamiento-m.webp" media="(max-width: 720px)" fetchPriority="high" />
      {/* Hero fotográfico ATG */}
      <section className="atg-hero" style={{ backgroundImage: "linear-gradient(var(--photo-tint),var(--photo-tint)), url(/assets/foto-tratamiento.jpg)", ["--hero-m" as string]: "url(/assets/foto-tratamiento-m.webp)", backgroundPosition: "center 45%" }}>
        <h1>Términos y Condiciones de Uso</h1>
        <p className="sub">Tuterritorio — Catastro Multipropósito de Valledupar</p>
      </section>

      <section className="legal-hero">
        <div className="legal-wrap">
        <ul className="legal-meta">
          <li><b>Última actualización:</b> 25 de junio de 2026</li>
          <li><b>Entidad:</b> Tuterritorio (NIT 901.996.731-8)</li>
        </ul>

        <div className="legal-body">
          <p className="legal-note">
            <b>Nota:</b> Este documento es un borrador base y debe ser revisado y aprobado por el área
            jurídica de la entidad antes de su versión definitiva.
          </p>

          <h2 id="objeto">1. Objeto y aceptación</h2>
          <p>
            El presente documento regula el uso del sitio web oficial de Tuterritorio (en adelante,
            «el sitio»). Al acceder y utilizar el sitio, el usuario acepta estos términos. Si no está
            de acuerdo, debe abstenerse de usarlo.
          </p>

          <h2 id="uso">2. Uso del sitio</h2>
          <ul className="legal-list legal-list-disc">
            <li>El sitio ofrece información institucional, trámites y servicios catastrales y canales de atención.</li>
            <li>El usuario se compromete a hacer un uso lícito, veraz y responsable de la información y los formularios.</li>
            <li>Está prohibido intentar vulnerar la seguridad, integridad o disponibilidad del sitio.</li>
          </ul>

          <h2 id="informacion">3. Información publicada</h2>
          <p>
            Tuterritorio procura que la información sea correcta y esté actualizada; sin embargo, no
            garantiza la ausencia de errores. La información catastral oficial con efectos jurídicos se
            obtiene a través de los trámites y certificados expedidos por la entidad.
          </p>

          <h2 id="propiedad">4. Propiedad intelectual</h2>
          <p>
            Los logotipos, marcas, textos y demás contenidos del sitio pertenecen a Tuterritorio o a
            sus titulares y están protegidos por la ley. No podrán reproducirse con fines comerciales
            sin autorización previa.
          </p>

          <h2 id="enlaces">5. Enlaces a sitios de terceros</h2>
          <p>
            El sitio puede contener enlaces a sitios externos (por ejemplo, plataformas de consulta de
            predios o de impuesto predial). Tuterritorio no es responsable del contenido ni de las
            políticas de esos sitios. Al salir hacia un sitio externo, se mostrará un aviso.
          </p>

          <h2 id="datos">6. Protección de datos</h2>
          <p>
            El tratamiento de datos personales se rige por la{" "}
            <a href="/politica-tratamiento-datos">Política de Tratamiento de Datos Personales</a> y la
            Ley 1581 de 2012.
          </p>

          <h2 id="responsabilidad">7. Limitación de responsabilidad</h2>
          <p>
            Tuterritorio no será responsable por daños derivados de la imposibilidad de uso del sitio,
            interrupciones del servicio o uso indebido por parte de terceros, salvo lo dispuesto por la ley.
          </p>

          <h2 id="ley">8. Ley aplicable</h2>
          <p>
            Estos términos se rigen por la legislación de la República de Colombia.
          </p>

          <h2 id="contacto">9. Contacto</h2>
          <p>
            Dudas sobre estos términos: <a href="mailto:contactenos@tuterritorio.gov.co">contactenos@tuterritorio.gov.co</a>
            {" "}· (605) 5885761 Ext. 100.
          </p>
        </div>
        </div>
      </section>
    </>
  );
}
