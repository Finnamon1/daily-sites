import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import {
  CONTRIBUTORS,
  Label,
  Marquee,
  STORIES,
  StoryCard,
  useBase,
} from "../shared"

export function Home() {
  const base = useBase()
  const [lead, ...rest] = STORIES

  return (
    <div>
      {/* ---------------------------------------------------------- masthead */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:pt-20">
        <div className="grid items-end gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-[#c1351c]" />
                <Label className="text-[#c1351c]">No. 14 · The Grain</Label>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 font-['Fraunces'] text-[3.4rem] font-semibold leading-[0.95] tracking-[-0.03em] text-[#191510] sm:text-[5rem] lg:text-[6.2rem]">
                Made by hand,
                <br />
                <span className="italic text-[#c1351c]">on purpose.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl font-['DM_Sans'] text-lg leading-relaxed text-[#191510]/75">
                OFFCUT is a quarterly print magazine about craft, material and the
                people who can't stop making. No trends, no listicles — just long
                looks at slow work, set in ink on heavy paper.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Magnetic>
                  <Link
                    to={`${base}/subscribe`}
                    className="group inline-flex items-center gap-2 rounded-sm bg-[#191510] px-6 py-3.5 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.18em] text-[#f2ede1] transition-colors duration-200 hover:bg-[#c1351c]"
                  >
                    Subscribe — £14 / yr
                    <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Magnetic>
                <Link
                  to={`${base}/stories`}
                  className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.18em] text-[#191510]/70 underline-offset-4 transition-colors hover:text-[#c1351c] hover:underline"
                >
                  Read this issue →
                </Link>
              </div>
            </Reveal>
          </div>

          {/* cover plate — crafted, not stock */}
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm border border-[#191510]/25" aria-hidden />
              <div className="relative overflow-hidden rounded-sm border border-[#191510]/25 bg-[#191510] p-6 text-[#f2ede1] shadow-[0_18px_40px_-24px_rgba(25,21,16,0.6)]">
                <div className="flex items-center justify-between">
                  <Wordmark />
                  <Label className="text-[#f2ede1]/72">£8</Label>
                </div>
                <div className="my-6 aspect-[3/4] overflow-hidden rounded-sm">
                  <img
                    src="https://picsum.photos/seed/offcut-cover-woodgrain/600/800"
                    alt="Issue 14 cover: close detail of split oak showing its grain"
                    width={600}
                    height={800}
                    className="h-full w-full object-cover grayscale-[0.2]"
                  />
                </div>
                <p className="font-['Fraunces'] text-[1.7rem] font-medium leading-[1.05] tracking-[-0.01em]">
                  The Grain
                </p>
                <p className="mt-2 font-['DM_Sans'] text-sm text-[#f2ede1]/65">
                  Sawmills, split oak, and the argument every maker has with wood.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------- FEATURED INTERACTION: marquee */}
      <section aria-label="In this issue" className="border-y border-[#191510]/15 bg-[#191510] text-[#f2ede1]">
        <Marquee
          items={[
            "Split oak",
            "Indigo vats",
            "Letterpress",
            "Hand-thrown wobble",
            "Ten thousand grit",
            "The scrap pile",
            "Wax & shellac",
            "A stuck quoin",
          ]}
          speed={70}
        />
      </section>

      {/* ------------------------------------------------------- lead story */}
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="mb-7 flex items-baseline justify-between border-b border-[#191510]/15 pb-3">
          <Label className="text-[#191510]/70">The lead</Label>
          <Label className="text-[#191510]/70">01 / 06</Label>
        </div>
        <Reveal>
          <StoryCard story={lead} ratio="aspect-[16/9]" big />
        </Reveal>
      </section>

      {/* ------------------------------------------------------- story grid */}
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="mb-7 flex items-baseline justify-between border-b border-[#191510]/15 pb-3">
          <Label className="text-[#191510]/70">Also in No. 14</Label>
          <Link
            to={`${base}/stories`}
            className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.18em] text-[#c1351c] underline-offset-4 hover:underline"
          >
            All stories →
          </Link>
        </div>
        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.08}>
              <StoryCard story={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- pull quote */}
      <section className="mx-auto mt-24 max-w-4xl px-5">
        <Reveal>
          <figure className="border-y border-[#191510]/20 py-12 text-center">
            <blockquote className="font-['Fraunces'] text-[2rem] font-medium italic leading-[1.2] tracking-[-0.01em] text-[#191510] sm:text-[2.8rem]">
              “Every offcut is a decision you haven't made yet.”
            </blockquote>
            <figcaption className="mt-6">
              <Label className="text-[#191510]/70">Rennie Okafor — A Field Guide to Offcuts</Label>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ------------------------------------------------------- contributors */}
      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="mb-6 flex items-baseline justify-between border-b border-[#191510]/15 pb-3">
          <Label className="text-[#191510]/70">This issue's hands</Label>
          <Label className="text-[#191510]/70">{CONTRIBUTORS.length} contributors</Label>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {CONTRIBUTORS.map((c) => (
            <span key={c} className="font-['Fraunces'] text-xl italic text-[#191510]/85">
              {c}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

function Wordmark() {
  return (
    <span className="font-['Fraunces'] text-lg font-semibold tracking-[-0.03em]">
      OFF<span className="text-[#c1351c]">CUT</span>
    </span>
  )
}
