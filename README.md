# Daily Sites

A self-running studio: one creative website built every day by a Claude Code
**routine**, each a different purpose with a different signature interaction.

## Stack
Vite + React + TypeScript · Tailwind · shadcn/ui (components vendored in
`src/components/ui`) · framer-motion · lucide-react · react-router-dom.

## How it works
- Each day's site is a folder: `src/sites/<slug>/index.tsx`.
- Every site exports a default component **and** a `meta` object (see
  `src/sites/types.ts`).
- `src/sites/registry.ts` auto-discovers sites via `import.meta.glob` — **no manual
  registration**. Drop a folder in and it appears in the gallery with its own route.
- `design-log.md` is the memory: the routine reads it, builds, then appends 3
  lessons so the next run starts smarter.

## Run locally
```bash
npm install
npm run dev      # gallery at /
npm run build    # the routine must pass this before committing
```

## Reusable interaction primitives (`src/components/fx`)
- `Spotlight` — cursor-following radial light on a panel
- `TiltCard` — 3D tilt toward the cursor
- `Magnetic` — element pulled gently toward the cursor on hover
- `Reveal` — fade + rise into view on scroll (stagger with `delay`)

Build new effects per-site; promote any you reuse into `fx/`.

## The routine
The prompt that drives the daily build lives in `ROUTINE_PROMPT.md`. Paste it into
the prompt field when creating the routine at `claude.ai/code/routines`, point the
routine at this repo, schedule it daily, and pick Opus.
