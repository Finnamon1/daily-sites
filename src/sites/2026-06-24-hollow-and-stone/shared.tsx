import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { NavLink, Link, useParams } from "react-router-dom"
import { useInView, useReducedMotion, animate } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"

/* =========================================================================
   HOLLOW & STONE — palette & type
   Warm Pennine stone + bone, a single confident moss-olive accent (lichen on
   gritstone, fields above the mill towns). No gradient soup; the accent earns
   its place on borders, washes and large type, with a deeper sibling for AA
   small text.
   ========================================================================= */
export const C = {
  paper: "#F3EDE3", // warm bone
  paper2: "#EAE2D4", // card / inset
  ink: "#211E18", // warm near-black
  ink2: "#2E2A22",
  panel: "#272219", // dark ground
  mute: "#6A6353", // ~4.7:1 on paper — AA small text
  muteHi: "rgba(243,237,227,0.62)", // muted bone on dark
  line: "#D8CFBF",
  lineDk: "rgba(243,237,227,0.16)",
  accent: "#687B3E", // moss olive — large text / borders / washes
  accentInk: "#4C5A28", // deeper sibling — AA small text on paper
  accentLt: "#A6BA66", // for dark grounds
}

export const DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif"
export const SERIF = "'Spectral', Georgia, serif"
export const SANS = "'Hanken Grotesk', system-ui, sans-serif"
export const MONO = "'JetBrains Mono', monospace"

export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/* ----------------------------- small parts ----------------------------- */

export function Eyebrow({
  children,
  on = "light",
  className = "",
}: {
  children: ReactNode
  on?: "light" | "dark"
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] ${className}`}
      style={{ fontFamily: MONO, color: on === "dark" ? C.accentLt : C.accentInk }}
    >
      <span aria-hidden className="inline-block h-px w-6" style={{ background: "currentColor" }} />
      {children}
    </span>
  )
}

export function ArrowLink({
  to,
  children,
  on = "light",
}: {
  to: string
  children: ReactNode
  on?: "light" | "dark"
}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
      style={{ fontFamily: SANS, color: on === "dark" ? C.paper : C.ink }}
    >
      <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-current">
        {children}
      </span>
      <ArrowUpRight
        size={15}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: on === "dark" ? C.accentLt : C.accentInk }}
      />
    </Link>
  )
}

/** Count up from zero when scrolled into view; static under reduced motion. */
export function Counter({
  to,
  suffix = "",
  className = "",
  style,
}: {
  to: number
  suffix?: string
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
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref} className={className} style={style}>
      {Math.round(val).toLocaleString()}
      {suffix}
    </span>
  )
}

/* A photograph with a deliberate restored grade + a thin frame, never raw. */
export function Frame({
  seed,
  alt,
  w = 1200,
  h = 900,
  hue = 30,
  className = "",
  rounded = "rounded-[3px]",
  priority = false,
}: {
  seed: string
  alt: string
  w?: number
  h?: number
  hue?: number
  className?: string
  rounded?: string
  priority?: boolean
}) {
  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} style={{ background: C.paper2 }}>
      <img
        src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover"
        style={{ filter: `saturate(0.88) contrast(1.04) sepia(0.12) hue-rotate(${hue - 30}deg)` }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(33,30,24,0.12)" }} />
    </div>
  )
}

/* ----------------------------------------------------------------------
   FEATURED INTERACTION — draggable before/after comparison slider
   One photograph, two gradings. The right (under) layer is the warm,
   restored grade; the left (over) layer is the cold, flat, grainy "as
   found", clipped to the handle position. Drag (mouse or touch), or focus
   the handle and use the arrow keys — it's a real <input type=range>
   visually replaced by the seam. Reduced motion keeps a static 50/50 split.
   ---------------------------------------------------------------------- */
export function BeforeAfter({
  seed,
  hue,
  altBefore,
  altAfter,
  className = "",
}: {
  seed: string
  hue: number
  altBefore: string
  altAfter: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const [pos, setPos] = useState(reduce ? 50 : 62)
  const [drag, setDrag] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  const setFromClientX = (clientX: number) => {
    const r = wrap.current?.getBoundingClientRect()
    if (!r) return
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, p)))
  }

  useEffect(() => {
    if (!drag) return
    const move = (e: PointerEvent) => setFromClientX(e.clientX)
    const up = () => setDrag(false)
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
  }, [drag])

  const src = `https://picsum.photos/seed/${seed}/1400/1000`

  return (
    <div
      ref={wrap}
      className={`relative aspect-[7/5] w-full touch-none select-none overflow-hidden rounded-[4px] ${className}`}
      style={{ boxShadow: "inset 0 0 0 1px rgba(33,30,24,0.14)" }}
      onPointerDown={(e) => {
        setDrag(true)
        setFromClientX(e.clientX)
      }}
    >
      {/* AFTER — warm restored grade (under) */}
      <img
        src={src}
        alt={altAfter}
        width={1400}
        height={1000}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: `saturate(1.05) contrast(1.05) sepia(0.14) hue-rotate(${hue - 30}deg) brightness(1.02)` }}
      />
      {/* BEFORE — cold, flat "as found" (over, clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img
          src={src}
          alt={altBefore}
          width={1400}
          height={1000}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(0.86) contrast(0.8) brightness(0.72) saturate(0.45)" }}
        />
        {/* faint paper grain on the "found" side */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.5) 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.5) 0.5px, transparent 1px)",
            backgroundSize: "4px 4px, 5px 5px",
          }}
        />
      </div>

      {/* labels */}
      <span
        className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
        style={{ fontFamily: MONO, background: "rgba(20,18,14,0.62)", color: C.paper }}
      >
        As found
      </span>
      <span
        className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
        style={{ fontFamily: MONO, background: C.accent, color: C.paper }}
      >
        Restored
      </span>

      {/* seam + handle */}
      <div className="absolute inset-y-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2" style={{ background: C.paper }} />
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          aria-label="Drag to compare as-found and restored"
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize opacity-0"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-lg transition-transform duration-200"
          style={{ background: C.paper, color: C.ink, transform: `translate(-50%,-50%) scale(${drag ? 1.08 : 1})` }}
        >
          <span className="flex items-center gap-0.5" style={{ fontFamily: MONO }}>
            <span className="text-[13px] leading-none">‹</span>
            <span className="text-[13px] leading-none">›</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- nav ------------------------------- */
function Wordmark({ on = "light" }: { on?: "light" | "dark" }) {
  return (
    <span className="flex items-baseline gap-2 leading-none">
      <span
        style={{ fontFamily: DISPLAY, color: on === "dark" ? C.paper : C.ink }}
        className="text-[21px] font-extrabold tracking-[-0.02em]"
      >
        Hollow
      </span>
      <span style={{ fontFamily: SERIF, color: on === "dark" ? C.accentLt : C.accentInk }} className="text-[19px] italic">
        &amp;
      </span>
      <span
        style={{ fontFamily: DISPLAY, color: on === "dark" ? C.paper : C.ink }}
        className="text-[21px] font-extrabold tracking-[-0.02em]"
      >
        Stone
      </span>
    </span>
  )
}

function Nav() {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/homes`, label: "Homes", end: false },
    { to: `${base}/work`, label: "The Work", end: false },
    { to: `${base}/studio`, label: "Studio", end: false },
  ]
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: C.line, background: "rgba(243,237,227,0.84)" }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5">
        <Link to={base} onClick={() => setOpen(false)} className="group">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" style={{ fontFamily: SANS }}>
          {links.map((l) => (
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
                    style={{ width: "100%", background: C.accent, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to={`${base}/enquire`}
            className="rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors hover:opacity-90"
            style={{ background: C.ink, color: C.paper, fontFamily: SANS }}
          >
            Enquire
          </NavLink>
        </nav>

        <button
          className="md:hidden"
          style={{ fontFamily: MONO, color: C.ink }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <Plus
            size={22}
            style={{ transform: open ? "rotate(45deg)" : "none", transition: "transform 250ms" }}
          />
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden" style={{ borderColor: C.line, fontFamily: SANS }}>
          <div className="mx-auto flex max-w-[1180px] flex-col px-5 py-2">
            {[...links, { to: `${base}/enquire`, label: "Enquire", end: false }].map((l) => (
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

function Footer() {
  const base = useBase()
  return (
    <footer style={{ background: C.panel, color: C.paper }}>
      <div className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark on="dark" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed" style={{ fontFamily: SERIF, color: C.muteHi }}>
              A restoration-led property practice in the South Pennines. We find the
              buildings nobody else sees, and put them right.
            </p>
          </div>
          <div className="text-[13px]" style={{ fontFamily: SANS }}>
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: C.accentLt }}>
              Pages
            </p>
            {[
              { to: base, label: "Home" },
              { to: `${base}/homes`, label: "Homes for sale" },
              { to: `${base}/work`, label: "The Work" },
              { to: `${base}/studio`, label: "Studio" },
              { to: `${base}/enquire`, label: "Enquire" },
            ].map((l) => (
              <Link key={l.label} to={l.to} className="block py-1 transition-colors hover:text-white" style={{ color: C.muteHi }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="text-[13px]" style={{ fontFamily: SANS, color: C.muteHi }}>
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: C.accentLt }}>
              The yard
            </p>
            <p className="leading-relaxed">
              Bridge Mill, Valley Road
              <br />
              Hebden Bridge HX7
              <br />
              <a href="mailto:hello@hollowandstone.co.uk" className="underline-offset-2 hover:underline">
                hello@hollowandstone.co.uk
              </a>
              <br />
              01422 000 000
            </p>
          </div>
        </div>
        <div
          className="mt-12 flex flex-col gap-2 border-t pt-6 text-[12px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: C.lineDk, fontFamily: MONO, color: C.muteHi }}
        >
          <span>© 2026 Hollow &amp; Stone Ltd. RICS regulated.</span>
          <span>Built for the daily-sites gallery.</span>
        </div>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: SANS }} className="min-h-screen antialiased">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
