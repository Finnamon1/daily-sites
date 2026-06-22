import type { SiteModule } from "./types"

/**
 * Auto-discovers every site under src/sites/<slug>/index.tsx.
 * Drop a new folder in and it appears in the gallery + gets its own route.
 * No manual registration needed.
 */
const modules = import.meta.glob<SiteModule>("./*/index.tsx", { eager: true })

export interface SiteEntry {
  slug: string
  meta: SiteModule["meta"]
  Component: SiteModule["default"]
}

export const sites: SiteEntry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.replace("./", "").replace("/index.tsx", "")
    return { slug, meta: mod.meta, Component: mod.default }
  })
  // newest first
  .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1))
