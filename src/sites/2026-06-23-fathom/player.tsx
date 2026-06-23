import { useEffect, useRef, useState } from "react"
import { motion, useAnimationFrame, useReducedMotion } from "framer-motion"
import { Pause, Play } from "lucide-react"
import { C, type Episode } from "./theme"

/* ── Featured interaction ───────────────────────────────────────────────────
 *  A hand-built waveform audio player. No real audio file — the playhead is a
 *  simulated transport that sweeps the seeded waveform, reveals the "played"
 *  bars in amber via a single clipped overlay (cheap: one element resizes, not
 *  120), and lets you scrub by dragging anywhere across the wave. While playing,
 *  the bars shimmer in a slow travelling wave. The whole field is keyboard- and
 *  reduced-motion-aware.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Deterministic speech-like amplitudes in [0.16, 1] for a seed. */
function makeWave(seed: number, n: number): number[] {
  let s = seed >>> 0
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return Array.from({ length: n }, (_, i) => {
    // slow speech envelope (phrases + breaths) modulated by per-bar grit
    const env = 0.55 + 0.45 * Math.sin(i / 6 + seed) * Math.cos(i / 17 - seed / 3)
    const grit = 0.45 + 0.55 * rnd()
    return Math.max(0.16, Math.min(1, Math.abs(env) * grit))
  })
}

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/** Visual sweep duration so the demo transport is lively but not frantic. */
const SWEEP_SECONDS = 72

export function WaveformPlayer({
  episode,
  bars = 96,
  compact = false,
}: {
  episode: Episode
  bars?: number
  compact?: boolean
}) {
  const reduce = useReducedMotion()
  const [amps] = useState(() => makeWave(episode.seed, bars))
  const [progress, setProgress] = useState(0) // 0..1
  const [playing, setPlaying] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useAnimationFrame((_, delta) => {
    if (!playing || dragging.current) return
    setProgress((p) => {
      const next = p + delta / 1000 / SWEEP_SECONDS
      if (next >= 1) {
        setPlaying(false)
        return 1
      }
      return next
    })
  })

  const seekFromEvent = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r) return
    setProgress(Math.max(0, Math.min(1, (clientX - r.left) / r.width)))
  }

  useEffect(() => {
    if (!dragging.current) return
    const move = (e: PointerEvent) => seekFromEvent(e.clientX)
    const up = () => (dragging.current = false)
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
  })

  const current = progress * episode.seconds
  const pct = progress * 100

  const Bars = ({ color, played }: { color: string; played?: boolean }) => (
    <div className="flex h-full w-full items-center gap-[2px]">
      {amps.map((a, i) => (
        <span
          key={i}
          data-shimmer={played && playing && !reduce ? "" : undefined}
          className="block flex-1 rounded-full"
          style={{
            height: `${Math.round(a * 100)}%`,
            background: color,
            minWidth: 2,
            animationDelay: `${(i / bars) * 1.6}s`,
          }}
        />
      ))}
    </div>
  )

  return (
    <div
      className="flex items-center gap-4 rounded-2xl border p-4 sm:gap-5 sm:p-5"
      style={{ borderColor: C.line, background: C.panel }}
    >
      {/* transport */}
      <button
        onClick={() => {
          if (progress >= 1) setProgress(0)
          setPlaying((v) => !v)
        }}
        aria-label={playing ? `Pause ${episode.title}` : `Play ${episode.title}`}
        aria-pressed={playing}
        className="group relative grid shrink-0 place-items-center rounded-full outline-none transition-transform duration-200 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2"
        style={
          {
            width: compact ? 48 : 60,
            height: compact ? 48 : 60,
            background: C.signal,
            color: C.ground,
            ["--tw-ring-color" as string]: C.signal,
            ["--tw-ring-offset-color" as string]: C.panel,
          } as React.CSSProperties
        }
      >
        {playing && !reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${C.signal}` }}
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {playing ? (
          <Pause className={compact ? "h-4 w-4" : "h-5 w-5"} fill="currentColor" />
        ) : (
          <Play className={compact ? "ml-0.5 h-4 w-4" : "ml-0.5 h-5 w-5"} fill="currentColor" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        {!compact && (
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="truncate font-['Space_Grotesk'] text-[13px] font-medium" style={{ color: C.text }}>
              Ep {episode.no} · {episode.title}
            </span>
          </div>
        )}

        {/* the waveform — click or drag to seek */}
        <div
          ref={trackRef}
          role="slider"
          aria-label={`Seek within ${episode.title}`}
          aria-valuemin={0}
          aria-valuemax={episode.seconds}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${fmt(current)} of ${episode.duration}`}
          tabIndex={0}
          onPointerDown={(e) => {
            dragging.current = true
            ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
            seekFromEvent(e.clientX)
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setProgress((p) => Math.min(1, p + 0.02))
            if (e.key === "ArrowLeft") setProgress((p) => Math.max(0, p - 0.02))
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault()
              setPlaying((v) => !v)
            }
          }}
          className="relative cursor-pointer touch-none select-none rounded-md outline-none focus-visible:ring-2"
          style={
            {
              height: compact ? 36 : 52,
              ["--tw-ring-color" as string]: C.signal,
            } as React.CSSProperties
          }
        >
          {/* base (un-played) */}
          <Bars color={C.wave} />
          {/* played overlay, clipped to progress */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
            <div style={{ width: trackRef.current?.clientWidth ?? "100%", height: "100%" }}>
              <Bars color={C.signal} played />
            </div>
          </div>
          {/* playhead */}
          <div
            className="pointer-events-none absolute top-0 bottom-0"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
          >
            <div className="h-full w-px" style={{ background: C.signalSoft }} />
            <div
              className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: C.signalSoft, boxShadow: `0 0 12px ${C.signal}` }}
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between font-['JetBrains_Mono'] text-[11px]" style={{ color: C.textFaint }}>
          <span style={{ color: playing ? C.signal : C.textFaint }}>{fmt(current)}</span>
          <span>{episode.duration}</span>
        </div>
      </div>
    </div>
  )
}
