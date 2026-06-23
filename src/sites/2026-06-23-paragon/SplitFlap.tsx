import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ *
 * Solari split-flap board — the featured interaction.
 *
 * Each cell flips through a short tail of the charset before settling on
 * its target glyph; a per-character delay makes a whole row cascade into
 * place like an old railway departures board. Reduced motion renders the
 * final glyph immediately with no flipping.
 * ------------------------------------------------------------------ */

const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.&'-/"
const TAIL = 6 // how many flips precede the target glyph
const STEP = 55 // ms between flips

function indexOf(ch: string) {
  const i = CHARSET.indexOf(ch.toUpperCase())
  return i < 0 ? 0 : i
}

function Cell({ target, delay }: { target: string; delay: number }) {
  const reduce = useReducedMotion()
  const targetIdx = indexOf(target)
  const [idx, setIdx] = useState(() =>
    reduce ? targetIdx : (targetIdx - TAIL + CHARSET.length) % CHARSET.length,
  )

  useEffect(() => {
    if (reduce) {
      setIdx(targetIdx)
      return
    }
    let current = (targetIdx - TAIL + CHARSET.length) % CHARSET.length
    setIdx(current)
    let alive = true
    let tick: ReturnType<typeof setTimeout>
    const advance = () => {
      if (!alive || current === targetIdx) return
      current = (current + 1) % CHARSET.length
      setIdx(current)
      tick = setTimeout(advance, STEP)
    }
    const start = setTimeout(advance, delay)
    return () => {
      alive = false
      clearTimeout(start)
      clearTimeout(tick)
    }
  }, [targetIdx, delay, reduce])

  const ch = CHARSET[idx] ?? " "
  return (
    <span className="relative inline-flex h-[1.45em] w-[0.78em] items-center justify-center overflow-hidden rounded-[2px] bg-screen-ink text-screen-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-screen-line/70 [perspective:240px]">
      {/* seam line down the middle, like real split-flap tiles */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-1/2 bg-black/55"
      />
      <motion.span
        key={ch}
        initial={reduce ? false : { rotateX: -88, opacity: 0.4 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.13, ease: "easeOut" }}
        className="block origin-center leading-none tabular-nums"
      >
        {ch === " " ? " " : ch}
      </motion.span>
    </span>
  )
}

/** A single padded string rendered as flap cells. */
export function FlapText({
  text,
  startDelay = 0,
  className,
}: {
  text: string
  startDelay?: number
  className?: string
}) {
  const chars = text.toUpperCase().split("")
  return (
    <span className={cn("inline-flex gap-[3px] font-['IBM_Plex_Mono']", className)}>
      {chars.map((c, i) => (
        <Cell key={i} target={c} delay={startDelay + i * 28} />
      ))}
    </span>
  )
}

function pad(s: string, n: number) {
  const up = s.toUpperCase().slice(0, n)
  return up + " ".repeat(Math.max(0, n - up.length))
}

export interface FlapRow {
  board: string
  cert: string
  time: string
}

/**
 * The home-page board: title / certificate / time, each in fixed columns so
 * the glyphs line up. The whole grid cascades, top-left to bottom-right.
 */
export function SplitFlapBoard({
  rows,
  className,
}: {
  rows: FlapRow[]
  className?: string
}) {
  const summary = rows.map((r) => `${r.board} (${r.cert}) ${r.time}`).join(", ")
  return (
    <div
      role="img"
      aria-label={`Now showing: ${summary}`}
      className={cn(
        "inline-block rounded-md bg-gradient-to-b from-[#0c0a07] to-screen-ink p-3 ring-1 ring-screen-line/80 sm:p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-[3px] text-[clamp(0.62rem,2.4vw,1.05rem)] leading-none">
        {rows.map((r, ri) => (
          <div key={r.board} className="flex items-center gap-[3px] sm:gap-2" aria-hidden>
            <FlapText text={pad(r.board, 13)} startDelay={ri * 90} />
            <FlapText text={pad(r.cert, 3)} startDelay={ri * 90 + 220} className="opacity-90" />
            <FlapText text={pad(r.time, 5)} startDelay={ri * 90 + 360} />
          </div>
        ))}
      </div>
    </div>
  )
}
