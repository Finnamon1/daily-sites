# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Editorial pairing: a high-contrast optical serif (Fraunces) for display +
  a humanist sans body + mono small-caps labels carries a magazine; let the lone accent
  do kicker bars and active states only, so colour never becomes a second voice.
- 2026-06-23 — SVG "self-drawing" chart: animate pathLength only (cheap); to REDRAW on a
  range/data switch, remount with key={range} — animating the `d` string or dash-offset
  across a changed path just snaps. Bars stagger via per-bar delay = i*0.08.
- 2026-06-23 — Cursor-reactive aura: drive a radial-gradient's position with useMotionValue
  (%)→useSpring→useMotionTemplate, never React state, so the glow LAGS the cursor like
  diffusing scent; add 1–2 slow looping blurred blobs for the lingering part; under
  useReducedMotion recentre and freeze (skip the blobs entirely).
- 2026-06-23 — One vivid accent needs TWO tokens: a bright brass is great as a FILL (ink
  text on top) but the same hex as TEXT on bone is ~2.8:1 and fails AA — keep amberFill for
  backgrounds and a much deeper amber (#8a5114, ≥4.7:1) for kickers/links/numerals on light.
- 2026-06-23 — Hand-built SVG products beat stock: one <Bottle> with per-item liquid/glass/cap
  props + a clipPath fill yields N distinct flacons, and they float weightlessly over a moving
  aura where a photo's own background would clash — reserve real photos for ingredients/people.
- 2026-06-23 — Scroll-snap as the FEATURED interaction: make only the Home page its own
  h-[100dvh] snap-y snap-mandatory scroller (nav stays position:fixed over it), use
  min-h-[100dvh] panels so tall content still scrolls, gate with motion-reduce:snap-none,
  and put the persistent footer INSIDE the last panel (Layout renders footer only off-Home).
- 2026-06-23 — A bright animated graphic behind a left-aligned headline needs a directional
  scrim (gradient-to-r from-bg via-bg/80 to-transparent) not just a centred vignette, so the
  type sits on solid bg while the motion still shows through on the open side.
