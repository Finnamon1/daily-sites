import { useEffect, useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SiteMeta } from "../types"
import { Footer, Wordmark, mono } from "./shared"
import { Home } from "./pages/Home"
import { RoutesPage } from "./pages/RoutesPage"
import { Onboard } from "./pages/Onboard"
import { Fares } from "./pages/Fares"

export const meta: SiteMeta = {
  title: "Vesper Rail — overnight sleeper trains across Europe",
  description:
    "A revived night-train company that runs sleeper services the long way round Europe. Featured interaction: a hand-built split-flap (Solari) departures board that flips through destinations and re-shuffles like a real station board, plus magnetic CTAs, animated counters, a scroll-drawn route map and scroll reveals.",
  date: "2026-06-23",
  type: "Travel / transport brand",
  interaction:
    "Hand-built split-flap (Solari) departures board (auto re-shuffling) + scroll-drawn route map + animated counters + magnetic CTAs + scroll reveals",
  pages: ["Home", "Routes", "Onboard", "Fares"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "routes", label: "Routes", end: false },
  { to: "onboard", label: "Onboard", end: false },
  { to: "fares", label: "Fares", end: false },
]

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f3ede1] font-['Spectral'] text-[#14202b] antialiased selection:bg-[#bf3a1c] selection:text-[#f3ede1]">
      <header className="sticky top-0 z-50 border-b border-[#14202b]/10 bg-[#f3ede1]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <NavLink to={base} end onClick={() => setOpen(false)}>
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "relative pb-1 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-200",
                    mono,
                    isActive ? "text-[#bf3a1c]" : "text-[#14202b]/55 hover:text-[#14202b]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="vesper-nav-underline"
                        className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#bf3a1c]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <NavLink
              to={`${base}/fares`}
              className={cn(
                "rounded-full bg-[#14202b] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3ede1] transition-colors duration-200 hover:bg-[#bf3a1c]",
                mono,
              )}
            >
              Book a berth
            </NavLink>
          </nav>

          <button
            className="text-[#14202b] md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#14202b]/10 md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "py-2 text-xs uppercase tracking-[0.22em]",
                        mono,
                        isActive ? "text-[#bf3a1c]" : "text-[#14202b]/70",
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>
      <Footer />
    </div>
  )
}

function Page({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -10 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Vesper() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [location.pathname])

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<Page><Home /></Page>} />
          <Route path="routes" element={<Page><RoutesPage /></Page>} />
          <Route path="onboard" element={<Page><Onboard /></Page>} />
          <Route path="fares" element={<Page><Fares /></Page>} />
          <Route path="*" element={<Page><Home /></Page>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
