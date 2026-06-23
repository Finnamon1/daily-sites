import { useState } from "react"
import { ArrowUpRight, Check } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { C, FAQ, PLATFORMS, SUPPORT } from "../theme"
import { Kicker } from "../bits"

export function Listen() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  return (
    <div>
      {/* ── Hero + platforms ──────────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Kicker>Tune in</Kicker>
          <h1 className="mt-5 max-w-3xl font-['Fraunces'] text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.02em]" style={{ color: C.text }}>
            Wherever you keep your podcasts.
          </h1>
          <p className="mt-6 max-w-xl font-['Space_Grotesk'] text-[18px] leading-relaxed" style={{ color: C.textSoft }}>
            FATHOM is free, ad-free and in every app. Follow the show so each Tuesday's episode finds you on its own.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: C.line, background: C.line }}>
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="group flex items-center justify-between gap-4 p-6 transition-colors duration-200"
                style={{ background: C.panel }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.panelSoft)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.panel)}
              >
                <span>
                  <span className="block font-['Space_Grotesk'] text-[17px] font-semibold" style={{ color: C.text }}>{p.name}</span>
                  <span className="mt-0.5 block font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.16em]" style={{ color: C.textFaint }}>{p.note}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color: C.signal }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Support tiers ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <Kicker>Keep it ad-free</Kicker>
          <h2 className="mt-5 max-w-2xl font-['Fraunces'] text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.01em]" style={{ color: C.text }}>
            Members decide what we're allowed to say. Which is: anything.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SUPPORT.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className="flex h-full flex-col rounded-3xl border p-7"
                style={{
                  borderColor: t.featured ? C.signal : C.line,
                  background: t.featured ? C.panelSoft : C.panel,
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-['Space_Grotesk'] text-[18px] font-semibold" style={{ color: C.text }}>{t.name}</h3>
                  {t.featured && (
                    <span className="rounded-full px-3 py-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em]" style={{ background: C.signal, color: C.ground }}>
                      Most join here
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-['Fraunces'] text-[44px] font-semibold leading-none" style={{ color: t.featured ? C.signal : C.text }}>{t.price}</span>
                  <span className="font-['JetBrains_Mono'] text-[12px]" style={{ color: C.textFaint }}>{t.cadence}</span>
                </div>
                <ul className="mt-6 mb-7 flex-1 space-y-3">
                  {t.perks.map((perk) => (
                    <li key={perk} className="flex gap-3 font-['Space_Grotesk'] text-[15px]" style={{ color: C.textSoft }}>
                      <Check className="mt-0.5 h-[18px] w-[18px] shrink-0" style={{ color: C.signal }} />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Magnetic strength={0.25}>
                  <button
                    className="w-full rounded-full py-3 font-['Space_Grotesk'] text-[15px] font-semibold transition-transform duration-200"
                    style={
                      t.featured
                        ? { background: C.signal, color: C.ground }
                        : { background: "transparent", color: C.text, border: `1px solid ${C.line}` }
                    }
                  >
                    Become a {t.name}
                  </button>
                </Magnetic>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Newsletter + FAQ ──────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: C.line, background: C.panel }}>
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-2">
          {/* newsletter */}
          <Reveal>
            <Kicker>The field notes</Kicker>
            <h2 className="mt-5 font-['Fraunces'] text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.01em]" style={{ color: C.text }}>
              One Sunday email between seasons.
            </h2>
            <p className="mt-4 max-w-md font-['Space_Grotesk'] text-[16px] leading-relaxed" style={{ color: C.textSoft }}>
              What we're chasing next, what didn't make the cut, and the tape that gave us chills. No spam, unsubscribe in a tap.
            </p>

            <form
              className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                if (email.trim()) setSent(true)
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                disabled={sent}
                className="flex-1 rounded-full border px-5 py-3 font-['Space_Grotesk'] text-[15px] outline-none transition-colors duration-200 focus:border-[color:var(--f)] disabled:opacity-60"
                style={{ background: C.ground, borderColor: C.line, color: C.text, ["--f" as string]: C.signal } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={sent}
                className="rounded-full px-6 py-3 font-['Space_Grotesk'] text-[15px] font-semibold transition-transform duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                style={{ background: sent ? C.wave : C.signal, color: sent ? C.text : C.ground }}
              >
                {sent ? "You're on the list ✓" : "Subscribe"}
              </button>
            </form>
            {sent && (
              <p className="mt-3 font-['JetBrains_Mono'] text-[12px]" style={{ color: C.signal }}>
                Welcome aboard. Check your inbox for the back-issue archive.
              </p>
            )}
          </Reveal>

          {/* faq */}
          <Reveal delay={0.1}>
            <Kicker>Before you ask</Kicker>
            <Accordion type="single" collapsible className="mt-5">
              {FAQ.map((f) => (
                <AccordionItem key={f.q} value={f.q} style={{ borderColor: C.line }}>
                  <AccordionTrigger className="py-5 text-left font-['Space_Grotesk'] text-[17px] font-medium hover:no-underline" style={{ color: C.text }}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 font-['Space_Grotesk'] text-[15px] leading-relaxed" style={{ color: C.textSoft }}>
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
