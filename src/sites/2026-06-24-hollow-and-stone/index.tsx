import { useState, type ReactNode } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { BedDouble, Bath, Maximize, MapPin, ArrowRight, Check } from "lucide-react"
import type { SiteMeta } from "../types"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Magnetic } from "@/components/fx/Magnetic"
import {
  C,
  DISPLAY,
  SERIF,
  SANS,
  MONO,
  Layout,
  Eyebrow,
  ArrowLink,
  Counter,
  Frame,
  BeforeAfter,
  useBase,
} from "./shared"
import { HOMES, PROJECTS, PROCESS, TEAM, STATS, QUOTES, type Home } from "./data"

/* ----------------------------- page transition ----------------------------- */
function Page({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

const SECTION = "mx-auto max-w-[1180px] px-5"

/* status pill */
function Status({ status }: { status: Home["status"] }) {
  const map: Record<Home["status"], { bg: string; fg: string }> = {
    "For sale": { bg: C.accent, fg: C.paper },
    "Under offer": { bg: C.ink, fg: C.paper },
    Reserved: { bg: C.paper2, fg: C.ink2 },
  }
  const s = map[status]
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
      style={{ fontFamily: MONO, background: s.bg, color: s.fg }}
    >
      {status}
    </span>
  )
}

/* listing card — hover lifts, image eases in, the price slides */
function HomeCard({ home, base, i }: { home: Home; base: string; i: number }) {
  return (
    <Reveal delay={i * 0.07}>
      <Link to={`${base}/homes`} className="group block">
        <div className="relative overflow-hidden rounded-[4px]" style={{ background: C.paper2 }}>
          <div className="overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${home.seed}/900/680`}
              alt={`${home.name}, a restored period home in ${home.place}`}
              width={900}
              height={680}
              loading="lazy"
              className="aspect-[9/7] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={{ filter: `saturate(0.92) contrast(1.04) sepia(0.1) hue-rotate(${home.hue - 30}deg)` }}
            />
          </div>
          <div className="absolute left-3 top-3">
            <Status status={home.status} />
          </div>
          <span aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(33,30,24,0.12)" }} />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
              {home.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px]" style={{ color: C.mute }}>
              <MapPin size={13} style={{ color: C.accentInk }} /> {home.place}
            </p>
          </div>
          <span className="shrink-0 text-[17px]" style={{ fontFamily: SERIF, color: C.ink }}>
            {home.price}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-[12px]" style={{ fontFamily: MONO, color: C.mute }}>
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} /> {home.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={14} /> {home.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize size={14} /> {home.sqft}
          </span>
          <span className="ml-auto" style={{ color: C.accentInk }}>
            est. {home.built}
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

/* ================================ HOME ================================ */
function Home() {
  const base = useBase()
  const lead = PROJECTS[0]
  return (
    <Page>
      {/* hero — asymmetric: type left, stacked frames right */}
      <section className="relative overflow-hidden">
        <div className={`${SECTION} grid items-end gap-10 pb-16 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-24`}>
          <div>
            <Eyebrow>South Pennines · est. since 2009</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2.6rem,7vw,5.1rem)] font-extrabold leading-[0.95] tracking-[-0.03em]"
              style={{ fontFamily: DISPLAY }}
            >
              Old buildings,
              <br />
              <span style={{ color: C.accentInk }}>put right.</span>
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed" style={{ fontFamily: SERIF, color: C.ink2 }}>
              We find the chapels, weavers' cottages and mill lodges nobody else sees, restore
              them with the same local trades on every job, and sell them warm, watertight and whole.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  to={`${base}/homes`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold transition-transform"
                  style={{ background: C.ink, color: C.paper, fontFamily: SANS }}
                >
                  See homes for sale <ArrowRight size={16} />
                </Link>
              </Magnetic>
              <ArrowLink to={`${base}/work`}>How we work</ArrowLink>
            </div>
          </div>

          <div className="grid h-[380px] grid-cols-5 grid-rows-6 gap-3 sm:h-[440px]">
            <Frame
              seed="hero-pennine-cottage-stone"
              alt="A restored gritstone weavers' cottage above a Pennine valley"
              hue={30}
              priority
              className="col-span-3 row-span-6"
            />
            <Frame
              seed="hero-arched-window-light"
              alt="Reglazed arched chapel window letting in morning light"
              hue={28}
              className="col-span-2 row-span-3"
            />
            <Frame
              seed="hero-oak-stair-detail"
              alt="New oak stair against original stone wall"
              hue={36}
              className="col-span-2 row-span-3"
            />
          </div>
        </div>
      </section>

      {/* stat band */}
      <section style={{ background: C.panel, color: C.paper }}>
        <div className={`${SECTION} grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4`}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="border-l pl-5" style={{ borderColor: C.lineDk }}>
                <Counter
                  to={s.value}
                  suffix={s.suffix}
                  className="block text-[clamp(2rem,4vw,2.8rem)] font-extrabold tracking-tight"
                  style={{ fontFamily: DISPLAY, color: C.paper }}
                />
                <p className="mt-1 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.accentLt }}>
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured before/after teaser */}
      <section className={`${SECTION} py-20 md:py-28`}>
        <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow>The work · drag to compare</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.9rem)] font-bold leading-[1.04] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
              The same wall, the same light — sixty years apart.
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed" style={{ color: C.ink2 }}>
              {lead.note} Pull the handle across {lead.name} below, then see every restoration on The Work.
            </p>
            <div className="mt-7">
              <ArrowLink to={`${base}/work`}>See all restorations</ArrowLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfter
              seed={lead.seed}
              hue={lead.hue}
              altBefore={`${lead.name} as we found it — cold, damp and partitioned`}
              altAfter={`${lead.name} restored — warm light through the reopened windows`}
            />
          </Reveal>
        </div>
      </section>

      {/* current homes */}
      <section className={`${SECTION} pb-24`}>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>On the market</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
              A few homes, looked after.
            </h2>
          </div>
          <div className="hidden sm:block">
            <ArrowLink to={`${base}/homes`}>All homes</ArrowLink>
          </div>
        </div>
        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {HOMES.slice(0, 3).map((h, i) => (
            <HomeCard key={h.id} home={h} base={base} i={i} />
          ))}
        </div>
      </section>

      {/* quote */}
      <section style={{ background: C.paper2 }}>
        <div className={`${SECTION} py-20`}>
          <Reveal>
            <blockquote className="mx-auto max-w-3xl text-center">
              <p className="text-[clamp(1.5rem,3.4vw,2.3rem)] leading-[1.25]" style={{ fontFamily: SERIF, color: C.ink }}>
                “{QUOTES[0].text}”
              </p>
              <footer className="mt-6 text-[13px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                {QUOTES[0].who} — {QUOTES[0].where}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}

/* ================================ HOMES ================================ */
function Homes() {
  const base = useBase()
  return (
    <Page>
      <section className={`${SECTION} pt-16 md:pt-20`}>
        <Eyebrow>Homes for sale</Eyebrow>
        <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <h1 className="text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.03em]" style={{ fontFamily: DISPLAY }}>
            Four buildings,
            <br />
            each one finished.
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed" style={{ color: C.mute }}>
            We never list a part-done project. Every home below is warm, watertight and certified —
            ready to move into, not to take on.
          </p>
        </div>
      </section>

      <section className={`${SECTION} py-14`}>
        <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2">
          {HOMES.map((h, i) => (
            <Reveal key={h.id} delay={(i % 2) * 0.08}>
              <article className="group">
                <div className="relative overflow-hidden rounded-[4px]" style={{ background: C.paper2 }}>
                  <div className="overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${h.seed}/1100/760`}
                      alt={`${h.name} — a restored period home in ${h.place}`}
                      width={1100}
                      height={760}
                      loading="lazy"
                      className="aspect-[11/7] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      style={{ filter: `saturate(0.92) contrast(1.04) sepia(0.1) hue-rotate(${h.hue - 30}deg)` }}
                    />
                  </div>
                  <div className="absolute left-3 top-3">
                    <Status status={h.status} />
                  </div>
                  <span aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(33,30,24,0.12)" }} />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="text-[24px] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
                    {h.name}
                  </h2>
                  <span className="text-[20px]" style={{ fontFamily: SERIF }}>
                    {h.price}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[13px]" style={{ color: C.mute }}>
                  <MapPin size={13} style={{ color: C.accentInk }} /> {h.place} · est. {h.built}
                </p>
                <p className="mt-3 max-w-prose text-[15px] leading-relaxed" style={{ color: C.ink2 }}>
                  {h.blurb}
                </p>
                <div
                  className="mt-4 flex items-center gap-5 border-t pt-4 text-[13px]"
                  style={{ borderColor: C.line, fontFamily: MONO, color: C.mute }}
                >
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={15} /> {h.beds} bed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath size={15} /> {h.baths} bath
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize size={15} /> {h.sqft}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${SECTION} pb-24`}>
        <div
          className="flex flex-col items-start justify-between gap-5 rounded-[6px] p-8 sm:flex-row sm:items-center"
          style={{ background: C.panel, color: C.paper }}
        >
          <div>
            <h3 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
              Looking for something we haven't found yet?
            </h3>
            <p className="mt-1.5 text-[14px]" style={{ color: C.muteHi }}>
              Tell us the building you have in mind. We'll let you know before it reaches the market.
            </p>
          </div>
          <Magnetic>
            <Link
              to={`${base}/enquire`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold"
              style={{ background: C.accentLt, color: C.panel, fontFamily: SANS }}
            >
              Register interest <ArrowRight size={16} />
            </Link>
          </Magnetic>
        </div>
      </section>
    </Page>
  )
}

/* ================================ THE WORK ================================ */
function Work() {
  return (
    <Page>
      <section className={`${SECTION} pt-16 md:pt-20`}>
        <Eyebrow>The work · drag to compare</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.2rem,5.5vw,3.7rem)] font-extrabold leading-[0.98] tracking-[-0.03em]" style={{ fontFamily: DISPLAY }}>
          We don't redecorate. We give the building back its bones.
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed" style={{ fontFamily: SERIF, color: C.ink2 }}>
          Drag the handle on each photograph to see how a place arrived and how it left.
          The cold, flat side is exactly as we found it; the warm side is the same wall,
          the same light, after the work was done.
        </p>
      </section>

      <section className={`${SECTION} space-y-20 py-16 md:space-y-28 md:py-20`}>
        {PROJECTS.map((p, i) => (
          <div key={p.id} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
            <Reveal className="md:[direction:ltr]">
              <BeforeAfter
                seed={p.seed}
                hue={p.hue}
                altBefore={`${p.name} as found — cold, damp and stripped of its detail`}
                altAfter={`${p.name} restored — warm, watertight and full of light`}
              />
            </Reveal>
            <Reveal delay={0.08} className="md:[direction:ltr]">
              <span className="text-[13px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                {p.place} · {p.span}
              </span>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
                {p.name}
              </h2>
              <p className="mt-2 text-[15px]" style={{ fontFamily: SERIF, color: C.accentInk }}>
                {p.summary}
              </p>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed" style={{ color: C.ink2 }}>
                {p.note}
              </p>
            </Reveal>
          </div>
        ))}
      </section>
    </Page>
  )
}

/* ================================ STUDIO ================================ */
function Studio() {
  return (
    <Page>
      <section className={`${SECTION} grid items-end gap-10 pt-16 md:grid-cols-[1.1fr_0.9fr] md:pt-20`}>
        <div>
          <Eyebrow>The studio</Eyebrow>
          <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.03em]" style={{ fontFamily: DISPLAY }}>
            A small practice, the same hands.
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed" style={{ fontFamily: SERIF, color: C.ink2 }}>
            Hollow &amp; Stone began in 2009 with one damp chapel and a stubborn belief that the
            buildings of the South Pennines were worth more than the developers paid for them.
            Seventeen years on, it's still a small practice — and still the same dry-stone wallers,
            joiners and lime plasterers on every job.
          </p>
        </div>
        <Frame seed="studio-trades-hands-stone" alt="A joiner's hands marking out oak on a workbench" hue={36} className="aspect-[4/5]" />
      </section>

      {/* process timeline */}
      <section className={`${SECTION} py-20 md:py-24`}>
        <Eyebrow>How a building moves through us</Eyebrow>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[6px] md:grid-cols-4" style={{ background: C.line }}>
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="h-full p-7" style={{ background: C.paper }}>
                <span className="text-[13px] font-bold tracking-[0.1em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                  {s.n}
                </span>
                <h3 className="mt-4 text-[19px] font-bold leading-snug tracking-tight" style={{ fontFamily: DISPLAY }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.mute }}>
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* team — tilt cards */}
      <section className={`${SECTION} pb-20`}>
        <h2 className="mb-9 text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
          Who you'll meet.
        </h2>
        <div className="grid gap-7 sm:grid-cols-3">
          {TEAM.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <TiltCard className="h-full" max={8}>
                <div className="h-full rounded-[5px] p-3" style={{ background: C.paper2 }}>
                  <Frame seed={p.seed} alt={`${p.name}, ${p.role} at Hollow & Stone`} hue={20} className="aspect-[4/5]" />
                  <div className="px-1 pb-1 pt-4">
                    <h3 className="text-[18px] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
                      {p.name}
                    </h3>
                    <p className="text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                      {p.role}
                    </p>
                    <p className="mt-2.5 text-[14px] leading-relaxed" style={{ color: C.mute }}>
                      {p.line}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ background: C.paper2 }}>
        <div className={`${SECTION} py-16`}>
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="text-[clamp(1.4rem,3vw,2.1rem)] leading-[1.3]" style={{ fontFamily: SERIF }}>
              “{QUOTES[1].text}”
            </p>
            <footer className="mt-5 text-[13px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.accentInk }}>
              {QUOTES[1].who} — {QUOTES[1].where}
            </footer>
          </blockquote>
        </div>
      </section>
    </Page>
  )
}

/* ================================ ENQUIRE ================================ */
function Enquire() {
  const [sent, setSent] = useState(false)
  const fields = [
    { id: "name", label: "Your name", type: "text", ph: "Edith Marsh" },
    { id: "email", label: "Email", type: "email", ph: "you@example.co.uk" },
    { id: "phone", label: "Phone (optional)", type: "tel", ph: "07000 000000" },
  ]
  return (
    <Page>
      <section className={`${SECTION} grid gap-12 pt-16 md:grid-cols-[0.95fr_1.05fr] md:pt-20`}>
        <div>
          <Eyebrow>Enquire</Eyebrow>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.03em]" style={{ fontFamily: DISPLAY }}>
            Tell us what you're after.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed" style={{ fontFamily: SERIF, color: C.ink2 }}>
            Booking a viewing, registering for a building before it's listed, or wondering whether
            your own place is one for us — start here and Edith will reply within two working days.
          </p>

          <div className="mt-9 space-y-4 text-[14px]" style={{ fontFamily: SANS, color: C.ink2 }}>
            {[
              { k: "The yard", v: "Bridge Mill, Valley Road, Hebden Bridge HX7" },
              { k: "Email", v: "hello@hollowandstone.co.uk" },
              { k: "Phone", v: "01422 000 000" },
              { k: "Viewings", v: "Thursday to Saturday, by appointment" },
            ].map((r) => (
              <div key={r.k} className="flex gap-4 border-b pb-4" style={{ borderColor: C.line }}>
                <span className="w-24 shrink-0 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.accentInk }}>
                  {r.k}
                </span>
                <span>{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[6px] p-7 md:p-9" style={{ background: C.paper2 }}>
          {sent ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full" style={{ background: C.accent, color: C.paper }}>
                <Check size={26} />
              </span>
              <h2 className="mt-5 text-[24px] font-bold tracking-tight" style={{ fontFamily: DISPLAY }}>
                Thank you.
              </h2>
              <p className="mt-2 max-w-xs text-[15px]" style={{ color: C.mute }}>
                Your enquiry is with us. Edith will be in touch within two working days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="space-y-5"
            >
              {fields.map((f) => (
                <label key={f.id} className="block">
                  <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.mute }}>
                    {f.label}
                  </span>
                  <input
                    type={f.type}
                    required={f.id !== "phone"}
                    placeholder={f.ph}
                    className="w-full rounded-[3px] border bg-transparent px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-current"
                    style={{ borderColor: C.line, color: C.ink, fontFamily: SANS, ["--tw-ring-color" as string]: C.accent }}
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: C.mute }}>
                  What are you after?
                </span>
                <textarea
                  rows={4}
                  required
                  placeholder="A viewing of Loom House, or a chapel like Chapel Fold within reach of Hebden Bridge…"
                  className="w-full resize-none rounded-[3px] border bg-transparent px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-current"
                  style={{ borderColor: C.line, color: C.ink, fontFamily: SANS }}
                />
              </label>
              <Magnetic strength={0.25}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold transition-transform"
                  style={{ background: C.ink, color: C.paper, fontFamily: SANS }}
                >
                  Send enquiry <ArrowRight size={16} />
                </button>
              </Magnetic>
            </form>
          )}
        </div>
      </section>

      <section className={`${SECTION} py-20`}>
        <Frame
          seed="enquire-valley-mill-town-map"
          alt="The South Pennine valley around Hebden Bridge where Hollow & Stone works"
          w={1600}
          h={620}
          hue={26}
          className="aspect-[16/6]"
        />
      </section>
    </Page>
  )
}

/* ================================ ROOT ================================ */
export default function HollowAndStone() {
  const location = useLocation()
  return (
    <Layout>
      <motion.div key={location.pathname}>
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="homes" element={<Homes />} />
          <Route path="work" element={<Work />} />
          <Route path="studio" element={<Studio />} />
          <Route path="enquire" element={<Enquire />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.div>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "Hollow & Stone — Restoration-led property in the South Pennines",
  description:
    "A restoration-led estate practice that finds overlooked period buildings — chapels, weavers' cottages, mill lodges — restores them with local trades and sells them whole. Featured interaction: a draggable before/after comparison slider that reveals each building 'as found' versus 'restored' from a single graded photograph, plus magnetic CTAs, 3D-tilt team cards, animated counters and scroll reveals.",
  date: "2026-06-24",
  type: "Real-estate / restoration practice",
  interaction: "Draggable before/after image-comparison slider (single photo, two gradings; pointer + keyboard accessible)",
  pages: ["Home", "Homes", "The Work", "Studio", "Enquire"],
}
