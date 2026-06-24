import { useRef, useState } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion"
import type { SiteMeta } from "../types"
import {
  C,
  DISPLAY,
  SANS,
  MONO,
  Layout,
  Marquee,
  Stat,
  Eyebrow,
  ArrowLink,
  useBase,
} from "./shared"
import { FACES, GLYPHS, LICENSES, type Face } from "./data"

/* =========================================================================
   FEATURED INTERACTION
   A cursor-reactive variable-font specimen. Moving the pointer across the
   word drives Fraunces' weight (400→700) and optical-size axis live; the
   value also springs back to a resting weight on leave. Fully reachable
   without a cursor — the Type Tester page exposes the same axes as sliders,
   and reduced-motion users get a static, well-set specimen.
   ========================================================================= */
function VariableSpecimen({
  text,
  rest = 460,
  className,
  style,
}: {
  text: string
  rest?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const t = useMotionValue(0.5) // 0..1 across the element
  const st = useSpring(t, { stiffness: 140, damping: 22 })
  const wght = useTransform(st, [0, 1], [340, 700])
  const opsz = useTransform(st, [0, 1], [20, 144])
  const fvs = useMotionTemplate`'wght' ${wght}, 'opsz' ${opsz}`

  if (reduce) {
    return (
      <div ref={ref} className={className} style={{ fontFamily: DISPLAY, fontVariationSettings: `'wght' ${rest}, 'opsz' 110`, ...style }}>
        {text}
      </div>
    )
  }
  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        t.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)))
      }}
      onPointerLeave={() => t.set(0.5)}
      className={className}
      style={{ fontFamily: DISPLAY, fontVariationSettings: fvs, cursor: "ew-resize", ...style }}
    >
      {text}
    </motion.div>
  )
}

/* ----------------------------- HOME ----------------------------- */
function Home() {
  const base = useBase()
  return (
    <main>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-16 sm:pt-24">
          <div className="flex items-center justify-between">
            <Eyebrow>Independent type since 2018</Eyebrow>
            <span style={{ fontFamily: MONO, color: C.mute }} className="hidden text-[11px] uppercase tracking-[0.2em] sm:block">
              ↓ drag across the words
            </span>
          </div>

          <div className="mt-8">
            <VariableSpecimen
              text="Letters"
              className="text-[19vw] leading-[0.82] sm:text-[15vw]"
              style={{ color: C.ink }}
            />
            <div className="flex flex-wrap items-end gap-x-6">
              <VariableSpecimen
                text="with"
                className="text-[19vw] leading-[0.82] sm:text-[15vw]"
                style={{ color: C.blue }}
              />
              <VariableSpecimen
                text="intent"
                className="text-[19vw] leading-[0.82] sm:text-[15vw]"
                style={{ color: C.ink, fontStyle: "italic" }}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p style={{ fontFamily: SANS, color: C.mute }} className="max-w-md text-[17px] leading-relaxed">
              Ravello is a six-family type foundry drawing display, text and code
              faces for editors, brands and the people who sweat the kerning.
              Every family ships variable.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`${base}/library`}
                className="rounded-full px-6 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: C.ink, color: C.paper, fontFamily: SANS }}
              >
                Browse the library
              </Link>
              <Link
                to={`${base}/tester`}
                className="rounded-full border px-6 py-3 text-[14px] font-semibold transition-colors"
                style={{ borderColor: C.ink, color: C.ink, fontFamily: SANS }}
              >
                Open type tester
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={GLYPHS} />

      {/* featured families */}
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>The catalogue</Eyebrow>
            <h2 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 540, 'opsz' 80" }} className="mt-3 text-4xl sm:text-5xl">
              Six families, no filler.
            </h2>
          </div>
          <div className="hidden sm:block">
            <ArrowLink to={`${base}/library`}>See all weights</ArrowLink>
          </div>
        </div>

        {/* asymmetric grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
          {FACES.map((f, i) => {
            // deliberate asymmetry: alternate spans
            const span = i % 3 === 0 ? "md:col-span-4" : "md:col-span-2"
            return (
              <motion.div
                key={f.slug}
                className={span}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <FacePlate face={f} large={i % 3 === 0} />
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* stats band */}
      <section style={{ background: C.paper2 }} className="border-y" >
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-10 px-5 py-16 md:grid-cols-4" style={{ borderColor: C.line }}>
          <Stat to={6} label="Type families" />
          <Stat to={52} label="Individual styles" />
          <Stat to={4} label="Variable axes" suffix="" />
          <Stat to={28} label="Languages drawn" />
        </div>
      </section>

      {/* pull quote */}
      <section className="mx-auto max-w-[1240px] px-5 py-24">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <blockquote className="md:col-span-8">
            <p style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 420, 'opsz' 120", fontStyle: "italic" }} className="text-3xl leading-[1.18] sm:text-[40px]">
              “A typeface isn't decoration. It's the voice the reader hears
              before they've understood a single word — so we draw it like it
              matters.”
            </p>
            <footer style={{ fontFamily: MONO, color: C.mute }} className="mt-6 text-xs uppercase tracking-[0.2em]">
              Ines Ravello — founder & punchcutter
            </footer>
          </blockquote>
          <div className="md:col-span-4">
            <Link
              to={`${base}/studio`}
              className="block rounded-2xl border p-6 transition-colors"
              style={{ borderColor: C.line, background: C.paper }}
            >
              <p style={{ fontFamily: SANS }} className="text-sm leading-relaxed" >
                Read how the foundry works — from first sketch on tracing paper
                to the hinting that survives a 13-inch laptop.
              </p>
              <span className="mt-4 inline-block">
                <ArrowLink to={`${base}/studio`}>Inside the studio</ArrowLink>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

/* a specimen plate used in grids */
function FacePlate({ face, large }: { face: Face; large?: boolean }) {
  const base = useBase()
  return (
    <Link
      to={`${base}/tester?face=${face.slug}`}
      className="group flex h-full flex-col justify-between rounded-2xl border p-6 transition-all hover:-translate-y-1"
      style={{ borderColor: C.line, background: C.paper }}
    >
      <div className="flex items-start justify-between">
        <span style={{ fontFamily: MONO, color: C.mute }} className="text-[11px] uppercase tracking-[0.16em]">
          {face.klass}
        </span>
        <span style={{ fontFamily: MONO, color: C.blueInk }} className="text-[11px]">
          {face.styles} styles
        </span>
      </div>
      <div
        className={large ? "py-8 text-7xl sm:text-8xl" : "py-6 text-5xl"}
        style={{ fontFamily: face.font, color: C.ink, lineHeight: 0.95 }}
      >
        {large ? "Aabcdefg" : "Aa"}
        <span style={{ color: `hsl(${face.hue} 70% 45%)` }}>.</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 560, 'opsz' 36" }} className="text-xl">
          {face.name}
        </span>
        <span style={{ fontFamily: MONO, color: C.mute }} className="text-[11px]">
          {face.year}
        </span>
      </div>
    </Link>
  )
}

/* ----------------------------- LIBRARY ----------------------------- */
function Library() {
  return (
    <main className="mx-auto max-w-[1240px] px-5 py-16">
      <Eyebrow>The library</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 520, 'opsz' 110" }} className="mt-3 max-w-3xl text-5xl leading-[0.95] sm:text-7xl">
        Every family, set large and honestly.
      </h1>
      <p style={{ fontFamily: SANS, color: C.mute }} className="mt-5 max-w-xl text-[17px] leading-relaxed">
        Click any specimen to load it into the tester and try your own words.
      </p>

      <div className="mt-14 flex flex-col divide-y" style={{ borderColor: C.line }}>
        {FACES.map((f, i) => (
          <LibraryRow key={f.slug} face={f} index={i} />
        ))}
      </div>
    </main>
  )
}

function LibraryRow({ face, index }: { face: Face; index: number }) {
  const base = useBase()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="border-t py-10 first:border-t-0"
      style={{ borderColor: C.line }}
    >
      <div className="grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-3">
          <span style={{ fontFamily: MONO, color: C.blueInk }} className="text-[11px] uppercase tracking-[0.2em]">
            {String(index + 1).padStart(2, "0")} — {face.year}
          </span>
          <h2 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 560, 'opsz' 60" }} className="mt-2 text-3xl">
            {face.name}
          </h2>
          <p style={{ fontFamily: MONO, color: C.mute }} className="mt-1 text-[12px]">
            {face.klass} · {face.styles} styles
          </p>
          <p style={{ fontFamily: SANS, color: C.mute }} className="mt-4 max-w-xs text-[14px] leading-relaxed">
            {face.blurb}
          </p>
          <span className="mt-4 inline-block">
            <ArrowLink to={`${base}/tester?face=${face.slug}`}>Try {face.name}</ArrowLink>
          </span>
        </div>
        <Link
          to={`${base}/tester?face=${face.slug}`}
          className="group relative block overflow-hidden rounded-2xl border md:col-span-9"
          style={{ borderColor: C.line, background: C.paper2 }}
        >
          <div
            className="px-7 py-10 transition-transform duration-300 group-hover:scale-[1.01] sm:py-14"
            style={{ fontFamily: face.font, color: C.ink, lineHeight: 0.95 }}
          >
            <div className="text-5xl sm:text-7xl">Handcut letters,</div>
            <div className="mt-2 text-5xl sm:text-7xl" style={{ color: `hsl(${face.hue} 68% 44%)`, fontStyle: face.slug === "aubrac" ? "italic" : "normal" }}>
              spaced by eye.
            </div>
            <div style={{ fontFamily: SANS, color: C.mute }} className="mt-6 text-[13px]">
              ABCDEFGHIJKLM nopqrstuvwxyz 0123456789 &amp; ?!
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}

/* ----------------------------- TYPE TESTER ----------------------------- */
function Tester() {
  const params = new URLSearchParams(useLocation().search)
  const initial = FACES.find((f) => f.slug === params.get("face")) ?? FACES[0]
  const [face, setFace] = useState<Face>(initial)
  const [size, setSize] = useState(78)
  const [weight, setWeight] = useState(500)
  const [italic, setItalic] = useState(false)
  const isFraunces = face.font.includes("Fraunces")

  return (
    <main className="mx-auto max-w-[1240px] px-5 py-12">
      <Eyebrow>Type tester</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 520, 'opsz' 90" }} className="mt-3 text-4xl sm:text-6xl">
        Set your own words.
      </h1>

      {/* face selector */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FACES.map((f) => {
          const active = f.slug === face.slug
          return (
            <button
              key={f.slug}
              onClick={() => setFace(f)}
              className="rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors"
              style={{
                fontFamily: SANS,
                borderColor: active ? C.ink : C.line,
                background: active ? C.ink : "transparent",
                color: active ? C.paper : C.mute,
              }}
            >
              {f.name}
            </button>
          )
        })}
      </div>

      {/* preview */}
      <div className="mt-6 rounded-2xl border p-6 sm:p-10" style={{ borderColor: C.line, background: C.paper2 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
          <span style={{ fontFamily: MONO, color: C.blueInk }} className="text-[12px] uppercase tracking-[0.18em]">
            {face.name} · {face.klass}
          </span>
          <span style={{ fontFamily: MONO, color: C.mute }} className="text-[12px]">
            {size}px / {weight}{italic ? " italic" : ""}
          </span>
        </div>
        {/* Uncontrolled on purpose: binding children to state moves the caret
            to the start on every keystroke. Typed text persists across face
            switches because the node stays mounted; only style props change. */}
        <div
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Editable type specimen — click and type your own words"
          tabIndex={0}
          className="rounded-sm outline-none focus-visible:ring-2"
          style={{
            fontFamily: face.font,
            fontSize: size,
            lineHeight: 1.05,
            color: C.ink,
            fontStyle: italic ? "italic" : "normal",
            fontWeight: isFraunces ? undefined : weight,
            fontVariationSettings: isFraunces ? `'wght' ${weight}, 'opsz' ${Math.min(144, Math.max(9, size))}` : undefined,
          }}
        >
          The quick brown fox jumps over a lazy dog
        </div>
      </div>

      {/* controls */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Slider label="Size" value={size} min={24} max={160} unit="px" onChange={setSize} />
        <Slider label="Weight" value={weight} min={isFraunces ? 400 : 300} max={isFraunces ? 700 : 800} unit="" onChange={setWeight} />
        <div>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: MONO, color: C.mute }} className="text-[11px] uppercase tracking-[0.18em]">Style</span>
          </div>
          <button
            onClick={() => setItalic((v) => !v)}
            className="mt-3 w-full rounded-lg border py-2.5 text-[14px] font-medium transition-colors"
            style={{
              fontFamily: SANS,
              borderColor: italic ? C.ink : C.line,
              background: italic ? C.ink : "transparent",
              color: italic ? C.paper : C.ink,
            }}
          >
            {italic ? "Italic — on" : "Roman / Italic"}
          </button>
        </div>
      </div>

      {/* hint */}
      <p style={{ fontFamily: SANS, color: C.mute }} className="mt-8 text-[14px]">
        Tip: the preview is editable — click it and type. Sliders mirror the
        same variable axes the cursor drives on the home page.
      </p>
    </main>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: MONO, color: C.mute }} className="text-[11px] uppercase tracking-[0.18em]">
          {label}
        </span>
        <span style={{ fontFamily: MONO, color: C.ink }} className="text-[12px]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ravello-range mt-3 w-full"
        aria-label={label}
      />
    </div>
  )
}

/* ----------------------------- STUDIO ----------------------------- */
function Studio() {
  return (
    <main>
      <section className="mx-auto max-w-[1240px] px-5 py-16">
        <Eyebrow>The studio</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 500, 'opsz' 120" }} className="mt-3 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">
          Two desks, a lot of tracing paper, and a refusal to rush a curve.
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <img
              src="https://picsum.photos/seed/ravello-studio-desk/1200/800"
              alt="The Ravello studio: a drawing desk with type proofs pinned above it"
              width={1200}
              height={800}
              loading="lazy"
              className="aspect-[3/2] w-full rounded-2xl border object-cover"
              style={{ borderColor: C.line, filter: "grayscale(1) contrast(1.04)" }}
            />
          </div>
          <div className="md:col-span-5">
            <p style={{ fontFamily: SANS, color: C.ink }} className="text-[18px] leading-relaxed">
              Ravello began in 2018 in a Lisbon back room with one revival and a
              borrowed light table. It's now two people across two cities — Ines
              draws, Theo spaces, and both argue about the comma.
            </p>
            <p style={{ fontFamily: SANS, color: C.mute }} className="mt-5 text-[16px] leading-relaxed">
              We release slowly and on purpose. A family ships only once it holds
              up at six pixels and six feet — proofed in real layouts, hinted by
              hand, and tested in the languages our clients actually set.
            </p>
          </div>
        </div>
      </section>

      {/* process steps */}
      <section style={{ background: C.paper2 }} className="border-y" >
        <div className="mx-auto max-w-[1240px] px-5 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Draw", d: "Every glyph starts on paper. We chase the skeleton before we touch a single Bézier handle." },
              { n: "02", t: "Space", d: "Spacing is the typeface. We set proofs in paragraphs, not in the glyph grid, and tune by eye." },
              { n: "03", t: "Ship", d: "Variable masters, hinting, and a real licence written by humans — not a 40-page PDF." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 560, 'opsz' 110", color: C.blue }} className="text-6xl">
                  {s.n}
                </span>
                <h3 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 560, 'opsz' 40" }} className="mt-3 text-2xl">
                  {s.t}
                </h3>
                <p style={{ fontFamily: SANS, color: C.mute }} className="mt-2 text-[15px] leading-relaxed">
                  {s.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* people */}
      <section className="mx-auto max-w-[1240px] px-5 py-16">
        <h2 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 520, 'opsz' 70" }} className="text-4xl">
          The two of us.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            { name: "Ines Ravello", role: "Founder · type design", seed: "ines-ravello-portrait", bio: "Trained in Reading, spent five years on newspaper revivals. Draws the display and serif families." },
            { name: "Theo Marl", role: "Production · spacing & code", seed: "theo-marl-portrait", bio: "Ex-software, now obsessed with kerning. Owns the sans, the mono, and the build pipeline." },
          ].map((p) => (
            <div key={p.name} className="flex gap-5 rounded-2xl border p-5" style={{ borderColor: C.line }}>
              <img
                src={`https://picsum.photos/seed/${p.seed}/320/320`}
                alt={`Portrait of ${p.name}`}
                width={320}
                height={320}
                loading="lazy"
                className="h-24 w-24 flex-none rounded-xl object-cover"
                style={{ filter: "grayscale(1)" }}
              />
              <div>
                <h3 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 560, 'opsz' 36" }} className="text-2xl">
                  {p.name}
                </h3>
                <p style={{ fontFamily: MONO, color: C.blueInk }} className="mt-0.5 text-[11px] uppercase tracking-[0.16em]">
                  {p.role}
                </p>
                <p style={{ fontFamily: SANS, color: C.mute }} className="mt-2 text-[14px] leading-relaxed">
                  {p.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

/* ----------------------------- LICENSE ----------------------------- */
function License() {
  const base = useBase()
  return (
    <main className="mx-auto max-w-[1240px] px-5 py-16">
      <Eyebrow>Licensing</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 520, 'opsz' 110" }} className="mt-3 max-w-3xl text-5xl leading-[0.95] sm:text-7xl">
        Honest licences. No fine-print ambush.
      </h1>
      <p style={{ fontFamily: SANS, color: C.mute }} className="mt-5 max-w-xl text-[17px] leading-relaxed">
        Buy a style, a family, or talk to us about something bigger. Trial fonts
        are free for sketching — just don't ship them.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {LICENSES.map((l, i) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="flex flex-col rounded-2xl border p-7"
            style={{
              borderColor: l.featured ? C.ink : C.line,
              background: l.featured ? C.ink : C.paper,
              color: l.featured ? C.paper : C.ink,
            }}
          >
            <div className="flex items-baseline justify-between">
              <h2 style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 560, 'opsz' 40" }} className="text-2xl">
                {l.name}
              </h2>
              {l.featured && (
                <span style={{ fontFamily: MONO, color: C.blueLt }} className="text-[10px] uppercase tracking-[0.18em]">
                  Most picked
                </span>
              )}
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <span style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 600, 'opsz' 90" }} className="text-5xl">
                {l.price}
              </span>
              <span style={{ fontFamily: MONO, color: l.featured ? "rgba(244,241,232,0.6)" : C.mute }} className="text-[12px]">
                {l.unit}
              </span>
            </div>
            <p style={{ fontFamily: SANS, color: l.featured ? "rgba(244,241,232,0.75)" : C.mute }} className="mt-1 text-[13px]">
              {l.for}
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {l.perks.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px]" style={{ fontFamily: SANS }}>
                  <span className="mt-[7px] inline-block h-[5px] w-[5px] flex-none rounded-full" style={{ background: l.featured ? C.blueLt : C.blue }} />
                  <span style={{ color: l.featured ? C.paper : C.ink }}>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              to={`${base}/tester`}
              className="mt-7 rounded-full py-2.5 text-center text-[14px] font-semibold transition-transform hover:-translate-y-0.5"
              style={{
                background: l.featured ? C.paper : C.ink,
                color: l.featured ? C.ink : C.paper,
                fontFamily: SANS,
              }}
            >
              {l.featured ? "Get the family" : "Choose " + l.name}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border p-7" style={{ borderColor: C.line }}>
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          <p style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 460, 'opsz' 60", fontStyle: "italic" }} className="text-2xl md:col-span-8">
            Education and small non-profits get 50% off, no forms. Email us and
            tell us what you're making.
          </p>
          <div className="md:col-span-4 md:text-right">
            <ArrowLink to={`${base}/studio`}>Meet the foundry</ArrowLink>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ----------------------------- ROOT ----------------------------- */
function Page({ children }: { children: React.ReactNode }) {
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

export default function Ravello() {
  return (
    <Layout>
      <style>{`
        .ravello-range { -webkit-appearance: none; appearance: none; height: 2px; background: ${C.line}; border-radius: 999px; outline: none; }
        .ravello-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 999px; background: ${C.blue}; cursor: pointer; border: 3px solid ${C.paper}; box-shadow: 0 0 0 1px ${C.blue}; transition: transform .15s ease; }
        .ravello-range::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .ravello-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 999px; background: ${C.blue}; cursor: pointer; border: 3px solid ${C.paper}; }
      `}</style>
      <Routes>
        <Route index element={<Page><Home /></Page>} />
        <Route path="library" element={<Page><Library /></Page>} />
        <Route path="tester" element={<Page><Tester /></Page>} />
        <Route path="studio" element={<Page><Studio /></Page>} />
        <Route path="license" element={<Page><License /></Page>} />
        <Route path="*" element={<Page><Home /></Page>} />
      </Routes>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "Ravello — Independent Type Foundry",
  description:
    "A six-family type foundry for editors, brands and people who sweat the kerning. Featured interaction: a cursor-reactive variable-font specimen — drag across the words to drive Fraunces' weight and optical-size axes live — plus a full editable type tester, glyph marquee and animated counters.",
  date: "2026-06-24",
  type: "Type foundry / e-commerce",
  interaction: "Cursor-reactive variable-font type specimen + live type tester",
  pages: ["Home", "Library", "Type Tester", "Studio", "License"],
}
