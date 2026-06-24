import { useState } from "react"
import { Check, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Stat, Panel, Kicker } from "../lib"

const TIERS = [
  {
    name: "Solo",
    monthly: 0,
    blurb: "For founders reading their own numbers.",
    features: ["Up to $5k MRR tracked", "Live MRR & churn", "1 data source", "30-day history"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    monthly: 49,
    blurb: "When the spreadsheet stops keeping up.",
    features: [
      "Unlimited MRR tracked",
      "Cohorts & retention curves",
      "5 data sources",
      "Slack & email alerts",
      "Full history + CSV export",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    monthly: 149,
    blurb: "For teams with a board to answer to.",
    features: [
      "Everything in Growth",
      "Forecasting & runway",
      "Unlimited sources & seats",
      "Anomaly detection",
      "SAML SSO · SOC 2 report",
    ],
    cta: "Talk to us",
    featured: false,
  },
]

const FAQ = [
  {
    q: "How does annual billing work?",
    a: "Pay for ten months, get twelve. Switch the toggle and every price updates — you're billed once a year and can downgrade at renewal.",
  },
  {
    q: "What counts as a data source?",
    a: "Any billing system or ledger you connect: Stripe, Paddle, Chargebee, a Google Sheet, or our API. Solo includes one; Growth, five.",
  },
  {
    q: "Is my revenue data secure?",
    a: "We're SOC 2 Type II. Data is encrypted in transit and at rest, and we only ever request read access to your billing provider.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from the dashboard in two clicks. Your data export stays available for 60 days after you leave.",
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <Reveal>
          <Kicker>Pricing</Kicker>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mx-auto mt-4 max-w-2xl font-['Bricolage_Grotesque'] text-[40px] font-bold leading-tight tracking-tight text-[#f3f4f6] sm:text-[52px]">
            Priced like a spreadsheet. Reads like a CFO.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-md text-[16px] text-[#a6aeba]">
            Start free under $5k MRR. Upgrade the day your numbers get interesting.
          </p>
        </Reveal>

        {/* billing toggle — prices count-up on switch */}
        <Reveal delay={0.18}>
          <div className="mt-8 inline-flex items-center gap-3">
            <span className={`text-[14px] ${!annual ? "text-[#e7e9ec]" : "text-[#8a93a1]"}`}>Monthly</span>
            <button
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual billing"
              onClick={() => setAnnual((v) => !v)}
              className={`relative h-7 w-12 rounded-full border border-white/10 transition-colors duration-200 ${
                annual ? "bg-[#f0b429]" : "bg-white/[0.06]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#0c0e12] transition-all duration-200 ${
                  annual ? "left-[26px]" : "left-0.5"
                }`}
              />
            </button>
            <span className={`text-[14px] ${annual ? "text-[#e7e9ec]" : "text-[#8a93a1]"}`}>
              Annual <span className="text-[#f0b429]">· save 17%</span>
            </span>
          </div>
        </Reveal>
      </div>

      {/* tiers — featured card is taller/highlighted (not 3 identical) */}
      <div className="mt-12 grid items-start gap-5 md:grid-cols-3">
        {TIERS.map((t, i) => {
          const price = annual ? Math.round(t.monthly * 10) : t.monthly
          return (
            <Reveal key={t.name} delay={i * 0.06}>
              <Panel
                className={
                  t.featured
                    ? "relative md:-mt-4 border-[#f0b429]/40 bg-gradient-to-b from-[#1a160b] to-[#11141a] shadow-[0_0_40px_-12px_rgba(240,180,41,0.35)]"
                    : ""
                }
              >
                {t.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#f0b429] px-3 py-1 font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-wider text-[#0c0e12]">
                    Most popular
                  </span>
                )}
                <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#f3f4f6]">{t.name}</h3>
                <p className="mt-1.5 text-[14px] text-[#8a93a1]">{t.blurb}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <Stat
                    key={`${t.name}-${annual}`}
                    value={price}
                    prefix="$"
                    duration={600}
                    className="font-['Bricolage_Grotesque'] text-[44px] font-bold leading-none text-[#f3f4f6]"
                  />
                  <span className="font-['IBM_Plex_Mono'] text-[13px] text-[#8a93a1]">
                    /{annual ? "yr" : "mo"}
                  </span>
                </div>

                <Magnetic strength={0.25}>
                  <button
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition-all duration-200 ${
                      t.featured
                        ? "bg-[#f0b429] text-[#0c0e12] hover:shadow-[0_0_28px_-6px_rgba(240,180,41,0.7)]"
                        : "border border-white/15 text-[#e7e9ec] hover:border-white/30 hover:bg-white/[0.03]"
                    }`}
                  >
                    {t.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </Magnetic>

                <ul className="mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#cbd1da]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f0b429]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          )
        })}
      </div>

      {/* FAQ — two columns, asymmetric from cards above */}
      <section className="mx-auto mt-24 max-w-3xl">
        <Reveal>
          <h2 className="font-['Bricolage_Grotesque'] text-[28px] font-bold tracking-tight text-[#f3f4f6]">
            Questions, answered plainly
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {FAQ.map((item) => (
            <Reveal key={item.q}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-medium text-[#e7e9ec]">
                  {item.q}
                  <span className="ml-4 text-[#f0b429] transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#a6aeba]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
