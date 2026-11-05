"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage, type Connector } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import bs58 from "bs58";
import { evmChains } from "@/lib/chains";
import { useToast } from "@/components/ui/Toast";
import WalletModal from "./WalletModal";

export type Session = { address: string; kind: "evm" | "solana"; chain: string };
type Status = "idle" | "connecting" | "signing" | "verifying";

type Ctx = {
  session: Session | null;
  ready: boolean;
  status: Status;
  open: () => void;
  close: () => void;
  loginEvm: (connector: Connector, chainId: number) => Promise<void>;
  loginSolana: (name: WalletName) => void;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);
export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
};

async function post<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Request failed");
  return j as T;
}

const errMsg = (e: unknown) => {
  const m = e instanceof Error ? e.message : String(e);
  if (/reject|denied|cancel/i.test(m)) return "Request cancelled in wallet";
  return m.split("\n")[0].slice(0, 140);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [modal, setModal] = useState(false);

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { isConnected: evmConnected } = useAccount();
  const sol = useWallet();
  const solPending = useRef(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((j) => setSession(j.session))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const finish = useCallback(
    (s: Session) => {
      setSession(s);
      setStatus("idle");
      setModal(false);
      toast(`Signed in · ${s.chain}`, "success");
    },
    [toast],
  );

  const loginEvm = useCallback(
    async (connector: Connector, chainId: number) => {
      const chain = evmChains.find((c) => c.id === chainId)!;
      try {
        setStatus("connecting");
        const { accounts } = await connectAsync({ connector, chainId: chain.id });
        const address = accounts[0];
        setStatus("signing");
        const { message } = await post<{ message: string }>("/api/auth/nonce", { address, kind: "evm", chain: chain.name });
        const signature = await signMessageAsync({ account: address, message, connector });
        setStatus("verifying");
        const { session } = await post<{ session: Session }>("/api/auth/verify", { signature, chainId });
        finish(session);
      } catch (e) {
        setStatus("idle");
        toast(errMsg(e), "error");
      }
    },
    [connectAsync, signMessageAsync, finish, toast],
  );

  // Solana: select() is async in the adapter — connect & sign once the wallet is actually selected.
  const loginSolana = useCallback(
    (name: WalletName) => {
      solPending.current = true;
      setStatus("connecting");
      if (sol.wallet?.adapter.name === name && sol.connected) {
        sol.disconnect().finally(() => sol.select(name));
      } else sol.select(name);
    },
    [sol],
  );

  useEffect(() => {
    if (!solPending.current || !sol.wallet) return;
    (async () => {
      try {
        if (!sol.connected) {
          if (sol.connecting) return;
          await sol.connect();
          return; // effect re-runs once connected
        }
        if (!sol.publicKey || !sol.signMessage) throw new Error("This wallet does not support message signing");
        solPending.current = false;
        setStatus("signing");
        const address = sol.publicKey.toBase58();
        const { message } = await post<{ message: string }>("/api/auth/nonce", { address, kind: "solana", chain: "Solana" });
        const sig = await sol.signMessage(new TextEncoder().encode(message));
        setStatus("verifying");
        const { session } = await post<{ session: Session }>("/api/auth/verify", { signature: bs58.encode(sig) });
        finish(session);
      } catch (e) {
        solPending.current = false;
        setStatus("idle");
        toast(errMsg(e), "error");
      }
    })();
  }, [sol, sol.wallet, sol.connected, sol.connecting, sol.publicKey, finish, toast]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    if (evmConnected) await disconnectAsync().catch(() => {});
    if (sol.connected) await sol.disconnect().catch(() => {});
    setSession(null);
    toast("Signed out", "info");
  }, [evmConnected, disconnectAsync, sol, toast]);

  return (
    <AuthCtx.Provider
      value={{ session, ready, status, open: () => setModal(true), close: () => setModal(false), loginEvm, loginSolana, logout }}
    >
      {children}
      {modal && <WalletModal />}
    </AuthCtx.Provider>
  );
}
