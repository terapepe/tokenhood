import { createConfig, http } from "wagmi";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { CONFIG } from "@/config/site";
import { evmChains, robinhoodChain } from "@/lib/chains";
import { base, bsc } from "viem/chains";

const wcId = CONFIG.wallet.walletConnectProjectId;

export const wagmiConfig = createConfig({
  chains: evmChains,
  ssr: true,
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: CONFIG.tokenName, appLogoUrl: `${CONFIG.website}/icon.svg` }),
    ...(wcId
      ? [
          walletConnect({
            projectId: wcId,
            showQrModal: true,
            metadata: {
              name: CONFIG.tokenName,
              description: "The Meme of Robinhood Ecosystem",
              url: CONFIG.website,
              icons: [`${CONFIG.website}/icon.svg`],
            },
          }),
        ]
      : []),
  ],
  transports: {
    [robinhoodChain.id]: http(CONFIG.network.rpcUrl),
    [base.id]: http(),
    [bsc.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
