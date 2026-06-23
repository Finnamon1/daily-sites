import { motion } from "framer-motion"
import { Reveal } from "@/components/fx/Reveal"
import { C, ScentField, Kicker } from "../lib"

const TIMELINE = [
  ["2014", "A flat above rue Saint-Maur", "Camille buys a second-hand rotary evaporator and ruins a kitchen learning to use it."],
  ["2017", "The first three", "After two hundred trials, N°01, 02 and 03 are bottled. They have not changed since."],
  ["2021", "The atelier", "A ground-floor workshop in the 11th opens to visitors one afternoon a week."],
  ["2026", "Still three", "We are often asked for a fourth. We are still waiting for one worth keeping."],
]

export function Maison() {
  return (
    <div style={{ background: C.bone }}>
      <ScentField
        style={{ background: C.ink }}
        tone="rgba(226,164,75,0.42)"
      >
        <div className="mx-auto max-w-4xl px-6 py-28 text-center">
          <Reveal>
            <Kicker on="ink">The maison</Kicker>
            <h1 className="mt-5 font-['Cormorant_Garamond'] text-[clamp(2.6rem,7vw,5rem)] leading-[1.02]" style={{ color: C.bone }}>
              We make perfume the slow,
              <br />
              <span className="italic" style={{ color: C.amberLit }}>
                slightly unreasonable
              </span>{" "}
              way.
            </h1>
            <p className="mx-auto mt-7 max-w-xl font-['Hanken_Grotesk'] text-[17px] leading-[1.8]" style={{ color: "rgba(242,235,223,0.82)" }}>
              Two people, one bench, a shelf of raw materials and the patience
              to let things rest. That is the entire company.
            </p>
          </Reveal>
        </div>
      </ScentField>

      {/* portrait + statement */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <figure className="overflow-hidden rounded-2xl border" style={{ borderColor: C.line }}>
              <div className="relative aspect-[4/5]">
                <img
                  src="https://picsum.photos/seed/perfumer-portrait-workshop-warm/900/1125"
                  alt="Camille Roux at the blending bench, weighing a material on a balance"
                  loading="lazy"
                  width={900}
                  height={1125}
                  className="h-full w-full object-cover"
                  style={{ filter: "sepia(0.3) saturate(0.88) contrast(1.04)" }}
                />
              </div>
            </figure>
          </Reveal>
          <div>
            <Kicker>Camille Roux, founder & nose</Kicker>
            <blockquote className="mt-5 font-['Cormorant_Garamond'] text-[clamp(1.7rem,3.5vw,2.5rem)] italic leading-[1.25]" style={{ color: C.ink }}>
              &ldquo;I&apos;d rather sell three things I&apos;d defend with my
              life than thirty I have to explain.&rdquo;
            </blockquote>
            <p className="mt-6 max-w-md font-['Hanken_Grotesk'] text-[16px] leading-[1.8]" style={{ color: "rgba(23,18,14,0.78)" }}>
              I trained in Grasse, spent six years briefing fragrances I&apos;d
              never wear, and left to make the opposite kind of thing — small,
              honest, and a little stubborn. SÈVE is the result.
            </p>
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="border-t px-6 py-24" style={{ borderColor: C.line, background: C.boneDeep }}>
        <div className="mx-auto max-w-5xl">
          <Kicker>A short history</Kicker>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(2rem,4.5vw,3rem)]" style={{ color: C.ink }}>
            Twelve years, three perfumes.
          </h2>
          <div className="mt-14 space-y-0">
            {TIMELINE.map(([year, head, body], i) => (
              <Reveal key={year} delay={i * 0.06}>
                <div
                  className="grid gap-4 border-t py-8 md:grid-cols-[140px_1fr]"
                  style={{ borderColor: C.line }}
                >
                  <div className="font-['Cormorant_Garamond'] text-4xl" style={{ color: C.amber }}>
                    {year}
                  </div>
                  <div>
                    <h3 className="font-['Hanken_Grotesk'] text-xl font-semibold" style={{ color: C.ink }}>
                      {head}
                    </h3>
                    <p className="mt-2 max-w-xl font-['Hanken_Grotesk'] text-[15.5px] leading-[1.75]" style={{ color: "rgba(23,18,14,0.78)" }}>
                      {body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* values strip */}
      <section className="px-6 py-24" style={{ background: C.ink }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-3" style={{ background: "rgba(242,235,223,0.12)" }}>
            {[
              ["Sourced, not specced", "We buy from named growers and pay the harvest price, good year or bad."],
              ["Refill, don't replace", "Bring your flacon back; we top it up for €30 less than new."],
              ["No reformulation", "The formula you fall for is the formula you keep. Forever."],
            ].map(([h, b], i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="px-8 py-10"
                style={{ background: C.ink }}
              >
                <h3 className="font-['Cormorant_Garamond'] text-2xl" style={{ color: C.amberLit }}>
                  {h}
                </h3>
                <p className="mt-3 font-['Hanken_Grotesk'] text-[15px] leading-[1.75]" style={{ color: "rgba(242,235,223,0.78)" }}>
                  {b}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
