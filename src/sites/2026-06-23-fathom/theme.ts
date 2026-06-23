/* ── FATHOM — design tokens & content ─────────────────────────────────────
 *
 *  A documentary podcast that goes deep on one strange true story each season.
 *  Late-night-radio palette: a deep ink-navy ground, an amber "on air" signal
 *  as the single confident accent, off-white type. One warm-paper section gives
 *  editorial contrast on the About page. All text meets WCAG AA on its ground.
 */

export const C = {
  ground: "#0b111c", // page background — deep ink navy
  panel: "#121a29", // raised panels
  panelSoft: "#182233", // hover / nested panels
  line: "#24324a", // hairlines on dark
  text: "#eef2f8", // primary text on dark
  textSoft: "#97a4ba", // muted text on dark (~7:1 on ground)
  textFaint: "#7585a0", // timecodes, captions (~5:1 on ground — AA small text)
  signal: "#f4a23b", // amber accent on dark — text-safe (~9:1 on ground)
  signalSoft: "#f6b86a", // brighter amber for large display / glows
  wave: "#3a4a66", // un-played waveform bars (neutral, not a 2nd accent)
  // warm-paper section (About host strip)
  paper: "#ece5d6",
  paperPanel: "#e2d8c4",
  paperInk: "#1b202b", // primary text on paper
  paperSoft: "#5a5446", // muted text on paper (~6:1)
  paperLine: "#d4c8b1",
  signalInk: "#9c5310", // amber as small text on paper (~5.2:1)
}

export interface Episode {
  no: number
  title: string
  dek: string
  duration: string // mm:ss
  seconds: number
  released: string
  seed: number // deterministic waveform seed
}

/** Current season: Dead Air — six parts. */
export const SEASON = {
  no: 3,
  name: "Dead Air",
  tagline: "A pirate radio station broadcasting from a North Sea fort that never, once, went silent.",
}

export const EPISODES: Episode[] = [
  { no: 1, title: "The Fort in the Water", dek: "Seven miles off the Suffolk coast stands a rusted anti-aircraft fort. In 1965 three men climbed its ladder with a transmitter and a stack of records.", duration: "38:12", seconds: 2292, released: "May 6, 2026", seed: 1471 },
  { no: 2, title: "Static, 1967", dek: "The signal jumped the law and the Marine Offences Act came for it. What happened the night the government switched off the mainland feed.", duration: "41:30", seconds: 2490, released: "May 13, 2026", seed: 9023 },
  { no: 3, title: "The Night Shift", dek: "Whoever held the microphone after midnight held the fort. The DJs who never slept, and the listeners who phoned a number that did not exist.", duration: "44:05", seconds: 2645, released: "May 20, 2026", seed: 3388 },
  { no: 4, title: "Voices on the Tide", dek: "A trawler crew swears they heard the same broadcast a decade after it ended. We take a hydrophone out to the fort to find out what is still down there.", duration: "36:48", seconds: 2208, released: "May 27, 2026", seed: 6610 },
  { no: 5, title: "Who's Still Listening", dek: "An online ledger of recordings, kept by strangers, going back fifty years. Why so many people refuse to let the station die.", duration: "49:20", seconds: 2960, released: "June 3, 2026", seed: 2755 },
  { no: 6, title: "Sign-Off", dek: "The last living engineer agrees to talk, on the condition we play him the tape. The final transmission, and what it really said.", duration: "52:10", seconds: 3130, released: "June 10, 2026", seed: 8194 },
]

export const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 3, suffix: "", label: "seasons, one story each" },
  { value: 1.4, suffix: "M", label: "downloads a month" },
  { value: 19, suffix: "", label: "countries it's charted in" },
  { value: 100, suffix: "%", label: "listener-funded, no ads" },
]

export const CREW: { name: string; role: string; bio: string }[] = [
  { name: "Marielle Okafor", role: "Creator & Host", bio: "Documentary producer, ex-BBC World Service. Spent a decade chasing stories that arrive through speakers instead of pages." },
  { name: "Tomas Vahl", role: "Sound Design", bio: "Builds the rooms you hear inside your head — the wet stone of the fort, the hiss between stations, the long Atlantic dark." },
  { name: "Priya Anand", role: "Reporting & Research", bio: "Reads the archives nobody else will. Found the engineer's logbook in a Felixstowe lock-up that started this whole season." },
]

export const PLATFORMS: { name: string; note: string }[] = [
  { name: "Apple Podcasts", note: "Subscribe & rate" },
  { name: "Spotify", note: "Follow the show" },
  { name: "Pocket Casts", note: "Add the feed" },
  { name: "Overcast", note: "Add the feed" },
  { name: "YouTube", note: "Watch the field tapes" },
  { name: "RSS", note: "Raw feed for any app" },
]

export const SUPPORT: { name: string; price: string; cadence: string; perks: string[]; featured?: boolean }[] = [
  { name: "Listener", price: "$5", cadence: "per month", perks: ["Ad-free, always", "Episodes one week early", "The Sunday field notes email"] },
  { name: "Crew", price: "$12", cadence: "per month", perks: ["Everything in Listener", "Full unedited interviews", "Quarterly behind-the-tape calls", "Name in the season credits"], featured: true },
  { name: "Patron", price: "$250", cadence: "per year", perks: ["Everything in Crew", "A pressed vinyl of the season", "Two tickets to the live mix night"] },
]

export const FAQ: { q: string; a: string }[] = [
  { q: "Is this a true story?", a: "Every season of FATHOM is built from real archives, interviews and recordings. Dead Air is reported the same way — names, dates and tapes are verified, and we tell you in the show when something can't be." },
  { q: "How often do episodes drop?", a: "Weekly through a season, then we go quiet to report the next one. There's no filler between seasons — when we have nothing worth your ears, we say nothing." },
  { q: "Do I need to start at episode one?", a: "Yes. A FATHOM season is one continuous documentary in parts, not a feed of standalones. Begin with The Fort in the Water." },
  { q: "Why is it listener-funded?", a: "Because ads decide what a show is allowed to say. Members keep FATHOM free of them, free of sponsors, and free to spend three months on a single fort in the sea." },
]
