import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { NavLink, useParams } from "react-router-dom"
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"
import { ArrowUpRight, MoveHorizontal } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  HEARNE — heritage renovation studio, Melbourne                     */
/*  Palette: limewash plaster ground + ink + a single terracotta       */
/*  bg     #f4efe6  ·  ground panel #ece4d6  ·  ink #211d18             */
/*  muted warm grey #6c6358  ·  accent terracotta #b14a2f              */
/*  terracotta on bone ≈ 5.0:1 → AA for body; ink ≈ 13:1               */
/* ------------------------------------------------------------------ */

export const display = "font-['Fraunces']"
export const body = "font-['Hanken_Grotesk']"
export const mono = "font-['IBM_Plex_Mono']"

export const ink = "#211d18"
export const bone = "#f4efe6"
export const terra = "#b14a2f"

/* ------------------------------------------------------------------ */
/*  FEATURED INTERACTION — Before / After drag comparison              */
/*  A draggable divider wipes between the "before" and "after" image   */
/*  of a room. Click/drag anywhere on the frame, or focus the handle   */
/*  and use arrow keys. Pointer-driven, so it works identically with   */
/*  or without prefers-reduced-motion — no autoplay to gate.           */
/* ------------------------------------------------------------------ */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
  ratio = "aspect-[4/3]",
}: {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  className?: string
  ratio?: string
}) {
  const [pos, setPos] = useState(52)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const pct = ((clientX - r.left) / r.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }

  return (
    <div
      ref={ref}
      className={cn(
        "group relative select-none overflow-hidden rounded-[4px] ring-1 ring-[#211d18]/12",
        ratio,
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        moveTo(e.clientX)
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* AFTER — base layer (full) */}
      <img
        src={afterSrc}
        alt={afterAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(1.04) contrast(1.02)" }}
        draggable={false}
      />
      {/* BEFORE — clipped to the left of the divider, graded cooler/duller */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          filter: "grayscale(0.55) brightness(0.82) contrast(0.95)",
        }}
        draggable={false}
      />

      {/* corner labels */}
      <span
        className={cn(
          "absolute left-3 top-3 rounded-full bg-[#211d18]/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#f4efe6] backdrop-blur",
          mono,
        )}
      >
        Before
      </span>
      <span
        className={cn(
          "absolute right-3 top-3 rounded-full bg-[#b14a2f] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#f4efe6]",
          mono,
        )}
      >
        After
      </span>

      {/* divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[#f4efe6]"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          aria-label="Drag to compare before and after"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          role="slider"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 3))
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 3))
          }}
          className="pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#f4efe6] text-[#211d18] shadow-[0_4px_18px_rgba(33,29,24,0.35)] ring-1 ring-[#211d18]/10 transition-transform duration-200 group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b14a2f]"
        >
          <MoveHorizontal className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated count-up                                                  */
/* ------------------------------------------------------------------ */
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
  const mv = useMotionValue(0)
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(mv, to, {
      duration: 1.4,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, reduce, to, mv])

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-AU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Magnetic CTA link                                                  */
/* ------------------------------------------------------------------ */
export function Cta({
  children,
  variant = "solid",
  className,
}: {
  children: ReactNode
  variant?: "solid" | "outline"
  className?: string
}) {
  return (
    <Magnetic strength={0.35}>
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-200",
          variant === "solid"
            ? "bg-[#211d18] text-[#f4efe6] hover:bg-[#b14a2f]"
            : "ring-1 ring-[#211d18]/25 text-[#211d18] hover:bg-[#211d18] hover:text-[#f4efe6]",
          className,
        )}
      >
        {children}
      </span>
    </Magnetic>
  )
}

/* ------------------------------------------------------------------ */
/*  Eyebrow / section label                                            */
/* ------------------------------------------------------------------ */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#b14a2f]",
        mono,
      )}
    >
      <span className="h-px w-6 bg-[#b14a2f]" />
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Wordmark                                                           */
/* ------------------------------------------------------------------ */
export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[2px] text-[22px] font-semibold leading-none tracking-tight",
        display,
        light ? "text-[#f4efe6]" : "text-[#211d18]",
      )}
    >
      Hearne
      <span className="text-[#b14a2f]">.</span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
export function Footer() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <footer className="border-t border-[#211d18]/10 bg-[#ece4d6]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className={cn("mt-4 text-sm leading-relaxed text-[#6c6358]", body)}>
              A heritage renovation studio in Brunswick, Melbourne. We bring
              tired terraces, workers' cottages and warehouses back to a life
              that fits the way you live now.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FootCol title="Studio">
              <FootLink to={base} end>
                Home
              </FootLink>
              <FootLink to={`${base}/projects`}>Projects</FootLink>
              <FootLink to={`${base}/studio`}>Studio</FootLink>
              <FootLink to={`${base}/contact`}>Contact</FootLink>
            </FootCol>
            <FootCol title="Visit">
              <p className={cn("text-sm text-[#6c6358]", body)}>
                14 Weston Street
                <br />
                Brunswick VIC 3056
              </p>
            </FootCol>
            <FootCol title="Say hello">
              <p className={cn("text-sm text-[#6c6358]", body)}>
                studio@hearne.au
                <br />
                +61 3 9388 0042
              </p>
            </FootCol>
          </div>
        </div>
        <div
          className={cn(
            "mt-12 flex flex-col gap-2 border-t border-[#211d18]/10 pt-6 text-[11px] uppercase tracking-[0.16em] text-[#6c6358] sm:flex-row sm:items-center sm:justify-between",
            mono,
          )}
        >
          <span>© 2026 Hearne Studio · ABN 41 882 117 003</span>
          <span>Registered Building Practitioner DB-U 39114</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4
        className={cn(
          "mb-3 text-[11px] uppercase tracking-[0.2em] text-[#211d18]",
          mono,
        )}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function FootLink({
  to,
  end,
  children,
}: {
  to: string
  end?: boolean
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={cn(
        "inline-flex items-center gap-1 text-sm text-[#6c6358] transition-colors hover:text-[#b14a2f]",
        body,
      )}
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
    </NavLink>
  )
}
