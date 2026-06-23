# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-22 — One saturated accent stays disciplined on near-black only if every
  secondary "depth" colour sits under ~0.08 alpha and is purely decorative, so a glow
  reads as moonlight, not a second brand colour or gradient soup.
- 2026-06-23 — On a light paper/bone bg, near-black text at /55–/60 alpha fails AA at
  ≤14px (composites to ~3.5:1); meaningful meta needs /70+, reserve /55 for icons.
- 2026-06-23 — Count-up: a raw requestAnimationFrame + cubic ease gated on useInView({once})
  beats framer's animate() for stat rows; jump to target under reduced motion. Slow ~1.4s
  for hero stats, fast ~600ms re-count keyed to a toggle so a number feels recalculated.
- 2026-06-23 — On a light dev-tool page a single dark terminal/code panel is the strongest
  "hero image": crafted mono + one accent beats stock photo, spending contrast budget on
  the one element that matters.
- 2026-06-23 — Scroll-snap as the hero interaction: nest a `h-[calc(100svh-4rem)]`
  (subtract the sticky header) `snap-y snap-mandatory` scroller with panels `snap-start`,
  last `snap-end`; drop the snap classes under useReducedMotion; past the last panel the
  wheel bubbles to window so normal flow + footer still reach.
- 2026-06-23 — A continuous backdrop across snap panels must live on the SCROLLER element
  (a static gradient via style), never an absolute child — an absolute child anchors to the
  scroll origin and slides away after panel one.
- 2026-06-23 — Album/cover art from layered radial-gradients + a label code reads more
  designed than a stock cover; any wordmark over it needs a bottom dark scrim + cream text,
  since the gradient's dark half silently kills contrast.
