import { useReducedMotion } from "framer-motion"

/** A slow, CSS-driven ribbon of the things you'll find along the coast. */
export function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-[#1c2321]/12 py-4">
      <div
        className="flex w-max gap-10 whitespace-nowrap will-change-transform"
        style={reduce ? undefined : { animation: "sm-marquee 38s linear infinite" }}
      >
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-['Fraunces'] text-lg italic text-[#1c2321]/70">
            {item}
            <span aria-hidden className="text-[#2f6b5e]">
              ✳
            </span>
          </span>
        ))}
      </div>
      <style>{`@keyframes sm-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}
