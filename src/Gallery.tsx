import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight, Calendar } from "lucide-react"
import { sites } from "./sites/registry"

export default function Gallery() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="mx-auto max-w-5xl px-6 pb-10 pt-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">Daily Sites</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          A new website, built every day.
        </h1>
        <p className="mt-4 max-w-xl text-zinc-500">
          One creative React build per day — different purpose, different signature interaction.
          The routine grades itself and logs what it learned so the next one is sharper.
        </p>
        <p className="mt-2 text-sm text-zinc-400">{sites.length} site{sites.length === 1 ? "" : "s"} so far</p>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {sites.map((site, i) => (
            <motion.div
              key={site.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <Link
                to={`/site/${site.slug}`}
                className="group block h-full rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                    {site.meta.type}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900" />
                </div>
                <h2 className="mt-4 text-lg font-semibold leading-snug">{site.meta.title}</h2>
                <p className="mt-2 text-sm text-zinc-500">{site.meta.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {site.meta.date}
                  </span>
                  <span>·</span>
                  <span>{site.meta.interaction}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {sites.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 p-16 text-center text-zinc-400">
            No sites yet. The first routine run will drop one here.
          </div>
        )}
      </main>
    </div>
  )
}
