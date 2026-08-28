import Link from "next/link";
import Image from "next/image";
import { readContent } from "@/lib/store";
import { defaultFor, type News } from "@/lib/content";

/* Ordena por fecha real: primero el id (n-AAAA-MM-DD), luego la fecha en
   español ("11 al 13 de agosto de 2026"). La más reciente queda de primera. */
const MESES: Record<string, number> = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
function fechaDe(n: News): number {
  const mId = n.id.match(/^n-(\d{4})-(\d{2})-(\d{2})/);
  if (mId) return new Date(+mId[1], +mId[2] - 1, +mId[3]).getTime();
  const mTxt = n.fecha.toLowerCase().match(/(\d{1,2})\s+.*?\bde\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/);
  if (mTxt && MESES[mTxt[2]] !== undefined) return new Date(+mTxt[3], MESES[mTxt[2]], +mTxt[1]).getTime();
  return 0;
}

const Arrow = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

/**
 * Noticias recientes en el Inicio: muestra las 3 noticias más recientes en
 * tarjetas (reutiliza los estilos de la página de Noticias) y enlaza al listado
 * completo. Lee del mismo origen de contenido que /noticias.
 */
export default async function NoticiasRecientes() {
  const data = (await readContent("noticias", defaultFor("noticias"))) as News[];
  const lista = Array.isArray(data) ? data : [];
  const recientes = [...lista].sort((a, b) => fechaDe(b) - fechaDe(a)).slice(0, 3);
  if (recientes.length === 0) return null;

  return (
    <section className="news-grid-section home-news" aria-labelledby="home-news-title">
      <div className="news-grid-inner">
        <div className="news-grid-head">
          <h2 id="home-news-title">Noticias recientes</h2>
          <div className="rule" />
          <Link href="/noticias" className="news-strip-hint">Ver todas <Arrow size={14} /></Link>
        </div>
        <div className="news-strip">
          {recientes.map((n) => (
            <Link href={`/noticias/${n.id}`} className="news-card" key={n.id}>
              <div className="news-card-imgwrap">
                <Image className="news-card-img" src={n.imagen} alt={n.titulo} fill sizes="(max-width: 700px) 100vw, 380px" />
                <span className="news-card-badge" style={{ background: n.badge }}>{n.categoria}</span>
              </div>
              <div className="news-card-body">
                <span className="news-date">{n.fecha}</span>
                <h3>{n.titulo}</h3>
                <p>{n.extracto}</p>
                <span className="news-leer" style={{ marginTop: 4 }}>Leer más <Arrow size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
