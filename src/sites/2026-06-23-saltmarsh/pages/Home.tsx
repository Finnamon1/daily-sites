import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Compass, Waves } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { ParallaxImage, ParallaxShift } from "../components/Parallax"
import { PlaceCard } from "../components/PlaceCard"
import { Marquee } from "../components/Marquee"
import { places, facts } from "../data"

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden px-6 pt-16 pb-10 md:pt-24">
        {/* offset, layered parallax frames instead of a centered stock hero */}
        <div className="mx-auto grid max-w-6xl items-end gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.34em] text-[#2f6b5e]"
            >
              An independent field guide · North Norfolk
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-4 font-['Fraunces'] text-[clamp(2.8rem,7vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-[#1c2321]"
            >
              Walk the coast<br />
              <span className="italic text-[#2f6b5e]">where the land</span><br />
              gives up quietly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-md font-['DM_Sans'] text-[17px] leading-relaxed text-[#1c2321]/75"
            >
              Sixty-three miles of shingle, reedbed and tidal creek between Hunstanton
              and Cromer — and what one walker has learned about reading them. Where to
              stay, when to come, and which tide to fear.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-5"
            >
              <Magnetic strength={0.35}>
                <Link
                  to={`${base}/coast`}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#1c2321] px-7 py-3.5 font-['DM_Sans'] text-[15px] font-medium text-[#f6f3ec] transition-colors duration-200 hover:bg-[#2f6b5e]"
                >
                  Explore the coast
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Link
                to={`${base}/plan`}
                className="font-['DM_Sans'] text-[15px] font-medium text-[#1c2321] underline-offset-4 hover:underline"
              >
                Plan a visit →
              </Link>
            </motion.div>
          </div>

          {/* parallax image stack */}
          <div className="relative h-[420px] md:h-[560px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute right-0 top-0 w-[68%]"
            >
              <ParallaxImage
                src={img("holkham-wide-beach-pines-norfolk", 700, 900)}
                alt="The wide tidal sands of Holkham Bay at low water"
                ratio="aspect-[3/4]"
                distance={9}
                className="rounded-sm shadow-[0_30px_60px_-30px_rgba(28,35,33,0.5)]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
              className="absolute bottom-0 left-0 w-[52%]"
            >
              <ParallaxImage
                src={img("blakeney-grey-seals-shingle", 560, 460)}
                alt="Grey seals hauled out on the shingle of Blakeney Point"
                ratio="aspect-[5/4]"
                distance={16}
                className="rounded-sm border-[6px] border-[#f6f3ec] shadow-[0_30px_60px_-30px_rgba(28,35,33,0.55)]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="mt-6">
        <Marquee
          items={[
            "Grey seals",
            "Bittern boom",
            "Stewkey blue samphire",
            "Brown shrimp",
            "Big skies",
            "Tide clocks",
            "Whelk sheds",
          ]}
        />
      </div>

      {/* ---------- FACTS ---------- */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <Reveal>
            <div>
              <span className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.3em] text-[#2f6b5e]">
                Why this stretch
              </span>
              <h2 className="mt-3 font-['Fraunces'] text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-tight text-[#1c2321]">
                The coast doesn't perform for you. That's rather the point.
              </h2>
              <p className="mt-5 max-w-md font-['DM_Sans'] leading-relaxed text-[#1c2321]/75">
                No headland selfie spots, no boardwalk franchises. Just marsh and the
                particular Norfolk light that photographers drive three hours for and
                still fail to bottle. Come for a long weekend and leave on the coast
                path's terms.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 gap-4">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.1}>
                <div className="rounded-sm border border-[#1c2321]/12 bg-[#efe9dc] p-5">
                  <div className="font-['Fraunces'] text-[clamp(1.6rem,4vw,2.6rem)] font-semibold leading-none text-[#1c2321]">
                    {f.value}
                  </div>
                  {f.unit && (
                    <div className="mt-1 font-['DM_Sans'] text-[12px] uppercase tracking-[0.18em] text-[#2f6b5e]">
                      {f.unit}
                    </div>
                  )}
                  <p className="mt-3 font-['DM_Sans'] text-[13px] leading-snug text-[#1c2321]/70">
                    {f.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PLACES PREVIEW (hover image-reveal) ---------- */}
      <section className="border-t border-[#1c2321]/12 bg-[#efe9dc] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <div>
                <span className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.3em] text-[#2f6b5e]">
                  Six places to start
                </span>
                <h2 className="mt-3 font-['Fraunces'] text-[clamp(1.9rem,4vw,2.8rem)] font-medium text-[#1c2321]">
                  Hover to bring each one back to colour.
                </h2>
              </div>
            </Reveal>
            <Link
              to={`${base}/coast`}
              className="font-['DM_Sans'] text-[15px] font-medium text-[#1c2321] underline-offset-4 hover:underline"
            >
              All places →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {places.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <PlaceCard place={p} eager={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WIDE PARALLAX BAND ---------- */}
      <section className="relative">
        <ParallaxImage
          src={img("stiffkey-saltmarsh-creeks-aerial", 1600, 720)}
          alt="Tidal creeks winding through Stiffkey saltmarsh from above"
          ratio="aspect-[16/7]"
          distance={14}
          duotone={false}
          className="w-full"
        />
        <div aria-hidden className="absolute inset-0 bg-[#0c211d]/40" />
        <div className="absolute inset-0 flex items-center px-6">
          <div className="mx-auto w-full max-w-6xl">
            <ParallaxShift distance={26}>
              <p className="max-w-xl font-['Fraunces'] text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium italic leading-snug text-[#f6f3ec]">
                "The marsh keeps its own time, and the only courtesy it asks is that
                you keep it too."
              </p>
              <p className="mt-4 flex items-center gap-2 font-['DM_Sans'] text-sm text-[#cfe0d6]">
                <Waves className="h-4 w-4" /> Field Notes, no. 14
              </p>
            </ParallaxShift>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-6 py-24">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Compass className="h-7 w-7 text-[#2f6b5e]" strokeWidth={1.6} />
            <h2 className="mt-5 font-['Fraunces'] text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-tight text-[#1c2321]">
              Three days is enough to fall for it.
            </h2>
            <p className="mt-4 max-w-lg font-['DM_Sans'] leading-relaxed text-[#1c2321]/75">
              A worked-out long weekend — where to sleep, what the tide is doing, and
              the one walk to do if you do only one.
            </p>
            <Magnetic strength={0.35}>
              <Link
                to={`${base}/plan`}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#2f6b5e] px-8 py-4 font-['DM_Sans'] text-[15px] font-medium text-[#f6f3ec] transition-colors duration-200 hover:bg-[#1c2321]"
              >
                Plan the weekend
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
