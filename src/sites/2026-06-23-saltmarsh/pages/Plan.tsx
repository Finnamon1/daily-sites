import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sunrise, Sun, Sunset } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"

const itinerary = [
  {
    icon: Sunrise,
    when: "Friday, late afternoon",
    title: "Arrive at Wells",
    body: "Drop bags, walk the quay, eat brown shrimp on the harbour wall while the light goes pink over the marsh.",
  },
  {
    icon: Sun,
    when: "Saturday, all day",
    title: "Cley to Blakeney",
    body: "Dawn in the reedbed hides, then the long shingle walk out to the seal colony. Carry water; there is nothing out there but birds.",
  },
  {
    icon: Sunset,
    when: "Sunday, falling tide",
    title: "Holkham, then home",
    body: "Cross the pines to the wide sands on the ebb. Time it right and you'll have a mile of beach to yourselves before the drive south.",
  },
]

const checklist = [
  "A tide table for the exact weekend (printed, not just an app)",
  "Boots that don't mind salt mud",
  "Binoculars — even cheap ones change the marsh",
  "Cash for the whelk boats and the honesty stalls",
]

export function Plan() {
  const [sent, setSent] = useState(false)

  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <span className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.3em] text-[#2f6b5e]">
            Plan a Visit
          </span>
          <h1 className="mt-3 font-['Fraunces'] text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-[#1c2321]">
            The worked-out long weekend.
          </h1>
          <p className="mt-5 font-['DM_Sans'] text-[17px] leading-relaxed text-[#1c2321]/75">
            Three days, west to east, built around the tide rather than the clock.
            Adjust freely — but let the water lead.
          </p>
        </header>

        {/* timeline */}
        <ol className="mt-14 space-y-4">
          {itinerary.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <li className="grid gap-5 rounded-sm border border-[#1c2321]/12 bg-[#efe9dc] p-6 sm:grid-cols-[auto_1fr] sm:items-start">
                <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1c2321] text-[#f6f3ec]">
                    <step.icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span className="font-['Fraunces'] text-sm font-semibold text-[#985a1f] sm:hidden">
                    Day {i + 1}
                  </span>
                </div>
                <div>
                  <div className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.2em] text-[#2f6b5e]">
                    {step.when}
                  </div>
                  <h2 className="mt-1 font-['Fraunces'] text-2xl font-semibold leading-tight text-[#1c2321]">
                    {step.title}
                  </h2>
                  <p className="mt-2 max-w-2xl font-['DM_Sans'] leading-relaxed text-[#1c2321]/75">
                    {step.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* two-up: checklist + signup */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-sm border border-[#1c2321]/12 bg-[#f6f3ec] p-7">
              <h3 className="font-['Fraunces'] text-2xl font-semibold text-[#1c2321]">
                Pack this
              </h3>
              <ul className="mt-5 space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3 font-['DM_Sans'] text-[15px] leading-relaxed text-[#1c2321]/80">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#2f6b5e]/15 text-[#2f6b5e]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-sm bg-[#1c2321] p-7 text-[#f6f3ec]">
              <h3 className="font-['Fraunces'] text-2xl font-semibold">
                Get the tide-led itinerary
              </h3>
              <p className="mt-3 font-['DM_Sans'] text-[15px] leading-relaxed text-[#cfd8d1]">
                A one-page PDF with the walks, the rooms, and a printable tide window for
                your dates. No newsletter treadmill — one email, that's it.
              </p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center gap-2 rounded-sm bg-[#2f6b5e]/25 px-4 py-3 font-['DM_Sans'] text-[15px]"
                >
                  <Check className="h-4 w-4 text-[#9fd3c4]" /> On its way. Check your inbox by the next high tide.
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <label className="sr-only" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 font-['DM_Sans'] text-[15px] text-[#f6f3ec] placeholder:text-[#8ba097] focus:border-[#2f6b5e] focus:outline-none focus:ring-2 focus:ring-[#2f6b5e]/40"
                  />
                  <Magnetic strength={0.3}>
                    <button
                      type="submit"
                      className="w-full whitespace-nowrap rounded-full bg-[#cf7a2e] px-6 py-3 font-['DM_Sans'] text-[15px] font-medium text-[#1c2321] transition-colors duration-200 hover:bg-[#e08c3e] sm:w-auto"
                    >
                      Send it
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
