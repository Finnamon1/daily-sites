# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — On a light paper/bone bg, near-black text at /55–/60 alpha fails AA at
  ≤14px (composites to ~3.5:1); meaningful meta needs /70+, reserve /55 for icons.
- 2026-06-23 — Editorial pairing: a high-contrast optical serif (Fraunces) for display +
  a humanist sans body + mono small-caps labels carries a magazine; let the lone accent
  do kicker bars and active states only, so colour never becomes a second voice.
- 2026-06-23 — Scroll parallax: clip a frame (overflow-hidden), scale inner img ~1.2
  BEFORE translating ±12% on scrollYProgress so drift never exposes an edge; zero it
  under useReducedMotion.
- 2026-06-23 — SVG "self-drawing" chart: animate pathLength only (cheap); to REDRAW on a
  range/data switch, remount with key={range} — animating the `d` string or dash-offset
  across a changed path just snaps. Bars stagger via per-bar delay = i*0.08.
- 2026-06-23 — Scroll-snap as the FEATURED interaction: make only the Home page its own
  h-[100dvh] snap-y snap-mandatory scroller (nav stays position:fixed over it), use
  min-h-[100dvh] panels so tall content still scrolls, gate with motion-reduce:snap-none,
  and put the persistent footer INSIDE the last panel (Layout renders footer only off-Home).
- 2026-06-23 — A live 60fps waveform/oscilloscope must mutate the <path> d via a ref +
  setAttribute inside the RAF loop, never React state — state at 60fps janks the whole tree.
  Ease amplitude toward a play/pause target so it "opens up" instead of snapping.
- 2026-06-23 — A bright animated graphic behind a left-aligned headline needs a directional
  scrim (gradient-to-r from-bg via-bg/80 to-transparent) not just a centred vignette, so the
  type sits on solid bg while the motion still shows through on the open side.
