import { type ReactNode } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Clock, MapPin, Users, Layers, Check, ArrowRight } from "lucide-react"
import type { SiteMeta } from "../types"
import { Magnetic } from "@/components/fx/Magnetic"
import {
  C,
  DISPLAY,
  SANS,
  MONO,
  Layout,
  RisoImage,
  Counter,
  Kicker,
  ArrowLink,
  useBase,
} from "./shared"
import { PROGRAMME, WORKSHOPS, TIERS, STATS, FAIR, type Track } from "./data"

/* ----------------------------- shared chrome ----------------------------- */
const TRACK_COLOR: Record<Track, string> = {
  Talk: C.pinkInk,
  Press: C.blueInk,
  Panel: C.ink,
  Screening: "#9A7A12", // amber-ink, AA on paper
}

function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1180px] px-5 ${className}`}>{children}</div>
}

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`py-16 sm:py-24 ${className}`}>{children}</section>
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function MagButton({ to, children, dark = true }: { to: string; children: ReactNode; dark?: boolean }) {
  return (
    <Magnetic strength={0.35}>
      <Link
        to={to}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-colors"
        style={
          dark
            ? { background: C.ink, color: C.paper, fontFamily: SANS }
            : { background: C.pink, color: C.ink, fontFamily: SANS }
        }
      >
        {children}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Magnetic>
  )
}

/* =========================================================================
   HOME
   ========================================================================= */
function Home() {
  const base = useBase()
  return (
    <Page>
      {/* hero — asymmetric: type block + offset riso plates */}
      <Section className="!pt-12 sm:!pt-16">
        <Wrap>
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Kicker>14th edition · Rotterdam</Kicker>
              <h1
                className="mt-5 text-[clamp(2.9rem,8vw,6.2rem)] font-extrabold leading-[0.92] tracking-[-0.03em]"
                style={{ fontFamily: DISPLAY, color: C.ink }}
              >
                Ink that
                <br />
                <span style={{ color: C.pink }}>slips</span> a little.
              </h1>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed" style={{ fontFamily: SANS, color: C.ink70 }}>
                A two-day risograph & small-press festival in a working paper mill on the Maas. Live
                presses, sharp talks, a fair full of editions, and the smell of solvent. 12–13 September 2026.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <MagButton to={`${base}/tickets`} dark={false}>
                  Get a weekender
                </MagButton>
                <ArrowLink to={`${base}/programme`}>See the programme</ArrowLink>
              </div>
            </div>

            {/* offset stacked plates — the featured misregistration up front */}
            <div className="relative">
              <div className="absolute -left-5 -top-5 hidden w-2/3 sm:block">
                <RisoImage seed="riso-print-fair-pink" alt="Stacked fluorescent risograph prints drying on a rack" ratio="aspect-[4/5]" />
              </div>
              <div className="ml-auto w-3/4 translate-y-8">
                <RisoImage seed="riso-drum-machine-blue" alt="A two-drum risograph press mid-pull in the ink room" ratio="aspect-[3/4]" />
              </div>
              <span
                className="absolute -bottom-2 right-2 z-10 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]"
                style={{ fontFamily: MONO, background: C.yellow, color: C.ink }}
              >
                hover to misregister
              </span>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* marquee strip */}
      <div className="overflow-hidden border-y py-3" style={{ borderColor: C.line, background: C.paper2 }}>
        <Marquee />
      </div>

      {/* stats — animated counters */}
      <Section className="!py-16">
        <Wrap>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-[clamp(2.4rem,5vw,3.4rem)] font-extrabold leading-none tracking-tight" style={{ fontFamily: DISPLAY, color: C.ink }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-[13px] leading-snug" style={{ fontFamily: SANS, color: C.ink70 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* three pillars — asymmetric, not identical cards */}
      <Section className="!pt-4">
        <Wrap>
          <div className="grid gap-8 lg:grid-cols-3">
            <Pillar
              n="01"
              title="Talks with the lights up"
              body="Eight sessions across two days from people who actually pull editions — pricing, colour, distribution, and the romance of a happy accident."
              to={`${base}/programme`}
              cta="The programme"
            />
            <Pillar
              n="02"
              title="Presses you can stand over"
              body="Restored RP-3700s running live in the Ink Room. Watch a flat photo become two drums, four passes, one off-register sheet."
              to={`${base}/workshops`}
              cta="Get hands-on"
              accent
            />
            <Pillar
              n="03"
              title="A fair full of editions"
              body="Sixty makers from across Europe, a swap table, and more fluorescent pink than is strictly sensible. Bring a print, take a print."
              to={`${base}/tickets`}
              cta="Plan your visit"
            />
          </div>
        </Wrap>
      </Section>

      {/* fair preview — riso grid */}
      <Section className="!pt-6">
        <Wrap>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Kicker color={C.blueInk}>The Print Fair</Kicker>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold tracking-tight" style={{ fontFamily: DISPLAY, color: C.ink }}>
                Studios on the floor
              </h2>
            </div>
            <span className="hidden sm:block" style={{ fontFamily: MONO, color: C.ink45, fontSize: 12 }}>
              hover any plate
            </span>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {FAIR.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 0.7, 0.3, 1] }}
              >
                <RisoImage seed={f.seed} alt={`Editions from ${f.name}, ${f.city}`} ratio="aspect-[4/3]" />
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[15px] font-semibold" style={{ fontFamily: SANS, color: C.ink }}>
                    {f.name}
                  </span>
                  <span className="text-[12px]" style={{ fontFamily: MONO, color: C.ink45 }}>
                    {f.city}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Wrap>
      </Section>

      <CTA />
    </Page>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const words = ["Two drums", "Off-register", "Fluoro pink", "64-page signatures", "Solvent & sourdough", "Swap table", "Live presses", "Bring a print"]
  const row = [...words, ...words]
  return (
    <div className="relative flex whitespace-nowrap" style={{ fontFamily: DISPLAY }} aria-hidden>
      <motion.div
        className="flex shrink-0 items-center"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        {row.map((w, i) => (
          <span key={i} className="mx-6 flex items-center gap-6 text-[15px] font-bold uppercase tracking-tight" style={{ color: i % 2 ? C.pink : C.ink }}>
            {w}
            <span className="inline-block h-1.5 w-1.5 rotate-45" style={{ background: C.blue }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function Pillar({
  n,
  title,
  body,
  to,
  cta,
  accent = false,
}: {
  n: string
  title: string
  body: string
  to: string
  cta: string
  accent?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 0.7, 0.3, 1] }}
      className={`flex flex-col rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1 ${accent ? "lg:-mt-6" : ""}`}
      style={{
        background: accent ? C.ink : C.card,
        color: accent ? C.paper : C.ink,
        border: `1px solid ${accent ? "transparent" : C.line}`,
      }}
    >
      <span className="text-[12px]" style={{ fontFamily: MONO, color: accent ? C.pink : C.pinkInk }}>
        {n}
      </span>
      <h3 className="mt-4 text-[22px] font-extrabold leading-tight tracking-tight" style={{ fontFamily: DISPLAY }}>
        {title}
      </h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed" style={{ fontFamily: SANS, color: accent ? "rgba(241,234,219,0.74)" : C.ink70 }}>
        {body}
      </p>
      <div className="mt-6">
        <ArrowLink to={to} light={accent}>
          {cta}
        </ArrowLink>
      </div>
    </motion.div>
  )
}

function CTA() {
  const base = useBase()
  return (
    <Section>
      <Wrap>
        <div className="relative overflow-hidden rounded-3xl px-8 py-14 sm:px-14" style={{ background: C.ink }}>
          <span aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `radial-gradient(${C.pink} 30%, transparent 31%)`, backgroundSize: "6px 6px" }} />
          <div className="relative max-w-2xl">
            <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[0.98] tracking-tight" style={{ fontFamily: DISPLAY, color: C.paper }}>
              Two days. <span style={{ color: C.pink }}>Nine presses.</span> One ticket.
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed" style={{ fontFamily: SANS, color: "rgba(241,234,219,0.74)" }}>
              The weekender is the way most people do Halftone — both floors, both days, and a numbered print to take home.
            </p>
            <div className="mt-8">
              <MagButton to={`${base}/tickets`} dark={false}>
                Get tickets — from €28
              </MagButton>
            </div>
          </div>
        </div>
      </Wrap>
    </Section>
  )
}

/* =========================================================================
   PROGRAMME — staggered schedule grid
   ========================================================================= */
function Programme() {
  return (
    <Page>
      <Section className="!pt-12 sm:!pt-16">
        <Wrap>
          <Kicker>Programme · 12–13 Sep</Kicker>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: DISPLAY, color: C.ink }}>
            Eight sessions, two drums of ink
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed" style={{ fontFamily: SANS, color: C.ink70 }}>
            Talks and panels run in the Drum Hall; live presses in the Ink Room. Everything is included in
            a day pass — drift between rooms, the schedule is built to let you.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(TRACK_COLOR) as Track[]).map((t) => (
              <span key={t} className="inline-flex items-center gap-2 text-[12px]" style={{ fontFamily: MONO, color: C.ink70 }}>
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: TRACK_COLOR[t] }} />
                {t}
              </span>
            ))}
          </div>

          {PROGRAMME.map((day) => (
            <div key={day.label} className="mt-14">
              <div className="flex items-baseline gap-4 border-b pb-3" style={{ borderColor: C.line }}>
                <span className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold tracking-tight" style={{ fontFamily: DISPLAY, color: C.ink }}>
                  {day.label}
                </span>
                <span className="text-[13px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: C.pinkInk }}>
                  {day.date}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {day.sessions.map((s, i) => (
                  <motion.article
                    key={s.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 0.7, 0.3, 1] }}
                    className="group grid grid-cols-[auto_1fr] gap-x-5 rounded-xl border p-4 transition-colors sm:grid-cols-[110px_1fr_auto] sm:p-5"
                    style={{ borderColor: C.line, background: C.card }}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-bold tabular-nums" style={{ fontFamily: MONO, color: C.ink }}>
                        {s.start}
                      </span>
                      <span className="text-[12px] tabular-nums" style={{ fontFamily: MONO, color: C.ink45 }}>
                        {s.end}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: TRACK_COLOR[s.track] }} />
                        <h3 className="truncate text-[18px] font-extrabold tracking-tight" style={{ fontFamily: DISPLAY, color: C.ink }}>
                          {s.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-[14px] leading-relaxed" style={{ fontFamily: SANS, color: C.ink70 }}>
                        {s.blurb}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px]" style={{ fontFamily: MONO, color: C.ink45 }}>
                        <span className="font-medium" style={{ color: C.ink70 }}>
                          {s.who}
                        </span>
                        <span>· {s.role}</span>
                      </div>
                    </div>

                    <div className="col-span-2 mt-3 flex items-center gap-1.5 sm:col-span-1 sm:mt-0 sm:flex-col sm:items-end sm:justify-center sm:gap-1 sm:text-right">
                      <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ fontFamily: MONO, color: C.ink70 }}>
                        <MapPin className="h-3.5 w-3.5" style={{ color: C.pinkInk }} />
                        {s.room}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          ))}
        </Wrap>
      </Section>
    </Page>
  )
}

/* =========================================================================
   WORKSHOPS
   ========================================================================= */
function Workshops() {
  const base = useBase()
  return (
    <Page>
      <Section className="!pt-12 sm:!pt-16">
        <Wrap>
          <Kicker color={C.blueInk}>Workshops · limited seats</Kicker>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: DISPLAY, color: C.ink }}>
            Get ink under your nails
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed" style={{ fontFamily: SANS, color: C.ink70 }}>
            Four hands-on sessions in the Ink Room and Bindery. Seats are tiny on purpose — a workshop is
            included with every Maker pass, or add one to any ticket while they last.
          </p>

          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {WORKSHOPS.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 0.7, 0.3, 1] }}
                className="group overflow-hidden rounded-2xl border"
                style={{ borderColor: C.line, background: C.card }}
              >
                <div className="grid grid-cols-[120px_1fr] gap-0 sm:grid-cols-[150px_1fr]">
                  <RisoImage seed={w.seed} alt={`${w.title}, led by ${w.lead}`} ratio="" className="!aspect-auto h-full" />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: C.pinkInk }}>
                        {w.level}
                      </span>
                      <span className="text-[12px]" style={{ fontFamily: MONO, color: C.ink45 }}>
                        €{w.price}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[21px] font-extrabold leading-tight tracking-tight" style={{ fontFamily: DISPLAY, color: C.ink }}>
                      {w.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed" style={{ fontFamily: SANS, color: C.ink70 }}>
                      {w.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px]" style={{ fontFamily: MONO, color: C.ink45 }}>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" style={{ color: C.blueInk }} /> {w.seats} seats
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" style={{ color: C.blueInk }} /> {w.length}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" style={{ color: C.blueInk }} /> {w.lead}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <MagButton to={`${base}/tickets`}>Add a workshop to your ticket</MagButton>
          </div>
        </Wrap>
      </Section>
    </Page>
  )
}

/* =========================================================================
   TICKETS
   ========================================================================= */
function Tickets() {
  return (
    <Page>
      <Section className="!pt-12 sm:!pt-16">
        <Wrap>
          <div className="max-w-2xl">
            <Kicker>Tickets · 12–13 Sep 2026</Kicker>
            <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: DISPLAY, color: C.ink }}>
              Pick your pass
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed" style={{ fontFamily: SANS, color: C.ink70 }}>
              Every ticket gets you the talks, the screenings and the Print Fair. The only real choice is
              how inky you want your hands to be by Sunday night.
            </p>
          </div>

          <div className="mt-12 grid items-start gap-7 lg:grid-cols-3">
            {TIERS.map((t, i) => {
              const featured = !!t.featured
              return (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 0.7, 0.3, 1] }}
                  className={`relative flex flex-col rounded-2xl p-7 ${featured ? "lg:-mt-4 lg:pb-9" : ""}`}
                  style={{
                    background: featured ? C.ink : C.card,
                    color: featured ? C.paper : C.ink,
                    border: `1px solid ${featured ? "transparent" : C.line}`,
                  }}
                >
                  {featured && (
                    <span className="absolute -top-3 left-7 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO, background: C.pink, color: C.ink }}>
                      Most pulled
                    </span>
                  )}
                  <h3 className="text-[20px] font-extrabold tracking-tight" style={{ fontFamily: DISPLAY }}>
                    {t.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[44px] font-extrabold leading-none tracking-tight" style={{ fontFamily: DISPLAY, color: featured ? C.pink : C.ink }}>
                      €{t.price}
                    </span>
                    <span className="text-[13px]" style={{ fontFamily: MONO, color: featured ? "rgba(241,234,219,0.6)" : C.ink45 }}>
                      {t.cadence}
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed" style={{ fontFamily: SANS, color: featured ? "rgba(241,234,219,0.74)" : C.ink70 }}>
                    {t.pitch}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[14px]" style={{ fontFamily: SANS, color: featured ? "rgba(241,234,219,0.86)" : C.ink70 }}>
                        <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: featured ? C.pink : C.pinkInk }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <Magnetic strength={0.3}>
                      <button
                        className="w-full rounded-full py-3 text-[14px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                        style={
                          featured
                            ? { background: C.pink, color: C.ink, fontFamily: SANS }
                            : { background: C.ink, color: C.paper, fontFamily: SANS }
                        }
                      >
                        Choose {t.name}
                      </button>
                    </Magnetic>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* practical note */}
          <div className="mt-14 grid gap-6 rounded-2xl border p-7 sm:grid-cols-3 sm:p-9" style={{ borderColor: C.line, background: C.paper2 }}>
            {[
              { h: "Getting there", b: "Maaspapier 14, a 9-minute tram from Rotterdam Centraal. The mill door is the one that smells of solvent." },
              { h: "Doors", b: "10:00 both days, last pull at 17:00. The Saturday swap runs until the ink runs out." },
              { h: "Access", b: "Step-free across all four rooms, a quiet space off the Bindery, and BSL interpretation on the Drum Hall talks." },
            ].map((x) => (
              <div key={x.h}>
                <h4 className="text-[15px] font-bold" style={{ fontFamily: SANS, color: C.ink }}>
                  {x.h}
                </h4>
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ fontFamily: SANS, color: C.ink70 }}>
                  {x.b}
                </p>
              </div>
            ))}
          </div>
        </Wrap>
      </Section>
    </Page>
  )
}

/* =========================================================================
   ROUTES + META
   ========================================================================= */
export default function Halftone() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="programme" element={<Programme />} />
        <Route path="workshops" element={<Workshops />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export const meta: SiteMeta = {
  title: "Halftone — Risograph & small-press festival",
  description:
    "A two-day risograph and small-press festival in a Rotterdam paper mill, featuring a CMYK misregistration hover effect that slides ink plates off-register.",
  date: "2026-06-24",
  type: "Event / festival",
  interaction:
    "Risograph misregistration hover (pink & blue ink plates slide off-register) + staggered schedule-grid entrances + magnetic CTAs + animated counters",
  pages: ["Home", "Programme", "Workshops", "Tickets"],
}
