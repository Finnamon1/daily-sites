import { motion, useReducedMotion } from "framer-motion"

/**
 * A crafted "now playing" waveform — vertical bars that breathe.
 * Deterministic heights (seeded from index) so it never reflows on re-render.
 */
export function Waveform({
  bars = 48,
  playing = true,
  className = "",
  color = "#e8b15c",
}: {
  bars?: number
  playing?: boolean
  className?: string
  color?: string
}) {
  const reduce = useReducedMotion()
  const heights = Array.from({ length: bars }, (_, i) => {
    // smooth pseudo-random envelope: two overlapping sines + a center swell
    const a = Math.sin(i * 0.55) * 0.5 + 0.5
    const b = Math.sin(i * 0.21 + 1.3) * 0.5 + 0.5
    const center = 1 - Math.abs(i / (bars - 1) - 0.5) * 1.4
    return Math.max(0.12, (a * 0.55 + b * 0.45) * Math.max(0.25, center))
  })

  return (
    <div
      className={`flex items-center gap-[3px] ${className}`}
      role="img"
      aria-label="Audio waveform"
    >
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color, height: `${Math.round(h * 100)}%` }}
          initial={false}
          animate={
            reduce || !playing
              ? { scaleY: h }
              : { scaleY: [h, Math.min(1, h * 1.35 + 0.1), h * 0.7, h] }
          }
          transition={
            reduce || !playing
              ? { duration: 0 }
              : {
                  duration: 1.4 + (i % 5) * 0.18,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 7) * 0.06,
                }
          }
        />
      ))}
    </div>
  )
}
