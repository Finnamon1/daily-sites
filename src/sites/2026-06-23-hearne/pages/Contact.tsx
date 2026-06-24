import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Clock, MapPin, Phone } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { cn } from "@/lib/utils"
import { Eyebrow, body, display, mono } from "../shared"

const PROJECT_TYPES = [
  "Restoration",
  "Extension",
  "Conversion",
  "Kitchen / bath",
  "Not sure yet",
]

export function Contact() {
  const [sent, setSent] = useState(false)
  const [type, setType] = useState(PROJECT_TYPES[0])

  return (
    <div className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
        {/* left: pitch + details */}
        <div>
          <Reveal>
            <Eyebrow>Start a project</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1
              className={cn(
                "mt-5 text-balance text-4xl font-light leading-[1.02] tracking-tight text-[#211d18] sm:text-6xl",
                display,
              )}
            >
              Tell us about the house.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className={cn(
                "mt-6 max-w-md text-[17px] leading-relaxed text-[#6c6358]",
                body,
              )}
            >
              The more you can tell us — the era, the suburb, what's driving you
              mad about it — the better the first conversation. We read every
              note ourselves and reply within two working days.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <dl className="mt-10 space-y-5">
              <Detail icon={MapPin} label="Studio">
                14 Weston Street, Brunswick VIC 3056
              </Detail>
              <Detail icon={Phone} label="Phone">
                +61 3 9388 0042
              </Detail>
              <Detail icon={Clock} label="Hours">
                Mon–Fri, 8am–5pm · site visits by appointment
              </Detail>
            </dl>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 overflow-hidden rounded-[4px] ring-1 ring-[#211d18]/10">
              <img
                src="https://picsum.photos/seed/hearne-brunswick-street/1000/520"
                alt="A leafy Brunswick street of double-fronted Victorian terraces"
                loading="lazy"
                className="aspect-[2/1] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* right: form */}
        <Reveal delay={0.1}>
          <div className="rounded-[6px] border border-[#211d18]/12 bg-[#ece4d6]/70 p-6 sm:p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#b14a2f] text-[#f4efe6]">
                  <Check className="h-7 w-7" />
                </span>
                <h2 className={cn("mt-6 text-2xl text-[#211d18]", display)}>
                  Thanks — it's landed.
                </h2>
                <p
                  className={cn(
                    "mt-2 max-w-xs text-[15px] leading-relaxed text-[#6c6358]",
                    body,
                  )}
                >
                  Mara or Daniel will be in touch within two working days. If
                  it's urgent, give the studio a call.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className={cn(
                    "mt-6 text-[12px] uppercase tracking-[0.16em] text-[#b14a2f] underline-offset-4 hover:underline",
                    mono,
                  )}
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="space-y-5"
              >
                <Field label="Your name">
                  <input
                    required
                    type="text"
                    placeholder="Priya Anand"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    placeholder="you@email.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Suburb of the property">
                  <input
                    type="text"
                    placeholder="Fitzroy North"
                    className={inputCls}
                  />
                </Field>

                <div>
                  <span
                    className={cn(
                      "mb-2 block text-[11px] uppercase tracking-[0.16em] text-[#211d18]",
                      mono,
                    )}
                  >
                    Project type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cn(
                          "rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-200",
                          body,
                          type === t
                            ? "bg-[#211d18] text-[#f4efe6]"
                            : "text-[#6c6358] ring-1 ring-[#211d18]/15 hover:ring-[#211d18]/40",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="A bit about it">
                  <textarea
                    rows={4}
                    placeholder="1890s double-fronted Victorian. Front rooms are lovely, the back is a dark 90s lean-to we'd love to open up…"
                    className={cn(inputCls, "resize-none")}
                  />
                </Field>

                <Magnetic strength={0.3}>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#211d18] px-6 py-3.5 text-sm font-medium text-[#f4efe6] transition-colors duration-200 hover:bg-[#b14a2f]"
                  >
                    Send enquiry
                  </button>
                </Magnetic>
                <p
                  className={cn(
                    "text-center text-[12px] text-[#6c6358]",
                    body,
                  )}
                >
                  No newsletters, no spam — just a reply from a person.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
      <div className="h-24" />
    </div>
  )
}

const inputCls = cn(
  "w-full rounded-[4px] border border-[#211d18]/15 bg-[#f4efe6] px-4 py-3 text-[15px] text-[#211d18] outline-none transition-colors duration-200 placeholder:text-[#6c6358]/60 focus:border-[#b14a2f] focus:ring-2 focus:ring-[#b14a2f]/20",
  body,
)

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span
        className={cn(
          "mb-2 block text-[11px] uppercase tracking-[0.16em] text-[#211d18]",
          mono,
        )}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#b14a2f]" strokeWidth={1.6} />
      <div>
        <dt
          className={cn(
            "text-[11px] uppercase tracking-[0.16em] text-[#6c6358]",
            mono,
          )}
        >
          {label}
        </dt>
        <dd className={cn("mt-0.5 text-[15px] text-[#211d18]", body)}>
          {children}
        </dd>
      </div>
    </div>
  )
}
