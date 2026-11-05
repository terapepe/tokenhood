"use client";

import { useQuery } from "@tanstack/react-query";
import { CONFIG } from "@/config/site";

export type Result<T> = { available: true; data: T; updatedAt: number } | { available: false; reason: string };

export type Market = {
  priceUsd: number | null; marketCap: number | null; fdv: number | null; liquidityUsd: number | null;
  volume24h: number | null; change24h: number | null; pairAddress: string; dexId: string; pairUrl: string;
  quoteSymbol: string; pairCount: number;
};
export type Holders = { holders: number | null; totalSupplyRaw: string | null; decimals: number | null };
export type Onchain = {
  name: string | null; symbol: string | null; decimals: number; totalSupply: string;
  owner: { status: "renounced" | "owned" | "no-owner-fn"; address: string | null }; blockNumber: string;
};
export type Overview = { market: Result<Market>; holders: Result<Holders>; onchain: Result<Onchain> };
export type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number };
export type Transfer = { hash: string; time: string; from: string; to: string; amount: number | null; method: string | null };

const get = async <T,>(p: string): Promise<T> => {
  const r = await fetch(p);
  if (!r.ok && r.status !== 400) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

export const useOverview = () =>
  useQuery({ queryKey: ["overview"], queryFn: () => get<Overview>("/api/token/overview"), refetchInterval: CONFIG.data.refreshMs });

export const useCandles = (tf: string) =>
  useQuery({
    queryKey: ["chart", tf],
    queryFn: () => get<Result<{ pool: string; candles: Candle[] }>>(`/api/token/chart?tf=${tf}`),
    refetchInterval: 60_000,
  });

export const useTransfers = () =>
  useQuery({ queryKey: ["transfers"], queryFn: () => get<Result<Transfer[]>>("/api/token/transfers"), refetchInterval: CONFIG.data.refreshMs });

export const val = <T,>(r: Result<T> | undefined): T | null => (r && r.available ? r.data : null);
