import { useEffect, useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Minus,
  Plus,
  Quote,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import {
  categories,
  faqs,
  inUse,
  principles,
  team,
  tiers,
  typefaces,
  type Category,
  type Typeface,
} from "./data"

/* ------------------------------------------------------------------ *
 * Type + colour tokens. Self-contained — no tailwind.config edits.
 * paper #f2efe7 · ink #16140e · accent #e5431d (vermilion) ·
 * link #bd3517 (AA on paper)
 * ------------------------------------------------------------------ */

const display = "font-['Bricolage_Grotesque']"
const body = "font-['Hanken_Grotesk']"
const serif = "font-['Spectral']"
const mono = "font-['JetBrains_Mono']"

const ease = [0.21, 0.47, 0.32, 0.98] as const

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        mono,
        "text-[11px] uppercase tracking-[0.22em] text-[#bd3517]",
        className,
      )}
    >
      {children}
    </span>
  )
}

/* The QUIRE wordmark — a small ampersand mark in the accent. */
function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn(display, "text-[20px] font-extrabold tracking-[-0.03em] text-[#16140e]")}>
        QUIRE
      </span>
      <span className={cn(serif, "text-[20px] italic leading-none text-[#e5431d]")}>&amp;</span>
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Per-letter weight-on-hover headline (a type-foundry micro-interaction)
 * ------------------------------------------------------------------ */

function WeightWord({
  text,
  className,
  base = 500,
  hover = 800,
}: {
  text: string
  className?: string
  base?: number
  hover?: number
}) {
  const reduce = useReducedMotion()
  return (
    <span className={cn(display, className)} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          style={{ fontWeight: base }}
          whileHover={reduce ? undefined : { fontWeight: hover, color: "#e5431d" }}
          transition={{ duration: 0.18, ease }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Stagger primitives — the FEATURED interaction.
 * Parent fans children in; remount the parent (key) to replay on filter.
 * ------------------------------------------------------------------ */

const gridParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
}
const gridItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

/* ------------------------------------------------------------------ *
 * A catalogue card. The big glyph gains weight + colour on hover.
 * ------------------------------------------------------------------ */

function TypeCard({ t, base }: { t: Typeface; base: string }) {
  const reduce = useReducedMotion()
  const heaviest = t.weights[t.weights.length - 1]
  const lightest = t.weights[0]
  return (
    <motion.article variants={gridItem} className="group h-full">
      <NavLink
        to={`${base}/specimen?face=${t.id}`}
        className="flex h-full flex-col justify-between rounded-[6px] border border-[#16140e]/12 bg-[#f7f4ec] p-6 transition-colors duration-300 hover:border-[#16140e]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5431d] sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={cn(mono, "text-[11px] uppercase tracking-[0.18em] text-[#16140e]/45")}>
              {t.cat}
            </span>
            <h3
              className="mt-1 text-[26px] leading-none text-[#16140e]"
              style={{ fontFamily: t.font, fontWeight: heaviest }}
            >
              {t.name}
            </h3>
          </div>
          {t.featured && (
            <span className={cn(mono, "shrink-0 rounded-full bg-[#e5431d] px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-[#f2efe7]")}>
              Flagship
            </span>
          )}
        </div>

        {/* big glyph — shifts weight on hover */}
        <div className="my-7 flex items-end justify-between">
          <motion.span
            className="block leading-[0.8] text-[#16140e]"
            style={{ fontFamily: t.font, fontWeight: lightest, fontSize: "clamp(86px,12vw,128px)" }}
            initial={false}
            animate={{}}
            whileHover={reduce ? undefined : { fontWeight: heaviest, color: "#e5431d" }}
            transition={{ duration: 0.25, ease }}
          >
            {t.glyph}
          </motion.span>
          <span
            className="max-w-[58%] text-right text-[15px] leading-tight text-[#16140e]/70"
            style={{ fontFamily: t.font, fontWeight: lightest }}
          >
            {t.sample}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-[#16140e]/12 pt-4">
          <span className={cn(mono, "text-[11px] uppercase tracking-[0.14em] text-[#16140e]/55")}>
            {t.styles} styles · {t.year}
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#16140e] transition-colors group-hover:text-[#bd3517]">
            Specimen
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </NavLink>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ *
 * Layout — persistent nav + footer
 * ------------------------------------------------------------------ */

const navLinks: [string, string][] = [
  ["Typefaces", "typefaces"],
  ["Specimen", "specimen"],
  ["Foundry", "foundry"],
  ["Licensing", "licensing"],
]

function Nav({ base }: { base: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#16140e]/10 bg-[#f2efe7]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <NavLink to={base} end aria-label="QUIRE, home">
          <Mark />
        </NavLink>
        <nav className="flex items-center gap-0.5 sm:gap-1.5">
          {navLinks.map(([label, to]) => (
            <NavLink
              key={to}
              to={`${base}/${to}`}
              className={({ isActive }) =>
                cn(
                  body,
                  "relative rounded-full px-2.5 py-2 text-[13px] text-[#16140e]/65 transition-colors hover:text-[#16140e] sm:px-3.5 sm:text-[14px]",
                  isActive && "text-[#16140e]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="quire-nav-underline"
                      className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-[#e5431d]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Footer({ base }: { base: string }) {
  return (
    <footer className="border-t border-[#16140e]/12 bg-[#ebe7dc]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        {/* a quiet specimen line as a sign-off */}
        <p
          className="mb-12 text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.92] text-[#16140e]"
          style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800 }}
        >
          Type for the<br />
          <span className="text-[#e5431d]">long read.</span>
        </p>
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Mark />
            <p className={cn(serif, "mt-4 max-w-xs text-[15px] leading-relaxed text-[#16140e]/65")}>
              An independent type foundry drawing letterforms for editors,
              engineers and everyone reading past the headline. Leeds &amp;
              Lisbon, since 2014.
            </p>
          </div>
          <FootCol title="Browse">
            <FootLink to={base} end>Home</FootLink>
            <FootLink to={`${base}/typefaces`}>Typefaces</FootLink>
            <FootLink to={`${base}/specimen`}>Specimen</FootLink>
            <FootLink to={`${base}/foundry`}>Foundry</FootLink>
            <FootLink to={`${base}/licensing`}>Licensing</FootLink>
          </FootCol>
          <FootCol title="Studio">
            <span>hello@quire.type</span>
            <span>Trial fonts on request</span>
            <span>Custom commissions open</span>
            <span>@quiretype</span>
          </FootCol>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-[#16140e]/12 pt-6 text-[12px] text-[#16140e]/60 md:flex-row md:items-center md:justify-between">
          <span className={body}>© 2026 QUIRE Type Foundry. A fictional foundry built for a design study.</span>
          <span className={mono}>Specimens set in real webfonts</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      <div className={cn(body, "flex flex-col gap-2 text-[14px] text-[#16140e]/65")}>{children}</div>
    </div>
  )
}

function FootLink({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink to={to} end={end} className="w-fit transition-colors hover:text-[#bd3517]">
      {children}
    </NavLink>
  )
}

/* ------------------------------------------------------------------ *
 * Shared section header
 * ------------------------------------------------------------------ */

function SectionHead({
  kicker,
  title,
  intro,
}: {
  kicker: string
  title: ReactNode
  intro?: string
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{kicker}</Eyebrow>
      <h2 className={cn(display, "mt-3 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[#16140e]")}>
        {title}
      </h2>
      {intro && (
        <p className={cn(serif, "mt-4 text-[17px] leading-relaxed text-[#16140e]/70")}>{intro}</p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * HOME
 * ------------------------------------------------------------------ */

function Home({ base }: { base: string }) {
  const preview = typefaces.slice(0, 6)
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="flex items-center gap-3">
          <Eyebrow>Independent type foundry · est. 2014</Eyebrow>
          <span className="h-px flex-1 bg-[#16140e]/15" />
        </div>
        <h1 className="mt-8 text-[clamp(3rem,12vw,9rem)] font-bold leading-[0.86] tracking-[-0.03em] text-[#16140e]">
          <WeightWord text="Letters" /> <br />
          <span className={cn(serif, "italic font-light text-[#e5431d]")}>worth</span>{" "}
          <WeightWord text="reading." />
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <p className={cn(serif, "max-w-xl text-[19px] leading-relaxed text-[#16140e]/75")}>
            QUIRE draws type for the printed and the pixel — ten families built
            for long reads, dense tables and the occasional very large word.
            Made slowly, spaced obsessively, licensed in plain English.
          </p>
          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            <Magnetic>
              <NavLink
                to={`${base}/typefaces`}
                className={cn(
                  body,
                  "group inline-flex items-center gap-2 rounded-full bg-[#16140e] px-6 py-3.5 text-[15px] font-medium text-[#f2efe7] transition-colors hover:bg-[#e5431d]",
                )}
              >
                Browse typefaces
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </NavLink>
            </Magnetic>
            <NavLink
              to={`${base}/specimen`}
              className={cn(body, "text-[15px] font-medium text-[#16140e] underline-offset-4 hover:text-[#bd3517] hover:underline")}
            >
              Try the tester →
            </NavLink>
          </div>
        </div>
      </section>

      {/* Stat band */}
      <section className="border-y border-[#16140e]/12 bg-[#ebe7dc]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[#16140e]/12 px-5 sm:px-6 md:grid-cols-4">
          {[
            ["10", "families"],
            ["142", "styles"],
            ["3", "designers"],
            ["12", "years"],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.06} className="px-3 py-9 first:pl-0 md:px-6">
              <div className={cn(display, "text-[40px] font-extrabold leading-none text-[#16140e] md:text-[52px]")}>{n}</div>
              <div className={cn(mono, "mt-2 text-[11px] uppercase tracking-[0.18em] text-[#16140e]/55")}>{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Collection — staggered grid (featured interaction, replayed on view) */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead kicker="The collection" title={<>Ten families,<br />built to be lived in.</>} />
          <NavLink
            to={`${base}/typefaces`}
            className={cn(body, "inline-flex items-center gap-1.5 text-[15px] font-medium text-[#16140e] hover:text-[#bd3517]")}
          >
            See all ten <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>
        <motion.div
          variants={gridParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {preview.map((t) => (
            <TypeCard key={t.id} t={t} base={base} />
          ))}
        </motion.div>
      </section>

      {/* In use — editorial imagery with a shared duotone treatment */}
      <section className="border-t border-[#16140e]/12 bg-[#16140e] text-[#f2efe7]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <span className={cn(mono, "text-[11px] uppercase tracking-[0.22em] text-[#f2a58f]")}>In the wild</span>
            <h2 className={cn(display, "mt-3 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.02em]")}>
              Set by studios who sweat the details.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {inUse.map((im, i) => (
              <Reveal key={im.seed} delay={i * 0.08}>
                <figure className="overflow-hidden rounded-[6px] ring-1 ring-[#f2efe7]/15">
                  <div className="relative aspect-[4/5] bg-[#2a261c]">
                    <img
                      src={img(im.seed, im.w, im.h)}
                      alt={im.alt}
                      loading="lazy"
                      width={im.w}
                      height={im.h}
                      className="absolute inset-0 h-full w-full object-cover opacity-90"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 mix-blend-multiply"
                      style={{ background: "linear-gradient(180deg, rgba(22,20,14,0.15), rgba(229,67,29,0.32))" }}
                    />
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ *
 * TYPEFACES — full catalogue with filter, staggered grid replays on filter
 * ------------------------------------------------------------------ */

function Typefaces({ base }: { base: string }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All")
  const list = filter === "All" ? typefaces : typefaces.filter((t) => t.cat === filter)

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <SectionHead
        kicker="The catalogue"
        title={<>Every family<br />we make.</>}
        intro="Ten retail families, each shipping with the weights a real system needs. Filter by classification, then open a specimen to put it through its paces."
      />

      {/* filter tabs */}
      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter typefaces by category">
        {categories.map((c) => {
          const active = c === filter
          const count = c === "All" ? typefaces.length : typefaces.filter((t) => t.cat === (c as Category)).length
          return (
            <button
              key={c}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(c)}
              className={cn(
                body,
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium transition-colors",
                active
                  ? "border-[#16140e] bg-[#16140e] text-[#f2efe7]"
                  : "border-[#16140e]/20 text-[#16140e]/70 hover:border-[#16140e]/45 hover:text-[#16140e]",
              )}
            >
              {c}
              <span className={cn(mono, "text-[11px]", active ? "text-[#f2efe7]/60" : "text-[#16140e]/40")}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* grid — keyed by filter so the stagger replays on every switch */}
      <motion.div
        key={filter}
        variants={gridParent}
        initial="hidden"
        animate="show"
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {list.map((t) => (
          <TypeCard key={t.id} t={t} base={base} />
        ))}
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * SPECIMEN — the live type tester (signature interaction #2) + glyphs
 * ------------------------------------------------------------------ */

const GLYPHS = "AÆBCDEFGHIJKLMNOPQRSTUVWXYZ&abcdefghijklmnopqrstuvwxyz0123456789.,;:!?“”‘’()@#$£%*".split("")

function Specimen() {
  const { search } = useLocation()
  const initial = new URLSearchParams(search).get("face")
  const startId = typefaces.find((t) => t.id === initial)?.id ?? typefaces[0].id

  const [id, setId] = useState(startId)
  const face = typefaces.find((t) => t.id === id)!
  const [size, setSize] = useState(108)
  const [weight, setWeight] = useState(face.weights[face.weights.length - 1])
  const [text, setText] = useState("Handgloves & ampersands")

  // follow the ?face= query if it changes while we're already mounted
  useEffect(() => {
    if (initial && initial !== id && typefaces.some((t) => t.id === initial)) setId(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  // keep weight valid when the face changes
  useEffect(() => {
    if (!face.weights.includes(weight)) setWeight(face.weights[face.weights.length - 1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <SectionHead
        kicker="Type tester"
        title="Drive it yourself."
        intro="Pick a family, set the size and weight, then type whatever you like. The preview below is live — these are the real fonts you'd licence."
      />

      {/* ---- the tester ---- */}
      <div className="mt-10 overflow-hidden rounded-[10px] border border-[#16140e]/15 bg-[#f7f4ec]">
        {/* controls */}
        <div className="grid gap-5 border-b border-[#16140e]/12 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* face select */}
            <label className="block">
              <span className={cn(mono, "block text-[11px] uppercase tracking-[0.16em] text-[#16140e]/55")}>Typeface</span>
              <select
                value={id}
                onChange={(e) => setId(e.target.value)}
                className={cn(body, "mt-2 w-full rounded-md border border-[#16140e]/20 bg-[#f2efe7] px-3 py-2.5 text-[15px] text-[#16140e] focus:border-[#e5431d] focus:outline-none focus:ring-1 focus:ring-[#e5431d]")}
              >
                {typefaces.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.cat}
                  </option>
                ))}
              </select>
            </label>

            {/* size slider */}
            <label className="block">
              <span className={cn(mono, "flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#16140e]/55")}>
                Size <span className="text-[#bd3517]">{size}px</span>
              </span>
              <input
                type="range"
                min={28}
                max={168}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                aria-label="Specimen size in pixels"
                className="quire-range mt-3.5 w-full"
              />
            </label>
          </div>

          {/* weight buttons */}
          <div>
            <span className={cn(mono, "block text-[11px] uppercase tracking-[0.16em] text-[#16140e]/55")}>Weight</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {face.weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  aria-pressed={weight === w}
                  className={cn(
                    mono,
                    "rounded-md border px-3 py-2 text-[12px] transition-colors",
                    weight === w
                      ? "border-[#16140e] bg-[#16140e] text-[#f2efe7]"
                      : "border-[#16140e]/20 text-[#16140e]/70 hover:border-[#16140e]/45",
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* live preview */}
        <div className="relative overflow-hidden px-5 py-10 sm:px-8">
          <span className={cn(mono, "absolute right-4 top-3 text-[11px] text-[#16140e]/35")}>{face.name}</span>
          <p
            className="break-words text-[#16140e]"
            style={{ fontFamily: face.font, fontWeight: weight, fontSize: size, lineHeight: 1.04 }}
          >
            {text || "Type something…"}
          </p>
        </div>

        {/* type-here input */}
        <div className="border-t border-[#16140e]/12 p-5 sm:p-6">
          <label className="block">
            <span className={cn(mono, "block text-[11px] uppercase tracking-[0.16em] text-[#16140e]/55")}>Type here</span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something…"
              className={cn(body, "mt-2 w-full rounded-md border border-[#16140e]/20 bg-[#f2efe7] px-3.5 py-3 text-[16px] text-[#16140e] placeholder:text-[#16140e]/35 focus:border-[#e5431d] focus:outline-none focus:ring-1 focus:ring-[#e5431d]")}
            />
          </label>
        </div>
      </div>

      {/* ---- about this face ---- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={face.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease }}
          className="mt-14 grid gap-10 md:grid-cols-[1fr_1.4fr]"
        >
          <div>
            <span className={cn(mono, "text-[11px] uppercase tracking-[0.18em] text-[#bd3517]")}>{face.clazz}</span>
            <h3
              className="mt-2 text-[clamp(2.4rem,6vw,4rem)] leading-none text-[#16140e]"
              style={{ fontFamily: face.font, fontWeight: face.weights[face.weights.length - 1] }}
            >
              {face.name}
            </h3>
            <dl className={cn(mono, "mt-6 space-y-2 text-[13px] text-[#16140e]/65")}>
              <div className="flex justify-between border-b border-[#16140e]/10 pb-2"><dt>Designer</dt><dd className="text-[#16140e]">{face.designer}</dd></div>
              <div className="flex justify-between border-b border-[#16140e]/10 pb-2"><dt>Released</dt><dd className="text-[#16140e]">{face.year}</dd></div>
              <div className="flex justify-between border-b border-[#16140e]/10 pb-2"><dt>Styles</dt><dd className="text-[#16140e]">{face.styles}</dd></div>
            </dl>
          </div>
          <p className={cn(serif, "text-[19px] leading-relaxed text-[#16140e]/80")}>{face.blurb}</p>
        </motion.div>
      </AnimatePresence>

      {/* ---- glyph set ---- */}
      <div className="mt-14">
        <Eyebrow>Character set</Eyebrow>
        <div className="mt-5 grid grid-cols-6 gap-px overflow-hidden rounded-[8px] border border-[#16140e]/12 bg-[#16140e]/12 sm:grid-cols-10 md:grid-cols-12">
          {GLYPHS.map((g, i) => (
            <div
              key={i}
              className="group flex aspect-square items-center justify-center bg-[#f7f4ec] text-[#16140e] transition-colors duration-200 hover:bg-[#e5431d] hover:text-[#f2efe7]"
              style={{ fontFamily: face.font, fontWeight: 500, fontSize: "clamp(18px,3vw,26px)" }}
            >
              {g}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * FOUNDRY — about, principles, team
 * ------------------------------------------------------------------ */

function Foundry() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <SectionHead
        kicker="The foundry"
        title={<>A reading habit,<br />not a logo.</>}
      />
      <div className="mt-8 grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-start">
        <p className={cn(serif, "text-[clamp(1.3rem,2.6vw,1.6rem)] leading-relaxed text-[#16140e]/85")}>
          QUIRE began in 2014 with a single grotesque and an argument that has
          never quite ended: that the gaps between letters matter more than the
          letters themselves. We are three people in two cities who would rather
          make ten families you can build a whole identity on than a hundred you
          use once and forget.
        </p>
        <div className="rounded-[8px] border border-[#16140e]/15 bg-[#ebe7dc] p-6">
          <Quote className="h-7 w-7 text-[#e5431d]" strokeWidth={1.5} />
          <p className={cn(serif, "mt-3 text-[18px] italic leading-relaxed text-[#16140e]/85")}>
            "Good spacing is invisible. Bad spacing is all you can see. We spend
            our weeks on the invisible part."
          </p>
          <p className={cn(mono, "mt-4 text-[12px] uppercase tracking-[0.16em] text-[#16140e]/55")}>Mira Okonkwo, founder</p>
        </div>
      </div>

      {/* principles */}
      <div className="mt-20">
        <Eyebrow>How we work</Eyebrow>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[8px] border border-[#16140e]/12 bg-[#16140e]/12 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.n} delay={(i % 2) * 0.08} className="bg-[#f7f4ec] p-7">
              <div className="flex items-baseline gap-4">
                <span className={cn(mono, "text-[13px] text-[#e5431d]")}>{p.n}</span>
                <h3 className={cn(display, "text-[22px] font-bold leading-snug tracking-[-0.01em] text-[#16140e]")}>{p.t}</h3>
              </div>
              <p className={cn(serif, "mt-3 pl-9 text-[16px] leading-relaxed text-[#16140e]/70")}>{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* team */}
      <div className="mt-20">
        <Eyebrow>The three of us</Eyebrow>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <figure>
                <div className="overflow-hidden rounded-[6px] ring-1 ring-[#16140e]/12">
                  <div className="relative aspect-[4/5] bg-[#ddd6c8]">
                    <img
                      src={img(m.seed, 640, 800)}
                      alt={`Portrait of ${m.name}`}
                      loading="lazy"
                      width={640}
                      height={800}
                      className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                    />
                  </div>
                </div>
                <figcaption className="mt-4">
                  <h3 className={cn(display, "text-[20px] font-bold text-[#16140e]")}>{m.name}</h3>
                  <p className={cn(mono, "mt-0.5 text-[12px] uppercase tracking-[0.14em] text-[#bd3517]")}>{m.role}</p>
                  <p className={cn(serif, "mt-3 text-[15px] leading-relaxed text-[#16140e]/70")}>{m.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * LICENSING — tiers + FAQ
 * ------------------------------------------------------------------ */

function Licensing({ base }: { base: string }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <SectionHead
        kicker="Licensing"
        title={<>Priced by where<br />the type lives.</>}
        intro="One plain-English licence, no per-pageview maths and no annual surprises. Buy a single style, or the whole family for your studio."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.07}>
            <div
              className={cn(
                "flex h-full flex-col rounded-[8px] border p-7",
                t.featured
                  ? "border-[#e5431d] bg-[#16140e] text-[#f2efe7]"
                  : "border-[#16140e]/15 bg-[#f7f4ec] text-[#16140e]",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className={cn(display, "text-[22px] font-bold")}>{t.name}</h3>
                {t.featured && (
                  <span className={cn(mono, "rounded-full bg-[#e5431d] px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[#f2efe7]")}>
                    Most chosen
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className={cn(display, "text-[44px] font-extrabold leading-none")}>{t.price}</span>
                <span className={cn(mono, "text-[12px]", t.featured ? "text-[#f2efe7]/55" : "text-[#16140e]/50")}>{t.unit}</span>
              </div>
              <p className={cn(serif, "mt-3 text-[15px] leading-relaxed", t.featured ? "text-[#f2efe7]/75" : "text-[#16140e]/70")}>
                {t.blurb}
              </p>
              <ul className={cn(body, "mt-6 flex-1 space-y-3 text-[14px]")}>
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Check className={cn("mt-0.5 h-4 w-4 shrink-0", t.featured ? "text-[#f2a58f]" : "text-[#e5431d]")} />
                    <span className={t.featured ? "text-[#f2efe7]/85" : "text-[#16140e]/80"}>{p}</span>
                  </li>
                ))}
              </ul>
              <Magnetic strength={0.3}>
                <button
                  className={cn(
                    body,
                    "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium transition-colors",
                    t.featured
                      ? "bg-[#e5431d] text-[#f2efe7] hover:bg-[#f2efe7] hover:text-[#16140e]"
                      : "bg-[#16140e] text-[#f2efe7] hover:bg-[#e5431d]",
                  )}
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </div>
          </Reveal>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="mt-20 grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-start">
        <SectionHead kicker="Questions" title="Before you buy." />
        <div className="divide-y divide-[#16140e]/12 border-y border-[#16140e]/12">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className={cn(display, "text-[18px] font-semibold text-[#16140e]")}>{f.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0 text-[#e5431d]" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-[#16140e]/45" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease }}
                      className="overflow-hidden"
                    >
                      <p className={cn(serif, "pb-5 pr-8 text-[16px] leading-relaxed text-[#16140e]/70")}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* closing CTA */}
      <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-[10px] bg-[#16140e] p-8 text-[#f2efe7] sm:flex-row sm:items-center sm:p-10">
        <div>
          <h3 className={cn(display, "text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-tight")}>
            Want to try before you buy?
          </h3>
          <p className={cn(serif, "mt-2 max-w-md text-[16px] text-[#f2efe7]/75")}>
            Every family has free trial files for sketching and pitch work. Open
            a specimen, or just ask.
          </p>
        </div>
        <Magnetic>
          <NavLink
            to={`${base}/specimen`}
            className={cn(body, "group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#e5431d] px-6 py-3.5 text-[15px] font-medium text-[#f2efe7] transition-colors hover:bg-[#f2efe7] hover:text-[#16140e]")}
          >
            Open the tester
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </NavLink>
        </Magnetic>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Page transition + shell
 * ------------------------------------------------------------------ */

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease }}
    >
      {children}
    </motion.div>
  )
}

export default function Quire() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <MotionConfig reducedMotion="user">
      <div className={cn(body, "min-h-screen bg-[#f2efe7] text-[#16140e] antialiased selection:bg-[#e5431d] selection:text-[#f2efe7]")}>
        {/* local range-slider styling so the tester feels crafted */}
        <style>{`
          .quire-range { -webkit-appearance:none; appearance:none; height:3px; border-radius:99px; background:rgba(22,20,14,0.18); outline:none; }
          .quire-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:99px; background:#e5431d; border:3px solid #f7f4ec; box-shadow:0 1px 3px rgba(22,20,14,0.3); cursor:pointer; }
          .quire-range::-moz-range-thumb { width:18px; height:18px; border-radius:99px; background:#e5431d; border:3px solid #f7f4ec; cursor:pointer; }
        `}</style>
        <Nav base={base} />
        <main>
          <Routes>
            <Route index element={<Page><Home base={base} /></Page>} />
            <Route path="typefaces" element={<Page><Typefaces base={base} /></Page>} />
            <Route path="specimen" element={<Page><Specimen /></Page>} />
            <Route path="foundry" element={<Page><Foundry /></Page>} />
            <Route path="licensing" element={<Page><Licensing base={base} /></Page>} />
            <Route path="*" element={<Page><Home base={base} /></Page>} />
          </Routes>
        </main>
        <Footer base={base} />
      </div>
    </MotionConfig>
  )
}

export const meta: SiteMeta = {
  title: "QUIRE — An independent type foundry",
  description:
    "A fictional type foundry showcasing ten families in their real letterforms. Staggered grid catalogue entrances as the featured interaction, plus a live size/weight type tester and per-letter weight-on-hover headlines.",
  date: "2026-06-23",
  type: "Type foundry",
  interaction: "Staggered grid entrances (replayed on filter) + live type tester + per-letter weight-on-hover",
  pages: ["Home", "Typefaces", "Specimen", "Foundry", "Licensing"],
}
