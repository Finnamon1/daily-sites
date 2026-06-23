import { ShieldCheck } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Eyebrow } from "../ui"
import { guarantees, threatRows, changelog } from "../data"

export function Security() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal>
        <Eyebrow>Security model</Eyebrow>
        <h1 className="mt-3 max-w-3xl font-['Bricolage_Grotesque'] text-4xl font-bold leading-[1.02] tracking-[-0.02em] text-[#16181a] md:text-[3.2rem]">
          We designed Hush so we couldn't read your secrets if we tried.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#17191b]/75">
          Most secrets tools ask you to trust their servers. Hush asks you to trust math you can
          verify and code you can read. Here is exactly what protects your data — and what
          happens when something goes wrong.
        </p>
      </Reveal>

      {/* guarantees — tilt cards */}
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {guarantees.map((g, i) => (
          <Reveal key={g.title} delay={(i % 2) * 0.08}>
            <TiltCard max={7}>
              <div
                className="flex h-full flex-col rounded-2xl border border-[#17191b]/12 bg-[#fbfaf6] p-7 shadow-[0_18px_44px_-34px_rgba(12,40,34,0.5)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-lg bg-[#0c6e5d]/10 text-[#0a5a4b]"
                  style={{ transform: "translateZ(36px)" }}
                >
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3
                  className="mt-4 font-['Bricolage_Grotesque'] text-xl font-bold tracking-[-0.01em] text-[#16181a]"
                  style={{ transform: "translateZ(24px)" }}
                >
                  {g.title}
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#17191b]/70">{g.body}</p>
                <p className="mt-5 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider text-[#0a5a4b]">
                  {g.spec}
                </p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* threat table */}
      <Reveal>
        <h2 className="mt-20 font-['Bricolage_Grotesque'] text-2xl font-bold tracking-[-0.01em] text-[#16181a] md:text-3xl">
          What happens when it goes wrong
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#17191b]/70">
          The honest test of a secrets tool is the bad day, not the demo. Here's the blast
          radius for the failures that actually happen.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#17191b]/12">
          {threatRows.map((r, i) => (
            <div
              key={r.threat}
              className={`grid gap-1 px-6 py-5 sm:grid-cols-[1fr_1.4fr] sm:gap-8 ${
                i % 2 ? "bg-[#fbfaf6]" : "bg-[#f3efe6]"
              }`}
            >
              <span className="font-['IBM_Plex_Mono'] text-[13px] font-medium text-[#16181a]">{r.threat}</span>
              <span className="text-[14.5px] leading-relaxed text-[#17191b]/75">{r.answer}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* changelog */}
      <Reveal>
        <h2 className="mt-20 font-['Bricolage_Grotesque'] text-2xl font-bold tracking-[-0.01em] text-[#16181a] md:text-3xl">
          Recent security work
        </h2>
        <div className="mt-8 border-l border-[#17191b]/15 pl-6">
          {changelog.map((c) => (
            <div key={c.v} className="relative pb-8 last:pb-0">
              <span className="absolute -left-[31px] top-1 grid h-3 w-3 place-items-center">
                <span className="h-3 w-3 rounded-full border-2 border-[#0c6e5d] bg-[#efece4]" />
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-['Bricolage_Grotesque'] font-bold text-[#16181a]">v{c.v}</span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#17191b]/70">{c.date}</span>
              </div>
              <p className="mt-1 text-[15px] leading-relaxed text-[#17191b]/75">{c.note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
