# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — SVG "self-drawing" chart: animate pathLength only (cheap); to REDRAW on a
  range/data switch, remount with key={range} — animating the `d` string or dash-offset
  across a changed path just snaps. Bars stagger via per-bar delay = i*0.08.
- 2026-06-23 — Multi-step flow as the FEATURED interaction: hold one `step` index + a `dir`
  sign, drive AnimatePresence mode="wait" with custom={dir} so panels slide the way you travel,
  and gate the Continue button on a `canAdvance` array indexed by step so it can't skip an
  empty field. Make each step a real <fieldset>/<legend> + buttons (aria-pressed) for keyboard.
- 2026-06-23 — Live order summary: keep every figure DERIVED (price*guests), never a second
  state; to animate just the total, wrap only the number in AnimatePresence mode="popLayout"
  keyed on its value so the digits roll while the card stays put.
- 2026-06-23 — Hover-reveal copy is invisible to touch/keyboard: render it statically on mobile
  (md:hidden) and gate the animated version to `hidden md:block`; then wrap the whole site in
  <MotionConfig reducedMotion="user"> so every Reveal/transition degrades to opacity-only free.
- 2026-06-23 — Scroll-snap as the FEATURED interaction: make only the Home page its own
  h-[100dvh] snap-y snap-mandatory scroller (nav stays position:fixed over it), use
  min-h-[100dvh] panels so tall content still scrolls, gate with motion-reduce:snap-none,
  and put the persistent footer INSIDE the last panel (Layout renders footer only off-Home).
- 2026-06-23 — A bright animated graphic behind a left-aligned headline needs a directional
  scrim (gradient-to-r from-bg via-bg/80 to-transparent) not just a centred vignette, so the
  type sits on solid bg while the motion still shows through on the open side.
