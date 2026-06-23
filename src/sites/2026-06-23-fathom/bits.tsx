import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { C } from "./theme"

/** Keyframes for the waveform shimmer + on-air pulse. Mount once in Layout. */
export function FathomStyles() {
  return (
    <style>{`
      @keyframes fathom-shimmer {
        0%, 100% { transform: scaleY(0.78); opacity: 0.82; }
        50%      { transform: scaleY(1.12); opacity: 1; }
      }
      [data-shimmer] {
        transform-origin: center;
        animation: fathom-shimmer 1.4s ease-in-out infinite;
      }
      @keyframes fathom-onair {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.35; }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-shimmer], .fathom-onair-dot { animation: none !important; }
      }
    `}</style>
  )
}

/** A small "ON AIR" style kicker over section headings. */
export function Kicker({ children, on = "dark" }: { children: React.ReactNode; on?: "dark" | "paper" }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.28em]"
      style={{ color: on === "dark" ? C.signal : C.signalInk }}
    >
      <span
        className="fathom-onair-dot inline-block h-[7px] w-[7px] rounded-full"
        style={{ background: on === "dark" ? C.signal : C.signalInk, animation: "fathom-onair 1.8s ease-in-out infinite" }}
      />
      {children}
    </span>
  )
}

/** Count up to a value when scrolled into view. Handles decimals (e.g. 1.4). */
export function Counter({
  value,
  suffix = "",
  duration = 1400,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [n, setN] = useState(0)
  const decimals = value % 1 !== 0 ? 1 : 0

  useEffect(() => {
    if (!inView) return
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setN(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  )
}
