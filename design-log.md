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
- 2026-06-24 — Combining a resting transform with a hover transform: drive BOTH via Tailwind translate classes — an
  inline `style.transform` wins specificity and silently kills the `group-hover:` class.
- 2026-06-24 — Tracking glare on a 3D-tilt card: feed the SAME mx/my motion values into both rotateX/rotateY and a
  `useMotionTemplate` radial-gradient background, blended `mix-blend-overlay` — one pointer source powers tilt + sheen,
  so the "poster under glass" read costs almost nothing extra.
- 2026-06-24 — Native `<select>`/`<option>` ignore Tailwind and inherit OS chrome, so on a dark form they render
  dark-on-dark; set an inline LIGHT `{background,color}` on each `<option>` so the open dropdown is always legible.
- 2026-06-24 — Seamless infinite marquee: render the row twice in a `flex w-max` track, animate `translateX` 0→-50%,
  add edge `from-bg to-transparent` fade masks + `hover:[animation-play-state:paused]`, and `animation:none` under
  `prefers-reduced-motion`.
