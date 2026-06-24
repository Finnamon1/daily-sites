import { useEffect, useRef, useState, type ReactNode } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion"
import { Compass, Wind, Waves, Mountain, Check, Minus, Plus } from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { TiltCard } from "@/components/fx/TiltCard"
import { Reveal } from "@/components/fx/Reveal"
import {
  C,
  DISPLAY,
  SERIF,
  SANS,
  MONO,
  Layout,
  Eyebrow,
  ArrowLink,
  Counter,
  Duotone,
  Grade,
  useBase,
  wrap,
} from "./shared"
import { EXPEDITIONS, ISLANDS, CHAPTERS, STATS } from "./data"

/* =========================================================================
   FEATURED INTERACTION — scroll-snap chaptered storytelling
   The home page opens with a sequence of full-viewport "chapters". A gentle
   y-proximity scroll-snap (added to the document while Home is mounted) lets
   each chapter settle into place, and every chapter's photographic layer
   drifts in parallax as it passes through the viewport. A fixed rail tracks
   the active chapter. Touch keeps native snapping; reduced-motion users get
   no snap and no parallax — just well-set static panels.
   ========================================================================= */

function Chapter({
  index,
  onActive,
}: {
  index: number
  onActive: (i: number) => void
}) {
  const ch = CHAPTERS[index]
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-14%", "14%"])
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? ["0%", "0%", "0%"] : ["6%", "0%", "-6%"])
  const inView = useInView(ref, { amount: 0.55 })
  const right = index % 2 === 1

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ scrollSnapAlign: "start", background: C.ink }}
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-[1.18]">
        <Duotone
          seed={ch.seed}
          alt={`${ch.kicker} — ${ch.title}`}
          w={1600}
          h={1200}
          hue={ch.hue}
          rounded="rounded-none"
          className="h-full w-full"
          priority={index === 0}
        />
      </motion.div>
      {/* darken for legibility — gradient follows the text side */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `linear-gradient(${right ? 255 : 105}deg, rgba(20,24,26,0.8), rgba(20,24,26,0.2))` }}
      />

      <motion.div style={{ y: textY }} className={`relative w-full ${wrap}`}>
        <div className={`max-w-xl ${right ? "ml-auto text-right" : ""}`}>
          <Eyebrow dark className={right ? "justify-end" : ""}>
            Chapter {ch.no} — {ch.kicker}
          </Eyebrow>
          <h2
            style={{ fontFamily: DISPLAY, color: C.bone }}
            className="mt-5 text-balance text-4xl font-medium leading-[1.04] sm:text-6xl"
          >
            {ch.title}
          </h2>
          <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-5 max-w-md text-lg leading-relaxed">
            {ch.body}
          </p>
        </div>
      </motion.div>
    </section>
  )
}

function ChapterRail({ active }: { active: number }) {
  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex">
      {CHAPTERS.map((c, i) => (
        <div key={c.no} className="flex items-center gap-2">
          <span
            className="text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300"
            style={{ fontFamily: MONO, color: C.bone, opacity: active === i ? 0.9 : 0 }}
          >
            {c.kicker}
          </span>
          <span
            className="h-6 w-px origin-bottom transition-all duration-300"
            style={{ background: active === i ? C.accentLt : "rgba(236,231,220,0.4)", transform: `scaleY(${active === i ? 1 : 0.5})` }}
          />
        </div>
      ))}
    </div>
  )
}

/* --------------------------------- HERO --------------------------------- */
function Hero() {
  const base = useBase()
  return (
    <section
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      style={{ scrollSnapAlign: "start", background: C.ink }}
    >
      <div className="absolute inset-0 scale-[1.05]">
        <Duotone seed="faroe-hero-fjord-cliff" alt="A walker on a ridge above a Faroese fjord in low cloud" w={1800} h={1400} hue={206} rounded="rounded-none" className="h-full w-full" priority />
      </div>
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,24,26,0.92), rgba(20,24,26,0.15) 60%, rgba(20,24,26,0.4))" }} />

      <div className={`relative w-full pb-16 pt-28 ${wrap}`}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Eyebrow dark>Walking expeditions · since 2018</Eyebrow>
            <h1 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-5 text-balance text-5xl font-medium leading-[0.98] sm:text-7xl md:text-[5.5rem]">
              Eighteen islands.
              <br />
              <span className="italic" style={{ color: C.accentLt }}>Eighteen weathers.</span>
            </h1>
            <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-6 max-w-lg text-lg leading-relaxed">
              Walk the Faroes with people who grew up reading this coast — small parties, turf-roofed huts, and routes
              that bend to the sky rather than the schedule.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Magnetic>
                <Link
                  to={`${base}/expeditions`}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors"
                  style={{ background: C.accent, color: C.bone, fontFamily: SANS }}
                >
                  <Compass className="h-4 w-4" /> See the expeditions
                </Link>
              </Magnetic>
              <ArrowLink to={`${base}/islands`} dark>
                Read the island guide
              </ArrowLink>
            </div>
          </div>

          <div className="hidden gap-6 sm:flex" style={{ fontFamily: MONO, color: C.muteHi }}>
            {[
              { k: "62.0°N", v: "latitude" },
              { k: "6.8°W", v: "longitude" },
            ].map((d) => (
              <div key={d.v} className="text-right">
                <div className="text-2xl" style={{ color: C.bone }}>{d.k}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.22em]">{d.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: C.muteHi }}>
          <motion.span
            aria-hidden
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          Scroll — the weather decides
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- HOME --------------------------------- */
function Home() {
  const base = useBase()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  // Enable gentle scroll-snap for the chapter sequence while Home is mounted.
  useEffect(() => {
    if (reduce) return
    const el = document.documentElement
    const prev = el.style.scrollSnapType
    el.style.scrollSnapType = "y proximity"
    return () => {
      el.style.scrollSnapType = prev
    }
  }, [reduce])

  return (
    <main>
      <Hero />
      <ChapterRail active={active} />
      {CHAPTERS.map((_, i) => (
        <Chapter key={i} index={i} onActive={setActive} />
      ))}

      {/* stats band */}
      <section style={{ background: C.ink2 }} className="border-y" >
        <div className={`grid grid-cols-2 gap-px md:grid-cols-4 ${wrap}`} style={{ borderColor: C.lineDk }}>
          {STATS.map((s) => (
            <div key={s.label} className="py-12 pr-4">
              <Counter
                to={s.value}
                suffix={s.suffix}
                className="block text-5xl font-medium sm:text-6xl"
                style={{ fontFamily: DISPLAY, color: C.bone }}
              />
              <div className="mt-2 text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.muteHi }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* featured expeditions teaser */}
      <section className={`${wrap} py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>This season's walks</Eyebrow>
            <h2 style={{ fontFamily: DISPLAY }} className="mt-4 text-4xl font-medium sm:text-5xl">
              Four routes, chosen for the light.
            </h2>
          </div>
          <ArrowLink to={`${base}/expeditions`}>All expeditions</ArrowLink>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          {EXPEDITIONS.slice(0, 3).map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08} className={i === 0 ? "md:col-span-6 md:row-span-2" : "md:col-span-6"}>
              <Link to={`${base}/expeditions`} className="group block h-full">
                <TiltCard max={i === 0 ? 7 : 5} className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-xl border" style={{ borderColor: C.line, background: C.bone2 }}>
                    <Duotone
                      seed={e.seed}
                      alt={`${e.name} — ${e.region}`}
                      w={900}
                      h={i === 0 ? 760 : 460}
                      hue={e.hue}
                      rounded="rounded-none"
                      className={i === 0 ? "aspect-[5/4]" : "aspect-[16/9]"}
                    >
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] backdrop-blur" style={{ fontFamily: MONO, background: "rgba(20,24,26,0.55)", color: C.bone }}>
                          {e.days} days
                        </span>
                      </div>
                    </Duotone>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                        {e.region}
                      </div>
                      <h3 style={{ fontFamily: DISPLAY }} className="mt-2 text-2xl font-medium sm:text-3xl">
                        {e.name}
                      </h3>
                      {i === 0 && (
                        <p style={{ fontFamily: SERIF, color: C.mute }} className="mt-3 text-[15px] leading-relaxed">
                          {e.blurb}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <Grade level={e.grade} />
                        <span style={{ fontFamily: SANS, color: C.ink }} className="text-sm font-medium">
                          from £{e.fromGBP.toLocaleString("en-GB")}
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingCTA />
    </main>
  )
}

function ClosingCTA() {
  const base = useBase()
  return (
    <section style={{ background: C.ink }} className="relative overflow-hidden">
      <div className={`relative ${wrap} py-24 text-center`}>
        <Eyebrow dark className="justify-center">
          Places are limited
        </Eyebrow>
        <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-medium leading-tight sm:text-6xl">
          The next fair window opens in <span className="italic" style={{ color: C.accentLt }}>May</span>.
        </h2>
        <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mx-auto mt-5 max-w-md text-lg leading-relaxed">
          Each departure carries eight walkers and books out months ahead. Tell us when you can travel and we'll hold a place.
        </p>
        <div className="mt-9 flex justify-center">
          <Magnetic strength={0.5}>
            <Link
              to={`${base}/book`}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-medium uppercase tracking-[0.16em]"
              style={{ background: C.accent, color: C.bone, fontFamily: SANS }}
            >
              Request a place <Wind className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ EXPEDITIONS ------------------------------ */
function Expeditions() {
  const base = useBase()
  return (
    <main>
      <PageHead
        eyebrow="The 2026 programme"
        title="Expeditions"
        lede="Four guided walks, each timed to a particular kind of weather and light. Grades run from Moderate to full Expedition; every route can flex around the forecast."
      />

      <div className={`${wrap} space-y-6 pb-24`}>
        {EXPEDITIONS.map((e, i) => (
          <Reveal key={e.id} delay={(i % 2) * 0.06}>
            <article
              className={`grid items-stretch gap-0 overflow-hidden rounded-2xl border md:grid-cols-2 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
              style={{ borderColor: C.line, background: C.bone2 }}
            >
              <Duotone seed={e.seed} alt={`${e.name}, ${e.region}`} w={900} h={680} hue={e.hue} rounded="rounded-none" className="aspect-[4/3] md:aspect-auto md:[direction:ltr]">
                <div className="absolute bottom-4 left-4 flex gap-2" style={{ direction: "ltr" }}>
                  <Tag>{e.season}</Tag>
                  <Tag>↑ {e.ascentM.toLocaleString("en-GB")} m</Tag>
                </div>
              </Duotone>

              <div className="flex flex-col p-7 sm:p-9 md:[direction:ltr]">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                    {e.region}
                  </div>
                  <Grade level={e.grade} />
                </div>
                <h2 style={{ fontFamily: DISPLAY }} className="mt-3 text-3xl font-medium sm:text-4xl">
                  {e.name}
                </h2>
                <p style={{ fontFamily: SERIF, color: C.mute }} className="mt-3 text-[15px] leading-relaxed">
                  {e.blurb}
                </p>

                <ul className="mt-5 space-y-2">
                  {e.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[14px]" style={{ fontFamily: SANS, color: C.ink }}>
                      <span className="mt-[7px] inline-block h-[6px] w-[6px] shrink-0 rotate-45" style={{ background: C.accent }} />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-4 pt-7">
                  <div>
                    <div className="text-2xl font-medium" style={{ fontFamily: DISPLAY }}>
                      from £{e.fromGBP.toLocaleString("en-GB")}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.mute }}>
                      {e.days} days · max {e.party}
                    </div>
                  </div>
                  <Magnetic>
                    <Link
                      to={`${base}/book`}
                      className="rounded-full px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors"
                      style={{ background: C.ink, color: C.bone, fontFamily: SANS }}
                    >
                      Reserve
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] backdrop-blur" style={{ fontFamily: MONO, background: "rgba(20,24,26,0.55)", color: C.bone }}>
      {children}
    </span>
  )
}

/* -------------------------------- ISLANDS -------------------------------- */
function Islands() {
  return (
    <main>
      <PageHead
        eyebrow="A field guide"
        title="The Islands"
        lede="Eighteen islands, six of which we walk most. A quick reckoning of the country you'll cross — population, summit, and what each one is known for."
      />

      <div className={`${wrap} grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3`} style={{ borderColor: C.line, background: C.line }}>
        {ISLANDS.map((isl, i) => (
          <Reveal key={isl.name} delay={(i % 3) * 0.06}>
            <div className="group flex h-full flex-col p-7" style={{ background: C.bone }}>
              <div className="flex items-start justify-between">
                <h2 style={{ fontFamily: DISPLAY }} className="text-3xl font-medium">
                  {isl.name}
                </h2>
                <Duotone seed={isl.seed} alt={`Coastline of ${isl.name}`} w={140} h={140} hue={isl.hue} rounded="rounded-full" className="h-12 w-12 shrink-0 ring-1 ring-[var(--r)] transition-transform duration-500 group-hover:scale-110" />
              </div>

              <p style={{ fontFamily: SERIF, color: C.mute }} className="mt-3 flex-1 text-[14px] leading-relaxed">
                {isl.note}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2 border-t pt-4" style={{ borderColor: C.line }}>
                <Fact value={isl.highM} suffix=" m" label="highest" />
                <Fact value={isl.areaKm} suffix=" km²" label="area" />
                <Fact value={isl.pop} label="people" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* totals strip */}
      <div className={`${wrap} mt-6 mb-24`}>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl px-8 py-10" style={{ background: C.ink, color: C.bone }}>
          <div style={{ fontFamily: DISPLAY }} className="text-2xl">
            Across all eighteen
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <BigFact to={1399} suffix=" km²" label="of land" />
            <BigFact to={54000} label="residents" />
            <BigFact to={1117} suffix=" km" label="of coastline" />
          </div>
        </div>
      </div>
    </main>
  )
}

function Fact({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <Counter to={value} suffix={suffix} className="block text-lg font-medium" style={{ fontFamily: MONO, color: C.ink }} />
      <div className="text-[10px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.mute }}>
        {label}
      </div>
    </div>
  )
}

function BigFact({ to, suffix, label }: { to: number; suffix?: string; label: string }) {
  return (
    <div>
      <Counter to={to} suffix={suffix} className="block text-4xl font-medium" style={{ fontFamily: DISPLAY, color: C.bone }} />
      <div className="mt-1 text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.muteHi }}>
        {label}
      </div>
    </div>
  )
}

/* -------------------------------- BOOKING -------------------------------- */
function Book() {
  const [expId, setExpId] = useState(EXPEDITIONS[0].id)
  const [party, setParty] = useState(2)
  const [month, setMonth] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const exp = EXPEDITIONS.find((e) => e.id === expId)!
  const months = exp.season.split(" – ")
  const monthOptions = monthRange(months[0], months[1])
  const total = exp.fromGBP * party

  // keep selected month valid when expedition changes
  useEffect(() => {
    setMonth("")
  }, [expId])

  const valid = name.trim() && /\S+@\S+\.\S+/.test(email) && month

  if (sent) {
    return (
      <main className={`${wrap} flex min-h-[70vh] flex-col items-center justify-center py-24 text-center`}>
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: C.accent }}>
          <Check className="h-8 w-8" style={{ color: C.bone }} />
        </motion.div>
        <h1 style={{ fontFamily: DISPLAY }} className="mt-7 text-4xl font-medium sm:text-5xl">
          We're holding your place.
        </h1>
        <p style={{ fontFamily: SERIF, color: C.mute }} className="mt-4 max-w-md text-lg leading-relaxed">
          Thank you, {name.split(" ")[0]}. A guide will email {email} within two days to confirm <span style={{ color: C.ink }}>{exp.name}</span> for {month}, party of {party}.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-8 rounded-full border px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em]"
          style={{ borderColor: C.ink, color: C.ink, fontFamily: SANS }}
        >
          Make another request
        </button>
      </main>
    )
  }

  return (
    <main>
      <PageHead
        eyebrow="Request a place"
        title="Book a walk"
        lede="No payment now. Tell us the route and your window; a guide confirms availability, fitness and kit by email within two days."
      />

      <div className={`${wrap} grid gap-10 pb-24 lg:grid-cols-[1.5fr_1fr]`}>
        {/* form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) setSent(true)
          }}
          className="space-y-9"
        >
          <Field step="01" label="Choose an expedition">
            <div className="grid gap-3 sm:grid-cols-2">
              {EXPEDITIONS.map((e) => {
                const on = e.id === expId
                return (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => setExpId(e.id)}
                    className="rounded-xl border p-4 text-left transition-all duration-200"
                    style={{
                      borderColor: on ? C.accent : C.line,
                      background: on ? "rgba(215,85,43,0.06)" : C.bone,
                      boxShadow: on ? `inset 0 0 0 1px ${C.accent}` : "none",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: SANS }} className="text-[15px] font-medium">
                        {e.name}
                      </span>
                      {on && <Check className="h-4 w-4" style={{ color: C.accentInk }} />}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.mute }}>
                      {e.days} days · {e.grade} · from £{e.fromGBP.toLocaleString("en-GB")}
                    </div>
                  </button>
                )
              })}
            </div>
          </Field>

          <Field step="02" label="When can you travel?">
            <div className="flex flex-wrap gap-2.5">
              {monthOptions.map((m) => {
                const on = m === month
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMonth(m)}
                    className="rounded-full border px-4 py-2 text-[13px] transition-colors"
                    style={{ borderColor: on ? C.accent : C.line, background: on ? C.accent : "transparent", color: on ? C.bone : C.ink, fontFamily: SANS }}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-[12px]" style={{ fontFamily: MONO, color: C.mute }}>
              {exp.name} runs {exp.season}.
            </p>
          </Field>

          <Field step="03" label="Party size">
            <div className="flex items-center gap-5">
              <Stepper value={party} setValue={setParty} max={exp.party} />
              <span className="text-[13px]" style={{ fontFamily: MONO, color: C.mute }}>
                up to {exp.party} walkers on this route
              </span>
            </div>
          </Field>

          <Field step="04" label="Your details">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="rounded-lg border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--a)]"
                style={{ borderColor: C.line, fontFamily: SANS, ["--a" as string]: C.accent }}
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="rounded-lg border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--a)]"
                style={{ borderColor: C.line, fontFamily: SANS, ["--a" as string]: C.accent }}
              />
            </div>
          </Field>

          <Magnetic strength={0.3}>
            <button
              type="submit"
              disabled={!valid}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-medium uppercase tracking-[0.16em] transition-opacity"
              style={{ background: C.accent, color: C.bone, fontFamily: SANS, opacity: valid ? 1 : 0.4, cursor: valid ? "pointer" : "not-allowed" }}
            >
              Request this place <Compass className="h-4 w-4" />
            </button>
          </Magnetic>
        </form>

        {/* live summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: C.line }}>
            <Duotone seed={exp.seed} alt={exp.name} w={700} h={420} hue={exp.hue} rounded="rounded-none" className="aspect-[7/4]">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.accentLt }}>
                  {exp.region}
                </div>
                <div style={{ fontFamily: DISPLAY, color: C.bone }} className="text-2xl font-medium">
                  {exp.name}
                </div>
              </div>
            </Duotone>
            <div className="space-y-3 p-6" style={{ background: C.bone2 }}>
              <SummaryRow k="Duration" v={`${exp.days} days`} />
              <SummaryRow k="Grade" v={exp.grade} />
              <SummaryRow k="Window" v={month || "—"} />
              <SummaryRow k="Party" v={`${party} × £${exp.fromGBP.toLocaleString("en-GB")}`} />
              <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: C.line }}>
                <span className="text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.mute }}>
                  Indicative total
                </span>
                <span style={{ fontFamily: DISPLAY, color: C.ink }} className="text-3xl font-medium">
                  £{total.toLocaleString("en-GB")}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: C.mute }}>
                Includes guiding, hut nights and inter-island transport. Excludes flights to Vágar.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px]" style={{ fontFamily: SANS, color: C.mute }}>{k}</span>
      <span className="text-[14px] font-medium" style={{ fontFamily: SANS, color: C.ink }}>{v}</span>
    </div>
  )
}

function Stepper({ value, setValue, max }: { value: number; setValue: (n: number) => void; max: number }) {
  return (
    <div className="flex items-center gap-4 rounded-full border px-2 py-1.5" style={{ borderColor: C.line }}>
      <StepBtn disabled={value <= 1} onClick={() => setValue(Math.max(1, value - 1))} aria="Decrease party size">
        <Minus className="h-4 w-4" />
      </StepBtn>
      <span className="w-6 text-center text-xl font-medium" style={{ fontFamily: DISPLAY, color: C.ink }}>
        {value}
      </span>
      <StepBtn disabled={value >= max} onClick={() => setValue(Math.min(max, value + 1))} aria="Increase party size">
        <Plus className="h-4 w-4" />
      </StepBtn>
    </div>
  )
}

function StepBtn({ children, onClick, disabled, aria }: { children: ReactNode; onClick: () => void; disabled?: boolean; aria: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30"
      style={{ background: C.ink, color: C.bone }}
    >
      {children}
    </button>
  )
}

/* ------------------------------ shared bits ------------------------------ */
function PageHead({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <section className={`${wrap} pb-12 pt-20`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY }} className="mt-4 text-5xl font-medium leading-[1.02] sm:text-7xl">
        {title}
      </h1>
      <p style={{ fontFamily: SERIF, color: C.mute }} className="mt-5 max-w-xl text-lg leading-relaxed">
        {lede}
      </p>
      <div className="mt-10 flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: C.line }} />
        <Mountain className="h-4 w-4" style={{ color: C.accentInk }} />
        <Waves className="h-4 w-4" style={{ color: C.accentInk }} />
        <span className="h-px flex-1" style={{ background: C.line }} />
      </div>
    </section>
  )
}

function Field({ step, label, children }: { step: string; label: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-baseline gap-3">
        <span className="text-[12px]" style={{ fontFamily: MONO, color: C.accentInk }}>{step}</span>
        <span style={{ fontFamily: DISPLAY }} className="text-2xl font-medium">{label}</span>
      </legend>
      {children}
    </fieldset>
  )
}

/* page transition wrapper */
function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

/* helper: month range from a "May – September" season string */
function monthRange(start: string, end: string): string[] {
  const all = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const a = all.indexOf(start)
  const b = all.indexOf(end)
  if (a < 0 || b < 0) return all
  return all.slice(a, b + 1)
}

/* --------------------------------- ROOT --------------------------------- */
export default function Varda() {
  const { pathname } = useLocation()
  // scroll to top on route change so each page starts at its head
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Layout>
      <PageShell>
        <Routes>
          <Route index element={<Home />} />
          <Route path="expeditions" element={<Expeditions />} />
          <Route path="islands" element={<Islands />} />
          <Route path="book" element={<Book />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </PageShell>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "Varða — Faroe Islands walking expeditions",
  description:
    "A small-group walking-expedition company for the Faroe Islands: weather-led, guided by locals, max eight walkers. Featured interaction: a scroll-snap chaptered home page where full-screen photographic panels settle into place and drift in parallax — plus animated counters, magnetic CTAs, 3D-tilt cards and a live booking summary.",
  date: "2026-06-24",
  type: "Travel guide / tour operator",
  interaction: "Scroll-snap chaptered panels with parallax + magnetic CTAs + animated counters + 3D tilt cards",
  pages: ["Home", "Expeditions", "The Islands", "Book"],
}
