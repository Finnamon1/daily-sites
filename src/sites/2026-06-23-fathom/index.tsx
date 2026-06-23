import { useState, type ReactNode } from "react"
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Menu, Radio, X } from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { C } from "./theme"
import { FathomStyles } from "./bits"
import { Home } from "./pages/Home"
import { Episodes } from "./pages/Episodes"
import { About } from "./pages/About"
import { Listen } from "./pages/Listen"

export const meta: SiteMeta = {
  title: "FATHOM — a documentary podcast that goes deep",
  description:
    "Show page for FATHOM, a documentary podcast whose Season 3, 'Dead Air', tells the story of a pirate radio station broadcasting from a North Sea fort. Featured interaction: a hand-built waveform audio player with an animated playhead, drag/scrub-to-seek and shimmering reactive bars — plus magnetic CTAs, animated counters and scroll reveals across a late-night-radio palette.",
  date: "2026-06-23",
  type: "Podcast show",
  interaction: "Hand-built waveform audio player (animated playhead, scrub-to-seek, shimmering bars)",
  pages: ["Home", "Episodes", "About", "Listen"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "episodes", label: "Episodes", end: false },
  { to: "about", label: "About", end: false },
  { to: "listen", label: "Listen", end: false },
]

function Wordmark({ onPaper = false }: { onPaper?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 font-['Fraunces'] text-[21px] font-semibold tracking-[-0.01em]" style={{ color: onPaper ? C.paperInk : C.text }}>
      <Radio className="h-[18px] w-[18px]" style={{ color: C.signal }} aria-hidden />
      FATHOM
    </span>
  )
}

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <FathomStyles />
      <div className="min-h-screen font-['Space_Grotesk'] antialiased" style={{ background: C.ground, color: C.text }}>
        <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ borderColor: C.line, background: "rgba(11,17,28,0.82)" }}>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <NavLink to={base} end aria-label="FATHOM home">
              <Wordmark />
            </NavLink>

            <nav className="hidden items-center gap-9 md:flex">
              {NAV.map((n) => (
                <NavLink
                  key={n.label}
                  to={n.to ? `${base}/${n.to}` : base}
                  end={n.end}
                  className="group relative font-['Space_Grotesk'] text-[14px] font-medium transition-colors duration-200"
                  style={({ isActive }) => ({ color: isActive ? C.text : C.textSoft })}
                >
                  {({ isActive }) => (
                    <>
                      {n.label}
                      <span
                        aria-hidden
                        className="absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-300 group-hover:scale-x-100"
                        style={{ background: C.signal, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                      />
                    </>
                  )}
                </NavLink>
              ))}
              <Magnetic strength={0.35}>
                <NavLink
                  to={`${base}/listen`}
                  className="inline-block rounded-full px-5 py-2 font-['Space_Grotesk'] text-[14px] font-semibold transition-transform duration-200"
                  style={{ background: C.signal, color: C.ground }}
                >
                  Subscribe
                </NavLink>
              </Magnetic>
            </nav>

            <button
              className="grid h-9 w-9 place-items-center rounded-md border md:hidden"
              style={{ borderColor: C.line, color: C.text }}
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
                className="overflow-hidden border-t md:hidden"
                style={{ borderColor: C.line }}
              >
                <div className="flex flex-col gap-1 px-6 py-4">
                  {[...NAV, { to: "listen", label: "Subscribe", end: false }].map((n) => (
                    <NavLink
                      key={n.label}
                      to={n.to ? `${base}/${n.to}` : base}
                      end={n.end}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 font-['Space_Grotesk'] text-[15px] font-medium"
                      style={({ isActive }) => ({ color: isActive ? C.signal : C.textSoft, background: isActive ? "rgba(244,162,59,0.08)" : "transparent" })}
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
    <footer className="border-t" style={{ borderColor: C.line, background: C.panel }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs font-['Spectral'] text-[17px] italic leading-relaxed" style={{ color: C.textSoft }}>
            Documentaries for the dark. One strange true story a season — then silence, until the next signal.
          </p>
          <p className="mt-6 font-['JetBrains_Mono'] text-[12px] leading-relaxed" style={{ color: C.textFaint }}>
            Recorded in Felixstowe & London
          </p>
        </div>

        <FootCol title="Listen">
          <FootLink base={base} to="episodes">All episodes</FootLink>
          <FootLink base={base} to="listen">Where to listen</FootLink>
          <FootLink base={base} to="listen">Become a member</FootLink>
        </FootCol>

        <FootCol title="Show">
          <FootLink base={base} to="about">About FATHOM</FootLink>
          <FootLink base={base} to="about">The crew</FootLink>
          <p className="font-['Space_Grotesk'] text-[14px]" style={{ color: C.textSoft }}>press@fathom.fm</p>
        </FootCol>
      </div>
      <div className="border-t" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-5 font-['JetBrains_Mono'] text-[11.5px] uppercase tracking-[0.16em] md:flex-row md:items-center" style={{ color: C.textFaint }}>
          <span>© {new Date().getFullYear()} FATHOM Audio</span>
          <span>Built for the daily-sites gallery</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.22em]" style={{ color: C.signal }}>{title}</h4>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function FootLink({ base, to, children }: { base: string; to: string; children: ReactNode }) {
  return (
    <NavLink to={`${base}/${to}`} className="w-fit font-['Space_Grotesk'] text-[14px] underline-offset-4 transition-colors duration-200 hover:underline" style={{ color: C.textSoft }}>
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

export default function Fathom() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Page><Home /></Page>} />
        <Route path="episodes" element={<Page><Episodes /></Page>} />
        <Route path="about" element={<Page><About /></Page>} />
        <Route path="listen" element={<Page><Listen /></Page>} />
        <Route path="*" element={<Page><Home /></Page>} />
      </Routes>
    </Layout>
  )
}
