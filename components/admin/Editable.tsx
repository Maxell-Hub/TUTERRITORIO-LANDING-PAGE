"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";

/* ------------------------------------------------------------------
   Overrides: textos editables del sitio.
   Un único mapa { id -> texto } guardado en /data/overrides.json.
   Cada <Editable id="..."> muestra el override si existe, o su texto
   por defecto (el children) si no.
------------------------------------------------------------------ */

type OverridesCtx = {
  values: Record<string, string>;
  save: (id: string, value: string) => void;
};

const Ctx = createContext<OverridesCtx | null>(null);

export function OverridesProvider({ children }: { children: React.ReactNode }) {
  const { notify } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    fetch("/api/content/overrides")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d && typeof d === "object") setValues(d as Record<string, string>);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const save = useCallback(
    (id: string, value: string) => {
      setValues((prev) => {
        const next = { ...prev, [id]: value };
        fetch("/api/content/overrides", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        })
          .then((r) => {
            if (!r.ok) throw new Error();
            notify("Cambios guardados");
          })
          .catch(() => notify("No se pudieron guardar los cambios", "error"));
        return next;
      });
    },
    [notify]
  );

  return <Ctx.Provider value={{ values, save }}>{children}</Ctx.Provider>;
}

function useOverrides(): OverridesCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOverrides debe usarse dentro de <OverridesProvider>");
  return c;
}

/* ------------------------------------------------------------------
   <Editable> — texto editable inline para el administrador.
------------------------------------------------------------------ */

type Tag = keyof React.JSX.IntrinsicElements;

type EditableProps = {
  id: string;
  children: string; // texto por defecto
  as?: Tag;
  multiline?: boolean;
  className?: string;
};

export default function Editable({
  id,
  children,
  as = "span",
  multiline = false,
  className = "",
}: EditableProps) {
  const { user } = useAuth();
  const { values, save } = useOverrides();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const value = values[id] ?? children;
  const isAdmin = !!user;

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // Visitante normal (o aún sin sesión): solo muestra el texto.
  if (!isAdmin) {
    return createElement(
      as,
      { className, style: multiline ? { whiteSpace: "pre-line" } : undefined },
      value
    );
  }

  if (editing) {
    return (
      <span className="edt-edit">
        <textarea
          ref={inputRef}
          className="edt-area"
          rows={multiline ? 4 : 2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <span className="edt-edit-actions">
          <button
            type="button"
            className="adm-btn sm"
            onClick={() => {
              save(id, draft.trim());
              setEditing(false);
            }}
          >
            Guardar
          </button>
          <button type="button" className="adm-btn ghost sm" onClick={() => setEditing(false)}>
            Cancelar
          </button>
        </span>
      </span>
    );
  }

  // Admin viendo: texto con resaltado y lápiz; al hacer clic, edita.
  return createElement(
    as,
    {
      className: `${className} edt edt-on`.trim(),
      style: multiline ? { whiteSpace: "pre-line" } : undefined,
      title: "Clic para editar",
      onClick: () => {
        setDraft(value);
        setEditing(true);
      },
    },
    value,
    <span key="pencil" className="edt-pencil" aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </span>
  );
}
