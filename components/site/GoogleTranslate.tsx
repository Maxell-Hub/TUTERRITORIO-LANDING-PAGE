"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Carga el widget de Google Translate (oculto). La traducción ES↔EN se controla
 * desde el círculo flotante de idioma vía la cookie `googtrans` + recarga.
 *
 * Además, en modo inglés protege términos que NO deben traducirse (marca,
 * siglas, gov.co, correos) envolviéndolos en <span class="notranslate"> ANTES
 * de que Google traduzca. Así se evitan incongruencias como "Tuterritorio"
 * convertido en "Your Territory". En español no se toca nada del DOM.
 */
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (opts: object, el: string) => void } };
  }
}

/** Términos que deben permanecer en su forma original en la versión en inglés. */
const TERM_SOURCE =
  // correos electrónicos
  "([\\w.+-]+@[\\w-]+\\.[\\w.-]+)" +
  // dominios y siglas con punto
  "|\\b(gov\\.co|datos\\.gov\\.co)\\b" +
  // marca
  "|\\bTuterritorio\\b" +
  // siglas institucionales / catastrales
  "|\\b(PQRSD|SECOP|SUIT|NPN|IGAC|SNR|RUNT|SISBÉN|SISBEN|SUIP|NIT|RUT|SIG)\\b";

function isEnglish(): boolean {
  if (typeof document === "undefined") return false;
  return /googtrans=\/[a-z]{2}\/en/.test(document.cookie);
}

/** Envuelve los términos protegidos en spans notranslate dentro del texto visible. */
function protectTerms(): void {
  if (typeof document === "undefined" || !document.body) return;

  const matcher = new RegExp(TERM_SOURCE, "g");
  const test = new RegExp(TERM_SOURCE);

  const skip = (el: Element | null): boolean =>
    !!el?.closest(
      ".notranslate,[translate='no'],script,style,noscript,textarea,input," +
        ".edt,.edt-area,[contenteditable='true'],#google_translate_element,.skiptranslate,font"
    );

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = node.nodeValue;
      if (!value || !test.test(value)) return NodeFilter.FILTER_REJECT;
      if (skip(node.parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const targets: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) targets.push(current as Text);

  for (const node of targets) {
    const text = node.nodeValue || "";
    matcher.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = matcher.exec(text))) {
      // Los espacios vecinos se meten DENTRO de la cápsula notranslate como NBSP:
      // Google recorta los espacios de los fragmentos que traduce y las palabras
      // quedaban pegadas al término protegido ("theTuterritorio", "filePQRSD").
      let before = text.slice(last, m.index);
      let lead = "";
      if (/\s$/.test(before)) { before = before.replace(/\s+$/, ""); lead = " "; }
      if (before) frag.appendChild(document.createTextNode(before));
      let end = m.index + m[0].length;
      let trail = "";
      if (/^\s/.test(text.slice(end))) {
        const ws = text.slice(end).match(/^\s+/)![0];
        end += ws.length;
        trail = " ";
      }
      const span = document.createElement("span");
      span.className = "notranslate";
      span.setAttribute("translate", "no");
      span.textContent = lead + m[0] + trail;
      frag.appendChild(span);
      last = end;
      if (matcher.lastIndex === m.index) matcher.lastIndex++; // evita bucles en coincidencias vacías
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode?.replaceChild(frag, node);
  }
}

/** Ejecuta protectTerms varias veces para ganarle a la traducción de Google. */
function protectSoon(): number[] {
  if (!isEnglish()) return [];
  protectTerms();
  return [150, 400, 900].map((d) => window.setTimeout(protectTerms, d));
}

export default function GoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    // El widget solo hace falta cuando la cookie pide inglés (al cambiar de
    // idioma la página se recarga, así que este efecto vuelve a evaluarse).
    // En español no se descargan los ~100 KB de scripts de Google Translate.
    if (!isEnglish()) return;

    // 1) Protege los términos antes de que Google cargue y traduzca.
    const timers = protectSoon();

    // 2) Carga el widget de Google Translate (una sola vez).
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "es", includedLanguages: "es,en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };
    if (!document.getElementById("gt-script")) {
      const s = document.createElement("script");
      s.id = "gt-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    }

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Al navegar (Next cambia de página sin recargar), reaplica la protección
  // sobre el contenido nuevo antes de que Google lo retraduzca.
  useEffect(() => {
    const timers = protectSoon();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [pathname]);

  // `inert` evita que el <select> interno del widget sea enfocable con teclado
  // (un elemento aria-hidden no debe contener descendientes enfocables).
  return <div id="google_translate_element" aria-hidden="true" inert />;
}
