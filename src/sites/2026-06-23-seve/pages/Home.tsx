import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { C, FRAGRANCES, Bottle, ScentField, Kicker, priceFmt } from "../lib"

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const hero = FRAGRANCES[0]

  return (
    <div>
      {/* ---------------------------------------------------------- hero */}
      <ScentField
        className="border-b"
        style={{ background: C.ink, borderColor: "rgba(226,164,75,0.18)" }}
        tone="rgba(226,164,75,0.5)"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:py-32">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span
                className="h-px w-10"
                style={{ background: C.amberLit }}
              />
              <Kicker on="ink">Maison de parfum · Paris, 11e</Kicker>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 font-['Cormorant_Garamond'] text-[clamp(3rem,8vw,5.6rem)] font-medium leading-[0.96] tracking-[-0.01em]"
              style={{ color: C.bone }}
            >
              Scent is the
              <br />
              <span className="italic" style={{ color: C.amberLit }}>
                last room
              </span>{" "}
              of memory.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-7 max-w-md font-['Hanken_Grotesk'] text-[17px] leading-[1.75]"
              style={{ color: "rgba(242,235,223,0.82)" }}
            >
              SÈVE is three fragrances, distilled in small batches above a
              workshop in the eleventh. No marketing notes, no flankers — just
              raw materials we couldn&apos;t stop smelling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <Magnetic strength={0.5}>
                <Link
                  to={`${base}/collection`}
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-colors duration-200"
                  style={{ background: C.amberFill, color: C.ink }}
                >
                  Explore the three
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
              <Link
                to={`${base}/parfum/${hero.slug}`}
                className="font-['Hanken_Grotesk'] text-[15px] font-medium underline-offset-4 transition-colors duration-200 hover:underline"
                style={{ color: "rgba(242,235,223,0.78)" }}
              >
                Start with N°01 →
              </Link>
            </motion.div>

            <div className="mt-12 flex items-center gap-2 font-['IBM_Plex_Mono'] text-[12px]" style={{ color: "rgba(242,235,223,0.55)" }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: C.amberLit }} />
              Move your cursor — the air carries the scent.
            </div>
          </div>

          {/* hero bottle, lit by the cursor aura behind it */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative mx-auto"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bottle f={hero} className="h-[360px] w-auto drop-shadow-2xl" />
            </motion.div>
            <div
              className="mt-5 text-center font-['Cormorant_Garamond'] text-xl italic"
              style={{ color: "rgba(242,235,223,0.7)" }}
            >
              N°01 — {hero.name}
            </div>
          </motion.div>
        </div>
      </ScentField>

      {/* -------------------------------------------------- the three (grid) */}
      <section className="px-6 py-24" style={{ background: C.bone }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker>The collection</Kicker>
              <h2
                className="mt-3 font-['Cormorant_Garamond'] text-[clamp(2.2rem,5vw,3.4rem)] leading-tight"
                style={{ color: C.ink }}
              >
                Three, and only three.
              </h2>
            </div>
            <Link
              to={`${base}/collection`}
              className="font-['Hanken_Grotesk'] text-[14px] font-semibold underline-offset-4 hover:underline"
              style={{ color: C.amber }}
            >
              View all →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {FRAGRANCES.map((f, i) => (
              <Reveal key={f.slug} delay={i * 0.08}>
                <Link to={`${base}/parfum/${f.slug}`} className="group block">
                  <ScentField
                    className="rounded-2xl border transition-colors duration-300"
                    style={{
                      background: C.ink,
                      borderColor: "rgba(205,191,166,0.0)",
                    }}
                    tone="rgba(226,164,75,0.4)"
                    intensity={0.9}
                  >
                    <div className="flex flex-col items-center px-8 pt-12 pb-9">
                      <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      >
                        <Bottle f={f} className="h-56 w-auto" />
                      </motion.div>
                      <div className="mt-8 w-full">
                        <div className="flex items-baseline justify-between">
                          <span
                            className="font-['IBM_Plex_Mono'] text-[12px] tracking-[0.2em]"
                            style={{ color: C.amberLit }}
                          >
                            N°{f.no}
                          </span>
                          <span
                            className="font-['Hanken_Grotesk'] text-[14px]"
                            style={{ color: "rgba(242,235,223,0.6)" }}
                          >
                            {priceFmt(f.price)}
                          </span>
                        </div>
                        <h3
                          className="mt-1 font-['Cormorant_Garamond'] text-2xl"
                          style={{ color: C.bone }}
                        >
                          {f.name}
                        </h3>
                        <p
                          className="mt-1 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em]"
                          style={{ color: "rgba(242,235,223,0.5)" }}
                        >
                          {f.family}
                        </p>
                        <p
                          className="mt-4 font-['Hanken_Grotesk'] text-[14px] leading-[1.7]"
                          style={{ color: "rgba(242,235,223,0.78)" }}
                        >
                          {f.blurb}
                        </p>
                      </div>
                    </div>
                  </ScentField>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- ethos / image */}
      <section className="px-6 py-24" style={{ background: C.boneDeep }}>
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <Reveal>
            <figure className="overflow-hidden rounded-2xl border" style={{ borderColor: C.line }}>
              <div className="relative aspect-[4/5]">
                <img
                  src="https://picsum.photos/seed/perfumer-atelier-amber-bottles/900/1125"
                  alt="Glass beakers and amber sample vials on the workshop bench at the SÈVE atelier"
                  loading="lazy"
                  width={900}
                  height={1125}
                  className="h-full w-full object-cover"
                  style={{ filter: "sepia(0.32) saturate(0.85) contrast(1.04)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(23,18,14,0.55))",
                  }}
                />
              </div>
            </figure>
          </Reveal>

          <div>
            <Kicker>Our method</Kicker>
            <h2
              className="mt-3 font-['Cormorant_Garamond'] text-[clamp(2rem,4.5vw,3rem)] leading-tight"
              style={{ color: C.ink }}
            >
              Distilled by hand, never by committee.
            </h2>
            <div className="mt-6 space-y-5 font-['Hanken_Grotesk'] text-[16px] leading-[1.8]" style={{ color: "rgba(23,18,14,0.78)" }}>
              <p>
                Each batch is macerated for six weeks, then rested another four
                before it&apos;s bottled by the same two people who blended it.
                We buy raw materials by the kilo from growers we&apos;ve met.
              </p>
              <p>
                Nothing is reformulated to hit a price. If a harvest is poor, we
                make less — or we wait. That&apos;s the whole business plan.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: C.line }}>
              {[
                ["6 wks", "maceration"],
                ["100%", "natural where we can"],
                ["2", "hands on every bottle"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-['Cormorant_Garamond'] text-3xl" style={{ color: C.amber }}>
                    {n}
                  </dt>
                  <dd className="mt-1 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(23,18,14,0.7)" }}>
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
