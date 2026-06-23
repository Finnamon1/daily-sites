import {
  Receipt,
  SplitSquareHorizontal,
  Bell,
  Repeat,
  Globe,
  ScanLine,
} from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Spotlight } from "@/components/fx/Spotlight"
import { CTA, Eyebrow } from "../components/shared"

const FEATURES = [
  {
    icon: Receipt,
    title: "Snap & log",
    body: "Photograph a receipt and Evenly reads the total, picks the category and suggests who's in on it.",
    span: "md:col-span-3",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Splits that match real life",
    body: "Even, by share, by room, or to the exact penny — and rounding that never leaves anyone short.",
    span: "md:col-span-3",
  },
  {
    icon: Repeat,
    title: "Recurring bills, set once",
    body: "Rent, broadband, the streaming bundle. They appear on schedule and split themselves.",
    span: "md:col-span-2",
  },
  {
    icon: Bell,
    title: "Gentle, not nagging",
    body: "One monthly nudge with a single figure. No red badges, no guilt.",
    span: "md:col-span-2",
  },
  {
    icon: Globe,
    title: "Everywhere you are",
    body: "iOS, Android and a full web app that stay in sync the moment anyone adds a thing.",
    span: "md:col-span-2",
  },
]

export function Features({ base }: { base: string }) {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:pt-20">
        <Reveal className="max-w-2xl">
          <Eyebrow>Everything, no spreadsheet</Eyebrow>
          <h1 className="mt-5 font-['Fraunces'] text-[clamp(2.4rem,5vw,3.8rem)] font-semibold leading-[1.02] text-[#1c2b23]">
            Built for the messy reality of living with people.
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#3c4a42]">
            Every feature exists to end one specific argument. Here's what's doing the work.
          </p>
        </Reveal>
      </section>

      {/* BENTO grid — asymmetric spans, 3D tilt on each */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05} className={f.span}>
              <TiltCard max={7} className="h-full">
                <article className="flex h-full flex-col rounded-3xl border border-[#1c2b23]/10 bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef1ea] text-[#e7613a]">
                    <f.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-['Fraunces'] text-xl font-semibold text-[#1c2b23]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#3c4a42]">{f.body}</p>
                </article>
              </TiltCard>
            </Reveal>
          ))}

          {/* highlight tile with cursor spotlight */}
          <Reveal delay={0.25} className="md:col-span-6">
            <Spotlight
              color="rgba(231,97,58,0.18)"
              size={420}
              className="rounded-3xl bg-[#1c2b23] text-[#f3f5ef]"
            >
              <div className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
                <div className="max-w-lg">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-[#e7613a]">
                    <ScanLine className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-['Fraunces'] text-2xl font-semibold">
                    Smart categories that learn your household
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#9db0a4]">
                    After a few weeks Evenly knows the Tesco run is groceries, the Friday card is
                    drinks, and who tends to cover which. You just confirm.
                  </p>
                </div>
                <CTA to={`${base}/pricing`} className="bg-[#f3f5ef] text-[#1c2b23] hover:bg-white shrink-0">
                  Try it free
                </CTA>
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
