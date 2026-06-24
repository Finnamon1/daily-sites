import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { C, SPACES, type Temp } from "../theme"
import { Kicker, Section, ThermalTag } from "../ui"

type Filter = "all" | Temp
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "warm", label: "Heat" },
  { id: "cold", label: "Cold" },
  { id: "still", label: "Rest" },
]

export function Spaces() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const [filter, setFilter] = useState<Filter>("all")
  const shown = SPACES.filter((s) => filter === "all" || s.temp === filter)

  return (
    <div>
      <Section className="pt-16 pb-10 md:pt-24">
        <Kicker>Five rooms</Kicker>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="max-w-xl font-['Spectral'] text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.0] tracking-[-0.02em]">
            Built around the swing between hot and cold.
          </h1>
          {/* temperature filter */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter spaces by temperature">
            {FILTERS.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className="relative rounded-full px-4 py-2 font-['Hanken_Grotesk'] text-[14px] font-semibold transition-colors duration-200"
                  style={{ color: active ? "#fbf3e9" : C.inkSoft }}
                >
                  {active && (
                    <motion.span layoutId="space-filter" className="absolute inset-0 rounded-full" style={{ background: C.ember }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </Section>

      <Section className="pb-24">
        <motion.div layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {shown.map((s, i) => (
              <motion.div
                key={s.name}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className={i === 0 && filter === "all" ? "md:col-span-2" : ""}
              >
                <SpaceTile space={s} wide={i === 0 && filter === "all"} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      <div style={{ background: C.boneSoft }} className="border-t" >
        <Section className="flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <p className="max-w-md font-['Spectral'] text-[1.5rem] italic leading-[1.3]" style={{ color: C.ink }}>
            One ticket opens every room. Wander between them as the mood takes you.
          </p>
          <Link to={`${base}/booking`} className="shrink-0 rounded-full px-7 py-3.5 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5" style={{ background: C.ember, color: "#fbf3e9" }}>
            Book a visit
          </Link>
        </Section>
      </div>
    </div>
  )
}

function SpaceTile({ space, wide }: { space: (typeof SPACES)[number]; wide?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative overflow-hidden rounded-[1.3rem] border ${wide ? "min-h-[360px]" : "min-h-[300px]"}`}
      style={{ borderColor: C.line }}
    >
      <img
        src={`https://picsum.photos/seed/${space.seed}/${wide ? 1200 : 760}/${wide ? 680 : 620}`}
        alt={space.detail}
        width={wide ? 1200 : 760}
        height={wide ? 680 : 620}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        style={{ filter: "saturate(0.9)" }}
      />
      <div aria-hidden className="absolute inset-0 transition-opacity duration-300" style={{ background: "linear-gradient(180deg, rgba(26,22,17,0.05) 25%, rgba(26,22,17,0.85) 100%)" }} />
      <div className="absolute left-5 top-5"><ThermalTag temp={space.temp} onDark /></div>

      <div className="absolute inset-x-5 bottom-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className={`font-['Spectral'] font-medium ${wide ? "text-[2.1rem]" : "text-[1.6rem]"}`} style={{ color: C.bone }}>{space.name}</h2>
            <p className="mt-1 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(244,238,228,0.72)" }}>{space.spec}</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-200" style={{ background: "rgba(244,238,228,0.14)", color: C.bone }}>
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        {/* always visible on touch screens (no hover) */}
        <p className="mt-3 max-w-md font-['Hanken_Grotesk'] text-[14.5px] leading-[1.6] md:hidden" style={{ color: "rgba(244,238,228,0.85)" }}>
          {space.detail}
        </p>
        {/* hover-revealed detail on desktop */}
        <div className="hidden md:block">
          <AnimatePresence>
            {hover && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="max-w-md overflow-hidden font-['Hanken_Grotesk'] text-[14.5px] leading-[1.6]"
                style={{ color: "rgba(244,238,228,0.85)" }}
              >
                {space.detail}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </article>
  )
}
