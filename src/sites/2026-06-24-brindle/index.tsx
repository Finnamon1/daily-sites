import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Routes, Route, useLocation, Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Check, Quote, PenTool, Ruler, Sparkles } from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import { TiltCard } from "@/components/fx/TiltCard"
import { Reveal } from "@/components/fx/Reveal"
import {
  C,
  DISPLAY,
  SERIF,
  GROTESK,
  SYNE,
  MONO,
  Layout,
  Eyebrow,
  ArrowLink,
  Counter,
  Marquee,
  Page,
  useBase,
  fvs,
} from "./shared"
import { TYPEFACES, STATS, GLYPHS, AXIS_STOPS, TIERS, JOURNAL, PEOPLE } from "./data"

/* =========================================================================
   FEATURED INTERACTION — cursor-reactive variable-font specimen
   The hero headline is set in the foundry's own Fraunces. As the cursor (or
   a touch drag) sweeps across it, each letter's weight bulges toward the
   pointer along the live `wght` axis — ink pooling under your hand. Driven
   imperatively in a single rAF loop (no React churn) and eased per letter.
   Reduced-motion users get a beautifully set, perfectly static headline.
   ========================================================================= */
const HERO_LINES = ["Letters", "with grain."]
const W_BASE = 420
const W_PEAK = 880
const RADIUS = 200

function KineticHero() {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const centers = useRef<number[]>([])
  const current = useRef<number[]>([])
  const pointerX = useRef<number>(-99999)
  const raf = useRef<number>(0)

  // flatten lines into indexed glyphs (spaces kept, but not reactive)
  const model = useMemo(() => {
    let idx = 0
    return HERO_LINES.map((line) =>
      line.split("").map((ch) => ({ ch, idx: idx++ })),
    )
  }, [])

  const measure = () => {
    letterRefs.current.forEach((el, i) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      centers.current[i] = r.left + r.width / 2
      if (current.current[i] == null) current.current[i] = W_BASE
    })
  }

  useEffect(() => {
    if (reduce) return
    measure()
    const onResize = () => measure()
    window.addEventListener("resize", onResize)
    const tick = () => {
      const px = pointerX.current
      for (let i = 0; i < letterRefs.current.length; i++) {
        const el = letterRefs.current[i]
        if (!el) continue
        const cx = centers.current[i] ?? 0
        const f =
          px < -9000 ? 0 : Math.max(0, 1 - Math.abs(px - cx) / RADIUS)
        const target = W_BASE + (W_PEAK - W_BASE) * (f * f)
        const cur = current.current[i] ?? W_BASE
        const next = cur + (target - cur) * 0.16
        current.current[i] = next
        el.style.fontVariationSettings = fvs(next, 144)
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("resize", onResize)
    }
  }, [reduce])

  return (
    <div
      ref={wrapRef}
      onPointerMove={(e) => (pointerX.current = e.clientX)}
      onPointerLeave={() => (pointerX.current = -99999)}
      className="cursor-crosshair select-none"
      style={{ touchAction: "pan-y" }}
    >
      {model.map((line, li) => (
        <div
          key={li}
          className="flex flex-wrap leading-[0.86]"
          style={{ fontFamily: DISPLAY }}
        >
          {line.map(({ ch, idx }) => {
            const isSpace = ch === " "
            return (
              <span
                key={idx}
                ref={(el) => {
                  letterRefs.current[idx] = el
                }}
                className="inline-block text-[16vw] tracking-[-0.02em] sm:text-[12vw] lg:text-[clamp(80px,11vw,168px)]"
                style={{
                  color: li === 1 && idx >= line[0].idx ? C.accent : C.ink,
                  fontVariationSettings: fvs(reduce ? 560 : W_BASE, 144),
                  width: isSpace ? "0.3em" : undefined,
                }}
                aria-hidden
              >
                {isSpace ? " " : ch}
              </span>
            )
          })}
        </div>
      ))}
      <span className="sr-only">Letters with grain.</span>
    </div>
  )
}

/* ------------------------------- HOME ------------------------------ */
function Home() {
  const base = useBase()
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 80% -10%, rgba(200,64,31,0.10), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-14 sm:px-7 sm:pt-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow>Independent type foundry · est. 2015</Eyebrow>
            <span
              className="hidden text-[11px] uppercase tracking-[0.24em] sm:inline"
              style={{ fontFamily: MONO, color: C.mute }}
            >
              ↖ drag across the words
            </span>
          </div>
          <div className="mt-8">
            <KineticHero />
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <p
              className="max-w-xl text-[19px] leading-relaxed sm:text-[21px]"
              style={{ fontFamily: SERIF, color: C.ink2 }}
            >
              Brindle draws reading faces with a little dirt under their
              fingernails — low contrast, warm joins, optical sizes that hold up
              from a caption to a cover. Five families, one obsession.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  to={`${base}/typefaces`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[13px] uppercase tracking-[0.16em] transition-colors"
                  style={{ background: C.accent, color: C.paper, fontFamily: GROTESK }}
                >
                  See the catalogue <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <ArrowLink to={`${base}/specimen`}>Open a specimen</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* marquee of family names */}
      <section
        className="border-y py-5"
        style={{ borderColor: C.line, background: C.paper2 }}
      >
        <Marquee speed={34}>
          {TYPEFACES.concat(TYPEFACES).map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              <span
                className="whitespace-nowrap text-[30px]"
                style={{
                  fontFamily: t.font,
                  color: C.ink,
                  fontStyle: t.italic ? "italic" : "normal",
                  fontWeight: 600,
                }}
              >
                {t.name}
              </span>
              <span style={{ color: C.accent }}>✶</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-7">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t pt-5" style={{ borderColor: C.ink }}>
                <div
                  className="text-[52px] leading-none tracking-[-0.02em]"
                  style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(620, 144), color: C.ink }}
                >
                  <Counter to={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div
                  className="mt-3 text-[13px] leading-snug"
                  style={{ fontFamily: GROTESK, color: C.mute }}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* philosophy split */}
      <section style={{ background: C.ink, color: C.paper }}>
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-24 sm:px-7 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow color={C.accentLt}>The house style</Eyebrow>
            <h2
              className="mt-6 text-[clamp(34px,5vw,60px)] leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(540, 144) }}
            >
              We draw for the eye that has to read it all day.
            </h2>
            <p
              className="mt-6 max-w-md text-[17px] leading-relaxed"
              style={{ fontFamily: SERIF, color: C.paperMute }}
            >
              Grain is what we call the residue of a hand — the asymmetric serif,
              the ink trap that catches the light, the lowercase that breathes.
              It is the difference between a typeface and a font.
            </p>
            <div className="mt-8">
              <ArrowLink to={`${base}/studio`} color={C.paper}>
                Meet the studio
              </ArrowLink>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2" style={{ background: C.lineDk }}>
            {[
              { icon: PenTool, h: "Drawn, not generated", b: "Every curve starts on paper and ends in a Bézier we can defend." },
              { icon: Ruler, h: "Optical sizing", b: "Faces that recut themselves from 9 to 144 point." },
              { icon: Sparkles, h: "Real language support", b: "Extended Latin, Greek and a stack of smart features." },
              { icon: Quote, h: "Tested in the wild", b: "Printed, screen-checked and proofed before release." },
            ].map((f) => (
              <div key={f.h} className="p-7" style={{ background: C.ink2 }}>
                <f.icon className="h-6 w-6" style={{ color: C.accentLt }} />
                <div className="mt-4 text-[17px]" style={{ fontFamily: SYNE, fontWeight: 700 }}>
                  {f.h}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ fontFamily: SERIF, color: C.paperMute }}>
                  {f.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* featured family teaser */}
      <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-7">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Family in focus</Eyebrow>
            <h2
              className="mt-5 text-[clamp(32px,4.5vw,52px)] leading-none tracking-[-0.02em]"
              style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(560, 144) }}
            >
              Brindle Text
            </h2>
          </div>
          <ArrowLink to={`${base}/specimen`}>Full specimen</ArrowLink>
        </div>
        <div className="mt-10 rounded-2xl border p-8 sm:p-12" style={{ borderColor: C.line, background: C.card }}>
          {[700, 540, 430, 340].map((w, i) => (
            <Reveal key={w} delay={i * 0.06}>
              <p
                className="border-b py-4 text-[clamp(26px,5vw,48px)] leading-tight last:border-0"
                style={{
                  fontFamily: DISPLAY,
                  fontVariationSettings: fvs(w, 144),
                  borderColor: C.lineSoft,
                  color: C.ink,
                }}
              >
                The marginalia bloomed in walnut ink
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}

/* ----------------------------- TYPEFACES --------------------------- */
function Typefaces() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const t = TYPEFACES[active]
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-7 sm:py-20">
      <Eyebrow>The catalogue</Eyebrow>
      <h1
        className="mt-5 max-w-2xl text-[clamp(36px,6vw,72px)] leading-[0.98] tracking-[-0.02em]"
        style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(600, 144), color: C.ink }}
      >
        Five families, drawn on one hill.
      </h1>
      <p
        className="mt-6 max-w-lg text-[17px] leading-relaxed"
        style={{ fontFamily: SERIF, color: C.mute }}
      >
        Hover a name to preview it large. Each face ships in trial form — test it
        in your layout before you license a single style.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        {/* the list */}
        <ul className="border-t" style={{ borderColor: C.ink }}>
          {TYPEFACES.map((tf, i) => {
            const on = i === active
            return (
              <li key={tf.name} className="border-b" style={{ borderColor: C.line }}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
                  aria-pressed={on}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className="text-[12px] tabular-nums"
                      style={{ fontFamily: MONO, color: on ? C.accentInk : C.mute }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="text-[clamp(24px,4vw,38px)] leading-none tracking-[-0.01em] transition-transform duration-200 group-hover:translate-x-1"
                      style={{
                        fontFamily: tf.font,
                        fontStyle: tf.italic ? "italic" : "normal",
                        fontWeight: 600,
                        color: on ? C.ink : C.ink2,
                        fontVariationSettings: tf.font.includes("Fraunces") ? fvs(620, 96) : undefined,
                      }}
                    >
                      {tf.name}
                    </span>
                  </span>
                  <span
                    className="hidden shrink-0 text-[11px] uppercase tracking-[0.18em] sm:block"
                    style={{ fontFamily: MONO, color: on ? C.ink : C.mute }}
                  >
                    {tf.styles} styles
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* the reveal panel */}
        <div
          className="sticky top-24 overflow-hidden rounded-2xl border p-8 sm:p-10"
          style={{ borderColor: C.line, background: C.ink, color: C.paper }}
        >
          <motion.div
            key={t.name}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accentLt }}>
                {t.category}
              </span>
              <span className="text-[11px] tabular-nums" style={{ fontFamily: MONO, color: C.paperMute }}>
                {t.year}
              </span>
            </div>
            <div
              className="mt-6 truncate text-[clamp(64px,13vw,128px)] leading-[0.9] tracking-[-0.02em]"
              style={{
                fontFamily: t.font,
                fontStyle: t.italic ? "italic" : "normal",
                fontWeight: 700,
                fontVariationSettings: t.font.includes("Fraunces") ? fvs(760, 144) : undefined,
              }}
            >
              {t.preview}
            </div>
            <p
              className="mt-4 text-[22px] leading-snug"
              style={{
                fontFamily: t.font,
                fontStyle: t.italic ? "italic" : "normal",
                color: C.paper,
              }}
            >
              {t.sample}
            </p>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ fontFamily: SERIF, color: C.paperMute }}>
              {t.blurb}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {t.weights.map((w) => (
                <span
                  key={w.label}
                  className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em]"
                  style={{ borderColor: C.lineDk, fontFamily: MONO, color: C.paperMute }}
                >
                  {w.label}
                </span>
              ))}
            </div>
            <div className="mt-7 text-[12px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.accentLt }}>
              Axes — {t.axes}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ SPECIMEN --------------------------- */
function Specimen() {
  const base = useBase()
  const [wght, setWght] = useState(430)
  const [hover, setHover] = useState<number | null>(null)
  const stop = AXIS_STOPS.reduce((p, c) => (Math.abs(c.wght - wght) < Math.abs(p.wght - wght) ? c : p), AXIS_STOPS[0])
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-7 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow>Specimen · Brindle Text</Eyebrow>
          <h1
            className="mt-5 text-[clamp(40px,8vw,104px)] leading-none tracking-[-0.02em]"
            style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(640, 144), color: C.ink }}
          >
            Brindle Text
          </h1>
        </div>
        <Link
          to={`${base}/license`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[12px] uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-0.5"
          style={{ background: C.ink, color: C.paper, fontFamily: GROTESK }}
        >
          License this family <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* interactive weight axis */}
      <div className="mt-12 rounded-2xl border p-7 sm:p-10" style={{ borderColor: C.line, background: C.card }}>
        <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.mute }}>
          <span>Weight axis</span>
          <span style={{ color: C.accentInk }}>
            {stop.label} · {wght}
          </span>
        </div>
        <p
          className="mt-6 break-words text-[clamp(40px,9vw,120px)] leading-[0.92] tracking-[-0.02em]"
          style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(wght, 144), color: C.ink }}
        >
          Hg&amp;æ
        </p>
        <input
          type="range"
          min={100}
          max={900}
          step={1}
          value={wght}
          onChange={(e) => setWght(Number(e.target.value))}
          aria-label="Adjust weight"
          className="mt-8 w-full cursor-pointer accent-[#C8401F]"
          style={{ accentColor: C.accent }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {AXIS_STOPS.map((s) => (
            <button
              key={s.label}
              onClick={() => setWght(s.wght)}
              className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.1em] transition-colors"
              style={{
                borderColor: wght === s.wght ? C.ink : C.line,
                background: wght === s.wght ? C.ink : "transparent",
                color: wght === s.wght ? C.paper : C.mute,
                fontFamily: MONO,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* paragraph specimen at sizes */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accentInk }}>
            Text · 18 / 28
          </div>
          <p
            className="mt-5 text-[19px] leading-[1.65]"
            style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(430, 28), color: C.ink2 }}
          >
            A typeface earns its keep in the long middle — the second column of
            the third page, where no one is admiring it and everyone is reading
            it. Brindle Text was drawn for that paragraph: open counters that
            keep the rhythm honest, a stress that leans just enough to feel
            spoken, and ink traps that hold the small sizes together when the
            press is generous. Set it and forget it is there. That is the whole
            ambition.
          </p>
          <p
            className="mt-6 text-[15px] italic leading-[1.7]"
            style={{ fontFamily: SERIF, color: C.mute }}
          >
            “The best compliment a reading face can receive is silence.” — from
            the Brindle release notes, 2024.
          </p>
        </div>
        <div className="space-y-6">
          {[
            { size: "text-[40px]", w: 700, label: "Display · 40" },
            { size: "text-[28px]", w: 540, label: "Subhead · 28" },
            { size: "text-[15px]", w: 430, label: "Caption · 15" },
          ].map((row) => (
            <div key={row.label} className="border-t pt-4" style={{ borderColor: C.line }}>
              <div className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.mute }}>
                {row.label}
              </div>
              <div
                className={`mt-2 ${row.size} leading-tight`}
                style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(row.w, 96), color: C.ink }}
              >
                Walnut &amp; grain
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* glyph grid — hover reveal */}
      <div className="mt-20">
        <div className="flex items-center justify-between">
          <Eyebrow>Character set · 1,184 glyphs</Eyebrow>
          <span className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: C.mute }}>
            hover a glyph
          </span>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-px overflow-hidden rounded-2xl border sm:grid-cols-10" style={{ borderColor: C.line, background: C.line }}>
          {GLYPHS.map((g, i) => {
            const on = hover === i
            return (
              <div
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                className="relative flex aspect-square items-center justify-center transition-colors duration-200"
                style={{ background: on ? C.ink : C.card }}
              >
                <span
                  className="text-[34px] transition-all duration-200"
                  style={{
                    fontFamily: DISPLAY,
                    fontVariationSettings: fvs(on ? 760 : 460, 96),
                    color: on ? C.accentLt : C.ink,
                  }}
                >
                  {g}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- STUDIO ---------------------------- */
function Studio() {
  const base = useBase()
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-7 sm:py-20">
      <Eyebrow>The studio</Eyebrow>
      <h1
        className="mt-5 max-w-3xl text-[clamp(34px,5.5vw,68px)] leading-[1.0] tracking-[-0.02em]"
        style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(560, 144), color: C.ink }}
      >
        A three-person foundry on a hill above Bristol, drawing letters slowly on purpose.
      </h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <p className="text-[18px] leading-[1.7]" style={{ fontFamily: SERIF, color: C.ink2 }}>
          We started Brindle in 2015 after a decade of drawing other people's
          house styles. The brief we set ourselves was simple and a little
          stubborn: make reading faces that feel handled, that carry the warmth
          of metal type into a screen, and that we'd be proud to set a whole
          book in. We release rarely and revise endlessly. Every family is
          tested on paper before it ships, because the page is still the harshest
          critic a serif will ever meet.
        </p>
        <div className="rounded-2xl border p-6" style={{ borderColor: C.line, background: C.card }}>
          <div className="text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accentInk }}>
            What we make
          </div>
          <ul className="mt-4 space-y-3">
            {["Retail typefaces", "Custom & exclusive commissions", "Logotype refinement", "Type for identities & books"].map((x) => (
              <li key={x} className="flex items-center gap-2.5 text-[15px]" style={{ fontFamily: GROTESK, color: C.ink2 }}>
                <Check className="h-4 w-4" style={{ color: C.accentInk }} /> {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* people */}
      <div className="mt-20">
        <Eyebrow>The hands</Eyebrow>
        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          {PEOPLE.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <TiltCard max={7} className="h-full">
                <div
                  className="h-full rounded-2xl border p-6"
                  style={{ borderColor: C.line, background: C.card }}
                >
                  <div
                    className="text-[44px] leading-none"
                    style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(620, 144), color: C.accent }}
                  >
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="mt-5 text-[19px]" style={{ fontFamily: SYNE, fontWeight: 700, color: C.ink }}>
                    {p.name}
                  </div>
                  <div className="mt-1 text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                    {p.role}
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed" style={{ fontFamily: SERIF, color: C.mute }}>
                    {p.note}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* journal */}
      <div className="mt-20">
        <div className="flex items-end justify-between">
          <Eyebrow>From the bench</Eyebrow>
          <ArrowLink to={`${base}/typefaces`}>Browse faces</ArrowLink>
        </div>
        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-3" style={{ borderColor: C.line, background: C.line }}>
          {JOURNAL.map((j) => (
            <article key={j.title} className="flex flex-col p-7" style={{ background: C.card }}>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                <span>{j.kicker}</span>
                <span style={{ color: C.mute }}>{j.date}</span>
              </div>
              <h3
                className="mt-4 text-[24px] leading-tight tracking-[-0.01em]"
                style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(560, 96), color: C.ink }}
              >
                {j.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed" style={{ fontFamily: SERIF, color: C.mute }}>
                {j.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ LICENSE ---------------------------- */
function License() {
  const [sent, setSent] = useState(false)
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-7 sm:py-20">
      <Eyebrow>Licensing</Eyebrow>
      <h1
        className="mt-5 max-w-2xl text-[clamp(36px,6vw,72px)] leading-[0.98] tracking-[-0.02em]"
        style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(600, 144), color: C.ink }}
      >
        Honest licences, no per-page anxiety.
      </h1>
      <p className="mt-6 max-w-lg text-[17px] leading-relaxed" style={{ fontFamily: SERIF, color: C.mute }}>
        Perpetual desktop, generous web, friendly app terms. Buy a single style
        or a whole family — student and small-press discounts are a quick email
        away.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <div
              className="flex h-full flex-col rounded-2xl border p-7"
              style={{
                borderColor: tier.best ? C.ink : C.line,
                background: tier.best ? C.ink : C.card,
                color: tier.best ? C.paper : C.ink,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: tier.best ? C.accentLt : C.accentInk }}>
                  {tier.name}
                </span>
                {tier.best && (
                  <span className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]" style={{ background: C.accent, color: C.paper, fontFamily: MONO }}>
                    Best value
                  </span>
                )}
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-[48px] leading-none" style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(620, 144) }}>
                  {tier.price}
                </span>
                <span className="text-[13px]" style={{ fontFamily: GROTESK, color: tier.best ? C.paperMute : C.mute }}>
                  {tier.unit}
                </span>
              </div>
              <ul className="mt-6 space-y-3 border-t pt-6" style={{ borderColor: tier.best ? C.lineDk : C.line }}>
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ fontFamily: GROTESK, color: tier.best ? C.paperMute : C.ink2 }}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: tier.best ? C.accentLt : C.accentInk }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-1">
                <Magnetic>
                  <button
                    className="w-full rounded-full px-5 py-3 text-[12px] uppercase tracking-[0.16em] transition-transform duration-200"
                    style={{
                      background: tier.best ? C.accent : C.ink,
                      color: C.paper,
                      fontFamily: GROTESK,
                    }}
                  >
                    {tier.cta}
                  </button>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* contact */}
      <div className="mt-20 grid gap-12 rounded-2xl border p-8 sm:p-12 lg:grid-cols-[1fr_1fr]" style={{ borderColor: C.line, background: C.paper2 }}>
        <div>
          <h2
            className="text-[clamp(28px,4vw,44px)] leading-tight tracking-[-0.02em]"
            style={{ fontFamily: DISPLAY, fontVariationSettings: fvs(560, 144), color: C.ink }}
          >
            Need something custom?
          </h2>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed" style={{ fontFamily: SERIF, color: C.mute }}>
            Exclusive cuts, extended language coverage, a logotype that needs a
            family to match — tell us what you're setting and we'll send a
            proposal within a week.
          </p>
          <div className="mt-6 text-[13px] tracking-wide" style={{ fontFamily: MONO, color: C.accentInk }}>
            hello@brindle.type · +44 117 000 0000
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
          className="space-y-4"
        >
          {[
            { id: "name", label: "Your name", type: "text", ph: "Edith Maro" },
            { id: "email", label: "Email", type: "email", ph: "you@studio.com" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.mute }}>
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                required
                placeholder={f.ph}
                className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[#181410]"
                style={{ borderColor: C.line, fontFamily: GROTESK, color: C.ink }}
              />
            </div>
          ))}
          <div>
            <label htmlFor="brief" className="text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.mute }}>
              The brief
            </label>
            <textarea
              id="brief"
              rows={4}
              required
              placeholder="What are you setting, and in how many languages?"
              className="mt-2 w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[#181410]"
              style={{ borderColor: C.line, fontFamily: GROTESK, color: C.ink }}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[12px] uppercase tracking-[0.16em] transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: C.ink, color: C.paper, fontFamily: GROTESK }}
          >
            {sent ? "Thank you — we'll be in touch" : "Send the brief"}
            {!sent && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </section>
  )
}

/* ------------------------------- SHELL ----------------------------- */
export default function Brindle() {
  const loc = useLocation()
  return (
    <Layout>
      <Page k={loc.pathname}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="typefaces" element={<Typefaces />} />
          <Route path="specimen" element={<Specimen />} />
          <Route path="studio" element={<Studio />} />
          <Route path="license" element={<License />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Page>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "Brindle Type Co. — Letters with grain",
  description:
    "An independent type foundry site with a cursor-reactive variable-font specimen — letter weights bulge toward your pointer along the live wght axis.",
  date: "2026-06-24",
  type: "Type foundry / e-commerce",
  interaction: "Cursor-reactive variable-font weight (per-letter wght axis)",
  pages: ["Home", "Typefaces", "Specimen", "Studio", "License"],
}
