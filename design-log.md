# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

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
- 2026-06-24 — Morphing "blob" without SVG path-matching: animate `borderRadius` between 4 asymmetric values
  ("62% 38% 42% 58% / 56% 44% 56% 44%") plus scale+rotate on long offset loops, `blur()` + `mix-blend:screen` — organic, never repeats.
- 2026-06-24 — Cursor-reactive ambient field cheaply: map pointer→center distance to a 0..1 `heat`, spring it, push into
  a parent state ONCE via `spring.on("change")`, then drive child opacity/intensity off the number — no per-orb listeners.
- 2026-06-24 — Photo treatment that fits a dark warm theme: `saturate(0.8) contrast(1.05) brightness(0.85) sepia(0.16)`
  + a bottom-up ink gradient overlay unifies mismatched stock seeds into one duotone-ish palette so text stays legible on top.
