import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
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
  Clock,
  Croissant,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Wheat,
  Wine,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Honeyfern — an all-day bakery, kitchen & natural-wine bar in Hudson, NY",
  description:
    "Honeyfern is a sunlit corner room on Warren Street: laminated pastry before noon, a market-led kitchen by night, and a short, living list of low-intervention wine. Featured interaction: a hover image-reveal menu — scan the dish list and a photo of each plate materialises and trails your cursor. Plus an infinite specials marquee, magnetic CTAs, animated counters and scroll reveals across four pages.",
  date: "2026-06-24",
  type: "Restaurant / bakery & wine bar",
  interaction:
    "Hover image-reveal menu — a dish photo materialises and trails the cursor (and shows on keyboard focus) as you scan the list. Plus an infinite specials marquee, magnetic CTAs, animated counters & scroll reveals",
  pages: ["Home", "Menu", "Bakery", "Visit"],
}

/* --------------------------------------------------------------- palette */
// warm paper #f7f1e3 · ink a near-black fern · ONE confident accent: marigold #e0612d
const PAPER = "#f7f1e3"
const PAPER_2 = "#efe6d2"
const CARD = "#fbf7ec"
const INK = "#1c241a" // primary text — ~13:1 on paper
const FERN = "#2f4a32" // secondary structural green — ~7.6:1 on paper
const MUTE = "#5c6553" // muted text — ~5.4:1 on paper, clears AA
const MARIGOLD = "#cf5320" // accent — ~4.9:1 on paper, clears AA for large + UI
const MARIGOLD_DK = "#a63f14"
const LINE = "rgba(47,74,50,0.18)"

const DISPLAY = "'Cormorant Garamond', Georgia, serif"
const SANS = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

/* --------------------------------------------------- hover-reveal context */

type RevealState = { src: string; alt: string; tag: string } | null

const HoverCtx = createContext<{
  setItem: (v: RevealState) => void
  anchorAt: (x: number, y: number) => void
} | null>(null)

/** Floating preview that trails the cursor while a menu row is hovered/focused. */
function HoverRevealLayer({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const [item, setItem] = useState<RevealState>(null)
  const px = useMotionValue(-400)
  const py = useMotionValue(-400)
  const x = useSpring(px, { stiffness: 220, damping: 26, mass: 0.6 })
  const y = useSpring(py, { stiffness: 220, damping: 26, mass: 0.6 })
  const rot = useSpring(0, { stiffness: 120, damping: 14 })
  const lastX = useRef(0)

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX + 26)
      py.set(e.clientY - 150)
      // tilt the card in the direction of travel for a little life
      const dx = e.clientX - lastX.current
      lastX.current = e.clientX
      rot.set(Math.max(-9, Math.min(9, dx * 0.5)))
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [px, py, rot, reduce])

  // keyboard focus anchors the preview beside the focused row instead of the stale cursor
  const anchorAt = (x: number, y: number) => {
    px.set(x)
    py.set(y)
  }

  return (
    <HoverCtx.Provider value={{ setItem, anchorAt }}>
      {children}
      {/* Desktop pointer-follow preview. Decorative — the row text carries the meaning. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{ x, y, rotate: reduce ? 0 : rot }}
        initial={false}
        animate={{
          opacity: item ? 1 : 0,
          scale: item ? 1 : 0.82,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div
          className="relative w-[clamp(190px,17vw,250px)] overflow-hidden rounded-[14px] shadow-[0_24px_60px_-24px_rgba(28,36,26,0.55)]"
          style={{ border: `5px solid ${CARD}`, background: CARD }}
        >
          {item && (
            <>
              <img
                src={item.src}
                alt=""
                width={250}
                height={312}
                className="aspect-[4/5] w-full object-cover"
                style={{ filter: "saturate(1.04) contrast(1.02)" }}
              />
              <span
                className="absolute left-2 top-2 rounded-full px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{ background: MARIGOLD, color: PAPER, fontFamily: MONO }}
              >
                {item.tag}
              </span>
            </>
          )}
        </div>
      </motion.div>
    </HoverCtx.Provider>
  )
}

/* ----------------------------------------------------------------- atoms */

function Eyebrow({ children, color = MARIGOLD }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em]"
      style={{ fontFamily: MONO, color }}
    >
      <span className="h-px w-6" style={{ background: color }} />
      {children}
    </span>
  )
}

function Btn({
  children,
  to,
  variant = "solid",
}: {
  children: ReactNode
  to?: string
  variant?: "solid" | "ghost"
}) {
  const solid = variant === "solid"
  const cls =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-all duration-200"
  const style: CSSProperties = solid
    ? { background: INK, color: PAPER }
    : { color: INK, border: `1.5px solid ${LINE}` }
  const inner = (
    <span
      className={cls}
      style={style}
      onMouseEnter={(e) => {
        if (solid) e.currentTarget.style.background = MARIGOLD
        else e.currentTarget.style.borderColor = MARIGOLD
      }}
      onMouseLeave={(e) => {
        if (solid) e.currentTarget.style.background = INK
        else e.currentTarget.style.borderColor = LINE
      }}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
  return (
    <Magnetic strength={0.3}>
      {to ? (
        <NavLink to={to} className="inline-block">
          {inner}
        </NavLink>
      ) : (
        <button type="button" className="inline-block">
          {inner}
        </button>
      )}
    </Magnetic>
  )
}

/** Count up to a target when scrolled into view. */
function Counter({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
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
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])
  return (
    <span ref={ref}>
      {Math.round(val)}
      {suffix}
    </span>
  )
}

/** Infinite marquee of specials. Pauses on hover, freezes for reduced motion. */
function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]
  return (
    <div
      className="relative flex overflow-hidden border-y py-3 select-none"
      style={{ borderColor: LINE, background: FERN }}
    >
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 whitespace-nowrap text-[13px] uppercase tracking-[0.22em]"
            style={{ fontFamily: MONO, color: PAPER }}
          >
            {t}
            <Leaf className="h-3.5 w-3.5" style={{ color: MARIGOLD }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ----------------------------------------------------------------- layout */

function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

const NAV = [
  { label: "Home", path: "", end: true },
  { label: "Menu", path: "menu", end: false },
  { label: "Bakery", path: "bakery", end: false },
  { label: "Visit", path: "visit", end: false },
]

function Layout({ children }: { children: ReactNode }) {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])

  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: PAPER, color: INK, fontFamily: SANS }}
    >
      {/* top hours bar */}
      <div
        className="hidden items-center justify-between px-6 py-1.5 text-[11px] uppercase tracking-[0.2em] md:flex"
        style={{ fontFamily: MONO, background: INK, color: PAPER_2 }}
      >
        <span className="flex items-center gap-2">
          <Clock className="h-3 w-3" style={{ color: MARIGOLD }} /> Wed–Sun · 8am–late
        </span>
        <span>Warren Street, Hudson NY · no reservations before 5</span>
      </div>

      {/* nav */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ borderColor: LINE, background: "rgba(247,241,227,0.86)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to={base} end className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: FERN }}
            >
              <Wheat className="h-5 w-5" style={{ color: PAPER }} />
            </span>
            <span
              className="text-[26px] leading-none"
              style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "0.01em" }}
            >
              Honeyfern
            </span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.path ? `${base}/${n.path}` : base}
                end={n.end}
                className="group relative text-[14px] font-medium"
                style={{ color: INK }}
              >
                {({ isActive }) => (
                  <span className="relative inline-block py-1">
                    {n.label}
                    <span
                      className="absolute -bottom-0.5 left-0 h-[2px] transition-all duration-300 group-hover:w-full"
                      style={{ width: isActive ? "100%" : 0, background: MARIGOLD }}
                    />
                  </span>
                )}
              </NavLink>
            ))}
            <Btn to={`${base}/visit`}>Book a table</Btn>
          </nav>

          <button
            type="button"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            style={{ color: INK }}
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
              transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="overflow-hidden border-t md:hidden"
              style={{ borderColor: LINE }}
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.path ? `${base}/${n.path}` : base}
                    end={n.end}
                    className="rounded-lg px-3 py-2.5 text-[17px]"
                    style={({ isActive }) => ({
                      fontFamily: DISPLAY,
                      fontWeight: 600,
                      color: isActive ? MARIGOLD : INK,
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
      <footer style={{ background: INK, color: PAPER_2 }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div
                className="text-[34px] leading-none"
                style={{ fontFamily: DISPLAY, fontWeight: 600, color: PAPER }}
              >
                Honeyfern
              </div>
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed" style={{ color: "#b9bcaf" }}>
                A corner room of flour, fire and good wine. Come for the croissants,
                stay until the candles are low.
              </p>
              <div className="mt-6 flex gap-3">
                {[Croissant, Wine, Leaf].map((Icon, i) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ border: `1px solid rgba(247,241,227,0.2)` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: MARIGOLD }} />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <FootHead>Visit</FootHead>
              <ul className="space-y-2 text-[14px]" style={{ color: "#b9bcaf" }}>
                <li>411 Warren Street</li>
                <li>Hudson, NY 12534</li>
                <li>(518) 555-0184</li>
              </ul>
            </div>
            <div>
              <FootHead>Hours</FootHead>
              <ul className="space-y-2 text-[14px]" style={{ color: "#b9bcaf" }}>
                <li>Bakery · Wed–Sun, 8–11am</li>
                <li>Kitchen · Wed–Sun, 5–late</li>
                <li>Closed Mon & Tue</li>
              </ul>
            </div>
          </div>
          <div
            className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-[12px] uppercase tracking-[0.18em] md:flex-row md:items-center"
            style={{ borderColor: "rgba(247,241,227,0.16)", fontFamily: MONO, color: "#9aa091" }}
          >
            <span>© 2026 Honeyfern Bakery & Wine</span>
            <span>Baked daily on Warren Street</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FootHead({ children }: { children: ReactNode }) {
  return (
    <h4
      className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em]"
      style={{ fontFamily: MONO, color: MARIGOLD }}
    >
      {children}
    </h4>
  )
}

/* ----------------------------------------------------------- shared bits */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2
      className="text-balance text-[clamp(30px,4.4vw,52px)] leading-[1.04]"
      style={{ fontFamily: DISPLAY, fontWeight: 600, color: INK }}
    >
      {children}
    </h2>
  )
}

/* ------------------------------------------------------------------ data */

type Dish = { name: string; note: string; price: string; tag: string; seed: string }

const PLATES: Dish[] = [
  { name: "Hand-torn pasta, brown butter & sage", note: "cured egg yolk, toasted hazelnut", price: "26", tag: "Kitchen", seed: "honeyfern-pasta" },
  { name: "Wood-fire carrots, whipped feta", note: "honey, dukkah, charred scallion", price: "18", tag: "Garden", seed: "honeyfern-carrots" },
  { name: "Hudson trout, fennel & citrus", note: "preserved lemon, brown-butter crumb", price: "29", tag: "Kitchen", seed: "honeyfern-trout" },
  { name: "Dry-aged steak for two, bone marrow", note: "salsa verde, fries in beef fat", price: "64", tag: "Fire", seed: "honeyfern-steak" },
  { name: "Burrata, peach & basil oil", note: "torn sourdough, aged balsamic", price: "21", tag: "Garden", seed: "honeyfern-burrata" },
  { name: "Dark chocolate & olive-oil cake", note: "crème fraîche, flaky salt", price: "14", tag: "Sweet", seed: "honeyfern-cake" },
]

const PASTRY: Dish[] = [
  { name: "Croissant au beurre", note: "36-hour laminate, AOP butter", price: "5.5", tag: "Daily", seed: "honeyfern-croissant" },
  { name: "Morning bun", note: "orange zest, cardamom sugar", price: "6", tag: "Daily", seed: "honeyfern-morningbun" },
  { name: "Country sourdough loaf", note: "wild levain, 72-hour ferment", price: "9", tag: "Loaf", seed: "honeyfern-sourdough" },
  { name: "Pistachio & cherry danish", note: "frangipane, sour cherry", price: "7", tag: "Weekend", seed: "honeyfern-danish" },
  { name: "Rye & seed boule", note: "molasses, caraway, sunflower", price: "10", tag: "Loaf", seed: "honeyfern-rye" },
  { name: "Canelé, six in a box", note: "vanilla bean, beeswax mould", price: "16", tag: "Box", seed: "honeyfern-canele" },
]

const WINES = [
  { name: "Pét-Nat, Finger Lakes", note: "Riesling · cloudy, citrus, low ABV", glass: "14" },
  { name: "Skin-contact Pinot Gris", note: "Willamette · apricot, tannic, dry", glass: "16" },
  { name: "Gamay, Beaujolais", note: "carbonic · cranberry, peppery, chilled", glass: "15" },
  { name: "Chenin, Loire", note: "off-dry · quince, beeswax, saline", glass: "17" },
]

/* ----------------------------------------------------- hover-reveal menu */

function MenuRow({ dish, index }: { dish: Dish; index: number }) {
  const ctx = useContext(HoverCtx)
  const reduce = useReducedMotion()
  const [hot, setHot] = useState(false)
  const enter = () => {
    setHot(true)
    ctx?.setItem({ src: `https://picsum.photos/seed/${dish.seed}/500/625`, alt: dish.name, tag: dish.tag })
  }
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    // anchor the floating preview beside the focused row for keyboard users
    const r = e.currentTarget.getBoundingClientRect()
    ctx?.anchorAt(r.right - 270, r.top - 60)
    enter()
  }
  const leave = () => {
    setHot(false)
    ctx?.setItem(null)
  }
  return (
    <Reveal delay={index * 0.05}>
      <div
        tabIndex={0}
        role="button"
        aria-label={`${dish.name} — ${dish.note}, $${dish.price}`}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={onFocus}
        onBlur={leave}
        className="group relative grid grid-cols-[1fr_auto] items-baseline gap-4 border-b py-5 outline-none transition-colors duration-200"
        style={{ borderColor: LINE }}
      >
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px] origin-top transition-transform duration-300"
          style={{
            background: MARIGOLD,
            transform: hot ? "scaleY(1)" : "scaleY(0)",
          }}
        />
        <div className="pl-4 transition-[padding] duration-300 group-hover:pl-6 group-focus:pl-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3
              className="text-[clamp(19px,2.1vw,24px)] leading-tight"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: hot ? MARIGOLD_DK : INK,
              }}
            >
              {dish.name}
            </h3>
            <span
              className="rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ fontFamily: MONO, color: FERN, border: `1px solid ${LINE}` }}
            >
              {dish.tag}
            </span>
          </div>
          <p className="mt-1.5 text-[14px]" style={{ color: MUTE }}>
            {dish.note}
          </p>
          {/* inline thumbnail for touch + reduced-motion users who never see the floating card:
              always shown on mobile; on desktop only when motion is reduced */}
          <img
            src={`https://picsum.photos/seed/${dish.seed}/240/150`}
            alt={dish.name}
            width={240}
            height={150}
            loading="lazy"
            className={`mt-3 aspect-[8/5] w-40 rounded-lg object-cover ${reduce ? "" : "md:hidden"}`}
          />
        </div>
        <span
          className="self-center text-[18px] tabular-nums"
          style={{ fontFamily: MONO, color: hot ? MARIGOLD_DK : FERN }}
        >
          ${dish.price}
        </span>
      </div>
    </Reveal>
  )
}

function HoverMenu({ dishes, hint = true }: { dishes: Dish[]; hint?: boolean }) {
  return (
    <div>
      {hint && (
        <p className="mb-3 hidden text-[12px] md:block" style={{ fontFamily: MONO, color: MUTE }}>
          ↳ hover a dish to see the plate
        </p>
      )}
      <div>
        {dishes.map((d, i) => (
          <MenuRow key={d.name} dish={d} index={i} />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ pages */

function PageWrap({ children }: { children: ReactNode }) {
  const loc = useLocation()
  return (
    <motion.div
      key={loc.pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

/* ---- HOME ---- */

function Home() {
  const base = useBase()
  const reduce = useReducedMotion()
  return (
    <PageWrap>
      {/* hero — asymmetric, not centered */}
      <section className="relative overflow-hidden">
        {/* organic background blob */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[460px]"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${MARIGOLD}, transparent 62%)`,
              opacity: 0.16,
              filter: "blur(8px)",
              borderRadius: "62% 38% 42% 58% / 56% 44% 56% 44%",
            }}
            animate={{
              borderRadius: [
                "62% 38% 42% 58% / 56% 44% 56% 44%",
                "40% 60% 63% 37% / 41% 56% 44% 59%",
                "62% 38% 42% 58% / 56% 44% 56% 44%",
              ],
              rotate: [0, 18, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-20">
          <div>
            <Eyebrow>Bakery · Kitchen · Wine · Hudson NY</Eyebrow>
            <h1
              className="mt-6 text-balance text-[clamp(46px,8vw,92px)] leading-[0.92]"
              style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Flour by morning,{" "}
              <span className="italic" style={{ color: MARIGOLD }}>
                fire
              </span>{" "}
              by night.
            </h1>
            <p className="mt-7 max-w-md text-[17px] leading-relaxed" style={{ color: MUTE }}>
              We laminate croissants before the sun clears the rooftops and cook over
              live coals once it sets — a single sunlit room that keeps changing its
              mind, all day long.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Btn to={`${base}/menu`}>See the menu</Btn>
              <Btn to={`${base}/visit`} variant="ghost">
                Find us
              </Btn>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
              {[
                { n: 36, s: "hr", l: "croissant laminate" },
                { n: 14, s: "", l: "wines by the glass" },
                { n: 6, s: "am", l: "ovens lit" },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="text-[34px] leading-none"
                    style={{ fontFamily: DISPLAY, fontWeight: 600, color: FERN }}
                  >
                    <Counter to={s.n} suffix={s.s} />
                  </div>
                  <div
                    className="mt-1 text-[11px] uppercase tracking-[0.16em]"
                    style={{ fontFamily: MONO, color: MUTE }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* hero image cluster — overlapping, treated, not a centered stock hero */}
          <div className="relative mx-auto w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="overflow-hidden rounded-[18px]"
              style={{ border: `6px solid ${CARD}`, boxShadow: "0 30px 60px -30px rgba(28,36,26,0.5)" }}
            >
              <img
                src="https://picsum.photos/seed/honeyfern-hero-bake/720/880"
                alt="Trays of laminated pastry cooling on a marble counter"
                width={720}
                height={880}
                className="aspect-[4/5] w-full object-cover"
                style={{ filter: "saturate(1.05) contrast(1.03)" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 6 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="absolute -bottom-8 -left-6 w-40 overflow-hidden rounded-[14px] md:w-48"
              style={{ border: `5px solid ${CARD}`, boxShadow: "0 20px 40px -20px rgba(28,36,26,0.5)" }}
            >
              <img
                src="https://picsum.photos/seed/honeyfern-hero-wine/400/400"
                alt="A glass of chilled natural red wine on a wooden bar"
                width={400}
                height={400}
                className="aspect-square w-full object-cover"
              />
            </motion.div>
            <div
              className="absolute -right-3 top-8 rotate-[8deg] rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em]"
              style={{ background: MARIGOLD, color: PAPER, fontFamily: MONO }}
            >
              open today
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Morning buns til they're gone",
          "New Pét-Nat on tap",
          "Sourdough Fridays",
          "Six-seat counter, walk-ins",
          "Live fire menu changes nightly",
        ]}
      />

      {/* three-part day — asymmetric feature rows, not 3 identical cards */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <Eyebrow color={FERN}>One room, three moods</Eyebrow>
          <SectionLabel>A day at Honeyfern, hour by hour.</SectionLabel>
        </Reveal>
        <div className="mt-14 space-y-6">
          {[
            {
              t: "Morning",
              h: "Pastry & coffee",
              b: "Laminated everything, single-origin filter, and a quiet counter before the street wakes up. Loaves out of the oven at 8.",
              Icon: Croissant,
              seed: "honeyfern-morning",
              tone: PAPER_2,
            },
            {
              t: "Afternoon",
              h: "Sandwiches & the garden",
              b: "Sourdough sandwiches on the day's loaf, market salads, and a glass of something cold in the back courtyard.",
              Icon: Leaf,
              seed: "honeyfern-afternoon",
              tone: CARD,
            },
            {
              t: "Evening",
              h: "Live fire & low light",
              b: "The grill comes up, the candles come out, and the wine list opens. A short menu that follows whatever arrived that morning.",
              Icon: Wine,
              seed: "honeyfern-evening",
              tone: PAPER_2,
            },
          ].map((row, i) => (
            <Reveal key={row.t} delay={i * 0.08}>
              <article
                className={`grid items-stretch gap-6 overflow-hidden rounded-2xl md:grid-cols-[0.9fr_1.1fr] ${
                  i % 2 ? "md:[direction:rtl]" : ""
                }`}
                style={{ background: row.tone, border: `1px solid ${LINE}` }}
              >
                <div className="relative min-h-[220px] [direction:ltr]">
                  <img
                    src={`https://picsum.photos/seed/${row.seed}/700/500`}
                    alt={`${row.h} at Honeyfern`}
                    width={700}
                    height={500}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ filter: "saturate(1.02) contrast(1.02)" }}
                  />
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ background: INK, color: PAPER, fontFamily: MONO }}
                  >
                    {row.t}
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-3 p-7 [direction:ltr] md:p-9">
                  <row.Icon className="h-7 w-7" style={{ color: MARIGOLD }} />
                  <h3 className="text-[26px]" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                    {row.h}
                  </h3>
                  <p className="max-w-sm text-[15px] leading-relaxed" style={{ color: MUTE }}>
                    {row.b}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* quote band */}
      <section style={{ background: FERN }}>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p
              className="text-balance text-[clamp(26px,4vw,44px)] leading-[1.15]"
              style={{ fontFamily: DISPLAY, fontWeight: 500, color: PAPER, fontStyle: "italic" }}
            >
              “The croissants alone are worth the drive up the Hudson — but stay for
              dinner and you'll cancel your plans for the rest of the weekend.”
            </p>
            <div
              className="mt-7 text-[12px] uppercase tracking-[0.2em]"
              style={{ fontFamily: MONO, color: MARIGOLD }}
            >
              — Valley Table, 2026
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div
          className="relative overflow-hidden rounded-[24px] px-8 py-14 text-center md:px-16 md:py-20"
          style={{ background: CARD, border: `1px solid ${LINE}` }}
        >
          <Reveal>
            <Eyebrow>Wed–Sun</Eyebrow>
            <h2
              className="mx-auto mt-5 max-w-2xl text-balance text-[clamp(30px,4.6vw,54px)] leading-[1.04]"
              style={{ fontFamily: DISPLAY, fontWeight: 600 }}
            >
              Pull up a seat at the counter.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[16px]" style={{ color: MUTE }}>
              Mornings are walk-in. For dinner, the six-top by the fire books up first —
              grab it while it's yours.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Btn to={`${base}/visit`}>Book a table</Btn>
              <Btn to={`${base}/bakery`} variant="ghost">
                Pre-order bread
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  )
}

/* ---- MENU ---- */

function PageHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: ReactNode
  intro: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-6 pt-16 md:pt-20">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className="mt-5 max-w-3xl text-balance text-[clamp(40px,6.5vw,78px)] leading-[0.95]"
          style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed" style={{ color: MUTE }}>
          {intro}
        </p>
      </Reveal>
    </section>
  )
}

function Menu() {
  return (
    <PageWrap>
      <PageHead
        eyebrow="Dinner · 5pm–late"
        title={
          <>
            Cooked over coals,{" "}
            <span className="italic" style={{ color: MARIGOLD }}>
              changed
            </span>{" "}
            most nights.
          </>
        }
        intro="A short list that follows the market and the fire. Hover any plate to see it — the kitchen menu rewrites itself with whatever the morning brought."
      />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-12 md:grid-cols-[1.5fr_1fr] md:py-16">
        <div>
          <h2
            className="mb-2 text-[14px] font-semibold uppercase tracking-[0.2em]"
            style={{ fontFamily: MONO, color: FERN }}
          >
            From the kitchen
          </h2>
          <HoverMenu dishes={PLATES} />
        </div>

        {/* wine list aside */}
        <aside className="md:pt-9">
          <div
            className="sticky top-28 rounded-2xl p-7"
            style={{ background: FERN, color: PAPER }}
          >
            <div className="flex items-center gap-2">
              <Wine className="h-5 w-5" style={{ color: MARIGOLD }} />
              <h2 className="text-[22px]" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                On the list tonight
              </h2>
            </div>
            <p className="mt-2 text-[13px]" style={{ color: "#c7cabb" }}>
              Low-intervention, always changing. Ask the bar.
            </p>
            <ul className="mt-6 space-y-5">
              {WINES.map((w) => (
                <li
                  key={w.name}
                  className="flex items-baseline justify-between gap-4 border-b pb-4 last:border-0"
                  style={{ borderColor: "rgba(247,241,227,0.16)" }}
                >
                  <div>
                    <div className="text-[16px]" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                      {w.name}
                    </div>
                    <div className="mt-0.5 text-[12px]" style={{ color: "#c7cabb" }}>
                      {w.note}
                    </div>
                  </div>
                  <span className="text-[15px]" style={{ fontFamily: MONO, color: MARIGOLD }}>
                    ${w.glass}
                  </span>
                </li>
              ))}
            </ul>
            <p
              className="mt-6 text-[11px] uppercase tracking-[0.16em]"
              style={{ fontFamily: MONO, color: "#9aa091" }}
            >
              Bottles from $48 · corkage waived Wed
            </p>
          </div>
        </aside>
      </section>

      <section style={{ background: PAPER_2 }}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <Reveal>
            <p className="text-[15px] leading-relaxed" style={{ color: MUTE }}>
              <span style={{ color: INK, fontWeight: 600 }}>A note on the menu.</span>{" "}
              We write it the morning of, on the chalkboard by the pass. Dishes here are
              a snapshot — the only constant is the fire and the bread basket. Dietary
              needs? Tell us when you book; the kitchen is happy to adapt.
            </p>
          </Reveal>
        </div>
      </section>
    </PageWrap>
  )
}

/* ---- BAKERY ---- */

function Bakery() {
  const base = useBase()
  return (
    <PageWrap>
      <PageHead
        eyebrow="Bakery · 8–11am, til it's gone"
        title={
          <>
            36 hours of{" "}
            <span className="italic" style={{ color: MARIGOLD }}>
              patience
            </span>
            , in one bite.
          </>
        }
        intro="Everything is laminated, proofed and baked in the open kitchen each morning. Hover a pastry to meet it — and pre-order loaves before they sell out by ten."
      />

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-12 md:grid-cols-[1fr_1.4fr] md:py-16">
        {/* process aside, left */}
        <aside className="md:pt-9">
          <div className="overflow-hidden rounded-2xl" style={{ border: `6px solid ${CARD}` }}>
            <img
              src="https://picsum.photos/seed/honeyfern-baker/640/760"
              alt="A baker scoring a country sourdough loaf before it goes into the oven"
              width={640}
              height={760}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
              style={{ filter: "saturate(1.03) contrast(1.03)" }}
            />
          </div>
          <div className="mt-7 space-y-5">
            {[
              { n: "01", t: "Wild levain", b: "Fed twice daily, no commercial yeast — just flour, water and time." },
              { n: "02", t: "Cold ferment", b: "72 hours in the proofer for flavour and an open, custardy crumb." },
              { n: "03", t: "Stone hearth", b: "Baked dark on stone for a blistered, lacquered crust." },
            ].map((s) => (
              <Reveal key={s.n}>
                <div className="flex gap-4">
                  <span
                    className="text-[15px] tabular-nums"
                    style={{ fontFamily: MONO, color: MARIGOLD }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div className="text-[17px]" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                      {s.t}
                    </div>
                    <p className="mt-1 text-[14px]" style={{ color: MUTE }}>
                      {s.b}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </aside>

        <div>
          <h2
            className="mb-2 text-[14px] font-semibold uppercase tracking-[0.2em]"
            style={{ fontFamily: MONO, color: FERN }}
          >
            From the counter
          </h2>
          <HoverMenu dishes={PASTRY} />
          <div className="mt-10">
            <Btn to={`${base}/visit`}>Pre-order for pickup</Btn>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Sourdough out at 8",
          "Canelé by the box",
          "Pistachio danish weekends only",
          "Bread sells out by 10",
          "Whole-grain rye Thursdays",
        ]}
      />
    </PageWrap>
  )
}

/* ---- VISIT ---- */

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ fontFamily: MONO, color: FERN }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

function Visit() {
  const [sent, setSent] = useState(false)
  const inputCls =
    "w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-colors duration-200"
  const inputStyle: CSSProperties = {
    background: PAPER,
    border: `1.5px solid ${LINE}`,
    color: INK,
  }
  return (
    <PageWrap>
      <PageHead
        eyebrow="411 Warren Street · Hudson NY"
        title={
          <>
            Come{" "}
            <span className="italic" style={{ color: MARIGOLD }}>
              find
            </span>{" "}
            the corner room.
          </>
        }
        intro="Mornings are first-come. For dinner, drop a request below and we'll confirm by email — the fire-side six-top goes fast, so the earlier the better."
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2 md:py-16">
        {/* booking form */}
        <div className="rounded-2xl p-7 md:p-9" style={{ background: CARD, border: `1px solid ${LINE}` }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full min-h-[360px] flex-col items-center justify-center text-center"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: FERN }}
              >
                <Leaf className="h-7 w-7" style={{ color: PAPER }} />
              </span>
              <h3 className="mt-5 text-[26px]" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                Request received.
              </h3>
              <p className="mt-2 max-w-xs text-[15px]" style={{ color: MUTE }}>
                We'll email to confirm within a few hours. Keep an eye on your inbox —
                and your appetite.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-[13px] underline"
                style={{ color: MARIGOLD_DK }}
              >
                Make another request
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="space-y-5"
            >
              <h2 className="text-[24px]" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                Request a table
              </h2>
              <Field label="Name">
                <input required className={inputCls} style={inputStyle} placeholder="Your name" />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  className={inputCls}
                  style={inputStyle}
                  placeholder="you@example.com"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date">
                  <input required type="date" className={inputCls} style={inputStyle} />
                </Field>
                <Field label="Guests">
                  <select required className={inputCls} style={inputStyle} defaultValue="2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Anything we should know?">
                <textarea
                  className={inputCls}
                  style={inputStyle}
                  rows={3}
                  placeholder="Allergies, celebrations, the fire-side six-top…"
                />
              </Field>
              <Magnetic strength={0.25}>
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-colors duration-200"
                  style={{ background: INK, color: PAPER }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = MARIGOLD)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = INK)}
                >
                  Send request
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </Magnetic>
            </form>
          )}
        </div>

        {/* details + map-ish panel */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl" style={{ border: `6px solid ${CARD}` }}>
            <img
              src="https://picsum.photos/seed/honeyfern-storefront/720/440"
              alt="The Honeyfern storefront on Warren Street, awning out, bikes parked beside it"
              width={720}
              height={440}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
              style={{ filter: "saturate(1.03) contrast(1.02)" }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { Icon: MapPin, t: "Address", a: "411 Warren Street", b: "Hudson, NY 12534" },
              { Icon: Clock, t: "Hours", a: "Wed–Sun, 8am–late", b: "Closed Mon & Tue" },
              { Icon: Phone, t: "Call", a: "(518) 555-0184", b: "Daily after 2pm" },
              { Icon: Wine, t: "Walk-ins", a: "Counter + bar", b: "First-come most nights" },
            ].map((d) => (
              <Reveal key={d.t}>
                <div
                  className="h-full rounded-2xl p-5"
                  style={{ background: PAPER_2, border: `1px solid ${LINE}` }}
                >
                  <d.Icon className="h-5 w-5" style={{ color: MARIGOLD }} />
                  <div
                    className="mt-3 text-[11px] uppercase tracking-[0.16em]"
                    style={{ fontFamily: MONO, color: FERN }}
                  >
                    {d.t}
                  </div>
                  <div className="mt-1 text-[15px] font-semibold">{d.a}</div>
                  <div className="text-[13px]" style={{ color: MUTE }}>
                    {d.b}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageWrap>
  )
}

/* ----------------------------------------------------------------- shell */

export default function Honeyfern() {
  return (
    <MotionConfig reducedMotion="user">
      <HoverRevealLayer>
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="bakery" element={<Bakery />} />
            <Route path="visit" element={<Visit />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </HoverRevealLayer>
    </MotionConfig>
  )
}
