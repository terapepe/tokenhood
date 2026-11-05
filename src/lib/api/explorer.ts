import "server-only";
import { CONFIG, hasContract } from "@/config/site";
import { cached, getJson } from "./cache";

type BsToken = {
  holders_count?: string | null;
  holders?: string | null;
  total_supply?: string | null;
  decimals?: string | null;
  name?: string | null;
  symbol?: string | null;
};

export type Holders = { holders: number | null; totalSupplyRaw: string | null; decimals: number | null };

/** Holder count + supply from Robinhood Chain Blockscout. */
export function getHolders(): Promise<Holders | null> {
  if (!hasContract) return Promise.resolve(null);
  return cached("holders", 60_000, async () => {
    const t = await getJson<BsToken>(`${CONFIG.data.blockscoutApi}/tokens/${CONFIG.contractAddress}`);
    const h = t.holders_count ?? t.holders;
    return {
      holders: h != null && h !== "" ? Number(h) : null,
      totalSupplyRaw: t.total_supply ?? null,
      decimals: t.decimals != null ? Number(t.decimals) : null,
    };
  });
}

type BsTransfer = {
  transaction_hash: string;
  timestamp: string;
  method?: string | null;
  from: { hash: string };
  to: { hash: string };
  total?: { value?: string; decimals?: string };
};

export type Transfer = { hash: string; time: string; from: string; to: string; amount: number | null; method: string | null };

/** Latest token transfers from Blockscout. */
export function getTransfers(): Promise<Transfer[] | null> {
  if (!hasContract) return Promise.resolve(null);
  return cached("transfers", 15_000, async () => {
    const r = await getJson<{ items: BsTransfer[] }>(
      `${CONFIG.data.blockscoutApi}/tokens/${CONFIG.contractAddress}/transfers`,
    );
    return (r.items || []).slice(0, 12).map((t) => {
      const dec = Number(t.total?.decimals ?? 18);
      const raw = t.total?.value;
      return {
        hash: t.transaction_hash,
        time: t.timestamp,
        from: t.from.hash,
        to: t.to.hash,
        amount: raw ? Number(BigInt(raw) / 10n ** BigInt(Math.max(dec - 4, 0))) / 1e4 : null,
        method: t.method ?? null,
      };
    });
  });
}
