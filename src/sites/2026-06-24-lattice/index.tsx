import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
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
  useReducedMotion,
} from "framer-motion"
import {
  Activity,
  Anchor,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarClock,
  Circle,
  Coins,
  Fish,
  Search,
  Users,
} from "lucide-react"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Lattice — live-ops console for Driftwood Bay",
  description:
    "The internal analytics console the Beacon & Reef team uses to run Driftwood Bay, a cozy co-op fishing game. A clean light dashboard for concurrent players, retention, the in-game economy and the live-ops calendar. Featured interaction: a cursor-tracking crosshair that traces the time-series chart and surfaces a live tooltip (arrow-key navigable too) — plus count-up KPIs, draw-in charts, and a persistent 7/30/90-day switcher that re-animates every number across all four pages.",
  date: "2026-06-24",
  type: "Analytics dashboard",
  interaction:
    "Cursor-tracking crosshair + live tooltip on the time-series chart (keyboard navigable) · count-up KPIs · draw-in charts · persistent period switcher",
  pages: ["Overview", "Players", "Economy", "Live Ops"],
}

/* --------------------------------------------------------------- palette */
// Cool off-white console + ONE accent: tide teal. Down-deltas use a rust rose.
const CANVAS = "#f3f5f2"
const SURFACE = "#ffffff"
const INK = "#16211d"
const MUTED = "#586a64" // on white ≈ 5.6:1
const LINE = "#e4e8e3"
const TEAL = "#0e8f7e" // bright — fills, dots, dials
const TEAL_DK = "#0a6356" // paired dark ink — eyebrows, links, small text ≈ 5.7:1
const UP = "#0a7d57"
const DOWN = "#b23f23"

const DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

/* ----------------------------------------------------------- data layer */
// Deterministic pseudo-data so the visuals never drift between builds.
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DAYS = 90
const EPOCH = Date.UTC(2026, 2, 26) // 26 Mar 2026, fixed
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function labelFor(i: number) {
  const d = new Date(EPOCH + i * 86400000)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

// Days where a live event ran — they bump engagement.
const EVENT_DAYS = new Set([12, 13, 14, 41, 42, 43, 44, 71, 72, 73, 80, 81])

function buildSeries(seed: number, baseV: number, trend: number, weekly: number, noise: number) {
  const rng = mulberry32(seed)
  const out: number[] = []
  for (let i = 0; i < DAYS; i++) {
    const wave = Math.sin((i / 7) * Math.PI * 2) * weekly
    const drift = i * trend
    const jitter = (rng() - 0.5) * noise
    const bump = EVENT_DAYS.has(i) ? baseV * 0.16 : 0
    out.push(Math.max(0, Math.round(baseV + wave + drift + jitter + bump)))
  }
  return out
}

const CCU = buildSeries(20260624, 14800, 58, 1500, 1400) // peak concurrent players
const REVENUE = buildSeries(7714, 5200, 26, 700, 900) // daily revenue $
const NEW_PLAYERS = buildSeries(5531, 2600, 9, 520, 700)

const LABELS = Array.from({ length: DAYS }, (_, i) => labelFor(i))

// Retention cohorts — newest 8 weekly cohorts, decaying day curves.
type Cohort = { week: string; size: number; cells: number[] }
const RET_COLS = ["D1", "D3", "D7", "D14", "D30"]
const COHORTS: Cohort[] = (() => {
  const rng = mulberry32(99)
  const rows: Cohort[] = []
  for (let w = 7; w >= 0; w--) {
    const d1 = 46 + rng() * 6
    const curve = [d1, d1 * 0.74, d1 * 0.56, d1 * 0.43, d1 * 0.33]
    rows.push({
      week: labelFor(DAYS - 7 - w * 7),
      size: Math.round(2400 + rng() * 900),
      cells: curve.map((c) => Math.round(c * 10) / 10),
    })
  }
  return rows
})()

// Acquisition funnel.
const FUNNEL = [
  { stage: "Store visit", value: 184200 },
  { stage: "Install", value: 71800 },
  { stage: "Tutorial done", value: 58300 },
  { stage: "First catch", value: 49100 },
  { stage: "Day-1 return", value: 23600 },
  { stage: "First purchase", value: 9400 },
]

const GEO = [
  { country: "United States", share: 28 },
  { country: "Japan", share: 17 },
  { country: "Germany", share: 11 },
  { country: "Brazil", share: 9 },
  { country: "United Kingdom", share: 8 },
  { country: "Rest of world", share: 27 },
]

// Economy — Pearls (soft currency) sources & sinks, and top cosmetics.
const SOURCES = [
  { label: "Daily quests", value: 4_120_000 },
  { label: "Catch payouts", value: 3_380_000 },
  { label: "Login streak", value: 1_540_000 },
  { label: "Event rewards", value: 1_180_000 },
]
const SINKS = [
  { label: "Boat cosmetics", value: 3_950_000 },
  { label: "Fast travel", value: 2_240_000 },
  { label: "Tackle crafting", value: 1_870_000 },
  { label: "Dock upgrades", value: 1_460_000 },
]
const ITEMS = [
  { name: "Lantern Sloop skin", units: 4820, rev: 24100, trend: 12 },
  { name: "Heron-blue sail set", units: 3610, rev: 14440, trend: 6 },
  { name: "Brass tide-rod", units: 2980, rev: 17880, trend: -3 },
  { name: "Harbor lantern pack", units: 2440, rev: 9760, trend: 21 },
  { name: "Driftglass lure", units: 1990, rev: 5970, trend: -8 },
]

type EventStatus = "live" | "scheduled" | "ended"
const EVENTS: { name: string; window: string; type: string; status: EventStatus; uplift: number }[] = [
  { name: "Midsummer Lantern Run", window: "Jun 22 – Jun 28", type: "Seasonal", status: "live", uplift: 18 },
  { name: "Deep Reef Tournament", window: "Jul 02 – Jul 05", type: "Competitive", status: "scheduled", uplift: 0 },
  { name: "Coral Restoration Drive", window: "Jul 11 – Jul 18", type: "Community", status: "scheduled", uplift: 0 },
  { name: "Founders' Regatta", window: "Jun 06 – Jun 09", type: "Competitive", status: "ended", uplift: 14 },
  { name: "Tidepool Spring Bloom", window: "May 16 – May 23", type: "Seasonal", status: "ended", uplift: 11 },
]

/* ------------------------------------------------------------- formatting */
const nf = (n: number) => Math.round(n).toLocaleString("en-US")
const money = (n: number) => "$" + nf(n)
function compact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "k"
  return String(Math.round(n))
}

/* ------------------------------------------------------------ period ctx */
type Range = "7d" | "30d" | "90d"
const RANGE_DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 }

const PeriodCtx = createContext<{ range: Range; setRange: (r: Range) => void; days: number }>({
  range: "30d",
  setRange: () => {},
  days: 30,
})
const usePeriod = () => useContext(PeriodCtx)

// Slice the trailing window and its preceding window for delta math.
function windowed(series: number[], days: number) {
  const cur = series.slice(-days)
  const prev = series.slice(-days * 2, -days)
  return { cur, prev }
}
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0)
const mean = (a: number[]) => (a.length ? sum(a) / a.length : 0)
function pctChange(cur: number, prev: number) {
  if (!prev) return 0
  return ((cur - prev) / prev) * 100
}

/* ----------------------------------------------------------- count-up num */
function Counter({
  to,
  format = nf,
  className,
}: {
  to: number
  format?: (n: number) => string
  className?: string
}) {
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce) {
      setV(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setV,
    })
    return () => controls.stop()
  }, [to, reduce])
  return <span className={className} style={{ fontFamily: MONO }}>{format(v)}</span>
}

/* ----------------------------------------------------------------- atoms */
function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
      style={{
        color: up ? UP : DOWN,
        background: up ? "rgba(10,125,87,0.10)" : "rgba(178,63,35,0.10)",
        fontFamily: MONO,
      }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  )
}

function Panel({
  title,
  hint,
  right,
  children,
  className = "",
}: {
  title?: string
  hint?: string
  right?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border bg-white p-5 sm:p-6 ${className}`}
      style={{ borderColor: LINE, boxShadow: "0 1px 2px rgba(22,33,29,0.03)" }}
    >
      {(title || right) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="text-[15px] font-bold tracking-tight" style={{ fontFamily: DISPLAY, color: INK }}>
                {title}
              </h3>
            )}
            {hint && (
              <p className="mt-0.5 text-xs" style={{ color: MUTED }}>
                {hint}
              </p>
            )}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  )
}

function Sparkline({ values, color = TEAL }: { values: number[]; color?: string }) {
  const w = 120
  const h = 34
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - 3 - ((v - min) / span) * (h - 6)
    return [x, y]
  })
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.4} fill={color} />
    </svg>
  )
}

/* --------------------------------------------- FEATURED: crosshair chart */
function TimeSeriesChart({
  values,
  labels,
  format = nf,
  accentLabel,
}: {
  values: number[]
  labels: string[]
  format?: (n: number) => string
  accentLabel: string
}) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  const W = 760
  const H = 280
  const padL = 6
  const padR = 6
  const padT = 16
  const padB = 28
  const n = values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const baseY = padT + innerH

  const xFor = (i: number) => padL + (n === 1 ? 0 : (i / (n - 1)) * innerW)
  const yFor = (v: number) => padT + (1 - (v - min) / span) * innerH

  const linePath = values.map((v, i) => (i ? "L" : "M") + xFor(i).toFixed(1) + " " + yFor(v).toFixed(1)).join(" ")
  const areaPath = `${linePath} L ${xFor(n - 1).toFixed(1)} ${baseY.toFixed(1)} L ${xFor(0).toFixed(1)} ${baseY.toFixed(1)} Z`

  // 4 horizontal guide lines.
  const guides = Array.from({ length: 4 }, (_, k) => {
    const v = min + (span * k) / 3
    return { v, y: yFor(v) }
  })
  // ~5 x ticks.
  const tickIdx = Array.from({ length: 5 }, (_, k) => Math.round((k / 4) * (n - 1)))

  function moveFromClientX(clientX: number) {
    const r = wrapRef.current?.getBoundingClientRect()
    if (!r) return
    const ratio = (clientX - r.left) / r.width
    const i = Math.max(0, Math.min(n - 1, Math.round(ratio * (n - 1))))
    setHover(i)
  }

  const hv = hover == null ? null : values[hover]
  const tipLeft = hover == null ? 0 : Math.max(9, Math.min(91, (xFor(hover) / W) * 100))

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative w-full cursor-crosshair outline-none"
        tabIndex={0}
        role="img"
        aria-label={`${accentLabel}. Latest ${format(values[n - 1])}, peak ${format(max)} across ${n} days. Use arrow keys to inspect points.`}
        onMouseMove={(e) => moveFromClientX(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover((h) => (h == null ? n - 1 : h))}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault()
            setHover((h) => Math.max(0, (h ?? n - 1) - 1))
          } else if (e.key === "ArrowRight") {
            e.preventDefault()
            setHover((h) => Math.min(n - 1, (h ?? 0) + 1))
          } else if (e.key === "Escape") {
            setHover(null)
          }
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" preserveAspectRatio="none" style={{ height: "auto", aspectRatio: `${W} / ${H}` }}>
          <defs>
            <linearGradient id="ls-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.22} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0.01} />
            </linearGradient>
            <clipPath id="ls-reveal">
              <motion.rect
                x={0}
                y={0}
                height={H}
                initial={{ width: reduce ? W : 0 }}
                whileInView={{ width: W }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </clipPath>
          </defs>

          {guides.map((g, k) => (
            <line key={k} x1={padL} x2={W - padR} y1={g.y} y2={g.y} stroke={LINE} strokeWidth={1} />
          ))}

          <g clipPath="url(#ls-reveal)">
            <path d={areaPath} fill="url(#ls-fill)" />
            <path d={linePath} fill="none" stroke={TEAL} strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {hover != null && hv != null && (
            <g>
              <line x1={xFor(hover)} x2={xFor(hover)} y1={padT} y2={baseY} stroke={TEAL_DK} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={xFor(hover)} cy={yFor(hv)} r={5.5} fill={SURFACE} stroke={TEAL} strokeWidth={2.5} />
            </g>
          )}
        </svg>

        {hover != null && hv != null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-2 rounded-lg border px-3 py-2 text-center shadow-sm"
            style={{ left: `${tipLeft}%`, top: 0, borderColor: LINE, background: SURFACE }}
          >
            <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: MUTED, fontFamily: MONO }}>
              {labels[hover]}
            </div>
            <div className="text-base font-bold" style={{ color: INK, fontFamily: MONO }}>
              {format(hv)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between text-[11px]" style={{ color: MUTED, fontFamily: MONO }}>
        {tickIdx.map((i) => (
          <span key={i}>{labels[i]}</span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- bar groups */
function BarRows({ rows, total, color = TEAL }: { rows: { label: string; value: number }[]; total: number; color?: string }) {
  const reduce = useReducedMotion()
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const pct = (r.value / total) * 100
        return (
          <li key={r.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
              <span style={{ color: INK }}>{r.label}</span>
              <span className="font-semibold" style={{ color: MUTED, fontFamily: MONO }}>
                {compact(r.value)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: CANVAS }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: reduce ? `${pct}%` : 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------- page shell */
const pageMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div key={pathname} {...pageMotion} className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 sm:py-9">
      {children}
    </motion.div>
  )
}

function PageHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="mb-7">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: TEAL_DK, fontFamily: MONO }}>
        {kicker}
      </div>
      <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-[28px]" style={{ fontFamily: DISPLAY, color: INK }}>
        {title}
      </h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed" style={{ color: MUTED }}>
        {sub}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------ stat tiles */
function StatTile({
  icon: Icon,
  label,
  value,
  format = nf,
  delta,
  spark,
  index = 0,
}: {
  icon: typeof Activity
  label: string
  value: number
  format?: (n: number) => string
  delta: number
  spark: number[]
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border bg-white p-5"
      style={{ borderColor: LINE, boxShadow: "0 1px 2px rgba(22,33,29,0.03)" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: "rgba(14,143,126,0.10)", color: TEAL_DK }}
        >
          <Icon size={16} strokeWidth={2.25} />
        </span>
        <Delta value={delta} />
      </div>
      <div className="mt-4 text-[12px] font-medium uppercase tracking-[0.12em]" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="mt-1 flex items-end justify-between gap-3">
        <Counter to={value} format={format} className="text-[26px] font-bold leading-none tracking-tight" />
        <Sparkline values={spark} color={delta >= 0 ? TEAL : DOWN} />
      </div>
    </motion.div>
  )
}

/* --------------------------------------------------------------- OVERVIEW */
function Overview() {
  const { days } = usePeriod()
  const ccu = windowed(CCU, days)
  const rev = windowed(REVENUE, days)
  const np = windowed(NEW_PLAYERS, days)

  const peakCcu = Math.max(...ccu.cur)
  const peakPrev = Math.max(...ccu.prev)
  const dau = Math.round(mean(ccu.cur) * 6.4)
  const dauPrev = Math.round(mean(ccu.prev) * 6.4)
  const revTotal = sum(rev.cur)
  const revPrev = sum(rev.prev)
  const arpdau = revTotal / (dau * days || 1)
  const arpdauPrev = revPrev / (dauPrev * days || 1)

  return (
    <Page>
      <PageHead
        kicker="Driftwood Bay · Live"
        title="Overview"
        sub="How the harbor's doing right now. Concurrent players, daily revenue and acquisition over your selected window — switch 7 / 30 / 90 days up top and every number re-reads."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={Activity} label="Peak concurrent" value={peakCcu} delta={pctChange(peakCcu, peakPrev)} spark={ccu.cur} index={0} />
        <StatTile icon={Users} label="Avg DAU" value={dau} delta={pctChange(dau, dauPrev)} spark={ccu.cur} index={1} />
        <StatTile icon={Coins} label="Revenue" value={revTotal} format={money} delta={pctChange(revTotal, revPrev)} spark={rev.cur} index={2} />
        <StatTile icon={Anchor} label="ARPDAU" value={arpdau} format={(n) => "$" + n.toFixed(2)} delta={pctChange(arpdau, arpdauPrev)} spark={rev.cur} index={3} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Peak concurrent players"
          hint="Hover or arrow-key the line to inspect any day"
          right={
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: "rgba(14,143,126,0.10)", color: TEAL_DK, fontFamily: MONO }}>
              <Circle size={7} fill={TEAL} stroke="none" className="animate-pulse" />
              live feed
            </span>
          }
        >
          <TimeSeriesChart values={ccu.cur} labels={LABELS.slice(-days)} accentLabel="Peak concurrent players" />
        </Panel>

        <Panel title="New players / day" hint="First-time installs in window">
          <TimeSeriesChart values={np.cur} labels={LABELS.slice(-days)} accentLabel="New players per day" />
          <div className="mt-4 flex items-baseline justify-between border-t pt-4" style={{ borderColor: LINE }}>
            <span className="text-sm" style={{ color: MUTED }}>
              Window total
            </span>
            <Counter to={sum(np.cur)} className="text-xl font-bold" />
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Daily revenue" className="lg:col-span-2">
          <TimeSeriesChart values={rev.cur} labels={LABELS.slice(-days)} format={money} accentLabel="Daily revenue" />
        </Panel>
        <Panel title="Right now" hint="Server snapshot">
          <ul className="space-y-4">
            {[
              { k: "Online", v: nf(CCU[DAYS - 1]), note: "across 6 regions" },
              { k: "Sessions today", v: compact(Math.round(CCU[DAYS - 1] * 6.4)), note: "avg 27m each" },
              { k: "Crash-free", v: "99.6%", note: "last 24h" },
              { k: "Queue", v: "0s", note: "no wait" },
            ].map((r) => (
              <li key={r.k} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: LINE }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: INK }}>
                    {r.k}
                  </div>
                  <div className="text-xs" style={{ color: MUTED }}>
                    {r.note}
                  </div>
                </div>
                <div className="text-lg font-bold" style={{ color: TEAL_DK, fontFamily: MONO }}>
                  {r.v}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Page>
  )
}

/* ---------------------------------------------------------------- PLAYERS */
function heatColor(v: number) {
  // Cap the wash light enough that dark teal ink clears AA on every cell.
  const t = Math.max(0, Math.min(1, v / 52))
  return `rgba(14,143,126,${(0.07 + t * 0.5).toFixed(3)})`
}

function Players() {
  const maxFunnel = FUNNEL[0].value
  return (
    <Page>
      <PageHead
        kicker="Audience"
        title="Players"
        sub="Where anglers come from, how many come back, and where they drop off before they ever cast a line. Retention is read on the weekly cohorts below."
      />

      <Panel title="Weekly retention cohorts" hint="% of each week's new players still active at D1 → D30" className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-2 pb-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                Cohort
              </th>
              <th className="px-2 pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                Size
              </th>
              {RET_COLS.map((c) => (
                <th key={c} className="px-2 pb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORTS.map((row) => (
              <tr key={row.week}>
                <td className="px-2 py-1.5 font-medium" style={{ color: INK }}>
                  {row.week}
                </td>
                <td className="px-2 py-1.5 text-right" style={{ color: MUTED, fontFamily: MONO }}>
                  {nf(row.size)}
                </td>
                {row.cells.map((v, ci) => (
                  <td key={ci} className="p-1">
                    <div
                      className="flex h-9 items-center justify-center rounded-md text-[12px] font-semibold transition-transform duration-150 hover:scale-[1.08]"
                      style={{ background: heatColor(v), color: TEAL_DK, fontFamily: MONO }}
                    >
                      {v.toFixed(0)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Panel title="Acquisition funnel" hint="Store visit → first purchase" className="lg:col-span-3">
          <ul className="space-y-2.5">
            {FUNNEL.map((f, i) => {
              const pct = (f.value / maxFunnel) * 100
              const drop = i === 0 ? 0 : 100 - (f.value / FUNNEL[i - 1].value) * 100
              return (
                <li key={f.stage}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span style={{ color: INK }}>{f.stage}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: MUTED, fontFamily: MONO }}>
                        {nf(f.value)}
                      </span>
                      {i > 0 && (
                        <span className="text-[11px]" style={{ color: DOWN, fontFamily: MONO }}>
                          −{drop.toFixed(0)}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-7 w-full overflow-hidden rounded-md" style={{ background: CANVAS }}>
                    <motion.div
                      className="flex h-full items-center rounded-md pl-2 text-[11px] font-semibold text-white"
                      style={{ background: `linear-gradient(90deg, ${TEAL_DK}, ${TEAL})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {pct > 18 ? `${pct.toFixed(0)}%` : ""}
                    </motion.div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel title="Where they play" hint="Share of DAU by region" className="lg:col-span-2">
          <BarRows rows={GEO.map((g) => ({ label: g.country, value: g.share }))} total={100} />
          <p className="mt-4 border-t pt-3 text-xs" style={{ color: MUTED, borderColor: LINE }}>
            Japan over-indexes on weekday evenings — worth timing live events to JST.
          </p>
        </Panel>
      </div>
    </Page>
  )
}

/* ---------------------------------------------------------------- ECONOMY */
function Economy() {
  const totalSrc = sum(SOURCES.map((s) => s.value))
  const totalSink = sum(SINKS.map((s) => s.value))
  const net = totalSrc - totalSink
  return (
    <Page>
      <PageHead
        kicker="Pearls economy"
        title="Economy"
        sub="Pearls are the soft currency that keeps the bay turning. A healthy economy mints a little more than it burns — too much and prices inflate, too little and the store stalls."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={Coins} label="Pearls minted" value={totalSrc} format={compact} delta={4.2} spark={REVENUE.slice(-14)} index={0} />
        <StatTile icon={Anchor} label="Pearls burned" value={totalSink} format={compact} delta={6.1} spark={REVENUE.slice(-14)} index={1} />
        <StatTile icon={Activity} label="Net faucet" value={net} format={compact} delta={-1.8} spark={NEW_PLAYERS.slice(-14)} index={2} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Sources" hint="Where Pearls enter the economy">
          <BarRows rows={SOURCES} total={totalSrc} color={TEAL} />
        </Panel>
        <Panel title="Sinks" hint="Where Pearls leave the economy">
          <BarRows rows={SINKS} total={totalSrc} color={TEAL_DK} />
        </Panel>
      </div>

      <Panel title="Top cosmetics" hint="Real-money store, last 30 days" className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: LINE }}>
              {["Item", "Units", "Revenue", "WoW"].map((h, i) => (
                <th key={h} className={`pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] ${i === 0 ? "text-left" : "text-right"}`} style={{ color: MUTED }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((it) => (
              <tr key={it.name} className="border-b transition-colors duration-150 hover:bg-[rgba(14,143,126,0.04)]" style={{ borderColor: LINE }}>
                <td className="py-3 font-medium" style={{ color: INK }}>
                  {it.name}
                </td>
                <td className="py-3 text-right" style={{ color: MUTED, fontFamily: MONO }}>
                  {nf(it.units)}
                </td>
                <td className="py-3 text-right font-semibold" style={{ color: INK, fontFamily: MONO }}>
                  {money(it.rev)}
                </td>
                <td className="py-3 text-right">
                  <Delta value={it.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Page>
  )
}

/* ---------------------------------------------------------------- LIVEOPS */
const statusStyle: Record<EventStatus, { label: string; color: string; bg: string }> = {
  live: { label: "Live", color: UP, bg: "rgba(10,125,87,0.12)" },
  scheduled: { label: "Scheduled", color: TEAL_DK, bg: "rgba(14,143,126,0.10)" },
  ended: { label: "Ended", color: MUTED, bg: "rgba(88,106,100,0.12)" },
}

function LiveOps() {
  return (
    <Page>
      <PageHead
        kicker="Calendar"
        title="Live Ops"
        sub="Every seasonal, competitive and community event on the slate — what's running now, what's queued, and how much engagement past beats actually moved."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {EVENTS.map((ev, i) => {
            const s = statusStyle[ev.status]
            return (
              <motion.article
                key={ev.name}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-4 rounded-2xl border bg-white p-4 transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(22,33,29,0.07)]"
                style={{ borderColor: LINE }}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "rgba(14,143,126,0.10)", color: TEAL_DK }}
                >
                  {ev.type === "Seasonal" ? <Fish size={20} /> : ev.type === "Competitive" ? <Anchor size={20} /> : <Users size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[15px] font-bold tracking-tight" style={{ fontFamily: DISPLAY, color: INK }}>
                      {ev.name}
                    </h3>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: s.color, background: s.bg, fontFamily: MONO }}>
                      {s.label}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                    <CalendarClock size={13} />
                    {ev.window} · {ev.type}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {ev.uplift > 0 ? (
                    <>
                      <div className="text-lg font-bold" style={{ color: UP, fontFamily: MONO }}>
                        +{ev.uplift}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                        DAU uplift
                      </div>
                    </>
                  ) : (
                    <div className="text-xs" style={{ color: MUTED, fontFamily: MONO }}>
                      —
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>

        <div className="space-y-5">
          <Panel title="Live now" hint="Midsummer Lantern Run">
            <div className="space-y-3">
              {[
                { k: "Participation", v: "63%", n: "of DAU joined" },
                { k: "Lanterns lit", v: compact(2_840_000), n: "community goal 3M" },
                { k: "Ends in", v: "3d 14h", n: "Jun 28, 23:00 UTC" },
              ].map((r) => (
                <div key={r.k} className="rounded-xl p-3" style={{ background: CANVAS }}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wide" style={{ color: MUTED }}>
                      {r.k}
                    </span>
                    <span className="text-base font-bold" style={{ color: TEAL_DK, fontFamily: MONO }}>
                      {r.v}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: MUTED }}>
                    {r.n}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs" style={{ color: MUTED }}>
                <span>Community goal</span>
                <span style={{ fontFamily: MONO }}>95%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "#e9ece8" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${TEAL_DK}, ${TEAL})` }}
                  initial={{ width: 0 }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </Panel>
          <Panel title="Cadence note">
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Seasonal beats outperform competitive ones on DAU uplift (avg +14% vs +9%) but the Deep Reef Tournament drives 2.3× the store revenue. Keep alternating — anglers churn on back-to-back competitive weeks.
            </p>
          </Panel>
        </div>
      </div>
    </Page>
  )
}

/* ----------------------------------------------------------------- layout */
const NAV = [
  { to: "", label: "Overview", icon: Activity, end: true },
  { to: "players", label: "Players", icon: Users, end: false },
  { to: "economy", label: "Economy", icon: Coins, end: false },
  { to: "live-ops", label: "Live Ops", icon: CalendarClock, end: false },
]

function PeriodSwitch() {
  const { range, setRange } = usePeriod()
  return (
    <div className="inline-flex items-center rounded-lg border p-0.5" style={{ borderColor: LINE, background: SURFACE }}>
      {(Object.keys(RANGE_DAYS) as Range[]).map((r) => {
        const active = r === range
        return (
          <button
            key={r}
            onClick={() => setRange(r)}
            className="relative rounded-md px-2.5 py-1 text-xs font-semibold transition-colors duration-150"
            style={{ color: active ? "#fff" : MUTED, fontFamily: MONO }}
          >
            {active && <motion.span layoutId="period-pill" className="absolute inset-0 rounded-md" style={{ background: TEAL_DK }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative">{r}</span>
          </button>
        )
      })}
    </div>
  )
}

function Layout({ base }: { base: string }) {
  const [range, setRange] = useState<Range>("30d")
  const location = useLocation()

  return (
    <PeriodCtx.Provider value={{ range, setRange, days: RANGE_DAYS[range] }}>
      <div className="min-h-screen" style={{ background: CANVAS, color: INK, fontFamily: BODY }}>
        {/* sidebar (desktop) */}
        <aside
          className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r bg-white px-4 py-6 md:flex"
          style={{ borderColor: LINE }}
        >
          <NavLink to={base} end className="flex items-center gap-2.5 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: TEAL_DK }}>
              <Anchor size={18} color="#fff" strokeWidth={2.25} />
            </span>
            <span>
              <span className="block text-[15px] font-extrabold leading-none tracking-tight" style={{ fontFamily: DISPLAY }}>
                Lattice
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED, fontFamily: MONO }}>
                live-ops
              </span>
            </span>
          </NavLink>

          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150"
                style={({ isActive }) => ({
                  color: isActive ? TEAL_DK : MUTED,
                  background: isActive ? "rgba(14,143,126,0.10)" : "transparent",
                })}
              >
                <n.icon size={17} strokeWidth={2} />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border p-3" style={{ borderColor: LINE, background: CANVAS }}>
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: INK }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: TEAL }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: TEAL }} />
              </span>
              Driftwood Bay
            </div>
            <p className="mt-1 text-[11px] leading-snug" style={{ color: MUTED }}>
              v1.8 “Tideglass” · all regions nominal
            </p>
          </div>
        </aside>

        {/* main column */}
        <div className="md:pl-60">
          {/* top bar */}
          <header
            className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3 backdrop-blur-md sm:px-8"
            style={{ borderColor: LINE, background: "rgba(255,255,255,0.82)" }}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 md:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: TEAL_DK }}>
                  <Anchor size={16} color="#fff" />
                </span>
                <span className="text-sm font-extrabold" style={{ fontFamily: DISPLAY }}>
                  Lattice
                </span>
              </span>
              <div className="hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-sm sm:flex" style={{ borderColor: LINE, color: MUTED }}>
                <Search size={14} />
                <span className="text-xs">Search metrics, events…</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PeriodSwitch />
              <button
                className="relative hidden h-9 w-9 items-center justify-center rounded-lg border sm:flex"
                style={{ borderColor: LINE, color: MUTED }}
                aria-label="Notifications"
              >
                <Bell size={16} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full" style={{ background: DOWN }} />
              </button>
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: TEAL, fontFamily: MONO }}>
                BR
              </span>
            </div>
          </header>

          {/* mobile nav */}
          <nav className="sticky top-[57px] z-10 flex gap-1 overflow-x-auto border-b px-4 py-2 md:hidden" style={{ borderColor: LINE, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}>
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium"
                style={({ isActive }) => ({
                  color: isActive ? "#fff" : MUTED,
                  background: isActive ? TEAL_DK : "transparent",
                })}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <main>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route index element={<Overview />} />
                <Route path="players" element={<Players />} />
                <Route path="economy" element={<Economy />} />
                <Route path="live-ops" element={<LiveOps />} />
                <Route path="*" element={<Overview />} />
              </Routes>
            </AnimatePresence>
          </main>

          <footer className="border-t px-5 py-6 text-xs sm:px-8" style={{ borderColor: LINE, color: MUTED }}>
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <span>
                <span className="font-bold" style={{ color: INK, fontFamily: DISPLAY }}>
                  Lattice
                </span>{" "}
                — internal console · Beacon &amp; Reef Studio
              </span>
              <span style={{ fontFamily: MONO }}>Data refreshed 14:32 UTC · synthetic demo set</span>
            </div>
          </footer>
        </div>
      </div>
    </PeriodCtx.Provider>
  )
}

/* --------------------------------------------------------------- default */
export default function Lattice() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const reduce = useReducedMotion()
  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <Layout base={base} />
    </MotionConfig>
  )
}
