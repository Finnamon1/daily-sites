import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ *
 * ORLA VANN — brand tokens & shared building blocks
 * Phosphor-green oscilloscope glow on cool near-black. Single accent.
 * ------------------------------------------------------------------ */

export const ACCENT = "#c5f24c"

/** Wordmark used in nav + footer. */
export function Wordmark() {
  return (
    <span className="font-['Bricolage_Grotesque'] text-[19px] font-extrabold tracking-[-0.03em] text-[#e9ebe6]">
      ORLA<span className="text-[#c5f24c]">·</span>VANN
    </span>
  )
}

/** Persistent footer (rendered by Layout, and as Home's final snap panel). */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0c10]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Wordmark />
          <p className="mt-4 max-w-xs font-['Hanken_Grotesk'] text-sm leading-relaxed text-[#e9ebe6]/55">
            Modular ambient recorded to tape in Aarhus, Denmark. Released on her
            own imprint, Phosphor.
          </p>
        </div>
        <div>
          <Label className="text-[#e9ebe6]/45">Listen</Label>
          <ul className="mt-4 space-y-2 font-['Hanken_Grotesk'] text-sm text-[#e9ebe6]/70">
            {["Bandcamp", "Spotify", "Apple Music", "SoundCloud"].map((s) => (
              <li key={s}>
                <a href="#" className="transition-colors hover:text-[#c5f24c]">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Label className="text-[#e9ebe6]/45">Enquiries</Label>
          <ul className="mt-4 space-y-2 font-['Hanken_Grotesk'] text-sm text-[#e9ebe6]/70">
            <li>Booking — live@phosphor.fm</li>
            <li>Sync — sync@phosphor.fm</li>
            <li>Press — words@phosphor.fm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 sm:flex-row">
          <Label className="text-[#e9ebe6]/40">© 2026 Phosphor Recordings</Label>
          <Label className="text-[#e9ebe6]/40">Made on the night shift</Label>
        </div>
      </div>
    </footer>
  )
}

/** Mono small-caps label / kicker. */
export function Label({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.28em]",
        className,
      )}
    >
      {children}
    </span>
  )
}

/** A short phosphor kicker bar + label, used to open sections. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="h-px w-8 bg-[#c5f24c]" />
      <Label className="text-[#c5f24c]">{children}</Label>
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Oscilloscope — the featured visual. A composite sine wave rendered
 * to an SVG <path> mutated directly each RAF frame (no re-render). The
 * trace "opens up" when `playing` is true. Static under reduced motion.
 * ------------------------------------------------------------------ */
function buildTrace(phase: number, amp: number, w: number, h: number, harm: number) {
  const mid = h / 2
  const pts: string[] = []
  const steps = 96
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w
    const t = (i / steps) * Math.PI * 2
    // primary sine + a faster harmonic so the trace looks "alive"
    const y =
      mid +
      Math.sin(t * 2 + phase) * amp * (h * 0.3) +
      Math.sin(t * harm + phase * 1.7) * amp * (h * 0.12)
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return "M" + pts.join(" L")
}

export function Oscilloscope({
  playing,
  className,
  thin,
}: {
  playing: boolean
  className?: string
  thin?: boolean
}) {
  const reduce = useReducedMotion()
  const main = useRef<SVGPathElement>(null)
  const ghost = useRef<SVGPathElement>(null)
  const amp = useRef(reduce ? 0.5 : 0.28)
  const W = 1200
  const H = 240

  useEffect(() => {
    if (reduce) {
      main.current?.setAttribute("d", buildTrace(0.6, 0.55, W, H, 5))
      ghost.current?.setAttribute("d", buildTrace(2.1, 0.4, W, H, 3))
      return
    }
    let raf = 0
    let phase = 0
    const tick = () => {
      phase += 0.045
      const target = playing ? 0.95 : 0.3
      amp.current += (target - amp.current) * 0.06
      main.current?.setAttribute("d", buildTrace(phase, amp.current, W, H, 5))
      ghost.current?.setAttribute("d", buildTrace(phase - 0.9, amp.current * 0.7, W, H, 3))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, reduce])

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("block w-full", className)}
    >
      <path
        ref={ghost}
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.28}
        strokeWidth={thin ? 1.5 : 3}
        strokeLinecap="round"
      />
      <path
        ref={main}
        fill="none"
        stroke={ACCENT}
        strokeWidth={thin ? 2 : 4}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${ACCENT}66)` }}
      />
    </svg>
  )
}

/** Tiny animated equaliser bars — the "now playing" tell. */
export function EqBars({ active }: { active: boolean }) {
  const reduce = useReducedMotion()
  const bars = [0, 1, 2, 3]
  return (
    <span className="inline-flex h-3.5 items-end gap-[3px]" aria-hidden>
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[#c5f24c]"
          initial={{ height: 4 }}
          animate={
            active && !reduce
              ? { height: [4, 14, 7, 12, 4] }
              : { height: active ? 9 : 4 }
          }
          transition={{
            duration: 0.9 + i * 0.12,
            repeat: active && !reduce ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  )
}

/** requestAnimationFrame count-up, gated on in-view. Jumps under reduced motion. */
export function Counter({
  to,
  duration = 1400,
  suffix = "",
  prefix = "",
}: {
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
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
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])

  const display =
    to >= 1000 ? Math.round(n).toLocaleString("en-US") : Math.round(n).toString()
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Content — real copy for the project.
 * ------------------------------------------------------------------ */

export const ALBUM = {
  title: "GLASSWORK",
  year: 2026,
  blurb:
    "Eight pieces built from a single detuned modular patch, recorded live to tape over three winter nights in a disused glassworks outside Aarhus.",
  cover: "https://picsum.photos/seed/glasswork-modular-night/900/900",
  tracks: [
    { n: 1, name: "Halide", len: "4:12" },
    { n: 2, name: "Slow Phosphor", len: "6:48" },
    { n: 3, name: "Tin Roof Rain", len: "3:57" },
    { n: 4, name: "Glasswork", len: "8:21" },
    { n: 5, name: "Sodium Light", len: "5:09" },
    { n: 6, name: "Undertow", len: "4:44" },
    { n: 7, name: "Calcite", len: "6:02" },
    { n: 8, name: "Night Bus Home", len: "7:33" },
  ],
}

export const RELEASES = [
  {
    title: "Glasswork",
    year: 2026,
    kind: "Album",
    cuts: 8,
    seed: "glasswork-cover-glass",
    note: "Recorded live to tape in a disused glassworks. Out now on Phosphor.",
  },
  {
    title: "Tidal Static",
    year: 2024,
    kind: "EP",
    cuts: 4,
    seed: "tidalstatic-shore-grain",
    note: "Field recordings from the North Sea coast, run through a broken spring reverb.",
  },
  {
    title: "Field Recordings, Vol. I",
    year: 2022,
    kind: "Album",
    cuts: 11,
    seed: "fieldrecordings-forest-fog",
    note: "Two years of tape loops and found sound, finally assembled into a record.",
  },
  {
    title: "Pilot Light",
    year: 2021,
    kind: "Single",
    cuts: 2,
    seed: "pilotlight-amber-window",
    note: "The first thing Orla ever released under her own name. Still the live closer.",
  },
]

export const TOUR = [
  { date: "12 Sep 2026", city: "Copenhagen", venue: "Vega — Lille Sal", status: "tickets" },
  { date: "15 Sep 2026", city: "Berlin", venue: "Berghain Kantine", status: "low" },
  { date: "19 Sep 2026", city: "Amsterdam", venue: "Paradiso Tuinzaal", status: "soldout" },
  { date: "23 Sep 2026", city: "London", venue: "Cafe OTO", status: "tickets" },
  { date: "27 Sep 2026", city: "Paris", venue: "La Gaîté Lyrique", status: "low" },
  { date: "02 Oct 2026", city: "Reykjavík", venue: "Mengi", status: "tickets" },
]

export const PRESS = [
  {
    quote:
      "Vann doesn't write songs so much as weather systems — you don't listen to Glasswork, you stand inside it.",
    who: "The Wire",
  },
  {
    quote:
      "The rare ambient record with a pulse. Patient, physical, and quietly devastating.",
    who: "Pitchfork",
  },
  {
    quote: "Tape hiss has never sounded this much like a held breath.",
    who: "Resident Advisor",
  },
]
