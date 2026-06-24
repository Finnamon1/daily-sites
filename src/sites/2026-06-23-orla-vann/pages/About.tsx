import { Reveal } from "@/components/fx/Reveal"
import { Kicker, Label, Oscilloscope } from "../shared"
import { Page } from "./Page"

const GEAR = [
  "Serge / Eurorack modular",
  "Revox B77 reel-to-reel",
  "Roland Space Echo RE-201",
  "Contact mics & a glass jar",
  "Juno-60, slightly broken",
  "A field recorder, always on",
]

const TIMELINE = [
  { y: "2019", t: "Leaves a film-scoring job in Copenhagen to chase tape hiss full-time." },
  { y: "2021", t: "Self-releases the single Pilot Light; it finds a home on late-night radio." },
  { y: "2022", t: "Field Recordings, Vol. I. First European tour, mostly to galleries." },
  { y: "2024", t: "Tidal Static, scored partly on the North Sea coast in February." },
  { y: "2026", t: "Glasswork — recorded live to tape in a disused glassworks near Aarhus." },
]

export function About() {
  return (
    <Page>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <Kicker>The artist</Kicker>
            <h1 className="mt-5 font-['Bricolage_Grotesque'] text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-6xl">
              Orla Vann makes music for the hour after midnight.
            </h1>
            <div className="mt-7 max-w-xl space-y-4 font-['Hanken_Grotesk'] leading-relaxed text-[#e9ebe6]/70">
              <p>
                She works almost entirely with a modular synthesiser and a
                reel-to-reel, building pieces from a single patch and then letting
                tape do what tape does — smear it, warm it, lose a little of it.
              </p>
              <p>
                Nothing is quantised. A piece is finished when the room it was
                recorded in stops humming. Critics keep reaching for the word
                “weather”; Orla prefers “a long exhale you can stand inside.”
              </p>
              <p>
                Glasswork, her third album, was tracked over three winter nights in
                a glassworks that had been cold for forty years. You can hear the
                building in it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src="https://picsum.photos/seed/orla-portrait-studio-night/700/880"
                alt="Orla Vann at the mixing desk in a dim studio, lit only by equipment glow"
                width={700}
                height={880}
                loading="lazy"
                className="aspect-[7/9] w-full object-cover [filter:grayscale(0.55)_contrast(1.05)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
              <Oscilloscope playing thin className="absolute bottom-4 left-4 right-4 h-8 opacity-80" />
            </div>
          </Reveal>
        </div>

        {/* timeline + gear */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Reveal>
              <Label className="text-[#e9ebe6]/45">Selected history</Label>
            </Reveal>
            <ul className="mt-6">
              {TIMELINE.map((e, i) => (
                <Reveal key={e.y} delay={i * 0.06}>
                  <li className="flex gap-6 border-l border-white/10 pb-8 pl-6 last:pb-0">
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#c5f24c]" />
                      <span className="font-['JetBrains_Mono'] text-sm text-[#c5f24c]">
                        {e.y}
                      </span>
                    </div>
                    <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#e9ebe6]/75">
                      {e.t}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal>
              <Label className="text-[#e9ebe6]/45">The tools</Label>
            </Reveal>
            <ul className="mt-6 space-y-3">
              {GEAR.map((g, i) => (
                <Reveal key={g} delay={i * 0.05}>
                  <li className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#10131a] px-4 py-3 font-['Hanken_Grotesk'] text-sm text-[#e9ebe6]/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c5f24c]" />
                    {g}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Page>
  )
}
