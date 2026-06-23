import { useState } from "react"
import { Check } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Counter, Label } from "../shared"

const PLANS = [
  {
    name: "Single issue",
    price: "£8",
    cadence: "once",
    blurb: "Just No. 14. No commitment, no fuss.",
    perks: ["The Grain, posted to you", "Brown-paper wrap", "Ships within a week"],
    featured: false,
  },
  {
    name: "Year of OFFCUT",
    price: "£14",
    cadence: "per year",
    blurb: "All four issues, the moment they come off the press.",
    perks: [
      "4 issues a year",
      "First-print, hand-numbered",
      "Members-only riso prints",
      "Free postage, anywhere",
    ],
    featured: true,
  },
  {
    name: "The Bench",
    price: "£36",
    cadence: "per year",
    blurb: "For the workshop that wants spares to lend out.",
    perks: ["3 copies of each issue", "Back-catalogue PDF", "A say in next year's themes"],
    featured: false,
  },
]

const STATS = [
  { to: 9400, suffix: "", label: "subscribers" },
  { to: 38, suffix: "", label: "countries" },
  { to: 14, suffix: "", label: "issues printed" },
  { to: 0, suffix: "", label: "adverts, ever" },
]

export function Subscribe() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  return (
    <div className="mx-auto max-w-6xl px-5 pt-16">
      <Reveal>
        <Label className="text-[#c1351c]">Join the print run</Label>
        <h1 className="mt-4 max-w-3xl font-['Fraunces'] text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.025em] text-[#191510] sm:text-[4.2rem]">
          Heavy paper, four times a year.
        </h1>
        <p className="mt-5 max-w-xl font-['DM_Sans'] text-lg leading-relaxed text-[#191510]/75">
          We print exactly what we sell, then a handful more. Subscribe and your
          copy is hand-numbered before the ink has dried.
        </p>
      </Reveal>

      {/* animated counters */}
      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[#191510]/15 bg-[#191510]/15 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-[#f2ede1] px-5 py-8">
            <p className="font-['Fraunces'] text-[2.6rem] font-semibold leading-none tracking-[-0.02em] text-[#c1351c]">
              <Counter to={s.to} suffix={s.suffix} />
            </p>
            <Label className="mt-3 block text-[#191510]/70">{s.label}</Label>
          </div>
        ))}
      </div>

      {/* plans — asymmetric, middle one lifted */}
      <div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div
              className={`flex h-full flex-col rounded-sm border p-7 transition-transform duration-300 ${
                p.featured
                  ? "border-[#191510] bg-[#191510] text-[#f2ede1] md:-translate-y-3"
                  : "border-[#191510]/20 bg-[#f2ede1] text-[#191510] hover:-translate-y-1"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <Label className={p.featured ? "text-[#f2ede1]/70" : "text-[#191510]/70"}>{p.name}</Label>
                {p.featured && (
                  <span className="rounded-sm bg-[#c1351c] px-2 py-0.5">
                    <Label className="text-[#f2ede1]">Most loved</Label>
                  </span>
                )}
              </div>
              <p className="mt-5 font-['Fraunces'] text-[3rem] font-semibold leading-none tracking-[-0.02em]">
                {p.price}
                <span className={`ml-2 font-['DM_Sans'] text-sm font-normal ${p.featured ? "text-[#f2ede1]/60" : "text-[#191510]/60"}`}>
                  {p.cadence}
                </span>
              </p>
              <p className={`mt-4 font-['DM_Sans'] text-[15px] leading-relaxed ${p.featured ? "text-[#f2ede1]/75" : "text-[#191510]/75"}`}>
                {p.blurb}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#c1351c]" />
                    <span className={`font-['DM_Sans'] text-[15px] ${p.featured ? "text-[#f2ede1]/85" : "text-[#191510]/80"}`}>
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
              <Magnetic strength={0.25}>
                <button
                  className={`mt-7 w-full rounded-sm px-5 py-3 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 ${
                    p.featured
                      ? "bg-[#c1351c] text-[#f2ede1] hover:bg-[#f2ede1] hover:text-[#191510]"
                      : "bg-[#191510] text-[#f2ede1] hover:bg-[#c1351c]"
                  }`}
                >
                  Choose {p.name}
                </button>
              </Magnetic>
            </div>
          </Reveal>
        ))}
      </div>

      {/* newsletter — quieter, real form */}
      <Reveal>
        <div className="mt-20 grid gap-8 rounded-sm border border-[#191510]/20 bg-[#191510] p-8 text-[#f2ede1] sm:grid-cols-[1.3fr_1fr] sm:p-12">
          <div>
            <Label className="text-[#c1351c]">No money, just a letter</Label>
            <h2 className="mt-4 font-['Fraunces'] text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.6rem]">
              The Margin
            </h2>
            <p className="mt-3 max-w-md font-['DM_Sans'] leading-relaxed text-[#f2ede1]/75">
              A short note from the workbench every other Sunday — what we're
              making, breaking and re-gluing. No spam, unsubscribe in one click.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (email.includes("@")) setSent(true)
            }}
            className="flex flex-col justify-center gap-3"
          >
            <label htmlFor="offcut-email" className="sr-only">
              Email address
            </label>
            <input
              id="offcut-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@workshop.com"
              className="rounded-sm border border-[#f2ede1]/25 bg-transparent px-4 py-3 font-['DM_Sans'] text-[15px] text-[#f2ede1] placeholder:text-[#f2ede1]/40 focus:border-[#c1351c] focus:outline-none focus:ring-1 focus:ring-[#c1351c]"
            />
            <button
              type="submit"
              className="rounded-sm bg-[#c1351c] px-5 py-3 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#f2ede1] transition-colors duration-200 hover:bg-[#f2ede1] hover:text-[#191510]"
            >
              {sent ? "On the list — thank you" : "Send me The Margin"}
            </button>
            {sent && (
              <p className="font-['DM_Sans'] text-[13px] text-[#f2ede1]/65">
                Check your inbox for a hello from Margate.
              </p>
            )}
          </form>
        </div>
      </Reveal>
    </div>
  )
}
