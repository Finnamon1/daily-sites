import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"

/** Inner-page shell: clears the fixed nav and fades/rises on route change. */
export function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="px-5 pt-28 pb-24"
    >
      {children}
    </motion.main>
  )
}
