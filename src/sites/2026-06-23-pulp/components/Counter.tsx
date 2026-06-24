import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

/** Counts up to `value` when scrolled into view. `raw` skips thousands grouping (for years). */
export function Counter({
  value,
  suffix = "",
  raw = false,
  duration = 1400,
}: {
  value: number
  suffix?: string
  raw?: boolean
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce || value === 0) {
      setN(value)
      return
    }
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduce])

  const text = raw ? String(n) : n.toLocaleString("en-GB")
  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  )
}
