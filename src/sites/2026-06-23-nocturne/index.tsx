import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  Link,
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
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import {
  ArrowUpRight,
  Clock,
  Disc3,
  MapPin,
  Music2,
  Quote,
  Volume2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import {
  bar,
  houseRules,
  kitchen,
  nights,
  residents,
  rig,
  type MenuSection,
} from "./data"

/* ------------------------------------------------------------------ *
 * Tokens — a nocturnal palette: near-black grounds, bone text, one
 * confident amber "lamplight" accent. Kept as inline values so the
 * shared tailwind config stays untouched.
 * ------------------------------------------------------------------ */

const INK = "#0c0b0e"
const PANEL = "#141117"
const BONE = "#ece4d6"
const MUTED = "#a39a8c"
const AMBER = "#eaa94e"
const EMBER = "#c8553a"

const display = "font-['Cormorant_Garamond']"
const bodyFont = "font-['DM_Sans']"
const mono = "font-['IBM_Plex_Mono'] uppercase tracking-[0.22em]"

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

/* ------------------------------------------------------------------ *
 * Small shared primitives
 * ------------------------------------------------------------------ */

function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn(mono, "text-[11px]", className)} style={{ color: AMBER }}>
      {children}
    </span>
  )
}

/** A magnetic CTA. `tone` switches between the filled amber and a quiet
 *  outline so a section never has two competing buttons. */
function Cta({
  children,
  to,
  href,
  tone = "solid",
}: {
  children: ReactNode
  /** Internal route (preferred) */
  to?: string
  /** Same-page anchor fallback */
  href?: string
  tone?: "solid" | "ghost"
}) {
  const cls = cn(
    bodyFont,
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium tracking-[0.04em] transition-colors duration-200",
    tone === "solid" ? "text-[#0c0b0e]" : "border text-[#ece4d6] hover:bg-white/5",
  )
  const style =
    tone === "solid"
      ? { backgroundColor: AMBER }
      : { borderColor: "rgba(236,228,214,0.25)" }
  const inner = (
    <>
      {children}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.75}
      />
    </>
  )
  return (
    <Magnetic strength={0.35}>
      {to ? (
        <Link to={to} className={cls} style={style}>
          {inner}
        </Link>
      ) : (
        <a href={href ?? "#"} className={cls} style={style}>
          {inner}
        </a>
      )}
    </Magnetic>
  )
}

/** A record that turns while the room is "spinning". Holds still under
 *  prefers-reduced-motion. */
function Vinyl({ size = 240, className }: { size?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={reduce ? undefined : { duration: 7, ease: "linear", repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r="49" fill="#08070a" />
        {[44, 40, 36, 32, 28].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(236,228,214,0.08)"
            strokeWidth="0.5"
          />
        ))}
        <circle cx="50" cy="50" r="18" fill={AMBER} />
        <circle cx="50" cy="50" r="18" fill="url(#sheen)" />
        <circle cx="50" cy="50" r="2.4" fill="#08070a" />
        <defs>
          <radialGradient id="sheen" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

/** Count-up that fires once on scroll-in. */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Featured interaction — a cursor "lamplight" that lifts the dark and
 * reveals the room beneath it. Touch / reduced-motion get a soft,
 * static centre glow so nothing is hidden behind a cursor.
 * ------------------------------------------------------------------ */

function Lamplight({ base }: { base: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const cx = pos ? `${pos.x}px` : "50%"
  const cy = pos ? `${pos.y}px` : "42%"

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (reduce) return
        const r = ref.current?.getBoundingClientRect()
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
      }}
      onMouseLeave={() => setPos(null)}
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden"
      style={{ backgroundColor: INK }}
    >
      {/* the room, deep in the dark */}
      <img
        src={img("nocturne-listening-room-bar", 1800, 1100)}
        alt="The low-lit listening room at Nocturne, records lining the back wall"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(0.65) brightness(0.62) sepia(0.32) hue-rotate(-12deg)" }}
      />
      {/* amber wash so picsum cohere with the brand */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{ background: "linear-gradient(180deg, rgba(18,12,8,0.55), rgba(10,8,12,0.82))" }}
      />
      {/* the lamplight: a hole punched in the darkness at the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background] duration-200"
        style={{
          background: `radial-gradient(460px circle at ${cx} ${cy}, transparent 0%, transparent 16%, rgba(10,8,12,0.74) 58%, rgba(10,8,12,0.95) 100%)`,
        }}
      />
      {/* warm glow riding on top of the hole */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen transition-[background] duration-200"
        style={{
          background: `radial-gradient(360px circle at ${cx} ${cy}, rgba(234,169,78,0.22), transparent 68%)`,
        }}
      />

      {/* copy */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-20">
        <Reveal>
          <Kicker>Listening bar &amp; kitchen · Bermondsey</Kicker>
        </Reveal>
        <Reveal delay={0.06}>
          <h1
            className={cn(display, "mt-5 max-w-3xl text-[15vw] font-medium leading-[0.86] sm:text-[7.5rem]")}
            style={{ color: BONE }}
          >
            Dinner with{" "}
            <span className="italic" style={{ color: AMBER }}>
              the lights low
            </span>{" "}
            and the volume considered.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className={cn(bodyFont, "mt-6 max-w-md text-[15px] leading-relaxed")} style={{ color: MUTED }}>
            Small plates, rare records and a valve amp warming in the corner.
            Move your cursor — the room only shows itself to those who lean in.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta to={`${base}/visit`}>Reserve a table</Cta>
            <Cta to={`${base}/sessions`} tone="ghost">
              Tonight's session
            </Cta>
          </div>
        </Reveal>
      </div>

      <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/5" />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Layout — persistent nav + footer
 * ------------------------------------------------------------------ */

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "menu", label: "Menu" },
  { to: "sessions", label: "Sessions" },
  { to: "visit", label: "Visit" },
]

function Brand({ base }: { base: string }) {
  return (
    <NavLink to={base} end className="group inline-flex items-center gap-2.5">
      <span
        className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-white/15 transition-colors group-hover:ring-white/35"
        style={{ backgroundColor: "#08070a" }}
      >
        <Disc3 className="h-4 w-4" strokeWidth={1.5} style={{ color: AMBER }} />
      </span>
      <span className={cn(display, "text-2xl font-semibold leading-none tracking-tight")} style={{ color: BONE }}>
        Nocturne
      </span>
    </NavLink>
  )
}

function Nav({ base }: { base: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md" style={{ backgroundColor: "rgba(12,11,14,0.78)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Brand base={base} />
        <nav className={cn(bodyFont, "flex items-center gap-1 sm:gap-2")}>
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              to={n.to ? `${base}/${n.to}` : base}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-3 py-1.5 text-[13px] tracking-[0.02em] transition-colors duration-200",
                  isActive ? "text-[#ece4d6]" : "text-[#a39a8c] hover:text-[#ece4d6]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-px left-1/2 h-px w-5 -translate-x-1/2"
                      style={{ backgroundColor: AMBER }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden sm:block">
          <Cta to={`${base}/visit`}>Reserve</Cta>
        </div>
      </div>
    </header>
  )
}

function Footer({ base }: { base: string }) {
  return (
    <footer className="border-t border-white/10" style={{ backgroundColor: "#08070a" }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-10">
        <div>
          <Brand base={base} />
          <p className={cn(bodyFont, "mt-5 max-w-xs text-sm leading-relaxed")} style={{ color: MUTED }}>
            A record bar and small-plates kitchen under the railway arches.
            Wednesday to Sunday, until the last side ends.
          </p>
        </div>
        <div className={bodyFont}>
          <p className={cn(mono, "text-[10px]")} style={{ color: AMBER }}>
            Find us
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: BONE }}>
            Arch 11, Druid Street
            <br />
            Bermondsey, London SE1
          </p>
          <p className="mt-3 text-sm" style={{ color: MUTED }}>
            hello@nocturne.bar
          </p>
        </div>
        <div className={bodyFont}>
          <p className={cn(mono, "text-[10px]")} style={{ color: AMBER }}>
            Hours
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: BONE }}>
            Wed – Sat · 6pm – 1am
            <br />
            Sun · 5pm – 11pm
            <br />
            <span style={{ color: MUTED }}>Closed Mon &amp; Tue</span>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs sm:flex-row sm:px-10" style={{ color: MUTED }}>
          <span className={bodyFont}>© {new Date().getFullYear()} Nocturne Listening Bar Ltd.</span>
          <span className={cn(mono, "text-[10px]")}>We play records, not requests</span>
        </div>
      </div>
    </footer>
  )
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.main>
  )
}

/* ------------------------------------------------------------------ *
 * Section helpers
 * ------------------------------------------------------------------ */

function SectionHead({
  kicker,
  title,
  lede,
}: {
  kicker: string
  title: ReactNode
  lede?: string
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <Kicker>{kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={cn(display, "mt-4 text-4xl font-medium leading-[1.02] sm:text-5xl")} style={{ color: BONE }}>
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className={cn(bodyFont, "mt-5 text-[15px] leading-relaxed")} style={{ color: MUTED }}>
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}

function MenuList({ section }: { section: MenuSection }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
        <h3 className={cn(display, "text-2xl font-medium")} style={{ color: BONE }}>
          {section.heading}
        </h3>
        <span className={cn(mono, "text-[10px]")} style={{ color: AMBER }}>
          {section.kicker}
        </span>
      </div>
      <ul className="mt-2">
        {section.plates.map((p) => (
          <li
            key={p.name}
            className="group flex items-baseline gap-4 border-b border-white/[0.06] py-4 transition-colors duration-200 hover:bg-white/[0.02]"
          >
            <div className="min-w-0 flex-1">
              <span
                className={cn(bodyFont, "text-[15px] font-medium transition-transform duration-200 group-hover:translate-x-1 inline-block")}
                style={{ color: BONE }}
              >
                {p.name}
              </span>
              <span className={cn(bodyFont, "ml-0 block text-[13px] sm:ml-3 sm:inline")} style={{ color: MUTED }}>
                {p.note}
              </span>
            </div>
            <span className={cn(mono, "shrink-0 text-[12px]")} style={{ color: AMBER }}>
              £{p.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

function Home({ base }: { base: string }) {
  const stats = [
    { to: 412, suffix: "", label: "Nights hosted since 2021" },
    { to: 9, suffix: "k", label: "Records in the back-wall library" },
    { to: 28, suffix: "", label: "Seats — and not one more" },
  ]
  return (
    <Page>
      <Lamplight base={base} />

      {/* ethos + now spinning */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <SectionHead
              kicker="The idea"
              title={
                <>
                  A room built around{" "}
                  <span className="italic" style={{ color: AMBER }}>
                    one good sound system
                  </span>{" "}
                  and a short, sharp kitchen.
                </>
              }
              lede="We opened Nocturne because nowhere would let us eat well and listen properly at the same time. So we put a valve amp where the telly would go, hung corner horns either side of the bar, and asked the chef to cook for the dark. The result is a hi-fi bar that happens to serve some of the best small plates in south London."
            />
            <div className="mt-10 flex flex-wrap gap-3">
              <Cta to={`${base}/menu`}>See the kitchen</Cta>
              <Cta to={`${base}/sessions`} tone="ghost">
                Meet the selectors
              </Cta>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div
              className="relative flex flex-col items-center gap-6 rounded-2xl border border-white/10 px-8 py-10"
              style={{ backgroundColor: PANEL }}
            >
              <div className="flex items-center gap-2 self-start">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: EMBER }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: EMBER }} />
                </span>
                <span className={cn(mono, "text-[10px]")} style={{ color: MUTED }}>
                  Now spinning
                </span>
              </div>
              <Vinyl size={210} />
              <div className="text-center">
                <p className={cn(display, "text-2xl font-medium")} style={{ color: BONE }}>
                  Alice Coltrane
                </p>
                <p className={cn(bodyFont, "text-sm")} style={{ color: MUTED }}>
                  Journey in Satchidananda · A1
                </p>
              </div>
              <div className="flex items-center gap-2" style={{ color: AMBER }}>
                <Volume2 className="h-4 w-4" strokeWidth={1.75} />
                <span className={cn(mono, "text-[10px]")}>Side A, all the way down</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* stats band */}
      <section className="border-y border-white/10" style={{ backgroundColor: "#08070a" }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3 sm:px-10">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center sm:text-left">
                <p className={cn(display, "text-6xl font-medium")} style={{ color: AMBER }}>
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className={cn(bodyFont, "mt-2 text-sm")} style={{ color: MUTED }}>
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured plates with imagery */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <SectionHead
          kicker="From the pass"
          title="Three plates the room keeps asking for."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { name: "Cured trout", note: "blood orange, smoked cream", seed: "cured-trout-citrus-plate" },
            { name: "Short rib", note: "white miso, charred onion", seed: "braised-short-rib-dark-plate" },
            { name: "Burnt honey panna cotta", note: "thyme, candied lemon", seed: "honey-panna-cotta-dessert" },
          ].map((d, i) => (
            <Reveal key={d.name} delay={i * 0.08}>
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-white/10" style={{ backgroundColor: PANEL }}>
                  <img
                    src={img(d.seed, 700, 800)}
                    alt={`${d.name} — ${d.note}`}
                    loading="lazy"
                    className="aspect-[7/8] w-full object-cover grayscale-[0.35] transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                    style={{ filter: "brightness(0.82) saturate(0.9)" }}
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-3">
                  <span className={cn(display, "text-xl font-medium")} style={{ color: BONE }}>
                    {d.name}
                  </span>
                  <span className={cn(bodyFont, "text-[13px]")} style={{ color: MUTED }}>
                    {d.note}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* quote */}
      <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10">
        <Reveal>
          <blockquote className="relative rounded-2xl border border-white/10 px-8 py-12 text-center sm:px-16" style={{ backgroundColor: PANEL }}>
            <Quote className="mx-auto h-7 w-7" strokeWidth={1.25} style={{ color: AMBER }} />
            <p className={cn(display, "mt-5 text-3xl font-medium italic leading-snug sm:text-4xl")} style={{ color: BONE }}>
              "The closest thing London has to dinner inside a great record collection."
            </p>
            <footer className={cn(mono, "mt-6 text-[11px]")} style={{ color: MUTED }}>
              — The Evening Standard, Bars of the Year
            </footer>
          </blockquote>
        </Reveal>
      </section>
    </Page>
  )
}

function Menu() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:px-10">
        <SectionHead
          kicker="Kitchen &amp; bar"
          title={
            <>
              A short menu, cooked{" "}
              <span className="italic" style={{ color: AMBER }}>
                for the dark
              </span>
              .
            </>
          }
          lede="Everything is made to share and made to land between records. The list changes with the market and the season — this is roughly where we are tonight."
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
          <div className="space-y-14">
            <div className="flex items-center gap-3">
              <Music2 className="h-4 w-4" strokeWidth={1.75} style={{ color: AMBER }} />
              <span className={cn(mono, "text-[11px]")} style={{ color: BONE }}>
                The Kitchen
              </span>
            </div>
            {kitchen.map((s) => (
              <Reveal key={s.heading}>
                <MenuList section={s} />
              </Reveal>
            ))}
          </div>
          <div className="space-y-14">
            <div className="flex items-center gap-3">
              <Disc3 className="h-4 w-4" strokeWidth={1.75} style={{ color: AMBER }} />
              <span className={cn(mono, "text-[11px]")} style={{ color: BONE }}>
                The Bar
              </span>
            </div>
            {bar.map((s) => (
              <Reveal key={s.heading}>
                <MenuList section={s} />
              </Reveal>
            ))}
            <Reveal>
              <div className="rounded-2xl border border-white/10 p-7" style={{ backgroundColor: PANEL }}>
                <p className={cn(mono, "text-[10px]")} style={{ color: AMBER }}>
                  House note
                </p>
                <p className={cn(display, "mt-3 text-2xl font-medium italic leading-snug")} style={{ color: BONE }}>
                  No spirits flashier than the record on the deck.
                </p>
                <p className={cn(bodyFont, "mt-3 text-sm leading-relaxed")} style={{ color: MUTED }}>
                  Our list leans low-intervention, low-volume and high-flavour.
                  Ask the bartender what's open — they'll have already tasted it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Page>
  )
}

function Sessions() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:px-10">
        <SectionHead
          kicker="The programme"
          title="Sessions, not sets."
          lede="Every night has a shape — a selector, a theme, a record played start to finish. No requests, no shuffle, no fading out the good part. Here's who's on, and what they bring."
        />
      </section>

      {/* residents */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {residents.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10" style={{ backgroundColor: PANEL }}>
                <div className="relative overflow-hidden">
                  <img
                    src={img(r.seed, 600, 640)}
                    alt={`${r.name}, resident selector`}
                    loading="lazy"
                    className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                    style={{ filter: "brightness(0.8) sepia(0.2)" }}
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className={cn(display, "text-2xl font-medium")} style={{ color: BONE }}>
                    {r.name}
                  </h3>
                  <p className={cn(mono, "mt-1 text-[10px]")} style={{ color: AMBER }}>
                    {r.style}
                  </p>
                  <p className={cn(bodyFont, "mt-3 text-[14px] leading-relaxed")} style={{ color: MUTED }}>
                    {r.bio}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* calendar */}
      <section id="tonight" className="border-y border-white/10" style={{ backgroundColor: "#08070a" }}>
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <SectionHead kicker="What's on" title="The next five nights." />
          <ul className="mt-12 divide-y divide-white/10">
            {nights.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.05}>
                <li className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 sm:gap-8">
                  <div className="text-center" style={{ width: 56 }}>
                    <p className={cn(mono, "text-[10px]")} style={{ color: AMBER }}>
                      {n.day}
                    </p>
                    <p className={cn(display, "text-4xl font-medium leading-none")} style={{ color: BONE }}>
                      {n.date}
                    </p>
                  </div>
                  <div>
                    <p className={cn(display, "text-xl font-medium transition-transform duration-200 group-hover:translate-x-1")} style={{ color: BONE }}>
                      {n.title}
                    </p>
                    <p className={cn(bodyFont, "text-[13px]")} style={{ color: MUTED }}>
                      with {n.host}
                    </p>
                  </div>
                  <span className={cn(mono, "hidden text-[10px] sm:inline")} style={{ color: MUTED }}>
                    8pm · free entry
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* the rig */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead
            kicker="The rig"
            title="Why it sounds like that."
            lede="The whole room is tuned around one valve signal path. No screens, no laptops, no compression. Just air being moved properly."
          />
          <Reveal delay={0.1}>
            <dl className="grid gap-px overflow-hidden rounded-xl border border-white/10 sm:grid-cols-2" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              {rig.map((r) => (
                <div key={r.item} className="p-7" style={{ backgroundColor: PANEL }}>
                  <dt className={cn(mono, "text-[10px]")} style={{ color: AMBER }}>
                    {r.item}
                  </dt>
                  <dd className={cn(display, "mt-2 text-xl font-medium leading-snug")} style={{ color: BONE }}>
                    {r.spec}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}

function Visit() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"])

  const [form, setForm] = useState({ name: "", date: "", time: "20:00", party: "2" })
  const [sent, setSent] = useState(false)

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-20 sm:px-10">
        <SectionHead
          kicker="Visit"
          title={
            <>
              Find the unmarked door on{" "}
              <span className="italic" style={{ color: AMBER }}>
                Druid Street
              </span>
              .
            </>
          }
          lede="Tables are for two hours; the bar is for as long as the records hold you. Walk-ins are always welcome — but a reserved table means a seat by the horns."
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          {/* info + parallax image */}
          <div className="space-y-8">
            <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10" style={{ backgroundColor: PANEL }}>
              <motion.img
                src={img("bermondsey-railway-arch-night-bar", 900, 800)}
                alt="The arched brick entrance to Nocturne at night"
                loading="lazy"
                style={{ y, scale: reduce ? 1 : 1.22 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,8,12,0.25), rgba(10,8,12,0.7))" }} />
              <div className="absolute bottom-0 left-0 flex items-center gap-2 p-5">
                <MapPin className="h-4 w-4" strokeWidth={1.75} style={{ color: AMBER }} />
                <span className={cn(mono, "text-[11px]")} style={{ color: BONE }}>
                  Arch 11, Druid Street, SE1
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 p-6" style={{ backgroundColor: PANEL }}>
                <Clock className="h-5 w-5" strokeWidth={1.5} style={{ color: AMBER }} />
                <p className={cn(mono, "mt-4 text-[10px]")} style={{ color: AMBER }}>
                  Hours
                </p>
                <p className={cn(bodyFont, "mt-2 text-sm leading-relaxed")} style={{ color: BONE }}>
                  Wed–Sat · 6pm–1am
                  <br />
                  Sun · 5pm–11pm
                  <br />
                  <span style={{ color: MUTED }}>Closed Mon &amp; Tue</span>
                </p>
              </div>
              <div className="rounded-xl border border-white/10 p-6" style={{ backgroundColor: PANEL }}>
                <Volume2 className="h-5 w-5" strokeWidth={1.5} style={{ color: AMBER }} />
                <p className={cn(mono, "mt-4 text-[10px]")} style={{ color: AMBER }}>
                  House rules
                </p>
                <ul className={cn(bodyFont, "mt-2 space-y-1.5 text-[13px] leading-snug")} style={{ color: MUTED }}>
                  {houseRules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* reservation form */}
          <div id="reserve" className="rounded-2xl border border-white/10 p-8 sm:p-10" style={{ backgroundColor: PANEL }}>
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <Disc3 className="h-10 w-10" strokeWidth={1.25} style={{ color: AMBER }} />
                <h3 className={cn(display, "mt-5 text-3xl font-medium")} style={{ color: BONE }}>
                  We've kept you a seat.
                </h3>
                <p className={cn(bodyFont, "mt-3 max-w-xs text-sm leading-relaxed")} style={{ color: MUTED }}>
                  Table for {form.party} on {form.date || "your chosen night"} at {form.time},
                  under the name {form.name || "—"}. A confirmation is on its way.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className={cn(bodyFont, "mt-7 text-[13px] underline-offset-4 hover:underline")}
                  style={{ color: AMBER }}
                >
                  Book another night
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="space-y-6"
              >
                <div>
                  <p className={cn(mono, "text-[10px]")} style={{ color: AMBER }}>
                    Reserve a table
                  </p>
                  <h3 className={cn(display, "mt-3 text-3xl font-medium")} style={{ color: BONE }}>
                    Hold me a spot by the horns.
                  </h3>
                </div>

                <Field label="Name">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Who's the table under?"
                    className={inputCls}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date">
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Time">
                    <select
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className={inputCls}
                    >
                      {["18:00", "18:30", "19:00", "20:00", "21:00", "22:00"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Party size">
                  <div className="flex flex-wrap gap-2">
                    {["1", "2", "3", "4", "5", "6+"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setForm({ ...form, party: p })}
                        className={cn(
                          mono,
                          "h-10 w-10 rounded-full border text-[12px] transition-colors duration-200",
                        )}
                        style={
                          form.party === p
                            ? { backgroundColor: AMBER, color: INK, borderColor: AMBER }
                            : { borderColor: "rgba(236,228,214,0.2)", color: MUTED }
                        }
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>

                <Magnetic strength={0.2}>
                  <button
                    type="submit"
                    className={cn(bodyFont, "inline-flex items-center gap-2 rounded-full px-7 py-3 text-[13px] font-medium")}
                    style={{ backgroundColor: AMBER, color: INK }}
                  >
                    Request this table
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </Magnetic>
                <p className={cn(bodyFont, "text-[12px]")} style={{ color: MUTED }}>
                  We'll confirm by email within the hour. For parties over six, drop us a line directly.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Page>
  )
}

const inputCls = cn(
  "font-['DM_Sans'] w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-[#ece4d6] outline-none transition-colors duration-200 placeholder:text-[#6f675c] focus:border-[#eaa94e]",
  "border-white/15",
)

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={cn(mono, "text-[10px]")} style={{ color: MUTED }}>
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

/* ------------------------------------------------------------------ *
 * Root
 * ------------------------------------------------------------------ */

export default function Nocturne() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <div className={cn(bodyFont, "min-h-screen antialiased selection:bg-[#eaa94e] selection:text-[#0c0b0e]")} style={{ backgroundColor: INK, color: BONE }}>
      <Nav base={base} />
      <Routes>
        <Route index element={<Home base={base} />} />
        <Route path="menu" element={<Menu />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="visit" element={<Visit />} />
        <Route path="*" element={<Home base={base} />} />
      </Routes>
      <Footer base={base} />
    </div>
  )
}

export const meta: SiteMeta = {
  title: "Nocturne — Listening Bar & Kitchen",
  description:
    "A vinyl listening bar and small-plates kitchen under the Bermondsey arches. Featured interaction: a cursor 'lamplight' that lifts the dark to reveal the room, plus magnetic CTAs, a spinning now-playing record, animated counters and scroll reveals.",
  date: "2026-06-23",
  type: "Restaurant",
  interaction: "Cursor lamplight spotlight + magnetic CTAs + spinning record + animated counters",
  pages: ["Home", "Menu", "Sessions", "Visit"],
}
