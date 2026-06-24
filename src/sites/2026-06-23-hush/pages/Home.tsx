import { Link, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Copy, Lock, Terminal as TerminalIcon, KeyRound } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Spotlight } from "@/components/fx/Spotlight"
import { Terminal } from "../Terminal"
import { Eyebrow } from "../ui"
import { integrations } from "../data"

export function Home() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden border-b border-[#17191b]/10">
        <Grid />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#0c6e5d]/25 bg-[#0c6e5d]/8 px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#0c6e5d]" />
              <span className="font-['IBM_Plex_Mono'] text-[12px] tracking-wide text-[#0a5a4b]">
                v2.4 — now with hardware keys
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 font-['Bricolage_Grotesque'] text-[2.7rem] font-bold leading-[0.98] tracking-[-0.02em] text-[#16181a] sm:text-6xl lg:text-[4.1rem]"
            >
              Secrets that never
              <br />
              touch your{" "}
              <span className="relative whitespace-nowrap text-[#0a5a4b]">
                shell history
                <Underline />
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 max-w-md text-lg leading-relaxed text-[#17191b]/75"
            >
              Hush is a command-line secrets manager for small teams. Encrypted env vars,
              scoped tokens, and an audit log you can actually read — no dashboard to babysit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <Link
                  to={`${base}/docs`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0c6e5d] px-6 py-3 font-['IBM_Plex_Sans'] font-semibold text-[#f3f7f4] transition-colors duration-200 hover:bg-[#0a5a4b]"
                >
                  Read the quickstart <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <CopyInstall />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Terminal
              lines={[
                { kind: "comment", text: "# install once, never paste a secret again" },
                { kind: "cmd", text: "hush add db/url" },
                { kind: "out", text: "value (hidden): ••••••••••••••••••" },
                { kind: "ok", text: "✓ encrypted to vault.hush · age:X25519" },
                { kind: "cmd", text: "hush run -- npm start" },
                { kind: "out", text: "injecting 7 secrets into env (masked) …" },
                { kind: "ok", text: "✓ api ready on :3000 · 0 written to disk" },
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* featured: 3D tilt bento */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <Eyebrow>Why teams switch</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-['Bricolage_Grotesque'] text-3xl font-bold tracking-[-0.01em] text-[#16181a] md:text-[2.6rem] md:leading-[1.05]">
            The boring parts of secrets, finally handled.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:grid-rows-2">
          <TiltFeature
            className="md:row-span-2"
            tall
            icon={<TerminalIcon className="h-5 w-5" />}
            title="Wrapped, not written"
            body="hush run injects secrets into one process and tears them down when it exits. Nothing lands in .env, .bashrc, or your history file — there is no plaintext to leak."
            cmd="hush run -- npm start"
          />
          <TiltFeature
            icon={<KeyRound className="h-5 w-5" />}
            title="Grants that expire"
            body="Give staging access for 24 hours. The grant revokes itself."
            cmd="hush grant staging --to amir --ttl 24h"
          />
          <TiltFeature
            icon={<Lock className="h-5 w-5" />}
            title="Zero-knowledge"
            body="Encrypted before it leaves your machine. We hold no key that opens it."
            cmd="hush rotate db/prod --reload api"
          />
        </div>
      </section>

      {/* integrations marquee */}
      <section className="border-y border-[#17191b]/10 bg-[#e7e2d7]/60 py-7">
        <p className="mb-5 text-center font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.22em] text-[#17191b]/70">
          Drops into the stack you already run
        </p>
        <Marquee />
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Spotlight color="rgba(127,227,196,0.16)" size={460} className="rounded-3xl">
          <div className="rounded-3xl border border-white/10 bg-[#14171b] px-8 py-14 text-center md:px-16 md:py-20">
            <Reveal>
              <h2 className="mx-auto max-w-2xl font-['Bricolage_Grotesque'] text-3xl font-bold tracking-[-0.01em] text-[#f1f4f0] md:text-[2.7rem] md:leading-[1.04]">
                Stop pasting your production database URL into chat.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[#cfd6cf]/85">
                Install Hush in under a minute. Your first vault is encrypted before you
                finish reading the confirmation line.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Magnetic>
                  <Link
                    to={`${base}/docs`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#7fe3c4] px-6 py-3 font-['IBM_Plex_Sans'] font-semibold text-[#0a3b31] transition-colors duration-200 hover:bg-[#9cecd4]"
                  >
                    Get started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
                <Link
                  to={`${base}/pricing`}
                  className="font-['IBM_Plex_Mono'] text-sm uppercase tracking-wider text-[#cfd6cf]/70 underline-offset-4 transition-colors hover:text-[#7fe3c4] hover:underline"
                >
                  See pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </Spotlight>
      </section>
    </div>
  )
}

function TiltFeature({
  icon,
  title,
  body,
  cmd,
  className,
  tall,
}: {
  icon: React.ReactNode
  title: string
  body: string
  cmd: string
  className?: string
  tall?: boolean
}) {
  return (
    <TiltCard max={9} className={className}>
      <div
        className={`flex h-full flex-col rounded-2xl border border-[#17191b]/12 bg-[#fbfaf6] p-7 shadow-[0_18px_40px_-32px_rgba(12,40,34,0.5)] ${
          tall ? "md:p-9" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <span
          className="grid h-11 w-11 place-items-center rounded-xl bg-[#0c6e5d] text-[#eafaf4]"
          style={{ transform: "translateZ(45px)" }}
        >
          {icon}
        </span>
        <h3
          className={`mt-5 font-['Bricolage_Grotesque'] font-bold tracking-[-0.01em] text-[#16181a] ${
            tall ? "text-2xl md:text-[1.7rem]" : "text-xl"
          }`}
          style={{ transform: "translateZ(30px)" }}
        >
          {title}
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#17191b]/70" style={{ transform: "translateZ(18px)" }}>
          {body}
        </p>
        <code
          className="mt-6 block overflow-x-auto rounded-lg bg-[#0f1215] px-3 py-2.5 font-['IBM_Plex_Mono'] text-[12.5px] text-[#7fe3c4]"
          style={{ transform: "translateZ(24px)" }}
        >
          <span className="select-none text-[#54c2a0]/70">❯ </span>
          {cmd}
        </code>
      </div>
    </TiltCard>
  )
}

function CopyInstall() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[#17191b]/15 bg-[#fbfaf6] py-2 pl-4 pr-2">
      <code className="font-['IBM_Plex_Mono'] text-sm text-[#17191b]/80">
        <span className="text-[#0a5a4b]">$</span> brew install hush
      </code>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#17191b]/6 text-[#17191b]/55">
        <Copy className="h-3.5 w-3.5" />
      </span>
    </div>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const row = [...integrations, ...integrations]
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-['Bricolage_Grotesque'] text-xl font-semibold text-[#17191b]/75"
          >
            {t}
            <span className="text-[#0c6e5d]/40">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function Grid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.5]"
      style={{
        backgroundImage:
          "radial-gradient(rgba(12,110,93,0.10) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%)",
      }}
    />
  )
}

function Underline() {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 300 12"
      className="absolute -bottom-2 left-0 h-3 w-full text-[#0c6e5d]/45"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M2 8 C 80 2, 220 2, 298 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}
