import { Quote, ArrowUpRight } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Spotlight } from "@/components/fx/Spotlight"
import { AreaChart, Stat, Panel, Kicker } from "../lib"

const TESTIMONIALS = [
  {
    quote:
      "We caught a failing enterprise card three days before renewal. That one Slack alert paid for Cadence for the next decade.",
    name: "Priya Nadar",
    role: "Founder, Northwind Logistics",
    seed: "priya-portrait",
  },
  {
    quote:
      "I stopped rebuilding the same MRR sheet every Monday. Now I open one tab and the whole board deck is already true.",
    name: "Marcus Vell",
    role: "CEO, Loom & Co.",
    seed: "marcus-portrait",
  },
  {
    quote:
      "Cohort retention used to be a quarterly archaeology project. Cadence draws it live — we shipped two pricing changes off it.",
    name: "Dana Okafor",
    role: "Head of Growth, Bramble",
    seed: "dana-portrait",
  },
  {
    quote:
      "Our board meetings got shorter. The numbers don't get argued anymore — everyone's reading the same source.",
    name: "Theo Lund",
    role: "COO, Harbor Health",
    seed: "theo-portrait",
  },
]

export function Customers() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const nav = useNavigate()

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <Reveal>
          <Kicker>Customers</Kicker>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-4 font-['Bricolage_Grotesque'] text-[40px] font-bold leading-tight tracking-tight text-[#f3f4f6] sm:text-[52px]">
            Founders who'd rather read than rebuild.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 text-[17px] leading-relaxed text-[#a6aeba]">
            From two-person studios to Series-B teams, Cadence is where subscription
            businesses go to stop guessing at their own revenue.
          </p>
        </Reveal>
      </div>

      {/* featured case study — asymmetric, with a live chart */}
      <Reveal>
        <Spotlight color="rgba(240,180,41,0.08)" size={400} className="mt-12 rounded-3xl">
          <div className="grid items-center gap-8 rounded-3xl border border-white/[0.07] bg-[#11141a] p-8 md:grid-cols-2 md:p-10">
            <div>
              <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider text-[#f0b429]">
                Case study · Loom & Co.
              </span>
              <p className="mt-4 font-['Bricolage_Grotesque'] text-[26px] font-semibold leading-snug text-[#f3f4f6]">
                "We grew MRR{" "}
                <span className="text-[#f0b429]">
                  <Stat value={2.4} decimals={1} suffix="×" />
                </span>{" "}
                in a year — and finally trusted the number while we did it."
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-[#a6aeba]">
                Loom switched off three disconnected dashboards. With movement
                broken out daily, they spotted that expansion — not new logos — was
                driving growth, and doubled down on the upgrade path.
              </p>
              <div className="mt-7 grid grid-cols-3 gap-6 border-t border-white/[0.07] pt-6">
                {[
                  { v: 2.4, suffix: "×", d: 1, l: "MRR growth" },
                  { v: 118, suffix: "%", d: 0, l: "Net retention" },
                  { v: 6, suffix: "h", d: 0, l: "Saved / week" },
                ].map((s) => (
                  <div key={s.l}>
                    <Stat
                      value={s.v}
                      suffix={s.suffix}
                      decimals={s.d}
                      className="font-['Bricolage_Grotesque'] text-[26px] font-bold leading-none text-[#f3f4f6]"
                    />
                    <p className="mt-1.5 text-[12px] text-[#8a93a1]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <Panel>
              <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#8a93a1]">
                Loom & Co. · MRR, trailing 12 months
              </p>
              <div className="mt-5">
                <AreaChart data={[42, 44, 48, 51, 55, 60, 66, 71, 78, 84, 92, 101]} height={220} />
              </div>
            </Panel>
          </div>
        </Spotlight>
      </Reveal>

      {/* testimonials — masonry-ish, avatars with treatment */}
      <section className="mt-20">
        <Reveal>
          <h2 className="font-['Bricolage_Grotesque'] text-[28px] font-bold tracking-tight text-[#f3f4f6]">
            In their words
          </h2>
        </Reveal>
        <div className="mt-8 columns-1 gap-5 md:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.06}>
              <Panel className="transition-colors duration-200 hover:border-white/[0.14]">
                <Quote className="h-6 w-6 text-[#f0b429]/40" />
                <p className="mt-3 text-[16px] leading-relaxed text-[#dadee4]">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={`https://picsum.photos/seed/${t.seed}/96/96`}
                    alt={`Portrait of ${t.name}`}
                    width={44}
                    height={44}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-[#f0b429]/40 grayscale"
                  />
                  <div>
                    <p className="text-[14px] font-medium text-[#e7e9ec]">{t.name}</p>
                    <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#8a93a1]">{t.role}</p>
                  </div>
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.07] bg-[#0a0c0f] px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#f3f4f6]">
              Join 2,400 teams reading their real numbers.
            </h3>
            <p className="mt-2 text-[15px] text-[#8a93a1]">Free under $5k MRR — connect a source in under a minute.</p>
          </div>
          <Magnetic strength={0.3}>
            <button
              onClick={() => nav(`${base}/pricing`)}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#f0b429] px-6 py-3.5 font-semibold text-[#0c0e12] transition-all duration-200 hover:shadow-[0_0_30px_-6px_rgba(240,180,41,0.7)]"
            >
              Start free <ArrowUpRight className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  )
}
