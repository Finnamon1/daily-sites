# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — On near-black/dark grounds reserve the light or bright accent for large display,
  icons and mono metadata; body/muted text stays a warm grey — a light-on-dark accent clears AA
  easily but reads as shouting when it carries paragraphs.
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline/centred variant so every view is reachable without a cursor.
- 2026-06-23 — Before/after compare slider: clip the overlay image with `clipPath: inset(0 ${100-pos}% 0 0)`
  from one percent of state; make the handle a `role="slider"` button with arrow-key handlers. Pointer
  events (down/move/up + setPointerCapture) cover mouse and touch in one path — no separate touch code.
- 2026-06-23 — Two unrelated picsum seeds can read as one "before/after" room if you grade them apart
  (before: grayscale+dim, after: saturate) and label the corners — the grade sells what the photos can't.
- 2026-06-23 — CSS grid isn't masonry: for varied-height cards set `auto-rows-[14px]` + per-card
  `[grid-row:span_N]` to size by track count — deliberate asymmetry, no JS layout lib.
- 2026-06-23 — Morph a "blob" by animating border-radius between asymmetric `% / %` values plus a slow
  rotate on a framer loop — robust and cheaper than animating an SVG path `d` (no point-count match),
  and stays alive on touch since it isn't hover-gated.
- 2026-06-23 — Bright decorative blobs may overlap a large bold hero headline (dark ink clears AA's
  3:1 large-text bar) but must stay off body copy (4.5:1) — cluster crisp blobs around display/empty
  zones, drop a heavily-blurred low-opacity wash behind paragraphs.
