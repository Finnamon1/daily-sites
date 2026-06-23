import { useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowUpRight,
  Clock,
  Film,
  MapPin,
  Minus,
  MoveRight,
  Plus,
  Ticket,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import { SplitFlapBoard } from "./SplitFlap"
import {
  faqs,
  films,
  nowShowing,
  seasons,
  tiers,
  week,
  type Film as FilmRec,
} from "./data"

/* ------------------------------------------------------------------ *
 * Type system
 * ------------------------------------------------------------------ */

const display = "font-['Cormorant_Garamond']"
const body = "font-['DM_Sans']"
const mono = "font-['IBM_Plex_Mono'] uppercase tracking-[0.22em]"

function poster(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn(mono, "text-[10.5px] text-screen-amber", className)}>
      {children}
    </span>
  )
}

/** Warm-duotone poster frame that lifts to full colour on hover. */
function Poster({
  seed,
  alt,
  className,
  aspect = "aspect-[2/3]",
  w = 600,
  h = 900,
}: {
  seed: string
  alt: string
  className?: string
  aspect?: string
  w?: number
  h?: number
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[3px] bg-screen-raise ring-1 ring-screen-line/80",
        aspect,
        className,
      )}
    >
      <img
        src={poster(seed, w, h)}
        alt={alt}
        loading="lazy"
        width={w}
        height={h}
        className="absolute inset-0 h-full w-full object-cover grayscale-[0.55] transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
      />
      {/* amber duotone wash, fades on hover so colour blooms through */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(244,181,60,0.28), rgba(21,17,12,0.78))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
      />
    </div>
  )
}

/** Running marquee bulbs — a thin filament of light along an edge. */
function BulbStrip({ count = 28 }: { count?: number }) {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden className="flex items-center justify-between gap-1 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="h-[5px] w-[5px] shrink-0 rounded-full bg-screen-amber"
          style={{ boxShadow: "0 0 6px rgba(244,181,60,0.7)" }}
          initial={{ opacity: 0.25 }}
          animate={reduce ? { opacity: 0.5 } : { opacity: [0.2, 1, 0.2] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.6, repeat: Infinity, delay: (i % 7) * 0.12, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Layout — persistent marquee nav + footer
 * ------------------------------------------------------------------ */

function Mark() {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={cn(display, "text-[26px] font-semibold leading-none text-screen-bone")}>
        The Paragon
      </span>
      <span className={cn(mono, "hidden text-[9px] text-screen-ash sm:inline")}>est. 1931</span>
    </span>
  )
}

function Nav({ base }: { base: string }) {
  const links: [string, string][] = [
    ["Program", `${base}/program`],
    ["Calendar", `${base}/calendar`],
    ["Membership", `${base}/membership`],
    ["Visit", `${base}/visit`],
  ]
  return (
    <header className="sticky top-0 z-50 border-b border-screen-line/70 bg-screen-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-6">
        <NavLink to={base} end aria-label="The Paragon, home">
          <Mark />
        </NavLink>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  body,
                  "relative rounded-full px-2.5 py-2 text-[13px] text-screen-ash transition-colors hover:text-screen-bone sm:px-3.5 sm:text-[14px]",
                  isActive && "text-screen-bone",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="paragon-nav"
                      className="absolute inset-x-3 -bottom-[1px] h-px bg-screen-amber"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Footer({ base }: { base: string }) {
  return (
    <footer className="border-t border-screen-line/70 bg-screen-panel">
      <div className="px-5 pt-5 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <BulbStrip />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Mark />
            <p className={cn(body, "mt-4 max-w-xs text-[15px] leading-relaxed text-screen-ash")}>
              An 84-seat repertory picture house on Powis Street, running
              restorations, seasons and the odd midnight oddity since 1931.
            </p>
          </div>
          <FootCol title="See">
            <FootLink to={base} end>Home</FootLink>
            <FootLink to={`${base}/program`}>Program</FootLink>
            <FootLink to={`${base}/calendar`}>This week</FootLink>
            <FootLink to={`${base}/membership`}>Membership</FootLink>
            <FootLink to={`${base}/visit`}>Visit</FootLink>
          </FootCol>
          <FootCol title="The box office">
            <span>14 Powis Street</span>
            <span>Open from 12:00, Tue–Sun</span>
            <span>hello@theparagon.film</span>
            <span>+44 20 7946 0931</span>
          </FootCol>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-screen-line/70 pt-6 text-[12px] text-screen-ash md:flex-row md:items-center md:justify-between">
          <span className={body}>© 2026 The Paragon. A fictional cinema, built as a design study.</span>
          <span className={mono}>One screen · since 1931</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{title}</Label>
      <div className={cn(body, "flex flex-col gap-2 text-[14px] text-screen-ash")}>{children}</div>
    </div>
  )
}

function FootLink({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink to={to} end={end} className="w-fit transition-colors hover:text-screen-amber">
      {children}
    </NavLink>
  )
}

/* ------------------------------------------------------------------ *
 * Shared buttons
 * ------------------------------------------------------------------ */

function PrimaryLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Magnetic>
      <NavLink
        to={to}
        className={cn(
          body,
          "group inline-flex items-center gap-2 rounded-full bg-screen-amber px-6 py-3 text-[15px] font-semibold text-screen-ink transition-colors hover:bg-[#ffc451]",
        )}
      >
        {children}
        <MoveRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </NavLink>
    </Magnetic>
  )
}

function GhostLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={cn(
        body,
        "group inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-[15px] text-screen-bone/80 transition-colors hover:text-screen-amber",
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </NavLink>
  )
}

function Cert({ children }: { children: ReactNode }) {
  return (
    <span className={cn(mono, "rounded-[3px] border border-screen-line px-1.5 py-0.5 text-[10px] tracking-[0.1em] text-screen-ash")}>
      {children}
    </span>
  )
}

function TimeChip({ t }: { t: string }) {
  return (
    <span className={cn("font-['IBM_Plex_Mono'] rounded-[3px] bg-screen-ink px-2 py-1 text-[12px] tabular-nums text-screen-amber ring-1 ring-screen-line/70")}>
      {t}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Film card (program)
 * ------------------------------------------------------------------ */

function FilmCard({ f, i }: { f: FilmRec; i: number }) {
  return (
    <Reveal delay={(i % 3) * 0.07} className="group">
      <article>
        <Poster seed={f.seed} alt={`Poster for ${f.title} (${f.year})`} />
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className={cn(display, "text-[26px] font-semibold leading-none text-screen-bone transition-colors group-hover:text-screen-amber")}>
            {f.title}
          </h3>
          <Cert>{f.cert}</Cert>
        </div>
        <p className={cn(mono, "mt-2 text-[10px] text-screen-ash")}>
          {f.director} · {f.country} · {f.year} · {f.runtime}m
        </p>
        <p className={cn(body, "mt-3 text-[14px] leading-relaxed text-screen-ash")}>{f.note}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {f.times.map((t) => (
            <TimeChip key={t} t={t} />
          ))}
        </div>
      </article>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

function Home({ base }: { base: string }) {
  const featured = films[1] // In the Mood for Love
  return (
    <div>
      {/* Hero — copy on the left, the Solari board on the right */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(244,181,60,0.16), transparent)" }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:px-6 md:grid-cols-[0.95fr_1.05fr] md:pt-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <Film className="h-4 w-4 text-screen-amber" strokeWidth={1.6} />
                <Label>A repertory picture house</Label>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className={cn(display, "mt-6 text-[clamp(3rem,8vw,5.6rem)] font-semibold leading-[0.92] text-screen-bone")}>
                The films<br />
                worth leaving<br />
                <span className="italic text-screen-amber">the house</span> for.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className={cn(body, "mt-7 max-w-md text-[17px] leading-relaxed text-screen-ash")}>
                One screen, eighty-four seats, and a projectionist who still
                threads 70mm by hand. We show the restorations, the seasons and
                the strange late-night things — the way they were meant to look.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-2">
                <PrimaryLink to={`${base}/program`}>See what's on</PrimaryLink>
                <GhostLink to={`${base}/membership`}>Become a member</GhostLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={32}>
            <div className="flex flex-col items-start gap-3">
              <div className="flex w-full items-center justify-between">
                <Label className="text-screen-ash">Now showing · today</Label>
                <span className={cn(mono, "text-[10px] text-screen-ash")}>Screen 1</span>
              </div>
              <div className="w-full overflow-x-auto pb-1">
                <SplitFlapBoard rows={nowShowing} className="min-w-max" />
              </div>
            </div>
          </Reveal>
        </div>
        <div className="px-5 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <BulbStrip count={40} />
          </div>
        </div>
      </section>

      {/* The picture house — intro band */}
      <section className="border-y border-screen-line/70 bg-screen-panel">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <Reveal>
            <h2 className={cn(display, "text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.04] text-screen-bone")}>
              A cinema that programmes like a record shop, not a multiplex.
            </h2>
            <p className={cn(body, "mt-5 max-w-lg text-[16px] leading-relaxed text-screen-ash")}>
              No twelve screens of the same four films. Each week is hand-built
              from prints we've chased down, restorations we've waited years for,
              and the odd thing someone on the bar insists you have to see.
            </p>
          </Reveal>
          <div className="grid grid-cols-3 gap-4">
            {[
              ["84", "seats, all velvet"],
              ["1931", "the year we opened"],
              ["35/70", "mm, still threaded by hand"],
            ].map(([n, l], idx) => (
              <Reveal key={l} delay={idx * 0.08}>
                <div className={cn(display, "text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-none text-screen-amber")}>{n}</div>
                <div className={cn(body, "mt-2 text-[12px] leading-snug text-screen-ash")}>{l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured film */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1fr]">
          <div className="group">
            <Poster seed={featured.seed} alt={`Poster for ${featured.title}`} aspect="aspect-[3/4]" />
          </div>
          <div>
            <Label>This week's headline · {featured.season}</Label>
            <h2 className={cn(display, "mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.0] text-screen-bone")}>
              {featured.title}
            </h2>
            <p className={cn(mono, "mt-3 text-[10.5px] text-screen-ash")}>
              {featured.director} · {featured.country} · {featured.year} · {featured.runtime}m · {featured.cert}
            </p>
            <p className={cn(body, "mt-6 max-w-md text-[16px] leading-relaxed text-screen-bone/80")}>
              {featured.note}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className={cn(mono, "text-[10px] text-screen-ash")}>Showtimes</span>
              {featured.times.map((t) => (
                <TimeChip key={t} t={t} />
              ))}
            </div>
            <div className="mt-8">
              <GhostLink to={`${base}/program`}>The whole programme</GhostLink>
            </div>
          </div>
        </div>
      </section>

      {/* Seasons */}
      <section className="border-t border-screen-line/70 bg-screen-panel">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <Label>Seasons in rotation</Label>
              <h2 className={cn(display, "mt-3 text-[clamp(1.9rem,4.5vw,2.8rem)] font-semibold text-screen-bone")}>
                What we're dwelling on
              </h2>
            </div>
            <GhostLink to={`${base}/calendar`}>See the week</GhostLink>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {seasons.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className="group">
                <article className="flex h-full flex-col overflow-hidden rounded-[4px] bg-screen-raise ring-1 ring-screen-line/70 transition-transform duration-300 hover:-translate-y-1">
                  <Poster seed={s.seed} alt={s.title} aspect="aspect-[16/10]" w={640} h={400} className="rounded-none ring-0" />
                  <div className="flex flex-1 flex-col p-6">
                    <span className={cn(mono, "text-[10px] text-screen-amber")}>{s.span}</span>
                    <h3 className={cn(display, "mt-2 text-[24px] font-semibold leading-tight text-screen-bone")}>{s.title}</h3>
                    <p className={cn(body, "mt-3 flex-1 text-[14px] leading-relaxed text-screen-ash")}>{s.blurb}</p>
                    <span className={cn(mono, "mt-5 text-[10px] text-screen-ash")}>{s.count} films</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Membership teaser */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-7 rounded-[6px] border border-screen-line/80 bg-gradient-to-br from-screen-panel to-screen-ink p-8 md:flex-row md:items-center md:p-12">
            <div className="max-w-xl">
              <Label>Keep the lamp lit</Label>
              <h2 className={cn(display, "mt-3 text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-tight text-screen-bone")}>
                A single screen survives on the people who fill it.
              </h2>
              <p className={cn(body, "mt-4 text-[15px] leading-relaxed text-screen-ash")}>
                Members get cheaper tickets, early booking and a hand in the
                programming — and they're the reason the projector turns at all.
              </p>
            </div>
            <PrimaryLink to={`${base}/membership`}>Join from £6</PrimaryLink>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function Program() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-20">
      <Reveal>
        <Label>The current programme · {films.length} in rotation</Label>
        <h1 className={cn(display, "mt-5 max-w-2xl text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-screen-bone")}>
          Everything threaded up this fortnight.
        </h1>
        <p className={cn(body, "mt-5 max-w-lg text-[16px] leading-relaxed text-screen-ash")}>
          Restorations, seasons and one-offs, all on a single screen. Hover a
          poster to let the colour back in. Times are for this week — the board
          turns over every Tuesday.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {films.map((f, i) => (
          <FilmCard key={f.slug} f={f} i={i} />
        ))}
      </div>
    </div>
  )
}

function Calendar() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 md:py-20">
      <Reveal>
        <Label>This week · 24–29 June</Label>
        <h1 className={cn(display, "mt-5 max-w-2xl text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-screen-bone")}>
          Six days, one screen, no repeats you didn't ask for.
        </h1>
      </Reveal>

      <div className="mt-14 overflow-hidden rounded-[5px] ring-1 ring-screen-line/70">
        {week.map((d, i) => {
          const today = i === 0
          return (
            <Reveal key={d.day} delay={i * 0.04}>
              <div
                className={cn(
                  "grid items-start gap-4 border-b border-screen-line/60 px-5 py-6 last:border-0 sm:grid-cols-[120px_1fr] sm:px-7",
                  today ? "bg-screen-raise" : "bg-screen-panel",
                )}
              >
                <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1.5">
                  <span className={cn(display, "text-[30px] font-semibold leading-none text-screen-amber")}>{d.day}</span>
                  <span className={cn(mono, "text-[10px] text-screen-ash")}>{d.date}</span>
                  {today && (
                    <span className={cn(mono, "rounded-full bg-screen-amber px-2 py-0.5 text-[8px] text-screen-ink")}>Today</span>
                  )}
                </div>
                <div className="flex flex-col">
                  {d.sessions.map((s) => (
                    <div
                      key={s.time + s.title}
                      className="group/row -mx-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[4px] px-2 py-2.5 transition-colors hover:bg-screen-ink/60"
                    >
                      <span className="font-['IBM_Plex_Mono'] text-[15px] tabular-nums text-screen-amber/90">{s.time}</span>
                      <span className={cn(body, "text-[15px] text-screen-bone/90 transition-colors group-hover/row:text-screen-bone")}>{s.title}</span>
                      <Cert>{s.cert}</Cert>
                      {s.tag && (
                        <span
                          className={cn(
                            mono,
                            "rounded-full px-2 py-0.5 text-[9px]",
                            s.tag === "Sold out"
                              ? "bg-screen-red/15 text-screen-red"
                              : "border border-screen-amber/40 text-screen-amber",
                          )}
                        >
                          {s.tag}
                        </span>
                      )}
                      <MoveRight className="ml-auto hidden h-4 w-4 text-screen-amber opacity-0 transition-all duration-200 group-hover/row:translate-x-0.5 group-hover/row:opacity-100 sm:block" />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
      <p className={cn(body, "mt-6 text-[13px] text-screen-ash")}>
        Doors thirty minutes before each show. Anything over two hours has an interval.
      </p>
    </div>
  )
}

function Membership() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-20">
      <Reveal>
        <div className="max-w-2xl">
          <Label>Membership</Label>
          <h1 className={cn(display, "mt-5 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-screen-bone")}>
            Three ways to keep a single screen alive.
          </h1>
          <p className={cn(body, "mt-5 text-[16px] leading-relaxed text-screen-ash")}>
            We don't take grants and we don't run adverts. The Paragon runs on
            ticket stubs and the members who buy more of them than they need.
            Cancel any month — though almost no one does.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <article
              className={cn(
                "flex h-full flex-col rounded-[6px] p-7 ring-1 transition-transform duration-300 hover:-translate-y-1.5",
                t.featured
                  ? "bg-screen-amber text-screen-ink ring-screen-amber"
                  : "bg-screen-panel text-screen-bone ring-screen-line/70",
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className={cn(display, "text-[28px] font-semibold leading-none")}>{t.name}</h2>
                {t.featured && (
                  <span className={cn(mono, "rounded-full bg-screen-ink px-2.5 py-1 text-[9px] text-screen-amber")}>
                    Most join here
                  </span>
                )}
              </div>
              <p className={cn(body, "mt-2 text-[14px]", t.featured ? "text-screen-ink/70" : "text-screen-ash")}>
                {t.line}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className={cn(display, "text-[44px] font-semibold leading-none")}>{t.price}</span>
                <span className={cn(body, "text-[14px]", t.featured ? "text-screen-ink/70" : "text-screen-ash")}>{t.cadence}</span>
              </div>
              <ul className={cn(body, "mt-6 flex flex-1 flex-col gap-3 text-[14px]")}>
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Ticket
                      className={cn("mt-0.5 h-4 w-4 shrink-0", t.featured ? "text-screen-ink/60" : "text-screen-amber")}
                      strokeWidth={1.6}
                    />
                    <span className={t.featured ? "text-screen-ink/85" : "text-screen-bone/85"}>{p}</span>
                  </li>
                ))}
              </ul>
              <Magnetic>
                <button
                  type="button"
                  className={cn(
                    body,
                    "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition-colors",
                    t.featured
                      ? "bg-screen-ink text-screen-amber hover:bg-[#0c0a07]"
                      : "bg-screen-amber text-screen-ink hover:bg-[#ffc451]",
                  )}
                >
                  Become a {t.name} <MoveRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </article>
          </Reveal>
        ))}
      </div>
      <p className={cn(body, "mt-8 text-center text-[13px] text-screen-ash")}>
        A design study — the buttons are for show. No card will be charged.
      </p>
    </div>
  )
}

function AccordionRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-screen-line/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className={cn(display, "text-[21px] font-semibold text-screen-bone")}>{q}</span>
        <span className="text-screen-amber">{open ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <p className={cn(body, "max-w-2xl pb-6 text-[15px] leading-relaxed text-screen-ash")}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Visit() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-20">
      <div className="grid gap-14 md:grid-cols-[1fr_0.9fr] md:gap-20">
        <div>
          <Reveal>
            <Label>Visit · 14 Powis Street</Label>
            <h1 className={cn(display, "mt-5 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-screen-bone")}>
              Come early. Stay for the bar.
            </h1>
            <p className={cn(body, "mt-6 max-w-md text-[16px] leading-relaxed text-screen-ash")}>
              We're the corner building with the lit-up sign you can see from the
              station. Doors open at noon; the box office is staffed by people
              who've seen the film and will happily tell you why.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-9 grid gap-px overflow-hidden rounded-[5px] bg-screen-line/60 ring-1 ring-screen-line/70 sm:grid-cols-2">
              <Detail icon={<MapPin className="h-4 w-4" />} k="Address" v="14 Powis Street" />
              <Detail icon={<Clock className="h-4 w-4" />} k="Hours" v="From 12:00, Tue–Sun" />
              <Detail icon={<Ticket className="h-4 w-4" />} k="Tickets" v="£11 · £9 members" />
              <Detail icon={<Film className="h-4 w-4" />} k="Formats" v="35mm · 70mm · 4K DCP" />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <h2 className={cn(display, "mt-14 text-[28px] font-semibold text-screen-bone")}>Before you come</h2>
            <div className="mt-4">
              {faqs.map((f) => (
                <AccordionRow key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </Reveal>
        </div>

        <div className="md:pt-2">
          <Reveal y={28}>
            <form onSubmit={(e) => e.preventDefault()} className="rounded-[6px] bg-screen-panel p-7 ring-1 ring-screen-line/70">
              <span className={cn(mono, "text-[10px] text-screen-amber")}>Ask the box office</span>
              <h2 className={cn(display, "mt-2 text-[26px] font-semibold text-screen-bone")}>Hold me a seat</h2>
              <div className="mt-6 grid gap-5">
                <Field label="Your name" id="name" placeholder="Lee Okafor" />
                <Field label="Email" id="email" type="email" placeholder="lee@email.com" />
                <div className="grid gap-2">
                  <label htmlFor="film" className={cn(mono, "text-[10px] text-screen-ash")}>Which show</label>
                  <select
                    id="film"
                    defaultValue=""
                    className={cn(body, "rounded-[4px] border border-screen-line bg-screen-ink px-4 py-3 text-[15px] text-screen-bone outline-none transition-colors focus:border-screen-amber")}
                  >
                    <option value="" disabled>Pick a film</option>
                    {films.map((f) => (
                      <option key={f.slug} value={f.slug}>{f.title} ({f.year})</option>
                    ))}
                    <option value="any">Surprise me</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="note" className={cn(mono, "text-[10px] text-screen-ash")}>Anything else</label>
                  <textarea
                    id="note"
                    rows={3}
                    placeholder="Wheelchair space, allergies, a birthday…"
                    className={cn(body, "resize-none rounded-[4px] border border-screen-line bg-screen-ink px-4 py-3 text-[15px] text-screen-bone outline-none transition-colors placeholder:text-screen-ash/50 focus:border-screen-amber")}
                  />
                </div>
                <Magnetic>
                  <button
                    type="submit"
                    className={cn(body, "group inline-flex items-center gap-2 rounded-full bg-screen-amber px-6 py-3 text-[15px] font-semibold text-screen-ink transition-colors hover:bg-[#ffc451]")}
                  >
                    Send to the box office
                    <MoveRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </Magnetic>
                <p className={cn(body, "text-[12px] text-screen-ash")}>
                  A design study — this form doesn't send anywhere.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

function Detail({ icon, k, v }: { icon: ReactNode; k: string; v: string }) {
  return (
    <div className="flex items-center gap-3 bg-screen-panel px-5 py-5">
      <span className="text-screen-amber">{icon}</span>
      <div>
        <div className={cn(mono, "text-[9px] text-screen-ash")}>{k}</div>
        <div className={cn(body, "text-[14px] text-screen-bone")}>{v}</div>
      </div>
    </div>
  )
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string
  id: string
  type?: string
  placeholder?: string
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className={cn(mono, "text-[10px] text-screen-ash")}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(body, "rounded-[4px] border border-screen-line bg-screen-ink px-4 py-3 text-[15px] text-screen-bone outline-none transition-colors placeholder:text-screen-ash/50 focus:border-screen-amber")}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Shell + routing
 * ------------------------------------------------------------------ */

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Paragon() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <div className={cn(body, "min-h-screen bg-screen-ink text-screen-bone antialiased selection:bg-screen-amber selection:text-screen-ink")}>
      <Nav base={base} />
      <main>
        <Routes>
          <Route index element={<Page><Home base={base} /></Page>} />
          <Route path="program" element={<Page><Program /></Page>} />
          <Route path="calendar" element={<Page><Calendar /></Page>} />
          <Route path="membership" element={<Page><Membership /></Page>} />
          <Route path="visit" element={<Page><Visit /></Page>} />
          <Route path="*" element={<Page><Home base={base} /></Page>} />
        </Routes>
      </main>
      <Footer base={base} />
    </div>
  )
}

export const meta: SiteMeta = {
  title: "The Paragon — A repertory picture house, est. 1931",
  description:
    "A single-screen repertory cinema running restorations and seasons. Built around a Solari split-flap departures board that flips today's showtimes into place, with a warm sodium-bulb amber palette on cinema charcoal.",
  date: "2026-06-23",
  type: "Cinema / arts venue",
  interaction: "Solari split-flap board (cascading flip-to-target) + magnetic CTAs + duotone hover-reveal posters + running marquee bulbs",
  pages: ["Home", "Program", "Calendar", "Membership", "Visit"],
}
