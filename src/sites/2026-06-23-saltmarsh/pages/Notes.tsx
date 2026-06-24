import { Reveal } from "@/components/fx/Reveal"
import { ParallaxImage } from "../components/Parallax"
import { notes } from "../data"

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export function Notes() {
  const [lead, ...rest] = notes

  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <span className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.3em] text-[#2f6b5e]">
            Field Notes
          </span>
          <h1 className="mt-3 font-['Fraunces'] text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-[#1c2321]">
            Dispatches from the marsh edge.
          </h1>
          <p className="mt-5 font-['DM_Sans'] text-[17px] leading-relaxed text-[#1c2321]/75">
            Short, irregular, written on foot. Mostly about birds and the tide, and the
            mistakes that taught me to respect both.
          </p>
        </header>

        {/* lead note */}
        <Reveal>
          <article className="mt-14 grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
            <figure className="m-0">
              <ParallaxImage
                src={img(lead.seed, 820, 600)}
                alt={lead.title}
                ratio="aspect-[4/3]"
                distance={10}
                className="rounded-sm shadow-[0_28px_56px_-32px_rgba(28,35,33,0.5)]"
              />
            </figure>
            <div>
              <div className="flex items-center gap-3 font-['DM_Sans'] text-[12px] uppercase tracking-[0.2em] text-[#2f6b5e]">
                <span>{lead.date}</span>
                <span className="h-1 w-1 rounded-full bg-[#cf7a2e]" />
                <span>{lead.reading} read</span>
              </div>
              <h2 className="mt-3 font-['Fraunces'] text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-tight text-[#1c2321]">
                {lead.title}
              </h2>
              <p className="mt-4 font-['Fraunces'] text-lg italic leading-relaxed text-[#1c2321]/80">
                {lead.excerpt}
              </p>
              <button className="mt-6 font-['DM_Sans'] text-[15px] font-medium text-[#2f6b5e] underline-offset-4 transition-colors hover:text-[#1c2321] hover:underline">
                Read the note →
              </button>
            </div>
          </article>
        </Reveal>

        {/* the rest */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-[#1c2321]/12 bg-[#1c2321]/12 sm:grid-cols-2">
          {rest.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.08}>
              <article className="group h-full bg-[#f6f3ec] p-6 transition-colors duration-200 hover:bg-[#efe9dc]">
                <div className="flex items-center gap-3 font-['DM_Sans'] text-[12px] uppercase tracking-[0.2em] text-[#2f6b5e]">
                  <span>{n.date}</span>
                  <span className="h-1 w-1 rounded-full bg-[#cf7a2e]" />
                  <span>{n.reading} read</span>
                </div>
                <h3 className="mt-3 font-['Fraunces'] text-2xl font-semibold leading-tight text-[#1c2321]">
                  {n.title}
                </h3>
                <p className="mt-3 font-['DM_Sans'] text-[15px] leading-relaxed text-[#1c2321]/75">
                  {n.excerpt}
                </p>
                <span className="mt-4 inline-block font-['DM_Sans'] text-[14px] font-medium text-[#2f6b5e] opacity-70 transition-opacity group-hover:opacity-100">
                  Read the note →
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
