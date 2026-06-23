import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"
import { Link, useParams } from "react-router-dom"

/* ------------------------------------------------------------------ palette */
// Warm newsprint paper, ink, and one confident vermilion.
export const PAPER = "#f2ede1"
export const INK = "#191510"
export const VERM = "#c1351c"

/* ----------------------------------------------------------------- the data */
export interface Story {
  slug: string
  kicker: string
  title: string
  dek: string
  author: string
  read: string
  seed: string
  span?: "wide" | "tall"
}

export const STORIES: Story[] = [
  {
    slug: "last-sawmill",
    kicker: "Field report",
    title: "The Last Sawmill on the Marsh",
    dek: "Three generations, one band saw, and a stubborn argument with the tide for the timber that built half the coast.",
    author: "Dorothea Vane",
    read: "18 min",
    seed: "sawmill-timber-marsh",
    span: "wide",
  },
  {
    slug: "the-wobble",
    kicker: "Essay",
    title: "In Praise of the Wobble",
    dek: "Why the thrown bowl that leans a degree off-true is the only one worth keeping on the shelf.",
    author: "Pim Aldous",
    read: "9 min",
    seed: "ceramic-bowl-wheel",
    span: "tall",
  },
  {
    slug: "offcuts",
    kicker: "Field guide",
    title: "A Field Guide to Offcuts",
    dek: "The scrap pile is not waste. It is a vocabulary. A taxonomy of the bits too good to burn.",
    author: "Rennie Okafor",
    read: "12 min",
    seed: "wood-shavings-bench",
  },
  {
    slug: "indigo-vat",
    kicker: "Process",
    title: "The Indigo Vat",
    dek: "Six weeks of feeding a bucket of fermenting blue, and the morning it finally bloomed.",
    author: "Sølve Maro",
    read: "11 min",
    seed: "indigo-dye-cloth-blue",
  },
  {
    slug: "letterpress",
    kicker: "Revival",
    title: "Letterpress, Reset",
    dek: "A print shop left dark for forty years, restarted one stuck quoin at a time.",
    author: "Harriet Boon",
    read: "14 min",
    seed: "letterpress-type-metal",
  },
  {
    slug: "sharpening",
    kicker: "Notebook",
    title: "Notes on Sharpening",
    dek: "Ten thousand grit, a flat stone, and the quiet that arrives somewhere around the third pass.",
    author: "Idris Calloway",
    read: "7 min",
    seed: "sharpening-stone-chisel",
  },
]

export const CONTRIBUTORS = [
  "Dorothea Vane",
  "Pim Aldous",
  "Rennie Okafor",
  "Sølve Maro",
  "Harriet Boon",
  "Idris Calloway",
  "Mara Tennent",
  "Bo Greenhalgh",
  "Lucia Frey",
]

/* ----------------------------------------------------------------- helpers */
export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/** Small all-caps mono label used throughout the masthead. */
export function Label({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.22em] ${className}`}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------- featured: infinite marquee */
/**
 * Buttery infinite marquee driven by useAnimationFrame so it never restarts on
 * re-render. Two copies of the row sit side by side; we slide x and wrap at the
 * half-width. Eases to a stop on hover, dumps to a static row under
 * prefers-reduced-motion.
 */
export function Marquee({
  items,
  speed = 60,
  className = "",
}: {
  items: string[]
  speed?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const rowRef = useRef<HTMLDivElement>(null)
  const halfRef = useRef(0)
  const factor = useRef(1) // 1 running, eases to 0 on hover
  const targetRef = useRef(1)

  useEffect(() => {
    const measure = () => {
      halfRef.current = rowRef.current?.offsetWidth ?? 0
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useAnimationFrame((_, delta) => {
    if (reduce || !halfRef.current) return
    // ease the speed factor toward its target so hover-pause feels physical
    factor.current += (targetRef.current - factor.current) * Math.min(1, delta / 120)
    let next = x.get() - (delta / 1000) * speed * factor.current
    if (next <= -halfRef.current) next += halfRef.current
    x.set(next)
  })

  const row = (
    <div ref={rowRef} className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-['Fraunces'] text-lg italic tracking-tight">{it}</span>
          <span aria-hidden className="mx-6 inline-block h-[6px] w-[6px] rotate-45 bg-[#c1351c]" />
        </span>
      ))}
    </div>
  )

  if (reduce) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="flex items-center px-6 py-3">{row}</div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => (targetRef.current = 0)}
      onMouseLeave={() => (targetRef.current = 1)}
    >
      <motion.div className="flex w-max items-center py-3" style={{ x }}>
        {row}
        <div aria-hidden className="flex shrink-0 items-center">
          {items.map((it, i) => (
            <span key={`b-${i}`} className="flex items-center whitespace-nowrap">
              <span className="font-['Fraunces'] text-lg italic tracking-tight">{it}</span>
              <span className="mx-6 inline-block h-[6px] w-[6px] rotate-45 bg-[#c1351c]" />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ----------------------------------------------------- animated count-up */
export function Counter({
  to,
  suffix = "",
  duration = 1400,
}: {
  to: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, to, duration])

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ---------------------------------------------- hover image-reveal card */
/**
 * Editorial story card. Image starts desaturated + slightly dim and warms to
 * full colour while the kicker bar slides in — driven by group-hover AND
 * group-focus-visible so keyboard users get the same reveal.
 */
export function StoryCard({
  story,
  ratio = "aspect-[4/3]",
  big = false,
}: {
  story: Story
  ratio?: string
  big?: boolean
}) {
  const base = useBase()
  const w = big ? 1200 : 800
  const h = big ? 760 : 600
  return (
    <Link
      to={`${base}/stories`}
      className="group block focus:outline-none"
      aria-label={`${story.title} — by ${story.author}`}
    >
      <div className={`relative overflow-hidden rounded-sm border border-[#191510]/15 bg-[#191510] ${ratio}`}>
        <img
          src={`https://picsum.photos/seed/${story.seed}/${w}/${h}`}
          alt={`${story.title}: ${story.dek}`}
          width={w}
          height={h}
          loading="lazy"
          className="h-full w-full object-cover opacity-90 grayscale-[0.55] transition-all duration-500 ease-out will-change-transform group-hover:scale-[1.035] group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:scale-[1.035] group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
        />
        <div className="pointer-events-none absolute left-0 top-4 translate-x-[-101%] bg-[#c1351c] px-3 py-1 transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0">
          <Label className="text-[#f2ede1]">{story.kicker}</Label>
        </div>
      </div>
      <div className="mt-4">
        <h3
          className={`font-['Fraunces'] font-semibold leading-[1.05] tracking-[-0.015em] text-[#191510] transition-colors duration-200 group-hover:text-[#c1351c] group-focus-visible:text-[#c1351c] ${
            big ? "text-[2.6rem] sm:text-[3.2rem]" : "text-2xl"
          }`}
        >
          {story.title}
        </h3>
        <p className={`mt-2 max-w-prose font-['DM_Sans'] leading-relaxed text-[#191510]/75 ${big ? "text-lg" : "text-[0.95rem]"}`}>
          {story.dek}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Label className="text-[#191510]/70">{story.author}</Label>
          <span aria-hidden className="h-1 w-1 rounded-full bg-[#191510]/40" />
          <Label className="text-[#191510]/70">{story.read}</Label>
        </div>
      </div>
    </Link>
  )
}
