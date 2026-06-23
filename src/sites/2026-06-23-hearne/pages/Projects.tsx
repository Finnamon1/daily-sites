import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { cn } from "@/lib/utils"
import { BeforeAfter, Cta, Eyebrow, body, display, mono } from "../shared"
import { PROJECTS } from "../data"

const FILTERS = ["All", "Restoration", "Extension", "Conversion"] as const

function matches(type: string, filter: string) {
  if (filter === "All") return true
  return type.toLowerCase().includes(filter.toLowerCase())
}

export function Projects() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const shown = PROJECTS.filter((p) => matches(p.type, filter))

  return (
    <div className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
      {/* header */}
      <Reveal>
        <Eyebrow>Selected work</Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h1
          className={cn(
            "mt-5 max-w-2xl text-balance text-4xl font-light leading-[1.02] tracking-tight text-[#211d18] sm:text-6xl",
            display,
          )}
        >
          Thirty-eight houses, and we still walk past every one of them.
        </h1>
      </Reveal>

      {/* before/after feature */}
      <Reveal delay={0.1}>
        <div className="mt-12 grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <BeforeAfter
            beforeSrc="https://picsum.photos/seed/hearne-proj-before/1100/740"
            afterSrc="https://picsum.photos/seed/hearne-proj-after/1100/740"
            beforeAlt="A closed-in Edwardian kitchen before renovation"
            afterAlt="The same kitchen after — marble, brass and a wall of north light"
            ratio="aspect-[3/2]"
          />
          <div>
            <span
              className={cn(
                "text-[11px] uppercase tracking-[0.2em] text-[#b14a2f]",
                mono,
              )}
            >
              Park Street Edwardian · Northcote
            </span>
            <h2
              className={cn(
                "mt-3 text-2xl font-light text-[#211d18] sm:text-3xl",
                display,
              )}
            >
              From galley to gathering room.
            </h2>
            <p
              className={cn(
                "mt-3 text-[15px] leading-relaxed text-[#6c6358]",
                body,
              )}
            >
              We pulled out a 1990s lean-to, restored the pressed-metal ceiling
              underneath, and rebuilt the back of the house around a single
              marble island. Drag the handle to see the room we started with.
            </p>
          </div>
        </div>
      </Reveal>

      {/* filters */}
      <div className="mt-16 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] uppercase tracking-[0.14em] transition-colors duration-200",
              mono,
              filter === f
                ? "bg-[#211d18] text-[#f4efe6]"
                : "text-[#6c6358] ring-1 ring-[#211d18]/15 hover:ring-[#211d18]/40",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* masonry grid with hover image-reveal */}
      <motion.div
        layout
        className="mt-8 grid auto-rows-[14px] grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
              className={cn(
                "mb-6",
                p.span === "tall"
                  ? "[grid-row:span_34]"
                  : p.span === "wide"
                    ? "[grid-row:span_22]"
                    : "[grid-row:span_26]",
              )}
            >
              <ProjectCard project={p} base={base} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* tail CTA */}
      <div className="my-24 flex flex-col items-center gap-5 text-center">
        <h2
          className={cn(
            "text-balance text-3xl font-light text-[#211d18] sm:text-4xl",
            display,
          )}
        >
          Yours could be the next one.
        </h2>
        <Link to={`${base}/contact`}>
          <Cta>
            Start a project <ArrowUpRight className="h-4 w-4" />
          </Cta>
        </Link>
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  base,
}: {
  project: (typeof PROJECTS)[number]
  base: string
}) {
  return (
    <Link
      to={`${base}/projects`}
      className="group flex h-full flex-col overflow-hidden rounded-[4px] ring-1 ring-[#211d18]/10 transition-shadow duration-300 hover:shadow-[0_18px_44px_-22px_rgba(33,29,24,0.5)]"
    >
      <div className="relative flex-1 overflow-hidden bg-[#ece4d6]">
        <img
          src={project.img}
          alt={`${project.name} — ${project.type}, ${project.suburb}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {/* hover reveal: ink wash + read-on */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211d18]/85 via-[#211d18]/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className={cn("text-[13px] leading-snug text-[#f4efe6]/90", body)}>
            {project.blurb}
          </p>
        </div>
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full bg-[#f4efe6]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#211d18] backdrop-blur",
            mono,
          )}
        >
          {project.year}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 bg-[#f4efe6] px-4 py-3.5">
        <div>
          <h3 className={cn("text-[17px] text-[#211d18]", display)}>
            {project.name}
          </h3>
          <p
            className={cn(
              "mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[#6c6358]",
              mono,
            )}
          >
            {project.suburb} · {project.type}
          </p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#b14a2f] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
