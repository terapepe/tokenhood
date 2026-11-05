export const shortAddr = (a: string, n = 4) => (a ? `${a.slice(0, n + 2)}…${a.slice(-n)}` : "");

export function fmtUsd(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "N/A";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(v / 1e3).toFixed(2)}K`;
  return `$${v.toFixed(2)}`;
}

/** Price formatting that keeps meaningful digits for tiny meme prices: $0.0₅1234 */
export function fmtPrice(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "N/A";
  if (v >= 1) return `$${v.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
  if (v === 0) return "$0";
  const s = v.toFixed(20);
  const m = s.match(/^0\.(0*)(\d{1,4})/);
  if (!m) return `$${v}`;
  const zeros = m[1].length;
  if (zeros < 4) return `$${v.toPrecision(4)}`;
  const sub = String(zeros).split("").map((d) => "₀₁₂₃₄₅₆₇₈₉"[+d]).join("");
  return `$0.0${sub}${m[2]}`;
}

export function fmtPct(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "N/A";
  return `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export function fmtInt(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "N/A";
  return v.toLocaleString("en-US");
}

export function fmtToken(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "N/A";
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export const timeAgo = (iso: string) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
