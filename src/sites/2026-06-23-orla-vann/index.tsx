import { useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import type { SiteMeta } from "../types"
import { Footer, Wordmark } from "./shared"
import { Home } from "./pages/Home"
import { Music } from "./pages/Music"
import { Tour } from "./pages/Tour"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"

export const meta: SiteMeta = {
  title: "Orla Vann — modular ambient, recorded to tape",
  description:
    "Artist site for Orla Vann, a Danish modular-synth composer, built around her new album Glasswork. Featured interaction: scroll-snap full-viewport transitions with a hand-built, live oscilloscope trace.",
  date: "2026-06-23",
  type: "Artist / music page",
  interaction: "Scroll-snap section transitions + live oscilloscope waveform + magnetic play",
  pages: ["Home", "Music", "Tour", "About", "Contact"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "music", label: "Music", end: false },
  { to: "tour", label: "Tour", end: false },
  { to: "about", label: "About", end: false },
  { to: "contact", label: "Contact", end: false },
]

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const location = useLocation()
  const isHome = location.pathname === base || location.pathname === `${base}/`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0c10] font-['Hanken_Grotesk'] text-[#e9ebe6] antialiased selection:bg-[#c5f24c] selection:text-[#0a0c10]">
      {/* fixed nav — persistent on every page */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0c10]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 pl-24">
          <NavLink to={base} end onClick={() => setOpen(false)}>
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `relative font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-200 ${
                    isActive ? "text-[#c5f24c]" : "text-[#e9ebe6]/60 hover:text-[#e9ebe6]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="ov-nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#c5f24c]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            className="md:hidden text-[#e9ebe6]"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
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
                      `py-2 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.22em] ${
                        isActive ? "text-[#c5f24c]" : "text-[#e9ebe6]/70"
                      }`
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

      {children}

      {/* Home supplies its own footer as the final snap panel */}
      {!isHome && <Footer />}
    </div>
  )
}

export default function OrlaVann() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="music" element={<Music />} />
        <Route path="tour" element={<Tour />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
