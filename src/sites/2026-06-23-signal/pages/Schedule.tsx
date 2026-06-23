import { Reveal } from "@/components/fx/Reveal"
import { schedule, type Slot } from "../data"

const stageColor: Record<Slot["stage"], string> = {
  "Main Hall": "text-[#c8f135]",
  "The Cistern": "text-[#2dd4bf]",
  "Workshop Room": "text-[#ff8a6a]",
}

export function Schedule() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.3em] text-[#c8f135]">
          Saturday 19 September
        </p>
        <h1 className="mt-4 font-['Space_Grotesk'] text-5xl font-bold tracking-tight md:text-6xl">
          The running order
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#cfd3ca]">
          Three spaces, one ticket, no clashes worth losing sleep over — sets are staggered so you can catch
          almost everything. Times drift by a few minutes; that's the point.
        </p>
      </header>

      {/* legend */}
      <div className="mt-8 flex flex-wrap gap-4 font-['JetBrains_Mono'] text-xs uppercase tracking-wider">
        {(Object.keys(stageColor) as Slot["stage"][]).map((s) => (
          <span key={s} className={`flex items-center gap-2 ${stageColor[s]}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {s}
          </span>
        ))}
      </div>

      <ol className="mt-12 border-l border-white/10">
        {schedule.map((slot, i) => (
          <Reveal key={slot.time} delay={i * 0.04}>
            <li className="group relative grid grid-cols-[auto_1fr] gap-6 pb-8 pl-6 md:grid-cols-[auto_1fr_auto] md:items-baseline">
              <span
                aria-hidden
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white/25 transition-colors duration-300 group-hover:bg-[#c8f135]"
              />
              <time className="font-['JetBrains_Mono'] text-sm text-[#a3a8a0]">{slot.time}</time>
              <div>
                <h3 className="font-['Space_Grotesk'] text-lg font-semibold leading-snug">{slot.title}</h3>
                <p className="mt-1 text-sm text-[#a3a8a0]">
                  {slot.artist}
                  <span className="mx-2 text-white/20">/</span>
                  <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#8b9087]">
                    {slot.kind}
                  </span>
                </p>
              </div>
              <span
                className={`font-['JetBrains_Mono'] text-xs uppercase tracking-wider ${stageColor[slot.stage]} md:text-right`}
              >
                {slot.stage}
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
