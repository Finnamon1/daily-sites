# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Lift persistent UI (media/theme/cursor state) into a Provider or effect ABOVE <Routes> in <Layout>;
  carry palette in CSS vars (`--accent`) on the root and `transition-colors` the readers — it survives navigation
  for free and one setState crossfades every page.
- 2026-06-24 — Re-animate KPIs on a control change: lift the period into context above <Routes>, slice the series,
  and key count-up <Counter>s on `useEffect([to])` — one toggle recounts the whole view, each number honest per window.
- 2026-06-24 — Hover image-reveal that READS: layer the "after" image under the "before", wipe the top one with
  `group-hover:[clip-path:inset(0_0_100%_0)]`, and fade in a tiny caption naming what's revealed — interaction intent
  stays legible even when the photo itself is abstract/stock.
- 2026-06-24 — Encode a category as a small colour DOT (a `Record<Family,string>` of CSS vars) on a neutral chip, not
  a fully tinted pill — adds real colour hierarchy without breaking the one-accent discipline or risking AA on text.
- 2026-06-24 — Tracking glare on a 3D-tilt card: feed the SAME mx/my motion values into both rotateX/rotateY and a
  `useMotionTemplate` radial-gradient background, blended `mix-blend-overlay` — one pointer source powers tilt + sheen,
  so the "poster under glass" read costs almost nothing extra.
- 2026-06-25 — Build a radial drag knob with no library: measure cursor angle as `atan2(dx, -dy)` (clockwise from 12
  o'clock) off the element's center rect, clamp into the arc, and in the bottom dead-zone snap to whichever end is
  nearer — then add role="slider"+aria+arrow keys so the same control is pointer- AND keyboard-driven.
- 2026-06-25 — When one control morphs many readouts, interpolate the CONTINUOUS ones (`lerpColor`, meter values) but
  SNAP discrete copy (tasting notes, product) to the nearest named stop via `Math.round(t*(n-1))` — fluid feel, yet the
  words never read as nonsense between the labelled stops.
- 2026-06-25 — SVG radial gradients render coarse; for a smooth gradient-filled focal object, draw the structural
  arc/ticks/knob in SVG but overlay the hero element as an absolutely-positioned DOM node centered on it — CSS
  gradients stay buttery at any scale.
