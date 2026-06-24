import { useParams } from "react-router-dom"
import { Clock, Users, Moon } from "lucide-react"
import { TiltCard } from "@/components/fx/TiltCard"
import { cn } from "@/lib/utils"
import { Cta, Up, body, display, mono } from "../shared"

const PROGRAMS = [
  {
    name: "The Naked-Eye Hour",
    tag: "No equipment",
    price: "$32",
    duration: "60 min",
    group: "Up to 20",
    moon: "Any phase",
    blurb:
      "A guided walk through the southern sky with nothing between you and the stars. We name the constellations as the Atacameño people named them, then let your eyes adapt until the Milky Way resolves into dust lanes.",
    seed: "milky-way-southern-sky-naked-eye",
  },
  {
    name: "Through the Great Refractor",
    tag: "Flagship",
    price: "$68",
    duration: "90 min",
    group: "Up to 8",
    moon: "Best when dark",
    blurb:
      "Time at the eyepiece of our 1908 brass refractor and the 24-inch reflector beside it. Saturn, the Jewel Box, Omega Centauri — whatever the season offers, framed by a guide who knows where everything hides.",
    seed: "brass-telescope-refractor-eyepiece",
    featured: true,
  },
  {
    name: "Long Exposure",
    tag: "Workshop",
    price: "$140",
    duration: "3 hrs",
    group: "Up to 6",
    moon: "New moon only",
    blurb:
      "A hands-on astrophotography bench. Mount your own camera on a tracked equatorial, dial in the Magellanic Clouds, and stack frames with a guide. You leave with calibrated, editable RAW files.",
    seed: "astrophotography-long-exposure-stars",
  },
  {
    name: "Dome Sessions",
    tag: "All ages",
    price: "$24",
    duration: "45 min",
    group: "Up to 30",
    moon: "Indoor",
    blurb:
      "Reclined under our planetarium dome for the nights when cloud rolls in — rare, but it happens. A narrated tour of deep space that ends with the real sky if it clears.",
    seed: "planetarium-dome-interior-projection",
  },
  {
    name: "Sunrise & Solar",
    tag: "Daytime",
    price: "$28",
    duration: "50 min",
    group: "Up to 16",
    moon: "Morning",
    blurb:
      "Our hydrogen-alpha solar scope turns the Sun into a living thing — prominences arc off the limb and sunspots crawl across the disc. Coffee from the ridge café included.",
    seed: "sun-solar-prominence-hydrogen-alpha",
  },
]

export function Programs() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div className="mx-auto max-w-6xl px-5 pt-36 pb-24">
      <Up>
        <p className={cn("text-[11px] uppercase tracking-[0.28em] text-[#f4b860]", mono)}>
          Night programs · 2026 season
        </p>
        <h1 className={cn("mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.02] text-[#e9e4d8]", display)}>
          Five ways to spend a night with the universe.
        </h1>
        <p className={cn("mt-6 max-w-xl text-base leading-relaxed text-[#aeb4c0]", body)}>
          Every program is led by a resident astronomer and capped small so there&apos;s
          real time at the eyepiece. Booking is essential — desert nights fill quickly.
        </p>
      </Up>

      <div className="mt-16 space-y-8">
        {PROGRAMS.map((p, i) => (
          <Up key={p.name} delay={(i % 2) * 0.08}>
            <article
              className={cn(
                "grid gap-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1220]/60 md:grid-cols-[0.9fr_1.1fr]",
                i % 2 === 1 && "md:[&>*:first-child]:order-2",
              )}
            >
              <div className="relative min-h-[220px] overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${p.seed}/900/700`}
                  alt={`${p.name} — ${p.tag.toLowerCase()} program at Vela`}
                  width={900}
                  height={700}
                  loading="lazy"
                  className="h-full w-full object-cover [filter:saturate(0.8)_brightness(0.78)]"
                />
                <span
                  className={cn(
                    "absolute left-4 top-4 rounded-full bg-[#070a12]/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f4b860] backdrop-blur",
                    mono,
                  )}
                >
                  {p.tag}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-6 p-8 md:p-10">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className={cn("text-2xl text-[#e9e4d8] md:text-3xl", display)}>{p.name}</h2>
                    <span className={cn("shrink-0 text-2xl font-light text-[#f4b860]", display)}>
                      {p.price}
                    </span>
                  </div>
                  <p className={cn("mt-4 text-sm leading-relaxed text-[#aeb4c0]", body)}>{p.blurb}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5">
                  <span className={cn("flex items-center gap-2 text-xs text-[#97a0b2]", mono)}>
                    <Clock className="h-3.5 w-3.5 text-[#f4b860]" /> {p.duration}
                  </span>
                  <span className={cn("flex items-center gap-2 text-xs text-[#97a0b2]", mono)}>
                    <Users className="h-3.5 w-3.5 text-[#f4b860]" /> {p.group}
                  </span>
                  <span className={cn("flex items-center gap-2 text-xs text-[#97a0b2]", mono)}>
                    <Moon className="h-3.5 w-3.5 text-[#f4b860]" /> {p.moon}
                  </span>
                </div>
              </div>
            </article>
          </Up>
        ))}
      </div>

      {/* gift card — featured TiltCard interaction */}
      <Up className="mt-20">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className={cn("text-[clamp(1.6rem,3.4vw,2.6rem)] font-light leading-tight text-[#e9e4d8]", display)}>
              Can&apos;t decide? Give the whole sky.
            </h2>
            <p className={cn("mt-4 max-w-md text-sm leading-relaxed text-[#aeb4c0]", body)}>
              A Vela gift pass covers any single program for two, valid for a full
              year. It arrives as a hand-numbered star chart of the night they redeem it.
            </p>
            <div className="mt-7">
              <Cta to={`${base}/visit`}>Buy a gift pass</Cta>
            </div>
          </div>
          <TiltCard className="mx-auto w-full max-w-sm" max={10}>
            <div className="relative overflow-hidden rounded-2xl border border-[#f4b860]/30 bg-gradient-to-br from-[#10182a] to-[#0a0e18] p-8">
              <div className={cn("flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#97a0b2]", mono)}>
                <span>Vela · Gift Pass</span>
                <span>No. 0427</span>
              </div>
              <div className={cn("mt-12 text-3xl font-light text-[#f4b860]", display)}>One night,</div>
              <div className={cn("text-3xl font-light text-[#e9e4d8]", display)}>under everything.</div>
              <div className={cn("mt-12 flex items-center justify-between text-[11px] text-[#7f8798]", mono)}>
                <span>Admit two</span>
                <span>Valid 12 months</span>
              </div>
            </div>
          </TiltCard>
        </div>
      </Up>
    </div>
  )
}
