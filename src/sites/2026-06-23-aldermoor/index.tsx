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
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  ArrowUpRight,
  Droplets,
  Flame,
  Menu,
  Snowflake,
  Thermometer,
  Wheat,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Aldermoor — single-estate Highland whisky from one quiet valley",
  description:
    "A craft-luxury site for Aldermoor, a revived single-malt distillery that floor-malts its own barley and matures on an earthen floor. Featured interaction: a page-level 'firelight' gradient — a warm lantern glow that follows your cursor with spring lag across the dark warehouse, plus magnetic CTAs, scroll reveals and animated counters.",
  date: "2026-06-23",
  type: "Distillery / brand",
  interaction: "Cursor-tracked firelight gradient (spring-lagged page glow) + magnetic CTAs + scroll reveals + animated counters",
  pages: ["Home", "The Whisky", "Distillery", "Visit", "Journal"],
}

/* --------------------------------------------------------------- palette */
// warehouse near-black #15110d · oat panel #efe4d3 · ink #1b150e
// ONE accent: copper amber #d2883a on dark grounds; #c9a374 for small muted heads.
const AMBER = "#d2883a"

const PHOTO: CSSProperties = {
  filter: "sepia(34%) saturate(118%) brightness(0.92) contrast(1.04)",
}

/* ----------------------------------------------------------------- data */

type Expression = {
  name: string
  age: string
  abv: string
  cask: string
  blurb: string
  notes: string[]
  seed: string
}

const RANGE: Expression[] = [
  {
    name: "The House Malt",
    age: "12",
    abv: "43%",
    cask: "First-fill bourbon",
    blurb:
      "The everyday Aldermoor — the one we drink ourselves at the end of a long day on the floor.",
    notes: ["Honeycomb", "Baked apple", "Heather", "Vanilla"],
    seed: "whisky-amber-glass",
  },
  {
    name: "Oloroso 18",
    age: "18",
    abv: "46%",
    cask: "Oloroso sherry",
    blurb:
      "Eighteen winters in Spanish oak that once held dry sherry. Dark, unhurried, contemplative.",
    notes: ["Dark fig", "Walnut", "Clove", "Old leather"],
    seed: "whisky-sherry-dark",
  },
  {
    name: "Cask Strength",
    age: "NAS",
    abv: "58.2%",
    cask: "Refill hogshead",
    blurb:
      "Bottled straight from a single cask with nothing added. Add a few drops of burn water and watch it open.",
    notes: ["Barley sugar", "Orange oil", "Cracked pepper", "Toffee"],
    seed: "whisky-caskstrength",
  },
  {
    name: "Peated 10",
    age: "10",
    abv: "48%",
    cask: "Bourbon + a sea cask",
    blurb:
      "Our only smoked expression, malted over a low peat fire and finished within sight of the firth.",
    notes: ["Woodsmoke", "Sea salt", "Lemon zest", "Wet ash"],
    seed: "whisky-peated-smoke",
  },
]

type Step = {
  no: string
  title: string
  detail: string
  icon: typeof Wheat
  seed: string
}

const PROCESS: Step[] = [
  {
    no: "01",
    title: "Floor malting",
    detail:
      "Estate barley is steeped, spread across the malting floor by hand and turned with a wooden shiel for seven days until it chits.",
    icon: Wheat,
    seed: "barley-malting-floor",
  },
  {
    no: "02",
    title: "Mashing",
    detail:
      "Ground malt meets hot water drawn from the Alder burn in a cast-iron mash tun, releasing a clear, sweet wort.",
    icon: Droplets,
    seed: "mash-tun-copper",
  },
  {
    no: "03",
    title: "Fermentation",
    detail:
      "A long ninety-hour ferment in Oregon-pine washbacks builds the fruit and depth we are known for. We never rush it.",
    icon: Snowflake,
    seed: "washback-wooden",
  },
  {
    no: "04",
    title: "Distillation",
    detail:
      "Two onion-shaped copper stills run slow and gentle. We take a narrow heart of the spirit and let the rest run away.",
    icon: Flame,
    seed: "copper-pot-still",
  },
  {
    no: "05",
    title: "Maturation",
    detail:
      "Casks rest three-high on the beaten-earth floor of a dunnage warehouse, breathing the damp valley air for a decade or more.",
    icon: Thermometer,
    seed: "dunnage-warehouse-casks",
  },
]

type Post = {
  kicker: string
  title: string
  dek: string
  date: string
  read: string
  seed: string
}

const POSTS: Post[] = [
  {
    kicker: "From the floor",
    title: "Why we still turn the malt by hand",
    dek: "Almost no one floor-malts any more. Here is the stubborn, aching, irreplaceable case for keeping it.",
    date: "Jun 2026",
    read: "6 min",
    seed: "malt-shovel-hands",
  },
  {
    kicker: "The cask",
    title: "What a Spanish bodega taught us about patience",
    dek: "A note from a week spent in Jerez, choosing the oloroso butts that will shape our next eighteen years.",
    date: "May 2026",
    read: "8 min",
    seed: "sherry-bodega-spain",
  },
  {
    kicker: "Tasting",
    title: "How to nose a dram without ruining it",
    dek: "Forget the wine-snob theatre. Three honest steps to taste more of what is actually in the glass.",
    date: "Apr 2026",
    read: "4 min",
    seed: "nosing-glass-whisky",
  },
]

/* --------------------------------------------------- featured: firelight */
/* A page-level warm glow that follows the cursor with spring lag. On touch /
   reduced-motion it sits as a static centred pool so every visit gets the mood. */
function Firelight() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.32)
  const sx = useSpring(mx, { stiffness: 55, damping: 22, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 55, damping: 22, mass: 0.8 })
  const xPct = useTransform(sx, (v) => `${(v * 100).toFixed(2)}%`)
  const yPct = useTransform(sy, (v) => `${(v * 100).toFixed(2)}%`)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        mx.set(e.clientX / window.innerWidth)
        my.set(e.clientY / window.innerHeight)
      })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [mx, my, reduce])

  const glow = useMotionTemplate`radial-gradient(46rem 46rem at ${xPct} ${yPct}, rgba(210,136,58,0.20), rgba(210,136,58,0.07) 32%, transparent 62%)`
  const ember = useMotionTemplate`radial-gradient(13rem 13rem at ${xPct} ${yPct}, rgba(255,196,120,0.16), transparent 70%)`

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <motion.div className="absolute inset-0" style={{ background: glow }} />
      <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: ember }} />
      {/* warehouse grain */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------ small bits */

function Mono({
  children,
  className = "",
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={`font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.28em] ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}

function Wordmark({ className = "", onDark = true }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={`font-['Fraunces'] text-[1.7rem] font-semibold leading-none tracking-[-0.02em] ${className}`}
      style={{ color: onDark ? "#f3ead9" : "#1b150e" }}
    >
      Alder<span className="italic" style={{ color: AMBER }}>moor</span>
    </span>
  )
}

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
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [val, setVal] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/** Magnetic pill CTA. `solid` = amber fill, else outlined on dark. */
function Cta({
  children,
  solid = false,
  as = "button",
}: {
  children: ReactNode
  solid?: boolean
  as?: "button" | "span"
}) {
  const Tag = as === "span" ? motion.span : motion.button
  return (
    <Magnetic strength={0.35}>
      <Tag
        whileTap={{ scale: 0.96 }}
        className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.86rem] font-semibold tracking-wide transition-colors duration-200 ${
          solid
            ? "text-[#1b150e]"
            : "border border-[#d2883a]/45 text-[#f3ead9] hover:border-[#d2883a]"
        }`}
        style={solid ? { backgroundColor: AMBER } : undefined}
      >
        {children}
        <ArrowUpRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Tag>
    </Magnetic>
  )
}

function Frame({
  seed,
  alt,
  ratio = "aspect-[4/5]",
  className = "",
}: {
  seed: string
  alt: string
  ratio?: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-[#3a2c1c] ${ratio} ${className}`}
    >
      <img
        src={`https://picsum.photos/seed/${seed}/900/1100`}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform [transition-duration:1200ms] ease-out hover:scale-[1.04]"
        style={PHOTO}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#15110d]/55 via-transparent to-[#15110d]/15" />
    </div>
  )
}

/* ------------------------------------------------------------ page shell */

function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  )
}

function SectionHead({
  kicker,
  title,
  intro,
}: {
  kicker: string
  title: ReactNode
  intro?: string
}) {
  return (
    <div className="max-w-2xl">
      <Mono style={{ color: AMBER }}>{kicker}</Mono>
      <h2 className="mt-4 font-['Fraunces'] text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-[#f3ead9]">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 text-[1.02rem] leading-[1.75] text-[#cdbfa9]">{intro}</p>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------- pages */

function Home({ base }: { base: string }) {
  return (
    <PageShell>
      {/* hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <Mono style={{ color: AMBER }}>Est. 1887 · Glen Alder, Highlands</Mono>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 font-['Fraunces'] text-[clamp(2.8rem,8vw,6.2rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[#f3ead9]">
                Slow whisky
                <br />
                from one
                <br />
                <span className="italic" style={{ color: AMBER }}>
                  quiet valley.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-md text-[1.05rem] leading-[1.75] text-[#cdbfa9]">
                We malt our own barley on a wooden floor, distil it in two copper
                stills, and let the casks breathe the damp air of Glen Alder for as
                long as it takes. Nothing here is in a hurry.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <NavLink to={`${base}/whisky`}>
                  <Cta solid as="span">Explore the whisky</Cta>
                </NavLink>
                <NavLink to={`${base}/visit`}>
                  <Cta as="span">Plan a visit</Cta>
                </NavLink>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative">
                <Frame
                  seed="highland-whisky-bottle"
                  alt="A bottle of Aldermoor single malt resting on an oak cask end"
                  ratio="aspect-[4/5]"
                />
                <div className="absolute -bottom-5 -left-5 rounded-sm border border-[#3a2c1c] bg-[#1b150e]/90 px-5 py-4 backdrop-blur">
                  <Mono style={{ color: AMBER }}>Cask no. 0114</Mono>
                  <p className="mt-1 font-['Fraunces'] text-lg text-[#f3ead9]">
                    Filled spring 2008
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* counters */}
      <section className="border-y border-[#3a2c1c]/70">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-px px-6 md:grid-cols-4">
          {[
            { v: 137, s: "", l: "Years since first spirit", d: 0 },
            { v: 90, s: " hrs", l: "Fermentation, never rushed", d: 0 },
            { v: 2, s: "", l: "Copper stills, run by hand", d: 0 },
            { v: 4.2, s: "%", l: "Angel's share, lost each year", d: 1 },
          ].map((c, i) => (
            <Reveal key={c.l} delay={i * 0.06}>
              <div className="py-10 md:py-14 md:pr-8">
                <div className="font-['Fraunces'] text-[clamp(2.6rem,5vw,4rem)] font-medium leading-none text-[#f3ead9]">
                  <CountUp to={c.v} suffix={c.s} decimals={c.d} />
                </div>
                <p className="mt-3 text-[0.9rem] leading-snug text-[#a99980]">{c.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* intro split */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <Frame
              seed="distillery-warehouse-interior"
              alt="The dim earthen-floor dunnage warehouse, casks stacked three high"
              ratio="aspect-[5/6]"
            />
          </Reveal>
          <div>
            <SectionHead
              kicker="The house"
              title={<>A distillery the size of a barn, run like a kitchen.</>}
              intro="Aldermoor went dark in 1963 and stood empty for half a century. We reopened the doors in 2011 with the original cast-iron mash tun still bolted to the floor. Everything we make passes through the hands of nine people who live within a mile of the still house."
            />
            <Reveal delay={0.1}>
              <ul className="mt-8 space-y-4">
                {[
                  "Estate barley, floor-malted on site",
                  "Spring water from the Alder burn",
                  "Earthen-floor dunnage maturation",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[#cdbfa9]">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: AMBER }}
                    />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* range teaser */}
      <section className="mx-auto max-w-[1180px] px-6 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker="The core range" title="Four ways to know the valley." />
          <NavLink to={`${base}/whisky`} className="hidden md:block">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f3ead9] underline decoration-[#d2883a]/50 underline-offset-4 transition-colors hover:decoration-[#d2883a]">
              See full range <ArrowUpRight size={15} />
            </span>
          </NavLink>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RANGE.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.06}>
              <article className="group flex h-full flex-col rounded-sm border border-[#3a2c1c] bg-[#1b150e]/55 p-5 transition-colors duration-300 hover:border-[#d2883a]/55">
                <div className="flex items-baseline justify-between">
                  <span className="font-['Fraunces'] text-5xl font-medium text-[#f3ead9]">
                    {e.age}
                  </span>
                  <Mono style={{ color: AMBER }}>{e.abv}</Mono>
                </div>
                <h3 className="mt-4 font-['Fraunces'] text-xl text-[#f3ead9]">{e.name}</h3>
                <p className="mt-1 text-[0.8rem] text-[#a99980]">{e.cask}</p>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-[#cdbfa9]">
                  {e.blurb}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

function Whisky() {
  const [active, setActive] = useState(0)
  const e = RANGE[active]
  return (
    <PageShell>
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 md:pt-24">
        <SectionHead
          kicker="The whisky"
          title={<>Single malt, single estate, single-minded.</>}
          intro="No two casks are alike, so neither are our bottlings. Pick an expression below to read its story; each is bottled without colouring and without chill-filtration, the way the spirit comes out of the wood."
        />
      </section>

      {/* selector + detail */}
      <section className="mx-auto max-w-[1180px] px-6 pb-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-2">
              {RANGE.map((r, i) => (
                <button
                  key={r.name}
                  onClick={() => setActive(i)}
                  className={`group flex items-center justify-between rounded-sm border px-5 py-4 text-left transition-colors duration-200 ${
                    i === active
                      ? "border-[#d2883a]/70 bg-[#1b150e]"
                      : "border-[#3a2c1c] hover:border-[#d2883a]/40"
                  }`}
                >
                  <span>
                    <span className="block font-['Fraunces'] text-lg text-[#f3ead9]">
                      {r.name}
                    </span>
                    <span className="text-[0.78rem] text-[#a99980]">{r.cask}</span>
                  </span>
                  <span
                    className="font-['Fraunces'] text-2xl font-medium"
                    style={{ color: i === active ? AMBER : "#6f5f48" }}
                  >
                    {r.age}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={e.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="grid gap-8 rounded-sm border border-[#3a2c1c] bg-[#1b150e]/55 p-6 md:grid-cols-2 md:p-8"
              >
                <Frame seed={e.seed} alt={`A dram of Aldermoor ${e.name}`} ratio="aspect-[4/5]" />
                <div className="flex flex-col">
                  <Mono style={{ color: AMBER }}>{e.cask}</Mono>
                  <h3 className="mt-3 font-['Fraunces'] text-3xl text-[#f3ead9]">{e.name}</h3>
                  <div className="mt-4 flex gap-8">
                    <div>
                      <div className="font-['Fraunces'] text-3xl text-[#f3ead9]">{e.age}</div>
                      <Mono className="text-[#a99980]">Years</Mono>
                    </div>
                    <div>
                      <div className="font-['Fraunces'] text-3xl text-[#f3ead9]">{e.abv}</div>
                      <Mono className="text-[#a99980]">Strength</Mono>
                    </div>
                  </div>
                  <p className="mt-5 text-[0.96rem] leading-relaxed text-[#cdbfa9]">{e.blurb}</p>

                  <div className="mt-6">
                    <Mono className="text-[#a99980]">On the nose & palate</Mono>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {e.notes.map((n) => (
                        <span
                          key={n}
                          className="rounded-full border border-[#d2883a]/35 px-3 py-1 text-[0.82rem] text-[#e8d8bf] transition-colors duration-200 hover:border-[#d2883a] hover:bg-[#d2883a]/10"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-7">
                    <Cta solid>Add to cart · £{45 + active * 22}</Cta>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function Distillery() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 md:pt-24">
        <SectionHead
          kicker="From barley to bottle"
          title={<>Five rooms, one long conversation with time.</>}
          intro="There are no shortcuts on the way through Aldermoor. The barley arrives green from the fields above us and leaves, years later, as spirit. Here is every room it passes through."
        />
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-24">
        <div className="flex flex-col">
          {PROCESS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.no}>
                <div
                  className={`grid items-center gap-8 border-t border-[#3a2c1c]/70 py-12 md:grid-cols-12 ${
                    i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="md:col-span-5">
                    <Frame
                      seed={s.seed}
                      alt={`${s.title} at the Aldermoor distillery`}
                      ratio="aspect-[3/2]"
                    />
                  </div>
                  <div className="md:col-span-7 md:px-4">
                    <div className="flex items-center gap-4">
                      <span
                        className="font-['Fraunces'] text-5xl font-medium"
                        style={{ color: AMBER }}
                      >
                        {s.no}
                      </span>
                      <Icon size={22} className="text-[#a99980]" />
                    </div>
                    <h3 className="mt-4 font-['Fraunces'] text-[clamp(1.6rem,3vw,2.4rem)] text-[#f3ead9]">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[1rem] leading-[1.75] text-[#cdbfa9]">
                      {s.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}

function Visit({ base }: { base: string }) {
  const tours = [
    {
      name: "The Floor & Still Tour",
      time: "Daily · 11:00 & 14:00",
      price: "£18",
      detail: "An hour through the malting floor, mash house and still room, ending with two drams from the core range.",
    },
    {
      name: "Warehouse Tasting",
      time: "Fri & Sat · 15:30",
      price: "£45",
      detail: "Drawn straight from the cask by the warehouse keeper. Four expressions, including one you cannot buy.",
    },
    {
      name: "Fill Your Own",
      time: "By appointment",
      price: "£120",
      detail: "Hand-fill, wax-seal and label a bottle from a single hand-picked cask. Numbered and yours alone.",
    },
  ]
  return (
    <PageShell>
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 md:pt-24">
        <div className="grid items-end gap-10 md:grid-cols-2">
          <SectionHead
            kicker="Visit us"
            title={<>Find the valley. Stay a while.</>}
            intro="Glen Alder is forty minutes off the main road and worth every one of them. The still house is open year-round; the kettle is always on."
          />
          <Reveal delay={0.1}>
            <Frame
              seed="highland-glen-valley"
              alt="The road down into Glen Alder, hills folding into mist"
              ratio="aspect-[16/10]"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {tours.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <article className="flex h-full flex-col rounded-sm border border-[#3a2c1c] bg-[#1b150e]/55 p-6 transition-colors duration-300 hover:border-[#d2883a]/55">
                <div className="flex items-start justify-between">
                  <h3 className="max-w-[10ch] font-['Fraunces'] text-xl text-[#f3ead9]">
                    {t.name}
                  </h3>
                  <span className="font-['Fraunces'] text-2xl font-medium" style={{ color: AMBER }}>
                    {t.price}
                  </span>
                </div>
                <Mono className="mt-3 text-[#a99980]">{t.time}</Mono>
                <p className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-[#cdbfa9]">
                  {t.detail}
                </p>
                <div className="mt-6">
                  <Cta>Book this</Cta>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-24">
        <Reveal>
          <div className="grid gap-8 rounded-sm border border-[#3a2c1c] bg-[#1b150e]/70 p-8 md:grid-cols-3 md:p-10">
            <div>
              <Mono style={{ color: AMBER }}>Where</Mono>
              <p className="mt-3 font-['Fraunces'] text-lg leading-snug text-[#f3ead9]">
                Aldermoor Distillery
                <br />
                Glen Alder, by Tomich
                <br />
                Inverness-shire IV4 7QZ
              </p>
            </div>
            <div>
              <Mono style={{ color: AMBER }}>When</Mono>
              <p className="mt-3 leading-relaxed text-[#cdbfa9]">
                Mon–Sat, 10:00–17:00
                <br />
                Sundays, 12:00–16:00
                <br />
                Closed Christmas & New Year
              </p>
            </div>
            <div>
              <Mono style={{ color: AMBER }}>Getting here</Mono>
              <p className="mt-3 leading-relaxed text-[#cdbfa9]">
                40 min west of Inverness. A single-track road for the last two
                miles — take it slowly, like everything else here.
              </p>
              <NavLink to={`${base}`} className="mt-4 inline-block">
                <span className="text-sm font-semibold text-[#f3ead9] underline decoration-[#d2883a]/50 underline-offset-4">
                  Back to home
                </span>
              </NavLink>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  )
}

function Journal() {
  const [lead, ...rest] = POSTS
  return (
    <PageShell>
      <section className="mx-auto max-w-[1180px] px-6 pb-14 pt-16 md:pt-24">
        <SectionHead
          kicker="The Aldermoor journal"
          title={<>Notes from the floor, the burn and the cask.</>}
          intro="We write down what we learn — the failures as much as the good casks. No marketing, just the working life of a small distillery."
        />
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-12">
        <Reveal>
          <article className="group grid gap-8 rounded-sm border border-[#3a2c1c] bg-[#1b150e]/55 p-6 transition-colors duration-300 hover:border-[#d2883a]/55 md:grid-cols-2 md:p-8">
            <Frame seed={lead.seed} alt={lead.title} ratio="aspect-[4/3]" />
            <div className="flex flex-col justify-center">
              <Mono style={{ color: AMBER }}>{lead.kicker}</Mono>
              <h3 className="mt-3 font-['Fraunces'] text-[clamp(1.7rem,3.5vw,2.6rem)] leading-[1.05] text-[#f3ead9]">
                {lead.title}
              </h3>
              <p className="mt-4 text-[1rem] leading-[1.7] text-[#cdbfa9]">{lead.dek}</p>
              <div className="mt-5 flex items-center gap-4">
                <Mono className="text-[#a99980]">{lead.date}</Mono>
                <span className="h-1 w-1 rounded-full bg-[#6f5f48]" />
                <Mono className="text-[#a99980]">{lead.read}</Mono>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <article className="group flex h-full gap-5 rounded-sm border border-[#3a2c1c] bg-[#1b150e]/40 p-5 transition-colors duration-300 hover:border-[#d2883a]/45">
                <div className="w-28 shrink-0 sm:w-36">
                  <Frame seed={p.seed} alt={p.title} ratio="aspect-[3/4]" />
                </div>
                <div className="flex flex-col">
                  <Mono style={{ color: AMBER }}>{p.kicker}</Mono>
                  <h3 className="mt-2 font-['Fraunces'] text-xl leading-tight text-[#f3ead9]">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-[#cdbfa9]">
                    {p.dek}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Mono className="text-[#a99980]">{p.date}</Mono>
                    <span className="h-1 w-1 rounded-full bg-[#6f5f48]" />
                    <Mono className="text-[#a99980]">{p.read}</Mono>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

/* ---------------------------------------------------------------- layout */

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/whisky`, label: "The Whisky", end: false },
    { to: `${base}/distillery`, label: "Distillery", end: false },
    { to: `${base}/visit`, label: "Visit", end: false },
    { to: `${base}/journal`, label: "Journal", end: false },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-[0.82rem] font-medium tracking-wide transition-colors duration-200 ${
      isActive ? "text-[#f3ead9]" : "text-[#a99980] hover:text-[#e8d8bf]"
    }`

  return (
    <div className="min-h-screen bg-[#15110d] text-[#e8d8bf] antialiased">
      <Firelight />

      <header className="sticky top-0 z-40 border-b border-[#3a2c1c]/70 bg-[#15110d]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">
          <NavLink to={base} end>
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <NavLink key={l.label} to={l.to} end={l.end} className={linkClass}>
                {({ isActive }) => (
                  <span className="relative inline-block py-1">
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-px"
                        style={{ backgroundColor: AMBER }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <NavLink to={`${base}/whisky`}>
              <Cta as="span">Shop</Cta>
            </NavLink>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="text-[#f3ead9] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#3a2c1c]/70 md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {links.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `rounded-sm px-3 py-3 text-base ${
                        isActive ? "bg-[#1b150e] text-[#f3ead9]" : "text-[#cdbfa9]"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="relative z-10 border-t border-[#3a2c1c]/70">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Wordmark />
              <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-[#a99980]">
                Single-estate Highland single malt, made slowly by nine people in
                Glen Alder. Please enjoy our whisky responsibly.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-6 flex max-w-sm items-center gap-2 rounded-full border border-[#3a2c1c] p-1.5 focus-within:border-[#d2883a]/60"
              >
                <input
                  type="email"
                  required
                  placeholder="Cask notes, twice a year"
                  aria-label="Email address"
                  className="flex-1 bg-transparent px-4 text-sm text-[#f3ead9] placeholder:text-[#9c8a6c] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full px-4 py-2 text-[0.78rem] font-semibold text-[#1b150e]"
                  style={{ backgroundColor: AMBER }}
                >
                  Join
                </button>
              </form>
            </div>

            <div className="md:col-span-7">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <FooterCol
                  head="Visit"
                  items={["The tours", "Warehouse tasting", "Find us", "Group bookings"]}
                />
                <FooterCol
                  head="The whisky"
                  items={["Core range", "Single casks", "Cask programme", "Stockists"]}
                />
                <FooterCol
                  head="Distillery"
                  items={["Our story", "The process", "Sustainability", "The journal"]}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#3a2c1c]/70 pt-6 text-[0.78rem] text-[#a99980] sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Aldermoor Distillery Co. · Bottled in Scotland.</span>
            <span className="flex gap-5">
              <a href="#" className="transition-colors hover:text-[#cdbfa9]">Privacy</a>
              <a href="#" className="transition-colors hover:text-[#cdbfa9]">Trade</a>
              <a href="#" className="transition-colors hover:text-[#cdbfa9]">Drink aware</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({ head, items }: { head: string; items: string[] }) {
  return (
    <div>
      <Mono className="text-[#c9a374]">{head}</Mono>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it}>
            <a
              href="#"
              className="text-[0.9rem] text-[#a99980] transition-colors duration-200 hover:text-[#f3ead9]"
            >
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ root */

export default function Aldermoor() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const reduce = useReducedMotion()

  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <Layout base={base}>
        <Routes>
          <Route index element={<Home base={base} />} />
          <Route path="whisky" element={<Whisky />} />
          <Route path="distillery" element={<Distillery />} />
          <Route path="visit" element={<Visit base={base} />} />
          <Route path="journal" element={<Journal />} />
          <Route path="*" element={<Home base={base} />} />
        </Routes>
      </Layout>
    </MotionConfig>
  )
}
