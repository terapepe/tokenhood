# TokenHood ($HOOD)

Next.js 16 site for **tokenhood.online** — live Robinhood Chain onchain stats + wallet sign-in (Robinhood Chain, Base, BSC, Solana).

## Config
Everything lives in `src/config/site.ts`; most values can be set via env vars (no code change):

| Env | Purpose |
|---|---|
| `NEXT_PUBLIC_TOKEN_ADDRESS` | $HOOD contract on Robinhood Chain. Empty → all metrics show **N/A** |
| `AUTH_SECRET` | **Required.** ≥32 chars, signs login cookies |
| `NEXT_PUBLIC_WC_PROJECT_ID` | WalletConnect (reown.com) project ID — enables WalletConnect/QR |
| `NEXT_PUBLIC_TWITTER_URL`, `NEXT_PUBLIC_TELEGRAM_URL`, `NEXT_PUBLIC_MEME_GALLERY_URL`, `NEXT_PUBLIC_UPDATES_URL` | Social links |
| `NEXT_PUBLIC_BUY_URL` | Optional override. Default: Uniswap swap on Robinhood Chain (`app.uniswap.org/swap?chain=robinhood&outputCurrency={CA}`) |
| `NEXT_PUBLIC_SOLANA_RPC`, `NEXT_PUBLIC_ROBINHOOD_RPC` | RPC overrides |

`NEXT_PUBLIC_*` values are inlined at build time → **redeploy** after changing them.

## Data sources (real, no mock data)
- Holders + latest transfers: Robinhood Chain Blockscout `/api/v2/tokens/{CA}`
- Name, symbol, total supply: read directly from the contract via RPC

API: `/api/token/{overview|holders|onchain|transfers}` — CDN-cached (`s-maxage`) + in-memory TTL.

## Wallet login
Connect → sign a plain message (no tx, no gas, no approval) → server verifies (`viem` incl. ERC-1271/6492 for EVM, ed25519 for Solana) → HttpOnly JWT cookie (7 days).
EVM: injected wallets (EIP-6963: MetaMask, Rabby, OKX…), Coinbase Wallet, WalletConnect. Solana: any Wallet-Standard wallet (Phantom, Solflare, Backpack).

## Dev / deploy
```bash
npm i
cp .env.example .env.local   # set AUTH_SECRET
npm run dev
```
Vercel: push to `main` → auto deploy. Set env vars in Project → Settings → Environment Variables.

> Shared PHP hosting (no Node): the API routes and wallet login need a server runtime, so deploy on Vercel (free tier is enough).
