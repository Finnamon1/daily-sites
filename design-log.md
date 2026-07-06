# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-25 — Hotspots (SVG rects or DOM rows) get `tabIndex role="button" aria-label` with onFocus/onBlur wired to the
  SAME handlers as pointer enter/leave — pointer and keyboard drive one state; anchor any floating preview to the focused
  element's rect and keep an inline fallback for touch.
- 2026-07-02 — Treat a hero canvas as a resource AND a layout element: cap DPR at 2, pause rAF on IntersectionObserver
  exit + tab hide, dispose everything on unmount — and reposition/rescale the 3D object per breakpoint inside the resize
  handler, with a mobile ink scrim so white type never sits on bare chrome.
- 2026-07-02 — One data source, two renderers: sampled control-point profiles drove both a 3D lathe mesh (morphed by
  lerping ring radii on a sticky stage, normals recomputed only while |Δ|>ε) and the 2D SVG silhouettes further down —
  shape data shared across renderers is cohesion for free.
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
- 2026-07-02 — InstancedMesh toys: thousands of touchable objects in one draw call — keep per-instance state in plain
  Float32Arrays, recompose matrices only for an active Set of animating instances, and bucket positions in a spatial
  hash so a cursor brush is O(nearby), never O(N).
- 2026-07-02 — Encode the gesture, not just the position: the SIGN of pointer dx picked the stripe tone, turning a drag
  into real alternating mower stripes — direction/velocity are free flavour every brush interaction should use.
- 2026-07-02 — Give every canvas toy a "do it for me" button: a scripted actor (serpentine auto-mower) is the keyboard
  and reduced-motion path AND the self-running demo; expose it as a tiny imperative API on a ref so the rAF loop never
  touches React state.
- 2026-07-02 — 3D display type without fonts: glyphs as fat polyline strokes → CatmullRom → `TubeGeometry` + sphere
  end-caps, plus a second tube at radius+Δ in black `BackSide` for the inverted-hull outline — instant bubble letters.
- 2026-07-02 — `CanvasTexture` is an art department: draw the surface (bricks, stains, faded tags) into one 2D canvas,
  and paint at runtime into a second transparent one (`texture.needsUpdate`) — spray, drips and buff patches, no shaders.
- 2026-07-02 — Brush tools must interpolate: pointer events arrive sparsely, so lay dots along the whole segment since
  the last event with a staleness cutoff so new strokes don't join old ones — and put `pointer-events-none` on every
  hero overlay container (plus `select-none` on the section) or the canvas never hears the drag.
