/* The Strand — programme data. Real copy, no lorem. */

export type Strand =
  | "New Releases"
  | "Restorations"
  | "Late Night"
  | "Matinee"
  | "Documentary"

export interface Film {
  id: string
  title: string
  director: string
  year: number
  runtime: number // minutes
  cert: string
  strand: Strand
  blurb: string
  seed: string // picsum seed for the still
  showtimes: string[]
}

export const FILMS: Film[] = [
  {
    id: "nightjar",
    title: "Nightjar",
    director: "Aïda Moreau",
    year: 2024,
    runtime: 118,
    cert: "15",
    strand: "New Releases",
    blurb:
      "A lighthouse keeper on the Atlantic fringe starts receiving radio broadcasts that haven't been sent yet. Moreau's debut is a patient, salt-bitten study of grief told almost entirely in long, breathing takes.",
    seed: "strand-lighthouse-dusk",
    showtimes: ["13:15", "18:00", "20:45"],
  },
  {
    id: "the-salt-road",
    title: "The Salt Road",
    director: "Tomas Renn",
    year: 2023,
    runtime: 134,
    cert: "12A",
    strand: "New Releases",
    blurb:
      "Three generations of a Saharan caravan family weigh tradition against a road that will make their route obsolete. Sweeping, sun-cracked, and surprisingly funny.",
    seed: "strand-desert-caravan",
    showtimes: ["14:30", "19:30"],
  },
  {
    id: "rear-window",
    title: "Rear Window",
    director: "Alfred Hitchcock",
    year: 1954,
    runtime: 112,
    cert: "PG",
    strand: "Restorations",
    blurb:
      "Our new 4K restoration of the definitive single-set thriller. A housebound photographer becomes convinced he has watched a murder unfold across the courtyard.",
    seed: "strand-apartment-window",
    showtimes: ["15:45", "20:15"],
  },
  {
    id: "daughters",
    title: "Daughters of the Dust",
    director: "Julie Dash",
    year: 1991,
    runtime: 112,
    cert: "PG",
    strand: "Restorations",
    blurb:
      "Julie Dash's luminous Gullah-Geechee family portrait returns to the big screen where its painterly compositions belong. Introduced by our programmer.",
    seed: "strand-coastal-grass",
    showtimes: ["12:00", "17:15"],
  },
  {
    id: "wolfpine",
    title: "Wolfpine",
    director: "Greta Halloran",
    year: 2022,
    runtime: 97,
    cert: "18",
    strand: "Late Night",
    blurb:
      "A folk-horror cult favourite, screened on 35mm with all the hiss and grain intact. Stay for the woods. Don't stay for the village fête.",
    seed: "strand-dark-forest",
    showtimes: ["22:30"],
  },
  {
    id: "marble-index",
    title: "The Marble Index",
    director: "Lena Sørbø",
    year: 2024,
    runtime: 88,
    cert: "U",
    strand: "Documentary",
    blurb:
      "Inside the last working marble quarry in Carrara, where stone is still read like weather. A quiet, monumental documentary about labour and patience.",
    seed: "strand-marble-quarry",
    showtimes: ["16:00", "18:45"],
  },
  {
    id: "kiki",
    title: "Kiki's Delivery Service",
    director: "Hayao Miyazaki",
    year: 1989,
    runtime: 103,
    cert: "U",
    strand: "Matinee",
    blurb:
      "Our Sunday family matinee. A young witch finds her feet — and her broom — in a seaside town. Babes-in-arms welcome; lights kept low, not dark.",
    seed: "strand-seaside-town",
    showtimes: ["11:00"],
  },
  {
    id: "blue-hour",
    title: "Blue Hour",
    director: "Marisol Vega",
    year: 2024,
    runtime: 109,
    cert: "15",
    strand: "New Releases",
    blurb:
      "Two estranged sisters drive overnight across a country on the edge of a strike. Shot entirely in the half-light between sunset and morning.",
    seed: "strand-night-drive",
    showtimes: ["13:45", "21:00"],
  },
]

export const STRANDS: Strand[] = [
  "New Releases",
  "Restorations",
  "Late Night",
  "Matinee",
  "Documentary",
]

export interface Tier {
  name: string
  price: string
  cadence: string
  pitch: string
  perks: string[]
  featured?: boolean
}

export const TIERS: Tier[] = [
  {
    name: "Matinee",
    price: "£6",
    cadence: "/ month",
    pitch: "For the occasional Sunday.",
    perks: [
      "£2 off every ticket",
      "Members' Tuesday previews",
      "Programme posted to your door",
    ],
  },
  {
    name: "Double Bill",
    price: "£14",
    cadence: "/ month",
    pitch: "Our most-loved membership.",
    perks: [
      "Two free tickets a month",
      "£2 off all further tickets",
      "Priority booking, 48h early",
      "10% off the café & bar",
      "Bring a guest to previews",
    ],
    featured: true,
  },
  {
    name: "Patron",
    price: "£30",
    cadence: "/ month",
    pitch: "Keep the projector running.",
    perks: [
      "Everything in Double Bill",
      "Unlimited standard screenings",
      "Name on the patrons' wall",
      "Two guest passes each month",
      "Invitations to private screenings",
    ],
  },
]

export const STATS = [
  { value: 312, suffix: "", label: "Films a year" },
  { value: 1932, suffix: "", label: "Opened, as the Regal" },
  { value: 248, suffix: "", label: "Seats, one screen" },
  { value: 35, suffix: "mm", label: "Projection, still running" },
]
