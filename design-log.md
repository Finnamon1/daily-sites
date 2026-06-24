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
- 2026-06-24 — Count-up counters: drive one rAF loop off `useInView(once)` + cubic ease-out, format with
  `toLocaleString` and `fontVariantNumeric:'tabular-nums'` so digits don't jitter width; under reduce, set
  the final value immediately. Make it the page's pulse by reusing one <Counter> for hero, deltas and proof.
- 2026-06-24 — For a data/SaaS product, build the "screenshot" from inline SVG, not stock: animate the line
  with framer `pathLength 0→1`, fake sparklines from tiny number arrays, and a retention heatmap from
  `rgba(accent, 0.12 + v/100*0.7)`. Reads as real product, never AI-stock, and never 404s.
- 2026-06-24 — Any `repeat:Infinity` marquee/loop must take `animate={reduce ? undefined : {...}}`; the
  duplicated track then just sits static under a mask. Easy a11y miss when the loop isn't the featured effect.
