import { NavLink, useParams } from "react-router-dom"
import { ArrowRight, Headphones } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { C, EPISODES, SEASON, STATS } from "../theme"
import { Counter, Kicker } from "../bits"
import { WaveformPlayer } from "../player"

/** Hand-built hero motif: a sea fort on the horizon broadcasting signal rings. */
function SignalFort() {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Radio signal rings spreading from a fort in the sea">
      <defs>
        <radialGradient id="fa-glow" cx="50%" cy="62%" r="55%">
          <stop offset="0%" stopColor={C.signal} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.signal} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="320" fill="url(#fa-glow)" />
      {[1, 2, 3, 4, 5].map((r) => (
        <circle
          key={r}
          cx="160"
          cy="196"
          r={r * 30}
          fill="none"
          stroke={C.signal}
          strokeWidth="1"
          strokeOpacity={0.42 - r * 0.06}
        />
      ))}
      {/* horizon */}
      <line x1="20" y1="196" x2="300" y2="196" stroke={C.line} strokeWidth="1.5" />
      {/* fort: two legs + platform + mast */}
      <g stroke={C.text} strokeWidth="3" strokeLinecap="round" fill="none">
        <line x1="142" y1="196" x2="142" y2="150" />
        <line x1="178" y1="196" x2="178" y2="150" />
        <rect x="132" y="132" width="56" height="20" rx="3" fill={C.panelSoft} />
        <line x1="160" y1="132" x2="160" y2="96" />
      </g>
      <circle cx="160" cy="94" r="4" fill={C.signal} />
    </svg>
  )
}

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const featured = EPISODES[0]

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Kicker>Season {SEASON.no} · On air now</Kicker>
            <h1
              className="mt-6 font-['Fraunces'] text-[clamp(3.4rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.02em]"
              style={{ color: C.text }}
            >
              Dead
              <br />
              <span style={{ color: C.signal }}>Air.</span>
            </h1>
            <p className="mt-7 max-w-md font-['Space_Grotesk'] text-[18px] leading-relaxed" style={{ color: C.textSoft }}>
              {SEASON.tagline} A documentary podcast that goes deep on one strange true story each season — then goes quiet.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.4}>
                <NavLink
                  to={`${base}/episodes`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-['Space_Grotesk'] text-[15px] font-semibold transition-transform duration-200"
                  style={{ background: C.signal, color: C.ground }}
                >
                  <Headphones className="h-[18px] w-[18px]" />
                  Start the season
                </NavLink>
              </Magnetic>
              <Magnetic strength={0.3}>
                <NavLink
                  to={`${base}/listen`}
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-['Space_Grotesk'] text-[15px] font-medium transition-colors duration-200"
                  style={{ borderColor: C.line, color: C.text }}
                >
                  Where to listen
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
              </Magnetic>
            </div>
          </div>

          {/* tuning panel + featured player */}
          <Reveal y={28}>
            <div className="rounded-3xl border p-5" style={{ borderColor: C.line, background: C.panel }}>
              <div className="mb-4 aspect-[16/11] overflow-hidden rounded-2xl border" style={{ borderColor: C.line, background: C.ground }}>
                <SignalFort />
              </div>
              <p className="mb-3 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.22em]" style={{ color: C.textFaint }}>
                Now playing · Episode 1
              </p>
              <WaveformPlayer episode={featured} />
              <p className="mt-4 font-['Spectral'] text-[15px] italic leading-relaxed" style={{ color: C.textSoft }}>
                {featured.dek}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="border-y" style={{ borderColor: C.line, background: C.panel }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4" style={{ background: C.line }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="h-full px-6 py-10" style={{ background: C.panel }}>
                <div className="font-['Fraunces'] text-[clamp(2.4rem,5vw,3.4rem)] font-semibold leading-none" style={{ color: C.signal }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-3 max-w-[14ch] font-['Space_Grotesk'] text-[14px] leading-snug" style={{ color: C.textSoft }}>
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The story ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Kicker>The story</Kicker>
            <p className="mt-6 font-['Fraunces'] text-[clamp(1.8rem,3.4vw,2.6rem)] font-medium leading-[1.18] tracking-[-0.01em]" style={{ color: C.text }}>
              For fifty years a signal came from a fort that no longer had anyone aboard.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 font-['Space_Grotesk'] text-[17px] leading-[1.75]" style={{ color: C.textSoft }}>
              <p>
                In 1965 three men rowed out to a derelict sea fort, hauled a transmitter up a rusting ladder, and started to play records to anyone who would tune in. The law came for them. Storms came for them. None of it took the station off the air.
              </p>
              <p>
                <span style={{ color: C.text }}>Dead Air</span> is six episodes about that frequency, the people who kept it alive, and the listeners who — decades after the last DJ left — swear they can still hear it on a clear night over the North Sea.
              </p>
              <p className="border-l-2 pl-5 font-['Spectral'] text-[19px] italic" style={{ borderColor: C.signal, color: C.text }}>
                “We never said goodnight. You don't say goodnight to people who might still be out there.”
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Latest episodes teaser ────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <Kicker>Latest drops</Kicker>
              <h2 className="mt-4 font-['Fraunces'] text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-[-0.01em]" style={{ color: C.text }}>
                Pick up the signal
              </h2>
            </div>
            <NavLink
              to={`${base}/episodes`}
              className="hidden shrink-0 items-center gap-2 font-['Space_Grotesk'] text-[15px] font-medium underline-offset-4 hover:underline sm:inline-flex"
              style={{ color: C.signal }}
            >
              All six episodes <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {EPISODES.slice(1, 3).map((ep, i) => (
              <Reveal key={ep.no} delay={i * 0.1}>
                <article className="flex h-full flex-col rounded-2xl border p-6 transition-colors duration-200 hover:border-[color:var(--h)]" style={{ borderColor: C.line, background: C.panel, ["--h" as string]: C.signal } as React.CSSProperties}>
                  <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.2em]" style={{ color: C.textFaint }}>
                    Ep {ep.no} · {ep.released}
                  </span>
                  <h3 className="mt-3 font-['Fraunces'] text-[24px] font-semibold leading-tight" style={{ color: C.text }}>
                    {ep.title}
                  </h3>
                  <p className="mt-3 mb-5 flex-1 font-['Space_Grotesk'] text-[15px] leading-relaxed" style={{ color: C.textSoft }}>
                    {ep.dek}
                  </p>
                  <WaveformPlayer episode={ep} bars={64} compact />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
