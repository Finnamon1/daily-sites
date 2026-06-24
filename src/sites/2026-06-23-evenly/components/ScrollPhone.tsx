import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { PhoneFrame } from "./PhoneFrame"
import { SCREENS } from "./PhoneScreens"

export interface Step {
  kicker: string
  title: string
  body: string
}

/* FEATURED INTERACTION — a sticky phone whose screen scrubs through app views
   as you scroll the step list beside it. Desktop only; on small screens each
   step shows its own inline phone so touch users see every screen. */
export function ScrollPhone({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const Active = SCREENS[active] ?? SCREENS[0]

  return (
    <div className="relative">
      {/* DESKTOP: sticky phone + scrolling steps */}
      <div className="hidden gap-12 md:grid md:grid-cols-[1fr_minmax(0,360px)] lg:gap-20">
        <div className="flex flex-col gap-[42vh] py-[12vh]">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              onViewportEnter={() => setActive(i)}
              viewport={{ margin: "-45% 0px -45% 0px" }}
              className="max-w-md"
            >
              <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#a8431d]">
                {String(i + 1).padStart(2, "0")} · {s.kicker}
              </p>
              <h3
                className="mt-3 font-['Fraunces'] text-3xl font-semibold leading-tight transition-colors duration-300"
                style={{ color: active === i ? "#1c2b23" : "#8a988e" }}
              >
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#3c4a42]">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <div className="sticky top-[18vh] mx-auto w-[260px]">
            <PhoneFrame>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="h-full w-full"
                >
                  <Active />
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
            {/* progress dots */}
            <div className="mt-6 flex justify-center gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: active === i ? 22 : 6,
                    background: active === i ? "#e7613a" : "#1c2b2333",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: each step with its own inline phone */}
      <div className="flex flex-col gap-16 md:hidden">
        {steps.map((s, i) => {
          const Screen = SCREENS[i] ?? SCREENS[0]
          return (
            <div key={s.title}>
              <p className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#a8431d]">
                {String(i + 1).padStart(2, "0")} · {s.kicker}
              </p>
              <h3 className="mt-2 font-['Fraunces'] text-2xl font-semibold leading-tight text-[#1c2b23]">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#3c4a42]">{s.body}</p>
              <div className="mx-auto mt-6 w-[210px]">
                <PhoneFrame>
                  <Screen />
                </PhoneFrame>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
