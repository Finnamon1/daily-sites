# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — On near-black/dark grounds reserve the light or bright accent for large display,
  icons and mono metadata; body/muted text stays a warm grey — a light-on-dark accent clears AA
  easily but reads as shouting when it carries paragraphs.
- 2026-06-23 — A single accent that fails AA as small text can still anchor a palette: reserve the
  bright tone for icons / large display / dark grounds, swap to a darkened sibling for small labels.
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline/centred variant so every view is reachable without a cursor.
- 2026-06-23 — To un-set an inline style on hover use the !important modifier (`group-hover:!grayscale-0`):
  inline styles only lose to !important, lifting a duotone to full colour with no state/JS.
- 2026-06-23 — Route hero/nav CTAs with `<Link to>`, not `href="#anchor"`: same-page anchors
  silently no-op from other pages in a splat route.
- 2026-06-23 — Tailwind `duration-[1200ms]` is ambiguous (transition vs animation, throws a build
  warn); write `[transition-duration:1200ms]` to be explicit.
- 2026-06-23 — Split-flap (Solari) cell = an alphabet index that steps one glyph per ~34ms interval
  toward its target (clear the interval when reached) + a motion.span keyed on the index flipping
  rotateX −90→0; a key change re-mounts and re-animates, so no AnimatePresence is needed.
- 2026-06-23 — A component that hard-codes a leading dash/dot can't be recoloured for dark grounds by
  passing a className text colour (the dash bg is fixed) nor by passing an extra span child (you get
  two) — add a `light`/`tone` prop that flips dash and text together.
- 2026-06-23 — "Live board" ambience with no per-item state: hold one list and render a windowed slice
  `(offset+i)%len`, bumping offset on an interval — every visible target changes at once so one timer
  drives N flip animations. Gate the timer on useReducedMotion for a static board.
