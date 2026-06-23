# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — Multi-step flow as the FEATURED interaction: hold one `step` index + a `dir`
  sign, drive AnimatePresence mode="wait" with custom={dir} so panels slide the way you travel,
  and gate the Continue button on a `canAdvance` array indexed by step so it can't skip an
  empty field. Make each step a real <fieldset>/<legend> + buttons (aria-pressed) for keyboard.
- 2026-06-23 — Hover-reveal copy is invisible to touch/keyboard: render it statically on mobile
  (md:hidden) and gate the animated version to `hidden md:block`; then wrap the whole site in
  <MotionConfig reducedMotion="user"> so every Reveal/transition degrades to opacity-only free.
- 2026-06-23 — Scroll-snap as the FEATURED interaction: make only the Home page its own
  h-[100dvh] snap-y snap-mandatory scroller (nav stays position:fixed over it), use
  min-h-[100dvh] panels so tall content still scrolls, gate with motion-reduce:snap-none,
  and put the persistent footer INSIDE the last panel (Layout renders footer only off-Home).
- 2026-06-23 — Staggered grid entrance as the FEATURED interaction: a framer parent variant
  with {staggerChildren} + child variants, set initial="hidden" animate="show" (NOT whileInView),
  and remount the grid with key={filter} so every category switch re-fans the cards in.
- 2026-06-23 — Live "type tester": drive size & weight as inline style props on a display-only
  <p>, and edit the text through a separate small <input> bound to state — never make the giant
  preview itself contentEditable, since each React re-render resets the caret and the content.
- 2026-06-23 — Per-letter weight-on-hover headline: split text into <motion.span> per char with
  whileHover={{ fontWeight }} — only reads on variable/multi-weight LOADED fonts (check the
  index.html @font weights), keep an aria-label on the wrapper, and gate it off under reduced motion.
