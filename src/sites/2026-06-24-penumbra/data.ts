/* ---------------------------------------------------------------------------
   PENUMBRA — content for a photographic representation agency.
   All people/clients are fictional; imagery is sourced deterministically from
   picsum so seeds never break. Technical captions read like real photo metadata.
--------------------------------------------------------------------------- */

export interface Photographer {
  slug: string
  name: string
  discipline: string
  based: string
  /** one-line representation note in the agency's voice */
  note: string
  /** descriptive picsum seed for the signature frame */
  seed: string
  /** mono caption — focal length / stock, like a contact sheet */
  spec: string
}

export const PHOTOGRAPHERS: Photographer[] = [
  {
    slug: "mira-halasz",
    name: "Mira Halász",
    discipline: "Documentary",
    based: "Budapest",
    note: "Long-form reportage on migration and the spaces people leave behind.",
    seed: "penumbra-mira-station-fog",
    spec: "35mm · Tri-X 400 · available light",
  },
  {
    slug: "tobias-renn",
    name: "Tobias Renn",
    discipline: "Landscape",
    based: "Reykjavík",
    note: "Wide, patient studies of weather and the edges of habitable land.",
    seed: "penumbra-tobias-glacier-ridge",
    spec: "6×7 · Portra 160 · tripod, dawn",
  },
  {
    slug: "adiel-okonkwo",
    name: "Adiel Okonkwo",
    discipline: "Portrait",
    based: "Lagos",
    note: "Studio and street portraiture for culture desks and record labels.",
    seed: "penumbra-adiel-portrait-window",
    spec: "85mm · ISO 200 · single softbox",
  },
  {
    slug: "sena-watanabe",
    name: "Sena Watanabe",
    discipline: "Still life",
    based: "Kyoto",
    note: "Quiet object and food work with an obsessive eye for surface.",
    seed: "penumbra-sena-still-ceramic",
    spec: "100mm macro · ISO 100 · north light",
  },
  {
    slug: "cole-ferrara",
    name: "Cole Ferrara",
    discipline: "Reportage",
    based: "New York",
    note: "Sport and street energy shot tight, fast, and close to the action.",
    seed: "penumbra-cole-crowd-motion",
    spec: "24mm · ISO 1600 · 1/1000s",
  },
  {
    slug: "ines-vidal",
    name: "Inés Vidal",
    discipline: "Architecture",
    based: "Barcelona",
    note: "Interiors and the built environment for design and property titles.",
    seed: "penumbra-ines-stair-concrete",
    spec: "24mm TS-E · ISO 100 · mixed light",
  },
  {
    slug: "marek-dvorak",
    name: "Marek Dvořák",
    discipline: "Fashion",
    based: "Prague",
    note: "Editorial fashion with a documentary undertow and real locations.",
    seed: "penumbra-marek-coat-corridor",
    spec: "50mm · ISO 400 · strobe + ambient",
  },
  {
    slug: "liv-sorensen",
    name: "Liv Sørensen",
    discipline: "Expedition",
    based: "Tromsø",
    note: "Wildlife and cold-climate expedition work, weeks in the field.",
    seed: "penumbra-liv-arctic-bird",
    spec: "400mm · ISO 800 · 1/2000s",
  },
]

export interface ArchiveItem {
  title: string
  photographer: string
  place: string
  year: string
  seed: string
  spec: string
  /** column span on the contact-sheet grid: 1 or 2 */
  span: 1 | 2
}

export const ARCHIVE: ArchiveItem[] = [
  { title: "Last Train, Keleti", photographer: "Mira Halász", place: "Hungary", year: "2024", seed: "penumbra-arch-keleti-platform", spec: "35mm · Tri-X", span: 2 },
  { title: "Vatnajökull, IV", photographer: "Tobias Renn", place: "Iceland", year: "2023", seed: "penumbra-arch-vatna-ice", spec: "6×7 · Portra", span: 1 },
  { title: "Folake", photographer: "Adiel Okonkwo", place: "Lagos", year: "2025", seed: "penumbra-arch-folake-portrait", spec: "85mm · digital", span: 1 },
  { title: "Three Bowls", photographer: "Sena Watanabe", place: "Kyoto", year: "2024", seed: "penumbra-arch-three-bowls", spec: "100mm · digital", span: 1 },
  { title: "Final Whistle", photographer: "Cole Ferrara", place: "New York", year: "2025", seed: "penumbra-arch-whistle-crowd", spec: "24mm · digital", span: 2 },
  { title: "Stair, Casa Mila", photographer: "Inés Vidal", place: "Barcelona", year: "2023", seed: "penumbra-arch-stair-mila", spec: "24mm TS-E", span: 1 },
  { title: "Wool Coat", photographer: "Marek Dvořák", place: "Prague", year: "2024", seed: "penumbra-arch-wool-coat", spec: "50mm · strobe", span: 1 },
  { title: "Kittiwake", photographer: "Liv Sørensen", place: "Svalbard", year: "2025", seed: "penumbra-arch-kittiwake-cliff", spec: "400mm · digital", span: 1 },
  { title: "Border Road", photographer: "Mira Halász", place: "Serbia", year: "2023", seed: "penumbra-arch-border-road", spec: "35mm · Tri-X", span: 1 },
]

/** clients for the marquee — believable editorial + brand mix */
export const CLIENTS = [
  "The New York Times Magazine",
  "Monocle",
  "Apple",
  "Aesop",
  "National Geographic",
  "Kinfolk",
  "Leica",
  "Patagonia",
  "The Gentlewoman",
  "Hermès",
  "WIRED",
  "Phaidon",
]

export const DISCIPLINES = [
  "Documentary",
  "Landscape",
  "Portrait",
  "Still life",
  "Reportage",
  "Architecture",
  "Fashion",
  "Expedition",
]

/** numbers for the animated counters on the studio page */
export const FIGURES = [
  { value: 14, suffix: "", label: "Photographers represented" },
  { value: 31, suffix: "", label: "Countries shot in last year" },
  { value: 2009, suffix: "", label: "Representing since", raw: true },
  { value: 9, suffix: "", label: "Permanent staff in London" },
]
