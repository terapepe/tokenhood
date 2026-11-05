"use client";

import { ArrowRight, LineChart } from "lucide-react";
import Mascot from "@/components/brand/Mascot";
import Skyline from "@/components/brand/Skyline";
import Particles from "@/components/brand/Particles";
import { ContractPill, SmartLink, useLinks } from "@/components/ui/primitives";
import { CONFIG } from "@/config/site";

export default function Hero() {
  const { buyUrl } = useLinks();
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[72px]">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-hood/10 blur-[120px]" />
        <Skyline className="absolute inset-x-0 bottom-0 h-[55%] w-full opacity-90" />
        <div className="smoke absolute bottom-10 -left-20 h-72 w-[60%] rounded-full bg-hood/10 blur-3xl" />
        <div className="smoke absolute right-0 bottom-0 h-80 w-[55%] rounded-full bg-neon/5 blur-3xl [animation-delay:-9s]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <Particles />
        {/* blockchain lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.15]" aria-hidden="true">
          <defs>
            <pattern id="nodes" width="160" height="160" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="#00D47B" />
              <circle cx="100" cy="90" r="2" fill="#B5FF5C" />
              <path d="M20 20 L100 90 L180 40" stroke="#00D47B" strokeWidth=".6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nodes)" />
        </svg>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div className="relative z-10 order-2 lg:order-1">
          <span className="eyebrow reveal in">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-hood" />
            The Meme of Robinhood Ecosystem
          </span>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,8.5vw,6.25rem)] leading-[0.92] font-black tracking-tight">
            THE HOOD
            <br />
            IS <span className="grad-text text-glow">GROWING.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute sm:text-xl">
            A new meme movement inspired by the expanding Robinhood ecosystem. Built on{" "}
            <span className="text-ink">{CONFIG.network.name}</span>.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <SmartLink href={buyUrl} className="btn-primary h-14 px-8 text-base" fallbackMsg="Trading opens once the $HOOD contract is published">
              BUY $HOOD <ArrowRight className="h-4 w-4" />
            </SmartLink>
            <a href="#chart" className="btn-ghost h-14 px-8 text-base">
              <LineChart className="h-4 w-4" /> VIEW CHART
            </a>
          </div>

          <ContractPill className="mt-6 max-w-xl" />
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[min(520px,85vw)] lg:order-2 lg:max-w-none">
          <div className="absolute inset-[12%] rounded-full bg-hood/20 blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-hood/15" />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-hood/20" />
          <Mascot id="hero" className="animate-float relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,.8)]" />
          <div className="absolute right-0 bottom-[14%] hidden rounded-2xl border border-line bg-panel/80 px-4 py-3 backdrop-blur sm:block">
            <p className="font-mono text-[10px] tracking-widest text-mute">NETWORK</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-bold">
              <span className="h-2 w-2 rounded-full bg-hood shadow-[0_0_10px_#00D47B]" /> {CONFIG.network.name}
            </p>
          </div>
          <div className="absolute top-[16%] left-0 hidden rounded-2xl border border-line bg-panel/80 px-4 py-3 backdrop-blur sm:block">
            <p className="font-mono text-[10px] tracking-widest text-mute">TICKER</p>
            <p className="mt-1 font-display text-lg font-black text-neon">${CONFIG.tokenSymbol}</p>
          </div>
        </div>
      </div>

      {/* marquee */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-line/60 bg-bg/70 py-3 backdrop-blur" aria-hidden="true">
        <div className="marquee flex w-max gap-10 font-display text-sm font-bold tracking-[0.3em] whitespace-nowrap text-mute">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {Array.from({ length: 6 }).map((__, i) => (
                <span key={i} className="flex items-center gap-10">
                  THE HOOD IS GROWING <span className="text-hood">✦</span> ${CONFIG.tokenSymbol} <span className="text-hood">✦</span> ONE MEME. ONE HOOD. <span className="text-hood">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
