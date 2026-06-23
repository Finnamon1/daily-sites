/* QUIRE Type Foundry — the catalogue.
 * Each "typeface" is presented in a real, already-loaded webfont so every
 * specimen renders in its own letterforms. Names, designers and dates are
 * invented for this design study. */

export type Category = "Sans" | "Serif" | "Mono" | "Display"

export interface Typeface {
  id: string
  name: string
  /** CSS font-family value — the specimen is set in this. */
  font: string
  cat: Category
  /** Short classification line. */
  clazz: string
  year: number
  designer: string
  /** Number of styles in the family. */
  styles: number
  /** Weights actually available to the tester for this family. */
  weights: number[]
  /** A single character used as the big specimen glyph. */
  glyph: string
  blurb: string
  /** A specimen phrase that suits the face's temperament. */
  sample: string
  featured?: boolean
}

export const typefaces: Typeface[] = [
  {
    id: "quire-grotesque",
    name: "Quire Grotesque",
    font: "'Bricolage Grotesque'",
    cat: "Display",
    clazz: "Optical grotesque · 14 styles",
    year: 2024,
    designer: "Mira Okonkwo",
    styles: 14,
    weights: [500, 600, 700, 800],
    glyph: "Q",
    blurb:
      "The flagship. A restless grotesque with optical sizing and a deliberate ink trap that keeps headlines crisp from a poster down to a caption.",
    sample: "Set the record straight",
    featured: true,
  },
  {
    id: "wend",
    name: "Wend",
    font: "Fraunces",
    cat: "Serif",
    clazz: "High-contrast old style · 12 styles",
    year: 2023,
    designer: "Tomas Réti",
    styles: 12,
    weights: [400, 500, 600, 700],
    glyph: "W",
    blurb:
      "A wonky, high-contrast old-style with soft optical curves and a flair for titling. Best when given room to breathe at large sizes.",
    sample: "A wending, deliberate line",
  },
  {
    id: "lede",
    name: "Lede",
    font: "Spectral",
    cat: "Serif",
    clazz: "Screen-first text serif · 10 styles",
    year: 2022,
    designer: "Mira Okonkwo",
    styles: 10,
    weights: [300, 400, 500, 600],
    glyph: "L",
    blurb:
      "A text serif drawn for the long read on screens — open counters, sturdy serifs, and a colour that holds together at body sizes.",
    sample: "Built for paragraphs that earn their length.",
  },
  {
    id: "verena",
    name: "Verena",
    font: "'Cormorant Garamond'",
    cat: "Display",
    clazz: "Garalde display · 9 styles",
    year: 2021,
    designer: "Aurélie Lambert",
    styles: 9,
    weights: [400, 500, 600, 700],
    glyph: "V",
    blurb:
      "Reverent and high-contrast, Verena is made for the largest sizes — mastheads, title pages, the first word on a cover.",
    sample: "Verena, set very large",
  },
  {
    id: "standard",
    name: "Standard",
    font: "'Hanken Grotesk'",
    cat: "Sans",
    clazz: "Neo-grotesque · 8 styles",
    year: 2020,
    designer: "Tomas Réti",
    styles: 8,
    weights: [400, 500, 600, 700],
    glyph: "S",
    blurb:
      "Neutral, dependable and signage-ready. The least surprising face we make, and the one our clients reach for the most.",
    sample: "Plain speech, properly spaced",
  },
  {
    id: "cosmos",
    name: "Cosmos",
    font: "'Space Grotesk'",
    cat: "Sans",
    clazz: "Geometric · 7 styles",
    year: 2023,
    designer: "Jun Park",
    styles: 7,
    weights: [400, 500, 600, 700],
    glyph: "C",
    blurb:
      "A proportional geometric with monospaced roots — its even rhythm and squared terminals read as quietly technical.",
    sample: "Engineered, not cold",
  },
  {
    id: "aperture",
    name: "Aperture",
    font: "'IBM Plex Sans'",
    cat: "Sans",
    clazz: "Humanist · 8 styles",
    year: 2019,
    designer: "Aurélie Lambert",
    styles: 8,
    weights: [400, 500, 600, 700],
    glyph: "A",
    blurb:
      "Humanist warmth on an engineered skeleton. Aperture is the workhorse for interfaces, forms and the small print.",
    sample: "Legible at every size you need",
  },
  {
    id: "notice",
    name: "Notice",
    font: "'DM Sans'",
    cat: "Sans",
    clazz: "Low-contrast geometric · 6 styles",
    year: 2021,
    designer: "Jun Park",
    styles: 6,
    weights: [400, 500, 600],
    glyph: "N",
    blurb:
      "Compact, friendly and interface-ready, with tight spacing that keeps dense layouts calm.",
    sample: "Short, tidy, unfussy",
  },
  {
    id: "counter",
    name: "Counter",
    font: "'JetBrains Mono'",
    cat: "Mono",
    clazz: "Monospace · 6 styles",
    year: 2022,
    designer: "Tomas Réti",
    styles: 6,
    weights: [400, 500, 700],
    glyph: "{",
    blurb:
      "A monospace with generous counters for code, tables and data — designed so 0, O and o never argue.",
    sample: "const margin = 0;",
  },
  {
    id: "margin",
    name: "Margin",
    font: "'IBM Plex Mono'",
    cat: "Mono",
    clazz: "Typewriter mono · 5 styles",
    year: 2020,
    designer: "Mira Okonkwo",
    styles: 5,
    weights: [400, 500, 600],
    glyph: "*",
    blurb:
      "Typewriter-adjacent and a little wry — drawn for captions, credits and the marginalia around the main text.",
    sample: "see footnote, opposite",
  },
]

export const categories: ("All" | Category)[] = [
  "All",
  "Sans",
  "Serif",
  "Mono",
  "Display",
]

export const team = [
  {
    name: "Mira Okonkwo",
    role: "Founder · Type design",
    seed: "quire-mira",
    note: "Drew Quire Grotesque over four winters. Believes a foundry is a reading habit, not a logo.",
  },
  {
    name: "Tomas Réti",
    role: "Type design · Production",
    seed: "quire-tomas",
    note: "Spends his weeks on spacing and his weekends on kerning. Keeps the metrics honest.",
  },
  {
    name: "Aurélie Lambert",
    role: "Type design · Editorial",
    seed: "quire-aurelie",
    note: "Came from a print magazine. Argues, persuasively, for one more weight every time.",
  },
]

export const principles = [
  {
    n: "01",
    t: "Read it before you sell it",
    d: "Every family is set in real running text — a novel chapter, a price table, a code listing — before it ships. If it tires the eye, it goes back to the drawing board.",
  },
  {
    n: "02",
    t: "Spacing is the design",
    d: "We spend more time on the gaps between letters than on the letters themselves. Good spacing is invisible; bad spacing is all you can see.",
  },
  {
    n: "03",
    t: "Fewer, deeper families",
    d: "We would rather make ten families you can build a whole identity on than a hundred you use once. Each one ships with the weights a real system needs.",
  },
  {
    n: "04",
    t: "Licences a human can read",
    d: "No per-pageview maths, no annual surprises. One plain-English licence, priced by where the type lives — your desktop, your site, your app.",
  },
]

export const tiers = [
  {
    id: "desktop",
    name: "Desktop",
    price: "£60",
    unit: "per style",
    blurb: "For print, design files and anything that starts on your machine.",
    points: [
      "Up to 5 workstations",
      "Print, logos & static images",
      "Unlimited project use",
      "OpenType features included",
    ],
    cta: "Add to cart",
  },
  {
    id: "web",
    name: "Web",
    price: "£90",
    unit: "per style",
    blurb: "Self-hosted WOFF2 for one domain, with the subsetting tools you need.",
    points: [
      "One domain, unlimited pageviews",
      "Self-hosted WOFF2 + subsetter",
      "Variable fonts where available",
      "No tracking, no monthly fees",
    ],
    cta: "Add to cart",
    featured: true,
  },
  {
    id: "complete",
    name: "Studio",
    price: "£1,200",
    unit: "per family",
    blurb: "The whole family — every style, every platform — for studios shipping identities.",
    points: [
      "Every weight & width",
      "Desktop, web & app rights",
      "5 seats, named or floating",
      "Priority support from the team",
    ],
    cta: "Talk to us",
  },
]

export const inUse = [
  { seed: "quire-mag-spread", alt: "Quire Grotesque on a printed magazine spread", w: 900, h: 1120 },
  { seed: "quire-poster", alt: "Wend used on a large gallery poster", w: 900, h: 1120 },
  { seed: "quire-screen", alt: "Aperture set in a product interface on screen", w: 900, h: 1120 },
]

export const faqs = [
  {
    q: "Can I try before I buy?",
    a: "Yes. Every family has a free trial set for non-commercial sketching and pitch work. Email the foundry and we'll send the trial files the same day.",
  },
  {
    q: "How does the web licence count usage?",
    a: "By domain, not by pageviews. One web licence covers a single domain and as much traffic as you can send it. Subdomains of the same site are included.",
  },
  {
    q: "Do you make custom type?",
    a: "We take on two or three bespoke commissions a year — usually a wordmark extended into a working family. Tell us about the project and the timeline.",
  },
  {
    q: "What about app embedding?",
    a: "The Studio licence covers embedding in one native app. For multiple apps or SDKs, write to us and we'll scope a licence that fits.",
  },
]
