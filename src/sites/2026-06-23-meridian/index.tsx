import { useRef, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Compass,
  Maximize,
  MoveRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import { residences, journal } from "./data"

/* ------------------------------------------------------------------ *
 * Type + a small set of shared primitives
 * ------------------------------------------------------------------ */

const display = "font-['Fraunces'] tracking-[-0.01em]"
const body = "font-['Hanken_Grotesk']"
const mono = "font-['Space_Grotesk'] tracking-[0.18em] uppercase"

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

/** A clipped frame whose image drifts slower than the page — the day's
 *  featured interaction. Reduced motion holds it perfectly still. */
function ParallaxImage({
  seed,
  alt,
  className,
  aspect = "aspect-[4/5]",
  range = 14,
  w = 900,
  h = 1100,
}: {
  seed: string
  alt: string
  className?: string
  aspect?: string
  range?: number
  w?: number
  h?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : [`${-range}%`, `${range}%`],
  )
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-[3px] bg-stone-200 ring-1 ring-stone-900/10",
        aspect,
        className,
      )}
    >
      <motion.img
        src={img(seed, w, h)}
        alt={alt}
        loading="lazy"
        style={{ y, scale: reduce ? 1 : 1.28 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* shared warm treatment so picsum's mismatched frames cohere */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(180deg, rgba(40,34,28,0.06), rgba(120,70,42,0.10))",
        }}
      />
    </div>
  )
}

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn(mono, "text-[11px] text-clay-700", className)}>
      {children}
    </span>
  )
}

function Rule() {
  return <span className="h-px flex-1 bg-stone-900/15" />
}

/* ------------------------------------------------------------------ *
 * Layout — persistent nav + footer
 * ------------------------------------------------------------------ */

function Mark() {
  return (
    <span className="inline-flex items-center gap-2">
      <Compass className="h-[18px] w-[18px] text-clay-700" strokeWidth={1.5} />
      <span className={cn(display, "hidden text-[19px] font-semibold text-ink sm:inline")}>
        Meridian
      </span>
    </span>
  )
}

function Nav({ base }: { base: string }) {
  const links: [string, string, boolean][] = [
    ["Residences", `${base}/residences`, false],
    ["Approach", `${base}/approach`, false],
    ["Journal", `${base}/journal`, false],
    ["Visit", `${base}/visit`, false],
  ]
  return (
    <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink to={base} end aria-label="Meridian, home">
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
                  "relative rounded-full px-2.5 py-2 text-[13px] text-ink/70 transition-colors hover:text-ink sm:px-3.5 sm:text-[14px]",
                  isActive && "text-ink",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute inset-x-3 -bottom-[1px] h-px bg-clay-600"
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
    <footer className="border-t border-stone-900/10 bg-paperdeep">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Mark />
            <p className={cn(body, "mt-4 max-w-xs text-[15px] leading-relaxed text-ink/60")}>
              A boutique brokerage for architecturally significant homes across
              Marin, Sonoma and the Sonoma Coast. Quietly, and with care.
            </p>
          </div>
          <FootCol title="Pages">
            <FootLink to={base} end>Home</FootLink>
            <FootLink to={`${base}/residences`}>Residences</FootLink>
            <FootLink to={`${base}/approach`}>Approach</FootLink>
            <FootLink to={`${base}/journal`}>Journal</FootLink>
            <FootLink to={`${base}/visit`}>Visit</FootLink>
          </FootCol>
          <FootCol title="Office">
            <span>By appointment</span>
            <span>Throckmorton Ave, Mill Valley</span>
            <span>hello@meridian.homes</span>
            <span>DRE #02041188</span>
          </FootCol>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-stone-900/10 pt-6 text-[12px] text-ink/70 md:flex-row md:items-center md:justify-between">
          <span className={body}>© 2026 Meridian Real Estate. A fictional brokerage built for a design study.</span>
          <span className={mono}>Northern California</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      <div className={cn(body, "flex flex-col gap-2 text-[14px] text-ink/65")}>{children}</div>
    </div>
  )
}

function FootLink({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className="w-fit text-ink/65 transition-colors hover:text-clay-700"
    >
      {children}
    </NavLink>
  )
}

/* ------------------------------------------------------------------ *
 * Listing card — hover image zoom + status
 * ------------------------------------------------------------------ */

function ResidenceCard({ r, i }: { r: (typeof residences)[number]; i: number }) {
  return (
    <Reveal delay={(i % 2) * 0.08} className="group">
      <article>
        <div className="relative overflow-hidden rounded-[3px] ring-1 ring-stone-900/10">
          <div className="aspect-[5/4] overflow-hidden bg-stone-200">
            <img
              src={img(r.seed, 880, 700)}
              alt={`${r.name}, ${r.place}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ background: "linear-gradient(180deg, rgba(40,34,28,0.04), rgba(120,70,42,0.10))" }}
          />
          <span
            className={cn(
              mono,
              "absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[10px] text-ink/80 backdrop-blur",
            )}
          >
            {r.status}
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className={cn(display, "text-[22px] font-semibold text-ink")}>{r.name}</h3>
          <span className={cn(mono, "shrink-0 text-[12px] tracking-[0.1em] text-clay-700")}>{r.price}</span>
        </div>
        <p className={cn(body, "mt-1 text-[14px] text-ink/65")}>{r.place} · {r.year} · {r.architect}</p>
        <div className={cn(body, "mt-3 flex items-center gap-5 text-[13px] text-ink/70")}>
          <Spec icon={<BedDouble className="h-4 w-4" strokeWidth={1.5} />} v={`${r.beds} bd`} />
          <Spec icon={<Bath className="h-4 w-4" strokeWidth={1.5} />} v={`${r.baths} ba`} />
          <Spec icon={<Maximize className="h-4 w-4" strokeWidth={1.5} />} v={`${r.sqft} sf`} />
        </div>
      </article>
    </Reveal>
  )
}

function Spec({ icon, v }: { icon: ReactNode; v: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink/60">
      <span className="text-clay-600">{icon}</span>
      {v}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

function Home({ base }: { base: string }) {
  const featured = residences[0]
  return (
    <div>
      {/* Hero — asymmetric, parallax portrait on the right */}
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-6 pb-20 pt-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
        <div>
          <Reveal>
            <div className="flex items-center gap-4">
              <Eyebrow>Marin · Sonoma · The Coast</Eyebrow>
              <Rule />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className={cn(display, "mt-7 text-[clamp(2.6rem,7vw,5.1rem)] font-semibold leading-[0.98] text-ink")}>
              Architectural<br />
              homes, sold<br />
              <span className="text-clay-700">quietly.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={cn(body, "mt-7 max-w-md text-[17px] leading-relaxed text-ink/65")}>
              We represent a small number of significant houses each year — the
              redwood boxes, the post-and-beams, the ones that were drawn by hand.
              We find them the next person who'll leave them be.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <NavLink
                  to={`${base}/residences`}
                  className={cn(
                    body,
                    "group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-clay-800",
                  )}
                >
                  View residences
                  <MoveRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </NavLink>
              </Magnetic>
              <NavLink
                to={`${base}/approach`}
                className={cn(body, "inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-[15px] text-ink/70 transition-colors hover:text-ink")}
              >
                Our approach
                <ArrowUpRight className="h-4 w-4" />
              </NavLink>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <ParallaxImage
            seed="meridian-hero"
            alt="A redwood modernist house opening onto a coastal bluff"
            aspect="aspect-[4/5]"
            range={10}
          />
          <Reveal delay={0.2}>
            <div className="absolute -bottom-6 -left-6 hidden rounded-[3px] border border-stone-900/10 bg-paper px-5 py-4 shadow-[0_18px_40px_-24px_rgba(40,34,28,0.5)] sm:block">
              <span className={cn(mono, "text-[10px] text-clay-700")}>Now showing</span>
              <p className={cn(display, "mt-1 text-[18px] font-semibold text-ink")}>{featured.name}</p>
              <p className={cn(body, "text-[13px] text-ink/65")}>{featured.place}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-stone-900/10 bg-paperdeep">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-stone-900/10 px-6 md:grid-cols-4">
          {[
            ["19", "homes placed this year"],
            ["1957", "oldest in the current book"],
            ["41 yrs", "longest single ownership"],
            ["6", "now on the market"],
          ].map(([n, l], idx) => (
            <Reveal key={l} delay={idx * 0.06} className="px-4 py-9 md:px-6">
              <div className={cn(display, "text-[34px] font-semibold leading-none text-ink md:text-[42px]")}>{n}</div>
              <div className={cn(body, "mt-2 text-[13px] leading-snug text-ink/65")}>{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured residence — full-bleed parallax band */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ParallaxImage
            seed={featured.seed}
            alt={`Interior of ${featured.name}`}
            aspect="aspect-[5/6]"
            range={12}
          />
          <div>
            <Eyebrow>Featured · {featured.status}</Eyebrow>
            <h2 className={cn(display, "mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.02] text-ink")}>
              {featured.name}
            </h2>
            <p className={cn(body, "mt-2 text-[15px] text-ink/65")}>
              {featured.place} · {featured.architect}, {featured.year}
            </p>
            <p className={cn(body, "mt-6 max-w-md text-[16px] leading-relaxed text-ink/70")}>
              {featured.blurb}
            </p>
            <div className="mt-7 flex items-center gap-6">
              <div>
                <div className={cn(display, "text-[26px] font-semibold text-clay-700")}>{featured.price}</div>
                <div className={cn(mono, "mt-1 text-[10px] text-ink/70")}>
                  {featured.beds} bd · {featured.baths} ba · {featured.sqft} sf
                </div>
              </div>
              <NavLink
                to={`${base}/visit`}
                className={cn(body, "group inline-flex items-center gap-2 text-[15px] font-medium text-ink underline-offset-4 hover:underline")}
              >
                Arrange a viewing
                <MoveRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Recent residences preview */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className={cn(display, "text-[clamp(1.8rem,4vw,2.6rem)] font-semibold text-ink")}>
            On the market now
          </h2>
          <NavLink
            to={`${base}/residences`}
            className={cn(body, "group inline-flex shrink-0 items-center gap-1.5 text-[14px] text-ink/70 hover:text-clay-700")}
          >
            All residences
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </NavLink>
        </div>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {residences.slice(0, 3).map((r, i) => (
            <ResidenceCard key={r.slug} r={r} i={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Residences() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <Reveal>
        <Eyebrow>The current book · {residences.length} homes</Eyebrow>
        <h1 className={cn(display, "mt-5 max-w-2xl text-[clamp(2.2rem,5.5vw,3.6rem)] font-semibold leading-[1.02] text-ink")}>
          Every house here was drawn by someone who meant it.
        </h1>
        <p className={cn(body, "mt-5 max-w-lg text-[16px] leading-relaxed text-ink/65")}>
          We list deliberately. No volume, no churn — a handful of homes we'd be
          glad to live in ourselves, each with a story worth keeping straight.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {residences.map((r, i) => (
          <ResidenceCard key={r.slug} r={r} i={i} />
        ))}
      </div>

      <Reveal className="mt-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[4px] border border-stone-900/10 bg-paperdeep p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className={cn(display, "text-[26px] font-semibold text-ink")}>Looking to sell one?</h2>
            <p className={cn(body, "mt-2 max-w-md text-[15px] text-ink/60")}>
              If you own an architecturally significant home in the North Bay,
              we'd be glad to walk it with you — no obligation, no pressure.
            </p>
          </div>
          <Magnetic>
            <a
              href="mailto:hello@meridian.homes"
              className={cn(body, "inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-clay-800")}
            >
              Start a conversation <MoveRight className="h-4 w-4" />
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  )
}

function Approach() {
  const principles = [
    {
      n: "01",
      t: "We list few, and we list well.",
      b: "A dozen or so homes a year. Each gets photographed properly, written up honestly, and shown by someone who can name the architect.",
    },
    {
      n: "02",
      t: "Originality over renovation.",
      b: "We'd rather a kitchen be dated and intact than gutted for resale. The right buyer pays more for the former — we know where to find them.",
    },
    {
      n: "03",
      t: "The match matters most.",
      b: "These houses outlive their owners. Our job is to hand each one to someone who'll understand what they're holding.",
    },
  ]
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_0.85fr] md:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Our approach</Eyebrow>
              <h1 className={cn(display, "mt-5 text-[clamp(2.2rem,5.5vw,3.8rem)] font-semibold leading-[1.0] text-ink")}>
                We're not in the volume business.
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className={cn(body, "mt-7 max-w-md text-[17px] leading-relaxed text-ink/70")}>
                Meridian was started by two people who kept watching good houses
                get sold badly — staged into anonymity, photographed in the wrong
                light, handed to whoever bid first. We thought the homes that were
                designed with intent deserved to be sold with some, too.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className={cn(body, "mt-5 max-w-md text-[16px] leading-relaxed text-ink/60")}>
                We're small on purpose. It means we answer our own phones, and it
                means we can say no — which, more than anything, is what keeps the
                book this good.
              </p>
            </Reveal>
          </div>
          <div className="md:pt-4">
            <ParallaxImage
              seed="meridian-approach"
              alt="A board-formed concrete wall lit by clerestory windows"
              aspect="aspect-[4/5]"
              range={14}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-stone-900/10 bg-paperdeep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <div className={cn(mono, "text-[13px] text-clay-700")}>{p.n}</div>
                <div className="my-4 h-px w-full bg-stone-900/15" />
                <h3 className={cn(display, "text-[22px] font-semibold leading-snug text-ink")}>{p.t}</h3>
                <p className={cn(body, "mt-3 text-[15px] leading-relaxed text-ink/65")}>{p.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <p className={cn(display, "text-[clamp(1.5rem,3.6vw,2.4rem)] font-medium italic leading-snug text-ink")}>
            “A house this considered shouldn't change hands like a used car. It
            should change hands like a good painting — to someone who came
            looking for exactly it.”
          </p>
          <p className={cn(mono, "mt-6 text-[11px] text-ink/70")}>Dana Ferro · Founding partner</p>
        </Reveal>
      </section>
    </div>
  )
}

function Journal() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <Reveal>
        <Eyebrow>Journal</Eyebrow>
        <h1 className={cn(display, "mt-5 max-w-xl text-[clamp(2.2rem,5.5vw,3.4rem)] font-semibold leading-[1.02] text-ink")}>
          Notes from the field.
        </h1>
        <p className={cn(body, "mt-5 max-w-lg text-[16px] leading-relaxed text-ink/65")}>
          Occasional writing on selling architecture, reading rooflines, and the
          quieter parts of the work.
        </p>
      </Reveal>

      <div className="mt-14 flex flex-col">
        {journal.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.06}>
            <a
              href="#"
              onClick={(ev) => ev.preventDefault()}
              className="group grid items-center gap-6 border-t border-stone-900/10 py-8 md:grid-cols-[180px_1fr_auto] md:gap-10"
            >
              <div className="overflow-hidden rounded-[3px] ring-1 ring-stone-900/10">
                <div className="aspect-[16/10] overflow-hidden bg-stone-200 md:aspect-[4/3]">
                  <img
                    src={img(e.seed, 420, 320)}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div>
                <div className={cn(mono, "text-[10px] text-clay-700")}>
                  {e.kind} · {e.date} · {e.read}
                </div>
                <h2 className={cn(display, "mt-2 text-[24px] font-semibold leading-snug text-ink transition-colors group-hover:text-clay-700")}>
                  {e.title}
                </h2>
                <p className={cn(body, "mt-2 max-w-xl text-[15px] leading-relaxed text-ink/60")}>{e.excerpt}</p>
              </div>
              <ArrowUpRight className="hidden h-6 w-6 text-ink/30 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-clay-700 md:block" />
            </a>
          </Reveal>
        ))}
        <div className="border-t border-stone-900/10" />
      </div>
    </div>
  )
}

function Visit() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="grid gap-14 md:grid-cols-[1fr_0.9fr] md:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Visit · By appointment</Eyebrow>
            <h1 className={cn(display, "mt-5 text-[clamp(2.2rem,5.5vw,3.6rem)] font-semibold leading-[1.0] text-ink")}>
              Come see one in person.
            </h1>
            <p className={cn(body, "mt-6 max-w-md text-[16px] leading-relaxed text-ink/65")}>
              Tell us which residence caught your eye, or what you're hoping to
              find. We show by appointment so there's time to actually stand in
              the light and listen to the house.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-10 grid gap-5"
            >
              <Field label="Your name" id="name" placeholder="Jane Okonkwo" />
              <Field label="Email" id="email" type="email" placeholder="jane@email.com" />
              <div className="grid gap-2">
                <label htmlFor="interest" className={cn(mono, "text-[10px] text-ink/65")}>Residence of interest</label>
                <select
                  id="interest"
                  className={cn(body, "rounded-[3px] border border-stone-900/15 bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-clay-600")}
                  defaultValue=""
                >
                  <option value="" disabled>Select a home — or “just browsing”</option>
                  {residences.map((r) => (
                    <option key={r.slug} value={r.slug}>{r.name} — {r.place}</option>
                  ))}
                  <option value="browsing">Just browsing for now</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="note" className={cn(mono, "text-[10px] text-ink/65")}>Anything we should know</label>
                <textarea
                  id="note"
                  rows={4}
                  placeholder="Timeline, what you're after, who you're buying with…"
                  className={cn(body, "resize-none rounded-[3px] border border-stone-900/15 bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-clay-600")}
                />
              </div>
              <Magnetic>
                <button
                  type="submit"
                  className={cn(body, "group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-clay-800")}
                >
                  Request a viewing
                  <MoveRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <p className={cn(body, "text-[12px] text-ink/70")}>
                This is a design study — the form doesn't send anywhere.
              </p>
            </form>
          </Reveal>
        </div>

        <div className="md:pt-2">
          <ParallaxImage
            seed="meridian-visit"
            alt="The entry sequence of a hillside modernist home at dusk"
            aspect="aspect-[4/5]"
            range={12}
          />
          <Reveal delay={0.12}>
            <div className="mt-8 grid gap-5 rounded-[4px] border border-stone-900/10 bg-paperdeep p-7">
              <DetailRow k="Office" v="Throckmorton Ave, Mill Valley" />
              <DetailRow k="Hours" v="By appointment, Tue–Sat" />
              <DetailRow k="Email" v="hello@meridian.homes" />
              <DetailRow k="License" v="California DRE #02041188" />
            </div>
          </Reveal>
        </div>
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
      <label htmlFor={id} className={cn(mono, "text-[10px] text-ink/65")}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(body, "rounded-[3px] border border-stone-900/15 bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-clay-600")}
      />
    </div>
  )
}

function DetailRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-stone-900/10 pb-4 last:border-0 last:pb-0">
      <span className={cn(mono, "text-[10px] text-ink/70")}>{k}</span>
      <span className={cn(body, "text-right text-[14px] text-ink/75")}>{v}</span>
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Meridian() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <div className={cn(body, "min-h-screen bg-paper text-ink antialiased selection:bg-clay-200 selection:text-clay-900")}>
      <Nav base={base} />
      <main>
        <Routes>
          <Route index element={<Page><Home base={base} /></Page>} />
          <Route path="residences" element={<Page><Residences /></Page>} />
          <Route path="approach" element={<Page><Approach /></Page>} />
          <Route path="journal" element={<Page><Journal /></Page>} />
          <Route path="visit" element={<Page><Visit /></Page>} />
          <Route path="*" element={<Page><Home base={base} /></Page>} />
        </Routes>
      </main>
      <Footer base={base} />
    </div>
  )
}

export const meta: SiteMeta = {
  title: "Meridian — Architectural homes, sold quietly",
  description:
    "A boutique Northern California brokerage for architecturally significant homes. Warm limestone palette, Fraunces display type, and scroll-triggered parallax imagery throughout.",
  date: "2026-06-23",
  type: "Real-estate listing",
  interaction: "Scroll-triggered parallax imagery + reveals + magnetic CTAs",
  pages: ["Home", "Residences", "Approach", "Journal", "Visit"],
}
