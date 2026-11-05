import Mascot from "@/components/brand/Mascot";
import { Reveal } from "@/components/ui/primitives";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute top-1/2 left-0 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-hood/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="card relative overflow-hidden p-6 sm:p-10">
            <div className="grid-bg absolute inset-0" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-hood/10 to-transparent" />
            <Mascot id="about" className="relative w-full" />
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-line bg-bg/80 px-4 py-3 backdrop-blur">
              <span className="font-display text-sm font-black tracking-widest">ONE HOOD</span>
              <span className="font-mono text-xs text-hood">$HOOD</span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow"><span className="h-px w-6 bg-hood" />About TokenHood</span>
            <h2 className="h-section mt-4">WHAT IS <span className="text-hood">TOKENHOOD?</span></h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-mute">
            <Reveal delay={80} as="p" className="font-display text-2xl font-bold text-ink">
              The Hood is more than a name. It&apos;s a movement.
            </Reveal>
            <Reveal delay={140} as="p">
              Inspired by the growing Robinhood ecosystem, TokenHood represents the culture, energy, and community surrounding a new generation of onchain finance.
            </Reveal>
            <Reveal delay={200} as="p">
              Built on Robinhood Chain, <span className="text-hood">$HOOD</span> brings meme culture into an expanding blockchain ecosystem.
            </Reveal>
            <Reveal delay={260} as="p" className="text-ink">No complicated story. No empty promises.</Reveal>
            <Reveal delay={320} as="p" className="font-display text-xl font-bold text-neon">Just one community. One meme. One Hood.</Reveal>
            <Reveal delay={380} as="p">Welcome to TokenHood.</Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
