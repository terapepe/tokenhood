"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import WalletButton from "@/components/wallet/WalletButton";
import { SmartLink, useLinks } from "@/components/ui/primitives";

export const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#token", label: "Token" },
  { href: "#chart", label: "Chart" },
  { href: "#community", label: "Community" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const { buyUrl } = useLinks();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) io.observe(el);
    });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("hashchange", onHash); io.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${scrolled || open ? "border-b border-line/80 bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <a href="#home" aria-label="TokenHood home" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-line/70 bg-panel/50 p-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active === n.href ? "bg-hood/15 text-neon" : "text-mute hover:text-ink"}`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <WalletButton />
          </div>
          <SmartLink href={buyUrl} className="btn-primary hidden h-10 sm:inline-flex" fallbackMsg="Trading opens once the $HOOD contract is published">
            BUY $HOOD
          </SmartLink>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="modal-in h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-bg px-4 pt-6 pb-10 lg:hidden">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-4 font-display text-2xl font-bold hover:bg-panel">
                  {n.label} <span className="text-hood">→</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <SmartLink href={buyUrl} className="btn-primary h-14 text-base" fallbackMsg="Trading opens once the $HOOD contract is published">
              BUY $HOOD
            </SmartLink>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
