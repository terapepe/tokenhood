import "server-only";
import { createPublicClient, http, erc20Abi, formatUnits, zeroAddress, type Address } from "viem";
import { CONFIG, hasContract } from "@/config/site";
import { robinhoodChain } from "@/lib/chains";
import { cached } from "./cache";

export const publicClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(CONFIG.network.rpcUrl, { timeout: 8000 }),
});

const ownerAbi = [
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
] as const;

export type Onchain = {
  name: string | null;
  symbol: string | null;
  decimals: number;
  totalSupply: string; // human units, as string to keep precision
  owner: { status: "renounced" | "owned" | "no-owner-fn"; address: string | null };
  blockNumber: string;
};

/** Reads token facts directly from the Robinhood Chain RPC (verifiable, not configured). */
export function getOnchain(): Promise<Onchain | null> {
  if (!hasContract) return Promise.resolve(null);
  const address = CONFIG.contractAddress as Address;
  return cached("onchain", 60_000, async () => {
    const base = { address, abi: erc20Abi } as const;
    const [name, symbol, decimals, supply, owner, block] = await Promise.all([
      publicClient.readContract({ ...base, functionName: "name" }).catch(() => null),
      publicClient.readContract({ ...base, functionName: "symbol" }).catch(() => null),
      publicClient.readContract({ ...base, functionName: "decimals" }),
      publicClient.readContract({ ...base, functionName: "totalSupply" }),
      publicClient.readContract({ address, abi: ownerAbi, functionName: "owner" }).catch(() => undefined),
      publicClient.getBlockNumber(),
    ]);
    return {
      name,
      symbol,
      decimals,
      totalSupply: formatUnits(supply, decimals),
      owner:
        owner === undefined
          ? { status: "no-owner-fn", address: null }
          : owner === zeroAddress
            ? { status: "renounced", address: zeroAddress }
            : { status: "owned", address: owner },
      blockNumber: block.toString(),
    };
  });
}
