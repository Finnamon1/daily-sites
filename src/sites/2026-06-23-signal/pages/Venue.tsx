import { MapPin, Train, Accessibility, Volume2 } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"

const notes = [
  {
    icon: Train,
    title: "Getting there",
    body: "Metro to Rato (yellow line), then a four-minute walk uphill. We'll have lamps marking the door from 15:30.",
  },
  {
    icon: Accessibility,
    title: "Access",
    body: "The cistern has step-free entry via the side ramp on Rua das Amoreiras. Email us ahead and we'll meet you there.",
  },
  {
    icon: Volume2,
    title: "Sound & light",
    body: "Long natural reverb, low light, occasional strobe during the closing set. Earplugs are free at the water bar.",
  },
]

export function Venue() {
  return (
    <div>
      {/* hero image band */}
      <section className="relative">
        <div className="relative h-[44vh] min-h-[320px] overflow-hidden">
          <img
            src="https://picsum.photos/seed/cistern-arches-stone-water/1600/900"
            alt="The vaulted stone interior of the Mãe d'Água cistern, arches reflected in a shallow pool of water"
            loading="lazy"
            width={1600}
            height={900}
            className="h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-[#0a0b0e]/55 mix-blend-multiply" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-[#0a0b0e]/40" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="mx-auto max-w-6xl px-6 pb-10">
              <p className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.3em] text-[#c8f135]">
                <MapPin className="mr-1 inline h-3.5 w-3.5" />
                Praça das Amoreiras, Lisbon
              </p>
              <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold tracking-tight md:text-6xl">
                The Mãe d'Água Cistern
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-[#cfd3ca]">
                Built in 1834 to hold the city's drinking water, the cistern is a single low room of stone
                arches standing in a shallow reflecting pool. It was never meant for music, which is exactly
                why it sounds the way it does — every note hangs for a second and a half before it lets go.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-[#a3a8a0]">
                We keep the water. We keep the dark. Visuals are projected onto the far wall and reflected back
                up off the pool, so the whole room becomes the screen. Bring shoes you don't mind getting a
                little damp.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {notes.map((n, i) => (
                <Reveal key={n.title} delay={0.15 + i * 0.08}>
                  <div className="rounded-xl border border-white/10 bg-[#0d0e12] p-5">
                    <n.icon className="h-5 w-5 text-[#c8f135]" />
                    <h3 className="mt-3 font-['Space_Grotesk'] font-semibold">{n.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#a3a8a0]">{n.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <TiltCard className="rounded-2xl" max={8}>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e12]">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://picsum.photos/seed/lisbon-night-street-lamp/700/700"
                    alt="A quiet Lisbon street at night, lamplight on wet cobblestones near the venue"
                    loading="lazy"
                    width={700}
                    height={700}
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[#c8f135]/10 mix-blend-overlay" />
                </div>
                <div className="space-y-3 p-6 font-['JetBrains_Mono'] text-sm text-[#cfd3ca]">
                  <Row k="Doors" v="16:00" />
                  <Row k="Last entry" v="20:30" />
                  <Row k="Curfew" v="01:00" />
                  <Row k="Capacity" v="220" />
                  <Row k="Age" v="18+" />
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="uppercase tracking-wider text-[#8b9087]">{k}</span>
      <span className="text-[#c8f135]">{v}</span>
    </div>
  )
}
