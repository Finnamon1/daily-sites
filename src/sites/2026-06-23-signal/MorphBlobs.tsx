import { useRef } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"

/**
 * The festival's signature interaction: slow morphing gradient blobs.
 * Three blurred shapes drift and reshape their border-radius on a long loop;
 * the lime one tracks the cursor with a lazy spring. Reduced motion freezes them.
 */
export function MorphBlobs({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 18, mass: 1.2 })
  const sy = useSpring(my, { stiffness: 40, damping: 18, mass: 1.2 })

  const morphA = ["42% 58% 63% 37% / 41% 44% 56% 59%", "60% 40% 38% 62% / 55% 38% 62% 45%", "42% 58% 63% 37% / 41% 44% 56% 59%"]
  const morphB = ["63% 37% 54% 46% / 49% 60% 40% 51%", "38% 62% 47% 53% / 62% 41% 59% 38%", "63% 37% 54% 46% / 49% 60% 40% 51%"]

  return (
    <div
      ref={ref}
      aria-hidden
      onMouseMove={(e) => {
        if (reduce) return
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 120)
        my.set(((e.clientY - r.top) / r.height - 0.5) * 120)
      }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* cursor-reactive lime blob */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="absolute left-[8%] top-[6%] h-[34rem] w-[34rem]"
      >
        <motion.div
          className="h-full w-full bg-[#c8f135] opacity-[0.16] blur-[90px]"
          animate={reduce ? undefined : { borderRadius: morphA }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{ borderRadius: morphA[0] }}
        />
      </motion.div>

      {/* coral blob */}
      <motion.div
        className="absolute right-[2%] top-[28%] h-[30rem] w-[30rem] bg-[#ff6b4a] opacity-[0.13] blur-[100px]"
        animate={reduce ? undefined : { borderRadius: morphB, x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ borderRadius: morphB[0] }}
      />

      {/* deep teal anchor blob */}
      <motion.div
        className="absolute bottom-[-6%] left-[34%] h-[26rem] w-[26rem] bg-[#2dd4bf] opacity-[0.10] blur-[110px]"
        animate={reduce ? undefined : { borderRadius: morphA, x: [0, 50, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{ borderRadius: morphA[1] }}
      />
    </div>
  )
}
