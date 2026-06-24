import { useParams } from "react-router-dom"
import { Moon, Coffee, Leaf, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Counter,
  Cta,
  Eyebrow,
  SplitFlapBoard,
  Up,
  body,
  display,
  mono,
} from "../shared"
import { board, lines } from "../data"

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <div>
            <Up>
              <Eyebrow>Sleeper trains · since 1987, revived 2026</Eyebrow>
            </Up>
            <Up delay={0.06}>
              <h1 className={cn("mt-6 text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]", display)}>
                Fall asleep in
                <br />
                one city.
                <br />
                <span className="text-[#bf3a1c]">Wake in another.</span>
              </h1>
            </Up>
            <Up delay={0.12}>
              <p className={cn("mt-7 max-w-md text-[18px] leading-relaxed text-[#3c4654]", body)}>
                Vesper runs overnight sleepers the long way round Europe. No
                airports, no 4am alarms — just dinner, a made-up bed, and the
                continent sliding past your window in the dark.
              </p>
            </Up>
            <Up delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Cta to={`${base}/routes`}>See the routes</Cta>
                <Cta to={`${base}/fares`} variant="ghost">Fares &amp; berths</Cta>
              </div>
            </Up>
          </div>

          {/* Featured interaction: the split-flap departures board */}
          <Up delay={0.1} className="lg:justify-self-end">
            <SplitFlapBoard rows={board} />
            <p className={cn("mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-[#51596a]", mono)}>
              Live board · re-shuffles every few seconds
            </p>
          </Up>
        </div>

        {/* hairline ticker */}
        <div className="border-y border-[#14202b]/10 bg-[#ece4d3]">
          <div className={cn("mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#51596a]", mono)}>
            <span>14 cities</span>
            <span className="hidden sm:inline">·</span>
            <span>5 overnight lines</span>
            <span className="hidden sm:inline">·</span>
            <span>Dining car on every train</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[#bf3a1c]">Berths from €69</span>
          </div>
        </div>
      </section>

      {/* ---------------- WHY THE NIGHT TRAIN ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-end">
          <Up>
            <Eyebrow>Why sleep on it</Eyebrow>
            <h2 className={cn("mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.05] tracking-[-0.01em]", display)}>
              The journey is the hotel night you&rsquo;d have paid for anyway.
            </h2>
          </Up>
          <Up delay={0.08}>
            <p className={cn("text-[17px] leading-relaxed text-[#3c4654] md:pb-2", body)}>
              A berth replaces a flight, a transfer and a night&rsquo;s
              accommodation in one fare — and lands you in the centre of town,
              rested, instead of an airport on the outskirts at dawn.
            </p>
          </Up>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Moon, t: "A real bed", d: "Flat berths with proper linen, a reading lamp and a door that locks. Not a reclining seat." },
            { icon: Coffee, t: "Dinner & breakfast", d: "A dining car with a short, regional menu. Coffee delivered to your cabin before arrival." },
            { icon: Leaf, t: "An eighth of the carbon", d: "Per kilometre, the sleeper emits around one-eighth of the equivalent short-haul flight." },
            { icon: Clock, t: "Night you'd lose anyway", d: "Board at nine, sleep through the boring miles, step off in the heart of the next city." },
          ].map((f, i) => (
            <Up key={f.t} delay={i * 0.06}>
              <div className="group h-full rounded-xl border border-[#14202b]/12 bg-[#fbf7ee] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#bf3a1c]/45 hover:shadow-[0_20px_40px_-26px_rgba(20,32,43,0.45)]">
                <f.icon className="h-6 w-6 text-[#bf3a1c]" strokeWidth={1.6} />
                <h3 className={cn("mt-5 text-lg font-bold tracking-tight", display)}>{f.t}</h3>
                <p className={cn("mt-2 text-[15px] leading-relaxed text-[#51596a]", body)}>{f.d}</p>
              </div>
            </Up>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED ROUTES STRIP ---------------- */}
      <section className="bg-[#14202b] text-[#dfe4ec]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Up>
              <Eyebrow light>Three to start with</Eyebrow>
              <h2 className={cn("mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.01em] text-[#f3ede1]", display)}>
                Tonight&rsquo;s long way round
              </h2>
            </Up>
            <Up delay={0.08}>
              <Cta to={`${base}/routes`}>All five lines</Cta>
            </Up>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {lines.slice(0, 3).map((l, i) => (
              <Up key={l.name} delay={i * 0.07}>
                <article className="group flex h-full flex-col rounded-xl border border-white/10 bg-[#1b2632] p-6 transition-colors duration-200 hover:border-[#e2724f]/50">
                  <span className={cn("text-[11px] uppercase tracking-[0.24em] text-[#8c97a9]", mono)}>
                    {l.name}
                  </span>
                  <div className={cn("mt-4 flex items-baseline gap-2 text-2xl font-bold text-[#f3ede1]", display)}>
                    {l.from}
                    <span className="text-[#e2724f]">→</span>
                    {l.to}
                  </div>
                  <p className={cn("mt-4 flex-1 text-[15px] leading-relaxed text-[#aeb7c5]", body)}>
                    {l.blurb}
                  </p>
                  <div className={cn("mt-6 flex items-center gap-5 border-t border-white/10 pt-4 text-[12px] uppercase tracking-[0.16em] text-[#8c97a9]", mono)}>
                    <span>{l.hours}h</span>
                    <span>{l.nights} night</span>
                    <span>via {l.via[l.via.length - 1]}</span>
                  </div>
                </article>
              </Up>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- COUNTERS ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 border-y border-[#14202b]/12 py-12 sm:grid-cols-3">
          {[
            { v: 38, suffix: "k", label: "Berths sold last winter" },
            { v: 14, suffix: "", label: "European cities, one ticket" },
            { v: 96, suffix: "%", label: "Trains arrived on time" },
          ].map((s, i) => (
            <Up key={s.label} delay={i * 0.08} className="text-center sm:text-left">
              <div className={cn("text-[clamp(2.6rem,6vw,3.6rem)] font-extrabold leading-none tracking-tight text-[#14202b]", display)}>
                <Counter value={s.v} suffix={s.suffix} />
              </div>
              <p className={cn("mt-3 text-[14px] uppercase tracking-[0.16em] text-[#51596a]", mono)}>
                {s.label}
              </p>
            </Up>
          ))}
        </div>
      </section>
    </>
  )
}
