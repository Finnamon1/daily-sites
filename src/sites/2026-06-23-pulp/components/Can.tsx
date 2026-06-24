import type { Flavor } from "../data"

/** A crafted SVG soda can rendered from the flavour's own gradient — no stock photography. */
export function Can({ flavor, className }: { flavor: Flavor; className?: string }) {
  const id = `can-${flavor.slug}`
  return (
    <svg viewBox="0 0 120 220" className={className} role="img" aria-label={`${flavor.name} ${flavor.pair} can`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={flavor.from} />
          <stop offset="100%" stopColor={flavor.to} />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      {/* lid */}
      <ellipse cx="60" cy="20" rx="40" ry="9" fill={flavor.to} opacity="0.85" />
      <ellipse cx="60" cy="17" rx="40" ry="9" fill="#d8d2c4" />
      <ellipse cx="60" cy="17" rx="31" ry="6" fill="#bfb9aa" />
      {/* body */}
      <rect x="20" y="17" width="80" height="186" rx="10" fill={`url(#${id})`} />
      <rect x="20" y="17" width="80" height="186" rx="10" fill={`url(#${id}-sheen)`} />
      {/* base shadow */}
      <ellipse cx="60" cy="203" rx="40" ry="8" fill="#000000" opacity="0.18" />
      {/* label */}
      <text
        x="60"
        y="92"
        textAnchor="middle"
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="15"
        letterSpacing="2"
        fill={flavor.ink}
      >
        PULP
      </text>
      <line x1="34" y1="104" x2="86" y2="104" stroke={flavor.ink} strokeWidth="1" opacity="0.5" />
      <text
        x="60"
        y="132"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="600"
        fontSize="13"
        fill={flavor.ink}
      >
        {flavor.name}
      </text>
      <text
        x="60"
        y="150"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="7.5"
        letterSpacing="1.5"
        fill={flavor.ink}
        opacity="0.78"
      >
        {flavor.pair.toUpperCase()}
      </text>
      <text
        x="60"
        y="182"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="6.5"
        letterSpacing="1"
        fill={flavor.ink}
        opacity="0.6"
      >
        {flavor.abv} ABV · {flavor.cal} CAL
      </text>
    </svg>
  )
}
