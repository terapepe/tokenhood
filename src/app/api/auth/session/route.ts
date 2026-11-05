import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verify, type Session } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  let session: Session | null = null;
  try {
    session = await verify<Session>(req.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    session = null;
  }
  return NextResponse.json(
    { session: session ? { address: session.address, kind: session.kind, chain: session.chain } : null },
    { headers: { "cache-control": "private, no-store" } },
  );
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
