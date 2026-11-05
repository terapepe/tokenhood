// Tiny per-instance TTL cache + in-flight dedupe for serverless route handlers.
// The CDN layer (Cache-Control s-maxage) does the heavy lifting; this just
// protects upstream APIs from bursts within one warm instance.
type Entry<T> = { at: number; value: T };
const store = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && Date.now() - hit.at < ttlMs) return hit.value;
  const running = inflight.get(key) as Promise<T> | undefined;
  if (running) return running;
  const p = fn()
    .then((value) => {
      store.set(key, { at: Date.now(), value });
      return value;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

export async function getJson<T>(url: string, init?: RequestInit, timeoutMs = 8000): Promise<T> {
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
    headers: { accept: "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return (await res.json()) as T;
}

/** Standard JSON response with CDN caching. */
export function json(data: unknown, sMaxAge = 15, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${sMaxAge * 4}`,
    },
  });
}

/** Wraps a data fetch so routes always return { available, data | reason }. */
export async function safe<T>(fn: () => Promise<T | null>, reason = "Data unavailable") {
  try {
    const data = await fn();
    if (data == null) return { available: false as const, reason };
    return { available: true as const, data, updatedAt: Date.now() };
  } catch (e) {
    return { available: false as const, reason: e instanceof Error ? e.message : reason };
  }
}
