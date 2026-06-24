import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

/** A crafted phone shell. Children render the live "screen". */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-full overflow-hidden rounded-[2.6rem] border-[6px] border-[#1c2b23] bg-[#1c2b23]",
        "shadow-[0_30px_70px_-30px_rgba(28,43,35,0.55)]",
        className,
      )}
    >
      {/* notch */}
      <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1c2b23]" />
      {/* screen */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.1rem]">{children}</div>
    </div>
  )
}
