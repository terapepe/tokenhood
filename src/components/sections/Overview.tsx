"use client";

import { Activity, Droplets, Gauge, Layers, TrendingUp, Users, BarChart3, RefreshCw } from "lucide-react";
import { useOverview, val } from "@/hooks/useTokenData";
import { AnimatedNumber, Reveal, SectionHead } from "@/components/ui/primitives";
import { fmtInt, fmtPct, fmtPrice, fmtUsd } from "@/lib/format";
import { hasContract } from "@/config/site";

export default function Overview() {
  const { data, isLoading, isFetching, dataUpdatedAt } = useOverview();
  const m = val(data?.market);
  const h = val(data?.holders);

  const metrics = [
    { label: "Current Price", icon: Activity, value: m?.priceUsd ?? null, fmt: fmtPrice, big: true },
    { label: "Market Cap", icon: Gauge, value: m?.marketCap ?? null, fmt: fmtUsd },
    { label: "Fully Diluted Valuation", icon: Layers, value: m?.fdv ?? null, fmt: fmtUsd },
    { label: "Liquidity", icon: Droplets, value: m?.liquidityUsd ?? null, fmt: fmtUsd },
    { label: "24H Volume", icon: BarChart3, value: m?.volume24h ?? null, fmt: fmtUsd },
    { label: "24H Change", icon: TrendingUp, value: m?.change24h ?? null, fmt: fmtPct, change: true, wide: true },
    { label: "Total Holders", icon: Users, value: h?.holders ?? null, fmt: fmtInt, wide: true },
  ];

  const reason = !hasContract
    ? "Contract address not published yet — live metrics activate automatically at launch."
    : data && !data.market.available
      ? `Market data: ${data.market.reason}`
      : null;

  return (
    <section id="dashboard" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Live token overview" title={<>Real numbers. <span className="text-hood">Onchain.</span></>} sub="Sourced live from DexScreener and Robinhood Chain Blockscout. Never fabricated." />
          <Reveal className="mb-10 flex items-center gap-3 self-start rounded-full border border-line bg-panel px-4 py-2 text-xs text-mute md:mb-14 md:self-auto">
            <span className={`h-2 w-2 rounded-full ${hasContract && m ? "live-dot bg-hood" : "bg-mute/50"}`} />
            {hasContract && m ? "LIVE" : "AWAITING DATA"}
            {dataUpdatedAt > 0 && <span className="font-mono">· {new Date(dataUpdatedAt).toLocaleTimeString()}</span>}
            {isFetching && <RefreshCw className="h-3 w-3 animate-spin text-hood" />}
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {metrics.map((x, i) => {
            const up = x.change && x.value != null ? x.value >= 0 : null;
            return (
              <Reveal key={x.label} delay={i * 60} className={`card card-hover group overflow-hidden p-5 sm:p-6 ${x.big ? "col-span-2 lg:row-span-2" : ""} ${"wide" in x && x.wide ? "lg:col-span-2" : ""}`}>
                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-hood/0 blur-2xl transition duration-500 group-hover:bg-hood/15" />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-wider text-mute uppercase">{x.label}</p>
                  <x.icon className="h-4 w-4 text-hood" />
                </div>
                {isLoading ? (
                  <div className={`shimmer mt-4 rounded-lg ${x.big ? "h-14 w-3/4" : "h-8 w-2/3"}`} />
                ) : (
                  <p
                    className={`mt-4 font-mono font-bold tracking-tight ${x.big ? "text-4xl sm:text-6xl" : "text-xl sm:text-2xl"} ${
                      x.value == null ? "text-mute/60" : up === true ? "text-hood" : up === false ? "text-red-400" : "text-ink"
                    }`}
                  >
                    <AnimatedNumber value={x.value} format={x.fmt} />
                  </p>
                )}
                {x.big && (
                  <div className="mt-6 space-y-2 text-sm text-mute">
                    {m ? (
                      <>
                        <p>
                          24H{" "}
                          <span className={m.change24h != null && m.change24h < 0 ? "text-red-400" : "text-hood"}>{fmtPct(m.change24h)}</span>
                          {" · "}Main pair on <span className="text-ink capitalize">{m.dexId}</span> ({m.pairCount} pair{m.pairCount > 1 ? "s" : ""})
                        </p>
                      </>
                    ) : (
                      <p>N/A = data not available yet (not the same as zero).</p>
                    )}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

        {reason && <p className="mt-6 rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-mute">{reason}</p>}
      </div>
    </section>
  );
}
