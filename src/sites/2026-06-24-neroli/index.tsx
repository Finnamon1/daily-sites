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
import { motion, useInView, useReducedMotion } from "framer-motion"
import {
  ArrowUpRight,
  Check,
  Clock3,
  Droplet,
  Leaf,
  MapPin,
  Menu,
  Plus,
  X,
} from "lucide-react"
import type { SiteMeta } from "../types"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"

/* ─────────────────────────── brand tokens ───────────────────────────────
   NÉROLI — a niche perfume house in Grasse. Bone paper, ink, a claret accent
   and a quiet sage. Editorial serif (Fraunces) over a humanist grotesk
   (Hanken). Never purple, never centered stock, never lorem.                */

const theme = {
  ["--bone" as string]: "#EFEAE1",
  ["--bone-2" as string]: "#E6DECF",
  ["--bone-3" as string]: "#DCD2BF",
  ["--ink" as string]: "#211C18",
  ["--ink-2" as string]: "rgba(33,28,24,0.66)",
  ["--ink-3" as string]: "rgba(33,28,24,0.42)",
  ["--claret" as string]: "#8C3B34",
  ["--claret-deep" as string]: "#65261F",
  ["--sage" as string]: "#7E876C",
  ["--fd" as string]: "'Fraunces', Georgia, serif",
  ["--fb" as string]: "'Hanken Grotesk', system-ui, sans-serif",
  ["--fi" as string]: "'Spectral', Georgia, serif",
  ["--fm" as string]: "'IBM Plex Mono', ui-monospace, monospace",
} as CSSProperties

const display = "font-[family-name:var(--fd)]"
const body = "font-[family-name:var(--fb)]"
const italic = "font-[family-name:var(--fi)] italic"
const mono = "font-[family-name:var(--fm)]"

/* ─────────────────────────── content ───────────────────────────────────── */

type Family = "Citrus" | "Floral" | "Woody" | "Amber"

interface Scent {
  slug: string
  name: string
  tagline: string
  family: Family
  price: number
  seedBottle: string
  seedNote: string
  pyramid: { top: string; heart: string; base: string }
  blurb: string
}

const SCENTS: Scent[] = [
  {
    slug: "fleur-01",
    name: "Fleur 01",
    tagline: "Orange blossom at first light",
    family: "Floral",
    price: 168,
    seedBottle: "neroli-bottle-blossom",
    seedNote: "neroli-orange-petal",
    pyramid: { top: "Petitgrain · Bergamot", heart: "Neroli · Jasmine sambac", base: "White musk · Beeswax" },
    blurb:
      "The house signature. Cold-pressed neroli folded into a green petitgrain so the flower reads dewy, never candied.",
  },
  {
    slug: "cendre-04",
    name: "Cendre 04",
    tagline: "Woodsmoke through linen",
    family: "Woody",
    price: 195,
    seedBottle: "neroli-bottle-ash",
    seedNote: "neroli-cedar-smoke",
    pyramid: { top: "Pink pepper · Elemi", heart: "Cedar · Dried fig leaf", base: "Vetiver · Birch tar" },
    blurb:
      "A dry, contemplative wood. We macerate Atlas cedar for six weeks until the smoke turns soft and grey.",
  },
  {
    slug: "midi-07",
    name: "Midi 07",
    tagline: "Lemon groves at noon",
    family: "Citrus",
    price: 154,
    seedBottle: "neroli-bottle-citron",
    seedNote: "neroli-lemon-grove",
    pyramid: { top: "Sicilian lemon · Yuzu", heart: "Orange flower · Neroli", base: "Cistus · Blond woods" },
    blurb:
      "Bright as a south-facing window. A citrus that refuses to fade flat — cistus holds the light into the dry-down.",
  },
  {
    slug: "ambre-09",
    name: "Ambre 09",
    tagline: "Resin, honey, dusk",
    family: "Amber",
    price: 210,
    seedBottle: "neroli-bottle-amber",
    seedNote: "neroli-amber-resin",
    pyramid: { top: "Saffron · Blood orange", heart: "Labdanum · Immortelle", base: "Benzoin · Tonka" },
    blurb:
      "Our warmest accord. Labdanum and benzoin laid over tonka for a skin-close amber that lasts past midnight.",
  },
  {
    slug: "pluie-02",
    name: "Pluie 02",
    tagline: "First rain on stone",
    family: "Floral",
    price: 176,
    seedBottle: "neroli-bottle-petrichor",
    seedNote: "neroli-rain-iris",
    pyramid: { top: "Violet leaf · Aldehydes", heart: "Iris pallida · Mimosa", base: "Wet stone · Cashmeran" },
    blurb:
      "Powdery iris met with a mineral hush. The closest we have come to bottling the smell of a summer storm breaking.",
  },
  {
    slug: "foin-06",
    name: "Foin 06",
    tagline: "Cut hay and tobacco",
    family: "Woody",
    price: 188,
    seedBottle: "neroli-bottle-hay",
    seedNote: "neroli-hay-tobacco",
    pyramid: { top: "Chamomile · Clary sage", heart: "Coumarin · Hay absolute", base: "Tobacco leaf · Oakmoss" },
    blurb:
      "Late August in a field. Hay absolute and coumarin give a golden, almost edible warmth grounded by oakmoss.",
  },
]

const FAMILIES: Family[] = ["Citrus", "Floral", "Woody", "Amber"]

/** A dot colour per olfactive family — sage greens for the fresh side, claret/amber for the warm. */
const FAMILY_DOT: Record<Family, string> = {
  Citrus: "var(--sage)",
  Floral: "#A98BA0",
  Woody: "#6E5A43",
  Amber: "var(--claret)",
}

const PROCESS = [
  {
    n: "01",
    title: "Harvest",
    text: "Blossoms are picked before 9am while the oil is highest, then carried to the still within the hour.",
  },
  {
    n: "02",
    title: "Distil",
    text: "Steam distillation in small copper alembics. One tonne of flowers yields under a litre of neroli oil.",
  },
  {
    n: "03",
    title: "Macerate",
    text: "Accords rest in amber glass for four to eight weeks so the top, heart and base learn to agree.",
  },
  {
    n: "04",
    title: "Bottle",
    text: "Hand-filled, hand-numbered, sealed with wax. Each batch leaves the atelier under three hundred bottles.",
  },
]

/* ─────────────────────────── small primitives ──────────────────────────── */

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduced = useReducedMotion()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setV(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, reduced])
  return (
    <span ref={ref} className={cn(mono, "tabular-nums")}>
      {prefix}
      {v}
      {suffix}
    </span>
  )
}

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        body,
        "inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--claret)]",
        className,
      )}
    >
      <span className="h-px w-6 bg-[var(--claret)]/50" aria-hidden />
      {children}
    </span>
  )
}

/** A slow-morphing "scent haze" — pure CSS border-radius animation, never breaks. */
function HazeBlob({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ background: "radial-gradient(closest-side, var(--claret), transparent 72%)" }}
      initial={false}
      animate={
        reduced
          ? { borderRadius: "44% 56% 52% 48% / 50% 44% 56% 50%" }
          : {
              borderRadius: [
                "42% 58% 56% 44% / 54% 42% 58% 46%",
                "58% 42% 44% 56% / 44% 58% 42% 56%",
                "48% 52% 60% 40% / 52% 50% 50% 48%",
                "42% 58% 56% 44% / 54% 42% 58% 46%",
              ],
              rotate: [0, 18, -8, 0],
            }
      }
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

/** Editorial image with a duotone-ish house treatment so photos never sit raw. */
function Plate({
  seed,
  alt,
  ratio = "aspect-[4/5]",
  className,
  w = 900,
  h = 1125,
  tint = true,
}: {
  seed: string
  alt: string
  ratio?: string
  className?: string
  w?: number
  h?: number
  tint?: boolean
}) {
  return (
    <div className={cn("relative overflow-hidden", ratio, className)}>
      <img
        src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        className="h-full w-full object-cover contrast-[1.04] saturate-[0.82]"
      />
      {tint && (
        <span aria-hidden className="absolute inset-0 bg-[var(--claret-deep)]/15 mix-blend-multiply" />
      )}
      <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--ink)]/10" />
    </div>
  )
}

/* ─────────────────────────── product card (featured interaction) ─────────
   Hover / focus image-reveal: the bottle plate wipes back to expose a macro
   of the raw note beneath, while the olfactory pyramid slides up.           */

function ScentCard({ scent, base, i }: { scent: Scent; base: string; i: number }) {
  return (
    <Reveal delay={(i % 3) * 0.08} className="h-full">
      <NavLink
        to={`${base}/collection`}
        className="group block h-full rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--claret)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bone)]"
      >
        <div className="relative overflow-hidden rounded-[4px] bg-[var(--bone-2)]">
          {/* note macro underneath */}
          <div className="aspect-[4/5]">
            <img
              src={`https://picsum.photos/seed/${scent.seedNote}/900/1125`}
              alt={`The raw ${scent.family.toLowerCase()} note behind ${scent.name}`}
              width={900}
              height={1125}
              loading="lazy"
              className="h-full w-full object-cover contrast-[1.05] saturate-[0.85]"
            />
            <span aria-hidden className="absolute inset-0 bg-[var(--claret-deep)]/25 mix-blend-multiply" />
            {/* caption naming the raw material, legible only once revealed */}
            <span
              className={cn(
                mono,
                "pointer-events-none absolute right-3 top-3 translate-y-1 rounded-full bg-[var(--bone)]/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--ink)] opacity-0 transition-all duration-500 ease-out delay-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
              )}
            >
              the raw note
            </span>
          </div>
          {/* bottle plate that wipes away */}
          <div className="absolute inset-0 origin-bottom transition-[clip-path,transform] duration-500 ease-out [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_100%_0)] group-focus-visible:[clip-path:inset(0_0_100%_0)]">
            <img
              src={`https://picsum.photos/seed/${scent.seedBottle}/900/1125`}
              alt={`${scent.name} eau de parfum`}
              width={900}
              height={1125}
              loading="lazy"
              className="h-full w-full object-cover contrast-[1.04] saturate-[0.78]"
            />
            <span aria-hidden className="absolute inset-0 bg-[var(--bone)]/10 mix-blend-overlay" />
          </div>

          {/* pyramid panel slides up */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-[var(--ink)]/85 p-5 text-[var(--bone)] backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
            <dl className={cn(body, "space-y-1 text-[0.78rem]")}>
              {(["top", "heart", "base"] as const).map((k) => (
                <div key={k} className="flex gap-3">
                  <dt className={cn(mono, "w-12 shrink-0 uppercase tracking-wider text-[var(--bone-3)]")}>{k}</dt>
                  <dd className="text-[var(--bone)]/90">{scent.pyramid[k]}</dd>
                </div>
              ))}
            </dl>
          </div>

          <span
            className={cn(
              mono,
              "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--bone)]/85 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[var(--ink)]",
            )}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: FAMILY_DOT[scent.family] }}
            />
            {scent.family}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div>
            <h3 className={cn(display, "text-xl font-semibold text-[var(--ink)]")}>{scent.name}</h3>
            <p className={cn(italic, "text-[0.95rem] text-[var(--ink-2)]")}>{scent.tagline}</p>
          </div>
          <span className={cn(mono, "shrink-0 text-sm text-[var(--ink)]")}>${scent.price}</span>
        </div>
      </NavLink>
    </Reveal>
  )
}

/* ─────────────────────────── layout (persistent + cursor gradient) ──────── */

const NAV = [
  { to: "", label: "Atelier", end: true },
  { to: "collection", label: "Collection", end: false },
  { to: "maison", label: "Maison", end: false },
  { to: "visit", label: "Visit", end: false },
]

function Layout({ base, children }: { base: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const glow = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // persistent cursor-reactive ambient gradient, lifted above <Routes>
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = glow.current
        if (!el) return
        el.style.setProperty("--mx", `${e.clientX}px`)
        el.style.setProperty("--my", `${e.clientY}px`)
        el.style.opacity = "1"
      })
    }
    window.addEventListener("pointermove", onMove)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div style={theme} className={cn(body, "relative min-h-screen bg-[var(--bone)] text-[var(--ink)] antialiased")}>
      {/* ambient cursor haze */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), color-mix(in srgb, var(--claret) 18%, transparent), transparent 70%)",
        }}
      />
      {/* paper grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(var(--bone-3) 0.6px, transparent 0.6px)",
          backgroundSize: "7px 7px",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[var(--ink)]/10 bg-[var(--bone)]/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <NavLink to={base} end className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Mark className="h-7 w-7 text-[var(--claret)]" />
            <span className={cn(display, "text-lg font-semibold tracking-tight")}>NÉROLI</span>
            <span className={cn(mono, "hidden text-[0.6rem] uppercase tracking-[0.3em] text-[var(--ink-3)] sm:inline")}>
              Grasse
            </span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    body,
                    "relative text-sm tracking-wide text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-[var(--claret)] after:transition-all after:duration-300",
                    isActive ? "text-[var(--ink)] after:w-full" : "after:w-0 hover:after:w-full",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Magnetic>
              <NavLink
                to={`${base}/collection`}
                className={cn(
                  body,
                  "rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--bone)] transition-colors hover:bg-[var(--claret)]",
                )}
              >
                Shop
              </NavLink>
            </Magnetic>
          </nav>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ink)]/15 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden border-t border-[var(--ink)]/10 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {NAV.map((n) => (
                <NavLink
                  key={n.label}
                  to={n.to ? `${base}/${n.to}` : base}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      body,
                      "rounded px-2 py-2.5 text-base",
                      isActive ? "bg-[var(--bone-2)] text-[var(--ink)]" : "text-[var(--ink-2)]",
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 mt-24 border-t border-[var(--ink)]/10 bg-[var(--bone-2)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark className="h-7 w-7 text-[var(--claret)]" />
              <span className={cn(display, "text-lg font-semibold")}>NÉROLI</span>
            </div>
            <p className={cn(italic, "mt-4 max-w-xs text-[var(--ink-2)]")}>
              A small perfume house in Grasse, distilling in copper since 2011. Hand-numbered, never reformulated.
            </p>
          </div>
          <FooterCol
            title="Explore"
            links={NAV.map((n) => ({ label: n.label, to: n.to ? `${base}/${n.to}` : base, end: n.end }))}
          />
          <div>
            <h4 className={cn(mono, "text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-3)]")}>Atelier</h4>
            <address className={cn(body, "mt-4 space-y-1 not-italic text-sm text-[var(--ink-2)]")}>
              <p>14 Rue des Orangers</p>
              <p>06130 Grasse, France</p>
              <p className="pt-2 text-[var(--ink)]">bonjour@neroli.house</p>
            </address>
          </div>
        </div>
        <div className="border-t border-[var(--ink)]/10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-[var(--ink-3)] sm:flex-row sm:items-center sm:px-8">
            <p className={mono}>© 2026 Maison Néroli — all blends our own</p>
            <p className={mono}>Distilled in Grasse · Shipped worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; to: string; end?: boolean }[]
}) {
  return (
    <div>
      <h4 className={cn(mono, "text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-3)]")}>{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <NavLink
              to={l.to}
              end={l.end}
              className={cn(body, "text-sm text-[var(--ink-2)] transition-colors hover:text-[var(--claret)]")}
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      {/* flacon */}
      <rect x="13" y="14" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="17.5" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <line x1="13" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      {/* blossom inside */}
      <circle cx="20" cy="26" r="1.7" fill="currentColor" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={20 + Math.cos(a) * 3.4}
            cy={26 + Math.sin(a) * 3.4}
            r="1.5"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.75"
          />
        )
      })}
    </svg>
  )
}

/* ─────────────────────────── pages ─────────────────────────────────────── */

function Home({ base }: { base: string }) {
  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden">
        <HazeBlob className="absolute -right-24 -top-16 h-[460px] w-[460px] opacity-25 blur-[6px] sm:-right-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <Eyebrow>Niche perfumery · Est. Grasse 2011</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className={cn(display, "mt-6 text-[clamp(2.8rem,7vw,5.2rem)] font-light leading-[0.98] tracking-[-0.02em]")}>
                Scent, kept
                <br />
                <span className="font-semibold">honest.</span>{" "}
                <span className={cn(italic, "font-normal text-[var(--claret)]")}>and small.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className={cn(body, "mt-6 max-w-md text-lg leading-relaxed text-[var(--ink-2)]")}>
                Six fragrances, distilled in copper and rested by hand. No reformulations, no marketing notes —
                only what the flower actually gives.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <NavLink
                    to={`${base}/collection`}
                    className={cn(
                      body,
                      "group inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--bone)] transition-colors hover:bg-[var(--claret)]",
                    )}
                  >
                    Explore the collection
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </NavLink>
                </Magnetic>
                <NavLink
                  to={`${base}/maison`}
                  className={cn(body, "text-sm text-[var(--ink-2)] underline-offset-4 hover:text-[var(--ink)] hover:underline")}
                >
                  How we distil →
                </NavLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <Plate
                seed="neroli-hero-flacon"
                alt="A hand-numbered NÉROLI flacon resting on stone in morning light"
                ratio="aspect-[4/5]"
                className="rounded-[6px] shadow-[0_30px_60px_-30px_rgba(33,28,24,0.5)]"
              />
              <div className="absolute -bottom-5 -left-5 hidden rounded-[4px] border border-[var(--ink)]/10 bg-[var(--bone)] px-5 py-4 shadow-lg sm:block">
                <p className={cn(mono, "text-[0.62rem] uppercase tracking-[0.24em] text-[var(--ink-3)]")}>Batch №</p>
                <p className={cn(display, "text-2xl font-semibold text-[var(--ink)]")}>
                  028<span className="text-[var(--claret)]">/300</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* stat strip */}
        <div className="border-y border-[var(--ink)]/10 bg-[var(--bone-2)]/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[var(--ink)]/10 px-5 sm:px-8 md:grid-cols-4">
            {[
              { v: <Counter to={6} />, l: "Fragrances, no more" },
              { v: <Counter to={8} suffix=" wks" />, l: "Maceration, minimum" },
              { v: <Counter to={300} />, l: "Bottles per batch" },
              { v: <Counter to={1} suffix=" tonne" />, l: "Flowers per litre of oil" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.06} className="px-4 py-7">
                <div className={cn(display, "text-3xl font-semibold text-[var(--claret)]")}>{s.v}</div>
                <p className={cn(body, "mt-1 text-sm text-[var(--ink-2)]")}>{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* featured trio */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>The shelf</Eyebrow>
            <h2 className={cn(display, "mt-4 text-[clamp(1.9rem,4vw,3rem)] font-light leading-tight")}>
              Three to begin with
            </h2>
          </div>
          <NavLink
            to={`${base}/collection`}
            className={cn(body, "group inline-flex items-center gap-1.5 text-sm text-[var(--ink-2)] hover:text-[var(--claret)]")}
          >
            See all six
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </NavLink>
        </div>
        <p className={cn(italic, "mt-3 max-w-md text-[var(--ink-2)]")}>Hover a flacon to see the raw note beneath.</p>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {SCENTS.slice(0, 3).map((s, i) => (
            <ScentCard key={s.slug} scent={s} base={base} i={i} />
          ))}
        </div>
      </section>

      {/* ethos band */}
      <section className="relative overflow-hidden bg-[var(--ink)] text-[var(--bone)]">
        <HazeBlob className="absolute -left-20 bottom-0 h-[380px] w-[380px] opacity-20 blur-[8px]" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Eyebrow className="text-[var(--bone-3)] [&_span]:bg-[var(--bone-3)]/60">Our one rule</Eyebrow>
            <blockquote className={cn(display, "mt-6 text-[clamp(1.7rem,3.2vw,2.6rem)] font-light leading-[1.15]")}>
              “If the flower can’t give it, we don’t add it. A perfume should smell like
              <span className={cn(italic, "text-[var(--bone-3)]")}> a real morning</span>, not an idea of one.”
            </blockquote>
            <p className={cn(mono, "mt-6 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--bone-3)]")}>
              — Aurélie Vasseur, founding nose
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { icon: Leaf, t: "Botanical first", d: "Naturals lead every accord; synthetics only to fix and carry." },
                { icon: Droplet, t: "Copper distilled", d: "Small alembics, low and slow, the way Grasse always has." },
                { icon: Clock3, t: "Rested, not rushed", d: "Eight weeks minimum before a drop is bottled." },
                { icon: Check, t: "Never reformulated", d: "A scent you love this year smells the same in ten." },
              ].map((f, i) => (
                <div key={i} className="rounded-[4px] border border-[var(--bone)]/12 bg-[var(--bone)]/[0.04] p-5">
                  <f.icon className="h-5 w-5 text-[var(--bone-3)]" />
                  <h3 className={cn(display, "mt-3 text-lg font-semibold")}>{f.t}</h3>
                  <p className={cn(body, "mt-1.5 text-sm leading-relaxed text-[var(--bone)]/70")}>{f.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}

function Collection({ base }: { base: string }) {
  const [family, setFamily] = useState<Family | "All">("All")
  const list = family === "All" ? SCENTS : SCENTS.filter((s) => s.family === family)
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <Reveal>
        <Eyebrow>The collection</Eyebrow>
        <h1 className={cn(display, "mt-5 text-[clamp(2.4rem,5.5vw,4rem)] font-light leading-[1.02]")}>
          Six fragrances,
          <br />
          <span className={cn(italic, "text-[var(--claret)]")}>nothing spare.</span>
        </h1>
        <p className={cn(body, "mt-5 max-w-lg text-lg text-[var(--ink-2)]")}>
          Each is an eau de parfum at 18% concentration, 50ml in hand-blown amber glass. Filter by olfactive family.
        </p>
      </Reveal>

      {/* filter chips */}
      <div className="mt-9 flex flex-wrap gap-2.5">
        {(["All", ...FAMILIES] as const).map((f) => {
          const active = family === f
          return (
            <button
              key={f}
              onClick={() => setFamily(f)}
              aria-pressed={active}
              className={cn(
                body,
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                active
                  ? "border-[var(--claret)] bg-[var(--claret)] text-[var(--bone)]"
                  : "border-[var(--ink)]/15 text-[var(--ink-2)] hover:border-[var(--ink)]/40 hover:text-[var(--ink)]",
              )}
            >
              {f}
            </button>
          )
        })}
      </div>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <ScentCard key={s.slug} scent={s} base={base} i={i} />
        ))}
      </div>

      {/* detail rows */}
      <div className="mt-24 space-y-5">
        <Reveal>
          <h2 className={cn(display, "text-2xl font-light")}>Read the blends</h2>
        </Reveal>
        {SCENTS.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 2) * 0.05}>
            <article className="group grid items-center gap-5 rounded-[4px] border border-[var(--ink)]/10 bg-[var(--bone-2)]/50 p-5 transition-colors hover:border-[var(--claret)]/40 sm:grid-cols-[auto_1fr_auto]">
              <span className={cn(mono, "text-[0.7rem] uppercase tracking-[0.2em] text-[var(--ink-3)]")}>
                {s.slug.split("-")[1]}
              </span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className={cn(display, "text-xl font-semibold")}>{s.name}</h3>
                  <span className={cn(mono, "rounded-full bg-[var(--bone-3)]/50 px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-[var(--ink-2)]")}>
                    {s.family}
                  </span>
                </div>
                <p className={cn(body, "mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--ink-2)]")}>{s.blurb}</p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className={cn(display, "text-xl font-semibold text-[var(--ink)]")}>${s.price}</span>
                <span className={cn(body, "inline-flex items-center gap-1 text-xs text-[var(--claret)] opacity-0 transition-opacity group-hover:opacity-100")}>
                  Add to cart <Plus className="h-3 w-3" />
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function Maison({ base }: { base: string }) {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-end gap-8 px-5 pt-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Eyebrow>The maison</Eyebrow>
          <h1 className={cn(display, "mt-5 text-[clamp(2.4rem,5.5vw,4.2rem)] font-light leading-[1.0]")}>
            We measure time
            <br />
            in <span className={cn(italic, "text-[var(--claret)]")}>weeks of rest.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={cn(body, "text-lg leading-relaxed text-[var(--ink-2)]")}>
            Aurélie Vasseur founded NÉROLI in a former tannery on the edge of Grasse, with two copper stills and a
            refusal to grow faster than the harvest. Fifteen years on, the rules haven’t moved.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-12 sm:px-8">
        <Reveal>
          <Plate
            seed="neroli-atelier-stills"
            alt="Copper alembic stills in the NÉROLI atelier, steam rising in low light"
            ratio="aspect-[16/7]"
            w={1600}
            h={700}
            className="rounded-[6px]"
          />
        </Reveal>
      </section>

      {/* process */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className={cn(display, "text-[clamp(1.7rem,3.5vw,2.6rem)] font-light")}>From blossom to bottle</h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-[var(--ink)]/10 bg-[var(--ink)]/10 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.07}>
              <div className="group h-full bg-[var(--bone)] p-7 transition-colors hover:bg-[var(--bone-2)]">
                <div className="flex items-center justify-between">
                  <span className={cn(display, "text-4xl font-light text-[var(--claret)]")}>{p.n}</span>
                  <Droplet className="h-5 w-5 text-[var(--ink-3)] transition-transform duration-500 group-hover:translate-y-1" />
                </div>
                <h3 className={cn(display, "mt-5 text-xl font-semibold")}>{p.title}</h3>
                <p className={cn(body, "mt-2 text-sm leading-relaxed text-[var(--ink-2)]")}>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* olfactory pyramid */}
      <section className="bg-[var(--bone-2)]/60 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <Eyebrow>How to read a scent</Eyebrow>
              <h2 className={cn(display, "mt-5 text-3xl font-light leading-tight")}>The olfactory pyramid</h2>
              <p className={cn(body, "mt-4 text-[var(--ink-2)]")}>
                A fragrance unfolds in three movements. Top notes greet you and leave within the hour; the heart is
                the fragrance proper; the base is what lingers on skin and cloth by evening.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-3">
                {[
                  { k: "Top", w: "62%", t: "Bright & fleeting", d: "Citrus, green leaf, aldehydes — gone within 60 minutes." },
                  { k: "Heart", w: "82%", t: "The fragrance itself", d: "Florals and spices that define the character for hours." },
                  { k: "Base", w: "100%", t: "What remains", d: "Woods, resins, musks — the memory left on skin by dusk." },
                ].map((row, i) => (
                  <motion.div
                    key={row.k}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="overflow-hidden rounded-[4px] border border-[var(--ink)]/10"
                  >
                    <div className="relative bg-[var(--bone)] p-5" style={{ width: row.w }}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={cn(mono, "text-[0.66rem] uppercase tracking-[0.24em] text-[var(--claret)]")}>
                          {row.k}
                        </span>
                        <span className={cn(display, "text-base font-semibold")}>{row.t}</span>
                      </div>
                      <p className={cn(body, "mt-1.5 text-sm text-[var(--ink-2)]")}>{row.d}</p>
                    </div>
                  </motion.div>
                ))}
                <p className={cn(italic, "pt-2 text-sm text-[var(--ink-3)]")}>
                  Width shows how long each layer stays with you.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* split note */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <Plate
            seed="neroli-aurelie-portrait"
            alt="Aurélie Vasseur, founding nose, at the blending bench"
            ratio="aspect-[5/6]"
            className="rounded-[6px]"
          />
        </Reveal>
        <Reveal delay={0.08}>
          <Eyebrow>A note from the nose</Eyebrow>
          <p className={cn(display, "mt-6 text-[clamp(1.4rem,2.6vw,2rem)] font-light leading-[1.3]")}>
            “I started NÉROLI because the fragrances I loved kept disappearing — reformulated to be cheaper, safer,
            duller. I wanted to make scents that <span className={cn(italic, "text-[var(--claret)]")}>stay put</span>.”
          </p>
          <p className={cn(body, "mt-6 text-[var(--ink-2)]")}>
            Aurélie trained at the Grasse Institute and spent a decade composing for houses whose names she can’t
            print. Now she answers to no brief but the harvest.
          </p>
          <NavLink
            to={`${base}/visit`}
            className={cn(body, "mt-7 inline-flex items-center gap-2 text-sm text-[var(--claret)] hover:underline")}
          >
            Visit the atelier <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </Reveal>
      </section>

      <Newsletter />
    </div>
  )
}

function Visit() {
  const [sent, setSent] = useState(false)
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <Reveal>
        <Eyebrow>Visit & enquire</Eyebrow>
        <h1 className={cn(display, "mt-5 text-[clamp(2.4rem,5.5vw,4rem)] font-light leading-[1.02]")}>
          Come and <span className={cn(italic, "text-[var(--claret)]")}>smell for yourself.</span>
        </h1>
        <p className={cn(body, "mt-5 max-w-lg text-lg text-[var(--ink-2)]")}>
          The atelier opens for private consultations on Thursdays and Fridays. Tell us what you wear now and
          we’ll set three blends aside.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
        {/* form */}
        <Reveal>
          {sent ? (
            <div className="flex h-full min-h-[320px] flex-col items-start justify-center rounded-[6px] border border-[var(--claret)]/30 bg-[var(--bone-2)]/60 p-8">
              <Check className="h-8 w-8 text-[var(--claret)]" />
              <h2 className={cn(display, "mt-4 text-2xl font-semibold")}>Booked — merci.</h2>
              <p className={cn(body, "mt-2 max-w-sm text-[var(--ink-2)]")}>
                Aurélie or one of the team will write back within two working days to confirm your slot.
              </p>
              <button
                onClick={() => setSent(false)}
                className={cn(body, "mt-6 text-sm text-[var(--claret)] underline-offset-4 hover:underline")}
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
              className="space-y-5 rounded-[6px] border border-[var(--ink)]/10 bg-[var(--bone-2)]/40 p-7"
            >
              <Field label="Name" id="name">
                <input id="name" required className={inputCls} placeholder="Camille Renaud" />
              </Field>
              <Field label="Email" id="email">
                <input id="email" type="email" required className={inputCls} placeholder="you@example.com" />
              </Field>
              <Field label="What do you wear now?" id="wear">
                <input id="wear" className={inputCls} placeholder="Something woody, but lighter for summer" />
              </Field>
              <Field label="Preferred day" id="day">
                <select id="day" className={inputCls} defaultValue="Thursday">
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </Field>
              <Magnetic>
                <button
                  type="submit"
                  className={cn(
                    body,
                    "inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--bone)] transition-colors hover:bg-[var(--claret)]",
                  )}
                >
                  Request a consultation <ArrowUpRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </form>
          )}
        </Reveal>

        {/* details */}
        <Reveal delay={0.08}>
          <div className="space-y-6">
            <Plate
              seed="neroli-atelier-door"
              alt="The arched stone doorway of the NÉROLI atelier on Rue des Orangers"
              ratio="aspect-[16/10]"
              w={1200}
              h={750}
              className="rounded-[6px]"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard icon={MapPin} title="Where">
                14 Rue des Orangers
                <br />
                06130 Grasse, France
              </InfoCard>
              <InfoCard icon={Clock3} title="Hours">
                Thu – Fri, 10h – 17h
                <br />
                By appointment only
              </InfoCard>
            </div>
            <div className="rounded-[6px] border border-[var(--ink)]/10 bg-[var(--ink)] p-6 text-[var(--bone)]">
              <h3 className={cn(display, "text-lg font-semibold")}>Can’t make it to Grasse?</h3>
              <p className={cn(body, "mt-2 text-sm text-[var(--bone)]/75")}>
                Order a discovery set — all six fragrances in 2ml vials, with a credit toward your first full bottle.
              </p>
              <p className={cn(mono, "mt-4 text-sm")}>Discovery set · $42</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

const inputCls =
  "w-full rounded-[4px] border border-[var(--ink)]/15 bg-[var(--bone)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-3)] focus:border-[var(--claret)] focus:ring-2 focus:ring-[var(--claret)]/20 font-[family-name:var(--fb)]"

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <label htmlFor={id} className="block">
      <span className={cn(mono, "mb-1.5 block text-[0.66rem] uppercase tracking-[0.22em] text-[var(--ink-3)]")}>
        {label}
      </span>
      {children}
    </label>
  )
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[6px] border border-[var(--ink)]/10 bg-[var(--bone-2)]/50 p-5">
      <Icon className="h-5 w-5 text-[var(--claret)]" />
      <h3 className={cn(display, "mt-3 text-base font-semibold")}>{title}</h3>
      <p className={cn(body, "mt-1 text-sm leading-relaxed text-[var(--ink-2)]")}>{children}</p>
    </div>
  )
}

function Newsletter() {
  const [done, setDone] = useState(false)
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="relative overflow-hidden rounded-[8px] border border-[var(--ink)]/10 bg-[var(--bone-2)]/70 px-6 py-12 sm:px-12">
        <HazeBlob className="absolute -right-16 -top-16 h-72 w-72 opacity-20 blur-[6px]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow>The slow letter</Eyebrow>
            <h2 className={cn(display, "mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-tight")}>
              Six harvest notes a year. Nothing else.
            </h2>
            <p className={cn(body, "mt-3 max-w-md text-[var(--ink-2)]")}>
              We write when the orange trees flower, when a batch sells out, and when something new finally clears
              maceration. Never to sell you anything twice.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDone(true)
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="you@example.com"
              className={cn(inputCls, "flex-1")}
            />
            <button
              type="submit"
              className={cn(
                body,
                "shrink-0 rounded-[4px] bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--bone)] transition-colors hover:bg-[var(--claret)]",
              )}
            >
              {done ? "Subscribed ✓" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── shell ─────────────────────────────────────── */

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  return (
    <motion.div
      key={pathname}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Neroli() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <Layout base={base}>
      <Routes>
        <Route index element={<Page><Home base={base} /></Page>} />
        <Route path="collection" element={<Page><Collection base={base} /></Page>} />
        <Route path="maison" element={<Page><Maison base={base} /></Page>} />
        <Route path="visit" element={<Page><Visit /></Page>} />
        <Route path="*" element={<Page><Home base={base} /></Page>} />
      </Routes>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "NÉROLI — Niche perfume house, Grasse",
  description:
    "A small-batch perfume house: six honest fragrances distilled in copper. Featured interaction — hover image-reveal product cards over a cursor-reactive ambient haze.",
  date: "2026-06-24",
  type: "E-commerce store",
  interaction: "Hover image-reveal product cards + cursor-reactive ambient gradient",
  pages: ["Atelier", "Collection", "Maison", "Visit"],
}
