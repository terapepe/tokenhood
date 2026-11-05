export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B5FF5C" />
          <stop offset="1" stopColor="#00D47B" />
        </linearGradient>
      </defs>
      <path d="M32 4 C15 4 7 18 7 34 C7 48 14 57 24 61 L40 61 C50 57 57 48 57 34 C57 18 49 4 32 4 Z" fill="#0c1410" stroke="url(#lm)" strokeWidth="2.5" />
      <path d="M32 16 C22 16 17 25 17 34 C17 44 23 51 32 54 C41 51 47 44 47 34 C47 25 42 16 32 16 Z" fill="#020403" />
      <path d="M21 36 C23 32 28 31 30 33 C28 36 24 37 21 36 Z M43 36 C41 32 36 31 34 33 C36 36 40 37 43 36 Z" fill="#B5FF5C" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[15px] font-extrabold tracking-[0.12em]">
        TOKEN<span className="text-hood">HOOD</span>
      </span>
    </span>
  );
}
