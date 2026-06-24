import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { NavLink, Link, useParams } from "react-router-dom"
import { motion, useInView, useReducedMotion, animate } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

/* =========================================================================
   BRINDLE TYPE CO. — palette & type
   A warm letterpress scheme: oat paper, walnut ink, and a single vermilion
   accent (the colour of a proofing-press ink-pad). Everything is set in the
   foundry's own faces — Fraunces for display, Spectral for reading.
   ========================================================================= */
export const C = {
  paper: "#F4EEE2",
  paper2: "#EAE1D0",
  card: "#FBF7EE",
  ink: "#181410", // warm near-black
  ink2: "#241D16",
  mute: "#655B4F", // ~5:1 on paper — AA small text
  line: "#DBD0BD",
  lineSoft: "rgba(24,20,16,0.10)",
  lineDk: "rgba(244,238,226,0.16)",
  paperMute: "rgba(244,238,226,0.70)", // muted paper on ink
  accent: "#C8401F", // vermilion — large / graphic only
  accentInk: "#A23217", // deeper sibling — AA small text on paper
  accentLt: "#E76A45", // for dark grounds
}

export const DISPLAY = "'Fraunces', Georgia, serif"
export const SERIF = "'Spectral', Georgia, serif"
export const GROTESK = "'Space Grotesk', system-ui, sans-serif"
export const SYNE = "'Syne', system-ui, sans-serif"
export const MONO = "'IBM Plex Mono', ui-monospace, monospace"

export function useBase() {
  const { slug } = useParams()
  return `/site/${slug}`
}

/** Helper: build a font-variation-settings string for Fraunces. */
export function fvs(wght: number, opsz = 96, soft = 0) {
  return `'opsz' ${opsz}, 'wght' ${Math.round(wght)}, 'SOFT' ${soft}`
}

/* ------------------------------- nav ------------------------------- */
function Nav() {
  const base = useBase()
  const [open, setOpen] = useState(false)
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/typefaces`, label: "Typefaces", end: false },
    { to: `${base}/specimen`, label: "Specimen", end: false },
    { to: `${base}/studio`, label: "Studio", end: false },
  ]
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: C.line, background: "rgba(244,238,226,0.84)" }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3.5 sm:px-7">
        <Link
          to={base}
          className="group flex items-baseline gap-2.5 leading-none"
          onClick={() => setOpen(false)}
        >
          <span
            style={{ fontFamily: DISPLAY, color: C.ink, fontVariationSettings: fvs(620, 60) }}
            className="text-[25px] tracking-[-0.01em]"
          >
            Brindle
          </span>
          <span
            style={{ fontFamily: MONO, color: C.accentInk }}
            className="hidden text-[10px] uppercase tracking-[0.28em] sm:inline"
          >
            Type&nbsp;Co.
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" style={{ fontFamily: GROTESK }}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="group relative text-[13.5px] tracking-wide transition-colors"
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
            to={`${base}/license`}
            className="rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: C.ink, color: C.paper, fontFamily: GROTESK }}
          >
            Licensing
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
        <div className="border-t md:hidden" style={{ borderColor: C.line, fontFamily: GROTESK }}>
          <div className="mx-auto flex max-w-[1200px] flex-col px-5 py-2">
            {[...links, { to: `${base}/license`, label: "Licensing", end: false }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className="border-b py-3 text-[15px] last:border-0"
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

/* ------------------------------ footer ----------------------------- */
function Footer() {
  const base = useBase()
  const cols: { head: string; items: { label: string; to: string }[] }[] = [
    {
      head: "Catalogue",
      items: [
        { label: "Typefaces", to: `${base}/typefaces` },
        { label: "Brindle Text — specimen", to: `${base}/specimen` },
        { label: "Licensing", to: `${base}/license` },
      ],
    },
    {
      head: "Foundry",
      items: [
        { label: "The studio", to: `${base}/studio` },
        { label: "Custom & retainer", to: `${base}/studio` },
        { label: "Trials & testing", to: `${base}/typefaces` },
      ],
    },
  ]
  return (
    <footer style={{ background: C.ink, color: C.paper }}>
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-7">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div
              style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(560, 144) }}
              className="text-[40px] leading-none tracking-[-0.02em]"
            >
              Brindle
            </div>
            <p
              className="mt-4 max-w-xs text-[15px] leading-relaxed"
              style={{ fontFamily: SERIF, color: C.paperMute }}
            >
              An independent type foundry drawing letters with grain — warmth you
              can feel at 9&nbsp;point and 900.
            </p>
            <a
              href="mailto:hello@brindle.type"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] tracking-wide transition-colors hover:text-[var(--a)]"
              style={{ fontFamily: MONO, color: C.paper, ["--a" as string]: C.accentLt } as CSSProperties}
            >
              hello@brindle.type <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          {cols.map((col) => (
            <div key={col.head}>
              <div
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ fontFamily: MONO, color: C.accentLt }}
              >
                {col.head}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      to={it.to}
                      className="text-[14px] transition-colors hover:text-[var(--a)]"
                      style={{ fontFamily: GROTESK, color: C.paperMute, ["--a" as string]: C.paper } as CSSProperties}
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-14 flex flex-col gap-2 border-t pt-6 text-[11px] uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: C.lineDk, fontFamily: MONO, color: "rgba(244,238,226,0.62)" }}
        >
          <span>© 2026 Brindle Type Co. — Bristol</span>
          <span>Set in Fraunces &amp; Spectral · Made on a hill</span>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------ layout ----------------------------- */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: SERIF }} className="min-h-screen antialiased">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

/* ---------------------------- primitives --------------------------- */
export function Eyebrow({ children, color = C.accentInk }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em]"
      style={{ fontFamily: MONO, color }}
    >
      <span className="inline-block h-px w-6" style={{ background: color }} />
      {children}
    </span>
  )
}

export function ArrowLink({
  to,
  children,
  color = C.ink,
}: {
  to: string
  children: ReactNode
  color?: string
}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-[14px] tracking-wide transition-colors"
      style={{ fontFamily: GROTESK, color }}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

/** Animated number that counts up when scrolled into view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
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
      ease: [0.17, 0.67, 0.32, 0.99],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, reduce])
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/** Infinite marquee track. Pauses on hover. */
export function Marquee({
  children,
  speed = 38,
  className,
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <div className={"group relative flex overflow-hidden " + (className ?? "")}>
      <motion.div
        className="flex shrink-0 items-center gap-12 pr-12 group-hover:[animation-play-state:paused]"
        animate={reduce ? undefined : { x: ["0%", "-100%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {children}
      </motion.div>
      {!reduce && (
        <motion.div
          aria-hidden
          className="flex shrink-0 items-center gap-12 pr-12"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

/** Page wrapper: fade + rise keyed on route for smooth transitions. */
export function Page({ children, k }: { children: ReactNode; k: string }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}
