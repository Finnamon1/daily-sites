import { useState } from "react"
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Shell } from "lucide-react"
import type { SiteMeta } from "../types"
import { Home } from "./pages/Home"
import { Coast } from "./pages/Coast"
import { Stay } from "./pages/Stay"
import { Notes } from "./pages/Notes"
import { Plan } from "./pages/Plan"

export const meta: SiteMeta = {
  title: "Saltmarsh — a field guide to the North Norfolk coast",
  description:
    "An independent slow-travel field guide to the North Norfolk coast: seals, reedbeds and tidal creeks. Featured interaction — scroll-triggered parallax, with hover image-reveal and magnetic CTAs.",
  date: "2026-06-23",
  type: "Travel guide",
  interaction: "Scroll-triggered parallax + hover image-reveal + magnetic buttons",
  pages: ["Home", "Coast", "Stay", "Field Notes", "Plan"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "coast", label: "Coast", end: false },
  { to: "stay", label: "Stay", end: false },
  { to: "notes", label: "Field Notes", end: false },
]

function Wordmark({ base }: { base: string }) {
  return (
    <NavLink to={base} end className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2f6b5e] text-[#f6f3ec]">
        <Shell className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <span className="font-['Fraunces'] text-xl font-semibold tracking-tight text-[#1c2321]">
        Saltmarsh
      </span>
    </NavLink>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f6f3ec] font-['DM_Sans'] text-[#1c2321] antialiased selection:bg-[#2f6b5e] selection:text-[#f6f3ec]">
      <header className="sticky top-0 z-40 border-b border-[#1c2321]/10 bg-[#f6f3ec]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark base={base} />

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `font-['DM_Sans'] text-[14px] font-medium transition-colors duration-200 ${
                    isActive ? "text-[#2f6b5e]" : "text-[#1c2321]/70 hover:text-[#1c2321]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink
              to={`${base}/plan`}
              className="rounded-full bg-[#1c2321] px-5 py-2 font-['DM_Sans'] text-[14px] font-medium text-[#f6f3ec] transition-colors duration-200 hover:bg-[#2f6b5e]"
            >
              Plan a visit
            </NavLink>
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-[#1c2321]/15 text-[#1c2321] md:hidden"
            onClick={() => setOpen((v) => !v)}
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
              className="overflow-hidden border-t border-[#1c2321]/10 md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {[...NAV, { to: "plan", label: "Plan a visit", end: false }].map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2.5 font-['DM_Sans'] text-[15px] font-medium ${
                        isActive ? "bg-[#2f6b5e]/12 text-[#2f6b5e]" : "text-[#1c2321]/75"
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

      <footer className="border-t border-[#1c2321]/10 bg-[#efe9dc] px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark base={base} />
            <p className="mt-4 max-w-xs font-['DM_Sans'] text-[14px] leading-relaxed text-[#1c2321]/70">
              An independent field guide, written on foot. Not affiliated with any
              council, trust or tourist board — just one person and a tide table.
            </p>
          </div>
          <div>
            <h4 className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#2f6b5e]">
              The coast
            </h4>
            <ul className="mt-3 space-y-1.5 font-['DM_Sans'] text-[14px] text-[#1c2321]/75">
              <li>Hunstanton to Cromer</li>
              <li>Best Nov–Jan for seals</li>
              <li>Always check the tide</li>
            </ul>
          </div>
          <div>
            <h4 className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#2f6b5e]">
              Say hello
            </h4>
            <ul className="mt-3 space-y-1.5 font-['DM_Sans'] text-[14px] text-[#1c2321]/75">
              <li>walk@saltmarsh.guide</li>
              <li>One email, never a list</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-[#1c2321]/10 pt-6 font-['DM_Sans'] text-[12px] text-[#1c2321]/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Saltmarsh. Walk softly; leave the samphire to seed.</span>
          <span>Tread the marked paths — ground-nesting birds, April to August.</span>
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
        <Route path="coast" element={<Coast />} />
        <Route path="stay" element={<Stay />} />
        <Route path="notes" element={<Notes />} />
        <Route path="plan" element={<Plan />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </motion.div>
  )
}

export default function Saltmarsh() {
  return (
    <Layout>
      <Pages />
    </Layout>
  )
}
