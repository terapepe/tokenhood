import { NextResponse, type NextRequest } from "next/server";
import { isAddress } from "viem";
import { CHALLENGE_COOKIE, buildMessage, cookieOpts, sign, type WalletKind } from "@/lib/auth/session";

const SOL_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function POST(req: NextRequest) {
  try {
    const { address, kind, chain } = (await req.json()) as { address: string; kind: WalletKind; chain: string };
    const valid = kind === "evm" ? isAddress(address) : kind === "solana" && SOL_RE.test(address);
    if (!valid || typeof chain !== "string" || chain.length > 40) {
      return NextResponse.json({ error: "Invalid address or network" }, { status: 400 });
    }
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const message = buildMessage({
      host: req.nextUrl.host,
      uri: req.nextUrl.origin,
      address,
      kind,
      chain,
      nonce,
      issuedAt: new Date().toISOString(),
    });
    const token = await sign({ message, address, kind, chain }, "5m");
    const res = NextResponse.json({ message });
    res.cookies.set(CHALLENGE_COOKIE, token, cookieOpts(300));
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
