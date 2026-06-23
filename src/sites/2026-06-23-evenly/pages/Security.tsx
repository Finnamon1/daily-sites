import { ShieldCheck, KeyRound, EyeOff, Download } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CTA, Eyebrow } from "../components/shared"

const PILLARS = [
  {
    icon: EyeOff,
    title: "No bank login, ever",
    body: "Evenly never sees your account. You record what you spent; you pay each other through your own bank. There's nothing for us to leak.",
  },
  {
    icon: KeyRound,
    title: "Encrypted end to end",
    body: "Balances and notes are encrypted in transit and at rest. Only the people in your household can read them.",
  },
  {
    icon: Download,
    title: "Your data leaves cleanly",
    body: "Export everything to CSV in two taps and delete your household for good. No dark-pattern off-boarding.",
  },
]

const FAQ = [
  {
    q: "Do you connect to my bank?",
    a: "No. Evenly is a ledger, not a payment processor. You settle up through your usual banking app and tell Evenly it's done.",
  },
  {
    q: "Can a flatmate see my other groups?",
    a: "Never. Each household is sealed off. People only see the expenses and balances of the groups you've explicitly added them to.",
  },
  {
    q: "What happens if I leave a flat?",
    a: "You can export your share of the history, settle any open balance, and remove yourself. The remaining members keep an accurate record.",
  },
  {
    q: "Is my data sold or used for ads?",
    a: "No. We make money from Household+ subscriptions, full stop. There are no ads and no data brokers in the building.",
  },
]

export function Security({ base }: { base: string }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:pt-20">
      <Reveal className="max-w-2xl">
        <Eyebrow>Trust, by design</Eyebrow>
        <h1 className="mt-5 font-['Fraunces'] text-[clamp(2.4rem,5vw,3.8rem)] font-semibold leading-[1.02] text-[#1c2b23]">
          The safest money app is one that can't touch your money.
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#3c4a42]">
          Evenly is deliberately small in what it knows. It tracks agreements between people who
          trust each other — and keeps even that locked down.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.07}>
            <article className="flex h-full flex-col rounded-3xl border border-[#1c2b23]/10 bg-white p-7">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef1ea] text-[#e7613a]">
                <p.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-['Fraunces'] text-lg font-semibold text-[#1c2b23]">
                {p.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#3c4a42]">{p.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20 grid gap-10 md:grid-cols-[0.7fr_1fr]">
        <Reveal>
          <ShieldCheck className="h-8 w-8 text-[#e7613a]" strokeWidth={1.6} />
          <h2 className="mt-4 font-['Fraunces'] text-3xl font-semibold leading-tight text-[#1c2b23]">
            The questions people actually ask.
          </h2>
          <p className="mt-3 text-[15px] text-[#3c4a42]">
            Can't find it? Write to the two people who built this.
          </p>
          <div className="mt-5">
            <CTA to={`${base}/about`} variant="outline">
              Meet the team
            </CTA>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`q${i}`}
                className="border-b border-[#1c2b23]/12"
              >
                <AccordionTrigger className="py-4 text-left font-['Fraunces'] text-[17px] font-medium text-[#1c2b23] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-[14px] leading-relaxed text-[#3c4a42]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </div>
  )
}
