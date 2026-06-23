import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Waveform } from "../components/Waveform"
import { TRACKS } from "../components/data"

export function Music() {
  const [active, setActive] = useState<number | null>(4)
  const reduce = useReducedMotion()

  return (
    <div className="px-6 pb-28 pt-16">
      <div className="mx-auto max-w-5xl">
        {/* header block — asymmetric */}
        <div className="grid gap-10 border-b border-white/[0.07] pb-14 md:grid-cols-[1.3fr_1fr] md:items-end">
          <Reveal>
            <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.24em] text-[#e8b15c]">
              The album · 9 tracks · 48 min
            </span>
            <h1 className="mt-4 font-['Bricolage_Grotesque'] text-6xl font-bold tracking-[-0.02em] sm:text-7xl">
              Aurelia
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#9aa1ad]">
              Recorded mostly in single takes, mostly at night. Headphones, low light. Let it run
              from <span className="text-[#c9cdd4]">First Light</span> to{" "}
              <span className="text-[#c9cdd4]">Return</span>.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {/* the "sleeve" — crafted gradient art, not a stock photo */}
            <div className="relative ml-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/[0.08]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 30% 0%, rgba(232,177,92,0.5), transparent 55%), radial-gradient(120% 100% at 80% 100%, rgba(74,112,120,0.55), transparent 60%), #0c0e14",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/3"
                style={{ background: "linear-gradient(to top, rgba(8,9,12,0.85), transparent)" }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.28em] text-[#0a0b10]/80">
                  NL—001
                </span>
                <div>
                  <div className="font-['Bricolage_Grotesque'] text-3xl font-bold leading-none text-[#f4ead7]">
                    SÓL
                  </div>
                  <div className="mt-1 font-['Bricolage_Grotesque'] text-lg italic text-[#f4ead7]/85">
                    Aurelia
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* tracklist — staggered reveal, per-row play state */}
        <ul className="mt-10">
          {TRACKS.map((t, i) => {
            const isActive = active === t.n
            return (
              <Reveal key={t.n} delay={Math.min(i * 0.05, 0.4)}>
                <li>
                  <button
                    type="button"
                    onClick={() => setActive(isActive ? null : t.n)}
                    className={`group grid w-full grid-cols-[2.2rem_1fr_auto] items-center gap-4 rounded-xl px-3 py-4 text-left transition-colors duration-200 sm:gap-6 ${
                      isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.025]"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="relative grid h-9 w-9 place-items-center">
                      <span
                        className={`font-['IBM_Plex_Mono'] text-sm transition-opacity duration-200 ${
                          isActive ? "opacity-0" : "text-[#7e8590] group-hover:opacity-0"
                        }`}
                      >
                        {String(t.n).padStart(2, "0")}
                      </span>
                      <span
                        className={`absolute inset-0 grid place-items-center text-[#e8b15c] transition-opacity duration-200 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isActive ? (
                          <Pause className="h-4 w-4 fill-current" />
                        ) : (
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        )}
                      </span>
                    </span>

                    <span className="min-w-0">
                      <span
                        className={`block truncate font-['Bricolage_Grotesque'] text-lg font-semibold transition-colors ${
                          isActive ? "text-[#e8b15c]" : "text-[#eef0f3] group-hover:text-[#eef0f3]"
                        }`}
                      >
                        {t.title}
                      </span>
                      <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#7e8590]">
                        {t.note}
                      </span>
                    </span>

                    <span className="flex items-center gap-5">
                      <AnimatePresence>
                        {isActive && !reduce && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 88 }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hidden overflow-hidden sm:block"
                          >
                            <Waveform bars={20} className="h-6 w-[88px]" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span className="font-['IBM_Plex_Mono'] text-sm text-[#9aa1ad]">{t.len}</span>
                    </span>
                  </button>
                  {i < TRACKS.length - 1 && <div className="ml-[3.4rem] h-px bg-white/[0.05]" />}
                </li>
              </Reveal>
            )
          })}
        </ul>

        {/* listen CTA */}
        <Reveal>
          <div className="mt-14 flex flex-col items-start gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-['Bricolage_Grotesque'] text-2xl font-semibold">
                Prefer the full quality?
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#9aa1ad]">
                Bandcamp keeps the 24-bit masters and pays artists fairest. Buy once, stream forever.
              </p>
            </div>
            <Magnetic strength={0.4}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 rounded-full bg-[#e8b15c] px-7 py-3.5 font-['IBM_Plex_Mono'] text-[13px] uppercase tracking-[0.14em] text-[#0a0b10] transition-transform duration-200 hover:scale-[1.03]"
              >
                Buy on Bandcamp — €9
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
