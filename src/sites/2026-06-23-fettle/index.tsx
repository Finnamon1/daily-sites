import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
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
  ArrowRight,
  ArrowUpRight,
  Compass,
  Flame,
  Menu,
  PencilRuler,
  Ruler,
  Scissors,
  SprayCan,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "FETTLE — hand-built steel bicycles, made to your measure",
  description:
    "A maker's site for FETTLE, a one-bench framebuilder cutting and brazing made-to-measure steel road and all-road bicycles in Bristol. Featured interaction: a cursor-magnetic geometry grid — a chalk-line field of ticks that scatters away from your cursor and warms to torch-orange near it, drifting on its own where there's no pointer. Plus magnetic CTAs, scroll reveals, animated counters and a scroll-drawn frame.",
  date: "2026-06-23",
  type: "Maker / workshop brand",
  interaction:
    "Cursor-magnetic geometry grid (canvas tick-field that scatters + warms near the cursor, auto-drifts on touch) + magnetic CTAs + animated counters + scroll-drawn frame",
  pages: ["Home", "Frames", "Process", "Fitting", "Workshop"],
}

/* --------------------------------------------------------------- palette */
// ink #17130d · paper #f2ebdd · panel #ece2cf · steel #8b8174
// ONE accent: torch orange #e0531f — reserved for large display, rules, icons,
// and the warm core of the geometry grid. Body copy stays ink / warm steel.
const INK = "#17130d"
const PAPER = "#f2ebdd"
const STEEL = "#8b8174"
const TORCH = "#e0531f"
// deeper torch for small text on the light paper ground (≈5:1 — clears AA);
// the bright TORCH only carries large display, icons, rules and dark-ground text.
const TORCH_DEEP = "#b23c12"

const DISPLAY = "'Fraunces', Georgia, serif"
const BODY = "'Space Grotesk', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

// duotone treatment so workshop photos sit inside the steel/torch world
const PHOTO: CSSProperties = {
  filter: "grayscale(38%) sepia(16%) saturate(112%) brightness(0.94) contrast(1.06)",
}

/* ----------------------------------------------------------------- data */

type Frame = {
  code: string
  name: string
  tube: string
  price: string
  blurb: string
  geo: { ha: string; sa: string; bb: string; reach: string }
  seed: string
}

const FRAMES: Frame[] = [
  {
    code: "F·01",
    name: "The Roadster",
    tube: "Reynolds 853 · air-hardened",
    price: "from £2,400",
    blurb:
      "A quick, lively road frame for long Sundays and the occasional bad idea up a 20% wall. Tight rear end, thin-wall main triangle, nothing wasted.",
    geo: { ha: "73.0°", sa: "73.5°", bb: "72mm drop", reach: "388mm" },
    seed: "steel-road-bicycle-orange",
  },
  {
    code: "F·02",
    name: "The All-Road",
    tube: "Columbus Spirit · niobium",
    price: "from £2,650",
    blurb:
      "One bike for the tarmac that turns to gravel without warning. Clearance for 42mm rubber, mounts for everything, mudguard eyes hidden in the dropouts.",
    geo: { ha: "71.5°", sa: "73.0°", bb: "76mm drop", reach: "392mm" },
    seed: "gravel-bicycle-workshop",
  },
  {
    code: "F·04",
    name: "The Tourer",
    tube: "Reynolds 725 · cro-mo",
    price: "from £2,300",
    blurb:
      "Built to be loaded and forgotten about. Long chainstays, a low front rack, and brazed-on bosses placed exactly where your hands go cold reaching for them.",
    geo: { ha: "71.0°", sa: "72.5°", bb: "70mm drop", reach: "384mm" },
    seed: "loaded-touring-bicycle",
  },
  {
    code: "F·06",
    name: "The Path Racer",
    tube: "Columbus Zona · double-butted",
    price: "from £2,100",
    blurb:
      "A single, stiff, stripped-back frame for the track and the early-morning city. Horizontal dropouts, no cable runs, the quiet one in the stable.",
    geo: { ha: "74.5°", sa: "74.0°", bb: "66mm drop", reach: "380mm" },
    seed: "track-fixed-bicycle-steel",
  },
]

type Step = {
  no: string
  title: string
  icon: typeof Ruler
  body: string
}

const PROCESS: Step[] = [
  {
    no: "01",
    title: "The fitting",
    icon: Ruler,
    body: "Ninety minutes on the jig with a tape, a plumb line and a notebook. We measure the body you have, not the one a sizing chart imagines for you.",
  },
  {
    no: "02",
    title: "The drawing",
    icon: PencilRuler,
    body: "Your numbers become a full-scale geometry, drawn out and argued over. You see the bike on paper — every angle, every length — before a tube is touched.",
  },
  {
    no: "03",
    title: "The mitre",
    icon: Scissors,
    body: "Tubes are cut and hand-filed to fit one another within a tenth of a millimetre. Fourteen mitres per frame, each held to the light and re-cut until it's right.",
  },
  {
    no: "04",
    title: "The braze",
    icon: Flame,
    body: "Silver and brass, lugged or fillet, drawn into the joint at the moment the steel turns straw-gold. The slowest part, and the part that decides everything.",
  },
  {
    no: "05",
    title: "The finish",
    icon: SprayCan,
    body: "Hand-filed fillets, faced and chased threads, then paint in any colour you can name. The torch-mark on the seat tube is the only thing we won't sand away.",
  },
  {
    no: "06",
    title: "The handover",
    icon: Compass,
    body: "Built up in the shop, fitted again to you, and ridden once around the block by both of us. Then it's yours for the next thirty years.",
  },
]

type Stat = { value: number; suffix: string; label: string }
const STATS: Stat[] = [
  { value: 426, suffix: "", label: "frames brazed at this bench" },
  { value: 18, suffix: "yr", label: "since the first cut tube" },
  { value: 14, suffix: "", label: "hand-filed mitres per frame" },
  { value: 16, suffix: "wk", label: "from drawing to first ride" },
]

type Owner = { quote: string; name: string; ride: string; seed: string }
const OWNERS: Owner[] = [
  {
    quote:
      "I've owned carbon bikes that cost three times as much. None of them ever felt like they were built for me. This one disappears underneath me.",
    name: "Marian Osei",
    ride: "F·02 All-Road · Pisgah green",
    seed: "cyclist-portrait-one",
  },
  {
    quote:
      "Twelve thousand loaded miles across two continents and the only thing that's needed replacing is the chain. It just keeps going.",
    name: "Tom Brautomoor",
    ride: "F·04 Tourer · raw clear-coat",
    seed: "cyclist-portrait-two",
  },
  {
    quote:
      "Stood in the workshop watching my own frame come together. You don't forget the smell of the flux or the day you pick it up.",
    name: "Priya Naylor",
    ride: "F·01 Roadster · oxblood",
    seed: "cyclist-portrait-three",
  },
]

/* ---------------------------------------------- featured: geometry grid */
/* A canvas field of tick marks laid out on a grid like chalk lines on the
   workshop floor. Ticks scatter away from the cursor and warm toward torch
   orange near it. With no pointer (touch) or reduced motion, a phantom point
   drifts a slow Lissajous path so the field is alive for everyone.          */

function GeometryGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // spring-lagged pointer
    const target = { x: -9999, y: -9999 }
    const eye = { x: -9999, y: -9999 }
    let pointerActive = false
    let t = 0

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      pointerActive = true
    }
    const onLeave = () => {
      pointerActive = false
    }

    const parent = canvas.parentElement ?? canvas
    parent.addEventListener("pointermove", onMove)
    parent.addEventListener("pointerleave", onLeave)
    window.addEventListener("resize", resize)

    const GAP = 34
    const R = 150 // influence radius
    const MAXPUSH = 24

    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)

      // phantom drift when there's no live pointer or motion is reduced
      if (!pointerActive || reduce) {
        const cx = w * (0.5 + 0.32 * Math.sin(t * 0.45))
        const cy = h * (0.5 + 0.28 * Math.sin(t * 0.63 + 1.1))
        // ease toward the phantom (slower than the real pointer)
        eye.x += (cx - eye.x) * (reduce ? 0.04 : 0.06)
        eye.y += (cy - eye.y) * (reduce ? 0.04 : 0.06)
      } else {
        eye.x += (target.x - eye.x) * 0.16
        eye.y += (target.y - eye.y) * 0.16
      }

      const cols = Math.ceil(w / GAP) + 1
      const rows = Math.ceil(h / GAP) + 1
      const offX = (w - (cols - 1) * GAP) / 2
      const offY = (h - (rows - 1) * GAP) / 2

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const bx = offX + i * GAP
          const by = offY + j * GAP
          const dx = bx - eye.x
          const dy = by - eye.y
          const dist = Math.hypot(dx, dy)
          let px = bx
          let py = by
          let warm = 0
          let len = 3 // half-length of the tick
          if (dist < R) {
            const f = 1 - dist / R // 0..1, hottest at cursor
            const ease = f * f
            const ang = Math.atan2(dy, dx)
            const push = ease * MAXPUSH
            px = bx + Math.cos(ang) * push
            py = by + Math.sin(ang) * push
            warm = ease
            len = 3 + ease * 4.5
          }

          // colour: faint steel far away, torch orange at the core
          const baseA = 0.16 + warm * 0.7
          if (warm > 0.04) {
            ctx.strokeStyle = `rgba(224, 83, 31, ${0.25 + warm * 0.65})`
          } else {
            ctx.strokeStyle = `rgba(139, 129, 116, ${baseA})`
          }
          ctx.lineWidth = warm > 0.5 ? 1.4 : 1
          // draw a small "+" tick — the chalk-line cross
          ctx.beginPath()
          ctx.moveTo(px - len, py)
          ctx.lineTo(px + len, py)
          ctx.moveTo(px, py - len)
          ctx.lineTo(px, py + len)
          ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      parent.removeEventListener("pointermove", onMove)
      parent.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("resize", resize)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  )
}

/* ----------------------------------------------------------- primitives */

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [n, setN] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref} style={{ fontFamily: MONO }}>
      {n}
      {suffix}
    </span>
  )
}

function Mbutton({
  children,
  onDark = false,
}: {
  children: ReactNode
  onDark?: boolean
}) {
  return (
    <Magnetic strength={0.35}>
      <span
        className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200"
        style={{
          fontFamily: BODY,
          background: onDark ? TORCH : INK,
          color: onDark ? INK : PAPER,
        }}
      >
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Magnetic>
  )
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em]"
      style={{ fontFamily: MONO, color: dark ? STEEL : "#6f675b" }}
    >
      <span style={{ width: 22, height: 1, background: TORCH }} />
      {children}
    </span>
  )
}

function Photo({
  seed,
  w,
  h,
  alt,
  className,
  ratio = "aspect-[4/5]",
}: {
  seed: string
  w: number
  h: number
  alt: string
  className?: string
  ratio?: string
}) {
  return (
    <div
      className={`overflow-hidden ${ratio} ${className ?? ""}`}
      style={{ border: `1px solid ${INK}1a` }}
    >
      <img
        src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
        style={PHOTO}
      />
    </div>
  )
}

/* ----------------------------------------------------- scroll-drawn frame */
/* A diamond bicycle frame whose tubes draw themselves in as it enters view. */

function DrawnFrame() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const reduce = useReducedMotion()
  const show = inView || reduce

  // tube segments of a classic diamond frame (viewBox 0..300 x 0..200)
  const tubes = [
    { d: "M70 150 L150 60", label: "down" }, // down tube
    { d: "M150 60 L235 150", label: "top" }, // top tube
    { d: "M150 60 L120 150", label: "seat" }, // seat tube
    { d: "M120 150 L70 150", label: "chain" }, // chainstay
    { d: "M120 150 L150 60", label: "seat2" },
    { d: "M235 150 L120 150", label: "front-down" },
    { d: "M150 60 L165 40", label: "seatpost" },
  ]

  return (
    <div ref={ref} className="relative w-full">
      <svg viewBox="0 0 300 200" className="w-full" role="img" aria-label="Outline of a steel diamond bicycle frame">
        {/* wheels */}
        {[70, 235].map((cx) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={150}
            r={34}
            fill="none"
            stroke={STEEL}
            strokeWidth={1}
            strokeDasharray="2 4"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={show ? { opacity: 0.6, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            style={{ transformOrigin: `${cx}px 150px` }}
          />
        ))}
        {tubes.map((tube, i) => (
          <motion.path
            key={tube.label}
            d={tube.d}
            fill="none"
            stroke={i === 2 ? TORCH : INK}
            strokeWidth={i === 2 ? 3 : 2.4}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={show ? { pathLength: 1 } : {}}
            transition={{ duration: reduce ? 0 : 0.7, delay: 0.25 + i * 0.14, ease: "easeInOut" }}
          />
        ))}
        {/* head + bb nodes */}
        {[
          [150, 60],
          [120, 150],
          [235, 150],
          [70, 150],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={3.4}
            fill={TORCH}
            initial={{ scale: 0 }}
            animate={show ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 1 + i * 0.1, ease: "backOut" }}
          />
        ))}
      </svg>
    </div>
  )
}

/* ----------------------------------------------------------------- pages */

function Home({ base }: { base: string }) {
  return (
    <div>
      {/* hero with the geometry grid */}
      <section className="relative overflow-hidden" style={{ background: INK }}>
        <div className="absolute inset-0">
          <GeometryGrid />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 8%, transparent 40%, #17130dcc 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 md:pb-32 md:pt-36">
          <Eyebrow dark>Bristol · est. 2008 · one bench</Eyebrow>
          <h1
            className="mt-7 max-w-4xl text-[clamp(2.7rem,8vw,6rem)] font-light leading-[0.95]"
            style={{ fontFamily: DISPLAY, color: PAPER, letterSpacing: "-0.02em" }}
          >
            Steel bicycles,
            <br />
            <span style={{ fontStyle: "italic", color: TORCH }}>cut to your</span> measure.
          </h1>
          <p
            className="mt-8 max-w-xl text-lg leading-relaxed"
            style={{ fontFamily: BODY, color: "#cabfac" }}
          >
            FETTLE is one builder, one bench, and a torch. Every frame is mitred and
            brazed by hand to a geometry drawn around your body — not pulled from a
            size chart. Move your cursor across the floor; the chalk lines move with you.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <NavLink to={`${base}/fitting`}>
              <Mbutton onDark>Book a fitting</Mbutton>
            </NavLink>
            <NavLink
              to={`${base}/frames`}
              className="text-sm font-medium underline-offset-4 transition hover:underline"
              style={{ fontFamily: BODY, color: PAPER }}
            >
              See the four frames →
            </NavLink>
          </div>
        </div>
      </section>

      {/* manifesto strip */}
      <section className="border-b" style={{ background: PAPER, borderColor: `${INK}14` }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <Reveal>
            <p
              className="text-[clamp(1.5rem,3.2vw,2.4rem)] font-light leading-[1.25]"
              style={{ fontFamily: DISPLAY, color: INK }}
            >
              A bike should fit like a good jacket — close, easy, and quietly yours.
              We build the frame; the frame builds the next thirty years of riding.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <DrawnFrame />
          </Reveal>
        </div>
      </section>

      {/* counters */}
      <section style={{ background: INK }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 py-4 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="px-2 py-12 text-center md:py-16">
                <div
                  className="text-[clamp(2.4rem,5vw,3.6rem)] font-light leading-none"
                  style={{ color: TORCH }}
                >
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </div>
                <p
                  className="mx-auto mt-3 max-w-[14ch] text-xs leading-relaxed"
                  style={{ fontFamily: BODY, color: "#a89e8c" }}
                >
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured frames preview */}
      <section style={{ background: PAPER }}>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>The stable</Eyebrow>
              <h2
                className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-light leading-none"
                style={{ fontFamily: DISPLAY, color: INK }}
              >
                Four frames. Each one yours.
              </h2>
            </div>
            <NavLink
              to={`${base}/frames`}
              className="text-sm font-medium"
              style={{ fontFamily: BODY, color: TORCH_DEEP }}
            >
              All frames & geometry →
            </NavLink>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FRAMES.slice(0, 2).map((f, i) => (
              <Reveal key={f.code} delay={i * 0.1}>
                <FrameCard frame={f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function FrameCard({ frame }: { frame: Frame }) {
  return (
    <article className="group flex h-full flex-col" style={{ background: "#ece2cf", border: `1px solid ${INK}14` }}>
      <Photo
        seed={frame.seed}
        w={720}
        h={520}
        alt={`${frame.name}, a steel ${frame.tube} bicycle frame`}
        ratio="aspect-[7/5]"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-normal" style={{ fontFamily: DISPLAY, color: INK }}>
            {frame.name}
          </h3>
          <span className="text-xs" style={{ fontFamily: MONO, color: TORCH_DEEP }}>
            {frame.code}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wider" style={{ fontFamily: MONO, color: STEEL }}>
          {frame.tube}
        </p>
        <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ fontFamily: BODY, color: "#4a4337" }}>
          {frame.blurb}
        </p>
        <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: `${INK}14` }}>
          <span className="text-sm font-medium" style={{ fontFamily: BODY, color: INK }}>
            {frame.price}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium transition group-hover:gap-2" style={{ fontFamily: BODY, color: TORCH_DEEP }}>
            Geometry <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  )
}

function Frames() {
  return (
    <div style={{ background: PAPER }}>
      <PageHead
        eyebrow="The stable · four frames"
        title="Every frame begins as a flat drawing."
        lead="There is no size small, medium or large here. Each frame is drawn to a rider, then cut. Below are the four families we build from — the starting points we'll bend toward you."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {FRAMES.map((f, i) => (
            <Reveal key={f.code} delay={(i % 2) * 0.08}>
              <article className="flex h-full flex-col" style={{ background: "#ece2cf", border: `1px solid ${INK}14` }}>
                <Photo
                  seed={f.seed}
                  w={760}
                  h={500}
                  alt={`${f.name} — ${f.tube}`}
                  ratio="aspect-[19/12]"
                />
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>
                      {f.name}
                    </h3>
                    <span className="text-xs" style={{ fontFamily: MONO, color: TORCH_DEEP }}>{f.code}</span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wider" style={{ fontFamily: MONO, color: STEEL }}>
                    {f.tube}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ fontFamily: BODY, color: "#4a4337" }}>
                    {f.blurb}
                  </p>
                  {/* geometry table */}
                  <dl className="mt-6 grid grid-cols-4 gap-3 border-t pt-5" style={{ borderColor: `${INK}14` }}>
                    {[
                      ["Head", f.geo.ha],
                      ["Seat", f.geo.sa],
                      ["BB", f.geo.bb],
                      ["Reach", f.geo.reach],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[10px] uppercase tracking-widest" style={{ fontFamily: MONO, color: STEEL }}>
                          {k}
                        </dt>
                        <dd className="mt-1 text-sm" style={{ fontFamily: MONO, color: INK }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 text-sm font-medium" style={{ fontFamily: BODY, color: INK }}>
                    {f.price}{" "}
                    <span style={{ color: STEEL }}>· frame, fork & headset</span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

function Process({ base }: { base: string }) {
  return (
    <div style={{ background: PAPER }}>
      <PageHead
        eyebrow="From body to bicycle"
        title="Sixteen weeks, six rooms, one pair of hands."
        lead="Nothing here is sub-contracted and nothing is rushed. This is the road every FETTLE frame travels — from the tape measure on day one to the first ride around the block with you."
      />
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="relative">
          {/* spine */}
          <div className="absolute left-[27px] top-2 hidden h-[calc(100%-2rem)] w-px md:block" style={{ background: `${INK}1f` }} />
          <ol className="space-y-12">
            {PROCESS.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.no} delay={i * 0.05}>
                  <li className="grid gap-5 md:grid-cols-[56px_1fr] md:gap-8">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                      style={{ background: i === 3 ? TORCH : INK }}
                    >
                      <Icon className="h-5 w-5" style={{ color: i === 3 ? INK : PAPER }} />
                    </div>
                    <div className="pt-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs" style={{ fontFamily: MONO, color: TORCH_DEEP }}>{s.no}</span>
                        <h3 className="text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>
                          {s.title}
                        </h3>
                      </div>
                      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: "#4a4337" }}>
                        {s.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </section>

      <section style={{ background: INK }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <Photo
              seed="brazing-torch-flame-steel"
              w={760}
              h={760}
              alt="A brazing torch heating a lugged steel joint to straw-gold"
              ratio="aspect-square"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <Eyebrow dark>The braze · step 04</Eyebrow>
              <h3 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight" style={{ fontFamily: DISPLAY, color: PAPER }}>
                The slowest part decides everything.
              </h3>
              <p className="mt-5 max-w-md text-base leading-relaxed" style={{ fontFamily: BODY, color: "#cabfac" }}>
                Brass flows at around 870°C; silver lower. Read the colour of the steel
                wrong by a hundred degrees and the joint is either starved or burnt. There
                is no undo — only the patience to let the metal tell you when it's ready.
              </p>
              <div className="mt-8">
                <NavLink to={`${base}/fitting`}>
                  <Mbutton onDark>Start with a fitting</Mbutton>
                </NavLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function Fitting({ base }: { base: string }) {
  const [sent, setSent] = useState(false)
  return (
    <div style={{ background: PAPER }}>
      <PageHead
        eyebrow="Where every frame starts"
        title="Come and stand on the jig."
        lead="A fitting is ninety minutes, a flat white, and a great deal of measuring. No obligation to buy — most people leave with a drawing and a week to think. Tell us a little and we'll find you a Saturday."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
          {/* details */}
          <Reveal>
            <div>
              <Photo
                seed="bicycle-fitting-jig-studio"
                w={760}
                h={560}
                alt="A fitting jig set up in a steel-framing workshop"
                ratio="aspect-[19/14]"
              />
              <dl className="mt-8 space-y-5">
                {[
                  ["The workshop", "Unit 7, Stokes Croft Yards, Bristol BS2"],
                  ["Fittings", "Saturdays, by appointment · 90 minutes"],
                  ["The cost", "£80, redeemed in full against a frame"],
                  ["Lead time", "≈ 16 weeks from drawing to first ride"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col border-b pb-4" style={{ borderColor: `${INK}14` }}>
                    <dt className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: TORCH_DEEP }}>
                      {k}
                    </dt>
                    <dd className="mt-1.5 text-[15px]" style={{ fontFamily: BODY, color: INK }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* enquiry form */}
          <Reveal delay={0.1}>
            <div className="p-7 md:p-9" style={{ background: INK }}>
              {sent ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: TORCH }}>
                    <Ruler className="h-6 w-6" style={{ color: INK }} />
                  </div>
                  <h3 className="mt-6 text-2xl" style={{ fontFamily: DISPLAY, color: PAPER }}>
                    Your tape's reserved.
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ fontFamily: BODY, color: "#cabfac" }}>
                    We'll be in touch within two working days with a few Saturdays to choose from.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-7 text-xs underline underline-offset-4"
                    style={{ fontFamily: MONO, color: STEEL }}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                  className="space-y-5"
                >
                  <Eyebrow dark>Request a fitting</Eyebrow>
                  <Field label="Your name" id="name" placeholder="Alex Morrow" />
                  <Field label="Email" id="email" type="email" placeholder="alex@example.com" />
                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: STEEL }}>
                      Which frame are you drawn to?
                    </label>
                    <select
                      className="w-full rounded-none border bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-[#e0531f]"
                      style={{ fontFamily: BODY, color: PAPER, borderColor: "#3a342a" }}
                      defaultValue=""
                    >
                      <option value="" disabled style={{ color: INK }}>
                        Still deciding…
                      </option>
                      {FRAMES.map((f) => (
                        <option key={f.code} value={f.code} style={{ color: INK }}>
                          {f.code} · {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="note" className="mb-2 block text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: STEEL }}>
                      How do you ride?
                    </label>
                    <textarea
                      id="note"
                      rows={3}
                      placeholder="Long weekends, the odd race, a tour every summer…"
                      className="w-full resize-none rounded-none border bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-[#5c5547] focus:border-[#e0531f]"
                      style={{ fontFamily: BODY, color: PAPER, borderColor: "#3a342a" }}
                    />
                  </div>
                  <button type="submit" className="w-full">
                    <span
                      className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5"
                      style={{ fontFamily: BODY, background: TORCH, color: INK }}
                    >
                      Send enquiry <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                  <p className="text-center text-[11px]" style={{ fontFamily: MONO, color: STEEL }}>
                    No deposit taken now · we'll confirm by email
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm" style={{ fontFamily: BODY, color: "#4a4337" }}>
            Not ready to measure? Read how a frame comes together first.
          </p>
          <NavLink
            to={`${base}/process`}
            className="mt-3 inline-block text-sm font-medium"
            style={{ fontFamily: BODY, color: TORCH_DEEP }}
          >
            See the process →
          </NavLink>
        </div>
      </section>
    </div>
  )
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string
  id: string
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: STEEL }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-none border bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-[#5c5547] focus:border-[#e0531f]"
        style={{ fontFamily: BODY, color: PAPER, borderColor: "#3a342a" }}
      />
    </div>
  )
}

function Workshop() {
  return (
    <div style={{ background: PAPER }}>
      <PageHead
        eyebrow="The bench, the builder"
        title="One person, since a bike got stolen in 2008."
        lead="FETTLE is Dale Renn — a former structural welder who couldn't replace a stolen frame he loved, so he built a better one. Two thousand hours of mistakes later, the orders started. The bench hasn't moved since."
      />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <Reveal>
            <Photo
              seed="framebuilder-workshop-interior-tools"
              w={900}
              h={620}
              alt="The interior of a one-bench framebuilding workshop, tubes racked on the wall"
              ratio="aspect-[3/2]"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5">
              <p className="text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: "#4a4337" }}>
                Everything happens in one room: a brazing hearth, a surface plate older
                than the builder, a paint booth bolted into the corner. No production
                line, no waiting list of forty. Just the frame in front, then the next.
              </p>
              <p className="text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: "#4a4337" }}>
                Roughly twenty-six frames leave here a year. That number won't grow —
                it's the most a single careful pair of hands can do without the work
                starting to lie about itself.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* owners */}
      <section style={{ background: INK }}>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Eyebrow dark>People who ride them</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight" style={{ fontFamily: DISPLAY, color: PAPER }}>
            A frame is only finished when it's worn in.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OWNERS.map((o, i) => (
              <Reveal key={o.name} delay={i * 0.1}>
                <figure className="flex h-full flex-col p-7" style={{ background: "#211b13", border: "1px solid #322a1f" }}>
                  <Flame className="h-5 w-5" style={{ color: TORCH }} />
                  <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: "#e6dcc8", fontStyle: "italic" }}>
                    "{o.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: "#322a1f" }}>
                    <img
                      src={`https://picsum.photos/seed/${o.seed}/96/96`}
                      alt={`${o.name}, FETTLE owner`}
                      width={44}
                      height={44}
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover"
                      style={PHOTO}
                    />
                    <div>
                      <div className="text-sm font-medium" style={{ fontFamily: BODY, color: PAPER }}>
                        {o.name}
                      </div>
                      <div className="text-[11px]" style={{ fontFamily: MONO, color: STEEL }}>
                        {o.ride}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function PageHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: string
  lead: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12 pt-20 md:pt-28">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-[clamp(2.2rem,5.5vw,4rem)] font-light leading-[1.02]" style={{ fontFamily: DISPLAY, color: INK, letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ fontFamily: BODY, color: "#4a4337" }}>
          {lead}
        </p>
      </Reveal>
    </section>
  )
}

/* ---------------------------------------------------------------- layout */

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/frames`, label: "Frames", end: false },
    { to: `${base}/process`, label: "Process", end: false },
    { to: `${base}/fitting`, label: "Fitting", end: false },
    { to: `${base}/workshop`, label: "Workshop", end: false },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm transition-colors duration-200 ${isActive ? "" : "hover:opacity-100"}`

  return (
    <div style={{ background: PAPER, color: INK }}>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{ background: "#f2ebddd9", borderColor: `${INK}14` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to={base} end className="flex items-baseline gap-2">
            <span className="text-xl font-medium tracking-tight" style={{ fontFamily: DISPLAY, color: INK }}>
              FETTLE
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.3em] sm:inline" style={{ fontFamily: MONO, color: TORCH_DEEP }}>
              framebuilder
            </span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <NavLink key={l.label} to={l.to} end={l.end} className={linkClass}>
                {({ isActive }) => (
                  <span style={{ fontFamily: BODY, color: isActive ? TORCH_DEEP : "#4a4337" }}>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="fettle-nav"
                        className="absolute -bottom-1.5 left-0 h-px w-full"
                        style={{ background: TORCH }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
            <NavLink to={`${base}/fitting`}>
              <span
                className="rounded-full px-4 py-2 text-xs font-medium transition-transform duration-200 hover:-translate-y-0.5"
                style={{ fontFamily: BODY, background: INK, color: PAPER }}
              >
                Book a fitting
              </span>
            </NavLink>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              style={{ borderColor: `${INK}14` }}
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {links.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    end={l.end}
                    className="py-2.5 text-base"
                    style={({ isActive }) => ({ fontFamily: BODY, color: isActive ? TORCH_DEEP : INK })}
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

      <footer style={{ background: INK }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <span className="text-2xl font-medium" style={{ fontFamily: DISPLAY, color: PAPER }}>
                FETTLE
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ fontFamily: BODY, color: "#a89e8c" }}>
                Made-to-measure steel bicycles, mitred and brazed one at a time in
                Bristol. Cut to your body, painted to your taste, built to outlast you.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: TORCH }}>
                Visit
              </h4>
              <ul className="mt-4 space-y-2 text-sm" style={{ fontFamily: BODY, color: "#cabfac" }}>
                <li>Unit 7, Stokes Croft Yards</li>
                <li>Bristol BS2 8RT</li>
                <li>Saturdays by appointment</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: TORCH }}>
                Reach the bench
              </h4>
              <ul className="mt-4 space-y-2 text-sm" style={{ fontFamily: BODY, color: "#cabfac" }}>
                <li>dale@fettlecycles.cc</li>
                <li>+44 117 496 0182</li>
                <li>@fettle.framebuilder</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 md:flex-row md:items-center" style={{ borderColor: "#2a241a" }}>
            <p className="text-xs" style={{ fontFamily: MONO, color: STEEL }}>
              © 2026 FETTLE Cycles · every frame numbered & signed
            </p>
            <p className="text-xs" style={{ fontFamily: MONO, color: STEEL }}>
              Steel · silver · brass · patience
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ----------------------------------------------------------- default export */

export default function Fettle() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <Layout base={base}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Routes location={location}>
              <Route index element={<Home base={base} />} />
              <Route path="frames" element={<Frames />} />
              <Route path="process" element={<Process base={base} />} />
              <Route path="fitting" element={<Fitting base={base} />} />
              <Route path="workshop" element={<Workshop />} />
              <Route path="*" element={<Home base={base} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Layout>
    </MotionConfig>
  )
}
