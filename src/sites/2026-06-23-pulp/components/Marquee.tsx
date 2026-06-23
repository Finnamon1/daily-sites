import { motion, useReducedMotion } from "framer-motion"
import { Fragment, type ReactNode } from "react"

/** Infinite horizontal marquee. Pauses for reduced-motion users (renders one static row). */
export function Marquee({
  items,
  speed = 26,
  className,
  sep,
}: {
  items: ReactNode[]
  speed?: number
  className?: string
  sep?: ReactNode
}) {
  const reduce = useReducedMotion()
  const Row = ({ aria }: { aria?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={aria ? undefined : true}>
      {items.map((it, i) => (
        <Fragment key={i}>
          <span className="px-7">{it}</span>
          {sep ?? <span className="opacity-40">—</span>}
        </Fragment>
      ))}
    </div>
  )

  if (reduce) {
    return (
      <div className={className}>
        <div className="flex justify-center overflow-hidden">
          <Row />
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex overflow-hidden">
        <motion.div
          className="flex shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        >
          <Row />
          <Row aria />
        </motion.div>
      </div>
    </div>
  )
}
