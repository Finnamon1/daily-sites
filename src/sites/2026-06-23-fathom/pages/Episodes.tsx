import { Reveal } from "@/components/fx/Reveal"
import { C, EPISODES, SEASON } from "../theme"
import { Kicker } from "../bits"
import { WaveformPlayer } from "../player"

export function Episodes() {
  return (
    <div>
      <section className="border-b" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Kicker>Season {SEASON.no} · {SEASON.name}</Kicker>
          <h1 className="mt-5 max-w-3xl font-['Fraunces'] text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.02em]" style={{ color: C.text }}>
            Six episodes. One frequency.
          </h1>
          <p className="mt-6 max-w-xl font-['Space_Grotesk'] text-[18px] leading-relaxed" style={{ color: C.textSoft }}>
            A FATHOM season is one documentary in parts — start at the top and let it run. Hit play below to scrub the wave, or drag the playhead anywhere across it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <ol className="space-y-5">
          {EPISODES.map((ep, i) => (
            <Reveal key={ep.no} delay={Math.min(i, 4) * 0.06}>
              <li>
                <article
                  className="grid gap-6 rounded-3xl border p-6 transition-colors duration-200 md:grid-cols-[auto_1fr] md:p-8"
                  style={{ borderColor: C.line, background: C.panel }}
                >
                  <div className="flex items-start gap-4 md:flex-col md:gap-2">
                    <span className="font-['Fraunces'] text-[44px] font-semibold leading-none" style={{ color: i === 0 ? C.signal : C.wave }}>
                      {ep.no.toString().padStart(2, "0")}
                    </span>
                    <span className="mt-2 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em]" style={{ color: C.textFaint }}>
                      {ep.released}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-['Fraunces'] text-[clamp(1.4rem,3vw,1.9rem)] font-semibold leading-tight" style={{ color: C.text }}>
                      {ep.title}
                    </h2>
                    <p className="mt-3 mb-6 max-w-2xl font-['Space_Grotesk'] text-[16px] leading-relaxed" style={{ color: C.textSoft }}>
                      {ep.dek}
                    </p>
                    <WaveformPlayer episode={ep} />
                  </div>
                </article>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <p className="mt-12 text-center font-['Spectral'] text-[17px] italic" style={{ color: C.textFaint }}>
            That's the whole season. The next story is already being reported — the feed stays quiet until it's ready.
          </p>
        </Reveal>
      </section>
    </div>
  )
}
