import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, Mail, MapPin } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import { faqs } from "../data"

export function Contact() {
  const [sent, setSent] = useState(false)
  const [reason, setReason] = useState("A mixed case")
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="px-6 pb-24 pt-14 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#B23A10]">Say hello</p>
          <h1 className="mt-2 max-w-2xl font-['Syne'] text-5xl font-extrabold leading-[0.95] tracking-tight text-[#221C15] md:text-6xl">
            Order, stock, or just argue.
          </h1>
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-[1.05fr_0.95fr]">
          {/* form */}
          <Reveal>
            <div className="rounded-[28px] border border-[#221C15]/10 bg-white/55 p-7 md:p-9">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex min-h-[360px] flex-col items-center justify-center text-center"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-[#5AA63F] text-white">
                      <Check className="h-7 w-7" strokeWidth={2.5} />
                    </span>
                    <h2 className="mt-5 font-['Fraunces'] text-2xl font-semibold text-[#221C15]">
                      On its way to the bench.
                    </h2>
                    <p className="mt-2 max-w-xs text-[#5A4F40]">
                      We read every message ourselves, usually within a day. Mind the
                      fizz.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 font-semibold text-[#B23A10] underline underline-offset-2"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSent(true)
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="mb-2 block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#5A4F40]">
                        I'm after
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["A mixed case", "Stocking Pulp", "Something else"].map((r) => (
                          <button
                            type="button"
                            key={r}
                            onClick={() => setReason(r)}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                              reason === r
                                ? "border-transparent bg-[#E8511D] text-[#FCEAD9]"
                                : "border-[#221C15]/20 text-[#221C15] hover:border-[#221C15]/50"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Field label="Name" id="name">
                      <input id="name" required className={inputCls} placeholder="Your name" />
                    </Field>
                    <Field label="Email" id="email">
                      <input id="email" type="email" required className={inputCls} placeholder="you@example.com" />
                    </Field>
                    <Field label="Message" id="msg">
                      <textarea
                        id="msg"
                        required
                        rows={4}
                        className={`${inputCls} resize-none`}
                        placeholder={
                          reason === "Stocking Pulp"
                            ? "Tell us about your place…"
                            : "What can we get you?"
                        }
                      />
                    </Field>

                    <Magnetic strength={0.25}>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-[#221C15] px-6 py-3.5 text-[15px] font-semibold text-[#F7F1E3] transition-colors duration-200 hover:bg-[#E8511D]"
                      >
                        Send it
                      </button>
                    </Magnetic>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* details + faq */}
          <Reveal delay={0.1}>
            <div className="space-y-3">
              <a
                href="mailto:hello@drinkpulp.co"
                className="flex items-center gap-3 rounded-2xl border border-[#221C15]/10 bg-white/40 px-5 py-4 text-[#221C15] transition-colors duration-200 hover:border-[#E8511D]"
              >
                <Mail className="h-5 w-5 text-[#E8511D]" />
                <span className="font-semibold">hello@drinkpulp.co</span>
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-[#221C15]/10 bg-white/40 px-5 py-4 text-[#221C15]">
                <MapPin className="h-5 w-5 text-[#E8511D]" />
                <span>Arch 47, Bermondsey, London SE1</span>
              </div>
            </div>

            <h2 className="mt-9 font-['Fraunces'] text-2xl font-semibold text-[#221C15]">Before you ask</h2>
            <div className="mt-4 divide-y divide-[#221C15]/10 border-y border-[#221C15]/10">
              {faqs.map((f, i) => (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="font-semibold text-[#221C15]">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#B23A10] transition-transform duration-300 ${
                        open === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-8 leading-relaxed text-[#5A4F40]">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-[#221C15]/15 bg-white/70 px-4 py-3 text-[15px] text-[#221C15] outline-none transition-colors duration-200 placeholder:text-[#8A7F6E] focus:border-[#E8511D]"

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#5A4F40]"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
