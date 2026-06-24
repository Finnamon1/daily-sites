# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Re-check dim "faint" neutrals at their SMALLEST size: a tone that passes AA at 16px can fail at
  11px uppercase mono. Compute the ratio against the real bg and lift it to ≥4.5, or keep it for glyphs only.
- 2026-06-24 — "Object emerges from container" reveals (vinyl sliding out of a sleeve): peek the hidden element
  at REST with a small transform offset so the affordance survives touch + reduced motion, and reserve the full
  slide+spin for hover. Gate any infinite spin behind hover state so a grid of 8 cards isn't all animating at once.
- 2026-06-24 — JS hover-fill buttons (onMouseEnter mutating `style.background`) are invisible to keyboard users:
  mirror the fill on onFocus/onBlur AND add a `focus-visible:ring`, or the only affordance is mouse-only.
- 2026-06-24 — Lift cart/shared state into a context Provider ABOVE <Routes> so it survives navigation (route
  changes unmount pages, not the provider); animate a running subtotal with `animate(prev,next)` keyed on value.
- 2026-06-24 — Hover image-reveal: keep the floating frame INSIDE the list's own `relative` wrapper and bake the
  centering offset into the motion value (`x.set(clientX - left - W/2)`), never a CSS `-translate-x-1/2` — framer's
  `x`/`y` own `transform` and would clobber it. Spring x/y for a weighty, trailing follow.
- 2026-06-24 — A hover-only reveal is invisible on touch: gate the floating frame behind `[@media(hover:hover)]`,
  give touch rows a persistent inline thumbnail, make captions default-visible and hover-HIDE only on hover devices,
  and early-return on `e.pointerType === "touch"` so a tap-drag never flings the frame.
- 2026-06-24 — Reach for `<MotionConfig reducedMotion="user">` at the site root instead of hand-gating every
  `whileInView`: it cancels transform/layout animation under the OS setting while keeping opacity, so scroll
  reveals and page transitions comply for free — you only special-case infinite loops (marquee) and counters.
