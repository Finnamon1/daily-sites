/* =========================================================================
   HALFTONE — content
   A two-day risograph & small-press festival held in a converted paper mill
   on the Maas, Rotterdam. 12–13 September 2026. Talks, live presses, a fair.
   All copy is bespoke — no lorem.
   ========================================================================= */

export type Track = "Talk" | "Press" | "Panel" | "Screening"

export interface Session {
  start: string // "10:00"
  end: string
  title: string
  who: string
  role: string
  track: Track
  room: "Drum Hall" | "Ink Room" | "The Web" | "Bindery"
  blurb: string
}

export interface Day {
  label: string
  date: string
  sessions: Session[]
}

export const PROGRAMME: Day[] = [
  {
    label: "Day 01",
    date: "Sat 12 Sep",
    sessions: [
      {
        start: "10:00",
        end: "10:40",
        title: "Off-register, on purpose",
        who: "Mira Adeyemi",
        role: "Founder, Carbon & Pulp",
        track: "Talk",
        room: "Drum Hall",
        blurb:
          "Why a 2mm misalignment can carry more feeling than a flawless CMYK proof — and how to design for the slip instead of fighting it.",
      },
      {
        start: "11:00",
        end: "12:30",
        title: "Building a duotone from a flat photo",
        who: "Joon-ho Park",
        role: "Riso technician, Studio Maas",
        track: "Press",
        room: "Ink Room",
        blurb:
          "A live separation from a single phone snapshot to a two-drum print, pulled in front of you on a restored RP-3700.",
      },
      {
        start: "12:30",
        end: "13:30",
        title: "Ink & lunch",
        who: "The Mill Canteen",
        role: "Ground floor",
        track: "Screening",
        room: "Bindery",
        blurb:
          "Soup, sourdough, and a loop of grain-by-grain scans from the archive playing on the bindery wall.",
      },
      {
        start: "13:30",
        end: "14:20",
        title: "The zine that paid rent",
        who: "Petra Voss",
        role: "Editor, NIGHT WEB",
        track: "Talk",
        room: "Drum Hall",
        blurb:
          "Eight years of a fluorescent-pink quarterly: print runs, distro maths, and the issue that nearly ended it.",
      },
      {
        start: "14:40",
        end: "15:40",
        title: "Paper stock, out loud",
        who: "Adeyemi · Park · Voss",
        role: "Panel",
        track: "Panel",
        room: "Drum Hall",
        blurb:
          "Three makers argue GSM, deckle, and why the substrate is the first design decision you make, not the last.",
      },
      {
        start: "16:00",
        end: "17:00",
        title: "Overprint cinema",
        who: "Archive selects",
        role: "16mm + projection",
        track: "Screening",
        room: "The Web",
        blurb:
          "A reel of process films — drums spinning, masters drying, the smell of solvent you'll have to imagine.",
      },
    ],
  },
  {
    label: "Day 02",
    date: "Sun 13 Sep",
    sessions: [
      {
        start: "10:00",
        end: "10:45",
        title: "Colour you can't trust",
        who: "Inès Marchetti",
        role: "Colourist, Risotto Studio",
        track: "Talk",
        room: "Drum Hall",
        blurb:
          "Fluorescent pink shifts under every light in the room. A working method for designing with inks that refuse to behave.",
      },
      {
        start: "11:00",
        end: "12:30",
        title: "Binding a 64-page signature",
        who: "Hazel Crook",
        role: "Bindery lead, The Mill",
        track: "Press",
        room: "Bindery",
        blurb:
          "Fold, collate, saddle-stitch and trim a real booklet — you leave with the copy you bound.",
      },
      {
        start: "13:30",
        end: "14:20",
        title: "Selling 300 of a thing",
        who: "Theo Lindqvist",
        role: "Distro, Paper Plane",
        track: "Talk",
        room: "Drum Hall",
        blurb:
          "Pricing, consignment, and the unglamorous logistics that decide whether a small run ever leaves your flat.",
      },
      {
        start: "14:40",
        end: "15:50",
        title: "Two drums, four passes",
        who: "Joon-ho Park",
        role: "Riso technician, Studio Maas",
        track: "Press",
        room: "Ink Room",
        blurb:
          "Layering pink, blue, yellow and a knockout black into one A3 sheet — and where it always goes wrong.",
      },
      {
        start: "16:00",
        end: "17:00",
        title: "Last pull",
        who: "Everyone",
        role: "Closing",
        track: "Panel",
        room: "Drum Hall",
        blurb:
          "Open floor, leftover ink, and the swap table. Bring a print, take a print.",
      },
    ],
  },
]

export interface Workshop {
  title: string
  lead: string
  level: "All levels" | "Some print experience" | "Hands dirty already"
  length: string
  seats: number
  price: number
  summary: string
  seed: string
}

export const WORKSHOPS: Workshop[] = [
  {
    title: "Your first two-colour print",
    lead: "Joon-ho Park",
    level: "All levels",
    length: "120 min",
    seats: 12,
    price: 65,
    summary:
      "Separate an image into two drums, register it by eye, and pull an edition of ten on the floor's RP-3700.",
    seed: "risograph-drum-pink",
  },
  {
    title: "Halftone by hand",
    lead: "Inès Marchetti",
    level: "Some print experience",
    length: "90 min",
    seats: 10,
    price: 55,
    summary:
      "Build a dot screen from scratch and feel how angle and frequency change everything before it touches a drum.",
    seed: "halftone-dots-macro",
  },
  {
    title: "Saddle-stitch a zine, start to finish",
    lead: "Hazel Crook",
    level: "All levels",
    length: "150 min",
    seats: 14,
    price: 70,
    summary:
      "Impose, fold, collate, stitch and trim a 24-page booklet — leave with a bound copy and a folder of your own templates.",
    seed: "zine-bindery-thread",
  },
  {
    title: "Designing for the slip",
    lead: "Mira Adeyemi",
    level: "Hands dirty already",
    length: "100 min",
    seats: 9,
    price: 60,
    summary:
      "Compose artwork that uses misregistration as a feature — trapping, deliberate overlap, and the maths of a happy accident.",
    seed: "overprint-misregister",
  },
]

export interface Tier {
  name: string
  price: number
  cadence: string
  pitch: string
  perks: string[]
  featured?: boolean
}

export const TIERS: Tier[] = [
  {
    name: "Day pass",
    price: 28,
    cadence: "per day",
    pitch: "One floor, one day, every talk and screening.",
    perks: ["All talks & panels", "Entry to the Print Fair", "A festival riso poster", "Canteen discount"],
  },
  {
    name: "Weekender",
    price: 48,
    cadence: "both days",
    pitch: "The whole mill, both days — the way the festival is meant to land.",
    perks: [
      "Everything in Day pass",
      "Priority press-room seating",
      "Limited two-colour print, numbered",
      "Saturday after-hours swap",
    ],
    featured: true,
  },
  {
    name: "Maker",
    price: 120,
    cadence: "both days",
    pitch: "For people who'll be inky by noon. Includes one workshop seat.",
    perks: [
      "Everything in Weekender",
      "One workshop of your choice",
      "A flat-file of festival editions",
      "Name on the colophon wall",
    ],
  },
]

export const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 14, suffix: "th", label: "edition on the Maas" },
  { value: 9, suffix: "", label: "presses running live" },
  { value: 60, suffix: "+", label: "makers at the fair" },
  { value: 2400, suffix: "", label: "prints pulled in '25" },
]

export const FAIR = [
  { name: "Carbon & Pulp", city: "Rotterdam", seed: "press-studio-pink" },
  { name: "NIGHT WEB", city: "Berlin", seed: "zine-rack-blue" },
  { name: "Risotto Studio", city: "Glasgow", seed: "riso-prints-stack" },
  { name: "Paper Plane", city: "Lisbon", seed: "paper-distro-flat" },
  { name: "Studio Maas", city: "Antwerp", seed: "ink-drum-detail" },
  { name: "The Folded Sheet", city: "Oslo", seed: "bindery-fold-paper" },
]
