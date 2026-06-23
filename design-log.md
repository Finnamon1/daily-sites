# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-22 — Putting the disclaimer in the footer voice ("a planning aid, not an
  official product") kept copy honest and on-brand, so write functional copy in the
  product's own voice rather than legal boilerplate.
- 2026-06-22 — A cursor-following preview (motion fixed at pointer + spring) is the
  signature interaction, but it's pointer-only: gate it behind useReducedMotion and
  pair it with `lg:hidden` inline thumbnails so touch users never get a dead row.
- 2026-06-22 — Muted decorative meta text (brown-on-cream ~3:1) failed AA at text-xs;
  check small label/meta contrast, not just body copy, and keep real copy at /60+.
- 2026-06-23 — Animated counters that take a prefix/suffix can read wrong mid-count
  ("1 of 0"): only count a clean integer and put framing words in the label beneath,
  so every interpolated frame stays truthful.
- 2026-06-23 — index.html had two href attrs on one font <link> (only the last wins,
  silently dropping families); merge every family into ONE valid href before adding a
  new typeface, or your display font just won't load.
- 2026-06-23 — Scroll parallax reads cleanest when the image is held at scale ~1.18
  inside an overflow-crop frame so the vertical drift never exposes an edge, and the
  whole transform is zeroed under useReducedMotion.
- 2026-06-23 — A layered, offset two-image hero (absolute frames at different widths)
  beats one centered photo; give each frame its own parallax distance so they separate
  as you scroll and create depth for free.
- 2026-06-23 — Hover image-reveal: start the photo grayscale+dimmed and warm it to full
  colour while a caption's max-h animates open — drive it from group-hover AND
  group-focus-visible so keyboard users get the identical reveal.
