import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

export type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "ok"; text: string }
  | { kind: "comment"; text: string }

/**
 * A faux terminal that types its script out once when scrolled into view.
 * Under reduced motion it renders the whole script instantly, blinking cursor off.
 */
export function Terminal({ lines, className }: { lines: Line[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()

  // how many lines are fully revealed, and how many chars of the active line
  const [revealed, setRevealed] = useState(0)
  const [chars, setChars] = useState(0)
  const done = revealed >= lines.length

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setRevealed(lines.length)
      return
    }
    if (revealed >= lines.length) return
    const line = lines[revealed]
    // output/ok/comment lines appear faster than typed commands
    const speed = line.kind === "cmd" ? 32 : 6
    const pauseAfter = line.kind === "cmd" ? 320 : 140

    if (chars < line.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), speed)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setRevealed((r) => r + 1)
      setChars(0)
    }, pauseAfter)
    return () => clearTimeout(t)
  }, [inView, reduce, revealed, chars, lines])

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-xl border border-white/10 bg-[#14171b] shadow-[0_24px_70px_-30px_rgba(10,40,34,0.6)] ${className ?? ""}`}
    >
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#0f1215] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#f06a5a]" />
        <span className="h-3 w-3 rounded-full bg-[#f1c14b]" />
        <span className="h-3 w-3 rounded-full bg-[#54c2a0]" />
        <span className="ml-3 font-['IBM_Plex_Mono'] text-[11px] tracking-wide text-white/35">
          hush — zsh
        </span>
      </div>

      <div className="min-h-[260px] px-5 py-5 font-['IBM_Plex_Mono'] text-[13px] leading-relaxed sm:text-sm">
        {lines.map((line, i) => {
          if (i > revealed) return null
          const text = i === revealed && !reduce ? line.text.slice(0, chars) : line.text
          const typing = i === revealed && !done && !reduce
          return (
            <div key={i} className="whitespace-pre-wrap break-words">
              {line.kind === "cmd" && <span className="text-[#54c2a0]">❯ </span>}
              <span className={lineClass(line.kind)}>{text}</span>
              {typing && (
                <motion.span
                  aria-hidden
                  className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-[#7fe3c4]"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
          )
        })}
        {done && (
          <div className="whitespace-pre-wrap">
            <span className="text-[#54c2a0]">❯ </span>
            <motion.span
              aria-hidden
              className="inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-[#7fe3c4]"
              animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function lineClass(kind: Line["kind"]) {
  switch (kind) {
    case "cmd":
      return "text-[#eef2ee]"
    case "ok":
      return "text-[#7fe3c4]"
    case "comment":
      return "text-white/40"
    default:
      return "text-white/65"
  }
}
