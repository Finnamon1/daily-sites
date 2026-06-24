import { useEffect, type ReactNode } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { motion, MotionConfig, useReducedMotion } from "framer-motion"
import { Play, Pause, Headphones, Mic, Waves, Clock, ArrowRight } from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { TiltCard } from "@/components/fx/TiltCard"
import { Reveal } from "@/components/fx/Reveal"
import {
  C,
  DISPLAY,
  SERIF,
  SANS,
  MONO,
  wrap,
  Layout,
  PlayerProvider,
  usePlayer,
  Waveform,
  EqGlyph,
  Counter,
  Duotone,
  Eyebrow,
  ArrowLink,
  fmtTime,
  useBase,
} from "./shared"
import { SHOWS, EPISODES, STATS, PRESS, TEAM, type Episode } from "./data"

/* =========================================================================
   Shared play control — reads the persistent player context
   ========================================================================= */
function PlayButton({ ep, size = 44 }: { ep: Episode; size?: number }) {
  const { current, playing, play, toggle } = usePlayer()
  const isCurrent = current?.id === ep.id
  const isPlaying = isCurrent && playing
  return (
    <button
      onClick={() => (isCurrent ? toggle() : play(ep))}
      aria-label={isPlaying ? `Pause ${ep.title}` : `Play ${ep.title}`}
      className="grid shrink-0 place-items-center rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2"
      style={{
        width: size,
        height: size,
        background: isCurrent ? C.accent : "transparent",
        color: isCurrent ? C.onAccent : C.bone,
        border: isCurrent ? "none" : `1px solid ${C.lineHi}`,
        ["--tw-ring-color" as string]: C.accent,
      }}
    >
      {isPlaying ? <Pause className="h-[45%] w-[45%]" /> : <Play className="ml-[6%] h-[45%] w-[45%]" />}
    </button>
  )
}

/* ---------- a single episode row, reused on Home + Episodes ---------- */
function EpisodeRow({ ep, index }: { ep: Episode; index: number }) {
  const base = useBase()
  const { current, playing, progress } = usePlayer()
  const isCurrent = current?.id === ep.id
  return (
    <Reveal delay={(index % 4) * 0.06}>
      <article
        className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 border-b py-6 transition-colors sm:grid-cols-[auto_1.3fr_1fr_auto]"
        style={{ borderColor: C.line }}
      >
        <PlayButton ep={ep} />

        <div className="min-w-0">
          <Link to={`${base}/episodes`} className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.accent }}>
              {ep.showTitle} · No. {ep.no}
            </span>
            {isCurrent && <EqGlyph live={playing} />}
          </Link>
          <h3
            style={{ fontFamily: DISPLAY, color: C.bone, ["--a" as string]: C.accent }}
            className="mt-1 text-xl font-medium leading-snug transition-colors group-hover:text-[var(--a)]"
          >
            {ep.title}
          </h3>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Waveform seed={ep.wave} progress={isCurrent ? progress : 0} live={isCurrent && playing} height={30} bars={40} />
        </div>

        <div className="flex items-center gap-2 justify-self-start text-[12px] tabular-nums sm:justify-self-end" style={{ fontFamily: MONO, color: C.mute }}>
          <Clock className="h-3.5 w-3.5" />
          {fmtTime(ep.length)}
        </div>
      </article>
    </Reveal>
  )
}

/* =========================================================================
   HOME
   ========================================================================= */
function Hero() {
  const base = useBase()
  const { current, playing, progress, play, toggle, seek } = usePlayer()
  const featured = EPISODES[0]
  const isFeatured = current?.id === featured.id
  const shownProgress = isFeatured ? progress : 0
  return (
    <section className="relative overflow-hidden">
      {/* soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-[0.14] blur-3xl"
        style={{ background: `radial-gradient(circle, ${C.accent}, transparent 70%)` }}
      />
      <div className={`${wrap} grid gap-12 pb-16 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-28`}>
        <div>
          <Eyebrow>On air since 2016 · documentary audio</Eyebrow>
          <h1 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-6 text-balance text-[3.1rem] font-medium leading-[0.98] sm:text-7xl">
            We record the
            <br />
            <span className="italic" style={{ color: C.accent }}>sound just before</span>
            <br />
            silence.
          </h1>
          <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-6 max-w-md text-lg leading-relaxed">
            Roomtone is a network of documentary podcasts built from field tape, lost recordings and the long pauses
            other people edit out. Put your headphones on — the room is breathing.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Magnetic>
              <button
                onClick={() => (isFeatured ? toggle() : play(featured))}
                className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] transition-transform"
                style={{ background: C.accent, color: C.onAccent, fontFamily: SANS }}
              >
                {isFeatured && playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isFeatured && playing ? "Pause the latest" : "Play the latest"}
              </button>
            </Magnetic>
            <ArrowLink to={`${base}/shows`}>Browse the shows</ArrowLink>
          </div>
        </div>

        {/* featured "console" card with the big reactive waveform */}
        <Reveal y={32}>
          <TiltCard max={6}>
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: C.lineHi, background: C.panel }}>
              <Duotone seed={featured.seed} alt={`${featured.title} — cover`} w={900} h={560} hue={featured.hue} rounded="rounded-none" className="aspect-[16/10]" priority>
                <div className="absolute left-5 top-5 flex items-center gap-2">
                  <span className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, background: "rgba(14,14,12,0.6)", color: C.accent, backdropFilter: "blur(6px)" }}>
                    Latest episode
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accent }}>
                    {featured.showTitle}
                  </div>
                  <div style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-1 text-2xl font-medium leading-tight">
                    {featured.title}
                  </div>
                </div>
              </Duotone>

              <div className="p-5">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => (isFeatured ? toggle() : play(featured))}
                    aria-label={isFeatured && playing ? "Pause" : "Play"}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-200 hover:scale-105"
                    style={{ background: C.accent, color: C.onAccent }}
                  >
                    {isFeatured && playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
                  </button>
                  <Waveform
                    seed={featured.wave}
                    progress={shownProgress}
                    live={isFeatured && playing}
                    onSeek={(p) => {
                      if (!isFeatured) play(featured)
                      seek(p)
                    }}
                    height={48}
                    bars={56}
                    className="flex-1"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] tabular-nums" style={{ fontFamily: MONO, color: C.mute }}>
                  <span>{fmtTime(featured.length * shownProgress)}</span>
                  <span>{featured.date}</span>
                  <span>{fmtTime(featured.length)}</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const items = [...PRESS, ...PRESS]
  return (
    <div className="relative overflow-hidden border-y py-4" style={{ borderColor: C.line, background: C.ink2 }}>
      <motion.div
        className="flex w-max items-center gap-10"
        animate={reduce ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {items.map((p, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[13px]" style={{ fontFamily: SERIF, color: C.bone2 }}>
            {p}
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: C.accent }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function StatsBand() {
  return (
    <section className={`${wrap} py-20`}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <Counter
              to={s.value}
              suffix={s.suffix}
              decimals={s.decimals ?? 0}
              className="block text-5xl font-medium sm:text-6xl"
              style={{ fontFamily: DISPLAY, color: C.bone }}
            />
            <div className="mt-2 text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.mute }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ShowsTeaser() {
  const base = useBase()
  return (
    <section className={`${wrap} py-16`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Four running series</Eyebrow>
          <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-4 text-4xl font-medium sm:text-5xl">
            Shows that keep their voice down.
          </h2>
        </div>
        <ArrowLink to={`${base}/shows`}>All shows</ArrowLink>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-12">
        {SHOWS.map((s, i) => {
          const big = i === 0
          return (
            <Reveal key={s.id} delay={i * 0.07} className={big ? "md:col-span-6 md:row-span-2" : "md:col-span-6"}>
              <Link to={`${base}/shows`} className="group block h-full">
                <TiltCard max={big ? 7 : 5} className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border" style={{ borderColor: C.line, background: C.panel }}>
                    <Duotone seed={s.seed} alt={`${s.title} cover art`} w={900} h={big ? 640 : 380} hue={s.hue} rounded="rounded-none" className={big ? "aspect-[7/5]" : "aspect-[16/9]"}>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.accent }}>
                            {s.cadence} · {s.episodes} eps
                          </div>
                          <div style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-1 text-2xl font-medium sm:text-3xl">
                            {s.title}
                          </div>
                        </div>
                      </div>
                    </Duotone>
                    <div className="flex flex-1 flex-col p-6">
                      <p style={{ fontFamily: SERIF, color: C.muteHi }} className="text-[15px] leading-relaxed">
                        {big ? s.blurb : s.tagline}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <span className="text-[12px]" style={{ fontFamily: MONO, color: C.mute }}>
                          Hosted by {s.host}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" style={{ color: C.accent }} />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function LatestTeaser() {
  const base = useBase()
  return (
    <section className={`${wrap} py-16`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Fresh from the studio</Eyebrow>
          <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-4 text-4xl font-medium sm:text-5xl">
            Latest episodes
          </h2>
        </div>
        <ArrowLink to={`${base}/episodes`}>Full archive</ArrowLink>
      </div>
      <div className="mt-8 border-t" style={{ borderColor: C.line }}>
        {EPISODES.slice(0, 4).map((ep, i) => (
          <EpisodeRow key={ep.id} ep={ep} index={i} />
        ))}
      </div>
    </section>
  )
}

function ClosingCTA() {
  return (
    <section className="relative overflow-hidden border-t" style={{ borderColor: C.line, background: C.ink2 }}>
      <div className={`${wrap} relative py-24 text-center`}>
        <Headphones className="mx-auto h-7 w-7" style={{ color: C.accent }} />
        <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-medium leading-tight sm:text-6xl">
          New episode every Thursday, <span className="italic" style={{ color: C.accent }}>just after dark.</span>
        </h2>
        <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mx-auto mt-5 max-w-md text-lg leading-relaxed">
          One letter a week — the story behind the tape, plus a stray field recording too short to be an episode.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-9 flex max-w-md items-center gap-2">
          <label htmlFor="cta-email" className="sr-only">Email address</label>
          <input
            id="cta-email"
            type="email"
            placeholder="you@studio.com"
            className="flex-1 rounded-full border bg-transparent px-5 py-3.5 text-[15px] outline-none transition-colors focus:border-[var(--a)]"
            style={{ borderColor: C.lineHi, color: C.bone, fontFamily: SANS, ["--a" as string]: C.accent }}
          />
          <Magnetic strength={0.3}>
            <button type="submit" className="rounded-full px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ background: C.accent, color: C.onAccent, fontFamily: SANS }}>
              Subscribe
            </button>
          </Magnetic>
        </form>
      </div>
    </section>
  )
}

function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <StatsBand />
      <ShowsTeaser />
      <LatestTeaser />
      <ClosingCTA />
    </main>
  )
}

/* =========================================================================
   SHOWS
   ========================================================================= */
function PageHead({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <section className={`${wrap} pb-10 pt-16 sm:pt-20`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-5 text-5xl font-medium leading-[1.02] sm:text-7xl">
        {title}
      </h1>
      <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-5 max-w-xl text-lg leading-relaxed">
        {lede}
      </p>
    </section>
  )
}

function Shows() {
  return (
    <main>
      <PageHead
        eyebrow="The network"
        title="Shows"
        lede="Four documentary series, each pointed at a different kind of quiet. New seasons commission year-round — pitch us if you record in the dark."
      />
      <div className={`${wrap} space-y-6 pb-24`}>
        {SHOWS.map((s, i) => (
          <Reveal key={s.id} delay={(i % 2) * 0.06}>
            <article
              className={`grid items-stretch gap-0 overflow-hidden rounded-2xl border md:grid-cols-2 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
              style={{ borderColor: C.line, background: C.panel }}
            >
              <Duotone seed={s.seed} alt={`${s.title} cover art`} w={900} h={640} hue={s.hue} rounded="rounded-none" className="aspect-[5/4] md:aspect-auto md:[direction:ltr]">
                <div className="absolute left-5 top-5 flex gap-2" style={{ direction: "ltr" }}>
                  <span className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, background: "rgba(14,14,12,0.6)", color: C.accent, backdropFilter: "blur(6px)" }}>
                    {s.cadence}
                  </span>
                </div>
              </Duotone>

              <div className="flex flex-col p-7 sm:p-10 md:[direction:ltr]">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" style={{ color: C.accent }} />
                  <span className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accent }}>
                    {s.episodes} episodes
                  </span>
                </div>
                <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-3 text-3xl font-medium sm:text-4xl">
                  {s.title}
                </h2>
                <p style={{ fontFamily: SERIF, color: C.bone2 }} className="mt-1 text-[15px] italic">
                  {s.tagline}
                </p>
                <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-4 text-[15px] leading-relaxed">
                  {s.blurb}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-7">
                  <div className="h-9 w-9 overflow-hidden rounded-full ring-1" style={{ borderColor: C.line }}>
                    <img src={`https://picsum.photos/seed/${s.seed}-host/80/80`} alt={`${s.host}, host`} width={80} height={80} loading="lazy" className="h-full w-full object-cover grayscale" />
                  </div>
                  <span className="text-[13px]" style={{ fontFamily: SANS, color: C.muteHi }}>
                    Hosted by <span style={{ color: C.bone }}>{s.host}</span>
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  )
}

/* =========================================================================
   EPISODES
   ========================================================================= */
function Episodes() {
  return (
    <main>
      <PageHead
        eyebrow="Everything we've aired"
        title="Episodes"
        lede="Press play on any line and it follows you across the site. The waveform is real — drag it to scrub, arrow-key it for fine control."
      />
      <div className={`${wrap} pb-28`}>
        <div className="border-t" style={{ borderColor: C.line }}>
          {EPISODES.map((ep, i) => (
            <EpisodeDetail key={ep.id} ep={ep} index={i} />
          ))}
        </div>
      </div>
    </main>
  )
}

function EpisodeDetail({ ep, index }: { ep: Episode; index: number }) {
  const { current, playing, progress, play, toggle, seek } = usePlayer()
  const isCurrent = current?.id === ep.id
  return (
    <Reveal delay={(index % 4) * 0.05}>
      <article
        className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-4 border-b py-8 sm:grid-cols-[auto_1fr_auto]"
        style={{ borderColor: C.line, background: isCurrent ? "rgba(203,242,74,0.04)" : "transparent" }}
      >
        <div className="row-span-2 sm:row-span-1">
          <button
            onClick={() => (isCurrent ? toggle() : play(ep))}
            aria-label={isCurrent && playing ? `Pause ${ep.title}` : `Play ${ep.title}`}
            className="grid h-12 w-12 place-items-center rounded-full transition-transform duration-200 hover:scale-105"
            style={{
              background: isCurrent ? C.accent : "transparent",
              color: isCurrent ? C.onAccent : C.bone,
              border: isCurrent ? "none" : `1px solid ${C.lineHi}`,
            }}
          >
            {isCurrent && playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.accent }}>
              {ep.showTitle} · No. {ep.no}
            </span>
            <span className="text-[11px]" style={{ fontFamily: MONO, color: C.mute }}>{ep.date}</span>
            {isCurrent && <EqGlyph live={playing} />}
          </div>
          <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-1.5 text-2xl font-medium leading-snug">
            {ep.title}
          </h2>
          <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-2 max-w-2xl text-[15px] leading-relaxed">
            {ep.dek}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 sm:w-72 sm:justify-self-end">
          <Waveform
            seed={ep.wave}
            progress={isCurrent ? progress : 0}
            live={isCurrent && playing}
            onSeek={isCurrent ? seek : undefined}
            height={44}
            bars={48}
          />
          <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums" style={{ fontFamily: MONO, color: C.mute }}>
            <span>{isCurrent ? fmtTime(ep.length * progress) : "0:00"}</span>
            <span className="inline-flex items-center gap-1"><Waves className="h-3 w-3" />{fmtTime(ep.length)}</span>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

/* =========================================================================
   STUDIO (about)
   ========================================================================= */
function Studio() {
  const base = useBase()
  const reduce = useReducedMotion()
  return (
    <main>
      <PageHead
        eyebrow="How it's made"
        title="The Studio"
        lede="A six-person team in a soundproofed room in Deptford. No music beds you didn't earn, no narration over the good bits — we let the recording do the talking."
      />

      {/* manifesto */}
      <section className={`${wrap} pb-16`}>
        <div className="grid gap-10 rounded-2xl border p-8 sm:p-12 md:grid-cols-3" style={{ borderColor: C.line, background: C.panel }}>
          {[
            { n: "01", t: "Tape first", b: "We go to the place and we point the mic. Story is found in the levels, not written in advance and illustrated after." },
            { n: "02", t: "Keep the silence", b: "The pauses are the point. Where most shows cut, we hold — room tone is a character, not a problem to fix." },
            { n: "03", t: "Mix for headphones", b: "Every episode is mastered on the same pair of open-backs you're probably wearing. Spatial, quiet, close." },
          ].map((m) => (
            <Reveal key={m.n}>
              <div>
                <div className="text-[12px]" style={{ fontFamily: MONO, color: C.accent }}>{m.n}</div>
                <h3 style={{ fontFamily: DISPLAY, color: C.bone }} className="mt-2 text-2xl font-medium">{m.t}</h3>
                <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-2 text-[15px] leading-relaxed">{m.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* team — staggered grid entrance */}
      <section className={`${wrap} pb-20`}>
        <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="text-3xl font-medium sm:text-4xl">
          The people in the room
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {TEAM.map((p, i) => (
            <motion.div
              key={p.name}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Duotone seed={p.seed} alt={`${p.name}, ${p.role}`} w={300} h={360} hue={p.hue} rounded="rounded-xl" className="aspect-[5/6]" />
              <div className="mt-3 text-[15px] font-semibold" style={{ fontFamily: SANS, color: C.bone }}>{p.name}</div>
              <div className="text-[12px]" style={{ fontFamily: MONO, color: C.mute }}>{p.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* contact strip */}
      <section className="border-t" style={{ borderColor: C.line, background: C.ink2 }}>
        <div className={`${wrap} flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center`}>
          <div>
            <h2 style={{ fontFamily: DISPLAY, color: C.bone }} className="text-3xl font-medium sm:text-4xl">
              Got a recording you can't explain?
            </h2>
            <p style={{ fontFamily: SERIF, color: C.muteHi }} className="mt-2 max-w-md text-[15px] leading-relaxed">
              Pitches, lost tape and unmarked cassettes welcome. We answer every one.
            </p>
          </div>
          <Magnetic>
            <Link
              to={`${base}/episodes`}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em]"
              style={{ background: C.accent, color: C.onAccent, fontFamily: SANS }}
            >
              tape@roomtone.fm <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </section>
    </main>
  )
}

/* =========================================================================
   PAGE TRANSITION + ROOT
   ========================================================================= */
function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function Roomtone() {
  return (
    <MotionConfig reducedMotion="user">
      <PlayerProvider>
        <Layout>
          <ScrollTop />
          <PageShell>
            <Routes>
              <Route index element={<Home />} />
              <Route path="shows" element={<Shows />} />
              <Route path="episodes" element={<Episodes />} />
              <Route path="studio" element={<Studio />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </PageShell>
        </Layout>
      </PlayerProvider>
    </MotionConfig>
  )
}

export const meta: SiteMeta = {
  title: "Roomtone — a documentary-audio network",
  description:
    "A documentary podcast network built from field tape, lost recordings and the silences other shows edit out. Featured interaction: a reactive audio waveform — a faux player lifted into context above the router so a now-playing bar with a scrubbable, equalising waveform follows you across every page — plus an infinite press marquee, magnetic CTAs, 3D-tilt cards, staggered grid entrances and animated counters.",
  date: "2026-06-24",
  type: "Podcast network / audio publication",
  interaction: "Reactive scrubbable waveform player (persistent now-playing bar above the router) + infinite marquee",
  pages: ["Home", "Shows", "Episodes", "Studio"],
}
