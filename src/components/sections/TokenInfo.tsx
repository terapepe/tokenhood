"use client";

import { Copy, ExternalLink, ShoppingCart, PlusCircle, ShieldCheck, ShieldAlert, Info } from "lucide-react";
import { CONFIG, explorerTokenUrl, hasContract } from "@/config/site";
import { useOverview, val } from "@/hooks/useTokenData";
import { Reveal, SectionHead, SmartLink, useCopy, useLinks } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/Toast";
import { fmtToken, fmtUsd, shortAddr } from "@/lib/format";

type EthProvider = { request: (a: { method: string; params?: unknown[] }) => Promise<unknown> };

export default function TokenInfo() {
  const { data, isLoading } = useOverview();
  const m = val(data?.market);
  const oc = val(data?.onchain);
  const toast = useToast();
  const { copy } = useCopy();
  const { buyUrl } = useLinks();

  const supply = oc ? fmtToken(Number(oc.totalSupply)) : "N/A";
  const owner = !oc
    ? { text: "N/A", tone: "mute" as const }
    : oc.owner.status === "renounced"
      ? { text: "Renounced (owner = 0x0, verified onchain)", tone: "good" as const }
      : oc.owner.status === "owned"
        ? { text: `Owned by ${shortAddr(oc.owner.address!)}`, tone: "warn" as const }
        : { text: "No owner() function detected", tone: "mute" as const };

  const rows: [string, React.ReactNode, string?][] = [
    ["Token Name", oc?.name ?? CONFIG.tokenName],
    ["Symbol", oc?.symbol ?? CONFIG.tokenSymbol],
    ["Network", CONFIG.network.name, `Chain ID ${CONFIG.network.chainId}`],
    ["Token Standard", CONFIG.tokenStandard],
    ["Total Supply", isLoading ? "…" : supply, oc ? "Read from contract" : undefined],
    ["Contract Address", hasContract ? <span className="font-mono text-xs break-all sm:text-sm">{CONFIG.contractAddress}</span> : "Not published yet"],
    ["Liquidity", isLoading ? "…" : fmtUsd(m?.liquidityUsd), m ? "DexScreener, all pairs" : undefined],
    ["Tax", CONFIG.taxInfo || "N/A", CONFIG.taxInfo ? undefined : "Not verified — not claimed"],
    [
      "Ownership",
      <span key="o" className={`inline-flex items-center gap-1.5 ${owner.tone === "good" ? "text-hood" : owner.tone === "warn" ? "text-amber-300" : ""}`}>
        {owner.tone === "good" ? <ShieldCheck className="h-4 w-4" /> : owner.tone === "warn" ? <ShieldAlert className="h-4 w-4" /> : null}
        {owner.text}
      </span>,
    ],
  ];

  const addNetwork = async () => {
    const eth = (window as unknown as { ethereum?: EthProvider }).ethereum;
    if (!eth) return toast("No EVM wallet found in this browser", "error");
    const n = CONFIG.network;
    try {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: n.chainIdHex, chainName: n.name, nativeCurrency: n.nativeCurrency, rpcUrls: [n.rpcUrl], blockExplorerUrls: [n.explorerUrl] }],
      });
      toast(`${n.name} added to wallet`, "success");
    } catch (e) {
      toast(e instanceof Error ? e.message.split("\n")[0] : "Request rejected", "error");
    }
  };

  return (
    <section id="token" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Token information" title={<>The <span className="text-hood">$HOOD</span> facts.</>} sub="Supply and ownership are read directly from the contract. Nothing here is claimed without verification." />

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="card overflow-hidden">
            <dl>
              {rows.map(([k, v, note], i) => (
                <div key={k} className={`grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-6 sm:px-7 ${i ? "border-t border-line/70" : ""}`}>
                  <dt className="text-xs font-semibold tracking-wider text-mute uppercase sm:pt-0.5">{k}</dt>
                  <dd className="text-sm font-semibold sm:text-base">
                    {v}
                    {note && <span className="ml-2 text-xs font-normal text-mute">{note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={100} className="card flex flex-col gap-3 p-5 sm:p-7">
            <p className="font-display text-lg font-bold">Quick actions</p>
            <button
              onClick={() => (hasContract ? copy(CONFIG.contractAddress, "Contract address copied") : toast("Contract address not published yet", "info"))}
              className="btn-ghost h-14 justify-between px-5"
            >
              COPY CONTRACT <Copy className="h-4 w-4 text-hood" />
            </button>
            <a href={explorerTokenUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost h-14 justify-between px-5">
              VIEW EXPLORER <ExternalLink className="h-4 w-4 text-hood" />
            </a>
            <SmartLink href={buyUrl} className="btn-ghost h-14 justify-between px-5" fallbackMsg="Trading opens once the $HOOD contract is published">
              BUY TOKEN <ShoppingCart className="h-4 w-4 text-hood" />
            </SmartLink>
            <button onClick={addNetwork} className="btn-primary h-14 justify-between px-5">
              ADD NETWORK TO WALLET <PlusCircle className="h-4 w-4" />
            </button>
            <p className="mt-auto flex gap-2 pt-3 text-xs leading-relaxed text-mute">
              <Info className="h-4 w-4 shrink-0 text-hood" /> Always verify the contract address on official channels before interacting with any token.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
