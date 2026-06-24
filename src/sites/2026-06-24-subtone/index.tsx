import {
  createContext,
  useContext,
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
  useTransform,
} from "framer-motion"
import {
  ArrowUpRight,
  Clock,
  Disc3,
  MapPin,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Train,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Subtone — record shop & reissue label, Glasgow",
  description:
    "An independent record shop and reissue label off Saltmarket in Glasgow — jazz, soul, dub and the deep electronic cuts worth crate-digging for. Featured interaction: hover any record and the vinyl slides out of its sleeve and spins, set against a cursor-lit shop-floor grid — plus magnetic add-to-bag buttons, a sliding cart with an animated running total, and staggered scroll reveals.",
  date: "2026-06-24",
  type: "E-commerce / record shop",
  interaction:
    "Hover-pull vinyl (the disc slides out of its sleeve and spins) + cursor spotlight grid + magnetic add-to-bag + animated cart total",
  pages: ["Home", "Shop", "Label", "Journal", "Visit"],
}

/* --------------------------------------------------------------- palette */
// Warm shop-floor neutrals + ONE accent: sodium vermilion.
// paper #f1ead9 · ink #181410 · char (dark ground) #181511 · vermilion #df4f27
const PAPER = "#f1ead9"
const PAPER_DEEP = "#e7ddc7"
const INK = "#181410"
const CHAR = "#16130e"
const CHAR_2 = "#211c15"
const VERM = "#df4f27"
// Solid muted tones that clear AA at small sizes.
const MUTED = "#5d5346" // on paper ≈ 6.2:1
const MUTED_DK = "#b6a98f" // on char ≈ 7.4:1

const DISPLAY = "'Syne', system-ui, sans-serif"
const BODY = "'Spectral', Georgia, serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

/* ----------------------------------------------------------------- data */

type Genre = "Jazz" | "Soul" | "Dub" | "Electronic" | "Library"

type Record = {
  id: string
  cat: string
  artist: string
  title: string
  year: number
  genre: Genre
  format: string
  price: number
  seed: string
  hue: number // vinyl centre-label hue
  note: string
}

const RECORDS: Record[] = [
  {
    id: "r1",
    cat: "SUB-021",
    artist: "Etta Marrow Quartet",
    title: "Saltmarket Suite",
    year: 1971,
    genre: "Jazz",
    format: "180g LP · gatefold",
    price: 28,
    seed: "saltmarket-suite",
    hue: 18,
    note: "Spiritual jazz cut live in a Trongate basement, lost for fifty years.",
  },
  {
    id: "r2",
    cat: "SUB-019",
    artist: "The Govan Sound",
    title: "Tenement Soul, Vol. 2",
    year: 1968,
    genre: "Soul",
    format: "LP compilation",
    price: 26,
    seed: "tenement-soul",
    hue: 44,
    note: "Northern soul stompers pulled from Clydeside seven-inches.",
  },
  {
    id: "r3",
    cat: "SUB-024",
    artist: "King Tiber",
    title: "Echo from the Close",
    year: 1979,
    genre: "Dub",
    format: "12\" · heavyweight",
    price: 22,
    seed: "echo-close-dub",
    hue: 142,
    note: "Bottom-heavy dub plates, mastered loud for the soundsystem.",
  },
  {
    id: "r4",
    cat: "SUB-027",
    artist: "Ailsa Vane",
    title: "Quiet Machines",
    year: 1983,
    genre: "Electronic",
    format: "LP · download card",
    price: 30,
    seed: "quiet-machines",
    hue: 208,
    note: "Modular synth minimalism — patient, glacial, faintly homesick.",
  },
  {
    id: "r5",
    cat: "SUB-015",
    artist: "Library Department",
    title: "Working Patterns 1974–77",
    year: 2024,
    genre: "Library",
    format: "2×LP · 16pp booklet",
    price: 34,
    seed: "working-patterns",
    hue: 32,
    note: "Industrial library music for documentaries that never aired.",
  },
  {
    id: "r6",
    cat: "SUB-012",
    artist: "Nadia Holm Trio",
    title: "After the Last Train",
    year: 1976,
    genre: "Jazz",
    format: "LP · obi strip",
    price: 32,
    seed: "after-last-train",
    hue: 0,
    note: "Late-night piano trio, recorded in one take after closing time.",
  },
  {
    id: "r7",
    cat: "SUB-022",
    artist: "Bram Côte",
    title: "Soft Currency",
    year: 1981,
    genre: "Soul",
    format: "LP",
    price: 24,
    seed: "soft-currency",
    hue: 280,
    note: "Boogie-funk with a budget and a deadline, and all the better for it.",
  },
  {
    id: "r8",
    cat: "SUB-026",
    artist: "Pier & Halyard",
    title: "Tidewater Dubs",
    year: 2023,
    genre: "Dub",
    format: "12\" · risograph sleeve",
    price: 21,
    seed: "tidewater-dubs",
    hue: 170,
    note: "Two producers, one spring reverb, and the Firth of Clyde at low tide.",
  },
]

type Release = {
  cat: string
  artist: string
  title: string
  status: "Out now" | "Pre-order" | "Repress"
  blurb: string
  seed: string
  hue: number
}

const RELEASES: Release[] = [
  {
    cat: "SUB-027",
    artist: "Ailsa Vane",
    title: "Quiet Machines",
    status: "Out now",
    blurb:
      "Our first all-new commission: a side-long modular suite recorded at a kitchen table in Dennistoun.",
    seed: "quiet-machines",
    hue: 208,
  },
  {
    cat: "SUB-028",
    artist: "Etta Marrow Quartet",
    title: "Saltmarket Suite (Reissue)",
    status: "Pre-order",
    blurb:
      "Restored from the only surviving acetate, remastered at half-speed. Ships in October.",
    seed: "saltmarket-suite",
    hue: 18,
  },
  {
    cat: "SUB-015",
    artist: "Library Department",
    title: "Working Patterns",
    status: "Repress",
    blurb:
      "Third pressing of our best-seller, this time on translucent amber wax.",
    seed: "working-patterns",
    hue: 32,
  },
]

type Post = {
  kicker: string
  title: string
  dek: string
  read: string
  seed: string
}

const POSTS: Post[] = [
  {
    kicker: "Field notes",
    title: "How a basement tape became SUB-021",
    dek: "Tracing a single spiritual-jazz acetate from a house clearance in Govanhill to a finished reissue.",
    read: "8 min",
    seed: "fieldnotes-basement",
  },
  {
    kicker: "Buyer's guide",
    title: "Start here: ten records to open a dub collection",
    dek: "No King Tubby snobbery — just heavyweight pressings that sound enormous and cost less than a round.",
    read: "6 min",
    seed: "guide-dub",
  },
  {
    kicker: "Shop diary",
    title: "Why we still grade every sleeve by hand",
    dek: "On Goldmine grading, honest VG+, and never letting an algorithm describe a crackle.",
    read: "5 min",
    seed: "diary-grading",
  },
]

const HOURS = [
  { day: "Tue – Thu", time: "11:00 – 18:00" },
  { day: "Friday", time: "11:00 – 19:00" },
  { day: "Saturday", time: "10:00 – 18:00" },
  { day: "Sun – Mon", time: "Closed (digging)" },
]

/* --------------------------------------------------------------- helpers */

const fmt = (n: number) => `£${n.toFixed(2)}`

/* ------------------------------------------------------------------ cart */

type CartLine = Record & { qty: number }
type CartCtx = {
  lines: CartLine[]
  count: number
  total: number
  add: (r: Record) => void
  setQty: (id: string, qty: number) => void
  open: boolean
  setOpen: (v: boolean) => void
}
const Cart = createContext<CartCtx | null>(null)
const useCart = () => {
  const c = useContext(Cart)
  if (!c) throw new Error("cart")
  return c
}

function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)

  const add = (r: Record) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.id === r.id)
      if (hit) return prev.map((l) => (l.id === r.id ? { ...l, qty: l.qty + 1 } : l))
      return [...prev, { ...r, qty: 1 }]
    })
    setOpen(true)
  }
  const setQty = (id: string, qty: number) =>
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    )

  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)

  return (
    <Cart.Provider value={{ lines, count, total, add, setQty, open, setOpen }}>
      {children}
    </Cart.Provider>
  )
}

/* --------------------------------------------------------- animated number */

function Ticker({ value, prefix = "" }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [text, setText] = useState(`${prefix}${value.toFixed(2)}`)
  const prev = useRef(value)
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (v) => setText(`${prefix}${v.toFixed(2)}`),
    })
    prev.current = value
    return () => controls.stop()
  }, [value, prefix])
  return (
    <span ref={ref} style={{ fontFamily: MONO }}>
      {text}
    </span>
  )
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration: 1.2,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  )
}

/* -------------------------------------------------- the featured vinyl card */

/**
 * The disc sits behind the sleeve and peeks out at rest. On hover it slides
 * fully out to the right and spins. Peek-at-rest keeps it legible on touch and
 * under reduced motion (where the slide/spin transforms are suppressed).
 */
function Vinyl({ hue, spinning }: { hue: number; spinning: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-y-0 left-0 aspect-square"
      variants={{ rest: { x: "13%", rotate: 0 }, hover: { x: "46%", rotate: 360 } }}
      transition={{
        x: { type: "spring", stiffness: 120, damping: 18 },
        rotate: spinning
          ? { duration: 4, ease: "linear", repeat: Infinity }
          : { duration: 0.5 },
      }}
      style={{ zIndex: 0 }}
    >
      <div
        className="relative h-full w-full rounded-full shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 50%, #0b0b0b 0px, #0b0b0b 2px, #1c1c1c 3px, #0b0b0b 4px), radial-gradient(circle at 38% 32%, rgba(255,255,255,0.16), transparent 42%)",
        }}
      >
        {/* centre label */}
        <div
          className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: `hsl(${hue} 70% 46%)` }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <span
              className="text-[7px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "rgba(255,255,255,0.85)", fontFamily: MONO }}
            >
              Subtone
            </span>
          </div>
        </div>
        {/* spindle hole */}
        <div className="absolute left-1/2 top-1/2 h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b0b0b]" />
      </div>
    </motion.div>
  )
}

function RecordCard({ r }: { r: Record }) {
  const { add } = useCart()
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      className="group relative"
    >
      <motion.div
        initial="rest"
        animate={hover ? "hover" : "rest"}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        className="relative aspect-square"
      >
        <Vinyl hue={r.hue} spinning={hover} />
        {/* sleeve */}
        <motion.div
          variants={{ rest: { rotate: 0 }, hover: { rotate: -1.5 } }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="absolute inset-0 z-10 overflow-hidden rounded-[3px] border"
          style={{ borderColor: "rgba(0,0,0,0.5)" }}
        >
          <img
            src={`https://picsum.photos/seed/${r.seed}/600/600`}
            alt={`Sleeve artwork for ${r.title} by ${r.artist}`}
            width={600}
            height={600}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ filter: "grayscale(0.35) contrast(1.05)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 52%, rgba(15,12,8,0.82))`,
              mixBlendMode: "multiply",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
            <span
              className="rounded-full bg-[rgba(0,0,0,0.45)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] backdrop-blur"
              style={{ color: PAPER, fontFamily: MONO }}
            >
              {r.genre}
            </span>
            <span className="text-[10px]" style={{ color: MUTED_DK, fontFamily: MONO }}>
              {r.cat}
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold" style={{ color: PAPER }}>
            {r.title}
          </p>
          <p className="truncate text-[13px]" style={{ color: MUTED_DK }}>
            {r.artist} · {r.year}
          </p>
        </div>
        <span className="shrink-0 text-[15px] font-semibold" style={{ color: VERM, fontFamily: MONO }}>
          {fmt(r.price)}
        </span>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: MUTED_DK }}>
        {r.note}
      </p>
      <p className="mt-1 text-[11px]" style={{ color: MUTED_DK, fontFamily: MONO }}>
        {r.format}
      </p>
      <div className="mt-4">
        <Magnetic strength={0.25}>
          <button
            onClick={() => add(r)}
            className="group/btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ background: "transparent", color: PAPER, border: `1px solid ${VERM}`, ["--tw-ring-color" as string]: VERM, ["--tw-ring-offset-color" as string]: CHAR }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = VERM
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = VERM
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to bag
          </button>
        </Magnetic>
      </div>
    </motion.div>
  )
}

/* ----------------------------------------------- cursor spotlight container */

function SpotlightFloor({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -9999, y: -9999 })
  const [on, setOn] = useState(false)
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const b = ref.current?.getBoundingClientRect()
        if (b) setPos({ x: e.clientX - b.left, y: e.clientY - b.top })
      }}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      className={`relative ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: on ? 1 : 0,
          background: `radial-gradient(460px circle at ${pos.x}px ${pos.y}px, rgba(223,79,39,0.16), transparent 65%)`,
        }}
      />
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------- chrome */

function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

function Nav() {
  const base = useBase()
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const links: [string, string, boolean][] = [
    ["Shop", `${base}/shop`, false],
    ["Label", `${base}/label`, false],
    ["Journal", `${base}/journal`, false],
    ["Visit", `${base}/visit`, false],
  ]
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{ background: "rgba(22,19,14,0.86)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8">
        <NavLink to={base} end className="flex items-center gap-2.5" onClick={() => setMenu(false)}>
          <span
            className="grid h-8 w-8 place-items-center rounded-full"
            style={{ background: VERM }}
          >
            <Disc3 className="h-5 w-5" style={{ color: CHAR }} />
          </span>
          <span
            className="text-[19px] font-extrabold tracking-tight"
            style={{ color: PAPER, fontFamily: DISPLAY }}
          >
            Subtone
          </span>
        </NavLink>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className="group relative text-[13px] font-medium uppercase tracking-[0.12em]"
              style={({ isActive }) => ({ color: isActive ? PAPER : MUTED_DK })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    className="absolute -bottom-1.5 left-0 h-px origin-left bg-[var(--v)] transition-transform duration-200"
                    style={
                      {
                        "--v": VERM,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        width: "100%",
                      } as CSSProperties
                    }
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors"
            style={{ color: PAPER, border: `1px solid rgba(255,255,255,0.16)` }}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold"
                  style={{ background: VERM, color: CHAR, fontFamily: MONO }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full md:hidden"
            style={{ color: PAPER }}
            onClick={() => setMenu((m) => !m)}
            aria-label="Menu"
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {links.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenu(false)}
                  className="rounded-md px-2 py-3 text-[15px] font-medium"
                  style={({ isActive }) => ({ color: isActive ? VERM : PAPER })}
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

function CartDrawer() {
  const { lines, total, setQty, open, setOpen, count } = useCart()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/55"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col"
            style={{ background: PAPER }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: "rgba(0,0,0,0.1)" }}
            >
              <h2 className="text-[15px] font-bold uppercase tracking-[0.14em]" style={{ color: INK }}>
                Your bag ({count})
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close bag" style={{ color: INK }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <Disc3 className="mx-auto h-10 w-10" style={{ color: MUTED }} />
                    <p className="mt-3 text-[14px]" style={{ color: MUTED }}>
                      Your bag is empty. Go dig.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((l) => (
                    <li key={l.id} className="flex gap-3">
                      <img
                        src={`https://picsum.photos/seed/${l.seed}/120/120`}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        className="h-14 w-14 rounded-[2px] object-cover"
                        style={{ filter: "grayscale(0.3)" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold" style={{ color: INK }}>
                          {l.title}
                        </p>
                        <p className="truncate text-[12px]" style={{ color: MUTED }}>
                          {l.artist}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            onClick={() => setQty(l.id, l.qty - 1)}
                            className="grid h-6 w-6 place-items-center rounded-full border"
                            style={{ borderColor: "rgba(0,0,0,0.2)", color: INK }}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span
                            className="w-5 text-center text-[13px] font-semibold"
                            style={{ color: INK, fontFamily: MONO }}
                          >
                            {l.qty}
                          </span>
                          <button
                            onClick={() => setQty(l.id, l.qty + 1)}
                            className="grid h-6 w-6 place-items-center rounded-full border"
                            style={{ borderColor: "rgba(0,0,0,0.2)", color: INK }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <span className="text-[14px] font-semibold" style={{ color: INK, fontFamily: MONO }}>
                        {fmt(l.qty * l.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t px-5 py-4" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-[13px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Subtotal
                </span>
                <span className="text-[22px] font-bold" style={{ color: INK }}>
                  <Ticker value={total} prefix="£" />
                </span>
              </div>
              <p className="mb-3 text-[11.5px]" style={{ color: MUTED }}>
                Free UK shipping over £40 · packed in stiffened mailers, never bent.
              </p>
              <button
                disabled={lines.length === 0}
                className="w-full rounded-full py-3 text-[13px] font-bold uppercase tracking-[0.14em] transition-opacity disabled:opacity-40"
                style={{ background: INK, color: PAPER }}
              >
                Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Footer() {
  const base = useBase()
  return (
    <footer className="border-t" style={{ background: CHAR, borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: VERM }}>
              <Disc3 className="h-5 w-5" style={{ color: CHAR }} />
            </span>
            <span
              className="text-[19px] font-extrabold tracking-tight"
              style={{ color: PAPER, fontFamily: DISPLAY }}
            >
              Subtone
            </span>
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed" style={{ color: MUTED_DK }}>
            Record shop & reissue label. 14 Steel Wynd, off Saltmarket, Glasgow G1.
            We grade every sleeve by hand and answer every email.
          </p>
        </div>
        <div>
          <p className="mb-3 text-[12px] uppercase tracking-[0.16em]" style={{ color: MUTED_DK, fontFamily: MONO }}>
            Browse
          </p>
          <ul className="space-y-2 text-[14px]">
            {[
              ["Shop", `${base}/shop`],
              ["Label", `${base}/label`],
              ["Journal", `${base}/journal`],
              ["Visit", `${base}/visit`],
            ].map(([l, t]) => (
              <li key={t}>
                <NavLink to={t} className="transition-colors hover:text-[var(--v)]" style={{ color: PAPER, ["--v" as string]: VERM }}>
                  {l}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[12px] uppercase tracking-[0.16em]" style={{ color: MUTED_DK, fontFamily: MONO }}>
            Stay in
          </p>
          <p className="mb-3 text-[14px]" style={{ color: MUTED_DK }}>
            New arrivals every Thursday, one honest email a week.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex overflow-hidden rounded-full border" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[13px] outline-none"
              style={{ color: PAPER }}
            />
            <button className="px-4 text-[12px] font-bold uppercase tracking-[0.1em]" style={{ background: VERM, color: CHAR }}>
              Join
            </button>
          </form>
        </div>
      </div>
      <div
        className="border-t px-5 py-5 text-center text-[12px] sm:px-8"
        style={{ borderColor: "rgba(255,255,255,0.08)", color: MUTED_DK, fontFamily: MONO }}
      >
        © 2026 Subtone Recordings — made on Clydeside · est. 2019
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------- pages */

function Page({ children }: { children: ReactNode }) {
  const loc = useLocation()
  return (
    <motion.div
      key={loc.pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em]"
      style={{ color: VERM, fontFamily: MONO }}
    >
      <span className="h-px w-6" style={{ background: VERM }} />
      {children}
    </span>
  )
}

/* ----- Home ----- */

function Home() {
  const base = useBase()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const heroSpin = useTransform(mx, [0, 1], [-8, 8])
  const heroShift = useTransform(my, [0, 1], [-10, 10])
  const featured = RECORDS.slice(0, 4)

  return (
    <Page>
      {/* hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: CHAR }}
        onPointerMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect()
          mx.set((e.clientX - b.left) / b.width)
          my.set((e.clientY - b.top) / b.height)
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(900px circle at 80% 10%, rgba(223,79,39,0.18), transparent 55%), radial-gradient(700px circle at 0% 90%, rgba(223,79,39,0.1), transparent 55%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div>
            <SectionLabel>Record shop & reissue label · Glasgow</SectionLabel>
            <h1
              className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.02em]"
              style={{ color: PAPER, fontFamily: DISPLAY }}
            >
              The good stuff,
              <br />
              <span style={{ color: VERM }}>graded by hand.</span>
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed" style={{ color: MUTED_DK }}>
              Jazz, soul, dub and deep electronic — pulled from house clearances,
              pressed in small runs, and never described by an algorithm. Hover a
              record below to pull the wax.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <NavLink
                  to={`${base}/shop`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold uppercase tracking-[0.1em]"
                  style={{ background: VERM, color: CHAR }}
                >
                  Browse the bins <ArrowUpRight className="h-4 w-4" />
                </NavLink>
              </Magnetic>
              <NavLink
                to={`${base}/label`}
                className="text-[14px] font-semibold uppercase tracking-[0.1em] underline-offset-4 hover:underline"
                style={{ color: PAPER }}
              >
                Our pressings →
              </NavLink>
            </div>
          </div>

          {/* hero stack: a sleeve with the wax peeking, drifting with the cursor */}
          <motion.div
            className="relative mx-auto aspect-square w-full max-w-[360px]"
            style={{ rotate: heroSpin, x: heroShift }}
          >
            <div className="absolute inset-y-2 left-10 right-[-8%] aspect-square">
              <div
                className="h-full w-full rounded-full"
                style={{
                  background:
                    "repeating-radial-gradient(circle at 50% 50%, #0b0b0b 0px, #0b0b0b 2px, #1f1f1f 3px, #0b0b0b 4px)",
                  boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: VERM }}
                />
                <div className="absolute left-1/2 top-1/2 h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b0b0b]" />
              </div>
            </div>
            <div
              className="absolute inset-0 overflow-hidden rounded-[4px] border shadow-2xl"
              style={{ borderColor: "rgba(0,0,0,0.6)" }}
            >
              <img
                src="https://picsum.photos/seed/subtone-hero-sleeve/700/700"
                alt="Featured record sleeve on the Subtone shop floor"
                width={700}
                height={700}
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(0.5) contrast(1.08)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(160deg, rgba(223,79,39,0.28), transparent 55%)`, mixBlendMode: "screen" }}
              />
            </div>
          </motion.div>
        </div>

        {/* stat strip */}
        <div className="relative border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="mx-auto grid max-w-[1180px] grid-cols-2 divide-x px-5 sm:px-8 md:grid-cols-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {[
              { n: 12000, s: "+", l: "Records in the bins" },
              { n: 27, s: "", l: "Reissues pressed" },
              { n: 6, s: " yr", l: "On Steel Wynd" },
              { n: 100, s: "%", l: "Hand-graded sleeves" },
            ].map((st, i) => (
              <div key={i} className="px-3 py-7 sm:px-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold" style={{ color: PAPER, fontFamily: DISPLAY }}>
                  <CountUp to={st.n} suffix={st.s} />
                </p>
                <p className="mt-1 text-[12px] uppercase tracking-[0.12em]" style={{ color: MUTED_DK }}>
                  {st.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* featured grid (featured interaction on the dark floor) */}
      <section style={{ background: CHAR }}>
        <SpotlightFloor className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>This week in the racks</SectionLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight" style={{ color: PAPER, fontFamily: DISPLAY }}>
                Fresh on the wall
              </h2>
            </div>
            <NavLink
              to={`${base}/shop`}
              className="text-[13px] font-semibold uppercase tracking-[0.1em] hover:text-[var(--v)]"
              style={{ color: PAPER, ["--v" as string]: VERM }}
            >
              See all {RECORDS.length} →
            </NavLink>
          </div>
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featured.map((r) => (
              <RecordCard key={r.id} r={r} />
            ))}
          </motion.div>
        </SpotlightFloor>
      </section>

      {/* manifesto band on paper */}
      <section style={{ background: PAPER }}>
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <SectionLabel>How we work</SectionLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.05] tracking-tight" style={{ color: INK, fontFamily: DISPLAY }}>
                A shop that
                <br />
                actually listens.
              </h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                ["Honest grading", "Every sleeve and disc is graded by ear and eye to the Goldmine standard. VG+ means VG+."],
                ["Packed to survive", "Stiffened mailers, corner protectors, and a sleeve we'd accept ourselves. Bent corners are a personal failure."],
                ["Pressed with care", "Our reissues are licensed, restored and mastered at half-speed — not flipped off a YouTube rip."],
                ["Open to everyone", "No gatekeeping, no eye-rolls. Ask us anything; we'd rather you found the right record than the dear one."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06}>
                  <div className="rounded-lg border p-5" style={{ borderColor: "rgba(0,0,0,0.12)", background: PAPER_DEEP }}>
                    <h3 className="text-[16px] font-bold" style={{ color: INK }}>
                      {t}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MUTED }}>
                      {d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ----- Shop ----- */

function Shop() {
  const [genre, setGenre] = useState<Genre | "All">("All")
  const genres: (Genre | "All")[] = ["All", "Jazz", "Soul", "Dub", "Electronic", "Library"]
  const list = genre === "All" ? RECORDS : RECORDS.filter((r) => r.genre === genre)
  return (
    <Page>
      <section style={{ background: CHAR }}>
        <div className="mx-auto max-w-[1180px] px-5 pb-6 pt-16 sm:px-8 md:pt-20">
          <SectionLabel>The bins</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-tight" style={{ color: PAPER, fontFamily: DISPLAY }}>
            Shop the racks
          </h1>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed" style={{ color: MUTED_DK }}>
            Everything in stock right now. Prices include the careful pack — hover
            to pull the wax, tap to add to your bag.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {genres.map((g) => {
              const active = g === genre
              return (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className="rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors"
                  style={{
                    background: active ? VERM : "transparent",
                    color: active ? CHAR : PAPER,
                    border: `1px solid ${active ? VERM : "rgba(255,255,255,0.18)"}`,
                  }}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </div>

        <SpotlightFloor className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 sm:px-8">
          <motion.div
            key={genre}
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((r) => (
              <RecordCard key={r.id} r={r} />
            ))}
          </motion.div>
          {list.length === 0 && (
            <p className="py-16 text-center text-[15px]" style={{ color: MUTED_DK }}>
              Nothing in that genre right now — check back Thursday.
            </p>
          )}
        </SpotlightFloor>
      </section>
    </Page>
  )
}

/* ----- Label ----- */

function Label() {
  const base = useBase()
  return (
    <Page>
      <section style={{ background: PAPER }}>
        <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-16 sm:px-8 md:pt-24">
          <SectionLabel>Subtone Recordings</SectionLabel>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight" style={{ color: INK, fontFamily: DISPLAY }}>
            We don't just sell records. We make them.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: MUTED }}>
            Twenty-seven releases since 2020 — restored archival jazz, new
            commissions and the odd lovingly-licensed reissue. Each one mastered
            at half-speed and pressed in runs of 500 or fewer.
          </p>
        </div>

        <div className="mx-auto max-w-[1180px] space-y-6 px-5 pb-24 sm:px-8">
          {RELEASES.map((rel, i) => (
            <Reveal key={rel.cat} delay={i * 0.05}>
              <article
                className="grid items-center gap-6 rounded-xl border p-5 sm:grid-cols-[160px_1fr_auto] sm:p-6"
                style={{ borderColor: "rgba(0,0,0,0.12)", background: PAPER_DEEP }}
              >
                <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-[3px]">
                  <img
                    src={`https://picsum.photos/seed/${rel.seed}/400/400`}
                    alt={`${rel.title} by ${rel.artist}`}
                    width={400}
                    height={400}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{ filter: "grayscale(0.35) contrast(1.05)" }}
                  />
                  <span
                    className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ background: VERM, color: CHAR, fontFamily: MONO }}
                  >
                    {rel.status}
                  </span>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.16em]" style={{ color: MUTED, fontFamily: MONO }}>
                    {rel.cat} · {rel.artist}
                  </p>
                  <h2 className="mt-1 text-[22px] font-bold tracking-tight" style={{ color: INK, fontFamily: DISPLAY }}>
                    {rel.title}
                  </h2>
                  <p className="mt-2 max-w-md text-[14px] leading-relaxed" style={{ color: MUTED }}>
                    {rel.blurb}
                  </p>
                </div>
                <Magnetic strength={0.25}>
                  <NavLink
                    to={`${base}/shop`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em]"
                    style={{ background: INK, color: PAPER }}
                  >
                    {rel.status === "Pre-order" ? "Pre-order" : "Find it"} <ArrowUpRight className="h-4 w-4" />
                  </NavLink>
                </Magnetic>
              </article>
            </Reveal>
          ))}
        </div>

        <div style={{ background: CHAR }}>
          <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 sm:px-8 md:grid-cols-2">
            <div>
              <SectionLabel>Demos</SectionLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight" style={{ color: PAPER, fontFamily: DISPLAY }}>
                Got a tape in the attic?
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: MUTED_DK }}>
                We license lost Scottish recordings and put out new work that
                deserves wax. If you're sitting on something — or making it — send
                us a link. We listen to everything.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="grid gap-3">
              <input
                placeholder="Artist or tape name"
                className="rounded-lg border bg-transparent px-4 py-3 text-[15px] outline-none focus:border-[var(--v)]"
                style={{ color: PAPER, borderColor: "rgba(255,255,255,0.18)", ["--v" as string]: VERM }}
              />
              <input
                type="url"
                placeholder="Link to a track"
                className="rounded-lg border bg-transparent px-4 py-3 text-[15px] outline-none focus:border-[var(--v)]"
                style={{ color: PAPER, borderColor: "rgba(255,255,255,0.18)", ["--v" as string]: VERM }}
              />
              <Magnetic>
                <button className="w-full rounded-full py-3 text-[13px] font-bold uppercase tracking-[0.12em]" style={{ background: VERM, color: CHAR }}>
                  Send us a demo
                </button>
              </Magnetic>
            </form>
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ----- Journal ----- */

function Journal() {
  const [first, ...rest] = POSTS
  return (
    <Page>
      <section style={{ background: PAPER }}>
        <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-16 sm:px-8 md:pt-24">
          <SectionLabel>The Journal</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-tight" style={{ color: INK, fontFamily: DISPLAY }}>
            Sleeve notes & shop diary
          </h1>
        </div>

        <div className="mx-auto max-w-[1180px] px-5 pb-10 sm:px-8">
          <Reveal>
            <article className="group grid overflow-hidden rounded-2xl border md:grid-cols-2" style={{ borderColor: "rgba(0,0,0,0.12)", background: PAPER_DEEP }}>
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                <img
                  src={`https://picsum.photos/seed/${first.seed}/900/700`}
                  alt={first.title}
                  width={900}
                  height={700}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ filter: "grayscale(0.3) contrast(1.05)" }}
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: VERM, fontFamily: MONO }}>
                  {first.kicker} · {first.read}
                </p>
                <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-tight tracking-tight" style={{ color: INK, fontFamily: DISPLAY }}>
                  {first.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                  {first.dek}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: INK }}>
                  Read the piece <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </article>
          </Reveal>
        </div>

        <div className="mx-auto grid max-w-[1180px] gap-7 px-5 pb-24 sm:px-8 md:grid-cols-2">
          {rest.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.12)", background: PAPER_DEEP }}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${p.seed}/700/400`}
                    alt={p.title}
                    width={700}
                    height={400}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    style={{ filter: "grayscale(0.3) contrast(1.05)" }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[12px] uppercase tracking-[0.16em]" style={{ color: VERM, fontFamily: MONO }}>
                    {p.kicker} · {p.read}
                  </p>
                  <h3 className="mt-2 text-[19px] font-bold leading-snug tracking-tight" style={{ color: INK, fontFamily: DISPLAY }}>
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed" style={{ color: MUTED }}>
                    {p.dek}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}

/* ----- Visit ----- */

function Visit() {
  return (
    <Page>
      <section style={{ background: CHAR }}>
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1fr_1fr] md:py-24">
          <div>
            <SectionLabel>Find us</SectionLabel>
            <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.02] tracking-tight" style={{ color: PAPER, fontFamily: DISPLAY }}>
              14 Steel Wynd, off Saltmarket
            </h1>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed" style={{ color: MUTED_DK }}>
              A narrow blue door between a sandwich shop and a stairwell. Push it.
              The good stuff is downstairs, the coffee's on, and the listening deck
              is yours for as long as you like.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: MapPin, t: "Address", d: "14 Steel Wynd, Glasgow G1 5LD" },
                { icon: Train, t: "Getting here", d: "5 min from Argyle St & St Enoch · bike racks on the wynd" },
                { icon: Clock, t: "The deck", d: "Two turntables, free to use — bring a record up and we'll spin it" },
              ].map((row) => (
                <div key={row.t} className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: CHAR_2 }}>
                    <row.icon className="h-5 w-5" style={{ color: VERM }} />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold" style={{ color: PAPER }}>
                      {row.t}
                    </p>
                    <p className="text-[14px]" style={{ color: MUTED_DK }}>
                      {row.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
              <img
                src="https://picsum.photos/seed/subtone-shopfront/800/600"
                alt="The Subtone shopfront on Steel Wynd"
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
                style={{ filter: "grayscale(0.45) contrast(1.05)" }}
              />
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(255,255,255,0.12)", background: CHAR_2 }}>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: PAPER, fontFamily: MONO }}>
                Opening hours
              </h2>
              <ul className="mt-4 divide-y" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                {HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between py-3 text-[15px]">
                    <span style={{ color: PAPER }}>{h.day}</span>
                    <span style={{ color: MUTED_DK, fontFamily: MONO }}>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-5 px-5 py-16 text-center sm:px-8">
            <h2 className="max-w-2xl text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold tracking-tight" style={{ color: PAPER, fontFamily: DISPLAY }}>
              Can't make it to Glasgow? The whole shop ships.
            </h2>
            <Magnetic>
              <NavLink
                to="../shop"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold uppercase tracking-[0.1em]"
                style={{ background: VERM, color: CHAR }}
              >
                Browse the bins <ArrowUpRight className="h-4 w-4" />
              </NavLink>
            </Magnetic>
          </div>
        </div>
      </section>
    </Page>
  )
}

/* -------------------------------------------------------------------- shell */

function Shell() {
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [loc.pathname])

  return (
    <div className="min-h-screen" style={{ background: CHAR, color: PAPER, fontFamily: BODY }}>
      <Nav />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={loc} key={loc.pathname}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="label" element={<Label />} />
            <Route path="journal" element={<Journal />} />
            <Route path="visit" element={<Visit />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default function Subtone() {
  // base path is read by descendants via useBase()
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <Shell />
      </CartProvider>
    </MotionConfig>
  )
}
