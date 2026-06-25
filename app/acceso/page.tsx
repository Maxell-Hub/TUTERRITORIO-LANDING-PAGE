import { notFound } from "next/navigation";

// /acceso (sin token) no debe mostrar nada útil: solo una página de error 404.
export default function AccesoIndex() {
  notFound();
}
