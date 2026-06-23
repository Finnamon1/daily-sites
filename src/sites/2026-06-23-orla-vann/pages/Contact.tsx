import { useState } from "react"
import { Check } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { Kicker, Label } from "../shared"
import { Page } from "./Page"

const DESKS = [
  { k: "Booking", who: "Lila Frost", mail: "live@phosphor.fm" },
  { k: "Sync & licensing", who: "Phosphor Publishing", mail: "sync@phosphor.fm" },
  { k: "Press & interviews", who: "Mara Nyborg", mail: "words@phosphor.fm" },
]

export function Contact() {
  const [reason, setReason] = useState("Booking")
  const [sent, setSent] = useState(false)

  return (
    <Page>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <Kicker>Get in touch</Kicker>
              <h1 className="mt-5 font-['Bricolage_Grotesque'] text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">
                Say the word.
              </h1>
              <p className="mt-5 max-w-md font-['Hanken_Grotesk'] leading-relaxed text-[#e9ebe6]/65">
                Bookings, sync requests, interviews, or just a kind note about a
                track that got you through a long night — all of it lands here.
              </p>
            </Reveal>

            <div className="mt-10 space-y-4">
              {DESKS.map((d, i) => (
                <Reveal key={d.k} delay={i * 0.07}>
                  <div className="rounded-xl border border-white/10 bg-[#10131a] p-5">
                    <Label className="text-[#c5f24c]">{d.k}</Label>
                    <p className="mt-2 font-['Hanken_Grotesk'] text-[#e9ebe6]/85">
                      {d.who}
                    </p>
                    <a
                      href={`mailto:${d.mail}`}
                      className="font-['JetBrains_Mono'] text-sm text-[#e9ebe6]/55 underline-offset-4 transition-colors hover:text-[#c5f24c] hover:underline"
                    >
                      {d.mail}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="rounded-2xl border border-white/10 bg-[#10131a] p-6 sm:p-8"
            >
              <Label className="text-[#e9ebe6]/45">I'm writing about</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Booking", "Sync", "Press", "Other"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`rounded-full px-4 py-1.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] transition-colors ${
                      reason === r
                        ? "bg-[#c5f24c] text-[#0a0c10]"
                        : "border border-white/15 text-[#e9ebe6]/60 hover:text-[#e9ebe6]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-4">
                {[
                  { id: "name", label: "Name", type: "text", ph: "Your name" },
                  { id: "email", label: "Email", type: "email", ph: "you@email.com" },
                ].map((f) => (
                  <label key={f.id} className="block">
                    <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#e9ebe6]/50">
                      {f.label}
                    </span>
                    <input
                      type={f.type}
                      required
                      placeholder={f.ph}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-[#0a0c10] px-4 py-2.5 font-['Hanken_Grotesk'] text-sm outline-none transition-colors placeholder:text-[#e9ebe6]/30 focus:border-[#c5f24c]"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#e9ebe6]/50">
                    Message
                  </span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about the room, the date, the idea…"
                    className="mt-2 w-full resize-none rounded-lg border border-white/15 bg-[#0a0c10] px-4 py-2.5 font-['Hanken_Grotesk'] text-sm outline-none transition-colors placeholder:text-[#e9ebe6]/30 focus:border-[#c5f24c]"
                  />
                </label>
              </div>

              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c5f24c] px-6 py-3 font-['JetBrains_Mono'] text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0a0c10] transition-transform duration-200 hover:scale-[1.03]"
                >
                  {sent ? (
                    <>
                      <Check className="h-4 w-4" /> Sent — talk soon
                    </>
                  ) : (
                    `Send ${reason.toLowerCase()} note`
                  )}
                </button>
              </Magnetic>
            </form>
          </Reveal>
        </div>
      </div>
    </Page>
  )
}
