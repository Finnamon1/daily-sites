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
import { CONTRIBUTORS, Label, Marquee } from "./shared"
import { Home } from "./pages/Home"
import { Stories } from "./pages/Stories"
import { Issue } from "./pages/Issue"
import { Subscribe } from "./pages/Subscribe"
import { About } from "./pages/About"

export const meta: SiteMeta = {
  title: "OFFCUT — a quarterly magazine about making things by hand",
  description:
    "An independent print magazine on craft, material and the people who can't stop making. Featured interaction: a buttery infinite contributor marquee, with scroll reveals, hover image-reveal story cards, and animated subscriber counters.",
  date: "2026-06-23",
  type: "Editorial magazine",
  interaction: "Infinite marquee + scroll reveals + hover image-reveal + animated counters",
  pages: ["Home", "Stories", "Issue 14", "Subscribe", "About"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "stories", label: "Stories", end: false },
  { to: "issue", label: "Issue 14", end: false },
  { to: "subscribe", label: "Subscribe", end: false },
  { to: "about", label: "About", end: false },
]

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-['Fraunces'] text-2xl font-semibold tracking-[-0.03em] ${className}`}>
      OFF<span className="text-[#c1351c]">CUT</span>
    </span>
  )
}

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f2ede1] font-['DM_Sans'] text-[#191510] antialiased selection:bg-[#c1351c] selection:text-[#f2ede1]">
      {/* top hairline ticker */}
      <div className="border-b border-[#191510]/15 bg-[#191510] text-[#f2ede1]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-1.5">
          <Label className="text-[#f2ede1]/80">Issue 14 — The Grain · Summer 2026</Label>
          <Label className="hidden text-[#f2ede1]/72 sm:inline">Print + digital · 4× a year</Label>
        </div>
      </div>

      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-[#191510]/15 bg-[#f2ede1]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <NavLink to={base} end onClick={() => setOpen(false)}>
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `relative font-['IBM_Plex_Mono'] text-[12px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 ${
                    isActive ? "text-[#c1351c]" : "text-[#191510]/70 hover:text-[#191510]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="offcut-nav"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#c1351c]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-sm border border-[#191510]/20 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#191510]/10 md:hidden"
            >
              <div className="flex flex-col px-5 py-3">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `border-b border-[#191510]/10 py-3 font-['IBM_Plex_Mono'] text-[13px] uppercase tracking-[0.18em] ${
                        isActive ? "text-[#c1351c]" : "text-[#191510]/80"
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
      <footer className="mt-24 border-t border-[#191510]/15 bg-[#191510] text-[#f2ede1]">
        <Marquee items={CONTRIBUTORS} speed={45} className="border-b border-[#f2ede1]/10 text-[#f2ede1]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-[#f2ede1]" />
            <p className="mt-4 max-w-xs font-['DM_Sans'] text-[15px] leading-relaxed text-[#f2ede1]/70">
              A quarterly about the things people make by hand — and the stubborn,
              ink-stained, sawdust-covered people who can't stop making them.
            </p>
          </div>
          <div>
            <Label className="text-[#f2ede1]/72">Sections</Label>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.label}>
                  <NavLink
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    className="font-['DM_Sans'] text-[15px] text-[#f2ede1]/80 transition-colors hover:text-[#c1351c]"
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label className="text-[#f2ede1]/72">The press</Label>
            <p className="mt-4 font-['DM_Sans'] text-[15px] leading-relaxed text-[#f2ede1]/70">
              Printed on a Heidelberg in Margate.<br />
              Bound by hand. Posted in brown paper.
            </p>
            <p className="mt-4 font-['DM_Sans'] text-[15px] text-[#f2ede1]/70">post@offcut.press</p>
          </div>
        </div>
        <div className="border-t border-[#f2ede1]/10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-5 py-5 sm:flex-row sm:items-center">
            <Label className="text-[#f2ede1]/60">© 2026 OFFCUT Press — set in Fraunces & DM Sans</Label>
            <Label className="text-[#f2ede1]/60">Made with offcuts</Label>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Offcut() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Page><Home /></Page>} />
        <Route path="stories" element={<Page><Stories /></Page>} />
        <Route path="issue" element={<Page><Issue /></Page>} />
        <Route path="subscribe" element={<Page><Subscribe /></Page>} />
        <Route path="about" element={<Page><About /></Page>} />
        <Route path="*" element={<Page><Home /></Page>} />
      </Routes>
    </Layout>
  )
}
