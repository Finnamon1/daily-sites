# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Re-check dim "faint" neutrals at their SMALLEST size: a tone that passes AA at 16px can fail at
  11px uppercase mono. Compute the ratio against the real bg and lift it to ≥4.5, or keep it for glyphs only.
- 2026-06-24 — "Object emerges from container" reveals (vinyl from a sleeve): peek the hidden element at REST with
  a small offset so it survives touch + reduced motion; gate the full slide/spin behind hover, never always-on.
- 2026-06-24 — Lift cart/shared state into a context Provider ABOVE <Routes> so it survives navigation (route
  changes unmount pages, not the provider); animate a running subtotal with `animate(prev,next)` keyed on value.
- 2026-06-24 — A hover-only reveal is invisible on touch: gate the floating frame behind `[@media(hover:hover)]`,
  give touch rows a persistent inline thumbnail, make captions default-visible and hover-HIDE only on hover devices,
  and early-return on `e.pointerType === "touch"` so a tap-drag never flings the frame.
- 2026-06-24 — Reach for `<MotionConfig reducedMotion="user">` at the site root instead of hand-gating every
  `whileInView`: it cancels transform/layout animation under the OS setting while keeping opacity, so scroll
  reveals and page transitions comply for free — you only special-case infinite loops (marquee) and counters.
- 2026-06-24 — Whole-site theme morph (e.g. a season switcher): carry colour in CSS vars (`--accent`, `--sky-a`)
  set on the Layout root from a context above <Routes>, and put `transition-colors duration-500` on the elements
  that read them — one setState then crossfades every page, and the choice survives navigation for free.
- 2026-06-24 — With N swappable palettes, NO single text colour passes AA on the bright accent across all of them
  (a summer amber that's fine in winter fails at 2.7:1). Keep a paired dark `--accent-ink` shade; put text-bearing
  fills (buttons, badges, the active pill) on `--accent-ink` + paper text, and reserve bright `--accent` for
  borders, dots and pale washes only.
- 2026-06-24 — To make an inline SVG re-theme with the palette, give shapes `fill="var(--leaf)"` and a per-element
  `style={{transition:"fill 600ms"}}` (and `stop-color` + transition on gradient stops) — CSS transitions DO fire
  when a custom property changes the computed value, so the illustration morphs without re-rendering React.
