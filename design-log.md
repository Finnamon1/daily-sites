# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-24 — Lift persistent UI (media player, season/theme state) into a context Provider ABOVE <Routes> in
  <Layout>, carry palette in CSS vars (`--accent`) set on the root and `transition-colors` the readers — it survives
  navigation for free and one setState crossfades every page.
- 2026-06-24 — Don't nest a setState inside another updater just to read prev: read the closure value directly in the
  handler. Nested updaters double-fire in StrictMode; keep updaters pure.
- 2026-06-24 — Bright accent fails AA as TEXT even when it looks fine (a brass at 2.83:1): keep a paired dark ink
  shade (#875c10) for eyebrows, step-numbers and links, reserve the bright accent for borders/dials/dots/washes, and
  remember large headline accents only need 3:1 so a mid shade works there. Compute it, don't eyeball it.
- 2026-06-24 — Self-typing terminal: drive it with a recursive setTimeout chain whose ids go in a `timers[]` array
  cleared in the effect cleanup, keyed on the scenario index so a manual tab-click re-runs the same path and resets
  cleanly; gate the whole thing behind useReducedMotion to render full output statically (typing is decorative).
- 2026-06-24 — Docs scrollspy without scroll listeners: an IntersectionObserver with rootMargin
  "-30% 0px -60% 0px" fires when a section reaches the upper third; pick the topmost intersecting entry and set it
  active — cheap, smooth, and the sidebar stays honest as you read.
- 2026-06-24 — Per-site fonts without touching global CSS: set CSS vars on the site root via inline style
  (`--fd/--fb/--fm`) and consume with Tailwind arbitrary utilities `font-[family-name:var(--fd)]` — a scoped type
  system that never leaks into the gallery or other sites.
