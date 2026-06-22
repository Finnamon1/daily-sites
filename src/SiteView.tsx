import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { sites } from "./sites/registry"

export default function SiteView() {
  const { slug } = useParams()
  const site = sites.find((s) => s.slug === slug)

  if (!site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 text-zinc-600">
        <p>That site doesn't exist.</p>
        <Link to="/" className="text-sm underline">Back to gallery</Link>
      </div>
    )
  }

  const { Component } = site
  return (
    <div className="relative">
      <Link
        to="/"
        className="fixed left-4 top-4 z-[100] inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Gallery
      </Link>
      <Component />
    </div>
  )
}
