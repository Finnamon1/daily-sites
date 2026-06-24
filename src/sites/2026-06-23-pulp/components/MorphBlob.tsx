import { motion, useReducedMotion } from "framer-motion"

/**
 * Featured interaction: an organic shape that slowly morphs its silhouette by
 * animating border-radius between a set of asymmetric values, with a lazy
 * rotation underneath. Morphing runs on its own (not gated on hover), so it's
 * fully alive on touch. Respects prefers-reduced-motion.
 */
const SHAPES = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "63% 37% 38% 62% / 49% 60% 40% 51%",
  "38% 62% 55% 45% / 58% 37% 63% 42%",
  "55% 45% 40% 60% / 42% 56% 44% 58%",
]

export function MorphBlob({
  from,
  to,
  className,
  duration = 14,
  delay = 0,
}: {
  from: string
  to: string
  className?: string
  duration?: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{
        backgroundImage: `linear-gradient(140deg, ${from}, ${to})`,
        borderRadius: SHAPES[0],
      }}
      animate={
        reduce
          ? { borderRadius: SHAPES[0] }
          : { borderRadius: [...SHAPES, SHAPES[0]], rotate: [0, 8, -6, 4, 0] }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}
