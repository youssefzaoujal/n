"use client";

import { useEffect, useRef } from "react";
import { flowerShower, preloadFlowers } from "@/lib/flowers";
import { OPENED_EVENT } from "./HeroTitle";

/**
 * Effets « magie » posés par-dessus la page :
 * - poussière d'or qui flotte doucement,
 * - étincelles dorées à chaque toucher / clic,
 * - pluie de fleurs (roses, pivoines, pétales) à l'ouverture de l'enveloppe,
 * - fil d'or en haut de l'écran qui suit le défilement.
 */
export function MagicFx() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fil d'or de progression
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pluie de fleurs à l'ouverture
    preloadFlowers();
    const onOpened = () => {
      if (reduce) return;
      setTimeout(() => flowerShower({ y: 0.34, count: 38, spread: 1 }), 150);
      setTimeout(() => flowerShower({ x: 0.15, y: 0.48, count: 16, spread: 0.75 }), 650);
      setTimeout(() => flowerShower({ x: 0.85, y: 0.48, count: 16, spread: 0.75 }), 950);
    };
    window.addEventListener(OPENED_EVENT, onOpened);

    // Étincelles au toucher
    const onTap = (e: PointerEvent) => {
      if (reduce) return;
      const host = document.createElement("div");
      host.className = "sg-tap";
      host.style.left = `${e.clientX}px`;
      host.style.top = `${e.clientY}px`;
      for (let i = 0; i < 9; i++) {
        const s = document.createElement("i");
        const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.4;
        const d = 26 + Math.random() * 30;
        s.style.setProperty("--x", `${Math.cos(a) * d}px`);
        s.style.setProperty("--y", `${Math.sin(a) * d}px`);
        s.style.setProperty("--s", `${0.5 + Math.random() * 0.8}`);
        host.appendChild(s);
      }
      document.body.appendChild(host);
      setTimeout(() => host.remove(), 950);
    };
    window.addEventListener("pointerdown", onTap, { passive: true });

    // Poussière d'or
    let raf = 0;
    const c = canvas.current;
    let onResize: (() => void) | null = null;
    if (c && !reduce) {
      const ctx = c.getContext("2d")!;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      let W = 0;
      let H = 0;
      type P = { x: number; y: number; r: number; vx: number; vy: number; tw: number; ph: number };
      let parts: P[] = [];
      onResize = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        c.width = W * dpr;
        c.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.min(46, Math.round((W * H) / 22000));
        parts = Array.from({ length: n }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.6 + Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(0.06 + Math.random() * 0.2),
          tw: 0.5 + Math.random() * 1.4,
          ph: Math.random() * Math.PI * 2,
        }));
      };
      onResize();
      window.addEventListener("resize", onResize);
      const draw = (t: number) => {
        ctx.clearRect(0, 0, W, H);
        for (const p of parts) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -8) {
            p.y = H + 8;
            p.x = Math.random() * W;
          }
          const a = 0.18 + 0.5 * (0.5 + 0.5 * Math.sin((t / 1000) * p.tw + p.ph));
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, `rgba(214, 178, 102, ${a})`);
          g.addColorStop(1, "rgba(214, 178, 102, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(OPENED_EVENT, onOpened);
      window.removeEventListener("pointerdown", onTap);
      if (onResize) window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="sg-dust" aria-hidden="true" />
      <div className="sg-progress" aria-hidden="true">
        <div ref={bar} />
      </div>
    </>
  );
}
