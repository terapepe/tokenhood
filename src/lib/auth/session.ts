import "server-only";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "th_session";
export const CHALLENGE_COOKIE = "th_challenge";

export type WalletKind = "evm" | "solana";
export type Session = { address: string; kind: WalletKind; chain: string };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET is not configured (min 32 chars)");
  return new TextEncoder().encode(s);
}

export async function sign(payload: Record<string, unknown>, ttl: string) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(ttl).sign(secret());
}

export async function verify<T>(token: string | undefined): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as T;
  } catch {
    return null;
  }
}

export const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

export function buildMessage(p: { host: string; uri: string; address: string; kind: WalletKind; chain: string; nonce: string; issuedAt: string }) {
  return [
    `${p.host} wants you to sign in with your ${p.kind === "solana" ? "Solana" : "Ethereum"} account:`,
    p.address,
    "",
    "Sign in to TokenHood. This is a free signature — it does not send a transaction, cost gas, or grant any token approval.",
    "",
    `URI: ${p.uri}`,
    `Network: ${p.chain}`,
    `Nonce: ${p.nonce}`,
    `Issued At: ${p.issuedAt}`,
  ].join("\n");
}
