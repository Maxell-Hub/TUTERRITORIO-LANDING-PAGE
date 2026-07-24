import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/store";
import { defaultFor, type News } from "@/lib/content";

/* El contenido lo administra la entidad (Vercel Blob): la página se genera
   en cada visita para que las noticias nuevas o editadas aparezcan al instante. */
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function getNoticia(id: string): Promise<{ noticia: News | null; todas: News[] }> {
  const todas = (await readContent("noticias", defaultFor("noticias"))) as News[];
  const lista = Array.isArray(todas) ? todas : [];
  return { noticia: lista.find((n) => n.id === id) ?? null, todas: lista };
}

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const { id } = await params;
  const { noticia } = await getNoticia(id);
  if (!noticia) return { title: "Noticia no encontrada" };
  return {
    title: noticia.titulo,
    description: noticia.extracto,
    alternates: { canonical: `/noticias/${noticia.id}` },
  };
}

export default async function NoticiaPage({ params }: Ctx) {
  const { id } = await params;
  const { noticia, todas } = await getNoticia(id);
  if (!noticia) notFound();

  const parrafos = (noticia.cuerpo?.trim() || noticia.extracto).split(/\n\s*\n/);
  const otras = todas.filter((n) => n.id !== noticia.id).slice(0, 3);

  return (
    <>
      {/* Artículo */}
      <section className="atg-band noti-article-band">
        <div className="noti-article">
          <Link href="/noticias" className="t-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            Volver a Noticias
          </Link>

          <div className="noti-meta">
            <span className="news-badge" style={{ background: noticia.badge, position: "static" }}>{noticia.categoria}</span>
            <span className="news-date">{noticia.fecha}</span>
          </div>
          <h1>{noticia.titulo}</h1>
          <p className="noti-lead">{noticia.extracto}</p>

          <div className="noti-imgwrap">
            <Image src={noticia.imagen} alt={noticia.titulo} fill priority sizes="(max-width: 900px) 100vw, 820px" style={{ objectFit: "cover" }} />
          </div>

          <div className="noti-cuerpo">
            {parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="noti-foot">
            <Link href="/noticias" className="atg-pill">Volver a Noticias</Link>
          </div>
        </div>
      </section>

      {/* Otras noticias */}
      {otras.length > 0 && (
        <section className="news-grid-section" style={{ paddingTop: 0 }}>
          <div className="news-grid-inner">
            <div className="news-grid-head">
              <h2>Otras noticias</h2>
              <div className="rule" />
            </div>
            <div className="news-strip">
              {otras.map((n) => (
                <Link href={`/noticias/${n.id}`} className="news-card" key={n.id}>
                  <div className="news-card-imgwrap">
                    <Image className="news-card-img" src={n.imagen} alt={n.titulo} fill sizes="(max-width: 700px) 80vw, 340px" />
                    <span className="news-card-badge" style={{ background: n.badge }}>{n.categoria}</span>
                  </div>
                  <div className="news-card-body">
                    <span className="news-date">{n.fecha}</span>
                    <h3>{n.titulo}</h3>
                    <p>{n.extracto}</p>
                    <span className="news-leer" style={{ marginTop: 4 }}>
                      Leer más
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
