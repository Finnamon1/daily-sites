import { useState } from "react"
import { MapPin, Thermometer, Car, Wine } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"
import { Up, body, display, mono } from "../shared"

const PRACTICAL = [
  {
    icon: Car,
    title: "Getting here",
    text: "90 minutes from Antofagasta airport on the Ruta 5. A graded gravel road climbs the last 12 km — any car manages it dry. We run a shuttle from town on program nights.",
  },
  {
    icon: Thermometer,
    title: "Dress for the desert",
    text: "It can be 28°C at sunset and below freezing by midnight. Bring far more layers than you think, a wool hat, and closed shoes. We lend heavy parkas at the door.",
  },
  {
    icon: Wine,
    title: "The ridge café",
    text: "Open before every program: Atacama-grown coffee, hot empanadas and a short list of Chilean wine. Red-light only inside, to protect everyone's night vision.",
  },
]

const FAQ = [
  {
    q: "Do I need to know anything about astronomy?",
    a: "Not a thing. Programs are built for first-timers as much as for seasoned observers — our guides meet you wherever you are and never make you feel behind.",
  },
  {
    q: "What happens if it clouds over?",
    a: "The Atacama is clear about 320 nights a year, but if cloud wins we move you into the planetarium dome and offer a free pass for any future night. You never pay for a sky you didn't get.",
  },
  {
    q: "Can I bring my children?",
    a: "Yes — the Naked-Eye Hour and Dome Sessions are wonderful for ages six and up. Late deep-sky workshops run past midnight, so we suggest those for older kids and adults.",
  },
  {
    q: "Is the site accessible?",
    a: "The dome, café and main viewing terrace are step-free and the refractor has a wheelchair-height eyepiece platform. Tell us your needs when booking and we'll prepare the night around them.",
  },
  {
    q: "How far ahead should I book?",
    a: "New-moon weekends sell out weeks in advance; mid-week nights are often available with a few days' notice. Gift passes can be redeemed for any open date within a year.",
  },
]

export function Visit() {
  const [sent, setSent] = useState(false)

  return (
    <div className="mx-auto max-w-6xl px-5 pt-36 pb-24">
      <Up>
        <p className={cn("text-[11px] uppercase tracking-[0.28em] text-[#f4b860]", mono)}>
          Plan your night
        </p>
        <h1 className={cn("mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.02] text-[#e9e4d8]", display)}>
          A long way from anywhere. That&apos;s the point.
        </h1>
      </Up>

      {/* hours + map band */}
      <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Up>
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <img
              src="https://picsum.photos/seed/atacama-observatory-road-ridge/1000/760"
              alt="The gravel road climbing toward the Vela observatory ridge at dusk"
              width={1000}
              height={760}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover [filter:saturate(0.82)_brightness(0.8)]"
            />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#070a12]/80 px-3.5 py-1.5 backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-[#f4b860]" />
              <span className={cn("text-[11px] uppercase tracking-[0.18em] text-[#e9e4d8]", mono)}>
                Cerro Vela · 24°37′ S
              </span>
            </div>
          </div>
        </Up>

        <Up delay={0.08}>
          <div className="h-full rounded-3xl border border-white/10 bg-[#0c1220]/60 p-8">
            <h3 className={cn("text-[11px] uppercase tracking-[0.24em] text-[#f4b860]", mono)}>
              Program nights
            </h3>
            <dl className="mt-5 space-y-3.5">
              {[
                ["Wed – Sun", "Gates 19:00, sky 21:30"],
                ["Monday", "Private bookings only"],
                ["Tuesday", "Closed (maintenance)"],
                ["Solar mornings", "Sat & Sun, 09:00"],
              ].map(([d, h]) => (
                <div key={d} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3">
                  <dt className={cn("text-sm text-[#e9e4d8]", body)}>{d}</dt>
                  <dd className={cn("text-sm text-[#97a0b2]", mono)}>{h}</dd>
                </div>
              ))}
            </dl>
            <p className={cn("mt-6 text-sm leading-relaxed text-[#aeb4c0]", body)}>
              Closed on full-moon weeks for the brightest deep-sky sessions to migrate
              to the new moon. Check the season calendar when you book.
            </p>
          </div>
        </Up>
      </div>

      {/* practical cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PRACTICAL.map((p, i) => (
          <Up key={p.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-white/10 bg-[#0c1220]/60 p-7">
              <p.icon className="h-6 w-6 text-[#f4b860]" strokeWidth={1.4} />
              <h3 className={cn("mt-4 text-lg text-[#e9e4d8]", display)}>{p.title}</h3>
              <p className={cn("mt-2 text-sm leading-relaxed text-[#aeb4c0]", body)}>{p.text}</p>
            </div>
          </Up>
        ))}
      </div>

      {/* FAQ + contact */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Up>
          <h2 className={cn("text-[clamp(1.6rem,3.4vw,2.6rem)] font-light text-[#e9e4d8]", display)}>
            Before you drive out
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className={cn("text-left text-base text-[#e9e4d8] hover:text-[#f4b860] hover:no-underline", body)}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className={cn("text-sm leading-relaxed text-[#aeb4c0]", body)}>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Up>

        <Up delay={0.1}>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#10182a] to-[#0a0e18] p-8">
            <h3 className={cn("text-xl text-[#e9e4d8]", display)}>Hold a private night</h3>
            <p className={cn("mt-2 text-sm leading-relaxed text-[#aeb4c0]", body)}>
              Weddings, research groups, school trips — tell us what you&apos;re
              dreaming of and we&apos;ll build the sky around it.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Name"
                  aria-label="Name"
                  className={cn(
                    "w-full rounded-lg border border-white/10 bg-[#070a12]/60 px-4 py-3 text-sm text-[#e9e4d8] placeholder:text-[#6f7888] focus:border-[#f4b860]/60 focus:outline-none",
                    body,
                  )}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  className={cn(
                    "w-full rounded-lg border border-white/10 bg-[#070a12]/60 px-4 py-3 text-sm text-[#e9e4d8] placeholder:text-[#6f7888] focus:border-[#f4b860]/60 focus:outline-none",
                    body,
                  )}
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="Tell us about your night"
                aria-label="Tell us about your night"
                className={cn(
                  "w-full resize-none rounded-lg border border-white/10 bg-[#070a12]/60 px-4 py-3 text-sm text-[#e9e4d8] placeholder:text-[#6f7888] focus:border-[#f4b860]/60 focus:outline-none",
                  body,
                )}
              />
              <Magnetic strength={0.3}>
                <button
                  type="submit"
                  className={cn(
                    "rounded-full bg-[#f4b860] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors duration-200 hover:bg-[#ffca78]",
                    body,
                  )}
                >
                  {sent ? "Thank you — we'll write back soon" : "Send enquiry"}
                </button>
              </Magnetic>
            </form>
          </div>
        </Up>
      </div>
    </div>
  )
}
