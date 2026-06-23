import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"

const PRESS = [
  { quote: "Music that sounds like it was found, not made.", source: "The Wire" },
  { quote: "A debut of startling restraint and warmth.", source: "Pitchfork" },
  { quote: "You can hear the cold. You can hear the candle.", source: "Crack Magazine" },
]

export function About() {
  return (
    <div className="px-6 pb-28 pt-16">
      <div className="mx-auto max-w-5xl">
        {/* intro */}
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
          <Reveal>
            <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.24em] text-[#e8b15c]">
              The composer
            </span>
            <h1 className="mt-4 font-['Bricolage_Grotesque'] text-5xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              Sól Bjarkadóttir
            </h1>
            <div className="mt-6 space-y-4 text-base leading-[1.75] text-[#c2c7ce]">
              <p>
                Sól grew up in Stykkishólmur, a fishing town on the western fjords, where her
                grandfather kept the harbour light. She trained as a pianist in Reykjavík and Berlin,
                then spent five years scoring films before deciding she had something quieter to say.
              </p>
              <p>
                In the winter of 2025 she moved a felted upright piano into the Súgandisey
                lighthouse, ran a single ribbon microphone, and recorded whenever the light was low —
                which, that far north, was most of the day.
              </p>
              <p className="text-[#9aa1ad]">
                <span className="italic text-[#eef0f3]">Aurelia</span> is the result: her first album
                under her own name, named for the moon jellyfish that drift through the cold water
                below the rocks.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <TiltCard max={8} className="ml-auto w-full max-w-[300px]">
              <figure className="overflow-hidden rounded-2xl border border-white/[0.08]">
                <div className="relative aspect-[4/5]">
                  <img
                    src="https://picsum.photos/seed/aurelia-portrait-winter-window/600/750"
                    alt="Portrait of composer Sól Bjarkadóttir at a window in winter light"
                    width={600}
                    height={750}
                    loading="lazy"
                    className="h-full w-full object-cover [filter:grayscale(0.85)_sepia(0.15)_contrast(1.05)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10]/60 via-transparent to-transparent" />
                </div>
                <figcaption className="bg-white/[0.02] px-4 py-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#7e8590]">
                  Súgandisey, January 2025
                </figcaption>
              </figure>
            </TiltCard>
          </Reveal>
        </div>

        {/* pull quote */}
        <Reveal>
          <blockquote className="mt-24 border-l-2 border-[#e8b15c] pl-7 font-['Bricolage_Grotesque'] text-3xl font-medium leading-[1.25] tracking-[-0.01em] text-[#eef0f3] sm:text-4xl">
            “I stopped trying to fix the takes. The mistakes are where the room is — and the room is
            the whole point.”
          </blockquote>
        </Reveal>

        {/* press */}
        <div className="mt-24">
          <Reveal>
            <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.24em] text-[#9aa1ad]">
              What they said
            </span>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PRESS.map((p, i) => (
              <Reveal key={p.source} delay={i * 0.08}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7">
                  <p className="font-['Bricolage_Grotesque'] text-lg leading-snug text-[#eef0f3]">
                    “{p.quote}”
                  </p>
                  <p className="mt-6 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#e8b15c]">
                    {p.source}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* credits */}
        <Reveal>
          <div className="mt-24 grid gap-8 border-t border-white/[0.07] pt-12 sm:grid-cols-3">
            {[
              { label: "Written & performed", value: "Sól Bjarkadóttir" },
              { label: "Recorded & mixed", value: "Hörður Már, at Súgandisey & Greenhouse" },
              { label: "Strings", value: "The Amiina trio, Reykjavík" },
            ].map((c) => (
              <div key={c.label}>
                <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#7e8590]">
                  {c.label}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#c9cdd4]">{c.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
