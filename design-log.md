# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — A single accent that fails AA as small text (terracotta ≈3:1 on cream) can still
  anchor a palette: reserve the bright tone for icons / large display / dark grounds, swap to a
  darkened sibling for small labels on light grounds, and pass a `tone` prop rather than forking the
  label component (FLARE #ff4d2e ≈2.7:1 on cream → #b8371d ≈5:1; ≈5.5:1 on near-black is fine).
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline variant so every view is reachable without a cursor.
- 2026-06-23 — Scroll-velocity marquee = useScroll→useVelocity→useSpring→useTransform feeding a
  useAnimationFrame that adds to a baseX MotionValue; render 4 identical copies and wrap(-25,-50)
  the % translate for a seamless loop. Gate the frame on useReducedMotion so it sits static.
- 2026-06-23 — Progress-reveal over a many-bar waveform cheaply: render the bars twice — a neutral
  base, then an accent copy inside an `overflow-hidden` wrapper whose width = progress% — so playback
  resizes ONE element, not 120. Set the inner copy's width to the track's measured px so bars align.
- 2026-06-23 — A simulated transport reads as real: useAnimationFrame advances a 0→1 progress at a
  fixed visual sweep (~72s) while the timecode maps progress→real duration — no audio file needed.
  Gate decorative bar shimmer behind a `[data-shimmer]` rule disabled in prefers-reduced-motion.
- 2026-06-23 — For a gap-px hairline grid the GRID CELL must carry the panel bg + padding (put
  `h-full` on the inner block); padding on a transparent Reveal wrapper makes the line colour bleed
  around the content instead of reading as a 1px rule.
