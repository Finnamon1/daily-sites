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
- 2026-06-23 — Draggable inertia carousel as the FEATURED interaction: measure
  scrollWidth−offsetWidth into a `bound`, drive a useMotionValue x with drag="x"
  dragConstraints={{left:-bound,right:0}} + dragMomentum, mirror it with prev/next buttons via
  clamped animate(x,…), and drop momentum under reduced motion — touch gets swipe, keys get buttons.
- 2026-06-23 — Skip CSS-vars-in-Tailwind (`[color:var(--ink)]/60`): the custom-prop key fights TS
  and the /alpha modifier is flaky. Hardcode hex in arbitrary classes (`text-[#1a2016]/70`) like the
  other sites — proven, simpler, zero type churn.
- 2026-06-23 — Never wrap a styled <button> in a <NavLink> (nested interactive = invalid HTML):
  give the CTA component an optional `to` and branch to render a NavLink vs a button, wrapping
  either one in <Magnetic>.
