import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Search } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { stockists } from "../data"

const KINDS = ["All", "Café", "Grocer", "Bar", "Restaurant"] as const

export function Stockists() {
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stockists.filter((s) => {
      const matchKind = kind === "All" || s.kind === kind
      const matchQuery = !q || s.city.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      return matchKind && matchQuery
    })
  }, [query, kind])

  return (
    <div className="px-6 pb-24 pt-14 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#B23A10]">Find Pulp</p>
          <h1 className="mt-2 max-w-2xl font-['Syne'] text-5xl font-extrabold leading-[0.95] tracking-tight text-[#221C15] md:text-6xl">
            Cold, fizzing, near you.
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-[#4A4135]">
            We're in good cafés, grocers and bars across the UK — the kind of places
            that taste before they stock. Search a city or filter by type.
          </p>
        </Reveal>

        {/* controls */}
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="relative flex w-full items-center md:max-w-xs">
            <Search className="absolute left-4 h-4 w-4 text-[#8A7F6E]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or venue…"
              className="w-full rounded-full border border-[#221C15]/15 bg-white/60 py-3 pl-11 pr-4 text-[15px] text-[#221C15] outline-none transition-colors duration-200 placeholder:text-[#8A7F6E] focus:border-[#E8511D]"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  kind === k
                    ? "border-transparent bg-[#221C15] text-[#F7F1E3]"
                    : "border-[#221C15]/20 text-[#221C15] hover:border-[#221C15]/50"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* results */}
        <div className="mt-10">
          <p className="mb-5 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.14em] text-[#5A4F40]">
            {filtered.length} {filtered.length === 1 ? "place" : "places"}
          </p>

          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((s) => (
                <motion.article
                  layout
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="group overflow-hidden rounded-3xl border border-[#221C15]/10 bg-white/50"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${s.seed}/520/360`}
                      alt={`Interior of ${s.name} in ${s.city}`}
                      width={520}
                      height={360}
                      loading="lazy"
                      className="aspect-[13/9] w-full object-cover transition-transform duration-500 [filter:saturate(0.85)_contrast(1.02)] group-hover:scale-105 group-hover:[filter:saturate(1.1)]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#221C15]/85 px-3 py-1 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.12em] text-[#F7F1E3] backdrop-blur">
                      {s.kind}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-['Fraunces'] text-xl font-semibold text-[#221C15]">{s.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5A4F40]">
                      <MapPin className="h-3.5 w-3.5 text-[#E8511D]" />
                      {s.city}
                    </p>
                    <p className="mt-3 text-sm text-[#6B6258]">{s.note}</p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#221C15]/25 p-12 text-center">
              <p className="font-['Fraunces'] text-xl text-[#221C15]">No Pulp there yet.</p>
              <p className="mt-2 text-[#5A4F40]">
                Not in your town?{" "}
                <button onClick={() => { setQuery(""); setKind("All") }} className="font-semibold text-[#B23A10] underline underline-offset-2">
                  Clear the filters
                </button>{" "}
                or order a case to your door.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
