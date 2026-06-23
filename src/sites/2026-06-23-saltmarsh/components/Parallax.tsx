import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Featured interaction — scroll-triggered parallax.
 * The image sits in an overflow-cropped frame and drifts vertically as the
 * frame passes through the viewport. Held at scale 1.18 so the drift never
 * exposes an edge. Fully disabled under prefers-reduced-motion.
 */
export function ParallaxImage({
  src,
  alt,
  ratio = "aspect-[3/2]",
  className,
  distance = 12,
  duotone = true,
}: {
  src: string
  alt: string
  ratio?: string
  className?: string
  distance?: number
  duotone?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : [`-${distance}%`, `${distance}%`],
  )

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-[#e7e1d4]", ratio, className)}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale: reduce ? 1 : 1.18 }}
        className="absolute inset-0 h-full w-full object-cover grayscale-[18%]"
      />
      {duotone && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#13322d]/45 via-[#13322d]/5 to-transparent mix-blend-multiply"
        />
      )}
    </div>
  )
}

/** Lightweight content parallax — drifts any node as it scrolls. */
export function ParallaxShift({
  children,
  distance = 40,
  className,
}: {
  children: ReactNode
  distance?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance])
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
