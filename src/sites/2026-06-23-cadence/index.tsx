import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Activity } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import { Home } from "./pages/Home"
import { Dashboard } from "./pages/Dashboard"
import { Pricing } from "./pages/Pricing"
import { Customers } from "./pages/Customers"

export const meta: SiteMeta = {
  title: "Cadence — Revenue intelligence for subscription teams",
  description:
    "A revenue-analytics product for indie SaaS founders: live MRR, retention and cohort signals in one quiet, precise view. Animated count-up metrics and SVG charts that draw themselves on scroll.",
  date: "2026-06-23",
  type: "Analytics dashboard",
  interaction: "Animated count-up metrics + scroll-drawn SVG charts + staggered grids",
  pages: ["Home", "Dashboard", "Pricing", "Customers"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "dashboard", label: "Dashboard", end: false },
  { to: "pricing", label: "Pricing", end: false },
  { to: "customers", label: "Customers", end: false },
]

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0c0e12] font-['IBM_Plex_Sans'] text-[#e7e9ec] antialiased selection:bg-[#f0b429] selection:text-[#0c0e12]">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0c0e12]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <NavLink
            to={base}
            end
            className="flex items-center gap-2.5 font-['Bricolage_Grotesque'] text-[19px] font-bold tracking-tight"
            onClick={() => setOpen(false)}
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f0b429] text-[#0c0e12]">
              <Activity className="h-4 w-4" strokeWidth={2.6} />
            </span>
            Cadence
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `relative font-['IBM_Plex_Sans'] text-[14px] transition-colors duration-200 ${
                    isActive ? "text-[#e7e9ec]" : "text-[#8a93a1] hover:text-[#e7e9ec]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="cadence-nav"
                        className="absolute -bottom-1.5 left-0 right-0 h-px bg-[#f0b429]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Magnetic strength={0.3}>
              <NavLink
                to={`${base}/pricing`}
                className="rounded-lg bg-[#f0b429] px-4 py-2 font-['IBM_Plex_Sans'] text-[14px] font-semibold text-[#0c0e12] transition-all duration-200 hover:shadow-[0_0_24px_-4px_rgba(240,180,41,0.6)]"
              >
                Start free
              </NavLink>
            </Magnetic>
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-[#e7e9ec] md:hidden"
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
              className="overflow-hidden border-t border-white/[0.07] md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-[15px] ${
                        isActive ? "bg-white/[0.05] text-[#f0b429]" : "text-[#8a93a1]"
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

      <footer className="border-t border-white/[0.07] bg-[#0a0c0f]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 font-['Bricolage_Grotesque'] text-lg font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f0b429] text-[#0c0e12]">
                <Activity className="h-4 w-4" strokeWidth={2.6} />
              </span>
              Cadence
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[#8a93a1]">
              Revenue intelligence built for the founder who reads their own numbers. No data team required.
            </p>
            <p className="mt-6 font-['IBM_Plex_Mono'] text-[12px] text-[#7d8696]">
              © 2026 Cadence Analytics, Inc.
            </p>
          </div>
          {[
            { h: "Product", items: ["Live MRR", "Cohorts", "Forecasting", "Alerts"] },
            { h: "Company", items: ["Customers", "Changelog", "Security", "Careers"] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#7d8696]">
                {col.h}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((it) => (
                  <li key={it}>
                    <span className="cursor-default text-[14px] text-[#8a93a1] transition-colors duration-200 hover:text-[#e7e9ec]">
                      {it}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Cadence() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Page><Home /></Page>} />
        <Route path="dashboard" element={<Page><Dashboard /></Page>} />
        <Route path="pricing" element={<Page><Pricing /></Page>} />
        <Route path="customers" element={<Page><Customers /></Page>} />
        <Route path="*" element={<Page><Home /></Page>} />
      </Routes>
    </Layout>
  )
}
