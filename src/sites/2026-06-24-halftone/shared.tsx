import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react"
import { NavLink, Link, useParams } from "react-router-dom"
import { useInView, useReducedMotion, animate } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

/* =========================================================================
   HALFTONE — palette & type
   Risograph ink on warm press paper. One confident accent (fluoro pink),
   blue as the structural "second drum", yellow as a rare highlight. Body
   text always rides on ink for AA; pink/blue only at display size or as
   chips on neutral grounds.
   ========================================================================= */
export const C = {
  paper: "#F1EADB",
  paper2: "#E7DECB",
  card: "#F7F2E7",
  ink: "#17150F", // ~14:1 on paper
  ink70: "rgba(23,21,15,0.66)", // ~6:1 — AA small on paper
  ink45: "rgba(23,21,15,0.46)",
  line: "#D8CDB4",
  lineDk: "rgba(247,242,231,0.18)",
  pink: "#FF2E88", // fluoro — display / large only
  pinkInk: "#C01660", // ~5.1:1 on paper — AA small accent
  blue: "#1B4DD8", // second drum — large / structural
  blueInk: "#1740B0", // AA small on paper
  yellow: "#FFC400", // highlight behind ink only
}

export const DISPLAY = "'Syne', system-ui, sans-serif"
export const SANS = "'Hanken Grotesk', system-ui, sans-serif"
export const MONO = "'IBM Plex Mono', monospace"

export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* =========================================================================
   FEATURED INTERACTION — risograph misregistration (RisoImage)
   A single photo is rendered as two ink "drums": a pink plate and a blue
   plate, each a screened-tint of the same grayscale source, stacked with
   mix-blend multiply over the paper. On hover the two plates slide apart by
   a few pixels — the print is briefly off-register, exactly the way a real
   two-drum pull drifts. A halftone dot screen sits on top. Reduced-motion
   users get a clean, static, perfectly-registered duotone.
   ========================================================================= */
export function RisoImage({
  seed,
  alt,
  w = 800,
  h = 1000,
  className,
  ratio = "aspect-[4/5]",
}: {
  seed: string
  alt: string
  w?: number
  h?: number
  className?: string
  ratio?: string
}) {
  const reduce = useReducedMotion()
  const url = `https://picsum.photos/seed/${seed}/${w}/${h}`
  // Each plate is the SAME photo, colourised to one ink hue with a
  // grayscale→sepia→hue-rotate filter (reliable cross-browser), then stacked
  // with multiply over white so the two inks overprint like a real two-drum
  // pull. hue-rotate sets the drum colour; the offset is the misregistration.
  const plate: CSSProperties = {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    mixBlendMode: "multiply",
    transition: "transform 280ms cubic-bezier(0.2,0.65,0.3,1)",
  }
  // A small RESTING offset keeps the two-ink misregistration visible even on
  // touch / no-hover; hover widens the slip. Reduced-motion holds the rest pose.
  const pinkCls = reduce
    ? "translate-x-[-1.5px] translate-y-[-1px]"
    : "translate-x-[-1.5px] translate-y-[-1px] group-hover/riso:translate-x-[-6px] group-hover/riso:translate-y-[-5px]"
  const blueCls = reduce
    ? "translate-x-[1.5px] translate-y-[1px]"
    : "translate-x-[1.5px] translate-y-[1px] group-hover/riso:translate-x-[6px] group-hover/riso:translate-y-[5px]"
  return (
    <div
      className={`riso group/riso relative overflow-hidden ${ratio} ${className ?? ""}`}
      style={{ background: "#fff", border: `1px solid ${C.line}` }}
      role="img"
      aria-label={alt}
    >
      {/* invisible real <img> for semantics + lazy fetch priority */}
      <img src={url} alt="" aria-hidden className="absolute h-0 w-0 opacity-0" loading="lazy" />
      <span
        aria-hidden
        className={pinkCls}
        style={{ ...plate, position: "absolute", inset: 0, filter: "grayscale(1) sepia(1) saturate(5) hue-rotate(286deg) contrast(1.05) brightness(1.05)" }}
      />
      <span
        aria-hidden
        className={blueCls}
        style={{ ...plate, position: "absolute", inset: 0, filter: "grayscale(1) sepia(1) saturate(6) hue-rotate(182deg) contrast(1.05) brightness(1.02)" }}
      />
      {/* halftone dot screen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.16]"
        style={{
          backgroundImage: `radial-gradient(${C.ink} 28%, transparent 29%)`,
          backgroundSize: "4px 4px",
        }}
      />
      {/* paper grain edge */}
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 0 1px ${C.line}` }} />
    </div>
  )
}

/* ----------------------------- counter ----------------------------- */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.3,
      ease: [0.22, 0.7, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ----------------------------- small bits ----------------------------- */
export function Kicker({ children, color = C.pinkInk }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
      style={{ fontFamily: MONO, color }}
    >
      <span className="inline-block h-[7px] w-[7px] rotate-45" style={{ background: color }} />
      {children}
    </span>
  )
}

export function ArrowLink({
  to,
  children,
  light = false,
}: {
  to: string
  children: ReactNode
  light?: boolean
}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
      style={{ fontFamily: SANS, color: light ? C.paper : C.ink }}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

/* ----------------------------- nav ----------------------------- */
const LINKS = (base: string) => [
  { to: base, label: "Home", end: true },
  { to: `${base}/programme`, label: "Programme", end: false },
  { to: `${base}/workshops`, label: "Workshops", end: false },
  { to: `${base}/tickets`, label: "Tickets", end: false },
]

function Nav() {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const links = LINKS(base)
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: C.line, background: "rgba(241,234,219,0.86)" }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5">
        <Link to={base} onClick={() => setOpen(false)} className="group flex items-center gap-2.5 leading-none">
          <span
            aria-hidden
            className="relative inline-block h-5 w-5"
            style={{ transition: "transform 240ms ease" }}
          >
            <span className="absolute inset-0 rounded-full mix-blend-multiply" style={{ background: C.pink, transform: "translate(-2px,-2px)" }} />
            <span className="absolute inset-0 rounded-full mix-blend-multiply" style={{ background: C.blue, transform: "translate(2px,2px)" }} />
          </span>
          <span style={{ fontFamily: DISPLAY, color: C.ink }} className="text-[19px] font-extrabold tracking-tight">
            HALFTONE
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" style={{ fontFamily: SANS }}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="group relative py-1 text-[13.5px] font-medium transition-colors"
              style={({ isActive }) => ({ color: isActive ? C.ink : C.ink70 })}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-[2px] origin-left transition-transform duration-300"
                    style={{ width: "100%", background: C.pink, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to={`${base}/tickets`}
            className="rounded-full px-4 py-2 text-[12.5px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: C.ink, color: C.paper, fontFamily: SANS }}
          >
            Get tickets
          </NavLink>
        </nav>

        <button
          className="text-[12px] uppercase tracking-[0.2em] md:hidden"
          style={{ fontFamily: MONO, color: C.ink }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden" style={{ borderColor: C.line, fontFamily: SANS }}>
          <div className="mx-auto flex max-w-[1180px] flex-col px-5 py-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className="border-b py-3 text-sm font-medium last:border-0"
                style={({ isActive }) => ({ borderColor: C.line, color: isActive ? C.pinkInk : C.ink })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

/* ----------------------------- footer ----------------------------- */
function Footer() {
  const base = useBase()
  const links = LINKS(base)
  return (
    <footer className="mt-24 border-t" style={{ borderColor: C.lineDk, background: C.ink, color: C.paper }}>
      <div className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="relative inline-block h-5 w-5">
                <span className="absolute inset-0 rounded-full mix-blend-screen" style={{ background: C.pink, transform: "translate(-2px,-2px)" }} />
                <span className="absolute inset-0 rounded-full mix-blend-screen" style={{ background: C.blue, transform: "translate(2px,2px)" }} />
              </span>
              <span style={{ fontFamily: DISPLAY }} className="text-lg font-extrabold tracking-tight">
                HALFTONE
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ fontFamily: SANS, color: "rgba(241,234,219,0.7)" }}>
              A two-day risograph & small-press festival in a working paper mill on the Maas.
              12–13 September 2026, Rotterdam. Come for the talks, stay for the ink under your nails.
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: C.pink }}>
              Pages
            </p>
            <ul className="mt-4 space-y-2.5" style={{ fontFamily: SANS }}>
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(241,234,219,0.78)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: C.pink }}>
              The mill
            </p>
            <ul className="mt-4 space-y-2.5 text-sm" style={{ fontFamily: SANS, color: "rgba(241,234,219,0.78)" }}>
              <li>Maaspapier 14</li>
              <li>3024 Rotterdam, NL</li>
              <li>hello@halftone.press</li>
            </ul>
          </div>
        </div>
        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-[11px] uppercase tracking-[0.2em] sm:flex-row sm:items-center"
          style={{ borderColor: C.lineDk, fontFamily: MONO, color: "rgba(241,234,219,0.5)" }}
        >
          <span>© 2026 Halftone Festival</span>
          <span>Printed, not rendered</span>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------- layout ----------------------------- */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: SANS }} className="min-h-screen antialiased">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
