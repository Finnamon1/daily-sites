# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Scroll-velocity marquee = useScroll→useVelocity→useSpring→useTransform feeding a
  useAnimationFrame that adds to a baseX MotionValue; render 4 identical copies and wrap(-25,-50)
  the % translate for a seamless loop. Gate the frame on useReducedMotion so it sits static.
- 2026-06-23 — To un-set an inline style on hover, use the !important class modifier: inline styles
  only lose to !important rules, so `group-hover:!filter-none` cleanly lifts an inline grayscale
  duotone to full colour — no state, no JS.
- 2026-06-23 — Page-level cursor glow: useMotionValue fractions (clientX/innerW) → useSpring with low
  stiffness (~55) for lag → useTransform to "%" strings → useMotionTemplate radial-gradient on a fixed
  z-0 layer; throttle pointermove via rAF and gate on useReducedMotion (static centred pool on touch/RM).
- 2026-06-23 — On all-dark palettes the muted-tan trap bites fast: #6f5f48 on #15110d ≈3:1 (fails body
  AA) while #a99980 ≈6.8:1 passes — reserve the darkest tan for decorative dots / large display only.
- 2026-06-23 — Tailwind `duration-[1200ms]` is ambiguous (transition vs animation, throws a build
  warn); write `[transition-duration:1200ms]` to be explicit and silence it.
