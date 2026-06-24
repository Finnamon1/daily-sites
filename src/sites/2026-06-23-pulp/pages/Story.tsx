import { Reveal } from "@/components/fx/Reveal"
import { Spotlight } from "@/components/fx/Spotlight"
import { Quote } from "lucide-react"
import { Counter } from "../components/Counter"
import { timeline, stats } from "../data"

export function Story() {
  return (
    <div className="px-6 pb-24 pt-14 md:pt-20">
      <div className="mx-auto max-w-6xl">
        {/* intro */}
        <div className="grid items-end gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#B23A10]">Our story</p>
            <h1 className="mt-2 font-['Syne'] text-5xl font-extrabold leading-[0.95] tracking-tight text-[#221C15] md:text-6xl">
              We made the drink
              <br />
              we kept asking for.
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#4A4135]">
              Pulp started as an argument over dinner: why does every alcohol-free
              drink taste like a compromise? Six years later we're still proving it
              doesn't have to.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[28px] border border-[#221C15]/10">
              <img
                src="https://picsum.photos/seed/citrusorchard/720/560"
                alt="Crates of freshly picked citrus at the Pulp railway-arch workshop"
                width={720}
                height={560}
                loading="lazy"
                className="aspect-[9/7] w-full object-cover [filter:sepia(0.12)_saturate(1.12)]"
              />
            </div>
          </Reveal>
        </div>

        {/* big stats */}
        <div className="mt-20 grid gap-y-10 border-y border-[#221C15]/10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <div className="border-l-2 border-[#E8511D] pl-5">
                <p className="font-['Syne'] text-5xl font-extrabold tracking-tight text-[#221C15]">
                  <Counter value={s.value} suffix={s.suffix} raw={"raw" in s ? Boolean(s.raw) : false} />
                </p>
                <p className="mt-2 text-sm text-[#5A4F40]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* timeline */}
        <div className="mt-20">
          <Reveal>
            <h2 className="font-['Fraunces'] text-3xl font-semibold text-[#221C15] md:text-4xl">How we got here</h2>
          </Reveal>
          <div className="mt-10 space-y-px">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <div className="grid gap-2 border-t border-[#221C15]/12 py-7 md:grid-cols-[140px_1fr] md:gap-10">
                  <div className="font-['Syne'] text-2xl font-extrabold text-[#E8511D]">{t.year}</div>
                  <div className="max-w-2xl">
                    <h3 className="font-['Fraunces'] text-xl font-semibold text-[#221C15]">{t.title}</h3>
                    <p className="mt-2 leading-relaxed text-[#4A4135]">{t.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* pull quote */}
        <Reveal>
          <Spotlight
            color="rgba(232,81,29,0.22)"
            size={420}
            className="mt-20 rounded-[32px] bg-[#221C15] p-10 md:p-16"
          >
            <Quote className="h-9 w-9 text-[#EFA12C]" />
            <p className="mt-6 max-w-3xl font-['Fraunces'] text-2xl font-medium leading-snug text-[#F7F1E3] md:text-[32px]">
              "We turned down the deal that wanted us sweeter. Bitter isn't a flaw to
              sand off — it's the whole point. Pulp is for people who'd rather taste
              something than be soothed by it."
            </p>
            <p className="mt-7 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#C9BFAE]">
              Mara Ellison — Founder &amp; head blender
            </p>
          </Spotlight>
        </Reveal>
      </div>
    </div>
  )
}
