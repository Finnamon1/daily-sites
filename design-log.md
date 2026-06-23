# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Horizontal scroll-pin: a tall outer wrapper whose height = trackWidth−viewport+vh,
  a sticky h-screen inner, and x = useTransform(scrollYProgress,[0,1],[0,-distance]). Measure the
  REAL track ref in useEffect + on resize + a 300ms settle timeout; bail to a native overflow-x snap
  strip under reduced motion so it never scroll-jacks touch/keyboard.
- 2026-06-23 — Call useMotionValueEvent only with a real MotionValue: split the optional-progress
  branch into its own child component instead of shimming a fake MV — hooks stay unconditional.
- 2026-06-23 — Scroll-scrubbed device: drive the active screen off each step's onViewportEnter with a
  "-45% 0px -45% 0px" viewport band (not scrollYProgress→index, which fights at boundaries), so the
  phone always shows the screen for the step centered in view; keep the phone sticky top-[18vh] inside
  a tall steps column so it travels the whole section.
- 2026-06-23 — A single accent that fails AA as small text (terracotta ≈3:1 on cream, ≈4.35:1 as a
  button bg) can still anchor a palette: reserve the bright tone for icons / large display / dark
  grounds, swap to a darkened sibling (#a8431d ≈5.3:1) for small labels, and on dark cards use a
  cream-fill button rather than the accent.
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  sticky-scrub as a md:hidden stacked list where each step carries its own inline phone screen, so
  every app view is reachable without a cursor.
