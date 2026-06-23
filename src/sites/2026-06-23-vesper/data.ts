import type { Departure } from "./shared"

export const board: Departure[] = [
  { dest: "Lisbon", time: "21:14", via: "Madrid", status: "Boarding" },
  { dest: "Venice", time: "20:02", via: "Milan", status: "On time" },
  { dest: "Stockholm", time: "18:47", via: "Hamburg", status: "On time" },
  { dest: "Vienna", time: "21:40", via: "Munich", status: "On time" },
  { dest: "Edinburgh", time: "19:05", via: "York", status: "Boarding" },
  { dest: "Split", time: "22:18", via: "Zagreb", status: "On time" },
  { dest: "Budapest", time: "19:55", via: "Vienna", status: "Delayed" },
]

export type RouteLine = {
  name: string
  from: string
  to: string
  nights: number
  hours: number
  via: string[]
  blurb: string
  // normalised 0-100 map coordinates for the two endpoints
  a: [number, number]
  b: [number, number]
}

export const lines: RouteLine[] = [
  {
    name: "The Lusitania",
    from: "Paris",
    to: "Lisbon",
    nights: 1,
    hours: 19,
    via: ["Bordeaux", "Madrid"],
    blurb:
      "South through the vineyards of Aquitaine, over the Pyrenees in the dark, and into the Atlantic light by lunch.",
    a: [44, 40],
    b: [10, 74],
  },
  {
    name: "The Adriatic",
    from: "Munich",
    to: "Split",
    nights: 1,
    hours: 16,
    via: ["Salzburg", "Zagreb"],
    blurb:
      "Alpine passes after dinner, the Dalmatian coast by breakfast. Coffee on the platform with the sea behind you.",
    a: [55, 36],
    b: [63, 64],
  },
  {
    name: "The Nordlys",
    from: "Hamburg",
    to: "Stockholm",
    nights: 1,
    hours: 14,
    via: ["Copenhagen", "Malmö"],
    blurb:
      "Across the Øresund bridge at midnight, then pine and lake country until the spires of Gamla Stan.",
    a: [52, 26],
    b: [66, 14],
  },
  {
    name: "The Caledonian",
    from: "London",
    to: "Edinburgh",
    nights: 1,
    hours: 8,
    via: ["York", "Newcastle"],
    blurb:
      "Our shortest sleeper — a long dinner, a proper night's sleep, and the castle in the window before you wake.",
    a: [38, 24],
    b: [40, 14],
  },
  {
    name: "The Serenissima",
    from: "Paris",
    to: "Venice",
    nights: 1,
    hours: 13,
    via: ["Dijon", "Milan"],
    blurb:
      "Burgundy at dusk, the Simplon tunnel by lamplight, and the lagoon catching fire at sunrise.",
    a: [44, 40],
    b: [56, 50],
  },
]

export const cities: { name: string; at: [number, number] }[] = [
  { name: "London", at: [38, 24] },
  { name: "Paris", at: [44, 40] },
  { name: "Lisbon", at: [10, 74] },
  { name: "Madrid", at: [22, 66] },
  { name: "Munich", at: [55, 36] },
  { name: "Split", at: [63, 64] },
  { name: "Hamburg", at: [52, 26] },
  { name: "Stockholm", at: [66, 14] },
  { name: "Edinburgh", at: [40, 14] },
  { name: "Venice", at: [56, 50] },
]
