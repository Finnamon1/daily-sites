import { useState } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { AnimatePresence, motion, MotionConfig } from "framer-motion"
import { Menu, X, Equal } from "lucide-react"
import type { SiteMeta } from "../types"
import { CTA } from "./components/shared"
import { Home } from "./pages/Home"
import { Features } from "./pages/Features"
import { Pricing } from "./pages/Pricing"
import { Security } from "./pages/Security"
import { About } from "./pages/About"

export const meta: SiteMeta = {
  title: "Evenly — the flat ledger that settles itself",
  description:
    "App-marketing site for Evenly, a calm shared-money app for households. Featured interaction: a scroll-scrubbed phone mockup whose screen scrubs through app views as you read the steps, plus magnetic CTAs and animated counters.",
  date: "2026-06-23",
  type: "App marketing",
  interaction: "Scroll-scrubbed phone mockup (screen scrubs through app views) + magnetic CTAs + animated counters",
  pages: ["Home", "Features", "Pricing", "Security", "About"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "features", label: "Features", end: false },
  { to: "pricing", label: "Pricing", end: false },
  { to: "security", label: "Security", end: false },
  { to: "about", label: "About", end: false },
]

function Wordmark({ base }: { base: string }) {
  return (
    <NavLink
      to={base}
      end
      className="flex items-center gap-2 font-['Fraunces'] text-[20px] font-semibold tracking-tight text-[#1c2b23]"
    >
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1c2b23] text-[#f3f5ef]">
        <Equal className="h-4 w-4" strokeWidth={2.6} />
      </span>
      Evenly
    </NavLink>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#eef1ea] font-['Hanken_Grotesk'] text-[#1c2b23] antialiased selection:bg-[#e7613a] selection:text-[#1c2b23]">
      <header className="sticky top-0 z-50 border-b border-[#1c2b23]/10 bg-[#eef1ea]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark base={base} />

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `text-[14px] transition-colors duration-200 ${
                    isActive
                      ? "text-[#1c2b23]"
                      : "text-[#46554c] hover:text-[#1c2b23]"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="evenly-nav"
                        className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-[#e7613a]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <CTA to={`${base}/pricing`} className="px-5 py-2.5">
              Get the app
            </CTA>
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#1c2b23]/15 text-[#1c2b23] md:hidden"
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
              className="overflow-hidden border-t border-[#1c2b23]/10 md:hidden"
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
                        isActive ? "bg-white text-[#1c2b23]" : "text-[#46554c]"
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
                <NavLink
                  to={`${base}/pricing`}
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-[#1c2b23] px-3 py-2.5 text-center text-[15px] font-semibold text-[#f3f5ef]"
                >
                  Get the app
                </NavLink>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#1c2b23]/10 bg-[#e3e8de]/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark base={base} />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[#46554c]">
              Shared money for people who live together and would rather not talk about it.
            </p>
          </div>
          <div>
            <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#46554c]">
              Product
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[14px] text-[#3c4a42]">
              {NAV.slice(1).map((n) => (
                <li key={n.label}>
                  <NavLink to={`${base}/${n.to}`} className="hover:text-[#1c2b23]">
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#46554c]">
              Download
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[14px] text-[#3c4a42]">
              <li><a href="#" className="hover:text-[#1c2b23]">App Store</a></li>
              <li><a href="#" className="hover:text-[#1c2b23]">Google Play</a></li>
              <li><a href="#" className="hover:text-[#1c2b23]">Open web app</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-[#1c2b23]/10 px-6 py-6 text-[12px] text-[#46554c] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Evenly. Made by two people in Bristol.</p>
          <p className="font-['IBM_Plex_Mono']">No bank login. No ads. No nagging.</p>
        </div>
      </footer>
    </div>
  )
}

function Pages() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Routes location={location}>
          <Route index element={<Home base={base} />} />
          <Route path="features" element={<Features base={base} />} />
          <Route path="pricing" element={<Pricing base={base} />} />
          <Route path="security" element={<Security base={base} />} />
          <Route path="about" element={<About base={base} />} />
          <Route path="*" element={<Home base={base} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Evenly() {
  return (
    <MotionConfig reducedMotion="user">
      <Layout>
        <Pages />
      </Layout>
    </MotionConfig>
  )
}
