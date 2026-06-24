import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { NavLink, Link, useParams } from "react-router-dom"
import { useInView, useReducedMotion, animate } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

/* =========================================================================
   VARÐA — palette & type
   A windswept Faroese basalt + bone scheme with a single signal-orange
   accent (think buoys, life-jackets, puffin beaks against grey weather).
   ========================================================================= */
export const C = {
  bone: "#ECE7DC",
  bone2: "#E1DACB",
  ink: "#14181A", // basalt near-black
  ink2: "#1C2225",
  panel: "#222A2D",
  mute: "#56544A", // ~6.9:1 on bone — AA for small text
  muteHi: "rgba(236,231,220,0.66)", // muted bone on dark
  line: "#D2CABB",
  lineDk: "rgba(236,231,220,0.16)",
  accent: "#D7552B", // signal orange — large text / dark grounds
  accentInk: "#A33A18", // deeper sibling — AA small text on bone
  accentLt: "#F0764A", // for dark grounds
}

export const DISPLAY = "'Cormorant Garamond', Georgia, serif"
export const SERIF = "'Spectral', Georgia, serif"
export const SANS = "'Space Grotesk', system-ui, sans-serif"
export const MONO = "'IBM Plex Mono', monospace"

export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* ----------------------------- nav ----------------------------- */
function Nav() {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/expeditions`, label: "Expeditions", end: false },
    { to: `${base}/islands`, label: "The Islands", end: false },
    { to: `${base}/book`, label: "Book", end: false },
  ]
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: C.line, background: "rgba(236,231,220,0.82)" }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5">
        <Link to={base} className="group flex items-baseline gap-2.5 leading-none" onClick={() => setOpen(false)}>
          <span style={{ fontFamily: DISPLAY, color: C.ink }} className="text-[26px] font-semibold tracking-tight">
            Varða
          </span>
          <span style={{ fontFamily: MONO, color: C.accentInk }} className="hidden text-[10px] uppercase tracking-[0.24em] sm:inline">
            62°N
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" style={{ fontFamily: SANS }}>
          {links.slice(0, 3).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="group relative text-[13px] tracking-wide transition-colors"
              style={({ isActive }) => ({ color: isActive ? C.ink : C.mute })}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className="absolute -bottom-1.5 left-0 h-px origin-left transition-transform duration-300"
                    style={{
                      width: "100%",
                      background: C.accent,
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to={`${base}/book`}
            className="rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors"
            style={{ background: C.ink, color: C.bone, fontFamily: SANS }}
          >
            Book a place
          </NavLink>
        </nav>

        <button
          className="md:hidden"
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
          <div className="mx-auto flex max-w-[1180px] flex-col px-5 py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className="border-b py-3 text-sm last:border-0"
                style={({ isActive }) => ({ borderColor: C.line, color: isActive ? C.accentInk : C.ink })}
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
  return (
    <footer style={{ background: C.ink, color: C.bone }}>
      <div className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div style={{ fontFamily: DISPLAY }} className="text-3xl font-medium">
              Varða
            </div>
            <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-3 max-w-xs text-[15px] leading-relaxed">
              Small-group walking expeditions across the eighteen islands. Weather-led, guided by people who grew up
              reading this coast.
            </p>
            <div style={{ fontFamily: MONO, color: C.accentLt }} className="mt-5 text-[11px] uppercase tracking-[0.2em]">
              Tórshavn · Faroe Islands
            </div>
          </div>
          <FootCol
            title="Walk with us"
            links={[
              { to: `${base}/expeditions`, label: "Expeditions" },
              { to: `${base}/islands`, label: "The Islands" },
              { to: `${base}/book`, label: "Book a place" },
            ]}
          />
          <FootCol
            title="Field office"
            links={[
              { to: base, label: "Niðari Vegur 4" },
              { to: base, label: "+298 31 90 22" },
              { to: base, label: "walk@varda.fo" },
            ]}
          />
        </div>
        <div
          className="mt-14 flex flex-col justify-between gap-2 border-t pt-6 text-[11px] sm:flex-row"
          style={{ borderColor: C.lineDk, fontFamily: MONO, color: C.muteHi }}
        >
          <span>© 2018–2026 Varða Expeditions ehf.</span>
          <span className="uppercase tracking-[0.2em]">Max party 8 · Carbon-offset travel</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, color: C.muteHi }} className="text-[11px] uppercase tracking-[0.2em]">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5" style={{ fontFamily: SANS }}>
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-[14px] transition-colors hover:text-[var(--acc)]" style={{ ["--acc" as string]: C.accentLt }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ----------------------------- Layout ----------------------------- */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.bone, color: C.ink }} className="min-h-screen antialiased">
      <Nav />
      {children}
      <Footer />
    </div>
  )
}

/* ----------------------------- helpers ----------------------------- */
export function Eyebrow({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] ${className}`}
      style={{ fontFamily: MONO, color: dark ? C.accentLt : C.accentInk }}
    >
      <span className="inline-block h-[6px] w-[6px] rotate-45" style={{ background: "currentColor" }} />
      {children}
    </div>
  )
}

export function ArrowLink({ to, children, dark = false }: { to: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors"
      style={{ fontFamily: SANS, color: dark ? C.bone : C.ink }}
    >
      {children}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: dark ? C.accentLt : C.accentInk }}
      />
    </Link>
  )
}

/** Count-up number that animates once on scroll into view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  style,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {val.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/**
 * Duotone photo: grayscale picsum image under a cold slate-blue block laid
 * with mix-blend-multiply, plus a bottom gradient for legible overlaid type.
 * Per-item hue keeps a whole set varied while staying on-brand & dodging the
 * AI-stock look.
 */
export function Duotone({
  seed,
  alt,
  w = 800,
  h = 600,
  hue = 205,
  className,
  rounded = "rounded-lg",
  children,
  priority = false,
}: {
  seed: string
  alt: string
  w?: number
  h?: number
  hue?: number
  className?: string
  rounded?: string
  children?: ReactNode
  priority?: boolean
}) {
  return (
    <div className={`relative overflow-hidden ${rounded} ${className ?? ""}`} style={{ background: C.ink2 }}>
      <img
        src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover grayscale transition-transform duration-700"
        style={{ filter: "grayscale(1) contrast(1.05)" }}
      />
      <div aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ background: `hsl(${hue} 42% 30%)` }} />
      <div aria-hidden className="absolute inset-0 mix-blend-screen opacity-25" style={{ background: `hsl(${hue + 18} 60% 18%)` }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(20,24,26,0.85), transparent)" }} />
      {children}
    </div>
  )
}

export function Grade({ level }: { level: "Moderate" | "Demanding" | "Expedition" }) {
  const dots = level === "Moderate" ? 2 : level === "Demanding" ? 3 : 4
  return (
    <span className="inline-flex items-center gap-1.5" style={{ fontFamily: MONO }} title={`Grade: ${level}`}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block h-[7px] w-[7px] rounded-full"
          style={{ background: i < dots ? C.accent : "transparent", border: `1px solid ${i < dots ? C.accent : C.line}` }}
        />
      ))}
      <span className="ml-1 text-[11px] uppercase tracking-[0.16em]" style={{ color: C.mute }}>
        {level}
      </span>
    </span>
  )
}

export const wrap = "mx-auto max-w-[1180px] px-5"
