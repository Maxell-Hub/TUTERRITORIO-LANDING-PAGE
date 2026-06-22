/**
 * Guarda contenido editable en el servidor (PUT /api/content/<key>).
 * Lanza Error con el mensaje del servidor si falla, para mostrarlo al admin.
 */
export async function saveContent(key: string, value: unknown): Promise<void> {
  const res = await fetch(`/api/content/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) {
    let msg = "No se pudieron guardar los cambios";
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* respuesta sin JSON */
    }
    throw new Error(msg);
  }
}
