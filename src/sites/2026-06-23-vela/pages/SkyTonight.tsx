import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Counter, Up, body, display, mono } from "../shared"

/* Deterministic southern-sky points (Crux + Centaurus-ish) for the chart */
const CHART_STARS = [
  { x: 50, y: 16, r: 2.2 },
  { x: 50, y: 64, r: 2.6 },
  { x: 30, y: 40, r: 1.8 },
  { x: 70, y: 42, r: 2 },
  { x: 60, y: 30, r: 1.3 },
  { x: 22, y: 70, r: 1.6 },
  { x: 80, y: 66, r: 1.7 },
  { x: 38, y: 84, r: 1.4 },
  { x: 68, y: 82, r: 1.5 },
  { x: 14, y: 30, r: 1.1 },
  { x: 86, y: 28, r: 1.2 },
]
// Southern Cross asterism + pointer lines
const CHART_LINES: [number, number][] = [
  [0, 1],
  [2, 3],
  [3, 6],
  [5, 7],
  [4, 10],
  [6, 8],
]

const PLANETS = [
  { name: "Venus", note: "Brilliant, low west after dusk", mag: -4.1 },
  { name: "Mars", note: "Rust-red, high in Scorpius", mag: 0.8 },
  { name: "Jupiter", note: "Four moons in binoculars", mag: -2.3 },
  { name: "Saturn", note: "Rings near maximum tilt", mag: 0.6 },
]

const TARGETS = [
  { name: "Omega Centauri", type: "Globular cluster", detail: "Ten million suns, naked-eye fuzzy" },
  { name: "Eta Carinae Nebula", type: "Emission nebula", detail: "Four full moons wide" },
  { name: "The Jewel Box", type: "Open cluster", detail: "Red, white and blue gems in Crux" },
  { name: "Large Magellanic Cloud", type: "Dwarf galaxy", detail: "A neighbouring galaxy, by eye" },
]

export function SkyTonight() {
  const reduce = useReducedMotion()

  return (
    <div className="mx-auto max-w-6xl px-5 pt-36 pb-24">
      <Up>
        <p className={cn("text-[11px] uppercase tracking-[0.28em] text-[#f4b860]", mono)}>
          Sky tonight · 23 June 2026 · 21:30 local
        </p>
        <h1 className={cn("mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.02] text-[#e9e4d8]", display)}>
          What the desert is showing you tonight.
        </h1>
      </Up>

      <div className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        {/* rotating star chart */}
        <Up>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090d17] p-8">
            <div className={cn("mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#97a0b2]", mono)}>
              <span>Crux &amp; the pointers</span>
              <span>Looking south</span>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <motion.svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={reduce ? undefined : { duration: 220, ease: "linear", repeat: Infinity }}
                style={{ transformOrigin: "50% 50%" }}
              >
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.08)" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.05)" />
                {CHART_LINES.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={CHART_STARS[a].x}
                    y1={CHART_STARS[a].y}
                    x2={CHART_STARS[b].x}
                    y2={CHART_STARS[b].y}
                    stroke="rgba(244,184,96,0.45)"
                    strokeWidth="0.5"
                  />
                ))}
                {CHART_STARS.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e9e4d8" />
                ))}
              </motion.svg>
              {/* center crosshair, static */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-px w-6 bg-[#f4b860]/40" />
                <div className="absolute h-6 w-px bg-[#f4b860]/40" />
              </div>
            </div>
            <p className={cn("mt-6 text-center text-xs text-[#7f8798]", mono)}>
              Chart drifts ~15° per hour as the Earth turns
            </p>
          </div>
        </Up>

        {/* moon + planets */}
        <div className="space-y-6">
          <Up>
            <div className="flex items-center gap-6 rounded-3xl border border-white/10 bg-[#0c1220]/60 p-7">
              <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden>
                <defs>
                  <clipPath id="moon-clip">
                    <circle cx="40" cy="40" r="34" />
                  </clipPath>
                </defs>
                <circle cx="40" cy="40" r="34" fill="#1a2030" />
                <g clipPath="url(#moon-clip)">
                  {/* waning crescent ~14% lit on the left */}
                  <circle cx="58" cy="40" r="34" fill="#f4b860" opacity="0.92" />
                  <circle cx="40" cy="40" r="34" fill="#090d17" />
                  <circle cx="34" cy="40" r="34" fill="#f4b860" opacity="0.92" />
                  <circle cx="40" cy="40" r="34" fill="#090d17" />
                </g>
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.12)" />
              </svg>
              <div>
                <h3 className={cn("text-xl text-[#e9e4d8]", display)}>Waning crescent</h3>
                <p className={cn("mt-1 text-sm text-[#aeb4c0]", body)}>
                  Just <Counter value={14} suffix="%" /> illuminated — rises near 03:00,
                  so the deep-sky window is wide open all evening.
                </p>
              </div>
            </div>
          </Up>

          <Up delay={0.06}>
            <div className="rounded-3xl border border-white/10 bg-[#0c1220]/60 p-7">
              <h3 className={cn("mb-4 text-[11px] uppercase tracking-[0.24em] text-[#f4b860]", mono)}>
                Planets up now
              </h3>
              <ul className="divide-y divide-white/5">
                {PLANETS.map((p) => (
                  <li key={p.name} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <span className={cn("text-base text-[#e9e4d8]", display)}>{p.name}</span>
                      <span className={cn("ml-3 text-xs text-[#97a0b2]", body)}>{p.note}</span>
                    </div>
                    <span className={cn("shrink-0 text-xs text-[#f4b860]", mono)}>
                      mag {p.mag > 0 ? "+" : ""}
                      {p.mag.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Up>
        </div>
      </div>

      {/* deep-sky targets */}
      <Up className="mt-12">
        <h2 className={cn("text-[clamp(1.5rem,3vw,2.2rem)] font-light text-[#e9e4d8]", display)}>
          Tonight&apos;s best objects
        </h2>
      </Up>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TARGETS.map((t, i) => (
          <Up key={t.name} delay={i * 0.07}>
            <div className="group h-full rounded-2xl border border-white/10 bg-[#0c1220]/60 p-6 transition-colors duration-300 hover:border-[#f4b860]/40">
              <p className={cn("text-[10px] uppercase tracking-[0.2em] text-[#f4b860]", mono)}>{t.type}</p>
              <h3 className={cn("mt-3 text-lg leading-tight text-[#e9e4d8]", display)}>{t.name}</h3>
              <p className={cn("mt-2 text-sm leading-relaxed text-[#97a0b2]", body)}>{t.detail}</p>
            </div>
          </Up>
        ))}
      </div>
    </div>
  )
}
