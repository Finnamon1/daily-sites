import { useRef } from "react"
import { Link } from "react-router-dom"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { Reveal } from "@/components/fx/Reveal"
import { Label, STORIES, useBase } from "../shared"

export function Issue() {
  const base = useBase()
  const frameRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "12%"])

  return (
    <div>
      {/* parallax masthead — clipped frame, inner image scaled before drift */}
      <div ref={frameRef} className="relative mt-2 h-[58vh] min-h-[380px] overflow-hidden bg-[#191510]">
        <motion.img
          style={{ y, scale: 1.22 }}
          src="https://picsum.photos/seed/offcut-issue14-timberyard/1600/1000"
          alt="A timber yard at dawn: stacked oak boards drying under a low sun"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191510] via-[#191510]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-10">
            <Label className="text-[#f2ede1]/70">Summer 2026 · 132 pages</Label>
            <h1 className="mt-3 font-['Fraunces'] text-[3rem] font-semibold leading-[0.95] tracking-[-0.03em] text-[#f2ede1] sm:text-[5rem]">
              Issue 14 — <span className="italic text-[#c1351c]">The Grain</span>
            </h1>
          </div>
        </div>
      </div>

      {/* editor's letter + contents */}
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
          {/* letter */}
          <Reveal>
            <div className="md:sticky md:top-28">
              <Label className="text-[#c1351c]">From the editor</Label>
              <p className="mt-5 font-['Fraunces'] text-[1.5rem] leading-[1.3] tracking-[-0.01em] text-[#191510]">
                Wood remembers everything — every dry year, every lean toward the
                light, every wound it grew around.
              </p>
              <p className="mt-5 font-['DM_Sans'] leading-relaxed text-[#191510]/75">
                This issue we follow the grain: down a band saw on a tidal marsh,
                into a fermenting vat of indigo, and back to a print shop left dark
                for forty years. The thread that ties them is patience — the kind
                that only material can teach you.
              </p>
              <p className="mt-4 font-['DM_Sans'] leading-relaxed text-[#191510]/75">
                Read slowly. That's the whole idea.
              </p>
              <p className="mt-6 font-['Fraunces'] text-xl italic text-[#191510]">— Mara Tennent, Editor</p>
            </div>
          </Reveal>

          {/* numbered contents */}
          <div>
            <div className="mb-2 flex items-baseline justify-between border-b border-[#191510]/15 pb-3">
              <Label className="text-[#191510]/70">Contents</Label>
              <Label className="text-[#191510]/70">{STORIES.length} pieces</Label>
            </div>
            <ol>
              {STORIES.map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.04}>
                  <li>
                    <Link
                      to={`${base}/stories`}
                      className="group flex items-baseline gap-5 border-b border-[#191510]/10 py-5"
                    >
                      <span className="font-['Fraunces'] text-2xl font-semibold tabular-nums text-[#191510]/35 transition-colors group-hover:text-[#c1351c]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="block font-['Fraunces'] text-xl font-semibold tracking-[-0.01em] text-[#191510] transition-colors group-hover:text-[#c1351c]">
                          {s.title}
                        </span>
                        <span className="mt-1 block font-['DM_Sans'] text-[15px] text-[#191510]/70">
                          {s.kicker} · {s.author}
                        </span>
                      </span>
                      <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#191510]/70">{s.read}</span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* spec strip */}
      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="grid gap-px overflow-hidden rounded-sm border border-[#191510]/15 bg-[#191510]/15 sm:grid-cols-4">
          {[
            ["132", "pages"],
            ["GSM 120", "uncoated stock"],
            ["Riso + offset", "two presses"],
            ["Saddle-stitched", "by hand"],
          ].map(([a, b]) => (
            <div key={b} className="bg-[#f2ede1] px-5 py-7">
              <p className="font-['Fraunces'] text-2xl font-semibold tracking-[-0.01em] text-[#191510]">{a}</p>
              <Label className="mt-2 block text-[#191510]/70">{b}</Label>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
