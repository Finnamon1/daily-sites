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
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import {
  ArrowUpRight,
  Clock,
  Film,
  MapPin,
  Menu,
  Phone,
  Ticket,
  Train,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "The Lumen Picturehouse — a repertory cinema on Carrow Lane",
  description:
    "An independent single-screen cinema in Bristol showing restorations, 35mm prints and the films worth crossing town for. Featured interaction: hover any film in the index and its duotone poster floats to your cursor — plus an infinite showtimes marquee, magnetic ticket buttons and scroll reveals.",
  date: "2026-06-24",
  type: "Cinema / venue",
  interaction:
    "Hover image-reveal (film index floats a poster at the cursor) + infinite showtimes marquee + magnetic CTAs",
  pages: ["Home", "Now Showing", "Membership", "Visit"],
}

/* --------------------------------------------------------------- palette */
// cream #f3ebdd · ink #1c1411 · oxblood panel #2a1012 · ONE accent: tungsten red #b73a2c
// gold #d6a444 is used ONLY on the dark oxblood grounds (small labels/large display).
const CREAM = "#f3ebdd"
const CREAM_DEEP = "#ebe0cc"
const INK = "#1c1411"
const OXBLOOD = "#2a1012"
const RED = "#b73a2c"
const RED_DEEP = "#9a2f23"
const GOLD = "#d6a444"
// Solid muted ink for SMALL text on cream — ≈6:1, clears AA where low-alpha ink doesn't.
const MUTED = "#5f554d"

const DISPLAY = "'Fraunces', Georgia, serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

/* ----------------------------------------------------------------- data */

type FilmTag = "4K Restoration" | "35mm Print" | "New Release" | "Director's Cut"

type FilmItem = {
  title: string
  year: number
  director: string
  country: string
  runtime: string
  dek: string
  showtime: string
  tag: FilmTag
  seed: string
  hue: number // duotone tint hue
}

const FILMS: FilmItem[] = [
  {
    title: "In the Mood for Love",
    year: 2000,
    director: "Wong Kar-wai",
    country: "Hong Kong",
    runtime: "98 min",
    dek: "Two neighbours, a rented room, a love kept in the corner of the eye. The 4K restoration is almost unbearably beautiful.",
    showtime: "Tonight · 8:15",
    tag: "4K Restoration",
    seed: "crimson-corridor-rain",
    hue: 350,
  },
  {
    title: "Stalker",
    year: 1979,
    director: "Andrei Tarkovsky",
    country: "USSR",
    runtime: "162 min",
    dek: "A guide leads two men into the Zone, where the room at the centre is said to grant your deepest wish. Slow cinema's high cathedral.",
    showtime: "Thu · 7:00",
    tag: "35mm Print",
    seed: "misted-industrial-marsh",
    hue: 150,
  },
  {
    title: "Paris, Texas",
    year: 1984,
    director: "Wim Wenders",
    country: "West Germany",
    runtime: "145 min",
    dek: "A man walks out of the desert with no words and a son he barely knows. Ry Cooder's slide guitar does the talking.",
    showtime: "Fri · 8:30",
    tag: "4K Restoration",
    seed: "desert-highway-dusk",
    hue: 28,
  },
  {
    title: "Cléo from 5 to 7",
    year: 1962,
    director: "Agnès Varda",
    country: "France",
    runtime: "90 min",
    dek: "Ninety real-time minutes with a singer waiting on a diagnosis, walking a Paris that suddenly looks at her back.",
    showtime: "Sat · 3:00",
    tag: "35mm Print",
    seed: "paris-street-monochrome",
    hue: 210,
  },
  {
    title: "The Red Shoes",
    year: 1948,
    director: "Powell & Pressburger",
    country: "United Kingdom",
    runtime: "133 min",
    dek: "Dance or love, you cannot keep both. Technicolor so saturated it feels like a fever you'd happily catch.",
    showtime: "Sun · 5:45",
    tag: "4K Restoration",
    seed: "scarlet-ballet-stage",
    hue: 348,
  },
  {
    title: "Daughters of the Dust",
    year: 1991,
    director: "Julie Dash",
    country: "United States",
    runtime: "112 min",
    dek: "The Gullah of the Sea Islands on the eve of leaving. A film that moves like memory and tide rather than plot.",
    showtime: "Sun · 8:00",
    tag: "35mm Print",
    seed: "golden-coastal-grass",
    hue: 46,
  },
]

type Strand = { name: string; count: string; note: string }
const SEASON: Strand[] = [
  {
    name: "Women Who Looked",
    count: "9 films",
    note: "Varda, Dash, Chytilová and the directors who handed the camera the gaze for once.",
  },
  {
    name: "Celluloid Sundays",
    count: "Monthly",
    note: "Whatever survived in a can. Projected from 35mm with all the grain and clatter intact.",
  },
  {
    name: "Late at the Lumen",
    count: "Fri & Sat, 11pm",
    note: "Cult, midnight and the gloriously unwell. Bring a friend, lose them by the credits.",
  },
]

type Tier = {
  name: string
  price: string
  cadence: string
  blurb: string
  perks: string[]
  featured?: boolean
}
const TIERS: Tier[] = [
  {
    name: "Matinee",
    price: "£6",
    cadence: "/ month",
    blurb: "For the once-a-fortnight regular who likes a good seat.",
    perks: ["£2 off every ticket", "Members' afternoon screenings", "The monthly programme by post"],
  },
  {
    name: "Circle",
    price: "£12",
    cadence: "/ month",
    blurb: "Our most-loved card. Free films and the run of the building.",
    perks: [
      "Two free tickets each month",
      "Priority booking for sold-out nights",
      "10% off at The Foyer bar",
      "Invites to print previews",
    ],
    featured: true,
  },
  {
    name: "Patron",
    price: "£30",
    cadence: "/ month",
    blurb: "Keep the projector turning. Your name lives on the wall.",
    perks: [
      "Unlimited films, bring a guest",
      "Your name engraved in the foyer",
      "A reserved seat in the back row",
      "Two season tickets to gift",
    ],
  },
]

type Stat = { value: number; suffix: string; label: string }
const STATS: Stat[] = [
  { value: 1934, suffix: "", label: "Opened as the Carrow Electric" },
  { value: 212, suffix: "", label: "Seats, one screen, no multiplex" },
  { value: 600, suffix: "+", label: "Films programmed a year" },
  { value: 2, suffix: "", label: "Working 35mm projectors" },
]

type Faq = { q: string; a: string }
const VISIT_FAQ: Faq[] = [
  {
    q: "Where exactly are you?",
    a: "14 Carrow Lane, in the old fan-light warehouse behind the glassworks. Look for the red blade sign; you'll hear the foyer before you see the door.",
  },
  {
    q: "Can I just turn up?",
    a: "For most screenings, yes — but restorations and 35mm nights sell out. Members book a week ahead, everyone else from the Friday before.",
  },
  {
    q: "Is the cinema accessible?",
    a: "Step-free from Carrow Lane to the auditorium and bar, with five wheelchair spaces, an infrared hearing loop, and captioned screenings every Tuesday.",
  },
  {
    q: "What's The Foyer?",
    a: "Our bar and café in the old ticket hall — natural wine, proper coffee, and a short menu that runs until the last film starts.",
  },
]

/* ------------------------------------------------------ small components */

function Eyebrow({
  children,
  color = RED,
  className = "",
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] ${className}`}
      style={{ fontFamily: MONO, color }}
    >
      <span aria-hidden className="inline-block h-px w-6" style={{ background: color }} />
      {children}
    </span>
  )
}

/** Infinite marquee — duplicated track translated -50% on loop. Pauses on hover. */
function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const track = [...items, ...items]
  return (
    <div
      className="group relative overflow-hidden border-y"
      style={{ borderColor: "rgba(243,235,221,0.16)", background: OXBLOOD }}
      aria-hidden
    >
      <motion.div
        className="flex w-max gap-10 py-3.5 group-hover:[animation-play-state:paused]"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={reduce ? undefined : { duration: 28, ease: "linear", repeat: Infinity }}
      >
        {track.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 whitespace-nowrap text-sm"
            style={{ fontFamily: MONO, color: "rgba(243,235,221,0.78)" }}
          >
            {t}
            <span style={{ color: GOLD }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/** Count from 0 → value when scrolled into view. */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduce])
  return (
    <span ref={ref}>
      {n.toLocaleString("en-GB")}
      {suffix}
    </span>
  )
}

/** A crafted, duotone "poster" built from a deterministic picsum photo + tint + title. */
function Poster({
  film,
  className = "",
  style,
}: {
  film: FilmItem
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-[3px] ${className}`}
      style={{ background: OXBLOOD, ...style }}
    >
      <img
        src={`https://picsum.photos/seed/${film.seed}/420/630`}
        alt=""
        loading="lazy"
        width={420}
        height={630}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "grayscale(1) contrast(1.08) brightness(0.82)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{ background: `hsl(${film.hue} 62% 38%)`, opacity: 0.78 }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.22em]"
          style={{ fontFamily: MONO, color: GOLD }}
        >
          {film.tag}
        </div>
        <div
          className="mt-1 leading-[1.04]"
          style={{ fontFamily: DISPLAY, color: CREAM, fontWeight: 600, fontSize: "1.35rem" }}
        >
          {film.title}
        </div>
        <div className="mt-1 text-[11px]" style={{ color: "rgba(243,235,221,0.7)", fontFamily: MONO }}>
          {film.director} · {film.year}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------- FEATURED: hover image-reveal */

/**
 * Film index where hovering a row floats that film's poster at the cursor.
 * Desktop: a single fixed poster spring-follows the pointer (hidden on touch).
 * Touch / no-cursor: each row carries an inline thumbnail so nothing is gated
 * behind hover (design-log lesson).
 */
function FilmIndex({ films }: { films: FilmItem[] }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 320, damping: 30 })
  const sy = useSpring(y, { stiffness: 320, damping: 30 })

  const onMove = (e: React.MouseEvent) => {
    x.set(e.clientX + 22)
    y.set(e.clientY - 150)
  }

  return (
    <div className="relative" onMouseMove={onMove}>
      <ul style={{ borderTop: `1px solid ${INK}1f` }}>
        {films.map((film, i) => {
          const isActive = active === i
          return (
            <li key={film.title} style={{ borderBottom: `1px solid ${INK}1f` }}>
              <a
                href="#tickets"
                onClick={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex items-center gap-4 py-5 outline-none transition-colors duration-200 sm:gap-6"
                style={{ color: isActive ? RED : INK }}
              >
                {/* inline thumbnail — the touch / keyboard-reachable fallback */}
                <span className="block h-16 w-11 shrink-0 overflow-hidden rounded-[2px] md:hidden">
                  <Poster film={film} />
                </span>

                <span
                  className="w-12 shrink-0 text-xs tabular-nums"
                  style={{ fontFamily: MONO, color: isActive ? RED : MUTED }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="block leading-[1.05] transition-transform duration-200 will-change-transform md:group-hover:translate-x-2"
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 500,
                      fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
                    }}
                  >
                    {film.title}
                  </span>
                  <span
                    className="mt-1 block text-sm"
                    style={{ color: MUTED, fontFamily: BODY }}
                  >
                    {film.director} · {film.country} · {film.runtime}
                  </span>
                </span>

                <span
                  className="hidden shrink-0 text-right text-sm sm:block"
                  style={{ fontFamily: MONO, color: isActive ? RED : MUTED }}
                >
                  {film.showtime}
                </span>
                <ArrowUpRight
                  className="hidden h-5 w-5 shrink-0 transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 sm:block"
                  style={{ color: isActive ? RED : `${INK}55` }}
                />
              </a>
            </li>
          )
        })}
      </ul>

      {/* floating poster — desktop pointer only */}
      <AnimatePresence>
        {active !== null && !reduce && (
          <motion.div
            key="float"
            className="pointer-events-none fixed left-0 top-0 z-40 hidden w-44 md:block"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.92, rotate: -1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="shadow-[0_30px_60px_-20px_rgba(28,20,17,0.6)]">
              <Poster film={films[active]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------- buttons */

function Primary({ children, href = "#tickets" }: { children: ReactNode; href?: string }) {
  return (
    <Magnetic strength={0.35}>
      <a
        href={href}
        onClick={(e) => href === "#tickets" && e.preventDefault()}
        className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200"
        style={{ background: RED, color: CREAM, fontFamily: BODY }}
        onMouseEnter={(e) => (e.currentTarget.style.background = RED_DEEP)}
        onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
      >
        {children}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </Magnetic>
  )
}

function Ghost({
  children,
  href = "#",
  dark = false,
}: {
  children: ReactNode
  href?: string
  dark?: boolean
}) {
  const c = dark ? CREAM : INK
  return (
    <a
      href={href}
      onClick={(e) => href === "#" && e.preventDefault()}
      className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-200"
      style={{ borderColor: `${c}33`, color: c, fontFamily: BODY }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = c)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${c}33`)}
    >
      {children}
    </a>
  )
}

/* --------------------------------------------------------------- layout */

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/now-showing`, label: "Now Showing", end: false },
    { to: `${base}/membership`, label: "Membership", end: false },
    { to: `${base}/visit`, label: "Visit", end: false },
  ]

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: BODY }}>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{ borderColor: `${INK}1f`, background: "rgba(243,235,221,0.86)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <NavLink to={base} end className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-[3px]"
              style={{ background: RED, color: CREAM }}
            >
              <Film className="h-4 w-4" />
            </span>
            <span
              className="text-lg leading-none"
              style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              The Lumen
            </span>
          </NavLink>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className="text-sm transition-colors duration-200"
                style={({ isActive }) => ({
                  color: isActive ? RED : `${INK}cc`,
                  fontWeight: isActive ? 600 : 500,
                })}
              >
                {l.label}
              </NavLink>
            ))}
            <Magnetic strength={0.3}>
              <a
                href="#tickets"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: INK, color: CREAM }}
              >
                <Ticket className="h-4 w-4" /> Book
              </a>
            </Magnetic>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{ color: INK }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t md:hidden"
              style={{ borderColor: `${INK}1f` }}
            >
              <div className="flex flex-col gap-1 px-5 py-3">
                {links.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className="py-2 text-base"
                    style={({ isActive }) => ({ color: isActive ? RED : INK, fontWeight: isActive ? 600 : 500 })}
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

      <footer style={{ background: OXBLOOD, color: CREAM }}>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-[3px]"
                  style={{ background: RED, color: CREAM }}
                >
                  <Film className="h-4 w-4" />
                </span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.25rem" }}>
                  The Lumen Picturehouse
                </span>
              </div>
              <p
                className="mt-4 max-w-sm text-sm leading-relaxed"
                style={{ color: "rgba(243,235,221,0.72)" }}
              >
                A single screen, two projectors and the films worth crossing town
                for. Member-owned and stubbornly independent since 1934.
              </p>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: GOLD }}>
                Find us
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(243,235,221,0.8)" }}>
                14 Carrow Lane
                <br />
                Bristol BS1 4QF
                <br />
                Box office · 0117 496 0014
              </p>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: GOLD }}>
                Doors
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(243,235,221,0.8)" }}>
                Mon–Thu · 4pm–late
                <br />
                Fri–Sun · 12pm–late
                <br />
                The Foyer until the last film
              </p>
            </div>
          </div>
          <div
            className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center"
            style={{ borderColor: "rgba(243,235,221,0.16)", color: "rgba(243,235,221,0.6)", fontFamily: MONO }}
          >
            <span>© 1934–2026 The Lumen Picturehouse · A community benefit society</span>
            <span>Projected on 35mm wherever we possibly can.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ----------------------------------------------------------------- pages */

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function Home() {
  const showtimes = FILMS.map((f) => `${f.title} — ${f.showtime}`)
  return (
    <Page>
      {/* hero — asymmetric, no centred stock photo */}
      <section className="relative overflow-hidden" style={{ background: CREAM }}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-24 h-[34rem] w-[34rem] rounded-full opacity-[0.07]"
          style={{ background: `radial-gradient(circle, ${RED} 0%, transparent 70%)` }}
        />
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
          <div className="grid items-end gap-10 md:grid-cols-[1.5fr_0.9fr]">
            <div>
              <Eyebrow>Carrow Lane · Bristol · Est. 1934</Eyebrow>
              <h1
                className="mt-5 max-w-3xl"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 500,
                  lineHeight: 0.96,
                  letterSpacing: "-0.02em",
                  fontSize: "clamp(2.75rem, 8vw, 6rem)",
                }}
              >
                The films worth{" "}
                <span style={{ fontStyle: "italic", color: RED }}>crossing town</span> for.
              </h1>
              <p
                className="mt-6 max-w-xl text-lg leading-relaxed"
                style={{ color: `${INK}cc` }}
              >
                One screen. Two projectors. Restorations, 35mm prints and late-night
                cult on a street most maps forgot. No adverts, no recliners — just the
                dark, the grain and the people who still come for it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Primary>Book this week</Primary>
                <Ghost href="#now">See what's on</Ghost>
              </div>
            </div>

            {/* poster trio — staggered, overlapping, deliberately asymmetric */}
            <div className="relative hidden h-[24rem] md:block lg:h-[26rem]">
              {[FILMS[0], FILMS[4], FILMS[2]].map((f, i) => (
                <motion.div
                  key={f.title}
                  className="absolute w-44"
                  style={{
                    left: `${i * 56}px`,
                    top: `${i * 36}px`,
                    zIndex: 3 - i,
                    rotate: `${(i - 1) * 5}deg`,
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                  whileHover={{ y: -10, rotate: 0, transition: { duration: 0.25 } }}
                >
                  <div className="shadow-[0_30px_60px_-22px_rgba(28,20,17,0.55)]">
                    <Poster film={f} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Marquee items={showtimes} />

      {/* now showing index — the featured interaction */}
      <section id="now" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Now showing</Eyebrow>
              <h2
                className="mt-4"
                style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
              >
                This week in the dark
              </h2>
            </div>
            <p className="max-w-xs text-sm" style={{ color: MUTED }}>
              Hover a title to see its poster — or come find the real print on the wall.
            </p>
          </div>
        </Reveal>
        <div className="mt-10">
          <FilmIndex films={FILMS} />
        </div>
      </section>

      {/* stats band on oxblood — gold + counters */}
      <section style={{ background: OXBLOOD, color: CREAM }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <div
                  style={{ fontFamily: DISPLAY, color: GOLD, fontWeight: 600, fontSize: "clamp(2.5rem, 6vw, 3.5rem)", lineHeight: 1 }}
                >
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm" style={{ color: "rgba(243,235,221,0.75)" }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* season strands */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <Eyebrow>The summer programme</Eyebrow>
          <h2
            className="mt-4 max-w-2xl"
            style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            Three strands running until September
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SEASON.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="flex h-full flex-col rounded-md border p-7"
                style={{ borderColor: `${INK}1f`, background: i === 1 ? CREAM_DEEP : "transparent" }}
              >
                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: RED }}>
                  {s.count}
                </div>
                <h3 className="mt-3" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.5rem" }}>
                  {s.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: `${INK}b3` }}>
                  {s.note}
                </p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}

function NowShowing() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
        <Eyebrow>The programme</Eyebrow>
        <h1
          className="mt-5 max-w-3xl"
          style={{ fontFamily: DISPLAY, fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.02em", fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
        >
          Now showing
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: `${INK}cc` }}>
          Six films on the wall this week, projected from 35mm or freshly restored
          4K. Hover a title for the poster; tap for tickets.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <FilmIndex films={FILMS} />
      </section>

      {/* detailed cards grid */}
      <section id="tickets" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <Reveal>
          <h2
            className="mb-8"
            style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
          >
            The full bill
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FILMS.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <article className="flex h-full flex-col gap-4 rounded-md border p-5" style={{ borderColor: `${INK}1f` }}>
                <div className="w-full overflow-hidden rounded-[3px]">
                  <Poster film={f} />
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.2rem", lineHeight: 1.1 }}>
                    {f.title}
                  </h3>
                  <span className="shrink-0 text-xs" style={{ fontFamily: MONO, color: MUTED }}>
                    {f.year}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: `${INK}b3` }}>
                  {f.dek}
                </p>
                <div
                  className="mt-auto flex items-center justify-between border-t pt-4 text-sm"
                  style={{ borderColor: `${INK}1f` }}
                >
                  <span style={{ fontFamily: MONO, color: RED }}>{f.showtime}</span>
                  <Magnetic strength={0.3}>
                    <button
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
                      style={{ background: INK, color: CREAM, fontFamily: BODY }}
                    >
                      <Ticket className="h-3.5 w-3.5" /> Book
                    </button>
                  </Magnetic>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}

function Membership() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
        <Eyebrow>Join the Lumen</Eyebrow>
        <h1
          className="mt-5 max-w-3xl"
          style={{ fontFamily: DISPLAY, fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.02em", fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
        >
          The cinema runs on its members.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: `${INK}cc` }}>
          We take no chain money and run no adverts, so the people in the seats are
          the people who keep the lights low. Pick a card; the first film's on us.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex h-full flex-col rounded-lg border p-7"
                style={
                  t.featured
                    ? { background: OXBLOOD, color: CREAM, borderColor: OXBLOOD }
                    : { borderColor: `${INK}1f`, background: "transparent" }
                }
              >
                <div className="flex items-center justify-between">
                  <h3
                    style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.5rem", color: t.featured ? CREAM : INK }}
                  >
                    {t.name}
                  </h3>
                  {t.featured && (
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ background: GOLD, color: OXBLOOD, fontFamily: MONO }}
                    >
                      Most loved
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "2.75rem", color: t.featured ? GOLD : RED }}>
                    {t.price}
                  </span>
                  <span className="text-sm" style={{ color: t.featured ? "rgba(243,235,221,0.7)" : `${INK}99` }}>
                    {t.cadence}
                  </span>
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: t.featured ? "rgba(243,235,221,0.8)" : `${INK}b3` }}
                >
                  {t.blurb}
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm" style={{ color: t.featured ? CREAM : INK }}>
                      <span
                        aria-hidden
                        className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: t.featured ? GOLD : RED }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 pt-2">
                  {t.featured ? (
                    <Magnetic strength={0.3}>
                      <button
                        className="w-full rounded-full px-5 py-3 text-sm font-semibold"
                        style={{ background: GOLD, color: OXBLOOD, fontFamily: BODY }}
                      >
                        Choose {t.name}
                      </button>
                    </Magnetic>
                  ) : (
                    <button
                      className="w-full rounded-full border px-5 py-3 text-sm font-semibold transition-colors duration-200"
                      style={{ borderColor: `${INK}33`, color: INK, fontFamily: BODY }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = INK)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${INK}33`)}
                    >
                      Choose {t.name}
                    </button>
                  )}
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* quote / testimonial — single, off-grid */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <figure className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <img
              src="https://picsum.photos/seed/lumen-member-portrait/240/240"
              alt="Portrait of long-standing Lumen member Edith Brandt"
              width={120}
              height={120}
              loading="lazy"
              className="h-28 w-28 rounded-full object-cover"
              style={{ filter: "grayscale(1) contrast(1.05)", border: `3px solid ${RED}` }}
            />
            <blockquote>
              <p
                style={{ fontFamily: DISPLAY, fontWeight: 400, fontStyle: "italic", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", lineHeight: 1.25, letterSpacing: "-0.01em" }}
              >
                “I've had the same back-row seat since 1987. The Lumen is the only
                room in this city where I've never once checked my phone.”
              </p>
              <figcaption className="mt-4 text-sm" style={{ fontFamily: MONO, color: MUTED }}>
                — Edith Brandt, Patron member since the Thatcher years
              </figcaption>
            </blockquote>
          </figure>
        </Reveal>
      </section>
    </Page>
  )
}

function Visit() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
        <Eyebrow>Plan your night</Eyebrow>
        <h1
          className="mt-5 max-w-3xl"
          style={{ fontFamily: DISPLAY, fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.02em", fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
        >
          Find the red blade sign.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: `${INK}cc` }}>
          We're in the old fan-light warehouse behind the glassworks — five minutes
          from Temple Meads, longer if you stop at every poster on the way in.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, head: "The address", body: "14 Carrow Lane, Bristol BS1 4QF. Step-free from the lane to the bar and screen." },
            { icon: Train, head: "Getting here", body: "8 min walk from Temple Meads. Buses 24 & 376 stop on Glass Street. No car park, by design." },
            { icon: Clock, head: "The hours", body: "Mon–Thu from 4pm, Fri–Sun from noon. The Foyer bar pours until the last film starts." },
          ].map((c, i) => (
            <Reveal key={c.head} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-md border p-6" style={{ borderColor: `${INK}1f` }}>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-[3px]"
                  style={{ background: `${RED}14`, color: RED }}
                >
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.25rem" }}>
                  {c.head}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: `${INK}b3` }}>
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* image strip — The Foyer */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <Reveal>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Eyebrow>The Foyer</Eyebrow>
              <h2
                className="mt-4"
                style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", letterSpacing: "-0.02em" }}
              >
                Arrive early. Stay for the wine.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: `${INK}b3` }}>
                The old ticket hall is now our bar and café — natural wine, proper
                coffee and a short kitchen that runs until the lights go down. It's
                the best argument we know for showing up forty minutes before the
                trailers.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Primary href="#tickets">Reserve a table</Primary>
                <a
                  href="tel:01174960014"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: INK }}
                >
                  <Phone className="h-4 w-4" style={{ color: RED }} /> 0117 496 0014
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { seed: "lumen-foyer-bar-warm", alt: "The Foyer bar with low amber light and a marble counter", span: "row-span-2 aspect-[3/4]" },
                { seed: "lumen-coffee-counter", alt: "Coffee being poured at The Foyer café counter", span: "aspect-square" },
                { seed: "lumen-wine-glasses", alt: "Glasses of natural wine on a worn wooden table", span: "aspect-square" },
              ].map((im) => (
                <div key={im.seed} className={`overflow-hidden rounded-md ${im.span}`}>
                  <img
                    src={`https://picsum.photos/seed/${im.seed}/600/800`}
                    alt={im.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    style={{ filter: "sepia(14%) saturate(108%) contrast(1.02)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <Eyebrow>Before you come</Eyebrow>
          <h2
            className="mt-4"
            style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
          >
            The things people ask
          </h2>
        </Reveal>
        <dl className="mt-8" style={{ borderTop: `1px solid ${INK}1f` }}>
          {VISIT_FAQ.map((f) => (
            <div key={f.q} className="py-6" style={{ borderBottom: `1px solid ${INK}1f` }}>
              <dt style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "1.2rem" }}>{f.q}</dt>
              <dd className="mt-2 text-base leading-relaxed" style={{ color: `${INK}b3` }}>
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Page>
  )
}

/* ---------------------------------------------------------------- export */

export default function LumenSite() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <MotionConfig reducedMotion="user">
      <Layout base={base}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route index element={<Home />} />
            <Route path="now-showing" element={<NowShowing />} />
            <Route path="membership" element={<Membership />} />
            <Route path="visit" element={<Visit />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </MotionConfig>
  )
}
