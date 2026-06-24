# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline/centred variant so every view is reachable without a cursor.
- 2026-06-23 — CSS grid isn't masonry: for varied-height cards set `auto-rows-[14px]` + per-card
  `[grid-row:span_N]` to size by track count — deliberate asymmetry, no JS layout lib.
- 2026-06-23 — Accent contrast is ground-dependent: a bright accent that clears AA on near-black
  (≈4.8:1) can fail on warm paper (≈3.3:1) for small text. Keep ONE bright token for dark grounds +
  large display, and a deeper sibling (≈5:1) for small links/labels on light — pick per background.
- 2026-06-24 — A cursor-following hover-reveal (float a poster/image at the pointer over an index list)
  is ONE fixed node driven by useMotionValue x/y + useSpring tracking clientX/clientY, mounted via
  AnimatePresence keyed on the hovered index — never N nodes. The spring lag gives it weight; wire
  onFocus/onBlur too so keyboard users get the reveal.
- 2026-06-24 — Low-alpha hex on text (`${INK}99`, ie 60%) silently fails AA on warm cream for small
  labels — alpha-over-cream lightens fast. Use a SOLID muted token tested ≈6:1 for small text; reserve
  alpha ink only for large display where 3:1 suffices.
- 2026-06-24 — Make a generic stock photo look like on-brand art: grayscale the picsum image, then lay
  a `hsl(hue 62% 38%)` block over it with `mix-blend-multiply` (+ a bottom gradient for legible type).
  Per-item hue turns one technique into a whole varied set and dodges the AI-stock look entirely.
