import { useState, type ReactNode } from "react"
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Menu, X } from "lucide-react"
import type { SiteMeta } from "../types"
import { C } from "./theme"
import { Magnetic } from "@/components/fx/Magnetic"
import { Home } from "./pages/Home"
import { Ritual } from "./pages/Ritual"
import { Spaces } from "./pages/Spaces"
import { Booking } from "./pages/Booking"
import { Visit } from "./pages/Visit"

export const meta: SiteMeta = {
  title: "Birch House — a bathhouse for the long winter",
  description:
    "A wood-fired sauna and cold-plunge bathhouse in an old Portland ice house. Featured interaction: an animated, multi-step booking flow — session → date → time → confirm — with a live summary, plus a warm/cold temperature language, scroll reveals and magnetic CTAs.",
  date: "2026-06-23",
  type: "Booking flow",
  interaction: "Animated multi-step booking flow (session → date → time → confirm) + live summary",
  pages: ["Home", "Ritual", "Spaces", "Booking", "Visit"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "ritual", label: "The Ritual", end: false },
  { to: "spaces", label: "Spaces", end: false },
  { to: "visit", label: "Visit", end: false },
]

/** The wordmark: an ember dot over a calm serif. */
function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="flex items-baseline gap-2 font-['Spectral'] text-[19px] font-medium tracking-tight" style={{ color: onDark ? C.bone : C.ink }}>
      <span aria-hidden className="mb-[3px] h-[7px] w-[7px] rounded-full" style={{ background: C.ember }} />
      Birch&nbsp;House
    </span>
  )
}

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen font-['Hanken_Grotesk'] antialiased" style={{ background: C.bone, color: C.ink }}>
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ borderColor: C.line, background: "rgba(244,238,228,0.82)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to={base} end aria-label="Birch House home">
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className="group relative font-['Hanken_Grotesk'] text-[14px] font-medium transition-colors duration-200"
                style={({ isActive }) => ({ color: isActive ? C.ink : C.inkSoft })}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-1.5 left-0 h-px origin-left transition-transform duration-300 group-hover:scale-x-100"
                      style={{ width: "100%", background: C.ember, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <Magnetic strength={0.35}>
              <NavLink
                to={`${base}/booking`}
                className="inline-block rounded-full px-5 py-2 font-['Hanken_Grotesk'] text-[14px] font-semibold transition-transform duration-200"
                style={{ background: C.ember, color: "#fbf3e9" }}
              >
                Book a soak
              </NavLink>
            </Magnetic>
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border md:hidden"
            style={{ borderColor: C.line, color: C.ink }}
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
              className="overflow-hidden border-t md:hidden"
              style={{ borderColor: C.line }}
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {[...NAV, { to: "booking", label: "Book a soak", end: false }].map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 font-['Hanken_Grotesk'] text-[15px] font-medium"
                    style={({ isActive }) => ({ color: isActive ? C.emberText : C.inkSoft, background: isActive ? "rgba(168,63,29,0.06)" : "transparent" })}
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

      <Footer base={base} />
    </div>
    </MotionConfig>
  )
}

function Footer({ base }: { base: string }) {
  return (
    <footer className="border-t" style={{ borderColor: C.line, background: C.boneSoft }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs font-['Spectral'] text-[17px] italic leading-relaxed" style={{ color: C.inkSoft }}>
            Heat, cold, and the quiet in between. A bathhouse for the long Portland winter.
          </p>
          <p className="mt-6 font-['IBM_Plex_Mono'] text-[12px] leading-relaxed" style={{ color: C.inkSoft }}>
            114 SE Alder St
            <br />
            Portland, Oregon
          </p>
        </div>

        <FootCol title="Visit">
          <FootLink base={base} to="ritual">The Ritual</FootLink>
          <FootLink base={base} to="spaces">Spaces</FootLink>
          <FootLink base={base} to="visit">Hours & Location</FootLink>
          <FootLink base={base} to="booking">Book a soak</FootLink>
        </FootCol>

        <FootCol title="Hours">
          <p className="font-['Hanken_Grotesk'] text-[14px]" style={{ color: C.inkSoft }}>Tue – Sun · 7am – 10pm</p>
          <p className="font-['Hanken_Grotesk'] text-[14px]" style={{ color: C.inkSoft }}>Closed Mondays</p>
          <p className="mt-3 font-['Hanken_Grotesk'] text-[14px]" style={{ color: C.inkSoft }}>hello@birchhouse.bath</p>
          <p className="font-['Hanken_Grotesk'] text-[14px]" style={{ color: C.inkSoft }}>(503) 555-0142</p>
        </FootCol>
      </div>
      <div className="border-t" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-5 font-['IBM_Plex_Mono'] text-[11.5px] uppercase tracking-[0.16em] md:flex-row md:items-center" style={{ color: C.inkSoft }}>
          <span>© {new Date().getFullYear()} Birch House Bathhouse</span>
          <span>Built for the daily-sites gallery</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.22em]" style={{ color: C.emberText }}>{title}</h4>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function FootLink({ base, to, children }: { base: string; to: string; children: ReactNode }) {
  return (
    <NavLink to={`${base}/${to}`} className="w-fit font-['Hanken_Grotesk'] text-[14px] underline-offset-4 transition-colors duration-200 hover:underline" style={{ color: C.inkSoft }}>
      {children}
    </NavLink>
  )
}

/** Page-transition wrapper: keyed on pathname for fade + rise on every nav. */
function Page({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function BirchHouse() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Page><Home /></Page>} />
        <Route path="ritual" element={<Page><Ritual /></Page>} />
        <Route path="spaces" element={<Page><Spaces /></Page>} />
        <Route path="booking" element={<Page><Booking /></Page>} />
        <Route path="visit" element={<Page><Visit /></Page>} />
        <Route path="*" element={<Page><Home /></Page>} />
      </Routes>
    </Layout>
  )
}
