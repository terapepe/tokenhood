"use client";

import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { wagmiConfig } from "@/lib/wagmi";
import { CONFIG } from "@/config/site";
import { AuthProvider } from "@/components/wallet/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(
    () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } }),
  );
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={qc}>
        {/* wallets=[]: Phantom, Solflare, Backpack… are auto-detected via the Wallet Standard */}
        <ConnectionProvider endpoint={CONFIG.wallet.solanaRpc}>
          <WalletProvider wallets={[]} autoConnect={false}>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
