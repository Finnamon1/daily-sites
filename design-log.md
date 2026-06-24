# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline/centred variant so every view is reachable without a cursor.
- 2026-06-24 — Make a generic stock photo look like on-brand art: grayscale the picsum image, then lay
  a `hsl(hue 62% 38%)` block over it with `mix-blend-multiply` (+ a bottom gradient for legible type).
  Per-item hue turns one technique into a whole varied set and dodges the AI-stock look entirely.
- 2026-06-24 — Scroll-snap a chaptered home page by setting `scrollSnapType='y proximity'` on
  `document.documentElement` in a useEffect (restore on unmount), NOT a nested overflow container —
  that avoids double scrollbars and keeps the sticky nav + window scroll intact. Gate behind !reduce.
- 2026-06-24 — Per-panel parallax: give each full-viewport section its own `useScroll({target, offset:
  ["start end","end start"]})` + `useTransform` to a y%, and over-scale the image layer (`scale-[1.18]`)
  so the drift never exposes a bare edge. Zero the transform under prefers-reduced-motion.
- 2026-06-24 — Morphing blobs: animate a `motion.path`'s `d` through a keyframe ARRAY of structurally
  identical path strings (same `M`+N×`C`+`Z`, same numeric-token count) — framer's complex type interpolates
  the embedded numbers. Generate each frame with a closed Catmull-Rom spline from per-keyframe radii arrays.
- 2026-06-24 — Make a cursor-reactive hero touch-reachable for free: track `onPointerMove` (pointer events
  fire for touch drags too), feed normalized x/y into `useSpring` → `useTransform` for layered parallax and a
  `useMotionTemplate` radial-gradient centre. One handler covers mouse + touch; gate the d-morph behind !reduce.
- 2026-06-24 — Re-check dim "faint" neutrals at their SMALLEST size: a tone that passes AA at 16px can fail at
  11px uppercase mono. Compute the ratio against the real bg and lift it to ≥4.5, or keep it for glyphs only.
