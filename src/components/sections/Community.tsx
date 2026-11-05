"use client";

import { ArrowUpRight, Images, Megaphone } from "lucide-react";
import { CONFIG } from "@/config/site";
import { Reveal, SectionHead, SmartLink } from "@/components/ui/primitives";

export function XIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
export function TelegramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const CARDS = [
  { title: "X / Twitter", desc: "Memes, alpha, and the loudest corner of the Hood.", icon: XIcon, href: CONFIG.social.twitterUrl },
  { title: "Telegram", desc: "Real-time chat with the community. Raids start here.", icon: TelegramIcon, href: CONFIG.social.telegramUrl },
  { title: "Meme Gallery", desc: "The best hooded art made by the people.", icon: Images, href: CONFIG.social.memeGalleryUrl },
  { title: "Community Updates", desc: "Announcements, milestones, and what's next.", icon: Megaphone, href: CONFIG.social.updatesUrl },
];

export default function Community() {
  return (
    <section id="community" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead center eyebrow="The Hood community" title={<>THE HOOD IS BUILT BY <span className="text-hood">THE COMMUNITY.</span></>} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <SmartLink href={c.href} className="card card-hover group flex h-full flex-col p-6" fallbackMsg={`${c.title} link coming soon`} fallbackHash="#community">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-bg text-ink transition group-hover:border-hood group-hover:text-hood">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-mute transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-hood" />
                </div>
                <p className="mt-8 font-display text-lg font-bold">{c.title}</p>
                <p className="mt-2 text-sm text-mute">{c.desc}</p>
                {!c.href && <p className="mt-4 font-mono text-[10px] tracking-widest text-mute/70 uppercase">Coming soon</p>}
              </SmartLink>
            </Reveal>
          ))}
        </div>

        <Reveal className="relative mt-10 overflow-hidden rounded-[2rem] border border-hood/30 p-8 text-center sm:p-14">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,212,123,.25),transparent_70%)]" />
          <div className="grid-bg absolute inset-0 -z-10" />
          <p className="font-display text-[clamp(2.25rem,7vw,5rem)] leading-none font-black tracking-tight">
            JOIN THE <span className="grad-text text-glow">HOOD.</span>
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <SmartLink href={CONFIG.social.twitterUrl} className="btn-primary h-14 px-8" fallbackMsg="X link coming soon" fallbackHash="#community">
              <XIcon className="h-4 w-4" /> Follow on X
            </SmartLink>
            <SmartLink href={CONFIG.social.telegramUrl} className="btn-ghost h-14 px-8" fallbackMsg="Telegram link coming soon" fallbackHash="#community">
              <TelegramIcon className="h-4 w-4" /> Join Telegram
            </SmartLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
