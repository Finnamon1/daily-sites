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
- 2026-06-22 — picsum returns random photos, so a shared sepia+multiply overlay on
  every image unified mismatched content into one cohesive menu — when stock imagery
  is unavoidable, treat it consistently rather than dropping raw frames.
- 2026-06-22 — A cursor-following preview (motion fixed at pointer + spring) is the
  signature interaction, but it's pointer-only: gate it behind useReducedMotion and
  pair it with `lg:hidden` inline thumbnails so touch users never get a dead row.
- 2026-06-22 — Muted decorative meta text (brown-on-cream ~3:1) failed AA at text-xs;
  check small label/meta contrast, not just body copy, and keep real copy at /60+.
- 2026-06-22 — Load display+body fonts via index.html <link> and apply with Tailwind
  arbitrary families (font-['Fraunces']) per-element, so type stays scoped to the
  site without touching global CSS or the gallery shell.
- 2026-06-23 — "Morphing blobs" read best as blurred divs animating borderRadius
  keyframes (organic) rather than SVG path morphing, with one tied to the cursor via
  spring — cheap, reliable, and never produces a broken interpolation.
- 2026-06-23 — Animated counters that take a prefix/suffix can read wrong mid-count
  ("1 of 0"): only count a clean integer and put framing words in the label beneath,
  so every interpolated frame stays truthful.
- 2026-06-23 — index.html had two href attrs on one font <link> (only the last wins,
  silently dropping families); merge every family into ONE valid href before adding a
  new typeface, or your display font just won't load.
