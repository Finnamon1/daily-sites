import { useEffect, useRef, useState, type ReactNode } from "react"
import { useInView, useReducedMotion, motion } from "framer-motion"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* palette — deep ink + a single confident amber, plus a muted slate   */
/* second series used ONLY inside charts (functional, not a 2nd brand)  */
/* ------------------------------------------------------------------ */
export const INK = "#0c0e12"
export const AMBER = "#f0b429"
export const AMBER_SOFT = "rgba(240,180,41,0.16)"
export const SLATE = "#6b7686"

/* ------------------------------------------------------------------ */
/* count-up: raw rAF + cubic ease, gated on inView(once); reduced      */
/* motion jumps straight to the target (design-log lesson)             */
/* ------------------------------------------------------------------ */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(target * easeOutCubic(p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration, reduced])

  return { ref, value }
}

export function Stat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}) {
  const { ref, value: v } = useCountUp(value, duration)
  const display = v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* area + line chart — path draws itself on scroll-in via dash offset  */
/* ------------------------------------------------------------------ */
function buildPath(data: number[], w: number, h: number, pad = 6) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const step = (w - pad * 2) / (data.length - 1)
  return data.map((d, i) => {
    const x = pad + i * step
    const y = pad + (h - pad * 2) * (1 - (d - min) / span)
    return { x, y }
  })
}

function smooth(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return ""
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    const cx = (p0.x + p1.x) / 2
    d += ` C ${cx} ${p0.y} ${cx} ${p1.y} ${p1.x} ${p1.y}`
  }
  return d
}

export function AreaChart({
  data,
  height = 180,
  className,
  stroke = AMBER,
}: {
  data: number[]
  height?: number
  className?: string
  stroke?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduced = useReducedMotion()
  const W = 600
  const pts = buildPath(data, W, height)
  const line = smooth(pts)
  const area = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`
  const id = useRef(`g${Math.random().toString(36).slice(2)}`).current

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${height}`}
      className={cn("w-full", className)}
      preserveAspectRatio="none"
      role="img"
      aria-label="Revenue trend, climbing left to right"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={W} y1={height * g} y2={height * g} stroke="#ffffff" strokeOpacity="0.05" />
      ))}
      <motion.path
        d={area}
        fill={`url(#${id})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* end marker */}
      <motion.circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={4}
        fill={INK}
        stroke={stroke}
        strokeWidth={2.5}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: reduced ? 0 : 1.2, type: "spring", stiffness: 300, damping: 18 }}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* bars — staggered grow from the baseline                             */
/* ------------------------------------------------------------------ */
export function Bars({
  data,
  labels,
  className,
}: {
  data: number[]
  labels: string[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const max = Math.max(...data)

  return (
    <div ref={ref} className={cn("flex h-full items-end gap-3", className)}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <motion.div
              className="w-full rounded-t-[3px]"
              style={{ background: i === data.length - 1 ? AMBER : "rgba(240,180,41,0.32)" }}
              initial={{ height: reduced ? `${(d / max) * 100}%` : 0 }}
              animate={inView ? { height: `${(d / max) * 100}%` } : {}}
              transition={{ duration: 0.7, delay: reduced ? 0 : i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#6b7686]">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ring — net retention dial, sweeps on scroll-in                      */
/* ------------------------------------------------------------------ */
export function Ring({ pct, label }: { pct: number; label: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c * (1 - pct / 100)

  return (
    <div className="relative grid place-items-center">
      <svg ref={ref} viewBox="0 0 130 130" className="h-36 w-36 -rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="10" />
        <motion.circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke={AMBER}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduced ? offset : c }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Stat value={pct} suffix="%" className="font-['IBM_Plex_Mono'] text-2xl font-semibold text-[#f3f4f6]" />
        <span className="mt-0.5 text-[11px] uppercase tracking-wider text-[#6b7686]">{label}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* sparkline — tiny inline trend, no animation (used in dense rows)    */
/* ------------------------------------------------------------------ */
export function Sparkline({ data, up = true }: { data: number[]; up?: boolean }) {
  const W = 80
  const H = 28
  const pts = buildPath(data, W, H, 2)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-20" aria-hidden>
      <path
        d={smooth(pts)}
        fill="none"
        stroke={up ? AMBER : SLATE}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  )
}

/* shared shells ---------------------------------------------------- */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-[#11141a] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#f0b429]">
      <span className="h-px w-6 bg-[#f0b429]/60" />
      {children}
    </span>
  )
}
