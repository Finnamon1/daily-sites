import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Gauge,
  MapPin,
  Menu,
  Minus,
  Music2,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Tempo — an indoor cycling & strength studio in Fulton Market, Chicago",
  description:
    "Tempo runs 45-minute, beat-matched rides and barbell intervals out of a single warehouse room on Lake Street. Featured interaction: an infinite kinetic marquee that speeds, skews and reverses with your scroll velocity, plus magnetic CTAs, animated counters and hover-to-color instructor portraits.",
  date: "2026-06-23",
  type: "Fitness studio",
  interaction:
    "Scroll-velocity reactive infinite marquee (speeds, skews & reverses with scroll) + magnetic CTAs + animated counters",
  pages: ["Home", "Classes", "Schedule", "Membership", "Studio"],
}

/* --------------------------------------------------------------- palette */
// ground #0b0b0d · panel #141417 · cream #f4efe4 · ink #15140f
// ONE confident accent: FLARE #ff4d2e — used for large display, blocks, icons
// and as body text only on the dark grounds (≈5.5:1 on #0b0b0d). On cream it
// stays display-only; small copy on cream uses ink.
const FLARE = "#ff4d2e"
const CREAM = "#f4efe4"

const NAV = [
  { label: "Home", to: "", end: true },
  { label: "Classes", to: "classes" },
  { label: "Schedule", to: "schedule" },
  { label: "Membership", to: "membership" },
  { label: "Studio", to: "studio" },
]

/* ----------------------------------------------------------------- data */

type Format = {
  code: string
  name: string
  tag: string
  duration: string
  intensity: number // 1–5
  blurb: string
  detail: string[]
}

const FORMATS: Format[] = [
  {
    code: "T45",
    name: "Tempo 45",
    tag: "Signature ride",
    duration: "45 min",
    intensity: 4,
    blurb:
      "The room you came for. Forty-five minutes on the beat — sprints, climbs and a third act that earns the cool-down.",
    detail: [
      "Beat-matched to a live-mixed set, never a playlist on shuffle",
      "Three climbs, two sprint blocks, one ugly-beautiful finish",
      "Watts and cadence on the leaderboard if you want them, hidden if you don't",
    ],
  },
  {
    code: "CLB",
    name: "Climb",
    tag: "Endurance",
    duration: "50 min",
    intensity: 5,
    blurb:
      "Heavy gears, long road, no flat. We add resistance and stay there. Your legs file a complaint; you ignore it.",
    detail: [
      "Lower cadence, higher resistance — strength on the bike",
      "Two sustained climbs over eight minutes each",
      "Built for the rider who wants the hill, not the sprint",
    ],
  },
  {
    code: "PWR",
    name: "Power Hour",
    tag: "Bike + barbell",
    duration: "60 min",
    intensity: 5,
    blurb:
      "Thirty on the bike, thirty on the floor. Intervals, then a barbell. You leave taller and a little annoyed.",
    detail: [
      "Alternating bike intervals and weighted strength supersets",
      "Loaded carries, hinges and presses — coached, never freestyled",
      "Bring grip; we'll bring the chalk",
    ],
  },
  {
    code: "RST",
    name: "Reset",
    tag: "Low impact",
    duration: "40 min",
    intensity: 2,
    blurb:
      "An easy spin, mobility and breath. The class you book the morning after Power Hour, and the one your knees thank you for.",
    detail: [
      "Steady-state ride with no leaderboard, no sprints",
      "Guided mobility and breathwork to close",
      "Welcomes injuries, comebacks and absolute beginners",
    ],
  },
]

type Instructor = {
  name: string
  role: string
  bio: string
  seed: string
  signature: string
}

const INSTRUCTORS: Instructor[] = [
  {
    name: "Mara Okafor",
    role: "Head coach · Tempo 45",
    bio: "Former track cyclist who learned to count music before she could count laps. Mara's rides build like a record — verse, chorus, the bridge that breaks you.",
    seed: "tempo-coach-mara-portrait",
    signature: "Counts you in, never lets you coast.",
  },
  {
    name: "Devin Pratt",
    role: "Strength lead · Power Hour",
    bio: "Spent ten years as a physio before he got tired of fixing what bad coaching broke. Devin's the reason your hinge is honest and your shoulders still work.",
    seed: "tempo-coach-devin-portrait",
    signature: "Loads the bar, watches your spine.",
  },
  {
    name: "Sol Reyes",
    role: "Climb & Reset",
    bio: "DJ-turned-coach who treats a long climb like a slow song — patience first, payoff later. Sol's Reset class is the calmest forty minutes on Lake Street.",
    seed: "tempo-coach-sol-portrait",
    signature: "Finds the gear you didn't know you had.",
  },
]

type Klass = { time: string; format: string; coach: string; spots: number; cap: number }
type Day = { key: string; label: string; classes: Klass[] }

const WEEK: Day[] = [
  {
    key: "mon",
    label: "Mon",
    classes: [
      { time: "6:15a", format: "Tempo 45", coach: "Mara", spots: 3, cap: 32 },
      { time: "12:00p", format: "Reset", coach: "Sol", spots: 14, cap: 24 },
      { time: "5:30p", format: "Climb", coach: "Sol", spots: 0, cap: 32 },
      { time: "6:45p", format: "Tempo 45", coach: "Mara", spots: 6, cap: 32 },
    ],
  },
  {
    key: "tue",
    label: "Tue",
    classes: [
      { time: "6:15a", format: "Power Hour", coach: "Devin", spots: 9, cap: 20 },
      { time: "5:30p", format: "Tempo 45", coach: "Mara", spots: 1, cap: 32 },
      { time: "6:45p", format: "Power Hour", coach: "Devin", spots: 4, cap: 20 },
    ],
  },
  {
    key: "wed",
    label: "Wed",
    classes: [
      { time: "6:15a", format: "Tempo 45", coach: "Sol", spots: 11, cap: 32 },
      { time: "12:00p", format: "Tempo 45", coach: "Mara", spots: 7, cap: 32 },
      { time: "5:30p", format: "Climb", coach: "Sol", spots: 2, cap: 32 },
      { time: "6:45p", format: "Reset", coach: "Sol", spots: 18, cap: 24 },
    ],
  },
  {
    key: "thu",
    label: "Thu",
    classes: [
      { time: "6:15a", format: "Power Hour", coach: "Devin", spots: 0, cap: 20 },
      { time: "5:30p", format: "Tempo 45", coach: "Mara", spots: 5, cap: 32 },
      { time: "6:45p", format: "Tempo 45", coach: "Sol", spots: 8, cap: 32 },
    ],
  },
  {
    key: "fri",
    label: "Fri",
    classes: [
      { time: "6:15a", format: "Tempo 45", coach: "Mara", spots: 4, cap: 32 },
      { time: "12:00p", format: "Reset", coach: "Sol", spots: 16, cap: 24 },
      { time: "5:30p", format: "Power Hour", coach: "Devin", spots: 3, cap: 20 },
    ],
  },
  {
    key: "sat",
    label: "Sat",
    classes: [
      { time: "8:00a", format: "Tempo 45", coach: "Mara", spots: 6, cap: 32 },
      { time: "9:15a", format: "Climb", coach: "Sol", spots: 10, cap: 32 },
      { time: "10:30a", format: "Power Hour", coach: "Devin", spots: 7, cap: 20 },
    ],
  },
  {
    key: "sun",
    label: "Sun",
    classes: [
      { time: "9:00a", format: "Reset", coach: "Sol", spots: 12, cap: 24 },
      { time: "10:15a", format: "Tempo 45", coach: "Mara", spots: 9, cap: 32 },
    ],
  },
]

const TIERS = [
  {
    name: "First Ride",
    price: "Free",
    cadence: "one time",
    pitch: "Clip in, see the room, decide nothing.",
    features: ["Any one class, on us", "Shoes & towel included", "No card on file"],
    cta: "Claim it",
    featured: false,
  },
  {
    name: "Eight Pack",
    price: "$176",
    cadence: "8 classes",
    pitch: "Two rides a week, no monthly commitment.",
    features: ["8 credits, valid 90 days", "Book 8 days out", "Shareable with a friend", "$22 a class"],
    cta: "Buy the pack",
    featured: false,
  },
  {
    name: "Unlimited",
    price: "$229",
    cadence: "per month",
    pitch: "The whole room, every format, no math.",
    features: [
      "Unlimited classes, all formats",
      "Book 14 days out — earliest grab",
      "Free guest pass each month",
      "Pause anytime, cancel anytime",
    ],
    cta: "Go unlimited",
    featured: true,
  },
]

const FAQ = [
  {
    q: "I've never clipped into a bike. Will I survive?",
    a: "Yes, and we'll show you how. Come ten minutes early and a coach sets your bike, fits the shoes and explains the gears. Book Reset or Tempo 45 for your first ride — both welcome day-one riders.",
  },
  {
    q: "What do I actually need to bring?",
    a: "Yourself and water. Cycling shoes, a sweat towel and a place to stash your bag are all included. Showers, product and hair ties are stocked in the locker rooms.",
  },
  {
    q: "How do credits and the waitlist work?",
    a: "A class held with a credit is yours until twelve hours before. Cancel inside that window and the credit is spent, but the waitlist usually clears — most riders who waitlist a popular ride get in.",
  },
  {
    q: "Is there parking in Fulton Market?",
    a: "Street parking is scarce at peak. There's a garage on Sangamon a block south, and the Morgan stop on the Green and Pink lines is a four-minute walk to our door.",
  },
]

/* ---------------------------------------------------------- shared bits */

const DUOTONE: CSSProperties = { filter: "grayscale(100%) contrast(108%) brightness(96%)" }

function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.24em] ${className}`}
    >
      {children}
    </span>
  )
}

function Wordmark({ tone = "cream" }: { tone?: "cream" | "ink" }) {
  const c = tone === "cream" ? "text-[#f4efe4]" : "text-[#15140f]"
  return (
    <span className={`flex items-center gap-2 ${c}`}>
      <Gauge size={20} strokeWidth={2.4} style={{ color: FLARE }} />
      <span className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold tracking-[-0.04em]">
        TEMPO
      </span>
    </span>
  )
}

/** Animated count-up, fires once on scroll-in. Snaps if reduced-motion. */
function CountUp({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const [val, setVal] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()}
      {suffix}
    </span>
  )
}

/** FEATURED — infinite marquee whose speed, skew and direction track scroll velocity. */
function VelocityMarquee({
  children,
  baseVelocity = 3,
  className = "",
}: {
  children: ReactNode
  baseVelocity?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 380 })
  const factor = useTransform(smooth, [0, 1200], [0, 4], { clamp: false })
  const skew = useTransform(smooth, [-1200, 0, 1200], [-7, 0, 7], { clamp: true })
  const dir = useRef(1)

  // four identical copies → wrap one quarter for a seamless loop
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * Math.abs(f)
    baseX.set(baseX.get() + move)
  })

  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <motion.div
        style={{ x, skewX: reduce ? 0 : skew }}
        className="flex flex-none whitespace-nowrap will-change-transform"
      >
        {[0, 1, 2, 3].map((i) => (
          <span key={i} aria-hidden={i > 0} className="flex flex-none items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const TICKER = ["FIND YOUR RHYTHM", "45 MINUTES", "ON THE BEAT", "FULL SEND", "LAKE STREET"]

function TickerRow({ tone }: { tone: "flare" | "cream" }) {
  return (
    <>
      {TICKER.map((t, i) => (
        <span key={i} className="flex flex-none items-center">
          <span
            className="px-6 font-['Bricolage_Grotesque'] text-[clamp(2rem,7vw,5.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em]"
            style={{ color: tone === "flare" ? FLARE : CREAM }}
          >
            {t}
          </span>
          <Music2
            size={28}
            strokeWidth={2.5}
            style={{ color: tone === "flare" ? CREAM : FLARE }}
            className="flex-none"
          />
        </span>
      ))}
    </>
  )
}

function IntensityMeter({ level, tone = "flare" }: { level: number; tone?: "flare" | "ink" }) {
  return (
    <div className="flex items-end gap-[3px]" aria-label={`Intensity ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.span
          key={n}
          initial={{ scaleY: 0.25, opacity: 0.4 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: n * 0.06, duration: 0.3 }}
          className="block w-[6px] origin-bottom rounded-[1px]"
          style={{
            height: `${6 + n * 4}px`,
            background:
              n <= level ? (tone === "flare" ? FLARE : "#15140f") : "currentColor",
            opacity: n <= level ? 1 : 0.18,
          }}
        />
      ))}
    </div>
  )
}

function FlareButton({
  children,
  variant = "solid",
}: {
  children: ReactNode
  variant?: "solid" | "ghost"
}) {
  const base =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.18em] transition-colors duration-200"
  const styles =
    variant === "solid"
      ? "bg-[#ff4d2e] text-[#0b0b0d] hover:bg-[#ff6a4f]"
      : "border border-[#f4efe4]/30 text-[#f4efe4] hover:border-[#ff4d2e] hover:text-[#ff4d2e]"
  return (
    <Magnetic strength={0.35}>
      <button className={`${base} ${styles}`}>
        {children}
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </Magnetic>
  )
}

// On dark grounds FLARE clears AA as small text (≈5.5:1). On cream it would
// fail (≈2.7:1), so the cream variant swaps to a darkened sibling (#b8371d ≈5:1).
function SectionLabel({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "cream" }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-[2px] w-8" style={{ background: FLARE }} />
      <Mono className={tone === "cream" ? "text-[#b8371d]" : "text-[#ff4d2e]"}>{children}</Mono>
    </div>
  )
}

/* ------------------------------------------------------------------ Home */

function Home({ base }: { base: string }) {
  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden bg-[#0b0b0d] px-5 pt-16 pb-10 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-[90px]"
          style={{ background: FLARE }}
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionLabel>Indoor cycling · Fulton Market, Chicago</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-['Bricolage_Grotesque'] text-[clamp(3.2rem,12vw,9rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-[#f4efe4]">
              Find your
              <br />
              <span style={{ color: FLARE }}>rhythm.</span>
            </h1>
          </Reveal>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <Reveal delay={0.16}>
              <p className="max-w-md font-['Hanken_Grotesk'] text-[17px] leading-relaxed text-[#f4efe4]/70">
                One warehouse room on Lake Street. Forty-five minutes, beat-matched,
                lights down. No mirrors, no leaderboard you didn't ask for — just the
                set, the climb, and whoever you are at the finish.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex flex-wrap items-center gap-3">
                <NavLink to={`${base}/membership`}>
                  <FlareButton>Claim your first ride</FlareButton>
                </NavLink>
                <NavLink to={`${base}/schedule`}>
                  <FlareButton variant="ghost">See the schedule</FlareButton>
                </NavLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* featured velocity marquee */}
      <div className="border-y border-[#f4efe4]/10 bg-[#0b0b0d] py-5">
        <VelocityMarquee baseVelocity={2.5}>
          <TickerRow tone="flare" />
        </VelocityMarquee>
      </div>

      {/* stats */}
      <section className="bg-[#141417] px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: <CountUp to={9200} suffix="+" />, l: "Rides clipped in this month" },
            { n: <CountUp to={38} />, l: "Classes on the schedule each week" },
            { n: <CountUp to={128} />, l: "Beats per minute, give or take" },
            { n: <><CountUp to={4.9} decimals={1} />/5</>, l: "Average rider rating" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border-l-2 pl-5" style={{ borderColor: FLARE }}>
                <div className="font-['Bricolage_Grotesque'] text-[clamp(2.4rem,5vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em] text-[#f4efe4]">
                  {s.n}
                </div>
                <div className="mt-3 font-['Hanken_Grotesk'] text-[14px] leading-snug text-[#f4efe4]/55">
                  {s.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* formats preview — asymmetric */}
      <section className="bg-[#f4efe4] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel tone="cream">Four ways to ride</SectionLabel>
              <h2 className="mt-4 max-w-xl font-['Bricolage_Grotesque'] text-[clamp(2rem,5vw,3.2rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-[#15140f]">
                Pick a room, not a workout.
              </h2>
            </div>
            <NavLink
              to={`${base}/classes`}
              className="group inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.18em] text-[#15140f] transition-colors hover:text-[#ff4d2e]"
            >
              All formats
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </NavLink>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-12">
            {FORMATS.map((f, i) => {
              const span = [
                "md:col-span-7",
                "md:col-span-5",
                "md:col-span-5",
                "md:col-span-7",
              ][i]
              return (
                <Reveal key={f.code} delay={i * 0.06} className={span}>
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-[#15140f]/12 bg-white/40 p-7 transition-colors duration-200 hover:border-[#ff4d2e]">
                    <div>
                      <div className="flex items-start justify-between">
                        <Mono className="text-[#15140f]/60">{f.tag}</Mono>
                        <IntensityMeter level={f.intensity} tone="ink" />
                      </div>
                      <h3 className="mt-4 font-['Bricolage_Grotesque'] text-[2rem] font-extrabold uppercase leading-none tracking-[-0.03em] text-[#15140f]">
                        {f.name}
                      </h3>
                      <p className="mt-3 max-w-md font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#15140f]/65">
                        {f.blurb}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[#15140f]/65">
                      <Clock size={14} />
                      <Mono className="text-[#15140f]/65">{f.duration}</Mono>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* instructor spotlight */}
      <section className="bg-[#0b0b0d] px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-[#f4efe4]/15">
                <img
                  src="https://picsum.photos/seed/tempo-coach-mara-portrait/720/860"
                  alt="Mara Okafor, head coach, mid-ride at the front of the studio"
                  width={720}
                  height={860}
                  loading="lazy"
                  style={DUOTONE}
                  className="aspect-[5/6] w-full object-cover transition-[filter] duration-500 hover:!filter-none"
                />
              </div>
              <div
                className="absolute -bottom-4 -right-4 rounded-xl px-5 py-3"
                style={{ background: FLARE }}
              >
                <span className="font-['Bricolage_Grotesque'] text-[15px] font-extrabold uppercase tracking-[-0.01em] text-[#0b0b0d]">
                  Coach of the month
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <SectionLabel>Who's up front</SectionLabel>
              <h2 className="mt-5 font-['Bricolage_Grotesque'] text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-[#f4efe4]">
                Mara Okafor
              </h2>
              <p className="mt-2 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.18em] text-[#ff4d2e]">
                Head coach · Tempo 45
              </p>
              <p className="mt-6 max-w-md font-['Hanken_Grotesk'] text-[16px] leading-relaxed text-[#f4efe4]/70">
                {INSTRUCTORS[0].bio}
              </p>
              <p className="mt-6 border-l-2 pl-4 font-['Bricolage_Grotesque'] text-[18px] italic text-[#f4efe4]" style={{ borderColor: FLARE }}>
                "{INSTRUCTORS[0].signature}"
              </p>
              <div className="mt-8">
                <NavLink to={`${base}/studio`}>
                  <FlareButton variant="ghost">Meet the coaches</FlareButton>
                </NavLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingBand base={base} />
    </div>
  )
}

/* --------------------------------------------------------------- Classes */

function Classes() {
  return (
    <div className="bg-[#0b0b0d]">
      <PageHead
        kicker="The formats"
        title="Every room runs to a beat."
        lede="Four ways to spend forty-odd minutes. Same bikes, same sound system, wildly different days. Read the intensity meter before you book — your legs will hold you to it."
      />
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-5xl space-y-4">
          {FORMATS.map((f, i) => (
            <Reveal key={f.code} delay={i * 0.05}>
              <div className="group grid gap-6 rounded-2xl border border-[#f4efe4]/12 bg-[#141417] p-7 transition-colors duration-200 hover:border-[#ff4d2e] md:grid-cols-[auto_1fr_auto] md:items-start md:p-9">
                <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                  <span
                    className="grid h-16 w-16 flex-none place-items-center rounded-xl font-['Bricolage_Grotesque'] text-[15px] font-extrabold tracking-[-0.01em] text-[#0b0b0d]"
                    style={{ background: FLARE }}
                  >
                    {f.code}
                  </span>
                  <IntensityMeter level={f.intensity} />
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h2 className="font-['Bricolage_Grotesque'] text-[2rem] font-extrabold uppercase leading-none tracking-[-0.03em] text-[#f4efe4]">
                      {f.name}
                    </h2>
                    <Mono className="text-[#ff4d2e]">{f.tag}</Mono>
                  </div>
                  <p className="mt-3 max-w-lg font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#f4efe4]/70">
                    {f.blurb}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {f.detail.map((d) => (
                      <li key={d} className="flex gap-3 font-['Hanken_Grotesk'] text-[14px] text-[#f4efe4]/60">
                        <Minus size={16} className="mt-0.5 flex-none" style={{ color: FLARE }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-[#f4efe4]/55 md:flex-col md:items-end md:text-right">
                  <Clock size={14} />
                  <Mono className="text-[#f4efe4]/55">{f.duration}</Mono>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------- Schedule */

function spotsTone(spots: number, cap: number) {
  if (spots === 0) return { label: "Waitlist", color: "#f4efe4", pct: 1, dim: true }
  const pct = 1 - spots / cap
  if (spots <= 3) return { label: `${spots} left`, color: FLARE, pct, dim: false }
  return { label: `${spots} open`, color: "#7fd1a6", pct, dim: false }
}

function Schedule() {
  const [day, setDay] = useState("mon")
  const active = WEEK.find((d) => d.key === day) ?? WEEK[0]

  return (
    <div className="bg-[#0b0b0d]">
      <PageHead
        kicker="This week"
        title="Grab a bike before it's gone."
        lede="The 6:15 fills first, the 5:30 fills fast. Unlimited members book fourteen days out — everyone else, seven. Pick a day."
      />
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* day tabs */}
          <div
            role="tablist"
            aria-label="Day of week"
            className="flex flex-wrap gap-2 border-b border-[#f4efe4]/10 pb-5"
          >
            {WEEK.map((d) => {
              const on = d.key === day
              return (
                <button
                  key={d.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setDay(d.key)}
                  className="relative rounded-full px-5 py-2 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.16em] transition-colors duration-200"
                  style={{ color: on ? "#0b0b0d" : undefined }}
                >
                  {on && (
                    <motion.span
                      layoutId="tempo-day"
                      className="absolute inset-0 rounded-full"
                      style={{ background: FLARE }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className={`relative ${on ? "" : "text-[#f4efe4]/55 hover:text-[#f4efe4]"}`}>
                    {d.label}
                  </span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={active.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="mt-8 divide-y divide-[#f4efe4]/10"
            >
              {active.classes.map((c, i) => {
                const t = spotsTone(c.spots, c.cap)
                return (
                  <li
                    key={i}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 sm:gap-8"
                  >
                    <div className="w-16 font-['Bricolage_Grotesque'] text-[18px] font-extrabold tracking-[-0.02em] text-[#f4efe4]">
                      {c.time}
                    </div>
                    <div className="min-w-0">
                      <div className="font-['Hanken_Grotesk'] text-[17px] font-semibold text-[#f4efe4]">
                        {c.format}
                      </div>
                      <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#f4efe4]/55">
                        with {c.coach}
                      </div>
                    </div>
                    <div className="flex w-28 flex-col items-end gap-2">
                      <span
                        className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.12em]"
                        style={{ color: t.color, opacity: t.dim ? 0.6 : 1 }}
                      >
                        {t.label}
                      </span>
                      <div className="h-[5px] w-full overflow-hidden rounded-full bg-[#f4efe4]/10">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: t.pct }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="h-full origin-left rounded-full"
                          style={{ background: t.color, opacity: t.dim ? 0.4 : 1 }}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </motion.ul>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------ Membership */

function Membership({ base }: { base: string }) {
  return (
    <div className="bg-[#0b0b0d]">
      <PageHead
        kicker="Ways in"
        title="No contracts you'll resent."
        lede="Start free. Buy a pack when you like the room. Go unlimited when you can't stay away. Pause or cancel from your phone — we'd rather you come back than feel trapped."
      />

      <section className="px-5 pb-16">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 transition-transform duration-200 hover:-translate-y-1 ${
                  t.featured
                    ? "border-transparent bg-[#ff4d2e] text-[#0b0b0d]"
                    : "border-[#f4efe4]/12 bg-[#141417] text-[#f4efe4]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.2em] ${
                      t.featured ? "text-[#0b0b0d]/70" : "text-[#ff4d2e]"
                    }`}
                  >
                    {t.featured ? "Most ridden" : t.cadence}
                  </span>
                </div>
                <h3 className="mt-4 font-['Bricolage_Grotesque'] text-[1.7rem] font-extrabold uppercase leading-none tracking-[-0.03em]">
                  {t.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-['Bricolage_Grotesque'] text-[2.6rem] font-extrabold leading-none tracking-[-0.04em]">
                    {t.price}
                  </span>
                  <span
                    className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.12em] ${
                      t.featured ? "text-[#0b0b0d]/60" : "text-[#f4efe4]/55"
                    }`}
                  >
                    {t.featured ? t.cadence : ""}
                  </span>
                </div>
                <p
                  className={`mt-3 font-['Hanken_Grotesk'] text-[14px] leading-relaxed ${
                    t.featured ? "text-[#0b0b0d]/75" : "text-[#f4efe4]/60"
                  }`}
                >
                  {t.pitch}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {t.features.map((feat) => (
                    <li key={feat} className="flex gap-3 font-['Hanken_Grotesk'] text-[14px]">
                      <Check
                        size={17}
                        className="mt-0.5 flex-none"
                        style={{ color: t.featured ? "#0b0b0d" : FLARE }}
                      />
                      <span className={t.featured ? "text-[#0b0b0d]/85" : "text-[#f4efe4]/75"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Magnetic strength={0.3}>
                    <button
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 ${
                        t.featured
                          ? "bg-[#0b0b0d] text-[#f4efe4] hover:bg-[#141417]"
                          : "bg-[#ff4d2e] text-[#0b0b0d] hover:bg-[#ff6a4f]"
                      }`}
                    >
                      {t.cta}
                      <ArrowRight size={15} />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>Before you clip in</SectionLabel>
          <h2 className="mt-4 font-['Bricolage_Grotesque'] text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-[#f4efe4]">
            Questions, answered.
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-[#f4efe4]/12"
              >
                <AccordionTrigger className="py-5 text-left font-['Hanken_Grotesk'] text-[17px] font-semibold text-[#f4efe4] hover:no-underline [&>svg]:text-[#ff4d2e]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#f4efe4]/65">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <ClosingBand base={base} />
    </div>
  )
}

/* ---------------------------------------------------------------- Studio */

function Studio({ base }: { base: string }) {
  return (
    <div className="bg-[#0b0b0d]">
      <PageHead
        kicker="The room & the people"
        title="One room. No second location."
        lede="We started Tempo in 2021 with eight reconditioned bikes and a borrowed PA. We still run a single room on Lake Street, because a studio you outgrow stops being a studio and starts being a chain."
      />

      {/* the space */}
      <section className="px-5 pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { seed: "tempo-studio-bikes-row", alt: "Rows of bikes under low warehouse lighting", span: "sm:col-span-2 lg:row-span-2 lg:col-span-2", ratio: "aspect-[4/3] lg:aspect-[3/2]" },
            { seed: "tempo-studio-weights-rack", alt: "Barbell rack and chalk bowl on the strength floor", span: "", ratio: "aspect-[4/3]" },
            { seed: "tempo-studio-lockers-detail", alt: "Locker room with stocked shelves and warm light", span: "", ratio: "aspect-[4/3]" },
          ].map((img, i) => (
            <Reveal key={img.seed} delay={i * 0.08} className={img.span}>
              <div className="group h-full overflow-hidden rounded-2xl border border-[#f4efe4]/12">
                <img
                  src={`https://picsum.photos/seed/${img.seed}/900/700`}
                  alt={img.alt}
                  loading="lazy"
                  width={900}
                  height={700}
                  style={DUOTONE}
                  className={`h-full w-full object-cover transition-[filter] duration-500 group-hover:!filter-none ${img.ratio}`}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* coaches */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Who's up front</SectionLabel>
          <h2 className="mt-4 font-['Bricolage_Grotesque'] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-[#f4efe4]">
            The coaches.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {INSTRUCTORS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="group">
                  <div className="overflow-hidden rounded-2xl border border-[#f4efe4]/12">
                    <img
                      src={`https://picsum.photos/seed/${p.seed}/600/720`}
                      alt={`${p.name}, ${p.role}`}
                      loading="lazy"
                      width={600}
                      height={720}
                      style={DUOTONE}
                      className="aspect-[5/6] w-full object-cover transition-[filter] duration-500 group-hover:!filter-none"
                    />
                  </div>
                  <h3 className="mt-5 font-['Bricolage_Grotesque'] text-[1.5rem] font-extrabold uppercase leading-none tracking-[-0.02em] text-[#f4efe4]">
                    {p.name}
                  </h3>
                  <p className="mt-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#ff4d2e]">
                    {p.role}
                  </p>
                  <p className="mt-3 font-['Hanken_Grotesk'] text-[14px] leading-relaxed text-[#f4efe4]/60">
                    {p.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* find us */}
      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-2xl border border-[#f4efe4]/12 bg-[#141417] p-8 sm:p-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionLabel>Find the room</SectionLabel>
            <h2 className="mt-4 font-['Bricolage_Grotesque'] text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-[#f4efe4]">
              812 W Lake Street
            </h2>
            <p className="mt-4 max-w-md font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#f4efe4]/65">
              Ground floor of the old Hayden cold-storage building, black door under
              the orange awning. Four minutes from the Morgan stop on the Green and
              Pink lines. Bag storage, showers and product are all stocked.
            </p>
          </div>
          <div className="space-y-5">
            {[
              { icon: MapPin, h: "Fulton Market", t: "Chicago, IL 60607" },
              { icon: Clock, h: "Doors", t: "Mon–Fri 5:45a–8p · Sat–Sun 7:30a–12p" },
              { icon: Music2, h: "Say hi", t: "ride@tempo.studio · @tempo.chi" },
            ].map((row) => (
              <div key={row.h} className="flex items-start gap-4">
                <span
                  className="grid h-10 w-10 flex-none place-items-center rounded-lg"
                  style={{ background: "rgba(255,77,46,0.14)" }}
                >
                  <row.icon size={17} style={{ color: FLARE }} />
                </span>
                <div>
                  <div className="font-['Hanken_Grotesk'] text-[15px] font-semibold text-[#f4efe4]">
                    {row.h}
                  </div>
                  <div className="font-['Hanken_Grotesk'] text-[14px] text-[#f4efe4]/55">
                    {row.t}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingBand base={base} />
    </div>
  )
}

/* ----------------------------------------------------------- shared page */

function PageHead({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <section className="px-5 pt-16 pb-12 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>{kicker}</SectionLabel>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-3xl font-['Bricolage_Grotesque'] text-[clamp(2.6rem,8vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-[#f4efe4]">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl font-['Hanken_Grotesk'] text-[17px] leading-relaxed text-[#f4efe4]/65">
            {lede}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function ClosingBand({ base }: { base: string }) {
  return (
    <section className="bg-[#f4efe4]">
      <div className="border-y border-[#15140f]/10 py-6">
        <VelocityMarquee baseVelocity={2.5}>
          <TickerRow tone="cream" />
        </VelocityMarquee>
      </div>
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-['Bricolage_Grotesque'] text-[clamp(2.2rem,6vw,4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.045em] text-[#15140f]">
            Your first ride is on us.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-md font-['Hanken_Grotesk'] text-[16px] leading-relaxed text-[#15140f]/65">
            Book a bike, show up ten minutes early, and let a coach handle the rest.
            No card, no catch — just the room.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-8 flex justify-center">
            <Magnetic strength={0.35}>
              <NavLink
                to={`${base}/membership`}
                className="group inline-flex items-center gap-2 rounded-full bg-[#15140f] px-7 py-3.5 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.18em] text-[#f4efe4] transition-colors duration-200 hover:bg-[#ff4d2e] hover:text-[#0b0b0d]"
              >
                Claim your first ride
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </NavLink>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- chrome */

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0b0b0d] font-['Hanken_Grotesk'] text-[#f4efe4] antialiased selection:bg-[#ff4d2e] selection:text-[#0b0b0d]">
      <header className="sticky top-0 z-40 border-b border-[#f4efe4]/10 bg-[#0b0b0d]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <NavLink to={base} end onClick={() => setOpen(false)}>
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `relative font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 ${
                    isActive ? "text-[#ff4d2e]" : "text-[#f4efe4]/55 hover:text-[#f4efe4]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="tempo-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px]"
                        style={{ background: FLARE }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Magnetic strength={0.3}>
              <NavLink
                to={`${base}/membership`}
                className="rounded-full bg-[#ff4d2e] px-5 py-2.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#0b0b0d] transition-colors duration-200 hover:bg-[#ff6a4f]"
              >
                Book a ride
              </NavLink>
            </Magnetic>
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-[#f4efe4]/20 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#f4efe4]/10 md:hidden"
            >
              <div className="flex flex-col px-5 py-2">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `border-b border-[#f4efe4]/10 py-3.5 font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.16em] last:border-0 ${
                        isActive ? "text-[#ff4d2e]" : "text-[#f4efe4]/80"
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#f4efe4]/10 bg-[#0b0b0d]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs font-['Hanken_Grotesk'] text-[14px] leading-relaxed text-[#f4efe4]/55">
              An indoor cycling and strength studio in Fulton Market, Chicago.
              One room, beat-matched, lights down. Find your rhythm.
            </p>
          </div>
          <div>
            <Mono className="text-[#f4efe4]/55">Studio</Mono>
            <ul className="mt-4 space-y-2.5">
              {NAV.slice(1).map((n) => (
                <li key={n.label}>
                  <NavLink
                    to={`${base}/${n.to}`}
                    className="font-['Hanken_Grotesk'] text-[14px] text-[#f4efe4]/65 transition-colors hover:text-[#ff4d2e]"
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Mono className="text-[#f4efe4]/55">Find us</Mono>
            <ul className="mt-4 space-y-2.5 font-['Hanken_Grotesk'] text-[14px] text-[#f4efe4]/65">
              <li>812 W Lake Street</li>
              <li>Chicago, IL 60607</li>
              <li>ride@tempo.studio</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#f4efe4]/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <Mono className="text-[#f4efe4]/55">© 2026 Tempo Studio · Chicago</Mono>
            <Mono className="text-[#f4efe4]/55">Clip in. Lights down.</Mono>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
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

export default function Tempo() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <MotionConfig reducedMotion="user">
      <Layout base={base}>
        <Routes>
          <Route index element={<Page><Home base={base} /></Page>} />
          <Route path="classes" element={<Page><Classes /></Page>} />
          <Route path="schedule" element={<Page><Schedule /></Page>} />
          <Route path="membership" element={<Page><Membership base={base} /></Page>} />
          <Route path="studio" element={<Page><Studio base={base} /></Page>} />
          <Route path="*" element={<Page><Home base={base} /></Page>} />
        </Routes>
      </Layout>
    </MotionConfig>
  )
}
