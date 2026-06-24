import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, Check } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { C, ScentField, Kicker } from "../lib"

const HOURS = [
  ["Wednesday", "14:00 – 19:00 · open atelier"],
  ["Thursday – Saturday", "11:00 – 19:00"],
  ["Sunday – Tuesday", "By appointment"],
]

export function Visit() {
  const [sent, setSent] = useState(false)

  return (
    <div style={{ background: C.bone }}>
      <header className="border-b px-6 pt-20 pb-14" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-6xl">
          <Kicker>Visit · order · ask</Kicker>
          <h1 className="mt-4 max-w-3xl font-['Cormorant_Garamond'] text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02]" style={{ color: C.ink }}>
            Come and smell before you choose.
          </h1>
          <p className="mt-5 max-w-xl font-['Hanken_Grotesk'] text-[17px] leading-[1.75]" style={{ color: "rgba(23,18,14,0.78)" }}>
            The bench is open every Wednesday afternoon. Or send a note and
            we&apos;ll post a discovery set anywhere in the EU.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_1.05fr]">
        {/* info column */}
        <div className="space-y-8">
          <ScentField
            className="rounded-2xl"
            style={{ background: C.ink }}
            tone="rgba(226,164,75,0.4)"
          >
            <div className="px-8 py-10">
              <MapPin className="h-6 w-6" style={{ color: C.amberLit }} />
              <h2 className="mt-4 font-['Cormorant_Garamond'] text-3xl" style={{ color: C.bone }}>
                The atelier
              </h2>
              <p className="mt-3 font-['Hanken_Grotesk'] text-[16px] leading-[1.7]" style={{ color: "rgba(242,235,223,0.82)" }}>
                14 rue de la Folie-Méricourt
                <br />
                75011 Paris, France
              </p>
              <p className="mt-4 font-['IBM_Plex_Mono'] text-[13px]" style={{ color: "rgba(242,235,223,0.7)" }}>
                bonjour@seve-parfums.fr
              </p>
            </div>
          </ScentField>

          <div className="rounded-2xl border px-8 py-8" style={{ borderColor: C.line, background: C.boneDeep }}>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: C.amber }} />
              <Kicker>Opening hours</Kicker>
            </div>
            <dl className="mt-5 divide-y" style={{ borderColor: C.line }}>
              {HOURS.map(([d, h]) => (
                <div key={d} className="flex items-baseline justify-between gap-4 py-3" style={{ borderColor: C.line }}>
                  <dt className="font-['Hanken_Grotesk'] text-[15px] font-semibold" style={{ color: C.ink }}>
                    {d}
                  </dt>
                  <dd className="text-right font-['Hanken_Grotesk'] text-[14px]" style={{ color: "rgba(23,18,14,0.78)" }}>
                    {h}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* form */}
        <div className="rounded-2xl border px-8 py-10 md:px-10" style={{ borderColor: C.line }}>
          <Kicker>Send a note</Kicker>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-3xl" style={{ color: C.ink }}>
            We reply by hand.
          </h2>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex flex-col items-start gap-3 rounded-xl px-6 py-8"
              style={{ background: "rgba(196,126,43,0.1)" }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: C.amberFill, color: C.ink }}>
                <Check className="h-5 w-5" />
              </span>
              <p className="font-['Cormorant_Garamond'] text-2xl" style={{ color: C.ink }}>
                Merci — your note is on its way.
              </p>
              <p className="font-['Hanken_Grotesk'] text-[15px]" style={{ color: "rgba(23,18,14,0.78)" }}>
                Camille usually answers within two days.
              </p>
            </motion.div>
          ) : (
            <form
              className="mt-7 space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <Field label="Your name">
                <input
                  required
                  type="text"
                  placeholder="Camille Roux"
                  className="w-full rounded-lg border bg-transparent px-4 py-3 font-['Hanken_Grotesk'] text-[15px] outline-none transition-colors duration-200 focus:border-[color:var(--amber)]"
                  style={{ borderColor: C.line, color: C.ink, ["--amber" as string]: C.amber }}
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border bg-transparent px-4 py-3 font-['Hanken_Grotesk'] text-[15px] outline-none transition-colors duration-200 focus:border-[color:var(--amber)]"
                  style={{ borderColor: C.line, color: C.ink, ["--amber" as string]: C.amber }}
                />
              </Field>
              <Field label="What can we send you?">
                <textarea
                  rows={4}
                  placeholder="I'd love a discovery set, and a Wednesday slot in July…"
                  className="w-full resize-none rounded-lg border bg-transparent px-4 py-3 font-['Hanken_Grotesk'] text-[15px] outline-none transition-colors duration-200 focus:border-[color:var(--amber)]"
                  style={{ borderColor: C.line, color: C.ink, ["--amber" as string]: C.amber }}
                />
              </Field>
              <Magnetic strength={0.3}>
                <button
                  type="submit"
                  className="w-full rounded-full px-7 py-3.5 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-colors duration-200"
                  style={{ background: C.ink, color: C.bone }}
                >
                  Send note
                </button>
              </Magnetic>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(23,18,14,0.72)" }}>
        {label}
      </span>
      {children}
    </label>
  )
}
