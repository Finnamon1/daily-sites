import { useRef, type CSSProperties, type ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useMotionTemplate,
} from "framer-motion"

/* ----------------------------------------------------------------- palette */
export const C = {
  ink: "#17120e", // warm near-black ground
  inkPanel: "#1e1711", // raised panel on ink
  bone: "#f2ebdf", // parchment
  boneDeep: "#e7ddca", // deeper parchment
  line: "#cdbfa6", // hairline on bone
  amber: "#8a5114", // deep brass — accent TEXT on bone (AA ≥4.7:1)
  amberFill: "#c47e2b", // bright brass — solid fills only (ink text on top)
  amberLit: "#e2a44b", // brighter amber for text/lines on the ink ground
  amberSoft: "rgba(226,164,75,0.55)",
}

/* ----------------------------------------------------------------- data */
export type Fragrance = {
  slug: string
  no: string
  name: string
  family: string
  blurb: string
  story: string
  liquid: string // bottle fill
  glass: string // bottle glass tint
  cap: string // cap colour
  price: number
  ml: number
  notes: { tier: "Tête" | "Cœur" | "Fond"; items: string[] }[]
  seed: string // picsum seed for the ingredient photo
  material: string // headline ingredient
}

export const FRAGRANCES: Fragrance[] = [
  {
    slug: "vetiver-noir",
    no: "01",
    name: "Vétiver Noir",
    family: "Boisé · Fumé",
    blurb: "Wet earth after rain, smoke drifting from a far-off fire.",
    story:
      "Built around a single distillation of Haitian vetiver, darkened with birch tar and a thread of green cardamom. It is the smell of a cellar door left open to the garden — mineral, rooted, faintly bitter.",
    liquid: "#6b4a23",
    glass: "#241a10",
    cap: "#0f0b07",
    price: 188,
    ml: 50,
    material: "Haitian vetiver root",
    seed: "vetiver-root-dark-earth",
    notes: [
      { tier: "Tête", items: ["Green cardamom", "Pink pepper", "Bergamot zest"] },
      { tier: "Cœur", items: ["Haitian vetiver", "Orris butter", "Cedar"] },
      { tier: "Fond", items: ["Birch tar", "Vetiver smoke", "Tonka"] },
    ],
  },
  {
    slug: "neroli-dix-neuf",
    no: "02",
    name: "Néroli 19",
    family: "Floral · Hespéridé",
    blurb: "A courtyard at noon — orange blossom, sun on warm stone.",
    story:
      "Nineteen tries to balance the bitter and the bright of neroli without sweetening it. Petitgrain keeps the leaves in; a breath of beeswax holds the heat of the stone long after the sun has moved on.",
    liquid: "#d9b65f",
    glass: "#2a2114",
    cap: "#c9a13e",
    price: 172,
    ml: 50,
    material: "Tunisian orange blossom",
    seed: "orange-blossom-neroli-white",
    notes: [
      { tier: "Tête", items: ["Neroli", "Mandarin", "Petitgrain"] },
      { tier: "Cœur", items: ["Orange blossom absolute", "Jasmine sambac"] },
      { tier: "Fond", items: ["Beeswax", "White musk", "Warm stone accord"] },
    ],
  },
  {
    slug: "foin-coupe",
    no: "03",
    name: "Foin Coupé",
    family: "Ambré · Foin",
    blurb: "Cut hay drying in August, sweet tobacco at the field's edge.",
    story:
      "Coumarin from real tonka over a hay absolute, with a curl of pipe tobacco and dry immortelle. Soft and golden and a little melancholy — the last warm week before the season turns.",
    liquid: "#b8823a",
    glass: "#241a10",
    cap: "#8a5a22",
    price: 178,
    ml: 50,
    material: "French hay absolute",
    seed: "cut-hay-field-golden-summer",
    notes: [
      { tier: "Tête", items: ["Clary sage", "Lavender", "Chamomile"] },
      { tier: "Cœur", items: ["Hay absolute", "Immortelle", "Tobacco leaf"] },
      { tier: "Fond", items: ["Tonka bean", "Hyrax", "Sandalwood"] },
    ],
  },
]

export const getFragrance = (slug?: string) =>
  FRAGRANCES.find((f) => f.slug === slug) ?? FRAGRANCES[0]

/* ---------------------------------------------------- featured interaction
   ScentField — a cursor-reactive gradient "aura" that diffuses like scent.
   A warm radial follows the pointer (spring-smoothed) while two slow ambient
   blobs drift on their own. Under reduced motion the aura sits centred & still. */
export function ScentField({
  children,
  className,
  tone = C.amberSoft,
  intensity = 1,
  style,
}: {
  children?: ReactNode
  className?: string
  tone?: string
  intensity?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const mx = useMotionValue(50)
  const my = useMotionValue(38)
  const sx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 })

  const aura = useMotionTemplate`radial-gradient(38rem 30rem at ${sx}% ${sy}%, ${tone}, transparent 62%)`

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (reduce) return
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set(((e.clientX - r.left) / r.width) * 100)
        my.set(((e.clientY - r.top) / r.height) * 100)
      }}
      onPointerLeave={() => {
        mx.set(50)
        my.set(38)
      }}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={style}
    >
      {/* drifting ambient blobs — the "still-hanging" part of a scent */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full blur-3xl"
            style={{ background: tone, opacity: 0.5 * intensity }}
            animate={{ x: [0, 40, -10, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full blur-3xl"
            style={{ background: tone, opacity: 0.35 * intensity }}
            animate={{ x: [0, -30, 15, 0], y: [0, 20, -25, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      {/* the cursor-tracked aura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: aura, opacity: intensity }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

/* ---------------------------------------------------- hand-built SVG bottle */
export function Bottle({
  f,
  className,
}: {
  f: Fragrance
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 120 180"
      className={className}
      role="img"
      aria-label={`Flacon of ${f.name}`}
    >
      <defs>
        <linearGradient id={`g-${f.slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={f.glass} stopOpacity="0.92" />
          <stop offset="1" stopColor={f.glass} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`l-${f.slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={f.liquid} stopOpacity="0.78" />
          <stop offset="1" stopColor={f.liquid} stopOpacity="1" />
        </linearGradient>
        <clipPath id={`c-${f.slug}`}>
          <rect x="26" y="44" width="68" height="116" rx="9" />
        </clipPath>
      </defs>

      {/* cap */}
      <rect x="46" y="6" width="28" height="26" rx="3" fill={f.cap} />
      <rect x="50" y="30" width="20" height="10" rx="2" fill={f.cap} opacity="0.85" />
      {/* glass body */}
      <rect
        x="26"
        y="44"
        width="68"
        height="116"
        rx="9"
        fill={`url(#g-${f.slug})`}
        stroke="rgba(255,255,255,0.10)"
      />
      {/* liquid fill */}
      <g clipPath={`url(#c-${f.slug})`}>
        <rect x="26" y="86" width="68" height="74" fill={`url(#l-${f.slug})`} />
      </g>
      {/* highlight */}
      <rect x="33" y="52" width="9" height="98" rx="4" fill="#ffffff" opacity="0.06" />
      {/* label */}
      <rect x="40" y="104" width="40" height="34" rx="2" fill={C.bone} opacity="0.94" />
      <text
        x="60"
        y="118"
        textAnchor="middle"
        fontSize="9"
        fontFamily="'IBM Plex Mono', monospace"
        fill={C.ink}
        letterSpacing="1"
      >
        SÈVE
      </text>
      <text
        x="60"
        y="131"
        textAnchor="middle"
        fontSize="11"
        fontFamily="'Cormorant Garamond', serif"
        fontStyle="italic"
        fill={C.ink}
      >
        N°{f.no}
      </text>
    </svg>
  )
}

/* ---------------------------------------------------- small shared pieces */
export function Kicker({
  children,
  on = "bone",
}: {
  children: ReactNode
  on?: "bone" | "ink"
}) {
  return (
    <span
      className="font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-[0.32em]"
      style={{ color: on === "ink" ? C.amberLit : C.amber }}
    >
      {children}
    </span>
  )
}

export function priceFmt(n: number) {
  return `€${n}`
}
