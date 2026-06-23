import { useParams, useNavigate } from "react-router-dom"
import { ArrowUpRight, TrendingUp, Bell, GitBranch, Sparkles } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Spotlight } from "@/components/fx/Spotlight"
import { AreaChart, Stat, Sparkline, Panel, Kicker, AMBER } from "../lib"

const TREND = [12, 14, 13, 17, 19, 18, 22, 26, 25, 30, 34, 41]

const ACCOUNTS = [
  { name: "Northwind", mrr: "4,120", spark: [4, 5, 5, 6, 8, 9], up: true },
  { name: "Atlas Foundry", mrr: "3,480", spark: [6, 6, 5, 5, 4, 4], up: false },
  { name: "Loom & Co.", mrr: "2,950", spark: [2, 3, 4, 6, 7, 9], up: true },
]

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const nav = useNavigate()

  return (
    <div>
      {/* hero ---------------------------------------------------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pt-24">
        <div>
          <Reveal>
            <Kicker>Revenue intelligence</Kicker>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 font-['Bricolage_Grotesque'] text-[44px] font-bold leading-[1.02] tracking-tight text-[#f3f4f6] sm:text-[56px] md:text-[64px]">
              Know your numbers
              <br />
              <span className="text-[#f0b429]">before the board does.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#a6aeba]">
              Cadence turns Stripe, paddle and your ledger into one quiet view of
              MRR, retention and runway — the report you'd build by hand, drawn the
              moment you open the tab.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.35}>
                <button
                  onClick={() => nav(`${base}/dashboard`)}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#f0b429] px-6 py-3.5 font-semibold text-[#0c0e12] transition-all duration-200 hover:shadow-[0_0_30px_-6px_rgba(240,180,41,0.7)]"
                >
                  See a live dashboard
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </Magnetic>
              <button
                onClick={() => nav(`${base}/pricing`)}
                className="rounded-lg border border-white/15 px-6 py-3.5 font-medium text-[#e7e9ec] transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.03]"
              >
                View pricing
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-7 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider text-[#7d8696]">
              Trusted by 2,400+ subscription teams · SOC 2 Type II
            </p>
          </Reveal>
        </div>

        {/* product preview — the featured interaction up front */}
        <Reveal delay={0.12}>
          <Spotlight color="rgba(240,180,41,0.10)" size={320} className="rounded-2xl">
            <Panel className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#8a93a1]">
                    Monthly recurring revenue
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <Stat
                      value={148320}
                      prefix="$"
                      className="font-['Bricolage_Grotesque'] text-[38px] font-bold leading-none text-[#f3f4f6]"
                    />
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f0b429]/15 px-2 py-0.5 font-['IBM_Plex_Mono'] text-[12px] font-medium text-[#f0b429]">
                      <TrendingUp className="h-3 w-3" />
                      +<Stat value={12.4} decimals={1} suffix="%" />
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#8a93a1]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f0b429]" />
                  live
                </span>
              </div>

              <div className="mt-4">
                <AreaChart data={TREND} height={150} />
              </div>

              <div className="mt-4 space-y-px overflow-hidden rounded-xl border border-white/[0.06]">
                {ACCOUNTS.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between bg-white/[0.02] px-4 py-2.5"
                  >
                    <span className="text-[13px] text-[#cbd1da]">{a.name}</span>
                    <div className="flex items-center gap-4">
                      <Sparkline data={a.spark} up={a.up} />
                      <span className="w-16 text-right font-['IBM_Plex_Mono'] text-[13px] text-[#e7e9ec]">
                        ${a.mrr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </Spotlight>
        </Reveal>
      </section>

      {/* stat band — asymmetric, count-up ------------------------ */}
      <section className="border-y border-white/[0.07] bg-[#0a0c0f]">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 2400, suffix: "+", l: "teams tracking revenue" },
            { v: 38, suffix: "s", l: "median setup time" },
            { v: 99.98, suffix: "%", l: "sync uptime", decimals: 2 },
            { v: 14, suffix: "M", prefix: "$", l: "MRR under watch" },
          ].map((s) => (
            <Reveal key={s.l}>
              <div className="px-2 py-4">
                <Stat
                  value={s.v}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals ?? 0}
                  className="font-['Bricolage_Grotesque'] text-[40px] font-bold leading-none text-[#f0b429]"
                />
                <p className="mt-2 text-[14px] text-[#8a93a1]">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* feature rows — alternating, not 3 identical cards ------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <Kicker>What it does</Kicker>
          <h2 className="mt-4 max-w-2xl font-['Bricolage_Grotesque'] text-[32px] font-bold leading-tight tracking-tight text-[#f3f4f6] sm:text-[40px]">
            The financial report you keep rebuilding, kept current for you.
          </h2>
        </Reveal>

        <div className="mt-14 space-y-16">
          {[
            {
              icon: TrendingUp,
              title: "Live MRR, decomposed",
              body: "New, expansion, contraction and churn — split out the moment a charge clears, so you always know which lever moved the number.",
              points: ["Stripe + Paddle + manual", "Movement breakdown", "Daily snapshot history"],
              flip: false,
            },
            {
              icon: GitBranch,
              title: "Cohorts that actually retain attention",
              body: "Retention curves by signup month, plan and channel. Hover a cohort to trace it; the chart redraws without a full reload.",
              points: ["Net & gross retention", "By plan, channel, geo", "Export to CSV / Sheets"],
              flip: true,
            },
            {
              icon: Bell,
              title: "Alerts before it's a fire drill",
              body: "A whale's card fails, churn ticks past your threshold, runway dips below six months — Cadence pings Slack before the standup.",
              points: ["Threshold + anomaly", "Slack & email", "Quiet hours"],
              flip: false,
            },
          ].map((f, i) => (
            <Reveal key={f.title}>
              <div
                className={`grid items-center gap-8 md:grid-cols-2 ${f.flip ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0b429]/12 text-[#f0b429]">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-['Bricolage_Grotesque'] text-[24px] font-bold tracking-tight text-[#f3f4f6]">
                    {f.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#a6aeba]">{f.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {f.points.map((p) => (
                      <li
                        key={p}
                        className="rounded-full border border-white/10 px-3 py-1 font-['IBM_Plex_Mono'] text-[12px] text-[#9aa3af]"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Panel className="aspect-[4/3] overflow-hidden">
                  <FeatureVisual index={i} />
                </Panel>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA ----------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[#f0b429]/25 bg-gradient-to-br from-[#1a160b] to-[#11141a] px-8 py-14 text-center md:px-16">
            <Sparkles className="mx-auto h-7 w-7 text-[#f0b429]" />
            <h2 className="mx-auto mt-5 max-w-xl font-['Bricolage_Grotesque'] text-[30px] font-bold leading-tight tracking-tight text-[#f3f4f6] sm:text-[38px]">
              Open Cadence Monday. Read your real numbers by Monday lunch.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] text-[#a6aeba]">
              Free for revenue under $5k MRR, forever. No card to start.
            </p>
            <div className="mt-8 flex justify-center">
              <Magnetic strength={0.35}>
                <button
                  onClick={() => nav(`${base}/pricing`)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#f0b429] px-7 py-3.5 font-semibold text-[#0c0e12] transition-all duration-200 hover:shadow-[0_0_34px_-6px_rgba(240,180,41,0.7)]"
                >
                  Start free
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

/* small crafted SVG visuals per feature row (no stock photos) */
function FeatureVisual({ index }: { index: number }) {
  if (index === 0) return <AreaChart data={[8, 10, 9, 13, 12, 16, 18, 17, 22, 24, 28, 33]} height={240} />
  if (index === 1)
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label="Retention cohort curves">
        {[0, 1, 2].map((row) => (
          <path
            key={row}
            d={`M 10 ${60 + row * 60} C 90 ${64 + row * 60}, 170 ${90 + row * 55}, 310 ${110 + row * 45 - row * 20}`}
            fill="none"
            stroke={AMBER}
            strokeOpacity={1 - row * 0.28}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        ))}
        {[0, 1, 2, 3, 4].map((g) => (
          <line key={g} x1={10 + g * 75} y1="20" x2={10 + g * 75} y2="220" stroke="#fff" strokeOpacity="0.05" />
        ))}
      </svg>
    )
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {[
        { t: "Churn risk · Atlas Foundry", c: AMBER },
        { t: "Runway < 6 months", c: "#6b7686" },
        { t: "Expansion · Loom & Co.", c: AMBER },
      ].map((row, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
        >
          <Bell className="h-4 w-4 shrink-0" style={{ color: row.c }} />
          <span className="text-[14px] text-[#cbd1da]">{row.t}</span>
        </div>
      ))}
    </div>
  )
}
