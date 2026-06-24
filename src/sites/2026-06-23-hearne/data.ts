export type Project = {
  slug: string
  name: string
  suburb: string
  year: string
  type: string
  blurb: string
  img: string // picsum seed url
  span?: "tall" | "wide" | "normal"
}

const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const PROJECTS: Project[] = [
  {
    slug: "weston-terrace",
    name: "Weston Street Terrace",
    suburb: "Brunswick",
    year: "2025",
    type: "Full restoration + extension",
    blurb:
      "A double-fronted Victorian with its bones intact and nothing else. We kept the lath-and-plaster front rooms, then opened the rear into a brick-and-blackbutt kitchen that runs to the garden.",
    img: pic("hearne-weston-interior", 1100, 1300),
    span: "tall",
  },
  {
    slug: "stewart-cottage",
    name: "Stewart's Cottage",
    suburb: "Fitzroy North",
    year: "2024",
    type: "Workers' cottage, two bed",
    blurb:
      "Three metres wide and full of dark. A single skylit spine now pulls morning light from the front door to the back step.",
    img: pic("hearne-cottage-light", 1200, 900),
    span: "wide",
  },
  {
    slug: "lygon-warehouse",
    name: "Lygon Warehouse",
    suburb: "Carlton",
    year: "2024",
    type: "Warehouse conversion",
    blurb:
      "A 1920s rag-trade warehouse turned three-bed home. We left the sawtooth roof honest and dropped a warm timber box inside the volume.",
    img: pic("hearne-warehouse-volume", 1000, 1000),
  },
  {
    slug: "park-edwardian",
    name: "Park Street Edwardian",
    suburb: "Northcote",
    year: "2023",
    type: "Heritage kitchen + bath",
    blurb:
      "Pressed-metal ceilings restored by hand, a marble kitchen that looks like it was always there, and a bathroom in deep green tadelakt.",
    img: pic("hearne-edwardian-kitchen", 1000, 1000),
  },
  {
    slug: "albert-rowhouse",
    name: "Albert Row",
    suburb: "Collingwood",
    year: "2023",
    type: "Two-storey addition",
    blurb:
      "A first-floor addition set back behind the original parapet, invisible from the street and full of sky from inside.",
    img: pic("hearne-rowhouse-stair", 1200, 900),
    span: "wide",
  },
  {
    slug: "merri-bungalow",
    name: "Merri Bungalow",
    suburb: "Thornbury",
    year: "2022",
    type: "California bungalow revival",
    blurb:
      "Strip-out and start again, gently. Original leadlight saved, joinery in spotted gum, a hearth rebuilt around the old chimney.",
    img: pic("hearne-bungalow-hearth", 1100, 1300),
    span: "tall",
  },
]
