"use client";

import { useEffect, useRef } from "react";

/** Lightweight drifting particles. Pauses offscreen and respects reduced motion. */
export default function Particles({ count = 55, className = "" }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.3,
      vy: Math.random() * 0.35 + 0.08, vx: (Math.random() - 0.5) * 0.15, a: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.7 ? "181,255,92" : "0,212,123",
    }));
    const tick = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const p of ps) {
          p.y -= p.vy; p.x += p.vx;
          if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.hue},${p.a})`;
          ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${p.hue},.8)`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
