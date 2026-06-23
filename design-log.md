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
- 2026-06-23 — To un-set an inline style on hover use the !important modifier (`group-hover:!grayscale-0`):
  inline styles only lose to !important, lifting a duotone to full colour with no state/JS.
- 2026-06-23 — Route hero/nav CTAs with `<Link to>`, not `href="#anchor"`: same-page anchors
  silently no-op from other pages in a splat route.
- 2026-06-23 — "Live board"/marquee ambience with no per-item state: hold one list and render a
  windowed/duplicated slice, advancing on a single interval — one timer drives N animations. Always
  gate the timer on useReducedMotion for a static fallback.
- 2026-06-23 — Morph a "blob" by animating border-radius between asymmetric `% / %` values plus a slow
  rotate on a framer loop — robust and cheaper than animating an SVG path `d` (no point-count match),
  and stays alive on touch since it isn't hover-gated.
- 2026-06-23 — Bright decorative blobs may overlap a large bold hero headline (dark ink clears AA's
  3:1 large-text bar) but must stay off body copy (4.5:1) — cluster crisp blobs around display/empty
  zones, drop a heavily-blurred low-opacity wash behind paragraphs.
- 2026-06-23 — For a divider/border whose colour varies per card (set via inline style), use a
  `bg-current opacity-20` 1px div, not `border-current/NN` — Tailwind has no opacity modifier on
  `border-current`, so it silently renders a solid line.
