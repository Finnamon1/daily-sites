import type { ComponentType } from "react"

/** Every site folder exports a default component and a `meta` object. */
export interface SiteMeta {
  /** Display title, e.g. "Tideline — Marine charts for NZ" */
  title: string
  /** One-line description shown on the gallery card */
  description: string
  /** ISO date the site was built, e.g. "2026-06-22" */
  date: string
  /** Purpose/category, e.g. "SaaS landing", "Dashboard", "Portfolio" */
  type: string
  /** The featured interaction technique, e.g. "Cursor spotlight + magnetic buttons" */
  interaction: string
  /** Names of the pages this multi-page site ships, e.g. ["Home", "Menu", "About"] */
  /** Names of the pages in the multi-page site, e.g. ["Home", "Pricing", "About"] */
  pages?: string[]
}

export interface SiteModule {
  default: ComponentType
  meta: SiteMeta
}
