import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion"
import {
  ArrowDown,
  Check,
  Download,
  KeyRound,
  Loader2,
  Minus,
  Plus,
  Settings2,
  ShoppingBag,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Prompt & Press — AI graphic tees",
  description:
    "A concept storefront where the t-shirt graphics are generated from your words. Type a prompt, pick a style (vintage badge, line art, ukiyo-e, cyberpunk…), and the design prints onto a live tee mockup: six shirt colours, drag-and-scale placement, fabric-blend realism, and a one-click PNG mockup download. Two generation engines — Pollinations (free, no key) and bring-your-own OpenAI key (gpt-image-1, optional transparent background) — plus six built-in starter designs so the studio works with nothing configured. Session design history, size picker, cart drawer with a cheerfully honest concept checkout.",
  date: "2026-07-02",
  type: "E-commerce concept / AI product studio",
  interaction:
    "A working AI tee studio — prompt → generated graphic printed on a live mockup with drag/scale placement, shirt colours, fabric blending, PNG mockup export, session history, starter designs, cart drawer, and dual engines (free Pollinations or BYO OpenAI key).",
}

/* --------------------------------------------------------------- palette */
// warm studio grey around the garment; ink text; ONE accent: press orange.
const STUDIO = "#edeae3"
const CARD = "#f7f5f0"
const INK = "#1b1917" // ~14:1 on card
const MUTE = "#6b6459" // ~5.4:1 on card
const LINE = "rgba(27,25,23,0.13)"
const ORANGE = "#e8481c" // ~5.3:1 on card
const PANEL = "rgba(247,245,240,0.9)"

const DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif"
const SANS = "'DM Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

const cn = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8481c]"

/* ----------------------------------------------------------------- shirts */

type ShirtColor = { id: string; name: string; hex: string; dark: boolean }

const SHIRTS: ShirtColor[] = [
  { id: "white", name: "White", hex: "#f4f3f0", dark: false },
  { id: "bone", name: "Bone", hex: "#e7dfc9", dark: false },
  { id: "sage", name: "Sage", hex: "#a9b49b", dark: false },
  { id: "rose", name: "Dust rose", hex: "#d9adb2", dark: false },
  { id: "navy", name: "Navy", hex: "#2b3350", dark: true },
  { id: "black", name: "Black", hex: "#211f22", dark: true },
]

const SIZES = ["S", "M", "L", "XL", "2XL"] as const
const PRICE = 34

/* ---------------------------------------------------------------- styles */

const STYLES = [
  { id: "none", name: "No style", mod: "" },
  { id: "badge", name: "Vintage badge", mod: "vintage circular badge emblem, distressed screen-print texture, limited palette" },
  { id: "line", name: "Minimal line art", mod: "single-weight minimal line art, one continuous line, lots of negative space" },
  { id: "ukiyoe", name: "Ukiyo-e", mod: "japanese ukiyo-e woodblock style, flat colour, bold outlines" },
  { id: "retro", name: "Retro sunset", mod: "1970s retro sunset gradient stripes, grainy, warm palette" },
  { id: "cyber", name: "Cyberpunk", mod: "cyberpunk chrome and neon, dark background, glitch details" },
  { id: "doodle", name: "Hand doodle", mod: "playful hand-drawn doodle, thick marker lines, off-register colour" },
]

/* ---------------------------------------------------- starter designs
   Bundled SVG artworks (data URIs) so the studio is fully usable before any
   generation — and so the wall of tees below never depends on a network. */

const svgUri = (s: string) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`

const STARTERS: { id: string; name: string; url: string }[] = [
  {
    id: "sun",
    name: "Alpine club",
    url: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="none" stroke="#1b1917" stroke-width="6"/><circle cx="100" cy="86" r="26" fill="#e8481c"/><path d="M22 138 L64 84 L92 120 L118 74 L178 138 Z" fill="#1b1917"/><path d="M22 138 h156" stroke="#1b1917" stroke-width="6"/><text x="100" y="168" text-anchor="middle" font-family="monospace" font-size="17" letter-spacing="4" fill="#1b1917">ALPINE CLUB</text></svg>`),
  },
  {
    id: "melt",
    name: "Big feelings",
    url: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="92" r="64" fill="#ffd23e" stroke="#1b1917" stroke-width="6"/><path d="M56 92 q0 70 12 92 q8 12 14 -4 q6 -30 4 -50 M144 92 q0 60 -10 84 q-7 14 -13 0 q-6 -26 -5 -48" fill="#ffd23e" stroke="#1b1917" stroke-width="6" stroke-linecap="round"/><circle cx="78" cy="82" r="7" fill="#1b1917"/><circle cx="122" cy="82" r="7" fill="#1b1917"/><path d="M74 112 q26 20 52 0" fill="none" stroke="#1b1917" stroke-width="6" stroke-linecap="round"/></svg>`),
  },
  {
    id: "koi",
    name: "River koi",
    url: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M40 120 q30 -70 80 -76 q46 -6 40 28 q-5 28 -44 34 q40 8 34 40 q-6 30 -48 22 q-44 -8 -62 -48" fill="none" stroke="#2b3350" stroke-width="9" stroke-linecap="round"/><circle cx="128" cy="64" r="6" fill="#e8481c"/><path d="M30 148 q20 10 40 0 q20 -10 40 0 q20 10 40 0 q20 -10 30 -4" fill="none" stroke="#e8481c" stroke-width="7" stroke-linecap="round"/></svg>`),
  },
  {
    id: "grid",
    name: "Sun grid",
    url: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><clipPath id="c"><circle cx="100" cy="100" r="78"/></clipPath></defs><g clip-path="url(#c)"><rect x="10" y="10" width="180" height="90" fill="#e8481c"/><rect x="10" y="104" width="180" height="10" fill="#1b1917"/><rect x="10" y="122" width="180" height="8" fill="#1b1917"/><rect x="10" y="138" width="180" height="6" fill="#1b1917"/><rect x="10" y="152" width="180" height="5" fill="#1b1917"/><rect x="10" y="164" width="180" height="4" fill="#1b1917"/><circle cx="100" cy="96" r="30" fill="#ffd23e"/></g><circle cx="100" cy="100" r="78" fill="none" stroke="#1b1917" stroke-width="6"/></svg>`),
  },
  {
    id: "shroom",
    name: "Forager",
    url: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M40 104 q0 -62 60 -62 q60 0 60 62 q-30 10 -60 10 q-30 0 -60 -10" fill="#e8481c" stroke="#1b1917" stroke-width="6"/><circle cx="72" cy="74" r="9" fill="#f7f5f0"/><circle cx="112" cy="60" r="7" fill="#f7f5f0"/><circle cx="136" cy="84" r="8" fill="#f7f5f0"/><path d="M84 112 q-2 40 8 54 q8 10 18 0 q10 -14 6 -54" fill="#f7f5f0" stroke="#1b1917" stroke-width="6"/><text x="100" y="192" text-anchor="middle" font-family="monospace" font-size="15" letter-spacing="3" fill="#1b1917">FORAGE MORE</text></svg>`),
  },
  {
    id: "nothoughts",
    name: "No thoughts",
    url: svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><text x="100" y="66" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="30" fill="#1b1917">no thoughts</text><text x="100" y="108" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="30" fill="#1b1917">just</text><text x="100" y="150" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="30" fill="#e8481c">laundry</text><path d="M52 168 q48 22 96 0" fill="none" stroke="#1b1917" stroke-width="5" stroke-linecap="round"/></svg>`),
  },
]

/* ---------------------------------------------------------------- engine */

type Engine = "pollinations" | "openai"

async function generateImage(opts: {
  prompt: string
  styleMod: string
  engine: Engine
  apiKey: string
  transparent: boolean
}): Promise<string> {
  const { prompt, styleMod, engine, apiKey, transparent } = opts
  const fullPrompt = [
    prompt,
    styleMod,
    "bold t-shirt graphic, centered composition, clean edges, no mockup, no shirt, no watermark",
  ]
    .filter(Boolean)
    .join(", ")

  if (engine === "pollinations") {
    const seed = Math.floor(Math.random() * 1e6)
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`
    const res = await fetch(url, { mode: "cors" })
    if (!res.ok) throw new Error(`Engine returned ${res.status}`)
    const blob = await res.blob()
    if (!blob.type.startsWith("image/")) throw new Error("Engine returned a non-image")
    return URL.createObjectURL(blob)
  }

  // OpenAI gpt-image-1
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
      quality: "medium",
      ...(transparent ? { background: "transparent" } : {}),
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? `OpenAI returned ${res.status}`)
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error("No image in response")
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return URL.createObjectURL(new Blob([bytes], { type: "image/png" }))
}

/* ------------------------------------------------------------- tee mockup
   The tee is one hand-drawn SVG (recoloured per shirt), the print sits in a
   fixed chest zone that the user can drag vertically and scale. The same
   geometry is replayed onto a canvas for the PNG mockup download. */

const TEE_W = 400
const TEE_H = 470
// chest print zone in tee coordinates
const ZONE = { x: 128, y: 150, w: 144, h: 190 }

function TeePaths({ color }: { color: ShirtColor }) {
  return (
    <>
      <path
        d={
          "M136 64 L92 86 L34 138 L64 192 L100 168 L100 428 Q100 440 112 440 L288 440 Q300 440 300 428 L300 168 L336 192 L366 138 L308 86 L264 64 " +
          "Q233 92 200 92 Q167 92 136 64 Z"
        }
        fill={color.hex}
        stroke={color.dark ? "rgba(255,255,255,0.14)" : "rgba(27,25,23,0.25)"}
        strokeWidth={2.5}
      />
      {/* collar */}
      <path
        d="M136 64 Q167 92 200 92 Q233 92 264 64 Q236 106 200 106 Q164 106 136 64 Z"
        fill={color.dark ? "rgba(0,0,0,0.35)" : "rgba(27,25,23,0.14)"}
      />
      {/* sleeve + side shading */}
      <path d="M34 138 L64 192 L100 168 L100 150 Z" fill="rgba(0,0,0,0.08)" />
      <path d="M366 138 L336 192 L300 168 L300 150 Z" fill="rgba(0,0,0,0.08)" />
      <path d="M100 200 q10 90 0 220" stroke="rgba(0,0,0,0.07)" strokeWidth={7} fill="none" />
      <path d="M300 200 q-10 90 0 220" stroke="rgba(0,0,0,0.07)" strokeWidth={7} fill="none" />
      <path d="M112 440 h176" stroke="rgba(0,0,0,0.1)" strokeWidth={4} />
      {/* soft folds */}
      <path d="M150 250 q6 70 -2 150" stroke={color.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} strokeWidth={9} fill="none" />
      <path d="M252 240 q-6 80 2 160" stroke={color.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} strokeWidth={9} fill="none" />
    </>
  )
}

/* ------------------------------------------------------------------ misc */

type Design = { id: string; url: string; prompt: string; engine: string }
type CartItem = { id: string; design: Design; color: ShirtColor; size: string; qty: number }

let uid = 0
const nextId = () => `d${++uid}${Date.now() % 10000}`

function Toast({ msg }: { msg: string | null }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="status"
          className="fixed bottom-5 left-1/2 z-[95] max-w-md -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-lg"
          style={{ background: INK, color: "#f4f2ee", borderColor: "rgba(255,255,255,0.15)", fontFamily: SANS }}
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/* ----------------------------------------------------------------- page */

export default function PromptPressSite() {
  const reduced = useReducedMotion() ?? false

  /* studio state */
  const [prompt, setPrompt] = useState("")
  const [styleId, setStyleId] = useState("badge")
  const [design, setDesign] = useState<Design>({ id: "starter-sun", url: STARTERS[0].url, prompt: STARTERS[0].name, engine: "starter" })
  const [history, setHistory] = useState<Design[]>([])
  const [shirt, setShirt] = useState<ShirtColor>(SHIRTS[1])
  const [size, setSize] = useState<string>("M")
  const [scale, setScale] = useState(0.92)
  const [offsetY, setOffsetY] = useState(16)
  const [busy, setBusy] = useState(false)
  const [toast, setToastRaw] = useState<string | null>(null)
  const toastTimer = useRef<number>(0)

  /* engine state */
  const [engine, setEngine] = useState<Engine>("pollinations")
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem("pp-openai-key") ?? ""
    } catch {
      return ""
    }
  })
  const [transparent, setTransparent] = useState(true)
  const [engineOpen, setEngineOpen] = useState(false)

  /* cart */
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [ordered, setOrdered] = useState(false)

  const setToast = useCallback((m: string) => {
    setToastRaw(m)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastRaw(null), 4200)
  }, [])

  const setApiKey = (k: string) => {
    setApiKeyState(k)
    try {
      if (k) localStorage.setItem("pp-openai-key", k)
      else localStorage.removeItem("pp-openai-key")
    } catch {
      /* private mode */
    }
  }

  const generate = async () => {
    const p = prompt.trim()
    if (!p) {
      setToast("Type what you want on the shirt first — anything. Go weird.")
      return
    }
    if (engine === "openai" && !apiKey) {
      setEngineOpen(true)
      setToast("OpenAI engine needs your API key — or switch to the free engine.")
      return
    }
    setBusy(true)
    try {
      const styleMod = STYLES.find((s) => s.id === styleId)?.mod ?? ""
      const url = await generateImage({ prompt: p, styleMod, engine, apiKey, transparent })
      const d: Design = { id: nextId(), url, prompt: p, engine }
      setDesign(d)
      setHistory((h) => [d, ...h].slice(0, 12))
      setToast("Printed. Drag it, scale it, or run the prompt again for a new take.")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error"
      setToast(
        engine === "pollinations"
          ? `Free engine didn't answer (${msg}). It gets busy — retry, or add an OpenAI key in Engine settings.`
          : `OpenAI: ${msg}`,
      )
    } finally {
      setBusy(false)
    }
  }

  /* drag placement */
  const zoneRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startY: number; startOffset: number } | null>(null)
  const onDragStart = (e: React.PointerEvent) => {
    dragRef.current = { startY: e.clientY, startOffset: offsetY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const zone = zoneRef.current?.getBoundingClientRect()
    if (!zone) return
    const dy = ((e.clientY - dragRef.current.startY) / zone.height) * ZONE.h
    setOffsetY(Math.max(-30, Math.min(60, dragRef.current.startOffset + dy)))
  }
  const onDragEnd = () => (dragRef.current = null)

  /* mockup download */
  const svgRef = useRef<SVGSVGElement>(null)
  const downloadMockup = async () => {
    try {
      const canvas = document.createElement("canvas")
      const S = 3
      canvas.width = TEE_W * S
      canvas.height = TEE_H * S
      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = STUDIO
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // shirt
      const svgNode = svgRef.current
      if (!svgNode) return
      const svgData = new XMLSerializer().serializeToString(svgNode)
      const svgImg = new Image()
      await new Promise<void>((resolve, reject) => {
        svgImg.onload = () => resolve()
        svgImg.onerror = () => reject(new Error("svg"))
        svgImg.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`
      })
      ctx.drawImage(svgImg, 0, 0, TEE_W * S, TEE_H * S)
      // design
      const art = new Image()
      art.crossOrigin = "anonymous"
      await new Promise<void>((resolve, reject) => {
        art.onload = () => resolve()
        art.onerror = () => reject(new Error("art"))
        art.src = design.url
      })
      const w = ZONE.w * scale
      const x = ZONE.x + (ZONE.w - w) / 2
      const y = ZONE.y + offsetY + (ZONE.h - w) * 0.15
      if (shirt.dark) {
        // DTG underbase
        ctx.fillStyle = "#f6f4ef"
        const r = 8 * S
        const rx = x * S
        const ry = y * S
        const rw = w * S
        ctx.beginPath()
        ctx.moveTo(rx + r, ry)
        ctx.arcTo(rx + rw, ry, rx + rw, ry + rw, r)
        ctx.arcTo(rx + rw, ry + rw, rx, ry + rw, r)
        ctx.arcTo(rx, ry + rw, rx, ry, r)
        ctx.arcTo(rx, ry, rx + rw, ry, r)
        ctx.fill()
      } else {
        ctx.globalAlpha = 0.96
        ctx.globalCompositeOperation = "multiply"
      }
      ctx.drawImage(art, x * S, y * S, w * S, w * S)
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
      const a = document.createElement("a")
      a.download = "prompt-and-press-mockup.png"
      a.href = canvas.toDataURL("image/png")
      a.click()
      setToast("Mockup saved. Send it to the group chat.")
    } catch {
      setToast("Couldn't export this one (the image blocked canvas access). Generated designs export fine.")
    }
  }

  const addToCart = () => {
    setCart((c) => {
      const match = c.find((i) => i.design.id === design.id && i.color.id === shirt.id && i.size === size)
      if (match) return c.map((i) => (i === match ? { ...i, qty: i.qty + 1 } : i))
      return [...c, { id: nextId(), design, color: shirt, size, qty: 1 }]
    })
    setOrdered(false)
    setCartOpen(true)
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.qty * PRICE, 0)

  useEffect(() => {
    if (!cartOpen && !engineOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false)
        setEngineOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cartOpen, engineOpen])

  const printW = ZONE.w * scale
  const printX = ZONE.x + (ZONE.w - printW) / 2
  const printY = ZONE.y + offsetY + (ZONE.h - printW) * 0.15

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" style={{ background: STUDIO, color: INK, fontFamily: SANS }} className="min-h-screen">
        {/* ------------------------------------------------------- header */}
        <header className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md" style={{ borderColor: LINE, background: PANEL }}>
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
            {/* ml clears the gallery back-chip pinned at left-4 top-4 */}
            <a href="#top" className={cn("ml-24 flex items-baseline gap-2 no-underline min-[1440px]:ml-0", focusRing)} aria-label="Prompt & Press — top">
              <span className="text-xl" style={{ fontFamily: DISPLAY, fontWeight: 800, color: INK }}>
                Prompt<span style={{ color: ORANGE }}>&amp;</span>Press
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.22em] sm:inline" style={{ fontFamily: MONO, color: MUTE }}>
                print co.
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
              {[
                ["Studio", "#studio"],
                ["How it works", "#how"],
                ["The wall", "#wall"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a key={href} href={href} className={cn("text-sm no-underline transition-colors hover:text-[#e8481c]", focusRing)} style={{ fontFamily: SANS, fontWeight: 500, color: MUTE }}>
                  {label}
                </a>
              ))}
            </nav>
            <button
              onClick={() => setCartOpen(true)}
              className={cn("relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.03]", focusRing)}
              style={{ background: INK, color: "#f4f2ee", fontFamily: MONO }}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingBag size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold" style={{ background: ORANGE, color: "#fff" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main>
          {/* ---------------------------------------------------- intro */}
          <section className="mx-auto max-w-6xl px-4 pb-4 pt-24 md:px-6 md:pt-28">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="max-w-2xl text-5xl leading-[0.98] md:text-7xl" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                  Type it.
                  <br />
                  <em style={{ fontStyle: "italic", color: ORANGE }}>Wear it.</em>
                </h1>
                <p className="max-w-sm pb-2 text-base leading-relaxed" style={{ color: MUTE }}>
                  Describe a graphic. Our press prints it on a tee in seconds —
                  no design degree, no clip art, no shame.{" "}
                  <a href="#studio" className={cn("inline-flex items-center gap-1 font-semibold no-underline", focusRing)} style={{ color: ORANGE }}>
                    Start below <ArrowDown size={14} aria-hidden="true" />
                  </a>
                </p>
              </div>
            </Reveal>
          </section>

          {/* ---------------------------------------------------- studio */}
          <section id="studio" className="scroll-mt-20 mx-auto max-w-6xl px-4 pb-20 pt-6 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
              {/* ------------------------------------------- control desk */}
              <div className="flex flex-col gap-5 rounded-3xl border p-6" style={{ borderColor: LINE, background: CARD }}>
                <div>
                  <label htmlFor="pp-prompt" className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: MUTE }}>
                    <Wand2 size={13} style={{ color: ORANGE }} aria-hidden="true" /> Your graphic
                  </label>
                  <textarea
                    id="pp-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        void generate()
                      }
                    }}
                    rows={3}
                    placeholder="a possum riding a skateboard, screaming into the wind"
                    className={cn("w-full resize-none rounded-2xl border bg-transparent px-4 py-3 text-base leading-relaxed", focusRing)}
                    style={{ borderColor: LINE, color: INK, fontFamily: SANS }}
                  />
                </div>

                <div>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: MUTE }}>
                    Style
                  </p>
                  <div role="group" aria-label="Art style" className="flex flex-wrap gap-2">
                    {STYLES.map((s) => {
                      const on = styleId === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setStyleId(s.id)}
                          className={cn("rounded-full border px-3 py-1.5 text-xs transition-all", focusRing, !on && "hover:-translate-y-0.5")}
                          style={{
                            fontFamily: MONO,
                            color: on ? "#fff" : MUTE,
                            background: on ? INK : "transparent",
                            borderColor: on ? INK : LINE,
                          }}
                        >
                          {s.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Magnetic strength={0.2}>
                    <button
                      type="button"
                      onClick={() => void generate()}
                      disabled={busy}
                      className={cn("inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-transform hover:scale-[1.03] disabled:opacity-60", focusRing)}
                      style={{ background: ORANGE, color: "#fff", fontFamily: DISPLAY }}
                    >
                      {busy ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <Sparkles size={17} aria-hidden="true" />}
                      {busy ? "Printing…" : "Print it"}
                    </button>
                  </Magnetic>
                  <button
                    type="button"
                    onClick={() => setEngineOpen(true)}
                    className={cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs transition-colors hover:border-[#e8481c] hover:text-[#e8481c]", focusRing)}
                    style={{ borderColor: LINE, color: MUTE, fontFamily: MONO }}
                  >
                    <Settings2 size={13} aria-hidden="true" />
                    Engine: {engine === "pollinations" ? "Free" : "OpenAI"}
                  </button>
                  <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
                    ⌘↵ to print
                  </span>
                </div>
                <p aria-live="polite" className="sr-only">
                  {busy ? "Generating your design" : ""}
                </p>

                <div className="border-t pt-4" style={{ borderColor: LINE }}>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: MUTE }}>
                    No prompt yet? Try a house design
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setDesign({ id: `starter-${s.id}`, url: s.url, prompt: s.name, engine: "starter" })}
                        aria-label={`Use house design: ${s.name}`}
                        className={cn("h-14 w-14 overflow-hidden rounded-xl border p-1 transition-all hover:-translate-y-0.5 hover:border-[#e8481c]", focusRing)}
                        style={{ borderColor: design.id === `starter-${s.id}` ? ORANGE : LINE, background: "#fff" }}
                      >
                        <img src={s.url} alt="" className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>

                {history.length > 0 && (
                  <div className="border-t pt-4" style={{ borderColor: LINE }}>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: MUTE }}>
                      This session ({history.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {history.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDesign(d)}
                          aria-label={`Re-apply design: ${d.prompt}`}
                          title={d.prompt}
                          className={cn("h-14 w-14 overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:border-[#e8481c]", focusRing)}
                          style={{ borderColor: design.id === d.id ? ORANGE : LINE, background: "#fff" }}
                        >
                          <img src={d.url} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------ mockup */}
              <div className="flex flex-col gap-4 rounded-3xl border p-6" style={{ borderColor: LINE, background: CARD }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div role="group" aria-label="Shirt colour" className="flex items-center gap-2">
                    {SHIRTS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={shirt.id === s.id}
                        aria-label={`${s.name} shirt`}
                        onClick={() => setShirt(s)}
                        className={cn("h-7 w-7 rounded-full border-2 transition-transform hover:scale-110", focusRing)}
                        style={{ background: s.hex, borderColor: shirt.id === s.id ? ORANGE : "rgba(27,25,23,0.25)", transform: shirt.id === s.id ? "scale(1.15)" : undefined }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
                    {shirt.name} · heavyweight 240 gsm
                  </span>
                </div>

                {/* the tee */}
                <div className="relative mx-auto w-full max-w-md select-none">
                  <svg ref={svgRef} viewBox={`0 0 ${TEE_W} ${TEE_H}`} className="w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${shirt.name} t-shirt mockup with the design “${design.prompt}” on the chest`}>
                    <TeePaths color={shirt} />
                  </svg>
                  {/* print zone overlay */}
                  <div
                    ref={zoneRef}
                    aria-hidden="true"
                    className="absolute"
                    style={{
                      left: `${(ZONE.x / TEE_W) * 100}%`,
                      top: `${(ZONE.y / TEE_H) * 100}%`,
                      width: `${(ZONE.w / TEE_W) * 100}%`,
                      height: `${(ZONE.h / TEE_H) * 100}%`,
                    }}
                  >
                    {/* white DTG underbase so dark-ink art prints true on dark tees */}
                    {shirt.dark && (
                      <div
                        aria-hidden="true"
                        className="absolute rounded-lg"
                        style={{
                          left: `${((printX - ZONE.x) / ZONE.w) * 100}%`,
                          top: `${((printY - ZONE.y) / ZONE.h) * 100}%`,
                          width: `${(printW / ZONE.w) * 100}%`,
                          aspectRatio: "1 / 1",
                          background: "#f6f4ef",
                        }}
                      />
                    )}
                    <motion.img
                      key={design.id}
                      src={design.url}
                      alt=""
                      draggable={false}
                      onPointerDown={onDragStart}
                      onPointerMove={onDragMove}
                      onPointerUp={onDragEnd}
                      onPointerCancel={onDragEnd}
                      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="absolute cursor-grab touch-none active:cursor-grabbing"
                      style={{
                        left: `${((printX - ZONE.x) / ZONE.w) * 100}%`,
                        top: `${((printY - ZONE.y) / ZONE.h) * 100}%`,
                        width: `${(printW / ZONE.w) * 100}%`,
                        mixBlendMode: shirt.dark ? "normal" : "multiply",
                        opacity: shirt.dark ? 1 : 0.96,
                        filter: shirt.dark ? "brightness(1.02)" : undefined,
                      }}
                    />
                    {busy && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed" style={{ borderColor: ORANGE, background: "rgba(247,245,240,0.55)" }}>
                        <span className="flex items-center gap-2 text-xs font-bold" style={{ fontFamily: MONO, color: ORANGE }}>
                          <Loader2 size={14} className="animate-spin" aria-hidden="true" /> PRESSING…
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* placement + actions */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pp-scale" className="flex justify-between text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUTE }}>
                      <span>Print size</span>
                      <span style={{ color: INK }}>{Math.round(scale * 100)}%</span>
                    </label>
                    <input
                      id="pp-scale"
                      type="range"
                      min={0.5}
                      max={1.1}
                      step={0.02}
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="pp-range w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pp-pos" className="flex justify-between text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUTE }}>
                      <span>Height on chest</span>
                      <span style={{ color: INK }}>{offsetY <= 0 ? "high" : offsetY > 35 ? "low" : "classic"}</span>
                    </label>
                    <input
                      id="pp-pos"
                      type="range"
                      min={-30}
                      max={60}
                      step={2}
                      value={offsetY}
                      onChange={(e) => setOffsetY(Number(e.target.value))}
                      className="pp-range w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4" style={{ borderColor: LINE }}>
                  <div role="group" aria-label="Size" className="flex items-center gap-1.5">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={size === s}
                        onClick={() => setSize(s)}
                        className={cn("min-w-9 rounded-lg border px-2 py-1.5 text-xs font-bold", focusRing)}
                        style={{
                          fontFamily: MONO,
                          color: size === s ? "#fff" : INK,
                          background: size === s ? INK : "transparent",
                          borderColor: size === s ? INK : LINE,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void downloadMockup()}
                      className={cn("inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors hover:border-[#e8481c] hover:text-[#e8481c]", focusRing)}
                      style={{ borderColor: LINE, color: INK, fontFamily: MONO }}
                    >
                      <Download size={14} aria-hidden="true" /> Mockup
                    </button>
                    <Magnetic strength={0.2}>
                      <button
                        type="button"
                        onClick={addToCart}
                        className={cn("inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.03]", focusRing)}
                        style={{ background: INK, color: "#f4f2ee", fontFamily: DISPLAY }}
                      >
                        <ShoppingBag size={15} aria-hidden="true" /> Add — ${PRICE}
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------ how */}
          <section id="how" className="scroll-mt-20 border-y" style={{ borderColor: LINE, background: CARD }}>
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3 md:px-6">
              {[
                ["01 — Say the thing", "“A heron in a leather jacket.” “Sisyphus but the boulder is a washing machine.” If you can type it, the press can draw it."],
                ["02 — Dial it in", "Six shirt colours, print size and height, style presets from ukiyo-e to cyberpunk. Re-run the prompt until it feels right — takes are free."],
                ["03 — Wear the bit", "Heavyweight 240 gsm cotton, water-based inks, printed to order. Or just download the mockup and enjoy the idea for free. We get it."],
              ].map(([t, b], i) => (
                <Reveal key={t} delay={i * 0.07}>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                      {t}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: MUTE }}>
                      {b}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------- wall */}
          <section id="wall" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 md:px-6">
            <Reveal>
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-4xl md:text-5xl" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                  The wall.
                </h2>
                <p className="max-w-sm text-sm leading-relaxed" style={{ color: MUTE }}>
                  House designs and whatever you&rsquo;ve pressed this session.
                  Click any tee to load it in the studio.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[...history.slice(0, 6), ...STARTERS.map((s) => ({ id: `starter-${s.id}`, url: s.url, prompt: s.name, engine: "starter" }))]
                .slice(0, 12)
                .map((d, i) => {
                  const tee = SHIRTS[i % SHIRTS.length]
                  return (
                    <Reveal key={d.id} delay={(i % 6) * 0.05}>
                      <button
                        type="button"
                        onClick={() => {
                          setDesign(d)
                          setShirt(tee)
                          document.getElementById("studio")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
                        }}
                        aria-label={`Load “${d.prompt}” on a ${tee.name} tee in the studio`}
                        className={cn("group w-full rounded-2xl border p-3 transition-all hover:-translate-y-1 hover:shadow-lg", focusRing)}
                        style={{ borderColor: LINE, background: CARD }}
                      >
                        <div className="relative">
                          <svg viewBox={`0 0 ${TEE_W} ${TEE_H}`} className="w-full" aria-hidden="true">
                            <TeePaths color={tee} />
                          </svg>
                          {tee.dark && (
                            <div
                              aria-hidden="true"
                              className="absolute rounded-md"
                              style={{
                                left: `${(ZONE.x / TEE_W) * 100}%`,
                                top: `${((ZONE.y + 10) / TEE_H) * 100}%`,
                                width: `${(ZONE.w / TEE_W) * 100}%`,
                                aspectRatio: "1 / 1",
                                background: "#f6f4ef",
                              }}
                            />
                          )}
                          <img
                            src={d.url}
                            alt=""
                            className="absolute"
                            style={{
                              left: `${(ZONE.x / TEE_W) * 100}%`,
                              top: `${((ZONE.y + 10) / TEE_H) * 100}%`,
                              width: `${(ZONE.w / TEE_W) * 100}%`,
                              mixBlendMode: tee.dark ? "normal" : "multiply",
                              opacity: tee.dark ? 1 : 0.95,
                            }}
                          />
                        </div>
                        <p className="mt-2 truncate text-center text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
                          {d.prompt}
                        </p>
                      </button>
                    </Reveal>
                  )
                })}
            </div>
          </section>

          {/* ------------------------------------------------------ faq */}
          <section id="faq" className="scroll-mt-20 border-t" style={{ borderColor: LINE, background: CARD }}>
            <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 px-4 py-16 md:grid-cols-2 md:px-6">
              {[
                ["Is this a real shop?", "It's a working concept: the studio, engines, cart and mockups are all real; the checkout stops just short of taking anyone's money. Think of it as a shop rehearsing."],
                ["Which engine should I use?", "The free engine (Pollinations) needs no key and is great for drafts. Paste an OpenAI key in Engine settings for sharper art and transparent backgrounds — your key stays in your browser."],
                ["Who owns the design?", "You prompted it, you keep it. Download the mockup, or the raw graphic via your browser. We store nothing server-side — there is no server."],
                ["What would the shirts be like?", "240 gsm heavyweight cotton, relaxed cut, water-based DTG inks, printed on demand — the boring-but-correct answers. The possum is machine-washable."],
              ].map(([q, a]) => (
                <div key={q} className="flex flex-col gap-2">
                  <h3 className="text-base font-bold" style={{ fontFamily: DISPLAY }}>
                    {q}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTE }}>
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------ footer */}
          <footer className="border-t" style={{ borderColor: LINE }}>
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-xs uppercase tracking-[0.18em] md:px-6" style={{ fontFamily: MONO, color: MUTE }}>
              <span>© 2026 Prompt &amp; Press — a concept store</span>
              <span>Generated art may be weird · that&rsquo;s the point</span>
            </div>
          </footer>
        </main>

        {/* ------------------------------------------------ engine dialog */}
        <AnimatePresence>
          {engineOpen && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Engine settings">
              <button aria-label="Close" className="absolute inset-0 cursor-default backdrop-blur-[2px]" style={{ background: "rgba(27,25,23,0.45)" }} onClick={() => setEngineOpen(false)} />
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="relative w-full max-w-md rounded-3xl border p-6 shadow-2xl"
                style={{ borderColor: LINE, background: CARD }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold" style={{ fontFamily: DISPLAY }}>
                    <Settings2 size={16} style={{ color: ORANGE }} aria-hidden="true" /> The press engine
                  </h3>
                  <button onClick={() => setEngineOpen(false)} aria-label="Close" className={cn("rounded p-1", focusRing)} style={{ color: MUTE }}>
                    <X size={16} />
                  </button>
                </div>
                <div role="radiogroup" aria-label="Generation engine" className="flex flex-col gap-2">
                  <label
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border p-4"
                    style={{ borderColor: engine === "pollinations" ? ORANGE : LINE, background: engine === "pollinations" ? "rgba(232,72,28,0.05)" : "transparent" }}
                  >
                    <input type="radio" name="engine" checked={engine === "pollinations"} onChange={() => setEngine("pollinations")} className="mt-1 accent-[#e8481c]" />
                    <span>
                      <span className="block text-sm font-bold" style={{ color: INK }}>
                        Free engine <span className="font-normal" style={{ color: MUTE }}>(Pollinations)</span>
                      </span>
                      <span className="block text-xs leading-relaxed" style={{ color: MUTE }}>
                        No key, no signup. Community GPUs — occasionally slow or moody at peak times.
                      </span>
                    </span>
                  </label>
                  <label
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border p-4"
                    style={{ borderColor: engine === "openai" ? ORANGE : LINE, background: engine === "openai" ? "rgba(232,72,28,0.05)" : "transparent" }}
                  >
                    <input type="radio" name="engine" checked={engine === "openai"} onChange={() => setEngine("openai")} className="mt-1 accent-[#e8481c]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold" style={{ color: INK }}>
                        OpenAI <span className="font-normal" style={{ color: MUTE }}>(gpt-image-1 · your key)</span>
                      </span>
                      <span className="block text-xs leading-relaxed" style={{ color: MUTE }}>
                        Sharper art, follows prompts closely, supports transparent backgrounds. ~4¢ per image, billed
                        to your key — which never leaves this browser.
                      </span>
                    </span>
                  </label>
                </div>
                {engine === "openai" && (
                  <div className="mt-3 flex flex-col gap-3">
                    <label htmlFor="pp-key" className="sr-only">
                      OpenAI API key
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border px-4" style={{ borderColor: LINE }}>
                      <KeyRound size={14} style={{ color: MUTE }} aria-hidden="true" />
                      <input
                        id="pp-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value.trim())}
                        placeholder="sk-…"
                        className="w-full bg-transparent py-2.5 text-sm outline-none"
                        style={{ fontFamily: MONO, color: INK }}
                      />
                      {apiKey && <Check size={14} style={{ color: "#1e7d3c" }} aria-hidden="true" />}
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK }}>
                      <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="accent-[#e8481c]" />
                      Transparent background <span className="text-xs" style={{ color: MUTE }}>(prints cleaner on coloured tees)</span>
                    </label>
                  </div>
                )}
                <button
                  onClick={() => setEngineOpen(false)}
                  className={cn("mt-4 w-full rounded-full py-2.5 text-sm font-bold", focusRing)}
                  style={{ background: INK, color: "#f4f2ee", fontFamily: DISPLAY }}
                >
                  Done
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* -------------------------------------------------- cart drawer */}
        <AnimatePresence>
          {cartOpen && (
            <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Cart">
              <button aria-label="Close cart" className="absolute inset-0 cursor-default backdrop-blur-[2px]" style={{ background: "rgba(27,25,23,0.45)" }} onClick={() => setCartOpen(false)} />
              <motion.aside
                initial={reduced ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l"
                style={{ background: CARD, borderColor: LINE }}
              >
                <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: LINE }}>
                  <h3 className="text-lg font-bold" style={{ fontFamily: DISPLAY }}>
                    Your press run ({cartCount})
                  </h3>
                  <button onClick={() => setCartOpen(false)} aria-label="Close cart" className={cn("rounded p-1", focusRing)} style={{ color: MUTE }}>
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {cart.length === 0 && !ordered && (
                    <p className="py-10 text-center text-sm" style={{ color: MUTE }}>
                      Nothing here yet. Print something upstairs.
                    </p>
                  )}
                  {ordered && (
                    <div className="mb-4 rounded-2xl border p-4 text-sm leading-relaxed" style={{ borderColor: "rgba(30,125,60,0.4)", background: "rgba(30,125,60,0.07)", color: "#1e7d3c" }} role="status">
                      Order “placed”. This is a concept store, so no money moved and no possum was printed —
                      but the mockups are yours to download, and honestly, frame-worthy.
                    </div>
                  )}
                  <ul className="flex flex-col gap-3">
                    {cart.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: LINE }}>
                        <div className="relative h-20 w-16 shrink-0">
                          <svg viewBox={`0 0 ${TEE_W} ${TEE_H}`} className="h-full w-full" aria-hidden="true">
                            <TeePaths color={item.color} />
                          </svg>
                          {item.color.dark && (
                            <div aria-hidden="true" className="absolute rounded-sm" style={{ left: "33%", top: "33%", width: "36%", aspectRatio: "1 / 1", background: "#f6f4ef" }} />
                          )}
                          <img
                            src={item.design.url}
                            alt=""
                            className="absolute"
                            style={{
                              left: "33%",
                              top: "33%",
                              width: "36%",
                              mixBlendMode: item.color.dark ? "normal" : "multiply",
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold" style={{ color: INK }}>
                            {item.design.prompt}
                          </p>
                          <p className="text-xs" style={{ fontFamily: MONO, color: MUTE }}>
                            {item.color.name} · {item.size} · ${PRICE}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => setCart((c) => c.map((i) => (i === item ? { ...i, qty: Math.max(1, i.qty - 1) } : i)))}
                              className={cn("rounded-md border p-1", focusRing)}
                              style={{ borderColor: LINE, color: MUTE }}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="min-w-5 text-center text-sm tabular-nums" style={{ fontFamily: MONO }}>
                              {item.qty}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => setCart((c) => c.map((i) => (i === item ? { ...i, qty: i.qty + 1 } : i)))}
                              className={cn("rounded-md border p-1", focusRing)}
                              style={{ borderColor: LINE, color: MUTE }}
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              aria-label={`Remove ${item.design.prompt}`}
                              onClick={() => setCart((c) => c.filter((i) => i !== item))}
                              className={cn("ml-auto rounded-md p-1", focusRing)}
                              style={{ color: "#b3261e" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {cart.length > 0 && (
                  <div className="border-t px-6 py-4" style={{ borderColor: LINE }}>
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span style={{ color: MUTE }}>Subtotal · shipping on the house (it&rsquo;s imaginary)</span>
                      <span className="text-lg font-bold tabular-nums" style={{ fontFamily: MONO }}>
                        ${cartTotal}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setOrdered(true)
                        setCart([])
                      }}
                      className={cn("w-full rounded-full py-3 text-base font-bold transition-transform hover:scale-[1.01]", focusRing)}
                      style={{ background: ORANGE, color: "#fff", fontFamily: DISPLAY }}
                    >
                      Checkout — concept mode
                    </button>
                  </div>
                )}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        <Toast msg={toast} />

        <style>{`
          .pp-range { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; background: rgba(27,25,23,0.18); }
          .pp-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%;
            background: ${ORANGE}; border: 3px solid ${CARD}; box-shadow: 0 0 0 1px ${ORANGE}; cursor: ew-resize; }
          .pp-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: ${ORANGE};
            border: 3px solid ${CARD}; box-shadow: 0 0 0 1px ${ORANGE}; cursor: ew-resize; }
          .pp-range:focus-visible { outline: 2px solid ${ORANGE}; outline-offset: 4px; }
        `}</style>
      </div>
    </MotionConfig>
  )
}
