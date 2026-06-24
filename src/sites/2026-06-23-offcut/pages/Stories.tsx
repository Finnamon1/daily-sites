import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Reveal } from "@/components/fx/Reveal"
import { Label, STORIES, StoryCard, type Story } from "../shared"

const FILTERS = ["All", "Essay", "Field report", "Process", "Notebook"] as const

export function Stories() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")

  const shown = useMemo<Story[]>(() => {
    if (filter === "All") return STORIES
    return STORIES.filter((s) => s.kicker === filter)
  }, [filter])

  return (
    <div className="mx-auto max-w-6xl px-5 pt-16">
      <Reveal>
        <Label className="text-[#c1351c]">The reading list</Label>
        <h1 className="mt-4 max-w-3xl font-['Fraunces'] text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.025em] text-[#191510] sm:text-[4rem]">
          Six long looks at slow work.
        </h1>
        <p className="mt-5 max-w-xl font-['DM_Sans'] text-lg leading-relaxed text-[#191510]/75">
          Everything in Issue 14, from the band saw on the marsh to the third pass
          on a sharpening stone. Filter by the kind of piece you're in the mood for.
        </p>
      </Reveal>

      {/* filter row — animated underline */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-[#191510]/15 pb-4">
        {FILTERS.map((f) => {
          const active = f === filter
          const count =
            f === "All" ? STORIES.length : STORIES.filter((s) => s.kicker === f).length
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-sm px-4 py-2 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 ${
                active ? "text-[#f2ede1]" : "text-[#191510]/70 hover:text-[#191510]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="offcut-filter"
                  className="absolute inset-0 -z-0 rounded-sm bg-[#191510]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">
                {f} <span className={active ? "text-[#f2ede1]/72" : "text-[#191510]/55"}>· {count}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* grid — layout animation reflows when filtered */}
      <motion.div layout className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <motion.div
            layout
            key={s.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <StoryCard story={s} />
          </motion.div>
        ))}
      </motion.div>

      {shown.length === 0 && (
        <p className="mt-12 font-['Fraunces'] text-xl italic text-[#191510]/60">
          Nothing in that category this issue — try another.
        </p>
      )}
    </div>
  )
}
