import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { CTA, Eyebrow } from "../components/shared"

const TEAM = [
  {
    name: "Dani Owusu",
    role: "Design & front-end",
    seed: "evenly-dani-portrait",
    note: "Spent six years in flatshares and one very bad Google Sheet. Builds the bits you touch.",
  },
  {
    name: "Reuben Klein",
    role: "Engineering",
    seed: "evenly-reuben-portrait",
    note: "Ex-banking backend. Now allergic to anything that asks for a sort code.",
  },
]

const VALUES = [
  ["Boring on purpose", "Money software should be predictable. We'd rather be trusted than clever."],
  ["Free that stays free", "The four-person free tier isn't a trap. It's the whole point."],
  ["Small forever", "Two people, no investors steering us toward your data. That's a feature."],
]

export function About({ base }: { base: string }) {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 md:pt-20">
        <Reveal className="max-w-2xl">
          <Eyebrow>Two people, one annoyance</Eyebrow>
          <h1 className="mt-5 font-['Fraunces'] text-[clamp(2.4rem,5vw,3.8rem)] font-semibold leading-[1.02] text-[#1c2b23]">
            We built Evenly because the spreadsheet was ruining the flat.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#3c4a42]">
            It started as a tab called <span className="italic">“rent_FINAL_v3”</span> that nobody
            kept up to date. Someone always overpaid, someone always felt awkward asking. So we made
            the smallest possible tool that just tells everyone one honest number — and stops there.
          </p>
        </Reveal>
      </section>

      {/* TEAM — duotone portraits, not centered */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <article className="group flex items-center gap-5 rounded-3xl border border-[#1c2b23]/10 bg-white p-5">
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-[#e3e8de]">
                  <img
                    src={`https://picsum.photos/seed/${m.seed}/240/240`}
                    alt={`Portrait of ${m.name}`}
                    width={240}
                    height={240}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-[#e7613a] mix-blend-soft-light opacity-40 transition-opacity duration-300 group-hover:opacity-0" />
                </div>
                <div>
                  <h3 className="font-['Fraunces'] text-xl font-semibold text-[#1c2b23]">
                    {m.name}
                  </h3>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#a8431d]">
                    {m.role}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#3c4a42]">{m.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#e3e8de]/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map(([t, b], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#a8431d]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-['Fraunces'] text-xl font-semibold text-[#1c2b23]">{t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#3c4a42]">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-xl font-['Fraunces'] text-3xl font-semibold leading-tight text-[#1c2b23] md:text-4xl">
            Stop being the one who chases the money.
          </h2>
          <div className="mt-8 flex justify-center">
            <CTA to={`${base}/pricing`}>
              Set up your household <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
