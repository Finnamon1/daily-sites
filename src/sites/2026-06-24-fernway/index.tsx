import { type ReactNode } from "react"
import { Routes, Route, useLocation, Link } from "react-router-dom"
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion"
import { Clock, Train, Ticket, Check, MapPin, Sprout } from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { TiltCard } from "@/components/fx/TiltCard"
import { Reveal } from "@/components/fx/Reveal"
import {
  N,
  DISPLAY,
  SERIF,
  SANS,
  MONO,
  Layout,
  SeasonProvider,
  SeasonSwitcher,
  useSeason,
  useBase,
  Eyebrow,
  ArrowLink,
  Counter,
  wrap,
} from "./shared"
import { GLASSHOUSES, EVENTS, STATS, TIERS } from "./data"

/* =========================================================================
   FEATURED INTERACTION — the SEASON SWITCHER
   A control in the header (and hero) re-themes the entire site: accent colour,
   the hero glasshouse's sky + foliage, the "in bloom now" panel, and the
   ordering/highlighting of events all crossfade to the chosen season. The
   choice lives in a context ABOVE <Routes>, so it survives navigation — pick
   winter on Home and you're still in winter on the Visit page. Colour is
   carried by CSS variables, so the morph is a cheap, GPU-friendly crossfade
   that stays smooth under reduced motion (the palette swaps, nothing leaps).
   ========================================================================= */

/* ---------------------------------------------------------------- hero scene */
function GlasshouseScene() {
  const reduce = useReducedMotion()
  const sway = (delay: number) =>
    reduce
      ? {}
      : {
          animate: { rotate: [-2.5, 2.5, -2.5] },
          transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay },
        }

  return (
    <svg viewBox="0 0 600 480" className="h-full w-full" role="img" aria-label="An illustrated Victorian glasshouse, themed to the current season">
      <defs>
        <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sky-a)" style={{ transition: "stop-color 600ms ease" }} />
          <stop offset="1" stopColor="var(--sky-b)" style={{ transition: "stop-color 600ms ease" }} />
        </linearGradient>
        <clipPath id="fw-glass">
          {/* matches the pavilion silhouette so foliage stays under the glass */}
          <path d="M150 430 V250 Q150 150 300 150 Q450 150 450 250 V430 Z" />
          <rect x="70" y="300" width="90" height="130" rx="6" />
          <rect x="440" y="300" width="90" height="130" rx="6" />
        </clipPath>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="600" height="480" fill="url(#fw-sky)" />

      {/* foliage under glass */}
      <g clipPath="url(#fw-glass)">
        <ellipse cx="300" cy="470" rx="200" ry="120" fill="var(--leaf)" opacity="0.9" style={{ transition: "fill 600ms ease" }} />
        <ellipse cx="180" cy="470" rx="120" ry="90" fill="var(--leaf)" opacity="0.7" style={{ transition: "fill 600ms ease" }} />
        <ellipse cx="430" cy="470" rx="120" ry="80" fill="var(--leaf)" opacity="0.8" style={{ transition: "fill 600ms ease" }} />
        {/* fern fronds, gently swaying */}
        {[
          { x: 240, h: 150, d: 0 },
          { x: 300, h: 185, d: 1.2 },
          { x: 360, h: 150, d: 2.1 },
        ].map((f, i) => (
          <motion.g key={i} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} {...sway(f.d)}>
            <path
              d={`M${f.x} 430 C ${f.x - 4} ${430 - f.h * 0.6}, ${f.x - 2} ${430 - f.h}, ${f.x} ${430 - f.h}`}
              stroke="var(--leaf)"
              strokeWidth="4"
              fill="none"
              opacity="0.95"
              style={{ transition: "stroke 600ms ease" }}
            />
            {Array.from({ length: 7 }).map((_, k) => {
              const t = (k + 1) / 8
              const ly = 430 - f.h * t
              const lw = 16 * (1 - t) + 5
              return (
                <g key={k}>
                  <path d={`M${f.x} ${ly} q ${-lw} ${-5} ${-lw} ${6}`} stroke="var(--leaf)" strokeWidth="2.5" fill="none" style={{ transition: "stroke 600ms ease" }} />
                  <path d={`M${f.x} ${ly} q ${lw} ${-5} ${lw} ${6}`} stroke="var(--leaf)" strokeWidth="2.5" fill="none" style={{ transition: "stroke 600ms ease" }} />
                </g>
              )
            })}
          </motion.g>
        ))}
        {/* blossoms in the season accent */}
        {[
          [210, 360],
          [255, 320],
          [345, 330],
          [390, 370],
          [300, 300],
        ].map(([cx, cy], i) => (
          <motion.g key={i} {...(reduce ? {} : { animate: { scale: [0.9, 1.08, 0.9] }, transition: { duration: 5, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" as const } })} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx={cx + Math.cos((a * Math.PI) / 180) * 7}
                cy={cy + Math.sin((a * Math.PI) / 180) * 7}
                rx="4.5"
                ry="7"
                fill="var(--accent)"
                opacity="0.95"
                transform={`rotate(${a} ${cx} ${cy})`}
                style={{ transition: "fill 600ms ease" }}
              />
            ))}
            <circle cx={cx} cy={cy} r="3" fill="var(--sky-a)" style={{ transition: "fill 600ms ease" }} />
          </motion.g>
        ))}
      </g>

      {/* iron frame */}
      <g stroke={N.ink} fill="none" strokeWidth="2.2" strokeLinecap="round">
        {/* main pavilion */}
        <path d="M150 430 V250 Q150 150 300 150 Q450 150 450 250 V430" />
        {/* glazing mullions */}
        {[180, 210, 240, 270, 300, 330, 360, 390, 420].map((x) => (
          <line key={x} x1={x} y1="430" x2={x} y2={x === 300 ? 150 : 215} strokeWidth="1" opacity="0.55" />
        ))}
        {/* arch ribs */}
        <path d="M165 250 Q165 165 300 165 Q435 165 435 250" strokeWidth="1" opacity="0.55" />
        <path d="M150 250 H450" strokeWidth="1.4" opacity="0.7" />
        <path d="M150 320 H450" strokeWidth="1" opacity="0.4" />
        {/* cupola */}
        <path d="M278 150 V120 H322 V150" />
        <path d="M270 120 H330" />
        <line x1="300" y1="120" x2="300" y2="100" />
        <circle cx="300" cy="96" r="4" fill={N.ink} />
        {/* side wings */}
        <rect x="70" y="300" width="90" height="130" rx="6" />
        <rect x="440" y="300" width="90" height="130" rx="6" />
        {[100, 130].map((x) => (
          <line key={x} x1={x} y1="300" x2={x} y2="430" strokeWidth="1" opacity="0.5" />
        ))}
        {[470, 500].map((x) => (
          <line key={x} x1={x} y1="300" x2={x} y2="430" strokeWidth="1" opacity="0.5" />
        ))}
        {/* base / ground */}
        <line x1="40" y1="430" x2="560" y2="430" strokeWidth="2.6" />
      </g>

      {/* drifting particles (pollen in light seasons, kept subtle) */}
      {!reduce &&
        [
          { x: 120, y: 200, d: 0 },
          { x: 470, y: 170, d: 1.5 },
          { x: 350, y: 120, d: 3 },
          { x: 220, y: 150, d: 2.2 },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="var(--accent)"
            opacity="0.5"
            style={{ transition: "fill 600ms ease" }}
            animate={{ y: [0, 24, 0], x: [0, 10, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" as const, delay: p.d }}
          />
        ))}
    </svg>
  )
}

/* ---------------------------------------------------------------- shared bits */
function Photo({ seed, alt, ratio = "4/3", className = "" }: { seed: string; alt: string; ratio?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] ${className}`} style={{ background: N.paper2, aspectRatio: ratio }}>
      <img
        src={`https://picsum.photos/seed/${seed}/900/720`}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ filter: "saturate(0.92) contrast(1.02)" }}
      />
      <div aria-hidden className="absolute inset-0 transition-colors duration-500" style={{ background: "var(--accent)", mixBlendMode: "overlay", opacity: 0.16 }} />
      <div aria-hidden className="absolute inset-0 rounded-[18px] ring-1 ring-inset" style={{ ["--tw-ring-color" as string]: "rgba(25,35,27,0.12)" }} />
    </div>
  )
}

function SectionTitle({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div>
      <Eyebrow>{kicker}</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, color: N.ink }} className="mt-4 text-balance text-[34px] font-medium leading-[1.05] tracking-tight sm:text-[42px]">
        {children}
      </h2>
    </div>
  )
}

/* ============================================================ HOME */
function Home() {
  const base = useBase()
  const { season } = useSeason()

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 transition-colors duration-700" style={{ background: "radial-gradient(120% 80% at 78% 0%, var(--accent-soft), transparent 60%)" }} />
        <div className={`${wrap} relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20`}>
          <div>
            <div className="flex items-center gap-3">
              <Eyebrow>{season.name} · {season.months}</Eyebrow>
            </div>
            <h1 style={{ fontFamily: DISPLAY, color: N.ink }} className="mt-5 text-balance text-[44px] font-medium leading-[0.98] tracking-tight sm:text-[60px] lg:text-[66px]">
              {season.mood}
            </h1>
            <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-6 max-w-lg text-[18px] leading-relaxed">
              {season.blurb}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Magnetic>
                <Link
                  to={`${base}/visit`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium outline-none transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: "var(--accent-ink)", color: N.paper, fontFamily: SANS, ["--tw-ring-color" as string]: "var(--accent-ink)", ["--tw-ring-offset-color" as string]: N.paper }}
                >
                  <Ticket className="h-4 w-4" /> Plan your visit
                </Link>
              </Magnetic>
              <ArrowLink to={`${base}/whats-on`}>See what's on this {season.name.toLowerCase()}</ArrowLink>
            </div>
            <div className="mt-9 flex items-center gap-3">
              <span className="text-[12px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: N.inkSoft }}>
                Visit in
              </span>
              <SeasonSwitcher />
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[26px] border" style={{ borderColor: N.line }}>
              <GlasshouseScene />
            </div>
            <BloomCard />
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="border-y" style={{ borderColor: N.line, background: N.paper2 }}>
        <div className={`${wrap} grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4`}>
          {STATS.map((s) => (
            <div key={s.label} className="px-2">
              <div style={{ fontFamily: DISPLAY, color: N.ink }} className="text-[40px] font-medium leading-none tracking-tight">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[12.5px] leading-snug" style={{ fontFamily: SANS, color: N.inkSoft }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* glasshouse preview */}
      <section className={`${wrap} py-20`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle kicker="Six houses, six climates">
            From dripping tropics to high, cold scree —<br className="hidden sm:block" /> all within a morning's stroll.
          </SectionTitle>
          <ArrowLink to={`${base}/glasshouses`}>Tour all six</ArrowLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {GLASSHOUSES.slice(0, 3).map((g, i) => (
            <Reveal key={g.name} delay={i * 0.08}>
              <TiltCard className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-[18px] border" style={{ borderColor: N.line, background: N.paper }}>
                  <Photo seed={g.seed} alt={`Inside ${g.name}`} ratio="5/4" className="rounded-b-none" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 style={{ fontFamily: DISPLAY, color: N.ink }} className="text-[21px] font-medium tracking-tight">
                        {g.name}
                      </h3>
                      <span className="text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: N.inkSoft }}>
                        {g.est}
                      </span>
                    </div>
                    <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-2 text-[14.5px] leading-relaxed">
                      {g.blurb}
                    </p>
                    <div className="mt-4 flex items-center gap-2 pt-1">
                      <Chip>{g.climate}</Chip>
                      <Chip>{g.temp}</Chip>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* pull quote */}
      <section className="border-y" style={{ borderColor: N.line }}>
        <div className={`${wrap} py-20`}>
          <Reveal>
            <p style={{ fontFamily: DISPLAY, color: N.ink }} className="max-w-4xl text-balance text-[28px] font-medium leading-[1.25] tracking-tight sm:text-[38px]">
              “A glasshouse is just a way of borrowing another country's weather.{" "}
              <span className="transition-colors duration-500" style={{ color: "var(--accent-ink)" }}>We borrow six.</span>”
            </p>
            <div className="mt-6 flex items-center gap-3 text-[13px]" style={{ fontFamily: SANS, color: N.inkSoft }}>
              <Sprout className="h-4 w-4" style={{ color: "var(--accent-ink)" }} />
              Wren Alderley, Head of Living Collections
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

function BloomCard() {
  const { season } = useSeason()
  return (
    <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border p-4 shadow-[0_18px_40px_-24px_rgba(25,35,27,0.5)] backdrop-blur sm:left-auto sm:right-6 sm:w-[300px]" style={{ borderColor: N.line, background: "rgba(244,241,231,0.92)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] transition-colors duration-500" style={{ fontFamily: MONO, color: "var(--accent-ink)" }}>
          In bloom now
        </span>
        <span className="h-2 w-2 animate-pulse rounded-full transition-colors duration-500" style={{ background: "var(--accent)" }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.ul
          key={season.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28 }}
          className="mt-3 space-y-2.5"
        >
          {season.bloom.map((b) => (
            <li key={b.name} className="flex items-baseline justify-between gap-3 border-b pb-2 last:border-0 last:pb-0" style={{ borderColor: N.line }}>
              <div>
                <div style={{ fontFamily: SANS, color: N.ink }} className="text-[13.5px] font-medium leading-tight">
                  {b.name}
                </div>
                <div style={{ fontFamily: SERIF, color: N.inkSoft }} className="text-[12px] italic">
                  {b.latin}
                </div>
              </div>
              <span className="shrink-0 text-[10.5px] uppercase tracking-[0.12em]" style={{ fontFamily: MONO, color: N.inkSoft }}>
                {b.where}
              </span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-500"
      style={{ fontFamily: MONO, background: "var(--accent-soft)", color: "var(--accent-ink)" }}
    >
      {children}
    </span>
  )
}

function CtaBand() {
  const base = useBase()
  return (
    <section style={{ background: N.ink }}>
      <div className={`${wrap} grid items-center gap-8 py-16 md:grid-cols-[1.4fr_1fr]`}>
        <div>
          <h2 style={{ fontFamily: DISPLAY, color: N.paper }} className="text-balance text-[32px] font-medium leading-[1.05] tracking-tight sm:text-[40px]">
            Become a Friend, and the garden's yours all year.
          </h2>
          <p style={{ fontFamily: SERIF, color: "rgba(244,241,231,0.72)" }} className="mt-4 max-w-md text-[16px] leading-relaxed">
            Unlimited entry across every season, a guest each visit, and the first word on members' evenings. It pays for
            itself by your sixth walk.
          </p>
        </div>
        <div className="flex md:justify-end">
          <Magnetic>
            <Link
              to={`${base}/visit`}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold outline-none transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#19231B]"
              style={{ background: N.paper, color: "var(--accent-ink)", fontFamily: SANS, ["--tw-ring-color" as string]: N.paper }}
            >
              See membership <Check className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

/* ============================================================ GLASSHOUSES */
function Glasshouses() {
  return (
    <div className={`${wrap} py-16`}>
      <div className="max-w-2xl">
        <Eyebrow>The collection</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY, color: N.ink }} className="mt-4 text-[44px] font-medium leading-[1] tracking-tight sm:text-[56px]">
          Six glasshouses, kept at six different weathers.
        </h1>
        <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-5 text-[18px] leading-relaxed">
          Each house holds a climate the city outside could never grow. Walk them in any order — though most people go
          tropics-first, and end somewhere cool.
        </p>
      </div>

      <div className="mt-14 space-y-5">
        {GLASSHOUSES.map((g, i) => (
          <Reveal key={g.name} delay={(i % 2) * 0.06}>
            <article className="grid items-stretch gap-6 rounded-[22px] border p-3 md:grid-cols-2" style={{ borderColor: N.line, background: i % 2 ? N.paper2 : N.paper }}>
              <TiltCard className={i % 2 ? "md:order-2" : ""}>
                <Photo seed={g.seed} alt={`Inside ${g.name}, a ${g.climate.toLowerCase()} glasshouse`} ratio="16/10" />
              </TiltCard>
              <div className="flex flex-col justify-center p-4 md:p-7">
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: MONO, color: "var(--accent-ink)" }} className="text-[12px] uppercase tracking-[0.18em] transition-colors duration-500">
                    No. {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1" style={{ background: N.line }} />
                  <span style={{ fontFamily: MONO, color: N.inkSoft }} className="text-[12px] uppercase tracking-[0.14em]">
                    Built {g.est}
                  </span>
                </div>
                <h2 style={{ fontFamily: DISPLAY, color: N.ink }} className="mt-3 text-[30px] font-medium tracking-tight">
                  {g.name}
                </h2>
                <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-3 text-[15.5px] leading-relaxed">
                  {g.blurb}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Chip>{g.climate}</Chip>
                  <Chip>Held at {g.temp}</Chip>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ============================================================ WHAT'S ON */
function WhatsOn() {
  const { season } = useSeason()
  // current-season events float to the top and get the "this season" treatment
  const ordered = [...EVENTS].sort((a, b) => Number(b.season === season.key) - Number(a.season === season.key))

  return (
    <div className={`${wrap} py-16`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>The calendar</Eyebrow>
          <h1 style={{ fontFamily: DISPLAY, color: N.ink }} className="mt-4 text-[44px] font-medium leading-[1] tracking-tight sm:text-[56px]">
            What's on at Fernway.
          </h1>
          <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-5 text-[18px] leading-relaxed">
            Switch the season to see what's coming up — {season.name.toLowerCase()}'s programme is pulled to the top.
          </p>
        </div>
        <SeasonSwitcher />
      </div>

      <div className="mt-12 grid gap-4">
        <AnimatePresence mode="popLayout">
          {ordered.map((e) => {
            const now = e.season === season.key
            return (
              <motion.article
                layout
                key={e.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, layout: { duration: 0.4 } }}
                className="grid items-center gap-4 rounded-2xl border p-5 sm:grid-cols-[140px_1fr_auto]"
                style={{
                  borderColor: now ? "var(--accent)" : N.line,
                  background: now ? "var(--accent-soft)" : N.paper,
                }}
              >
                <div>
                  <div style={{ fontFamily: DISPLAY, color: N.ink }} className="text-[20px] font-medium leading-tight tracking-tight">
                    {e.when}
                  </div>
                  <div style={{ fontFamily: MONO, color: N.inkSoft }} className="mt-1 text-[11.5px] uppercase tracking-[0.14em]">
                    {e.time}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 style={{ fontFamily: SANS, color: N.ink }} className="text-[17px] font-semibold">
                      {e.title}
                    </h3>
                    {now && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500" style={{ fontFamily: MONO, background: "var(--accent-ink)", color: N.paper }}>
                        This {season.name.toLowerCase()}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed">
                    {e.blurb}
                  </p>
                </div>
                <span className="justify-self-start text-[11px] uppercase tracking-[0.16em] sm:justify-self-end" style={{ fontFamily: MONO, color: "var(--accent-ink)" }}>
                  {e.kind}
                </span>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ============================================================ VISIT */
function Visit() {
  const facts = [
    { icon: Clock, label: "Opening hours", lines: ["Every day 09:00 – dusk", "Closed 25 December only"] },
    { icon: Train, label: "Getting here", lines: ["Marsh Lane, EX4 9QT", "8 min walk from Polsloe rail"] },
    { icon: MapPin, label: "On arrival", lines: ["Café & shop by the gate", "Step-free across the grounds"] },
  ]
  return (
    <div className={`${wrap} py-16`}>
      <div className="max-w-2xl">
        <Eyebrow>Plan a visit</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY, color: N.ink }} className="mt-4 text-[44px] font-medium leading-[1] tracking-tight sm:text-[56px]">
          Open every day, in every weather.
        </h1>
        <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-5 text-[18px] leading-relaxed">
          The glasshouses are best on a grey day, when the rest of the city is indoors and the warmth feels stolen.
          Here's everything you need to come and see for yourself.
        </p>
      </div>

      {/* facts */}
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {facts.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.07}>
            <div className="h-full rounded-2xl border p-6" style={{ borderColor: N.line, background: N.paper2 }}>
              <f.icon className="h-5 w-5 transition-colors duration-500" style={{ color: "var(--accent-ink)" }} />
              <div style={{ fontFamily: MONO, color: N.inkSoft }} className="mt-4 text-[11px] uppercase tracking-[0.18em]">
                {f.label}
              </div>
              {f.lines.map((l) => (
                <div key={l} style={{ fontFamily: SANS, color: N.ink }} className="mt-1.5 text-[15px]">
                  {l}
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {/* membership */}
      <div className="mt-20">
        <SectionTitle kicker="Tickets & membership">Pay once, or join and never pay at the gate again.</SectionTitle>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <div
                className="flex h-full flex-col rounded-[20px] border p-7"
                style={{
                  borderColor: t.featured ? "var(--accent)" : N.line,
                  background: t.featured ? "var(--accent-soft)" : N.paper,
                  borderWidth: t.featured ? 2 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 style={{ fontFamily: DISPLAY, color: N.ink }} className="text-[23px] font-medium tracking-tight">
                    {t.name}
                  </h3>
                  {t.featured && (
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500" style={{ fontFamily: MONO, background: "var(--accent-ink)", color: N.paper }}>
                      Most join this
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span style={{ fontFamily: DISPLAY, color: N.ink }} className="text-[40px] font-medium leading-none tracking-tight">
                    {t.price}
                  </span>
                  <span style={{ fontFamily: SANS, color: N.inkSoft }} className="text-[13px]">
                    {t.cadence}
                  </span>
                </div>
                <p style={{ fontFamily: SERIF, color: N.inkSoft }} className="mt-3 text-[14.5px] leading-relaxed">
                  {t.blurb}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[14px]" style={{ fontFamily: SANS, color: N.ink }}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0 transition-colors duration-500" style={{ color: "var(--accent-ink)" }} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Magnetic>
                  <button
                    className="mt-7 w-full rounded-full px-5 py-3 text-[14px] font-medium outline-none transition-colors duration-500 focus-visible:ring-2"
                    style={
                      t.featured
                        ? { background: "var(--accent-ink)", color: N.paper, fontFamily: SANS, ["--tw-ring-color" as string]: N.ink }
                        : { background: N.ink, color: N.paper, fontFamily: SANS, ["--tw-ring-color" as string]: "var(--accent-ink)" }
                    }
                  >
                    {t.name === "Day Ticket" ? "Buy a ticket" : "Join Fernway"}
                  </button>
                </Magnetic>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================ shell */
function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}>
      {children}
    </motion.div>
  )
}

export default function Fernway() {
  return (
    <SeasonProvider>
      <MotionConfig reducedMotion="user">
        <Layout>
          <Page>
            <Routes>
              <Route index element={<Home />} />
              <Route path="glasshouses" element={<Glasshouses />} />
              <Route path="whats-on" element={<WhatsOn />} />
              <Route path="visit" element={<Visit />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Page>
        </Layout>
      </MotionConfig>
    </SeasonProvider>
  )
}

export const meta: SiteMeta = {
  title: "Fernway — a Victorian glasshouse botanic garden",
  description:
    "A botanic garden visitor site that re-themes itself by season — palette, hero glasshouse, blooms and events all morph when you switch from spring to winter.",
  date: "2026-06-24",
  type: "Botanic garden / visitor attraction",
  interaction: "Season switcher that morphs the whole site's palette, hero illustration & content (persisted above Routes)",
  pages: ["Home", "Glasshouses", "What's On", "Visit"],
}
