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
- 2026-06-23 — Editorial pairing: a high-contrast optical serif (Fraunces) for display +
  a humanist sans body + mono small-caps labels carries a magazine; let the lone accent
  do kicker bars and active states only, so colour never becomes a second voice.
- 2026-06-23 — Scroll parallax: clip a frame (overflow-hidden), scale inner img ~1.2
  BEFORE translating ±12% on scrollYProgress so drift never exposes an edge; zero it
  under useReducedMotion.
- 2026-06-23 — Count-up: a raw requestAnimationFrame + cubic ease gated on useInView({once})
  beats framer's animate() for stat rows; jump to target under reduced motion. Two speeds
  read as two events — slow ~1.4s for hero stats, fast ~600ms re-count keyed to a toggle
  (monthly/annual) so a price feels recalculated, not just re-rendered.
- 2026-06-23 — SVG "self-drawing" chart: animate pathLength only (cheap); to REDRAW on a
  range/data switch, remount with key={range} — animating the `d` string or dash-offset
  across a changed path just snaps. Bars stagger via per-bar delay = i*0.08.
- 2026-06-23 — A photo-free dashboard sells its featured interaction best by planting a
  live count-up + self-drawing chart inside a hero preview card on the marketing page, so
  the technique earns the click before the user reaches the actual app view.
- 2026-06-23 — On a light dev-tool page a single dark terminal/code panel is the
  strongest "hero image": crafted mono + one green accent beats stock photo, and
  spends your contrast budget on the one element that matters.
