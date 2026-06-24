import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  ArrowUpRight,
  Cable,
  Check,
  CircleDot,
  Minus,
  Plus,
  Power,
  Sliders,
  Waves,
} from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { Spotlight } from "@/components/fx/Spotlight"
import { TiltCard } from "@/components/fx/TiltCard"

/* ------------------------------------------------------------------ tokens */

const C = {
  bg: "#15120D",
  bg2: "#1B160F",
  surface: "#221C14",
  raised: "#2A2319",
  line: "rgba(244,237,225,0.10)",
  ink: "#F4EDE1",
  mute: "#AEA290",
  faint: "#9A8D78",
  amber: "#F0A23B",
  amberSoft: "#F6C079",
  amberDeep: "#C9762A",
  scope: "#6FE6C2",
}

const DISPLAY = "'Syne', system-ui, sans-serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

/* --------------------------------------------------------- blob path maths */

function smoothClosedPath(pts: Array<[number, number]>): string {
  const n = pts.length
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  return d + " Z"
}

function blobFrames(cx: number, cy: number, baseR: number, sets: number[][]): string[] {
  const n = sets[0].length
  return sets.map((radii) => {
    const pts = radii.map((r, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2
      return [cx + Math.cos(a) * baseR * r, cy + Math.sin(a) * baseR * r] as [number, number]
    })
    return smoothClosedPath(pts)
  })
}

const R_SETS_A = [
  [1.0, 0.82, 1.06, 0.78, 1.0, 0.9, 1.08, 0.8],
  [0.86, 1.07, 0.8, 1.05, 0.9, 1.1, 0.82, 1.02],
  [1.09, 0.78, 1.0, 0.9, 1.07, 0.8, 1.03, 0.93],
  [0.9, 1.0, 0.93, 1.09, 0.8, 1.02, 0.95, 1.07],
]
const R_SETS_B = [
  [1.05, 0.9, 0.82, 1.08, 0.86, 1.0, 0.92, 1.04],
  [0.82, 1.05, 0.95, 0.84, 1.08, 0.9, 1.06, 0.86],
  [1.0, 0.84, 1.08, 0.92, 0.82, 1.06, 0.88, 1.04],
]

/* ------------------------------------------------------------ oscilloscope */

function scopePath(seed: number, w: number, h: number, samples = 56): string {
  const mid = h / 2
  let d = ""
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const x = t * w
    const y =
      mid +
      Math.sin(t * Math.PI * (4 + (seed % 5))) * (h * 0.3) * Math.sin(t * Math.PI + seed) +
      Math.sin(t * Math.PI * (9 + (seed % 3))) * (h * 0.12)
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

function Scope({ seed, color = C.scope }: { seed: number; color?: string }) {
  const reduce = useReducedMotion()
  const d = useMemo(() => scopePath(seed, 240, 64), [seed])
  return (
    <svg viewBox="0 0 240 64" className="h-16 w-full" preserveAspectRatio="none" aria-hidden>
      <line x1="0" y1="32" x2="240" y2="32" stroke={C.line} strokeWidth="1" />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0, opacity: 0.4 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
    </svg>
  )
}

/* ----------------------------------------------- featured: living oscillator */

function Oscillator() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const nx = useMotionValue(0.5)
  const ny = useMotionValue(0.5)
  const sx = useSpring(nx, { stiffness: 70, damping: 18 })
  const sy = useSpring(ny, { stiffness: 70, damping: 18 })

  // parallax translation for the two blob layers
  const x1 = useTransform(sx, [0, 1], [22, -22])
  const y1 = useTransform(sy, [0, 1], [18, -18])
  const x2 = useTransform(sx, [0, 1], [-30, 30])
  const y2 = useTransform(sy, [0, 1], [-24, 24])

  // cursor-reactive gradient centre
  const gx = useTransform(sx, [0, 1], [30, 70])
  const gy = useTransform(sy, [0, 1], [30, 70])
  const grad = useMotionTemplate`radial-gradient(60% 60% at ${gx}% ${gy}%, rgba(240,162,59,0.22), transparent 70%)`

  const framesA = useMemo(() => blobFrames(220, 220, 150, R_SETS_A), [])
  const framesB = useMemo(() => blobFrames(220, 220, 120, R_SETS_B), [])
  const framesHi = useMemo(() => blobFrames(190, 185, 62, R_SETS_B), [])

  const scopeLine = useMemo(() => scopePath(2, 440, 440, 90), [])

  function move(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    nx.set((e.clientX - r.left) / r.width)
    ny.set((e.clientY - r.top) / r.height)
  }
  function reset() {
    nx.set(0.5)
    ny.set(0.5)
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className="relative aspect-square w-full select-none"
      role="img"
      aria-label="A living oscillator: organic blobs that morph and follow the cursor like a synthesized voice."
    >
      <motion.div aria-hidden className="absolute inset-0 rounded-full blur-2xl" style={{ background: grad }} />
      <svg viewBox="0 0 440 440" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="osc-a" cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor={C.amberSoft} />
            <stop offset="55%" stopColor={C.amber} />
            <stop offset="100%" stopColor={C.amberDeep} />
          </radialGradient>
          <radialGradient id="osc-b" cx="60%" cy="65%" r="80%">
            <stop offset="0%" stopColor="#3A2E1E" />
            <stop offset="100%" stopColor="#1C160E" />
          </radialGradient>
          <filter id="osc-soft">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* back blob — deep, blurred */}
        <motion.g style={{ x: x2, y: y2 }}>
          <motion.path
            d={framesB[0]}
            fill="url(#osc-b)"
            filter="url(#osc-soft)"
            opacity={0.9}
            animate={reduce ? undefined : { d: [...framesB, framesB[0]] }}
            transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.g>

        {/* front blob — molten accent */}
        <motion.g style={{ x: x1, y: y1 }}>
          <motion.path
            d={framesA[0]}
            fill="url(#osc-a)"
            animate={reduce ? undefined : { d: [...framesA, framesA[0]] }}
            transition={{ duration: 11, ease: "easeInOut", repeat: Infinity }}
          />
          {/* inner highlight */}
          <motion.path
            d={framesHi[0]}
            fill="rgba(255,255,255,0.18)"
            animate={reduce ? undefined : { d: [...framesHi, framesHi[0]] }}
            transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.g>

        {/* oscilloscope filament threading through */}
        <motion.path
          d={scopeLine}
          fill="none"
          stroke={C.scope}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={0.55}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  )
}

/* ----------------------------------------------------------- count-up bits */

function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    let raf = 0
    let start = 0
    const dur = 1300
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, reduce])

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/* --------------------------------------------------------------- marquee */

function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const track = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y" style={{ borderColor: C.line }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{ background: `linear-gradient(90deg, ${C.bg}, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{ background: `linear-gradient(270deg, ${C.bg}, transparent)` }}
      />
      <motion.div
        className="flex w-max gap-10 py-4"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        {track.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span style={{ fontFamily: MONO, color: C.mute }} className="text-[13px] uppercase tracking-[0.18em]">
              {t}
            </span>
            <CircleDot size={9} style={{ color: C.amber }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ---------------------------------------------------------- small helpers */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontFamily: MONO, color: C.amber }} className="text-[12px] uppercase tracking-[0.28em]">
      {children}
    </span>
  )
}

function Btn({
  children,
  variant = "solid",
  ...rest
}: {
  children: ReactNode
  variant?: "solid" | "ghost"
} & React.ComponentProps<"button">) {
  const solid = variant === "solid"
  return (
    <button
      {...rest}
      style={{
        fontFamily: BODY,
        background: solid ? C.amber : "transparent",
        color: solid ? "#1A1308" : C.ink,
        borderColor: solid ? "transparent" : C.line,
      }}
      className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[14px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
    >
      {children}
    </button>
  )
}

function DuotoneImage({
  seed,
  alt,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  seed: string
  alt: string
  className?: string
  ratio?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border ${ratio} ${className}`} style={{ borderColor: C.line }}>
      <img
        src={`https://picsum.photos/seed/${seed}/900/700`}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover grayscale"
        width={900}
        height={700}
      />
      <div aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ background: "hsl(33 78% 40%)" }} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, transparent 40%, ${C.bg} 100%)`, opacity: 0.7 }}
      />
    </div>
  )
}

/* ============================================================ shared layout */

const PATCHES = [
  "Sodium Bloom",
  "Tape Choir",
  "Glass Sub",
  "Wax Lead",
  "Field Static",
  "Iron Pad",
  "Hollow Bell",
  "Drift Bass",
]

function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

function Nav() {
  const base = useBase()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const links: Array<[string, string, boolean]> = [
    ["", "Home", true],
    ["instrument", "Instrument", false],
    ["sounds", "Sounds", false],
    ["story", "Story", false],
    ["order", "Order", false],
  ]
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ borderColor: C.line, background: "rgba(21,18,13,0.78)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <NavLink to={base} end className="flex items-center gap-2.5">
          <svg viewBox="0 0 40 24" className="h-5 w-8" aria-hidden>
            <path
              d={scopePath(1, 40, 24, 24)}
              fill="none"
              stroke={C.amber}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontFamily: DISPLAY, color: C.ink }} className="text-lg font-extrabold tracking-tight">
            OSCINE
          </span>
        </NavLink>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([to, label, end]) => (
            <NavLink
              key={label}
              to={to ? `${base}/${to}` : base}
              end={end}
              style={{ fontFamily: BODY }}
              className={({ isActive }) =>
                `text-[14px] transition-colors duration-200 ${isActive ? "" : "hover:opacity-100"}`
              }
            >
              {({ isActive }) => (
                <span
                  className="relative"
                  style={{ color: isActive ? C.ink : C.mute }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                      style={{ background: C.amber }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
          <Magnetic strength={0.2}>
            <Btn onClick={() => navigate(`${base}/order`)}>
              Reserve <ArrowUpRight size={16} />
            </Btn>
          </Magnetic>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
          style={{ color: C.ink }}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <Minus /> : <Sliders size={22} />}
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
            style={{ borderColor: C.line }}
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {links.map(([to, label, end]) => (
                <NavLink
                  key={label}
                  to={to ? `${base}/${to}` : base}
                  end={end}
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: BODY, color: C.ink }}
                  className="py-2 text-[15px]"
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  const base = useBase()
  return (
    <footer className="border-t" style={{ borderColor: C.line, background: C.bg2 }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div style={{ fontFamily: DISPLAY, color: C.ink }} className="text-2xl font-extrabold">
            OSCINE
          </div>
          <p style={{ fontFamily: BODY, color: C.mute }} className="mt-3 max-w-xs text-sm leading-relaxed">
            Hand-built analog instruments from a small workshop in Porto. Eight voices, no menus, no apologies.
          </p>
          <p style={{ fontFamily: MONO, color: C.faint }} className="mt-6 text-[11px] uppercase tracking-[0.2em]">
            Rua das Flores 88 · Porto
          </p>
        </div>
        <div>
          <div style={{ fontFamily: MONO, color: C.faint }} className="text-[11px] uppercase tracking-[0.2em]">
            Explore
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {[
              ["instrument", "The Instrument"],
              ["sounds", "Sound Library"],
              ["story", "Our Story"],
              ["order", "Reserve a Unit"],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={`${base}/${to}`}
                style={{ fontFamily: BODY, color: C.mute }}
                className="text-sm transition-colors hover:opacity-80"
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: MONO, color: C.faint }} className="text-[11px] uppercase tracking-[0.2em]">
            Signal
          </div>
          <div className="mt-4 flex flex-col gap-2" style={{ fontFamily: BODY, color: C.mute }}>
            <span className="text-sm">hello@oscine.audio</span>
            <span className="text-sm">+351 22 000 0000</span>
            <span className="text-sm">Workshop tours by appointment</span>
          </div>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: C.line }}>
        <div
          className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-5 py-5 sm:flex-row sm:items-center sm:px-8"
          style={{ fontFamily: MONO, color: C.faint }}
        >
          <span className="text-[11px] uppercase tracking-[0.2em]">© 2026 Oscine Instruments Lda.</span>
          <span className="text-[11px] uppercase tracking-[0.2em]">Built to last twenty years</span>
        </div>
      </div>
    </footer>
  )
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY }} className="min-h-screen">
      <Nav />
      {children}
      <Footer />
    </div>
  )
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

/* ===================================================================== HOME */

function Home() {
  const base = useBase()
  const navigate = useNavigate()
  return (
    <Page>
      {/* hero */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>OSCINE FIELD · 8-voice analog</Eyebrow>
            <h1
              style={{ fontFamily: DISPLAY }}
              className="mt-5 text-[clamp(2.6rem,6.5vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]"
            >
              A synthesizer<br />
              that breathes<br />
              <span style={{ color: C.amber }}>back at you.</span>
            </h1>
            <p style={{ color: C.mute }} className="mt-6 max-w-md text-[17px] leading-relaxed">
              Field is an eight-voice analog desktop synthesizer with one knob per function and
              nothing hidden in a screen. Every voice drifts a little — like a choir that never
              quite agrees, which is exactly the point.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Btn onClick={() => navigate(`${base}/order`)}>
                  Reserve a unit — €1,490 <ArrowUpRight size={16} />
                </Btn>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Btn variant="ghost" onClick={() => navigate(`${base}/sounds`)}>
                  <Waves size={16} /> Hear it
                </Btn>
              </Magnetic>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <Oscillator />
            <p
              style={{ fontFamily: MONO, color: C.faint }}
              className="mt-1 text-center text-[11px] uppercase tracking-[0.2em]"
            >
              move your cursor — the voice follows
            </p>
          </div>
        </div>
      </section>

      <Marquee items={PATCHES} />

      {/* spec strip */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-3" style={{ borderColor: C.line, background: C.line }}>
          {[
            { n: <Counter to={8} />, l: "Analog voices", s: "true paraphony, no DSP" },
            { n: <><Counter to={3} />×</>, l: "Oscillators / voice", s: "sawtooth · pulse · sub" },
            { n: <Counter to={24} />, l: "Knobs, one per job", s: "nothing buried in menus" },
          ].map((x, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ background: C.bg }} className="h-full p-8">
                <div style={{ fontFamily: DISPLAY, color: C.amber }} className="text-5xl font-extrabold">
                  {x.n}
                </div>
                <div style={{ fontFamily: BODY }} className="mt-3 text-[15px] font-semibold">
                  {x.l}
                </div>
                <div style={{ color: C.mute }} className="mt-1 text-sm">
                  {x.s}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* three pillars */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <Eyebrow>The idea</Eyebrow>
              <h2 style={{ fontFamily: DISPLAY }} className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                We left the imperfections in.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-1" style={{ borderColor: C.line, background: C.line }}>
            {[
              {
                icon: <Power size={18} />,
                t: "Warm-up character",
                d: "Field needs ninety seconds to settle. Tracking drifts as it warms, then locks. That window is where the magic lives.",
              },
              {
                icon: <Sliders size={18} />,
                t: "One knob, one job",
                d: "Twenty-four controls, each doing exactly one thing. No shift layers, no sub-menus. Your hands learn it in an afternoon.",
              },
              {
                icon: <Cable size={18} />,
                t: "Patch it anywhere",
                d: "Sixteen patch points on the back. Break the normalled signal path and route the voice however you hear it.",
              },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div style={{ background: C.bg }} className="flex gap-4 p-7">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                    style={{ background: C.surface, color: C.amber }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: DISPLAY }} className="text-lg font-bold">
                      {p.t}
                    </h3>
                    <p style={{ color: C.mute }} className="mt-1.5 text-[15px] leading-relaxed">
                      {p.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-5 pb-24 sm:px-8">
        <Spotlight
          color="rgba(240,162,59,0.16)"
          className="mx-auto max-w-6xl rounded-3xl p-10 sm:p-16"
        >
          <div
            style={{ background: C.bg2, borderColor: C.line }}
            className="absolute inset-0 -z-10 rounded-3xl border"
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <h2 style={{ fontFamily: DISPLAY }} className="text-3xl font-extrabold leading-tight sm:text-5xl">
                Built in batches of forty.
              </h2>
              <p style={{ color: C.mute }} className="mt-4 max-w-md text-[16px] leading-relaxed">
                Each Field is assembled and calibrated by hand. The spring run is nearly gone —
                reserve now to hold a unit from batch seven.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Magnetic>
                <Btn onClick={() => navigate(`${base}/order`)}>
                  Reserve from batch 07 <ArrowUpRight size={16} />
                </Btn>
              </Magnetic>
            </div>
          </div>
        </Spotlight>
      </section>
    </Page>
  )
}

/* =============================================================== INSTRUMENT */

const SPECS: Array<[string, string]> = [
  ["Architecture", "8-voice analog, true paraphonic"],
  ["Oscillators", "3 per voice — saw, variable pulse, sub"],
  ["Filter", "24 dB/oct ladder, self-oscillating"],
  ["Envelopes", "Two DADSR, loopable"],
  ["LFOs", "Three, audio-rate, free or tempo-synced"],
  ["Patch bay", "16 points, 3.5 mm"],
  ["Connectivity", "MIDI DIN + USB-C + CV/Gate"],
  ["Build", "Powder-coated steel, walnut cheeks"],
  ["Power", "12 V DC, 1 A — external supply"],
  ["Weight", "3.4 kg"],
]

function SignalFlow() {
  const reduce = useReducedMotion()
  const nodes = [
    { x: 40, label: "OSC" },
    { x: 150, label: "MIX" },
    { x: 260, label: "VCF" },
    { x: 370, label: "VCA" },
    { x: 480, label: "OUT" },
  ]
  return (
    <svg viewBox="0 0 540 120" className="w-full" role="img" aria-label="Signal flow: oscillators into mixer, filter, amplifier, output.">
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.amber} />
        </marker>
      </defs>
      {nodes.slice(0, -1).map((n, i) => (
        <motion.line
          key={i}
          x1={n.x + 32}
          y1={60}
          x2={nodes[i + 1].x - 4}
          y2={60}
          stroke={C.amber}
          strokeWidth="1.6"
          markerEnd="url(#arr)"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.18 }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.g
          key={n.label}
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.18 }}
        >
          <rect x={n.x - 4} y={40} width={40} height={40} rx={8} fill={C.surface} stroke={C.line} />
          <text
            x={n.x + 16}
            y={64}
            textAnchor="middle"
            fill={C.ink}
            style={{ fontFamily: MONO, fontSize: 11 }}
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}

function Instrument() {
  const features = [
    { t: "Ladder filter", d: "A four-pole transistor ladder that screams when you push it and self-oscillates into a pure sine. The heart of the Field sound." },
    { t: "Per-voice drift", d: "Each of the eight voices is tuned to wander by a few cents. Stack them and the chorus is real, not an effect." },
    { t: "Audio-rate LFOs", d: "Three modulators that reach into audio rate — cross-modulate the oscillators for metallic, bell-like timbres." },
    { t: "Loopable envelopes", d: "Set the DADSR to loop and it becomes a fourth LFO with a shape you draw by ear." },
  ]
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <Eyebrow>The instrument</Eyebrow>
        <div className="mt-5 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <h1 style={{ fontFamily: DISPLAY }} className="text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
            Everything on the surface.
          </h1>
          <p style={{ color: C.mute }} className="text-[16px] leading-relaxed">
            No screens, no scrolling. Field puts every parameter under a dedicated knob so the
            instrument disappears and only the sound is left.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <DuotoneImage seed="oscine-panel-knobs" alt="Close-up of the brushed control panel and walnut cheeks of the Field synthesizer." ratio="aspect-[16/10]" />
          <DuotoneImage seed="oscine-patchbay-cables" alt="Patch cables routed across the modular patch bay on the rear panel." ratio="aspect-[16/10]" />
        </div>
      </section>

      {/* feature tilt grid */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.06}>
              <TiltCard className="h-full">
                <div
                  className="flex h-full flex-col rounded-2xl border p-7"
                  style={{ borderColor: C.line, background: C.surface }}
                >
                  <span style={{ fontFamily: MONO, color: C.amber }} className="text-[12px]">
                    0{i + 1}
                  </span>
                  <h3 style={{ fontFamily: DISPLAY }} className="mt-3 text-2xl font-bold">
                    {f.t}
                  </h3>
                  <p style={{ color: C.mute }} className="mt-2 text-[15px] leading-relaxed">
                    {f.d}
                  </p>
                  <div className="mt-5">
                    <Scope seed={i + 3} />
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* signal flow */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="rounded-2xl border p-8 sm:p-10" style={{ borderColor: C.line, background: C.bg2 }}>
          <Eyebrow>Signal path</Eyebrow>
          <h2 style={{ fontFamily: DISPLAY }} className="mt-3 text-2xl font-bold sm:text-3xl">
            Normalled, until you break it.
          </h2>
          <div className="mt-8">
            <SignalFlow />
          </div>
        </div>
      </section>

      {/* spec table */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <Eyebrow>Specifications</Eyebrow>
        <div className="mt-5 overflow-hidden rounded-2xl border" style={{ borderColor: C.line }}>
          {SPECS.map(([k, v], i) => (
            <div
              key={k}
              className="grid grid-cols-[0.9fr_1.4fr] gap-4 px-6 py-4 sm:px-8"
              style={{ background: i % 2 ? C.bg : C.bg2 }}
            >
              <span style={{ fontFamily: MONO, color: C.mute }} className="text-[12px] uppercase tracking-[0.12em]">
                {k}
              </span>
              <span style={{ fontFamily: BODY, color: C.ink }} className="text-[15px]">
                {v}
              </span>
            </div>
          ))}
        </div>
      </section>
    </Page>
  )
}

/* =================================================================== SOUNDS */

type Patch = { name: string; cat: string; seed: number; note: string }

const SOUND_LIB: Patch[] = [
  { name: "Sodium Bloom", cat: "Pad", seed: 4, note: "Detuned voices opening on a slow filter sweep." },
  { name: "Drift Bass", cat: "Bass", seed: 7, note: "Sub plus saw, just barely out of tune with itself." },
  { name: "Wax Lead", cat: "Lead", seed: 2, note: "Self-oscillating filter tracked across the keys." },
  { name: "Tape Choir", cat: "Pad", seed: 9, note: "Eight voices, eight drifts, one held chord." },
  { name: "Glass Sub", cat: "Bass", seed: 5, note: "Pure sub with a glassy resonant click on top." },
  { name: "Hollow Bell", cat: "Texture", seed: 3, note: "Audio-rate cross-mod into metallic partials." },
  { name: "Field Static", cat: "Texture", seed: 8, note: "Noise through the ladder, barely tamed." },
  { name: "Iron Pad", cat: "Pad", seed: 6, note: "Loopable envelope as a fourth slow modulator." },
  { name: "Pulse Run", cat: "Lead", seed: 1, note: "Variable pulse width chased by an LFO." },
]

const CATS = ["All", "Bass", "Lead", "Pad", "Texture"]

function Sounds() {
  const [cat, setCat] = useState("All")
  const list = cat === "All" ? SOUND_LIB : SOUND_LIB.filter((p) => p.cat === cat)
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <Eyebrow>Sound library</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY }} className="mt-5 max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          Forty patches that ship in the box.
        </h1>
        <p style={{ color: C.mute }} className="mt-5 max-w-md text-[16px] leading-relaxed">
          Each one is a starting point, not a preset to leave alone. Here are nine we keep coming back to.
        </p>

        {/* filter chips */}
        <div className="mt-9 flex flex-wrap gap-2">
          {CATS.map((c) => {
            const active = c === cat
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  fontFamily: MONO,
                  background: active ? C.amber : "transparent",
                  color: active ? "#1A1308" : C.mute,
                  borderColor: active ? "transparent" : C.line,
                }}
                className="rounded-full border px-4 py-1.5 text-[12px] uppercase tracking-[0.14em] transition-colors duration-200"
              >
                {c}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="rounded-2xl border p-6"
                style={{ borderColor: C.line, background: C.surface }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: DISPLAY }} className="text-lg font-bold">
                    {p.name}
                  </span>
                  <span
                    style={{ fontFamily: MONO, color: C.amber, borderColor: C.line }}
                    className="rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em]"
                  >
                    {p.cat}
                  </span>
                </div>
                <div className="mt-4 rounded-lg border p-3" style={{ borderColor: C.line, background: C.bg }}>
                  <Scope seed={p.seed} />
                </div>
                <p style={{ color: C.mute }} className="mt-4 text-[14px] leading-relaxed">
                  {p.note}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </Page>
  )
}

/* ==================================================================== STORY */

const TIMELINE: Array<[string, string, string]> = [
  ["2019", "A broken Polysix", "Tomás repairs a dead Korg in a Porto flat. The drifting voices that survived the fault became the whole brief."],
  ["2021", "First boards", "Two friends, a reflow oven, and forty rejected prototypes before a single voice held tune."],
  ["2023", "Batch one", "Forty units, hand-assembled. Sold out from a single demo posted at 2 a.m."],
  ["2026", "Batch seven", "Same workshop, same forty-at-a-time. We never wanted a factory."],
]

function Story() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h1 style={{ fontFamily: DISPLAY }} className="mt-5 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
              Two people, one bench, forty at a time.
            </h1>
            <p style={{ color: C.mute }} className="mt-6 max-w-md text-[16px] leading-relaxed">
              Oscine began with a fault — a misbehaving repair that sounded better broken than fixed.
              We have spent seven years chasing that accident on purpose, and we still build every
              unit by hand in the same room.
            </p>
          </div>
          <DuotoneImage seed="oscine-workshop-bench" alt="The Oscine workshop bench scattered with tools, boards and a half-built synthesizer." ratio="aspect-[4/5]" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { n: <Counter to={7} />, l: "years on one design" },
            { n: <Counter to={280} suffix="+" />, l: "units in the wild" },
            { n: <Counter to={2} />, l: "people, still" },
          ].map((x, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-2xl border p-7" style={{ borderColor: C.line, background: C.bg2 }}>
                <div style={{ fontFamily: DISPLAY, color: C.amber }} className="text-4xl font-extrabold">
                  {x.n}
                </div>
                <div style={{ color: C.mute }} className="mt-2 text-sm">
                  {x.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* timeline */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <Eyebrow>How we got here</Eyebrow>
        <div className="mt-8 border-l" style={{ borderColor: C.line }}>
          {TIMELINE.map(([year, title, body], i) => (
            <Reveal key={year} delay={i * 0.05}>
              <div className="relative pb-10 pl-8">
                <span
                  className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full"
                  style={{ background: C.amber }}
                />
                <div style={{ fontFamily: MONO, color: C.amber }} className="text-[13px] tracking-[0.1em]">
                  {year}
                </div>
                <h3 style={{ fontFamily: DISPLAY }} className="mt-1 text-xl font-bold">
                  {title}
                </h3>
                <p style={{ color: C.mute }} className="mt-2 max-w-xl text-[15px] leading-relaxed">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}

/* ==================================================================== ORDER */

const FINISHES = [
  { id: "graphite", label: "Graphite steel", swatch: "#2A2A2C", add: 0 },
  { id: "sand", label: "Sand anodized", swatch: "#C9B79A", add: 80 },
  { id: "oxblood", label: "Oxblood / brass", swatch: "#7A2E2A", add: 140 },
]
const CHEEKS = [
  { id: "walnut", label: "Walnut", add: 0 },
  { id: "ash", label: "Pale ash", add: 0 },
  { id: "none", label: "No cheeks (steel)", add: -40 },
]

function Order() {
  const [finish, setFinish] = useState(FINISHES[0].id)
  const [cheek, setCheek] = useState(CHEEKS[0].id)
  const [psu, setPsu] = useState(true)
  const [sent, setSent] = useState(false)

  const base = 1490
  const f = FINISHES.find((x) => x.id === finish)!
  const c = CHEEKS.find((x) => x.id === cheek)!
  const total = base + f.add + c.add + (psu ? 0 : -30)

  return (
    <Page>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <Eyebrow>Reserve a unit</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY }} className="mt-5 max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          Hold a Field from batch seven.
        </h1>
        <p style={{ color: C.mute }} className="mt-5 max-w-md text-[16px] leading-relaxed">
          A €150 deposit holds your unit. Configure it now — we build to your spec and ship within
          eight weeks. Balance due before dispatch.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* configurator */}
          <div className="flex flex-col gap-8">
            <div>
              <div style={{ fontFamily: MONO, color: C.faint }} className="mb-3 text-[11px] uppercase tracking-[0.2em]">
                Panel finish
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {FINISHES.map((opt) => {
                  const active = opt.id === finish
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFinish(opt.id)}
                      className="flex items-center gap-3 rounded-xl border p-4 text-left transition-colors duration-200"
                      style={{ borderColor: active ? C.amber : C.line, background: active ? C.surface : C.bg2 }}
                    >
                      <span className="h-7 w-7 shrink-0 rounded-full border" style={{ background: opt.swatch, borderColor: C.line }} />
                      <span>
                        <span style={{ fontFamily: BODY }} className="block text-[14px] font-semibold">
                          {opt.label}
                        </span>
                        <span style={{ fontFamily: MONO, color: C.mute }} className="text-[11px]">
                          {opt.add ? `+€${opt.add}` : "included"}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: MONO, color: C.faint }} className="mb-3 text-[11px] uppercase tracking-[0.2em]">
                Side cheeks
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {CHEEKS.map((opt) => {
                  const active = opt.id === cheek
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setCheek(opt.id)}
                      className="rounded-xl border p-4 text-left transition-colors duration-200"
                      style={{ borderColor: active ? C.amber : C.line, background: active ? C.surface : C.bg2 }}
                    >
                      <span style={{ fontFamily: BODY }} className="block text-[14px] font-semibold">
                        {opt.label}
                      </span>
                      <span style={{ fontFamily: MONO, color: C.mute }} className="text-[11px]">
                        {opt.add === 0 ? "included" : opt.add > 0 ? `+€${opt.add}` : `−€${Math.abs(opt.add)}`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => setPsu((v) => !v)}
              className="flex items-center justify-between rounded-xl border p-4 text-left"
              style={{ borderColor: psu ? C.amber : C.line, background: C.bg2 }}
            >
              <span>
                <span style={{ fontFamily: BODY }} className="block text-[14px] font-semibold">
                  Include EU power supply
                </span>
                <span style={{ fontFamily: MONO, color: C.mute }} className="text-[11px]">
                  uncheck to save €30 if you already run 12 V DC
                </span>
              </span>
              <span
                className="grid h-6 w-6 place-items-center rounded-md border"
                style={{ borderColor: C.line, background: psu ? C.amber : "transparent", color: "#1A1308" }}
              >
                {psu && <Check size={15} />}
              </span>
            </button>
          </div>

          {/* live summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border p-7" style={{ borderColor: C.line, background: C.surface }}>
              <div style={{ fontFamily: DISPLAY }} className="text-xl font-bold">
                Your Field
              </div>
              <dl className="mt-5 flex flex-col gap-3 text-[14px]">
                {[
                  ["Base unit", `€${base.toLocaleString()}`],
                  ["Finish", f.label],
                  ["Cheeks", c.label],
                  ["Power supply", psu ? "Included" : "Omitted (−€30)"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <dt style={{ color: C.mute }}>{k}</dt>
                    <dd style={{ fontFamily: MONO }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="my-5 h-px" style={{ background: C.line }} />
              <div className="flex items-end justify-between">
                <span style={{ color: C.mute }} className="text-[13px]">
                  Total
                </span>
                <span style={{ fontFamily: DISPLAY, color: C.amber }} className="text-3xl font-extrabold">
                  <Counter to={total} prefix="€" />
                </span>
              </div>
              <p style={{ fontFamily: MONO, color: C.faint }} className="mt-2 text-right text-[11px]">
                €150 deposit today
              </p>

              {sent ? (
                <div
                  className="mt-6 flex items-center gap-2 rounded-xl border p-4"
                  style={{ borderColor: C.amber, background: C.bg2, color: C.amber }}
                >
                  <Check size={18} />
                  <span style={{ fontFamily: BODY }} className="text-[14px]">
                    Reserved — check your inbox to confirm.
                  </span>
                </div>
              ) : (
                <form
                  className="mt-6 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                >
                  <input
                    required
                    type="email"
                    placeholder="you@studio.com"
                    className="rounded-xl border bg-transparent px-4 py-3 text-[14px] outline-none placeholder:opacity-50 focus:border-amber-400"
                    style={{ borderColor: C.line, color: C.ink, fontFamily: BODY }}
                  />
                  <Magnetic strength={0.2}>
                    <Btn>
                      <Plus size={16} /> Reserve for €150
                    </Btn>
                  </Magnetic>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ================================================================ site root */

export default function OscineSite() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="instrument" element={<Instrument />} />
        <Route path="sounds" element={<Sounds />} />
        <Route path="story" element={<Story />} />
        <Route path="order" element={<Order />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "OSCINE — Field, an 8-voice analog synthesizer",
  description:
    "A boutique hardware-synth brand for the Oscine Field: eight drifting analog voices, one knob per function, hand-built forty at a time in Porto. Featured interaction: a cursor-reactive 'living oscillator' built from morphing SVG blobs — plus an infinite patch marquee, 3D-tilt feature cards, animated counters, filterable oscilloscope patches and a live order configurator.",
  date: "2026-06-24",
  type: "Hardware product marketing",
  interaction: "Cursor-reactive morphing SVG blobs (living oscillator) + 3D tilt + animated counters",
  pages: ["Home", "Instrument", "Sounds", "Story", "Order"],
}
