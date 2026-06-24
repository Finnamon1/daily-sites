import { motion, useReducedMotion } from "framer-motion"
import { cities, lines } from "./data"
import { mono } from "./shared"

/* A hand-built, stylised map of Europe. Each route arcs between two
   normalised points and its path draws itself in on scroll (pathLength).
   Hovering a route in the list lifts the matching arc + endpoints. */

function arc(a: [number, number], b: [number, number]) {
  const [ax, ay] = a
  const [bx, by] = b
  // control point bowed perpendicular to the chord for a gentle curve
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const bow = len * 0.22
  return `M ${ax} ${ay} Q ${mx + nx * bow} ${my + ny * bow} ${bx} ${by}`
}

export function RouteMap({ active }: { active: number | null }) {
  const reduce = useReducedMotion()
  return (
    <svg
      viewBox="0 0 100 88"
      className="h-full w-full"
      role="img"
      aria-label="Map of Vesper Rail's overnight routes across Europe"
    >
      <defs>
        <radialGradient id="vesper-glow" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#2a3645" />
          <stop offset="100%" stopColor="#14202b" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="88" rx="3" fill="url(#vesper-glow)" />

      {/* faint graticule */}
      {[18, 36, 54, 72].map((y) => (
        <line key={y} x1="2" y1={y} x2="98" y2={y} stroke="#ffffff" strokeOpacity={0.04} strokeWidth={0.2} />
      ))}
      {[20, 40, 60, 80].map((x) => (
        <line key={x} x1={x} y1="2" x2={x} y2="86" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={0.2} />
      ))}

      {/* routes */}
      {lines.map((l, i) => {
        const on = active === null || active === i
        return (
          <motion.path
            key={l.name}
            d={arc(l.a, l.b)}
            fill="none"
            stroke={active === i ? "#e2542f" : "#bf3a1c"}
            strokeWidth={active === i ? 1.1 : 0.7}
            strokeLinecap="round"
            strokeOpacity={on ? 0.95 : 0.18}
            strokeDasharray={active === i ? "0" : "1.4 1.8"}
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.15 * i, ease: "easeInOut" }}
            style={{ transition: "stroke-opacity 200ms, stroke 200ms, stroke-width 200ms" }}
          />
        )
      })}

      {/* cities */}
      {cities.map((c) => (
        <g key={c.name}>
          <circle cx={c.at[0]} cy={c.at[1]} r={1.05} fill="#f3ede1" />
          <circle cx={c.at[0]} cy={c.at[1]} r={2.2} fill="none" stroke="#f3ede1" strokeOpacity={0.25} strokeWidth={0.25} />
          <text
            x={c.at[0] + 2}
            y={c.at[1] + 0.6}
            fontSize={2.1}
            className={mono}
            fill="#cdd4df"
            style={{ letterSpacing: "0.04em" }}
          >
            {c.name}
          </text>
        </g>
      ))}
    </svg>
  )
}
