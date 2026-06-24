/* =========================================================================
   ROOMTONE — content
   A documentary-audio network: shows, episodes, the people who make them.
   "Room tone" is the recorded silence of an empty room — the bed every
   edit is built on. The brand listens to the quiet.
   ========================================================================= */

export interface Show {
  id: string
  title: string
  tagline: string
  host: string
  cadence: string
  episodes: number
  hue: number // duotone art hue
  seed: string
  blurb: string
}

export interface Episode {
  id: string
  show: string // Show.id
  showTitle: string
  no: number
  title: string
  dek: string
  /** length in seconds */
  length: number
  date: string // display date
  hue: number
  seed: string
  /** deterministic seed string for the waveform */
  wave: string
}

export const SHOWS: Show[] = [
  {
    id: "long-quiet",
    title: "The Long Quiet",
    tagline: "Field recordings of places going silent",
    host: "Edith Maro",
    cadence: "Fortnightly",
    episodes: 41,
    hue: 92,
    seed: "roomtone-marsh-dawn-reeds",
    blurb:
      "Edith Maro carries a parabolic mic to glaciers, drained lakes and motorway verges — listening for the exact moment a soundscape disappears for good.",
  },
  {
    id: "carrier-signal",
    title: "Carrier Signal",
    tagline: "A century of voices over the air",
    host: "Theo Bask",
    cadence: "Monthly",
    episodes: 28,
    hue: 64,
    seed: "roomtone-vintage-radio-valves",
    blurb:
      "The pirate stations, number broadcasts and shipping forecasts that taught the world to listen at a distance — reconstructed from tape and testimony.",
  },
  {
    id: "sessions",
    title: "Roomtone Sessions",
    tagline: "One musician, one take, no edit",
    host: "Nadia Crane",
    cadence: "Weekly",
    episodes: 73,
    hue: 110,
    seed: "roomtone-piano-studio-mics",
    blurb:
      "We clear the room, set two ribbon mics, and ask an artist to play something they've never recorded. Whatever happens in those minutes is the episode.",
  },
  {
    id: "dead-air",
    title: "Dead Air",
    tagline: "True stories about silence",
    host: "Marcus Vey",
    cadence: "Seasonal",
    episodes: 16,
    hue: 78,
    seed: "roomtone-empty-control-room",
    blurb:
      "A negotiator's held breath. A courtroom's pause. The four minutes a mission lost contact. Marcus Vey reports from the gaps where nothing was said.",
  },
]

export const EPISODES: Episode[] = [
  {
    id: "ep-glass-lake",
    show: "long-quiet",
    showTitle: "The Long Quiet",
    no: 41,
    title: "The Lake That Rang",
    dek: "Before the reservoir drained, the village bells had been underwater for sixty years. We went down to record them one last time.",
    length: 2748,
    date: "Jun 18, 2026",
    hue: 92,
    seed: "roomtone-drained-reservoir-bells",
    wave: "lake-that-rang-ssss",
  },
  {
    id: "ep-numbers",
    show: "carrier-signal",
    showTitle: "Carrier Signal",
    no: 28,
    title: "The Woman Who Read Numbers",
    dek: "For thirty years a single voice counted into the static on shortwave. We found the studio, and the person it belonged to.",
    length: 3216,
    date: "Jun 11, 2026",
    hue: 64,
    seed: "roomtone-shortwave-numbers-station",
    wave: "woman-who-read-numbers",
  },
  {
    id: "ep-cellist",
    show: "sessions",
    showTitle: "Roomtone Sessions",
    no: 73,
    title: "Session 73 — Asa Linden, solo cello",
    dek: "Asa walked in with no sheet music and a borrowed cello. What she played in the next eleven minutes left the engineers silent.",
    length: 1654,
    date: "Jun 9, 2026",
    hue: 110,
    seed: "roomtone-cello-single-take",
    wave: "asa-linden-solo-cello",
  },
  {
    id: "ep-four-minutes",
    show: "dead-air",
    showTitle: "Dead Air",
    no: 16,
    title: "Four Minutes of Nothing",
    dek: "Mission control lost the capsule on the far side of the moon. This is what those four minutes sounded like from the ground.",
    length: 2402,
    date: "May 28, 2026",
    hue: 78,
    seed: "roomtone-mission-control-night",
    wave: "four-minutes-of-nothing",
  },
  {
    id: "ep-verge",
    show: "long-quiet",
    showTitle: "The Long Quiet",
    no: 40,
    title: "Nightingales on the Hard Shoulder",
    dek: "The last urban nightingales now sing against six lanes of traffic. Edith spends a night on the verge, levels in the red.",
    length: 2190,
    date: "May 21, 2026",
    hue: 92,
    seed: "roomtone-motorway-verge-night",
    wave: "nightingales-hard-shoulder",
  },
  {
    id: "ep-pirate",
    show: "carrier-signal",
    showTitle: "Carrier Signal",
    no: 27,
    title: "The Boat That Was a Station",
    dek: "Anchored just outside the law, a rusting trawler broadcast pop music to millions. Two of its DJs are still alive. Just.",
    length: 3010,
    date: "May 14, 2026",
    hue: 64,
    seed: "roomtone-pirate-radio-ship",
    wave: "boat-that-was-a-station",
  },
]

export const STATS = [
  { value: 158, suffix: "", label: "episodes published" },
  { value: 1.4, suffix: "M", label: "monthly listeners", decimals: 1 },
  { value: 2100, suffix: "+", label: "hours of tape archived" },
  { value: 47, suffix: "", label: "countries recorded in" },
]

export const PRESS = [
  "“The closest thing audio has to a darkroom.” — The Paris Listener",
  "Peabody-nominated, twice",
  "“You can hear the room breathing.” — Frequency Quarterly",
  "Apple Podcasts — Show of the Year",
  "“Documentary made of silence.” — The Wireless",
]

export const TEAM = [
  { name: "Edith Maro", role: "Founder · Field recordist", seed: "roomtone-portrait-edith", hue: 92 },
  { name: "Theo Bask", role: "Series producer", seed: "roomtone-portrait-theo", hue: 64 },
  { name: "Nadia Crane", role: "Sessions producer", seed: "roomtone-portrait-nadia", hue: 110 },
  { name: "Marcus Vey", role: "Reporter-at-large", seed: "roomtone-portrait-marcus", hue: 78 },
  { name: "June Adeyemi", role: "Re-recording mixer", seed: "roomtone-portrait-june", hue: 100 },
  { name: "Caleb Frost", role: "Archive & restoration", seed: "roomtone-portrait-caleb", hue: 70 },
]
