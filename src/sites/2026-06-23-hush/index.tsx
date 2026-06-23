import { useState } from "react"
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, EyeOff, Code2 } from "lucide-react"
import type { SiteMeta } from "../types"
import { Home } from "./pages/Home"
import { Features } from "./pages/Features"
import { Docs } from "./pages/Docs"
import { Pricing } from "./pages/Pricing"
import { Security } from "./pages/Security"

export const meta: SiteMeta = {
  title: "Hush — secrets that never touch your shell history",
  description:
    "Dev-tool docs site for Hush, a CLI secrets manager for small teams. Featured interaction: 3D card tilt, with a self-typing terminal, magnetic CTAs, and staggered scroll reveals.",
  date: "2026-06-23",
  type: "Dev-tool docs",
  interaction: "3D card tilt + self-typing terminal + magnetic CTAs",
  pages: ["Home", "Features", "Docs", "Pricing", "Security"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "features", label: "Features", end: false },
  { to: "docs", label: "Docs", end: false },
  { to: "pricing", label: "Pricing", end: false },
  { to: "security", label: "Security", end: false },
]

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-['Bricolage_Grotesque'] text-lg font-bold tracking-tight ${className ?? ""}`}>
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0c6e5d] text-[#eafaf4]">
        <EyeOff className="h-4 w-4" strokeWidth={2.4} />
      </span>
      hush
    </span>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#efece4] font-['IBM_Plex_Sans'] text-[#16181a] antialiased selection:bg-[#0c6e5d] selection:text-[#eafaf4]">
      <header className="sticky top-0 z-40 border-b border-[#17191b]/10 bg-[#efece4]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <NavLink to={base} end aria-label="Hush home">
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.slice(1).map((n) => (
              <NavLink
                key={n.label}
                to={`${base}/${n.to}`}
                end={n.end}
                className={({ isActive }) =>
                  `font-['IBM_Plex_Sans'] text-[14px] font-medium transition-colors duration-200 ${
                    isActive ? "text-[#0a5a4b]" : "text-[#17191b]/65 hover:text-[#16181a]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <span className="h-4 w-px bg-[#17191b]/15" />
            <a
              href="https://github.com"
              onClick={(e) => e.preventDefault()}
              className="text-[#17191b]/55 transition-colors hover:text-[#16181a]"
              aria-label="Source on GitHub"
            >
              <Code2 className="h-[18px] w-[18px]" />
            </a>
            <NavLink
              to={`${base}/docs`}
              className="rounded-full bg-[#0c6e5d] px-4 py-2 font-['IBM_Plex_Sans'] text-sm font-semibold text-[#eafaf4] transition-colors duration-200 hover:bg-[#0a5a4b]"
            >
              Install
            </NavLink>
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-[#17191b]/15 text-[#16181a] md:hidden"
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
              className="overflow-hidden border-t border-[#17191b]/10 md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2.5 font-['IBM_Plex_Sans'] text-[15px] font-medium ${
                        isActive ? "bg-[#0c6e5d]/10 text-[#0a5a4b]" : "text-[#17191b]/70"
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

      <footer className="border-t border-[#17191b]/10 bg-[#e7e2d7]/50 px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#17191b]/70">
              A command-line secrets manager for teams who'd rather not run another dashboard.
              Open source, zero-knowledge, and quietly boring on purpose.
            </p>
          </div>
          <div>
            <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-[#17191b]/70">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#17191b]/75">
              <li>Features</li>
              <li>Quickstart</li>
              <li>Pricing</li>
              <li>Changelog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-[#17191b]/70">Project</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#17191b]/75">
              <li>github.com/hush-dev/hush</li>
              <li>Apache-2.0 licensed</li>
              <li>hello@hush.dev</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-[#17191b]/10 pt-6 text-xs text-[#17191b]/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Hush. A small, independent tools company.</span>
          <span className="font-['IBM_Plex_Mono']">No telemetry · We can't see your secrets, by design</span>
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
        <Route path="features" element={<Features />} />
        <Route path="docs" element={<Docs />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="security" element={<Security />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </motion.div>
  )
}

export default function Hush() {
  return (
    <Layout>
      <Pages />
    </Layout>
  )
}
