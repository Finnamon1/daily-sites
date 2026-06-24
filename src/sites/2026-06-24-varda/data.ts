export type Level = "Moderate" | "Demanding" | "Expedition"

export interface Expedition {
  id: string
  name: string
  region: string
  seed: string
  hue: number
  days: number
  grade: Level
  party: number
  fromGBP: number
  season: string
  blurb: string
  highlights: string[]
  ascentM: number
}

export const EXPEDITIONS: Expedition[] = [
  {
    id: "northern-traverse",
    name: "The Northern Traverse",
    region: "Kalsoy & Kunoy",
    seed: "faroe-kalsoy-ridge",
    hue: 206,
    days: 6,
    grade: "Expedition",
    party: 8,
    fromGBP: 2400,
    season: "May – September",
    ascentM: 4200,
    blurb:
      "Six days along the spine of the northern islands, sleeping in turf-roofed huts and crossing to the Kallur lighthouse where the cliff falls clean into the sea.",
    highlights: ["Kallur lighthouse at first light", "Ferry crossing to Kunoy", "Two nights in floor-malted huts"],
  },
  {
    id: "mykines-seabirds",
    name: "Mykines Seabird Passage",
    region: "Mykines",
    seed: "faroe-mykines-puffin",
    hue: 30,
    days: 4,
    grade: "Moderate",
    party: 6,
    fromGBP: 1650,
    season: "June – August",
    ascentM: 1600,
    blurb:
      "The westernmost island, reached by a small boat that only sails when the swell forgives it. Walk the headland between thousands of nesting puffins and gannets.",
    highlights: ["Puffin colony at Lambi", "Mykineshólmur footbridge", "Storm-watching from the lighthouse"],
  },
  {
    id: "western-sounds",
    name: "Saksun & the Western Sounds",
    region: "Streymoy & Vágar",
    seed: "faroe-saksun-lagoon",
    hue: 198,
    days: 5,
    grade: "Moderate",
    party: 8,
    fromGBP: 1980,
    season: "April – October",
    ascentM: 2600,
    blurb:
      "From the hidden lagoon at Saksun to the lake that hangs above the ocean at Sørvágsvatn — five days of the islands' most photographed and least crowded country.",
    highlights: ["Sørvágsvatn 'lake above the sea'", "Múlafossur waterfall", "The black church at Saksun"],
  },
  {
    id: "slaettaratindur",
    name: "The Slættaratindur Ascent",
    region: "Eysturoy",
    seed: "faroe-slaettaratindur-summit",
    hue: 214,
    days: 3,
    grade: "Demanding",
    party: 6,
    fromGBP: 1420,
    season: "June – September",
    ascentM: 1900,
    blurb:
      "A focused push for the islands' highest point at 880 metres. On a clear midsummer night the summit holds the last light long after the valleys have gone dark.",
    highlights: ["880 m summit at midnight sun", "Gjógv sea-gorge village", "Eiði coastal traverse"],
  },
]

export interface Island {
  name: string
  pop: number
  highM: number
  areaKm: number
  hue: number
  seed: string
  note: string
}

export const ISLANDS: Island[] = [
  { name: "Streymoy", pop: 24486, highM: 789, areaKm: 374, hue: 202, seed: "faroe-streymoy-coast", note: "The largest island and home to Tórshavn, the world's smallest capital." },
  { name: "Eysturoy", pop: 11247, highM: 880, areaKm: 286, hue: 214, seed: "faroe-eysturoy-peak", note: "Holds Slættaratindur, the highest point in the country at 880 m." },
  { name: "Vágar", pop: 3225, highM: 722, areaKm: 178, hue: 196, seed: "faroe-vagar-lake", note: "The island of the lake-above-the-sea and the country's only airport." },
  { name: "Mykines", pop: 14, highM: 560, areaKm: 10, hue: 32, seed: "faroe-mykines-cliffs", note: "Fourteen residents and tens of thousands of seabirds; reached only by boat or helicopter." },
  { name: "Kalsoy", pop: 73, highM: 787, areaKm: 31, hue: 208, seed: "faroe-kalsoy-tunnel", note: "A thin sliver of rock threaded by single-lane tunnels, ending at the Kallur light." },
  { name: "Suðuroy", pop: 4601, highM: 571, areaKm: 166, hue: 190, seed: "faroe-suduroy-stacks", note: "The southernmost island, two hours by ferry, with the wildest western cliffs." },
]

/** Story chapters for the home scroll-snap sequence. */
export const CHAPTERS = [
  {
    no: "01",
    seed: "faroe-fog-ridge-walk",
    hue: 205,
    kicker: "The weather decides",
    title: "We don't fight the fog. We follow it.",
    body: "Eighteen islands, and rarely the same forecast on two of them at once. Every Varða route has a fair-weather plan and a foul-weather plan, and a guide who knows which path the cloud forgives.",
  },
  {
    no: "02",
    seed: "faroe-turf-house-valley",
    hue: 30,
    kicker: "Small by design",
    title: "Eight walkers. Never nine.",
    body: "A small party moves quietly, fits in one boat, and sleeps in the turf-roofed huts that a coach tour never could. You'll know everyone's name by the second morning.",
  },
  {
    no: "03",
    seed: "faroe-cliff-sea-light",
    hue: 212,
    kicker: "Born here",
    title: "Guided by people who read this coast.",
    body: "Our guides grew up on these slopes — they know the tide tables, the bird cliffs, the farmer whose field is the only dry shortcut. Local knowledge is the whole expedition.",
  },
]

export const STATS = [
  { value: 18, suffix: "", label: "islands, all walkable" },
  { value: 880, suffix: " m", label: "to the highest summit" },
  { value: 8, suffix: "", label: "walkers, maximum party" },
  { value: 96, suffix: "%", label: "of trips run as planned" },
]
