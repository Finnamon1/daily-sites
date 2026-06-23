import { useParams, NavLink } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, Disc3, Play } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { Waveform } from "../components/Waveform"

/** A soft, slow aurora — pure CSS gradients, drifting. No stock photo. */
function Aurora({ reduce }: { reduce: boolean | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-1/3 left-1/2 h-[120vh] w-[120vw] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,177,92,0.07), transparent 70%), radial-gradient(closest-side, rgba(95,180,170,0.06), transparent 65%)",
          filter: "blur(40px)",
        }}
        animate={reduce ? undefined : { x: [0, 60, -30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 38px, rgba(255,255,255,0.012) 38px 39px)",
        }}
      />
    </div>
  )
}

const PANELS = ["intro", "statement", "track"] as const

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const reduce = useReducedMotion()

  return (
    <>
      {/* ── Featured interaction: full-viewport scroll-snap panels ── */}
      <section
        style={{
          background:
            "radial-gradient(120% 60% at 50% -10%, rgba(232,177,92,0.06), transparent 60%), radial-gradient(100% 70% at 50% 115%, rgba(74,112,120,0.07), transparent 60%)",
        }}
        className={`relative h-[calc(100svh-4rem)] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          reduce ? "" : "snap-y snap-mandatory"
        }`}
      >
        <Aurora reduce={reduce} />

        {/* panel 1 — the announcement */}
        <Panel id={PANELS[0]}>
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.3em] text-[#e8b15c]"
            >
              Debut album · Out now
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-4 font-['Bricolage_Grotesque'] text-[19vw] font-bold leading-[0.82] tracking-[-0.03em] sm:text-[16vw] lg:text-[12rem]"
            >
              Aurelia
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="mt-7 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-base leading-relaxed text-[#c9cdd4] sm:max-w-sm">
                Nine pieces for piano, strings and the sea — written by{" "}
                <span className="text-[#eef0f3]">Sól Bjarkadóttir</span> through one long Icelandic winter.
              </p>
              <Magnetic strength={0.45}>
                <NavLink
                  to={`${base}/music`}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#e8b15c] px-7 py-3.5 font-['IBM_Plex_Mono'] text-[13px] uppercase tracking-[0.14em] text-[#0a0b10] transition-transform duration-200 hover:scale-[1.03]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Press play
                </NavLink>
              </Magnetic>
            </motion.div>
          </div>

          <ScrollHint label="Scroll — three movements" />
        </Panel>

        {/* panel 2 — the statement */}
        <Panel id={PANELS[1]}>
          <div className="mx-auto grid h-full max-w-5xl place-items-center px-6">
            <Reveal>
              <p className="font-['Bricolage_Grotesque'] text-3xl font-medium leading-[1.18] tracking-[-0.01em] text-[#eef0f3] sm:text-[2.6rem] sm:leading-[1.16]">
                <span className="text-[#7e8590]">“</span>I wanted the room in the recordings — the
                hum of the lamp, the wind finding the window.{" "}
                <span className="text-[#e8b15c]">Aurelia</span> is not clean. It is{" "}
                <span className="italic">kept</span>.<span className="text-[#7e8590]">”</span>
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.24em] text-[#9aa1ad]">
                — Sól, on recording in a lighthouse
              </p>
            </Reveal>
          </div>
        </Panel>

        {/* panel 3 — the featured track */}
        <Panel id={PANELS[2]} last>
          <div className="mx-auto flex h-full max-w-5xl flex-col justify-center px-6">
            <Reveal>
              <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.24em] text-[#e8b15c]">
                Now playing — track 04
              </span>
            </Reveal>
            <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <Reveal delay={0.06}>
                <h2 className="font-['Bricolage_Grotesque'] text-6xl font-bold tracking-[-0.02em] sm:text-7xl">
                  Aurelia
                </h2>
                <p className="mt-3 font-['IBM_Plex_Mono'] text-sm text-[#9aa1ad]">
                  3:57 · the title piece · piano + tape
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <Magnetic strength={0.4}>
                  <button
                    type="button"
                    className="grid h-16 w-16 place-items-center rounded-full border border-[#e8b15c]/50 text-[#e8b15c] transition-colors duration-200 hover:bg-[#e8b15c] hover:text-[#0a0b10]"
                    aria-label="Play Aurelia"
                  >
                    <Play className="ml-0.5 h-6 w-6 fill-current" />
                  </button>
                </Magnetic>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="mt-10">
              <Waveform bars={64} className="h-20 w-full" />
            </Reveal>
          </div>
        </Panel>
      </section>

      {/* ── Below the snap region: formats, normal flow ── */}
      <Formats />
    </>
  )
}

function Panel({
  id,
  children,
  last = false,
}: {
  id: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      id={id}
      className={`relative ${
        last ? "snap-end" : "snap-start"
      } flex h-[calc(100svh-4rem)] flex-col`}
    >
      {children}
    </div>
  )
}

function ScrollHint({ label }: { label: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="absolute inset-x-0 bottom-7 flex justify-center">
      <div className="flex items-center gap-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.22em] text-[#7e8590]">
        <span>{label}</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.span>
      </div>
    </div>
  )
}

const FORMATS = [
  {
    name: "180g Vinyl",
    price: "€32",
    note: "Double LP at 45rpm, gatefold sleeve, hand-numbered. Includes lossless download.",
    tag: "First pressing — 500 copies",
    feature: true,
  },
  { name: "Compact Disc", price: "€14", note: "Digipak with 16-page booklet of winter photographs.", tag: "Shipping now", feature: false },
  { name: "Lossless Digital", price: "€9", note: "24-bit / 96kHz FLAC, plus an unlisted tenth piece.", tag: "Instant", feature: false },
]

function Formats() {
  return (
    <section className="border-t border-white/[0.07] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3">
            <Disc3 className="h-4 w-4 text-[#e8b15c]" />
            <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.24em] text-[#9aa1ad]">
              Take it home
            </span>
          </div>
          <h2 className="mt-4 max-w-xl font-['Bricolage_Grotesque'] text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
            Pressed to last longer than the streaming era.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {FORMATS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.08}>
              <div
                className={`group flex h-full flex-col justify-between rounded-2xl border p-7 transition-colors duration-300 ${
                  f.feature
                    ? "border-[#e8b15c]/30 bg-[#e8b15c]/[0.04] hover:border-[#e8b15c]/60"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-['Bricolage_Grotesque'] text-2xl font-semibold">{f.name}</h3>
                    <span className="font-['IBM_Plex_Mono'] text-lg text-[#e8b15c]">{f.price}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#9aa1ad]">{f.note}</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#7e8590]">
                    {f.tag}
                  </span>
                  <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.14em] text-[#eef0f3] transition-colors group-hover:text-[#e8b15c]">
                    Add →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
