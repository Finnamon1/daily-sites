import { useParams } from "react-router-dom"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { TiltCard } from "@/components/fx/TiltCard"
import { Cta, Eyebrow, Up, body, display, mono } from "../shared"

const cabins = [
  {
    name: "The Couchette",
    price: "€69",
    seed: "vesper-couchette-bunk",
    tag: "Shared · 4 berths",
    desc: "A friendly four-berth compartment with fold-down bunks, a shared washbasin and your own reading light. The way Europe has slept on trains for a century.",
    feats: ["Fold-flat berth + linen", "Shared compartment", "Breakfast included", "Power at every bunk"],
  },
  {
    name: "The Single",
    price: "€129",
    seed: "vesper-single-cabin-window",
    tag: "Private · 1 guest",
    desc: "A private cabin that converts from armchair to made-up bed while you're at dinner. Wide window, fold-out desk, and a door that's yours alone.",
    feats: ["Private locking cabin", "Armchair → full bed", "In-cabin basin", "Coffee on arrival"],
    feature: true,
  },
  {
    name: "The Suite",
    price: "€249",
    seed: "vesper-suite-double-bed",
    tag: "Private · 2 guests",
    desc: "A double bed, an en-suite shower, and two armchairs angled at the window. Dinner brought to you, curtains drawn back at sunrise on request.",
    feats: ["Double bed + en-suite", "Private shower & WC", "Dinner in-suite option", "Late checkout on arrival"],
  },
]

export function Onboard() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <Up>
          <Eyebrow>Onboard</Eyebrow>
        </Up>
        <div className="mt-6 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <Up delay={0.06}>
            <h1 className={cn("text-[clamp(2.2rem,5.5vw,3.8rem)] font-extrabold leading-[1] tracking-[-0.02em]", display)}>
              Three ways to spend the night.
            </h1>
          </Up>
          <Up delay={0.12}>
            <p className={cn("text-[17px] leading-relaxed text-[#3c4654]", body)}>
              Every carriage is restored 1960s rolling stock with new beds,
              quiet brakes and a dining car at the centre. Choose how private
              you&rsquo;d like to be.
            </p>
          </Up>
        </div>
      </section>

      {/* cabins */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {cabins.map((c, i) => (
            <Up key={c.name} delay={i * 0.07}>
              <TiltCard
                max={7}
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-2xl border bg-[#fbf7ee]",
                  c.feature ? "border-[#bf3a1c]/60 shadow-[0_30px_60px_-34px_rgba(191,58,28,0.5)]" : "border-[#14202b]/12",
                )}
              >
                <div className="group relative aspect-[4/3] overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${c.seed}/640/480`}
                    alt={`Interior of the ${c.name} cabin aboard a Vesper sleeper`}
                    width={640}
                    height={480}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[0.35] transition-all duration-300 will-change-transform group-hover:scale-[1.04] group-hover:!grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14202b]/55 via-transparent to-transparent" />
                  {c.feature && (
                    <span className={cn("absolute right-3 top-3 rounded-full bg-[#bf3a1c] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#f3ede1]", mono)}>
                      Most booked
                    </span>
                  )}
                  <span className={cn("absolute bottom-3 left-3 text-[11px] uppercase tracking-[0.2em] text-[#f3ede1]/90", mono)}>
                    {c.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className={cn("text-xl font-bold tracking-tight", display)}>{c.name}</h3>
                    <span className={cn("text-[15px] text-[#51596a]", mono)}>
                      <span className="font-semibold text-[#14202b]">{c.price}</span>
                      <span className="text-[12px]"> /night</span>
                    </span>
                  </div>
                  <p className={cn("mt-3 text-[15px] leading-relaxed text-[#51596a]", body)}>{c.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {c.feats.map((f) => (
                      <li key={f} className={cn("flex items-center gap-2.5 text-[14px] text-[#3c4654]", body)}>
                        <Check className="h-4 w-4 shrink-0 text-[#bf3a1c]" strokeWidth={2.2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-2">
                    <Cta to={`${base}/fares`} variant={c.feature ? "solid" : "ghost"}>
                      Reserve {c.name.replace("The ", "")}
                    </Cta>
                  </div>
                </div>
              </TiltCard>
            </Up>
          ))}
        </div>
      </section>

      {/* dining car feature */}
      <section className="bg-[#ece4d3]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center">
          <Up>
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://picsum.photos/seed/vesper-dining-car-table/520/640"
                alt="Laid table in the Vesper dining car at dusk"
                width={520}
                height={640}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-xl object-cover"
              />
              <img
                src="https://picsum.photos/seed/vesper-night-window-coffee/520/520"
                alt="Coffee on a fold-out cabin table as the landscape passes"
                width={520}
                height={520}
                loading="lazy"
                className="mt-10 aspect-square w-full rounded-xl object-cover"
              />
            </div>
          </Up>
          <Up delay={0.08}>
            <Eyebrow>The dining car</Eyebrow>
            <h2 className={cn("mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.05] tracking-[-0.01em]", display)}>
              A short menu, cooked to the route you&rsquo;re on.
            </h2>
            <p className={cn("mt-5 max-w-md text-[17px] leading-relaxed text-[#3c4654]", body)}>
              On the Lusitania it&rsquo;s a bowl of caldo verde and a glass of
              vinho verde; on the Adriatic, grilled fish and a Plavac Mali. Three
              courses, two wines, one sitting — then back to your cabin, made up
              and waiting.
            </p>
            <ul className={cn("mt-7 space-y-3 border-t border-[#14202b]/15 pt-6 text-[15px] text-[#3c4654]", body)}>
              {[
                "Dinner service from 20:30, last sitting 22:00",
                "Regional, seasonal, mostly within 100km of the line",
                "Vegetarian and halal menus on every service",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#bf3a1c]" />
                  {t}
                </li>
              ))}
            </ul>
          </Up>
        </div>
      </section>
    </>
  )
}
