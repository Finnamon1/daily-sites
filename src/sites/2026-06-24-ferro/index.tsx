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
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion"
import {
  ArrowUpRight,
  Clock,
  Flame,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Quote,
  Utensils,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Ferro — a live-fire asador on the Douro, Porto",
  description:
    "Ferro cooks everything over Portuguese oak and vine coals — no gas, no shortcuts. A 14-seat counter and a wood-walled dining room above the Douro. Featured interaction: a morphing molten-ember blob that breathes heat behind the hero and warms toward your cursor. Plus magnetic CTAs, an ingredient marquee, animated counters and scroll reveals across four pages.",
  date: "2026-06-24",
  type: "Restaurant",
  interaction:
    "Morphing molten-ember blob — layered blurred orbs that slowly morph their silhouette and brighten toward the cursor, gated on reduced-motion. Plus magnetic reserve button, infinite ingredient marquee, animated counters and scroll reveals.",
  pages: ["Home", "Menu", "Story", "Visit"],
}

/* --------------------------------------------------------------- palette */
// warm charcoal ink, ember accent. all text checked for WCAG AA on ink.
const INK = "#15100c" // base background — warm near-black
const PANEL = "#1d1610" // raised panels
const PANEL_2 = "#251c14"
const LINE = "rgba(232,196,150,0.14)"
const CREAM = "#f4ece0" // primary text ~14:1 on ink
const MUTE = "#cdbba4" // secondary ~8.6:1
const FAINT = "#a08d76" // faint labels ~5.0:1 — clears AA for ≥18px / bold
const EMBER = "#f2773c" // accent ~7.0:1 on ink
const EMBER_DK = "#c9531f"
const ASH = "#7d6f5f"

const DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif"
const SERIF = "'Spectral', Georgia, serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

/* ----------------------------------------------------------------- utils */

const ease = [0.21, 0.47, 0.32, 0.98] as const

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: EMBER, fontFamily: MONO }}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: EMBER, boxShadow: `0 0 10px ${EMBER}` }}
      />
      {children}
    </span>
  )
}

/* ----------------------------------------------- featured: ember blobs */
// Morphing molten-ember blob: three blurred orbs whose border-radius keyframes
// shift over long, offset loops so the silhouette never repeats. A shared
// pointer signal warms the whole field toward the cursor. Reduced-motion users
// get a still, soft ember instead.

const MORPHS = [
  "62% 38% 42% 58% / 56% 44% 56% 44%",
  "44% 56% 64% 36% / 38% 62% 38% 62%",
  "55% 45% 35% 65% / 62% 35% 65% 38%",
  "38% 62% 52% 48% / 48% 52% 44% 56%",
]

function EmberField({ heat }: { heat: number }) {
  const reduce = useReducedMotion()
  const orbs = [
    { size: 520, x: "8%", y: "2%", color: EMBER, dur: 14, delay: 0, blur: 60 },
    { size: 360, x: "44%", y: "30%", color: EMBER_DK, dur: 18, delay: 1.2, blur: 50 },
    { size: 240, x: "26%", y: "48%", color: "#ffb070", dur: 11, delay: 0.6, blur: 44 },
  ]
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* ambient heat haze that responds to the cursor */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 38%, rgba(242,119,60,0.20), transparent 70%)",
          opacity: 0.5 + heat * 0.5,
        }}
      />
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle at 38% 32%, ${o.color}, ${EMBER_DK} 55%, transparent 72%)`,
            filter: `blur(${o.blur}px)`,
            opacity: 0.55 + heat * 0.4,
            mixBlendMode: "screen",
          }}
          initial={{ borderRadius: MORPHS[0] }}
          animate={
            reduce
              ? { borderRadius: MORPHS[0] }
              : {
                  borderRadius: MORPHS,
                  scale: [1, 1.08, 0.96, 1.04, 1],
                  rotate: [0, 8, -6, 4, 0],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: o.dur,
                  delay: o.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  )
}

/* --------------------------------------------------- animated counter */

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
  const mv = useMotionValue(0)
  const [text, setText] = useState(reduce ? to.toFixed(decimals) : "0")

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setText(to.toFixed(decimals))
      return
    }
    const controls = animate(mv, to, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(v.toFixed(decimals)),
    })
    return () => controls.stop()
  }, [inView, to, decimals, reduce, mv])

  return (
    <span ref={ref}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}

/* --------------------------------------------------- ingredient marquee */

function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]
  return (
    <div
      className="relative flex overflow-hidden border-y py-4"
      style={{ borderColor: LINE, background: PANEL }}
    >
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce
            ? undefined
            : { duration: 26, repeat: Infinity, ease: "linear" }
        }
      >
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span
              className="text-sm uppercase tracking-[0.22em]"
              style={{ color: MUTE, fontFamily: MONO }}
            >
              {it}
            </span>
            <Flame className="h-3.5 w-3.5 shrink-0" style={{ color: EMBER }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* --------------------------------------------------------------- buttons */

function PrimaryBtn({
  to,
  children,
  base,
}: {
  to: string
  children: ReactNode
  base: string
}) {
  return (
    <Magnetic strength={0.35}>
      <NavLink
        to={to.startsWith("http") ? to : `${base}${to}`}
        className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-transform duration-200 active:scale-[0.97]"
        style={{ background: EMBER, color: "#1a0f06" }}
      >
        {children}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </NavLink>
    </Magnetic>
  )
}

function GhostBtn({
  to,
  children,
  base,
}: {
  to: string
  children: ReactNode
  base: string
}) {
  return (
    <NavLink
      to={`${base}${to}`}
      className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors duration-200"
      style={{ borderColor: LINE, color: CREAM }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = EMBER)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = LINE)}
    >
      {children}
    </NavLink>
  )
}

/* ----------------------------------------------------------------- pages */

const pageVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease } },
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------- Home */

function Home({ base }: { base: string }) {
  const heat = useMotionValue(0)
  const [heatVal, setHeatVal] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Cursor warms the ember field: distance to center → heat 0..1, springed.
  const spring = useSpring(heat, { stiffness: 120, damping: 24 })
  useEffect(() => spring.on("change", setHeatVal), [spring])

  return (
    <Page>
      {/* hero */}
      <section
        ref={heroRef}
        onMouseMove={(e) => {
          if (reduce) return
          const r = heroRef.current?.getBoundingClientRect()
          if (!r) return
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height
          heat.set(Math.max(0, 1 - Math.hypot(dx, dy) * 1.6))
        }}
        onMouseLeave={() => heat.set(0)}
        className="relative overflow-hidden"
      >
        <EmberField heat={heatVal} />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-36">
          <Reveal>
            <Kicker>Live fire · Porto · est. 2019</Kicker>
          </Reveal>
          <Reveal delay={0.06}>
            <h1
              className="mt-6 max-w-4xl text-balance text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl"
              style={{ fontFamily: DISPLAY, color: CREAM }}
            >
              Everything you eat here
              <br />
              has met the{" "}
              <span className="relative inline-block" style={{ color: EMBER }}>
                fire
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] w-full origin-left"
                  style={{ background: EMBER }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5, ease }}
                />
              </span>
              .
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-7 max-w-xl text-lg leading-relaxed"
              style={{ fontFamily: SERIF, color: MUTE }}
            >
              Ferro is a fourteen-seat asador above the Douro. We cook over
              Portuguese oak and old vine coals — no gas reaches the kitchen.
              One menu, written each morning around what the boats and the
              hills sent us.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <PrimaryBtn to="/visit" base={base}>
                Reserve a table
              </PrimaryBtn>
              <GhostBtn to="/menu" base={base}>
                <Utensils className="h-4 w-4" /> See tonight's menu
              </GhostBtn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* counters */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-px overflow-hidden rounded-2xl border md:grid-cols-4"
          style={{ borderColor: LINE, background: LINE }}>
          {[
            { v: <Counter to={620} suffix="°C" />, label: "Coal-bed at the grate" },
            { v: <Counter to={14} />, label: "Seats at the counter" },
            { v: <Counter to={9} />, label: "Courses, set each morning" },
            { v: <Counter to={1.4} decimals={1} suffix=" t" />, label: "Oak burned each month" },
          ].map((s, i) => (
            <div key={i} className="px-6 py-8" style={{ background: PANEL }}>
              <div
                className="text-4xl font-extrabold tracking-tight md:text-5xl"
                style={{ fontFamily: DISPLAY, color: EMBER }}
              >
                {s.v}
              </div>
              <div
                className="mt-2 text-sm"
                style={{ color: FAINT, fontFamily: MONO }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Marquee
        items={[
          "Galician beef",
          "Vine-coal turbot",
          "Bone marrow",
          "Charred leeks",
          "Quince",
          "Smoked butter",
          "Douro lamb",
          "Burnt honey",
        ]}
      />

      {/* signature dishes — staggered grid + scroll reveal */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>From the grate</Kicker>
            <h2
              className="mt-4 text-3xl font-bold tracking-tight md:text-5xl"
              style={{ fontFamily: DISPLAY, color: CREAM }}
            >
              Three things people come back for
            </h2>
          </div>
          <GhostBtn to="/menu" base={base}>
            Full menu
          </GhostBtn>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SIGNATURES.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.08}>
              <DishImageCard dish={d} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* quote band */}
      <section className="border-y" style={{ borderColor: LINE, background: PANEL }}>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <Quote className="mx-auto h-8 w-8" style={{ color: EMBER }} />
          <blockquote
            className="mt-6 text-balance text-2xl leading-snug md:text-4xl"
            style={{ fontFamily: SERIF, color: CREAM, fontStyle: "italic" }}
          >
            “The kind of room where you stop talking when the plate lands. Ferro
            cooks fire like other people cook with salt — as a seasoning, not a
            spectacle.”
          </blockquote>
          <div
            className="mt-6 text-sm uppercase tracking-[0.22em]"
            style={{ color: FAINT, fontFamily: MONO }}
          >
            Gazeta do Porto · Restaurant of the Year
          </div>
        </div>
      </section>

      <CtaBand base={base} />
    </Page>
  )
}

/* ------------------------------------------------------- dish image card */

function DishImageCard({ dish }: { dish: Dish }) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border"
      style={{ borderColor: LINE, background: PANEL }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${dish.seed}/700/880`}
          alt={dish.alt}
          width={700}
          height={880}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          style={{ filter: "saturate(0.8) contrast(1.05) brightness(0.82) sepia(0.18)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(21,16,12,0.92) 8%, rgba(21,16,12,0.15) 60%, transparent)",
          }}
        />
        <div
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: INK, color: EMBER, fontFamily: MONO }}
        >
          {dish.price}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: DISPLAY, color: CREAM }}
        >
          {dish.name}
        </h3>
        <p
          className="mt-1 max-h-0 overflow-hidden text-sm leading-relaxed opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100"
          style={{ color: MUTE, fontFamily: SERIF }}
        >
          {dish.note}
        </p>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------- Menu */

function MenuPage() {
  return (
    <Page>
      <PageHead
        kicker="Tonight · the set menu"
        title="One menu, nine moves"
        lead="We write it each morning. Allergies and aversions are no trouble — tell us when you book and we'll cook around you. Wine pairing is poured by the glass from small Douro and Dão growers."
      />
      <section className="mx-auto max-w-4xl px-6 pb-24">
        {COURSES.map((c, i) => (
          <Reveal key={c.course} delay={Math.min(i * 0.05, 0.25)}>
            <div
              className="grid gap-4 border-t py-7 md:grid-cols-[120px_1fr_auto] md:items-baseline"
              style={{ borderColor: LINE }}
            >
              <div
                className="text-xs uppercase tracking-[0.22em]"
                style={{ color: EMBER, fontFamily: MONO }}
              >
                {c.course}
              </div>
              <div>
                <h3
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: DISPLAY, color: CREAM }}
                >
                  {c.name}
                </h3>
                <p
                  className="mt-1.5 text-base leading-relaxed"
                  style={{ color: MUTE, fontFamily: SERIF }}
                >
                  {c.desc}
                </p>
              </div>
              <div
                className="text-sm md:text-right"
                style={{ color: FAINT, fontFamily: MONO }}
              >
                {c.tag}
              </div>
            </div>
          </Reveal>
        ))}
        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-7"
          style={{ borderColor: LINE, background: PANEL }}
        >
          <div>
            <div
              className="text-3xl font-extrabold"
              style={{ fontFamily: DISPLAY, color: CREAM }}
            >
              €95{" "}
              <span className="text-base font-medium" style={{ color: FAINT }}>
                per guest
              </span>
            </div>
            <p className="mt-1 text-sm" style={{ color: MUTE, fontFamily: SERIF }}>
              Wine pairing €55 · juice pairing €30 · the full nine courses, about
              two hours at the counter.
            </p>
          </div>
          <Flame className="h-10 w-10" style={{ color: EMBER }} />
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------------ Story */

function Story({ base }: { base: string }) {
  return (
    <Page>
      <PageHead
        kicker="The room & the fire"
        title="We started with one grill and a bad attitude about gas"
        lead="Ferro began in 2019 as a six-month residency that refused to close. The premise hasn't changed: a single hearth, ingredients with a name and a place, and a counter close enough that you can watch the coals breathe."
      />

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {STORY_IMAGES.map((im, i) => (
            <Reveal key={im.seed} delay={i * 0.08}>
              <figure
                className="overflow-hidden rounded-2xl border"
                style={{ borderColor: LINE }}
              >
                <img
                  src={`https://picsum.photos/seed/${im.seed}/640/${im.h}`}
                  alt={im.alt}
                  width={640}
                  height={im.h}
                  loading="lazy"
                  className="w-full object-cover"
                  style={{
                    aspectRatio: `640 / ${im.h}`,
                    filter: "saturate(0.78) contrast(1.06) brightness(0.85) sepia(0.16)",
                  }}
                />
                <figcaption
                  className="px-4 py-3 text-xs uppercase tracking-[0.18em]"
                  style={{ background: PANEL, color: FAINT, fontFamily: MONO }}
                >
                  {im.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        {STORY_BLOCKS.map((b, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div
              className="grid gap-4 border-t py-9 md:grid-cols-[1fr_2fr]"
              style={{ borderColor: LINE }}
            >
              <h3
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: DISPLAY, color: CREAM }}
              >
                {b.h}
              </h3>
              <p
                className="text-lg leading-relaxed"
                style={{ fontFamily: SERIF, color: MUTE }}
              >
                {b.p}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      <CtaBand base={base} />
    </Page>
  )
}

/* ------------------------------------------------------------------- Visit */

function Visit() {
  const [sent, setSent] = useState(false)
  return (
    <Page>
      <PageHead
        kicker="Find us · book a seat"
        title="Two seatings a night, Tuesday to Saturday"
        lead="The counter books fast — reservations open four weeks out. Walk-ins are welcome for the eight bar stools if a coal seat opens up."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          {/* info */}
          <div className="space-y-5">
            {[
              { icon: MapPin, h: "Rua dos Canastreiros 12", p: "Ribeira, 4050 Porto — riverside, below the Sé." },
              { icon: Clock, h: "Seatings 19:00 & 21:30", p: "Tuesday–Saturday. Closed Sunday & Monday and the first week of August." },
              { icon: Phone, h: "+351 220 14 09 88", p: "Calls answered 15:00–18:00. Or book the counter online any time." },
            ].map((row, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  className="flex items-start gap-4 rounded-2xl border p-5"
                  style={{ borderColor: LINE, background: PANEL }}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                    style={{ background: PANEL_2, color: EMBER }}
                  >
                    <row.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div
                      className="font-bold tracking-tight"
                      style={{ fontFamily: DISPLAY, color: CREAM }}
                    >
                      {row.h}
                    </div>
                    <div className="mt-0.5 text-sm" style={{ color: MUTE, fontFamily: SERIF }}>
                      {row.p}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* mini "map" — crafted SVG, no photo */}
            <Reveal delay={0.2}>
              <div
                className="relative overflow-hidden rounded-2xl border"
                style={{ borderColor: LINE, background: PANEL_2 }}
              >
                <svg viewBox="0 0 600 240" className="w-full" role="img" aria-label="Stylised map of Ferro's riverside location in Ribeira, Porto">
                  <defs>
                    <linearGradient id="ferro-river" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#22323a" />
                      <stop offset="1" stopColor="#2c4651" />
                    </linearGradient>
                  </defs>
                  <rect width="600" height="240" fill={PANEL_2} />
                  <path d="M0 150 Q 150 120 300 150 T 600 150 L600 240 L0 240 Z" fill="url(#ferro-river)" />
                  {[40, 120, 200, 360, 470, 540].map((x, i) => (
                    <rect key={i} x={x} y={70 + (i % 3) * 14} width="46" height={70 - (i % 3) * 14} fill={PANEL} stroke={LINE} />
                  ))}
                  <g>
                    <circle cx="300" cy="96" r="9" fill={EMBER} />
                    <circle cx="300" cy="96" r="9" fill="none" stroke={EMBER} opacity="0.4">
                      <animate attributeName="r" from="9" to="22" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <text x="300" y="60" textAnchor="middle" fill={CREAM} style={{ fontFamily: MONO, fontSize: 13 }}>Ferro</text>
                  </g>
                </svg>
              </div>
            </Reveal>
          </div>

          {/* reservation form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="rounded-2xl border p-7"
              style={{ borderColor: LINE, background: PANEL }}
            >
              <h3
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: DISPLAY, color: CREAM }}
              >
                Request the counter
              </h3>
              <p className="mt-1.5 text-sm" style={{ color: MUTE, fontFamily: SERIF }}>
                We confirm by email within a day. This is a request, not a charge.
              </p>

              <div className="mt-6 grid gap-4">
                <Field label="Name" id="ferro-name" placeholder="Whom shall we expect?" />
                <Field label="Email" id="ferro-email" type="email" placeholder="you@example.com" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date" id="ferro-date" type="date" />
                  <div>
                    <label
                      htmlFor="ferro-party"
                      className="mb-1.5 block text-xs uppercase tracking-[0.18em]"
                      style={{ color: FAINT, fontFamily: MONO }}
                    >
                      Guests
                    </label>
                    <select
                      id="ferro-party"
                      className="w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                      style={{ borderColor: LINE, color: CREAM, fontFamily: SERIF }}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n} style={{ background: PANEL_2 }}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-transform duration-200 active:scale-[0.98]"
                style={{ background: sent ? PANEL_2 : EMBER, color: sent ? EMBER : "#1a0f06" }}
              >
                {sent ? (
                  <>Request received — we'll be in touch</>
                ) : (
                  <>
                    Send request
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </Page>
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
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs uppercase tracking-[0.18em]"
        style={{ color: FAINT, fontFamily: MONO }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:opacity-50 focus:ring-2"
        style={{ borderColor: LINE, color: CREAM, fontFamily: SERIF }}
      />
    </div>
  )
}

/* --------------------------------------------------------- shared blocks */

function PageHead({
  kicker,
  title,
  lead,
}: {
  kicker: string
  title: string
  lead: string
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-10 pt-24 md:pt-32">
      <Reveal>
        <Kicker>{kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.06}>
        <h1
          className="mt-5 text-balance text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl"
          style={{ fontFamily: DISPLAY, color: CREAM }}
        >
          {title}
        </h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed"
          style={{ fontFamily: SERIF, color: MUTE }}
        >
          {lead}
        </p>
      </Reveal>
    </section>
  )
}

function CtaBand({ base }: { base: string }) {
  return (
    <section className="relative mx-auto my-20 max-w-6xl overflow-hidden rounded-3xl border px-6 py-16 text-center"
      style={{ borderColor: LINE, background: PANEL }}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 120% at 50% 0%, rgba(242,119,60,0.18), transparent 70%)",
        }}
      />
      <div className="relative">
        <h2
          className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl"
          style={{ fontFamily: DISPLAY, color: CREAM }}
        >
          Fourteen seats. One fire. Come sit close.
        </h2>
        <p className="mx-auto mt-4 max-w-md" style={{ color: MUTE, fontFamily: SERIF }}>
          Reservations open four weeks ahead and the counter goes quickly.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryBtn to="/visit" base={base}>
            Reserve a table
          </PrimaryBtn>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Layout */

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "/menu", label: "Menu", end: false },
  { to: "/story", label: "Story", end: false },
  { to: "/visit", label: "Visit", end: false },
]

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  const linkClass = () =>
    "relative text-sm font-medium transition-colors duration-200"
  const linkStyle = ({ isActive }: { isActive: boolean }): CSSProperties => ({
    color: isActive ? CREAM : FAINT,
    fontFamily: MONO,
  })

  return (
    <div style={{ background: INK, color: CREAM, minHeight: "100vh" }}>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{ borderColor: LINE, background: "rgba(21,16,12,0.78)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to={base} end className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 place-items-center rounded-md"
              style={{ background: EMBER, color: "#1a0f06" }}
            >
              <Flame className="h-5 w-5" />
            </span>
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: DISPLAY, color: CREAM }}
            >
              Ferro
            </span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={`${base}${n.to}`}
                end={n.end}
                className={linkClass}
                style={linkStyle}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="ferro-nav"
                        className="absolute -bottom-1.5 left-0 h-[2px] w-full"
                        style={{ background: EMBER }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <PrimaryBtn to="/visit" base={base}>
              Reserve
            </PrimaryBtn>
          </div>

          <button
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ color: CREAM }}
          >
            {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease }}
              className="overflow-hidden border-t md:hidden"
              style={{ borderColor: LINE }}
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={`${base}${n.to}`}
                    end={n.end}
                    className="rounded-lg px-3 py-3 text-base"
                    style={({ isActive }) => ({
                      color: isActive ? CREAM : MUTE,
                      background: isActive ? PANEL : "transparent",
                      fontFamily: DISPLAY,
                    })}
                  >
                    {n.label}
                  </NavLink>
                ))}
                <div className="px-3 pb-2 pt-3">
                  <PrimaryBtn to="/visit" base={base}>
                    Reserve a table
                  </PrimaryBtn>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="border-t" style={{ borderColor: LINE, background: PANEL }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 place-items-center rounded-md"
                style={{ background: EMBER, color: "#1a0f06" }}
              >
                <Flame className="h-5 w-5" />
              </span>
              <span
                className="text-xl font-extrabold tracking-tight"
                style={{ fontFamily: DISPLAY, color: CREAM }}
              >
                Ferro
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: MUTE, fontFamily: SERIF }}>
              A live-fire asador above the Douro. Cooked over oak and vine coals,
              written fresh each morning.
            </p>
          </div>
          <FooterCol
            title="Visit"
            rows={["Rua dos Canastreiros 12", "Ribeira, 4050 Porto", "Tue–Sat · 19:00 & 21:30"]}
          />
          <FooterCol
            title="Reach us"
            rows={["+351 220 14 09 88", "hello@ferro.pt", "@ferro.porto"]}
          />
        </div>
        <div
          className="border-t px-6 py-5 text-center text-xs"
          style={{ borderColor: LINE, color: ASH, fontFamily: MONO }}
        >
          © 2026 Ferro Asador · Built for the daily-sites gallery
        </div>
      </footer>
    </div>
  )
}

function FooterCol({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div>
      <div
        className="text-xs uppercase tracking-[0.22em]"
        style={{ color: EMBER, fontFamily: MONO }}
      >
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r} className="text-sm" style={{ color: MUTE, fontFamily: SERIF }}>
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------- root */

export default function Ferro() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <Layout base={base}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<Home base={base} />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="story" element={<Story base={base} />} />
            <Route path="visit" element={<Visit />} />
            <Route path="*" element={<Home base={base} />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </MotionConfig>
  )
}

/* -------------------------------------------------------------------- data */

interface Dish {
  name: string
  price: string
  note: string
  seed: string
  alt: string
}

const SIGNATURES: Dish[] = [
  {
    name: "Galician chuletón, 8 weeks aged",
    price: "to share",
    note: "Old dairy cow over a high oak fire, rested on the bone, finished with Trás-os-Montes salt and the dripping.",
    seed: "ferro-steak-coals",
    alt: "A thick aged beef chop searing over glowing oak coals",
  },
  {
    name: "Whole turbot, vine coals",
    price: "market",
    note: "Day-boat turbot grilled in the basket over spent vine wood, basted with smoked butter and fennel.",
    seed: "ferro-turbot-grill",
    alt: "A whole flat fish grilling in a wire basket above embers",
  },
  {
    name: "Charred leeks, burnt honey",
    price: "€14",
    note: "Buried in the ash until sweet, peeled at the pass, dressed with hazelnut and a spoon of scorched honey.",
    seed: "ferro-leeks-ash",
    alt: "Blackened whole leeks resting on a metal tray by the fire",
  },
]

interface Course {
  course: string
  name: string
  desc: string
  tag: string
}

const COURSES: Course[] = [
  { course: "To start", name: "Smoked bread & dripping", desc: "Sourdough toasted over the dying coals, beef dripping whipped with smoked salt.", tag: "vegetarian on ask" },
  { course: "Cold", name: "Carabineiro, ember oil", desc: "Scarlet prawn, barely warmed, its heads pressed into a slick of coal-roasted garlic oil.", tag: "shellfish" },
  { course: "From the basket", name: "Sardine, gooseberry", desc: "A single fat sardine off the grate, sharp green gooseberry, burnt lemon.", tag: "fish" },
  { course: "Garden", name: "Charred leeks, hazelnut", desc: "Ash-buried leeks, brown butter, burnt honey, toasted Douro hazelnuts.", tag: "vegetarian" },
  { course: "Fire I", name: "Turbot, smoked butter", desc: "Day-boat turbot over vine coals, fennel, beurre noisette caught at the edge of burning.", tag: "fish" },
  { course: "Fire II", name: "Galician beef, bone marrow", desc: "Eight-week chuletón, the marrow spooned over, watercress cut with vinegar.", tag: "beef" },
  { course: "Cheese", name: "Serra da Estrela, quince", desc: "Runny mountain cheese warmed by the hearth, membrillo we cook down ourselves.", tag: "vegetarian" },
  { course: "Sweet", name: "Burnt cream, fig leaf", desc: "Custard scorched under the salamander, fig-leaf ice, a crack of caramel.", tag: "vegetarian" },
  { course: "To finish", name: "Coal-roast pear, port", desc: "A pear cooked in the embers, ten-year tawny reduced to a syrup, crème fraîche.", tag: "contains alcohol" },
]

const STORY_IMAGES = [
  { seed: "ferro-hearth-room", h: 760, alt: "The wood-walled dining room lit by the open hearth", cap: "The counter, looking onto the coals" },
  { seed: "ferro-oak-store", h: 600, alt: "Stacked split oak logs drying against a stone wall", cap: "Oak, split and seasoned a year" },
  { seed: "ferro-chef-grate", h: 760, alt: "A cook tending skewers and baskets over a long fire grate", cap: "Service, second seating" },
]

const STORY_BLOCKS = [
  { h: "No gas, on purpose", p: "Gas is convenient and we don't keep any. Every plate passes over coals we light at four each afternoon, because fire gives food a top note nothing else does — and because watching it tempers how you cook. You learn patience or you serve people ash." },
  { h: "Named ingredients", p: "We buy small: one Galician rancher, two day-boats in Matosinhos, a forager in the Marão hills. If a thing isn't good this week it falls off the menu this week. That's the whole sourcing policy, and it's why the card changes by the morning." },
  { h: "Close enough to feel it", p: "Fourteen seats wrap the fire so the cook and the guest share the same heat. There is no pass to hide behind. The room is loud, the wine is honest, and you will smell faintly of woodsmoke when you leave. We consider that a feature." },
]
