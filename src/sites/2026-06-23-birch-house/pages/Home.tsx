import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Thermometer, Snowflake, Wind } from "lucide-react"
import { C, SPACES } from "../theme"
import { Kicker, SteamField, ThermalTag, Section } from "../ui"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <SteamField />
        <div className="relative grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Kicker>Portland, Oregon · est. 2019</Kicker>
            <h1 className="mt-6 font-['Spectral'] text-[clamp(2.6rem,6.2vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.02em]">
              A bathhouse for
              <br />
              the long{" "}
              <span className="relative italic" style={{ color: C.emberText }}>
                winter
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] rounded-full"
                  style={{ background: C.ember }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />
              </span>
              .
            </h1>
            <p className="mt-7 max-w-md font-['Hanken_Grotesk'] text-[17px] leading-[1.7]" style={{ color: C.inkSoft }}>
              Wood-fired heat, a four-degree plunge, and a quiet room to let the
              two meet. We built it in an old ice house so the city could learn to
              love the cold.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.4}>
                <Link
                  to={`${base}/booking`}
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-transform duration-200"
                  style={{ background: C.ember, color: "#fbf3e9" }}
                >
                  Book a soak
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Link
                to={`${base}/ritual`}
                className="font-['Hanken_Grotesk'] text-[15px] font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                style={{ color: C.ink }}
              >
                Learn the ritual
              </Link>
            </div>
          </div>

          {/* hero image with directional warm scrim */}
          <Reveal y={28}>
            <div className="relative overflow-hidden rounded-[1.4rem] border" style={{ borderColor: C.line }}>
              <img
                src="https://picsum.photos/seed/birch-sauna-warm-wood-light/900/1080"
                alt="Low afternoon light raking across the birch tiers of the sauna"
                width={900}
                height={1080}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
                style={{ filter: "saturate(0.92) contrast(1.02)" }}
              />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,22,17,0) 45%, rgba(26,22,17,0.55) 100%), linear-gradient(90deg, rgba(168,63,29,0.16), rgba(168,63,29,0) 60%)" }} />
              <div className="absolute left-4 top-4 flex gap-2">
                <ThermalTag temp="warm" onDark />
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <p className="font-['Spectral'] text-[18px] italic" style={{ color: C.bone }}>The Birch Sauna · 90°C</p>
                <span className="rounded-full px-3 py-1.5 font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-[0.14em]" style={{ background: "rgba(244,238,228,0.92)", color: C.ink }}>
                  6 slots free today
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── The cycle in three ───────────────────────────────── */}
      <div style={{ background: C.char }}>
        <Section className="py-20 md:py-28" id="cycle">
          <Reveal>
            <Kicker cold>The contrast, briefly</Kicker>
            <h2 className="mt-5 max-w-2xl font-['Spectral'] text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.08]" style={{ color: C.bone }}>
              Heat opens you, cold closes you, rest is where it lands.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: "rgba(244,238,228,0.1)" }}>
            {[
              { icon: Thermometer, label: "Heat", color: C.emberOnDark, text: "Climb the birch tiers until the sweat is real. Ten minutes, give or take.", spec: "90°C" },
              { icon: Snowflake, label: "Cold", color: C.steelOnDark, text: "Walk into the plunge to the shoulders, breathe slow, count to sixty.", spec: "4°C" },
              { icon: Wind, label: "Rest", color: "#cdbba0", text: "Sit in the Rest Hall and do nothing until your breath goes quiet.", spec: "10 min" },
            ].map((step, i) => (
              <Reveal key={step.label} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-4 p-8" style={{ background: C.char }}>
                  <div className="flex items-center justify-between">
                    <step.icon className="h-6 w-6" style={{ color: step.color }} strokeWidth={1.6} />
                    <span className="font-['IBM_Plex_Mono'] text-[12px] tracking-[0.12em]" style={{ color: "rgba(244,238,228,0.55)" }}>{step.spec}</span>
                  </div>
                  <h3 className="font-['Spectral'] text-[1.5rem] font-medium" style={{ color: C.bone }}>{step.label}</h3>
                  <p className="font-['Hanken_Grotesk'] text-[15px] leading-[1.65]" style={{ color: "rgba(244,238,228,0.72)" }}>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <Link to={`${base}/ritual`} className="mt-10 inline-flex items-center gap-2 font-['Hanken_Grotesk'] text-[15px] font-semibold underline-offset-4 hover:underline" style={{ color: C.emberOnDark }}>
              The full ritual, round by round <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </Section>
      </div>

      {/* ── Spaces preview ───────────────────────────────────── */}
      <Section className="py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <Kicker>Five rooms, two temperatures</Kicker>
            <h2 className="mt-5 font-['Spectral'] text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.08]">The spaces</h2>
          </Reveal>
          <Reveal>
            <Link to={`${base}/spaces`} className="hidden shrink-0 items-center gap-2 font-['Hanken_Grotesk'] text-[15px] font-semibold underline-offset-4 hover:underline md:inline-flex" style={{ color: C.emberText }}>
              See all five <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-[1.4fr_1fr]">
          {/* large feature */}
          <Reveal>
            <SpaceCard space={SPACES[0]} large />
          </Reveal>
          <div className="grid gap-5">
            <Reveal delay={0.08}><SpaceCard space={SPACES[1]} /></Reveal>
            <Reveal delay={0.16}><SpaceCard space={SPACES[3]} /></Reveal>
          </div>
        </div>
      </Section>

      {/* ── Closing CTA band ─────────────────────────────────── */}
      <Section className="pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.6rem] px-8 py-16 text-center md:px-16 md:py-20" style={{ background: C.boneSoft, border: `1px solid ${C.line}` }}>
            <SteamField tint={C.ember} />
            <p className="relative font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.28em]" style={{ color: C.emberText }}>Open Tue – Sun · 7am – 10pm</p>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-['Spectral'] text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.04]">
              The cold is coming either way.
            </h2>
            <p className="relative mx-auto mt-4 max-w-md font-['Hanken_Grotesk'] text-[16.5px] leading-[1.65]" style={{ color: C.inkSoft }}>
              Pick a session and a time — it takes about forty seconds. Towels and a quiet room are already waiting.
            </p>
            <div className="relative mt-9 flex justify-center">
              <Magnetic strength={0.4}>
                <Link to={`${base}/booking`} className="group inline-flex items-center gap-2 rounded-full px-8 py-4 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-transform duration-200" style={{ background: C.ember, color: "#fbf3e9" }}>
                  Start booking
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  )
}

function SpaceCard({ space, large = false }: { space: (typeof SPACES)[number]; large?: boolean }) {
  return (
    <div className={`group relative h-full overflow-hidden rounded-[1.3rem] border ${large ? "min-h-[420px]" : "min-h-[200px]"}`} style={{ borderColor: C.line }}>
      <img
        src={`https://picsum.photos/seed/${space.seed}/${large ? 900 : 700}/${large ? 1040 : 560}`}
        alt={space.detail}
        width={large ? 900 : 700}
        height={large ? 1040 : 560}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{ filter: "saturate(0.9)" }}
      />
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,22,17,0.05) 30%, rgba(26,22,17,0.78) 100%)" }} />
      <div className="absolute left-4 top-4"><ThermalTag temp={space.temp} onDark /></div>
      <div className="absolute inset-x-5 bottom-5">
        <h3 className={`font-['Spectral'] font-medium ${large ? "text-[1.9rem]" : "text-[1.35rem]"}`} style={{ color: C.bone }}>{space.name}</h3>
        <p className="mt-1 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(244,238,228,0.7)" }}>{space.spec}</p>
      </div>
    </div>
  )
}
