export type Flavor = {
  slug: string
  name: string
  pair: string
  notes: string
  blurb: string
  cal: number
  abv: string
  from: string
  to: string
  ink: string
}

export const flavors: Flavor[] = [
  {
    slug: "blood-orange",
    name: "Blood Orange",
    pair: "& Angostura",
    notes: "Bittersweet · Ruby · Dry finish",
    blurb:
      "Cold-pressed Sicilian blood orange cut with three drops of aromatic bitters. The one that started the whole stubborn experiment.",
    cal: 24,
    abv: "0.0%",
    from: "#F0531C",
    to: "#A21B14",
    ink: "#FCEAD9",
  },
  {
    slug: "yuzu",
    name: "Yuzu",
    pair: "& Sea Salt",
    notes: "Bright · Saline · Electric",
    blurb:
      "Hand-zested yuzu with a pinch of Cornish sea salt that makes the whole thing snap. Tastes like a held breath, then a laugh.",
    cal: 18,
    abv: "0.0%",
    from: "#E7C32A",
    to: "#9C7A0E",
    ink: "#2C2607",
  },
  {
    slug: "pink-grapefruit",
    name: "Pink Grapefruit",
    pair: "& Rosemary",
    notes: "Floral · Tart · Herbaceous",
    blurb:
      "Ruby grapefruit steeped overnight with a single sprig of rosemary. Grown-up, a little prickly, impossible to put down.",
    cal: 22,
    abv: "0.0%",
    from: "#EE6A86",
    to: "#B22C57",
    ink: "#FCE7ED",
  },
  {
    slug: "lime-kaffir",
    name: "Lime",
    pair: "& Kaffir Leaf",
    notes: "Green · Zesty · Aromatic",
    blurb:
      "Two limes, one bruised kaffir leaf, a long cold steep. The flavour we argue about most and reorder most. Make of that what you will.",
    cal: 20,
    abv: "0.0%",
    from: "#5AA63F",
    to: "#1F5A2C",
    ink: "#EAF6E2",
  },
  {
    slug: "bergamot",
    name: "Bergamot",
    pair: "& Tonic",
    notes: "Perfumed · Quinine · Long",
    blurb:
      "Calabrian bergamot leaning into a real cinchona tonic. The closest Pulp comes to a nightcap — without the next morning.",
    cal: 16,
    abv: "0.0%",
    from: "#EFA12C",
    to: "#A85C10",
    ink: "#2E2206",
  },
]

export const stats = [
  { value: 0, suffix: "g", label: "Refined sugar, ever" },
  { value: 12, suffix: "", label: "Botanicals on the bench" },
  { value: 5, suffix: "", label: "Flavours in rotation" },
  { value: 2019, suffix: "", label: "Year of the first batch", raw: true },
]

export type Stockist = {
  name: string
  city: string
  kind: "Café" | "Grocer" | "Bar" | "Restaurant"
  note: string
  seed: string
}

export const stockists: Stockist[] = [
  { name: "Marlow & Sons", city: "London", kind: "Grocer", note: "Cold case by the door", seed: "marketgrocer" },
  { name: "The Quiet Hour", city: "London", kind: "Bar", note: "Full flavour flight", seed: "barcounter" },
  { name: "Pollen Bakery", city: "Manchester", kind: "Café", note: "All five, most days", seed: "bakerycafe" },
  { name: "Saltwater Deli", city: "Brighton", kind: "Grocer", note: "Seafront fridge", seed: "seasidedeli" },
  { name: "Field Notes", city: "Bristol", kind: "Café", note: "Yuzu sells out fast", seed: "coffeeshop" },
  { name: "Honest Greens", city: "Edinburgh", kind: "Restaurant", note: "On the no/lo list", seed: "greenrestaurant" },
  { name: "The Allotment", city: "Leeds", kind: "Restaurant", note: "Paired with dessert", seed: "diningroom" },
  { name: "Dock 9", city: "Cardiff", kind: "Bar", note: "Harbourside terrace", seed: "harbourbar" },
]

export const timeline = [
  {
    year: "2019",
    title: "A kitchen, a SodaStream, a grudge",
    body: "Tired of sweet, apologetic non-alcoholic drinks, we started forcing bitter citrus through a battered carbonator until something tasted like a real choice.",
  },
  {
    year: "2021",
    title: "The first proper batch",
    body: "We outgrew the kitchen and moved into a railway arch in Bermondsey. Blood Orange & Angostura went out to twelve cafés. Eleven reordered.",
  },
  {
    year: "2023",
    title: "Five flavours, one rule",
    body: "Never more than a gram of natural sugar than a flavour needs. We turned down a supermarket deal that wanted us sweeter. We don't regret it.",
  },
  {
    year: "Today",
    title: "Still stubborn, slightly bigger",
    body: "Brewed in small batches, sold through people who taste before they stock. You're reading this; that's roughly the whole marketing plan.",
  },
]

export const faqs = [
  {
    q: "Is Pulp actually alcohol-free?",
    a: "Completely — every flavour is 0.0% ABV. We get the depth from bitters, botanicals and a long cold steep, not from anything you'd need an ID for.",
  },
  {
    q: "How much sugar is in a can?",
    a: "Between 16 and 24 calories, all from real fruit. No refined sugar, no sweeteners pretending to be sugar. Bitter is a feature, not a bug.",
  },
  {
    q: "Do you ship to my door?",
    a: "We ship mixed cases of 12 anywhere in the UK, usually next-day. Subscriptions skip, pause and swap flavours whenever you like.",
  },
  {
    q: "Can my café or bar stock Pulp?",
    a: "Yes, and we'd love that. Tell us a little about your place on the contact page and we'll send tasting cans and trade pricing.",
  },
]
