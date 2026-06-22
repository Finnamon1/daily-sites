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
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import {
  ArrowUpRight,
  Coffee,
  Clock,
  Leaf,
  MapPin,
  Mountain,
  Package,
  Quote,
  Sprout,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

export const meta: SiteMeta = {
  title: "Foxglove — A small-batch coffee roaster in Asheville",
  description:
    "Multi-page brand site for a fictional Blue Ridge coffee roastery. Warm paper palette, Fraunces display type, and a cursor-following hover image-reveal on the coffee menu.",
  date: "2026-06-22",
  type: "E-commerce / brand",
  interaction: "Cursor-following hover image-reveal",
  pages: ["Home", "Coffees", "Subscription", "Story", "Visit"],
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Process = "Washed" | "Natural" | "Honey"

interface Origin {
  name: string
  country: string
  region: string
  process: Process
  notes: string[]
  price: number
  roast: string
  seed: string
}

const COFFEES: Origin[] = [
  {
    name: "Kayon Mountain",
    country: "Ethiopia",
    region: "Guji",
    process: "Washed",
    notes: ["Jasmine", "Bergamot", "White peach"],
    price: 21,
    roast: "Light",
    seed: "foxglove-ethiopia-hills",
  },
  {
    name: "El Mirador",
    country: "Colombia",
    region: "Huila",
    process: "Washed",
    notes: ["Red apple", "Cane sugar", "Milk chocolate"],
    price: 19,
    roast: "Medium-light",
    seed: "foxglove-colombia-valley",
  },
  {
    name: "Mubuyu Estate",
    country: "Zambia",
    region: "Mazabuka",
    process: "Natural",
    notes: ["Blueberry", "Cola", "Cacao nib"],
    price: 22,
    roast: "Light",
    seed: "foxglove-zambia-farm",
  },
  {
    name: "Nayarit Highlands",
    country: "Mexico",
    region: "Nayarit",
    process: "Honey",
    notes: ["Toffee", "Cherry", "Toasted almond"],
    price: 18,
    roast: "Medium",
    seed: "foxglove-mexico-sierra",
  },
  {
    name: "Finca Soledad",
    country: "Guatemala",
    region: "Huehuetenango",
    process: "Washed",
    notes: ["Orange", "Brown sugar", "Hazelnut"],
    price: 20,
    roast: "Medium",
    seed: "foxglove-guatemala-ridge",
  },
  {
    name: "Gakenke Hills",
    country: "Rwanda",
    region: "Northern Province",
    process: "Natural",
    notes: ["Strawberry", "Plum", "Black tea"],
    price: 21,
    roast: "Light",
    seed: "foxglove-rwanda-terraces",
  },
]

const EASE = [0.21, 0.47, 0.32, 0.98] as const

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function Mark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2c2.2 1.7 3.2 3.7 3 6-.2 2-1.6 3.4-3 4-1.4-.6-2.8-2-3-4-.2-2.3.8-4.3 3-6Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 11c1.9 1.3 2.7 2.9 2.6 4.7-.1 1.6-1.2 2.8-2.6 3.3-1.4-.5-2.5-1.7-2.6-3.3C9.3 13.9 10.1 12.3 12 11Z"
        fill="currentColor"
        opacity="0.6"
      />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
    </svg>
  )
}

function ProcessTag({ process }: { process: Process }) {
  const tone =
    process === "Washed"
      ? "bg-[#e7ede0] text-[#4a5a3d]"
      : process === "Natural"
      ? "bg-[#f3e1d6] text-[#8a3d1f]"
      : "bg-[#efe6cf] text-[#7a6420]"
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${tone}`}
    >
      {process}
    </span>
  )
}

function Counter({
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
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
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

function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]
  return (
    <div className="relative flex overflow-hidden border-y border-[#2a1c12]/15 bg-[#2a1c12] py-3 text-[#f5efe2]">
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.25em]"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <Star className="h-3 w-3 text-[#bd4f2a]" fill="currentColor" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Featured interaction: cursor-following hover image-reveal           */
/* ------------------------------------------------------------------ */

function CoffeeMenu({ items }: { items: Origin[] }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 })

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        x.set(e.clientX)
        y.set(e.clientY)
      }}
    >
      <ul className="border-t border-[#2a1c12]/15">
        {items.map((c, i) => (
          <li key={c.name}>
            <a
              href="#order"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((p) => (p === i ? null : p))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((p) => (p === i ? null : p))}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[#2a1c12]/15 py-6 outline-none transition-colors hover:bg-[#efe6d3]/50 focus-visible:bg-[#efe6d3]/60 md:gap-8 md:py-8"
            >
              <span className="font-['JetBrains_Mono'] text-xs text-[#7d6a57] md:text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-['Fraunces'] text-2xl font-semibold leading-none text-[#2a1c12] transition-colors group-hover:text-[#bd4f2a] md:text-4xl">
                    {c.name}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#7d6a57]">
                    {c.country} · {c.region}
                  </span>
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  <ProcessTag process={c.process} />
                  <span className="text-sm text-[#6b5b4d]">
                    {c.notes.join(" · ")}
                  </span>
                </span>
                {/* Inline thumbnail fallback for reduced motion / touch */}
                {reduce && (
                  <img
                    src={`https://picsum.photos/seed/${c.seed}/240/160`}
                    alt={`Landscape near the ${c.name} washing station in ${c.country}`}
                    width={120}
                    height={80}
                    loading="lazy"
                    className="mt-3 h-20 w-[120px] rounded-md object-cover saturate-[0.85] sepia-[0.1]"
                  />
                )}
              </span>

              <span className="flex items-center gap-3 md:gap-5">
                <span className="font-['Fraunces'] text-xl text-[#2a1c12] md:text-2xl">
                  ${c.price}
                </span>
                <ArrowUpRight className="h-5 w-5 -translate-y-0.5 translate-x-0 text-[#7d6a57] opacity-0 transition-all group-hover:translate-x-1 group-hover:text-[#bd4f2a] group-hover:opacity-100" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Cursor-following floating preview (pointer-fine only) */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
          style={{ x: sx, y: sy }}
        >
          <div className="translate-x-8 -translate-y-1/2">
            <div className="relative h-56 w-44">
              {items.map((c, i) => (
                <motion.img
                  key={c.seed}
                  src={`https://picsum.photos/seed/${c.seed}/360/460`}
                  alt=""
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    scale: active === i ? 1 : 0.92,
                    rotate: active === i ? -3 : 2,
                  }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="absolute inset-0 h-full w-full rounded-xl border-4 border-[#f5efe2] object-cover shadow-2xl shadow-black/30 saturate-[0.9] sepia-[0.08]"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Layout: persistent nav + footer + page transitions                 */
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const nav = [
    { to: base, label: "Home", end: true },
    { to: `${base}/coffees`, label: "Coffees", end: false },
    { to: `${base}/subscription`, label: "Subscription", end: false },
    { to: `${base}/story`, label: "Story", end: false },
    { to: `${base}/visit`, label: "Visit", end: false },
  ]
  return (
    <div className="min-h-screen bg-[#f5efe2] font-['Hanken_Grotesk'] text-[#2a1c12] antialiased selection:bg-[#bd4f2a] selection:text-[#f5efe2]">
      <ScrollReset />

      <header className="sticky top-0 z-40 border-b border-[#2a1c12]/12 bg-[#f5efe2]/85 backdrop-blur supports-[backdrop-filter]:bg-[#f5efe2]/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <NavLink to={base} end className="flex items-center gap-2 text-[#2a1c12]">
            <span className="text-[#bd4f2a]">
              <Mark className="h-7 w-7" />
            </span>
            <span className="font-['Fraunces'] text-xl font-semibold tracking-tight">
              Foxglove
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.slice(1).map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#bd4f2a]"
                      : "text-[#6b5b4d] hover:text-[#2a1c12]"
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
              className="rounded-full bg-[#2a1c12] px-5 text-[#f5efe2] hover:bg-[#bd4f2a]"
            >
              <NavLink to={`${base}/coffees`}>Shop coffee</NavLink>
            </Button>
          </Magnetic>
        </div>

        {/* compact mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-[#2a1c12]/10 px-3 py-2 md:hidden">
          {nav.slice(1).map((n) => (
            <NavLink
              key={n.label}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-[#2a1c12] text-[#f5efe2]" : "text-[#6b5b4d]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#2a1c12]/12 bg-[#2a1c12] text-[#e8dcc8]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
          <div>
            <div className="flex items-center gap-2 text-[#f5efe2]">
              <Mark className="h-7 w-7 text-[#bd4f2a]" />
              <span className="font-['Fraunces'] text-2xl font-semibold">Foxglove</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#b9a994]">
              Small-batch coffee roasted on a 12kg drum in the River Arts District,
              Asheville. Roasted Tuesday, shipped Wednesday.
            </p>
          </div>
          <FooterCol
            title="Shop"
            base={base}
            links={[
              ["Single origins", `${base}/coffees`],
              ["Subscription", `${base}/subscription`],
              ["Gift a bag", `${base}/subscription`],
            ]}
          />
          <FooterCol
            title="Roastery"
            base={base}
            links={[
              ["Our story", `${base}/story`],
              ["Visit us", `${base}/visit`],
              ["Wholesale", `${base}/visit`],
            ]}
          />
          <div>
            <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#b9a994]">
              Roastery
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#e8dcc8]">
              191 Lyman Street
              <br />
              Asheville, NC 28801
              <br />
              <span className="text-[#b9a994]">Wed–Sun · 7am–3pm</span>
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-[#9c8c78] md:flex-row">
            <span>© {new Date().getFullYear()} Foxglove Coffee Co. A fictional roastery.</span>
            <span className="font-['JetBrains_Mono']">Brewed with care in the Blue Ridge.</span>
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
  base: string
  links: [string, string][]
}) {
  return (
    <div>
      <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#b9a994]">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([label, to]) => (
          <li key={label + to}>
            <NavLink
              to={to}
              className="text-[#e8dcc8] transition-colors hover:text-[#e29a6f]"
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
/* Pages                                                               */
/* ------------------------------------------------------------------ */

function Home({ base }: { base: string }) {
  const featured = COFFEES.slice(0, 3)
  return (
    <Page>
      {/* Hero — asymmetric, offset image, no centered stock hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
        <div className="grid items-end gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2a1c12]/15 px-3 py-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#6b5b4d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#bd4f2a]" />
              Roasted this Tuesday
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mt-6 font-['Fraunces'] text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.02em] text-[#2a1c12] md:text-7xl"
            >
              Coffee with a
              <br />
              <span className="italic text-[#bd4f2a]">sense of place.</span>
            </motion.h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#5a4a3c]">
              We buy a handful of lots each season, roast them light enough to taste
              the farm, and ship within a day of the roast. No blends, no filler —
              just six coffees we're genuinely excited about right now.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#bd4f2a] px-6 text-[#f5efe2] hover:bg-[#a8431f]"
                >
                  <NavLink to={`${base}/coffees`}>
                    Shop this week&apos;s roast
                  </NavLink>
                </Button>
              </Magnetic>
              <NavLink
                to={`${base}/story`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2a1c12] underline-offset-4 hover:text-[#bd4f2a] hover:underline"
              >
                How we source <ArrowUpRight className="h-4 w-4" />
              </NavLink>
            </div>
          </div>

          {/* Offset stacked image card */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 28, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="ml-auto w-[78%] overflow-hidden rounded-2xl border-4 border-[#f5efe2] shadow-xl shadow-black/15"
            >
              <img
                src="https://picsum.photos/seed/foxglove-roaster-drum/640/760"
                alt="Drum roaster cooling a fresh batch in the Foxglove roastery"
                width={640}
                height={760}
                loading="eager"
                className="aspect-[5/6] w-full object-cover saturate-[0.85] sepia-[0.12]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -18, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: -5 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
              className="absolute -bottom-6 left-0 w-[46%] overflow-hidden rounded-xl border-4 border-[#f5efe2] shadow-lg shadow-black/15"
            >
              <img
                src="https://picsum.photos/seed/foxglove-beans-scoop/360/360"
                alt="A scoop of just-roasted single-origin beans"
                width={360}
                height={360}
                loading="lazy"
                className="aspect-square w-full object-cover saturate-[0.9] sepia-[0.1]"
              />
            </motion.div>
            <div className="absolute -right-2 top-6 rotate-[8deg] rounded-full bg-[#2a1c12] px-3 py-2 text-center font-['JetBrains_Mono'] text-[10px] uppercase leading-tight tracking-[0.15em] text-[#f5efe2] shadow-lg">
              Est.
              <br />
              2019
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Ethiopia",
          "Colombia",
          "Rwanda",
          "Roasted to order",
          "Zambia",
          "Guatemala",
          "Mexico",
          "Single origin only",
        ]}
      />

      {/* This week on the roaster */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#bd4f2a]">
              On the roaster
            </p>
            <h2 className="mt-2 font-['Fraunces'] text-3xl font-semibold tracking-tight md:text-5xl">
              Three to start with
            </h2>
          </div>
          <NavLink
            to={`${base}/coffees`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2a1c12] underline-offset-4 hover:text-[#bd4f2a] hover:underline"
          >
            See all six <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2a1c12]/12 bg-[#fbf7ee] transition-shadow hover:shadow-xl hover:shadow-black/10">
                <div className="overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${c.seed}/520/360`}
                    alt={`Coffee landscape evoking ${c.name}, ${c.country}`}
                    width={520}
                    height={360}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover saturate-[0.85] sepia-[0.12] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <ProcessTag process={c.process} />
                    <span className="font-['Fraunces'] text-xl">${c.price}</span>
                  </div>
                  <h3 className="mt-3 font-['Fraunces'] text-2xl font-semibold leading-tight">
                    {c.name}
                  </h3>
                  <p className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#7d6a57]">
                    {c.country} · {c.region}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#5a4a3c]">
                    {c.notes.join(" · ")}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats / counters */}
      <section className="border-y border-[#2a1c12]/12 bg-[#efe6d3]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-4 md:px-8">
          {[
            { icon: Sprout, n: 14, suffix: "", label: "Farm partners across 6 origins" },
            { icon: Mountain, n: 1, suffix: "", label: "Day from roast to your doorstep", note: true },
            { icon: Coffee, n: 9, suffix: "k", label: "Bags roasted to order last year" },
            { icon: Leaf, n: 100, suffix: "%", label: "Compostable bags & shipping" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="flex flex-col">
                <s.icon className="h-6 w-6 text-[#bd4f2a]" />
                <p className="mt-4 font-['Fraunces'] text-4xl font-semibold md:text-5xl">
                  {s.note ? "<" : ""}
                  <Counter to={s.n} suffix={s.suffix} />
                </p>
                <p className="mt-2 max-w-[14rem] text-sm leading-snug text-[#5a4a3c]">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote / pull */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8 md:py-28">
        <Quote className="mx-auto h-8 w-8 text-[#bd4f2a]" />
        <p className="mt-6 font-['Fraunces'] text-2xl font-medium italic leading-snug tracking-tight md:text-4xl">
          &ldquo;We&apos;d rather sell out of a coffee than blend it into something
          that lasts all year. Freshness is a sourcing decision, not a label.&rdquo;
        </p>
        <p className="mt-6 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#7d6a57]">
          Della Reyes — Head Roaster
        </p>
      </section>
    </Page>
  )
}

function Coffees() {
  const [filter, setFilter] = useState<"All" | Process>("All")
  const filters: ("All" | Process)[] = ["All", "Washed", "Natural", "Honey"]
  const shown = filter === "All" ? COFFEES : COFFEES.filter((c) => c.process === filter)

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-14 md:px-8 md:pt-20">
        <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#bd4f2a]">
          The menu · Summer 2026
        </p>
        <h1 className="mt-3 max-w-2xl font-['Fraunces'] text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
          Six coffees, hovering between fruit and chocolate.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#5a4a3c]">
          Hover a coffee to see where it grew. Every lot is roasted in small
          batches and ground to order — pick your origin and we&apos;ll do the rest.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter by process">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "border-[#2a1c12] bg-[#2a1c12] text-[#f5efe2]"
                  : "border-[#2a1c12]/20 text-[#6b5b4d] hover:border-[#2a1c12]/50 hover:text-[#2a1c12]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section id="order" className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <CoffeeMenu items={shown} />
        <p className="mt-6 font-['JetBrains_Mono'] text-xs text-[#7d6a57]">
          {shown.length} coffee{shown.length === 1 ? "" : "s"} · prices per 12oz bag, whole bean or ground
        </p>
      </section>
    </Page>
  )
}

function Subscription({ base }: { base: string }) {
  const plans = [
    {
      name: "The Single",
      cadence: "Every 2 weeks",
      price: 19,
      blurb: "One rotating single origin, roaster's pick. Perfect for one daily brewer.",
      features: ["1 × 12oz bag", "Roaster's choice each drop", "Skip or pause anytime"],
      featured: false,
    },
    {
      name: "The Pair",
      cadence: "Every 2 weeks",
      price: 35,
      blurb: "Two contrasting origins — one bright and washed, one fruity and natural.",
      features: ["2 × 12oz bags", "Always a fruit + chocolate pair", "Tasting card in every box", "Free shipping"],
      featured: true,
    },
    {
      name: "The Cellar",
      cadence: "Monthly",
      price: 64,
      blurb: "A four-bag tour of the season for households that go through coffee.",
      features: ["4 × 12oz bags", "First access to micro-lots", "Brew guide booklet", "Free shipping"],
      featured: false,
    },
  ]

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#bd4f2a]">
              Subscription
            </p>
            <h1 className="mt-3 font-['Fraunces'] text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
              Fresh coffee, on a rhythm that suits you.
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-[#5a4a3c]">
            Set the cadence, we&apos;ll handle the curation. Every box ships within a
            day of roast and you can skip, swap, or pause from a single text.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1 ${
                  p.featured
                    ? "border-transparent bg-[#2a1c12] text-[#f5efe2] shadow-xl shadow-black/20 md:-mt-4 md:mb-4"
                    : "border-[#2a1c12]/15 bg-[#fbf7ee]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-['Fraunces'] text-2xl font-semibold">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-full bg-[#bd4f2a] px-2.5 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.15em]">
                      Most loved
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider ${
                    p.featured ? "text-[#d8b8a3]" : "text-[#7d6a57]"
                  }`}
                >
                  {p.cadence}
                </p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="font-['Fraunces'] text-5xl font-semibold">${p.price}</span>
                  <span className={p.featured ? "text-[#d8b8a3]" : "text-[#7d6a57]"}>
                    /box
                  </span>
                </p>
                <p
                  className={`mt-4 text-sm leading-relaxed ${
                    p.featured ? "text-[#e8dcc8]" : "text-[#5a4a3c]"
                  }`}
                >
                  {p.blurb}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          p.featured ? "bg-[#bd4f2a]" : "bg-[#bd4f2a]"
                        }`}
                      />
                      <span className={p.featured ? "text-[#e8dcc8]" : "text-[#3f3328]"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 pt-1">
                  <Button
                    className={`w-full rounded-full ${
                      p.featured
                        ? "bg-[#bd4f2a] text-[#f5efe2] hover:bg-[#cf5c33]"
                        : "bg-[#2a1c12] text-[#f5efe2] hover:bg-[#bd4f2a]"
                    }`}
                  >
                    Start {p.name}
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#2a1c12]/12 bg-[#efe6d3]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <h2 className="font-['Fraunces'] text-3xl font-semibold tracking-tight md:text-4xl">
            How a box comes together
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sprout,
                t: "We cup the season",
                d: "Every Monday we taste through samples and lock in the lots worth roasting.",
              },
              {
                icon: Coffee,
                t: "We roast Tuesday",
                d: "Your beans hit the drum the morning your box is built — never from a shelf.",
              },
              {
                icon: Package,
                t: "It ships Wednesday",
                d: "Sealed warm, in a compostable bag, with a card on how we'd brew it.",
              },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <div className="flex flex-col">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2a1c12]/20 bg-[#f5efe2]">
                    <s.icon className="h-5 w-5 text-[#bd4f2a]" />
                  </div>
                  <p className="mt-4 font-['JetBrains_Mono'] text-xs text-[#7d6a57]">
                    0{i + 1}
                  </p>
                  <h3 className="mt-1 font-['Fraunces'] text-xl font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5a4a3c]">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#2a1c12] px-6 text-[#f5efe2] hover:bg-[#bd4f2a]"
              >
                <NavLink to={`${base}/coffees`}>Browse the coffees first</NavLink>
              </Button>
            </Magnetic>
          </div>
        </div>
      </section>
    </Page>
  )
}

function Story() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
        <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#bd4f2a]">
          Our story
        </p>
        <h1 className="mt-3 max-w-3xl font-['Fraunces'] text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
          We started with one drum roaster and a stubborn idea about freshness.
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-5 text-[17px] leading-relaxed text-[#3f3328]">
            <p>
              Foxglove began in 2019 in a corner of a River Arts District warehouse,
              with a secondhand 12-kilo roaster Della bought from a closing café in
              Knoxville. The idea was simple and a little contrarian: roast less, sell
              it faster, and never let a bag sit long enough to go flat.
            </p>
            <p>
              We buy directly through a handful of importers we trust and the same
              farms season after season. When a lot is gone, it&apos;s gone — and
              we&apos;d rather post &ldquo;sold out&rdquo; than stretch it into a blend
              that tastes the same in July as it did in January.
            </p>
            <p>
              These days there are six of us. We still roast every Tuesday, still write
              the brew cards by hand, and still taste every batch before it leaves the
              building.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://picsum.photos/seed/foxglove-warehouse/420/520"
              alt="The Foxglove roastery in a converted River Arts District warehouse"
              width={420}
              height={520}
              loading="lazy"
              className="mt-8 aspect-[4/5] w-full rounded-xl object-cover saturate-[0.85] sepia-[0.12]"
            />
            <img
              src="https://picsum.photos/seed/foxglove-cupping-table/420/520"
              alt="A cupping table set with sample bowls and spoons"
              width={420}
              height={520}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-xl object-cover saturate-[0.85] sepia-[0.12]"
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-[#2a1c12]/12 bg-[#efe6d3]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <h2 className="font-['Fraunces'] text-3xl font-semibold tracking-tight md:text-4xl">
            A few markers along the way
          </h2>
          <div className="mt-10 space-y-0">
            {[
              ["2019", "First roast", "Della and a borrowed drum roaster pull their first 12kg batch of Guatemalan washed."],
              ["2021", "Direct trade", "We sign our first multi-year agreement with a co-op in Huila, Colombia."],
              ["2023", "The café opens", "A six-seat tasting bar opens at the front of the roastery on Lyman Street."],
              ["2025", "Carbon-neutral shipping", "Every box ships compostable and offset; bags go fully home-compostable."],
            ].map(([year, t, d], i) => (
              <Reveal key={year} delay={i * 0.05}>
                <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-[#2a1c12]/15 py-6 md:grid-cols-[120px_1fr] md:gap-10 md:py-8">
                  <span className="font-['Fraunces'] text-2xl font-semibold text-[#bd4f2a] md:text-3xl">
                    {year}
                  </span>
                  <div>
                    <h3 className="font-['Fraunces'] text-xl font-semibold">{t}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#5a4a3c]">
                      {d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { n: 6, suffix: "", label: "People who taste every batch" },
            { n: 48, suffix: "h", label: "From green bean to your door, max" },
            { n: 7, suffix: "", label: "Seasons buying from the same farms" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-['Fraunces'] text-5xl font-semibold md:text-6xl">
                <Counter to={s.n} suffix={s.suffix} />
              </p>
              <p className="mt-3 max-w-[16rem] leading-snug text-[#5a4a3c]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </Page>
  )
}

function Visit() {
  const [sent, setSent] = useState(false)
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
        <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-[#bd4f2a]">
          Visit
        </p>
        <h1 className="mt-3 max-w-2xl font-['Fraunces'] text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
          Come taste a few before you commit.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#5a4a3c]">
          The tasting bar at the front of the roastery pours whatever&apos;s freshest.
          Six seats, no laptops, and a free cupping flight every Saturday at 10.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr]">
          {/* Info + hours */}
          <div className="space-y-8">
            <div className="overflow-hidden rounded-2xl border-4 border-[#fbf7ee] shadow-lg shadow-black/10">
              <img
                src="https://picsum.photos/seed/foxglove-cafe-bar/720/440"
                alt="The six-seat tasting bar at the front of the Foxglove roastery"
                width={720}
                height={440}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover saturate-[0.85] sepia-[0.1]"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#bd4f2a]" />
                <div>
                  <p className="font-semibold">The Roastery</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5a4a3c]">
                    191 Lyman Street
                    <br />
                    Asheville, NC 28801
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#bd4f2a]" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5a4a3c]">
                    Wed–Sun · 7am–3pm
                    <br />
                    Cupping flight · Sat 10am
                  </p>
                </div>
              </div>
            </div>

            {/* Hand-built map block instead of an embed */}
            <div className="relative overflow-hidden rounded-2xl border border-[#2a1c12]/15 bg-[#e7ede0]">
              <svg viewBox="0 0 400 220" className="h-44 w-full" aria-hidden>
                <rect width="400" height="220" fill="#e7ede0" />
                <path d="M0 70 H400 M0 150 H400 M120 0 V220 M280 0 V220" stroke="#c7d1bb" strokeWidth="10" />
                <path d="M0 110 C120 90 200 130 400 100" stroke="#bcd0d8" strokeWidth="14" fill="none" />
                <circle cx="200" cy="150" r="9" fill="#bd4f2a" />
                <circle cx="200" cy="150" r="16" fill="none" stroke="#bd4f2a" strokeWidth="2" opacity="0.5" />
              </svg>
              <span className="absolute bottom-3 left-3 rounded-full bg-[#2a1c12] px-3 py-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#f5efe2]">
                River Arts District
              </span>
            </div>
          </div>

          {/* Contact / wholesale form */}
          <div className="rounded-2xl border border-[#2a1c12]/15 bg-[#fbf7ee] p-7 md:p-9">
            <h2 className="font-['Fraunces'] text-2xl font-semibold">Say hello</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5a4a3c]">
              Wholesale enquiry, private cupping, or just a question about a coffee —
              we read every note.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Name</span>
                  <Input
                    required
                    placeholder="Jamie Rivers"
                    className="mt-1.5 border-[#2a1c12]/20 bg-[#f5efe2] focus-visible:ring-[#bd4f2a]"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Email</span>
                  <Input
                    required
                    type="email"
                    placeholder="you@email.com"
                    className="mt-1.5 border-[#2a1c12]/20 bg-[#f5efe2] focus-visible:ring-[#bd4f2a]"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium">What can we help with?</span>
                <textarea
                  required
                  rows={4}
                  placeholder="I run a café in West Asheville and I'm looking for a house single origin…"
                  className="mt-1.5 w-full rounded-md border border-[#2a1c12]/20 bg-[#f5efe2] px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#bd4f2a]"
                />
              </label>
              <Magnetic strength={0.25}>
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full bg-[#bd4f2a] px-6 text-[#f5efe2] hover:bg-[#a8431f]"
                >
                  {sent ? "Thanks — we'll be in touch" : "Send message"}
                </Button>
              </Magnetic>
              {sent && (
                <p className="text-sm text-[#4a5a3d]" role="status">
                  Got it. We reply within a day or two between roasts.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/* Site shell with nested routes                                       */
/* ------------------------------------------------------------------ */

export default function Foxglove() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <Layout base={base}>
      <Routes>
        <Route index element={<Home base={base} />} />
        <Route path="coffees" element={<Coffees />} />
        <Route path="subscription" element={<Subscription base={base} />} />
        <Route path="story" element={<Story />} />
        <Route path="visit" element={<Visit />} />
        <Route path="*" element={<Home base={base} />} />
      </Routes>
    </Layout>
  )
}
