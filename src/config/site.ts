/**
 * TokenHood — central configuration.
 * Edit this file (or set the matching NEXT_PUBLIC_* env vars on Vercel) to change
 * any token, network, or social setting. Nothing else in the codebase hardcodes these.
 */

const env = (v: string | undefined, fallback = "") => (v && v.trim()) || fallback;

export const CONFIG = {
  tokenName: "TokenHood",
  tokenSymbol: "HOOD",
  tokenStandard: "ERC-20",

  /** Token contract on Robinhood Chain. Leave empty until launch → UI shows N/A. */
  contractAddress: env(process.env.NEXT_PUBLIC_TOKEN_ADDRESS),

  website: "https://tokenhood.online",
  siteHost: "tokenhood.online",

  /** Optional override. Default: Uniswap swap on Robinhood Chain for the contract. */
  buyUrl: env(process.env.NEXT_PUBLIC_BUY_URL),

  /** Networks shown in Token Information. */
  networksLabel: "Robinhood Chain, Base, BSC",

  social: {
    twitterUrl: env(process.env.NEXT_PUBLIC_TWITTER_URL),
    telegramUrl: env(process.env.NEXT_PUBLIC_TELEGRAM_URL),
    memeGalleryUrl: env(process.env.NEXT_PUBLIC_MEME_GALLERY_URL),
    updatesUrl: env(process.env.NEXT_PUBLIC_UPDATES_URL),
  },

  /** Robinhood Chain network params (used for wallet + RPC + explorer). */
  network: {
    name: "Robinhood Chain",
    chainId: 4663,
    chainIdHex: "0x1237",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: env(process.env.NEXT_PUBLIC_ROBINHOOD_RPC, "https://rpc.mainnet.chain.robinhood.com"),
    explorerUrl: "https://robinhoodchain.blockscout.com",
  },

  /** Data providers. Slugs are configurable in case a provider renames the network. */
  data: {
    blockscoutApi: "https://robinhoodchain.blockscout.com/api/v2",
    refreshMs: 30_000,
  },

  /** Wallet login. */
  wallet: {
    walletConnectProjectId: env(process.env.NEXT_PUBLIC_WC_PROJECT_ID),
    solanaRpc: env(process.env.NEXT_PUBLIC_SOLANA_RPC, "https://api.mainnet-beta.solana.com"),
  },
} as const;

export const hasContract = /^0x[a-fA-F0-9]{40}$/.test(CONFIG.contractAddress);

/** Uniswap web app swap (chain slug "robinhood" per Uniswap interface chainMetadata). */
export const uniswapUrl = hasContract
  ? `https://app.uniswap.org/swap?chain=robinhood&inputCurrency=NATIVE&outputCurrency=${CONFIG.contractAddress}`
  : "";

export const explorerTokenUrl = hasContract
  ? `${CONFIG.network.explorerUrl}/token/${CONFIG.contractAddress}`
  : CONFIG.network.explorerUrl;
