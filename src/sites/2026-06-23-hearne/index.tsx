import { useEffect, useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SiteMeta } from "../types"
import { Cta, Footer, Wordmark, mono } from "./shared"
import { Home } from "./pages/Home"
import { Projects } from "./pages/Projects"
import { Studio } from "./pages/Studio"
import { Contact } from "./pages/Contact"
import { Link } from "react-router-dom"

export const meta: SiteMeta = {
  title: "Hearne — heritage renovation studio, Melbourne",
  description:
    "A small Brunswick studio that restores the inner north's terraces, cottages and warehouses. Featured interaction: a draggable before/after comparison slider that wipes between a room as it was and as it is now, plus magnetic CTAs, scroll reveals and animated counters.",
  date: "2026-06-23",
  type: "Architecture / renovation studio",
  interaction:
    "Draggable before/after comparison slider (pointer + keyboard) + magnetic CTAs + scroll reveals + animated counters",
  pages: ["Home", "Projects", "Studio", "Contact"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "projects", label: "Projects", end: false },
  { to: "studio", label: "Studio", end: false },
  { to: "contact", label: "Contact", end: false },
]

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen scroll-smooth bg-[#f4efe6] font-['Hanken_Grotesk'] text-[#211d18] antialiased selection:bg-[#b14a2f] selection:text-[#f4efe6]">
      <header className="sticky top-0 z-50 border-b border-[#211d18]/10 bg-[#f4efe6]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <NavLink to={base} end aria-label="Hearne home">
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
                    "relative text-[12px] uppercase tracking-[0.16em] transition-colors duration-200",
                    mono,
                    isActive
                      ? "text-[#211d18]"
                      : "text-[#6c6358] hover:text-[#211d18]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="hearne-nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-px bg-[#b14a2f]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link to={`${base}/contact`}>
              <Cta className="px-5 py-2 text-[13px]">Start a project</Cta>
            </Link>
          </div>

          <button
            className="text-[#211d18] md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#211d18]/10 md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2.5 text-[13px] uppercase tracking-[0.16em] transition-colors",
                        mono,
                        isActive
                          ? "bg-[#ece4d6] text-[#211d18]"
                          : "text-[#6c6358]",
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

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="studio" element={<Studio />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function HearneSite() {
  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  )
}
