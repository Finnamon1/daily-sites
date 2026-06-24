# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Make a generic stock photo look like on-brand art: grayscale the picsum image, then lay
  a `hsl(hue 62% 38%)` block over it with `mix-blend-multiply` (+ a bottom gradient for legible type).
  Per-item hue turns one technique into a whole varied set and dodges the AI-stock look entirely.
- 2026-06-24 — Re-check dim "faint" neutrals at their SMALLEST size: a tone that passes AA at 16px can fail at
  11px uppercase mono. Compute the ratio against the real bg and lift it to ≥4.5, or keep it for glyphs only.
- 2026-06-24 — Cursor-reactive heroes touch-reachable for free: track `onPointerMove` (pointer events fire for
  touch drags too), feed normalized x/y into `useSpring` → `useTransform` for layered parallax. One handler
  covers mouse + touch; gate heavier morphs behind !reduce.
- 2026-06-24 — Hover image-reveal: keep the floating frame INSIDE the list's own `relative` wrapper and bake the
  centering offset into the motion value (`x.set(clientX - left - W/2)`), never a CSS `-translate-x-1/2` — framer's
  `x`/`y` own `transform` and would clobber it. Spring x/y for a weighty, trailing follow.
- 2026-06-24 — A hover-only reveal is invisible on touch: gate the floating frame behind `[@media(hover:hover)]`,
  give touch rows a persistent inline thumbnail, make captions default-visible and hover-HIDE only on hover devices,
  and early-return on `e.pointerType === "touch"` so a tap-drag never flings the frame.
- 2026-06-24 — Reach for `<MotionConfig reducedMotion="user">` at the site root instead of hand-gating every
  `whileInView`: it cancels transform/layout animation under the OS setting while keeping opacity, so scroll
  reveals and page transitions comply for free — you only special-case infinite loops (marquee) and counters.
