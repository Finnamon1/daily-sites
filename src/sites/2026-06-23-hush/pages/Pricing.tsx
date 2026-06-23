import { Link, useParams } from "react-router-dom"
import { Check } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Magnetic } from "@/components/fx/Magnetic"
import { Eyebrow } from "../ui"
import { tiers } from "../data"

export function Pricing() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal>
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="mt-3 max-w-2xl font-['Bricolage_Grotesque'] text-4xl font-bold leading-[1.02] tracking-[-0.02em] text-[#16181a] md:text-[3.2rem]">
          Priced per developer. Free until there's a team.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#17191b]/75">
          No per-secret fees, no usage meter, no surprise invoice the month you ship. You pay
          for the people, and only when secrets start being shared.
        </p>
      </Reveal>

      <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className="h-full">
            <TiltCard max={t.featured ? 7 : 5} className="h-full">
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 shadow-[0_18px_44px_-34px_rgba(12,40,34,0.5)] ${
                  t.featured
                    ? "border-transparent bg-[#14171b] text-[#eef2ee] lg:-translate-y-3"
                    : "border-[#17191b]/12 bg-[#fbfaf6]"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center justify-between" style={{ transform: "translateZ(28px)" }}>
                  <h2
                    className={`font-['Bricolage_Grotesque'] text-xl font-bold ${
                      t.featured ? "text-[#7fe3c4]" : "text-[#16181a]"
                    }`}
                  >
                    {t.name}
                  </h2>
                  {t.featured && (
                    <span className="rounded-full bg-[#7fe3c4] px-2.5 py-0.5 font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-wide text-[#0a3b31]">
                      Most teams
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-baseline gap-1.5" style={{ transform: "translateZ(20px)" }}>
                  <span
                    className={`font-['Bricolage_Grotesque'] text-4xl font-bold ${
                      t.featured ? "text-[#f1f4f0]" : "text-[#16181a]"
                    }`}
                  >
                    {t.price}
                  </span>
                  <span className={`text-sm ${t.featured ? "text-[#cfd6cf]/75" : "text-[#17191b]/70"}`}>
                    {t.cadence}
                  </span>
                </div>

                <p className={`mt-3 text-sm leading-relaxed ${t.featured ? "text-[#cfd6cf]/85" : "text-[#17191b]/70"}`}>
                  {t.blurb}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5" style={{ transform: "translateZ(14px)" }}>
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[14.5px]">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${t.featured ? "text-[#7fe3c4]" : "text-[#0c6e5d]"}`}
                        strokeWidth={2.6}
                      />
                      <span className={t.featured ? "text-[#dfe5df]" : "text-[#17191b]/80"}>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8" style={{ transform: "translateZ(26px)" }}>
                  <Magnetic strength={0.25}>
                    <Link
                      to={`${base}/docs`}
                      className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-['IBM_Plex_Sans'] font-semibold transition-colors duration-200 ${
                        t.featured
                          ? "bg-[#7fe3c4] text-[#0a3b31] hover:bg-[#9cecd4]"
                          : "border border-[#0c6e5d]/40 text-[#0a5a4b] hover:bg-[#0c6e5d]/8"
                      }`}
                    >
                      {t.cta}
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* small print */}
      <Reveal>
        <p className="mt-12 text-center text-sm text-[#17191b]/65">
          Every plan includes the open-source CLI, the full audit log, and zero-knowledge
          encryption. The paid tiers add the parts that only matter once secrets are shared.
        </p>
      </Reveal>
    </div>
  )
}
