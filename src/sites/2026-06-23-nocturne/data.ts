/* Content for Nocturne — a vinyl listening bar & kitchen.
 * Kept separate from the view so copy stays easy to scan and edit. */

export interface Plate {
  name: string
  note: string
  price: string
}

export interface MenuSection {
  heading: string
  kicker: string
  plates: Plate[]
}

export const kitchen: MenuSection[] = [
  {
    heading: "To start the night",
    kicker: "Small plates",
    plates: [
      { name: "Cured trout", note: "blood orange, smoked cream, dill oil", price: "12" },
      { name: "Charred hispi cabbage", note: "anchovy, toasted hazelnut, lemon", price: "9" },
      { name: "Beef tartare", note: "oyster cream, capers, charred rye", price: "14" },
      { name: "Potato terrine", note: "bay leaf, brown butter, chives", price: "8" },
      { name: "Sourdough & cultured butter", note: "baked in-house each morning", price: "5" },
    ],
  },
  {
    heading: "A little more",
    kicker: "Larger plates",
    plates: [
      { name: "Cornish hake", note: "white beans, wild garlic, brown shrimp", price: "19" },
      { name: "Short rib", note: "white miso, charred onion, bone marrow", price: "21" },
      { name: "Aged Comté", note: "quince, walnut, sourdough crackers", price: "11" },
    ],
  },
  {
    heading: "Last orders",
    kicker: "Something sweet",
    plates: [
      { name: "Burnt honey panna cotta", note: "thyme, candied lemon", price: "8" },
      { name: "Chocolate & olive oil", note: "Maldon salt, single-estate 72%", price: "8" },
    ],
  },
]

export const bar: MenuSection[] = [
  {
    heading: "Stirred & low-lit",
    kicker: "House cocktails",
    plates: [
      { name: "Midnight Negroni", note: "amber gin, bitter aperitivo, a breath of smoke", price: "12" },
      { name: "The Vinyl Sour", note: "rye, lemon, burnt sugar, egg white", price: "11" },
      { name: "Cold Static", note: "mezcal, pink grapefruit, sea salt", price: "12" },
    ],
  },
  {
    heading: "Nothing to prove",
    kicker: "No & low",
    plates: [
      { name: "Bramble Shrub", note: "blackberry, cider vinegar, soda — 0%", price: "6" },
      { name: "Tonight's pour", note: "skin-contact Furmint, Somló — by the glass", price: "9" },
    ],
  },
]

export interface Resident {
  name: string
  style: string
  bio: string
  seed: string
}

export const residents: Resident[] = [
  {
    name: "Marin Vega",
    style: "Brazilian jazz · spiritual soul",
    bio: "Spent fifteen years digging Rio's back-room record fairs. Plays the warm end of the night — bossa, samba-soul, the records that make the room lean in.",
    seed: "marin-portrait",
  },
  {
    name: "Otis Lund",
    style: "Dub · deep house · late ambient",
    bio: "Resident since the doors opened. Reads a room by the bass first, lets the low end do the talking, and never once takes a request.",
    seed: "otis-portrait",
  },
  {
    name: "June & the Tape Club",
    style: "Vinyl-only · 78s to now",
    bio: "A rotating collective of obsessives who treat a listening session like a sermon — Coltrane in full, no skips, lights all the way down.",
    seed: "june-portrait",
  },
]

export interface NightEvent {
  date: string
  day: string
  title: string
  host: string
}

export const nights: NightEvent[] = [
  { date: "26", day: "Thu", title: "Quiet Storm", host: "Marin Vega" },
  { date: "27", day: "Fri", title: "Low End Theory", host: "Otis Lund" },
  { date: "28", day: "Sat", title: "After Hours — Coltrane, complete", host: "June & the Tape Club" },
  { date: "29", day: "Sun", title: "Sunday Service — gospel & soul", host: "Guest selector" },
  { date: "03", day: "Thu", title: "Bossa & Bitters", host: "Marin Vega" },
]

export const rig: { item: string; spec: string }[] = [
  { item: "Loudspeakers", spec: "Klipschorn corner horns, re-coned 2019" },
  { item: "Amplification", spec: "McIntosh MC275 valve, all-tube signal path" },
  { item: "Decks", spec: "Thorens TD-124 & a Garrard 301 idler" },
  { item: "Mixer", spec: "Bozak CMA-10-2DL rotary, fully restored" },
]

export const houseRules: string[] = [
  "We play records, not requests.",
  "Phones down, volume up.",
  "Walk-ins live at the bar; tables are by reservation.",
  "The kitchen closes at midnight. The music doesn't.",
]
