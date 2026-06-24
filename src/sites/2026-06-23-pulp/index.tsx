import { useState, type ReactNode } from "react"
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Citrus, AtSign, Mail } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import { Home } from "./pages/Home"
import { Flavors } from "./pages/Flavors"
import { Story } from "./pages/Story"
import { Stockists } from "./pages/Stockists"
import { Contact } from "./pages/Contact"

export const meta: SiteMeta = {
  title: "Pulp — Soda with a backbone",
  description:
    "A craft sparkling-citrus brand for people who find soft drinks spineless: bitter, bright, 0.0% and no refined sugar. Featured interaction — morphing organic blobs with cursor-reactive parallax, plus magnetic CTAs, tilt cards and animated counters.",
  date: "2026-06-23",
  type: "App marketing / brand",
  interaction: "Morphing organic blobs + cursor-reactive parallax",
  pages: ["Home", "Flavors", "Story", "Stockists", "Contact"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "flavors", label: "Flavors", end: false },
  { to: "story", label: "Story", end: false },
  { to: "stockists", label: "Stockists", end: false },
  { to: "contact", label: "Contact", end: false },
]

function Wordmark({ base, onClick }: { base: string; onClick?: () => void }) {
  return (
    <NavLink
      to={base}
      end
      onClick={onClick}
      className="flex items-center gap-2 font-['Syne'] text-[22px] font-extrabold tracking-tight text-[#221C15]"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E8511D] text-[#FCEAD9]">
        <Citrus className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </span>
      Pulp
    </NavLink>
  )
}

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F7F1E3] font-['Hanken_Grotesk'] text-[#221C15] antialiased selection:bg-[#E8511D] selection:text-[#FCEAD9]">
      <header className="sticky top-0 z-50 border-b border-[#221C15]/10 bg-[#F7F1E3]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark base={base} onClick={() => setOpen(false)} />

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `relative text-[15px] font-medium transition-colors duration-200 ${
                    isActive ? "text-[#221C15]" : "text-[#6B6258] hover:text-[#221C15]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="pulp-nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-[#E8511D]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Magnetic strength={0.3}>
              <NavLink
                to={`${base}/contact`}
                className="rounded-full bg-[#221C15] px-5 py-2.5 text-[14px] font-semibold text-[#F7F1E3] transition-colors duration-200 hover:bg-[#E8511D]"
              >
                Order a case
              </NavLink>
            </Magnetic>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-[#221C15]/15 text-[#221C15] md:hidden"
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
              className="overflow-hidden border-t border-[#221C15]/10 md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2.5 text-[16px] font-medium transition-colors duration-200 ${
                        isActive ? "bg-[#221C15]/[0.06] text-[#221C15]" : "text-[#6B6258]"
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
                <NavLink
                  to={`${base}/contact`}
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-xl bg-[#221C15] px-3 py-2.5 text-center text-[15px] font-semibold text-[#F7F1E3]"
                >
                  Order a case
                </NavLink>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <Footer base={base} />
    </div>
  )
}

function Footer({ base }: { base: string }) {
  return (
    <footer className="border-t border-[#221C15]/10 bg-[#EFE7D3]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark base={base} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#5A4F40]">
            Small-batch sparkling citrus, brewed in a Bermondsey railway arch.
            Bitter where it counts. 0.0% always.
          </p>
        </div>

        <div>
          <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#8A7F6E]">Wander</p>
          <ul className="mt-4 space-y-2.5">
            {NAV.slice(1).map((n) => (
              <li key={n.label}>
                <NavLink
                  to={`${base}/${n.to}`}
                  className="text-sm text-[#5A4F40] transition-colors duration-200 hover:text-[#221C15]"
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#8A7F6E]">Keep in touch</p>
          <div className="mt-4 flex gap-3">
            <a
              href="mailto:hello@drinkpulp.co"
              aria-label="Email Pulp"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#221C15]/15 text-[#221C15] transition-colors duration-200 hover:border-[#E8511D] hover:text-[#E8511D]"
            >
              <Mail className="h-[18px] w-[18px]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pulp on Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#221C15]/15 text-[#221C15] transition-colors duration-200 hover:border-[#E8511D] hover:text-[#E8511D]"
            >
              <AtSign className="h-[18px] w-[18px]" />
            </a>
          </div>
          <p className="mt-6 text-xs text-[#8A7F6E]">© {new Date().getFullYear()} Pulp Drinks Ltd.</p>
        </div>
      </div>
    </footer>
  )
}

function Page({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Pulp() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <Layout>
      <Routes>
        <Route index element={<Page><Home base={base} /></Page>} />
        <Route path="flavors" element={<Page><Flavors base={base} /></Page>} />
        <Route path="story" element={<Page><Story /></Page>} />
        <Route path="stockists" element={<Page><Stockists /></Page>} />
        <Route path="contact" element={<Page><Contact /></Page>} />
        <Route path="*" element={<Page><Home base={base} /></Page>} />
      </Routes>
    </Layout>
  )
}
