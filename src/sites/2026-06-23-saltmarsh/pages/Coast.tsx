import { Reveal } from "@/components/fx/Reveal"
import { ParallaxImage } from "../components/Parallax"
import { places } from "../data"

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export function Coast() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <span className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.3em] text-[#2f6b5e]">
            The Coast · west to east
          </span>
          <h1 className="mt-3 font-['Fraunces'] text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-[#1c2321]">
            Six places, and how to read them.
          </h1>
          <p className="mt-5 font-['DM_Sans'] text-[17px] leading-relaxed text-[#1c2321]/75">
            Listed roughly as you'd meet them driving the coast road from Hunstanton.
            Each has a season, a tide, and a single thing worth getting up early for.
          </p>
        </header>

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {places.map((p, i) => (
            <article
              key={p.slug}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                i % 2 === 1 ? "md:[&>figure]:order-2" : ""
              }`}
            >
              <Reveal>
                <figure className="m-0">
                  <ParallaxImage
                    src={img(p.seed, 760, 560)}
                    alt={`${p.name} — ${p.kind}`}
                    ratio="aspect-[4/3]"
                    distance={11}
                    className="rounded-sm shadow-[0_28px_56px_-32px_rgba(28,35,33,0.5)]"
                  />
                </figure>
              </Reveal>

              <Reveal delay={0.08}>
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-['Fraunces'] text-[13px] font-semibold tabular-nums text-[#985a1f]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.22em] text-[#2f6b5e]">
                      {p.kind}
                    </span>
                  </div>
                  <h2 className="mt-2 font-['Fraunces'] text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight text-[#1c2321]">
                    {p.name}
                  </h2>
                  <p className="mt-3 font-['Fraunces'] text-lg italic leading-snug text-[#2f6b5e]">
                    {p.blurb}
                  </p>
                  <p className="mt-4 max-w-md font-['DM_Sans'] leading-relaxed text-[#1c2321]/75">
                    {p.detail}
                  </p>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
