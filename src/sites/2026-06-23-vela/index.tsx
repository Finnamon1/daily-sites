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
import { Programs } from "./pages/Programs"
import { SkyTonight } from "./pages/SkyTonight"
import { Visit } from "./pages/Visit"

export const meta: SiteMeta = {
  title: "Vela Field Observatory — the darkest sky on Earth",
  description:
    "A public observatory and dark-sky sanctuary in the Atacama Desert. Featured interaction: a hand-built canvas starfield with parallax drift and cursor-drawn constellation filaments, plus animated counters and scroll reveals.",
  date: "2026-06-23",
  type: "Observatory / experience",
  interaction:
    "Cursor-drawn constellation starfield (canvas, parallax) + animated counters + scroll reveals + magnetic CTAs",
  pages: ["Home", "Programs", "Sky Tonight", "Visit"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "programs", label: "Programs", end: false },
  { to: "sky", label: "Sky Tonight", end: false },
  { to: "visit", label: "Visit", end: false },
]

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#070a12] font-['Space_Grotesk'] text-[#e9e4d8] antialiased selection:bg-[#f4b860] selection:text-[#0a0a0a]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070a12]/70 backdrop-blur-md">
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
                    "relative text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200",
                    mono,
                    isActive ? "text-[#f4b860]" : "text-[#e9e4d8]/55 hover:text-[#e9e4d8]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="vela-nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-px bg-[#f4b860]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            className="text-[#e9e4d8] md:hidden"
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
              className="overflow-hidden border-t border-white/10 md:hidden"
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
                        "py-2 text-xs uppercase tracking-[0.2em]",
                        mono,
                        isActive ? "text-[#f4b860]" : "text-[#e9e4d8]/70",
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

export default function Vela() {
  const location = useLocation()

  // scroll to top on page change within the site
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [location.pathname])

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<Page><Home /></Page>} />
          <Route path="programs" element={<Page><Programs /></Page>} />
          <Route path="sky" element={<Page><SkyTonight /></Page>} />
          <Route path="visit" element={<Page><Visit /></Page>} />
          <Route path="*" element={<Page><Home /></Page>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
