import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
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
  useInView,
  useReducedMotion,
} from "framer-motion"
import {
  ArrowUpRight,
  Coffee,
  Leaf,
  Menu,
  Mountain,
  Package,
  Repeat,
  Sun,
  Thermometer,
  Truck,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { Spotlight } from "@/components/fx/Spotlight"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Cardinal Coffee Roasters — direct-trade coffee, roasted in Oakland",
  description:
    "A small direct-trade roaster on the Oakland waterfront, buying single lots straight from the farms and roasting to order. Featured interaction: a draggable radial roast dial — rotate it Light → Dark (drag or arrow keys) and the bean, the tasting notes, the body/acidity meters and the coffee we'd pour you all change in step. Plus magnetic CTAs, an origin marquee, animated counters and scroll reveals.",
  date: "2026-06-25",
  type: "E-commerce / coffee roaster",
  interaction:
    "Draggable radial roast dial (pointer + keyboard) that morphs bean, tasting notes, body/acidity & recommended coffee — plus magnetic CTAs, origin marquee, animated counters & scroll reveals",
  pages: ["Home", "Coffee", "Subscription", "Roastery"],
}

/* --------------------------------------------------------------- palette */
// warm paper #f3ede1 · espresso ink #271c15 · ONE accent: cardinal red #bb392a
const PAPER = "#f3ede1"
const PAPER_2 = "#ece2d0"
const PAPER_3 = "#e4d8c2"
const INK = "#271c15"
const MUTED = "#5d5044" // solid muted brown — ≈6.4:1 on paper
const CARDINAL = "#bb392a" // 4.7:1 on paper, white 5.6:1 on it
const CARDINAL_DK = "#9c2c1e"
const CREAM = "#efe6d6" // text on dark grounds
const CREAM_MUTE = "#c9bba3" // muted label on dark
// roast bean color stops (light → dark)
const BEAN_LIGHT = "#bb863f"
const BEAN_DARK = "#231307"

const DISPLAY = "'Spectral', Georgia, serif"
const SANS = "'Space Grotesk', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

/* ----------------------------------------------------------------- utils */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function hexToRgb(h: string) {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}
function lerpColor(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const r = Math.round(lerp(r1, r2, t))
  const g = Math.round(lerp(g1, g2, t))
  const bl = Math.round(lerp(b1, b2, t))
  return `rgb(${r}, ${g}, ${bl})`
}

/* ------------------------------------------------------------------ data */

type Roast = {
  origin: string
  region: string
  roast: string
  notes: [string, string, string]
  price: number
  altitude: string
  process: string
  body: number // 1..5
  acidity: number // 1..5
  seed: string
  blurb: string
}

// Five named stops along the roast dial, light → dark.
const ROASTS: Roast[] = [
  {
    origin: "Guji Highland",
    region: "Ethiopia",
    roast: "Light",
    notes: ["Jasmine", "Bergamot", "White Peach",],
    price: 21,
    altitude: "2,050 m",
    process: "Natural",
    body: 2,
    acidity: 5,
    seed: "ethiopia-guji-coffee-cherry",
    blurb: "Floral and tea-like, with a bright peach finish that lingers.",
  },
  {
    origin: "Nyeri Ridge",
    region: "Kenya",
    roast: "Light–Medium",
    notes: ["Blackcurrant", "Grapefruit", "Cane Sugar"],
    price: 23,
    altitude: "1,800 m",
    process: "Washed",
    body: 3,
    acidity: 4,
    seed: "kenya-nyeri-washing-station",
    blurb: "Juicy and structured — the blackcurrant Kenya is famous for.",
  },
  {
    origin: "Huila Reserve",
    region: "Colombia",
    roast: "Medium",
    notes: ["Red Apple", "Caramel", "Toasted Almond"],
    price: 19,
    altitude: "1,650 m",
    process: "Washed",
    body: 3,
    acidity: 3,
    seed: "colombia-huila-mountain-farm",
    blurb: "The everyday cup. Balanced, sweet, endlessly drinkable.",
  },
  {
    origin: "Antigua Valley",
    region: "Guatemala",
    roast: "Medium–Dark",
    notes: ["Cocoa", "Brown Sugar", "Orange Peel"],
    price: 20,
    altitude: "1,520 m",
    process: "Washed",
    body: 4,
    acidity: 2,
    seed: "guatemala-antigua-volcano-coffee",
    blurb: "Volcanic soil gives a deep cocoa body with a citrus lift.",
  },
  {
    origin: "Lintong Estate",
    region: "Sumatra",
    roast: "Dark",
    notes: ["Dark Chocolate", "Cedar", "Molasses"],
    price: 22,
    altitude: "1,400 m",
    process: "Wet-hulled",
    body: 5,
    acidity: 1,
    seed: "sumatra-lintong-rainforest",
    blurb: "Earthy, full and syrupy — built for milk and for mornings.",
  },
]

// Shop grid — the five single origins plus a house blend.
type Product = Roast & { tag?: string; soldOut?: boolean }
const SHOP: Product[] = [
  { ...ROASTS[0], tag: "New lot" },
  { ...ROASTS[1] },
  {
    origin: "Embarcadero",
    region: "House Blend",
    roast: "Medium",
    notes: ["Milk Chocolate", "Hazelnut", "Cherry"],
    price: 17,
    altitude: "Blend",
    process: "Washed + Natural",
    body: 3,
    acidity: 3,
    seed: "espresso-blend-roasted-beans",
    blurb: "Our espresso backbone — three origins, dialed for café machines.",
    tag: "Bestseller",
  },
  { ...ROASTS[2] },
  { ...ROASTS[3] },
  { ...ROASTS[4], soldOut: true },
]

const ORIGINS = [
  "ETHIOPIA · GUJI",
  "KENYA · NYERI",
  "COLOMBIA · HUILA",
  "GUATEMALA · ANTIGUA",
  "SUMATRA · LINTONG",
  "RWANDA · NYAMASHEKE",
  "PERU · CAJAMARCA",
  "BURUNDI · KAYANZA",
]

const PLANS = [
  {
    name: "The Weekday",
    bags: "1 bag",
    cadence: "every 2 weeks",
    price: 18,
    blurb: "One 12 oz bag, rotating single origins. For the one-pot household.",
    perks: ["Free shipping", "Roasted the day it ships", "Pause anytime"],
    featured: false,
  },
  {
    name: "The Carafe",
    bags: "2 bags",
    cadence: "every 2 weeks",
    price: 33,
    blurb: "Two bags — one bright, one balanced — so there's always a choice.",
    perks: [
      "Free shipping",
      "Roasted the day it ships",
      "First pick of micro-lots",
      "10% off café drinks",
    ],
    featured: true,
  },
  {
    name: "The Counter",
    bags: "4 bags",
    cadence: "weekly",
    price: 60,
    blurb: "For offices and serious drinkers. Mix origins, whole or ground.",
    perks: [
      "Free shipping",
      "Roasted the day it ships",
      "Dedicated roaster contact",
      "Invoiced monthly",
    ],
    featured: false,
  },
]

const STATS = [
  { value: 38, suffix: "", label: "Farms we buy from by name" },
  { value: 240, suffix: "%", label: "Average over the Fairtrade floor price" },
  { value: 18, suffix: " hrs", label: "From roast to sealed bag, every time" },
  { value: 9, suffix: " yrs", label: "On the Oakland waterfront" },
]

/* ----------------------------------------------------------- primitives */

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ fontFamily: SANS, color: dark ? CREAM_MUTE : CARDINAL_DK }}
    >
      <span className="h-px w-6" style={{ background: CARDINAL }} />
      {children}
    </span>
  )
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.3,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduce])
  return (
    <span ref={ref}>
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  )
}

/** Magnetic pill button. variant: solid (cardinal) or outline (ink). */
function Btn({
  children,
  onClick,
  variant = "solid",
  dark = false,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "solid" | "outline"
  dark?: boolean
}) {
  const solid = variant === "solid"
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200"
  const style: CSSProperties = solid
    ? { background: CARDINAL, color: "#fff", fontFamily: SANS }
    : {
        background: "transparent",
        color: dark ? CREAM : INK,
        border: `1px solid ${dark ? "rgba(239,230,214,0.35)" : "rgba(39,28,21,0.25)"}`,
        fontFamily: SANS,
      }
  return (
    <Magnetic strength={0.35}>
      <button
        onClick={onClick}
        className={`${base} hover:-translate-y-0.5 ${solid ? "hover:shadow-[0_10px_30px_-12px_rgba(187,57,42,0.7)]" : "hover:bg-[rgba(39,28,21,0.05)]"}`}
        style={style}
      >
        {children}
      </button>
    </Magnetic>
  )
}

/* ------------------------------------------------------- coffee bean SVG */

/** A single coffee bean whose color & oily sheen track the roast level t (0..1). */
function CoffeeBean({ t, size = 280 }: { t: number; size?: number }) {
  const fill = lerpColor(BEAN_LIGHT, BEAN_DARK, t)
  const crease = lerpColor("#7c5526", "#120a04", t)
  const sheen = lerp(0, 0.5, t) // oilier as it darkens
  const rim = lerpColor("#d8aa6b", "#3a230f", t)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="beanGlow" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55 + sheen * 0.4} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <filter id="beanSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      {/* contact shadow */}
      <ellipse cx="100" cy="172" rx="62" ry="11" fill="rgba(39,28,21,0.18)" />
      <g transform="rotate(-18 100 100)">
        {/* bean body */}
        <ellipse cx="100" cy="100" rx="58" ry="78" fill={fill} stroke={rim} strokeWidth="2.5" />
        {/* center crease — a soft S curve */}
        <path
          d="M100 28 C 88 60, 112 92, 100 100 C 88 108, 112 140, 100 172"
          fill="none"
          stroke={crease}
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#beanSoft)"
        />
        {/* inner crease highlight */}
        <path
          d="M100 30 C 90 60, 110 92, 100 100 C 90 108, 110 140, 100 170"
          fill="none"
          stroke={lerpColor("#e9c891", "#5a3a1d", t)}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* oily sheen — grows with roast */}
        <ellipse cx="100" cy="100" rx="58" ry="78" fill="url(#beanGlow)" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------- FEATURED: ROAST DIAL */
/*
   A draggable radial control. The knob travels a 270° arc (gap at the bottom);
   value 0 = Light (lower-left), value 1 = Dark (lower-right). Pointer drag maps
   the cursor angle to value; arrow keys nudge it. role="slider" + aria make it
   keyboard- and screen-reader-legible. Reduced-motion users still get a fully
   working control — only the spring flourish is dropped.
*/

const SWEEP = 270 // total arc degrees
const START = -135 // value 0 angle (clockwise from top)

// point on a circle, angle measured clockwise from 12 o'clock
function pt(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)] as const
}
function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const [x1, y1] = pt(cx, cy, r, fromDeg)
  const [x2, y2] = pt(cx, cy, r, toDeg)
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0
  const sweep = toDeg > fromDeg ? 1 : 0
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

function RoastDial({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState(false)
  const SIZE = 320
  const C = SIZE / 2
  const R = 128

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = clientX - (r.left + r.width / 2)
      const dy = clientY - (r.top + r.height / 2)
      let deg = (Math.atan2(dx, -dy) * 180) / Math.PI // clockwise from top, [-180,180]
      const min = START
      const max = START + SWEEP
      if (deg < min || deg > max) {
        // pointer is in the bottom dead zone — snap to the nearer end of the arc
        const dMin = Math.min(Math.abs(deg - min), 360 - Math.abs(deg - min))
        const dMax = Math.min(Math.abs(deg - max), 360 - Math.abs(deg - max))
        deg = dMin < dMax ? min : max
      }
      onChange(clamp01((deg - min) / SWEEP))
    },
    [onChange],
  )

  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    setDragging(true)
    updateFromPointer(e.clientX, e.clientY)
  }
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return
    updateFromPointer(e.clientX, e.clientY)
  }
  const onUp = () => setDragging(false)

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.04
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      onChange(clamp01(value + step))
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      onChange(clamp01(value - step))
    } else if (e.key === "Home") {
      e.preventDefault()
      onChange(0)
    } else if (e.key === "End") {
      e.preventDefault()
      onChange(1)
    }
  }

  const knobDeg = START + value * SWEEP
  const [kx, ky] = pt(C, C, R, knobDeg)
  const roastName = ROASTS[Math.round(value * (ROASTS.length - 1))].roast

  // tick marks at the five named stops
  const ticks = ROASTS.map((_, i) => {
    const deg = START + (i / (ROASTS.length - 1)) * SWEEP
    const [ox, oy] = pt(C, C, R + 16, deg)
    const [ix, iy] = pt(C, C, R + 6, deg)
    return { ox, oy, ix, iy, deg, i }
  })

  return (
    <div className="relative select-none" style={{ width: SIZE, maxWidth: "100%" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        role="slider"
        tabIndex={0}
        aria-label="Roast level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={`${roastName} roast`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onKeyDown={onKey}
        className="cursor-grab touch-none rounded-full outline-none focus-visible:ring-2 active:cursor-grabbing"
        style={{ ["--tw-ring-color" as string]: CARDINAL }}
      >
        {/* track */}
        <path d={arcPath(C, C, R, START, START + SWEEP)} fill="none" stroke={PAPER_3} strokeWidth="10" strokeLinecap="round" />
        {/* filled portion */}
        <path
          d={arcPath(C, C, R, START, Math.max(START + 0.001, knobDeg))}
          fill="none"
          stroke={lerpColor("#caa15f", "#3a2310", value)}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* ticks */}
        {ticks.map((tk) => (
          <line
            key={tk.i}
            x1={tk.ix}
            y1={tk.iy}
            x2={tk.ox}
            y2={tk.oy}
            stroke={Math.round(value * 4) === tk.i ? CARDINAL : "rgba(39,28,21,0.3)"}
            strokeWidth={Math.round(value * 4) === tk.i ? 3 : 1.5}
            strokeLinecap="round"
          />
        ))}
        {/* knob — a soft halo pulses while idle to signal "grab me" */}
        {!dragging && (
          <motion.circle
            cx={kx}
            cy={ky}
            r="15"
            fill="none"
            stroke={CARDINAL}
            strokeWidth="2"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            style={{ transformOrigin: `${kx}px ${ky}px` }}
          />
        )}
        <circle cx={kx} cy={ky} r="15" fill="#fff" stroke={CARDINAL} strokeWidth="3" />
        <circle cx={kx} cy={ky} r="5" fill={CARDINAL} />
      </svg>
      {/* bean rendered as DOM over the SVG center for crisp gradients */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: dragging ? 1.04 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <CoffeeBean t={value} size={150} />
        </motion.div>
      </div>
      {/* roast name badge */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center">
        <span
          className="rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ fontFamily: SANS, background: INK, color: CREAM }}
        >
          {roastName} roast
        </span>
      </div>
    </div>
  )
}

/** Horizontal meter bar that animates its fill. */
function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ fontFamily: SANS, color: MUTED }}>
          {label}
        </span>
        <span className="text-[11px] font-medium" style={{ fontFamily: MONO, color: INK }}>
          {value.toFixed(1)}/5
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: PAPER_3 }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: CARDINAL }}
          animate={{ width: `${(value / 5) * 100}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 26 }}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- hero (Home) */

function RoastExplorer() {
  const [value, setValue] = useState(0.5)
  const idx = Math.round(value * (ROASTS.length - 1))
  const cur = ROASTS[idx]
  const body = lerp(2, 5, value)
  const acidity = lerp(5, 1, value)
  // background warmth tracks the roast
  const warm = lerpColor("#f6f0e4", "#efe3cd", value)

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `radial-gradient(120% 90% at 78% 18%, ${warm}, ${PAPER})`, transition: "background 0.3s" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
        {/* copy */}
        <div>
          <Eyebrow>Roasted to order · Oakland, CA</Eyebrow>
          <h1
            className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.02em]"
            style={{ fontFamily: DISPLAY, color: INK }}
          >
            Find your roast,
            <br />
            <span style={{ fontStyle: "italic", color: CARDINAL }}>then turn the dial.</span>
          </h1>
          <p
            className="mt-6 max-w-md text-[1.05rem] leading-relaxed"
            style={{ fontFamily: SANS, color: MUTED }}
          >
            We buy single lots straight from the farm and roast them the morning
            they ship. Drag the dial from delicate to dark — the cup follows.
          </p>

          {/* live tasting card */}
          <div
            className="mt-8 rounded-2xl border p-5"
            style={{ borderColor: "rgba(39,28,21,0.12)", background: "rgba(255,255,255,0.55)", backdropFilter: "blur(4px)" }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: CARDINAL_DK }}>
                  {cur.region}
                </div>
                <div className="text-2xl font-medium" style={{ fontFamily: DISPLAY, color: INK }}>
                  {cur.origin}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-medium" style={{ fontFamily: MONO, color: INK }}>
                  ${cur.price}
                </div>
                <div className="text-[10px] uppercase tracking-wider" style={{ fontFamily: SANS, color: MUTED }}>
                  12 oz
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm" style={{ fontFamily: SANS, color: MUTED }}>
              {cur.blurb}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cur.notes.map((n) => (
                <motion.span
                  key={n}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-full border px-3 py-1 text-xs font-medium"
                  style={{ fontFamily: SANS, color: INK, borderColor: "rgba(39,28,21,0.18)" }}
                >
                  {n}
                </motion.span>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Meter label="Body" value={body} />
              <Meter label="Acidity" value={acidity} />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Btn>
              Add to cart · ${cur.price} <ArrowUpRight className="h-4 w-4" />
            </Btn>
            <Btn variant="outline">Brew guide</Btn>
          </div>
        </div>

        {/* dial */}
        <div className="flex flex-col items-center">
          <div className="flex w-full max-w-sm items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ fontFamily: SANS, color: MUTED }}>
            <span className="inline-flex items-center gap-1"><Sun className="h-3.5 w-3.5" /> Light</span>
            <span className="inline-flex items-center gap-1"><Thermometer className="h-3.5 w-3.5" /> Dark</span>
          </div>
          <div className="mt-3">
            <RoastDial value={value} onChange={setValue} />
          </div>
          <p className="mt-8 text-center text-xs" style={{ fontFamily: MONO, color: MUTED }}>
            Drag the knob · or focus it and use ← →
          </p>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- marquee */

function OriginMarquee() {
  const reduce = useReducedMotion()
  const row = [...ORIGINS, ...ORIGINS]
  return (
    <div className="relative overflow-hidden border-y py-4" style={{ borderColor: "rgba(239,230,214,0.14)", background: INK }}>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{ background: `linear-gradient(90deg, ${INK}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{ background: `linear-gradient(270deg, ${INK}, transparent)` }}
      />
      <motion.div
        className="flex w-max gap-10"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {row.map((o, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.22em]"
            style={{ fontFamily: MONO, color: CREAM_MUTE }}
          >
            {o}
            <Coffee className="h-3.5 w-3.5" style={{ color: CARDINAL }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------- shared bits */

function SectionHead({
  eyebrow,
  title,
  intro,
  dark = false,
}: {
  eyebrow: string
  title: ReactNode
  intro?: string
  dark?: boolean
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.015em]"
        style={{ fontFamily: DISPLAY, color: dark ? CREAM : INK }}
      >
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ fontFamily: SANS, color: dark ? CREAM_MUTE : MUTED }}>
          {intro}
        </p>
      )}
    </div>
  )
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  // a thumbnail of the bean's roast level for visual variety
  const t = ["Light", "Light–Medium", "Medium", "Medium–Dark", "Dark"].indexOf(p.roast) / 4
  return (
    <Reveal delay={(i % 3) * 0.08}>
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-transform duration-200 hover:-translate-y-1"
        style={{ borderColor: "rgba(39,28,21,0.12)", background: "#fff" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "#e7d9bf" }}>
          <img
            src={`https://picsum.photos/seed/${p.seed}/640/480`}
            alt={`${p.origin}, ${p.region} — green and roasted coffee`}
            loading="lazy"
            width={640}
            height={480}
            className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            style={{ filter: "sepia(0.35) saturate(1.1) contrast(1.02)" }}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {p.tag && (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ fontFamily: SANS, background: CARDINAL, color: "#fff" }}>
                {p.tag}
              </span>
            )}
            {p.soldOut && (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ fontFamily: SANS, background: INK, color: CREAM }}>
                Sold out
              </span>
            )}
          </div>
          <div className="absolute right-3 top-3 scale-90">
            <CoffeeBean t={t} size={52} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ fontFamily: SANS, color: CARDINAL_DK }}>
              {p.region}
            </span>
            <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>
              {p.roast}
            </span>
          </div>
          <h3 className="mt-1 text-xl font-medium" style={{ fontFamily: DISPLAY, color: INK }}>
            {p.origin}
          </h3>
          <p className="mt-1.5 text-sm" style={{ fontFamily: SANS, color: MUTED }}>
            {p.notes.join(" · ")}
          </p>
          <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(39,28,21,0.1)" }}>
            <span className="text-lg font-medium" style={{ fontFamily: MONO, color: INK }}>
              ${p.price}
            </span>
            <button
              disabled={p.soldOut}
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors disabled:opacity-40"
              style={{ fontFamily: SANS, color: p.soldOut ? MUTED : CARDINAL }}
            >
              {p.soldOut ? "Notify me" : "Add to cart"}
              {!p.soldOut && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ----------------------------------------------------------------- pages */

function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function Home() {
  const base = useBase()
  return (
    <PageShell>
      <RoastExplorer />
      <OriginMarquee />

      {/* stats */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-l-2 pl-5" style={{ borderColor: CARDINAL }}>
                <div className="text-4xl font-medium tracking-tight" style={{ fontFamily: DISPLAY, color: INK }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-2 text-sm leading-snug" style={{ fontFamily: SANS, color: MUTED }}>
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured three from the shop */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            eyebrow="This week's table"
            title={<>Fresh on the <span style={{ fontStyle: "italic", color: CARDINAL }}>roasting log</span></>}
            intro="Six lots in rotation right now. Each one was on a tree four months ago."
          />
          <NavLink to={`${base}/coffee`} className="group inline-flex items-center gap-1.5 text-sm font-semibold" style={{ fontFamily: SANS, color: CARDINAL }}>
            Shop all coffee
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </NavLink>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {SHOP.slice(0, 3).map((p, i) => (
            <ProductCard key={p.origin} p={p} i={i} />
          ))}
        </div>
      </section>

      {/* sourcing band with spotlight */}
      <section className="px-4 pb-20">
        <Spotlight color="rgba(187,57,42,0.16)" size={420} className="mx-auto max-w-6xl rounded-3xl" >
          <div className="rounded-3xl px-8 py-14 md:px-14" style={{ background: INK }}>
            <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <SectionHead
                  dark
                  eyebrow="How we buy"
                  title={<>Paid above the floor, every <span style={{ fontStyle: "italic", color: "#e0a35d" }}>single time.</span></>}
                  intro="No exchange price, no anonymous sacks. We sign with the farm, publish what we paid, and fly to taste the harvest before it's picked. It costs more. It tastes like it."
                />
                <div className="mt-8">
                  <Btn dark variant="outline">Read our 2026 transparency report</Btn>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  { icon: Mountain, k: "Altitude", v: "1,400–2,050 m grown" },
                  { icon: Leaf, k: "Relationship", v: "Direct, multi-year contracts" },
                  { icon: Truck, k: "Freshness", v: "Roast-to-bag in 18 hours" },
                ].map((r, i) => (
                  <Reveal key={r.k} delay={i * 0.08}>
                    <div className="flex items-center gap-4 rounded-xl border p-4" style={{ borderColor: "rgba(239,230,214,0.14)" }}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(187,57,42,0.18)" }}>
                        <r.icon className="h-5 w-5" style={{ color: "#e0a35d" }} />
                      </span>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ fontFamily: SANS, color: CREAM_MUTE }}>
                          {r.k}
                        </div>
                        <div className="text-base" style={{ fontFamily: DISPLAY, color: CREAM }}>
                          {r.v}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Spotlight>
      </section>
    </PageShell>
  )
}

function CoffeePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHead
          eyebrow="The whole table"
          title={<>Every lot we're <span style={{ fontStyle: "italic", color: CARDINAL }}>roasting now</span></>}
          intro="Single origins and one stubborn house blend. Whole bean or ground to your brewer — just tell us at checkout."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP.map((p, i) => (
            <ProductCard key={p.origin} p={p} i={i} />
          ))}
        </div>

        {/* grind helper strip */}
        <Reveal>
          <div className="mt-16 grid gap-6 rounded-2xl border p-8 sm:grid-cols-3" style={{ borderColor: "rgba(39,28,21,0.12)", background: PAPER_2 }}>
            {[
              { icon: Coffee, k: "Pour over", v: "Medium grind, 1:16, 94°C" },
              { icon: Package, k: "French press", v: "Coarse grind, 1:14, 4 min" },
              { icon: Thermometer, k: "Espresso", v: "Fine grind, 1:2, 26 sec" },
            ].map((g) => (
              <div key={g.k} className="flex items-start gap-3">
                <g.icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: CARDINAL }} />
                <div>
                  <div className="text-sm font-semibold" style={{ fontFamily: SANS, color: INK }}>
                    {g.k}
                  </div>
                  <div className="text-sm" style={{ fontFamily: MONO, color: MUTED }}>
                    {g.v}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </PageShell>
  )
}

function SubscriptionPage() {
  const base = useBase()
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHead
          eyebrow="Standing order"
          title={<>Coffee that <span style={{ fontStyle: "italic", color: CARDINAL }}>arrives</span> before you run out</>}
          intro="Pick a rhythm. We roast and ship the morning it's due, rotate the origins so it never gets dull, and you skip, swap or pause from a text message."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className="relative flex h-full flex-col rounded-2xl border p-7"
                style={
                  plan.featured
                    ? { borderColor: CARDINAL, background: INK, boxShadow: "0 24px 60px -30px rgba(187,57,42,0.6)" }
                    : { borderColor: "rgba(39,28,21,0.14)", background: "#fff" }
                }
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: SANS, background: CARDINAL, color: "#fff" }}>
                    Most chosen
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" style={{ color: plan.featured ? "#e0a35d" : CARDINAL }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: plan.featured ? CREAM_MUTE : CARDINAL_DK }}>
                    {plan.bags} · {plan.cadence}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-medium" style={{ fontFamily: DISPLAY, color: plan.featured ? CREAM : INK }}>
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-medium" style={{ fontFamily: DISPLAY, color: plan.featured ? CREAM : INK }}>
                    ${plan.price}
                  </span>
                  <span className="text-sm" style={{ fontFamily: SANS, color: plan.featured ? CREAM_MUTE : MUTED }}>
                    / delivery
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ fontFamily: SANS, color: plan.featured ? CREAM_MUTE : MUTED }}>
                  {plan.blurb}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5 text-sm" style={{ fontFamily: SANS, color: plan.featured ? CREAM : INK }}>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ background: plan.featured ? "rgba(224,163,93,0.25)" : "rgba(187,57,42,0.12)" }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: plan.featured ? "#e0a35d" : CARDINAL }} />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Btn variant={plan.featured ? "solid" : "outline"} dark={plan.featured}>
                    Start {plan.name}
                  </Btn>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-12 text-center text-sm" style={{ fontFamily: SANS, color: MUTED }}>
            Buying for an office?{" "}
            <NavLink to={`${base}/roastery`} className="font-semibold underline decoration-2 underline-offset-4" style={{ color: CARDINAL }}>
              Talk to a roaster
            </NavLink>{" "}
            about wholesale.
          </p>
        </Reveal>
      </section>
    </PageShell>
  )
}

function RoasteryPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="Pier 9, Oakland"
              title={<>A 12-kilo drum, a <span style={{ fontStyle: "italic", color: CARDINAL }}>cold bay breeze</span>, and the door open</>}
              intro="We started Cardinal in 2017 in a shipping container behind the ferry terminal. We're bigger now — barely — but the rule hasn't changed: roast small, roast often, and let people watch."
            />
            <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ fontFamily: SANS, color: MUTED }}>
              The café out front opens at 6:30. The roaster runs Tuesday and
              Friday mornings, and you're welcome to stand by the cooling tray
              and ask questions while the chaff flies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn>Plan a visit</Btn>
              <Btn variant="outline">Book a cupping</Btn>
            </div>
          </div>
          <Reveal y={32}>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(39,28,21,0.14)" }}>
                <img
                  src="https://picsum.photos/seed/oakland-coffee-roastery-drum/720/880"
                  alt="The drum roaster and cooling tray at Cardinal's Pier 9 roastery"
                  loading="lazy"
                  width={720}
                  height={880}
                  className="aspect-[5/6] w-full object-cover"
                  style={{ filter: "sepia(0.15) saturate(1.05)" }}
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-xl border bg-white p-4 shadow-lg sm:block" style={{ borderColor: "rgba(39,28,21,0.12)" }}>
                <div className="text-3xl font-medium" style={{ fontFamily: DISPLAY, color: INK }}>
                  <Counter value={6} suffix=":30 AM" />
                </div>
                <div className="text-xs" style={{ fontFamily: SANS, color: MUTED }}>
                  Café opens, seven days
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* visit + contact details */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {[
            { k: "Find us", lines: ["Pier 9, Suite 4", "Embarcadero West", "Oakland, CA 94607"] },
            { k: "Hours", lines: ["Café · 6:30 AM – 4 PM daily", "Roasting · Tue & Fri AM", "Cuppings · Sat 10 AM"] },
            { k: "Say hello", lines: ["hello@cardinalcoffee.co", "wholesale@cardinalcoffee.co", "(510) 555-0148"] },
          ].map((c, i) => (
            <Reveal key={c.k} delay={i * 0.08}>
              <div className="border-t-2 pt-5" style={{ borderColor: CARDINAL }}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: CARDINAL_DK }}>
                  {c.k}
                </h3>
                <div className="mt-3 space-y-1">
                  {c.lines.map((l) => (
                    <p key={l} className="text-[1.02rem]" style={{ fontFamily: DISPLAY, color: INK }}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* simple newsletter */}
        <Reveal>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-16 flex flex-col items-start gap-4 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: PAPER_2 }}
          >
            <div>
              <h3 className="text-xl font-medium" style={{ fontFamily: DISPLAY, color: INK }}>
                New lots, the morning they land
              </h3>
              <p className="mt-1 text-sm" style={{ fontFamily: SANS, color: MUTED }}>
                One email a week. Harvest news and the occasional brew nerdery.
              </p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <input
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full rounded-full border bg-white px-5 py-3 text-sm outline-none focus:border-[--c] sm:w-64"
                style={{ fontFamily: SANS, color: INK, borderColor: "rgba(39,28,21,0.2)", ["--c" as string]: CARDINAL }}
              />
              <Btn>Sign up</Btn>
            </div>
          </form>
        </Reveal>
      </section>
    </PageShell>
  )
}

/* ----------------------------------------------------------------- layout */

// base path shared by every page
function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full" style={{ background: CARDINAL }}>
        <span className="h-3 w-3 rounded-full" style={{ background: dark ? INK : PAPER }} />
      </span>
      <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: DISPLAY, color: dark ? CREAM : INK }}>
        Cardinal
        <span className="font-normal italic" style={{ color: CARDINAL }}>
          {" "}Coffee
        </span>
      </span>
    </span>
  )
}

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/coffee`, label: "Coffee", end: false },
    { to: `${base}/subscription`, label: "Subscription", end: false },
    { to: `${base}/roastery`, label: "Roastery", end: false },
  ]
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors ${isActive ? "" : "hover:opacity-100"}`
  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      {/* nav */}
      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: "rgba(39,28,21,0.1)", background: "rgba(243,237,225,0.85)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to={base} end aria-label="Cardinal Coffee, home">
            <Wordmark />
          </NavLink>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <NavLink key={l.label} to={l.to} end={l.end} className={linkClass} style={{ fontFamily: SANS }}>
                {({ isActive }) => (
                  <span style={{ color: isActive ? CARDINAL : MUTED }}>
                    {l.label}
                    {isActive && (
                      <motion.span layoutId="cardinal-nav" className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full" style={{ background: CARDINAL }} />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:block">
            <Btn>Cart · 0</Btn>
          </div>
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)} style={{ color: INK }}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t md:hidden"
              style={{ borderColor: "rgba(39,28,21,0.1)" }}
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {links.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium"
                    style={{ fontFamily: SANS, color: INK }}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      {/* footer */}
      <footer style={{ background: INK }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Wordmark dark />
              <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ fontFamily: SANS, color: CREAM_MUTE }}>
                Direct-trade coffee, roasted to order on the Oakland waterfront
                since 2017. We sign with the farm and publish what we paid.
              </p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: "#e0a35d" }}>
                Shop
              </h4>
              <ul className="mt-4 space-y-2">
                {["Single origins", "House blend", "Subscription", "Gift cards"].map((x) => (
                  <li key={x}>
                    <a href="#" className="text-sm transition-colors hover:text-white" style={{ fontFamily: SANS, color: CREAM_MUTE }}>
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: "#e0a35d" }}>
                The roastery
              </h4>
              <ul className="mt-4 space-y-2">
                {["Our sourcing", "Visit Pier 9", "Wholesale", "Journal"].map((x) => (
                  <li key={x}>
                    <a href="#" className="text-sm transition-colors hover:text-white" style={{ fontFamily: SANS, color: CREAM_MUTE }}>
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center" style={{ borderColor: "rgba(239,230,214,0.14)" }}>
            <p className="text-xs" style={{ fontFamily: MONO, color: CREAM_MUTE }}>
              © 2026 Cardinal Coffee Roasters · Oakland, California
            </p>
            <p className="text-xs" style={{ fontFamily: MONO, color: CREAM_MUTE }}>
              Roasted fresh · Shipped Mondays & Thursdays
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ root */

export default function CardinalSite() {
  const base = useBase()
  return (
    <MotionConfig reducedMotion="user">
      <Layout base={base}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route index element={<Home />} />
            <Route path="coffee" element={<CoffeePage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="roastery" element={<RoasteryPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </MotionConfig>
  )
}
