import { Link, useParams } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { cn } from "@/lib/utils"
import { Counter, Cta, Eyebrow, body, display, mono } from "../shared"

const TEAM = [
  {
    name: "Mara Hearne",
    role: "Founder · Registered builder",
    seed: "hearne-team-mara",
    note: "Third-generation carpenter. Started Hearne after fifteen years rebuilding other people's drawings she didn't agree with.",
  },
  {
    name: "Daniel Osei",
    role: "Design lead",
    seed: "hearne-team-daniel",
    note: "Trained as an architect, kept gravitating to the messy honesty of existing buildings.",
  },
  {
    name: "Win Tran",
    role: "Heritage trades",
    seed: "hearne-team-win",
    note: "Plaster, leadlight, pressed metal. If it was made by hand once, Win can make it again.",
  },
]

const STEPS = [
  {
    n: "01",
    t: "Stand in it",
    d: "We come to the house, climb into the roof, and tell you honestly what's worth saving and what isn't.",
  },
  {
    n: "02",
    t: "Draw it twice",
    d: "A loose first scheme to argue over, then a fully documented set you could hand to any builder — except we're the builder.",
  },
  {
    n: "03",
    t: "Build it slow",
    d: "One site, one crew, fixed dates. You get a weekly photo log and a number you can actually call.",
  },
  {
    n: "04",
    t: "Hand it back",
    d: "A defects walk, a folder of everything behind the walls, and a standing invitation to call us in ten years.",
  },
]

export function Studio() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
      {/* intro */}
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <Reveal>
            <Eyebrow>The studio</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1
              className={cn(
                "mt-5 text-balance text-4xl font-light leading-[1.02] tracking-tight text-[#211d18] sm:text-6xl",
                display,
              )}
            >
              A small crew who'd rather fix a house than flatten one.
            </h1>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <div className="space-y-4 lg:pt-3">
            <p className={cn("text-[17px] leading-relaxed text-[#6c6358]", body)}>
              Hearne is eleven people working out of a converted machine shop in
              Brunswick. We take on six or seven homes a year — never more — so
              that the people who drew your house are the people on the tools.
            </p>
            <p className={cn("text-[15px] leading-relaxed text-[#6c6358]", body)}>
              We believe the inner north already has enough good buildings. Our
              job is to read what's there, keep the parts that give a house its
              character, and quietly make the rest work for a modern family.
            </p>
          </div>
        </Reveal>
      </div>

      {/* image band */}
      <Reveal delay={0.08}>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {["hearne-studio-1", "hearne-studio-2", "hearne-studio-3", "hearne-studio-4"].map(
            (seed, i) => (
              <img
                key={seed}
                src={`https://picsum.photos/seed/${seed}/600/${i % 2 ? 760 : 600}`}
                alt="The Hearne workshop — timber, tools and work in progress"
                loading="lazy"
                className={cn(
                  "w-full rounded-[4px] object-cover ring-1 ring-[#211d18]/10",
                  i % 2 ? "aspect-[3/4]" : "aspect-square",
                  i % 2 ? "md:mt-8" : "",
                )}
              />
            ),
          )}
        </div>
      </Reveal>

      {/* process */}
      <section className="mt-24 md:mt-32">
        <Reveal>
          <Eyebrow>How we work</Eyebrow>
          <h2
            className={cn(
              "mt-5 text-3xl font-light tracking-tight text-[#211d18] sm:text-4xl",
              display,
            )}
          >
            Four steps, no fog.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[6px] bg-[#211d18]/10 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="group h-full bg-[#f4efe6] p-7 transition-colors hover:bg-[#ece4d6]">
                <div className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      "text-2xl text-[#b14a2f] transition-transform duration-300 group-hover:-translate-y-0.5",
                      display,
                    )}
                  >
                    {s.n}
                  </span>
                  <h3 className={cn("text-xl text-[#211d18]", display)}>{s.t}</h3>
                </div>
                <p
                  className={cn(
                    "mt-3 text-[15px] leading-relaxed text-[#6c6358]",
                    body,
                  )}
                >
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* counters */}
      <section className="mt-24 md:mt-32">
        <div className="grid grid-cols-2 gap-y-10 rounded-[6px] bg-[#211d18] px-6 py-12 text-[#f4efe6] md:grid-cols-4 md:px-10">
          <DarkStat value={<Counter to={11} />} label="People" />
          <DarkStat value={<Counter to={7} />} label="Homes a year" />
          <DarkStat
            value={
              <>
                <Counter to={94} />%
              </>
            }
            label="Repeat / referral work"
          />
          <DarkStat
            value={
              <>
                <Counter to={10} />
                yr
              </>
            }
            label="Workmanship warranty"
          />
        </div>
      </section>

      {/* team */}
      <section className="mt-24 md:mt-32">
        <Reveal>
          <Eyebrow>Who you'll meet</Eyebrow>
        </Reveal>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <figure className="group">
                <div className="overflow-hidden rounded-[4px] ring-1 ring-[#211d18]/10">
                  <img
                    src={`https://picsum.photos/seed/${m.seed}/600/720`}
                    alt={`Portrait of ${m.name}, ${m.role}`}
                    loading="lazy"
                    className="aspect-[5/6] w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                </div>
                <figcaption className="mt-4">
                  <h3 className={cn("text-xl text-[#211d18]", display)}>
                    {m.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-0.5 text-[11px] uppercase tracking-[0.16em] text-[#b14a2f]",
                      mono,
                    )}
                  >
                    {m.role}
                  </p>
                  <p
                    className={cn(
                      "mt-3 text-[14px] leading-relaxed text-[#6c6358]",
                      body,
                    )}
                  >
                    {m.note}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="my-24 flex flex-col items-center gap-5 text-center md:my-32">
        <h2
          className={cn(
            "text-balance text-3xl font-light text-[#211d18] sm:text-4xl",
            display,
          )}
        >
          Come and see the workshop.
        </h2>
        <Link to={`${base}/contact`}>
          <Cta>
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </Cta>
        </Link>
      </section>
    </div>
  )
}

function DarkStat({
  value,
  label,
}: {
  value: React.ReactNode
  label: string
}) {
  return (
    <Reveal>
      <div>
        <div
          className={cn(
            "text-4xl font-light tracking-tight text-[#f4efe6] sm:text-5xl",
            display,
          )}
        >
          {value}
        </div>
        <div
          className={cn(
            "mt-2 text-[11px] uppercase tracking-[0.16em] text-[#e0a58f]",
            mono,
          )}
        >
          {label}
        </div>
      </div>
    </Reveal>
  )
}
