"use client";

import { useEffect } from "react";

/**
 * Animaciones de scroll del sitio:
 *  - reveal: añade .in a los .reveal al entrar al viewport (IntersectionObserver).
 *  - #scrollProg: barra de progreso superior (si existe en la página).
 *  - [data-parallax]: leve desplazamiento parallax (si existe).
 * Respeta prefers-reduced-motion.
 */
export default function RevealManager() {
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const prog = document.getElementById("scrollProg");
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    if (reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    // Reveal con IntersectionObserver (con leve stagger por transition-delay).
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.08}s`;
      io.observe(el);
    });

    // Barra de progreso + parallax (solo si hay algo que mover).
    let ticking = false;
    const hasScrollFx = !!prog || parallax.length > 0;
    const update = () => {
      const vh = window.innerHeight || 800;
      if (prog) {
        const max = document.documentElement.scrollHeight - vh || 1;
        const p = Math.min(1, Math.max(0, window.pageYOffset / max));
        prog.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      parallax.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax") || "0.4");
        const r = el.getBoundingClientRect();
        const offset = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0,${(offset * speed * -0.06).toFixed(2)}px,0)`;
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    if (hasScrollFx) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      requestAnimationFrame(() => requestAnimationFrame(update));
    }

    return () => {
      io.disconnect();
      if (hasScrollFx) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
  }, []);

  return null;
}
