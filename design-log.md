# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Lift persistent UI (media player, season/theme state) into a context Provider ABOVE <Routes> in
  <Layout>, carry palette in CSS vars (`--accent`) set on the root and `transition-colors` the readers — it survives
  navigation for free and one setState crossfades every page.
- 2026-06-24 — Before/after slider from ONE photo, not two: layer the same image twice, grade the under copy warm
  ("restored") and the over copy desaturated+dim ("as found"), wipe between them with `clip-path: inset(0 X% 0 0)`
  driven by an invisible `<input type=range>` over the seam — honest, deterministic, never mismatched stock, and
  keyboard-accessible for free. Lean on grayscale/brightness/contrast for "damp & flat", not big hue-rotate (gimmicky).
- 2026-06-24 — Alternate a two-column case-study layout with zero JS reordering: `md:[direction:rtl]` on the grid
  flips column order at the breakpoint, then `md:[direction:ltr]` on each child resets text — same markup, mirrored.
- 2026-06-24 — Grid collages built from row-span/col-span need an explicit container height at EVERY breakpoint
  (`h-[380px] sm:h-[440px]`); give only `md:h-…` and the cells collapse to zero on mobile where there's none to inherit.
- 2026-06-24 — Crosshair tooltip on an SVG chart: keep line/area/dot INSIDE the scaling SVG (they scale for free),
  float only the HTML tooltip with `left:${x/viewBoxW*100}%`, and map cursor→index from the wrapper's
  getBoundingClientRect ratio. Wire the same setHover to ArrowLeft/Right + onFocus so it's keyboard-navigable, not mouse-only.
- 2026-06-24 — Re-animate every KPI on a control change: lift the period (7/30/90d) into a context ABOVE <Routes>,
  slice the series by it, and key count-up <Counter>s on `useEffect([to])` — one toggle recounts the whole dashboard
  and each number stays honest per window without prop-drilling through pages.
- 2026-06-24 — Draw-in an area chart with an animated clipPath: a `<motion.rect>` inside `<clipPath>` growing
  width 0→viewBoxW wipes fill+line left-to-right with zero path-length math; set its initial width to full when
  reduced-motion so it just appears.
