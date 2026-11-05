/** Procedural cyber-city skyline (deterministic, SSR-safe). */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

export default function Skyline({ className = "", seed = 7, layers = 2 }: { className?: string; seed?: number; layers?: number }) {
  const W = 1600;
  const H = 420;
  const out: React.ReactNode[] = [];
  for (let l = 0; l < layers; l++) {
    const r = rng(seed + l * 101);
    let x = -20;
    const tone = l === 0 ? "#0b1410" : "#070d0a";
    const winOp = l === 0 ? 0.25 : 0.55;
    while (x < W) {
      const w = 40 + r() * 90;
      const h = (l === 0 ? 180 : 90) + r() * (l === 0 ? 220 : 200);
      const y = H - h;
      out.push(<rect key={`b${l}-${x}`} x={x} y={y} width={w} height={h} fill={tone} />);
      if (r() > 0.75) out.push(<rect key={`a${l}-${x}`} x={x + w / 2 - 1} y={y - 30} width="2" height="30" fill={tone} />);
      if (r() > 0.6) out.push(<rect key={`n${l}-${x}`} x={x} y={y} width={w} height="2" fill="#00D47B" opacity={0.35 + r() * 0.4} />);
      for (let wy = y + 12; wy < H - 10; wy += 16) {
        for (let wx = x + 8; wx < x + w - 8; wx += 12) {
          if (r() > 0.86) out.push(<rect key={`w${l}-${wx}-${wy}`} x={wx} y={wy} width="4" height="6" fill={r() > 0.3 ? "#00D47B" : "#B5FF5C"} opacity={winOp * (0.4 + r())} />);
        }
      }
      x += w + 4 + r() * 10;
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sky-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00D47B" stopOpacity="0" />
          <stop offset="1" stopColor="#00D47B" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sky-haze)" />
      {out}
    </svg>
  );
}
