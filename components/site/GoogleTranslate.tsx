"use client";

import { useEffect } from "react";

/**
 * Carga el widget de Google Translate (oculto). La traducción ES↔EN se controla
 * desde el círculo flotante de idioma vía la cookie `googtrans` + recarga.
 */
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (opts: object, el: string) => void } };
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
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
  }, []);

  return <div id="google_translate_element" aria-hidden="true" />;
}
