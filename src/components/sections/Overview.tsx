"use client";

import { Users, Layers, RefreshCw } from "lucide-react";
import { useOverview, useTransfers, val } from "@/hooks/useTokenData";
import { AnimatedNumber, Reveal, SectionHead } from "@/components/ui/primitives";
import { fmtInt, fmtToken, shortAddr, timeAgo } from "@/lib/format";
import { CONFIG, hasContract } from "@/config/site";

export default function Overview() {
  const { data, isLoading, isFetching, dataUpdatedAt } = useOverview();
  const h = val(data?.holders);
  const oc = val(data?.onchain);
  const live = hasContract && !!(h || oc);

  const metrics = [
    { label: "Total Holders", icon: Users, value: h?.holders ?? null, fmt: fmtInt },
    { label: "Total Supply", icon: Layers, value: oc ? Number(oc.totalSupply) : null, fmt: fmtToken },
  ];

  return (
    <section id="dashboard" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Live onchain overview" title={<>Real numbers. <span className="text-hood">Onchain.</span></>} sub="Read live from Robinhood Chain — Blockscout explorer and the token contract. Never fabricated." />
          <Reveal className="mb-10 flex items-center gap-3 self-start rounded-full border border-line bg-panel px-4 py-2 text-xs text-mute md:mb-14 md:self-auto">
            <span className={`h-2 w-2 rounded-full ${live ? "live-dot bg-hood" : "bg-mute/50"}`} />
            {live ? "LIVE" : "AWAITING DATA"}
            {dataUpdatedAt > 0 && <span className="font-mono">· {new Date(dataUpdatedAt).toLocaleTimeString()}</span>}
            {isFetching && <RefreshCw className="h-3 w-3 animate-spin text-hood" />}
          </Reveal>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {metrics.map((x, i) => (
            <Reveal key={x.label} delay={i * 60} className="card card-hover group overflow-hidden p-6 sm:p-8">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-hood/0 blur-2xl transition duration-500 group-hover:bg-hood/15" />
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wider text-mute uppercase">{x.label}</p>
                <x.icon className="h-4 w-4 text-hood" />
              </div>
              {isLoading ? (
                <div className="shimmer mt-4 h-12 w-2/3 rounded-lg" />
              ) : (
                <p className={`mt-4 font-mono text-4xl font-bold tracking-tight sm:text-5xl ${x.value == null ? "text-mute/60" : "text-ink"}`}>
                  <AnimatedNumber value={x.value} format={x.fmt} />
                </p>
              )}
            </Reveal>
          ))}
        </div>

        {!hasContract && (
          <p className="mt-6 rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-mute">
            Contract address not published yet — live stats activate automatically at launch. N/A = not available (not zero).
          </p>
        )}

        <Transfers />
      </div>
    </section>
  );
}

function Transfers() {
  const { data } = useTransfers();
  const list = val(data);
  if (!hasContract || !list?.length) return null;
  return (
    <Reveal className="card mt-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <p className="text-sm font-bold">Latest transfers</p>
        <span className="flex items-center gap-2 text-xs text-mute"><span className="live-dot h-1.5 w-1.5 rounded-full bg-hood" /> Blockscout</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-xs text-mute">
            <tr><th className="px-5 py-3 font-medium">Time</th><th className="px-5 py-3 font-medium">From</th><th className="px-5 py-3 font-medium">To</th><th className="px-5 py-3 text-right font-medium">Amount</th></tr>
          </thead>
          <tbody className="font-mono text-xs">
            {list.map((t) => (
              <tr key={t.hash + t.from + t.to} className="border-t border-line/60 hover:bg-white/[0.02]">
                <td className="px-5 py-3"><a href={`${CONFIG.network.explorerUrl}/tx/${t.hash}`} target="_blank" rel="noopener noreferrer" className="text-hood hover:underline">{timeAgo(t.time)}</a></td>
                <td className="px-5 py-3 text-mute">{shortAddr(t.from)}</td>
                <td className="px-5 py-3 text-mute">{shortAddr(t.to)}</td>
                <td className="px-5 py-3 text-right">{fmtToken(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
