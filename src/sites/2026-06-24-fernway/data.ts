/* =========================================================================
   FERNWAY BOTANIC GARDEN — content
   A Victorian glasshouse garden on the edge of the city. The site re-themes
   itself by season; the data below carries the season-dependent palette and
   the "in bloom now" copy that swaps as you change seasons.
   ========================================================================= */

export type SeasonKey = "spring" | "summer" | "autumn" | "winter"

export interface Season {
  key: SeasonKey
  name: string
  months: string
  /** short headline mood, shown in the hero */
  mood: string
  blurb: string
  /** large fills / accents (on paper) */
  accent: string
  /** AA-safe accent for small text on paper bg */
  accentInk: string
  /** pale wash of the accent for chips/panels */
  accentSoft: string
  /** hero sky gradient behind the glass */
  skyA: string
  skyB: string
  /** foliage silhouette colour inside the glasshouse */
  leaf: string
  /** three things flowering / notable right now */
  bloom: { name: string; latin: string; where: string }[]
}

export const SEASONS: Season[] = [
  {
    key: "spring",
    name: "Spring",
    months: "Mar – May",
    mood: "Everything leaning toward the light.",
    blurb:
      "The cherry avenue breaks first, then the magnolias, then a fortnight of bulbs underfoot. The cold frames come off and the whole garden exhales.",
    accent: "#D8567E",
    accentInk: "#A82D55",
    accentSoft: "#F6E5EC",
    skyA: "#E9F3E2",
    skyB: "#CFE4CB",
    leaf: "#5C8A53",
    bloom: [
      { name: "Yoshino Cherry", latin: "Prunus × yedoensis", where: "The Avenue" },
      { name: "Lenten Rose", latin: "Helleborus orientalis", where: "Fern Gully" },
      { name: "Crown Imperial", latin: "Fritillaria imperialis", where: "Walled Border" },
    ],
  },
  {
    key: "summer",
    name: "Summer",
    months: "Jun – Aug",
    mood: "Glass full of heat and green.",
    blurb:
      "The Palm House runs at full canopy and the borders are loud with bees. Long evenings mean late openings, with the doors thrown wide to let the night air through.",
    accent: "#C8841E",
    accentInk: "#8A5712",
    accentSoft: "#F6ECD9",
    skyA: "#F4EFD8",
    skyB: "#E3D7A8",
    leaf: "#3F7A3C",
    bloom: [
      { name: "Stargazer Lily", latin: "Lilium 'Stargazer'", where: "Walled Border" },
      { name: "Bird of Paradise", latin: "Strelitzia reginae", where: "Palm House" },
      { name: "Queen of the Night", latin: "Selenicereus grandiflorus", where: "Desert Wing" },
    ],
  },
  {
    key: "autumn",
    name: "Autumn",
    months: "Sep – Nov",
    mood: "The slow burn before the quiet.",
    blurb:
      "Acer leaves turn the lower garden copper and the orchard fills the air with windfall. It is the season of seed-saving, of late asters, and of the best low light all year.",
    accent: "#B4541E",
    accentInk: "#933F14",
    accentSoft: "#F4E6DA",
    skyA: "#F1E6D2",
    skyB: "#D9BE97",
    leaf: "#9A6A2C",
    bloom: [
      { name: "Japanese Maple", latin: "Acer palmatum", where: "Lower Garden" },
      { name: "Michaelmas Daisy", latin: "Symphyotrichum novi-belgii", where: "Walled Border" },
      { name: "Toad Lily", latin: "Tricyrtis hirta", where: "Fern Gully" },
    ],
  },
  {
    key: "winter",
    name: "Winter",
    months: "Dec – Feb",
    mood: "Held under glass, kept warm.",
    blurb:
      "Outside is bare structure and frost; inside, the glasshouses keep a green secret. Scent does the work now — wintersweet, witch hazel, the first paperwhites — and the light trail opens after dark.",
    accent: "#3E7390",
    accentInk: "#2E5468",
    accentSoft: "#E2ECF1",
    skyA: "#E7EDF0",
    skyB: "#C4D2DA",
    leaf: "#3E6B5C",
    bloom: [
      { name: "Wintersweet", latin: "Chimonanthus praecox", where: "Walled Border" },
      { name: "Paperwhite", latin: "Narcissus papyraceus", where: "Cool House" },
      { name: "Witch Hazel", latin: "Hamamelis × intermedia", where: "Lower Garden" },
    ],
  },
]

export interface Glasshouse {
  name: string
  est: string
  climate: string
  temp: string
  seed: string
  hue: number
  blurb: string
}

export const GLASSHOUSES: Glasshouse[] = [
  {
    name: "The Palm House",
    est: "1871",
    climate: "Wet tropical",
    temp: "24°C",
    seed: "palmhouse-canopy",
    hue: 138,
    blurb:
      "Our oldest structure and still the tallest: thirty metres of curved iron and glass over a tropical canopy you can walk beneath. Mind the dripping ferns on the upper gantry.",
  },
  {
    name: "Fern Gully",
    est: "1889",
    climate: "Cool temperate",
    temp: "15°C",
    seed: "fern-ravine-shade",
    hue: 158,
    blurb:
      "A sunken ravine of tree ferns and filmy ferns kept in a perpetual soft drizzle. The most-photographed corner of the garden, and the coolest place to be in August.",
  },
  {
    name: "The Alpine House",
    est: "1924",
    climate: "High montane",
    temp: "9°C",
    seed: "alpine-scree-bed",
    hue: 200,
    blurb:
      "Cold, bright and gravelly. Cushion plants and saxifrages from the world's mountain screes, grown hard and low the way they like it. Vented day and night.",
  },
  {
    name: "Orchid Vault",
    est: "1902",
    climate: "Humid intermediate",
    temp: "21°C",
    seed: "orchid-epiphyte-case",
    hue: 300,
    blurb:
      "A humid, low-lit case for the epiphytes — slipper orchids, dragon orchids, and the year-round wonder of the jewel orchids' foliage. Limited entry, twenty at a time.",
  },
  {
    name: "The Carnivore Cabinet",
    est: "1998",
    climate: "Bog & heath",
    temp: "18°C",
    seed: "pitcher-plant-bog",
    hue: 96,
    blurb:
      "Pitcher plants, sundews and the famous Venus flytraps, fed on the garden's own surplus of fungus gnats. Our most-asked-about house, by some distance.",
  },
  {
    name: "Desert Wing",
    est: "1961",
    climate: "Arid",
    temp: "26°C",
    seed: "desert-succulent-house",
    hue: 38,
    blurb:
      "Low water, high drama. Century plants, golden barrels and a single night-blooming cereus that draws a midnight crowd once each July. Watered, it turns out, less than you'd think.",
  },
]

export interface Event {
  title: string
  season: SeasonKey
  when: string
  time: string
  kind: string
  blurb: string
}

export const EVENTS: Event[] = [
  {
    title: "Blossom Lates",
    season: "spring",
    when: "Apr 18 – 26",
    time: "Until 21:00",
    kind: "Evening opening",
    blurb: "The cherry avenue lit low after hours, with a bar in the Palm House and a slow loop of the borders by lantern.",
  },
  {
    title: "Dawn Chorus Walk",
    season: "spring",
    when: "May 4",
    time: "05:00",
    kind: "Guided walk",
    blurb: "Through the gates before the birds get going, led by our head of grounds. Coffee and a roll at the end of it.",
  },
  {
    title: "Botanical Illustration",
    season: "summer",
    when: "Jul 6, 13, 20",
    time: "10:00 – 13:00",
    kind: "Workshop",
    blurb: "Three Saturdays of drawing from life in the Walled Border. Materials found; bring only your eyes and patience.",
  },
  {
    title: "Glasshouse Jazz",
    season: "summer",
    when: "Aug 9",
    time: "19:30",
    kind: "Live music",
    blurb: "A quartet under the palms once the garden empties. Doors at seven; the heat by then is gorgeous.",
  },
  {
    title: "Harvest & Seed Fair",
    season: "autumn",
    when: "Sep 27 – 28",
    time: "10:00 – 16:00",
    kind: "Fair",
    blurb: "Swap seed, taste apples you've never heard of, and take home a cutting from the propagation benches.",
  },
  {
    title: "Fungi Forage",
    season: "autumn",
    when: "Oct 19",
    time: "11:00",
    kind: "Guided walk",
    blurb: "A careful, lawful wander through the lower garden with a mycologist who will not let you eat anything.",
  },
  {
    title: "Winter Light Trail",
    season: "winter",
    when: "Dec 5 – Jan 4",
    time: "16:30 – 21:00",
    kind: "After dark",
    blurb: "A kilometre of the garden lit up after sunset, ending in the steamed-up warmth of the Palm House.",
  },
  {
    title: "Camellia Unveiling",
    season: "winter",
    when: "Feb 14",
    time: "12:00",
    kind: "Opening",
    blurb: "The Cool House opens its doors on the first camellias of the year — two hundred of them, all at once.",
  },
]

export const STATS = [
  { value: 1871, label: "Gates first opened", suffix: "" },
  { value: 12400, label: "Species under our care", suffix: "" },
  { value: 38, label: "Acres of garden", suffix: "" },
  { value: 6, label: "Working glasshouses", suffix: "" },
]

export interface Tier {
  name: string
  price: string
  cadence: string
  blurb: string
  perks: string[]
  featured?: boolean
}

export const TIERS: Tier[] = [
  {
    name: "Day Ticket",
    price: "£12",
    cadence: "per adult",
    blurb: "Everything open, all day. Under-16s free, always.",
    perks: ["All six glasshouses", "Walled Border & grounds", "Glasshouse café", "Re-entry until close"],
  },
  {
    name: "Friend of Fernway",
    price: "£68",
    cadence: "per year",
    blurb: "For the regulars. Pays for itself by your sixth visit.",
    perks: [
      "Unlimited free entry",
      "A guest with you each time",
      "10% off the café & shop",
      "Members' evenings & early Lates",
    ],
    featured: true,
  },
  {
    name: "Patron",
    price: "£250",
    cadence: "per year",
    blurb: "For those who'd like the place to outlast us all.",
    perks: [
      "Everything in Friend, for two",
      "Behind-the-glass propagation tours",
      "Named on the donor wall",
      "First sight of new acquisitions",
    ],
  },
]
