import { hasContract } from "@/config/site";
import { json, safe } from "@/lib/api/cache";
import { getHolders, getTransfers } from "@/lib/api/explorer";
import { getOnchain } from "@/lib/api/onchain";

const NO_CA = { available: false, reason: "Contract address not configured" } as const;

export async function GET(_req: Request, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  if (!hasContract) return json(kind === "overview" ? { holders: NO_CA, onchain: NO_CA } : NO_CA, 60);

  switch (kind) {
    case "holders":
      return json(await safe(getHolders), 60);
    case "onchain":
      return json(await safe(getOnchain), 60);
    case "transfers":
      return json(await safe(getTransfers));
    case "overview": {
      const [holders, onchain] = await Promise.all([
        safe(getHolders),
        safe(getOnchain),
      ]);
      return json({ holders, onchain });
    }
    default:
      return json({ available: false, reason: "Unknown endpoint" }, 300, 404);
  }
}
