// Real-feeling editorial content for an independent field guide to the
// North Norfolk coast. Brand "Saltmarsh" is a personal guide, not an official body.

export interface Place {
  slug: string
  name: string
  kind: string
  blurb: string
  detail: string
  seed: string
}

export interface Stay {
  name: string
  type: string
  where: string
  price: string
  note: string
  seed: string
}

export interface Note {
  date: string
  title: string
  reading: string
  excerpt: string
  seed: string
}

export const places: Place[] = [
  {
    slug: "blakeney-point",
    name: "Blakeney Point",
    kind: "Shingle spit · seals",
    blurb: "A four-mile finger of shingle where grey seals haul out by the hundred.",
    detail:
      "Walk it from Cley at low water or take a ferry from Morston Quay. Pup season runs November to January; keep a long lens and a longer distance.",
    seed: "blakeney-grey-seals-shingle",
  },
  {
    slug: "cley-marshes",
    name: "Cley Marshes",
    kind: "Reedbed · hides",
    blurb: "The reserve that more or less invented British birdwatching.",
    detail:
      "Bitterns boom in spring; bearded tits ping through the reeds. The boardwalk hides are quietest within the first hour of opening.",
    seed: "cley-reedbed-marsh-water",
  },
  {
    slug: "holkham-bay",
    name: "Holkham Bay",
    kind: "Pinewoods · vast sand",
    blurb: "A beach so wide the tide seems to argue with the horizon.",
    detail:
      "Park at Lady Anne's Drive, cross the pine belt, and the sand opens out for a mile. Best at a falling tide with the wind off the land.",
    seed: "holkham-wide-beach-pines-norfolk",
  },
  {
    slug: "stiffkey-saltmarsh",
    name: "Stiffkey Marsh",
    kind: "Samphire · creeks",
    blurb: "Tidal creeks and the marsh samphire locals call 'Stewkey blue'.",
    detail:
      "Pickers work the flats on the ebb in July and August. Watch the tide tables religiously — the creeks fill faster than you'd believe.",
    seed: "stiffkey-saltmarsh-creeks-samphire",
  },
  {
    slug: "wells-harbour",
    name: "Wells Harbour",
    kind: "Quay · whelk sheds",
    blurb: "A working quay of whelk boats, paint-peeled sheds and chip queues.",
    detail:
      "The harbour railway still runs to the beach huts in summer. Buy brown shrimp from the boats and eat them on the wall.",
    seed: "wells-next-the-sea-harbour-boats",
  },
  {
    slug: "burnham-overy",
    name: "Burnham Overy",
    kind: "Dunes · windmill",
    blurb: "A staithe, a tower mill, and a dune walk to an empty beach.",
    detail:
      "Follow the sea bank from the staithe; the dunes hide a beach that stays quiet even in August. Nelson learned to sail near here.",
    seed: "burnham-overy-windmill-dunes",
  },
]

export const stays: Stay[] = [
  {
    name: "The Globe Inn",
    type: "Coaching inn",
    where: "Wells-next-the-Sea",
    price: "from £140",
    note: "Buttermilk rooms over the green, a fire that's lit by four, and crab on the menu most days.",
    seed: "globe-inn-coastal-bedroom-warm",
  },
  {
    name: "Marsh House",
    type: "Self-catering cottage",
    where: "Cley-next-the-Sea",
    price: "from £95 / night",
    note: "A flint two-up two-down with a reed view and a tide clock that actually works.",
    seed: "flint-cottage-norfolk-interior",
  },
  {
    name: "The Reading Rooms",
    type: "Two suites",
    where: "Burnham Market",
    price: "from £210",
    note: "Quiet, bookish, breakfast brought to the door. No television, by design.",
    seed: "reading-rooms-bookish-suite",
  },
]

export const notes: Note[] = [
  {
    date: "12 May",
    title: "The hour the bitterns boom",
    reading: "4 min",
    excerpt:
      "Before six, the reeds at Cley hold a sound more felt than heard — a foghorn pulled down two octaves and buried in the water.",
    seed: "bittern-reedbed-dawn-mist",
  },
  {
    date: "3 Apr",
    title: "Reading the tide, badly",
    reading: "6 min",
    excerpt:
      "I have been caught out by a Norfolk creek exactly once, and once is the number of times you are allowed. Here is what the tables don't say.",
    seed: "tidal-creek-mudflat-channel",
  },
  {
    date: "28 Aug",
    title: "Picking Stewkey blue",
    reading: "5 min",
    excerpt:
      "Marsh samphire wants cutting, not pulling, and eating the same day. A short, salty, slightly defensive love letter to the stuff.",
    seed: "samphire-marsh-harvest-green",
  },
]

export const facts = [
  { value: "63", unit: "miles", label: "of coast path, end to end" },
  { value: "5", unit: "reserves", label: "within a half-hour drive" },
  { value: "Nov–Jan", unit: "", label: "best for the seal colony" },
]
