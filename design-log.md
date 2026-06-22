# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-22 — Putting the disclaimer in the footer voice ("a planning aid, not an
  official product") kept copy honest and on-brand, so write functional copy in the
  product's own voice rather than legal boilerplate.
- 2026-06-22 — A cursor-following image preview tracks clientX/Y on a fixed motion
  div, then offset it (translate-x-8, not centered) so it never covers the row label
  you're reading; gate it behind useReducedMotion with an inline thumbnail fallback.
- 2026-06-22 — Faint tints fail AA fastest at small sizes: footer/meta text on dark
  near ~4:1 reads "fine" but isn't, so contrast-check decorative micro-copy, not just body.
- 2026-06-22 — Load display+body fonts via index.html <link> and apply with Tailwind
  arbitrary families (font-['Fraunces']) per-element, so type stays scoped to the
  site without touching global CSS or the gallery shell.
- 2026-06-22 — useMotionTemplate binds a spring-smoothed pointer % straight into a
  radial-gradient background, so a cursor-reactive glow costs no per-frame React
  render; gate it on pointerType === "mouse" + reduced motion with a static fallback.
- 2026-06-22 — Putting framer-motion `layout` on both the grid and its cards makes a
  filtered list reflow by sliding into place, so lean on layout instead of hand-rolled
  FLIP whenever tabs/filters add or remove items.
- 2026-06-22 — One saturated accent stays disciplined on near-black only if every
  secondary "depth" colour sits under ~0.08 alpha and is purely decorative, so a glow
  reads as moonlight, not a second brand colour or gradient soup.
