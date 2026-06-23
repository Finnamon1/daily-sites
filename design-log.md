# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — A single accent that fails AA as small text (terracotta ≈3:1 on cream) can still
  anchor a palette: reserve the bright tone for icons / large display / dark grounds, swap to a
  darkened sibling for small labels on light grounds, and pass a `tone` prop rather than forking the
  label component (FLARE #ff4d2e ≈2.7:1 on cream → #b8371d ≈5:1; ≈5.5:1 on near-black is fine).
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline variant so every view is reachable without a cursor.
- 2026-06-23 — Scroll-velocity marquee = useScroll→useVelocity→useSpring→useTransform feeding a
  useAnimationFrame that adds to a baseX MotionValue; render 4 identical copies and wrap(-25,-50)
  the % translate for a seamless loop. Gate the frame on useReducedMotion so it sits static.
- 2026-06-23 — To un-set an inline style on hover, use the !important class modifier: inline styles
  only lose to !important rules, so `group-hover:!filter-none` cleanly lifts an inline grayscale
  duotone to full colour — no state, no JS.
