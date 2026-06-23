// The Paragon — a single-screen repertory cinema, est. 1931. All copy is
// written for a fictional 84-seat picture house running a rotating program of
// restorations and seasons. Poster art is approximated with deterministic
// picsum seeds, treated in a warm duotone so the mismatched frames cohere.

export interface Film {
  slug: string
  title: string
  /** Upper-cased, abbreviated for the Solari board (≤ 20 chars). */
  board: string
  year: number
  director: string
  country: string
  runtime: number // minutes
  cert: string
  season: string
  note: string
  /** Showtimes used on the board + program page. */
  times: string[]
  seed: string
}

export const films: Film[] = [
  {
    slug: "vertigo",
    title: "Vertigo",
    board: "VERTIGO",
    year: 1958,
    director: "Alfred Hitchcock",
    country: "USA",
    runtime: 128,
    cert: "PG",
    season: "Hitchcock in 70mm",
    note: "A new 4K restoration of the great dread-spiral — green hotel light, a city that keeps folding back on itself, and Bernard Herrmann at his most vertiginous.",
    times: ["15:00", "19:30"],
    seed: "paragon-vertigo",
  },
  {
    slug: "in-the-mood-for-love",
    title: "In the Mood for Love",
    board: "IN THE MOOD",
    year: 2000,
    director: "Wong Kar-wai",
    country: "Hong Kong",
    runtime: 98,
    cert: "12A",
    season: "Wong Kar-wai: Time & Longing",
    note: "Two neighbours, a hallway, a hundred cigarettes. We are showing the restored print on a Saturday loop — bring someone you can't quite say it to.",
    times: ["18:15", "21:00"],
    seed: "paragon-mood",
  },
  {
    slug: "stalker",
    title: "Stalker",
    board: "STALKER",
    year: 1979,
    director: "Andrei Tarkovsky",
    country: "USSR",
    runtime: 162,
    cert: "PG",
    season: "Tarkovsky: The Long Take",
    note: "Three men walk into a forbidden Zone in search of a room that grants your deepest wish. Slow, sodden, transcendent. There will be an interval.",
    times: ["14:30"],
    seed: "paragon-stalker",
  },
  {
    slug: "the-red-shoes",
    title: "The Red Shoes",
    board: "THE RED SHOES",
    year: 1948,
    director: "Powell & Pressburger",
    country: "UK",
    runtime: 135,
    cert: "U",
    season: "Technicolor Dreams",
    note: "The film that made a generation run away to the ballet. Restored Technicolor so saturated it practically stains the screen.",
    times: ["13:30", "17:45"],
    seed: "paragon-redshoes",
  },
  {
    slug: "cleo-from-5-to-7",
    title: "Cléo from 5 to 7",
    board: "CLEO 5 TO 7",
    year: 1962,
    director: "Agnès Varda",
    country: "France",
    runtime: 90,
    cert: "PG",
    season: "Varda & the Left Bank",
    note: "Ninety minutes in near real time as a singer waits on a diagnosis and wanders a sunlit, anxious Paris. New subtitles, old magic.",
    times: ["16:00", "20:30"],
    seed: "paragon-cleo",
  },
  {
    slug: "harakiri",
    title: "Harakiri",
    board: "HARAKIRI",
    year: 1962,
    director: "Masaki Kobayashi",
    country: "Japan",
    runtime: 133,
    cert: "15",
    season: "Swords & Silence",
    note: "A ronin asks to die in a lord's courtyard, and the courtyard's pieties unravel. Among the most precisely composed films ever cut.",
    times: ["20:00"],
    seed: "paragon-harakiri",
  },
]

/** Compact rows for the Solari board on the home page. */
export interface BoardItem {
  board: string
  cert: string
  time: string
}

export const nowShowing: BoardItem[] = [
  { board: "VERTIGO", cert: "PG", time: "19:30" },
  { board: "IN THE MOOD", cert: "12A", time: "21:00" },
  { board: "STALKER", cert: "PG", time: "14:30" },
  { board: "THE RED SHOES", cert: "U", time: "17:45" },
  { board: "CLEO 5 TO 7", cert: "PG", time: "20:30" },
]

export interface Season {
  title: string
  span: string
  blurb: string
  count: number
  seed: string
}

export const seasons: Season[] = [
  {
    title: "Wong Kar-wai: Time & Longing",
    span: "Through 12 July",
    blurb: "Six features in fresh restorations, plus a Sunday talk on the films' clocks, mirrors and missed connections.",
    count: 6,
    seed: "paragon-wkw",
  },
  {
    title: "Technicolor Dreams",
    span: "Saturdays in summer",
    blurb: "Three-strip spectacle from Powell & Pressburger to Minnelli, projected as loud and as bright as the format allows.",
    count: 5,
    seed: "paragon-technicolor",
  },
  {
    title: "After Midnight",
    span: "Last Friday, monthly",
    blurb: "A standing late slot for the strange and the scratched — giallo, noir, and 16mm oddities from the vault.",
    count: 4,
    seed: "paragon-midnight",
  },
]

export interface ScheduleDay {
  day: string
  date: string
  sessions: { time: string; title: string; cert: string; tag?: string }[]
}

export const week: ScheduleDay[] = [
  {
    day: "Tue",
    date: "24 Jun",
    sessions: [
      { time: "14:30", title: "Stalker", cert: "PG" },
      { time: "19:30", title: "Vertigo", cert: "PG", tag: "70mm" },
    ],
  },
  {
    day: "Wed",
    date: "25 Jun",
    sessions: [
      { time: "16:00", title: "Cléo from 5 to 7", cert: "PG" },
      { time: "20:00", title: "Harakiri", cert: "15" },
    ],
  },
  {
    day: "Thu",
    date: "26 Jun",
    sessions: [
      { time: "13:30", title: "The Red Shoes", cert: "U" },
      { time: "18:15", title: "In the Mood for Love", cert: "12A" },
      { time: "21:00", title: "In the Mood for Love", cert: "12A", tag: "Sold out" },
    ],
  },
  {
    day: "Fri",
    date: "27 Jun",
    sessions: [
      { time: "17:45", title: "The Red Shoes", cert: "U" },
      { time: "20:30", title: "Cléo from 5 to 7", cert: "PG" },
      { time: "23:30", title: "After Midnight: Suspiria", cert: "18", tag: "Late" },
    ],
  },
  {
    day: "Sat",
    date: "28 Jun",
    sessions: [
      { time: "15:00", title: "Vertigo", cert: "PG" },
      { time: "18:15", title: "In the Mood for Love", cert: "12A" },
      { time: "21:00", title: "In the Mood for Love", cert: "12A" },
    ],
  },
  {
    day: "Sun",
    date: "29 Jun",
    sessions: [
      { time: "12:00", title: "Talk: The Clocks of Wong Kar-wai", cert: "—", tag: "Free" },
      { time: "14:30", title: "Harakiri", cert: "15" },
      { time: "19:00", title: "Stalker", cert: "PG", tag: "Interval" },
    ],
  },
]

export interface Tier {
  name: string
  price: string
  cadence: string
  line: string
  perks: string[]
  featured?: boolean
}

export const tiers: Tier[] = [
  {
    name: "Friend",
    price: "£6",
    cadence: "/ month",
    line: "For the regular who'd come anyway.",
    perks: [
      "£2 off every ticket",
      "Priority booking, 48 hours early",
      "The printed monthly programme, posted",
    ],
  },
  {
    name: "Patron",
    price: "£14",
    cadence: "/ month",
    line: "For the one who brings the whole row.",
    featured: true,
    perks: [
      "Everything in Friend, plus —",
      "Two guest tickets each month",
      "Invites to restoration previews",
      "Your name on the lobby board",
    ],
  },
  {
    name: "Benefactor",
    price: "£40",
    cadence: "/ month",
    line: "For keeping the projector running.",
    perks: [
      "Everything in Patron, plus —",
      "Two seats held for you, any show",
      "A season you help us programme",
      "Dinner with the team, twice a year",
    ],
  },
]

export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: "Do you only show old films?",
    a: "Mostly — restorations, classics and seasons on 35mm, 70mm and DCP. But we slot in new independent releases and one-off premieres when they deserve the big screen.",
  },
  {
    q: "Is there an interval?",
    a: "On anything over two hours, yes. We stop the reel, raise the house lights halfway, and the bar stays open. Stalker and Harakiri both have one.",
  },
  {
    q: "Can I bring food and drink in?",
    a: "Drinks from our bar, glass and all, are welcome in the auditorium. We ask that hot food stays in the lobby — the seats are from 1931 and we'd like to keep them.",
  },
  {
    q: "Is the building accessible?",
    a: "The stalls, bar and accessible WC are step-free from the Powis Street entrance. Two wheelchair spaces sit at the back of the stalls — call ahead and we'll hold them.",
  },
]
