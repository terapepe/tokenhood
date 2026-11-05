"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, HistogramSeries, ColorType, type IChartApi, type ISeriesApi, type UTCTimestamp } from "lightweight-charts";
import { ExternalLink, Loader2, ArrowUpRight, ArrowDownRight, LineChart } from "lucide-react";
import { useCandles, useOverview, useTransfers, val, type Candle } from "@/hooks/useTokenData";
import { Reveal, SectionHead, SmartLink, useLinks } from "@/components/ui/primitives";
import { fmtPct, fmtPrice, fmtToken, shortAddr, timeAgo } from "@/lib/format";
import { CONFIG, hasContract } from "@/config/site";

const TFS = [
  ["5m", "5M"],
  ["15m", "15M"],
  ["1h", "1H"],
  ["4h", "4H"],
  ["1d", "1D"],
] as const;

function precisionFor(p: number) {
  if (!p || p >= 1) return 4;
  return Math.min(14, Math.ceil(-Math.log10(p)) + 3);
}

function Candles({ candles }: { candles: Candle[] }) {
  const el = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const cs = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const vs = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    const c = createChart(el.current!, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8B9B90", fontFamily: "JetBrains Mono Variable, monospace", attributionLogo: true },
      grid: { vertLines: { color: "rgba(38,53,44,.35)" }, horzLines: { color: "rgba(38,53,44,.35)" } },
      rightPriceScale: { borderColor: "#26352C" },
      timeScale: { borderColor: "#26352C", timeVisible: true, secondsVisible: false },
      crosshair: { vertLine: { color: "#00D47B55" }, horzLine: { color: "#00D47B55" } },
    });
    cs.current = c.addSeries(CandlestickSeries, {
      upColor: "#00D47B", downColor: "#f0506e", borderVisible: false, wickUpColor: "#00D47B", wickDownColor: "#f0506e",
    });
    vs.current = c.addSeries(HistogramSeries, { priceScaleId: "", priceFormat: { type: "volume" } });
    vs.current.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    chart.current = c;
    return () => c.remove();
  }, []);

  useEffect(() => {
    if (!cs.current || !vs.current || !candles.length) return;
    const prec = precisionFor(candles[candles.length - 1].close);
    cs.current.applyOptions({ priceFormat: { type: "price", precision: prec, minMove: 1 / 10 ** prec } });
    cs.current.setData(candles.map((k) => ({ time: k.time as UTCTimestamp, open: k.open, high: k.high, low: k.low, close: k.close })));
    vs.current.setData(
      candles.map((k) => ({ time: k.time as UTCTimestamp, value: k.volume, color: k.close >= k.open ? "rgba(0,212,123,.35)" : "rgba(240,80,110,.35)" })),
    );
    chart.current?.timeScale().fitContent();
  }, [candles]);

  return <div ref={el} className="h-full w-full" />;
}

export default function ChartSection() {
  const [tf, setTf] = useState<string>("1h");
  const { data: ov } = useOverview();
  const m = val(ov?.market);
  const { data, isLoading } = useCandles(tf);
  const candles = val(data)?.candles;
  const { dexUrl } = useLinks();
  const up = (m?.change24h ?? 0) >= 0;

  return (
    <section id="chart" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Token price chart" title={<>Watch the <span className="text-hood">Hood</span> move.</>} />

        <Reveal className="card overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-mute uppercase">${CONFIG.tokenSymbol} / USD</p>
                <p className="mt-1 font-mono text-3xl font-bold">{fmtPrice(m?.priceUsd)}</p>
              </div>
              {m?.change24h != null && (
                <span className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-xs font-bold ${up ? "bg-hood/15 text-hood" : "bg-red-500/15 text-red-400"}`}>
                  {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {fmtPct(m.change24h)} 24H
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl border border-line bg-bg p-1" role="tablist" aria-label="Timeframe">
                {TFS.map(([k, l]) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={tf === k}
                    onClick={() => setTf(k)}
                    className={`min-w-11 rounded-lg px-3 py-2 font-mono text-xs font-bold transition ${tf === k ? "bg-hood text-bg" : "text-mute hover:text-ink"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <SmartLink href={dexUrl} className="btn-ghost h-11 px-4 text-xs" fallbackMsg="DexScreener link activates once the contract is published" fallbackHash="#chart">
                OPEN ON DEXSCREENER <ExternalLink className="h-3.5 w-3.5" />
              </SmartLink>
            </div>
          </div>

          <div className="relative h-[380px] sm:h-[480px]">
            {!hasContract ? (
              <Placeholder text="The chart goes live automatically once the $HOOD contract is published on Robinhood Chain." />
            ) : isLoading ? (
              <div className="grid h-full place-items-center"><Loader2 className="h-6 w-6 animate-spin text-hood" /></div>
            ) : candles?.length ? (
              <Candles candles={candles} />
            ) : m?.pairAddress ? (
              // Candle API has no data for this pool yet → embed DexScreener's own chart for the real pair.
              <iframe
                title="DexScreener chart"
                className="h-full w-full"
                loading="lazy"
                src={`https://dexscreener.com/${CONFIG.data.dexScreenerChain}/${m.pairAddress}?embed=1&loadChartSettings=0&trades=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=1&chartType=usd&interval=${({ "5m": "5", "15m": "15", "1h": "60", "4h": "240", "1d": "1D" } as Record<string, string>)[tf]}`}
              />
            ) : (
              <Placeholder text={data && !data.available ? data.reason : "No trading pair found for this contract yet."} />
            )}
          </div>
        </Reveal>

        <Transfers />
      </div>
    </section>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="grid-bg grid h-full place-items-center p-6 text-center">
      <div>
        <LineChart className="mx-auto h-10 w-10 text-hood/60" />
        <p className="mx-auto mt-4 max-w-sm text-sm text-mute">{text}</p>
      </div>
    </div>
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
