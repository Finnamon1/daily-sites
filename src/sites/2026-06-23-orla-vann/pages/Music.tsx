import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Kicker, Label, RELEASES, ALBUM } from "../shared"
import { Page } from "./Page"

export function Music() {
  const [open, setOpen] = useState<string | null>("Glasswork")

  return (
    <Page>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Kicker>Discography</Kicker>
          <h1 className="mt-5 max-w-2xl font-['Bricolage_Grotesque'] text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">
            Everything, in order of the dark it was made in.
          </h1>
        </Reveal>

        {/* featured release — hover image-reveal duotone cover */}
        <Reveal delay={0.05}>
          <div className="group relative mt-14 grid gap-8 overflow-hidden rounded-2xl border border-white/10 bg-[#10131a] p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr]">
            <TiltCard max={6} className="self-center">
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img
                  src={ALBUM.cover}
                  alt="Glasswork album cover"
                  width={900}
                  height={900}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-[filter] duration-500 [filter:grayscale(0.5)_contrast(1.05)] group-hover:[filter:grayscale(0)_contrast(1.05)]"
                />
              </div>
            </TiltCard>
            <div className="self-center">
              <Label className="text-[#c5f24c]">Latest · {ALBUM.year}</Label>
              <h2 className="mt-3 font-['Bricolage_Grotesque'] text-4xl font-extrabold tracking-[-0.03em]">
                {ALBUM.title}
              </h2>
              <p className="mt-3 max-w-md font-['Hanken_Grotesk'] leading-relaxed text-[#e9ebe6]/65">
                {ALBUM.blurb}
              </p>
              <ol className="mt-6 columns-2 gap-x-8">
                {ALBUM.tracks.map((t) => (
                  <li
                    key={t.n}
                    className="flex items-baseline gap-2 break-inside-avoid py-1 font-['Hanken_Grotesk'] text-sm text-[#e9ebe6]/75"
                  >
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#e9ebe6]/35">
                      {String(t.n).padStart(2, "0")}
                    </span>
                    {t.name}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* the rest — accordion list */}
        <div className="mt-12 border-t border-white/10">
          {RELEASES.map((r, i) => {
            const isOpen = open === r.title
            return (
              <Reveal key={r.title} delay={i * 0.05}>
                <div className="border-b border-white/10">
                  <button
                    onClick={() => setOpen(isOpen ? null : r.title)}
                    className="group flex w-full items-center gap-5 py-6 text-left"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/10">
                      <img
                        src={`https://picsum.photos/seed/${r.seed}/200/200`}
                        alt={`${r.title} cover art`}
                        width={200}
                        height={200}
                        loading="lazy"
                        className="h-full w-full object-cover [filter:grayscale(0.4)]"
                      />
                    </div>
                    <span className="w-16 font-['JetBrains_Mono'] text-xs text-[#e9ebe6]/45">
                      {r.year}
                    </span>
                    <span className="flex-1 font-['Bricolage_Grotesque'] text-2xl font-bold tracking-[-0.02em] transition-colors group-hover:text-[#c5f24c] sm:text-3xl">
                      {r.title}
                    </span>
                    <Label className="hidden text-[#e9ebe6]/45 sm:block">
                      {r.kind} · {r.cuts} cuts
                    </Label>
                    <ChevronDown
                      className={`h-5 w-5 text-[#e9ebe6]/45 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#c5f24c]" : ""
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pb-6 pl-[76px] font-['Hanken_Grotesk'] text-sm leading-relaxed text-[#e9ebe6]/60">
                        {r.note}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Page>
  )
}
