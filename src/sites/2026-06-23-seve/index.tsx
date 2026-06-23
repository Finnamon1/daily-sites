import { useState } from "react"
import {
  NavLink,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import type { SiteMeta } from "../types"
import { C } from "./lib"
import { Home } from "./pages/Home"
import { Collection } from "./pages/Collection"
import { Fragrance } from "./pages/Fragrance"
import { Maison } from "./pages/Maison"
import { Visit } from "./pages/Visit"

export const meta: SiteMeta = {
  title: "SÈVE — niche extraits de parfum, poured to order in Paris",
  description:
    "E-commerce for SÈVE, a two-person Paris perfume house with exactly three fragrances. Featured interaction: a cursor-reactive gradient aura that diffuses like scent, with magnetic CTAs, scroll reveals and an unfolding olfactory pyramid.",
  date: "2026-06-23",
  type: "E-commerce store",
  interaction: "Cursor-reactive gradient aura (scent diffusion) + magnetic CTAs + scroll reveals",
  pages: ["Home", "Collection", "Fragrance", "Maison", "Visit"],
}

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "collection", label: "Collection", end: false },
  { to: "maison", label: "Maison", end: false },
  { to: "visit", label: "Visit", end: false },
]

function Wordmark({ base }: { base: string }) {
  return (
    <NavLink to={base} end className="group flex items-baseline gap-2">
      <span
        className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-[0.18em]"
        style={{ color: "inherit" }}
      >
        SÈVE
      </span>
      <span
        className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.25em]"
        style={{ color: C.amber }}
      >
        Parfums
      </span>
    </NavLink>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [open, setOpen] = useState(false)

  return (
    <div
      className="min-h-screen font-['Hanken_Grotesk'] antialiased"
      style={{ background: C.bone, color: C.ink }}
    >
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: C.line, background: "rgba(242,235,223,0.82)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark base={base} />

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className="font-['Hanken_Grotesk'] text-[14px] font-medium transition-colors duration-200"
                style={({ isActive }) => ({
                  color: isActive ? C.amber : "rgba(23,18,14,0.72)",
                })}
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to={`${base}/collection`}
              className="rounded-full px-5 py-2 font-['Hanken_Grotesk'] text-[14px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: C.ink, color: C.bone }}
            >
              Shop
            </Link>
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border md:hidden"
            style={{ borderColor: C.line, color: C.ink }}
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
                {NAV.map((n, i) => (
                  <NavLink
                    key={`${n.label}-${i}`}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 font-['Hanken_Grotesk'] text-[15px] font-medium"
                    style={({ isActive }) => ({
                      color: isActive ? C.amber : "rgba(23,18,14,0.8)",
                    })}
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

      <footer className="border-t px-6 py-16" style={{ borderColor: C.line, background: C.boneDeep }}>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Wordmark base={base} />
            <p className="mt-4 max-w-xs font-['Hanken_Grotesk'] text-[14.5px] leading-[1.7]" style={{ color: "rgba(23,18,14,0.72)" }}>
              Three extraits de parfum, blended and bottled by two people above
              a workshop in the 11th arrondissement.
            </p>
          </div>
          <FootCol title="Shop" base={base} links={[
            ["The collection", "collection"],
            ["Discovery set", "visit"],
            ["Refills", "visit"],
          ]} />
          <FootCol title="Maison" base={base} links={[
            ["Our story", "maison"],
            ["Visit the atelier", "visit"],
            ["Contact", "visit"],
          ]} />
        </div>
        <div
          className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-2 border-t pt-6 font-['IBM_Plex_Mono'] text-[12px] md:flex-row md:items-center"
          style={{ borderColor: C.line, color: "rgba(23,18,14,0.7)" }}
        >
          <span>© 2026 SÈVE Parfums · Paris</span>
          <span>Poured to order — never mass-produced.</span>
        </div>
      </footer>
    </div>
  )
}

function FootCol({
  title,
  base,
  links,
}: {
  title: string
  base: string
  links: [string, string][]
}) {
  return (
    <div>
      <h4 className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em]" style={{ color: C.amber }}>
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link
              to={`${base}/${to}`}
              className="font-['Hanken_Grotesk'] text-[14.5px] underline-offset-4 transition-colors duration-200 hover:underline"
              style={{ color: "rgba(23,18,14,0.78)" }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
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
        <Route path="collection" element={<Collection />} />
        <Route path="parfum/:id" element={<Fragrance />} />
        <Route path="maison" element={<Maison />} />
        <Route path="visit" element={<Visit />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </motion.div>
  )
}

export default function Seve() {
  return (
    <Layout>
      <Pages />
    </Layout>
  )
}
