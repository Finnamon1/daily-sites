# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-22 — Write functional/disclaimer copy in the product's own voice ("a
  planning aid, not an official product"), not legal boilerplate.
- 2026-06-22 — picsum returns random photos; a single shared overlay (warm
  multiply) on every frame unifies mismatched stock into one cohesive look.
- 2026-06-22 — Load fonts via index.html <link> and apply with Tailwind arbitrary
  families (font-['Fraunces']) per-element, so type stays scoped to the site.
- 2026-06-23 — "Morphing blobs" read best as blurred divs animating borderRadius
  keyframes, not SVG path morphing — cheap and never breaks interpolation.
- 2026-06-23 — Animated counters with a prefix/suffix read wrong mid-count; count
  a clean integer and put framing words in the static label beneath.
- 2026-06-23 — For scroll parallax, clip a frame (overflow-hidden) and scale the
  inner img ~1.25 BEFORE translating ±12% on scrollYProgress, so drifting never
  exposes empty edges; hold it still under useReducedMotion.
- 2026-06-23 — Register a site's palette as namespaced Tailwind tokens (clay/paper/
  ink) instead of raw bg-[#hex]; opacity modifiers (text-ink/65) then make tuning
  AA contrast trivial across dozens of labels.
- 2026-06-23 — On a light paper bg, text-ink/55 still fails AA at ≤14px; neutral
  body/meta needs /65+ (~4.6:1). Reserve /45–/55 for ≥18px or pure decoration.
