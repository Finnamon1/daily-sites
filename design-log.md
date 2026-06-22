# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-22 — Animating chart contours with a slow horizontal drift made a static
  mockup feel live without distracting, so prefer ambient low-amplitude motion over
  big flashy effects.
- 2026-06-22 — Putting the disclaimer in the footer voice ("a planning aid, not an
  official product") kept copy honest and on-brand, so write functional copy in the
  product's own voice rather than legal boilerplate.
- 2026-06-22 — A cursor-following image preview tracks clientX/Y on a fixed motion
  div, then offset it (translate-x-8, not centered) so it never covers the row label
  you're reading; gate it behind useReducedMotion with an inline thumbnail fallback.
- 2026-06-22 — Muted brown-on-cream labels at ~3:1 failed AA at text-xs; bumped to a
  darker tone, so check small decorative meta text for contrast, not just body copy.
- 2026-06-22 — Load display+body fonts via index.html <link> and apply with Tailwind
  arbitrary families (font-['Fraunces']) per-element, so type stays scoped to the
  site without touching global CSS or the gallery shell.
