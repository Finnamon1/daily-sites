import { Link, useParams } from "react-router-dom"
import { Check, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Spotlight } from "@/components/fx/Spotlight"

const tiers = [
  {
    name: "Floor",
    price: "€28",
    note: "General entry",
    perks: ["Entry from 16:00", "All three spaces", "Cloakroom & water bar"],
    highlight: false,
  },
  {
    name: "Patron",
    price: "€54",
    note: "Keeps the lights on",
    perks: [
      "Everything in Floor",
      "Early entry at 15:30",
      "A risograph print, numbered",
      "Name in the closing credits roll",
    ],
    highlight: true,
  },
  {
    name: "Workshop",
    price: "€40",
    note: "Hands on the gear",
    perks: ["Entry from 16:00", "One afternoon workshop seat", "Modular or shaders — you pick"],
    highlight: false,
  },
]

export function Tickets() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.3em] text-[#c8f135]">220 passes, total</p>
        <h1 className="mt-4 font-['Space_Grotesk'] text-5xl font-bold tracking-tight md:text-6xl">
          Pick a way in
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#cfd3ca]">
          We run at cost, so every tier just covers the room, the gear hire and the artists' travel. When 220
          are gone, they're gone — there's no door sale for a cistern this size.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <Spotlight
              color={t.highlight ? "rgba(200,241,53,0.16)" : "rgba(255,255,255,0.08)"}
              size={320}
              className={`flex h-full flex-col rounded-2xl border p-7 ${
                t.highlight ? "border-[#c8f135]/50 bg-[#11140c]" : "border-white/10 bg-[#0d0e12]"
              }`}
            >
              {t.highlight && (
                <span className="mb-4 w-fit rounded-full bg-[#c8f135] px-3 py-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#0a0b0e]">
                  Most chosen
                </span>
              )}
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold">{t.name}</h2>
              <p className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#8b9087]">{t.note}</p>
              <div className="mt-6 font-['Space_Grotesk'] text-5xl font-bold text-[#c8f135]">{t.price}</div>
              <ul className="mt-6 flex-1 space-y-3">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-[#cfd3ca]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c8f135]" strokeWidth={2.5} />
                    {p}
                  </li>
                ))}
              </ul>
              <Magnetic strength={0.25}>
                <button
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-['Space_Grotesk'] font-semibold transition-colors duration-200 ${
                    t.highlight
                      ? "bg-[#c8f135] text-[#0a0b0e] hover:bg-[#d6f95e]"
                      : "border border-white/15 text-[#f3f4ef] hover:border-[#c8f135] hover:text-[#c8f135]"
                  }`}
                >
                  Claim {t.name} <ArrowRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </Spotlight>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-[#0d0e12] p-8 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-['Space_Grotesk'] text-xl font-semibold">Need to know the room first?</h3>
            <p className="mt-1 text-sm text-[#a3a8a0]">
              It's underground, low-lit and acoustically strange — in the best way. Read the venue notes.
            </p>
          </div>
          <Link
            to={`${base}/venue`}
            className="shrink-0 font-['JetBrains_Mono'] text-sm uppercase tracking-wider text-[#c8f135] hover:underline"
          >
            Venue & access →
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
