import { Link, useParams } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { C, RITUAL, type Temp } from "../theme"
import { Kicker, Section, ThermalTag } from "../ui"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"

const TEMP_DOT: Record<Temp, string> = { warm: C.ember, cold: C.steel, still: "#8a7c66" }

const ETIQUETTE = [
  { t: "Rinse before you sweat", d: "A quick shower keeps the sauna clean for everyone who sits after you." },
  { t: "Sit on your towel", d: "Always between you and the wood — it's the one firm rule of every bathhouse." },
  { t: "Voices low", d: "The house runs on quiet. In Quiet Hours, it runs on silence." },
  { t: "Hydrate between rounds", d: "Cold water and tea are on the house. Take more than you think you need." },
]

export function Ritual() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div>
      {/* hero */}
      <Section className="pt-16 pb-16 md:pt-24">
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Kicker>The contrast cycle</Kicker>
            <h1 className="mt-6 max-w-xl font-['Spectral'] text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.0] tracking-[-0.02em]">
              Three rounds, the same shape every time.
            </h1>
          </div>
          <p className="font-['Hanken_Grotesk'] text-[16.5px] leading-[1.7] md:pb-2" style={{ color: C.inkSoft }}>
            There's no trick to it. Heat the body, shock it cold, then rest long enough
            to feel the wave pass through. Do it three times and walk out lighter than
            you came.
          </p>
        </div>
      </Section>

      {/* rounds — vertical timeline */}
      <Section className="pb-8">
        <div className="relative">
          <div aria-hidden className="absolute left-[15px] top-3 bottom-3 w-px md:left-1/2" style={{ background: C.line }} />
          <div className="flex flex-col gap-12">
            {RITUAL.map((r, i) => (
              <Reveal key={r.n} delay={i * 0.05}>
                <div className={`relative grid gap-6 pl-12 md:grid-cols-2 md:gap-16 md:pl-0 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                  {/* node */}
                  <span aria-hidden className="absolute left-[7px] top-1.5 h-[18px] w-[18px] rounded-full md:left-1/2 md:-translate-x-1/2" style={{ background: C.bone, border: `3px solid ${TEMP_DOT[r.temp]}` }} />
                  <div className={`[direction:ltr] ${i % 2 ? "md:text-right" : ""}`}>
                    <div className={`flex items-center gap-3 ${i % 2 ? "md:justify-end" : ""}`}>
                      <span className="font-['Spectral'] text-[3.2rem] font-light leading-none" style={{ color: TEMP_DOT[r.temp] }}>{r.n}</span>
                      <ThermalTag temp={r.temp} />
                    </div>
                    <h2 className="mt-3 font-['Spectral'] text-[1.9rem] font-medium">{r.label}</h2>
                    <p className="mt-1 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.16em]" style={{ color: C.inkSoft }}>{r.time}</p>
                    <p className="mt-3 max-w-sm font-['Hanken_Grotesk'] text-[15.5px] leading-[1.65] md:inline-block" style={{ color: C.inkSoft }}>{r.text}</p>
                  </div>
                  <div className="[direction:ltr]" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <p className="mt-12 pl-12 font-['Spectral'] text-[1.3rem] italic md:pl-0 md:text-center" style={{ color: C.emberText }}>
            Then begin again. Most people manage three; nobody is counting.
          </p>
        </Reveal>
      </Section>

      {/* etiquette */}
      <div style={{ background: C.char }}>
        <Section className="py-20 md:py-24">
          <Reveal>
            <Kicker cold>House manners</Kicker>
            <h2 className="mt-5 max-w-xl font-['Spectral'] text-[clamp(1.8rem,3.6vw,2.6rem)] font-medium leading-[1.1]" style={{ color: C.bone }}>
              A few small courtesies keep the water clear.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2" style={{ background: "rgba(244,238,228,0.1)" }}>
            {ETIQUETTE.map((e, i) => (
              <Reveal key={e.t} delay={i * 0.06}>
                <div className="h-full p-7" style={{ background: C.char }}>
                  <span className="font-['IBM_Plex_Mono'] text-[12px]" style={{ color: C.emberOnDark }}>0{i + 1}</span>
                  <h3 className="mt-3 font-['Spectral'] text-[1.35rem] font-medium" style={{ color: C.bone }}>{e.t}</h3>
                  <p className="mt-2 font-['Hanken_Grotesk'] text-[14.5px] leading-[1.6]" style={{ color: "rgba(244,238,228,0.7)" }}>{e.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12">
              <Magnetic strength={0.35}>
                <Link to={`${base}/booking`} className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-transform duration-200" style={{ background: C.emberOnDark, color: C.char }}>
                  Book your first cycle <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </Section>
      </div>
    </div>
  )
}
