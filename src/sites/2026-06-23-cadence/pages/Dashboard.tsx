import { useState } from "react"
import { TrendingUp, TrendingDown, ArrowUpRight, Calendar } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { AreaChart, Bars, Ring, Stat, Sparkline, Panel, Kicker } from "../lib"

const RANGES = ["7d", "30d", "90d", "12m"] as const

const MRR_WINDOWS: Record<string, number[]> = {
  "7d": [144, 145, 144, 146, 147, 147, 148],
  "30d": [138, 140, 139, 142, 141, 144, 146, 145, 148],
  "90d": [122, 126, 131, 130, 135, 138, 141, 140, 144, 146, 148],
  "12m": [98, 102, 101, 108, 112, 119, 124, 122, 131, 138, 142, 148],
}
const PLAN_BARS = [22, 31, 28, 44, 39, 52]
const PLAN_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

const ACCOUNTS = [
  { name: "Northwind Logistics", plan: "Scale", mrr: "4,120", chg: "+8.2%", up: true, spark: [4, 5, 5, 6, 8, 9] },
  { name: "Atlas Foundry", plan: "Scale", mrr: "3,480", chg: "−3.1%", up: false, spark: [6, 6, 5, 5, 4, 4] },
  { name: "Loom & Co.", plan: "Growth", mrr: "2,950", chg: "+14.0%", up: true, spark: [2, 3, 4, 6, 7, 9] },
  { name: "Bramble Studio", plan: "Growth", mrr: "2,210", chg: "+2.4%", up: true, spark: [3, 3, 4, 4, 5, 5] },
  { name: "Harbor Health", plan: "Starter", mrr: "1,180", chg: "−1.0%", up: false, spark: [5, 5, 4, 4, 4, 3] },
]

export function Dashboard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("12m")

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Kicker>Overview</Kicker>
          <h1 className="mt-3 font-['Bricolage_Grotesque'] text-[34px] font-bold tracking-tight text-[#f3f4f6]">
            Good morning, Priya
          </h1>
          <p className="mt-1 flex items-center gap-2 text-[14px] text-[#8a93a1]">
            <Calendar className="h-4 w-4" /> Synced 4 minutes ago · 6 sources
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#11141a] p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1.5 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider transition-colors duration-200 ${
                range === r ? "bg-[#f0b429] text-[#0c0e12]" : "text-[#8a93a1] hover:text-[#e7e9ec]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* hero metric + secondary KPIs — asymmetric grid */}
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Panel className="flex h-full flex-col">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#8a93a1]">
                  Monthly recurring revenue
                </p>
                <div className="mt-1.5 flex items-baseline gap-3">
                  <Stat
                    value={148320}
                    prefix="$"
                    className="font-['Bricolage_Grotesque'] text-[44px] font-bold leading-none text-[#f3f4f6]"
                  />
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f0b429]/15 px-2 py-0.5 font-['IBM_Plex_Mono'] text-[12px] font-medium text-[#f0b429]">
                    <TrendingUp className="h-3 w-3" />+<Stat value={12.4} decimals={1} suffix="%" />
                  </span>
                </div>
              </div>
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#7d8696]">{range}</span>
            </div>
            <div className="mt-6 flex-1">
              <AreaChart key={range} data={MRR_WINDOWS[range]} height={220} />
            </div>
          </Panel>
        </Reveal>

        <div className="grid gap-5">
          {[
            { l: "Net new MRR", v: 16410, prefix: "$", chg: "+22%", up: true },
            { l: "Active customers", v: 1284, chg: "+41", up: true },
            { l: "Churn rate", v: 1.8, suffix: "%", decimals: 1, chg: "−0.3pt", up: true },
          ].map((k) => (
            <Reveal key={k.l}>
              <Panel className="flex items-center justify-between">
                <div>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#8a93a1]">
                    {k.l}
                  </p>
                  <Stat
                    value={k.v}
                    prefix={k.prefix ?? ""}
                    suffix={k.suffix ?? ""}
                    decimals={k.decimals ?? 0}
                    className="mt-1.5 block font-['Bricolage_Grotesque'] text-[28px] font-bold leading-none text-[#f3f4f6]"
                  />
                </div>
                <span
                  className={`inline-flex items-center gap-1 font-['IBM_Plex_Mono'] text-[13px] ${
                    k.up ? "text-[#f0b429]" : "text-[#8a93a1]"
                  }`}
                >
                  {k.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {k.chg}
                </span>
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>

      {/* charts row: bars + ring — asymmetric */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Panel className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#8a93a1]">
                New MRR by month
              </p>
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#7d8696]">$ thousands</span>
            </div>
            <div className="mt-6 h-52">
              <Bars data={PLAN_BARS} labels={PLAN_LABELS} />
            </div>
          </Panel>
        </Reveal>
        <Reveal delay={0.06}>
          <Panel className="flex h-full flex-col items-center justify-center">
            <p className="self-start font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#8a93a1]">
              Net revenue retention
            </p>
            <div className="flex flex-1 items-center">
              <Ring pct={112} label="NRR" />
            </div>
            <p className="text-center text-[13px] text-[#8a93a1]">
              Expansion is outpacing churn — accounts grow after they land.
            </p>
          </Panel>
        </Reveal>
      </div>

      {/* top accounts table */}
      <Reveal>
        <Panel className="mt-5 !p-0">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#8a93a1]">
              Top accounts
            </p>
            <button className="inline-flex items-center gap-1 text-[13px] text-[#f0b429] transition-opacity hover:opacity-80">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {ACCOUNTS.map((a) => (
              <div
                key={a.name}
                className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5 transition-colors duration-200 hover:bg-white/[0.02] sm:grid-cols-[1.6fr_0.8fr_auto_auto]"
              >
                <span className="text-[14px] text-[#e7e9ec]">{a.name}</span>
                <span className="hidden font-['IBM_Plex_Mono'] text-[12px] text-[#8a93a1] sm:block">
                  {a.plan}
                </span>
                <div className="hidden sm:block">
                  <Sparkline data={a.spark} up={a.up} />
                </div>
                <div className="flex items-center justify-end gap-4">
                  <span className="w-16 text-right font-['IBM_Plex_Mono'] text-[14px] text-[#e7e9ec]">
                    ${a.mrr}
                  </span>
                  <span
                    className={`w-14 text-right font-['IBM_Plex_Mono'] text-[12px] ${
                      a.up ? "text-[#f0b429]" : "text-[#8a93a1]"
                    }`}
                  >
                    {a.chg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Reveal>
    </div>
  )
}
