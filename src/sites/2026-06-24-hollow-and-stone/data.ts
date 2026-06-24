/* =========================================================================
   HOLLOW & STONE — content
   A restoration-led property practice in the South Pennines. They find
   overlooked period buildings — weavers' cottages, mill lodges, chapels —
   put them right with local trades, and sell them on. All copy is real.
   ========================================================================= */

export interface Home {
  id: string
  name: string
  place: string
  built: string
  price: string
  beds: number
  baths: number
  sqft: string
  status: "For sale" | "Under offer" | "Reserved"
  seed: string
  hue: number
  blurb: string
}

export const HOMES: Home[] = [
  {
    id: "loom-house",
    name: "Loom House",
    place: "Hebden Bridge, West Yorkshire",
    built: "1841",
    price: "£695,000",
    beds: 4,
    baths: 2,
    sqft: "2,140 sq ft",
    status: "For sale",
    seed: "loomhouse-stone-cottage",
    hue: 30,
    blurb:
      "A double-fronted weavers' cottage with the original taking-in door kept as a glazed gable window. South-facing, last of the terrace.",
  },
  {
    id: "the-lodge",
    name: "The Mill Lodge",
    place: "Marsden, West Yorkshire",
    built: "1868",
    price: "£540,000",
    beds: 3,
    baths: 2,
    sqft: "1,720 sq ft",
    status: "For sale",
    seed: "milllodge-canal-stone",
    hue: 200,
    blurb:
      "Gatekeeper's lodge to a worsted mill, set above the canal. New oak floors over the original stone flags in the hall.",
  },
  {
    id: "chapel-fold",
    name: "Chapel Fold",
    place: "Holmfirth, West Yorkshire",
    built: "1799",
    price: "£820,000",
    beds: 5,
    baths: 3,
    sqft: "3,050 sq ft",
    status: "Under offer",
    seed: "chapelfold-chapel-conversion",
    hue: 25,
    blurb:
      "A Baptist chapel returned to a home — the arched windows reglazed, the gallery kept as a reading mezzanine over the main room.",
  },
  {
    id: "fellgate",
    name: "Fellgate Barn",
    place: "Todmorden, West Yorkshire",
    built: "c.1760",
    price: "£610,000",
    beds: 3,
    baths: 2,
    sqft: "1,980 sq ft",
    status: "Reserved",
    seed: "fellgate-barn-conversion",
    hue: 90,
    blurb:
      "A laithe barn where house and byre sat under one roof. The threshing doors are now a two-storey glazed wall onto the moor.",
  },
]

export interface Project {
  id: string
  name: string
  place: string
  seed: string
  hue: number
  span: string
  summary: string
  note: string
}

/* The before/after slider reuses ONE photograph per project and reveals two
   gradings of it: a cold, flat, grainy "as found" and a warm, restored grade.
   Honest, deterministic, and it never breaks. */
export const PROJECTS: Project[] = [
  {
    id: "loom",
    name: "Loom House",
    place: "Hebden Bridge",
    seed: "loomhouse-interior-restored",
    hue: 28,
    span: "14 months",
    summary: "Hall, stair & main range",
    note:
      "We took the partition walls back out, found the original stone mullion behind plasterboard, and re-laid the flags lifted in the 1970s.",
  },
  {
    id: "chapel",
    name: "Chapel Fold",
    place: "Holmfirth",
    seed: "chapelfold-interior-restored",
    hue: 22,
    span: "19 months",
    summary: "Nave, gallery & vestry",
    note:
      "The arched windows had been bricked to half height. We reopened them, re-leaded the glazing, and kept the gallery as a mezzanine.",
  },
  {
    id: "barn",
    name: "Fellgate Barn",
    place: "Todmorden",
    seed: "fellgate-interior-restored",
    hue: 40,
    span: "11 months",
    summary: "Threshing floor & byre",
    note:
      "A leaking corrugated roof came off, the king-post trusses were spliced where rotten, and the threshing doors became a glazed wall.",
  },
]

export interface Step {
  n: string
  title: string
  body: string
}

export const PROCESS: Step[] = [
  {
    n: "01",
    title: "We find the building",
    body: "Usually before it's listed — a chapel going to auction, a cottage in probate. We walk every one ourselves.",
  },
  {
    n: "02",
    title: "We survey, honestly",
    body: "A conservation surveyor and a structural engineer write the brief together, so the price reflects the truth of the place.",
  },
  {
    n: "03",
    title: "We work with local trades",
    body: "The same dry-stone wallers, joiners and lime plasterers on every job. They know how these buildings want to breathe.",
  },
  {
    n: "04",
    title: "We sell it whole",
    body: "No part-finished projects. The home is warm, watertight and certified before it ever goes to viewing.",
  },
]

export interface Person {
  name: string
  role: string
  seed: string
  line: string
}

export const TEAM: Person[] = [
  { name: "Edith Marsh", role: "Founder & buyer", seed: "edith-portrait-woman", line: "Twenty years in conservation. Finds the buildings nobody else sees." },
  { name: "Tomas Reyne", role: "Site & trades lead", seed: "tomas-portrait-man", line: "Runs every site. Trained as a joiner before he ran them." },
  { name: "Priya Adler", role: "Conservation surveyor", seed: "priya-portrait-woman", line: "Writes the brief that keeps us honest about a building's bones." },
]

export interface Stat {
  value: number
  suffix: string
  label: string
}

export const STATS: Stat[] = [
  { value: 38, suffix: "", label: "Buildings brought back" },
  { value: 1760, suffix: "", label: "Oldest restored, est." },
  { value: 11, suffix: " mi", label: "Average from our yard" },
  { value: 94, suffix: "%", label: "Sold before completion" },
]

export interface Quote {
  text: string
  who: string
  where: string
}

export const QUOTES: Quote[] = [
  {
    text: "They reopened a window that had been bricked up for sixty years. We have breakfast in that light every morning now.",
    who: "The Hartleys",
    where: "bought Chapel Fold, 2024",
  },
  {
    text: "Other agents sold us a postcode. Hollow & Stone sold us a building they clearly loved, and explained every repair they'd made.",
    who: "Daniel Okafor",
    where: "bought The Mill Lodge, 2023",
  },
]
