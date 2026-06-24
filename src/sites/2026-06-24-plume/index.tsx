import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { Routes, Route, NavLink, Link, useLocation, useParams } from "react-router-dom"
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Menu,
  X,
  TrendingUp,
  Mail,
  Users,
  Sparkles,
  PenLine,
  CircleDollarSign,
  BarChart3,
  Quote,
} from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { Spotlight } from "@/components/fx/Spotlight"
import { Reveal } from "@/components/fx/Reveal"

/* =========================================================================
   PLUME — analytics for independent newsletter writers
   A SaaS product page for solo writers who'd rather write than read a chart.
   Featured interaction: ANIMATED COUNTERS. Every number on the page is alive —
   the hero metrics board, growth deltas, revenue and customer proof all tick
   up from zero the moment they scroll into view, easing out so they "land".
   Supporting micro-interactions: a cursor-reactive spotlight over the live
   dashboard preview, magnetic CTAs, staggered card entrances, and a pricing
   term toggle. Reduced-motion users get the final values immediately and no
   spotlight. The product imagery is all hand-built SVG — charts, sparklines,
   a funnel and a cohort grid — so nothing reads as AI-stock.
   ========================================================================= */

const C = {
  paper: "#f4f1ea",
  paperDeep: "#ece7db",
  ink: "#15171c",
  inkSoft: "#3a3d45",
  mute: "#6c6f78",
  line: "#dcd6c8",
  card: "#fbf9f4",
  accent: "#df4f2e", // terracotta — the single confident accent
  accentDeep: "#b93c1f",
  accentWash: "#f7e2d8",
  night: "#101218", // dark sections
  nightCard: "#191c24",
  bone: "#f4f1ea",
}

const DISPLAY = "'Bricolage Grotesque', sans-serif"
const SANS = "'Hanken Grotesk', sans-serif"
const MONO = "'IBM Plex Mono', monospace"

const wrap = "mx-auto w-full max-w-6xl px-6 sm:px-8"

function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* ---------- featured interaction: animated counter ---------------------- */
function useCountUp(to: number, duration = 1500) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])

  return { ref, val }
}

function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  style,
}: {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  style?: CSSProperties
}) {
  const { ref, val } = useCountUp(to)
  const display = val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return (
    <span ref={ref} className={className} style={{ fontFamily: MONO, fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ---------- small shared bits ------------------------------------------- */
function Eyebrow({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${className}`}
      style={{ fontFamily: MONO, color: dark ? "rgba(244,241,234,0.6)" : C.accentDeep }}
    >
      <span className="h-px w-6" style={{ background: "currentColor" }} />
      {children}
    </span>
  )
}

function CTA({
  to,
  children,
  variant = "solid",
  external = false,
}: {
  to: string
  children: ReactNode
  variant?: "solid" | "ghost"
  external?: boolean
}) {
  const solid = variant === "solid"
  const cls =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[transform,background,color] duration-200"
  const style: CSSProperties = solid
    ? { background: C.accent, color: "#fff", fontFamily: SANS }
    : { background: "transparent", color: C.ink, border: `1px solid ${C.line}`, fontFamily: SANS }
  const inner = (
    <span className={cls} style={style}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </span>
  )
  return (
    <Magnetic strength={0.35}>
      {external ? <span>{inner}</span> : <Link to={to}>{inner}</Link>}
    </Magnetic>
  )
}

/* ---------- hand-built SVG: animated growth line ------------------------ */
function GrowthChart({ stroke = C.accent }: { stroke?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  // a deliberately uneven, believable growth curve
  const pts = [8, 14, 11, 20, 26, 22, 34, 40, 38, 52, 60, 74]
  const W = 520
  const H = 200
  const max = 80
  const step = W / (pts.length - 1)
  const coords = pts.map((p, i) => [i * step, H - (p / max) * H])
  const line = coords.map((c, i) => (i === 0 ? `M ${c[0]} ${c[1]}` : `L ${c[0]} ${c[1]}`)).join(" ")
  const area = `${line} L ${W} ${H} L 0 ${H} Z`

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Subscriber growth trending up over twelve months">
      <defs>
        <linearGradient id="plume-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <motion.path
        d={area}
        fill="url(#plume-area)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      {coords.map((c, i) =>
        i === coords.length - 1 ? (
          <motion.circle
            key={i}
            cx={c[0]}
            cy={c[1]}
            r="5"
            fill={stroke}
            initial={{ scale: reduce ? 1 : 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 14 }}
          />
        ) : null,
      )}
    </svg>
  )
}

function Sparkline({ data, stroke, fill = false }: { data: number[]; stroke: string; fill?: boolean }) {
  const W = 120
  const H = 36
  const max = Math.max(...data)
  const min = Math.min(...data)
  const step = W / (data.length - 1)
  const coords = data.map((d, i) => [i * step, H - ((d - min) / (max - min || 1)) * (H - 4) - 2])
  const line = coords.map((c, i) => (i === 0 ? `M ${c[0]} ${c[1]}` : `L ${c[0]} ${c[1]}`)).join(" ")
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-full" aria-hidden>
      {fill && <path d={`${line} L ${W} ${H} L 0 ${H} Z`} fill={stroke} opacity="0.1" />}
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------- live dashboard preview (home hero) -------------------------- */
const TILES = [
  { label: "Subscribers", to: 18420, delta: "+6.2%", spark: [10, 12, 11, 14, 16, 15, 18, 22] },
  { label: "Open rate", to: 61.4, suffix: "%", decimals: 1, delta: "+3.1pt", spark: [40, 44, 42, 50, 55, 58, 60, 61] },
  { label: "Paid members", to: 1247, delta: "+41", spark: [4, 6, 7, 9, 10, 11, 12, 12] },
  { label: "MRR", to: 8640, prefix: "$", delta: "+9.4%", spark: [3, 4, 5, 5, 6, 7, 8, 9] },
]

function DashboardPreview() {
  return (
    <Spotlight
      color="rgba(223,79,46,0.16)"
      size={420}
      className="rounded-3xl"
    >
      <div
        className="rounded-3xl p-5 sm:p-7"
        style={{ background: C.nightCard, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px -50px rgba(0,0,0,0.8)" }}
      >
        {/* window chrome */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3a3d45" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3a3d45" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.accent }} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: "rgba(244,241,234,0.4)" }}>
            this week
          </span>
        </div>

        {/* metric tiles */}
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: "rgba(244,241,234,0.5)" }}>
                  {t.label}
                </span>
                <span className="text-[11px] font-semibold" style={{ fontFamily: MONO, color: C.accent }}>
                  {t.delta}
                </span>
              </div>
              <Counter
                to={t.to}
                prefix={t.prefix}
                suffix={t.suffix}
                decimals={t.decimals ?? 0}
                className="mt-1.5 block text-2xl font-semibold sm:text-[28px]"
                style={{ color: C.bone }}
              />
              <div className="mt-1">
                <Sparkline data={t.spark} stroke={C.accent} fill />
              </div>
            </motion.div>
          ))}
        </div>

        {/* big chart */}
        <div className="mt-3 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: "rgba(244,241,234,0.5)" }}>
              Growth · 12 mo
            </span>
            <span className="text-sm font-semibold" style={{ fontFamily: MONO, color: C.bone }}>
              <Counter to={9.1} decimals={1} suffix="x" />
            </span>
          </div>
          <div className="h-32">
            <GrowthChart />
          </div>
        </div>
      </div>
    </Spotlight>
  )
}

/* ---------- persistent layout ------------------------------------------- */
const NAV = [
  { to: "", label: "Home", end: true },
  { to: "features", label: "Features" },
  { to: "pricing", label: "Pricing" },
  { to: "customers", label: "Customers" },
  { to: "changelog", label: "Changelog" },
]

function Layout({ children }: { children: ReactNode }) {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => setOpen(false), [loc.pathname])

  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: SANS }} className="min-h-screen antialiased">
      <header className="sticky top-0 z-50" style={{ background: "rgba(244,241,234,0.82)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.line}` }}>
        <div className={`${wrap} flex h-16 items-center justify-between`}>
          <Link to={base} className="flex items-center gap-2" aria-label="Plume home">
            <PlumeMark />
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
              Plume
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className="relative px-3.5 py-2 text-sm font-medium transition-colors duration-200"
                style={({ isActive }) => ({ color: isActive ? C.ink : C.mute })}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-px left-3.5 right-3.5 h-0.5 rounded-full"
                        style={{ background: C.accent }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <CTA to={`${base}/pricing`}>Start free</CTA>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            style={{ border: `1px solid ${C.line}` }}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden md:hidden"
              style={{ borderTop: `1px solid ${C.line}` }}
            >
              <div className={`${wrap} flex flex-col gap-1 py-4`}>
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    className="rounded-xl px-4 py-3 text-base font-medium"
                    style={({ isActive }) => ({ color: isActive ? C.accentDeep : C.ink, background: isActive ? C.accentWash : "transparent" })}
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <Footer />
    </div>
  )
}

function PlumeMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
      <path
        d="M13 2C7 4 4 9 4 15c0 4 2 7 5 9 0-5 1-9 4-13-2 4-3 8-3 13 6-2 9-7 9-13 0-5-2-7-6-9z"
        fill={C.accent}
      />
      <path d="M9 24c1-7 4-13 9-18" stroke={C.ink} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Footer() {
  const base = useBase()
  return (
    <footer style={{ background: C.night, color: C.bone }}>
      <div className={`${wrap} py-16`}>
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <PlumeMark />
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
                Plume
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(244,241,234,0.6)" }}>
              The analytics desk for independent writers. Numbers that read like a sentence, not a spreadsheet.
            </p>
          </div>
          {[
            { h: "Product", items: ["Features", "Pricing", "Changelog", "Integrations"] },
            { h: "Writers", items: ["Customers", "Growth guides", "Templates", "Office hours"] },
            { h: "Company", items: ["About", "Careers", "Privacy", "Status"] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: "rgba(244,241,234,0.45)" }}>
                {col.h}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((it) => (
                  <li key={it}>
                    <Link to={base} className="text-sm transition-colors duration-200 hover:text-white" style={{ color: "rgba(244,241,234,0.7)" }}>
                      {it}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(244,241,234,0.5)", fontFamily: MONO }}>
          <span>© 2026 Plume Labs, Inc. Built for people who'd rather be writing.</span>
          <span>Made in a railway carriage somewhere near Bristol.</span>
        </div>
      </div>
    </footer>
  )
}

/* ---------- page transition wrapper ------------------------------------- */
function Page({ children }: { children: ReactNode }) {
  const loc = useLocation()
  return (
    <motion.div
      key={loc.pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function SectionHead({ kicker, title, lead, dark = false }: { kicker: string; title: string; lead?: string; dark?: boolean }) {
  return (
    <div className="max-w-2xl">
      <Eyebrow dark={dark}>{kicker}</Eyebrow>
      <h2
        className="mt-4 text-balance text-3xl font-semibold leading-[1.06] sm:text-[42px]"
        style={{ fontFamily: DISPLAY, color: dark ? C.bone : C.ink }}
      >
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-lg leading-relaxed" style={{ color: dark ? "rgba(244,241,234,0.7)" : C.mute }}>
          {lead}
        </p>
      )}
    </div>
  )
}

/* ======================= HOME =========================================== */
const LOGOS = ["The Margin", "Slow Mondays", "Field Notes", "Postscript", "The Long Read", "Kindling"]

const STEPS = [
  { n: "01", icon: Mail, title: "Connect your list", body: "Plug in Substack, Ghost, Beehiiv or a CSV. We backfill twelve months of history in about a minute — no tracking pixels, no rebuild." },
  { n: "02", icon: BarChart3, title: "See the story", body: "One desk, four numbers that matter, and a plain-English read on what moved this week. No 40-tile dashboard you'll never open." },
  { n: "03", icon: TrendingUp, title: "Grow on purpose", body: "Weekly nudges tell you which issue earned subscribers, which one lost them, and the one experiment worth running next." },
]

const HOME_FEATURES = [
  { icon: Users, title: "Subscriber lens", body: "Cohorts by signup source, the issues that convert lurkers to paid, and a churn read that flags drift before it's a trend." },
  { icon: CircleDollarSign, title: "Revenue desk", body: "MRR, annual vs monthly mix, and lifetime value per acquisition channel — the money math, finally legible." },
  { icon: PenLine, title: "Issue scorecards", body: "Every send gets a one-glance card: opens, clicks, replies, unsubscribes, and the line that earned the most." },
  { icon: Sparkles, title: "The weekly read", body: "A short written brief — what changed, why it likely changed, and the single most useful thing to try next." },
]

function Home() {
  const base = useBase()
  const reduce = useReducedMotion()
  return (
    <Page>
      {/* hero */}
      <section className="relative overflow-hidden" style={{ background: C.night }}>
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{ background: `radial-gradient(60% 50% at 75% 15%, rgba(223,79,46,0.18), transparent 70%)` }} />
        <div className={`${wrap} relative grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28`}>
          <div>
            <Eyebrow dark>Analytics for newsletter writers</Eyebrow>
            <h1
              className="mt-5 text-balance text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-[68px]"
              style={{ fontFamily: DISPLAY, color: C.bone }}
            >
              Your numbers, finally in <span style={{ color: C.accent }}>plain English.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: "rgba(244,241,234,0.72)" }}>
              Plume turns a year of opens, clicks and payouts into one calm desk — four numbers that matter and a weekly read on what to do next. For writers who'd rather be writing.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CTA to={`${base}/pricing`}>Start free for 14 days</CTA>
              <CTA to={`${base}/features`} variant="ghost">
                <span style={{ color: C.bone }}>See a tour</span>
              </CTA>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { to: 9100, suffix: "+", label: "writers" },
                { to: 48, prefix: "$", suffix: "M", label: "tracked payouts" },
                { to: 4.6, decimals: 1, suffix: "x", label: "median 1-yr growth" },
              ].map((s) => (
                <div key={s.label}>
                  <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} className="text-2xl font-semibold" style={{ color: C.bone }} />
                  <div className="text-xs uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: "rgba(244,241,234,0.5)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <DashboardPreview />
          </motion.div>
        </div>

        {/* logo marquee */}
        <div className="relative border-t py-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
            <motion.div
              className="flex shrink-0 items-center gap-12 pr-12"
              animate={reduce ? undefined : { x: ["0%", "-50%"] }}
              transition={{ duration: 26, ease: "linear", repeat: Infinity }}
            >
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <span key={i} className="whitespace-nowrap text-lg font-semibold" style={{ fontFamily: DISPLAY, color: "rgba(244,241,234,0.42)" }}>
                  {l}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className={`${wrap} py-20 lg:py-28`}>
        <SectionHead kicker="How it works" title="From a year of CSVs to one clear desk in about a minute." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl md:grid-cols-3" style={{ background: C.line }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="h-full p-8" style={{ background: C.card }}>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: C.accentWash, color: C.accentDeep }}>
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-3xl font-bold" style={{ fontFamily: MONO, color: C.line }}>
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold" style={{ fontFamily: DISPLAY }}>
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: C.mute }}>
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* feature grid — asymmetric, staggered */}
      <section style={{ background: C.paperDeep }}>
        <div className={`${wrap} py-20 lg:py-28`}>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHead kicker="The desk" title="Four lenses. Nothing you'll never open." />
            <Link to={`${base}/features`} className="group inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: C.accentDeep }}>
              Tour every feature
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {HOME_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div
                  className="group h-full rounded-3xl p-7 transition-transform duration-200 hover:-translate-y-1"
                  style={{ background: C.card, border: `1px solid ${C.line}` }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200 group-hover:bg-[#df4f2e]" style={{ background: C.accentWash, color: C.accentDeep }}>
                    <f.icon className="h-5 w-5 transition-colors duration-200 group-hover:text-white" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold" style={{ fontFamily: DISPLAY }}>
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed" style={{ color: C.mute }}>
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteStrip />
      <CtaBanner />
    </Page>
  )
}

function QuoteStrip() {
  return (
    <section className={`${wrap} py-20 lg:py-24`}>
      <Reveal>
        <figure className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto h-8 w-8" style={{ color: C.accent }} />
          <blockquote className="mt-6 text-balance text-2xl font-medium leading-snug sm:text-[32px]" style={{ fontFamily: DISPLAY }}>
            "I cancelled three dashboards the week I found Plume. It tells me the one thing to do on Monday — and it's usually right."
          </blockquote>
          <figcaption className="mt-6 text-sm" style={{ fontFamily: MONO, color: C.mute }}>
            Dani Okafor · <span style={{ color: C.ink }}>The Long Read</span> · 41,000 readers
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}

function CtaBanner() {
  const base = useBase()
  return (
    <section className={`${wrap} pb-24`}>
      <div className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16" style={{ background: C.night }}>
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(50% 80% at 50% 0%, rgba(223,79,46,0.22), transparent 70%)" }} />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold leading-tight sm:text-[44px]" style={{ fontFamily: DISPLAY, color: C.bone }}>
            Spend less time reading charts. More time writing.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg" style={{ color: "rgba(244,241,234,0.7)" }}>
            Free for 14 days. No card, no tracking pixels, no migration headache.
          </p>
          <div className="mt-8 flex justify-center">
            <CTA to={`${base}/pricing`}>Start free</CTA>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ======================= FEATURES ======================================= */
function FunnelSVG() {
  const rows = [
    { label: "Opened", pct: 100, val: "11,240" },
    { label: "Clicked", pct: 64, val: "7,190" },
    { label: "Visited", pct: 38, val: "4,270" },
    { label: "Subscribed", pct: 17, val: "1,910" },
    { label: "Upgraded", pct: 6, val: "674" },
  ]
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <Reveal key={r.label} delay={i * 0.07}>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-medium">{r.label}</span>
              <span style={{ fontFamily: MONO, color: C.mute }}>{r.val}</span>
            </div>
            <div className="h-9 w-full overflow-hidden rounded-lg" style={{ background: C.paperDeep }}>
              <motion.div
                className="flex h-full items-center px-3"
                style={{ background: i === rows.length - 1 ? C.accent : C.ink, opacity: 1 - i * 0.12 }}
                initial={{ width: 0 }}
                whileInView={{ width: `${r.pct}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <span className="text-xs font-semibold" style={{ fontFamily: MONO, color: C.bone }}>
                  {r.pct}%
                </span>
              </motion.div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function CohortGrid() {
  // retention heatmap: rows = signup month, cols = months since
  const data = [
    [100, 82, 74, 69, 66, 64],
    [100, 80, 71, 67, 64, 0],
    [100, 85, 78, 73, 0, 0],
    [100, 79, 70, 0, 0, 0],
    [100, 88, 0, 0, 0, 0],
  ]
  return (
    <div className="overflow-hidden rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      <div className="grid grid-cols-6 gap-1.5">
        {data.flatMap((row, ri) =>
          row.map((v, ci) => (
            <motion.div
              key={`${ri}-${ci}`}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (ri + ci) * 0.03, duration: 0.3 }}
              className="flex aspect-square items-center justify-center rounded-md text-[10px] font-semibold"
              style={{
                background: v === 0 ? "transparent" : `rgba(223,79,46,${0.12 + (v / 100) * 0.7})`,
                color: v > 55 ? "#fff" : C.inkSoft,
                fontFamily: MONO,
              }}
            >
              {v === 0 ? "" : v}
            </motion.div>
          )),
        )}
      </div>
      <p className="mt-3 text-xs" style={{ fontFamily: MONO, color: C.mute }}>
        Paid retention by signup cohort — % still subscribed, month over month.
      </p>
    </div>
  )
}

const FEATURE_BLOCKS = [
  {
    kicker: "Subscriber lens",
    title: "Watch the funnel that actually matters.",
    body: "Most tools count opens. Plume traces the whole path — opened, clicked, visited, subscribed, upgraded — and shows you exactly where readers slip away, per issue and per source.",
    points: ["Source attribution without pixels", "Per-issue conversion paths", "Early-drift churn flags"],
    visual: "funnel" as const,
  },
  {
    kicker: "Revenue desk",
    title: "The money math, finally legible.",
    body: "MRR, annual mix and lifetime value per channel — laid out so you can see which kind of reader is worth chasing, and which acquisition push paid for itself.",
    points: ["MRR & ARR with annual/monthly split", "LTV per acquisition source", "Refund & dunning visibility"],
    visual: "cohort" as const,
  },
]

function Features() {
  return (
    <Page>
      <section className={`${wrap} pt-20 lg:pt-28`}>
        <SectionHead
          kicker="The full tour"
          title="Everything you need to grow on purpose — and nothing you'll never open."
          lead="Plume is opinionated. It surfaces the handful of numbers that move a newsletter and writes you a plain read on the rest. Here's what's under the hood."
        />
      </section>

      <section className={`${wrap} space-y-24 py-20 lg:py-28`}>
        {FEATURE_BLOCKS.map((b, i) => (
          <div key={b.kicker} className={`grid items-center gap-12 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div>
              <Eyebrow>{b.kicker}</Eyebrow>
              <h3 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl" style={{ fontFamily: DISPLAY }}>
                {b.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed" style={{ color: C.mute }}>
                {b.body}
              </p>
              <ul className="mt-6 space-y-3">
                {b.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: C.accentWash, color: C.accentDeep }}>
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>{b.visual === "funnel" ? <FunnelSVG /> : <CohortGrid />}</div>
          </div>
        ))}
      </section>

      {/* the weekly read — dark feature */}
      <section style={{ background: C.night }}>
        <div className={`${wrap} grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28`}>
          <div>
            <Eyebrow dark>The weekly read</Eyebrow>
            <h3 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl" style={{ fontFamily: DISPLAY, color: C.bone }}>
              A two-minute brief, written for you, every Monday.
            </h3>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "rgba(244,241,234,0.7)" }}>
              No dashboard archaeology. Plume writes a short note: what changed this week, the most likely reason, and the single experiment worth your time.
            </p>
          </div>
          <Reveal>
            <div className="rounded-2xl p-6" style={{ background: C.nightCard, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: "rgba(244,241,234,0.45)" }}>
                <span>Monday brief</span>
                <span>Week 24</span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "rgba(244,241,234,0.85)" }}>
                You added <strong style={{ color: C.accent }}>312 subscribers</strong> this week — 71% from Thursday's essay, which travelled on referrals. Paid conversions dipped slightly; the upgrade prompt at the foot of free issues underperformed.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(244,241,234,0.85)" }}>
                <strong style={{ color: C.bone }}>Try this:</strong> move the upgrade ask above the fold on your next two sends and compare. Issues that converted best put it after the first section.
              </p>
              <div className="mt-5 flex items-center gap-3 border-t pt-4 text-xs" style={{ borderColor: "rgba(255,255,255,0.08)", fontFamily: MONO, color: "rgba(244,241,234,0.5)" }}>
                <Sparkles className="h-3.5 w-3.5" style={{ color: C.accent }} />
                Reading time: 1 min 50 sec
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </Page>
  )
}

/* ======================= PRICING ======================================== */
const PLANS = [
  {
    name: "Quill",
    blurb: "For writers just getting their list off the ground.",
    monthly: 0,
    annual: 0,
    cta: "Start free",
    features: ["Up to 2,500 subscribers", "Core desk + 4 key metrics", "12-month history backfill", "Weekly email brief"],
    featured: false,
  },
  {
    name: "Press",
    blurb: "For working writers with a paid tier to grow.",
    monthly: 19,
    annual: 15,
    cta: "Start 14-day trial",
    features: ["Up to 50,000 subscribers", "Revenue desk + LTV by source", "Issue scorecards & funnels", "Cohort retention grids", "Experiment tracking"],
    featured: true,
  },
  {
    name: "Bureau",
    blurb: "For teams and multi-title publications.",
    monthly: 49,
    annual: 39,
    cta: "Talk to us",
    features: ["Unlimited subscribers", "Multiple titles & seats", "Cross-title benchmarks", "API & data export", "Priority office hours"],
    featured: false,
  },
]

function Pricing() {
  const [annual, setAnnual] = useState(true)
  return (
    <Page>
      <section className={`${wrap} pt-20 text-center lg:pt-28`}>
        <div className="mx-auto max-w-2xl">
          <Eyebrow className="justify-center">Pricing</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.04] sm:text-5xl" style={{ fontFamily: DISPLAY }}>
            One desk. Honest pricing. Cancel in a click.
          </h1>
          <p className="mt-4 text-lg" style={{ color: C.mute }}>
            Every plan includes the full weekly read. Pay yearly and keep two months.
          </p>
        </div>

        {/* term toggle */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full p-1" style={{ background: C.paperDeep, border: `1px solid ${C.line}` }}>
          {[
            { k: false, label: "Monthly" },
            { k: true, label: "Yearly" },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => setAnnual(opt.k)}
              className="relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200"
              style={{ color: annual === opt.k ? "#fff" : C.inkSoft }}
            >
              {annual === opt.k && <motion.span layoutId="term-pill" className="absolute inset-0 rounded-full" style={{ background: C.accent }} />}
              <span className="relative">{opt.label}</span>
              {opt.k && <span className="relative ml-1.5 text-xs" style={{ color: annual ? "rgba(255,255,255,0.85)" : C.accentDeep }}>−20%</span>}
            </button>
          ))}
        </div>
      </section>

      <section className={`${wrap} grid gap-6 py-14 lg:grid-cols-3 lg:py-20`}>
        {PLANS.map((p, i) => {
          const price = annual ? p.annual : p.monthly
          return (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className="relative flex h-full flex-col rounded-3xl p-8"
                style={{
                  background: p.featured ? C.night : C.card,
                  color: p.featured ? C.bone : C.ink,
                  border: `1px solid ${p.featured ? "transparent" : C.line}`,
                  boxShadow: p.featured ? "0 40px 80px -50px rgba(0,0,0,0.6)" : "none",
                }}
              >
                {p.featured && (
                  <span className="absolute right-6 top-6 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ background: C.accent, color: "#fff", fontFamily: MONO }}>
                    Popular
                  </span>
                )}
                <h3 className="text-2xl font-semibold" style={{ fontFamily: DISPLAY }}>
                  {p.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: p.featured ? "rgba(244,241,234,0.65)" : C.mute }}>
                  {p.blurb}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold" style={{ fontFamily: DISPLAY }}>
                    <Counter to={price} prefix="$" />
                  </span>
                  <span className="text-sm" style={{ color: p.featured ? "rgba(244,241,234,0.6)" : C.mute }}>
                    /mo{price === 0 ? "" : annual ? ", billed yearly" : ""}
                  </span>
                </div>
                <ul className="mt-7 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: p.featured ? "rgba(223,79,46,0.25)" : C.accentWash, color: p.featured ? C.accent : C.accentDeep }}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span style={{ color: p.featured ? "rgba(244,241,234,0.9)" : C.inkSoft }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-2">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="block w-full rounded-full py-3 text-center text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                    style={
                      p.featured
                        ? { background: C.accent, color: "#fff" }
                        : { background: "transparent", color: C.ink, border: `1px solid ${C.line}` }
                    }
                  >
                    {p.cta}
                  </a>
                </div>
              </div>
            </Reveal>
          )
        })}
      </section>

      <PricingFAQ />
      <CtaBanner />
    </Page>
  )
}

const FAQ = [
  { q: "Do you use tracking pixels?", a: "No. Plume reads the data your platform already records and adds privacy-safe referral signals. Your readers are never followed around the web." },
  { q: "Which platforms do you support?", a: "Substack, Ghost, Beehiiv, Buttondown and ConvertKit out of the box, plus CSV import for anything else. History backfills in about a minute." },
  { q: "What happens after the trial?", a: "Nothing automatic. We email you before it ends. If you do nothing you drop to the free Quill plan — we never charge a card you didn't enter." },
  { q: "Can I export my data?", a: "Always. Every plan can export to CSV, and Bureau adds a full read API. Your numbers belong to you." },
]

function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className={`${wrap} pb-8`}>
      <SectionHead kicker="Questions" title="The things writers ask first." />
      <div className="mt-10 max-w-3xl divide-y" style={{ borderColor: C.line }}>
        {FAQ.map((f, i) => (
          <div key={f.q} style={{ borderColor: C.line }} className="border-t first:border-t-0">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
              <span className="text-lg font-medium" style={{ fontFamily: DISPLAY }}>
                {f.q}
              </span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-2xl" style={{ color: C.accent }}>
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <p className="pb-5 text-[15px] leading-relaxed" style={{ color: C.mute }}>
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ======================= CUSTOMERS ====================================== */
const STORIES = [
  {
    name: "Dani Okafor",
    pub: "The Long Read",
    seed: "dani-okafor",
    quote: "Plume told me my best essays were converting nothing — the upgrade prompt was buried. Moved it, and paid grew 40% in a quarter.",
    metric: { to: 41200, label: "readers" },
  },
  {
    name: "Marco Beltrán",
    pub: "Field Notes",
    seed: "marco-beltran",
    quote: "I finally understand my own business. The weekly read is the only newsletter I never archive unopened.",
    metric: { to: 12800, label: "readers" },
  },
  {
    name: "Priya Raman",
    pub: "Slow Mondays",
    seed: "priya-raman",
    quote: "Cancelled two analytics subscriptions and a spreadsheet habit. One desk, four numbers, done by my second coffee.",
    metric: { to: 27600, label: "readers" },
  },
]

const PROOF = [
  { to: 9100, suffix: "+", label: "independent writers" },
  { to: 48, prefix: "$", suffix: "M", label: "payouts tracked" },
  { to: 4.6, decimals: 1, suffix: "x", label: "median 1-yr growth" },
  { to: 99.98, decimals: 2, suffix: "%", label: "uptime, last 90 days" },
]

function Avatar({ seed, alt }: { seed: string; alt: string }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full" style={{ border: `2px solid ${C.accentWash}` }}>
      <img
        src={`https://picsum.photos/seed/${seed}/120/120`}
        alt={alt}
        width={48}
        height={48}
        loading="lazy"
        className="h-full w-full object-cover grayscale"
      />
      <span aria-hidden className="absolute inset-0" style={{ background: C.accent, mixBlendMode: "multiply", opacity: 0.28 }} />
    </div>
  )
}

function Customers() {
  return (
    <Page>
      <section className={`${wrap} pt-20 lg:pt-28`}>
        <SectionHead
          kicker="Customers"
          title="Writers who stopped guessing."
          lead="Nine thousand independent writers run their growth off Plume. A few of them told us what changed."
        />
      </section>

      {/* proof counters */}
      <section className={`${wrap} py-14`}>
        <div className="grid gap-px overflow-hidden rounded-3xl sm:grid-cols-2 lg:grid-cols-4" style={{ background: C.line }}>
          {PROOF.map((p) => (
            <div key={p.label} className="p-8" style={{ background: C.card }}>
              <Counter to={p.to} prefix={p.prefix} suffix={p.suffix} decimals={p.decimals ?? 0} className="text-4xl font-semibold" style={{ fontFamily: DISPLAY, color: C.ink }} />
              <div className="mt-2 text-sm" style={{ color: C.mute }}>
                {p.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* story cards */}
      <section className={`${wrap} grid gap-6 pb-20 lg:grid-cols-3`}>
        {STORIES.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.1}>
            <figure className="flex h-full flex-col rounded-3xl p-7" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <Quote className="h-7 w-7" style={{ color: C.accent }} />
              <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed" style={{ color: C.inkSoft }}>
                {s.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: C.line }}>
                <Avatar seed={s.seed} alt={`${s.name}, ${s.pub}`} />
                <div className="flex-1">
                  <div className="font-semibold" style={{ fontFamily: DISPLAY }}>
                    {s.name}
                  </div>
                  <div className="text-xs" style={{ fontFamily: MONO, color: C.mute }}>
                    {s.pub}
                  </div>
                </div>
                <div className="text-right">
                  <Counter to={s.metric.to} className="text-lg font-semibold" style={{ color: C.accentDeep }} />
                  <div className="text-[10px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.mute }}>
                    {s.metric.label}
                  </div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </section>

      <CtaBanner />
    </Page>
  )
}

/* ======================= CHANGELOG ====================================== */
const RELEASES = [
  {
    v: "2.4",
    date: "Jun 2026",
    tag: "New",
    title: "Cross-title benchmarks",
    body: "Bureau teams can now compare a title against the anonymised median of similar newsletters — by size, niche and cadence. See whether 58% opens is a win or a warning.",
  },
  {
    v: "2.3",
    date: "May 2026",
    tag: "Improved",
    title: "The weekly read got smarter",
    body: "Briefs now cite the specific issue that drove a change and suggest one ranked experiment instead of three. Shorter, sharper, more often right.",
  },
  {
    v: "2.2",
    date: "Apr 2026",
    tag: "New",
    title: "Cohort retention grids",
    body: "Paid retention by signup cohort, rendered as a heatmap you can actually read. Spot the month your churn starts before it becomes a trend.",
  },
  {
    v: "2.1",
    date: "Mar 2026",
    tag: "Fixed",
    title: "Faster backfill, Buttondown support",
    body: "Twelve-month history now imports in under a minute for lists up to 100k, and Buttondown joins the one-click integrations.",
  },
]

const TAG_STYLE: Record<string, CSSProperties> = {
  New: { background: C.accent, color: "#fff" },
  Improved: { background: C.ink, color: C.bone },
  Fixed: { background: C.accentWash, color: C.accentDeep },
}

function Changelog() {
  return (
    <Page>
      <section className={`${wrap} pt-20 lg:pt-28`}>
        <SectionHead kicker="Changelog" title="What's new on the desk." lead="We ship small and often. Here's the recent trail — every release written so a human can read it." />
      </section>

      <section className={`${wrap} py-16`}>
        <div className="relative ml-2 border-l pl-8 sm:ml-4" style={{ borderColor: C.line }}>
          {RELEASES.map((r, i) => (
            <Reveal key={r.v} delay={i * 0.08}>
              <div className="relative pb-12 last:pb-0">
                <span className="absolute -left-[42px] flex h-5 w-5 items-center justify-center rounded-full" style={{ background: C.paper, border: `2px solid ${C.accent}` }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: C.accent }} />
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md px-2.5 py-1 text-xs font-bold" style={{ ...TAG_STYLE[r.tag], fontFamily: MONO }}>
                    {r.tag}
                  </span>
                  <span className="text-sm font-semibold" style={{ fontFamily: MONO, color: C.ink }}>
                    v{r.v}
                  </span>
                  <span className="text-sm" style={{ fontFamily: MONO, color: C.mute }}>
                    {r.date}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold" style={{ fontFamily: DISPLAY }}>
                  {r.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ color: C.mute }}>
                  {r.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner />
    </Page>
  )
}

/* ======================= ROOT =========================================== */
export default function Plume() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="customers" element={<Customers />} />
        <Route path="changelog" element={<Changelog />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "Plume — Analytics for newsletter writers",
  description:
    "A SaaS analytics product for independent newsletter writers: one calm desk, four numbers that matter, and a weekly plain-English read. Featured interaction: animated counters everywhere — every metric ticks up from zero on scroll — plus a cursor-reactive spotlight dashboard, magnetic CTAs, staggered grids and hand-built SVG charts.",
  date: "2026-06-24",
  type: "SaaS / analytics product",
  interaction: "Animated count-up counters on scroll + cursor-reactive spotlight dashboard",
  pages: ["Home", "Features", "Pricing", "Customers", "Changelog"],
}
