import "server-only";
import { CONFIG } from "@/config/site";
import { cached, getJson } from "./cache";
import { getMarket } from "./market";

export const TIMEFRAMES = {
  "5m": { tf: "minute", agg: 5 },
  "15m": { tf: "minute", agg: 15 },
  "1h": { tf: "hour", agg: 1 },
  "4h": { tf: "hour", agg: 4 },
  "1d": { tf: "day", agg: 1 },
} as const;
export type Timeframe = keyof typeof TIMEFRAMES;

export type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number };

/** OHLCV candles from GeckoTerminal for the token's main pool (discovered via DexScreener). */
export async function getCandles(tf: Timeframe): Promise<{ pool: string; candles: Candle[] } | null> {
  const market = await getMarket();
  if (!market) return null;
  const { tf: unit, agg } = TIMEFRAMES[tf];
  const pool = market.pairAddress;
  return cached(`ohlcv:${pool}:${tf}`, 30_000, async () => {
    const url =
      `${CONFIG.data.geckoApi}/networks/${CONFIG.data.geckoNetwork}/pools/${pool}/ohlcv/${unit}` +
      `?aggregate=${agg}&limit=300&currency=usd&token=base`;
    const r = await getJson<{ data?: { attributes?: { ohlcv_list?: number[][] } } }>(url, {
      headers: { accept: "application/json;version=20230203" },
    });
    const list = r.data?.attributes?.ohlcv_list ?? [];
    const candles = list
      .map(([t, o, h, l, c, v]) => ({ time: t, open: o, high: h, low: l, close: c, volume: v }))
      .sort((a, b) => a.time - b.time);
    return candles.length ? { pool, candles } : null;
  });
}
