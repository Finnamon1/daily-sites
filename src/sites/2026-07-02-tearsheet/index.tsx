import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { MotionConfig, motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Command,
  KeyRound,
  Minus,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "TEARSHEET — public-company intelligence",
  description:
    "A fundamentals terminal for public companies. Ships with a hand-compiled fiscal-year snapshot of ten majors — revenue, margins, free cash flow, share count, segments — and computes its own analysis: an insight engine that writes observations from the numbers, five health flags per company, an income-statement waterfall, margin history, segment mix, a peer map of growth versus margin, and a sortable screener with sparklines. Command-palette ticker switching (⌘K), hover tooltips on every chart with table fallbacks, and a bring-your-own-key panel: paste a free Financial Modeling Prep API key and it pulls live statements for any ticker, falling back to the snapshot gracefully.",
  date: "2026-07-02",
  type: "Fintech product / analytics terminal",
  interaction:
    "A working fundamentals terminal — ⌘K command-palette ticker switching, a computed insight engine and health flags, income-statement waterfall, margin history, segment mix, peer scatter and sortable screener, all with hover layers; optional live data via a bring-your-own Financial Modeling Prep key.",
}

/* --------------------------------------------------------------- palette */
// paper terminal: warm off-white surface, near-black ink, ONE working accent
// (market blue). Chart series + status colours validated against the surface.
const PAPER = "#f5f5f2"
const CARD = "#ffffff"
const INK = "#171a20" // ~15:1 on card
const MUTE = "#5c6370" // ~6.5:1 on card
const LINE = "rgba(23,26,32,0.11)"
const BLUE = "#3355e8" // accent + single-series colour
const GREEN = "#0e8a68" // series 2 / positive deltas
const AMBER = "#c96f1f" // series 3
const GOOD = "#1e7d3c"
const WARN = "#b45309"
const BAD = "#b3261e"

const DISPLAY = "'Space Grotesk', system-ui, sans-serif"
const SANS = "'IBM Plex Sans', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

const cn = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3355e8]"

/* ---------------------------------------------------------------- model */

type FY = {
  label: string
  revenue: number
  grossProfit: number | null
  opInc: number
  netInc: number
  fcf: number
  shares: number // billions, diluted
}

type Segment = { name: string; values: number[]; years: string[] }

type Company = {
  ticker: string
  name: string
  sector: string
  fyNote: string
  blurb: string
  years: FY[]
  segments: Segment[] | null
  cash: number
  debt: number
  live?: boolean
}

/* ------------------------------------------------------------- snapshot
   Hand-compiled, approximate fiscal-year figures (USD billions) through each
   company's last reported year as of the snapshot date. For orientation and
   demo purposes — not a data feed and not investment advice. */

const SNAPSHOT: Company[] = [
  {
    ticker: "AAPL",
    name: "Apple",
    sector: "Consumer tech",
    fyNote: "FY ends late Sep",
    blurb: "Hardware gross profit machine steadily re-rating into a services annuity.",
    years: [
      { label: "FY21", revenue: 365.8, grossProfit: 152.8, opInc: 108.9, netInc: 94.7, fcf: 92.9, shares: 16.86 },
      { label: "FY22", revenue: 394.3, grossProfit: 170.8, opInc: 119.4, netInc: 99.8, fcf: 111.4, shares: 16.32 },
      { label: "FY23", revenue: 383.3, grossProfit: 169.1, opInc: 114.3, netInc: 97.0, fcf: 99.6, shares: 15.81 },
      { label: "FY24", revenue: 391.0, grossProfit: 180.7, opInc: 123.2, netInc: 93.7, fcf: 108.8, shares: 15.41 },
      { label: "FY25", revenue: 416.2, grossProfit: 195.5, opInc: 133.0, netInc: 112.0, fcf: 104.0, shares: 14.95 },
    ],
    segments: [
      { name: "iPhone", values: [205.5, 200.6, 201.2, 210.0], years: ["FY22", "FY23", "FY24", "FY25"] },
      { name: "Services", values: [78.1, 85.2, 96.2, 109.2], years: ["FY22", "FY23", "FY24", "FY25"] },
      { name: "Wearables", values: [41.2, 39.8, 37.0, 36.5], years: ["FY22", "FY23", "FY24", "FY25"] },
      { name: "Mac", values: [40.2, 29.4, 30.0, 32.0], years: ["FY22", "FY23", "FY24", "FY25"] },
      { name: "iPad", values: [29.3, 28.3, 26.7, 28.5], years: ["FY22", "FY23", "FY24", "FY25"] },
    ],
    cash: 153,
    debt: 102,
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    sector: "Software & cloud",
    fyNote: "FY ends Jun",
    blurb: "Azure and Copilot demand colliding with an unprecedented capex cycle.",
    years: [
      { label: "FY21", revenue: 168.1, grossProfit: 115.9, opInc: 69.9, netInc: 61.3, fcf: 56.1, shares: 7.61 },
      { label: "FY22", revenue: 198.3, grossProfit: 135.6, opInc: 83.4, netInc: 72.7, fcf: 65.1, shares: 7.54 },
      { label: "FY23", revenue: 211.9, grossProfit: 146.1, opInc: 88.5, netInc: 72.4, fcf: 59.5, shares: 7.47 },
      { label: "FY24", revenue: 245.1, grossProfit: 171.0, opInc: 109.4, netInc: 88.1, fcf: 74.1, shares: 7.47 },
      { label: "FY25", revenue: 281.7, grossProfit: 193.9, opInc: 128.5, netInc: 101.8, fcf: 71.6, shares: 7.46 },
    ],
    segments: [
      { name: "Intelligent Cloud", values: [74.9, 87.9, 105.4, 141.7], years: ["FY22", "FY23", "FY24", "FY25"] },
      { name: "Productivity", values: [63.4, 69.3, 77.7, 86.3], years: ["FY22", "FY23", "FY24", "FY25"] },
      { name: "Personal Computing", values: [60.0, 54.7, 62.0, 53.7], years: ["FY22", "FY23", "FY24", "FY25"] },
    ],
    cash: 94,
    debt: 52,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    sector: "Semiconductors",
    fyNote: "FY ends late Jan",
    blurb: "The data-centre buildout's toll booth; the steepest revenue ramp in large-cap history.",
    years: [
      { label: "FY22", revenue: 26.9, grossProfit: 17.5, opInc: 10.0, netInc: 9.8, fcf: 8.1, shares: 2.53 },
      { label: "FY23", revenue: 27.0, grossProfit: 15.4, opInc: 4.2, netInc: 4.4, fcf: 3.8, shares: 2.51 },
      { label: "FY24", revenue: 60.9, grossProfit: 44.3, opInc: 33.0, netInc: 29.8, fcf: 27.0, shares: 2.49 },
      { label: "FY25", revenue: 130.5, grossProfit: 97.9, opInc: 81.5, netInc: 72.9, fcf: 60.9, shares: 2.49 },
    ],
    segments: [
      { name: "Data Center", values: [15.0, 47.5, 115.2], years: ["FY23", "FY24", "FY25"] },
      { name: "Gaming", values: [9.1, 10.4, 11.4], years: ["FY23", "FY24", "FY25"] },
      { name: "Pro Visualization", values: [1.5, 1.6, 1.9], years: ["FY23", "FY24", "FY25"] },
      { name: "Automotive", values: [0.9, 1.1, 1.7], years: ["FY23", "FY24", "FY25"] },
    ],
    cash: 43,
    debt: 10,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet",
    sector: "Internet & cloud",
    fyNote: "Calendar FY",
    blurb: "Search cash machine funding a genuine number-three cloud and a lot of bets.",
    years: [
      { label: "FY21", revenue: 257.6, grossProfit: 146.7, opInc: 78.7, netInc: 76.0, fcf: 67.0, shares: 13.55 },
      { label: "FY22", revenue: 282.8, grossProfit: 156.6, opInc: 74.8, netInc: 60.0, fcf: 60.0, shares: 13.16 },
      { label: "FY23", revenue: 307.4, grossProfit: 174.1, opInc: 84.3, netInc: 73.8, fcf: 69.5, shares: 12.72 },
      { label: "FY24", revenue: 350.0, grossProfit: 203.7, opInc: 112.4, netInc: 100.1, fcf: 72.8, shares: 12.45 },
    ],
    segments: [
      { name: "Search", values: [162.5, 175.0, 198.1], years: ["FY22", "FY23", "FY24"] },
      { name: "Cloud", values: [26.3, 33.1, 43.2], years: ["FY22", "FY23", "FY24"] },
      { name: "Subs & devices", values: [29.1, 34.7, 40.3], years: ["FY22", "FY23", "FY24"] },
      { name: "YouTube ads", values: [29.2, 31.5, 36.1], years: ["FY22", "FY23", "FY24"] },
      { name: "Network & other", values: [33.9, 32.8, 32.0], years: ["FY22", "FY23", "FY24"] },
    ],
    cash: 96,
    debt: 13,
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    sector: "E-commerce & cloud",
    fyNote: "Calendar FY",
    blurb: "Retail at cost, AWS at margin — the spread between them is the whole story.",
    years: [
      { label: "FY21", revenue: 469.8, grossProfit: 197.3, opInc: 24.9, netInc: 33.4, fcf: -9.1, shares: 10.3 },
      { label: "FY22", revenue: 514.0, grossProfit: 225.2, opInc: 12.2, netInc: -2.7, fcf: -11.6, shares: 10.24 },
      { label: "FY23", revenue: 574.8, grossProfit: 270.0, opInc: 36.9, netInc: 30.4, fcf: 36.8, shares: 10.49 },
      { label: "FY24", revenue: 638.0, grossProfit: 311.7, opInc: 68.6, netInc: 59.2, fcf: 38.2, shares: 10.72 },
    ],
    segments: [
      { name: "North America", values: [315.9, 352.8, 387.5], years: ["FY22", "FY23", "FY24"] },
      { name: "International", values: [118.0, 131.2, 142.9], years: ["FY22", "FY23", "FY24"] },
      { name: "AWS", values: [80.1, 90.8, 107.6], years: ["FY22", "FY23", "FY24"] },
    ],
    cash: 101,
    debt: 55,
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    sector: "Social & advertising",
    fyNote: "Calendar FY",
    blurb: "An ads juggernaut that took a discipline year in 2022 and never looked back.",
    years: [
      { label: "FY21", revenue: 117.9, grossProfit: 95.3, opInc: 46.8, netInc: 39.4, fcf: 39.1, shares: 2.91 },
      { label: "FY22", revenue: 116.6, grossProfit: 91.4, opInc: 28.9, netInc: 23.2, fcf: 19.0, shares: 2.76 },
      { label: "FY23", revenue: 134.9, grossProfit: 108.9, opInc: 46.8, netInc: 39.1, fcf: 44.0, shares: 2.63 },
      { label: "FY24", revenue: 164.5, grossProfit: 134.7, opInc: 69.4, netInc: 62.4, fcf: 54.1, shares: 2.61 },
    ],
    segments: [
      { name: "Family of Apps", values: [114.5, 133.0, 162.4], years: ["FY22", "FY23", "FY24"] },
      { name: "Reality Labs", values: [2.2, 1.9, 2.1], years: ["FY22", "FY23", "FY24"] },
    ],
    cash: 77,
    debt: 29,
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    sector: "Autos & energy",
    fyNote: "Calendar FY",
    blurb: "Auto margins round-tripped to industry-normal while the energy business quietly compounds.",
    years: [
      { label: "FY21", revenue: 53.8, grossProfit: 13.6, opInc: 6.5, netInc: 5.5, fcf: 5.0, shares: 3.39 },
      { label: "FY22", revenue: 81.5, grossProfit: 17.7, opInc: 13.7, netInc: 12.6, fcf: 7.6, shares: 3.48 },
      { label: "FY23", revenue: 96.8, grossProfit: 17.7, opInc: 8.9, netInc: 15.0, fcf: 4.4, shares: 3.49 },
      { label: "FY24", revenue: 97.7, grossProfit: 17.5, opInc: 7.1, netInc: 7.1, fcf: 3.6, shares: 3.51 },
    ],
    segments: [
      { name: "Automotive", values: [71.5, 82.4, 77.1], years: ["FY22", "FY23", "FY24"] },
      { name: "Energy", values: [3.9, 6.0, 10.1], years: ["FY22", "FY23", "FY24"] },
      { name: "Services & other", values: [6.1, 8.3, 10.5], years: ["FY22", "FY23", "FY24"] },
    ],
    cash: 37,
    debt: 8,
  },
  {
    ticker: "COST",
    name: "Costco",
    sector: "Retail",
    fyNote: "FY ends Aug/Sep",
    blurb: "Sells merchandise at cost; the membership fee is the profit line, and it renews at 90%+.",
    years: [
      { label: "FY21", revenue: 195.9, grossProfit: 25.2, opInc: 6.7, netInc: 5.0, fcf: 6.9, shares: 0.445 },
      { label: "FY22", revenue: 227.0, grossProfit: 28.3, opInc: 7.8, netInc: 5.8, fcf: 3.5, shares: 0.444 },
      { label: "FY23", revenue: 242.3, grossProfit: 29.7, opInc: 8.1, netInc: 6.3, fcf: 6.7, shares: 0.444 },
      { label: "FY24", revenue: 254.5, grossProfit: 32.1, opInc: 9.3, netInc: 7.4, fcf: 6.6, shares: 0.444 },
      { label: "FY25", revenue: 275.2, grossProfit: 34.8, opInc: 10.1, netInc: 8.1, fcf: 7.0, shares: 0.444 },
    ],
    segments: [
      { name: "Merchandise", values: [222.4, 237.7, 249.2, 269.9], years: ["FY22", "FY23", "FY24", "FY25"] },
      { name: "Membership fees", values: [4.6, 4.6, 5.3, 5.3], years: ["FY22", "FY23", "FY24", "FY25"] },
    ],
    cash: 15,
    debt: 8,
  },
  {
    ticker: "NFLX",
    name: "Netflix",
    sector: "Streaming media",
    fyNote: "Calendar FY",
    blurb: "Post-password-crackdown, ads tier scaling — margins tell the whole turnaround.",
    years: [
      { label: "FY21", revenue: 29.7, grossProfit: 12.4, opInc: 6.2, netInc: 5.1, fcf: -0.2, shares: 0.455 },
      { label: "FY22", revenue: 31.6, grossProfit: 12.4, opInc: 5.6, netInc: 4.5, fcf: 1.6, shares: 0.451 },
      { label: "FY23", revenue: 33.7, grossProfit: 14.0, opInc: 7.0, netInc: 5.4, fcf: 6.9, shares: 0.45 },
      { label: "FY24", revenue: 39.0, grossProfit: 18.0, opInc: 10.4, netInc: 8.7, fcf: 6.9, shares: 0.437 },
    ],
    segments: [
      { name: "UCAN", values: [14.1, 14.9, 17.4], years: ["FY22", "FY23", "FY24"] },
      { name: "EMEA", values: [9.7, 10.6, 12.4], years: ["FY22", "FY23", "FY24"] },
      { name: "LATAM", values: [4.1, 4.4, 4.8], years: ["FY22", "FY23", "FY24"] },
      { name: "APAC", values: [3.6, 3.8, 4.4], years: ["FY22", "FY23", "FY24"] },
    ],
    cash: 9,
    debt: 16,
  },
  {
    ticker: "XOM",
    name: "ExxonMobil",
    sector: "Energy",
    fyNote: "Calendar FY",
    blurb: "A cyclical cash engine — watch the share count and the commodity, not the margin trend.",
    years: [
      { label: "FY21", revenue: 285.6, grossProfit: null, opInc: 23.0, netInc: 23.0, fcf: 36.1, shares: 4.27 },
      { label: "FY22", revenue: 413.7, grossProfit: null, opInc: 64.4, netInc: 55.7, fcf: 62.1, shares: 4.19 },
      { label: "FY23", revenue: 344.6, grossProfit: null, opInc: 44.5, netInc: 36.0, fcf: 33.4, shares: 4.03 },
      { label: "FY24", revenue: 339.2, grossProfit: null, opInc: 39.7, netInc: 33.7, fcf: 30.7, shares: 4.44 },
    ],
    segments: null,
    cash: 23,
    debt: 42,
  },
]

const AS_OF = "Snapshot · last reported FYs as of Oct 2025"

/* -------------------------------------------------------------- helpers */

const fmtB = (v: number) =>
  `${v < 0 ? "−" : ""}$${Math.abs(v) >= 100 ? Math.abs(v).toFixed(0) : Math.abs(v).toFixed(1)}B`
const fmtPct = (v: number, dp = 1) => `${v >= 0 ? "" : "−"}${Math.abs(v).toFixed(dp)}%`
const pct = (a: number, b: number) => (b === 0 ? 0 : (a / b) * 100)

const last = <T,>(a: T[]) => a[a.length - 1]

function yoy(c: Company): number {
  const n = c.years.length
  return n < 2 ? 0 : pct(c.years[n - 1].revenue - c.years[n - 2].revenue, c.years[n - 2].revenue)
}
function cagr(c: Company, span = 3): number | null {
  const n = c.years.length
  if (n < span + 1) return null
  const a = c.years[n - 1 - span].revenue
  const b = c.years[n - 1].revenue
  if (a <= 0) return null
  return (Math.pow(b / a, 1 / span) - 1) * 100
}
const opMargin = (fy: FY) => pct(fy.opInc, fy.revenue)
const fcfMargin = (fy: FY) => pct(fy.fcf, fy.revenue)

type Tone = "up" | "down" | "flat"
type Insight = { tag: string; text: string; tone: Tone }

function buildInsights(c: Company): Insight[] {
  const out: Insight[] = []
  const n = c.years.length
  const L = last(c.years)
  const g1 = yoy(c)
  const g3 = cagr(c, Math.min(3, n - 1))

  if (g3 !== null) {
    const diff = g1 - g3
    if (Math.abs(diff) < 3)
      out.push({ tag: "Growth", tone: "flat", text: `Growth is steady: ${fmtPct(g1)} last year vs a ${fmtPct(g3)} three-year compound rate.` })
    else if (diff > 0)
      out.push({ tag: "Growth", tone: "up", text: `Growth is accelerating — ${fmtPct(g1)} last year against a ${fmtPct(g3)} three-year compound rate.` })
    else
      out.push({ tag: "Growth", tone: "down", text: `Growth is decelerating — ${fmtPct(g1)} last year vs ${fmtPct(g3)} compounded over three.` })
  }

  if (n >= 3) {
    const d = (opMargin(L) - opMargin(c.years[n - 3])) * 100
    if (Math.abs(d) >= 60)
      out.push({
        tag: "Margins",
        tone: d > 0 ? "up" : "down",
        text: `Operating margin ${d > 0 ? "expanded" : "compressed"} ${Math.abs(Math.round(d)).toLocaleString()} bps over two years, to ${fmtPct(opMargin(L))}.`,
      })
    else out.push({ tag: "Margins", tone: "flat", text: `Operating margin has held near ${fmtPct(opMargin(L))} for two years.` })
  }

  if (L.netInc > 0) {
    const conv = pct(L.fcf, L.netInc)
    out.push({
      tag: "Cash",
      tone: conv >= 80 ? "up" : conv >= 50 ? "flat" : "down",
      text:
        conv >= 100
          ? `Free cash flow ran ahead of net income last year (${fmtPct(conv, 0)} conversion) — earnings are cash-backed.`
          : `Free cash flow converted ${fmtPct(conv, 0)} of net income last year${conv < 50 ? " — check where the cash is going (capex, working capital)" : ""}.`,
    })
  } else {
    out.push({ tag: "Cash", tone: "down", text: `Reported net income was negative last year; free cash flow was ${fmtB(L.fcf)}.` })
  }

  if (n >= 4) {
    const d = pct(L.shares - c.years[n - 4].shares, c.years[n - 4].shares)
    if (d <= -1)
      out.push({ tag: "Capital return", tone: "up", text: `Buybacks retired ${fmtPct(Math.abs(d))} of the share count over three years.` })
    else if (d >= 1.5)
      out.push({ tag: "Capital return", tone: "down", text: `Share count grew ${fmtPct(d)} over three years — dilution (or deal stock) is working against holders.` })
  }

  const net = c.cash - c.debt
  out.push({
    tag: "Balance sheet",
    tone: net >= 0 ? "up" : "flat",
    text: net >= 0 ? `Net cash position of ${fmtB(net)} (cash ${fmtB(c.cash)} vs debt ${fmtB(c.debt)}).` : `Carries net debt of ${fmtB(Math.abs(net))} — serviceable, but it isn't a fortress balance sheet.`,
  })

  if (c.segments && c.segments.length >= 2) {
    const segs = c.segments
    const latestTotal = segs.reduce((s, x) => s + last(x.values), 0)
    const top = [...segs].sort((a, b) => last(b.values) - last(a.values))[0]
    const share = pct(last(top.values), latestTotal)
    const firstTotal = segs.reduce((s, x) => s + x.values[0], 0)
    const shareThen = pct(top.values[0], firstTotal)
    const drift = share - shareThen
    if (Math.abs(drift) >= 2)
      out.push({
        tag: "Mix",
        tone: "flat",
        text: `${top.name} is now ${fmtPct(share, 0)} of revenue, ${drift > 0 ? "up" : "down"} from ${fmtPct(shareThen, 0)} — the mix is ${drift > 0 ? "concentrating" : "diversifying"}.`,
      })
    else out.push({ tag: "Mix", tone: "flat", text: `${top.name} anchors the mix at ${fmtPct(share, 0)} of revenue, roughly unchanged.` })
  }

  return out.slice(0, 6)
}

type Flag = { name: string; status: "good" | "watch" | "risk"; note: string }

function buildFlags(c: Company): Flag[] {
  const n = c.years.length
  const L = last(c.years)
  const g1 = yoy(c)
  const flags: Flag[] = []

  flags.push(
    g1 >= 8
      ? { name: "Growth", status: "good", note: `${fmtPct(g1)} YoY` }
      : g1 >= 0
        ? { name: "Growth", status: "watch", note: `${fmtPct(g1)} YoY` }
        : { name: "Growth", status: "risk", note: `${fmtPct(g1)} YoY` },
  )

  const d = n >= 3 ? (opMargin(L) - opMargin(c.years[n - 3])) * 100 : 0
  flags.push(
    d >= 50
      ? { name: "Margin trend", status: "good", note: `+${Math.round(d)} bps / 2y` }
      : d > -150
        ? { name: "Margin trend", status: "watch", note: `${Math.round(d)} bps / 2y` }
        : { name: "Margin trend", status: "risk", note: `${Math.round(d)} bps / 2y` },
  )

  const conv = L.netInc > 0 ? pct(L.fcf, L.netInc) : -1
  flags.push(
    conv >= 80
      ? { name: "Cash conversion", status: "good", note: `${Math.round(conv)}% of NI` }
      : conv >= 40
        ? { name: "Cash conversion", status: "watch", note: `${Math.round(conv)}% of NI` }
        : { name: "Cash conversion", status: "risk", note: conv < 0 ? "negative NI" : `${Math.round(conv)}% of NI` },
  )

  const net = c.cash - c.debt
  flags.push(
    net >= 0
      ? { name: "Balance sheet", status: "good", note: `net cash ${fmtB(net)}` }
      : Math.abs(net) < L.fcf * 3
        ? { name: "Balance sheet", status: "watch", note: `net debt ${fmtB(Math.abs(net))}` }
        : { name: "Balance sheet", status: "risk", note: `net debt ${fmtB(Math.abs(net))}` },
  )

  const dil = n >= 4 ? pct(L.shares - c.years[n - 4].shares, c.years[n - 4].shares) : 0
  flags.push(
    dil <= -0.5
      ? { name: "Share count", status: "good", note: `${fmtPct(dil)} / 3y` }
      : dil <= 1.5
        ? { name: "Share count", status: "watch", note: `${fmtPct(dil)} / 3y` }
        : { name: "Share count", status: "risk", note: `+${fmtPct(dil)} / 3y` },
  )

  return flags
}

/* ------------------------------------------------------- chart scaffold */

function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const u = v / p
  return (u <= 1 ? 1 : u <= 2 ? 2 : u <= 2.5 ? 2.5 : u <= 5 ? 5 : 10) * p
}

function useTip() {
  const [tip, setTip] = useState<{ x: number; y: number; lines: string[] } | null>(null)
  return { tip, setTip }
}

function TipBox({ tip }: { tip: { x: number; y: number; lines: string[] } | null }) {
  if (!tip) return null
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border px-3 py-2 shadow-md"
      style={{
        left: tip.x,
        top: Math.max(tip.y - 8, 0),
        transform: "translate(-50%, -100%)",
        background: INK,
        borderColor: "rgba(255,255,255,0.15)",
      }}
    >
      {tip.lines.map((l, i) => (
        <p
          key={i}
          className="whitespace-nowrap text-xs tabular-nums"
          style={{ fontFamily: MONO, color: i === 0 ? "#c8cdd8" : "#fff" }}
        >
          {l}
        </p>
      ))}
    </div>
  )
}

function ChartCard({
  title,
  note,
  children,
  right,
}: {
  title: string
  note?: string
  right?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      className="flex flex-col gap-3 rounded-2xl border p-5"
      style={{ borderColor: LINE, background: CARD }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold" style={{ fontFamily: SANS, color: INK }}>
          {title}
        </h3>
        {right ?? (note ? (
          <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
            {note}
          </span>
        ) : null)}
      </div>
      {children}
    </section>
  )
}

/* --------------------------------------------------------------- charts */

const CW = 520
const CH = 210
const PADL = 46
const PADR = 14
const PADT = 12
const PADB = 26

function RevenueBars({ years }: { years: FY[] }) {
  const { tip, setTip } = useTip()
  const wrap = useRef<HTMLDivElement>(null)
  const max = niceMax(Math.max(...years.map((y) => y.revenue)))
  const innerW = CW - PADL - PADR
  const innerH = CH - PADT - PADB
  const bw = Math.min(52, (innerW / years.length) * 0.55)
  const x = (i: number) => PADL + (innerW / years.length) * (i + 0.5)
  const y = (v: number) => PADT + innerH * (1 - v / max)

  return (
    <div ref={wrap} className="relative">
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label={`Revenue by fiscal year, ${years.map((d) => `${d.label} ${fmtB(d.revenue)}`).join(", ")}`}>
        {[0.5, 1].map((f) => (
          <g key={f}>
            <line x1={PADL} x2={CW - PADR} y1={y(max * f)} y2={y(max * f)} stroke={LINE} strokeWidth={1} />
            <text x={PADL - 8} y={y(max * f) + 4} textAnchor="end" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
              {max * f >= 1000 ? `${(max * f) / 1000}T` : `${max * f}`}
            </text>
          </g>
        ))}
        <line x1={PADL} x2={CW - PADR} y1={y(0)} y2={y(0)} stroke={MUTE} strokeWidth={1} opacity={0.5} />
        {years.map((d, i) => (
          <g key={d.label}>
            <rect
              x={x(i) - bw / 2}
              y={y(Math.max(d.revenue, 0))}
              width={bw}
              height={Math.max(2, Math.abs(y(0) - y(d.revenue)))}
              rx={4}
              fill={BLUE}
              opacity={i === years.length - 1 ? 1 : 0.55}
            />
            <text x={x(i)} y={CH - 8} textAnchor="middle" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
              {d.label}
            </text>
            <rect
              x={x(i) - (innerW / years.length) / 2}
              y={PADT}
              width={innerW / years.length}
              height={innerH}
              fill="transparent"
              onPointerMove={() => {
                const r = wrap.current?.getBoundingClientRect()
                if (!r) return
                setTip({ x: (x(i) / CW) * r.width, y: (y(Math.max(d.revenue, 0)) / CH) * r.height, lines: [d.label, `revenue ${fmtB(d.revenue)}`, i > 0 ? `yoy ${fmtPct(pct(d.revenue - years[i - 1].revenue, years[i - 1].revenue))}` : ""].filter(Boolean) })
              }}
              onPointerLeave={() => setTip(null)}
            />
          </g>
        ))}
        <text x={x(years.length - 1)} y={y(last(years).revenue) - 6} textAnchor="middle" fill={INK} style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}>
          {fmtB(last(years).revenue)}
        </text>
      </svg>
      <TipBox tip={tip} />
    </div>
  )
}

const MARGIN_SERIES = [
  { key: "gross", name: "Gross", color: BLUE, get: (fy: FY) => (fy.grossProfit === null ? null : pct(fy.grossProfit, fy.revenue)) },
  { key: "op", name: "Operating", color: GREEN, get: (fy: FY) => opMargin(fy) },
  { key: "net", name: "Net", color: AMBER, get: (fy: FY) => pct(fy.netInc, fy.revenue) },
]

function MarginLines({ years }: { years: FY[] }) {
  const { tip, setTip } = useTip()
  const wrap = useRef<HTMLDivElement>(null)
  const series = MARGIN_SERIES.map((s) => ({ ...s, pts: years.map((fy) => s.get(fy)) })).filter((s) =>
    s.pts.some((v) => v !== null),
  )
  const all = series.flatMap((s) => s.pts.filter((v): v is number => v !== null))
  const maxV = niceMax(Math.max(...all, 10))
  const minV = Math.min(0, ...all)
  const innerW = CW - PADL - PADR
  const innerH = CH - PADT - PADB
  const x = (i: number) => PADL + (innerW / Math.max(years.length - 1, 1)) * i
  const y = (v: number) => PADT + innerH * (1 - (v - minV) / (maxV - minV))

  return (
    <div ref={wrap} className="relative">
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="w-full"
        role="img"
        aria-label={`Margin history. Latest year: ${series.map((s) => `${s.name} ${fmtPct(last(s.pts) ?? 0)}`).join(", ")}`}
        onPointerMove={(e) => {
          const r = wrap.current?.getBoundingClientRect()
          if (!r) return
          const relX = ((e.clientX - r.left) / r.width) * CW
          const i = Math.round(((relX - PADL) / innerW) * (years.length - 1))
          if (i < 0 || i >= years.length) return setTip(null)
          setTip({
            x: (x(i) / CW) * r.width,
            y: (PADT / CH) * r.height + 8,
            lines: [years[i].label, ...series.map((s) => `${s.name.toLowerCase()} ${s.pts[i] === null ? "—" : fmtPct(s.pts[i] as number)}`)],
          })
        }}
        onPointerLeave={() => setTip(null)}
      >
        {[0, 0.5, 1].map((f) => {
          const v = minV + (maxV - minV) * f
          return (
            <g key={f}>
              <line x1={PADL} x2={CW - PADR} y1={y(v)} y2={y(v)} stroke={LINE} strokeWidth={1} />
              <text x={PADL - 8} y={y(v) + 4} textAnchor="end" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
                {Math.round(v)}%
              </text>
            </g>
          )
        })}
        {years.map((d, i) => (
          <text key={d.label} x={x(i)} y={CH - 8} textAnchor="middle" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
            {d.label}
          </text>
        ))}
        {series.map((s) => {
          const path = s.pts
            .map((v, i) => (v === null ? null : `${i === 0 || s.pts[i - 1] === null ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`))
            .filter(Boolean)
            .join(" ")
          return (
            <g key={s.key}>
              <path d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {s.pts.map((v, i) =>
                v === null ? null : <circle key={i} cx={x(i)} cy={y(v)} r={i === years.length - 1 ? 4 : 2.5} fill={s.color} stroke={CARD} strokeWidth={1.5} />,
              )}
              {last(s.pts) !== null && (
                <text x={CW - PADR + 2} y={y(last(s.pts) as number) + 3} textAnchor="start" fill={s.color} style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600 }}>
                  {Math.round(last(s.pts) as number)}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <div className="flex items-center gap-4">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
            <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      <TipBox tip={tip} />
    </div>
  )
}

function Waterfall({ fy }: { fy: FY }) {
  const { tip, setTip } = useTip()
  const wrap = useRef<HTMLDivElement>(null)
  const hasGP = fy.grossProfit !== null
  const steps = hasGP
    ? [
        { name: "Revenue", value: fy.revenue, kind: "total" as const },
        { name: "Cost of rev", value: -(fy.revenue - (fy.grossProfit as number)), kind: "delta" as const },
        { name: "Gross profit", value: fy.grossProfit as number, kind: "total" as const },
        { name: "Opex", value: -((fy.grossProfit as number) - fy.opInc), kind: "delta" as const },
        { name: "Op income", value: fy.opInc, kind: "total" as const },
        { name: "Tax & other", value: fy.netInc - fy.opInc, kind: "delta" as const },
        { name: "Net income", value: fy.netInc, kind: "total" as const },
      ]
    : [
        { name: "Revenue", value: fy.revenue, kind: "total" as const },
        { name: "Costs & opex", value: -(fy.revenue - fy.opInc), kind: "delta" as const },
        { name: "Op income", value: fy.opInc, kind: "total" as const },
        { name: "Tax & other", value: fy.netInc - fy.opInc, kind: "delta" as const },
        { name: "Net income", value: fy.netInc, kind: "total" as const },
      ]

  const max = niceMax(fy.revenue)
  const innerW = CW - PADL - PADR
  const innerH = CH - PADT - PADB
  const bw = (innerW / steps.length) * 0.62
  const x = (i: number) => PADL + (innerW / steps.length) * (i + 0.5)
  const y = (v: number) => PADT + innerH * (1 - v / max)

  let running = 0
  const bars = steps.map((s, i) => {
    let y0: number
    let y1: number
    if (s.kind === "total") {
      y0 = 0
      y1 = s.value
      running = s.value
    } else {
      y0 = running
      running = running + s.value
      y1 = running
    }
    const top = Math.max(y0, y1)
    const bot = Math.min(y0, y1)
    return { ...s, i, top, bot, end: running }
  })

  return (
    <div ref={wrap} className="relative">
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label={`Income statement waterfall for ${fy.label}: ${steps.map((s) => `${s.name} ${fmtB(s.value)}`).join(", ")}`}>
        <line x1={PADL} x2={CW - PADR} y1={y(0)} y2={y(0)} stroke={MUTE} strokeWidth={1} opacity={0.5} />
        {bars.map((b, i) => (
          <g key={b.name}>
            {i > 0 && (
              <line
                x1={x(i - 1) + bw / 2}
                x2={x(i) - bw / 2}
                y1={y(bars[i - 1].end === 0 ? bars[i - 1].top : bars[i - 1].kind === "total" ? bars[i - 1].value : bars[i - 1].end)}
                y2={y(b.kind === "total" ? b.value : b.top === b.bot ? b.top : b.top)}
                stroke={MUTE}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.6}
              />
            )}
            <rect
              x={x(i) - bw / 2}
              y={y(b.top)}
              width={bw}
              height={Math.max(2, y(b.bot) - y(b.top))}
              rx={4}
              fill={b.kind === "total" ? INK : b.value >= 0 ? GREEN : "#c4402f"}
              opacity={b.kind === "total" ? 0.92 : 0.85}
              onPointerMove={() => {
                const r = wrap.current?.getBoundingClientRect()
                if (!r) return
                setTip({ x: (x(i) / CW) * r.width, y: (y(b.top) / CH) * r.height, lines: [b.name, fmtB(b.value)] })
              }}
              onPointerLeave={() => setTip(null)}
            />
            <text
              x={x(i)}
              y={CH - 8}
              textAnchor="middle"
              fill={MUTE}
              style={{ fontFamily: MONO, fontSize: 8.5 }}
            >
              {b.name.length > 12 ? b.name.slice(0, 11) + "…" : b.name}
            </text>
          </g>
        ))}
        <text x={x(bars.length - 1)} y={y(bars[bars.length - 1].top) - 6} textAnchor="middle" fill={INK} style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}>
          {fmtB(last(steps).value)}
        </text>
      </svg>
      <TipBox tip={tip} />
    </div>
  )
}

const MIX_COLORS = ["#3355e8", "#0e8a68", "#c96f1f", "#7048c8", "#4f79a8"]

function SegmentMix({ segments }: { segments: Segment[] }) {
  const { tip, setTip } = useTip()
  const wrap = useRef<HTMLDivElement>(null)
  const years = segments[0].years
  const totals = years.map((_, yi) => segments.reduce((s, seg) => s + seg.values[yi], 0))
  const innerW = CW - PADL - PADR
  const innerH = CH - PADT - PADB
  const bw = Math.min(64, (innerW / years.length) * 0.55)
  const x = (i: number) => PADL + (innerW / years.length) * (i + 0.5)

  return (
    <div ref={wrap} className="relative">
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label={`Revenue mix by segment. Latest year: ${segments.map((s) => `${s.name} ${fmtPct(pct(last(s.values), last(totals)), 0)}`).join(", ")}`}>
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={PADL} x2={CW - PADR} y1={PADT + innerH * (1 - v / 100)} y2={PADT + innerH * (1 - v / 100)} stroke={LINE} strokeWidth={1} />
            <text x={PADL - 8} y={PADT + innerH * (1 - v / 100) + 4} textAnchor="end" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
              {v}%
            </text>
          </g>
        ))}
        {years.map((yr, yi) => {
          let acc = 0
          return (
            <g key={yr}>
              {segments.map((seg, si) => {
                const share = pct(seg.values[yi], totals[yi])
                const y0 = PADT + innerH * (1 - (acc + share) / 100)
                const h = (innerH * share) / 100
                acc += share
                return (
                  <rect
                    key={seg.name}
                    x={x(yi) - bw / 2}
                    y={y0 + 1}
                    width={bw}
                    height={Math.max(h - 2, 1.5)}
                    rx={3}
                    fill={MIX_COLORS[si % MIX_COLORS.length]}
                    opacity={yi === years.length - 1 ? 1 : 0.6}
                    onPointerMove={() => {
                      const r = wrap.current?.getBoundingClientRect()
                      if (!r) return
                      setTip({ x: ((x(yi)) / CW) * r.width, y: (y0 / CH) * r.height, lines: [`${seg.name} · ${yr}`, `${fmtB(seg.values[yi])} · ${fmtPct(share, 0)} of revenue`] })
                    }}
                    onPointerLeave={() => setTip(null)}
                  />
                )
              })}
              <text x={x(yi)} y={CH - 8} textAnchor="middle" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
                {yr}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {segments.map((s, i) => (
          <span key={s.name} className="inline-flex items-center gap-1.5 text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
            <span aria-hidden="true" className="h-2 w-2 rounded-sm" style={{ background: MIX_COLORS[i % MIX_COLORS.length] }} />
            {s.name}
          </span>
        ))}
      </div>
      <TipBox tip={tip} />
    </div>
  )
}

function Spark({ values, width = 84, height = 26 }: { values: number[]; width?: number; height?: number }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const path = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (values.length - 1)) * (width - 4) + 2).toFixed(1)},${(height - 3 - ((v - min) / span) * (height - 6)).toFixed(1)}`)
    .join(" ")
  const up = values[values.length - 1] >= values[0]
  return (
    <svg width={width} height={height} aria-hidden="true">
      <path d={path} fill="none" stroke={up ? GREEN : "#c4402f"} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(width - 4) + 2 - 0} cy={height - 3 - ((values[values.length - 1] - min) / span) * (height - 6)} r={2.4} fill={up ? GREEN : "#c4402f"} />
    </svg>
  )
}

function PeerScatter({
  companies,
  selected,
  onSelect,
}: {
  companies: Company[]
  selected: string
  onSelect: (t: string) => void
}) {
  const { tip, setTip } = useTip()
  const wrap = useRef<HTMLDivElement>(null)
  const W = 1080
  const H = 330
  const PL = 52
  const PR = 24
  const PT = 18
  const PB = 40
  const pts = companies.map((c) => ({ c, g: yoy(c), m: opMargin(last(c.years)), r: Math.sqrt(last(c.years).revenue) }))
  const gMin = Math.min(...pts.map((p) => p.g), 0) - 4
  const gMax = Math.max(...pts.map((p) => p.g)) + 6
  const mMin = Math.min(...pts.map((p) => p.m), 0) - 3
  const mMax = Math.max(...pts.map((p) => p.m)) + 6
  // sqrt-compressed growth axis: one hyper-grower shouldn't flatten the pack
  const gT = (g: number) => Math.sqrt(g - gMin)
  const x = (g: number) => PL + (gT(g) / gT(gMax)) * (W - PL - PR)
  const y = (m: number) => PT + (1 - (m - mMin) / (mMax - mMin)) * (H - PT - PB)
  const medG = [...pts.map((p) => p.g)].sort((a, b) => a - b)[Math.floor(pts.length / 2)]
  const medM = [...pts.map((p) => p.m)].sort((a, b) => a - b)[Math.floor(pts.length / 2)]

  return (
    <div ref={wrap} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Peer map of revenue growth versus operating margin. ${pts.map((p) => `${p.c.ticker}: growth ${fmtPct(p.g)}, margin ${fmtPct(p.m)}`).join(". ")}`}>
        {[gMin + 4, 0, medG, gMax * 0.45, gMax - 6]
          .filter((v, i, a) => a.findIndex((w) => Math.abs(w - v) < 6) === i)
          .map((v, i) => (
            <text key={i} x={x(v)} y={H - 12} textAnchor="middle" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
              {Math.round(v)}%
            </text>
          ))}
        <text x={W / 2} y={H - 1} textAnchor="middle" fill={MUTE} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1 }}>
          REVENUE GROWTH, LAST FY →
        </text>
        <text x={12} y={H / 2} textAnchor="middle" fill={MUTE} transform={`rotate(-90 12 ${H / 2})`} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1 }}>
          OPERATING MARGIN →
        </text>
        {[mMin, medM, mMax].map((v, i) => (
          <text key={i} x={PL - 8} y={y(v) + 3} textAnchor="end" fill={MUTE} style={{ fontFamily: MONO, fontSize: 10 }}>
            {Math.round(v)}%
          </text>
        ))}
        <line x1={x(medG)} x2={x(medG)} y1={PT} y2={H - PB} stroke={LINE} strokeWidth={1} />
        <line x1={PL} x2={W - PR} y1={y(medM)} y2={y(medM)} stroke={LINE} strokeWidth={1} />
        <line x1={x(0)} x2={x(0)} y1={PT} y2={H - PB} stroke={MUTE} strokeWidth={1} opacity={0.35} strokeDasharray="4 4" />
        {pts.map((p) => {
          const on = p.c.ticker === selected
          return (
            <g key={p.c.ticker} className="cursor-pointer" onClick={() => onSelect(p.c.ticker)}>
              <circle
                cx={x(p.g)}
                cy={y(p.m)}
                r={4 + p.r * 0.55}
                fill={on ? BLUE : "#8d97ad"}
                opacity={on ? 0.9 : 0.4}
                stroke={CARD}
                strokeWidth={2}
                onPointerMove={() => {
                  const r = wrap.current?.getBoundingClientRect()
                  if (!r) return
                  setTip({ x: (x(p.g) / W) * r.width, y: (y(p.m) / H) * r.height - 8, lines: [`${p.c.ticker} · ${p.c.name}`, `growth ${fmtPct(p.g)} · op margin ${fmtPct(p.m)}`, `revenue ${fmtB(last(p.c.years).revenue)}`] })
                }}
                onPointerLeave={() => setTip(null)}
              />
              <text x={x(p.g)} y={y(p.m) - (6 + p.r * 0.55)} textAnchor="middle" fill={on ? BLUE : MUTE} style={{ fontFamily: MONO, fontSize: 10, fontWeight: on ? 700 : 400 }}>
                {p.c.ticker}
              </text>
            </g>
          )
        })}
      </svg>
      <TipBox tip={tip} />
    </div>
  )
}

/* ------------------------------------------------------------ live data */

const FMP = "https://financialmodelingprep.com/api/v3"

async function fetchLiveCompany(ticker: string, key: string): Promise<Company> {
  const get = async (path: string) => {
    const res = await fetch(`${FMP}${path}${path.includes("?") ? "&" : "?"}apikey=${encodeURIComponent(key)}`)
    if (!res.ok) throw new Error(`FMP ${res.status}`)
    return res.json()
  }
  const [profile, income, cashflow, balance] = await Promise.all([
    get(`/profile/${ticker}`),
    get(`/income-statement/${ticker}?limit=5`),
    get(`/cash-flow-statement/${ticker}?limit=5`),
    get(`/balance-sheet-statement/${ticker}?limit=1`),
  ])
  if (!Array.isArray(income) || income.length === 0) throw new Error("no data")
  const p = Array.isArray(profile) && profile[0] ? profile[0] : {}
  const cf = new Map<string, number>(
    (Array.isArray(cashflow) ? cashflow : []).map((r: Record<string, unknown>) => [String(r.calendarYear), Number(r.freeCashFlow) / 1e9]),
  )
  const years: FY[] = [...income].reverse().map((r: Record<string, unknown>) => ({
    label: `FY${String(r.calendarYear).slice(2)}`,
    revenue: Number(r.revenue) / 1e9,
    grossProfit: r.grossProfit != null ? Number(r.grossProfit) / 1e9 : null,
    opInc: Number(r.operatingIncome) / 1e9,
    netInc: Number(r.netIncome) / 1e9,
    fcf: cf.get(String(r.calendarYear)) ?? 0,
    shares: Number(r.weightedAverageShsOutDil) / 1e9,
  }))
  const b = Array.isArray(balance) && balance[0] ? balance[0] : {}
  return {
    ticker: ticker.toUpperCase(),
    name: String(p.companyName ?? ticker.toUpperCase()),
    sector: String(p.sector ?? "—"),
    fyNote: "Live · FMP",
    blurb: String(p.description ?? "").split(". ")[0] || "Live company data via Financial Modeling Prep.",
    years,
    segments: null,
    cash: Number(b.cashAndShortTermInvestments ?? 0) / 1e9,
    debt: Number(b.totalDebt ?? 0) / 1e9,
    live: true,
  }
}

/* -------------------------------------------------------------- widgets */

function StatTile({ label, value, delta, deltaTone }: { label: string; value: string; delta?: string; deltaTone?: Tone }) {
  const toneColor = deltaTone === "up" ? GOOD : deltaTone === "down" ? BAD : MUTE
  const Icon = deltaTone === "up" ? ArrowUpRight : deltaTone === "down" ? ArrowDownRight : Minus
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-2xl border p-4" style={{ borderColor: LINE, background: CARD }}>
      <span className="truncate text-[10px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: MUTE }}>
        {label}
      </span>
      <span className="text-xl tabular-nums md:text-2xl" style={{ fontFamily: MONO, fontWeight: 600, color: INK }}>
        {value}
      </span>
      {delta ? (
        <span className="inline-flex items-center gap-1 text-xs tabular-nums" style={{ fontFamily: MONO, color: toneColor }}>
          <Icon size={12} aria-hidden="true" /> {delta}
        </span>
      ) : null}
    </div>
  )
}

function InsightCard({ ins }: { ins: Insight }) {
  const Icon = ins.tone === "up" ? TrendingUp : ins.tone === "down" ? TrendingDown : Minus
  const color = ins.tone === "up" ? GOOD : ins.tone === "down" ? WARN : MUTE
  return (
    <div className="flex gap-3 rounded-2xl border p-4" style={{ borderColor: LINE, background: CARD }}>
      <Icon size={16} className="mt-0.5 shrink-0" style={{ color }} aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: MUTE }}>
          {ins.tag}
        </span>
        <p className="text-sm leading-relaxed" style={{ color: INK }}>
          {ins.text}
        </p>
      </div>
    </div>
  )
}

function FlagChip({ flag }: { flag: Flag }) {
  const map = {
    good: { color: GOOD, Icon: ShieldCheck, word: "OK" },
    watch: { color: WARN, Icon: AlertTriangle, word: "WATCH" },
    risk: { color: BAD, Icon: AlertTriangle, word: "RISK" },
  }[flag.status]
  return (
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: LINE, background: CARD }}>
      <map.Icon size={16} style={{ color: map.color }} aria-hidden="true" />
      <div className="flex min-w-0 flex-col">
        <span className="text-xs font-semibold" style={{ color: INK }}>
          {flag.name}
          <span className="ml-2 text-[10px] font-bold tracking-wide" style={{ color: map.color, fontFamily: MONO }}>
            {map.word}
          </span>
        </span>
        <span className="truncate text-[11px] tabular-nums" style={{ fontFamily: MONO, color: MUTE }}>
          {flag.note}
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------- command palette */

function CommandPalette({
  open,
  onClose,
  companies,
  onPick,
  liveEnabled,
  onLivePick,
}: {
  open: boolean
  onClose: () => void
  companies: Company[]
  onPick: (t: string) => void
  liveEnabled: boolean
  onLivePick: (t: string) => void
}) {
  const [q, setQ] = useState("")
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = companies.filter(
    (c) => c.ticker.toLowerCase().includes(q.toLowerCase()) || c.name.toLowerCase().includes(q.toLowerCase()),
  )
  const showLive = liveEnabled && q.trim().length >= 1 && !filtered.some((c) => c.ticker.toLowerCase() === q.trim().toLowerCase())
  const total = filtered.length + (showLive ? 1 : 0)

  useEffect(() => {
    if (open) {
      setQ("")
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])
  useEffect(() => setIdx(0), [q])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Switch company">
      <button aria-label="Close" className="absolute inset-0 cursor-default backdrop-blur-[2px]" style={{ background: "rgba(23,26,32,0.45)" }} onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl" style={{ borderColor: LINE, background: CARD }}>
        <div className="flex items-center gap-3 border-b px-4" style={{ borderColor: LINE }}>
          <Search size={16} style={{ color: MUTE }} aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIdx((i) => Math.min(i + 1, total - 1))
              } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setIdx((i) => Math.max(i - 1, 0))
              } else if (e.key === "Enter") {
                e.preventDefault()
                if (idx < filtered.length) onPick(filtered[idx].ticker)
                else if (showLive) onLivePick(q.trim().toUpperCase())
                onClose()
              } else if (e.key === "Escape") onClose()
            }}
            placeholder={liveEnabled ? "Search snapshot or type any ticker…" : "Search companies…"}
            className="w-full bg-transparent py-3.5 text-sm outline-none"
            style={{ fontFamily: SANS, color: INK }}
            aria-label="Search companies"
          />
          <kbd className="rounded border px-1.5 py-0.5 text-[10px]" style={{ borderColor: LINE, color: MUTE, fontFamily: MONO }}>
            esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto py-2" role="listbox" aria-label="Companies">
          {filtered.map((c, i) => (
            <li key={c.ticker} role="option" aria-selected={i === idx}>
              <button
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left"
                style={{ background: i === idx ? "rgba(51,85,232,0.08)" : "transparent" }}
                onPointerEnter={() => setIdx(i)}
                onClick={() => {
                  onPick(c.ticker)
                  onClose()
                }}
              >
                <span className="w-14 text-xs font-bold tabular-nums" style={{ fontFamily: MONO, color: BLUE }}>
                  {c.ticker}
                </span>
                <span className="flex-1 truncate text-sm" style={{ color: INK }}>
                  {c.name}
                </span>
                <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
                  {c.sector}
                </span>
              </button>
            </li>
          ))}
          {showLive && (
            <li role="option" aria-selected={idx === filtered.length}>
              <button
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left"
                style={{ background: idx === filtered.length ? "rgba(51,85,232,0.08)" : "transparent" }}
                onPointerEnter={() => setIdx(filtered.length)}
                onClick={() => {
                  onLivePick(q.trim().toUpperCase())
                  onClose()
                }}
              >
                <span className="w-14 text-xs font-bold" style={{ fontFamily: MONO, color: GREEN }}>
                  LIVE
                </span>
                <span className="flex-1 text-sm" style={{ color: INK }}>
                  Fetch “{q.trim().toUpperCase()}” via your API key
                </span>
              </button>
            </li>
          )}
          {total === 0 && (
            <li className="px-4 py-6 text-center text-sm" style={{ color: MUTE }}>
              No matches{liveEnabled ? "" : " — add an API key to search any ticker"}.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ key panel */

function KeyPanel({
  open,
  onClose,
  apiKey,
  setApiKey,
}: {
  open: boolean
  onClose: () => void
  apiKey: string
  setApiKey: (k: string) => void
}) {
  const [draft, setDraft] = useState(apiKey)
  const [testState, setTestState] = useState<"idle" | "testing" | "ok" | "fail">("idle")
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (open) {
      setDraft(apiKey)
      setTestState("idle")
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open, apiKey])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Live data key">
      <button aria-label="Close" className="absolute inset-0 cursor-default backdrop-blur-[2px]" style={{ background: "rgba(23,26,32,0.45)" }} onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl" style={{ borderColor: LINE, background: CARD }}>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold" style={{ color: INK }}>
            <KeyRound size={16} style={{ color: BLUE }} aria-hidden="true" /> Live data — bring your own key
          </h3>
          <button onClick={onClose} aria-label="Close" className={cn("rounded p-1", focusRing)} style={{ color: MUTE }}>
            <X size={16} />
          </button>
        </div>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: MUTE }}>
          Paste a <span style={{ fontFamily: MONO }}>financialmodelingprep.com</span> API key (the free tier
          works — 250 calls/day) and Tearsheet fetches real statements for any ticker. The key lives only in
          your browser&rsquo;s localStorage.
        </p>
        <label htmlFor="ts-key" className="sr-only">
          API key
        </label>
        <input
          ref={inputRef}
          id="ts-key"
          value={draft}
          onChange={(e) => setDraft(e.target.value.trim())}
          placeholder="fmp_xxxxxxxxxxxx"
          className={cn("mb-3 w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm", focusRing)}
          style={{ borderColor: LINE, fontFamily: MONO, color: INK }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={async () => {
              if (!draft) return
              setTestState("testing")
              try {
                const r = await fetch(`${FMP}/profile/AAPL?apikey=${encodeURIComponent(draft)}`)
                const j = await r.json()
                setTestState(Array.isArray(j) && j[0]?.companyName ? "ok" : "fail")
              } catch {
                setTestState("fail")
              }
            }}
            className={cn("rounded-full border px-4 py-2 text-sm transition-colors", focusRing)}
            style={{ borderColor: LINE, color: INK, fontFamily: MONO }}
          >
            {testState === "testing" ? "Testing…" : testState === "ok" ? "✓ Key works" : testState === "fail" ? "✗ Failed — retry" : "Test key"}
          </button>
          <button
            onClick={() => {
              setApiKey(draft)
              onClose()
            }}
            className={cn("rounded-full px-4 py-2 text-sm font-semibold", focusRing)}
            style={{ background: BLUE, color: "#fff", fontFamily: MONO }}
          >
            Save
          </button>
          {apiKey && (
            <button
              onClick={() => {
                setApiKey("")
                onClose()
              }}
              className={cn("rounded-full px-4 py-2 text-sm", focusRing)}
              style={{ color: BAD, fontFamily: MONO }}
            >
              Remove key
            </button>
          )}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed" style={{ fontFamily: MONO, color: MUTE }}>
          No key? Everything still works on the built-in snapshot. Segment charts are snapshot-only (the free
          endpoint doesn&rsquo;t include them).
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- screener */

type SortKey = "revenue" | "growth" | "opm" | "fcfm" | "net"

function Screener({
  companies,
  selected,
  onSelect,
}: {
  companies: Company[]
  selected: string
  onSelect: (t: string) => void
}) {
  const [sort, setSort] = useState<SortKey>("revenue")
  const [dir, setDir] = useState<1 | -1>(-1)
  const rows = useMemo(() => {
    const val = (c: Company): number => {
      const L = last(c.years)
      switch (sort) {
        case "revenue": return L.revenue
        case "growth": return yoy(c)
        case "opm": return opMargin(L)
        case "fcfm": return fcfMargin(L)
        case "net": return c.cash - c.debt
      }
    }
    return [...companies].sort((a, b) => (val(a) - val(b)) * dir)
  }, [companies, sort, dir])

  const TH = ({ k, label }: { k: SortKey; label: string }) => (
    <th className="px-3 py-2 text-right">
      <button
        onClick={() => {
          if (sort === k) setDir((d) => (d === 1 ? -1 : 1))
          else {
            setSort(k)
            setDir(-1)
          }
        }}
        className={cn("inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.1em]", focusRing)}
        style={{ fontFamily: MONO, color: sort === k ? INK : MUTE, fontWeight: sort === k ? 700 : 400 }}
        aria-label={`Sort by ${label}`}
      >
        {label}
        {sort === k ? (dir === -1 ? <ChevronDown size={12} aria-hidden="true" /> : <ChevronUp size={12} aria-hidden="true" />) : null}
      </button>
    </th>
  )

  return (
    <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: LINE, background: CARD }}>
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: LINE }}>
            <th className="px-4 py-2 text-left text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: MONO, color: MUTE }}>
              Company
            </th>
            <TH k="revenue" label="Revenue" />
            <TH k="growth" label="Growth" />
            <TH k="opm" label="Op margin" />
            <TH k="fcfm" label="FCF margin" />
            <TH k="net" label="Net cash" />
            <th className="px-4 py-2 text-right text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: MONO, color: MUTE }}>
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const L = last(c.years)
            const net = c.cash - c.debt
            const on = c.ticker === selected
            return (
              <tr
                key={c.ticker}
                className="cursor-pointer border-b transition-colors last:border-0 hover:bg-[rgba(51,85,232,0.04)]"
                style={{ borderColor: LINE, background: on ? "rgba(51,85,232,0.07)" : undefined }}
                onClick={() => onSelect(c.ticker)}
              >
                <td className="px-4 py-2.5">
                  <span className="mr-2 font-bold tabular-nums" style={{ fontFamily: MONO, color: on ? BLUE : INK }}>
                    {c.ticker}
                  </span>
                  <span className="hidden text-xs sm:inline" style={{ color: MUTE }}>
                    {c.name}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: MONO, color: INK }}>{fmtB(L.revenue)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: MONO, color: yoy(c) >= 0 ? GOOD : BAD }}>{fmtPct(yoy(c))}</td>
                <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: MONO, color: INK }}>{fmtPct(opMargin(L))}</td>
                <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: MONO, color: fcfMargin(L) >= 0 ? INK : BAD }}>{fmtPct(fcfMargin(L))}</td>
                <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: MONO, color: net >= 0 ? GOOD : BAD }}>{fmtB(net)}</td>
                <td className="px-4 py-2.5 text-right">
                  <Spark values={c.years.map((r) => r.revenue)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ----------------------------------------------------------------- page */

export default function TearsheetSite() {
  const reduced = useReducedMotion() ?? false
  const [companies, setCompanies] = useState<Company[]>(SNAPSHOT)
  const [ticker, setTicker] = useState("AAPL")
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [keyOpen, setKeyOpen] = useState(false)
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem("tearsheet-fmp-key") ?? ""
    } catch {
      return ""
    }
  })
  const [banner, setBanner] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const liveCache = useRef(new Map<string, Company>())

  const setApiKey = (k: string) => {
    setApiKeyState(k)
    try {
      if (k) localStorage.setItem("tearsheet-fmp-key", k)
      else localStorage.removeItem("tearsheet-fmp-key")
    } catch {
      /* private mode */
    }
  }

  const company = companies.find((c) => c.ticker === ticker) ?? companies[0]

  const loadLive = useCallback(
    async (t: string) => {
      if (!apiKey) return
      const cached = liveCache.current.get(t)
      if (cached) {
        setCompanies((cs) => (cs.some((c) => c.ticker === t) ? cs : [...cs, cached]))
        setTicker(t)
        return
      }
      setLoading(true)
      setBanner(null)
      try {
        const live = await fetchLiveCompany(t, apiKey)
        liveCache.current.set(t, live)
        setCompanies((cs) => {
          const rest = cs.filter((c) => c.ticker !== t)
          return [...rest, live]
        })
        setTicker(t)
      } catch {
        setBanner(`Couldn't fetch ${t} (bad ticker, rate limit, or network) — showing the snapshot instead.`)
      } finally {
        setLoading(false)
      }
    },
    [apiKey],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const L = last(company.years)
  const prev = company.years[company.years.length - 2]
  const insights = useMemo(() => buildInsights(company), [company])
  const flags = useMemo(() => buildFlags(company), [company])
  const g3 = cagr(company, Math.min(3, company.years.length - 1))
  const net = company.cash - company.debt

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" style={{ background: PAPER, color: INK, fontFamily: SANS }} className="min-h-screen">
        {/* ------------------------------------------------------- header */}
        <header className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md" style={{ borderColor: LINE, background: "rgba(245,245,242,0.85)" }}>
          <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-3 px-4 md:px-6">
            {/* ml clears the gallery back-chip pinned at left-4 top-4 */}
            <div className="ml-24 flex items-center gap-2.5 min-[1440px]:ml-0">
              <CircleDollarSign size={19} style={{ color: BLUE }} aria-hidden="true" />
              <span className="text-base tracking-[0.08em]" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                TEARSHEET
              </span>
              <span className="hidden rounded-full border px-2 py-0.5 text-[10px] md:inline" style={{ borderColor: LINE, fontFamily: MONO, color: MUTE }}>
                {company.live ? "LIVE · FMP" : AS_OF}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaletteOpen(true)}
                className={cn("inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors hover:border-[#3355e8]", focusRing)}
                style={{ borderColor: LINE, background: CARD, color: MUTE, fontFamily: MONO }}
              >
                <Search size={13} aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="ml-1 hidden items-center gap-0.5 rounded border px-1 text-[10px] sm:inline-flex" style={{ borderColor: LINE }}>
                  <Command size={9} aria-hidden="true" />K
                </kbd>
              </button>
              <button
                onClick={() => setKeyOpen(true)}
                className={cn("inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-transform hover:scale-[1.02]", focusRing)}
                style={{ background: apiKey ? GREEN : INK, color: "#fff", fontFamily: MONO }}
              >
                {apiKey ? <Check size={13} aria-hidden="true" /> : <KeyRound size={13} aria-hidden="true" />}
                <span className="hidden sm:inline">{apiKey ? "Live data on" : "Add API key"}</span>
              </button>
            </div>
          </div>
        </header>

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          companies={companies}
          onPick={setTicker}
          liveEnabled={Boolean(apiKey)}
          onLivePick={loadLive}
        />
        <KeyPanel open={keyOpen} onClose={() => setKeyOpen(false)} apiKey={apiKey} setApiKey={setApiKey} />

        <div className="mx-auto flex max-w-[1180px] gap-6 px-4 pb-16 pt-20 md:px-6">
          {/* --------------------------------------------------- side rail */}
          <nav aria-label="Companies" className="sticky top-20 hidden h-fit w-52 shrink-0 flex-col gap-1 lg:flex">
            <p className="mb-1 px-3 text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: MUTE }}>
              Coverage
            </p>
            {companies.map((c) => {
              const on = c.ticker === ticker
              return (
                <button
                  key={c.ticker}
                  onClick={() => setTicker(c.ticker)}
                  aria-current={on ? "true" : undefined}
                  className={cn("flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-all", focusRing, !on && "hover:translate-x-0.5")}
                  style={{ borderColor: on ? BLUE : "transparent", background: on ? CARD : "transparent" }}
                >
                  <span className="flex flex-col">
                    <span className="text-xs font-bold tabular-nums" style={{ fontFamily: MONO, color: on ? BLUE : INK }}>
                      {c.ticker}
                      {c.live ? <span style={{ color: GREEN }}> ·live</span> : null}
                    </span>
                    <span className="max-w-[7.5rem] truncate text-[11px]" style={{ color: MUTE }}>
                      {c.name}
                    </span>
                  </span>
                  <Spark values={c.years.map((r) => r.revenue)} width={44} height={20} />
                </button>
              )
            })}
          </nav>

          {/* ------------------------------------------------------- main */}
          <main className="min-w-0 flex-1">
            {/* mobile switcher */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {companies.map((c) => (
                <button
                  key={c.ticker}
                  onClick={() => setTicker(c.ticker)}
                  className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold tabular-nums", focusRing)}
                  style={{
                    fontFamily: MONO,
                    color: c.ticker === ticker ? "#fff" : INK,
                    background: c.ticker === ticker ? BLUE : CARD,
                    borderColor: c.ticker === ticker ? BLUE : LINE,
                  }}
                >
                  {c.ticker}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {banner && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: "rgba(180,83,9,0.4)", background: "rgba(180,83,9,0.07)", color: WARN }}
                  role="status"
                >
                  {banner}
                </motion.p>
              )}
            </AnimatePresence>

            {/* company header */}
            <motion.div
              key={company.ticker}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                      {company.name}
                    </h1>
                    <span className="rounded-lg px-2 py-1 text-sm font-bold tabular-nums" style={{ fontFamily: MONO, background: "rgba(51,85,232,0.1)", color: BLUE }}>
                      {company.ticker}
                    </span>
                    {loading && (
                      <span className="text-xs" style={{ fontFamily: MONO, color: MUTE }}>
                        fetching…
                      </span>
                    )}
                  </div>
                  <p className="mt-1 max-w-xl text-sm" style={{ color: MUTE }}>
                    {company.sector} · {company.fyNote} — {company.blurb}
                  </p>
                </div>
              </div>

              {/* stat tiles */}
              <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                <StatTile label={`Revenue ${L.label}`} value={fmtB(L.revenue)} delta={prev ? `${fmtPct(yoy(company))} yoy` : undefined} deltaTone={yoy(company) >= 0 ? "up" : "down"} />
                <StatTile label="3y CAGR" value={g3 === null ? "—" : fmtPct(g3)} deltaTone="flat" />
                <StatTile label="Op margin" value={fmtPct(opMargin(L))} delta={prev ? `${Math.round((opMargin(L) - opMargin(prev)) * 100)} bps` : undefined} deltaTone={prev && opMargin(L) >= opMargin(prev) ? "up" : "down"} />
                <StatTile label="Net income" value={fmtB(L.netInc)} deltaTone="flat" />
                <StatTile label="Free cash flow" value={fmtB(L.fcf)} delta={`${fmtPct(fcfMargin(L))} of rev`} deltaTone={L.fcf >= 0 ? "up" : "down"} />
                <StatTile label="Net cash (debt)" value={fmtB(net)} deltaTone={net >= 0 ? "up" : "down"} />
              </div>

              {/* charts */}
              <div className="mb-5 grid gap-4 xl:grid-cols-2">
                <ChartCard title="Revenue" note="USD billions · fiscal years">
                  <RevenueBars years={company.years} />
                </ChartCard>
                <ChartCard title="Margin history" note="% of revenue">
                  <MarginLines years={company.years} />
                </ChartCard>
                <ChartCard title={`Income statement — ${L.label}`} note="waterfall, USD billions">
                  <Waterfall fy={L} />
                </ChartCard>
                <ChartCard title="Revenue mix" note={company.segments ? "% of revenue by segment" : undefined}>
                  {company.segments ? (
                    <SegmentMix segments={company.segments} />
                  ) : (
                    <div className="flex h-[210px] flex-col items-center justify-center gap-2 text-center">
                      <p className="text-sm" style={{ color: MUTE }}>
                        {company.live ? "Segment data isn't included in the free live endpoint." : "No comparable segment disclosure in the snapshot."}
                      </p>
                      <p className="text-[11px]" style={{ fontFamily: MONO, color: MUTE }}>
                        the rest of the tearsheet is unaffected
                      </p>
                    </div>
                  )}
                </ChartCard>
              </div>

              {/* insights */}
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: MUTE }}>
                What the numbers say
              </h2>
              <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {insights.map((ins, i) => (
                  <InsightCard key={i} ins={ins} />
                ))}
              </div>

              {/* flags */}
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: MUTE }}>
                Health flags
              </h2>
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {flags.map((f) => (
                  <FlagChip key={f.name} flag={f} />
                ))}
              </div>
            </motion.div>

            {/* peer map */}
            <ChartCard
              title="Peer map — growth vs profitability"
              note="bubble area ∝ revenue · click to switch"
            >
              <PeerScatter companies={companies} selected={ticker} onSelect={setTicker} />
            </ChartCard>

            {/* screener */}
            <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: MUTE }}>
              Screener — latest fiscal year
            </h2>
            <Screener companies={companies} selected={ticker} onSelect={setTicker} />

            {/* methodology */}
            <footer className="mt-10 rounded-2xl border p-5" style={{ borderColor: LINE, background: CARD }}>
              <h2 className="mb-2 text-sm font-semibold" style={{ color: INK }}>
                Methodology &amp; caveats
              </h2>
              <ul className="flex flex-col gap-1.5 text-[13px] leading-relaxed" style={{ color: MUTE }}>
                <li>· Snapshot figures are hand-compiled, approximate fiscal-year values (USD billions) from public filings — good for orientation, not for trading. Expect rounding.</li>
                <li>· Insights and flags are computed mechanically from the numbers above: growth vs 3-year CAGR, 2-year operating-margin drift, FCF÷net income, cash − debt, and 3-year share-count change.</li>
                <li>· Live mode fetches profile, income, cash-flow and balance-sheet statements from Financial Modeling Prep with your key, then runs the same engine. Fiscal-year bases differ by company.</li>
                <li>· Nothing here is investment advice. Read the 10-K; it&rsquo;s better than any dashboard.</li>
              </ul>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: MUTE }}>
                © 2026 Tearsheet Labs · figures as labelled · built for the daily-sites gallery
              </p>
            </footer>
          </main>
        </div>
      </div>
    </MotionConfig>
  )
}
