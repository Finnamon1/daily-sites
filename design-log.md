# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-25 — SVG radial gradients render coarse; draw structure (arcs/ticks) in SVG but overlay the smooth-gradient
  focal element as an absolutely-positioned DOM node centered on it — CSS gradients stay buttery at any scale.
- 2026-06-25 — Parallax a layered SVG scene off ONE springed pointer motion value: subscribe each depth layer's
  `<motion.g>` via `.on("change")` into its own motion value scaled by a different factor — real depth, one source,
  gated whole on `useReducedMotion`. Far layer moves least.
- 2026-06-25 — Make an SVG hover-map keyboard-reachable: give each hotspot an invisible `<rect tabIndex role="button"
  aria-label>` and wire onFocus/onBlur to the SAME activate/clear handlers as onPointerEnter/Leave — pointer and
  keyboard drive one state, zero extra logic.
- 2026-06-24 — Hover image-reveal: one `window` pointermove → springed x/y on a single fixed preview node; each row only
  flips a shared context `{src,alt,tag}`. One global listener for the whole menu, not one per row.
- 2026-06-24 — Make that reveal degrade or it's desktop-only: anchor the preview to the focused row's
  `getBoundingClientRect()` for keyboard, and render an always-on inline thumb (`md:hidden` on desktop) so touch users get the photo too.
- 2026-07-02 — Liquid-chrome 3D with zero custom GLSL: `MeshPhysicalMaterial` (metalness 1, roughness ~0.15,
  iridescence ~0.9) + PMREM `RoomEnvironment` on an alpha canvas, floated over a DOM CSS radial glow — no lights needed.
- 2026-07-02 — Drive WebGL and DOM parallax from the SAME springed pointer motion values: the canvas reads `.get()`
  inside its rAF loop while DOM layers `useTransform` at their own factors — one source, coherent depth, one reduced-motion gate.
- 2026-07-02 — Treat a hero canvas as a resource AND a layout element: cap DPR at 2, pause rAF on IntersectionObserver
  exit + tab hide, dispose everything on unmount — and reposition/rescale the 3D object per breakpoint inside the resize
  handler, with a mobile ink scrim so white type never sits on bare chrome.
- 2026-07-02 — One profile, two renderers: define product shapes as control-point radius profiles (Catmull-Rom sampled
  once); the same arrays drive the 3D lathe mesh AND the 2D SVG silhouettes elsewhere on the page — cohesion for free.
- 2026-07-02 — Scroll-morphing product stage: sticky h-screen canvas + a `-mt-[100vh]` step track observed with
  rootMargin "-45% 0px -45%"; per step, lerp the lathe ring radii toward the target profile and recompute normals only
  while |Δ|>ε, rendering behind a dirty flag — one persistent object, no scene teardown between steps.
- 2026-07-02 — Never ease with fixed per-frame factors on WebGL state: use `1 - exp(-dt·k)`. On slow devices a 0.09/frame
  color lerp visibly never arrives; the time-based form converges identically at any framerate.
