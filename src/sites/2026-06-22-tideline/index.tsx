import { motion } from "framer-motion"
import { Anchor, Waves, Navigation, Wind, ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spotlight } from "@/components/fx/Spotlight"
import { TiltCard } from "@/components/fx/TiltCard"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"

export const meta: SiteMeta = {
  title: "Tideline — Marine charts for NZ waters",
  description: "Landing page for a recreational marine-charting app. Deep navy palette, animated depth contours, cursor-reactive hero.",
  date: "2026-06-22",
  type: "SaaS landing",
  interaction: "Cursor spotlight + 3D tilt + magnetic CTA",
}

const features = [
  { icon: Waves, title: "Live depth contours", body: "Sounder data and LINZ soundings layered into a chart you can actually read at a glance." },
  { icon: Wind, title: "Wind & tide overlay", body: "Swell, gust and tide windows for the next 48 hours, pinned to where you're heading." },
  { icon: Navigation, title: "Routes that remember", body: "Drop a track once. Tideline keeps your favourite passages and warns on hazards ahead." },
]

export default function Tideline() {
  return (
    <div className="min-h-screen bg-[#04111f] text-slate-100 antialiased">
      {/* Hero */}
      <Spotlight color="rgba(56,189,248,0.18)" size={500} className="relative">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent 0 38px, rgba(56,189,248,0.08) 38px 39px)",
          }}
        />
        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Anchor className="h-5 w-5 text-sky-400" /> Tideline
          </div>
          <nav className="hidden gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition-colors hover:text-sky-300">Charts</a>
            <a href="#features" className="transition-colors hover:text-sky-300">Weather</a>
            <a href="#features" className="transition-colors hover:text-sky-300">Pricing</a>
          </nav>
          <Button variant="outline" className="border-sky-400/30 bg-transparent text-slate-100 hover:bg-sky-400/10 hover:text-white">
            Sign in
          </Button>
        </header>

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <Badge variant="outline" className="mb-6 border-sky-400/30 text-sky-300">
              <MapPin className="mr-1 h-3 w-3" /> Charted for Aotearoa
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
            >
              Know the water<br />
              <span className="text-sky-400">before you're on it.</span>
            </motion.h1>
            <p className="mt-6 max-w-md text-lg text-slate-300">
              Tideline turns official soundings, swell and tide into one calm, readable chart — built for the
              weekend skipper, not the bridge of a container ship.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Button size="lg" className="bg-sky-500 text-[#04111f] hover:bg-sky-400">
                  Start charting <ArrowRight className="h-4 w-4" />
                </Button>
              </Magnetic>
              <span className="text-sm text-slate-400">Free for your first 3 passages</span>
            </div>
          </div>

          <TiltCard className="rounded-2xl">
            <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-[#0a2540] to-[#04111f] p-1 shadow-2xl shadow-sky-500/10">
              <div className="rounded-xl bg-[#061a2e] p-6" style={{ transform: "translateZ(40px)" }}>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Hauraki Gulf</span>
                  <span className="text-sky-300">Tide ▲ 2.4m</span>
                </div>
                <div className="relative mt-4 h-44 overflow-hidden rounded-lg bg-[#04111f]">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute left-0 right-0 border-t border-dashed border-sky-400/30"
                      style={{ top: `${20 + i * 26}%` }}
                      animate={{ x: ["-4%", "4%", "-4%"] }}
                      transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                  <div className="absolute bottom-3 left-3 rounded-md bg-sky-500/90 px-2 py-1 text-xs font-medium text-[#04111f]">
                    You · 4.1kn
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  {[["Depth", "12.3m"], ["Wind", "14kn SW"], ["ETA", "31 min"]].map(([k, v]) => (
                    <div key={k} className="rounded-md bg-white/5 py-2">
                      <div className="text-slate-400">{k}</div>
                      <div className="font-semibold text-slate-100">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </Spotlight>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
            Everything you'd check before leaving the marina, on one screen.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.12}>
              <Spotlight color="rgba(56,189,248,0.1)" className="group h-full rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-sky-400/30">
                <f.icon className="h-7 w-7 text-sky-400 transition-transform duration-300 group-hover:-translate-y-1" />
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{f.body}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-slate-500">
        Tideline is a planning aid, not an official navigation product. Always carry certified charts.
      </footer>
    </div>
  )
}
