# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-25 — Hotspots (SVG rects or DOM rows) get `tabIndex role="button" aria-label` with onFocus/onBlur wired to the
  SAME handlers as pointer enter/leave — pointer and keyboard drive one state; anchor any floating preview to the focused
  element's rect and keep an inline fallback for touch.
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
- 2026-07-02 — Scroll-as-travel: build the scene in one true world column (1 unit = N metres) and map scroll→camera via
  piecewise waypoints anchored to section centers (`offsetTop + h/2 − vh/2`) — copy and 3D can never drift apart, and a
  live HUD (depth/pressure/temp) falls out of the same one helper.
- 2026-07-02 — Creatures without shaders or rigs: additive-blended basic materials plus a few indexed sines — dome
  pulse `scale.y=1+sin`, width `1/√pulse` to conserve volume, tentacle points swayed by `sin(t+k·0.55)` scaled by k —
  read as alive from arm's length.
- 2026-07-02 — Particles around a travelling camera: keep one fixed column, wrap each point's y by ±half-range relative
  to `camera.y` per frame, and drift them slowly AGAINST the travel direction — the wrap is invisible and the drift
  sells the motion.
- 2026-07-02 — A state-driven scene beats a scripted one: put the whole atmosphere (sun, sky, fog, particle mode) behind
  one small state object read via ref in the rAF loop, and ease EVERY parameter toward its target — switching weather
  feels analogue, and reduced-motion is just ease=1.
- 2026-07-02 — 24-hour skies are a keyframe table `[(hour, hex)]` lerped, plus one `daylight(h)=sin((h−6)/12·π)` scalar
  reused for sun elevation, light intensity and star/moon opacity — one number keeps the whole scene in the same hour.
- 2026-07-02 — Native `<input type=range>` + `aria-pressed` buttons are the cheapest 3D controls: keyboard-accessible for
  free, and deriving a DOM readout from the same state (`readout(machine)`) turns the toy into the product demo.
