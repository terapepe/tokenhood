"use client";

import { useEffect, useMemo, useState } from "react";
import { useConnectors } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { X, Loader2, Wallet, ExternalLink, ShieldCheck } from "lucide-react";
import { evmChains, chainMeta } from "@/lib/chains";
import { useAuth } from "./AuthProvider";

type Tab = number | "solana";

const STATUS_TEXT = {
  idle: "",
  connecting: "Waiting for wallet connection…",
  signing: "Sign the message in your wallet…",
  verifying: "Verifying signature…",
};

export default function WalletModal() {
  const { close, loginEvm, loginSolana, status } = useAuth();
  const [tab, setTab] = useState<Tab>(evmChains[0].id);
  const connectors = useConnectors();
  const { wallets } = useWallet();
  const busy = status !== "idle";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  // EIP-6963 discovered wallets first; hide the generic injected entry when specific ones exist.
  const evmList = useMemo(() => {
    const discovered = connectors.filter((c) => c.type === "injected" && c.id !== "injected");
    return connectors.filter((c) => !(c.id === "injected" && discovered.length > 0));
  }, [connectors]);

  const solList = useMemo(
    () =>
      wallets
        .filter((w) => w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable)
        .map((w) => w.adapter),
    [wallets],
  );

  const tabs: { id: Tab; label: string; color: string }[] = [
    ...evmChains.map((c) => ({ id: c.id as Tab, label: chainMeta[c.id].short, color: chainMeta[c.id].color })),
    { id: "solana", label: "Solana", color: "#9945FF" },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={close} role="dialog" aria-modal="true" aria-label="Connect wallet">
      <div className="modal-in w-full max-w-md rounded-t-3xl border border-line bg-panel p-5 shadow-[0_0_80px_-20px_rgba(0,212,123,.35)] sm:rounded-3xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Enter the Hood</h2>
            <p className="text-xs text-mute">Connect &amp; sign to log in. No transaction, no gas.</p>
          </div>
          <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full border border-line text-mute transition hover:text-ink" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-4 gap-1 rounded-xl border border-line bg-bg p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              disabled={busy}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${tab === t.id ? "bg-panel text-ink shadow" : "text-mute hover:text-ink"}`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {tab === "solana" ? (
            solList.length ? (
              solList.map((w) => (
                <WalletRow key={w.name} name={w.name} icon={w.icon} disabled={busy} onClick={() => loginSolana(w.name)} />
              ))
            ) : (
              <Empty
                text="No Solana wallet detected in this browser."
                links={[
                  ["Phantom", "https://phantom.com/download"],
                  ["Solflare", "https://solflare.com/download"],
                ]}
              />
            )
          ) : evmList.length ? (
            evmList.map((c) => (
              <WalletRow
                key={c.uid}
                name={c.id === "injected" ? "Browser Wallet" : c.name}
                icon={c.icon}
                disabled={busy}
                onClick={() => loginEvm(c, tab as number)}
              />
            ))
          ) : (
            <Empty text="No EVM wallet detected." links={[["MetaMask", "https://metamask.io/download"]]} />
          )}
        </div>

        <div className="mt-4 flex min-h-5 items-center gap-2 text-xs text-mute">
          {busy ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-hood" /> {STATUS_TEXT[status]}
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-hood" /> We never ask for seed phrases or private keys.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WalletRow({ name, icon, onClick, disabled }: { name: string; icon?: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-3 rounded-xl border border-line bg-bg/60 px-4 py-3 text-left text-sm font-semibold transition hover:border-hood/60 hover:bg-hood/5 disabled:opacity-50"
    >
      {icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" className="h-7 w-7 rounded-lg" />
      ) : (
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-hood/10">
          <Wallet className="h-4 w-4 text-hood" />
        </span>
      )}
      <span className="flex-1">{name}</span>
      <span className="text-xs text-mute transition group-hover:text-hood">Connect →</span>
    </button>
  );
}

function Empty({ text, links }: { text: string; links: [string, string][] }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-4 text-sm text-mute">
      <p className="mb-3">{text}</p>
      <div className="flex flex-wrap gap-2">
        {links.map(([n, u]) => (
          <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs text-ink hover:border-hood">
            Get {n} <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
