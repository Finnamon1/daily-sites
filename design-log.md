# Design Log — lessons that compound

The daily routine reads this file before building, applies every lesson, then
appends 3 new ones at the end of each run. Keep it sharp: prune lessons once they
become automatic so this never exceeds ~30 lines.

## Lessons

- 2026-06-23 — A single accent that fails AA as small text (terracotta ≈3:1 on cream) can still
  anchor a palette: reserve the bright tone for icons / large display / dark grounds, swap to a
  darkened sibling for small labels on light grounds, and pass a `tone` prop rather than forking the
  label component (FLARE #ff4d2e ≈2.7:1 on cream → #b8371d ≈5:1; ≈5.5:1 on near-black is fine).
- 2026-06-23 — Don't gate the featured interaction behind hover/scroll on touch: render the desktop
  effect as a stacked/inline variant so every view is reachable without a cursor.
- 2026-06-23 — Solari split-flap: each cell flips through a SHORT tail (start = (target−6) mod
  charset) via a `key={glyph}` motion.span that remounts/`initial`-flips per change — bounds DOM churn
  vs sweeping the whole alphabet; stagger delay by char index for the board-settling cascade; reduced
  motion just sets the final glyph.
- 2026-06-23 — Duotone→colour on hover without swapping src: put `grayscale-[.55]` on the <img> and a
  multiply gradient overlay above it, then `group-hover:grayscale-0` + overlay `group-hover:opacity-0`
  — colour blooms back in one transition.
- 2026-06-23 — Namespace a per-site palette under ONE Tailwind key (`screen-ink`, `screen-amber`…) so
  it can't collide with default scales (plain `amber`) or other sites' tokens — and classes stay
  readable vs long arbitrary `[#…]` hex everywhere.
