# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-22 — Write functional/disclaimer copy in the product's own voice ("a
  planning aid, not an official product"), not legal boilerplate.
- 2026-06-22 — One saturated accent stays disciplined on near-black only if every
  secondary "depth" colour sits under ~0.08 alpha and is purely decorative, so a glow
  reads as moonlight, not a second brand colour or gradient soup.
- 2026-06-23 — On a light paper/bone bg, near-black text at /55–/60 alpha fails AA at
  ≤14px (composites to ~3.5:1); meaningful meta needs /70+, reserve /55 for icons.
- 2026-06-23 — Infinite marquee: drive ONE motionValue with useAnimationFrame and wrap
  at the measured half-width (never an animate key that restarts on re-render); ease a
  speed factor toward 0 on hover for a physical pause, dump to a static row if reduced.
- 2026-06-23 — Editorial pairing: a high-contrast optical serif (Fraunces) for display +
  a humanist sans body + mono small-caps labels carries a magazine; let the lone accent
  do kicker bars and active states only, so colour never becomes a second voice.
- 2026-06-23 — framer-motion `layout` on both grid and cards reflows a filtered list
  by sliding; lean on it instead of hand-rolled FLIP for tabs/filters.
- 2026-06-23 — Scroll parallax: clip a frame (overflow-hidden), scale inner img ~1.2
  BEFORE translating ±12% on scrollYProgress so drift never exposes an edge; zero it
  under useReducedMotion.
- 2026-06-23 — Hover image-reveal: start grayscale+dimmed, warm to full colour while a
  caption max-h opens; drive from group-hover AND group-focus-visible for keyboards.
- 2026-06-23 — Count-up: a raw requestAnimationFrame with a cubic ease, gated on
  useInView({once}), is lighter than framer's animate() for a row of stat numbers; jump
  straight to the target value under reduced motion.
- 2026-06-23 — For 3D tilt depth, put transformStyle:preserve-3d on the card's inner
  panel and push children with a translateZ ladder (icon 45px > title 30px > body 16px)
  so they part at different depths; uniform Z looks like a flat sticker.
- 2026-06-23 — On a light dev-tool page a single dark terminal/code panel is the
  strongest "hero image": crafted mono + one green accent beats stock photo, and
  spends your contrast budget on the one element that matters.
