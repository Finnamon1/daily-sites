import { ArrowRight, Check } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { PhoneFrame } from "../components/PhoneFrame"
import { ScreenBalance } from "../components/PhoneScreens"
import { ScrollPhone, type Step } from "../components/ScrollPhone"
import { CTA, Counter, Eyebrow } from "../components/shared"

const STEPS: Step[] = [
  {
    kicker: "Add",
    title: "Drop in what you paid",
    body: "Rent, the big shop, the boiler call-out. Snap the receipt or type a figure — Evenly remembers who usually covers what.",
  },
  {
    kicker: "Split",
    title: "Choose how it lands",
    body: "Even halves, by room share, or exact pennies. We round so nobody ends up 0.3p short and the maths is never a debate.",
  },
  {
    kicker: "Track",
    title: "See the running balance",
    body: "One quiet number tells you where you stand with each person. No spreadsheets, no group-chat archaeology.",
  },
  {
    kicker: "Settle",
    title: "Square up in a tap",
    body: "Pay back the exact amount through your own bank. Evenly just marks it done and resets everyone to zero.",
  },
]

export function Home({ base }: { base: string }) {
  return (
    <div>
      {/* HERO — asymmetric, phone off to one side */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-20">
          <div>
            <Eyebrow>Shared money, minus the friction</Eyebrow>
            <h1 className="mt-5 font-['Fraunces'] text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.01em] text-[#1c2b23]">
              The flat ledger that{" "}
              <span className="relative whitespace-nowrap">
                settles itself
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C 50 2, 150 2, 198 7"
                    fill="none"
                    stroke="#e7613a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#3c4a42]">
              Evenly tracks who paid for what across your household, splits it the way you actually
              agreed, and tells everyone one honest number. No awkward reminders.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CTA to={`${base}/pricing`}>
                Start a household <ArrowRight className="h-4 w-4" />
              </CTA>
              <CTA to={`${base}/features`} variant="outline">
                See how it works
              </CTA>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#46554c]">
              {["Free for up to 4 people", "No bank login required", "iOS · Android · web"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#e7613a]" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* hero phone, tilted and grounded on a soft slab */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[#e3e8de]" />
            <div className="mx-auto w-[230px] rotate-[3deg] md:w-[260px]">
              <PhoneFrame>
                <ScreenBalance />
              </PhoneFrame>
            </div>
            <div className="absolute -left-2 top-6 hidden rounded-2xl border border-[#1c2b23]/10 bg-white px-4 py-3 shadow-sm md:block">
              <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#46554c]">
                Settled this month
              </p>
              <p className="font-['Fraunces'] text-2xl font-semibold text-[#1c2b23]">£1,284</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP — animated counters */}
      <section className="border-y border-[#1c2b23]/10 bg-[#e3e8de]/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {[
            { v: <Counter to={120} suffix="k" />, l: "households balanced" },
            { v: <Counter to={4.9} decimals={1} />, l: "App Store rating" },
            { v: <Counter to={9} prefix="£" suffix="m" />, l: "squared up last year" },
            { v: <Counter to={11} suffix="s" />, l: "to log a typical split" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-3xl font-semibold text-[#1c2b23] md:text-4xl">{s.v}</p>
              <p className="mt-1 text-[13px] text-[#46554c]">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — the featured scroll-scrubbed phone */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <Eyebrow>From shop to settled</Eyebrow>
          <h2 className="mt-4 font-['Fraunces'] text-4xl font-semibold leading-tight text-[#1c2b23] md:text-5xl">
            Four taps from a receipt to nobody owing anybody.
          </h2>
        </Reveal>
        <div className="mt-12">
          <ScrollPhone steps={STEPS} />
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-[#1c2b23] text-[#f3f5ef]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <Reveal>
            <p className="font-['Fraunces'] text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-snug">
              “We stopped having the rent conversation. It just{" "}
              <span className="text-[#e7613a]">happens</span> now — Evenly sends one number on the
              1st and we sort it before the kettle's boiled.”
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f3d9cd] font-['Fraunces'] font-semibold text-[#1c2b23]">
                P
              </span>
              <div>
                <p className="text-[14px] font-semibold">Priya N.</p>
                <p className="text-[13px] text-[#9db0a4]">four-person flat, Bristol</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-['Fraunces'] text-4xl font-semibold leading-tight text-[#1c2b23] md:text-5xl">
            Set up your household in under a minute.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] text-[#3c4a42]">
            Invite the people you live with by link. No card, no bank connection, no nagging.
          </p>
          <div className="mt-8 flex justify-center">
            <CTA to={`${base}/pricing`}>
              Get Evenly free <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
