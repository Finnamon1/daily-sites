# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Lift persistent UI (media/theme/cursor state) into a Provider or effect ABOVE <Routes> in <Layout>;
  carry palette in CSS vars on the root and `transition-colors` the readers — it survives navigation for free.
- 2026-06-24 — Hover image-reveal that READS: layer "after" under "before", wipe the top with
  `group-hover:[clip-path:inset(...)]`, fade in a tiny caption naming what's revealed — intent stays legible.
- 2026-06-24 — Tracking glare on a 3D-tilt card: feed the SAME mx/my into rotateX/Y AND a `useMotionTemplate`
  radial-gradient bg, blended `mix-blend-overlay` — one pointer source powers tilt + sheen.
- 2026-06-25 — SVG radial gradients render coarse; draw structure (arcs/ticks) in SVG but overlay the smooth-gradient
  focal element as an absolutely-positioned DOM node centered on it — CSS gradients stay buttery at any scale.
- 2026-06-25 — Parallax a layered SVG scene off ONE springed pointer motion value: subscribe each depth layer's
  `<motion.g>` via `.on("change")` into its own motion value scaled by a different factor — real depth, one source,
  gated whole on `useReducedMotion`. Far layer moves least.
- 2026-06-25 — Make an SVG hover-map keyboard-reachable: give each hotspot an invisible `<rect tabIndex role="button"
  aria-label>` and wire onFocus/onBlur to the SAME activate/clear handlers as onPointerEnter/Leave — pointer and
  keyboard drive one state, zero extra logic.
- 2026-06-25 — Draw-in linework: animate `pathLength` 0→1 on `<motion.line>`/path with a per-edge `delay: i*0.05`
  so a diagram/constellation assembles stroke by stroke instead of popping, with the nodes faintly visible underneath.
