import { Link, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { MorphBlobs } from "../MorphBlobs"
import { Counter } from "../Counter"
import { artists } from "../data"

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden">
        <MorphBlobs />
        {/* faint grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-28">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.3em] text-[#c8f135]"
          >
            Lisbon · 19 Sep 2026 · one night only
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-6 font-['Space_Grotesk'] text-[15vw] font-bold leading-[0.86] tracking-tight md:text-[9rem]"
          >
            A signal,
            <br />
            <span className="text-[#c8f135]">made live.</span>
          </motion.h1>

          <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-[#cfd3ca]">
              SIGNAL is a single night of generative art and sound, built in front of you — modular synths,
              live-coded music and shaders rendered in real time, in a 19th-century cistern beneath Lisbon.
              No recordings, no replays. You had to be in the room.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Magnetic>
                <Link
                  to={`${base}/tickets`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#c8f135] px-7 py-3.5 font-['Space_Grotesk'] font-semibold text-[#0a0b0e]"
                >
                  Get a pass <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Link
                to={`${base}/lineup`}
                className="inline-flex items-center gap-1 font-['JetBrains_Mono'] text-sm uppercase tracking-wider text-[#a3a8a0] transition-colors hover:text-[#f3f4ef]"
              >
                See the lineup <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative border-y border-white/10 bg-[#0a0b0e]/60 py-4">
          <Marquee />
        </div>
      </section>

      {/* stats — animated counters */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
          {[
            { v: 8, suffix: "", label: "Live sets, back to back" },
            { v: 220, suffix: "", label: "People, no more" },
            { v: 6, suffix: "", label: "Hours below ground" },
            { v: 1834, suffix: "", label: "Year the cistern was built" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0d0e12] p-7">
              <div className="font-['Space_Grotesk'] text-5xl font-bold text-[#c8f135]">
                <Counter to={s.v} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm leading-snug text-[#a3a8a0]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* lineup teaser */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight md:text-4xl">
              The people making it
            </h2>
            <Link
              to={`${base}/lineup`}
              className="hidden shrink-0 font-['JetBrains_Mono'] text-sm uppercase tracking-wider text-[#a3a8a0] hover:text-[#c8f135] sm:inline"
            >
              All six →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artists.slice(0, 3).map((a, i) => (
            <Reveal key={a.name} delay={i * 0.08}>
              <Link
                to={`${base}/lineup`}
                className="group block overflow-hidden rounded-xl border border-white/10 bg-[#0d0e12] transition-colors duration-300 hover:border-[#c8f135]/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${a.seed}/640/480`}
                    alt={`${a.name}, ${a.role.toLowerCase()} from ${a.city}`}
                    loading="lazy"
                    width={640}
                    height={480}
                    className="h-full w-full object-cover opacity-70 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#0a0b0e]/80 px-3 py-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#c8f135] backdrop-blur">
                    {a.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-['Space_Grotesk'] text-xl font-semibold">{a.name}</h3>
                  <p className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#8b9087]">
                    {a.role} · {a.city}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

function Marquee() {
  const items = [
    "live coding",
    "modular sound",
    "shaders",
    "pen plotters",
    "granular drones",
    "no replays",
    "220 people",
    "one night",
  ]
  const row = [...items, ...items]
  const reduce = useReducedMotion()
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 gap-8 pr-8"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-['Space_Grotesk'] text-lg font-medium text-[#cfd3ca]">
            {t}
            <span className="text-[#c8f135]">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
