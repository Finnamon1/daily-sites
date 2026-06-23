# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Call useMotionValueEvent only with a real MotionValue: split the optional-progress
  branch into its own child component instead of shimming a fake MV — hooks stay unconditional.
- 2026-06-23 — A single accent that fails AA as small text (terracotta ≈3:1 on cream) can still
  anchor a palette: reserve the bright tone for icons / large display / dark grounds and swap to a
  darkened sibling for small labels. The easy inverse: a bright accent on a near-black ground
  (amber #f4b860 on #070a12 ≈10:1) reads safely as body text, so a dark theme needs no second tone.
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline variant so every view is reachable without a cursor.
- 2026-06-23 — A canvas effect drawn behind pointer-events:none content still tracks the cursor if
  you bind pointermove on window and map clientX/Y via canvas.getBoundingClientRect (arm only when
  inside bounds) — the hero CTAs stay clickable while the cursor drives the canvas.
- 2026-06-23 — Cursor-only canvas effects must self-animate (rAF parallax drift + twinkle) so touch
  users still see a live hero; the pointer filaments are an enhancement, not the whole show.
- 2026-06-23 — One reusable Counter = useInView (once) + cubic ease-out rAF (1-(1-p)^3), gated by
  useReducedMotion (snap to value); format with toLocaleString for ints / toFixed for decimals so
  the same component serves m, %, mag and "Class N".
