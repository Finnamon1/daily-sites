import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { Home } from "./pages/Home"
import { Music } from "./pages/Music"
import { Live } from "./pages/Live"
import { About } from "./pages/About"

export const meta: SiteMeta = {
  title: "SÓL — Aurelia, the debut album",
  description:
    "The release page for Aurelia, the debut album from Icelandic composer Sól Bjarkadóttir, recorded over a winter in a lighthouse near Stykkishólmur. Featured interaction: full-viewport scroll-snap panels, with an animated waveform, magnetic buttons and staggered reveals.",
  date: "2026-06-23",
  type: "Artist / music",
  interaction: "Scroll-snap panel transitions + animated waveform + magnetic buttons",
  pages: ["Home", "Music", "Live", "About"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "music", label: "Music", end: false },
  { to: "live", label: "Live", end: false },
  { to: "about", label: "About", end: false },
]

function Wordmark({ base }: { base: string }) {
  return (
    <NavLink
      to={base}
      end
      className="group flex items-center gap-2.5 font-['Bricolage_Grotesque'] text-lg font-bold tracking-tight text-[#eef0f3]"
    >
      <span className="relative grid h-7 w-7 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[#e8b15c] opacity-90 blur-[1px] transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute inset-[5px] rounded-full bg-[#0a0b10]" />
      </span>
      SÓL
    </NavLink>
  )
}

function Layout({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0b10] font-['DM_Sans'] text-[#eef0f3] antialiased selection:bg-[#e8b15c] selection:text-[#0a0b10]">
      <header className="sticky top-0 z-40 h-16 border-b border-white/[0.07] bg-[#0a0b10]/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Wordmark base={base} />

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `relative font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                    isActive ? "text-[#e8b15c]" : "text-[#9aa1ad] hover:text-[#eef0f3]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="navdot"
                        className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#e8b15c]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Magnetic strength={0.5}>
              <NavLink
                to={`${base}/music`}
                className="rounded-full border border-[#e8b15c]/40 px-5 py-2 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#e8b15c] transition-colors duration-200 hover:bg-[#e8b15c] hover:text-[#0a0b10]"
              >
                Listen
              </NavLink>
            </Magnetic>
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-[#eef0f3] md:hidden"
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
              className="overflow-hidden border-t border-white/[0.07] bg-[#0a0b10] md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2.5 font-['IBM_Plex_Mono'] text-sm uppercase tracking-[0.16em] ${
                        isActive ? "bg-white/[0.05] text-[#e8b15c]" : "text-[#9aa1ad]"
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

      <footer className="border-t border-white/[0.07] px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="font-['Bricolage_Grotesque'] text-2xl font-bold tracking-tight">SÓL</div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#9aa1ad]">
              <span className="italic text-[#c9cdd4]">Aurelia</span> — recorded by candlelight in the
              Súgandisey lighthouse, winter 2025. Out now on Northlight Editions.
            </p>
          </div>
          <div>
            <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#7e8590]">
              Hear it
            </h4>
            <ul className="mt-3 space-y-1.5 text-sm text-[#c9cdd4]">
              <li className="transition-colors hover:text-[#e8b15c]">Bandcamp (lossless + vinyl)</li>
              <li className="transition-colors hover:text-[#e8b15c]">Spotify · Apple Music</li>
              <li className="transition-colors hover:text-[#e8b15c]">Tidal · Qobuz</li>
            </ul>
          </div>
          <div>
            <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#7e8590]">
              Get in touch
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-[#c9cdd4]">
              Booking — live@northlight.is
              <br />
              Press — words@northlight.is
              <br />
              @sol.plays
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/[0.07] pt-6 text-xs text-[#7e8590] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Northlight Editions. Pressed at 45rpm on 180g.</span>
          <span className="font-['IBM_Plex_Mono']">Made in Stykkishólmur, 65°N</span>
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Routes>
        <Route index element={<Home />} />
        <Route path="music" element={<Music />} />
        <Route path="live" element={<Live />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </motion.div>
  )
}

export default function Aurelia() {
  return (
    <Layout>
      <Pages />
    </Layout>
  )
}
