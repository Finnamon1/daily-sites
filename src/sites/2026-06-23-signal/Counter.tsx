import { useEffect, useRef } from "react"
import { useInView, useReducedMotion, animate } from "framer-motion"

/** Counts up from 0 to `to` when scrolled into view. Snaps instantly under reduced motion. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.4,
}: {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!inView) return
    if (reduce) {
      node.textContent = `${prefix}${to.toLocaleString()}${suffix}`
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, to, suffix, prefix, duration, reduce])

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>
}
