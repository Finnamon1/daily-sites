import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Clock, CalendarDays } from "lucide-react"
import { C, SESSIONS } from "../theme"
import { Kicker, Section } from "../ui"
import { Magnetic } from "@/components/fx/Magnetic"

const STEPS = ["Session", "Date", "Time", "Confirm"]
const SLOTS = ["7:30", "9:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00"]
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface Day {
  idx: number
  weekday: string
  day: number
  month: string
  closed: boolean
  label: string
}

function useDays(): Day[] {
  return useMemo(() => {
    const out: Day[] = []
    const start = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      out.push({
        idx: i,
        weekday: WD[d.getDay()],
        day: d.getDate(),
        month: MO[d.getMonth()],
        closed: d.getDay() === 1, // closed Mondays
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${WD[d.getDay()]} ${d.getDate()}`,
      })
    }
    return out
  }, [])
}

export function Booking() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  const days = useDays()

  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [dayIdx, setDayIdx] = useState<number | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [guests, setGuests] = useState(1)
  const [done, setDone] = useState(false)

  const session = SESSIONS.find((s) => s.id === sessionId) ?? null
  const day = dayIdx != null ? days[dayIdx] : null
  const total = session ? session.price * guests : 0

  const canAdvance = [sessionId != null, dayIdx != null, time != null, true][step]

  function go(next: number) {
    setDir(next > step ? 1 : -1)
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)))
  }

  // a slot is "sold out" deterministically per day
  const soldOut = (slotI: number) => (dayIdx == null ? false : (dayIdx * 3 + slotI * 2) % 7 === 0)

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 36 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -36 }),
  }

  return (
    <div className="pb-24">
      <Section className="pt-14 pb-10 md:pt-20">
        <Kicker>Reserve your visit</Kicker>
        <h1 className="mt-5 font-['Spectral'] text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.01em]">
          Book a soak
        </h1>
        <p className="mt-4 max-w-lg font-['Hanken_Grotesk'] text-[16.5px] leading-[1.65]" style={{ color: C.inkSoft }}>
          Four short steps. Towels, robes and a place in the Rest Hall come with every booking.
        </p>
      </Section>

      <Section className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-start">
        {/* ── Flow ────────────────────────────────────────── */}
        <div className="rounded-[1.4rem] border p-6 md:p-9" style={{ borderColor: C.line, background: C.boneSoft }}>
          {/* progress */}
          <ol className="flex items-center gap-2" aria-label="Booking progress">
            {STEPS.map((s, i) => {
              const state = done ? "done" : i < step ? "done" : i === step ? "active" : "todo"
              return (
                <li key={s} className="flex flex-1 items-center gap-2">
                  <button
                    type="button"
                    disabled={i > step && !done}
                    onClick={() => i <= step && go(i)}
                    className="flex items-center gap-2 text-left"
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-['IBM_Plex_Mono'] text-[12px] transition-colors duration-200"
                      style={{
                        background: state === "todo" ? "transparent" : C.ember,
                        border: `1.5px solid ${state === "todo" ? C.line : C.ember}`,
                        color: state === "todo" ? C.inkSoft : "#fbf3e9",
                      }}
                    >
                      {state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span
                      className="hidden font-['Hanken_Grotesk'] text-[13px] font-semibold sm:inline"
                      style={{ color: state === "active" ? C.ink : C.inkSoft }}
                    >
                      {s}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <span aria-hidden className="h-px flex-1" style={{ background: i < step || done ? C.ember : C.line }} />
                  )}
                </li>
              )
            })}
          </ol>

          <div className="relative mt-9 min-h-[320px]">
            <AnimatePresence mode="wait" custom={dir}>
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.span
                    className="grid h-16 w-16 place-items-center rounded-full"
                    style={{ background: C.ember, color: "#fbf3e9" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                  >
                    <Check className="h-8 w-8" strokeWidth={2.4} />
                  </motion.span>
                  <h2 className="mt-6 font-['Spectral'] text-[1.8rem] font-medium">You're booked.</h2>
                  <p className="mt-2 max-w-sm font-['Hanken_Grotesk'] text-[15px] leading-[1.6]" style={{ color: C.inkSoft }}>
                    {session?.name} for {guests} on {day?.label}, {time}. A confirmation is on its way — arrive ten minutes early to settle in.
                  </p>
                  <Link to={base} className="mt-7 font-['Hanken_Grotesk'] text-[15px] font-semibold underline-offset-4 hover:underline" style={{ color: C.emberText }}>
                    Back to the house
                  </Link>
                </motion.div>
              ) : (
                <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}>
                  {step === 0 && (
                    <fieldset>
                      <legend className="font-['Spectral'] text-[1.4rem] font-medium">Choose your session</legend>
                      <div className="mt-5 flex flex-col gap-3">
                        {SESSIONS.map((s) => {
                          const active = s.id === sessionId
                          return (
                            <button
                              key={s.id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setSessionId(s.id)}
                              className="group rounded-2xl border p-5 text-left transition-all duration-200"
                              style={{ borderColor: active ? C.ember : C.line, background: active ? "rgba(168,63,29,0.05)" : C.bone, boxShadow: active ? `0 0 0 1px ${C.ember}` : "none" }}
                            >
                              <div className="flex items-baseline justify-between gap-4">
                                <h3 className="font-['Spectral'] text-[1.3rem] font-medium">{s.name}</h3>
                                <span className="font-['IBM_Plex_Mono'] text-[15px]" style={{ color: C.emberText }}>${s.price}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-3">
                                <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em]" style={{ color: C.inkSoft }}>{s.length}</span>
                                <span className="rounded-full px-2.5 py-0.5 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.12em]" style={{ background: "rgba(168,63,29,0.1)", color: C.emberText }}>{s.note}</span>
                              </div>
                              <p className="mt-2.5 font-['Hanken_Grotesk'] text-[14.5px] leading-[1.55]" style={{ color: C.inkSoft }}>{s.blurb}</p>
                            </button>
                          )
                        })}
                      </div>
                    </fieldset>
                  )}

                  {step === 1 && (
                    <fieldset>
                      <legend className="flex items-center gap-2 font-['Spectral'] text-[1.4rem] font-medium"><CalendarDays className="h-5 w-5" style={{ color: C.emberText }} /> Pick a day</legend>
                      <p className="mt-1.5 font-['Hanken_Grotesk'] text-[14px]" style={{ color: C.inkSoft }}>The next seven days. We're closed Mondays.</p>
                      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                        {days.map((d) => {
                          const active = d.idx === dayIdx
                          return (
                            <button
                              key={d.idx}
                              type="button"
                              disabled={d.closed}
                              aria-pressed={active}
                              onClick={() => { setDayIdx(d.idx); setTime(null) }}
                              className="flex flex-col items-center gap-0.5 rounded-xl border py-3.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                              style={{ borderColor: active ? C.ember : C.line, background: active ? C.ember : C.bone, color: active ? "#fbf3e9" : C.ink }}
                            >
                              <span className="font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-[0.12em]" style={{ color: active ? "rgba(251,243,233,0.8)" : C.inkSoft }}>{d.weekday}</span>
                              <span className="font-['Spectral'] text-[1.5rem] font-medium leading-none">{d.day}</span>
                              <span className="font-['Hanken_Grotesk'] text-[11px]" style={{ color: active ? "rgba(251,243,233,0.8)" : C.inkSoft }}>{d.closed ? "closed" : d.idx < 2 ? d.label : d.month}</span>
                            </button>
                          )
                        })}
                      </div>
                    </fieldset>
                  )}

                  {step === 2 && (
                    <fieldset>
                      <legend className="flex items-center gap-2 font-['Spectral'] text-[1.4rem] font-medium"><Clock className="h-5 w-5" style={{ color: C.emberText }} /> Choose a time</legend>
                      <p className="mt-1.5 font-['Hanken_Grotesk'] text-[14px]" style={{ color: C.inkSoft }}>{day?.label} · {session?.length} in the house</p>
                      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                        {SLOTS.map((t, i) => {
                          const out = soldOut(i)
                          const active = t === time
                          return (
                            <button
                              key={t}
                              type="button"
                              disabled={out}
                              aria-pressed={active}
                              onClick={() => setTime(t)}
                              className="rounded-xl border py-3 font-['IBM_Plex_Mono'] text-[14px] transition-all duration-200 disabled:cursor-not-allowed"
                              style={{
                                borderColor: active ? C.ember : C.line,
                                background: active ? C.ember : out ? "transparent" : C.bone,
                                color: active ? "#fbf3e9" : out ? C.line : C.ink,
                                textDecoration: out ? "line-through" : "none",
                              }}
                            >
                              {t}
                            </button>
                          )
                        })}
                      </div>
                      <p className="mt-4 font-['Hanken_Grotesk'] text-[13px]" style={{ color: C.inkSoft }}>Struck-through times are fully booked.</p>
                    </fieldset>
                  )}

                  {step === 3 && (
                    <div>
                      <h2 className="font-['Spectral'] text-[1.4rem] font-medium">How many guests?</h2>
                      <div className="mt-5 flex items-center gap-5 rounded-2xl border p-5" style={{ borderColor: C.line, background: C.bone }}>
                        <div className="flex-1">
                          <p className="font-['Hanken_Grotesk'] text-[15px] font-semibold">Guests</p>
                          <p className="font-['Hanken_Grotesk'] text-[13px]" style={{ color: C.inkSoft }}>Up to six per booking</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Stepper label="Remove guest" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1}><Minus className="h-4 w-4" /></Stepper>
                          <span className="w-6 text-center font-['Spectral'] text-[1.6rem] font-medium tabular-nums">{guests}</span>
                          <Stepper label="Add guest" onClick={() => setGuests((g) => Math.min(6, g + 1))} disabled={guests >= 6}><Plus className="h-4 w-4" /></Stepper>
                        </div>
                      </div>
                      <ul className="mt-6 space-y-2.5">
                        {["Wood-fired sauna, plunge & steam", "Towels, robe and sandals", "Tea in the Rest Hall"].map((p) => (
                          <li key={p} className="flex items-center gap-2.5 font-['Hanken_Grotesk'] text-[15px]" style={{ color: C.inkSoft }}>
                            <Check className="h-4 w-4 shrink-0" style={{ color: C.emberText }} /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* controls */}
          {!done && (
            <div className="mt-8 flex items-center justify-between border-t pt-6" style={{ borderColor: C.line }}>
              <button
                type="button"
                onClick={() => go(step - 1)}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 font-['Hanken_Grotesk'] text-[15px] font-medium transition-opacity duration-200 disabled:opacity-0"
                style={{ color: C.inkSoft }}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              {step < STEPS.length - 1 ? (
                <Magnetic strength={0.3}>
                  <button
                    type="button"
                    onClick={() => canAdvance && go(step + 1)}
                    disabled={!canAdvance}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35"
                    style={{ background: C.ember, color: "#fbf3e9" }}
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </Magnetic>
              ) : (
                <Magnetic strength={0.3}>
                  <button
                    type="button"
                    onClick={() => setDone(true)}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-all duration-200"
                    style={{ background: C.ember, color: "#fbf3e9" }}
                  >
                    Confirm booking · ${total}
                  </button>
                </Magnetic>
              )}
            </div>
          )}
        </div>

        {/* ── Live summary ─────────────────────────────────── */}
        <aside className="sticky top-24 rounded-[1.4rem] border p-7" style={{ borderColor: C.line, background: C.char }}>
          <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.24em]" style={{ color: C.emberOnDark }}>Your visit</p>
          <div className="mt-5 space-y-px overflow-hidden rounded-xl" style={{ background: "rgba(244,238,228,0.08)" }}>
            <SummaryRow label="Session" value={session?.name} sub={session?.length} />
            <SummaryRow label="Day" value={day?.label} sub={day ? `${day.weekday}` : undefined} />
            <SummaryRow label="Time" value={time ?? undefined} />
            <SummaryRow label="Guests" value={String(guests)} />
          </div>

          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-['Hanken_Grotesk'] text-[15px] font-semibold" style={{ color: C.bone }}>Total</span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={total}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="font-['Spectral'] text-[2rem] font-medium tabular-nums"
                style={{ color: C.bone }}
              >
                ${total}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="mt-3 font-['Hanken_Grotesk'] text-[13px] leading-[1.6]" style={{ color: "rgba(244,238,228,0.6)" }}>
            Free to change or cancel up to 24 hours before your slot.
          </p>
        </aside>
      </Section>
    </div>
  )
}

function Stepper({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 disabled:opacity-30"
      style={{ borderColor: C.line, color: C.ink }}
    >
      {children}
    </button>
  )
}

function SummaryRow({ label, value, sub }: { label: string; value?: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5" style={{ background: C.char }}>
      <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(244,238,228,0.5)" }}>{label}</span>
      {value ? (
        <span className="font-['Hanken_Grotesk'] text-[14.5px] font-semibold" style={{ color: C.bone }}>
          {value}{sub ? <span className="ml-1.5 font-normal" style={{ color: "rgba(244,238,228,0.55)" }}>· {sub}</span> : null}
        </span>
      ) : (
        <span className="font-['Hanken_Grotesk'] text-[14px]" style={{ color: "rgba(244,238,228,0.35)" }}>—</span>
      )}
    </div>
  )
}
