import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  Routes,
  Route,
  NavLink,
  Link,
  useParams,
  useLocation,
} from "react-router-dom"
import {
  motion,
  MotionConfig,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import {
  PHOTOGRAPHERS,
  ARCHIVE,
  CLIENTS,
  DISCIPLINES,
  FIGURES,
  type Photographer,
} from "./data"

/* =========================================================================
   PENUMBRA — a photographic representation agency.
   FEATURED INTERACTION: hover image-reveal. On the roster, hovering a
   photographer's name floats their signature frame and lets it follow the
   cursor with a spring. Touch/reduced-motion users get inline thumbnails and
   a static, fully-legible list instead — no capability is gated behind hover.
   ========================================================================= */

const C = {
  paper: "#F2EEE4",
  paper2: "#E9E3D5",
  ink: "#16130E",
  ink2: "#2A261E",
  mute: "#5C584C", // ~6.5:1 on paper — AA at small sizes
  line: "#D9D2C2",
  red: "#C8392B", // large accent / decoration only
  redInk: "#9E2616", // ~6:1 on paper — AA for small text/links
  redLt: "#E8786B", // accent on dark grounds
}

const DISPLAY = "'Instrument Serif', Georgia, serif"
const SANS = "'Space Grotesk', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* ----------------------------- small parts ----------------------------- */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{ fontFamily: MONO, color: C.redInk }}
      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
    >
      <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ background: C.red }} />
      {children}
    </span>
  )
}

function Counter({ value, raw }: { value: number; raw?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.3,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduce])
  return (
    <span ref={ref}>{raw ? n : n.toLocaleString()}</span>
  )
}

/* infinite client marquee — static under reduced motion */
function Marquee() {
  const reduce = useReducedMotion()
  const Row = (
    <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden>
      {CLIENTS.map((t) => (
        <span key={t} className="flex items-center gap-12">
          <span style={{ fontFamily: DISPLAY }} className="whitespace-nowrap text-[26px] leading-none">
            {t}
          </span>
          <span className="h-[5px] w-[5px] rounded-full" style={{ background: C.red }} />
        </span>
      ))}
    </div>
  )
  return (
    <div
      className="flex overflow-hidden border-y py-5"
      style={{ borderColor: C.line }}
      role="marquee"
      aria-label={`Recently commissioned by ${CLIENTS.join(", ")}`}
    >
      {reduce ? (
        <div className="flex flex-wrap gap-x-12 gap-y-3 px-6">{Row}</div>
      ) : (
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 34, ease: "linear", repeat: Infinity }}
        >
          {Row}
          {Row}
        </motion.div>
      )}
    </div>
  )
}

/* ====================== FEATURED: hover image-reveal ====================== */
function Roster({ items }: { items: Photographer[] }) {
  const base = useBase()
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const W = 360
  const H = 248
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 26, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 200, damping: 26, mass: 0.5 })

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return
        const r = wrapRef.current?.getBoundingClientRect()
        if (!r) return
        x.set(e.clientX - r.left - W / 2)
        y.set(e.clientY - r.top - H / 2)
      }}
    >
      {/* floating frame — hover-capable pointers only */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 hidden overflow-hidden rounded-[2px] shadow-[0_30px_60px_-20px_rgba(20,16,10,0.5)] [@media(hover:hover)]:block"
          style={{ x: sx, y: sy, width: W, height: H, borderColor: C.ink }}
          animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.9 : 1 }}
          transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="absolute inset-0" style={{ background: C.ink2 }} />
          <AnimatePresence>
            {active !== null && (
              <motion.img
                key={items[active].slug}
                src={img(items[active].seed, 720, 496)}
                alt=""
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "grayscale(0.12) contrast(1.04)" }}
              />
            )}
          </AnimatePresence>
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
            style={{ background: "linear-gradient(transparent, rgba(20,16,10,0.85))" }}
          >
            <span style={{ fontFamily: MONO, color: C.paper }} className="text-[10px] uppercase tracking-[0.18em]">
              {active !== null ? items[active].spec : ""}
            </span>
            <span style={{ fontFamily: MONO, color: C.redLt }} className="text-[10px]">
              {active !== null ? `0${active + 1}` : ""}
            </span>
          </div>
        </motion.div>
      )}

      <ul style={{ borderColor: C.line }} className="border-t">
        {items.map((p, i) => (
          <li key={p.slug} id={p.slug} className="scroll-mt-24" style={{ borderColor: C.line }}>
            <Link
              to={`${base}/photographers`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group flex items-center gap-4 border-b py-5 transition-colors duration-200 hover:bg-[rgba(200,57,43,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:py-7"
              style={{ borderColor: C.line, outlineColor: C.red }}
            >
              {/* mobile / no-hover inline thumbnail */}
              <img
                src={img(p.seed, 120, 120)}
                alt={`${p.name} — ${p.discipline}`}
                loading="lazy"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-[2px] object-cover grayscale [@media(hover:hover)]:hidden"
              />
              <span
                style={{ fontFamily: MONO, color: C.mute }}
                className="hidden w-8 shrink-0 text-[12px] [@media(hover:hover)]:block"
              >
                0{i + 1}
              </span>
              <span
                style={{ fontFamily: DISPLAY, color: C.ink }}
                className="flex-1 text-[28px] leading-[1.05] transition-transform duration-300 group-hover:translate-x-2 sm:text-[40px]"
              >
                {p.name}
              </span>
              <span
                style={{ fontFamily: MONO, color: C.mute }}
                className="hidden text-right text-[12px] uppercase tracking-[0.16em] sm:block"
              >
                {p.discipline}
                <br />
                <span style={{ color: C.redInk }}>{p.based}</span>
              </span>
              <ArrowUpRight
                className="ml-1 h-5 w-5 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                style={{ color: C.red }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* button styles */
function PrimaryLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Magnetic strength={0.35}>
      <Link
        to={to}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-transform duration-200 hover:-translate-y-0.5"
        style={{ background: C.ink, color: C.paper, fontFamily: SANS }}
      >
        {children}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </Magnetic>
  )
}

function GhostLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[14px] font-medium transition-colors duration-200 hover:bg-[rgba(20,16,10,0.05)]"
      style={{ borderColor: C.ink, color: C.ink, fontFamily: SANS }}
    >
      {children}
    </Link>
  )
}

/* ------------------------------- nav/footer ------------------------------- */
function Nav() {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Index", end: true },
    { to: `${base}/photographers`, label: "Photographers", end: false },
    { to: `${base}/archive`, label: "Archive", end: false },
    { to: `${base}/studio`, label: "Studio", end: false },
  ]
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: C.line, background: "rgba(242,238,228,0.84)" }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 pl-24 sm:pl-28">
        <Link to={base} className="group flex items-center gap-2 leading-none" onClick={() => setOpen(false)}>
          <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: C.ink }}>
            <span className="h-[10px] w-[10px] rounded-full" style={{ background: C.red }} />
          </span>
          <span style={{ fontFamily: DISPLAY, color: C.ink }} className="text-[26px] tracking-tight">
            Penumbra
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" style={{ fontFamily: SANS }}>
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className="relative px-3 py-1.5 text-[13.5px] transition-colors"
              style={({ isActive }) => ({ color: isActive ? C.ink : C.mute })}
            >
              {({ isActive }) => (
                <span className="relative">
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="pen-nav"
                      className="absolute -bottom-1.5 left-1 right-1 h-[2px]"
                      style={{ background: C.red }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
          <PrimaryLink to={`${base}/commission`}>Commission</PrimaryLink>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="h-[2px] w-5 transition-transform" style={{ background: C.ink, transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }} />
          <span className="h-[2px] w-5 transition-transform" style={{ background: C.ink, transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: C.line, fontFamily: SANS }}
          >
            {[...links, { to: `${base}/commission`, label: "Commission", end: false }].map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className="block px-6 py-3.5 text-[16px]"
                style={({ isActive }) => ({ color: isActive ? C.redInk : C.ink })}
              >
                {l.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  const base = useBase()
  return (
    <footer style={{ background: C.ink, color: C.paper }} className="mt-24">
      <div className="mx-auto max-w-[1280px] px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span style={{ fontFamily: DISPLAY }} className="text-[40px] leading-none">
              Penumbra
            </span>
            <p style={{ fontFamily: SANS, color: "rgba(242,238,228,0.7)" }} className="mt-4 max-w-xs text-[15px] leading-relaxed">
              A photographic representation agency. Documentary, editorial and
              assignment work, placed worldwide since 2009.
            </p>
          </div>
          <div style={{ fontFamily: SANS }}>
            <p style={{ fontFamily: MONO, color: C.redLt }} className="text-[11px] uppercase tracking-[0.2em]">
              Pages
            </p>
            <ul className="mt-4 space-y-2 text-[15px]">
              <li><Link to={base} className="text-[rgba(242,238,228,0.8)] hover:text-[#F2EEE4]">Index</Link></li>
              <li><Link to={`${base}/photographers`} className="text-[rgba(242,238,228,0.8)] hover:text-[#F2EEE4]">Photographers</Link></li>
              <li><Link to={`${base}/archive`} className="text-[rgba(242,238,228,0.8)] hover:text-[#F2EEE4]">Archive</Link></li>
              <li><Link to={`${base}/studio`} className="text-[rgba(242,238,228,0.8)] hover:text-[#F2EEE4]">Studio</Link></li>
            </ul>
          </div>
          <div style={{ fontFamily: SANS }}>
            <p style={{ fontFamily: MONO, color: C.redLt }} className="text-[11px] uppercase tracking-[0.2em]">
              Studio
            </p>
            <address className="mt-4 space-y-2 text-[15px] not-italic text-[rgba(242,238,228,0.8)]">
              <p>11 Bourdon Street<br />London W1K 3PL</p>
              <p>
                <a href="mailto:desk@penumbra.agency" className="border-b" style={{ borderColor: "rgba(232,120,107,0.5)" }}>
                  desk@penumbra.agency
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t pt-6 text-[12px] sm:flex-row" style={{ borderColor: "rgba(242,238,228,0.16)", fontFamily: MONO, color: "rgba(242,238,228,0.55)" }}>
          <span>© 2009–2026 Penumbra Photographic Ltd.</span>
          <span className="uppercase tracking-[0.18em]">Representation · Assignment · Licensing</span>
        </div>
      </div>
    </footer>
  )
}

/* ---------------------------------- HOME ---------------------------------- */
function Home() {
  const base = useBase()
  return (
    <main>
      {/* hero */}
      <section className="mx-auto max-w-[1280px] px-5 pb-12 pt-14 sm:pt-20">
        <Eyebrow>Photographic representation · London</Eyebrow>
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
          <h1 style={{ fontFamily: DISPLAY, color: C.ink }} className="text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.96] tracking-[-0.01em]">
            Pictures made by{" "}
            <span style={{ color: C.red }} className="italic">people who stay</span>{" "}
            longer than the brief.
          </h1>
          <div>
            <p style={{ fontFamily: SANS, color: C.mute }} className="max-w-md text-[16px] leading-relaxed">
              Penumbra represents fourteen photographers working in documentary,
              landscape, portrait and assignment photography. We place their work
              with editors and brands who care about the difference.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryLink to={`${base}/photographers`}>Meet the roster</PrimaryLink>
              <GhostLink to={`${base}/commission`}>Commission work</GhostLink>
            </div>
          </div>
        </div>

        {/* hero contact-sheet frame */}
        <figure className="mt-12 overflow-hidden rounded-[3px] border" style={{ borderColor: C.ink }}>
          <div className="relative aspect-[16/7]">
            <img
              src={img("penumbra-hero-coast-storm", 1600, 700)}
              alt="A lone figure on a storm-lit coastline, from a Penumbra assignment"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "grayscale(0.2) contrast(1.05)" }}
            />
            <figcaption
              className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              style={{ background: "linear-gradient(transparent, rgba(20,16,10,0.8))", fontFamily: MONO }}
            >
              <span style={{ color: C.paper }} className="text-[11px] uppercase tracking-[0.18em]">
                Tobias Renn — "Outer Hebrides, V" · 2025
              </span>
              <span style={{ color: C.redLt }} className="text-[11px]">
                6×7 · Portra 160 · 1/250s · f/8
              </span>
            </figcaption>
          </div>
        </figure>
      </section>

      {/* marquee */}
      <section className="mx-auto max-w-[1280px] px-5">
        <p style={{ fontFamily: MONO, color: C.mute }} className="mb-3 text-[11px] uppercase tracking-[0.2em]">
          Recently commissioned by
        </p>
      </section>
      <Marquee />

      {/* roster teaser — featured interaction */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>The roster</Eyebrow>
            <h2 style={{ fontFamily: DISPLAY, color: C.ink }} className="mt-3 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1]">
              Hover a name. The frame finds you.
            </h2>
          </div>
          <Link
            to={`${base}/photographers`}
            className="hidden shrink-0 items-center gap-1.5 text-[14px] sm:inline-flex"
            style={{ fontFamily: SANS, color: C.redInk }}
          >
            All fourteen <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          <Roster items={PHOTOGRAPHERS.slice(0, 6)} />
        </div>
      </section>

      {/* statement */}
      <section className="border-y" style={{ borderColor: C.line, background: C.paper2 }}>
        <div className="mx-auto max-w-[1080px] px-5 py-20 sm:py-28">
          <p style={{ fontFamily: DISPLAY, color: C.ink }} className="text-[clamp(1.8rem,4vw,3.1rem)] leading-[1.18]">
            We are not a stock library and we are not a directory. We are nine
            people who know our photographers' work intimately — every contact
            sheet, every assignment, every weather window they waited out — and
            who answer the phone when an editor needs the{" "}
            <span style={{ color: C.redInk }} className="italic">right</span> one.
          </p>
          <p style={{ fontFamily: MONO, color: C.mute }} className="mt-8 text-[12px] uppercase tracking-[0.2em]">
            — Della Quaye, founder &amp; head of representation
          </p>
        </div>
      </section>

      {/* closing CTA */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 text-center sm:py-28">
        <Eyebrow>Working with us</Eyebrow>
        <h2 style={{ fontFamily: DISPLAY, color: C.ink }} className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,5vw,3.8rem)] leading-[1.02]">
          Tell us what you're making. We'll tell you who should shoot it.
        </h2>
        <div className="mt-8 flex justify-center">
          <PrimaryLink to={`${base}/commission`}>Start a commission</PrimaryLink>
        </div>
      </section>
    </main>
  )
}

/* ----------------------------- PHOTOGRAPHERS ----------------------------- */
function Photographers() {
  const [filter, setFilter] = useState<string>("All")
  const shown = filter === "All" ? PHOTOGRAPHERS : PHOTOGRAPHERS.filter((p) => p.discipline === filter)
  return (
    <main className="mx-auto max-w-[1280px] px-5 pb-12 pt-14 sm:pt-20">
      <Eyebrow>Represented photographers</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, color: C.ink }} className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98]">
        Fourteen ways of seeing, one desk to reach them.
      </h1>
      <p style={{ fontFamily: SANS, color: C.mute }} className="mt-5 max-w-xl text-[16px] leading-relaxed">
        Filter by discipline, then hover any name to preview a signature frame.
        Every photographer is exclusively represented and available for
        assignment worldwide.
      </p>

      {/* discipline filter */}
      <div className="mt-8 flex flex-wrap gap-2" style={{ fontFamily: MONO }}>
        {["All", ...DISCIPLINES].map((d) => {
          const on = filter === d
          return (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className="rounded-full border px-3.5 py-1.5 text-[12px] uppercase tracking-[0.12em] transition-colors duration-200"
              style={{
                borderColor: on ? C.ink : C.line,
                background: on ? C.ink : "transparent",
                color: on ? C.paper : C.mute,
              }}
            >
              {d}
            </button>
          )
        })}
      </div>

      <div className="mt-8">
        {shown.length > 0 ? (
          <Roster items={shown} />
        ) : (
          <p style={{ fontFamily: SANS, color: C.mute }} className="py-12">
            No photographers in that discipline yet.
          </p>
        )}
      </div>

      <p style={{ fontFamily: MONO, color: C.mute }} className="mt-10 text-[12px] leading-relaxed">
        {shown.length} of {PHOTOGRAPHERS.length} shown · representation enquiries
        to <span style={{ color: C.redInk }}>desk@penumbra.agency</span>
      </p>

      {/* representation notes */}
      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.slice(0, 3).map((p) => (
          <article key={p.slug} className="rounded-[3px] border p-5" style={{ borderColor: C.line }}>
            <p style={{ fontFamily: MONO, color: C.redInk }} className="text-[11px] uppercase tracking-[0.18em]">
              {p.discipline} · {p.based}
            </p>
            <h3 style={{ fontFamily: DISPLAY, color: C.ink }} className="mt-2 text-[28px] leading-none">
              {p.name}
            </h3>
            <p style={{ fontFamily: SANS, color: C.mute }} className="mt-3 text-[15px] leading-relaxed">
              {p.note}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}

/* -------------------------------- ARCHIVE -------------------------------- */
function Archive() {
  return (
    <main className="mx-auto max-w-[1280px] px-5 pb-12 pt-14 sm:pt-20">
      <Eyebrow>Selected work · the contact sheet</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, color: C.ink }} className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98]">
        Frames we keep coming back to.
      </h1>
      <p style={{ fontFamily: SANS, color: C.mute }} className="mt-5 max-w-xl text-[16px] leading-relaxed">
        A rotating selection from the agency archive. Hover a frame to bring it
        up from grayscale — the way a print surfaces in the developer tray.
        Licensing on request.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {ARCHIVE.map((a, i) => (
          <motion.figure
            key={a.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={`group overflow-hidden rounded-[3px] border ${a.span === 2 ? "col-span-2" : ""}`}
            style={{ borderColor: C.line }}
          >
            <div className={`relative ${a.span === 2 ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
              <img
                src={img(a.seed, a.span === 2 ? 1000 : 600, a.span === 2 ? 560 : 760)}
                alt={`${a.title} — ${a.photographer}, ${a.place} ${a.year}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
              />
              <figcaption
                className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3 py-2.5 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                style={{ background: "linear-gradient(transparent, rgba(20,16,10,0.85))" }}
              >
                <div>
                  <p style={{ fontFamily: DISPLAY, color: C.paper }} className="text-[18px] leading-tight">
                    {a.title}
                  </p>
                  <p style={{ fontFamily: MONO, color: "rgba(242,238,228,0.75)" }} className="text-[10px] uppercase tracking-[0.14em]">
                    {a.photographer} · {a.place} {a.year}
                  </p>
                </div>
                <span style={{ fontFamily: MONO, color: C.redLt }} className="shrink-0 text-[10px]">
                  {a.spec}
                </span>
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </main>
  )
}

/* --------------------------------- STUDIO --------------------------------- */
function Studio() {
  const base = useBase()
  const steps = [
    { k: "01", t: "We answer the phone", d: "A real person who knows the roster picks up — not a portal. Tell us the assignment, the territory, the deadline." },
    { k: "02", t: "We match, not list", d: "You get two or three names chosen for your brief, with the reasoning and recent work, usually within the day." },
    { k: "03", t: "We run the shoot", d: "Quotes, usage, logistics, kit, fixers and post — handled by the desk so the photographer can concentrate on the picture." },
    { k: "04", t: "We protect the work", d: "Licensing, archive and re-use are tracked for the life of the image. The photographer is paid correctly, every time." },
  ]
  return (
    <main className="mx-auto max-w-[1280px] px-5 pb-12 pt-14 sm:pt-20">
      <Eyebrow>The studio</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, color: C.ink }} className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98]">
        A small desk that takes the weight, so the picture is the only thing left to make.
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <p style={{ fontFamily: SANS, color: C.mute }} className="text-[17px] leading-relaxed">
          Penumbra was founded in 2009 above a framer's on Bourdon Street. We
          began with three photographers and a conviction that representation
          should mean advocacy — not a logo on a contact form. Sixteen years on
          the desk is nine people, the roster is fourteen, and the principle has
          not moved an inch.
        </p>
        <p style={{ fontFamily: SANS, color: C.mute }} className="text-[17px] leading-relaxed">
          We work across editorial, advertising and long-form documentary. Some
          of our photographers file from a studio a mile away; others are
          unreachable for weeks at a time on the ice. Our job is to make either
          one feel effortless to the person commissioning the work.
        </p>
      </div>

      {/* figures */}
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border lg:grid-cols-4" style={{ borderColor: C.line, background: C.line }}>
        {FIGURES.map((f) => (
          <div key={f.label} className="p-6" style={{ background: C.paper }}>
            <p style={{ fontFamily: DISPLAY, color: C.ink }} className="text-[clamp(2.6rem,5vw,3.6rem)] leading-none">
              <Counter value={f.value} raw={f.raw} />
              {f.suffix}
            </p>
            <p style={{ fontFamily: MONO, color: C.mute }} className="mt-2 text-[11px] uppercase tracking-[0.16em]">
              {f.label}
            </p>
          </div>
        ))}
      </div>

      {/* process */}
      <section className="mt-20">
        <Eyebrow>How we work</Eyebrow>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[3px] border sm:grid-cols-2" style={{ borderColor: C.line, background: C.line }}>
          {steps.map((s) => (
            <div key={s.k} className="flex gap-5 p-7" style={{ background: C.paper }}>
              <span style={{ fontFamily: MONO, color: C.red }} className="text-[13px]">{s.k}</span>
              <div>
                <h3 style={{ fontFamily: DISPLAY, color: C.ink }} className="text-[26px] leading-none">{s.t}</h3>
                <p style={{ fontFamily: SANS, color: C.mute }} className="mt-3 text-[15px] leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[3px] p-10 text-center sm:p-16" style={{ background: C.ink }}>
        <h2 style={{ fontFamily: DISPLAY, color: C.paper }} className="mx-auto max-w-2xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.05]">
          The best brief is a conversation. Let's have it.
        </h2>
        <div className="mt-7 flex justify-center">
          <Magnetic strength={0.35}>
            <Link
              to={`${base}/commission`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium"
              style={{ background: C.red, color: C.paper, fontFamily: SANS }}
            >
              Commission a photographer <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </section>
    </main>
  )
}

/* ------------------------------- COMMISSION ------------------------------- */
function Commission() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", org: "", email: "", type: DISCIPLINES[0], brief: "" })
  const field = "w-full rounded-[3px] border bg-transparent px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-[#16130E]"
  const labelCls = "mb-1.5 block text-[12px] uppercase tracking-[0.16em]"
  return (
    <main className="mx-auto max-w-[1280px] px-5 pb-12 pt-14 sm:pt-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <Eyebrow>Commission &amp; representation</Eyebrow>
          <h1 style={{ fontFamily: DISPLAY, color: C.ink }} className="mt-5 text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.98]">
            Start with the assignment. We'll bring the eye.
          </h1>
          <p style={{ fontFamily: SANS, color: C.mute }} className="mt-5 max-w-md text-[16px] leading-relaxed">
            Tell us what you're making and we'll come back — usually same day —
            with the right two or three photographers, sample work and an honest
            read on budget and timeline.
          </p>

          <dl className="mt-10 space-y-5" style={{ fontFamily: SANS }}>
            {[
              { t: "The desk", d: "desk@penumbra.agency", href: "mailto:desk@penumbra.agency" },
              { t: "By phone", d: "+44 20 7946 0102", href: "tel:+442079460102" },
              { t: "Studio", d: "11 Bourdon Street, London W1K 3PL" },
            ].map((c) => (
              <div key={c.t} className="flex items-baseline gap-4 border-b pb-4" style={{ borderColor: C.line }}>
                <dt style={{ fontFamily: MONO, color: C.mute }} className="w-24 shrink-0 text-[11px] uppercase tracking-[0.16em]">{c.t}</dt>
                <dd style={{ color: C.ink }} className="text-[16px]">
                  {c.href ? (
                    <a href={c.href} className="border-b" style={{ borderColor: C.red }}>{c.d}</a>
                  ) : c.d}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* form */}
        <div className="rounded-[4px] border p-6 sm:p-8" style={{ borderColor: C.ink, background: C.paper2 }}>
          {sent ? (
            <div className="flex h-full min-h-[320px] flex-col items-start justify-center">
              <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: C.red }}>
                <Plus className="h-6 w-6 rotate-45" style={{ color: C.paper }} />
              </span>
              <h2 style={{ fontFamily: DISPLAY, color: C.ink }} className="mt-5 text-[34px] leading-none">
                Brief received.
              </h2>
              <p style={{ fontFamily: SANS, color: C.mute }} className="mt-3 max-w-sm text-[15px] leading-relaxed">
                Thank you, {form.name || "there"}. The desk will reply to{" "}
                {form.email || "you"} within one business day with names to consider.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-[14px] underline"
                style={{ fontFamily: SANS, color: C.redInk }}
              >
                Send another brief
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              style={{ fontFamily: SANS }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={labelCls} style={{ fontFamily: MONO, color: C.mute }}>Your name</label>
                  <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} style={{ borderColor: C.line, color: C.ink }} placeholder="Jules Marsh" />
                </div>
                <div>
                  <label htmlFor="c-org" className={labelCls} style={{ fontFamily: MONO, color: C.mute }}>Organisation</label>
                  <input id="c-org" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className={field} style={{ borderColor: C.line, color: C.ink }} placeholder="Monocle" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="c-email" className={labelCls} style={{ fontFamily: MONO, color: C.mute }}>Email</label>
                <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} style={{ borderColor: C.line, color: C.ink }} placeholder="you@title.com" />
              </div>
              <div className="mt-4">
                <label htmlFor="c-type" className={labelCls} style={{ fontFamily: MONO, color: C.mute }}>Type of work</label>
                <select id="c-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={field} style={{ borderColor: C.line, color: C.ink }}>
                  {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="c-brief" className={labelCls} style={{ fontFamily: MONO, color: C.mute }}>The brief</label>
                <textarea id="c-brief" required rows={4} value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} className={`${field} resize-none`} style={{ borderColor: C.line, color: C.ink }} placeholder="What are you making, where, and by when?" />
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: C.ink, color: C.paper }}
              >
                Send the brief <ArrowUpRight className="h-4 w-4" />
              </button>
              <p style={{ fontFamily: MONO, color: C.mute }} className="mt-3 text-center text-[11px]">
                Replies within one business day · no automated responses
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

/* --------------------------------- shell --------------------------------- */
function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

export default function Penumbra() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <MotionConfig reducedMotion="user">
      <div style={{ background: C.paper, color: C.ink, minHeight: "100vh" }}>
        <Grain />
        <Nav />
        <Page>
          <Routes>
            <Route index element={<Home />} />
            <Route path="photographers" element={<Photographers />} />
            <Route path="archive" element={<Archive />} />
            <Route path="studio" element={<Studio />} />
            <Route path="commission" element={<Commission />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Page>
        <Footer />
      </div>
    </MotionConfig>
  )
}

export const meta: SiteMeta = {
  title: "Penumbra — Photographic representation agency",
  description:
    "A London photo agency representing documentary, landscape and editorial photographers — featuring a cursor-following hover image-reveal roster.",
  date: "2026-06-24",
  type: "Photography agency",
  interaction: "Hover image-reveal (cursor-following floating frames) + infinite marquee + animated counters",
  pages: ["Index", "Photographers", "Archive", "Studio", "Commission"],
}
