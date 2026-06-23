/* Content for Reyes Marlow — large-format photographer of the American West.
 * Real copy; deterministic picsum seeds. Imagery is grayscale + warm-tinted
 * in the UI so the random frames cohere into one gallery wall. */

export interface Photo {
  id: string
  title: string
  place: string
  year: number
  /** technical metadata in a photographer's shorthand */
  spec: string
  series: string
  seed: string
}

export const photos: Photo[] = [
  {
    id: "p1",
    title: "Salt Pan, First Light",
    place: "Black Rock, Nevada",
    year: 2024,
    spec: "8×10 · 210mm · Portra 400 · f/45",
    series: "Saltworks",
    seed: "marlow-saltpan-dawn",
  },
  {
    id: "p2",
    title: "Vacancy",
    place: "Highway 50, Utah",
    year: 2023,
    spec: "4×5 · 150mm · Tri-X · f/22",
    series: "Roadside",
    seed: "marlow-motel-vacancy",
  },
  {
    id: "p3",
    title: "Mesa, Holding Heat",
    place: "Comb Ridge, Utah",
    year: 2024,
    spec: "8×10 · 300mm · Ektar · f/64",
    series: "High Desert",
    seed: "marlow-mesa-heat",
  },
  {
    id: "p4",
    title: "The Long Night, II",
    place: "Alvord Desert, Oregon",
    year: 2022,
    spec: "4×5 · 90mm · Acros II · 14 min",
    series: "The Long Night",
    seed: "marlow-stars-alvord",
  },
  {
    id: "p5",
    title: "Conveyor",
    place: "Wendover, Utah",
    year: 2023,
    spec: "8×10 · 210mm · Portra 160 · f/45",
    series: "Saltworks",
    seed: "marlow-conveyor",
  },
  {
    id: "p6",
    title: "Two Pumps, No Brand",
    place: "Goldfield, Nevada",
    year: 2024,
    spec: "4×5 · 135mm · Portra 400 · f/32",
    series: "Roadside",
    seed: "marlow-gas-goldfield",
  },
  {
    id: "p7",
    title: "Creosote",
    place: "Mojave Preserve, California",
    year: 2023,
    spec: "8×10 · 240mm · Ektar · f/64",
    series: "High Desert",
    seed: "marlow-creosote",
  },
  {
    id: "p8",
    title: "Evaporation Pond 7",
    place: "Great Salt Lake, Utah",
    year: 2024,
    spec: "8×10 · 300mm · Portra 400 · f/45",
    series: "Saltworks",
    seed: "marlow-pond-seven",
  },
  {
    id: "p9",
    title: "Drive-In, Closed Since '88",
    place: "Tonopah, Nevada",
    year: 2022,
    spec: "4×5 · 90mm · Tri-X · f/22",
    series: "Roadside",
    seed: "marlow-drivein-tonopah",
  },
  {
    id: "p10",
    title: "Milk River Under Perseids",
    place: "Big Bend, Texas",
    year: 2023,
    spec: "4×5 · 75mm · Acros II · 22 min",
    series: "The Long Night",
    seed: "marlow-perseids-bigbend",
  },
  {
    id: "p11",
    title: "Wind, Recorded",
    place: "Bonneville, Utah",
    year: 2024,
    spec: "8×10 · 210mm · Portra 160 · f/45",
    series: "Saltworks",
    seed: "marlow-wind-bonneville",
  },
  {
    id: "p12",
    title: "Last Room on the Left",
    place: "Beatty, Nevada",
    year: 2022,
    spec: "4×5 · 150mm · Portra 400 · f/22",
    series: "Roadside",
    seed: "marlow-room-beatty",
  },
]

export const seriesList = [
  "All",
  "Saltworks",
  "High Desert",
  "Roadside",
  "The Long Night",
] as const

export interface Series {
  slug: string
  name: string
  years: string
  dek: string
  body: string[]
  seeds: string[]
  frames: number
}

export const series: Series[] = [
  {
    slug: "saltworks",
    name: "Saltworks",
    years: "2022 — ongoing",
    dek: "What happens to a flat when we ask it to make money.",
    body: [
      "The evaporation ponds west of the Great Salt Lake are the largest man-made objects most people will never see. From the berm they read as colour fields — rust, ochre, a green that has no business in a desert — but on the ground glass of an 8×10 they resolve into something closer to weather: a surface that is always halfway between liquid and stone.",
      "I worked the Saltworks across two summers, always before nine and after six, when the light comes in low enough to find texture in a thing that wants to be featureless. The conveyors and pump houses are incidental. The subject is the slow industrial patience of turning water into salt, and the strange beauty we make by accident while doing it.",
    ],
    seeds: ["marlow-saltpan-dawn", "marlow-conveyor", "marlow-pond-seven", "marlow-wind-bonneville"],
    frames: 31,
  },
  {
    slug: "the-long-night",
    name: "The Long Night",
    years: "2021 — 2023",
    dek: "Single exposures, fourteen to thirty minutes, no second frame.",
    body: [
      "There is a discipline to a twenty-minute exposure that digital has quietly retired. You set the camera, open the shutter, and then you wait in the dark with nothing to do but be present to the place. No chimping, no bracketing, no second chance. If a car comes over the rise you have ruined the negative and you start again tomorrow.",
      "Every frame in The Long Night is one exposure on one sheet of film. The stars draw their own arcs; the land records whatever ambient light the night decides to give it. I think of them less as photographs of the sky than as portraits of duration — proof that I stood somewhere very quiet for a very long time.",
    ],
    seeds: ["marlow-stars-alvord", "marlow-perseids-bigbend"],
    frames: 18,
  },
  {
    slug: "roadside",
    name: "Roadside",
    years: "2019 — ongoing",
    dek: "The architecture of the two-lane, photographed before it goes.",
    body: [
      "The interstate killed the two-lane and the two-lane is taking the motels, the drive-ins and the single-brand gas stations down with it. Roadside is a long, unhurried inventory of that disappearance — not nostalgic, I hope, so much as attentive. These were optimistic buildings. Someone painted that sign by hand and meant it.",
      "I shoot Roadside on 4×5 because the format slows me to the speed of the subject. You cannot drive-by a view camera. You set up, you wait for the cloud, you talk to whoever owns the place, and more often than not they tell you it is closing in the spring.",
    ],
    seeds: ["marlow-motel-vacancy", "marlow-gas-goldfield", "marlow-drivein-tonopah", "marlow-room-beatty"],
    frames: 44,
  },
]

export interface Exhibition {
  year: string
  title: string
  venue: string
  city: string
}

export const exhibitions: Exhibition[] = [
  { year: "2025", title: "Saltworks (solo)", venue: "Catherine Edelman Gallery", city: "Chicago" },
  { year: "2024", title: "Ground Glass: New Large Format", venue: "Pier 24 Photography", city: "San Francisco" },
  { year: "2024", title: "The Long Night", venue: "photo-eye Gallery", city: "Santa Fe" },
  { year: "2023", title: "Roadside, Vol. I (book launch)", venue: "Aperture Foundation", city: "New York" },
  { year: "2022", title: "Desert Light", venue: "Nevada Museum of Art", city: "Reno" },
]

export interface Service {
  title: string
  blurb: string
  detail: string
}

export const services: Service[] = [
  {
    title: "Editorial & Commission",
    blurb: "Assignment work for magazines, brands and institutions that want the real thing on film.",
    detail: "Day rate from $4,800",
  },
  {
    title: "Print Sales",
    blurb: "Archival pigment and silver gelatin prints, editioned and signed, from the working archive.",
    detail: "16×20 from $1,200",
  },
  {
    title: "Workshops",
    blurb: "Four-day large-format field intensives in the Great Basin, twice a year, six photographers.",
    detail: "Spring & autumn · 6 seats",
  },
]
