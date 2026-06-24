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
- 2026-06-24 — Cursor-reactive ambient gradient cheaply: one `fixed inset-0 pointer-events-none z-0` div, update
  `--mx/--my` via a rAF-throttled window `pointermove` in <Layout>, paint `radial-gradient(... at var(--mx) var(--my))`.
  Gate the whole effect on `useReducedMotion()` and keep content at z-10 so it never blocks clicks.
- 2026-06-24 — Encode a category as a small colour DOT (a `Record<Family,string>` of CSS vars) on a neutral chip, not
  a fully tinted pill — adds real colour hierarchy without breaking the one-accent discipline or risking AA on text.
- 2026-06-24 — Colourise a grayscale photo to ANY ink hue cross-browser with `grayscale(1) sepia(1) saturate(n)
  hue-rotate(Xdeg)` — no SVG filter needed; stack two such plates with `mix-blend:multiply` over white for a duotone.
- 2026-06-24 — Make a hover-only effect read on touch too: give it a small RESTING offset and a larger one on hover,
  so a riso "misregistration" (or any split) is part of the identity, not a desktop easter egg.
- 2026-06-24 — Combining a resting transform with a hover transform: drive BOTH via Tailwind translate classes — an
  inline `style.transform` wins specificity and silently kills the `group-hover:` class.
