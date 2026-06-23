import { Reveal } from "@/components/fx/Reveal"
import { C, CREW } from "../theme"
import { Kicker } from "../bits"

const PROCESS = [
  { step: "01", title: "We find a frequency", text: "One story per season, and it has to be a story you can only really tell through sound — tapes, transmissions, voices, rooms." },
  { step: "02", title: "We go to the archive", text: "Months in lock-ups, county records and strangers' attics. If a claim can't be verified, we say so in the episode." },
  { step: "03", title: "We build the room", text: "Sound design isn't decoration here. We rebuild the wet stone of the fort and the hiss between stations so you're standing in it." },
  { step: "04", title: "We go quiet", text: "When the season ends, the feed goes silent. No filler, no cash-grab bonus drops. The next signal comes when it's ready." },
]

function Portrait({ seed, name }: { seed: string; name: string }) {
  return (
    <div className="aspect-[4/5] overflow-hidden rounded-2xl border" style={{ borderColor: C.paperLine }}>
      <img
        src={`https://picsum.photos/seed/${seed}/520/650`}
        alt={`Portrait of ${name}`}
        width={520}
        height={650}
        loading="lazy"
        className="h-full w-full object-cover grayscale transition-[filter,transform] duration-500 group-hover:!grayscale-0 group-hover:scale-[1.03]"
      />
    </div>
  )
}

export function About() {
  return (
    <div>
      {/* ── Hero (dark) ───────────────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: C.line }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <Kicker>The show</Kicker>
            <h1 className="mt-5 font-['Fraunces'] text-[clamp(2.6rem,6.5vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.02em]" style={{ color: C.text }}>
              We make documentaries
              <br />
              for the dark.
            </h1>
          </div>
          <p className="font-['Space_Grotesk'] text-[18px] leading-[1.75]" style={{ color: C.textSoft }}>
            FATHOM started in a spare bedroom in 2022 with a borrowed recorder and one rule: tell the kind of true story that only works in your ears, in the dark, with the lights off. Three seasons later that's still the only rule.
          </p>
        </div>
      </section>

      {/* ── Crew (warm paper) ─────────────────────────────────────────── */}
      <section style={{ background: C.paper }}>
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <Kicker on="paper">Behind the mic</Kicker>
            <h2 className="mt-5 max-w-2xl font-['Fraunces'] text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.01em]" style={{ color: C.paperInk }}>
              A three-person crew and a very long extension lead.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {CREW.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <article className="group">
                  <Portrait seed={`fathom-${p.name.split(" ")[0].toLowerCase()}`} name={p.name} />
                  <h3 className="mt-5 font-['Fraunces'] text-[22px] font-semibold" style={{ color: C.paperInk }}>
                    {p.name}
                  </h3>
                  <p className="mt-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em]" style={{ color: C.signalInk }}>
                    {p.role}
                  </p>
                  <p className="mt-3 font-['Space_Grotesk'] text-[15px] leading-relaxed" style={{ color: C.paperSoft }}>
                    {p.bio}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process (dark) ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <Kicker>How a season gets made</Kicker>
          <h2 className="mt-5 max-w-xl font-['Fraunces'] text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.04] tracking-[-0.01em]" style={{ color: C.text }}>
            Slow on purpose.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border md:grid-cols-2" style={{ borderColor: C.line, background: C.line }}>
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={(i % 2) * 0.08}>
              <div className="h-full p-8 md:p-10" style={{ background: C.panel }}>
                <span className="font-['JetBrains_Mono'] text-[13px]" style={{ color: C.signal }}>{p.step}</span>
                <h3 className="mt-4 font-['Fraunces'] text-[24px] font-semibold" style={{ color: C.text }}>{p.title}</h3>
                <p className="mt-3 font-['Space_Grotesk'] text-[16px] leading-relaxed" style={{ color: C.textSoft }}>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
