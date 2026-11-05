import type { NextRequest } from "next/server";
import { hasContract } from "@/config/site";
import { json, safe } from "@/lib/api/cache";
import { getMarket } from "@/lib/api/market";
import { getHolders, getTransfers } from "@/lib/api/explorer";
import { getOnchain } from "@/lib/api/onchain";
import { getCandles, TIMEFRAMES, type Timeframe } from "@/lib/api/chart";

const NO_CA = { available: false, reason: "Contract address not configured" } as const;

export async function GET(req: NextRequest, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  if (!hasContract) return json(kind === "overview" ? { market: NO_CA, holders: NO_CA, onchain: NO_CA } : NO_CA, 60);

  switch (kind) {
    case "market":
      return json(await safe(getMarket, "Token not listed on DexScreener yet"));
    case "holders":
      return json(await safe(getHolders), 60);
    case "onchain":
      return json(await safe(getOnchain), 60);
    case "transfers":
      return json(await safe(getTransfers));
    case "overview": {
      const [market, holders, onchain] = await Promise.all([
        safe(getMarket, "Token not listed on DexScreener yet"),
        safe(getHolders),
        safe(getOnchain),
      ]);
      return json({ market, holders, onchain });
    }
    case "chart": {
      const tf = (req.nextUrl.searchParams.get("tf") || "1h") as Timeframe;
      if (!(tf in TIMEFRAMES)) return json({ available: false, reason: "Invalid timeframe" }, 60, 400);
      return json(await safe(() => getCandles(tf), "No candle data for this pool yet"), 30);
    }
    default:
      return json({ available: false, reason: "Unknown endpoint" }, 300, 404);
  }
}
