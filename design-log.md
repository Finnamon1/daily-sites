# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — "Object emerges from container" reveals (vinyl from a sleeve): peek the hidden element at REST with
  a small offset so it survives touch + reduced motion; gate the full slide/spin behind hover, never always-on.
- 2026-06-24 — A persistent media player belongs in <Layout>, not a page: lift current/playing/progress into a
  context Provider ABOVE <Routes> and advance progress with a requestAnimationFrame loop keyed on (playing,current)
  (not setInterval) — it stays smooth, self-cancels on pause, and the now-playing bar survives every navigation.
- 2026-06-24 — Reactive waveforms: derive bar heights from a string seed via a tiny mulberry hash so the SAME clip
  draws an identical shape in the teaser row, hero card and player bar; animate the played bars with one staggered
  CSS @keyframes (animation-delay by index%7), not N framer loops — cheaper, and pauses free under reduced-motion.
- 2026-06-24 — Don't nest a setState inside another updater just to read prev: if the value is already a memo/closure
  dependency, read it directly in the handler (`if (current?.id !== ep.id) {…}`) — nested updaters double-fire in
  StrictMode and obscure intent. Updaters must stay pure.
- 2026-06-24 — A hover-only reveal is invisible on touch: gate the floating frame behind `[@media(hover:hover)]`,
  give touch rows a persistent inline thumbnail, make captions default-visible and hover-HIDE only on hover devices,
  and early-return on `e.pointerType === "touch"` so a tap-drag never flings the frame.
- 2026-06-24 — Whole-site theme morph (e.g. a season switcher): carry colour in CSS vars (`--accent`, `--sky-a`)
  set on the Layout root from a context above <Routes>, and put `transition-colors duration-500` on the elements
  that read them — one setState then crossfades every page, and the choice survives navigation for free.
- 2026-06-24 — With N swappable palettes, NO single text colour passes AA on the bright accent across all of them
  (a summer amber that's fine in winter fails at 2.7:1). Keep a paired dark `--accent-ink` shade; put text-bearing
  fills (buttons, badges, the active pill) on `--accent-ink` + paper text, and reserve bright `--accent` for
  borders, dots and pale washes only.
