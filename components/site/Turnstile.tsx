"use client";

// Widget de Cloudflare Turnstile (captcha). Se renderiza SOLO si hay Site Key
// pública (NEXT_PUBLIC_TURNSTILE_SITE_KEY). Sin ella, no muestra nada y el
// formulario funciona igual que antes.
import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    // API mínima de Turnstile que usamos.
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || idRef.current || !boxRef.current || !window.turnstile) return;
      idRef.current = window.turnstile.render(boxRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const SID = "cf-turnstile-script";
      let s = document.getElementById(SID) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement("script");
        s.id = SID;
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", render);
      // Respaldo por si el evento load ya pasó.
      const iv = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(iv);
          render();
        }
      }, 250);
      window.setTimeout(() => window.clearInterval(iv), 10000);
    }

    return () => {
      cancelled = true;
      if (idRef.current && window.turnstile) {
        try {
          window.turnstile.remove(idRef.current);
        } catch {
          /* noop */
        }
        idRef.current = null;
      }
    };
  }, [onToken]);

  if (!SITE_KEY) return null;
  return <div ref={boxRef} className="cf-turnstile-box" style={{ margin: "4px 0" }} />;
}
