# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline/centred variant so every view is reachable without a cursor.
- 2026-06-23 — Before/after compare slider: clip the overlay image with `clipPath: inset(0 ${100-pos}% 0 0)`
  from one percent of state; make the handle a `role="slider"` button with arrow-key handlers. Pointer
  events (down/move/up + setPointerCapture) cover mouse and touch in one path — no separate touch code.
- 2026-06-23 — CSS grid isn't masonry: for varied-height cards set `auto-rows-[14px]` + per-card
  `[grid-row:span_N]` to size by track count — deliberate asymmetry, no JS layout lib.
- 2026-06-23 — For a cursor-reactive field of many marks, drive it on ONE canvas + rAF loop (clearRect,
  per-node displacement by proximity to a spring-lagged pointer) — not N React/DOM nodes. Stays 60fps
  with hundreds of ticks, and a phantom Lissajous pointer keeps it alive where there's no cursor.
- 2026-06-23 — Accent contrast is ground-dependent: a bright accent that clears AA on near-black
  (≈4.8:1) can fail on warm paper (≈3.3:1) for small text. Keep ONE bright token for dark grounds +
  large display, and a deeper sibling (≈5:1) for small links/labels on light — pick per background.
- 2026-06-23 — "Draw" an SVG diagram by animating framer `pathLength` 0→1 per segment with staggered
  delays (gated on useInView + reduced-motion) — crisper and cheaper than animating path `d`, and the
  stagger reads as construction order (down tube, top tube, stays…).
