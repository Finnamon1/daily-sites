import { type ReactNode, useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
import { animate, useInView, useReducedMotion } from "framer-motion"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"

type Variant = "solid" | "outline"

/** Magnetic CTA. Renders a NavLink when `to` is set, else a button — never
    nests one interactive element in another. */
export function CTA({
  children,
  to,
  variant = "solid",
  className,
  onClick,
}: {
  children: ReactNode
  to?: string
  variant?: Variant
  className?: string
  onClick?: () => void
}) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-all duration-200",
    variant === "solid"
      ? "bg-[#1c2b23] text-[#f3f5ef] hover:bg-[#10180f]"
      : "border border-[#1c2b23]/25 text-[#1c2b23] hover:border-[#1c2b23]/60 hover:bg-[#1c2b23]/[0.03]",
    className,
  )
  return (
    <Magnetic strength={0.35}>
      {to ? (
        <NavLink to={to} className={styles}>
          {children}
        </NavLink>
      ) : (
        <button type="button" onClick={onClick} className={styles}>
          {children}
        </button>
      )}
    </Magnetic>
  )
}

/** Eyebrow label with a leading tick. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.22em] text-[#46554c]">
      <span className="h-px w-6 bg-[#e7613a]" />
      {children}
    </span>
  )
}

/** Count-up number that runs once on enter. */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} className="font-['IBM_Plex_Mono'] tabular-nums">
      {prefix}
      {val.toLocaleString("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
