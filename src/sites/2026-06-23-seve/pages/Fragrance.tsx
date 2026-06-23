import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, Minus, Plus, ArrowLeft } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import {
  C,
  FRAGRANCES,
  getFragrance,
  Bottle,
  ScentField,
  Kicker,
  priceFmt,
} from "../lib"

export function Fragrance() {
  const { slug, id } = useParams()
  const base = `/site/${slug}`
  const f = getFragrance(id)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const others = FRAGRANCES.filter((x) => x.slug !== f.slug)

  return (
    <div style={{ background: C.bone }}>
      {/* top: bottle + buy */}
      <section className="border-b" style={{ borderColor: C.line }}>
        <div className="mx-auto grid max-w-6xl gap-0 px-6 md:grid-cols-2 md:px-0">
          <ScentField
            className="md:border-r"
            style={{ background: C.ink, borderColor: "rgba(226,164,75,0.16)" }}
            tone="rgba(226,164,75,0.5)"
          >
            <div className="flex min-h-[460px] flex-col items-center justify-center px-6 py-16">
              <Link
                to={`${base}/collection`}
                className="mb-8 inline-flex items-center gap-1.5 self-start font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.16em] transition-colors duration-200"
                style={{ color: "rgba(242,235,223,0.7)" }}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Collection
              </Link>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bottle f={f} className="h-[380px] w-auto drop-shadow-2xl" />
              </motion.div>
            </div>
          </ScentField>

          <div className="px-6 py-16 md:px-12">
            <Kicker>
              N°{f.no} · {f.family}
            </Kicker>
            <h1 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(2.6rem,6vw,4rem)] leading-[1]" style={{ color: C.ink }}>
              {f.name}
            </h1>
            <p className="mt-5 max-w-md font-['Hanken_Grotesk'] text-[16.5px] leading-[1.8]" style={{ color: "rgba(23,18,14,0.8)" }}>
              {f.story}
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-['Cormorant_Garamond'] text-4xl" style={{ color: C.ink }}>
                {priceFmt(f.price)}
              </span>
              <span className="font-['IBM_Plex_Mono'] text-[13px]" style={{ color: "rgba(23,18,14,0.7)" }}>
                Extrait · {f.ml} ml
              </span>
            </div>

            {/* qty + add to cart */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border" style={{ borderColor: C.line }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-200 hover:bg-black/5"
                  aria-label="Decrease quantity"
                  style={{ color: C.ink }}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-['Hanken_Grotesk'] text-[16px] font-semibold" style={{ color: C.ink }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(9, q + 1))}
                  className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-200 hover:bg-black/5"
                  aria-label="Increase quantity"
                  style={{ color: C.ink }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Magnetic strength={0.35}>
                <button
                  onClick={() => {
                    setAdded(true)
                    window.setTimeout(() => setAdded(false), 1800)
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-['Hanken_Grotesk'] text-[15px] font-semibold transition-colors duration-200"
                  style={{ background: C.ink, color: C.bone }}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" /> Added to bag
                    </>
                  ) : (
                    <>Add to bag — {priceFmt(f.price * qty)}</>
                  )}
                </button>
              </Magnetic>
            </div>

            <ul className="mt-9 space-y-2.5 border-t pt-7 font-['Hanken_Grotesk'] text-[14.5px]" style={{ borderColor: C.line, color: "rgba(23,18,14,0.8)" }}>
              {[
                "Poured to order — allow 5 working days",
                "Refillable flacon, €30 off every refill",
                "Free 2 ml sample tucked in every order",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.amber }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* the olfactory pyramid */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1.1fr]">
          <div>
            <Kicker>The pyramid</Kicker>
            <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(2rem,4.5vw,3rem)] leading-tight" style={{ color: C.ink }}>
              How it unfolds on skin.
            </h2>
            <p className="mt-5 max-w-sm font-['Hanken_Grotesk'] text-[16px] leading-[1.8]" style={{ color: "rgba(23,18,14,0.78)" }}>
              From the first bright minutes to the dry-down hours later — the
              materials reveal themselves in three movements.
            </p>
            <figure className="mt-8 overflow-hidden rounded-2xl border" style={{ borderColor: C.line }}>
              <div className="relative aspect-[16/10]">
                <img
                  src={`https://picsum.photos/seed/${f.seed}/800/500`}
                  alt={`${f.material}, the headline material in ${f.name}`}
                  loading="lazy"
                  width={800}
                  height={500}
                  className="h-full w-full object-cover"
                  style={{ filter: "sepia(0.3) saturate(0.9) contrast(1.03)" }}
                />
                <figcaption
                  className="absolute bottom-0 left-0 right-0 px-4 py-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.14em]"
                  style={{
                    color: C.bone,
                    background: "linear-gradient(transparent, rgba(23,18,14,0.7))",
                  }}
                >
                  {f.material}
                </figcaption>
              </div>
            </figure>
          </div>

          <div className="space-y-4">
            {f.notes.map((tier, i) => (
              <Reveal key={tier.tier} delay={i * 0.1}>
                <div
                  className="rounded-2xl border px-7 py-6"
                  style={{
                    borderColor: C.line,
                    background: i === 1 ? C.ink : C.boneDeep,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-['Cormorant_Garamond'] text-2xl italic"
                      style={{ color: i === 1 ? C.amberLit : C.amber }}
                    >
                      {tier.tier}
                    </span>
                    <span
                      className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.16em]"
                      style={{ color: i === 1 ? "rgba(242,235,223,0.6)" : "rgba(23,18,14,0.6)" }}
                    >
                      {["0–15 min", "15 min–2 h", "2 h+"][i]}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {tier.items.map((n, j) => (
                      <motion.span
                        key={n}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.06, duration: 0.4 }}
                        className="rounded-full border px-3.5 py-1.5 font-['Hanken_Grotesk'] text-[14px]"
                        style={{
                          borderColor: i === 1 ? "rgba(242,235,223,0.22)" : C.line,
                          color: i === 1 ? C.bone : "rgba(23,18,14,0.82)",
                        }}
                      >
                        {n}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* others */}
      <section className="border-t px-6 py-20" style={{ borderColor: C.line, background: C.boneDeep }}>
        <div className="mx-auto max-w-6xl">
          <Kicker>Continue</Kicker>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-3xl" style={{ color: C.ink }}>
            The other two.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`${base}/parfum/${o.slug}`}
                className="group flex items-center gap-6 rounded-2xl border bg-white/40 px-6 py-6 transition-colors duration-200 hover:border-[color:var(--amber)]"
                style={{ borderColor: C.line, ["--amber" as string]: C.amber }}
              >
                <Bottle f={o} className="h-24 w-auto shrink-0" />
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-[0.18em]" style={{ color: C.amber }}>
                    N°{o.no}
                  </span>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl" style={{ color: C.ink }}>
                    {o.name}
                  </h3>
                  <p className="mt-1 font-['Hanken_Grotesk'] text-[14px]" style={{ color: "rgba(23,18,14,0.72)" }}>
                    {o.blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
