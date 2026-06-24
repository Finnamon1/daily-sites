// Fictional catalogue for Ravello Type Foundry.
// Each face maps to a real loaded Google font so specimens render in-character.

export type Face = {
  slug: string
  name: string
  klass: string
  styles: number
  year: number
  designer: string
  font: string // CSS font-family used to render the specimen
  blurb: string
  // a deeper accent hue per face, for the catalogue plates
  hue: number
}

export const FACES: Face[] = [
  {
    slug: "ravello-display",
    name: "Ravello Display",
    klass: "High-contrast display serif",
    styles: 7,
    year: 2024,
    designer: "Ines Ravello",
    font: "'Fraunces', serif",
    blurb:
      "The face the foundry is named for. Razor-thin hairlines, a swollen ball terminal, and an optical size axis that swings from poster to footnote.",
    hue: 232,
  },
  {
    slug: "marl-grotesque",
    name: "Marl Grotesque",
    klass: "Neo-grotesque sans",
    styles: 12,
    year: 2023,
    designer: "Theo Marl",
    font: "'Space Grotesk', sans-serif",
    blurb:
      "A workhorse with opinions. Tight spacing, a slightly squared bowl, and twelve weights that hold their colour from caption to billboard.",
    hue: 16,
  },
  {
    slug: "cardel-text",
    name: "Cardel Text",
    klass: "Humanist book serif",
    styles: 10,
    year: 2022,
    designer: "Ines Ravello",
    font: "'Spectral', serif",
    blurb:
      "Built for the long read. Generous x-height, calm rhythm, and ink traps tuned for newsprint and screen alike.",
    hue: 152,
  },
  {
    slug: "tindall-mono",
    name: "Tindall Mono",
    klass: "Monospaced, for code",
    styles: 6,
    year: 2025,
    designer: "Sora Tindall",
    font: "'JetBrains Mono', monospace",
    blurb:
      "Fixed-width without the fatigue. Disambiguated zero, dotted i, and ligatures you can switch off when the linter complains.",
    hue: 268,
  },
  {
    slug: "pelt-sans",
    name: "Pelt Sans",
    klass: "Geometric sans",
    styles: 9,
    year: 2021,
    designer: "Theo Marl",
    font: "'Syne', sans-serif",
    blurb:
      "Circles and straights, warmed up. A wide aperture keeps it friendly at small sizes; the heavy cuts read like a stamp.",
    hue: 44,
  },
  {
    slug: "aubrac",
    name: "Aubrac",
    klass: "Transitional serif",
    styles: 8,
    year: 2024,
    designer: "Ines Ravello",
    font: "'Cormorant Garamond', serif",
    blurb:
      "A quiet transitional with a sharp italic. Made for menus, mastheads, and the kind of invitation you keep.",
    hue: 200,
  },
]

export const GLYPHS = "Aa Bb Gg Qq Rr & æ ﬁ ? ! @ 0123456789 ¶ § Æ ø".split(" ")

export const LICENSES = [
  {
    name: "Desktop",
    price: "€40",
    unit: "per style",
    for: "Print, logos, comps",
    perks: ["Install on 5 machines", "Unlimited print runs", "Logo & wordmark use", "Free minor updates"],
    featured: false,
  },
  {
    name: "Studio",
    price: "€220",
    unit: "full family",
    for: "Most working teams",
    perks: ["Desktop + Web in one", "Up to 25 seats", "500k monthly pageviews", "Variable fonts included", "Priority support"],
    featured: true,
  },
  {
    name: "Broadcast",
    price: "Let's talk",
    unit: "custom",
    for: "Brands & apps at scale",
    perks: ["App & embedded use", "Unlimited seats", "Custom axes on request", "Source files & hinting", "A real human on email"],
    featured: false,
  },
]
