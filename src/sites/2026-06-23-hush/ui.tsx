import type { ReactNode } from "react"

/** Section eyebrow — mono, spruce, wide tracking. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-['IBM_Plex_Mono'] text-[12px] font-medium uppercase tracking-[0.22em] text-[#0a5a4b]">
      {children}
    </p>
  )
}

/** Inline command chip. */
export function Cmd({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-[#0f1215] px-2 py-1 font-['IBM_Plex_Mono'] text-[0.82em] text-[#7fe3c4]">
      {children}
    </code>
  )
}

/** A dark code block with a faint copy affordance label. */
export function CodeBlock({ label, lines }: { label: string; lines: { sigil?: string; text: string; dim?: boolean }[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#1b1c19]/10 bg-[#14171b]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-white/40">{label}</span>
        <span className="font-['IBM_Plex_Mono'] text-[11px] text-white/25">copy</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-['IBM_Plex_Mono'] text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={l.dim ? "text-white/35" : "text-[#eef2ee]"}>
            {l.sigil && <span className="select-none text-[#54c2a0]">{l.sigil} </span>}
            {l.text}
          </div>
        ))}
      </pre>
    </div>
  )
}
