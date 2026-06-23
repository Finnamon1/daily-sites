export interface Artist {
  name: string
  role: string
  city: string
  blurb: string
  seed: string
  tag: "Sound" | "Visual" | "Live A/V"
}

export const artists: Artist[] = [
  {
    name: "Lúa Mendes",
    role: "Modular synthesist",
    city: "Porto",
    blurb: "Patches a 9U Eurorack live, chasing the moment a generative sequence stops sounding like a machine.",
    seed: "modular-synth-dark",
    tag: "Sound",
  },
  {
    name: "Kessler Brandt",
    role: "Shader artist",
    city: "Berlin",
    blurb: "Writes fragment shaders the way other people write postcards — small, dense, sent to one room at a time.",
    seed: "shader-grid-neon",
    tag: "Visual",
  },
  {
    name: "Niamh Doyle",
    role: "Live coder",
    city: "Dublin",
    blurb: "TidalCycles on a projector, terminal exposed. The room watches the music get typed into being.",
    seed: "livecode-terminal",
    tag: "Live A/V",
  },
  {
    name: "Renzo Aoki",
    role: "Sound designer",
    city: "Lisbon",
    blurb: "Field recordings from the Tagus estuary, granulated until the river becomes a drone you can stand inside.",
    seed: "estuary-fog-water",
    tag: "Sound",
  },
  {
    name: "Halla Sigurð",
    role: "Generative plotter",
    city: "Reykjavík",
    blurb: "Pen-plotter drawings driven by the night's audio, inked live and pinned to the wall as they finish.",
    seed: "plotter-ink-lines",
    tag: "Visual",
  },
  {
    name: "Otis & The Loom",
    role: "A/V duo",
    city: "Marseille",
    blurb: "One on a sampler, one on TouchDesigner, trading control of the same signal until you can't tell who's leading.",
    seed: "projector-smoke-stage",
    tag: "Live A/V",
  },
]

export interface Slot {
  time: string
  title: string
  artist: string
  stage: "Main Hall" | "The Cistern" | "Workshop Room"
  kind: "Set" | "Talk" | "Workshop"
}

export const schedule: Slot[] = [
  { time: "16:00", title: "Doors & sound check, open floor", artist: "—", stage: "Main Hall", kind: "Talk" },
  { time: "16:30", title: "Patching in public: a modular primer", artist: "Lúa Mendes", stage: "Workshop Room", kind: "Workshop" },
  { time: "17:15", title: "Drawing with sound", artist: "Halla Sigurð", stage: "The Cistern", kind: "Set" },
  { time: "18:00", title: "Shaders for people who fear math", artist: "Kessler Brandt", stage: "Workshop Room", kind: "Talk" },
  { time: "19:00", title: "Estuary — a granular set", artist: "Renzo Aoki", stage: "The Cistern", kind: "Set" },
  { time: "20:00", title: "Type the music, live", artist: "Niamh Doyle", stage: "Main Hall", kind: "Set" },
  { time: "21:15", title: "Two hands, one signal", artist: "Otis & The Loom", stage: "Main Hall", kind: "Set" },
  { time: "22:30", title: "Closing improvisation, all artists", artist: "Full roster", stage: "Main Hall", kind: "Set" },
]
