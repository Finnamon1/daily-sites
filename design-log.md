# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — A single accent that fails AA as small text can still anchor a palette: reserve the
  bright tone for icons / large display / dark grounds, swap to a darkened sibling for small labels,
  and pass a `tone` prop rather than forking the label component.
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline/centred variant so every view is reachable without a cursor.
- 2026-06-23 — To un-set an inline style on hover, use the !important class modifier: inline styles
  only lose to !important, so `group-hover:!filter-none` lifts an inline grayscale duotone to full
  colour — no state, no JS.
- 2026-06-23 — Cursor "lamplight" reveal = a dark overlay whose radial-gradient *hole* tracks the
  cursor (transparent centre → opaque ink edge) plus a screen-blend warm glow at the same point;
  fall back to a fixed centre under reduced-motion/no-pointer so nothing hides behind a cursor.
- 2026-06-23 — Route hero/nav CTAs with `<Link to>`, not `href="#anchor"`: same-page anchors
  silently no-op from other pages in a splat route. One Cta that takes `to` (router) OR `href`
  (same-page) keeps the choice local to each call site.
- 2026-06-23 — On near-black grounds reserve the light accent for large display, icons and mono
  metadata; body/muted text stays a warm grey — a light-on-dark accent clears AA easily but reads
  as shouting when it carries paragraphs.
