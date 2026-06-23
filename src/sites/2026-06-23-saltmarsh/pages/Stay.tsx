import { motion } from "framer-motion"
import { BedDouble, MapPin } from "lucide-react"
import { TiltCard } from "@/components/fx/TiltCard"
import { Reveal } from "@/components/fx/Reveal"
import { stays } from "../data"

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export function Stay() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <span className="font-['DM_Sans'] text-[12px] uppercase tracking-[0.3em] text-[#2f6b5e]">
            Where to Stay
          </span>
          <h1 className="mt-3 font-['Fraunces'] text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[0.98] text-[#1c2321]">
            Three rooms worth the drive.
          </h1>
          <p className="mt-5 font-['DM_Sans'] text-[17px] leading-relaxed text-[#1c2321]/75">
            No chains, no conference suites. Places where the fire is lit by four and
            someone remembers the tide times so you don't have to. Booked direct, always.
          </p>
        </header>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stays.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.1}>
              <TiltCard max={7} className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-sm border border-[#1c2321]/12 bg-[#efe9dc]">
                  <div className="aspect-[5/4] overflow-hidden">
                    <img
                      src={img(s.seed, 560, 448)}
                      alt={`${s.name}, ${s.type} in ${s.where}`}
                      width={560}
                      height={448}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[12%]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1.5 font-['DM_Sans'] text-[12px] uppercase tracking-[0.18em] text-[#2f6b5e]">
                      <BedDouble className="h-3.5 w-3.5" /> {s.type}
                    </div>
                    <h2 className="mt-1.5 font-['Fraunces'] text-2xl font-semibold leading-tight text-[#1c2321]">
                      {s.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 font-['DM_Sans'] text-[13px] text-[#1c2321]/60">
                      <MapPin className="h-3.5 w-3.5" /> {s.where}
                    </p>
                    <p className="mt-3 flex-1 font-['DM_Sans'] text-[14px] leading-relaxed text-[#1c2321]/75">
                      {s.note}
                    </p>
                    <div className="mt-4 border-t border-[#1c2321]/12 pt-3 font-['Fraunces'] text-lg font-semibold text-[#985a1f]">
                      {s.price}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-sm border border-[#2f6b5e]/30 bg-[#2f6b5e]/8 p-6 font-['DM_Sans'] text-[15px] leading-relaxed text-[#1c2321]/80"
        >
          <strong className="font-semibold text-[#1c2321]">A note on timing.</strong>{" "}
          The coast empties from October and the rooms get kinder on the wallet. If you
          can only come in August, book by spring — there are more birdwatchers than beds.
        </motion.aside>
      </div>
    </div>
  )
}
