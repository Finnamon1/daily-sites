import { Link, useParams } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import type { Place } from "../data"

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

/**
 * Hover image-reveal: the photo sits muted + grayscale at rest, then warms to
 * full colour and lifts as the caption block slides up on hover/focus.
 */
export function PlaceCard({ place, eager = false }: { place: Place; eager?: boolean }) {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <Link
      to={`${base}/coast`}
      className="group relative block overflow-hidden rounded-sm bg-[#13322d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cf7a2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f3ec]"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={img(place.seed, 640, 800)}
          alt={`${place.name} — ${place.kind}`}
          width={640}
          height={800}
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover grayscale-[60%] brightness-[0.82] transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.04] group-focus-visible:grayscale-0 group-focus-visible:brightness-100"
        />
      </div>

      {/* gradient scrim */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#0c211d] via-[#0c211d]/10 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.22em] text-[#9fd3c4]">
          {place.kind}
        </p>
        <h3 className="mt-1 flex items-center gap-1.5 font-['Fraunces'] text-2xl font-semibold leading-tight text-[#f6f3ec]">
          {place.name}
          <ArrowUpRight className="h-5 w-5 -translate-y-0.5 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
        </h3>
        {/* revealed line */}
        <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-[#dfe7e0] opacity-0 transition-all duration-500 ease-out group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
          {place.blurb}
        </p>
      </div>
    </Link>
  )
}
