import { type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { C, type Temp } from "./theme"

/** Mono kicker with a short ember rule — used to label every section. */
export function Kicker({ children, cold = false }: { children: ReactNode; cold?: boolean }) {
  return (
    <span className="flex items-center gap-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.28em]" style={{ color: cold ? C.steelText : C.emberText }}>
      <span aria-hidden className="h-px w-7" style={{ background: cold ? C.steel : C.ember }} />
      {children}
    </span>
  )
}

const TEMP_COLOR: Record<Temp, string> = { warm: C.ember, cold: C.steel, still: "#8a7c66" }
const TEMP_LABEL: Record<Temp, string> = { warm: "Heat", cold: "Cold", still: "Rest" }

/** Small temperature tag — the warm/cold language repeated across the site. */
export function ThermalTag({ temp, onDark = false }: { temp: Temp; onDark?: boolean }) {
  const dot = TEMP_COLOR[temp]
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-[0.18em]"
      style={{
        color: onDark ? "rgba(244,238,228,0.82)" : C.ink,
        background: onDark ? "rgba(244,238,228,0.07)" : "rgba(33,27,21,0.05)",
        border: `1px solid ${onDark ? "rgba(244,238,228,0.14)" : C.line}`,
      }}
    >
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: dot, boxShadow: `0 0 0 3px ${dot}22` }} />
      {TEMP_LABEL[temp]}
    </span>
  )
}

/** Ambient rising "steam" — a few slow, blurred motes behind hero content.
 *  Frozen entirely under prefers-reduced-motion. */
export function SteamField({ tint = C.ember }: { tint?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return null
  const motes = [
    { x: "12%", s: 220, d: 13, delay: 0 },
    { x: "44%", s: 300, d: 17, delay: 2.5 },
    { x: "72%", s: 180, d: 11, delay: 1.2 },
    { x: "88%", s: 260, d: 19, delay: 4 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ left: m.x, bottom: -120, width: m.s, height: m.s, background: tint, opacity: 0.14 }}
          animate={{ y: [0, -240, -440], opacity: [0, 0.16, 0], scale: [0.8, 1.1, 1.3] }}
          transition={{ duration: m.d, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

/** Section wrapper with consistent rhythm. */
export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-6 ${className}`}>
      {children}
    </section>
  )
}
