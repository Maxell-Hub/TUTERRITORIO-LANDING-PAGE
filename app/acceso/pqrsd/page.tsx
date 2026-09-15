import type { Metadata } from "next";
import PqrsdAdmin from "@/components/admin/PqrsdAdmin";

export const metadata: Metadata = {
  title: "Gestión de PQRSD",
  robots: { index: false, follow: false },
};

export default function GestionPqrsdPage() {
  return (
    <section className="atg-band" style={{ minHeight: "70vh" }}>
      <div className="atg-wrap">
        <div style={{ maxWidth: 1080, margin: "0 auto 26px" }}>
          <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#3B85A5", fontWeight: 700 }}>
            Panel de administrador
          </span>
          <h1 style={{ fontSize: "clamp(26px,4vw,34px)", color: "#163A4C", margin: "6px 0 4px", fontWeight: 800 }}>
            Gestión de PQRSD
          </h1>
          <p style={{ color: "#5b6b74", margin: 0 }}>
            Consulta las solicitudes recibidas, revisa sus anexos y actualiza su estado y respuesta.
          </p>
        </div>
        <PqrsdAdmin />
      </div>
    </section>
  );
}
