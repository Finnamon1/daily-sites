import { useState } from "react"
import { useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Cta, Eyebrow, Up, body, display, mono } from "../shared"
import { lines } from "../data"
import { RouteMap } from "../map"

export function RoutesPage() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16">
        <Up>
          <Eyebrow>The network</Eyebrow>
        </Up>
        <Up delay={0.06}>
          <h1 className={cn("mt-6 max-w-3xl text-[clamp(2.2rem,5.5vw,3.8rem)] font-extrabold leading-[1] tracking-[-0.02em]", display)}>
            Five overnight lines, drawn the scenic way.
          </h1>
        </Up>
        <Up delay={0.12}>
          <p className={cn("mt-6 max-w-xl text-[18px] leading-relaxed text-[#3c4654]", body)}>
            Every Vesper route is chosen for the morning it gives you, not the
            minutes it saves. Hover a line to trace it across the map.
          </p>
        </Up>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          {/* map */}
          <Up className="lg:sticky lg:top-24">
            <div className="aspect-[100/88] overflow-hidden rounded-2xl border border-[#14202b]/15 shadow-[0_40px_70px_-40px_rgba(20,32,43,0.5)]">
              <RouteMap active={active} />
            </div>
          </Up>

          {/* list */}
          <div className="divide-y divide-[#14202b]/12 border-y border-[#14202b]/12">
            {lines.map((l, i) => (
              <Up key={l.name} delay={i * 0.05}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group block w-full py-7 text-left transition-colors duration-200"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className={cn("text-[11px] uppercase tracking-[0.26em] text-[#bf3a1c]", mono)}>
                      {l.name}
                    </span>
                    <span className={cn("text-[12px] uppercase tracking-[0.16em] text-[#51596a]", mono)}>
                      {l.hours}h · {l.nights} night
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-3 flex items-baseline gap-3 text-[clamp(1.5rem,4vw,2.4rem)] font-bold tracking-[-0.01em] transition-colors duration-200",
                      display,
                      active === i ? "text-[#bf3a1c]" : "text-[#14202b]",
                    )}
                  >
                    {l.from}
                    <span className="text-[#bf3a1c] transition-transform duration-200 group-hover:translate-x-1">→</span>
                    {l.to}
                  </div>
                  <p className={cn("mt-3 max-w-lg text-[16px] leading-relaxed text-[#51596a]", body)}>
                    {l.blurb}
                  </p>
                  <div className={cn("mt-4 flex flex-wrap gap-x-2 gap-y-1 text-[12px] uppercase tracking-[0.14em] text-[#8a92a1]", mono)}>
                    {[l.from, ...l.via, l.to].map((stop, j, arr) => (
                      <span key={stop + j}>
                        {stop}
                        {j < arr.length - 1 && <span className="px-1.5 text-[#bf3a1c]/60">·</span>}
                      </span>
                    ))}
                  </div>
                </button>
              </Up>
            ))}
          </div>
        </div>

        <Up className="mt-16">
          <div className="flex flex-col items-start gap-5 rounded-2xl bg-[#14202b] p-8 text-[#dfe4ec] sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className={cn("text-2xl font-bold text-[#f3ede1]", display)}>
                Building a longer itinerary?
              </h2>
              <p className={cn("mt-2 max-w-md text-[15px] text-[#aeb7c5]", body)}>
                Chain two lines with a day in between — Paris to Venice, then on
                to Split — and we&rsquo;ll hold a daytime room for the layover.
              </p>
            </div>
            <Cta to={`${base}/fares`}>Plan & book</Cta>
          </div>
        </Up>
      </section>
    </>
  )
}
