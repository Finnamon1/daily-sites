import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react"
import { NavLink, Link, useParams } from "react-router-dom"
import { useInView, useReducedMotion, animate } from "framer-motion"
import { Pause, Play, Radio, ArrowUpRight, Volume2 } from "lucide-react"
import type { Episode } from "./data"

/* =========================================================================
   ROOMTONE — palette & type
   A studio-at-night scheme: warm near-black, bone type, and one acid
   "on-air" chartreuse that behaves like the glow of a VU meter. The accent
   is bright enough for big display + waveforms; text that sits ON the accent
   always uses ink, never bone (chartreuse is too light to carry pale text).
   ========================================================================= */
export const C = {
  ink: "#0E0E0C", // warm near-black ground
  ink2: "#15150F",
  panel: "#1A1A12",
  panelHi: "#222218",
  bone: "#ECE9DD", // primary type on dark
  bone2: "#C9C6B8",
  mute: "rgba(236,233,221,0.62)", // ~AA for >=14px on ink
  muteHi: "rgba(236,233,221,0.80)",
  line: "rgba(236,233,221,0.14)",
  lineHi: "rgba(236,233,221,0.26)",
  accent: "#CBF24A", // acid chartreuse — display, waveform, dots
  accentDim: "#8FA838", // for fine lines on light? (rarely used)
  onAccent: "#13160A", // ink that sits on accent fills
}

export const DISPLAY = "'Fraunces', Georgia, serif"
export const SERIF = "'Spectral', Georgia, serif"
export const SANS = "'Hanken Grotesk', system-ui, sans-serif"
export const MONO = "'JetBrains Mono', monospace"

export const wrap = "mx-auto max-w-[1200px] px-5 sm:px-7"

export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* ---------- helpers ---------- */
export function fmtTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/** Deterministic 0..1 generator from a string seed (mulberry-ish). */
function seeded(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

/** Stable bar heights (0.16..1) for a waveform from a seed. */
export function waveBars(seed: string, n = 56): number[] {
  const rng = seeded(seed)
  return Array.from({ length: n }, (_, i) => {
    // gentle envelope so the clip "breathes" louder in the middle
    const env = 0.55 + 0.45 * Math.sin((i / n) * Math.PI)
    const v = (0.2 + rng() * 0.8) * env
    return Math.max(0.16, Math.min(1, v))
  })
}

/* =========================================================================
   PLAYER — a faux audio player lifted into context ABOVE <Routes> so the
   now-playing bar and its waveform survive page navigation. Progress
   advances on a timer while playing; everything is keyboard reachable.
   ========================================================================= */
interface PlayerState {
  current: Episode | null
  playing: boolean
  progress: number // 0..1
  play: (ep: Episode) => void
  toggle: () => void
  seek: (p: number) => void
}
const PlayerCtx = createContext<PlayerState | null>(null)
export const usePlayer = () => {
  const c = useContext(PlayerCtx)
  if (!c) throw new Error("usePlayer outside provider")
  return c
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Episode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const raf = useRef<number | null>(null)
  const last = useRef<number | null>(null)

  // advance progress in real time relative to the (faux) clip length
  useEffect(() => {
    if (!playing || !current) return
    const step = (t: number) => {
      if (last.current == null) last.current = t
      const dt = (t - last.current) / 1000
      last.current = t
      setProgress((p) => {
        const next = p + dt / current.length
        if (next >= 1) {
          setPlaying(false)
          return 1
        }
        return next
      })
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      last.current = null
    }
  }, [playing, current])

  const value = useMemo<PlayerState>(
    () => ({
      current,
      playing,
      progress,
      play: (ep) => {
        if (current?.id !== ep.id) {
          setCurrent(ep)
          setProgress(0)
        }
        setPlaying(true)
      },
      toggle: () => setPlaying((p) => !p),
      seek: (p) => setProgress(Math.max(0, Math.min(1, p))),
    }),
    [current, playing, progress],
  )

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>
}

/* =========================================================================
   FEATURED INTERACTION — the reactive waveform.
   Bars are deterministic from a seed; the played portion glows accent while
   the rest stays as faint ticks. While the clip plays the played bars dance
   on a staggered CSS equaliser keyframe (paused under reduced-motion). Click
   or arrow-key the track to scrub.
   ========================================================================= */
export function Waveform({
  seed,
  progress,
  live,
  onSeek,
  height = 56,
  bars = 56,
  className = "",
}: {
  seed: string
  progress: number
  live: boolean
  onSeek?: (p: number) => void
  height?: number
  bars?: number
  className?: string
}) {
  const data = useMemo(() => waveBars(seed, bars), [seed, bars])
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const seekAt = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r || !onSeek) return
    onSeek((clientX - r.left) / r.width)
  }

  return (
    <div
      ref={ref}
      role={onSeek ? "slider" : undefined}
      aria-label={onSeek ? "Seek within episode" : undefined}
      aria-valuemin={onSeek ? 0 : undefined}
      aria-valuemax={onSeek ? 100 : undefined}
      aria-valuenow={onSeek ? Math.round(progress * 100) : undefined}
      tabIndex={onSeek ? 0 : undefined}
      onPointerDown={(e) => onSeek && seekAt(e.clientX)}
      onKeyDown={(e) => {
        if (!onSeek) return
        if (e.key === "ArrowRight") onSeek(Math.min(1, progress + 0.05))
        if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.05))
      }}
      className={`flex items-end gap-[2px] ${onSeek ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" : ""} ${className}`}
      style={{ height, ["--ring" as string]: C.accent }}
    >
      {data.map((v, i) => {
        const played = i / data.length <= progress
        const liveBar = live && played && !reduce
        return (
          <span
            key={i}
            className={`rt-bar flex-1 rounded-full ${liveBar ? "rt-live" : ""}`}
            style={{
              height: `${Math.round(v * 100)}%`,
              background: played ? C.accent : C.lineHi,
              opacity: played ? 1 : 0.5,
              animationDelay: `${(i % 7) * -0.13}s`,
              transition: "background 200ms, opacity 200ms",
            }}
          />
        )
      })}
    </div>
  )
}

/** Compact 4-bar dancing equaliser used as a "now playing" glyph. */
export function EqGlyph({ live, color = C.accent }: { live: boolean; color?: string }) {
  const reduce = useReducedMotion()
  return (
    <span className="inline-flex h-4 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={live && !reduce ? "rt-bar rt-live" : "rt-bar"}
          style={{
            width: 2,
            height: live ? `${[60, 100, 40, 80][i]}%` : "30%",
            background: color,
            borderRadius: 2,
            animationDelay: `${i * -0.17}s`,
            transition: "height 200ms",
          }}
        />
      ))}
    </span>
  )
}

/* =========================================================================
   NOW PLAYING — persistent bottom bar (only mounts once an episode is set).
   ========================================================================= */
function NowPlaying() {
  const { current, playing, progress, toggle, seek } = usePlayer()
  if (!current) return null
  const elapsed = current.length * progress
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-xl"
      style={{ borderColor: C.lineHi, background: "rgba(14,14,12,0.86)" }}
    >
      <div className={`${wrap} flex items-center gap-4 py-3`}>
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition-transform duration-200 hover:scale-105"
          style={{ background: C.accent, color: C.onAccent }}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>

        <div className="hidden min-w-0 shrink-0 sm:block" style={{ width: 190 }}>
          <div className="flex items-center gap-2">
            <EqGlyph live={playing} />
            <span className="truncate text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.accent }}>
              {current.showTitle}
            </span>
          </div>
          <div className="mt-0.5 truncate text-[14px] font-semibold" style={{ fontFamily: SANS, color: C.bone }}>
            {current.title}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="hidden w-11 text-right text-[11px] tabular-nums sm:inline" style={{ fontFamily: MONO, color: C.muteHi }}>
            {fmtTime(elapsed)}
          </span>
          <Waveform seed={current.wave} progress={progress} live={playing} onSeek={seek} height={34} bars={64} className="flex-1" />
          <span className="hidden w-11 text-[11px] tabular-nums sm:inline" style={{ fontFamily: MONO, color: C.mute }}>
            {fmtTime(current.length)}
          </span>
        </div>

        <Volume2 className="hidden h-4 w-4 shrink-0 md:block" style={{ color: C.mute }} aria-hidden />
      </div>
    </div>
  )
}

/* =========================================================================
   NAV + FOOTER + LAYOUT
   ========================================================================= */
function Nav() {
  const base = useBase()
  const { current, playing } = usePlayer()
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/shows`, label: "Shows", end: false },
    { to: `${base}/episodes`, label: "Episodes", end: false },
    { to: `${base}/studio`, label: "Studio", end: false },
  ]
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ borderColor: C.line, background: "rgba(14,14,12,0.78)" }}
    >
      <div className={`${wrap} flex items-center justify-between gap-4 py-4`}>
        <Link to={base} onClick={() => setOpen(false)} className="group flex items-center gap-2.5 leading-none">
          <span
            className="grid h-8 w-8 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-12"
            style={{ background: C.accent, color: C.onAccent }}
          >
            <Radio className="h-4 w-4" />
          </span>
          <span style={{ fontFamily: DISPLAY, color: C.bone }} className="text-[23px] font-medium tracking-tight">
            Roomtone
          </span>
          <span className="ml-1 hidden items-center gap-1.5 sm:flex">
            <EqGlyph live={!!current && playing} color={current ? C.accent : C.mute} />
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" style={{ fontFamily: SANS }}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="group relative text-[14px] transition-colors"
              style={({ isActive }) => ({ color: isActive ? C.bone : C.mute })}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-300"
                    style={{ background: C.accent, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to={`${base}/shows`}
            className="rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: C.accent, color: C.onAccent }}
          >
            Listen
          </NavLink>
        </nav>

        <button
          className="text-[13px] md:hidden"
          style={{ fontFamily: MONO, color: C.bone }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden" style={{ borderColor: C.line, fontFamily: SANS }}>
          <div className={`${wrap} flex flex-col py-1`}>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className="border-b py-3.5 text-[15px] last:border-0"
                style={({ isActive }) => ({ borderColor: C.line, color: isActive ? C.accent : C.bone })}
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

function Footer() {
  const base = useBase()
  const { current } = usePlayer()
  return (
    <footer style={{ background: C.ink2, color: C.bone }} className="border-t" >
      <div className={`${wrap} py-16 ${current ? "pb-28" : ""}`}>
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: C.accent, color: C.onAccent }}>
                <Radio className="h-4 w-4" />
              </span>
              <span style={{ fontFamily: DISPLAY }} className="text-2xl font-medium">
                Roomtone
              </span>
            </div>
            <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-4 max-w-xs text-[15px] leading-relaxed">
              A documentary-audio network listening to the quiet — field recordings, lost tape, and rooms where nothing
              gets said. Recorded in the dark since 2016.
            </p>
            <div style={{ fontFamily: MONO, color: C.accent }} className="mt-5 text-[11px] uppercase tracking-[0.2em]">
              Studio 4 · Deptford · London
            </div>
          </div>
          <FootCol
            title="Listen"
            links={[
              { to: `${base}/shows`, label: "All shows" },
              { to: `${base}/episodes`, label: "Latest episodes" },
              { to: `${base}/studio`, label: "The studio" },
            ]}
          />
          <FootCol
            title="Subscribe"
            links={[
              { to: base, label: "Apple Podcasts" },
              { to: base, label: "Spotify" },
              { to: base, label: "RSS feed" },
            ]}
          />
        </div>
        <div
          className="mt-14 flex flex-col justify-between gap-2 border-t pt-6 text-[11px] sm:flex-row"
          style={{ borderColor: C.line, fontFamily: MONO, color: C.mute }}
        >
          <span>© 2016–2026 Roomtone Audio Ltd.</span>
          <span className="uppercase tracking-[0.2em]">Headphones recommended</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, color: C.muteHi }} className="text-[11px] uppercase tracking-[0.2em]">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5" style={{ fontFamily: SANS }}>
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="group inline-flex items-center gap-1 text-[14px] transition-colors hover:text-[var(--a)]" style={{ color: C.bone2, ["--a" as string]: C.accent }}>
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: C.accent }} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.ink, color: C.bone }} className="min-h-screen antialiased">
      {/* equaliser keyframes — paused under reduced motion */}
      <style>{`
        @keyframes rt-eq { 0%,100% { transform: scaleY(0.7) } 50% { transform: scaleY(1.12) } }
        .rt-bar { transform-origin: bottom; }
        .rt-live { animation: rt-eq 0.9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .rt-live { animation: none !important; } }
      `}</style>
      <Nav />
      {children}
      <Footer />
      <NowPlaying />
    </div>
  )
}

/* =========================================================================
   SMALL UI PRIMITIVES
   ========================================================================= */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] ${className}`} style={{ fontFamily: MONO, color: C.accent }}>
      <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ background: "currentColor" }} />
      {children}
    </div>
  )
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors" style={{ fontFamily: SANS, color: C.bone }}>
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: C.accent }} />
    </Link>
  )
}

/** Count-up number that animates once on scroll into view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  style,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
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
      duration: 1.4,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {val.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/**
 * Duotone photo: grayscale picsum image tinted with the brand chartreuse via
 * a screen layer over a deep ground, so portraits and rooms read as part of
 * the night palette rather than raw stock. Per-item hue keeps a set varied.
 */
export function Duotone({
  seed,
  alt,
  w = 800,
  h = 600,
  hue = 92,
  className,
  rounded = "rounded-xl",
  children,
  priority = false,
}: {
  seed: string
  alt: string
  w?: number
  h?: number
  hue?: number
  className?: string
  rounded?: string
  children?: ReactNode
  priority?: boolean
}) {
  return (
    <div className={`group relative overflow-hidden ${rounded} ${className ?? ""}`} style={{ background: C.ink2 }}>
      <img
        src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ filter: "grayscale(1) contrast(1.06) brightness(0.82)" }}
      />
      <div aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ background: `hsl(${hue} 30% 14%)` }} />
      <div aria-hidden className="absolute inset-0 mix-blend-screen opacity-40" style={{ background: `hsl(${hue} 55% 22%)` }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: "linear-gradient(to top, rgba(14,14,12,0.92), transparent)" }} />
      {children}
    </div>
  )
}
