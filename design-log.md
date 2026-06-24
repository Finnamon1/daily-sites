# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Make a generic stock photo look like on-brand art: grayscale the picsum image, then lay
  a `hsl(hue 62% 38%)` block over it with `mix-blend-multiply` (+ a bottom gradient for legible type).
  Per-item hue turns one technique into a whole varied set and dodges the AI-stock look entirely.
- 2026-06-24 — Scroll-snap a chaptered home page by setting `scrollSnapType='y proximity'` on
  `document.documentElement` in a useEffect (restore on unmount), NOT a nested overflow container —
  that avoids double scrollbars and keeps the sticky nav + window scroll intact. Gate behind !reduce.
- 2026-06-24 — Per-panel parallax: give each full-viewport section its own `useScroll({target, offset:
  ["start end","end start"]})` + `useTransform` to a y%, and over-scale the image layer (`scale-[1.18]`)
  so the drift never exposes a bare edge. Zero the transform under prefers-reduced-motion.
- 2026-06-24 — Make a cursor-reactive hero touch-reachable for free: track `onPointerMove` (pointer events
  fire for touch drags too), feed normalized x/y into `useSpring` → `useTransform` for layered parallax and a
  `useMotionTemplate` radial-gradient centre. One handler covers mouse + touch; gate the d-morph behind !reduce.
- 2026-06-24 — Re-check dim "faint" neutrals at their SMALLEST size: a tone that passes AA at 16px can fail at
  11px uppercase mono. Compute the ratio against the real bg and lift it to ≥4.5, or keep it for glyphs only.
- 2026-06-24 — Cursor-reactive variable fonts: drive per-letter `style.fontVariationSettings 'wght'` IMPERATIVELY
  in one rAF loop (refs + ease toward a pointer-distance target), never React state — a whole headline reacts at
  60fps with zero re-renders. Cache each glyph's centre x once and re-measure on resize.
- 2026-06-24 — Widen the Google-Fonts axis you import before relying on it: the stock specimen import often clamps
  Fraunces to `wght@…,400..700`, gutting a weight-axis interaction. Request `100..900` — wider is backward-compatible.
- 2026-06-24 — Sell fictional products (a foundry's invented faces) with real imported fonts mapped by category
  (didone→Cormorant, grotesk→Space Grotesk, mono→Plex Mono); gate `fontVariationSettings` behind a
  `font.includes('Fraunces')` check so non-variable fonts fall back to plain `fontWeight`.
