/** Original TokenHood mascot — a hooded figure with emerald eyes. Pure SVG, no external assets. */
export default function Mascot({ className = "", id = "m" }: { className?: string; id?: string }) {
  const g = (n: string) => `${id}-${n}`;
  return (
    <svg viewBox="0 0 400 480" className={className} role="img" aria-label="TokenHood hooded mascot with glowing green eyes">
      <defs>
        <radialGradient id={g("back")} cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor="#00D47B" stopOpacity=".55" />
          <stop offset="45%" stopColor="#00D47B" stopOpacity=".12" />
          <stop offset="100%" stopColor="#00D47B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("cloth")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b2620" />
          <stop offset="55%" stopColor="#0c120f" />
          <stop offset="100%" stopColor="#050806" />
        </linearGradient>
        <linearGradient id={g("cloth2")} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18231c" />
          <stop offset="100%" stopColor="#060907" />
        </linearGradient>
        <radialGradient id={g("void")} cx="50%" cy="58%" r="60%">
          <stop offset="0%" stopColor="#020403" />
          <stop offset="70%" stopColor="#030504" />
          <stop offset="100%" stopColor="#0d1712" />
        </radialGradient>
        <linearGradient id={g("rim")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B5FF5C" stopOpacity=".95" />
          <stop offset="35%" stopColor="#00D47B" stopOpacity=".25" />
          <stop offset="65%" stopColor="#00D47B" stopOpacity=".25" />
          <stop offset="100%" stopColor="#B5FF5C" stopOpacity=".95" />
        </linearGradient>
        <radialGradient id={g("eye")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4FFE6" />
          <stop offset="35%" stopColor="#B5FF5C" />
          <stop offset="100%" stopColor="#00D47B" />
        </radialGradient>
        <filter id={g("glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={g("bigglow")} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={g("soft")}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* backlight */}
      <circle cx="200" cy="200" r="200" fill={`url(#${g("back")})`} className="animate-glow" />

      {/* shoulders / body */}
      <path d="M18 480 C26 408 70 360 140 336 L260 336 C330 360 374 408 382 480 Z" fill={`url(#${g("cloth")})`} />
      <path d="M18 480 C26 408 70 360 140 336" fill="none" stroke="#B5FF5C" strokeOpacity=".55" strokeWidth="2" filter={`url(#${g("soft")})`} />
      <path d="M382 480 C374 408 330 360 260 336" fill="none" stroke="#B5FF5C" strokeOpacity=".55" strokeWidth="2" filter={`url(#${g("soft")})`} />
      {/* folds */}
      <path d="M95 480 C100 430 120 395 150 372" fill="none" stroke="#000" strokeOpacity=".55" strokeWidth="6" />
      <path d="M305 480 C300 430 280 395 250 372" fill="none" stroke="#000" strokeOpacity=".55" strokeWidth="6" />

      {/* hood */}
      <path
        d="M200 34 C122 34 80 104 80 188 C80 262 104 314 148 346 C170 360 230 360 252 346 C296 314 320 262 320 188 C320 104 278 34 200 34 Z"
        fill={`url(#${g("cloth2")})`}
      />
      {/* hood seam */}
      <path d="M200 36 C196 70 196 92 200 104" fill="none" stroke="#000" strokeOpacity=".6" strokeWidth="3" />
      {/* hood rim light */}
      <path
        d="M200 34 C122 34 80 104 80 188 C80 262 104 314 148 346 M200 34 C278 34 320 104 320 188 C320 262 296 314 252 346"
        fill="none"
        stroke={`url(#${g("rim")})`}
        strokeWidth="2.5"
        filter={`url(#${g("glow")})`}
      />

      {/* face opening */}
      <path
        d="M200 98 C148 98 120 146 120 200 C120 256 150 298 200 312 C250 298 280 256 280 200 C280 146 252 98 200 98 Z"
        fill={`url(#${g("void")})`}
      />
      {/* inner hood lip */}
      <path
        d="M200 98 C148 98 120 146 120 200 C120 256 150 298 200 312 C250 298 280 256 280 200 C280 146 252 98 200 98 Z"
        fill="none"
        stroke="#00D47B"
        strokeOpacity=".22"
        strokeWidth="3"
      />
      {/* shadow brow */}
      <path d="M128 168 C160 140 240 140 272 168 C250 156 150 156 128 168 Z" fill="#000" opacity=".7" />

      {/* eyes */}
      <g>
        <ellipse cx="200" cy="206" rx="70" ry="22" fill="#00D47B" opacity=".25" filter={`url(#${g("bigglow")})`} className="animate-glow" />
        <g className="eye" filter={`url(#${g("glow")})`}>
          <path d="M150 208 C158 194 178 190 190 198 C182 210 164 214 150 208 Z" fill={`url(#${g("eye")})`} />
          <path d="M250 208 C242 194 222 190 210 198 C218 210 236 214 250 208 Z" fill={`url(#${g("eye")})`} />
        </g>
      </g>

      {/* drawstrings */}
      <g stroke="#B5FF5C" strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M176 336 C172 360 174 385 168 410" />
        <path d="M224 336 C228 360 226 385 232 410" />
      </g>
      <rect x="163" y="408" width="10" height="20" rx="3" fill="#B5FF5C" filter={`url(#${g("glow")})`} />
      <rect x="227" y="408" width="10" height="20" rx="3" fill="#B5FF5C" filter={`url(#${g("glow")})`} />

      {/* chest emblem */}
      <g transform="translate(200 440)" filter={`url(#${g("glow")})`}>
        <polygon points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12" fill="none" stroke="#00D47B" strokeWidth="2" />
        <path d="M-8 -11 V11 M8 -11 V11 M-8 0 H8" stroke="#B5FF5C" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
