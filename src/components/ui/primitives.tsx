"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { Check, Copy } from "lucide-react";
import { CONFIG, hasContract, uniswapUrl } from "@/config/site";
import { useToast } from "./Toast";

/** Adds .in when scrolled into view. */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}

/** Counts up to the value whenever real data arrives. */
export function AnimatedNumber({ value, format }: { value: number | null; format: (v: number | null) => string }) {
  const [shown, setShown] = useState<number | null>(value);
  const prev = useRef<number | null>(null);
  useEffect(() => {
    if (value == null) { setShown(null); prev.current = null; return; }
    const from = prev.current ?? 0;
    prev.current = value;
    if (from === value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(value); return; }
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(from + (value - from) * e);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(shown)}</>;
}

export function useCopy() {
  const toast = useToast();
  const [done, setDone] = useState(false);
  const copy = async (text: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast(label, "success");
      setTimeout(() => setDone(false), 1800);
    } catch {
      toast("Copy failed — select and copy manually", "error");
    }
  };
  return { copy, done };
}

/** Contract address pill with copy. Shows a clear "not published" state when CA is empty. */
export function ContractPill({ className = "" }: { className?: string }) {
  const { copy, done } = useCopy();
  const toast = useToast();
  return (
    <div className={`flex items-center gap-2 rounded-2xl border border-line bg-bg/70 p-1.5 pl-4 backdrop-blur ${className}`}>
      <span className="font-mono text-[10px] tracking-widest text-mute uppercase">CA</span>
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink/90 sm:text-sm">
        {hasContract ? CONFIG.contractAddress : "Not published yet — coming soon"}
      </span>
      <button
        onClick={() => (hasContract ? copy(CONFIG.contractAddress, "Contract address copied") : toast("Contract address will be announced on official channels", "info"))}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-hood/15 px-3 text-xs font-bold text-hood transition hover:bg-hood/25"
        aria-label="Copy contract address"
      >
        {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** Outbound buy link: config override, else Uniswap on Robinhood Chain. */
export function useLinks() {
  return { buyUrl: CONFIG.buyUrl || uniswapUrl };
}

/** A link button that degrades gracefully (toast + scroll) when the target isn't configured. */
export function SmartLink({ href, children, className, fallbackMsg, fallbackHash = "#token" }: { href: string; children: ReactNode; className: string; fallbackMsg: string; fallbackHash?: string }) {
  const toast = useToast();
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={fallbackHash}
      className={className}
      onClick={() => toast(fallbackMsg, "info")}
    >
      {children}
    </a>
  );
}

export function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <Reveal className={`mb-10 sm:mb-14 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <span className="eyebrow">
        <span className="h-px w-6 bg-hood" />
        {eyebrow}
      </span>
      <h2 className="h-section mt-4">{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-mute sm:text-lg">{sub}</p>}
    </Reveal>
  );
}
