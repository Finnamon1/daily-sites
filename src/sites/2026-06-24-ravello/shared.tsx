import { useEffect, useRef, useState, type ReactNode } from "react"
import { NavLink, Link, useParams } from "react-router-dom"
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion"
import { ArrowUpRight } from "lucide-react"

/* ---- palette: cobalt accent on warm paper + near-black ink ---- */
export const C = {
  paper: "#F4F1E8",
  paper2: "#ECE6D8",
  ink: "#16150E",
  mute: "#5B594D", // solid muted, ~6.8:1 on paper for small text (AA)
  line: "#D8D2C2",
  blue: "#2438D6", // bright accent, large + dark grounds
  blueInk: "#1E2DA8", // deeper sibling for small text on paper (AA)
  blueLt: "#9AA6FF", // light blue for dark grounds
}

export const DISPLAY = "'Fraunces', serif"
export const SANS = "'Hanken Grotesk', system-ui, sans-serif"
export const MONO = "'JetBrains Mono', monospace"

export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* ---- persistent top nav ---- */
export function Nav() {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/library`, label: "Library", end: false },
    { to: `${base}/tester`, label: "Type Tester", end: false },
    { to: `${base}/studio`, label: "Studio", end: false },
    { to: `${base}/license`, label: "License", end: false },
  ]
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: C.line, background: "rgba(244,241,232,0.82)" }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3.5 pl-24 sm:pl-28">
        <Link to={base} className="group flex items-baseline gap-2 leading-none">
          <span
            style={{ fontFamily: DISPLAY, color: C.ink, fontVariationSettings: "'wght' 600, 'opsz' 40" }}
            className="text-[22px]"
          >
            Ravello
          </span>
          <span style={{ fontFamily: MONO, color: C.blueInk }} className="text-[10px] tracking-[0.22em] uppercase">
            Type
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" style={{ fontFamily: SANS }}>
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className="relative px-3 py-1.5 text-[13.5px] font-medium transition-colors"
              style={({ isActive }) => ({ color: isActive ? C.ink : C.mute })}
            >
              {({ isActive }) => (
                <span className="relative">
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-[3px] rounded-full"
                      style={{ background: C.blue }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
          <Link
            to={`${base}/license`}
            className="ml-2 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: C.ink, color: C.paper, fontFamily: SANS }}
          >
            Buy fonts
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="h-[2px] w-5" style={{ background: C.ink }} />
          <span className="h-[2px] w-5" style={{ background: C.ink }} />
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden" style={{ borderColor: C.line, fontFamily: SANS }}>
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-[15px] font-medium"
              style={({ isActive }) => ({ color: isActive ? C.blueInk : C.ink })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

export function Footer() {
  const base = useBase()
  return (
    <footer style={{ background: C.ink, color: C.paper }}>
      <div className="mx-auto max-w-[1240px] px-5 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 500, 'opsz' 90" }} className="text-5xl leading-[0.95] sm:text-7xl">
              Set it
              <br />
              <span style={{ color: C.blueLt, fontVariationSettings: "'wght' 600, 'opsz' 90" }}>beautifully.</span>
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2.5 text-sm" style={{ fontFamily: SANS }}>
            {[
              { to: base, t: "Home" },
              { to: `${base}/library`, t: "Library" },
              { to: `${base}/tester`, t: "Type Tester" },
              { to: `${base}/studio`, t: "Studio" },
              { to: `${base}/license`, t: "License" },
            ].map((l) => (
              <Link key={l.t} to={l.to} className="opacity-70 transition-opacity hover:opacity-100">
                {l.t}
              </Link>
            ))}
          </nav>
        </div>
        <div
          className="mt-14 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "rgba(244,241,232,0.16)", fontFamily: MONO, color: "rgba(244,241,232,0.6)" }}
        >
          <span>© {2026} Ravello Type Foundry — Lisbon & Leeds</span>
          <span>Drawn slowly. Spaced by hand.</span>
        </div>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: SANS }} className="min-h-screen antialiased">
      <Nav />
      {children}
      <Footer />
    </div>
  )
}

/* ---- infinite glyph marquee ---- */
export function Marquee({ items, speed = 34 }: { items: string[]; speed?: number }) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y py-5" style={{ borderColor: C.line }}>
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        style={{ fontFamily: DISPLAY }}
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {row.map((g, i) => (
          <span
            key={i}
            className="text-4xl sm:text-5xl"
            style={{
              color: i % 5 === 2 ? C.blue : C.ink,
              fontVariationSettings: `'wght' ${i % 3 === 0 ? 600 : 400}, 'opsz' 80`,
            }}
          >
            {g}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ---- animated counter ---- */
export function Stat({ to, label, suffix = "" }: { to: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setV(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => setV(Math.round(n)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])
  return (
    <div ref={ref}>
      <div style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 580, 'opsz' 80" }} className="text-5xl sm:text-6xl">
        {v}
        <span style={{ color: C.blue }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: MONO, color: C.mute }} className="mt-2 text-[11px] uppercase tracking-[0.18em]">
        {label}
      </div>
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{ fontFamily: MONO, color: C.blueInk }}
      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em]"
    >
      <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ background: C.blue }} />
      {children}
    </span>
  )
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
      style={{ color: C.blueInk, fontFamily: SANS }}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}
