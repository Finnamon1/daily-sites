# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Hover-reveal copy is invisible to touch/keyboard: render it statically on mobile
  and gate the animated version to md+; wrap the whole site in <MotionConfig reducedMotion="user">
  so every Reveal/transition degrades to opacity-only for free.
- 2026-06-23 — Staggered grid entrance: a framer parent variant with {staggerChildren} + child
  variants, initial="hidden" animate="show", and remount the grid with key={filter} so every
  category switch re-fans the cards in.
- 2026-06-23 — Never wrap a styled <button> in a <NavLink> (nested interactive = invalid HTML):
  give the CTA component an optional `to` and branch to render a NavLink vs a button, wrapping
  either one in <Magnetic>.
- 2026-06-23 — Horizontal scroll-pin: a tall outer wrapper whose height = trackWidth−viewport+vh,
  a sticky h-screen inner, and x = useTransform(scrollYProgress,[0,1],[0,-distance]). Measure the
  REAL track ref (not a placeholder span) in useEffect + on resize + a 300ms settle timeout; bail to
  a native overflow-x snap strip under reduced motion so it never scroll-jacks touch/keyboard.
- 2026-06-23 — Call useMotionValueEvent only with a real MotionValue: split the optional-progress
  branch into its own child component instead of shimming a fake MV — hooks stay unconditional, types
  stay honest.
- 2026-06-23 — On a near-black ground, warm off-white text needs ≥/55 for small (sub-12px) copy to
  clear WCAG AA (~5:1); /35–/45 only passes large text. Cohere random picsum frames into one body of
  work with a shared treatment: grayscale(.55)+contrast on the img, a soft-light accent wash over it.
