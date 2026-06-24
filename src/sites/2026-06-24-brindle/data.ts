/* =========================================================================
   BRINDLE TYPE CO. — catalogue data
   ========================================================================= */

export interface Typeface {
  name: string
  category: string
  styles: number
  axes: string
  year: number
  blurb: string
  sample: string
  weights: { label: string; wght: number }[]
  preview: string // the word shown in the giant hover preview
  font: string // real font used to render the (fictional) face
  italic?: boolean
}

export const TYPEFACES: Typeface[] = [
  {
    name: "Brindle Text",
    category: "Contemporary serif · 18 styles",
    styles: 18,
    axes: "Weight · Optical size · Italic",
    year: 2024,
    blurb:
      "A reading serif with a low contrast and a slightly nutty stress — warm at body, characterful at display. The face the whole foundry is named for.",
    sample: "The marginalia bloomed in walnut ink",
    weights: [
      { label: "Light", wght: 320 },
      { label: "Regular", wght: 430 },
      { label: "Medium", wght: 540 },
      { label: "Semibold", wght: 620 },
      { label: "Bold", wght: 700 },
    ],
    preview: "Brindle",
    font: "'Fraunces', Georgia, serif",
  },
  {
    name: "Coppice Grotesk",
    category: "Humanist sans · 14 styles",
    styles: 14,
    axes: "Weight · Width",
    year: 2023,
    blurb:
      "A grotesque with open apertures and a quiet wink — the kind of sans that reads clean on a chart and still has a pulse on a poster.",
    sample: "Field notes, gathered at the edge of the wood",
    weights: [
      { label: "Thin", wght: 300 },
      { label: "Book", wght: 420 },
      { label: "Bold", wght: 640 },
    ],
    preview: "Coppice",
    font: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    name: "Marrow Display",
    category: "High-contrast display · 9 styles",
    styles: 9,
    axes: "Weight · Slant",
    year: 2025,
    blurb:
      "Thin where it dares, thick where it must. A didone built for headlines that want to be remembered and reset rarely.",
    sample: "An evening edition, set entirely too large",
    weights: [
      { label: "Air", wght: 300 },
      { label: "Regular", wght: 440 },
      { label: "Heavy", wght: 700 },
    ],
    preview: "Marrow",
    font: "'Cormorant Garamond', Georgia, serif",
    italic: true,
  },
  {
    name: "Pith Mono",
    category: "Monospaced · 8 styles",
    styles: 8,
    axes: "Weight",
    year: 2022,
    blurb:
      "A fixed-width with ink on its hands — designed for code editors but happy in spec sheets, captions and the small print of a specimen.",
    sample: "const grain = letters.map(ink)",
    weights: [
      { label: "Regular", wght: 430 },
      { label: "Medium", wght: 540 },
      { label: "Bold", wght: 660 },
    ],
    preview: "Pith",
    font: "'IBM Plex Mono', ui-monospace, monospace",
  },
  {
    name: "Sett Display",
    category: "Geometric display · 6 styles",
    styles: 6,
    axes: "Weight",
    year: 2025,
    blurb:
      "A cobbled, big-boned display sans for posters, packaging and the front of book. Tight spacing, fearless weight, made to be set enormous.",
    sample: "Closing night — the last show of the season",
    weights: [
      { label: "Regular", wght: 600 },
      { label: "Bold", wght: 800 },
    ],
    preview: "Sett",
    font: "'Syne', system-ui, sans-serif",
  },
]

export const STATS: { value: number; suffix?: string; label: string; decimals?: number }[] = [
  { value: 53, label: "Retail styles in catalogue" },
  { value: 1184, label: "Glyphs in Brindle Text" },
  { value: 91, label: "Languages supported", suffix: "+" },
  { value: 11, label: "Years drawing letters" },
]

/* The glyph grid on the specimen page — a curated character set. */
export const GLYPHS: string[] = [
  "A", "a", "G", "g", "Q", "R", "ß", "&", "@", "ﬁ",
  "k", "y", "æ", "3", "5", "8", "?", "!", "¶", "§",
  "ç", "ñ", "ø", "þ", "α", "Ω", "★", "✶", "•", "→",
]

/* Specimen page weight axis stops (Brindle Text). */
export const AXIS_STOPS: { label: string; wght: number }[] = [
  { label: "Hairline", wght: 320 },
  { label: "Light", wght: 380 },
  { label: "Regular", wght: 430 },
  { label: "Medium", wght: 520 },
  { label: "Semibold", wght: 600 },
  { label: "Bold", wght: 700 },
]

export interface Tier {
  name: string
  price: string
  unit: string
  best: boolean
  features: string[]
  cta: string
}

export const TIERS: Tier[] = [
  {
    name: "Desktop",
    price: "£48",
    unit: "per style",
    best: false,
    features: ["Print & static design", "Up to 5 workstations", "Logos & wordmarks", "Perpetual licence"],
    cta: "Add to cart",
  },
  {
    name: "Studio",
    price: "£320",
    unit: "full family",
    best: true,
    features: ["Every style in the family", "Desktop + web + app", "Up to 10 seats", "One year of updates", "Trial PDFs included"],
    cta: "Buy the family",
  },
  {
    name: "Web & App",
    price: "£60",
    unit: "per style",
    best: false,
    features: ["Self-hosted WOFF2", "100k pageviews / month", "One bundled app build", "Subsetting on request"],
    cta: "Add to cart",
  },
]

export interface Journal {
  kicker: string
  title: string
  body: string
  date: string
}

export const JOURNAL: Journal[] = [
  {
    kicker: "Process",
    title: "Why we draw the ‘a’ last",
    body:
      "The double-storey a holds the whole personality of a serif. We rough it in, ignore it for months, then return once the rhythm of the lowercase has told us who the face wants to be.",
    date: "May 2026",
  },
  {
    kicker: "Release",
    title: "Marrow Display, now with a slant axis",
    body:
      "Our didone learned to lean. The new slant axis runs to 12° and keeps the hairlines from snapping — the trick was unbracketing the serifs before italicising.",
    date: "Apr 2026",
  },
  {
    kicker: "Field",
    title: "A week of testing in the wild",
    body:
      "We printed Brindle Text on twelve papers, from newsprint to a toothy cotton rag. The optical-size axis earns its keep the moment ink starts to spread.",
    date: "Mar 2026",
  },
]

export const PEOPLE: { name: string; role: string; note: string }[] = [
  { name: "Edith Maro", role: "Founder · type design", note: "Twelve years at a London foundry before the hill." },
  { name: "Sol Bramble", role: "Production · engineering", note: "Hints by day, plays the cello very badly by night." },
  { name: "Niamh Crook", role: "Lettering · custom", note: "Draws the scripts no one else will attempt." },
]
