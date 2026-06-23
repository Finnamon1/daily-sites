import { useEffect, useRef, useState, type ReactNode } from "react"
import { NavLink, useParams } from "react-router-dom"
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"
import { ArrowRight, MoonStar } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  VESPER RAIL — overnight sleeper trains across Europe               */
/*  Palette: bone paper #f3ede1 · ink #14202b · muted #51596a         */
/*  accent signal-vermilion #bf3a1c (≈4.7:1 on paper — body-safe,      */
/*  but reserved for emphasis; small print stays ink/muted)           */
/*  Split-flap board: slate #161b22 panel, flap #262d38, cream chars  */
/* ------------------------------------------------------------------ */

export const display = "font-['Bricolage_Grotesque']"
export const body = "font-['Spectral']"
export const mono = "font-['JetBrains_Mono']"

export const ink = "#14202b"
export const paper = "#f3ede1"
export const accent = "#bf3a1c"

/* ================================================================== */
/*  FEATURED INTERACTION — the split-flap (Solari) departures board.   */
/*  Each cell flips through an alphabet to land on its target glyph;    */
/*  the whole board re-shuffles its destinations on a timer, the way    */
/*  a real station board updates. Reduced motion → instant, static.     */
/* ================================================================== */

const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-·".split("")

function FlapChar({ target, big }: { target: string; big?: boolean }) {
  const reduce = useReducedMotion()
  const up = target.toUpperCase()
  const targetIdx = Math.max(0, ALPHABET.indexOf(up === "" ? " " : up))
  const [idx, setIdx] = useState(targetIdx)

  useEffect(() => {
    if (reduce) {
      setIdx(targetIdx)
      return
    }
    const id = setInterval(() => {
      setIdx((c) => {
        if (c === targetIdx) {
          clearInterval(id)
          return c
        }
        return (c + 1) % ALPHABET.length
      })
    }, 34)
    return () => clearInterval(id)
  }, [targetIdx, reduce])

  const glyph = ALPHABET[idx] === " " ? " " : ALPHABET[idx]

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-[3px] border border-black/40 bg-[#262d38] text-[#ece2cf] shadow-[inset_0_-1px_0_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
        mono,
        big
          ? "h-[clamp(30px,7vw,52px)] w-[clamp(20px,4.6vw,34px)] text-[clamp(16px,3.6vw,28px)]"
          : "h-7 w-[18px] text-[13px]",
      )}
      style={{ perspective: 220 }}
      aria-hidden
    >
      {/* hinge line across the middle of the flap */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-px bg-black/55" />
      <motion.span
        key={idx}
        initial={{ rotateX: reduce ? 0 : -90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.13, ease: [0.3, 0, 0.2, 1] }}
        style={{ transformOrigin: "center bottom", display: "block", lineHeight: 1 }}
        className="font-medium tabular-nums"
      >
        {glyph}
      </motion.span>
    </span>
  )
}

export function FlapText({
  value,
  length,
  big,
  className,
}: {
  value: string
  length: number
  big?: boolean
  className?: string
}) {
  const padded = value.toUpperCase().slice(0, length).padEnd(length, " ")
  return (
    <span className={cn("inline-flex gap-[2px]", className)} aria-label={value}>
      {padded.split("").map((ch, i) => (
        <FlapChar key={i} target={ch} big={big} />
      ))}
    </span>
  )
}

export type Departure = { dest: string; time: string; via: string; status: string }

export function SplitFlapBoard({
  rows,
  cycle = true,
}: {
  rows: Departure[]
  cycle?: boolean
}) {
  const reduce = useReducedMotion()
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (reduce || !cycle) return
    const id = setInterval(() => setOffset((o) => (o + 1) % rows.length), 3600)
    return () => clearInterval(id)
  }, [reduce, cycle, rows.length])

  const view = Array.from({ length: Math.min(4, rows.length) }, (_, i) => rows[(offset + i) % rows.length])

  return (
    <div className="overflow-x-auto rounded-xl border border-black/50 bg-[#161b22] p-3 shadow-[0_30px_60px_-30px_rgba(20,32,43,0.6)] sm:p-5">
      <div className="min-w-[440px]">
        <div className={cn("mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#7e8aa0]", mono)}>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#bf3a1c]" />
            Tonight&rsquo;s sleepers
          </span>
          <span>Departures · CET</span>
        </div>

        <div className={cn("grid grid-cols-[1fr_auto_auto] gap-x-4 pb-2 text-[9px] uppercase tracking-[0.24em] text-[#5f6a7e] sm:grid-cols-[1fr_auto_auto_auto]", mono)}>
          <span>Destination</span>
          <span className="hidden sm:block">Via</span>
          <span>Departs</span>
          <span className="text-right">Status</span>
        </div>

        <div className="space-y-2">
          {view.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 sm:grid-cols-[1fr_auto_auto_auto]"
            >
              <FlapText value={r.dest} length={11} />
              <span className="hidden sm:block">
                <FlapText value={r.via} length={6} />
              </span>
              <FlapText value={r.time} length={5} />
              <span className="text-right">
                <span
                  className={cn(
                    "rounded-[3px] px-2 py-1 text-[10px] uppercase tracking-[0.18em]",
                    mono,
                    r.status.toUpperCase() === "BOARDING"
                      ? "bg-[#bf3a1c] text-[#f7efe2]"
                      : "bg-[#262d38] text-[#9fa9bb]",
                  )}
                >
                  {r.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Count-up number, fires once when scrolled into view                */
/* ================================================================== */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
}) {
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
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setN(value * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduce])

  const text = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString()
  return (
    <span ref={ref} className={mono}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}

/* ================================================================== */
/*  Reveal — honours reduced motion                                    */
/* ================================================================== */
export function Up({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

/* ================================================================== */
/*  Buttons — magnetic primary CTA + quiet outline                     */
/* ================================================================== */
export function Cta({
  to,
  children,
  variant = "solid",
}: {
  to: string
  children: ReactNode
  variant?: "solid" | "ghost"
}) {
  const cls =
    variant === "solid"
      ? "bg-[#14202b] text-[#f3ede1] hover:bg-[#bf3a1c]"
      : "border border-[#14202b]/25 text-[#14202b] hover:border-[#bf3a1c] hover:text-[#bf3a1c]"
  return (
    <Magnetic strength={0.3}>
      <NavLink
        to={to}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200",
          mono,
          cls,
        )}
      >
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </NavLink>
    </Magnetic>
  )
}

/* Tag / eyebrow. `light` switches dash + text to the ember tone for dark grounds. */
export function Eyebrow({
  children,
  light = false,
  className,
}: {
  children: ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em]",
        light ? "text-[#e2724f]" : "text-[#bf3a1c]",
        mono,
        className,
      )}
    >
      <span className={cn("h-px w-6", light ? "bg-[#e2724f]" : "bg-[#bf3a1c]")} />
      {children}
    </span>
  )
}

/* ================================================================== */
/*  Wordmark + Footer                                                   */
/* ================================================================== */
export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-full",
          light ? "bg-[#f3ede1] text-[#14202b]" : "bg-[#14202b] text-[#f3ede1]",
        )}
      >
        <MoonStar className="h-4 w-4" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-[18px] font-extrabold tracking-tight",
            display,
            light ? "text-[#f3ede1]" : "text-[#14202b]",
          )}
        >
          Vesper Rail
        </span>
        <span className={cn("block text-[8.5px] uppercase tracking-[0.32em]", mono, light ? "text-[#f3ede1]/65" : "text-[#51596a]")}>
          Overnight Europe
        </span>
      </span>
    </span>
  )
}

export function Footer() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <footer className="bg-[#14202b] text-[#dfe4ec]">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark light />
            <p className={cn("mt-5 max-w-xs text-[15px] leading-relaxed text-[#9fa9bb]", body)}>
              Sleeper trains the long way round Europe. Board after dinner,
              wake with the curtains open on somewhere new.
            </p>
          </div>
          <div>
            <h4 className={cn("mb-4 text-[11px] uppercase tracking-[0.24em] text-[#bf6a52]", mono)}>
              Plan
            </h4>
            <ul className={cn("space-y-2.5 text-[15px] text-[#c4cad6]", body)}>
              <li><NavLink to={base} end className="hover:text-white">Home</NavLink></li>
              <li><NavLink to={`${base}/routes`} className="hover:text-white">Routes</NavLink></li>
              <li><NavLink to={`${base}/onboard`} className="hover:text-white">Onboard</NavLink></li>
              <li><NavLink to={`${base}/fares`} className="hover:text-white">Fares</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className={cn("mb-4 text-[11px] uppercase tracking-[0.24em] text-[#bf6a52]", mono)}>
              Booking office
            </h4>
            <p className={cn("space-y-1 text-[15px] leading-relaxed text-[#c4cad6]", mono)}>
              Platform 4, Gare de l&rsquo;Est
              <br />
              75010 Paris, France
              <br />
              <span className="text-[#9fa9bb]">hello@vesperrail.eu</span>
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#7e8aa0] sm:flex-row sm:items-center sm:justify-between">
          <span className={mono}>© 2026 Vesper Rail · A slow-travel company</span>
          <span className={mono}>Carbon per km: 1/8th of flying</span>
        </div>
      </div>
    </footer>
  )
}
