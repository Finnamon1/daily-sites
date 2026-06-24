import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Leaf, Sparkles, Citrus } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { MorphBlob } from "../components/MorphBlob"
import { Marquee } from "../components/Marquee"
import { Can } from "../components/Can"
import { Counter } from "../components/Counter"
import { flavors, stats } from "../data"

export function Home({ base }: { base: string }) {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reduce) return
    const el = heroRef.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      setPointer({
        x: (e.clientX - (r.left + r.width / 2)) / r.width,
        y: (e.clientY - (r.top + r.height / 2)) / r.height,
      })
    }
    el.addEventListener("pointermove", onMove)
    return () => el.removeEventListener("pointermove", onMove)
  }, [reduce])

  const par = (depth: number) => ({
    transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth}px, 0)`,
  })

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        {/* morphing blob cluster — featured interaction */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          {/* crisp morphing blobs cluster on the right, around the can — the eye-catch */}
          <div style={par(36)} className="absolute right-[-40px] top-6 h-[300px] w-[300px] md:right-[2%] md:h-[440px] md:w-[440px]">
            <MorphBlob from="#F0531C" to="#A21B14" duration={15} className="h-full w-full opacity-90 blur-[1px]" />
          </div>
          <div style={par(-26)} className="absolute right-[36%] top-[-30px] h-[180px] w-[180px] md:h-[240px] md:w-[240px]">
            <MorphBlob from="#EFA12C" to="#A85C10" duration={18} delay={1.5} className="h-full w-full opacity-85 blur-[1px]" />
          </div>
          <div style={par(20)} className="absolute bottom-[-50px] right-[18%] h-[180px] w-[180px] md:h-[260px] md:w-[260px]">
            <MorphBlob from="#5AA63F" to="#1F5A2C" duration={20} delay={0.8} className="h-full w-full opacity-80 blur-[1px]" />
          </div>
          {/* soft, heavily-blurred wash behind the headline — keeps dark text legible */}
          <div style={par(14)} className="absolute -left-32 top-10 h-[420px] w-[420px]">
            <MorphBlob from="#F2A65A" to="#E8511D" duration={17} delay={0.4} className="h-full w-full opacity-25 blur-[60px]" />
          </div>
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#221C15]/15 bg-[#F7F1E3]/70 px-3.5 py-1.5 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#5A4F40] backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#B23A10]" /> Small-batch · 0.0% · No refined sugar
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 font-['Syne'] text-[15vw] font-extrabold leading-[0.86] tracking-[-0.03em] text-[#221C15] sm:text-7xl md:text-[5.4rem]"
            >
              Soda with
              <br />
              <span className="text-[#E8511D]">a backbone.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-md text-[17px] leading-relaxed text-[#4A4135]"
            >
              Pulp is sparkling citrus for people who find most soft drinks a bit
              spineless. Bitter where it counts, bright everywhere else, and
              proudly nothing to apologise for.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.35}>
                <Link
                  to={`${base}/stockists`}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#221C15] px-6 py-3.5 text-[15px] font-semibold text-[#F7F1E3] transition-colors duration-200 hover:bg-[#E8511D]"
                >
                  Find a stockist
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Link
                to={`${base}/flavors`}
                className="inline-flex items-center gap-2 rounded-full border border-[#221C15]/20 px-6 py-3.5 text-[15px] font-semibold text-[#221C15] transition-colors duration-200 hover:border-[#221C15]/50"
              >
                Meet the five
              </Link>
            </motion.div>
          </div>

          {/* floating can */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative mx-auto hidden md:block"
            style={par(-14)}
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Can flavor={flavors[0]} className="h-[400px] w-auto drop-shadow-[0_30px_40px_rgba(34,28,21,0.25)]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee
        className="border-y border-[#221C15]/12 bg-[#221C15] py-4 font-['Syne'] text-[15px] font-bold uppercase tracking-[0.12em] text-[#F7F1E3]"
        items={[
          "Cold-pressed citrus",
          "Real bitters",
          "Zero refined sugar",
          "Brewed in Bermondsey",
          "0.0% ABV",
          "12 botanicals",
        ]}
        sep={<Citrus className="h-4 w-4 text-[#EFA12C]" />}
      />

      {/* FLAVOUR TEASER */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#B23A10]">The line-up</p>
            <h2 className="mt-2 max-w-xl font-['Fraunces'] text-4xl font-semibold leading-[1.05] text-[#221C15] md:text-5xl">
              Five citrus, each with an opinion.
            </h2>
          </div>
          <Link
            to={`${base}/flavors`}
            className="group inline-flex items-center gap-2 self-start font-semibold text-[#221C15] md:self-auto"
          >
            See tasting notes
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((f, i) => (
            <Reveal key={f.slug} delay={i * 0.07} className={i === 0 ? "lg:col-span-1 lg:row-span-2" : ""}>
              <Link
                to={`${base}/flavors`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
                style={{ background: `linear-gradient(155deg, ${f.from}, ${f.to})`, color: f.ink }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] opacity-80">
                    No.{i + 1}
                  </span>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] opacity-80">{f.cal} cal</span>
                </div>
                <div className="mt-auto pt-10">
                  <h3 className="font-['Fraunces'] text-2xl font-semibold leading-tight">{f.name}</h3>
                  <p className="font-['Syne'] text-sm font-semibold opacity-90">{f.pair}</p>
                  <p className="mt-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] opacity-80">
                    {f.notes}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
          {/* fill card */}
          <Reveal delay={flavors.length * 0.07}>
            <Link
              to={`${base}/flavors`}
              className="flex h-full min-h-[160px] flex-col justify-between rounded-3xl border border-dashed border-[#221C15]/25 p-6 text-[#221C15] transition-colors duration-200 hover:border-[#221C15]/60 hover:bg-[#221C15]/[0.03]"
            >
              <Leaf className="h-6 w-6 text-[#5AA63F]" />
              <div>
                <p className="font-['Fraunces'] text-xl font-semibold">Plus the seasonal</p>
                <p className="mt-1 text-sm text-[#5A4F40]">One rotating guest flavour, only while the fruit's good.</p>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#221C15]/10 bg-[#EFE7D3]">
        <div className="mx-auto grid max-w-6xl gap-y-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <div className="border-l-2 border-[#E8511D] pl-5">
                <p className="font-['Syne'] text-5xl font-extrabold tracking-tight text-[#221C15]">
                  <Counter value={s.value} suffix={s.suffix} raw={"raw" in s ? Boolean(s.raw) : false} />
                </p>
                <p className="mt-2 text-sm text-[#5A4F40]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-['Fraunces'] text-4xl font-semibold leading-[1.08] text-[#221C15] md:text-5xl">
            Try the mixed case. Argue about your favourite later.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[#4A4135]">
            Twelve cans, all five flavours, shipped next-day across the UK. Skip or
            swap any time — no spine required.
          </p>
          <div className="mt-9 flex justify-center">
            <Magnetic strength={0.35}>
              <Link
                to={`${base}/contact`}
                className="group inline-flex items-center gap-2 rounded-full bg-[#E8511D] px-7 py-4 text-[15px] font-semibold text-[#FCEAD9] transition-all duration-200 hover:shadow-[0_18px_40px_-12px_rgba(232,81,29,0.7)]"
              >
                Order a mixed case
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
