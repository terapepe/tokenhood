import { Reveal, SectionHead } from "@/components/ui/primitives";

const PHASES = [
  { n: "01", title: "ESTABLISH THE HOOD", items: ["Token launch", "Website launch", "Brand identity", "Initial community"] },
  { n: "02", title: "GROW THE COMMUNITY", items: ["Meme campaigns", "Community events", "Content creators", "Social expansion"] },
  { n: "03", title: "EXPAND THE MOVEMENT", items: ["Meme gallery", "Community collaborations", "Ecosystem visibility"] },
  { n: "04", title: "THE HOOD CULTURE", items: ["Long-term community growth", "Community-driven initiatives", "Brand expansion"] },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Roadmap" title={<>The path of <span className="text-hood">the Hood.</span></>} />
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-hood via-line to-transparent lg:top-[19px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full lg:bg-gradient-to-r" />
          <ol className="grid gap-6 lg:grid-cols-4">
            {PHASES.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 110} className="relative pl-14 lg:pt-14 lg:pl-0">
                <span className={`absolute top-0 left-0 grid h-10 w-10 place-items-center rounded-full border font-mono text-xs font-bold ${i === 0 ? "border-hood bg-hood text-bg shadow-[0_0_24px_rgba(0,212,123,.7)]" : "border-line bg-panel text-hood"}`}>
                  {p.n}
                </span>
                <div className="card card-hover h-full p-6">
                  <p className="font-mono text-[11px] tracking-[0.25em] text-hood">PHASE {p.n}</p>
                  <h3 className="mt-2 font-display text-lg leading-tight font-bold">{p.title}</h3>
                  <ul className="mt-5 space-y-2.5 text-sm text-mute">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rotate-45 bg-hood" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
