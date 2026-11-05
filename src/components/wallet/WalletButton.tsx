"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useReadContract, useSwitchChain } from "wagmi";
import { erc20Abi, formatUnits, type Address } from "viem";
import { LogOut, Copy, ExternalLink, ChevronDown, Wallet, Loader2 } from "lucide-react";
import { CONFIG, hasContract } from "@/config/site";
import { chainMeta, evmChains, robinhoodChain } from "@/lib/chains";
import { shortAddr, fmtToken } from "@/lib/format";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/components/ui/Toast";

export default function WalletButton({ compact = false }: { compact?: boolean }) {
  const { session, ready, open, logout, status } = useAuth();
  const { chain, address } = useAccount();
  const { switchChain } = useSwitchChain();
  const toast = useToast();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isEvm = session?.kind === "evm";
  const { data: bal } = useReadContract({
    address: CONFIG.contractAddress as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: robinhoodChain.id,
    query: { enabled: hasContract && isEvm && !!address },
  });
  const { data: dec } = useReadContract({
    address: CONFIG.contractAddress as Address,
    abi: erc20Abi,
    functionName: "decimals",
    chainId: robinhoodChain.id,
    query: { enabled: hasContract && isEvm },
  });

  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!session) {
    return (
      <button onClick={open} disabled={!ready} className="btn-ghost h-10 px-4 text-xs" aria-label="Connect wallet">
        {status !== "idle" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
        {!compact && <span>Connect</span>}
      </button>
    );
  }

  const label = isEvm ? chainMeta[chain?.id ?? 0]?.short ?? session.chain : "Solana";
  const color = isEvm ? chainMeta[chain?.id ?? 0]?.color ?? "#8B9B90" : "#9945FF";
  const explorer =
    session.kind === "solana"
      ? `https://solscan.io/account/${session.address}`
      : `${(evmChains.find((c) => c.id === chain?.id) ?? robinhoodChain).blockExplorers?.default.url}/address/${session.address}`;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setMenu((m) => !m)} className="btn-ghost h-10 gap-2 px-3 text-xs" aria-expanded={menu}>
        <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <span className="font-mono">{shortAddr(session.address)}</span>
        <ChevronDown className="h-3.5 w-3.5 text-mute" />
      </button>
      {menu && (
        <div className="modal-in absolute right-0 top-12 z-50 w-64 rounded-2xl border border-line bg-panel p-2 shadow-2xl">
          <div className="px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-mute">Signed in · {label}</p>
            <p className="mt-1 break-all font-mono text-xs">{session.address}</p>
            {isEvm && hasContract && bal !== undefined && dec !== undefined && (
              <p className="mt-2 text-sm">
                <span className="text-mute">$HOOD </span>
                <span className="font-semibold text-hood">{fmtToken(Number(formatUnits(bal, dec)))}</span>
              </p>
            )}
          </div>
          {isEvm && (
            <div className="my-1 grid grid-cols-3 gap-1 border-y border-line py-2">
              {evmChains.map((c) => (
                <button
                  key={c.id}
                  onClick={() => switchChain({ chainId: c.id }, { onError: (e) => toast(e.message.split("\n")[0], "error") })}
                  className={`rounded-lg py-1.5 text-[11px] font-semibold ${chain?.id === c.id ? "bg-hood/15 text-hood" : "text-mute hover:text-ink"}`}
                >
                  {chainMeta[c.id].short}
                </button>
              ))}
            </div>
          )}
          <MenuItem icon={Copy} onClick={() => navigator.clipboard.writeText(session.address).then(() => toast("Address copied", "success"))}>
            Copy address
          </MenuItem>
          <MenuItem icon={ExternalLink} href={explorer}>
            View on explorer
          </MenuItem>
          <MenuItem icon={LogOut} onClick={() => { setMenu(false); logout(); }}>
            Sign out
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: I, children, onClick, href }: { icon: typeof Copy; children: React.ReactNode; onClick?: () => void; href?: string }) {
  const cls = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/90 hover:bg-white/5";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      <I className="h-4 w-4 text-mute" /> {children}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      <I className="h-4 w-4 text-mute" /> {children}
    </button>
  );
}
