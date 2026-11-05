import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient, http, type Address, type Hex } from "viem";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { evmChains } from "@/lib/chains";
import { CHALLENGE_COOKIE, SESSION_COOKIE, cookieOpts, sign, verify, type Session, type WalletKind } from "@/lib/auth/session";

type Challenge = { message: string; address: string; kind: WalletKind; chain: string };

export async function POST(req: NextRequest) {
  try {
    const challenge = await verify<Challenge>(req.cookies.get(CHALLENGE_COOKIE)?.value);
    if (!challenge) return NextResponse.json({ error: "Challenge expired — try again" }, { status: 401 });

    const { signature, chainId } = (await req.json()) as { signature: string; chainId?: number };
    let ok = false;

    if (challenge.kind === "evm") {
      // publicClient.verifyMessage also handles smart-contract wallets (ERC-1271 / ERC-6492).
      const chain = evmChains.find((c) => c.id === chainId) ?? evmChains[0];
      const client = createPublicClient({ chain, transport: http(undefined, { timeout: 8000 }) });
      ok = await client.verifyMessage({
        address: challenge.address as Address,
        message: challenge.message,
        signature: signature as Hex,
      });
    } else {
      ok = nacl.sign.detached.verify(
        new TextEncoder().encode(challenge.message),
        bs58.decode(signature),
        bs58.decode(challenge.address),
      );
    }

    if (!ok) return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });

    const session: Session = { address: challenge.address, kind: challenge.kind, chain: challenge.chain };
    const res = NextResponse.json({ session });
    res.cookies.set(SESSION_COOKIE, await sign(session, "7d"), cookieOpts(60 * 60 * 24 * 7));
    res.cookies.delete(CHALLENGE_COOKIE);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
