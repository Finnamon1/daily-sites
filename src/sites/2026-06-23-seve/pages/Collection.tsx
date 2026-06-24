import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { C, FRAGRANCES, Bottle, ScentField, Kicker, priceFmt } from "../lib"

export function Collection() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div style={{ background: C.bone }}>
      <header className="border-b px-6 pt-20 pb-14" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-6xl">
          <Kicker>The collection · 2026</Kicker>
          <h1
            className="mt-4 max-w-3xl font-['Cormorant_Garamond'] text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02]"
            style={{ color: C.ink }}
          >
            Three fragrances we&apos;d wear ourselves.
          </h1>
          <p className="mt-5 max-w-xl font-['Hanken_Grotesk'] text-[17px] leading-[1.75]" style={{ color: "rgba(23,18,14,0.78)" }}>
            Each is a 50&nbsp;ml extrait de parfum, 22–28% concentration,
            poured to order. Samples ship before you commit.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-8">
          {FRAGRANCES.map((f, i) => (
            <Reveal key={f.slug} delay={i * 0.06}>
              <article
                className="grid items-stretch gap-0 overflow-hidden rounded-3xl border md:grid-cols-[0.85fr_1.15fr]"
                style={{ borderColor: C.line }}
              >
                {/* bottle panel with cursor aura */}
                <ScentField
                  className={i % 2 ? "md:order-2" : ""}
                  style={{ background: C.ink }}
                  tone="rgba(226,164,75,0.42)"
                >
                  <div className="flex h-full min-h-[300px] items-center justify-center px-8 py-12">
                    <motion.div
                      whileHover={{ rotate: -2, y: -10 }}
                      transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    >
                      <Bottle f={f} className="h-64 w-auto drop-shadow-2xl" />
                    </motion.div>
                  </div>
                </ScentField>

                {/* details */}
                <div
                  className={`flex flex-col justify-center gap-6 px-8 py-12 md:px-12 ${
                    i % 2 ? "md:order-1" : ""
                  }`}
                  style={{ background: i % 2 ? C.boneDeep : C.bone }}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-['Cormorant_Garamond'] text-5xl italic" style={{ color: C.amber }}>
                      N°{f.no}
                    </span>
                    <span className="h-8 w-px" style={{ background: C.line }} />
                    <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(23,18,14,0.7)" }}>
                      {f.family}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-['Cormorant_Garamond'] text-4xl" style={{ color: C.ink }}>
                      {f.name}
                    </h2>
                    <p className="mt-3 max-w-md font-['Hanken_Grotesk'] text-[15.5px] leading-[1.75]" style={{ color: "rgba(23,18,14,0.78)" }}>
                      {f.story}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {f.notes
                      .flatMap((n) => n.items)
                      .slice(0, 4)
                      .map((n) => (
                        <span
                          key={n}
                          className="rounded-full border px-3 py-1 font-['IBM_Plex_Mono'] text-[11px]"
                          style={{ borderColor: C.line, color: "rgba(23,18,14,0.72)" }}
                        >
                          {n}
                        </span>
                      ))}
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t pt-6" style={{ borderColor: C.line }}>
                    <div>
                      <span className="font-['Cormorant_Garamond'] text-3xl" style={{ color: C.ink }}>
                        {priceFmt(f.price)}
                      </span>
                      <span className="ml-2 font-['IBM_Plex_Mono'] text-[12px]" style={{ color: "rgba(23,18,14,0.7)" }}>
                        / {f.ml} ml
                      </span>
                    </div>
                    <Link
                      to={`${base}/parfum/${f.slug}`}
                      className="group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-['Hanken_Grotesk'] text-[14px] font-semibold transition-colors duration-200"
                      style={{ background: C.ink, color: C.bone }}
                    >
                      Discover
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* discovery set */}
        <Reveal delay={0.1}>
          <div
            className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border px-8 py-10 md:flex-row md:items-center md:px-12"
            style={{ borderColor: C.amber, background: "rgba(196,126,43,0.07)" }}
          >
            <div>
              <Kicker>Undecided?</Kicker>
              <h3 className="mt-2 font-['Cormorant_Garamond'] text-3xl" style={{ color: C.ink }}>
                The discovery set — all three, 2 ml each.
              </h3>
              <p className="mt-2 font-['Hanken_Grotesk'] text-[15px]" style={{ color: "rgba(23,18,14,0.78)" }}>
                €24, fully refunded against your first full bottle.
              </p>
            </div>
            <Link
              to={`${base}/visit`}
              className="shrink-0 rounded-full px-7 py-3.5 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: C.amberFill, color: C.ink }}
            >
              Order samples
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
