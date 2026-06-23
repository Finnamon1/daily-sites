import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Eyebrow } from "../ui"
import { features } from "../data"

export function Features() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal>
        <Eyebrow>Features</Eyebrow>
        <h1 className="mt-3 max-w-3xl font-['Bricolage_Grotesque'] text-4xl font-bold leading-[1.02] tracking-[-0.02em] text-[#16181a] md:text-[3.4rem]">
          Everything a secret needs, and nothing it doesn't.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#17191b]/75">
          Hush is opinionated about one thing: a secret should be hard to leak and easy to
          rotate. Every feature exists to make that trade, and we left out the rest.
        </p>
      </Reveal>

      {/* 3D tilt feature grid — asymmetric, the accent card spans wide */}
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {features.map((f, i) => (
          <Reveal key={f.key} delay={(i % 2) * 0.08} className={f.accent ? "md:col-span-2" : ""}>
            <TiltCard max={8}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 shadow-[0_18px_44px_-34px_rgba(12,40,34,0.5)] md:p-8 ${
                  f.accent
                    ? "border-[#0c6e5d]/30 bg-[#0c6e5d] text-[#eafaf4]"
                    : "border-[#17191b]/12 bg-[#fbfaf6]"
                } ${f.accent ? "md:flex-row md:items-center md:gap-10" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className={f.accent ? "md:max-w-md" : ""}>
                  <h3
                    className={`font-['Bricolage_Grotesque'] text-xl font-bold tracking-[-0.01em] md:text-2xl ${
                      f.accent ? "text-[#eafaf4]" : "text-[#16181a]"
                    }`}
                    style={{ transform: "translateZ(28px)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={`mt-3 text-[15px] leading-relaxed ${f.accent ? "text-[#eafaf4]/85" : "text-[#17191b]/70"}`}
                    style={{ transform: "translateZ(16px)" }}
                  >
                    {f.body}
                  </p>
                </div>
                <code
                  className={`mt-6 block overflow-x-auto rounded-lg px-3 py-2.5 font-['IBM_Plex_Mono'] text-[12.5px] md:mt-0 ${
                    f.accent ? "bg-[#0a3b31] text-[#9cecd4] md:min-w-[300px]" : "bg-[#0f1215] text-[#7fe3c4]"
                  }`}
                  style={{ transform: "translateZ(24px)" }}
                >
                  <span className="select-none opacity-70">❯ </span>
                  {f.cmd}
                </code>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* comparison strip */}
      <Reveal>
        <div className="mt-20 overflow-hidden rounded-2xl border border-[#17191b]/12 bg-[#fbfaf6]">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-[#17191b]/10 bg-[#e7e2d7]/60 px-6 py-4 font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-wider text-[#17191b]/70">
            <span>The old way</span>
            <span className="text-center">.env files</span>
            <span className="text-center text-[#0a5a4b]">Hush</span>
          </div>
          {[
            ["Secret in shell history", "Often", "Never"],
            ["Revoke one teammate", "Rotate everything", "One command"],
            ["Who read prod last week?", "No idea", "One log line"],
            ["Quarterly rotation", "A whole sprint", "A coffee break"],
          ].map((row, i) => (
            <div
              key={row[0]}
              className={`grid grid-cols-[1.4fr_1fr_1fr] items-center px-6 py-4 text-sm ${
                i % 2 ? "bg-[#17191b]/[0.02]" : ""
              }`}
            >
              <span className="font-medium text-[#16181a]">{row[0]}</span>
              <span className="text-center text-[#17191b]/70">{row[1]}</span>
              <span className="text-center font-semibold text-[#0a5a4b]">{row[2]}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
