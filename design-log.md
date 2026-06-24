# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline/centred variant so every view is reachable without a cursor.
- 2026-06-23 — CSS grid isn't masonry: for varied-height cards set `auto-rows-[14px]` + per-card
  `[grid-row:span_N]` to size by track count — deliberate asymmetry, no JS layout lib.
- 2026-06-24 — Make a generic stock photo look like on-brand art: grayscale the picsum image, then lay
  a `hsl(hue 62% 38%)` block over it with `mix-blend-multiply` (+ a bottom gradient for legible type).
  Per-item hue turns one technique into a whole varied set and dodges the AI-stock look entirely.
- 2026-06-24 — Animate a variable font with the cursor: drive ONE useMotionValue (0..1 across the
  element), useSpring it, useTransform to each axis, then bind with `useMotionTemplate\`'wght' ${w},
  'opsz' ${o}\`` on style.fontVariationSettings. Always mirror the axes as sliders so it's reachable
  without a pointer, and short-circuit to a static well-set specimen under prefers-reduced-motion.
- 2026-06-24 — A contentEditable type-tester must be UNCONTROLLED: binding its children to React state
  (`{text}` + onInput→setState) resets the caret to the start every keystroke. Render the initial text
  once as children, never re-render it; the typed text survives unrelated prop changes (font/size) because
  the node stays mounted. Add role="textbox" + aria-multiline + tabIndex so keyboard users reach it.
- 2026-06-24 — Before promising a "variable type tester", check which axes the loaded css2 URL actually
  ships as RANGES not instances: `wght@...400..700` is animatable, `wght@...500;600;700` is not. Fraunces
  (`opsz,wght@0,9..144,400..700`) gives real wght+opsz ranges; lean on those, don't assume axes exist.
