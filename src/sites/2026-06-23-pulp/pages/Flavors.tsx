import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Droplets } from "lucide-react"
import { TiltCard } from "@/components/fx/TiltCard"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Can } from "../components/Can"
import { flavors } from "../data"

export function Flavors({ base }: { base: string }) {
  const [active, setActive] = useState(flavors[0].slug)
  const current = flavors.find((f) => f.slug === active) ?? flavors[0]

  return (
    <div className="px-6 pb-24 pt-14 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#B23A10]">Five flavours</p>
          <h1 className="mt-2 max-w-2xl font-['Syne'] text-5xl font-extrabold leading-[0.95] tracking-tight text-[#221C15] md:text-6xl">
            Pick a fight with your palate.
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-[#4A4135]">
            Every can is cold-pressed citrus, real botanicals and a long steep —
            never more sugar than the fruit asks for. Tilt a card to look closer.
          </p>
        </Reveal>

        {/* tilt grid — featured interaction on this page */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((f, i) => (
            <Reveal key={f.slug} delay={i * 0.06}>
              <div style={{ perspective: 1000 }}>
                <TiltCard
                  max={10}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[28px] p-7"
                >
                  <div
                    className="absolute inset-0 -z-10"
                    style={{ background: `linear-gradient(160deg, ${f.from}, ${f.to})` }}
                  />
                  <div
                    className="relative flex flex-col"
                    style={{ color: f.ink, transform: "translateZ(40px)" }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] opacity-80">
                        No.{i + 1}
                      </span>
                      <Can flavor={f} className="h-28 w-auto drop-shadow-[0_14px_18px_rgba(0,0,0,0.22)]" />
                    </div>
                    <h2 className="mt-4 font-['Fraunces'] text-3xl font-semibold leading-none">{f.name}</h2>
                    <p className="font-['Syne'] text-base font-bold opacity-90">{f.pair}</p>
                    <p className="mt-4 text-sm leading-relaxed opacity-90">{f.blurb}</p>
                    <div className="mt-6 h-px w-full bg-current opacity-20" />
                    <div className="mt-4 flex items-center gap-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] opacity-85">
                      <span>{f.abv} ABV</span>
                      <span className="opacity-40">·</span>
                      <span>{f.cal} cal</span>
                      <span className="opacity-40">·</span>
                      <span>{f.notes.split(" · ")[0]}</span>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          ))}
        </div>

        {/* tasting-note selector */}
        <div className="mt-24 grid items-center gap-10 rounded-[32px] border border-[#221C15]/10 bg-[#EFE7D3] p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12">
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 20, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                exit={{ opacity: 0, y: -20, rotate: 4 }}
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <Can flavor={current} className="h-72 w-auto drop-shadow-[0_28px_36px_rgba(34,28,21,0.28)]" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {flavors.map((f) => (
                <button
                  key={f.slug}
                  onClick={() => setActive(f.slug)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active === f.slug
                      ? "border-transparent text-[#F7F1E3]"
                      : "border-[#221C15]/20 text-[#221C15] hover:border-[#221C15]/50"
                  }`}
                  style={active === f.slug ? { backgroundColor: f.to } : undefined}
                >
                  {f.name}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-7"
              >
                <h3 className="font-['Fraunces'] text-3xl font-semibold text-[#221C15]">
                  {current.name} {current.pair}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-[#4A4135]">{current.blurb}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {current.notes.split(" · ").map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#221C15]/[0.06] px-3 py-1.5 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.1em] text-[#221C15]"
                    >
                      <Droplets className="h-3 w-3" style={{ color: current.to }} />
                      {n}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-[#4A4135]">Can't choose? That's what the mixed case is for.</p>
          <Magnetic strength={0.3}>
            <Link
              to={`${base}/contact`}
              className="group inline-flex items-center gap-2 rounded-full bg-[#221C15] px-6 py-3.5 text-[15px] font-semibold text-[#F7F1E3] transition-colors duration-200 hover:bg-[#E8511D]"
            >
              Order all five
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </div>
  )
}
