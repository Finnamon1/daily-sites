/* ── Birch House — design tokens & content ──────────────────────────────── */

/** Palette: warm birch neutrals, an ember (heat) accent, a steel (cold) accent.
 *  Ember is the dominant accent; steel appears only on cold-plunge moments so the
 *  warm/cold duality reads as concept, not gradient soup. All text meets AA. */
export const C = {
  bone: "#f4eee4", // page background
  boneSoft: "#ece3d3", // raised panels
  ink: "#211b15", // primary text
  inkSoft: "#5f5648", // muted text (6:1 on bone)
  line: "#dccfbb", // hairlines
  ember: "#a83f1d", // warm fill — cream text sits on top
  emberText: "#8f3614", // warm text on bone (8:1)
  emberOnDark: "#e3884c", // warm accent on charcoal
  steel: "#2c595f", // cold fill — cream text on top
  steelText: "#27535a", // cold text on bone (7:1)
  steelOnDark: "#7fc6cd", // cold accent on charcoal
  char: "#1a1611", // dark-section background
  charSoft: "#272019",
}

export type Temp = "warm" | "cold" | "still"

export interface Session {
  id: string
  name: string
  length: string
  price: number
  blurb: string
  note: string
}

export const SESSIONS: Session[] = [
  {
    id: "solo",
    name: "Solo Soak",
    length: "90 min",
    price: 42,
    blurb: "Sauna, plunge and rest at your own pace. No host, no schedule — just the cycle.",
    note: "Best for first visits",
  },
  {
    id: "circuit",
    name: "Contrast Circuit",
    length: "2 hr",
    price: 58,
    blurb: "Three guided heat-and-cold rounds led by a thermal host, with a closing pot of tea.",
    note: "Most booked",
  },
  {
    id: "quiet",
    name: "Quiet Hours",
    length: "2 hr",
    price: 48,
    blurb: "Evenings only. Phones in lockers, lights low, voices off. The house at its stillest.",
    note: "Members & evenings",
  },
]

export interface Space {
  name: string
  temp: Temp
  detail: string
  spec: string
  seed: string
}

export const SPACES: Space[] = [
  { name: "The Birch Sauna", temp: "warm", spec: "90°C · wood-fired · seats 12", detail: "Finnish-cut birch tiers above a cast stove. We ladle löyly on the hour; the heat climbs the higher you sit.", seed: "birch-sauna-wood-interior" },
  { name: "The Plunge", temp: "cold", spec: "4°C · spring-fed · steel", detail: "A brushed-steel pool kept just above freezing by cold mountain spring water. Sixty seconds is plenty.", seed: "cold-steel-plunge-pool" },
  { name: "The Steam Room", temp: "warm", spec: "45°C · eucalyptus · tiled", detail: "Soft, wet heat under a low vaulted ceiling. Eucalyptus on the half hour clears the head and the lungs.", seed: "tiled-steam-room-eucalyptus" },
  { name: "The Rain Court", temp: "cold", spec: "outdoor · year-round", detail: "An open-air garden of cold rain-showers under the fir trees. The Portland sky does half the work.", seed: "outdoor-rain-shower-garden-firs" },
  { name: "The Rest Hall", temp: "still", spec: "heated stone · silent", detail: "Warm stone benches, wool blankets and nothing to do. Where the contrast actually lands in the body.", seed: "quiet-rest-hall-stone-bench" },
]

export interface Round {
  n: number
  label: string
  temp: Temp
  time: string
  text: string
}

export const RITUAL: Round[] = [
  { n: 1, label: "Heat", temp: "warm", time: "10–15 min", text: "Climb into the sauna and stay until you feel a true sweat — not a moment of bravado, a real one." },
  { n: 2, label: "Plunge", temp: "cold", time: "30–60 sec", text: "Walk, don't leap. Lower in to the shoulders, breathe long and slow, and let the cold do its sharp work." },
  { n: 3, label: "Rest", temp: "still", time: "10 min", text: "This is the round people skip and the one that matters. Sit in the Rest Hall until your breath settles." },
]

export interface Plan {
  name: string
  price: string
  cadence: string
  perks: string[]
  featured?: boolean
}

export const PLANS: Plan[] = [
  { name: "Day Visit", price: "$42", cadence: "per visit", perks: ["Any single session", "Towel & robe included", "Tea in the Rest Hall"] },
  { name: "The Standing Soak", price: "$120", cadence: "per month", perks: ["Unlimited weekday visits", "Two guest passes a month", "Priority Quiet Hours booking", "Locked-in rate for a year"], featured: true },
  { name: "Twelve Card", price: "$420", cadence: "12 visits", perks: ["Twelve sessions, any kind", "Shareable with household", "Never expires"] },
]

export const FAQ: { q: string; a: string }[] = [
  { q: "Do I need to book ahead?", a: "Yes. The house is small on purpose — we cap each session so the sauna never feels crowded and the plunge never has a line. Walk-ins are welcome only if a slot is open." },
  { q: "What do I bring?", a: "A swimsuit and yourself. Towels, robes and sandals are waiting in your locker. Leave watches, phones and the rest of the day at the door." },
  { q: "Is it co-ed?", a: "Yes, all spaces are mixed and swimsuits are required throughout. Quiet Hours are phones-down and silent for everyone." },
  { q: "How cold is the plunge, really?", a: "Four degrees Celsius, year round. It is genuinely cold and that is the point. Thirty seconds counts; nobody is keeping score." },
]
