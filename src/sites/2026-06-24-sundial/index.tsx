import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { motion, useInView, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clipboard,
  Clock,
  GitBranch,
  Globe2,
  Menu,
  RotateCcw,
  ScrollText,
  Terminal,
  X,
} from "lucide-react"
import type { SiteMeta } from "../types"
import { Spotlight } from "@/components/fx/Spotlight"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"

/* ───────────────────────────── brand tokens ─────────────────────────────
   Sundial — "cron you can actually read". A dev tool for scheduled jobs.
   Warm paper + brass, never the purple/indigo dev-tool default.            */

const fontVars = {
  ["--fd" as string]: "'Space Grotesk', system-ui, sans-serif",
  ["--fb" as string]: "'IBM Plex Sans', system-ui, sans-serif",
  ["--fm" as string]: "'JetBrains Mono', ui-monospace, monospace",
} as CSSProperties

const display = "font-[family-name:var(--fd)]"
const mono = "font-[family-name:var(--fm)]"

/* ───────────────────────────── sundial mark ───────────────────────────── */

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none">
      {/* dial plate */}
      <path d="M4 31 A16 16 0 0 1 36 31" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      <line x1="4" y1="31" x2="36" y2="31" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      {/* hour ticks */}
      {Array.from({ length: 7 }).map((_, i) => {
        const a = Math.PI - (i / 6) * Math.PI
        const x1 = 20 + Math.cos(a) * 15
        const y1 = 31 - Math.sin(a) * 15
        const x2 = 20 + Math.cos(a) * 12
        const y2 = 31 - Math.sin(a) * 12
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      })}
      {/* gnomon */}
      <path d="M20 31 L20 9 L20 31 Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M20 31 L20 9" stroke="currentColor" strokeWidth="1.6" />
      {/* shadow cast */}
      <line x1="20" y1="31" x2="9.5" y2="22" stroke="#b8841f" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20" cy="31" r="1.8" fill="#b8841f" />
    </svg>
  )
}

/* ───────────────────────────── small primitives ───────────────────────── */

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduced = useReducedMotion()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setV(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1500
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, reduced])
  return (
    <span ref={ref}>
      {v.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          window.setTimeout(() => setDone(false), 1500)
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-[#bdb6a1] transition-colors hover:bg-white/5 hover:text-[#efe9d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a93c]/60"
    >
      {done ? <Check className="h-3.5 w-3.5 text-[#8fbf6e]" /> : <Clipboard className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  )
}

/* A dark code panel that matches the terminal aesthetic. */
function CodePanel({
  title,
  lines,
  copy,
  className,
}: {
  title: string
  lines: { t: string; c?: string }[]
  copy: string
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-[#2c2920] bg-[#1b190f] shadow-[0_24px_60px_-30px_rgba(20,18,10,0.7)]", className)}>
      <div className="flex items-center justify-between border-b border-[#2c2920] px-4 py-2.5">
        <div className="flex items-center gap-2 text-[11px] text-[#9a9483]">
          <ScrollText className="h-3.5 w-3.5 text-[#e0a93c]" />
          <span className={mono}>{title}</span>
        </div>
        <CopyButton text={copy} />
      </div>
      <pre className={cn(mono, "overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed")}>
        <code>
          {lines.map((l, i) => (
            <div key={i} className={l.c ?? "text-[#d9d3c1]"}>
              {l.t === "" ? " " : l.t}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

/* ─────────────────── featured interaction: typing terminal ─────────────── */

type OutLine = { t: string; k?: "ok" | "arrow" | "muted" | "fail" | "head" }

const SCENARIOS: { id: string; label: string; cmd: string; out: OutLine[] }[] = [
  {
    id: "deploy",
    label: "Deploy",
    cmd: "sundial deploy",
    out: [
      { t: "✓ Parsed schedule.ts — 4 jobs found", k: "ok" },
      { t: "✓ Validated cron expressions & timezones", k: "ok" },
      { t: "→ digest-email   every weekday 08:00  America/New_York", k: "arrow" },
      { t: "→ rotate-logs    @hourly", k: "arrow" },
      { t: "→ sync-stripe    */15 * * * *", k: "arrow" },
      { t: "→ purge-temp     every day 03:30  UTC", k: "arrow" },
      { t: "✓ Deployed to production in 1.21s", k: "ok" },
    ],
  },
  {
    id: "watch",
    label: "Watch a run",
    cmd: "sundial runs --watch digest-email",
    out: [
      { t: "08:00:00  digest-email  started   run_9f2a1", k: "head" },
      { t: "08:00:00  · resolving 4,210 subscribers", k: "muted" },
      { t: "08:00:01  · rendering templates", k: "muted" },
      { t: "08:00:03  ✓ delivered 4,210 emails", k: "ok" },
      { t: "08:00:03  digest-email  ok        3.04s", k: "ok" },
    ],
  },
  {
    id: "retry",
    label: "Auto-retry",
    cmd: "sundial runs sync-stripe",
    out: [
      { t: "09:15:00  sync-stripe  failed   429 rate limited", k: "fail" },
      { t: "09:15:02  · retry 1/5 in 2.0s  (exp backoff)", k: "muted" },
      { t: "09:15:04  ✓ reconciled 1,884 charges", k: "ok" },
      { t: "09:15:04  sync-stripe  ok       recovered", k: "ok" },
    ],
  },
]

const outClass: Record<NonNullable<OutLine["k"]>, string> = {
  ok: "text-[#8fbf6e]",
  arrow: "text-[#e0a93c]",
  muted: "text-[#8a8472]",
  fail: "text-[#e07a5f]",
  head: "text-[#d9d3c1]",
}

function TypingTerminal() {
  const reduced = useReducedMotion()
  const [si, setSi] = useState(0)
  const [cmdLen, setCmdLen] = useState(0)
  const [outN, setOutN] = useState(0)
  const [typing, setTyping] = useState(true)
  const scn = SCENARIOS[si]

  useEffect(() => {
    if (reduced) {
      setCmdLen(scn.cmd.length)
      setOutN(scn.out.length)
      setTyping(false)
      return
    }
    const timers: number[] = []
    setCmdLen(0)
    setOutN(0)
    setTyping(true)
    const cmd = scn.cmd
    const out = scn.out

    let i = 0
    const typeNext = () => {
      i += 1
      setCmdLen(i)
      if (i < cmd.length) timers.push(window.setTimeout(typeNext, 34 + Math.random() * 46))
      else timers.push(window.setTimeout(startOutput, 420))
    }
    let j = 0
    const startOutput = () => {
      setTyping(false)
      const revealNext = () => {
        j += 1
        setOutN(j)
        if (j < out.length) timers.push(window.setTimeout(revealNext, 360 + Math.random() * 220))
        else timers.push(window.setTimeout(() => setSi((s) => (s + 1) % SCENARIOS.length), 3000))
      }
      revealNext()
    }
    timers.push(window.setTimeout(typeNext, 520))
    return () => timers.forEach((t) => clearTimeout(t))
  }, [si, reduced, scn])

  return (
    <div className="rounded-2xl border border-[#2c2920] bg-[#1b190f] shadow-[0_40px_90px_-40px_rgba(20,18,10,0.8)]">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-[#2c2920] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#e07a5f]" />
        <span className="h-3 w-3 rounded-full bg-[#e0a93c]" />
        <span className="h-3 w-3 rounded-full bg-[#8fbf6e]" />
        <div className="ml-2 flex items-center gap-1.5 text-[11px] text-[#9a9483]">
          <Terminal className="h-3.5 w-3.5" />
          <span className={mono}>~/acme — sundial</span>
        </div>
      </div>

      {/* scenario tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#2c2920] px-3 py-2.5">
        {SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSi(idx)}
            className={cn(
              mono,
              "rounded-md px-2.5 py-1 text-[11px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a93c]/60",
              idx === si ? "bg-[#e0a93c]/15 text-[#e0a93c]" : "text-[#8a8472] hover:text-[#d9d3c1]",
            )}
            aria-pressed={idx === si}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* body */}
      <div className={cn(mono, "min-h-[260px] px-4 py-4 text-[12.5px] leading-relaxed sm:min-h-[248px]")}>
        <div className="text-[#d9d3c1]">
          <span className="text-[#8fbf6e]">➜</span> <span className="text-[#7fa7c9]">acme</span>{" "}
          <span className="text-[#efe9d8]">{scn.cmd.slice(0, cmdLen)}</span>
          {typing && !reduced && (
            <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-pulse bg-[#e0a93c]" aria-hidden />
          )}
        </div>
        <div className="mt-2 space-y-0.5">
          {scn.out.slice(0, outN).map((l, i) => (
            <motion.div
              key={`${scn.id}-${i}`}
              initial={reduced ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={l.k ? outClass[l.k] : "text-[#d9d3c1]"}
            >
              {l.t}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────── layout chrome ──────────────────────────── */

function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  return (
    <motion.div
      key={pathname}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function TopNav({ base }: { base: string }) {
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/docs`, label: "Docs", end: false },
    { to: `${base}/pricing`, label: "Pricing", end: false },
    { to: `${base}/changelog`, label: "Changelog", end: false },
  ]
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative text-sm transition-colors",
      isActive ? "text-[#1b1810]" : "text-[#5e5849] hover:text-[#1b1810]",
    )
  return (
    <header className="sticky top-0 z-50 border-b border-[#1b1810]/10 bg-[#f5f1e8]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <NavLink to={base} end className="flex items-center gap-2.5">
          <Mark className="h-8 w-8 text-[#1b1810]" />
          <span className={cn(display, "text-lg font-bold tracking-tight text-[#1b1810]")}>Sundial</span>
        </NavLink>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink key={l.label} to={l.to} end={l.end} className={linkCls}>
              {({ isActive }) => (
                <span className="relative inline-block py-1">
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="navdot"
                      className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-[#b8841f]"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#" className="text-sm text-[#5e5849] transition-colors hover:text-[#1b1810]">
            Sign in
          </a>
          <Magnetic strength={0.35}>
            <a
              href="#"
              className={cn(
                display,
                "inline-flex items-center gap-1.5 rounded-full bg-[#1b1810] px-4 py-2 text-sm font-medium text-[#f5f1e8] transition-colors hover:bg-[#332d20]",
              )}
            >
              Start free <ArrowRight className="h-4 w-4" />
            </a>
          </Magnetic>
        </div>

        <button
          type="button"
          className="md:hidden text-[#1b1810]"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#1b1810]/10 bg-[#f5f1e8] px-5 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm",
                    isActive ? "bg-[#1b1810]/5 text-[#1b1810]" : "text-[#5e5849]",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

function Footer({ base }: { base: string }) {
  return (
    <footer className="border-t border-[#1b1810]/10 bg-[#efe8d8]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark className="h-8 w-8 text-[#1b1810]" />
            <span className={cn(display, "text-lg font-bold text-[#1b1810]")}>Sundial</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#5e5849]">
            Cron you can actually read. Schedules as typed code, with retries, timezones and a
            timeline you can trust.
          </p>
          <p className={cn(mono, "mt-5 text-xs text-[#8a8472]")}>© 2026 Sundial Labs, Lisbon</p>
        </div>
        {[
          { h: "Product", items: ["Overview", "Pricing", "Changelog", "Status"] },
          { h: "Developers", items: ["Documentation", "CLI reference", "Examples", "SDK"] },
          { h: "Company", items: ["About", "Careers", "Security", "Contact"] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className={cn(display, "text-sm font-semibold text-[#1b1810]")}>{col.h}</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#5e5849]">
              {col.items.map((it) => (
                <li key={it}>
                  <NavLink
                    to={
                      it === "Pricing"
                        ? `${base}/pricing`
                        : it === "Changelog"
                          ? `${base}/changelog`
                          : it === "Documentation"
                            ? `${base}/docs`
                            : base
                    }
                    className="transition-colors hover:text-[#1b1810]"
                  >
                    {it}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}

/* ───────────────────────────── Home ───────────────────────────── */

const FEATURES = [
  {
    icon: ScrollText,
    title: "Schedules as code",
    body: "Define every job in a typed schedule.ts. Diff it, review it, version it. No clicking around a console at 2am.",
  },
  {
    icon: RotateCcw,
    title: "Retries that mean it",
    body: "Exponential backoff, jitter and dead-letter handling built in. A flaky upstream stops being your problem.",
  },
  {
    icon: Globe2,
    title: "Timezones, done right",
    body: "Write 08:00 America/New_York and forget DST forever. We resolve the wall-clock so you never miss a Monday.",
  },
  {
    icon: Clock,
    title: "A timeline you trust",
    body: "Every run, every log line, every retry — searchable, with structured output and alerting that isn't noise.",
  },
]

function Home() {
  return (
    <PageShell>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 12%, rgba(184,132,31,0.16), transparent 42%), radial-gradient(circle at 88% 0%, rgba(184,132,31,0.10), transparent 38%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(#1b181011 1px, transparent 1px), linear-gradient(90deg, #1b181011 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(to bottom, black, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <span className={cn(mono, "inline-flex items-center gap-2 rounded-full border border-[#b8841f]/40 bg-[#b8841f]/10 px-3 py-1 text-[11px] text-[#875c10]")}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8841f]" /> v2.4 — now with run replays
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className={cn(display, "mt-5 text-[2.6rem] font-bold leading-[1.04] tracking-tight text-[#1b1810] sm:text-6xl")}>
                Cron you can
                <br />
                actually <span className="text-[#a8741a]">read.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-[#4a4536]">
                Sundial turns scheduled jobs into typed, reviewable code — then runs them with
                retries, real timezones and a timeline that tells you the truth.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={0.4}>
                  <a
                    href="#"
                    className={cn(
                      display,
                      "inline-flex items-center gap-2 rounded-full bg-[#1b1810] px-6 py-3 text-sm font-medium text-[#f5f1e8] transition-colors hover:bg-[#332d20]",
                    )}
                  >
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                </Magnetic>
                <a
                  href="#install"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1b1810]/15 px-6 py-3 text-sm text-[#1b1810] transition-colors hover:border-[#1b1810]/40"
                >
                  <Terminal className="h-4 w-4" /> npm i -g sundial
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <p className={cn(mono, "mt-6 text-xs text-[#8a8472]")}>
                No credit card · 10,000 free runs / month · MIT-licensed CLI
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Spotlight color="rgba(224,169,60,0.16)" size={420} className="rounded-2xl">
              <TypingTerminal />
            </Spotlight>
          </Reveal>
        </div>
      </section>

      {/* stats */}
      <section className="border-y border-[#1b1810]/10 bg-[#efe8d8]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:px-8 md:grid-cols-4">
          {[
            { v: 38, suffix: "M", label: "jobs run last month", d: 0 },
            { v: 99.99, suffix: "%", label: "scheduler uptime", d: 2 },
            { v: 120, suffix: "ms", label: "median trigger drift", d: 0 },
            { v: 4200, suffix: "+", label: "teams on Sundial", d: 0 },
          ].map((s) => (
            <Reveal key={s.label}>
              <div>
                <div className={cn(display, "text-3xl font-bold text-[#1b1810] sm:text-4xl")}>
                  <Counter to={s.v} suffix={s.suffix} decimals={s.d} />
                </div>
                <div className="mt-1 text-sm text-[#5e5849]">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className={cn(display, "text-3xl font-bold tracking-tight text-[#1b1810] sm:text-4xl")}>
            Three steps to a schedule you can sleep on
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { n: "01", h: "Write it", b: "Declare jobs in schedule.ts with plain English cadences. TypeScript autocompletes the rest." },
            { n: "02", h: "Deploy it", b: "One command validates every cron expression and ships to our global scheduler." },
            { n: "03", h: "Watch it", b: "Tail runs live, replay failures, and get paged only when something actually breaks." },
          ].map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-[#1b1810]/10 bg-[#faf7ef] p-7">
                <span className={cn(mono, "text-sm text-[#875c10]")}>{step.n}</span>
                <h3 className={cn(display, "mt-3 text-xl font-semibold text-[#1b1810]")}>{step.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5e5849]">{step.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* feature grid — asymmetric */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-5 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-[#1b1810]/10 bg-[#1b1810] p-8 text-[#f5f1e8]">
              <div>
                <ScrollText className="h-7 w-7 text-[#e0a93c]" />
                <h3 className={cn(display, "mt-4 text-2xl font-bold")}>One file is the source of truth</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#cfc8b6]">
                  Your whole schedule lives in version control. Pull requests review changes to your
                  cron just like any other code — diffs, approvals, rollbacks and all.
                </p>
              </div>
              <div className="mt-6">
                <CodePanel
                  title="schedule.ts"
                  copy={'import { job } from "sundial"\n\njob("digest-email")\n  .every("weekday at 08:00")\n  .tz("America/New_York")\n  .retry({ attempts: 5, backoff: "exponential" })\n  .run(sendDigest)'}
                  lines={[
                    { t: 'import { job } from "sundial"', c: "text-[#8a8472]" },
                    { t: "" },
                    { t: 'job("digest-email")', c: "text-[#e0a93c]" },
                    { t: '  .every("weekday at 08:00")', c: "text-[#d9d3c1]" },
                    { t: '  .tz("America/New_York")', c: "text-[#d9d3c1]" },
                    { t: '  .retry({ attempts: 5, backoff: "exponential" })', c: "text-[#d9d3c1]" },
                    { t: "  .run(sendDigest)", c: "text-[#7fa7c9]" },
                  ]}
                />
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 md:col-span-5">
            {FEATURES.slice(0, 2).map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="group h-full rounded-3xl border border-[#1b1810]/10 bg-[#faf7ef] p-7 transition-colors hover:border-[#b8841f]/50">
                  <f.icon className="h-6 w-6 text-[#b8841f] transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <h3 className={cn(display, "mt-4 text-lg font-semibold text-[#1b1810]")}>{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5e5849]">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {FEATURES.slice(2).map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="md:col-span-6">
              <div className="group h-full rounded-3xl border border-[#1b1810]/10 bg-[#faf7ef] p-7 transition-colors hover:border-[#b8841f]/50">
                <f.icon className="h-6 w-6 text-[#b8841f] transition-transform duration-300 group-hover:-translate-y-0.5" />
                <h3 className={cn(display, "mt-4 text-lg font-semibold text-[#1b1810]")}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5e5849]">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* install strip */}
      <section id="install" className="border-t border-[#1b1810]/10 bg-[#efe8d8]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:px-8 md:grid-cols-2">
          <Reveal>
            <div>
              <h2 className={cn(display, "text-3xl font-bold tracking-tight text-[#1b1810]")}>
                Up and running before your coffee
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5e5849]">
                Install the CLI, point it at a function, and deploy. Sundial works with any Node,
                Bun or Deno project — no infrastructure to babysit.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <CodePanel
              title="bash"
              copy={"npm i -g sundial\nsundial init\nsundial deploy"}
              lines={[
                { t: "$ npm i -g sundial", c: "text-[#8fbf6e]" },
                { t: "$ sundial init", c: "text-[#8fbf6e]" },
                { t: "  created schedule.ts", c: "text-[#8a8472]" },
                { t: "$ sundial deploy", c: "text-[#8fbf6e]" },
                { t: "  ✓ live in 1.2s", c: "text-[#e0a93c]" },
              ]}
            />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  )
}

function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Spotlight color="rgba(224,169,60,0.18)" size={500} className="rounded-3xl">
        <div className="rounded-3xl border border-[#332d20] bg-[#1b1810] px-8 py-14 text-center sm:px-16">
          <h2 className={cn(display, "mx-auto max-w-2xl text-3xl font-bold leading-tight text-[#f5f1e8] sm:text-4xl")}>
            Stop guessing whether your jobs ran.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#cfc8b6]">
            Move your crontab into code today. Your future on-call self will thank you.
          </p>
          <div className="mt-8 flex justify-center">
            <Magnetic strength={0.45}>
              <a
                href="#"
                className={cn(
                  display,
                  "inline-flex items-center gap-2 rounded-full bg-[#e0a93c] px-7 py-3 text-sm font-semibold text-[#1b1810] transition-colors hover:bg-[#eab94f]",
                )}
              >
                Start free <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>
          </div>
        </div>
      </Spotlight>
    </section>
  )
}

/* ───────────────────────────── Docs ───────────────────────────── */

const DOC_SECTIONS = [
  { id: "install", label: "Installation" },
  { id: "first-job", label: "Your first job" },
  { id: "cadences", label: "Cadences" },
  { id: "retries", label: "Retries & backoff" },
  { id: "observability", label: "Observability" },
]

function Docs() {
  const [active, setActive] = useState("install")
  const [pkg, setPkg] = useState<"npm" | "pnpm" | "bun">("npm")
  const installCmd = { npm: "npm i -g sundial", pnpm: "pnpm add -g sundial", bun: "bun add -g sundial" }[pkg]

  // Scrollspy: keep the sidebar in sync with the section being read.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-30% 0px -60% 0px" },
    )
    DOC_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mb-10">
          <span className={cn(mono, "text-xs text-[#875c10]")}>DOCUMENTATION</span>
          <h1 className={cn(display, "mt-2 text-4xl font-bold tracking-tight text-[#1b1810]")}>Getting started</h1>
          <p className="mt-3 max-w-xl text-[#5e5849]">
            Everything you need to ship your first scheduled job in about five minutes.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex flex-col gap-1 border-l border-[#1b1810]/10">
              {DOC_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "-ml-px border-l-2 px-4 py-1.5 text-sm transition-colors",
                    active === s.id
                      ? "border-[#b8841f] text-[#1b1810]"
                      : "border-transparent text-[#5e5849] hover:text-[#1b1810]",
                  )}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* content */}
          <div className="max-w-2xl space-y-14">
            <section id="install" className="scroll-mt-24">
              <h2 className={cn(display, "text-2xl font-bold text-[#1b1810]")}>Installation</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4a4536]">
                Sundial ships as a single CLI. Install it globally with your package manager of choice.
              </p>
              <div className="mt-4 flex gap-1.5">
                {(["npm", "pnpm", "bun"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPkg(p)}
                    className={cn(
                      mono,
                      "rounded-md px-3 py-1 text-xs transition-colors",
                      pkg === p
                        ? "bg-[#1b1810] text-[#f5f1e8]"
                        : "bg-[#1b1810]/5 text-[#5e5849] hover:bg-[#1b1810]/10",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <CodePanel
                className="mt-3"
                title="terminal"
                copy={installCmd}
                lines={[{ t: `$ ${installCmd}`, c: "text-[#8fbf6e]" }]}
              />
            </section>

            <section id="first-job" className="scroll-mt-24">
              <h2 className={cn(display, "text-2xl font-bold text-[#1b1810]")}>Your first job</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4a4536]">
                Run <code className={cn(mono, "rounded bg-[#1b1810]/6 px-1.5 py-0.5 text-[13px] text-[#875c10]")}>sundial init</code>{" "}
                to scaffold a <code className={cn(mono, "rounded bg-[#1b1810]/6 px-1.5 py-0.5 text-[13px] text-[#875c10]")}>schedule.ts</code>. Each
                job is a fluent builder ending in <code className={cn(mono, "rounded bg-[#1b1810]/6 px-1.5 py-0.5 text-[13px] text-[#875c10]")}>.run()</code>.
              </p>
              <CodePanel
                className="mt-4"
                title="schedule.ts"
                copy={'import { job } from "sundial"\nimport { sendDigest } from "./tasks"\n\njob("digest-email")\n  .every("weekday at 08:00")\n  .tz("America/New_York")\n  .run(sendDigest)'}
                lines={[
                  { t: 'import { job } from "sundial"', c: "text-[#8a8472]" },
                  { t: 'import { sendDigest } from "./tasks"', c: "text-[#8a8472]" },
                  { t: "" },
                  { t: 'job("digest-email")', c: "text-[#e0a93c]" },
                  { t: '  .every("weekday at 08:00")', c: "text-[#d9d3c1]" },
                  { t: '  .tz("America/New_York")', c: "text-[#d9d3c1]" },
                  { t: "  .run(sendDigest)", c: "text-[#7fa7c9]" },
                ]}
              />
            </section>

            <section id="cadences" className="scroll-mt-24">
              <h2 className={cn(display, "text-2xl font-bold text-[#1b1810]")}>Cadences</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4a4536]">
                Write cadences in English or raw cron — both compile to the same schedule. Sundial
                validates them at deploy time, so a typo never silently skips a run.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-[#1b1810]/10">
                {[
                  ['.every("hour")', "@hourly"],
                  ['.every("day at 03:30")', "30 3 * * *"],
                  ['.every("weekday at 08:00")', "0 8 * * 1-5"],
                  ['.every("15 minutes")', "*/15 * * * *"],
                ].map(([en, cron], i) => (
                  <div
                    key={en}
                    className={cn(
                      "grid grid-cols-2 gap-4 px-4 py-2.5 text-[13px]",
                      i % 2 === 0 ? "bg-[#faf7ef]" : "bg-[#f1ead9]",
                    )}
                  >
                    <code className={cn(mono, "text-[#875c10]")}>{en}</code>
                    <code className={cn(mono, "text-[#5e5849]")}>{cron}</code>
                  </div>
                ))}
              </div>
            </section>

            <section id="retries" className="scroll-mt-24">
              <h2 className={cn(display, "text-2xl font-bold text-[#1b1810]")}>Retries & backoff</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4a4536]">
                Add <code className={cn(mono, "rounded bg-[#1b1810]/6 px-1.5 py-0.5 text-[13px] text-[#875c10]")}>.retry()</code> and
                Sundial handles attempts, exponential backoff with jitter, and a dead-letter queue
                for runs that exhaust every try.
              </p>
              <div className="mt-4 rounded-xl border border-[#b8841f]/30 bg-[#b8841f]/8 p-4">
                <p className="text-sm text-[#4a4536]">
                  <strong className="text-[#1b1810]">Tip —</strong> failed runs land in the dead-letter
                  queue with full context. Replay them with{" "}
                  <code className={cn(mono, "text-[#875c10]")}>sundial replay &lt;run_id&gt;</code> once the
                  upstream recovers.
                </p>
              </div>
            </section>

            <section id="observability" className="scroll-mt-24">
              <h2 className={cn(display, "text-2xl font-bold text-[#1b1810]")}>Observability</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4a4536]">
                Every run streams structured logs to the timeline. Tail them live, filter by job or
                status, and wire alerts to Slack, PagerDuty or a webhook.
              </p>
              <CodePanel
                className="mt-4"
                title="terminal"
                copy={"sundial runs --status failed --since 24h"}
                lines={[
                  { t: "$ sundial runs --status failed --since 24h", c: "text-[#8fbf6e]" },
                  { t: "sync-stripe  09:15  429 rate limited  → recovered", c: "text-[#d9d3c1]" },
                  { t: "0 runs currently failing ✓", c: "text-[#e0a93c]" },
                ]}
              />
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

/* ───────────────────────────── Pricing ───────────────────────────── */

const TIERS = [
  {
    name: "Hobby",
    price: "$0",
    note: "forever",
    blurb: "For side projects and the crontab you keep forgetting to back up.",
    features: ["10,000 runs / month", "3 scheduled jobs", "7-day run history", "Community support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Team",
    price: "$29",
    note: "/ month",
    blurb: "For product teams who want cron in code review.",
    features: ["2,000,000 runs / month", "Unlimited jobs", "90-day history & replays", "Slack & PagerDuty alerts", "Role-based access"],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    note: "talk to us",
    blurb: "For platforms running mission-critical schedules at volume.",
    features: ["Unlimited runs", "Dedicated regions", "99.99% SLA", "SSO & audit logs", "Solutions engineer"],
    cta: "Contact sales",
    featured: false,
  },
]

const FAQ = [
  { q: "What counts as a run?", a: "A single execution of a job. A job scheduled hourly that runs all month is ~730 runs. Retries of the same trigger don't count separately." },
  { q: "Can I self-host the scheduler?", a: "The CLI is MIT-licensed and runs anywhere. The hosted scheduler, timeline and alerting are what you pay for — though Scale plans can deploy into your own VPC." },
  { q: "How are timezones handled?", a: "You declare a tz per job. We resolve the wall-clock time including daylight saving, so 08:00 stays 08:00 across the year." },
  { q: "Is there a Terraform provider?", a: "Yes. Manage jobs, alerts and access policies declaratively alongside the rest of your infrastructure." },
]

function Pricing() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className={cn(mono, "text-xs text-[#875c10]")}>PRICING</span>
            <h1 className={cn(display, "mt-2 text-4xl font-bold tracking-tight text-[#1b1810] sm:text-5xl")}>
              Pay for runs, not for seats
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4536]">
              Start free and grow into it. Every plan includes the full CLI, the timeline and
              honest, predictable billing.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className={t.featured ? "lg:-mt-3 lg:mb-3" : ""}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-3xl border p-7",
                  t.featured
                    ? "border-[#332d20] bg-[#1b1810] text-[#f5f1e8] shadow-[0_30px_70px_-35px_rgba(27,24,16,0.6)]"
                    : "border-[#1b1810]/12 bg-[#faf7ef] text-[#1b1810]",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className={cn(display, "text-lg font-semibold")}>{t.name}</h3>
                  {t.featured && (
                    <span className={cn(mono, "rounded-full bg-[#e0a93c] px-2.5 py-0.5 text-[10px] font-semibold text-[#1b1810]")}>
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className={cn(display, "text-4xl font-bold")}>{t.price}</span>
                  <span className={cn("text-sm", t.featured ? "text-[#cfc8b6]" : "text-[#8a8472]")}>{t.note}</span>
                </div>
                <p className={cn("mt-3 text-sm leading-relaxed", t.featured ? "text-[#cfc8b6]" : "text-[#5e5849]")}>
                  {t.blurb}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", t.featured ? "text-[#e0a93c]" : "text-[#b8841f]")} />
                      <span className={t.featured ? "text-[#e9e3d1]" : "text-[#4a4536]"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 pt-2">
                  <Magnetic strength={0.3}>
                    <a
                      href="#"
                      className={cn(
                        display,
                        "inline-flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                        t.featured
                          ? "bg-[#e0a93c] text-[#1b1810] hover:bg-[#eab94f]"
                          : "border border-[#1b1810]/20 text-[#1b1810] hover:bg-[#1b1810] hover:text-[#f5f1e8]",
                      )}
                    >
                      {t.cta} <ArrowRight className="h-4 w-4" />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <Reveal>
            <h2 className={cn(display, "text-2xl font-bold text-[#1b1810]")}>Common questions</h2>
          </Reveal>
          <div className="mt-6 divide-y divide-[#1b1810]/10 border-y border-[#1b1810]/10">
            {FAQ.map((item, i) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={open === i}
                >
                  <span className={cn(display, "text-[15px] font-medium text-[#1b1810]")}>{item.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-[#b8841f]">
                    <X className="h-4 w-4 rotate-45" />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-sm leading-relaxed text-[#5e5849]">{item.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

/* ───────────────────────────── Changelog ───────────────────────────── */

const RELEASES = [
  {
    v: "2.4.0",
    date: "Jun 18, 2026",
    tag: "feature",
    title: "Run replays",
    notes: ["Replay any historical run with its exact payload via the CLI or timeline.", "Dead-letter queue now retains 90 days of context on Team plans."],
  },
  {
    v: "2.3.1",
    date: "Jun 02, 2026",
    tag: "fix",
    title: "DST edge cases",
    notes: ["Fixed a one-hour drift for jobs scheduled during the spring-forward gap.", "Improved cron validation error messages with a column pointer."],
  },
  {
    v: "2.3.0",
    date: "May 20, 2026",
    tag: "feature",
    title: "Terraform provider",
    notes: ["Manage jobs, alerts and access policies as code.", "New `sundial export` command emits HCL from an existing project."],
  },
  {
    v: "2.2.0",
    date: "May 04, 2026",
    tag: "feature",
    title: "Structured logs",
    notes: ["Every run now streams JSON log lines you can filter and route.", "Slack and PagerDuty alert integrations out of the box."],
  },
]

const tagStyle: Record<string, string> = {
  feature: "bg-[#b8841f]/12 text-[#875c10] border-[#b8841f]/30",
  fix: "bg-[#8fbf6e]/15 text-[#4a6b32] border-[#8fbf6e]/40",
}

function Changelog() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <Reveal>
          <span className={cn(mono, "text-xs text-[#875c10]")}>CHANGELOG</span>
          <h1 className={cn(display, "mt-2 text-4xl font-bold tracking-tight text-[#1b1810] sm:text-5xl")}>
            What's new in Sundial
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#4a4536]">
            Shipped continuously, versioned honestly. Subscribe via RSS or follow along here.
          </p>
        </Reveal>

        <div className="mt-14 space-y-2">
          {RELEASES.map((r, i) => (
            <Reveal key={r.v} delay={i * 0.06}>
              <div className="grid gap-4 border-l border-[#1b1810]/12 pl-6 pb-12 sm:grid-cols-[110px_1fr] sm:gap-8">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-[#f5f1e8] bg-[#b8841f]" />
                  <div className={cn(mono, "text-sm font-medium text-[#1b1810]")}>v{r.v}</div>
                  <div className="mt-0.5 text-xs text-[#8a8472]">{r.date}</div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className={cn(mono, "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase", tagStyle[r.tag])}>
                      {r.tag}
                    </span>
                    <h3 className={cn(display, "text-xl font-semibold text-[#1b1810]")}>{r.title}</h3>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {r.notes.map((n) => (
                      <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#5e5849]">
                        <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-[#b8841f]/70" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-[#875c10] transition-colors hover:text-[#1b1810]">
            View full release archive <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </PageShell>
  )
}

/* ───────────────────────────── shell ───────────────────────────── */

export default function Sundial() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <div style={fontVars} className={cn("min-h-screen bg-[#f5f1e8] text-[#1b1810] antialiased", "selection:bg-[#b8841f]/25")}>
      <TopNav base={base} />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="docs" element={<Docs />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer base={base} />
    </div>
  )
}

export const meta: SiteMeta = {
  title: "Sundial — Cron you can actually read",
  description:
    "A developer tool for scheduled jobs: schedules as typed code, real timezones, retries with backoff, and a timeline you can trust. Featured interaction: a self-typing CLI terminal that types real sundial commands and reveals their output line-by-line, plus copy-to-clipboard code, magnetic CTAs, a cursor spotlight and animated counters.",
  date: "2026-06-24",
  type: "Dev-tool landing & docs",
  interaction: "Self-typing animated CLI terminal (cycles through deploy / watch / retry scenarios) + copy-to-clipboard code + magnetic CTAs + cursor spotlight",
  pages: ["Home", "Docs", "Pricing", "Changelog"],
}
