import { useState } from "react"
import { Check } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { motion } from "framer-motion"
import { CTA, Eyebrow } from "../components/shared"

const PLANS = [
  {
    name: "Flatmates",
    tag: "Free, forever",
    monthly: 0,
    yearly: 0,
    blurb: "For the household that just needs the maths to stop being a thing.",
    features: ["Up to 4 people", "Unlimited expenses", "Even & share splits", "Web, iOS & Android"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Household+",
    tag: "Most popular",
    monthly: 3,
    yearly: 30,
    blurb: "For bigger places, receipts scanning and bills that run themselves.",
    features: [
      "Up to 12 people",
      "Receipt scanning",
      "Recurring bills & reminders",
      "Exact-penny & custom splits",
      "Export to CSV",
    ],
    cta: "Start 30-day trial",
    featured: true,
  },
  {
    name: "Houses & co-ops",
    tag: "Per building",
    monthly: 9,
    yearly: 90,
    blurb: "For shared houses, co-living and anyone running money for a group.",
    features: ["Unlimited people", "Multiple sub-groups", "Admin roles", "Priority support"],
    cta: "Talk to us",
    featured: false,
  },
]

export function Pricing({ base }: { base: string }) {
  const [yearly, setYearly] = useState(true)

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="flex justify-center">
          <Eyebrow>Honest pricing</Eyebrow>
        </div>
        <h1 className="mt-5 font-['Fraunces'] text-[clamp(2.4rem,5vw,3.8rem)] font-semibold leading-[1.02] text-[#1c2b23]">
          Free for most flats. Cheap for the rest.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[16px] text-[#3c4a42]">
          No per-transaction fee, no upsell on settling up. Pay only if your household outgrows free.
        </p>

        {/* billing toggle */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-[#1c2b23]/15 bg-white p-1">
          {(["Monthly", "Yearly"] as const).map((label, i) => {
            const on = (i === 1) === yearly
            return (
              <button
                key={label}
                type="button"
                onClick={() => setYearly(i === 1)}
                className="relative rounded-full px-5 py-1.5 text-[13px] font-medium"
              >
                {on && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-[#1c2b23]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative ${on ? "text-[#f3f5ef]" : "text-[#46554c]"}`}>
                  {label}
                  {i === 1 && <span className="ml-1 font-semibold">−17%</span>}
                </span>
              </button>
            )
          })}
        </div>
      </Reveal>

      <div className="mt-12 grid items-start gap-5 md:grid-cols-3">
        {PLANS.map((p, i) => {
          const price = yearly ? p.yearly : p.monthly
          const unit = yearly ? "/yr" : "/mo"
          return (
            <Reveal key={p.name} delay={i * 0.07}>
              <article
                className={`flex h-full flex-col rounded-3xl border p-7 ${
                  p.featured
                    ? "border-transparent bg-[#1c2b23] text-[#f3f5ef] md:-mt-3 md:pb-10"
                    : "border-[#1c2b23]/12 bg-white text-[#1c2b23]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-['Fraunces'] text-xl font-semibold">{p.name}</h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      p.featured ? "bg-[#f3f5ef] text-[#1c2b23]" : "bg-[#eef1ea] text-[#46554c]"
                    }`}
                  >
                    {p.tag}
                  </span>
                </div>
                <p
                  className={`mt-3 text-[13px] leading-relaxed ${
                    p.featured ? "text-[#9db0a4]" : "text-[#46554c]"
                  }`}
                >
                  {p.blurb}
                </p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="font-['IBM_Plex_Mono'] text-4xl font-medium">£{price}</span>
                  {price > 0 && (
                    <span className={p.featured ? "text-[#9db0a4]" : "text-[#46554c]"}>{unit}</span>
                  )}
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[14px]">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#e7613a]"
                        strokeWidth={2.4}
                      />
                      <span className={p.featured ? "text-[#dfe6df]" : "text-[#3c4a42]"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <CTA
                    to={`${base}`}
                    className={`w-full ${
                      p.featured
                        ? "bg-[#f3f5ef] text-[#1c2b23] hover:bg-white"
                        : ""
                    }`}
                    variant={p.featured ? "solid" : "outline"}
                  >
                    {p.cta}
                  </CTA>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mx-auto mt-12 max-w-md text-center text-[13px] text-[#46554c]">
        Prices in GBP, VAT included. Cancel any time — your data exports cleanly to CSV on the way
        out.
      </Reveal>
    </div>
  )
}
