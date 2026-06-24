import { useState } from "react"
import { useParams } from "react-router-dom"
import { Check, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Cta, Eyebrow, SplitFlapBoard, Up, body, display, mono } from "../shared"
import type { Departure } from "../shared"

const fares = [
  {
    name: "Saver",
    price: "€69",
    note: "Couchette berth",
    perks: ["Shared 4-berth couchette", "Breakfast included", "1 cabin bag", "Changes for a €15 fee"],
  },
  {
    name: "Comfort",
    price: "€129",
    note: "Private single cabin",
    perks: ["Private locking cabin", "Dinner + breakfast", "2 bags + bike space", "Free changes up to 48h", "Lounge access at departure"],
    feature: true,
  },
  {
    name: "Suite",
    price: "€249",
    note: "En-suite double",
    perks: ["En-suite double suite", "Dinner in-suite option", "Unlimited bags", "Fully flexible & refundable", "Priority boarding & late checkout"],
  },
]

const timetable: Departure[] = [
  { dest: "Lisbon", time: "21:14", via: "Madrid", status: "Daily" },
  { dest: "Venice", time: "20:02", via: "Milan", status: "Daily" },
  { dest: "Split", time: "22:18", via: "Zagreb", status: "Tue-Sun" },
  { dest: "Stockholm", time: "18:47", via: "Hambrg", status: "Daily" },
  { dest: "Edinburgh", time: "19:05", via: "York", status: "Daily" },
]

const faqs = [
  {
    q: "When does the bed get made up?",
    a: "While you're at dinner. The attendant turns your cabin from day to night mode between 20:30 and 22:00 — you come back to a made-up berth, curtains drawn and water on the side.",
  },
  {
    q: "Can I bring my bike?",
    a: "Yes. Comfort and Suite fares include a reserved bike hook in the luggage van at no extra cost. Saver fares can add one for €12 at booking, subject to space.",
  },
  {
    q: "What if my train is delayed or cancelled?",
    a: "If we cancel, you're rebooked on the next service or fully refunded — your choice. For delays over 60 minutes on arrival we refund 25% of the fare automatically to your card.",
  },
  {
    q: "Are the cabins accessible?",
    a: "Every train has two step-free accessible cabins with a wider door, grab rails and an en-suite. Book by phone at least 48 hours ahead and we'll arrange platform assistance at both ends.",
  },
]

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#14202b]/12">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className={cn("text-[17px] font-semibold tracking-tight text-[#14202b]", display)}>{q}</span>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#14202b]/20 text-[#bf3a1c]">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <p className={cn("min-h-0 max-w-2xl text-[16px] leading-relaxed text-[#51596a]", body)}>{a}</p>
      </div>
    </div>
  )
}

export function Fares() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <Up>
          <Eyebrow>Fares &amp; berths</Eyebrow>
        </Up>
        <Up delay={0.06}>
          <h1 className={cn("mt-6 max-w-3xl text-[clamp(2.2rem,5.5vw,3.8rem)] font-extrabold leading-[1] tracking-[-0.02em]", display)}>
            One fare. Bed, dinner and the miles between.
          </h1>
        </Up>
        <Up delay={0.12}>
          <p className={cn("mt-6 max-w-xl text-[18px] leading-relaxed text-[#3c4654]", body)}>
            Prices are per person, per night, all-in. No resort fees, no seat
            selection upsell — the berth is the ticket.
          </p>
        </Up>
      </section>

      {/* fare tiers */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {fares.map((f, i) => (
            <Up key={f.name} delay={i * 0.07}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-7 transition-all duration-200 hover:-translate-y-1",
                  f.feature
                    ? "border-transparent bg-[#14202b] text-[#dfe4ec] shadow-[0_36px_70px_-40px_rgba(20,32,43,0.7)]"
                    : "border-[#14202b]/12 bg-[#fbf7ee] text-[#14202b]",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-[12px] uppercase tracking-[0.24em]", mono, f.feature ? "text-[#e2724f]" : "text-[#bf3a1c]")}>
                    {f.name}
                  </span>
                  {f.feature && (
                    <span className={cn("rounded-full bg-[#bf3a1c] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#f3ede1]", mono)}>
                      Best value
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className={cn("text-[3rem] font-extrabold leading-none tracking-tight", display)}>{f.price}</span>
                  <span className={cn("text-[13px]", mono, f.feature ? "text-[#9fa9bb]" : "text-[#51596a]")}>/night</span>
                </div>
                <p className={cn("mt-2 text-[14px] uppercase tracking-[0.14em]", mono, f.feature ? "text-[#9fa9bb]" : "text-[#51596a]")}>
                  {f.note}
                </p>
                <ul className="mt-7 flex-1 space-y-3">
                  {f.perks.map((p) => (
                    <li key={p} className={cn("flex items-start gap-2.5 text-[15px]", body, f.feature ? "text-[#dfe4ec]" : "text-[#3c4654]")}>
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", f.feature ? "text-[#e2724f]" : "text-[#bf3a1c]")} strokeWidth={2.2} />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Cta to={`${base}/routes`} variant={f.feature ? "solid" : "ghost"}>
                    Choose {f.name}
                  </Cta>
                </div>
              </div>
            </Up>
          ))}
        </div>
      </section>

      {/* timetable on a static split-flap board */}
      <section className="bg-[#14202b]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Up>
            <Eyebrow light>Tonight&rsquo;s timetable</Eyebrow>
            <h2 className={cn("mt-5 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.01em] text-[#f3ede1]", display)}>
              Every line, every night
            </h2>
          </Up>
          <Up delay={0.08} className="mt-9">
            <SplitFlapBoard rows={timetable} cycle={false} />
          </Up>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <Up>
          <Eyebrow>Before you board</Eyebrow>
          <h2 className={cn("mt-5 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.01em]", display)}>
            The usual questions
          </h2>
        </Up>
        <Up delay={0.08} className="mt-8">
          <div className="border-t border-[#14202b]/12">
            {faqs.map((f) => (
              <FaqRow key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </Up>

        <Up delay={0.12} className="mt-12">
          <div className="rounded-2xl bg-[#ece4d3] p-8 text-center">
            <h3 className={cn("text-2xl font-bold tracking-tight", display)}>Still deciding the route?</h3>
            <p className={cn("mx-auto mt-2 max-w-md text-[15px] text-[#51596a]", body)}>
              Our booking office answers in under a minute, in five languages,
              between 07:00 and 23:00 CET.
            </p>
            <div className="mt-6 flex justify-center">
              <Cta to={`${base}/routes`}>Back to the routes</Cta>
            </div>
          </div>
        </Up>
      </section>
    </>
  )
}
