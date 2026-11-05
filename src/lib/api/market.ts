import "server-only";
import { CONFIG, hasContract } from "@/config/site";
import { cached, getJson } from "./cache";

/** DexScreener pair (subset of fields we use). */
type DsPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; symbol: string };
  quoteToken: { address: string; symbol: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
};

export type Market = {
  priceUsd: number | null;
  marketCap: number | null;
  fdv: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  change24h: number | null;
  pairAddress: string;
  dexId: string;
  pairUrl: string;
  quoteSymbol: string;
  pairCount: number;
};

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v !== "" && Number.isFinite(+v) ? +v : null);

/** Market stats from DexScreener for the token's most liquid pair on Robinhood Chain. */
export function getMarket(): Promise<Market | null> {
  if (!hasContract) return Promise.resolve(null);
  const { dexScreenerApi, dexScreenerChain } = CONFIG.data;
  return cached("market", 15_000, async () => {
    const pairs = await getJson<DsPair[]>(
      `${dexScreenerApi}/tokens/v1/${dexScreenerChain}/${CONFIG.contractAddress}`,
    );
    if (!Array.isArray(pairs) || pairs.length === 0) return null;
    const main = [...pairs].sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
    const liquidityTotal = pairs.reduce((s, p) => s + (p.liquidity?.usd ?? 0), 0);
    const volumeTotal = pairs.reduce((s, p) => s + (p.volume?.h24 ?? 0), 0);
    return {
      priceUsd: num(main.priceUsd),
      marketCap: num(main.marketCap),
      fdv: num(main.fdv),
      liquidityUsd: pairs.some((p) => p.liquidity?.usd != null) ? liquidityTotal : null,
      volume24h: pairs.some((p) => p.volume?.h24 != null) ? volumeTotal : null,
      change24h: num(main.priceChange?.h24),
      pairAddress: main.pairAddress,
      dexId: main.dexId,
      pairUrl: main.url,
      quoteSymbol: main.quoteToken?.symbol ?? "",
      pairCount: pairs.length,
    };
  });
}
