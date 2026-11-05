"use client";

import Logo from "@/components/brand/Logo";
import { CONFIG } from "@/config/site";
import { SmartLink } from "@/components/ui/primitives";
import { XIcon, TelegramIcon } from "./Community";

const LINKS = [
  ["About", "#about"],
  ["Token", "#token"],
  ["Community", "#community"],
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-panel/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-mute">The Meme of Robinhood Ecosystem.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {LINKS.map(([l, h]) => (
              <a key={h} href={h} className="text-mute hover:text-hood">{l}</a>
            ))}
            <SmartLink href={CONFIG.social.twitterUrl} className="inline-flex items-center gap-1.5 text-mute hover:text-hood" fallbackMsg="X link coming soon" fallbackHash="#community">
              <XIcon className="h-3.5 w-3.5" /> X
            </SmartLink>
            <SmartLink href={CONFIG.social.telegramUrl} className="inline-flex items-center gap-1.5 text-mute hover:text-hood" fallbackMsg="Telegram link coming soon" fallbackHash="#community">
              <TelegramIcon className="h-3.5 w-3.5" /> Telegram
            </SmartLink>
          </nav>
        </div>
        <div className="mt-12 space-y-3 border-t border-line pt-8 text-xs leading-relaxed text-mute">
          <p>
            TokenHood ($HOOD) is an independent community-driven meme project inspired by the Robinhood ecosystem. It is not affiliated with,
            endorsed by, or sponsored by Robinhood Markets, Inc. or its subsidiaries.
          </p>
          <p>Cryptocurrency assets are highly volatile and involve significant risk. Always verify the token contract address before interacting with any digital asset.</p>
          <p className="pt-3 font-mono text-[11px]">© {CONFIG.tokenName} · {CONFIG.siteHost}</p>
        </div>
      </div>
    </footer>
  );
}
