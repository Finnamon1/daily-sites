import { Link, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Hammer, Ruler, Sprout } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { cn } from "@/lib/utils"
import {
  BeforeAfter,
  Counter,
  Cta,
  Eyebrow,
  body,
  display,
  mono,
} from "../shared"
import { PROJECTS } from "../data"

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const featured = PROJECTS[0]
  const reduce = useReducedMotion()

  return (
    <div>
      {/* ---------------------------------------------------------- HERO */}
      <section className="relative mx-auto max-w-6xl px-5 pt-16 md:pt-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <Eyebrow>Heritage renovation · Melbourne</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h1
                className={cn(
                  "mt-6 text-balance text-[44px] font-light leading-[0.98] tracking-[-0.02em] text-[#211d18] sm:text-6xl lg:text-[68px]",
                  display,
                )}
              >
                Old houses,
                <br />
                <span className="italic text-[#b14a2f]">brought back</span> to
                the way you live now.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p
                className={cn(
                  "mt-7 max-w-md text-[17px] leading-relaxed text-[#6c6358]",
                  body,
                )}
              >
                Hearne restores the inner-north's terraces, cottages and
                warehouses — keeping what's worth keeping, and rebuilding the
                rest with timber, brick and a great deal of light.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to={`${base}/contact`}>
                  <Cta>
                    Start a project <ArrowUpRight className="h-4 w-4" />
                  </Cta>
                </Link>
                <Link to={`${base}/projects`}>
                  <Cta variant="outline">See our work</Cta>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Featured interaction: before / after */}
          <Reveal delay={0.1}>
            <figure>
              <BeforeAfter
                beforeSrc="https://picsum.photos/seed/hearne-hero-before/900/680"
                afterSrc="https://picsum.photos/seed/hearne-hero-after/900/680"
                beforeAlt="The rear of a Brunswick terrace before works — dim, closed-in rooms"
                afterAlt="The same terrace after restoration — an open timber kitchen full of light"
                ratio="aspect-[4/3]"
              />
              <figcaption
                className={cn(
                  "mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#6c6358]",
                  mono,
                )}
              >
                <span>Weston St · rear addition</span>
                <span className="text-[#b14a2f]">drag to compare →</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- STATS */}
      <section className="mx-auto mt-20 max-w-6xl px-5 md:mt-28">
        <div className="grid grid-cols-2 gap-y-10 border-y border-[#211d18]/12 py-10 md:grid-cols-4">
          <Stat value={<Counter to={38} />} label="Homes restored" />
          <Stat
            value={
              <>
                18<Counter to={91} />
              </>
            }
            label="Oldest restoration"
          />
          <Stat
            value={<Counter to={4.9} decimals={1} />}
            label="Average client rating"
          />
          <Stat value={<Counter to={11} suffix=" yrs" />} label="On the tools" />
        </div>
      </section>

      {/* ---------------------------------------------------------- SERVICES */}
      <section className="mx-auto mt-24 max-w-6xl px-5 md:mt-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <Eyebrow>What we do</Eyebrow>
              <h2
                className={cn(
                  "mt-5 text-3xl font-light leading-tight tracking-tight text-[#211d18] sm:text-4xl",
                  display,
                )}
              >
                One studio, start to finish.
              </h2>
              <p
                className={cn(
                  "mt-4 max-w-sm text-[15px] leading-relaxed text-[#6c6358]",
                  body,
                )}
              >
                We design, document and build in-house, so the detail you draw
                in spring is the detail that gets nailed up in winter. No
                hand-offs, no surprises.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <article className="group flex items-start gap-6 border-t border-[#211d18]/12 py-7 transition-colors hover:bg-[#ece4d6]/60">
                  <s.icon
                    className="mt-1 h-6 w-6 shrink-0 text-[#b14a2f] transition-transform duration-300 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3
                        className={cn(
                          "text-xl text-[#211d18]",
                          display,
                        )}
                      >
                        {s.title}
                      </h3>
                      <span
                        className={cn(
                          "shrink-0 text-[11px] uppercase tracking-[0.16em] text-[#6c6358]",
                          mono,
                        )}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-2 max-w-md text-[15px] leading-relaxed text-[#6c6358]",
                        body,
                      )}
                    >
                      {s.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- FEATURED PROJECT */}
      <section className="mx-auto mt-24 max-w-6xl px-5 md:mt-32">
        <Reveal>
          <div className="grid items-center gap-10 rounded-[6px] bg-[#211d18] p-6 text-[#f4efe6] md:grid-cols-2 md:p-10">
            <div className="order-2 md:order-1">
              <span
                className={cn(
                  "text-[11px] uppercase tracking-[0.2em] text-[#e0a58f]",
                  mono,
                )}
              >
                Selected work · {featured.suburb} {featured.year}
              </span>
              <h2
                className={cn(
                  "mt-4 text-3xl font-light leading-tight sm:text-4xl",
                  display,
                )}
              >
                {featured.name}
              </h2>
              <p
                className={cn(
                  "mt-4 text-[15px] leading-relaxed text-[#f4efe6]/70",
                  body,
                )}
              >
                {featured.blurb}
              </p>
              <Link
                to={`${base}/projects`}
                className={cn(
                  "mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[#f4efe6] underline-offset-4 transition-colors hover:text-[#e0a58f] hover:underline",
                  body,
                )}
              >
                View the project record
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={featured.img.replace(/\d+\/\d+$/, "1000/760")}
                alt={`Interior of ${featured.name} after restoration`}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-[4px] object-cover ring-1 ring-[#f4efe6]/15"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- QUOTE */}
      <section className="mx-auto mt-24 max-w-3xl px-5 text-center md:mt-32">
        <Reveal>
          <blockquote
            className={cn(
              "text-balance text-2xl font-light leading-snug text-[#211d18] sm:text-[32px]",
              display,
            )}
          >
            “They treated a hundred-year-old house like it had opinions — and
            then gave us a kitchen we never want to leave.”
          </blockquote>
          <figcaption
            className={cn(
              "mt-6 text-[11px] uppercase tracking-[0.18em] text-[#6c6358]",
              mono,
            )}
          >
            Priya & Tom — Stewart's Cottage, Fitzroy North
          </figcaption>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- CTA BAND */}
      <section className="mx-auto mb-24 mt-24 max-w-6xl px-5 md:mt-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[6px] border border-[#211d18]/12 bg-[#ece4d6] px-6 py-14 text-center md:px-10 md:py-20">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#b14a2f]/15 blur-2xl"
              animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2
              className={cn(
                "relative text-balance text-3xl font-light leading-tight text-[#211d18] sm:text-5xl",
                display,
              )}
            >
              Got a house with good bones?
            </h2>
            <p
              className={cn(
                "relative mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#6c6358]",
                body,
              )}
            >
              We take on a handful of homes each year. Tell us about yours and
              we'll come and stand in it with you.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Link to={`${base}/contact`}>
                <Cta>
                  Book a site visit <ArrowUpRight className="h-4 w-4" />
                </Cta>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <Reveal>
      <div className="px-1">
        <div
          className={cn(
            "text-4xl font-light tracking-tight text-[#211d18] sm:text-5xl",
            display,
          )}
        >
          {value}
        </div>
        <div
          className={cn(
            "mt-2 text-[11px] uppercase tracking-[0.16em] text-[#6c6358]",
            mono,
          )}
        >
          {label}
        </div>
      </div>
    </Reveal>
  )
}

const SERVICES = [
  {
    icon: Ruler,
    title: "Heritage restoration",
    tag: "01",
    body: "Pressed metal, leadlight, lath-and-plaster, joinery — repaired by trades who do this for a living, not patched over.",
  },
  {
    icon: Hammer,
    title: "Additions & extensions",
    tag: "02",
    body: "Rear and first-floor additions that defer to the original house from the street and open it right up inside.",
  },
  {
    icon: Sprout,
    title: "Kitchens, baths & gardens",
    tag: "03",
    body: "The rooms you actually live in — designed in stone, timber and tile, and tied back out to the garden.",
  },
] as const
