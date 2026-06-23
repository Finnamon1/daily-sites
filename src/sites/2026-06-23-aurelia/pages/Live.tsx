import { MapPin } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { DATES } from "../components/data"

function statusStyle(status: string) {
  if (status === "Sold out") return "text-[#7e8590] line-through"
  if (status === "Few left") return "text-[#e8b15c]"
  return "text-[#9aa1ad]"
}

export function Live() {
  return (
    <div className="px-6 pb-28 pt-16">
      <div className="mx-auto max-w-5xl">
        {/* header with a duotone hall photo */}
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <Reveal>
            <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.24em] text-[#e8b15c]">
              Aurelia live · Autumn 2026
            </span>
            <h1 className="mt-4 font-['Bricolage_Grotesque'] text-6xl font-bold tracking-[-0.02em] sm:text-7xl">
              Seven rooms,
              <br />
              one piano.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#9aa1ad]">
              Sól performs the album in full with a string trio — concert halls only, no support, no
              talking between pieces. Doors at 19:30.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08]">
              <img
                src="https://picsum.photos/seed/aurelia-concert-hall-organ/720/540"
                alt="The empty interior of a candlelit concert hall before a performance"
                width={720}
                height={540}
                loading="lazy"
                className="h-full w-full object-cover opacity-80 [filter:grayscale(1)_contrast(1.05)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-color"
                style={{ background: "linear-gradient(150deg, #e8b15c, #2b3a3f 80%)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* dates */}
        <div className="mt-16 border-t border-white/[0.07]">
          {DATES.map((d, i) => {
            const soldOut = d.status === "Sold out"
            return (
              <Reveal key={d.city} delay={Math.min(i * 0.05, 0.35)}>
                <div className="group grid grid-cols-[3.2rem_1fr] items-center gap-4 border-b border-white/[0.07] py-6 transition-colors duration-200 hover:bg-white/[0.02] sm:grid-cols-[4.5rem_1fr_auto] sm:gap-8">
                  <div className="font-['IBM_Plex_Mono'] text-sm leading-tight text-[#e8b15c] sm:text-base">
                    {d.date}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2.5">
                      <h3 className="truncate font-['Bricolage_Grotesque'] text-xl font-semibold sm:text-2xl">
                        {d.city}
                      </h3>
                      <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#7e8590]">
                        {d.country}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#9aa1ad]">
                      <MapPin className="h-3.5 w-3.5 text-[#7e8590]" />
                      {d.venue}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center justify-between gap-5 sm:col-span-1 sm:justify-end">
                    <span
                      className={`font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em] ${statusStyle(
                        d.status,
                      )}`}
                    >
                      {d.status}
                    </span>
                    {soldOut ? (
                      <span className="rounded-full border border-white/[0.08] px-5 py-2 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.14em] text-[#7e8590]">
                        Waitlist
                      </span>
                    ) : (
                      <Magnetic strength={0.45}>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="inline-block rounded-full border border-[#e8b15c]/40 px-5 py-2 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.14em] text-[#e8b15c] transition-colors duration-200 hover:bg-[#e8b15c] hover:text-[#0a0b10]"
                        >
                          Tickets
                        </a>
                      </Magnetic>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <p className="mt-10 max-w-xl font-['IBM_Plex_Mono'] text-[12px] leading-relaxed tracking-[0.04em] text-[#7e8590]">
            More dates across Japan and Australia in early 2027. Join the list for first access —
            we hold a small allocation back for the people who heard it first.
          </p>
        </Reveal>
      </div>
    </div>
  )
}
