import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import {
  ArrowUpRight,
  Bus,
  Clock,
  Leaf,
  MapPin,
  Tent,
  Train,
  Waves,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

export const meta: SiteMeta = {
  title: "Halcyon — Three nights of electronic music on the Suffolk coast",
  description:
    "Multi-page site for a fictional three-night coastal electronic music festival. Near-black palette with a single acid-lime accent, Space Grotesk display type, and a cursor-reactive gradient field that pools light under the pointer.",
  date: "2026-06-22",
  type: "Event / festival",
  interaction: "Cursor-reactive gradient field",
  pages: ["Home", "Lineup", "Schedule", "Venue", "Tickets"],
}

/* ------------------------------------------------------------------ */
/* Brand tokens + data                                                 */
/* ------------------------------------------------------------------ */

const EASE = [0.21, 0.47, 0.32, 0.98] as const
const SIGNAL = "#c8f94a"

type Day = "Fri" | "Sat" | "Sun"
type Tier = "Headline" | "Main" | "Rising"

interface Act {
  name: string
  origin: string
  day: Day
  tier: Tier
  stage: string
  time: string
  blurb: string
}

const ACTS: Act[] = [
  { name: "Nadia Vey", origin: "Berlin", day: "Fri", tier: "Headline", stage: "Foreland", time: "22:30", blurb: "Hypnotic dub-techno that builds for an hour before it ever lets go." },
  { name: "Coastline Theory", origin: "Bristol", day: "Fri", tier: "Main", stage: "Foreland", time: "21:00", blurb: "Breakbeat and field-recorded tape loops from the Severn estuary." },
  { name: "Pell", origin: "Reykjavík", day: "Fri", tier: "Main", stage: "The Shingle", time: "20:00", blurb: "Glacial ambient that thaws into a four-to-the-floor pulse." },
  { name: "Junior Salt", origin: "Lagos", day: "Fri", tier: "Rising", stage: "The Shingle", time: "18:30", blurb: "Amapiano log-drums spliced with Suffolk wind." },
  { name: "Verge & Halloway", origin: "Manchester", day: "Fri", tier: "Rising", stage: "Lighthouse", time: "17:00", blurb: "A live modular duo who never play the same set twice." },
  { name: "OKADA", origin: "Tokyo", day: "Sat", tier: "Headline", stage: "Foreland", time: "23:00", blurb: "Razor-precise electro that treats the dancefloor like a circuit board." },
  { name: "Marisol Reyes", origin: "Mexico City", day: "Sat", tier: "Main", stage: "Foreland", time: "21:15", blurb: "Cumbia-digital warmth with a low end you feel in the shingle." },
  { name: "Tidewater", origin: "Glasgow", day: "Sat", tier: "Main", stage: "The Shingle", time: "20:15", blurb: "Euphoric trance, rebuilt for an open sky and a falling tide." },
  { name: "Cassette Sea", origin: "Lisbon", day: "Sat", tier: "Rising", stage: "The Shingle", time: "18:45", blurb: "Lo-fi house recorded on a four-track in a fisherman's hut." },
  { name: "Bramble", origin: "Leeds", day: "Sat", tier: "Rising", stage: "Lighthouse", time: "17:15", blurb: "Folk-tronica that swaps the guitar for a granular synth." },
  { name: "Hélène Aubry", origin: "Paris", day: "Sun", tier: "Headline", stage: "Foreland", time: "22:00", blurb: "A closing set of orchestral house — strings, sub, and sunrise." },
  { name: "Low Country", origin: "Amsterdam", day: "Sun", tier: "Main", stage: "Foreland", time: "20:30", blurb: "Slow, weightless deep house for the last night down." },
  { name: "Mira Onyx", origin: "New York", day: "Sun", tier: "Main", stage: "The Shingle", time: "19:30", blurb: "Industrial textures softened into something you can sway to." },
  { name: "Salt Marsh Choir", origin: "Aldeburgh", day: "Sun", tier: "Rising", stage: "The Shingle", time: "18:00", blurb: "A local vocal ensemble reworked through tape delay and reverb." },
  { name: "Estuary FM", origin: "London", day: "Sun", tier: "Rising", stage: "Lighthouse", time: "16:30", blurb: "The pirate-radio crew who started all of this, back where it began." },
]

const DAYS: { key: Day; date: string; label: string }[] = [
  { key: "Fri", date: "14 Aug", label: "Friday" },
  { key: "Sat", date: "15 Aug", label: "Saturday" },
  { key: "Sun", date: "16 Aug", label: "Sunday" },
]

const STAGES = ["Foreland", "The Shingle", "Lighthouse"] as const

/* ------------------------------------------------------------------ */
/* Featured interaction: cursor-reactive gradient field                */
/* ------------------------------------------------------------------ */

/**
 * A section background where a pool of light follows the pointer with a
 * lagging spring. Falls back to a fixed off-centre glow when the visitor
 * has no fine pointer or prefers reduced motion.
 */
function AuroraField({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(34)
  const my = useMotionValue(28)
  const sx = useSpring(mx, { stiffness: 50, damping: 22, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 50, damping: 22, mass: 0.8 })

  const bg = useMotionTemplate`radial-gradient(620px circle at ${sx}% ${sy}%, rgba(200,249,74,0.16), transparent 62%), radial-gradient(900px circle at 78% 8%, rgba(120,180,210,0.07), transparent 55%)`

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width) * 100)
        my.set(((e.clientY - r.top) / r.height) * 100)
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={
          reduce
            ? {
                background:
                  "radial-gradient(620px circle at 34% 28%, rgba(200,249,74,0.16), transparent 62%)",
              }
            : { background: bg }
        }
      />
      {/* fine grain so the gradient never bands */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 2px, rgba(255,255,255,0.4) 2px 3px)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function Wordmark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M2 ${10 + i * 4} Q9 ${6 + i * 4} 16 ${10 + i * 4} T30 ${10 + i * 4}`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity={0.9 - i * 0.18}
        />
      ))}
    </svg>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.22em] text-[#c8f94a]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#c8f94a]" />
      {children}
    </span>
  )
}

function TierTag({ tier }: { tier: Tier }) {
  const tone =
    tier === "Headline"
      ? "bg-[#c8f94a] text-[#0a0b0a]"
      : tier === "Main"
      ? "border border-[#c8f94a]/40 text-[#c8f94a]"
      : "border border-white/15 text-[#9a9e93]"
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-[0.14em] ${tone}`}
    >
      {tier}
    </span>
  )
}

function Counter({
  to,
  suffix = "",
}: {
  to: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.3,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]
  return (
    <div className="relative flex overflow-hidden border-y border-white/10 bg-[#0a0b0a] py-4">
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8 font-['Space_Grotesk'] text-2xl font-medium tracking-tight text-[#ecefe6] md:text-3xl"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            {t}
            <span className="text-[#c8f94a]">✳</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Layout: persistent nav + footer + page transition                  */
/* ------------------------------------------------------------------ */

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])
  return null
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const nav = [
    { to: `${base}/lineup`, label: "Lineup", end: false },
    { to: `${base}/schedule`, label: "Schedule", end: false },
    { to: `${base}/venue`, label: "Venue", end: false },
    { to: `${base}/tickets`, label: "Tickets", end: false },
  ]
  return (
    <div className="min-h-screen bg-[#0a0b0a] font-['Hanken_Grotesk'] text-[#ecefe6] antialiased selection:bg-[#c8f94a] selection:text-[#0a0b0a]">
      <ScrollReset />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0b0a]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0a0b0a]/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <NavLink to={base} end className="flex items-center gap-2.5 text-[#ecefe6]">
            <span className="text-[#c8f94a]">
              <Wordmark className="h-7 w-7" />
            </span>
            <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight">
              Halcyon
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#c8f94a]"
                      : "text-[#9a9e93] hover:text-[#ecefe6]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <Magnetic strength={0.3}>
            <Button
              asChild
              className="rounded-full bg-[#c8f94a] px-5 font-semibold text-[#0a0b0a] hover:bg-[#d6ff64]"
            >
              <NavLink to={`${base}/tickets`}>Get tickets</NavLink>
            </Button>
          </Magnetic>
        </div>

        {/* compact mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/10 px-3 py-2 md:hidden">
          {nav.map((n) => (
            <NavLink
              key={n.label}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-[#c8f94a] text-[#0a0b0a]" : "text-[#9a9e93]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-[#0a0b0a]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
          <div>
            <div className="flex items-center gap-2.5 text-[#ecefe6]">
              <Wordmark className="h-7 w-7 text-[#c8f94a]" />
              <span className="font-['Space_Grotesk'] text-2xl font-bold">Halcyon</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#9a9e93]">
              Three nights of electronic music on a shingle spit off the Suffolk
              coast. 14–16 August 2026. Capacity 4,000 — and not one more.
            </p>
          </div>
          <FooterCol
            title="Festival"
            links={[
              ["Lineup", `${base}/lineup`],
              ["Schedule", `${base}/schedule`],
              ["The site", `${base}/venue`],
            ]}
          />
          <FooterCol
            title="Plan"
            links={[
              ["Tickets", `${base}/tickets`],
              ["Getting there", `${base}/venue`],
              ["Camping", `${base}/venue`],
            ]}
          />
          <div>
            <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#9a9e93]">
              On site
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#c5c9bd]">
              Orford Ness Spit
              <br />
              Suffolk, IP12
              <br />
              <span className="text-[#9a9e93]">Gates 16:00 · Music till 02:00</span>
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-[#8a8e82] md:flex-row">
            <span>© {new Date().getFullYear()} Halcyon Festival. A fictional event.</span>
            <span className="font-['JetBrains_Mono']">Leave only footprints in the shingle.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: [string, string][]
}) {
  return (
    <div>
      <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#9a9e93]">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([label, to]) => (
          <li key={label + to}>
            <NavLink
              to={to}
              className="text-[#c5c9bd] transition-colors hover:text-[#c8f94a]"
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

function Home({ base }: { base: string }) {
  const headliners = ACTS.filter((a) => a.tier === "Headline")
  return (
    <Page>
      {/* Hero — cursor-reactive gradient field */}
      <AuroraField className="border-b border-white/10">
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
          <Eyebrow>14–16 August 2026 · Orford Ness, Suffolk</Eyebrow>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-6 max-w-4xl font-['Space_Grotesk'] text-[3.4rem] font-bold leading-[0.92] tracking-[-0.03em] md:text-[7.5rem]"
          >
            Three nights
            <br />
            on the <span className="text-[#c8f94a]">shingle.</span>
          </motion.h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#c5c9bd]">
            A small festival on a remote coastal spit — three stages, four
            thousand people, and a sound system pointed out to sea. Move your
            cursor; the light follows.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#c8f94a] px-6 font-semibold text-[#0a0b0a] hover:bg-[#d6ff64]"
              >
                <NavLink to={`${base}/tickets`}>Get a weekend pass</NavLink>
              </Button>
            </Magnetic>
            <NavLink
              to={`${base}/lineup`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ecefe6] underline-offset-4 hover:text-[#c8f94a] hover:underline"
            >
              See the full lineup <ArrowUpRight className="h-4 w-4" />
            </NavLink>
          </div>

          {/* stat strip */}
          <div className="mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {[
              { n: 3, suffix: "", label: "Nights" },
              { n: 15, suffix: "", label: "Artists" },
              { n: 3, suffix: "", label: "Stages" },
              { n: 4, suffix: "k", label: "Capacity" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-['Space_Grotesk'] text-4xl font-bold text-[#c8f94a] md:text-5xl">
                  <Counter to={s.n} suffix={s.suffix} />
                </p>
                <p className="mt-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#9a9e93]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </AuroraField>

      <Marquee
        items={[
          "Nadia Vey",
          "OKADA",
          "Hélène Aubry",
          "Marisol Reyes",
          "Tidewater",
          "Low Country",
          "Mira Onyx",
        ]}
      />

      {/* Headliners — asymmetric feature row */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>One headliner a night</Eyebrow>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight md:text-5xl">
              Who closes the spit
            </h2>
          </div>
          <NavLink
            to={`${base}/lineup`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ecefe6] underline-offset-4 hover:text-[#c8f94a] hover:underline"
          >
            All 15 acts <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </div>

        <div className="mt-10 space-y-4">
          {headliners.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.08}>
              <NavLink
                to={`${base}/lineup`}
                className="group grid grid-cols-[auto_1fr] items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[#c8f94a]/40 hover:bg-white/[0.04] md:grid-cols-[140px_1fr_auto] md:gap-8 md:p-7"
              >
                <span className="font-['JetBrains_Mono'] text-sm text-[#c8f94a] md:text-base">
                  {DAYS.find((d) => d.key === a.day)?.label}
                </span>
                <span className="min-w-0">
                  <span className="block font-['Space_Grotesk'] text-2xl font-bold leading-none tracking-tight transition-colors group-hover:text-[#c8f94a] md:text-4xl">
                    {a.name}
                  </span>
                  <span className="mt-2 block text-sm text-[#9a9e93]">
                    {a.origin} · {a.blurb}
                  </span>
                </span>
                <span className="hidden items-center gap-4 md:flex">
                  <span className="font-['JetBrains_Mono'] text-sm text-[#c5c9bd]">
                    {a.stage} · {a.time}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-[#9a9e93] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c8f94a]" />
                </span>
              </NavLink>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="border-y border-white/10 bg-[#121311]">
        <div className="mx-auto max-w-4xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-['Space_Grotesk'] text-2xl font-medium leading-snug tracking-tight md:text-4xl">
            &ldquo;We could fill a field three times the size. We won&apos;t. The
            spit holds four thousand, the tide comes in at 2am, and that&apos;s
            the whole point.&rdquo;
          </p>
          <p className="mt-6 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#9a9e93]">
            Esi Boateng — Founder & Programmer
          </p>
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/* Lineup — staggered grid with day filter                             */
/* ------------------------------------------------------------------ */

function Lineup() {
  const [day, setDay] = useState<Day | "All">("All")
  const shown = day === "All" ? ACTS : ACTS.filter((a) => a.day === day)

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-14 md:px-8 md:pt-20">
        <Eyebrow>The lineup</Eyebrow>
        <h1 className="mt-3 max-w-2xl font-['Space_Grotesk'] text-4xl font-bold leading-[0.96] tracking-tight md:text-6xl">
          Fifteen acts, three nights, one sky.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#c5c9bd]">
          No clashes you can&apos;t live with — we stagger the start times so you
          can catch every headliner and still wander. Filter by night below.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter by day">
          {(["All", "Fri", "Sat", "Sun"] as const).map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={day === d}
              onClick={() => setDay(d)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                day === d
                  ? "border-[#c8f94a] bg-[#c8f94a] text-[#0a0b0a]"
                  : "border-white/15 text-[#9a9e93] hover:border-white/40 hover:text-[#ecefe6]"
              }`}
            >
              {d === "All" ? "All nights" : DAYS.find((x) => x.key === d)?.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8">
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((a, i) => (
            <motion.article
              key={a.name}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: (i % 6) * 0.05 }}
              className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#c8f94a]/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <TierTag tier={a.tier} />
                <span className="font-['JetBrains_Mono'] text-xs text-[#9a9e93]">
                  {DAYS.find((d) => d.key === a.day)?.label} · {a.time}
                </span>
              </div>
              <h2 className="mt-5 font-['Space_Grotesk'] text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-[#c8f94a]">
                {a.name}
              </h2>
              <p className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#9a9e93]">
                {a.origin}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[#c5c9bd]">
                {a.blurb}
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 font-['JetBrains_Mono'] text-xs text-[#9a9e93]">
                <MapPin className="h-3.5 w-3.5 text-[#c8f94a]" />
                {a.stage} stage
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/* Schedule — timetable grid by stage                                  */
/* ------------------------------------------------------------------ */

function Schedule() {
  const [day, setDay] = useState<Day>("Fri")
  const acts = ACTS.filter((a) => a.day === day)

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
        <Eyebrow>Set times</Eyebrow>
        <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold leading-[0.96] tracking-tight md:text-6xl">
          Plan your night.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#c5c9bd]">
          Three stages, doors at 16:00, last record at 02:00. Times are
          provisional and weather-dependent — the spit makes its own rules.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Choose a day">
          {DAYS.map((d) => (
            <button
              key={d.key}
              role="tab"
              aria-selected={day === d.key}
              onClick={() => setDay(d.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                day === d.key
                  ? "border-[#c8f94a] bg-[#c8f94a] text-[#0a0b0a]"
                  : "border-white/15 text-[#9a9e93] hover:border-white/40 hover:text-[#ecefe6]"
              }`}
            >
              {d.label} <span className="opacity-60">· {d.date}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {STAGES.map((stage, si) => {
            const slots = acts
              .filter((a) => a.stage === stage)
              .sort((a, b) => a.time.localeCompare(b.time))
            return (
              <Reveal key={stage} delay={si * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Waves className="h-4 w-4 text-[#c8f94a]" />
                    <h2 className="font-['Space_Grotesk'] text-lg font-bold">{stage}</h2>
                  </div>
                  <ul className="mt-2 divide-y divide-white/10">
                    {slots.length === 0 && (
                      <li className="py-6 text-sm text-[#9a9e93]">Stage dark tonight.</li>
                    )}
                    {slots.map((a) => (
                      <li
                        key={a.name}
                        className="group flex items-baseline gap-4 py-4"
                      >
                        <span className="w-12 shrink-0 font-['JetBrains_Mono'] text-sm text-[#c8f94a]">
                          {a.time}
                        </span>
                        <div className="min-w-0">
                          <p className="font-['Space_Grotesk'] text-lg font-semibold leading-tight">
                            {a.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#9a9e93]">
                            {a.origin} · {a.tier}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/* Venue                                                               */
/* ------------------------------------------------------------------ */

function Venue() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
        <Eyebrow>The site</Eyebrow>
        <h1 className="mt-3 max-w-3xl font-['Space_Grotesk'] text-4xl font-bold leading-[0.96] tracking-tight md:text-6xl">
          A shingle spit, a lighthouse, and the North Sea for a backdrop.
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-5 text-[17px] leading-relaxed text-[#c5c9bd]">
            <p>
              Halcyon takes over Orford Ness — a ten-mile shingle spit that was a
              secret weapons-testing site for most of the twentieth century and is
              now one of the quietest places on the English coast.
            </p>
            <p>
              You reach it by a five-minute ferry across the river Ore, then walk
              the last stretch under a decommissioned lighthouse. The three stages
              are tucked between old pagoda labs and the sea wall, so the sound
              never carries inland and the stars stay sharp.
            </p>
            <p>
              It&apos;s a nature reserve the rest of the year, so we cap numbers at
              four thousand, run on solar and battery, and carry every cable out
              the way it came in.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://picsum.photos/seed/halcyon-shingle-spit/440/560"
              alt="Shingle beach stretching toward a distant lighthouse at dusk"
              width={440}
              height={560}
              loading="lazy"
              className="mt-8 aspect-[4/5] w-full rounded-2xl border border-white/10 object-cover brightness-90 contrast-105 saturate-[0.8]"
            />
            <img
              src="https://picsum.photos/seed/halcyon-lighthouse-night/440/560"
              alt="A lighthouse silhouetted against a deep blue evening sky"
              width={440}
              height={560}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-2xl border border-white/10 object-cover brightness-90 contrast-105 saturate-[0.8]"
            />
          </div>
        </div>
      </section>

      {/* Getting there */}
      <section className="border-y border-white/10 bg-[#121311]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight md:text-4xl">
            Getting to the spit
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Train,
                t: "By train",
                d: "Saxmundham is the nearest station, 50 minutes from Ipswich. Festival shuttle buses meet every train from Friday noon.",
              },
              {
                icon: Bus,
                t: "By shuttle",
                d: "Park-and-ride from Woodbridge runs every 20 minutes. The ferry crossing is included in your ticket — no cars on the Ness.",
              },
              {
                icon: Tent,
                t: "Camping",
                d: "A quiet meadow camp sits on the mainland side, a ten-minute ferry from the stages. Bell tents and pitch-your-own both available.",
              },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8f94a]/30 bg-[#c8f94a]/10">
                    <s.icon className="h-5 w-5 text-[#c8f94a]" />
                  </div>
                  <h3 className="mt-4 font-['Space_Grotesk'] text-xl font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#c5c9bd]">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hand-built map + facts */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f0c]">
            <svg viewBox="0 0 480 280" className="h-64 w-full md:h-80" aria-hidden>
              <rect width="480" height="280" fill="#0d0f0c" />
              {/* sea */}
              <path d="M300 0 L480 0 L480 280 L360 280 Q330 160 300 0 Z" fill="#10201f" />
              {/* river */}
              <path d="M120 0 Q150 140 110 280" stroke="#15242a" strokeWidth="22" fill="none" />
              {/* spit */}
              <path
                d="M150 30 Q230 120 300 130 Q250 170 260 250"
                stroke="#2a2d22"
                strokeWidth="26"
                fill="none"
                strokeLinecap="round"
              />
              {/* stages */}
              {[
                [210, 110, "Foreland"],
                [262, 150, "Shingle"],
                [250, 215, "Lighthouse"],
              ].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <circle cx={x as number} cy={y as number} r="6" fill={SIGNAL} />
                  <circle
                    cx={x as number}
                    cy={y as number}
                    r="13"
                    fill="none"
                    stroke={SIGNAL}
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                </g>
              ))}
              {/* ferry */}
              <line x1="118" y1="150" x2="160" y2="150" stroke="#c8f94a" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            </svg>
            <div className="flex flex-wrap gap-4 border-t border-white/10 px-5 py-4 font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#9a9e93]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#c8f94a]" /> Stages
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 border-t-2 border-dashed border-[#c8f94a]/70" /> Ferry
              </span>
              <span>North Sea to the east</span>
            </div>
          </div>

          <div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight md:text-3xl">
              Good to know
            </h2>
            <dl className="mt-6 space-y-4">
              {[
                [Clock, "Gates", "16:00 daily, last ferry back at 02:30"],
                [Waves, "Tides", "High water around 02:00 — the lower path floods, follow the marshals"],
                [Leaf, "Leave no trace", "Solar-powered, cashless, and strictly pack-in pack-out"],
                [MapPin, "Access", "Step-free routes and a viewing platform at every stage"],
              ].map(([Icon, term, desc]) => {
                const I = Icon as typeof Clock
                return (
                  <div key={term as string} className="flex gap-4 border-t border-white/10 pt-4">
                    <I className="mt-0.5 h-5 w-5 shrink-0 text-[#c8f94a]" />
                    <div>
                      <dt className="font-semibold">{term as string}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-[#9a9e93]">
                        {desc as string}
                      </dd>
                    </div>
                  </div>
                )
              })}
            </dl>
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/* Tickets                                                             */
/* ------------------------------------------------------------------ */

function Tickets({ base }: { base: string }) {
  const [sent, setSent] = useState(false)
  const tiers = [
    {
      name: "Day ticket",
      price: 68,
      unit: "/ night",
      blurb: "One night on the spit, including the ferry crossing both ways.",
      features: ["Single-night entry", "Return ferry included", "Access to all three stages"],
      featured: false,
    },
    {
      name: "Weekend pass",
      price: 165,
      unit: "/ 3 nights",
      blurb: "All three nights, the better-value way in. Most people choose this.",
      features: ["Fri–Sun entry", "Return ferry each day", "Re-entry to the camp", "Commemorative shingle token"],
      featured: true,
    },
    {
      name: "Weekend + camp",
      price: 235,
      unit: "/ 3 nights",
      blurb: "Three nights plus a pitch in the mainland meadow camp.",
      features: ["Everything in Weekend", "Pitch-your-own camping", "Hot showers & morning coffee", "Late-ferry priority"],
      featured: false,
    },
  ]

  return (
    <Page>
      <AuroraField className="border-b border-white/10">
        <section className="mx-auto max-w-6xl px-5 pb-12 pt-14 md:px-8 md:pb-16 md:pt-20">
          <Eyebrow>Tickets</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-['Space_Grotesk'] text-4xl font-bold leading-[0.96] tracking-tight md:text-6xl">
            Four thousand pass through. Be one of them.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#c5c9bd]">
            Pricing is flat — no dynamic tiers, no booking fees hidden at the
            checkout. When they&apos;re gone, they&apos;re gone, and the spit
            won&apos;t hold more.
          </p>
        </section>
      </AuroraField>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid items-stretch gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1 ${
                  t.featured
                    ? "border-[#c8f94a] bg-[#c8f94a] text-[#0a0b0a] shadow-xl shadow-[#c8f94a]/10 md:-mt-4 md:mb-4"
                    : "border-white/12 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-['Space_Grotesk'] text-xl font-bold">{t.name}</h2>
                  {t.featured && (
                    <span className="rounded-full bg-[#0a0b0a] px-2.5 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.14em] text-[#c8f94a]">
                      Best value
                    </span>
                  )}
                </div>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-['Space_Grotesk'] text-5xl font-bold">£{t.price}</span>
                  <span className={t.featured ? "text-[#0a0b0a]/70" : "text-[#9a9e93]"}>
                    {t.unit}
                  </span>
                </p>
                <p
                  className={`mt-4 text-sm leading-relaxed ${
                    t.featured ? "text-[#0a0b0a]/80" : "text-[#c5c9bd]"
                  }`}
                >
                  {t.blurb}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          t.featured ? "bg-[#0a0b0a]" : "bg-[#c8f94a]"
                        }`}
                      />
                      <span className={t.featured ? "text-[#0a0b0a]" : "text-[#c5c9bd]"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 pt-1">
                  <Button
                    className={`w-full rounded-full font-semibold ${
                      t.featured
                        ? "bg-[#0a0b0a] text-[#c8f94a] hover:bg-[#1a1c19]"
                        : "bg-[#c8f94a] text-[#0a0b0a] hover:bg-[#d6ff64]"
                    }`}
                  >
                    Choose {t.name}
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Waitlist / register */}
      <section className="border-t border-white/10 bg-[#121311]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_0.9fr] md:px-8 md:py-20">
          <div>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight md:text-4xl">
              Not ready yet? Join the tide list.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-[#c5c9bd]">
              We release a final fifty passes the week before, once we know the
              forecast. The tide list gets first refusal — no spam, one email when
              they drop.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {[
                ["£0", "Booking fees"],
                ["48h", "Refund window"],
                ["18+", "Over-18s only"],
                ["100%", "Solar powered"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-['Space_Grotesk'] text-3xl font-bold text-[#c8f94a]">{n}</dt>
                  <dd className="mt-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#9a9e93]">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-9">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <label className="block">
                <span className="text-sm font-medium">Name</span>
                <Input
                  required
                  placeholder="Robin Marsh"
                  className="mt-1.5 border-white/15 bg-[#0a0b0a] text-[#ecefe6] placeholder:text-[#8a8e82] focus-visible:ring-[#c8f94a]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <Input
                  required
                  type="email"
                  placeholder="you@email.com"
                  className="mt-1.5 border-white/15 bg-[#0a0b0a] text-[#ecefe6] placeholder:text-[#8a8e82] focus-visible:ring-[#c8f94a]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Which night are you after?</span>
                <select
                  className="mt-1.5 w-full rounded-md border border-white/15 bg-[#0a0b0a] px-3 py-2 text-sm text-[#ecefe6] outline-none transition focus-visible:ring-2 focus-visible:ring-[#c8f94a]"
                  defaultValue="weekend"
                >
                  <option value="weekend">The whole weekend</option>
                  <option value="fri">Friday</option>
                  <option value="sat">Saturday</option>
                  <option value="sun">Sunday</option>
                </select>
              </label>
              <Magnetic strength={0.25}>
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full bg-[#c8f94a] px-6 font-semibold text-[#0a0b0a] hover:bg-[#d6ff64]"
                >
                  {sent ? "You're on the list" : "Join the tide list"}
                </Button>
              </Magnetic>
              {sent && (
                <p className="text-sm text-[#c8f94a]" role="status">
                  Done — we&apos;ll email you the moment the final passes drop.
                </p>
              )}
            </form>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#8a8e82]">
              Halcyon is a fictional festival built for a design exercise. No
              tickets are really for sale, and{" "}
              <NavLink to={`${base}/venue`} className="underline hover:text-[#c8f94a]">
                the spit
              </NavLink>{" "}
              would rather you didn&apos;t turn up.
            </p>
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/* Site shell with nested routes                                       */
/* ------------------------------------------------------------------ */

export default function Halcyon() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <Layout base={base}>
      <Routes>
        <Route index element={<Home base={base} />} />
        <Route path="lineup" element={<Lineup />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="venue" element={<Venue />} />
        <Route path="tickets" element={<Tickets base={base} />} />
        <Route path="*" element={<Home base={base} />} />
      </Routes>
    </Layout>
  )
}
