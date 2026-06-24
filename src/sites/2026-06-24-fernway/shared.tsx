import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { NavLink, Link, useParams } from "react-router-dom"
import { motion, useInView, useReducedMotion, animate } from "framer-motion"
import { Flower2, Sun, Leaf, Snowflake, ArrowUpRight } from "lucide-react"
import { SEASONS, type Season, type SeasonKey } from "./data"

/* =========================================================================
   FERNWAY — type & fixed neutrals
   The neutrals (warm paper, deep botanical-green ink) stay constant; the
   ACCENT, hero sky and foliage shift with the season via CSS variables set
   on the Layout root, so the whole site morphs colour when you switch.
   ========================================================================= */
export const DISPLAY = "'Fraunces', Georgia, serif"
export const SERIF = "'Spectral', Georgia, serif"
export const SANS = "'Hanken Grotesk', system-ui, sans-serif"
export const MONO = "'IBM Plex Mono', monospace"

export const N = {
  paper: "#F4F1E7",
  paper2: "#ECE7D8",
  ink: "#19231B", // deep evergreen, ~13:1 on paper
  inkSoft: "#53604D", // ~5.0:1 on paper — AA small text
  line: "#DDD6C4",
  glass: "rgba(244,241,231,0.86)",
}

/* ----------------------------- season context ----------------------------- */
interface SeasonCtx {
  season: Season
  setKey: (k: SeasonKey) => void
}
const Ctx = createContext<SeasonCtx | null>(null)

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<SeasonKey>("spring")
  const season = SEASONS.find((s) => s.key === key)!
  return <Ctx.Provider value={{ season, setKey }}>{children}</Ctx.Provider>
}

export function useSeason() {
  const v = useContext(Ctx)
  if (!v) throw new Error("useSeason must be used within SeasonProvider")
  return v
}

export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/** CSS custom properties derived from the active season. */
function seasonVars(s: Season): CSSProperties {
  return {
    ["--accent" as string]: s.accent,
    ["--accent-ink" as string]: s.accentInk,
    ["--accent-soft" as string]: s.accentSoft,
    ["--sky-a" as string]: s.skyA,
    ["--sky-b" as string]: s.skyB,
    ["--leaf" as string]: s.leaf,
  }
}

/* ----------------------------- season switcher ----------------------------- */
const ICONS: Record<SeasonKey, typeof Sun> = {
  spring: Flower2,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
}

export function SeasonSwitcher({ compact = false }: { compact?: boolean }) {
  const { season, setKey } = useSeason()
  return (
    <div
      role="radiogroup"
      aria-label="Choose a season"
      className="inline-flex items-center gap-1 rounded-full p-1"
      style={{ background: N.paper2, border: `1px solid ${N.line}` }}
    >
      {SEASONS.map((s) => {
        const Icon = ICONS[s.key]
        const active = s.key === season.key
        return (
          <button
            key={s.key}
            role="radio"
            aria-checked={active}
            onClick={() => setKey(s.key)}
            title={`${s.name} · ${s.months}`}
            className="relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium outline-none transition-colors focus-visible:ring-2"
            style={{
              color: active ? N.paper : N.inkSoft,
              fontFamily: SANS,
              ["--tw-ring-color" as string]: s.accentInk,
            }}
          >
            {active && (
              <motion.span
                layoutId="season-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: s.accentInk }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
              {!compact && <span className="hidden sm:inline">{s.name}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ----------------------------- nav ----------------------------- */
function Nav() {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/glasshouses`, label: "Glasshouses", end: false },
    { to: `${base}/whats-on`, label: "What's On", end: false },
    { to: `${base}/visit`, label: "Visit", end: false },
  ]
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: N.line, background: N.glass }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
        <Link to={base} className="flex items-baseline gap-2.5 leading-none" onClick={() => setOpen(false)}>
          <span style={{ fontFamily: DISPLAY, color: N.ink }} className="text-[25px] font-medium tracking-tight">
            Fernway
          </span>
          <span
            className="hidden text-[10px] uppercase tracking-[0.22em] transition-colors duration-500 sm:inline"
            style={{ fontFamily: MONO, color: "var(--accent-ink)" }}
          >
            est. 1871
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" style={{ fontFamily: SANS }}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="group relative text-[13.5px] tracking-wide transition-colors"
              style={({ isActive }) => ({ color: isActive ? N.ink : N.inkSoft })}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-300"
                    style={{ background: "var(--accent)", transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SeasonSwitcher />
          <button
            className="md:hidden"
            style={{ fontFamily: MONO, color: N.ink }}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t md:hidden" style={{ borderColor: N.line, fontFamily: SANS }}>
          <div className="mx-auto flex max-w-[1200px] flex-col px-5 py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className="border-b py-3 text-sm last:border-0"
                style={({ isActive }) => ({ borderColor: N.line, color: isActive ? "var(--accent-ink)" : N.ink })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

/* ----------------------------- footer ----------------------------- */
function Footer() {
  const base = useBase()
  return (
    <footer style={{ background: N.ink, color: N.paper }}>
      <div className="mx-auto max-w-[1200px] px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div style={{ fontFamily: DISPLAY }} className="text-3xl font-medium">
              Fernway
            </div>
            <p style={{ fontFamily: SERIF, color: "rgba(244,241,231,0.7)" }} className="mt-3 max-w-xs text-[15px] leading-relaxed">
              A Victorian glasshouse garden on the eastern edge of the city. Open every day but Christmas, in every
              weather, all year round.
            </p>
            <div className="mt-5 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: "rgba(244,241,231,0.7)" }}>
              Marsh Lane · open 09:00 – dusk
            </div>
          </div>
          <FootCol
            title="Wander"
            links={[
              { to: `${base}/glasshouses`, label: "The Glasshouses" },
              { to: `${base}/whats-on`, label: "What's On" },
              { to: `${base}/visit`, label: "Plan a Visit" },
            ]}
          />
          <FootCol
            title="The garden"
            links={[
              { to: base, label: "Marsh Lane, EX4" },
              { to: base, label: "+44 1392 00 1871" },
              { to: base, label: "hello@fernway.garden" },
            ]}
          />
        </div>
        <div
          className="mt-14 flex flex-col justify-between gap-2 border-t pt-6 text-[11px] sm:flex-row"
          style={{ borderColor: "rgba(244,241,231,0.16)", fontFamily: MONO, color: "rgba(244,241,231,0.6)" }}
        >
          <span>© 1871–2026 The Fernway Trust · Registered charity 204 118</span>
          <span className="uppercase tracking-[0.2em]">Grown, not bought</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: "rgba(244,241,231,0.6)" }}>
        {title}
      </div>
      <ul className="mt-4 space-y-2.5" style={{ fontFamily: SANS }}>
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-[14px] text-[var(--paper)] transition-colors duration-300 hover:text-[var(--accent)]"
              style={{ ["--paper" as string]: "rgba(244,241,231,0.86)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ----------------------------- Layout ----------------------------- */
export function Layout({ children }: { children: ReactNode }) {
  const { season } = useSeason()
  return (
    <div style={{ background: N.paper, color: N.ink, ...seasonVars(season) }} className="min-h-screen antialiased">
      <Nav />
      {children}
      <Footer />
    </div>
  )
}

/* ----------------------------- helpers ----------------------------- */
export const wrap = "mx-auto max-w-[1200px] px-5"

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] transition-colors duration-500 ${className}`}
      style={{ fontFamily: MONO, color: "var(--accent-ink)" }}
    >
      <span className="inline-block h-[7px] w-[7px] rounded-full transition-colors duration-500" style={{ background: "var(--accent)" }} />
      {children}
    </div>
  )
}

export function ArrowLink({ to, children, dark = false }: { to: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors"
      style={{ fontFamily: SANS, color: dark ? N.paper : N.ink }}
    >
      {children}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: "var(--accent-ink)" }}
      />
    </Link>
  )
}

/** Count-up that fires once on scroll into view. */
export function Counter({
  to,
  suffix = "",
  className,
  style,
}: {
  to: number
  suffix?: string
  className?: string
  style?: CSSProperties
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
      duration: 1.5,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} className={className} style={style}>
      {Math.round(val).toLocaleString("en-GB")}
      {suffix}
    </span>
  )
}
