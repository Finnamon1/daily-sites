import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Kicker, Label, TOUR } from "../shared"
import { Page } from "./Page"

const STATUS: Record<string, { text: string; cls: string }> = {
  tickets: { text: "Tickets", cls: "bg-[#c5f24c] text-[#0a0c10] hover:scale-[1.04]" },
  low: { text: "Low stock", cls: "bg-[#c5f24c]/15 text-[#c5f24c] hover:bg-[#c5f24c]/25" },
  soldout: { text: "Sold out", cls: "border border-white/15 text-[#e9ebe6]/40 cursor-not-allowed" },
}

export function Tour() {
  return (
    <Page>
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <Kicker>Live · Autumn 2026</Kicker>
          <h1 className="mt-5 max-w-2xl font-['Bricolage_Grotesque'] text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">
            A patch, a tape machine, and a room kept dark.
          </h1>
          <p className="mt-5 max-w-lg font-['Hanken_Grotesk'] leading-relaxed text-[#e9ebe6]/65">
            Six nights across Europe. No support, no setlist — the modular leads
            and the room follows. Doors at 20:00.
          </p>
        </Reveal>

        <div className="mt-14 overflow-hidden rounded-2xl border border-white/10">
          {TOUR.map((d, i) => {
            const s = STATUS[d.status]
            const disabled = d.status === "soldout"
            return (
              <Reveal key={i} delay={i * 0.06}>
                <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-white/10 bg-[#0a0c10] px-5 py-5 transition-colors last:border-0 hover:bg-[#10131a] sm:px-7">
                  <div className="w-24 shrink-0 sm:w-28">
                    <Label className="text-[#c5f24c]">{d.date}</Label>
                  </div>
                  <div className="min-w-0">
                    <p className="font-['Bricolage_Grotesque'] text-xl font-bold tracking-[-0.02em] sm:text-2xl">
                      {d.city}
                    </p>
                    <p className="truncate font-['Hanken_Grotesk'] text-sm text-[#e9ebe6]/55">
                      {d.venue}
                    </p>
                  </div>
                  {disabled ? (
                    <span
                      className={`rounded-full px-5 py-2 font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.14em] ${s.cls}`}
                    >
                      {s.text}
                    </span>
                  ) : (
                    <Magnetic strength={0.2}>
                      <button
                        className={`rounded-full px-5 py-2 font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${s.cls}`}
                      >
                        {s.text}
                      </button>
                    </Magnetic>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-7 text-center">
            <p className="font-['Hanken_Grotesk'] text-[#e9ebe6]/70">
              Promoting a room that suits slow music?{" "}
              <a
                href="mailto:live@phosphor.fm"
                className="text-[#c5f24c] underline-offset-4 hover:underline"
              >
                live@phosphor.fm
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </Page>
  )
}
