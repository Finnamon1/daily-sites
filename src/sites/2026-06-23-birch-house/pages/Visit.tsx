import { Link, useParams } from "react-router-dom"
import { Clock, MapPin, Train, Check } from "lucide-react"
import { C, PLANS, FAQ } from "../theme"
import { Kicker, Section } from "../ui"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const BRING = ["A swimsuit — required in every room", "Yourself, ten minutes early", "An appetite for the cold"]
const SKIP = ["Towels, robe and sandals — we have them", "Your phone — lockers are free", "Anywhere else to be"]

export function Visit() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div>
      <Section className="pt-16 pb-12 md:pt-24">
        <Kicker>Plan your visit</Kicker>
        <h1 className="mt-6 max-w-2xl font-['Spectral'] text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.0] tracking-[-0.02em]">
          An old ice house on the east side.
        </h1>
      </Section>

      {/* info trio */}
      <Section className="pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Clock, title: "Hours", lines: ["Tue – Sun · 7am – 10pm", "Last entry 8:30pm", "Closed Mondays"] },
            { icon: MapPin, title: "Where", lines: ["114 SE Alder St", "Central Eastside", "Portland, Oregon"] },
            { icon: Train, title: "Getting here", lines: ["MAX Blue/Red — Grand Ave", "Bike parking out front", "Street parking after 6pm"] },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border p-7" style={{ borderColor: C.line, background: C.boneSoft }}>
                <card.icon className="h-6 w-6" style={{ color: C.emberText }} strokeWidth={1.6} />
                <h2 className="mt-4 font-['Spectral'] text-[1.4rem] font-medium">{card.title}</h2>
                <div className="mt-3 space-y-1.5">
                  {card.lines.map((l) => (
                    <p key={l} className="font-['Hanken_Grotesk'] text-[15px] leading-[1.5]" style={{ color: C.inkSoft }}>{l}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* what to bring */}
      <Section className="pb-20">
        <Reveal>
          <div className="grid gap-10 rounded-[1.4rem] border p-8 md:grid-cols-2 md:p-12" style={{ borderColor: C.line }}>
            <BringList title="Bring" items={BRING} tone="warm" />
            <BringList title="Leave at home" items={SKIP} tone="cold" />
          </div>
        </Reveal>
      </Section>

      {/* membership / plans */}
      <div style={{ background: C.char }}>
        <Section className="py-20 md:py-24">
          <Reveal>
            <Kicker cold>Ways in</Kicker>
            <h2 className="mt-5 max-w-xl font-['Spectral'] text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-[1.08]" style={{ color: C.bone }}>
              Come once, or make it a habit.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.07}>
                <div
                  className="relative flex h-full flex-col rounded-2xl border p-7"
                  style={{
                    borderColor: p.featured ? C.emberOnDark : "rgba(244,238,228,0.16)",
                    background: p.featured ? "rgba(227,136,76,0.08)" : C.charSoft,
                  }}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-7 rounded-full px-3 py-1 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.16em]" style={{ background: C.emberOnDark, color: C.char }}>
                      Most popular
                    </span>
                  )}
                  <h3 className="font-['Spectral'] text-[1.4rem] font-medium" style={{ color: C.bone }}>{p.name}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-['Spectral'] text-[2.4rem] font-medium" style={{ color: C.bone }}>{p.price}</span>
                    <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.12em]" style={{ color: "rgba(244,238,228,0.55)" }}>{p.cadence}</span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 font-['Hanken_Grotesk'] text-[14.5px] leading-[1.5]" style={{ color: "rgba(244,238,228,0.8)" }}>
                        <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.emberOnDark }} /> {perk}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`${base}/booking`}
                    className="mt-7 rounded-full py-3 text-center font-['Hanken_Grotesk'] text-[14.5px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                    style={p.featured ? { background: C.emberOnDark, color: C.char } : { border: "1px solid rgba(244,238,228,0.24)", color: C.bone }}
                  >
                    {p.featured ? "Become a member" : "Choose"}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* FAQ */}
      <Section className="py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <Kicker>Before you come</Kicker>
              <h2 className="mt-5 font-['Spectral'] text-[clamp(1.9rem,4vw,2.6rem)] font-medium leading-[1.08]">Questions, answered.</h2>
              <p className="mt-4 max-w-xs font-['Hanken_Grotesk'] text-[15.5px] leading-[1.65]" style={{ color: C.inkSoft }}>
                Still wondering something? Write to us at hello@birchhouse.bath — a real person reads it.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`q${i}`} className="border-b" style={{ borderColor: C.line }}>
                  <AccordionTrigger className="py-5 text-left font-['Spectral'] text-[1.15rem] font-medium hover:no-underline" style={{ color: C.ink }}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 font-['Hanken_Grotesk'] text-[15px] leading-[1.65]" style={{ color: C.inkSoft }}>
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Section>

      {/* closing */}
      <Section className="pb-24">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-[1.5rem] border px-8 py-14 text-center" style={{ borderColor: C.line, background: C.boneSoft }}>
            <h2 className="max-w-xl font-['Spectral'] text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-[1.06]">See you when the rain starts.</h2>
            <Magnetic strength={0.4}>
              <Link to={`${base}/booking`} className="rounded-full px-8 py-4 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-transform duration-200" style={{ background: C.ember, color: "#fbf3e9" }}>
                Book a soak
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </Section>
    </div>
  )
}

function BringList({ title, items, tone }: { title: string; items: string[]; tone: "warm" | "cold" }) {
  const accent = tone === "warm" ? C.emberText : C.steelText
  return (
    <div>
      <h3 className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em]" style={{ color: accent }}>{title}</h3>
      <ul className="mt-5 space-y-4">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3 font-['Hanken_Grotesk'] text-[16px] leading-[1.5]" style={{ color: C.ink }}>
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
