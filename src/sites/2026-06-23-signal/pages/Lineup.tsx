import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { artists, type Artist } from "../data"

const FILTERS = ["All", "Sound", "Visual", "Live A/V"] as const

export function Lineup() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const shown = filter === "All" ? artists : artists.filter((a) => a.tag === filter)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.3em] text-[#c8f135]">The roster</p>
        <h1 className="mt-4 font-['Space_Grotesk'] text-5xl font-bold tracking-tight md:text-6xl">
          Six artists, one room
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#cfd3ca]">
          We don't book headliners. We book people who make their work in real time and let you watch the
          wires. Everyone here plays once, and only once.
        </p>
      </header>

      {/* filter */}
      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors duration-200 ${
              filter === f
                ? "border-[#c8f135] bg-[#c8f135] text-[#0a0b0e]"
                : "border-white/15 text-[#a3a8a0] hover:border-white/40 hover:text-[#f3f4ef]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* staggered grid */}
      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((a, i) => (
            <ArtistCard key={a.name} artist={a} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e12]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${artist.seed}/600/750`}
          alt={`${artist.name}, ${artist.role.toLowerCase()} based in ${artist.city}`}
          loading="lazy"
          width={600}
          height={750}
          className="h-full w-full object-cover opacity-65 grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-90 group-hover:grayscale-0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/30 to-transparent"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#0a0b0e]/80 px-3 py-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#c8f135] backdrop-blur">
          {artist.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-['Space_Grotesk'] text-2xl font-semibold tracking-tight">{artist.name}</h2>
        <p className="mt-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#8b9087]">
          {artist.role} · {artist.city}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#cfd3ca]">{artist.blurb}</p>
      </div>
    </motion.article>
  )
}
