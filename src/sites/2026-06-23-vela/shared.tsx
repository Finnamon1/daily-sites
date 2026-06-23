import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { NavLink, useParams } from "react-router-dom"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Palette / type — deep Atacama midnight + sodium-amber accent       */
/*  bg #070a12 · panel #0d1320 · text #e9e4d8 · muted #97a0b2          */
/*  accent amber #f4b860 (≈10:1 on bg, safe for small text)            */
/* ------------------------------------------------------------------ */

export const display = "font-['Fraunces']"
export const body = "font-['Space_Grotesk']"
export const mono = "font-['IBM_Plex_Mono']"

/* ------------------------------------------------------------------ */
/*  FEATURED INTERACTION                                                */
/*  Canvas starfield: parallax drift + cursor-drawn constellation.     */
/*  Stars near the pointer link to it (and each other) with amber      */
/*  filaments, as if you were tracing your own constellation.          */
/*  Reduced motion → a single static render, no rAF, no cursor lines.  */
/* ------------------------------------------------------------------ */
export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    const mouse = { x: -9999, y: -9999, on: false }

    type Star = { x: number; y: number; z: number; tw: number }
    let stars: Star[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(420, Math.max(90, Math.round((w * h) / 5200)))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        tw: Math.random() * Math.PI * 2,
      }))
    }
    resize()
    window.addEventListener("resize", resize)

    // Listen on window so cursor tracking works even though the canvas
    // sits behind content with pointer-events:none. Only "arm" the
    // constellation when the pointer is actually over the canvas.
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouse.on = false
        return
      }
      mouse.x = x
      mouse.y = y
      mouse.on = true
    }
    const onLeave = () => {
      mouse.on = false
    }

    const paintStars = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const tw = reduce ? 0.85 : 0.55 + 0.45 * Math.sin(t * 1.4 + s.tw)
        const size = (0.4 + s.z * 1.7) * tw
        ctx.beginPath()
        ctx.arc(s.x, s.y, Math.max(0.2, size), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(233,228,216,${(0.18 + s.z * 0.62) * (reduce ? 1 : tw)})`
        ctx.fill()
      }
    }

    if (reduce) {
      paintStars(0)
      return () => window.removeEventListener("resize", resize)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("blur", onLeave)

    const R = 150
    const frame = (now: number) => {
      const t = now / 1000
      // slow parallax drift — deeper stars move less
      for (const s of stars) {
        s.x += (0.02 + s.z * 0.06) * 0.6
        if (s.x > w + 2) s.x = -2
      }
      paintStars(t)

      if (mouse.on) {
        const near: Star[] = []
        for (const s of stars) {
          const dx = s.x - mouse.x
          const dy = s.y - mouse.y
          if (dx * dx + dy * dy < R * R) near.push(s)
        }
        // pointer → star filaments
        for (const s of near) {
          const dx = s.x - mouse.x
          const dy = s.y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          const a = (1 - d / R) * 0.55
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.lineTo(s.x, s.y)
          ctx.strokeStyle = `rgba(244,184,96,${a})`
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
        // star ↔ star filaments (the traced constellation)
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const dx = near[i].x - near[j].x
            const dy = near[i].y - near[j].y
            const d2 = dx * dx + dy * dy
            if (d2 < 78 * 78) {
              const a = (1 - Math.sqrt(d2) / 78) * 0.3
              ctx.beginPath()
              ctx.moveTo(near[i].x, near[i].y)
              ctx.lineTo(near[j].x, near[j].y)
              ctx.strokeStyle = `rgba(244,184,96,${a})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
        // hub glow
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(244,184,96,0.9)"
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("blur", onLeave)
    }
  }, [reduce])

  return <canvas ref={canvasRef} aria-hidden className={cn("block h-full w-full", className)} />
}

/* ------------------------------------------------------------------ */
/*  Count-up number, fires once when scrolled into view                */
/* ------------------------------------------------------------------ */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1500
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setN(value * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduce])

  const text = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString()
  return (
    <span ref={ref} className={mono}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Reveal — local variant so reduced motion is honoured               */
/* ------------------------------------------------------------------ */
export function Up({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Buttons — magnetic primary CTA + quiet link                        */
/* ------------------------------------------------------------------ */
export function Cta({
  to,
  children,
  variant = "solid",
}: {
  to: string
  children: ReactNode
  variant?: "solid" | "ghost"
}) {
  const cls =
    variant === "solid"
      ? "bg-[#f4b860] text-[#0a0a0a] hover:bg-[#ffca78]"
      : "border border-white/20 text-[#e9e4d8] hover:border-[#f4b860]/70 hover:text-[#f4b860]"
  return (
    <Magnetic strength={0.35}>
      <NavLink
        to={to}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200",
          body,
          cls,
        )}
      >
        {children}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </NavLink>
    </Magnetic>
  )
}

/* ------------------------------------------------------------------ */
/*  Wordmark + Footer                                                   */
/* ------------------------------------------------------------------ */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <circle cx="16" cy="16" r="13" fill="none" stroke="#f4b860" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6.5" fill="none" stroke="#f4b860" strokeWidth="1.2" opacity="0.7" />
      <line x1="16" y1="0" x2="16" y2="6" stroke="#f4b860" strokeWidth="1.2" />
      <line x1="16" y1="26" x2="16" y2="32" stroke="#f4b860" strokeWidth="1.2" />
      <line x1="0" y1="16" x2="6" y2="16" stroke="#f4b860" strokeWidth="1.2" />
      <line x1="26" y1="16" x2="32" y2="16" stroke="#f4b860" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="1.6" fill="#f4b860" />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Mark />
      <span className="leading-none">
        <span className={cn("block text-[17px] font-semibold tracking-wide text-[#e9e4d8]", display)}>
          Vela
        </span>
        <span className={cn("block text-[9px] uppercase tracking-[0.34em] text-[#97a0b2]", mono)}>
          Field Observatory
        </span>
      </span>
    </span>
  )
}

export function Footer() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <footer className="border-t border-white/10 bg-[#070a12]">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className={cn("mt-5 max-w-xs text-sm leading-relaxed text-[#97a0b2]", body)}>
              A public observatory and dark-sky sanctuary at 2,400 m in the
              Atacama Desert. Open to the sky 320 nights a year.
            </p>
          </div>
          <div>
            <h4 className={cn("mb-4 text-[11px] uppercase tracking-[0.24em] text-[#f4b860]", mono)}>
              Visit
            </h4>
            <ul className={cn("space-y-2.5 text-sm text-[#c2c6cf]", body)}>
              <li>
                <NavLink to={base} end className="hover:text-[#f4b860]">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to={`${base}/programs`} className="hover:text-[#f4b860]">
                  Programs
                </NavLink>
              </li>
              <li>
                <NavLink to={`${base}/sky`} className="hover:text-[#f4b860]">
                  Sky Tonight
                </NavLink>
              </li>
              <li>
                <NavLink to={`${base}/visit`} className="hover:text-[#f4b860]">
                  Plan a Visit
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={cn("mb-4 text-[11px] uppercase tracking-[0.24em] text-[#f4b860]", mono)}>
              Coordinates
            </h4>
            <p className={cn("space-y-1 text-sm leading-relaxed text-[#c2c6cf]", mono)}>
              24°37′ S · 70°24′ W
              <br />
              Cerro Vela, Antofagasta
              <br />
              Región II, Chile
              <br />
              <span className="text-[#97a0b2]">hello@velaobservatory.cl</span>
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#6f7888] sm:flex-row sm:items-center sm:justify-between">
          <span className={mono}>© 2026 Vela Field Observatory</span>
          <span className={mono}>Bortle Class 1 · Booking essential</span>
        </div>
      </div>
    </footer>
  )
}
