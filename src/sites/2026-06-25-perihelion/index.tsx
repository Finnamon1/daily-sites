import {
  useEffect,
  useMemo,
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
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import {
  ArrowUpRight,
  Compass,
  Menu,
  Moon,
  MountainSnow,
  Sparkles,
  Telescope,
  Wind,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Perihelion — a dark-sky field station on the edge of the Atacama",
  description:
    "Perihelion Field Station sits at 2,900 m on Cerro Lágrimas, under a Bortle 1 sky. Guided night sessions, a 0.6 m astrograph, and six glass-roofed observation suites. Featured interaction: a cursor-traced constellation map — the whole starfield parallaxes to your pointer and each constellation draws itself in (hover or keyboard) with live RA/Dec and the month it's best seen. Plus magnetic CTAs, a coordinate marquee, animated counters and scroll reveals.",
  date: "2026-06-25",
  type: "Travel guide / astronomy retreat",
  interaction:
    "Cursor-traced parallax constellation map — hover or tab a constellation and it draws itself in with live coordinates; the whole star layer parallaxes to the pointer. Plus magnetic CTAs, coordinate marquee, animated counters & scroll reveals",
  pages: ["Home", "Sky", "Stay", "Visit"],
}

/* --------------------------------------------------------------- palette */
// night ink #070a12 · panels in cool slate · ONE warm accent: brass starlight #e3a64a
const INK = "#070a12"
const PANEL = "#0d121e"
const PANEL_2 = "#141b2b"
const LINE = "rgba(150,170,205,0.14)"
const BONE = "#ece9e0" // primary text, ~15:1 on ink
const MUTE = "#9aa6bd" // muted text, ~7.5:1 on ink
const FAINT = "#7d889f" // faintest label tier — ~5.4:1 on ink, clears AA
const BRASS = "#e3a64a" // accent, ~9.6:1 on ink
const BRASS_DK = "#c4862c"
const STAR = "#cfe2f2" // cool star white for constellation lines

const DISPLAY = "'Fraunces', Georgia, serif"
const SANS = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

/* ----------------------------------------------------------------- utils */

function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

/* ----------------------------------------------------------- constellations */

type Star = { x: number; y: number; m: number } // m = visual magnitude weight 0..1
type Constellation = {
  id: string
  name: string
  abbr: string
  ra: string
  dec: string
  best: string
  blurb: string
  stars: Star[]
  edges: [number, number][]
}

// Coordinates are normalised to a 1000 × 600 viewBox, hand-placed to read as shapes.
const CONSTELLATIONS: Constellation[] = [
  {
    id: "crux",
    name: "Crux",
    abbr: "Cru",
    ra: "12h 26m",
    dec: "−63° 06′",
    best: "Overhead, all year",
    blurb:
      "The Southern Cross rides the meridian every night here. Its foot, Acrux, points the way south — and beside it the Coalsack, a dark nebula you can find with bare eyes.",
    stars: [
      { x: 792, y: 96, m: 1 },
      { x: 812, y: 250, m: 1 },
      { x: 712, y: 182, m: 0.8 },
      { x: 884, y: 168, m: 0.7 },
      { x: 760, y: 158, m: 0.5 },
    ],
    edges: [
      [0, 1],
      [2, 3],
    ],
  },
  {
    id: "scorpius",
    name: "Scorpius",
    abbr: "Sco",
    ra: "16h 53m",
    dec: "−34° 18′",
    best: "May – August",
    blurb:
      "The scorpion hooks across the southern sky, red Antares burning at its heart. Its tail curls into the brightest reach of the Milky Way — the Galactic Core, rising out of the desert.",
    stars: [
      { x: 96, y: 318, m: 0.9 },
      { x: 150, y: 300, m: 0.7 },
      { x: 196, y: 312, m: 1 },
      { x: 232, y: 352, m: 0.6 },
      { x: 244, y: 408, m: 0.7 },
      { x: 218, y: 452, m: 0.8 },
      { x: 168, y: 470, m: 0.6 },
      { x: 122, y: 452, m: 0.7 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
  {
    id: "orion",
    name: "Orion",
    abbr: "Ori",
    ra: "05h 35m",
    dec: "−01° 12′",
    best: "November – February",
    blurb:
      "Seen upended from the south, the hunter is unmistakable: the three-star belt, and slung beneath it the Orion Nebula — a stellar nursery you can resolve in the 0.6 m astrograph.",
    stars: [
      { x: 452, y: 150, m: 1 }, // Betelgeuse
      { x: 556, y: 168, m: 0.8 }, // Bellatrix
      { x: 470, y: 268, m: 0.7 }, // belt
      { x: 502, y: 286, m: 0.7 },
      { x: 534, y: 304, m: 0.7 },
      { x: 440, y: 404, m: 0.9 }, // Rigel
      { x: 566, y: 420, m: 0.8 }, // Saiph
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
      [5, 6],
    ],
  },
  {
    id: "centaurus",
    name: "Centaurus",
    abbr: "Cen",
    ra: "13h 49m",
    dec: "−47° 17′",
    best: "March – June",
    blurb:
      "The two pointer stars, Alpha and Beta Centauri, hang low and brilliant. Alpha is the nearest star system to our own — four light-years, and a single bright spark to the eye.",
    stars: [
      { x: 624, y: 462, m: 1 },
      { x: 690, y: 486, m: 0.9 },
      { x: 742, y: 446, m: 0.7 },
      { x: 786, y: 498, m: 0.6 },
      { x: 712, y: 540, m: 0.6 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
    ],
  },
]

function centroid(c: Constellation) {
  const x = c.stars.reduce((a, s) => a + s.x, 0) / c.stars.length
  const y = c.stars.reduce((a, s) => a + s.y, 0) / c.stars.length
  return { x, y }
}
function bbox(c: Constellation) {
  const xs = c.stars.map((s) => s.x)
  const ys = c.stars.map((s) => s.y)
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
  }
}

/* --------------------------------------------------- featured: SkyMap */

type Layer = { x: number; y: number; r: number; o: number }

function useBackgroundStars(seed: number, count: number, depth: number) {
  return useMemo<Layer[]>(() => {
    const rnd = makeRng(seed)
    return Array.from({ length: count }, () => ({
      x: rnd() * 1000,
      y: rnd() * 600,
      r: 0.4 + rnd() * (0.7 + depth * 0.9),
      o: 0.18 + rnd() * (0.25 + depth * 0.4),
    }))
  }, [seed, count, depth])
}

function SkyMap({
  height = 560,
  interactive = true,
}: {
  height?: number
  interactive?: boolean
}) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)

  // pointer parallax — normalised -0.5..0.5, springed
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })

  const far = useBackgroundStars(1337, 90, 0)
  const mid = useBackgroundStars(7919, 55, 1)
  const near = useBackgroundStars(4242, 26, 2)

  // each layer translates by a different factor for depth
  const farX = useParallax(sx, 8)
  const farY = useParallax(sy, 6)
  const midX = useParallax(sx, 18)
  const midY = useParallax(sy, 14)
  const nearX = useParallax(sx, 34)
  const nearY = useParallax(sy, 26)

  function onMove(e: React.PointerEvent) {
    if (reduce) return
    const r = wrapRef.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    px.set(0)
    py.set(0)
  }

  const activeC = CONSTELLATIONS.find((c) => c.id === active) || null

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative w-full overflow-hidden rounded-[20px]"
      style={{
        height,
        background:
          "radial-gradient(120% 90% at 50% -10%, #101a2c 0%, #0a0f1b 42%, #060912 100%)",
        border: `1px solid ${LINE}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* low warm horizon glow — desert airglow, not a purple gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(227,166,74,0.12), rgba(227,166,74,0.03) 45%, transparent)",
        }}
      />

      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role={interactive ? "group" : "img"}
        aria-label="Star map of the southern sky over Perihelion. Constellations Crux, Scorpius, Orion and Centaurus."
      >
        {/* parallax background layers */}
        <motion.g style={{ x: farX, y: farY }}>
          {far.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={STAR} opacity={s.o} />
          ))}
        </motion.g>
        <motion.g style={{ x: midX, y: midY }}>
          {mid.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={STAR} opacity={s.o} />
          ))}
        </motion.g>
        <motion.g style={{ x: nearX, y: nearY }}>
          {near.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.o} />
          ))}

          {/* constellations live in the nearest layer */}
          {CONSTELLATIONS.map((c) => (
            <ConstellationGroup
              key={c.id}
              c={c}
              active={active === c.id}
              dim={active !== null && active !== c.id}
              interactive={interactive}
              onActivate={() => setActive(c.id)}
              onClear={() => setActive((a) => (a === c.id ? null : a))}
            />
          ))}
        </motion.g>
      </svg>

      {/* readout */}
      <AnimatePresence>
        {activeC && (
          <motion.div
            key={activeC.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm"
          >
            <div
              className="rounded-xl p-4 backdrop-blur-md"
              style={{
                background: "rgba(10,15,26,0.78)",
                border: `1px solid ${LINE}`,
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  className="text-xl"
                  style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 500 }}
                >
                  {activeC.name}
                </h3>
                <span style={{ fontFamily: MONO, color: BRASS, fontSize: 12 }}>
                  {activeC.abbr.toUpperCase()}
                </span>
              </div>
              <div
                className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5"
                style={{ fontFamily: MONO, fontSize: 11, color: FAINT }}
              >
                <span>RA {activeC.ra}</span>
                <span>DEC {activeC.dec}</span>
                <span style={{ color: MUTE }}>{activeC.best}</span>
              </div>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: MUTE, fontFamily: SANS }}
              >
                {activeC.blurb}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {interactive && (
        <div
          className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full px-3 py-1.5 sm:flex"
          style={{
            background: "rgba(10,15,26,0.6)",
            border: `1px solid ${LINE}`,
            fontFamily: MONO,
            fontSize: 11,
            color: MUTE,
          }}
        >
          <Compass className="h-3.5 w-3.5" style={{ color: BRASS }} />
          {activeC ? "tracing — move on" : "hover or tab a constellation"}
        </div>
      )}
    </div>
  )
}

// derive a translated motion value from a normalised -0.5..0.5 source
function useParallax(v: ReturnType<typeof useSpring>, factor: number) {
  const out = useMotionValue(0)
  useEffect(() => {
    const unsub = v.on("change", (val) => out.set(val * factor * 2))
    return () => unsub()
  }, [v, factor, out])
  return out
}

function ConstellationGroup({
  c,
  active,
  dim,
  interactive,
  onActivate,
  onClear,
}: {
  c: Constellation
  active: boolean
  dim: boolean
  interactive: boolean
  onActivate: () => void
  onClear: () => void
}) {
  const box = bbox(c)
  const ctr = centroid(c)
  const pad = 34

  return (
    <g style={{ opacity: dim ? 0.4 : 1, transition: "opacity 0.3s" }}>
      {/* connecting lines, drawn in on activate */}
      {c.edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={c.stars[a].x}
          y1={c.stars[a].y}
          x2={c.stars[b].x}
          y2={c.stars[b].y}
          stroke={STAR}
          strokeWidth={1.4}
          strokeLinecap="round"
          initial={false}
          animate={{
            pathLength: active ? 1 : 0,
            opacity: active ? 0.85 : 0,
          }}
          transition={{ duration: 0.5, delay: active ? i * 0.05 : 0 }}
        />
      ))}

      {/* the stars themselves */}
      {c.stars.map((s, i) => (
        <g key={i}>
          {active && (
            <motion.circle
              cx={s.x}
              cy={s.y}
              r={3 + s.m * 5}
              fill={BRASS}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.18 }}
              transition={{ duration: 0.4 }}
            />
          )}
          <circle
            cx={s.x}
            cy={s.y}
            r={1.4 + s.m * 2.1}
            fill={active ? "#fff" : STAR}
            opacity={active ? 1 : 0.55 + s.m * 0.3}
          />
        </g>
      ))}

      {/* label appears on activate, anchored above the shape */}
      {active && (
        <motion.text
          x={ctr.x}
          y={box.y - 14}
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: 2,
            fill: BRASS,
          }}
        >
          {c.name.toUpperCase()}
        </motion.text>
      )}

      {/* hit area — pointer + keyboard */}
      {interactive && (
        <rect
          x={box.x - pad}
          y={box.y - pad}
          width={box.w + pad * 2}
          height={box.h + pad * 2}
          fill="transparent"
          tabIndex={0}
          role="button"
          aria-label={`${c.name}. Right ascension ${c.ra}, declination ${c.dec}. Best seen ${c.best}.`}
          style={{ cursor: "crosshair", outline: "none" }}
          onPointerEnter={onActivate}
          onPointerLeave={onClear}
          onFocus={onActivate}
          onBlur={onClear}
        />
      )}
    </g>
  )
}

/* --------------------------------------------------------- small pieces */

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
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} style={{ fontFamily: DISPLAY }}>
      {prefix}
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 3, color: BRASS }}
    >
      <span style={{ width: 18, height: 1, background: BRASS_DK }} />
      {children}
    </span>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const items = [
    "RA 12h26m",
    "Crux",
    "DEC −63°06′",
    "Bortle 1",
    "RA 16h53m",
    "Scorpius",
    "Antares · α Sco",
    "318 clear nights",
    "RA 05h35m",
    "Orion Nebula · M42",
    "DEC −01°12′",
    "2,900 m",
    "RA 13h49m",
    "Centaurus",
    "4.37 ly",
  ]
  const row = [...items, ...items]
  return (
    <div
      className="relative flex overflow-hidden border-y py-4"
      style={{ borderColor: LINE, background: PANEL }}
    >
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 34, ease: "linear", repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span
              style={{
                fontFamily: MONO,
                fontSize: 13,
                color: i % 2 ? BONE : MUTE,
                letterSpacing: 1,
              }}
            >
              {t}
            </span>
            <Sparkles className="h-3 w-3" style={{ color: BRASS_DK }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function ButtonLink({
  to,
  children,
  variant = "solid",
}: {
  to: string
  children: ReactNode
  variant?: "solid" | "ghost"
}) {
  return (
    <Magnetic strength={0.3}>
      <NavLink
        to={to}
        className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-colors duration-200"
        style={
          variant === "solid"
            ? { background: BRASS, color: "#10131c", fontWeight: 600, fontFamily: SANS }
            : {
                color: BONE,
                border: `1px solid ${LINE}`,
                fontWeight: 500,
                fontFamily: SANS,
              }
        }
      >
        {children}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </NavLink>
    </Magnetic>
  )
}

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span style={{ fontFamily: MONO, fontSize: 12, color: FAINT }}>{n}</span>
      <h2
        className="text-3xl sm:text-4xl"
        style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 400, letterSpacing: -0.5 }}
      >
        {title}
      </h2>
    </div>
  )
}

/* ------------------------------------------------------------ page wrap */

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

const wrap = "mx-auto w-full max-w-6xl px-5 sm:px-8"

/* ------------------------------------------------------------------ Home */

function Home({ base }: { base: string }) {
  return (
    <Page>
      {/* hero */}
      <section className={cn(wrap, "pt-12 sm:pt-20")}>
        <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <Eyebrow>CERRO LÁGRIMAS · 30°24′S</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                className="mt-5 text-[clamp(2.7rem,7vw,5rem)] leading-[0.98]"
                style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 300, letterSpacing: -1.5 }}
              >
                The sky,
                <br />
                <span style={{ fontStyle: "italic", fontWeight: 400 }}>returned</span> to you.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p
                className="mt-6 max-w-md text-lg leading-relaxed"
                style={{ color: MUTE, fontFamily: SANS }}
              >
                A small dark-sky field station at 2,900 metres on the edge of the
                Atacama — six glass-roofed suites, a 0.6&nbsp;metre astrograph, and
                a sky so deep it casts shadows.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink to={`${base}/visit`}>Reserve a night</ButtonLink>
                <ButtonLink to={`${base}/sky`} variant="ghost">
                  See the sky calendar
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <SkyMap height={420} />
          </Reveal>
        </div>
      </section>

      {/* stats */}
      <section className={cn(wrap, "mt-20")}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {[
            { v: <Counter to={318} />, l: "clear nights / year" },
            { v: <Counter to={1} />, l: "Bortle sky class" },
            { v: <Counter to={2900} suffix=" m" />, l: "above sea level" },
            { v: <Counter to={6.8} decimals={1} />, l: "limiting magnitude" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="border-l pl-4" style={{ borderColor: LINE }}>
                <div className="text-4xl sm:text-5xl" style={{ color: BONE }}>
                  {s.v}
                </div>
                <div
                  className="mt-2 text-sm"
                  style={{ color: FAINT, fontFamily: MONO, letterSpacing: 0.5 }}
                >
                  {s.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mt-20">
        <Marquee />
      </div>

      {/* featured interaction explainer */}
      <section className={cn(wrap, "mt-20")}>
        <div className="max-w-2xl">
          <SectionLabel n="01" title="Find your way around" />
          <p
            className="mt-5 text-lg leading-relaxed"
            style={{ color: MUTE, fontFamily: SANS }}
          >
            Before your first night, learn the southern sky on the map above. Move
            your cursor and the stars drift in parallax; hover — or tab — any
            constellation and it draws itself in, with its coordinates and the
            months it sits highest. By the time you arrive, the cross will already
            feel like home.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Telescope,
              t: "Guided sessions",
              d: "Two astronomers, nightly. We point the scopes; you choose what to chase — planets, clusters, the core.",
            },
            {
              icon: Moon,
              t: "Moonless windows",
              d: "Bookings track the lunar calendar. We tell you the darkest nights of your month before you commit.",
            },
            {
              icon: Wind,
              t: "Still desert air",
              d: "Laminar flow off the cordillera means steady seeing — fine detail holds at high magnification.",
            },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingCTA base={base} />
    </Page>
  )
}

function FeatureCard({
  icon: Icon,
  t,
  d,
}: {
  icon: typeof Telescope
  t: string
  d: string
}) {
  return (
    <div
      className="group h-full rounded-2xl p-6 transition-colors duration-300"
      style={{ background: PANEL, border: `1px solid ${LINE}` }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300"
        style={{ background: PANEL_2, border: `1px solid ${LINE}` }}
      >
        <Icon
          className="h-5 w-5 transition-colors duration-300"
          style={{ color: BRASS }}
        />
      </div>
      <h3
        className="mt-4 text-xl"
        style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 500 }}
      >
        {t}
      </h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTE, fontFamily: SANS }}>
        {d}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------- Sky */

const SEASONS = [
  {
    months: "Mar – Jun",
    title: "The pointers ride high",
    targets: ["α & β Centauri", "Omega Centauri (NGC 5139)", "The Southern Cross at the zenith"],
    note: "Globular-cluster season. Omega Centauri resolves into ten thousand suns in the big Dob.",
  },
  {
    months: "May – Aug",
    title: "The Galactic Core",
    targets: ["Antares & Rho Ophiuchi", "The Lagoon Nebula (M8)", "Sagittarius star clouds"],
    note: "The brightest months. The core climbs straight up out of the desert and the Milky Way casts a shadow.",
  },
  {
    months: "Sep – Oct",
    title: "Clouds of Magellan",
    targets: ["Large & Small Magellanic Clouds", "The Tarantula Nebula (NGC 2070)", "47 Tucanae"],
    note: "Our companion galaxies sit high and dark — naked-eye smudges that bloom under the astrograph.",
  },
  {
    months: "Nov – Feb",
    title: "Orion, upended",
    targets: ["The Orion Nebula (M42)", "The Pleiades", "Sirius & Canopus"],
    note: "Summer brings the hunter standing on his head, and the two brightest stars in the sky together.",
  },
]

function Sky({ base }: { base: string }) {
  return (
    <Page>
      <section className={cn(wrap, "pt-12 sm:pt-16")}>
        <Reveal>
          <Eyebrow>THE OBSERVING YEAR</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mt-4 max-w-3xl text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.02]"
            style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 300, letterSpacing: -1 }}
          >
            What's overhead, month by moonless month.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-lg" style={{ color: MUTE, fontFamily: SANS }}>
            The southern sky turns through the year. Here's what we'll be chasing
            when you come — and what the instruments will pull from it.
          </p>
        </Reveal>
      </section>

      <section className={cn(wrap, "mt-12")}>
        <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2" style={{ background: LINE }}>
          {SEASONS.map((s, i) => (
            <Reveal key={i} delay={(i % 2) * 0.08}>
              <div className="h-full p-7" style={{ background: PANEL }}>
                <div className="flex items-baseline justify-between">
                  <span style={{ fontFamily: MONO, fontSize: 12, color: BRASS, letterSpacing: 1 }}>
                    {s.months}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: FAINT }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className="mt-3 text-2xl"
                  style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 500 }}
                >
                  {s.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {s.targets.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: BONE, fontFamily: SANS }}
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: BRASS }}
                      />
                      {t}
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: MUTE, fontFamily: SANS }}
                >
                  {s.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* instruments */}
      <section className={cn(wrap, "mt-20")}>
        <SectionLabel n="02" title="The instruments" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { name: "0.6 m astrograph", spec: "Corrected Dall–Kirkham · f/6.5", use: "Deep-sky imaging & narrow-field visual on a robotic mount." },
            { name: '24" Dobsonian', spec: "Truss-tube · premium optics", use: "The light bucket. Globulars, planetaries and faint galaxies, by eye." },
            { name: "Wide-field rig", spec: "106 mm apo · cooled camera", use: "Nebulae and the Magellanic Clouds across a generous field." },
          ].map((it, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="rounded-2xl p-6" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <Telescope className="h-5 w-5" style={{ color: BRASS }} />
                <h3 className="mt-4 text-xl" style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 500 }}>
                  {it.name}
                </h3>
                <p className="mt-1" style={{ fontFamily: MONO, fontSize: 12, color: FAINT }}>
                  {it.spec}
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTE, fontFamily: SANS }}>
                  {it.use}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={cn(wrap, "mt-16")}>
        <Reveal>
          <SkyMap height={460} />
        </Reveal>
      </section>

      <ClosingCTA base={base} />
    </Page>
  )
}

/* ------------------------------------------------------------------ Stay */

const SUITES = [
  {
    name: "The Meridian",
    seed: "atacama-glass-cabin-night",
    sleeps: "Sleeps 2",
    price: "from $340 / night",
    blurb:
      "Our flagship suite, set highest on the ridge. A retracting glass roof slides fully open over the bed — fall asleep beneath the cross.",
    span: true,
  },
  {
    name: "Antares",
    seed: "desert-cabin-interior-warm",
    sleeps: "Sleeps 2",
    price: "from $280 / night",
    blurb: "A warm low room with a fixed skylight framed on Scorpius at culmination.",
  },
  {
    name: "Canopus",
    seed: "stone-cabin-desert-dusk",
    sleeps: "Sleeps 3",
    price: "from $310 / night",
    blurb: "Stone-walled and quiet, with a private terrace and a heated observing pad.",
  },
]

function Stay({ base }: { base: string }) {
  return (
    <Page>
      <section className={cn(wrap, "pt-12 sm:pt-16")}>
        <Reveal>
          <Eyebrow>SIX OBSERVATION SUITES</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mt-4 max-w-3xl text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.02]"
            style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 300, letterSpacing: -1 }}
          >
            Rooms with a roof that opens.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-lg" style={{ color: MUTE, fontFamily: SANS }}>
            Each suite is built low and dark, lit only in red below the windowsill,
            so the sky stays the brightest thing in the room. No glare, no
            light pollution — just you and the southern night.
          </p>
        </Reveal>
      </section>

      <section className={cn(wrap, "mt-12")}>
        <div className="grid gap-5 lg:grid-cols-3">
          {SUITES.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08} className={s.span ? "lg:col-span-2" : ""}>
              <SuiteCard {...s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* amenities */}
      <section className={cn(wrap, "mt-20")}>
        <SectionLabel n="03" title="What's included" />
        <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Full board", "Three meals in the lodge, built around what's grown and raised in the valley below."],
            ["Nightly sessions", "Guided observing every clear night, plus the run of the scopes once you know them."],
            ["Red-light everything", "Torches, paths and rooms are dark-adapted, so your eyes stay tuned to the faint."],
            ["Transfers", "Met at La Serena and driven the last three hours up the cordillera, both ways."],
            ["Astrophotography", "Take home a processed frame of a target you chose — we teach the workflow."],
            ["Warm gear", "Down parkas and hand-warmers for the small hours, when it drops below freezing."],
          ].map(([t, d]) => (
            <Reveal key={t}>
              <div className="border-t pt-4" style={{ borderColor: LINE }}>
                <h3 className="text-base" style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 600 }}>
                  {t}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: MUTE, fontFamily: SANS }}>
                  {d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingCTA base={base} />
    </Page>
  )
}

function SuiteCard({
  name,
  seed,
  sleeps,
  price,
  blurb,
  span,
}: {
  name: string
  seed: string
  sleeps: string
  price: string
  blurb: string
  span?: boolean
}) {
  return (
    <div
      className="group h-full overflow-hidden rounded-2xl"
      style={{ background: PANEL, border: `1px solid ${LINE}` }}
    >
      <div className={cn("relative overflow-hidden", span ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <img
          src={`https://picsum.photos/seed/${seed}/1000/750`}
          alt={`The ${name} suite at Perihelion — a dark observation room under the desert sky`}
          loading="lazy"
          width={1000}
          height={750}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ filter: "saturate(0.7) brightness(0.82) contrast(1.05)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(7,10,18,0.85), transparent 55%)" }}
        />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <h3 className="text-2xl" style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 500 }}>
            {name}
          </h3>
          <span style={{ fontFamily: MONO, fontSize: 11, color: STAR }}>{sleeps}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-relaxed" style={{ color: MUTE, fontFamily: SANS }}>
          {blurb}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span style={{ fontFamily: MONO, fontSize: 13, color: BRASS }}>{price}</span>
          <span
            className="inline-flex items-center gap-1 text-sm transition-colors duration-200 group-hover:text-[--bone]"
            style={{ color: FAINT, fontFamily: SANS, ["--bone" as string]: BONE }}
          >
            Details <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- Visit */

function Visit() {
  const [sent, setSent] = useState(false)
  return (
    <Page>
      <section className={cn(wrap, "pt-12 sm:pt-16")}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <Reveal>
              <Eyebrow>PLAN YOUR NIGHTS</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.02]"
                style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 300, letterSpacing: -1 }}
              >
                Come up the mountain.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: MUTE, fontFamily: SANS }}>
                Tell us your month and we'll send back the darkest window in it,
                with the suites still open. We host eight guests at a time — so
                nights book early.
              </p>
            </Reveal>

            <div className="mt-8 space-y-5">
              {[
                { icon: MountainSnow, t: "Getting here", d: "Fly to La Serena (LSC). We meet you and drive the final 3 hours up to 2,900 m." },
                { icon: Moon, t: "Best windows", d: "New-moon ± 5 nights, year-round. Cloud cover under 8% on average." },
                { icon: Compass, t: "Coordinates", d: "30°24′S, 70°41′W · Cerro Lágrimas, Coquimbo Region, Chile." },
              ].map((r, i) => (
                <Reveal key={i} delay={0.2 + i * 0.06}>
                  <div className="flex gap-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: PANEL_2, border: `1px solid ${LINE}` }}
                    >
                      <r.icon className="h-4 w-4" style={{ color: BRASS }} />
                    </div>
                    <div>
                      <h3 className="text-base" style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 600 }}>
                        {r.t}
                      </h3>
                      <p className="mt-0.5 text-sm" style={{ color: MUTE, fontFamily: SANS }}>
                        {r.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              <h2 className="text-xl" style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 500 }}>
                Request a night
              </h2>
              <div className="mt-5 space-y-4">
                <Field label="Name" id="name" placeholder="Your name" />
                <Field label="Email" id="email" type="email" placeholder="you@email.com" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Arrival month" id="month" placeholder="e.g. July 2026" />
                  <Field label="Guests" id="guests" placeholder="2" type="number" />
                </div>
                <div>
                  <label
                    htmlFor="note"
                    className="mb-1.5 block"
                    style={{ fontFamily: MONO, fontSize: 11, color: FAINT, letterSpacing: 1 }}
                  >
                    WHAT YOU'D MOST LIKE TO SEE
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    placeholder="The core, Saturn, a galaxy with my own eyes…"
                    className="w-full resize-none rounded-lg px-3 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-[--br]"
                    style={{
                      background: INK,
                      border: `1px solid ${LINE}`,
                      color: BONE,
                      fontFamily: SANS,
                      ["--br" as string]: BRASS,
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: BRASS, color: "#10131c", fontWeight: 600, fontFamily: SANS }}
              >
                {sent ? "Thank you — we'll be in touch" : "Send request"}
                {!sent && <ArrowUpRight className="h-4 w-4" />}
              </button>
              {sent && (
                <p className="mt-3 text-center text-sm" style={{ color: MUTE, fontFamily: SANS }}>
                  We reply within two days with your darkest available window.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      <div className="h-20" />
    </Page>
  )
}

function Field({
  label,
  id,
  placeholder,
  type = "text",
}: {
  label: string
  id: string
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block"
        style={{ fontFamily: MONO, fontSize: 11, color: FAINT, letterSpacing: 1 }}
      >
        {label.toUpperCase()}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-[--br]"
        style={{
          background: INK,
          border: `1px solid ${LINE}`,
          color: BONE,
          fontFamily: SANS,
          ["--br" as string]: BRASS,
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------- shared CTA */

function ClosingCTA({ base }: { base: string }) {
  return (
    <section className={cn(wrap, "my-24")}>
      <div
        className="relative overflow-hidden rounded-[24px] px-7 py-14 text-center sm:px-12 sm:py-20"
        style={{ background: PANEL, border: `1px solid ${LINE}` }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(90% 120% at 50% 0%, rgba(227,166,74,0.10), transparent 60%)",
          }}
        />
        <div className="relative">
          <h2
            className="mx-auto max-w-2xl text-[clamp(1.9rem,4.5vw,3.2rem)] leading-tight"
            style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 300, letterSpacing: -0.8 }}
          >
            Most people have never seen a truly dark sky.
            <br />
            <span style={{ fontStyle: "italic", color: BRASS }}>Change that.</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <ButtonLink to={`${base}/visit`}>Reserve a night</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- Layout */

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "sky", label: "Sky", end: false },
  { to: "stay", label: "Stay", end: false },
  { to: "visit", label: "Visit", end: false },
]

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div style={{ background: INK, color: BONE, minHeight: "100vh" }}>
      {/* nav */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(7,10,18,0.72)", borderBottom: `1px solid ${LINE}` }}
      >
        <div className={cn(wrap, "flex h-16 items-center justify-between")}>
          <NavLink to={base} end className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ border: `1px solid ${BRASS}` }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: BRASS }} />
            </span>
            <span
              className="text-lg"
              style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 600, letterSpacing: 0.5 }}
            >
              Perihelion
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className="relative px-4 py-2 text-sm transition-colors duration-200"
                style={({ isActive }) => ({
                  color: isActive ? BONE : MUTE,
                  fontFamily: SANS,
                  fontWeight: 500,
                })}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                        style={{ background: BRASS }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <div className="ml-3">
              <ButtonLink to={`${base}/visit`}>Reserve</ButtonLink>
            </div>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            style={{ color: BONE }}
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
              className="overflow-hidden md:hidden"
              style={{ borderTop: `1px solid ${LINE}` }}
            >
              <div className={cn(wrap, "flex flex-col gap-1 py-4")}>
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    className="rounded-lg px-3 py-3 text-base"
                    style={({ isActive }) => ({
                      color: isActive ? BRASS : BONE,
                      background: isActive ? PANEL : "transparent",
                      fontFamily: SANS,
                      fontWeight: 500,
                    })}
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

      {/* footer */}
      <footer style={{ borderTop: `1px solid ${LINE}`, background: PANEL }}>
        <div className={cn(wrap, "grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr]")}>
          <div>
            <span
              className="text-xl"
              style={{ fontFamily: DISPLAY, color: BONE, fontWeight: 600 }}
            >
              Perihelion
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: MUTE, fontFamily: SANS }}>
              A dark-sky field station on Cerro Lágrimas, Coquimbo Region, Chile.
              Eight guests, six suites, one of the darkest skies on Earth.
            </p>
            <p className="mt-4" style={{ fontFamily: MONO, fontSize: 12, color: FAINT }}>
              30°24′S · 70°41′W · 2,900 m
            </p>
          </div>
          <FooterCol
            title="Visit"
            base={base}
            links={[
              ["Sky calendar", "sky"],
              ["The suites", "stay"],
              ["Request a night", "visit"],
            ]}
          />
          <div>
            <h4 style={{ fontFamily: MONO, fontSize: 11, color: FAINT, letterSpacing: 1.5 }}>
              REACH US
            </h4>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: MUTE, fontFamily: SANS }}>
              <li>hello@perihelion.cl</li>
              <li>+56 51 224 0190</li>
              <li>La Serena ⟶ Cerro Lágrimas</li>
            </ul>
          </div>
        </div>
        <div className={cn(wrap, "flex flex-col items-center justify-between gap-2 border-t py-5 sm:flex-row")} style={{ borderColor: LINE }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: FAINT }}>
            © 2026 Perihelion Field Station
          </span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: FAINT }}>
            Built for the dark · leave no light
          </span>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({
  title,
  base,
  links,
}: {
  title: string
  base: string
  links: [string, string][]
}) {
  return (
    <div>
      <h4 style={{ fontFamily: MONO, fontSize: 11, color: FAINT, letterSpacing: 1.5 }}>
        {title.toUpperCase()}
      </h4>
      <ul className="mt-4 space-y-2">
        {links.map(([label, to]) => (
          <li key={to}>
            <NavLink
              to={`${base}/${to}`}
              className="text-sm transition-colors duration-200 hover:text-[--bone]"
              style={{ color: MUTE, fontFamily: SANS, ["--bone" as string]: BONE } as CSSProperties}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ root */

export default function Perihelion() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <MotionConfig reducedMotion="user">
      <Layout base={base}>
        <Routes>
          <Route index element={<Home base={base} />} />
          <Route path="sky" element={<Sky base={base} />} />
          <Route path="stay" element={<Stay base={base} />} />
          <Route path="visit" element={<Visit />} />
          <Route path="*" element={<Home base={base} />} />
        </Routes>
      </Layout>
    </MotionConfig>
  )
}
