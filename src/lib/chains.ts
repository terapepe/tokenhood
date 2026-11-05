import { defineChain } from "viem";
import { base, bsc } from "viem/chains";
import { CONFIG } from "@/config/site";

export const robinhoodChain = defineChain({
  id: CONFIG.network.chainId,
  name: CONFIG.network.name,
  nativeCurrency: CONFIG.network.nativeCurrency,
  rpcUrls: { default: { http: [CONFIG.network.rpcUrl] } },
  blockExplorers: { default: { name: "Blockscout", url: CONFIG.network.explorerUrl } },
  contracts: { multicall3: { address: "0xca11bde05977b3631167028862be2a173976ca11" } },
});

export const evmChains = [robinhoodChain, base, bsc] as const;

export const chainMeta: Record<number, { short: string; color: string }> = {
  [robinhoodChain.id]: { short: "Robinhood", color: "#00D47B" },
  [base.id]: { short: "Base", color: "#3B82F6" },
  [bsc.id]: { short: "BSC", color: "#F3BA2F" },
};
