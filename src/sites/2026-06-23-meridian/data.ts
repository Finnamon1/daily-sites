// Real listings copy for Meridian — a boutique agency for architectural homes
// in Northern California. Photos are deterministic picsum seeds chosen to read
// as modernist exteriors and warm interiors.

export interface Residence {
  slug: string
  name: string
  place: string
  price: string
  beds: number
  baths: number
  sqft: string
  year: string
  architect: string
  status: "For sale" | "In contract" | "Just listed"
  blurb: string
  seed: string
}

export const residences: Residence[] = [
  {
    slug: "glass-spur",
    name: "The Glass Spur",
    place: "Sea Ranch, Sonoma Coast",
    price: "$2,450,000",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    year: "1971",
    architect: "Esherick & Homsey",
    status: "Just listed",
    blurb:
      "A redwood box that turns its back to the road and opens entirely to the bluff. Single-pitch roof, a wall of glass, and the original built-in window seats.",
    seed: "meridian-glassspur",
  },
  {
    slug: "hillhouse",
    name: "Hillhouse",
    place: "Mill Valley, Marin",
    price: "$4,200,000",
    beds: 4,
    baths: 3,
    sqft: "3,400",
    year: "1962",
    architect: "Henrik Bull",
    status: "For sale",
    blurb:
      "Three stepped pavilions cut into the hillside under a canopy of bay laurel. Radiant concrete floors, a sunken hearth, and a kitchen the family never wanted to leave.",
    seed: "meridian-hillhouse",
  },
  {
    slug: "cedar-fold",
    name: "Cedar Fold",
    place: "Inverness, Point Reyes",
    price: "$2,950,000",
    beds: 3,
    baths: 2,
    sqft: "2,250",
    year: "1969",
    architect: "Daniel Liebermann",
    status: "For sale",
    blurb:
      "A folded cedar roofline drawn from the ridgeline behind it. Hand-built and never flipped — the same family for fifty-one years, and it shows in every joint.",
    seed: "meridian-cedarfold",
  },
  {
    slug: "the-long-room",
    name: "The Long Room",
    place: "Berkeley Hills",
    price: "$3,600,000",
    beds: 4,
    baths: 3,
    sqft: "2,900",
    year: "1957",
    architect: "Roger Lee",
    status: "In contract",
    blurb:
      "A post-and-beam classic running the length of the lot, glass on the bay side, mahogany on the other. Restored sympathetically by its second owner, a furniture maker.",
    seed: "meridian-longroom",
  },
  {
    slug: "quarry-court",
    name: "Quarry Court",
    place: "Sonoma",
    price: "$1,875,000",
    beds: 2,
    baths: 2,
    sqft: "1,650",
    year: "1984",
    architect: "William Turnbull",
    status: "For sale",
    blurb:
      "Built around a courtyard of native grasses and a single oak. Plaster, board-formed concrete, and clerestory light that moves across the walls through the afternoon.",
    seed: "meridian-quarry",
  },
  {
    slug: "saltmarsh",
    name: "Saltmarsh",
    place: "Bolinas Lagoon",
    price: "$1,650,000",
    beds: 2,
    baths: 1,
    sqft: "1,200",
    year: "1975",
    architect: "Owner-built",
    status: "Just listed",
    blurb:
      "A small, salt-weathered cabin on pilings at the edge of the lagoon. Not for everyone — which is rather the point. Best seen at low tide with the birds in.",
    seed: "meridian-saltmarsh",
  },
]

export interface JournalEntry {
  title: string
  kind: string
  date: string
  read: string
  excerpt: string
  seed: string
}

export const journal: JournalEntry[] = [
  {
    title: "Why we don't stage with grey",
    kind: "Notes on selling",
    date: "May 2026",
    read: "4 min",
    excerpt:
      "A house built in 1962 was never meant to look like a 2019 rental. We stage to the architect's intent — warm wood, low furniture, and a single good chair where the light lands.",
    seed: "meridian-journal-grey",
  },
  {
    title: "Reading a redwood roofline",
    kind: "Field guide",
    date: "April 2026",
    read: "6 min",
    excerpt:
      "Single-pitch, butterfly, folded plate — the roof tells you who designed it and what they were arguing against. A short guide to the shapes we keep seeing on the coast.",
    seed: "meridian-journal-roof",
  },
  {
    title: "The case for the second owner",
    kind: "Essay",
    date: "March 2026",
    read: "5 min",
    excerpt:
      "The best-kept architectural homes rarely belong to the people who built them. They belong to the person who fell in love with it later and refused to wreck it.",
    seed: "meridian-journal-owner",
  },
]
