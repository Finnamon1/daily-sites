import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Play, Pause, ArrowRight } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import {
  ALBUM,
  Counter,
  EqBars,
  Footer,
  Kicker,
  Label,
  Oscilloscope,
  PRESS,
} from "../shared"

const SECTIONS = ["Intro", "The Record", "By the Numbers", "Stay Close"]

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [cur, setCur] = useState(1) // currently-cued track index

  // track active snap panel via scroll position
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setActive(Math.round(el.scrollTop / el.clientHeight))
      })
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = (i: number) => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ top: i * el.clientHeight, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* progress rail */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        {SECTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => goTo(i)}
            className="group relative flex items-center"
            aria-label={`Go to ${s}`}
          >
            <span className="absolute right-6 whitespace-nowrap font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#e9ebe6]/0 transition-colors group-hover:text-[#e9ebe6]/70">
              {s}
            </span>
            <span
              className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                active === i
                  ? "scale-125 border-[#c5f24c] bg-[#c5f24c]"
                  : "border-white/30 bg-transparent group-hover:border-[#c5f24c]"
              }`}
            />
          </button>
        ))}
      </div>

      <div
        ref={scroller}
        className="h-[100dvh] snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth motion-reduce:snap-none"
      >
        {/* 1 — HERO ----------------------------------------------------- */}
        <section className="relative flex min-h-[100dvh] snap-start flex-col justify-center overflow-hidden px-5 pt-20">
          {/* live oscilloscope, full-bleed behind name */}
          <div className="pointer-events-none absolute inset-x-0 top-[58%] -translate-y-1/2 opacity-80">
            <Oscilloscope playing className="h-[40vh]" />
          </div>
          {/* scrims: keep the left-aligned headline legible, fade the edges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_85%_at_50%_50%,transparent_30%,#0a0c10_88%)]" />

          <div className="relative mx-auto w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Kicker>New album · out now</Kicker>
              <h1 className="mt-6 font-['Bricolage_Grotesque'] text-[16vw] font-extrabold leading-[0.84] tracking-[-0.04em] sm:text-[13vw] lg:text-[150px]">
                ORLA
                <br />
                <span className="text-[#c5f24c]">VANN</span>
              </h1>
              <p className="mt-7 max-w-md font-['Hanken_Grotesk'] text-base leading-relaxed text-[#e9ebe6]/65">
                Modular ambient recorded to tape. Eight pieces of held breath and
                slow phosphor, made on the night shift in Aarhus.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <button
                    onClick={() => {
                      setPlaying(true)
                      goTo(1)
                    }}
                    className="inline-flex items-center gap-2.5 rounded-full bg-[#c5f24c] px-6 py-3 font-['JetBrains_Mono'] text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0a0c10] transition-transform duration-200 hover:scale-[1.03]"
                  >
                    <Play className="h-4 w-4 fill-current" /> Play Glasswork
                  </button>
                </Magnetic>
                <Link
                  to={`${base}/tour`}
                  className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#e9ebe6]/70 transition-colors hover:text-[#c5f24c]"
                >
                  Autumn tour <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          <button
            onClick={() => goTo(1)}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#e9ebe6]/40 transition-colors hover:text-[#c5f24c]"
          >
            scroll
          </button>
        </section>

        {/* 2 — THE RECORD --------------------------------------------- */}
        <section className="flex min-h-[100dvh] snap-start items-center px-5 py-24">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="relative">
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={ALBUM.cover}
                    alt="Glasswork album cover — long-exposure of a modular synth glowing in the dark"
                    width={900}
                    height={900}
                    loading="lazy"
                    className="aspect-square w-full object-cover [filter:grayscale(0.35)_contrast(1.05)]"
                  />
                </div>
                <div className="absolute -bottom-4 -right-3 rounded-lg border border-[#c5f24c]/40 bg-[#0a0c10] px-4 py-2">
                  <Label className="text-[#c5f24c]">{ALBUM.year} · LP / Digital</Label>
                </div>
              </div>
            </Reveal>

            <div>
              <Kicker>The record</Kicker>
              <h2 className="mt-5 font-['Bricolage_Grotesque'] text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">
                {ALBUM.title}
              </h2>
              <p className="mt-4 max-w-md font-['Hanken_Grotesk'] leading-relaxed text-[#e9ebe6]/65">
                {ALBUM.blurb}
              </p>

              {/* player */}
              <div className="mt-7 rounded-xl border border-white/10 bg-[#10131a] p-4">
                <div className="flex items-center gap-4">
                  <Magnetic strength={0.25}>
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c5f24c] text-[#0a0c10] transition-transform duration-200 hover:scale-105"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? (
                        <Pause className="h-5 w-5 fill-current" />
                      ) : (
                        <Play className="h-5 w-5 fill-current" />
                      )}
                    </button>
                  </Magnetic>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-[#e9ebe6]/50">
                        {playing ? "Now playing" : "Cued"}
                      </Label>
                      <EqBars active={playing} />
                    </div>
                    <p className="truncate font-['Hanken_Grotesk'] text-sm font-medium">
                      {String(cur).padStart(2, "0")} — {ALBUM.tracks[cur - 1].name}
                    </p>
                  </div>
                  <Oscilloscope playing={playing} thin className="hidden h-9 w-28 sm:block" />
                </div>

                <ol className="mt-4 divide-y divide-white/5 border-t border-white/5">
                  {ALBUM.tracks.map((t) => {
                    const isCur = t.n === cur
                    return (
                      <li key={t.n}>
                        <button
                          onClick={() => {
                            setCur(t.n)
                            setPlaying(true)
                          }}
                          className="group flex w-full items-center gap-3 py-2 text-left"
                        >
                          <span
                            className={`w-5 font-['JetBrains_Mono'] text-[11px] ${
                              isCur ? "text-[#c5f24c]" : "text-[#e9ebe6]/40"
                            }`}
                          >
                            {isCur && playing ? (
                              <EqBars active />
                            ) : (
                              String(t.n).padStart(2, "0")
                            )}
                          </span>
                          <span
                            className={`flex-1 font-['Hanken_Grotesk'] text-sm transition-colors ${
                              isCur
                                ? "text-[#e9ebe6]"
                                : "text-[#e9ebe6]/70 group-hover:text-[#e9ebe6]"
                            }`}
                          >
                            {t.name}
                          </span>
                          <span className="font-['JetBrains_Mono'] text-[11px] text-[#e9ebe6]/40">
                            {t.len}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 3 — NUMBERS + PRESS ---------------------------------------- */}
        <section className="flex min-h-[100dvh] snap-start items-center px-5 py-24">
          <div className="mx-auto w-full max-w-6xl">
            <Reveal>
              <Kicker>Out in the world</Kicker>
            </Reveal>
            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {[
                { v: <Counter to={184000} suffix="" />, l: "Monthly listeners" },
                { v: <Counter to={42} suffix=" cities" />, l: "Toured since 2022" },
                { v: <Counter to={6} prefix="" suffix=" syncs" />, l: "Film & TV placements" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.08} className="bg-[#0a0c10] p-8">
                  <div className="font-['Bricolage_Grotesque'] text-5xl font-extrabold tracking-[-0.03em] text-[#c5f24c]">
                    {s.v}
                  </div>
                  <Label className="mt-3 block text-[#e9ebe6]/55">{s.l}</Label>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PRESS.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <figure className="h-full rounded-xl border border-white/10 bg-[#10131a] p-6">
                    <blockquote className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#e9ebe6]/85">
                      “{p.quote}”
                    </blockquote>
                    <figcaption className="mt-4">
                      <Label className="text-[#c5f24c]">{p.who}</Label>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4 — CTA + FOOTER ------------------------------------------- */}
        <section className="flex min-h-[100dvh] snap-start flex-col">
          <div className="flex flex-1 items-center px-5 py-24">
            <div className="mx-auto w-full max-w-2xl text-center">
              <Oscilloscope playing thin className="mx-auto h-14 w-48 opacity-70" />
              <h2 className="mt-8 font-['Bricolage_Grotesque'] text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
                Letters from the night shift
              </h2>
              <p className="mx-auto mt-4 max-w-md font-['Hanken_Grotesk'] leading-relaxed text-[#e9ebe6]/65">
                One slow email a month — studio notes, unreleased tape loops, and
                first dibs on tickets. No noise.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="flex-1 rounded-full border border-white/15 bg-[#10131a] px-5 py-3 font-['Hanken_Grotesk'] text-sm text-[#e9ebe6] outline-none transition-colors placeholder:text-[#e9ebe6]/35 focus:border-[#c5f24c]"
                />
                <Magnetic strength={0.25}>
                  <button className="rounded-full bg-[#c5f24c] px-6 py-3 font-['JetBrains_Mono'] text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0a0c10] transition-transform duration-200 hover:scale-[1.03]">
                    Subscribe
                  </button>
                </Magnetic>
              </form>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    </motion.div>
  )
}
