import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Radio } from "lucide-react"
import type { SiteMeta } from "../types"
import { Home } from "./pages/Home"
import { Lineup } from "./pages/Lineup"
import { Schedule } from "./pages/Schedule"
import { Tickets } from "./pages/Tickets"
import { Venue } from "./pages/Venue"

export const meta: SiteMeta = {
  title: "SIGNAL — a night of generative art & sound",
  description:
    "One-night festival of live coding, modular sound and generative visuals in a Lisbon cistern. Morphing cursor-reactive blobs, animated counters, staggered lineup grid.",
  date: "2026-06-23",
  type: "Event / conference",
  interaction: "Cursor-reactive morphing blobs + animated counters + staggered grid",
  pages: ["Home", "Lineup", "Schedule", "Tickets", "Venue"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "lineup", label: "Lineup", end: false },
  { to: "schedule", label: "Schedule", end: false },
  { to: "venue", label: "Venue", end: false },
]

function Layout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0b0e] font-['Hanken_Grotesk'] text-[#f3f4ef] antialiased selection:bg-[#c8f135] selection:text-[#0a0b0e]">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0b0e]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to={base} end className="flex items-center gap-2 font-['Space_Grotesk'] text-lg font-bold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-sm bg-[#c8f135] text-[#0a0b0e]">
              <Radio className="h-4 w-4" strokeWidth={2.4} />
            </span>
            SIGNAL
            <span className="ml-1 font-['JetBrains_Mono'] text-[11px] font-normal text-[#8b9087]">'26</span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `font-['JetBrains_Mono'] text-[13px] uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? "text-[#c8f135]" : "text-[#a3a8a0] hover:text-[#f3f4ef]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink
              to={`${base}/tickets`}
              className="rounded-full bg-[#c8f135] px-5 py-2 font-['Space_Grotesk'] text-sm font-semibold text-[#0a0b0e] transition-transform duration-200 hover:scale-[1.03]"
            >
              Get tickets
            </NavLink>
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-[#f3f4ef] md:hidden"
            onClick={() => setOpen((v) => !v)}
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
              <div className="flex flex-col gap-1 px-6 py-4">
                {[...NAV, { to: "tickets", label: "Tickets", end: false }].map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2 font-['JetBrains_Mono'] text-sm uppercase tracking-wider ${
                        isActive ? "bg-white/5 text-[#c8f135]" : "text-[#a3a8a0]"
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

      <main>{children}</main>

      {/* footer */}
      <footer className="border-t border-white/10 px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-['Space_Grotesk'] text-lg font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-sm bg-[#c8f135] text-[#0a0b0e]">
                <Radio className="h-4 w-4" strokeWidth={2.4} />
              </span>
              SIGNAL
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#a3a8a0]">
              One night. One room below the city. Sound and image, made in front of you and gone by morning.
            </p>
          </div>
          <div>
            <h4 className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-widest text-[#8b9087]">Where</h4>
            <p className="mt-3 text-sm leading-relaxed text-[#cfd3ca]">
              The Mãe d'Água Cistern<br />
              Praça das Amoreiras, Lisbon<br />
              Sat 19 September 2026 · 16:00–late
            </p>
          </div>
          <div>
            <h4 className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-widest text-[#8b9087]">Stay close</h4>
            <p className="mt-3 text-sm leading-relaxed text-[#cfd3ca]">
              hello@signal.fm<br />
              @signal.fm — the only feed we keep
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#8b9087] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 SIGNAL Collective · A non-profit gathering, run at cost.</span>
          <span className="font-['JetBrains_Mono']">Capacity 220 · No photos during sets</span>
        </div>
      </footer>
    </div>
  )
}

function Pages() {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Routes>
        <Route index element={<Home />} />
        <Route path="lineup" element={<Lineup />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="venue" element={<Venue />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </motion.div>
  )
}

export default function Signal() {
  return (
    <Layout>
      <Pages />
    </Layout>
  )
}
