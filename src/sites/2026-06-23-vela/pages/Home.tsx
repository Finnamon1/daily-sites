import { useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Telescope, MoonStar, Camera, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Counter, Cta, Starfield, Up, body, display, mono } from "../shared"

const STATS = [
  { value: 2400, suffix: " m", label: "Elevation above sea" },
  { value: 320, suffix: "", label: "Clear nights / year" },
  { value: 7.5, decimals: 1, label: "Naked-eye limit (mag)" },
  { value: 1, prefix: "Class ", label: "Bortle dark-sky rating" },
]

const PILLARS = [
  {
    icon: Telescope,
    title: "Instruments, not screens",
    text: "View through a restored 1908 brass refractor and a 24-inch reflector. The photons hitting your retina left their source long before you were born.",
  },
  {
    icon: MoonStar,
    title: "A sky without compromise",
    text: "There is no town within ninety kilometres. On a moonless night the Milky Way casts a shadow and the Magellanic Clouds hang plainly overhead.",
  },
  {
    icon: Camera,
    title: "Bring something home",
    text: "Our astrophotography bench pairs your camera with tracked mounts and a guide. You leave with a calibrated frame of the southern sky, not a phone snap.",
  },
]

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const reduce = useReducedMotion()

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Starfield />
        </div>
        {/* gentle horizon glow, no purple gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 130%, rgba(244,184,96,0.16), transparent 60%)",
          }}
        />

        <div className="mx-auto grid min-h-[88vh] max-w-6xl items-center gap-10 px-5 pt-32 pb-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-[#f4b860]/30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#f4b860]",
                mono,
              )}
            >
              <Sparkles className="h-3.5 w-3.5" /> Atacama Desert · Chile
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: reduce ? 0 : 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className={cn(
                "mt-6 text-[clamp(2.6rem,6.5vw,5.2rem)] font-light leading-[0.98] tracking-tight text-[#e9e4d8]",
                display,
              )}
            >
              Stand under the
              <br />
              <span className="italic text-[#f4b860]">darkest sky</span> on Earth.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className={cn(
                "mt-7 max-w-md text-base leading-relaxed text-[#aeb4c0]",
                body,
              )}
            >
              Vela is a public observatory perched on a desert ridge where the air
              is thin, dry and perfectly still. Guided night programs run all year —
              move your cursor across the stars and trace your own constellation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Cta to={`${base}/programs`}>Book a night program</Cta>
              <Cta to={`${base}/sky`} variant="ghost">
                What&apos;s up tonight
              </Cta>
            </motion.div>
          </div>

          {/* coordinate readout card */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="relative ml-auto w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c1220]/70 p-6 backdrop-blur-sm"
          >
            <div className={cn("flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#97a0b2]", mono)}>
              <span>Live from the ridge</span>
              <span className="flex items-center gap-1.5 text-[#f4b860]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f4b860]" />
                Clear
              </span>
            </div>
            <dl className="mt-5 space-y-4">
              {[
                ["Seeing", "0.7″ — exceptional"],
                ["Humidity", "9%"],
                ["Wind", "6 km/h, NW"],
                ["Moon", "Waning crescent, 14%"],
                ["Next program", "Tonight · 21:30"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2.5">
                  <dt className={cn("text-xs uppercase tracking-[0.16em] text-[#7f8798]", mono)}>{k}</dt>
                  <dd className={cn("text-sm text-[#e9e4d8]", body)}>{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="border-y border-white/10 bg-[#0a0e18]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          {STATS.map((s, i) => (
            <Up key={s.label} delay={i * 0.07} className="bg-[#0a0e18] px-6 py-10">
              <div className={cn("text-[2.4rem] font-light leading-none text-[#f4b860]", display)}>
                <Counter
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </div>
              <div className={cn("mt-3 text-xs uppercase tracking-[0.16em] text-[#97a0b2]", mono)}>
                {s.label}
              </div>
            </Up>
          ))}
        </div>
      </section>

      {/* ---------------- PILLARS ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Up className="max-w-2xl">
          <h2 className={cn("text-[clamp(1.8rem,4vw,3rem)] font-light leading-tight text-[#e9e4d8]", display)}>
            Astronomy you can feel in your chest,
            <span className="text-[#97a0b2]"> not just read about.</span>
          </h2>
        </Up>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Up key={p.title} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-white/10 bg-[#0c1220]/60 p-7 transition-colors duration-300 hover:border-[#f4b860]/40">
                <p.icon className="h-7 w-7 text-[#f4b860]" strokeWidth={1.4} />
                <h3 className={cn("mt-5 text-xl text-[#e9e4d8]", display)}>{p.title}</h3>
                <p className={cn("mt-3 text-sm leading-relaxed text-[#aeb4c0]", body)}>{p.text}</p>
              </div>
            </Up>
          ))}
        </div>
      </section>

      {/* ---------------- IMAGE BAND ---------------- */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Up>
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <img
              src="https://picsum.photos/seed/atacama-desert-night-ridge/1600/720"
              alt="The observatory dome silhouetted against a star-dense desert sky"
              width={1600}
              height={720}
              loading="lazy"
              className="aspect-[16/8] w-full object-cover [filter:saturate(0.8)_contrast(1.05)_brightness(0.82)]"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(7,10,18,0.1) 0%, rgba(7,10,18,0.78) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
              <p className={cn("max-w-xl text-[clamp(1.3rem,2.6vw,2rem)] font-light leading-snug text-[#e9e4d8]", display)}>
                &ldquo;I have shown people the rings of Saturn for thirty years.
                They still gasp every single time.&rdquo;
              </p>
              <p className={cn("mt-4 text-xs uppercase tracking-[0.2em] text-[#f4b860]", mono)}>
                Dr. Renata Solís — founding astronomer
              </p>
            </div>
          </div>
        </Up>
      </section>
    </div>
  )
}
