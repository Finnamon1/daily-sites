import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  Routes,
  Route,
  NavLink,
  useParams,
  useLocation,
  Link,
} from "react-router-dom"
import {
  motion,
  useInView,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  Clock,
  Film as FilmIcon,
  MapPin,
  Phone,
  Mail,
  Check,
  ArrowUpRight,
  Ticket,
  Menu,
  X,
} from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { FILMS, STRANDS, TIERS, STATS, type Film, type Strand } from "./data"

/* =========================================================================
   THE STRAND — a repertory arthouse cinema.
   FEATURED INTERACTION: 3D poster tilt with a cursor-tracking glare, so the
   programme reads like rows of posters under glass. Extends fx/TiltCard by
   adding a light sheen driven by the same pointer motion values. Supporting
   moments: an infinite showtimes marquee, staggered grid entrances, magnetic
   booking CTAs, animated house counters, and scroll reveals. All gated on
   prefers-reduced-motion.
   ========================================================================= */

const DISPLAY = "font-['Fraunces']"
const PROSE = "font-['Spectral']"
const UI = "font-['Space_Grotesk']"

const palette: CSSProperties = {
  // ink/bone neutrals + a single marquee-amber accent; oxblood used sparingly.
  ["--ink" as string]: "#15110d",
  ["--ink2" as string]: "#1d1812",
  ["--ink3" as string]: "#272019",
  ["--bone" as string]: "#efe6d4",
  ["--bone-dim" as string]: "#c7baa1",
  ["--amber" as string]: "#e7b24a",
  ["--ox" as string]: "#7d2a22",
  ["--muted" as string]: "#9b8d77",
}

function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* ----------------------------- small atoms ----------------------------- */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className={`${UI} inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--amber)]`}
    >
      <span className="h-px w-6 bg-[var(--amber)]/60" />
      {children}
    </span>
  )
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1300
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString()}
      {suffix}
    </span>
  )
}

function CTA({
  to,
  children,
  solid = true,
}: {
  to: string
  children: ReactNode
  solid?: boolean
}) {
  return (
    <Magnetic strength={0.35}>
      <Link
        to={to}
        className={`${UI} group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 ${
          solid
            ? "bg-[var(--amber)] text-[var(--ink)] hover:bg-[#f0c264]"
            : "border border-[var(--bone)]/30 text-[var(--bone)] hover:border-[var(--amber)] hover:text-[var(--amber)]"
        }`}
      >
        {children}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </Magnetic>
  )
}

const STILL_FILTER =
  "grayscale(1) sepia(0.55) saturate(2.1) hue-rotate(-12deg) contrast(1.08) brightness(0.92)"

/* --------------------- featured interaction: PosterTilt ----------------- */

function Poster({
  film,
  base,
  index = 0,
}: {
  film: Film
  base: string
  index?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), {
    stiffness: 180,
    damping: 18,
  })
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), {
    stiffness: 180,
    damping: 18,
  })
  const gx = useTransform(mx, [0, 1], ["8%", "92%"])
  const gy = useTransform(my, [0, 1], ["8%", "92%"])
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 62%)`

  const handleMove = (e: React.MouseEvent) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <Reveal delay={(index % 4) * 0.07} y={28}>
      <motion.article
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={
          reduce
            ? undefined
            : {
                rotateX: rx,
                rotateY: ry,
                transformStyle: "preserve-3d",
                transformPerspective: 900,
              }
        }
        className="group relative will-change-transform"
      >
        <Link to={`${base}/programme`} className="block">
          <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-[var(--ink3)] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.85)] ring-1 ring-[var(--bone)]/10">
            <img
              src={`https://picsum.photos/seed/${film.seed}/520/780`}
              alt={`Still from ${film.title}, directed by ${film.director}`}
              width={520}
              height={780}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ filter: STILL_FILTER }}
            />
            {/* legibility wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/10 to-transparent" />
            {/* tracking glare (featured interaction) */}
            {!reduce && (
              <motion.div
                aria-hidden
                style={{ background: glare }}
                className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
            {/* strand tag */}
            <span
              className={`${UI} absolute left-3 top-3 rounded-full bg-[var(--ink)]/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--bone-dim)] backdrop-blur-sm`}
            >
              {film.strand}
            </span>
            {/* caption block */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3
                className={`${DISPLAY} text-xl font-semibold leading-tight text-[var(--bone)]`}
              >
                {film.title}
              </h3>
              <p
                className={`${UI} mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--bone-dim)]`}
              >
                <span>{film.year}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--amber)]" />
                <span>{film.runtime}m</span>
                <span className="h-1 w-1 rounded-full bg-[var(--amber)]" />
                <span>{film.cert}</span>
              </p>
            </div>
          </div>
        </Link>
      </motion.article>
    </Reveal>
  )
}

/* ------------------------------ marquee --------------------------------- */

function ShowtimeMarquee() {
  const items = FILMS.flatMap((f) =>
    f.showtimes.map((t) => ({ title: f.title, time: t }))
  )
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((it, i) => (
        <span
          key={i}
          className={`${UI} flex items-center gap-3 text-sm text-[var(--bone-dim)]`}
        >
          <span className="tabular-nums text-[var(--amber)]">{it.time}</span>
          <span className="text-[var(--bone)]">{it.title}</span>
          <span className="text-[var(--muted)]">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="strand-marquee relative overflow-hidden border-y border-[var(--bone)]/10 bg-[var(--ink2)] py-3">
      <div className="strand-marquee-track flex w-max">
        {row}
        {row}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--ink2)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--ink2)] to-transparent" />
    </div>
  )
}

/* ------------------------------- layout --------------------------------- */

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "programme", label: "Programme" },
  { to: "membership", label: "Membership" },
  { to: "visit", label: "Visit" },
  { to: "about", label: "About" },
]

function Layout({ children }: { children: ReactNode }) {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div
      style={palette}
      className={`min-h-screen bg-[var(--ink)] text-[var(--bone)] ${PROSE} antialiased`}
    >
      <style>{`
        @keyframes strand-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .strand-marquee-track { animation: strand-marquee 36s linear infinite; }
        .strand-marquee:hover .strand-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .strand-marquee-track { animation: none; } }
      `}</style>

      {/* nav */}
      <header className="sticky top-0 z-50 border-b border-[var(--bone)]/10 bg-[var(--ink)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to={base} className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--amber)] text-[var(--amber)]">
              <FilmIcon className="h-4 w-4" />
            </span>
            <span
              className={`${DISPLAY} text-xl font-semibold tracking-tight text-[var(--bone)]`}
            >
              The Strand
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={`${base}/${n.to}`.replace(/\/$/, "")}
                end={n.end}
                className={({ isActive }) =>
                  `${UI} relative text-sm tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--amber)]"
                      : "text-[var(--bone-dim)] hover:text-[var(--bone)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 h-px w-full bg-[var(--amber)]"
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <CTA to={`${base}/visit`}>
              <Ticket className="h-4 w-4" /> Book
            </CTA>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--bone)]/20 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden border-t border-[var(--bone)]/10 md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
              {NAV.map((n) => (
                <NavLink
                  key={n.label}
                  to={`${base}/${n.to}`.replace(/\/$/, "")}
                  end={n.end}
                  className={({ isActive }) =>
                    `${UI} rounded-md px-3 py-2.5 text-sm ${
                      isActive
                        ? "bg-[var(--ink3)] text-[var(--amber)]"
                        : "text-[var(--bone-dim)]"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </header>

      <main>{children}</main>

      {/* footer */}
      <footer className="border-t border-[var(--bone)]/10 bg-[var(--ink2)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--amber)] text-[var(--amber)]">
                <FilmIcon className="h-4 w-4" />
              </span>
              <span className={`${DISPLAY} text-lg font-semibold`}>
                The Strand
              </span>
            </div>
            <p className={`${PROSE} mt-4 max-w-xs text-sm text-[var(--muted)]`}>
              An independent repertory cinema. One screen, 248 seats, open since
              1932. Run by its members, for its city.
            </p>
          </div>
          <div className={`${UI} text-sm`}>
            <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Visit
            </p>
            <p className="text-[var(--bone-dim)]">4 Lambeth Walk</p>
            <p className="text-[var(--bone-dim)]">Quayside, EX4 6PL</p>
            <p className="mt-2 text-[var(--bone-dim)]">Box office 01392 555 014</p>
          </div>
          <div className={`${UI} text-sm`}>
            <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              The pages
            </p>
            <div className="flex flex-col gap-1.5">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={`${base}/${n.to}`.replace(/\/$/, "")}
                  className="text-[var(--bone-dim)] transition-colors hover:text-[var(--amber)]"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--bone)]/10">
          <p
            className={`${UI} mx-auto max-w-6xl px-5 py-5 text-xs text-[var(--muted)]`}
          >
            © 1932–2026 The Strand Cinema Trust · Reg. charity 1042-118
          </p>
        </div>
      </footer>
    </div>
  )
}

function Page({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------- HOME ---------------------------------- */

function Home() {
  const base = useBase()
  const reduce = useReducedMotion()
  const featured = FILMS[0]
  const nowShowing = FILMS.slice(1, 6)

  // gentle parallax on the hero still
  const heroRef = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)
  useEffect(() => {
    if (reduce) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setShift(window.scrollY * 0.06))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    <Page>
      {/* hero — asymmetric, not centered */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-20">
          <div>
            <Eyebrow>Now showing · this week</Eyebrow>
            <h1
              className={`${DISPLAY} mt-5 text-[clamp(2.6rem,7vw,5rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--bone)]`}
            >
              The films
              <br />
              <span className="italic text-[var(--amber)]">worth</span> the
              <br />
              cold walk home.
            </h1>
            <p className={`${PROSE} mt-6 max-w-md text-lg leading-relaxed text-[var(--bone-dim)]`}>
              One screen on the quay, programmed with care since 1932. New cinema,
              restored classics, and the odd late-night mistake — all on a proper
              projector.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CTA to={`${base}/programme`}>See the programme</CTA>
              <CTA to={`${base}/membership`} solid={false}>
                Become a member
              </CTA>
            </div>
          </div>

          {/* featured still framed like a marquee card */}
          <div ref={heroRef} className="relative">
            <div className="relative overflow-hidden rounded-[4px] ring-1 ring-[var(--bone)]/15 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${featured.seed}/800/1000`}
                  alt={`Featured film: ${featured.title}, directed by ${featured.director}`}
                  width={800}
                  height={1000}
                  className="h-[112%] w-full object-cover"
                  style={{
                    filter: STILL_FILTER,
                    transform: `translateY(${-shift}px)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/20" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className={`${UI} text-[11px] uppercase tracking-[0.24em] text-[var(--amber)]`}>
                  Feature presentation
                </span>
                <h2 className={`${DISPLAY} mt-2 text-3xl font-semibold text-[var(--bone)]`}>
                  {featured.title}
                </h2>
                <p className={`${UI} mt-1 text-sm text-[var(--bone-dim)]`}>
                  {featured.director} · {featured.year} · {featured.runtime}m
                </p>
              </div>
            </div>
            {/* tiny dot of brand light */}
            <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full bg-[var(--amber)]/15 blur-2xl md:block" />
          </div>
        </div>

        <ShowtimeMarquee />
      </section>

      {/* now showing — the featured poster-tilt row */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>On this week</Eyebrow>
            <h2 className={`${DISPLAY} mt-4 text-4xl font-light text-[var(--bone)]`}>
              Posters under glass
            </h2>
            <p className={`${PROSE} mt-2 max-w-md text-[var(--muted)]`}>
              Hover a poster. Tilt it toward the foyer light.
            </p>
          </div>
          <Link
            to={`${base}/programme`}
            className={`${UI} hidden shrink-0 items-center gap-1.5 text-sm text-[var(--amber)] hover:underline md:inline-flex`}
          >
            Full programme <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {nowShowing.map((f, i) => (
            <Poster key={f.id} film={f} base={base} index={i} />
          ))}
        </div>
      </section>

      {/* the house — counters */}
      <section className="border-y border-[var(--bone)]/10 bg-[var(--ink2)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-16 md:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <div>
                <p className={`${DISPLAY} text-5xl font-light text-[var(--amber)]`}>
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className={`${UI} mt-2 text-sm text-[var(--bone-dim)]`}>
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* quote */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
        <Reveal>
          <p className={`${DISPLAY} text-[clamp(1.6rem,4vw,2.75rem)] font-light italic leading-[1.25] text-[var(--bone)]`}>
            “The Strand is the only place left in the city where the lights go
            down and the talking actually stops.”
          </p>
          <p className={`${UI} mt-6 text-sm uppercase tracking-[0.2em] text-[var(--amber)]`}>
            The Quayside Review
          </p>
        </Reveal>
      </section>
    </Page>
  )
}

/* ------------------------------ PROGRAMME ------------------------------- */

function Programme() {
  const base = useBase()
  const [active, setActive] = useState<Strand | "All">("All")
  const list =
    active === "All" ? FILMS : FILMS.filter((f) => f.strand === active)

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:pt-20">
        <Eyebrow>What's on</Eyebrow>
        <h1 className={`${DISPLAY} mt-4 text-[clamp(2.4rem,6vw,4rem)] font-light leading-[0.98] text-[var(--bone)]`}>
          This fortnight at
          <br className="hidden sm:block" /> the Strand
        </h1>
        <p className={`${PROSE} mt-5 max-w-xl text-lg text-[var(--bone-dim)]`}>
          Five strands run alongside each other every week. Filter by the one you
          fancy — or take a chance on the lot.
        </p>

        {/* strand filter */}
        <div className="mt-9 flex flex-wrap gap-2.5">
          {(["All", ...STRANDS] as const).map((s) => {
            const on = active === s
            return (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`${UI} rounded-full border px-4 py-2 text-sm tracking-wide transition-colors duration-200 ${
                  on
                    ? "border-[var(--amber)] bg-[var(--amber)] text-[var(--ink)]"
                    : "border-[var(--bone)]/20 text-[var(--bone-dim)] hover:border-[var(--amber)]/60 hover:text-[var(--bone)]"
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>

        {/* poster grid — staggered entrance */}
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((f, i) => (
            <Poster key={f.id} film={f} base={base} index={i} />
          ))}
        </div>

        {/* detailed listings */}
        <div className="mt-20">
          <h2 className={`${DISPLAY} text-2xl font-light text-[var(--bone)]`}>
            Listings & times
          </h2>
          <div className="mt-6 divide-y divide-[var(--bone)]/10 border-y border-[var(--bone)]/10">
            {list.map((f) => (
              <Reveal key={f.id}>
                <div className="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className={`${DISPLAY} text-xl font-semibold text-[var(--bone)]`}>
                        {f.title}
                      </h3>
                      <span className={`${UI} text-xs uppercase tracking-[0.16em] text-[var(--amber)]`}>
                        {f.strand}
                      </span>
                    </div>
                    <p className={`${UI} mt-1 text-sm text-[var(--muted)]`}>
                      {f.director} · {f.year} · {f.runtime}m · {f.cert}
                    </p>
                    <p className={`${PROSE} mt-2 text-[15px] leading-relaxed text-[var(--bone-dim)]`}>
                      {f.blurb}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {f.showtimes.map((t) => (
                      <Link
                        key={t}
                        to={`${base}/visit`}
                        className={`${UI} rounded-md border border-[var(--bone)]/20 px-3 py-2 text-sm tabular-nums text-[var(--bone)] transition-colors duration-200 hover:border-[var(--amber)] hover:bg-[var(--amber)] hover:text-[var(--ink)]`}
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ----------------------------- MEMBERSHIP ------------------------------- */

function Membership() {
  const base = useBase()
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:pt-20">
        <div className="max-w-2xl">
          <Eyebrow>Members keep us running</Eyebrow>
          <h1 className={`${DISPLAY} mt-4 text-[clamp(2.4rem,6vw,4rem)] font-light leading-[0.98] text-[var(--bone)]`}>
            Join the Strand
          </h1>
          <p className={`${PROSE} mt-5 text-lg text-[var(--bone-dim)]`}>
            We take no chain money and no algorithm's notes. The programme is
            chosen by people, and paid for by members. Pick the membership that
            matches how often you'll really come.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((t) => (
            <Reveal key={t.name}>
              <div
                className={`relative flex h-full flex-col rounded-xl border p-7 transition-transform duration-300 hover:-translate-y-1 ${
                  t.featured
                    ? "border-[var(--amber)]/60 bg-[var(--ink2)] lg:-mt-4 lg:mb-0"
                    : "border-[var(--bone)]/15 bg-[var(--ink2)]/40"
                }`}
              >
                {t.featured && (
                  <span className={`${UI} absolute -top-3 left-7 rounded-full bg-[var(--amber)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)]`}>
                    Most loved
                  </span>
                )}
                <h2 className={`${DISPLAY} text-2xl font-semibold text-[var(--bone)]`}>
                  {t.name}
                </h2>
                <p className={`${PROSE} mt-1 text-[var(--muted)]`}>{t.pitch}</p>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className={`${DISPLAY} text-5xl font-light text-[var(--amber)]`}>
                    {t.price}
                  </span>
                  <span className={`${UI} text-sm text-[var(--bone-dim)]`}>
                    {t.cadence}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {t.perks.map((p) => (
                    <li
                      key={p}
                      className={`${PROSE} flex items-start gap-3 text-[15px] text-[var(--bone-dim)]`}
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--amber)]" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Link
                    to={`${base}/visit`}
                    className={`${UI} block rounded-full px-5 py-3 text-center text-sm font-semibold tracking-wide transition-colors duration-200 ${
                      t.featured
                        ? "bg-[var(--amber)] text-[var(--ink)] hover:bg-[#f0c264]"
                        : "border border-[var(--bone)]/25 text-[var(--bone)] hover:border-[var(--amber)] hover:text-[var(--amber)]"
                    }`}
                  >
                    Choose {t.name}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className={`${UI} mt-8 text-sm text-[var(--muted)]`}>
          All memberships are rolling and cancel any time. Concessions available —
          just ask at the box office.
        </p>
      </section>
    </Page>
  )
}

/* -------------------------------- VISIT --------------------------------- */

function Visit() {
  const films = FILMS
  const [film, setFilm] = useState(films[0].id)
  const selected = films.find((f) => f.id === film) ?? films[0]
  const [time, setTime] = useState(selected.showtimes[0])
  const [qty, setQty] = useState(2)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  // keep time valid when film changes
  useEffect(() => {
    setTime(selected.showtimes[0])
  }, [film, selected.showtimes])

  const total = qty * 9

  const inputCls = `${UI} w-full rounded-md border border-[var(--bone)]/20 bg-[var(--ink)] px-4 py-3 text-sm text-[var(--bone)] outline-none transition-colors duration-200 placeholder:text-[var(--muted)] focus:border-[var(--amber)]`

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:pt-20">
        <Eyebrow>Find us · book a seat</Eyebrow>
        <h1 className={`${DISPLAY} mt-4 text-[clamp(2.4rem,6vw,4rem)] font-light leading-[0.98] text-[var(--bone)]`}>
          Come to the pictures
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.05fr]">
          {/* details */}
          <div>
            <div className="overflow-hidden rounded-xl ring-1 ring-[var(--bone)]/15">
              <img
                src="https://picsum.photos/seed/strand-cinema-foyer/900/560"
                alt="The Strand's foyer, with the box office and a curved staircase"
                width={900}
                height={560}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
                style={{ filter: STILL_FILTER }}
              />
            </div>

            <dl className="mt-8 space-y-5">
              {[
                {
                  icon: MapPin,
                  head: "The building",
                  body: "4 Lambeth Walk, Quayside, EX4 6PL. Two minutes from the water; the green door under the vertical sign.",
                },
                {
                  icon: Clock,
                  head: "Opening times",
                  body: "First screening from 11:00, last from 22:30. Café open all day; bar from 17:00.",
                },
                {
                  icon: Phone,
                  head: "Box office",
                  body: "01392 555 014 — staffed from 10:00. Or just turn up; there's almost always a seat.",
                },
                {
                  icon: Mail,
                  head: "Email",
                  body: "hello@thestrand.cinema",
                },
              ].map((row) => (
                <div key={row.head} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--amber)]/40 text-[var(--amber)]">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className={`${UI} text-sm font-semibold text-[var(--bone)]`}>
                      {row.head}
                    </p>
                    <p className={`${PROSE} mt-0.5 text-[15px] leading-relaxed text-[var(--bone-dim)]`}>
                      {row.body}
                    </p>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* booking form */}
          <div className="rounded-xl border border-[var(--bone)]/15 bg-[var(--ink2)] p-7 md:p-9">
            <h2 className={`${DISPLAY} text-2xl font-semibold text-[var(--bone)]`}>
              Book a seat
            </h2>
            <p className={`${PROSE} mt-1 text-[var(--muted)]`}>
              Reserve now, pay at the kiosk. Standard tickets £9.
            </p>

            {sent ? (
              <div className="mt-8 rounded-lg border border-[var(--amber)]/40 bg-[var(--amber)]/5 p-6">
                <Check className="h-6 w-6 text-[var(--amber)]" />
                <p className={`${DISPLAY} mt-3 text-xl text-[var(--bone)]`}>
                  Seats held, {name.split(" ")[0] || "friend"}.
                </p>
                <p className={`${PROSE} mt-2 text-[15px] text-[var(--bone-dim)]`}>
                  {qty} × {selected.title} at {time}. We've sent the details to{" "}
                  {email || "your inbox"}. Collect from the box office up to ten
                  minutes before.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className={`${UI} mt-5 text-sm text-[var(--amber)] hover:underline`}
                >
                  Book another →
                </button>
              </div>
            ) : (
              <form
                className="mt-7 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <div>
                  <label className={`${UI} mb-1.5 block text-xs uppercase tracking-[0.16em] text-[var(--bone-dim)]`}>
                    Film
                  </label>
                  <select
                    value={film}
                    onChange={(e) => setFilm(e.target.value)}
                    className={inputCls}
                  >
                    {films.map((f) => (
                      <option
                        key={f.id}
                        value={f.id}
                        style={{ background: "#efe6d4", color: "#15110d" }}
                      >
                        {f.title} ({f.year})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`${UI} mb-1.5 block text-xs uppercase tracking-[0.16em] text-[var(--bone-dim)]`}>
                    Showtime
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selected.showtimes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={`${UI} rounded-md border px-4 py-2.5 text-sm tabular-nums transition-colors duration-200 ${
                          time === t
                            ? "border-[var(--amber)] bg-[var(--amber)] text-[var(--ink)]"
                            : "border-[var(--bone)]/20 text-[var(--bone)] hover:border-[var(--amber)]/60"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`${UI} mb-1.5 block text-xs uppercase tracking-[0.16em] text-[var(--bone-dim)]`}>
                    Tickets
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-md border border-[var(--bone)]/20">
                      <button
                        type="button"
                        aria-label="Fewer tickets"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className={`${UI} px-4 py-2.5 text-lg text-[var(--bone)] hover:text-[var(--amber)]`}
                      >
                        −
                      </button>
                      <span className={`${UI} w-10 text-center text-sm tabular-nums text-[var(--bone)]`}>
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="More tickets"
                        onClick={() => setQty((q) => Math.min(8, q + 1))}
                        className={`${UI} px-4 py-2.5 text-lg text-[var(--bone)] hover:text-[var(--amber)]`}
                      >
                        +
                      </button>
                    </div>
                    <span className={`${UI} text-sm text-[var(--muted)]`}>
                      Total{" "}
                      <span className="text-[var(--amber)]">£{total}</span>
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={`${UI} mb-1.5 block text-xs uppercase tracking-[0.16em] text-[var(--bone-dim)]`}>
                      Name
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`${UI} mb-1.5 block text-xs uppercase tracking-[0.16em] text-[var(--bone-dim)]`}>
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`${UI} mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--amber)] px-6 py-3.5 text-sm font-semibold tracking-wide text-[var(--ink)] transition-colors duration-200 hover:bg-[#f0c264]`}
                >
                  <Ticket className="h-4 w-4" /> Hold my seats
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Page>
  )
}

/* -------------------------------- ABOUT --------------------------------- */

function About() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-14 md:pt-20">
        <div className="max-w-3xl">
          <Eyebrow>Since 1932</Eyebrow>
          <h1 className={`${DISPLAY} mt-4 text-[clamp(2.4rem,6vw,4.25rem)] font-light leading-[0.98] text-[var(--bone)]`}>
            A single screen,
            <br />
            <span className="italic text-[var(--amber)]">kept alight.</span>
          </h1>
          <p className={`${PROSE} mt-6 text-lg leading-relaxed text-[var(--bone-dim)]`}>
            The Strand opened as the Regal in 1932 — a thousand seats, an organ,
            and a doorman in braid. It nearly closed three times: once to the
            multiplex, once to the developers, once to a leak that came through
            the roof during a Tarkovsky retrospective. Each time the city found a
            way to keep the lights on.
          </p>
        </div>
      </section>

      {/* gallery — asymmetric */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { seed: "strand-projector-booth", h: "row-span-2 aspect-[3/4]", alt: "The 35mm projector in the booth" },
            { seed: "strand-auditorium-seats", h: "aspect-[4/3]", alt: "Rows of red velvet seats in the auditorium" },
            { seed: "strand-neon-sign", h: "aspect-[4/3]", alt: "The vertical neon sign above the entrance at dusk" },
          ].map((g, i) => (
            <Reveal key={g.seed} delay={i * 0.08} className={g.h}>
              <div className="h-full overflow-hidden rounded-lg ring-1 ring-[var(--bone)]/12">
                <img
                  src={`https://picsum.photos/seed/${g.seed}/800/800`}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ filter: STILL_FILTER }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* values / how we programme */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className={`${DISPLAY} text-3xl font-light leading-tight text-[var(--bone)]`}>
            How the programme is chosen
          </h2>
          <div className="space-y-8">
            {[
              {
                n: "01",
                head: "People, not platforms",
                body: "Two programmers, a projectionist, and a Tuesday-night argument. No studio bundles, no auto-renewing blockbuster contracts.",
              },
              {
                n: "02",
                head: "The print matters",
                body: "We screen 35mm whenever a good print exists, and 4K restorations when it doesn't. Format is listed on every ticket so you know what you're getting.",
              },
              {
                n: "03",
                head: "Room for the strange",
                body: "A late-night slot and a Sunday matinee mean we can take a risk on something difficult and still pay the heating bill.",
              },
            ].map((v) => (
              <Reveal key={v.n}>
                <div className="flex gap-6 border-t border-[var(--bone)]/10 pt-6">
                  <span className={`${DISPLAY} text-2xl text-[var(--amber)]`}>
                    {v.n}
                  </span>
                  <div>
                    <h3 className={`${UI} text-lg font-semibold text-[var(--bone)]`}>
                      {v.head}
                    </h3>
                    <p className={`${PROSE} mt-1.5 text-[15px] leading-relaxed text-[var(--bone-dim)]`}>
                      {v.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------- export --------------------------------- */

export default function TheStrand() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="programme" element={<Programme />} />
        <Route path="membership" element={<Membership />} />
        <Route path="visit" element={<Visit />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "The Strand — Independent repertory cinema",
  description:
    "A one-screen arthouse cinema since 1932: new films, restored classics, and late-night risks, with a poster wall that tilts under the foyer light.",
  date: "2026-06-24",
  type: "Event / Cinema",
  interaction: "3D poster tilt with cursor-tracking glare",
  pages: ["Home", "Programme", "Membership", "Visit", "About"],
}
