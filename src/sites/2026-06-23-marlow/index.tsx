import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ArrowUpRight, Aperture, MoveRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"
import {
  photos,
  series,
  seriesList,
  exhibitions,
  services,
  type Photo,
} from "./data"

/* ------------------------------------------------------------------ *
 * Palette (dark gallery wall) + type. Hardcoded hex per design-log.
 *   ground  #0e0d0b   raised #16140f   line rgba warm white
 *   ink     #ece5d6   muted  #ece5d6/55
 *   safe    #d9603a   (darkroom safelight — the single accent)
 * ------------------------------------------------------------------ */

const display = "font-['Bricolage_Grotesque'] tracking-[-0.02em]"
const serif = "font-['Spectral']"
const mono = "font-['JetBrains_Mono'] uppercase tracking-[0.22em]"

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

/** Shared photographic treatment so picsum's mismatched frames read as one
 *  body of work: desaturated, slightly warm, gently contrasted on dark. */
function Plate({
  seed,
  alt,
  w,
  h,
  className,
  imgClassName,
}: {
  seed: string
  alt: string
  w: number
  h: number
  className?: string
  imgClassName?: string
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#1a1812]", className)}>
      <img
        src={img(seed, w, h)}
        alt={alt}
        loading="lazy"
        width={w}
        height={h}
        className={cn(
          "h-full w-full object-cover [filter:grayscale(0.55)_contrast(1.05)_brightness(0.92)]",
          imgClassName,
        )}
      />
      {/* warm safelight wash unifies the frames */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(160deg, rgba(217,96,58,0.18), rgba(14,13,11,0.0) 45%, rgba(14,13,11,0.45))",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#ece5d6]/10" />
    </div>
  )
}

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn(mono, "text-[10.5px] text-[#d9603a]", className)}>{children}</span>
  )
}

/* ------------------------------------------------------------------ *
 * Buttons — render a NavLink or button, never nested (design-log)
 * ------------------------------------------------------------------ */

function Cta({
  to,
  children,
  variant = "solid",
  onClick,
}: {
  to?: string
  children: ReactNode
  variant?: "solid" | "ghost"
  onClick?: () => void
}) {
  const cls = cn(
    serif,
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] transition-colors duration-200",
    variant === "solid"
      ? "bg-[#ece5d6] text-[#0e0d0b] hover:bg-[#d9603a] hover:text-[#0e0d0b]"
      : "border border-[#ece5d6]/25 text-[#ece5d6]/85 hover:border-[#d9603a] hover:text-[#ece5d6]",
  )
  const inner = (
    <>
      {children}
      <MoveRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </>
  )
  return (
    <Magnetic>
      {to ? (
        <NavLink to={to} className={cls}>
          {inner}
        </NavLink>
      ) : (
        <button type="button" onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </Magnetic>
  )
}

/* ------------------------------------------------------------------ *
 * Layout — persistent nav + footer
 * ------------------------------------------------------------------ */

function Mark({ base }: { base: string }) {
  return (
    <NavLink to={base} end aria-label="Reyes Marlow, home" className="group inline-flex items-center gap-2.5">
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <Aperture
          className="h-7 w-7 text-[#d9603a] transition-transform duration-500 group-hover:rotate-[60deg]"
          strokeWidth={1.25}
        />
      </span>
      <span className="leading-none">
        <span className={cn(display, "block text-[16px] font-semibold text-[#ece5d6]")}>
          REYES MARLOW
        </span>
        <span className={cn(mono, "block text-[8.5px] text-[#ece5d6]/55")}>Large format · the West</span>
      </span>
    </NavLink>
  )
}

const NAV: [string, string][] = [
  ["Work", "work"],
  ["Series", "series"],
  ["Studio", "studio"],
  ["Contact", "contact"],
]

function Nav({ base }: { base: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ece5d6]/10 bg-[#0e0d0b]/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Mark base={base} />
        <nav className="flex items-center gap-0.5 sm:gap-1.5">
          {NAV.map(([label, path]) => (
            <NavLink
              key={path}
              to={`${base}/${path}`}
              className={({ isActive }) =>
                cn(
                  serif,
                  "relative rounded-full px-2.5 py-2 text-[14px] text-[#ece5d6]/65 transition-colors duration-200 hover:text-[#ece5d6] sm:px-3.5 sm:text-[15px]",
                  isActive && "text-[#ece5d6]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="marlow-nav"
                      className="absolute inset-x-3 -bottom-[1px] h-px bg-[#d9603a]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Footer({ base }: { base: string }) {
  return (
    <footer className="border-t border-[#ece5d6]/10 bg-[#0b0a08]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Mark base={base} />
            <p className={cn(serif, "mt-5 max-w-xs text-[15px] leading-relaxed text-[#ece5d6]/55")}>
              Photographs made slowly, on sheet film, across the Great Basin and the
              high deserts of the American West. Prints, commissions and field
              workshops from the working archive.
            </p>
          </div>
          <FootCol title="Index">
            <FootLink to={base} end>Home</FootLink>
            <FootLink to={`${base}/work`}>Work</FootLink>
            <FootLink to={`${base}/series`}>Series</FootLink>
            <FootLink to={`${base}/studio`}>Studio</FootLink>
            <FootLink to={`${base}/contact`}>Contact</FootLink>
          </FootCol>
          <FootCol title="Studio">
            <span>By appointment</span>
            <span>Salt Lake City, Utah</span>
            <span className="hover:text-[#d9603a]">studio@reyesmarlow.com</span>
            <span>+1 801 555 0148</span>
          </FootCol>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-[#ece5d6]/10 pt-6 text-[12px] text-[#ece5d6]/55 md:flex-row md:items-center md:justify-between">
          <span className={serif}>© 2026 Reyes Marlow. A fictional studio built as a design study.</span>
          <span className={cn(mono, "text-[9.5px]")}>40.76° N · 111.89° W</span>
        </div>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      <div className={cn(serif, "flex flex-col gap-2 text-[14px] text-[#ece5d6]/60")}>{children}</div>
    </div>
  )
}

function FootLink({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink to={to} end={end} className="w-fit transition-colors duration-200 hover:text-[#d9603a]">
      {children}
    </NavLink>
  )
}

/* ------------------------------------------------------------------ *
 * FEATURED INTERACTION — horizontal scroll-pinned filmstrip.
 * Vertical scroll through a tall section pans a sticky horizontal track
 * of plates sideways, like pulling a contact sheet past a loupe.
 * Reduced motion / no-measure → an ordinary swipeable strip.
 * ------------------------------------------------------------------ */

function Filmstrip({ items }: { items: Photo[] }) {
  const reduce = useReducedMotion()

  // Reduced motion → an ordinary swipeable contact strip, no scroll-jacking.
  if (reduce) {
    return (
      <div className="relative">
        <FilmstripRail />
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((p, i) => (
            <div key={p.id} className="snap-start shrink-0">
              <FilmFrame photo={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return <PinnedFilmstrip items={items} />
}

function PinnedFilmstrip({ items }: { items: Photo[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  // how far the track must travel sideways = its full width minus the viewport
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener("resize", measure)
    // re-measure once webfonts/images settle the layout
    const t = window.setTimeout(measure, 300)
    return () => {
      window.removeEventListener("resize", measure)
      window.clearTimeout(t)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const wrapHeight =
    distance + (typeof window !== "undefined" ? window.innerHeight : 800)

  return (
    <div
      ref={wrapRef}
      style={{ height: `${Math.round(wrapHeight)}px` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <FilmstripRail progress={scrollYProgress} />
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center gap-5 px-5 will-change-transform sm:px-8"
        >
          {items.map((p, i) => (
            <FilmFrame key={p.id} photo={p} index={i} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/** Sprocket-hole rail + a moving frame counter that tracks the pan. */
function FilmstripRail({ progress }: { progress?: MotionValue<number> }) {
  return (
    <div className="mb-6 flex items-center justify-between px-5 sm:px-8">
      <Eyebrow>Contact sheet · pull to advance</Eyebrow>
      {progress ? (
        <PanCounter progress={progress} />
      ) : (
        <span className={cn(mono, "text-[10px] text-[#ece5d6]/55")}>swipe →</span>
      )}
    </div>
  )
}

function PanCounter({ progress }: { progress: MotionValue<number> }) {
  const [pct, setPct] = useState(0)
  useMotionValueEvent(progress, "change", (v) => setPct(v))
  return (
    <span className={cn(mono, "text-[10px] text-[#ece5d6]/55")}>
      {String(Math.round(pct * 100)).padStart(2, "0")} / 100
    </span>
  )
}

function FilmFrame({ photo, index }: { photo: Photo; index: number }) {
  return (
    <figure className="group relative w-[78vw] shrink-0 sm:w-[440px]">
      <span className={cn(mono, "absolute -top-5 left-0 text-[9px] text-[#ece5d6]/55")}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <Plate
        seed={photo.seed}
        alt={`${photo.title} — ${photo.place}`}
        w={900}
        h={1100}
        className="aspect-[4/5] rounded-[2px]"
        imgClassName="transition-transform [transition-duration:1200ms] ease-out group-hover:scale-[1.04]"
      />
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className={cn(serif, "text-[16px] italic text-[#ece5d6]")}>{photo.title}</span>
        <span className={cn(mono, "shrink-0 text-[9px] text-[#d9603a]")}>{photo.year}</span>
      </figcaption>
      <span className={cn(mono, "mt-1 block text-[9px] text-[#ece5d6]/55")}>{photo.place}</span>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * Work grid — staggered masonry-ish, hover reveals technical metadata
 * ------------------------------------------------------------------ */

function WorkGrid({ items }: { items: Photo[] }) {
  return (
    <motion.div
      key={items.map((i) => i.id).join("")}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((p, i) => (
        <motion.div
          key={p.id}
          variants={{
            hidden: { opacity: 0, y: 26 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
          }}
          className={cn(i % 5 === 0 && "sm:row-span-2")}
        >
          <PhotoCard photo={p} tall={i % 5 === 0} />
        </motion.div>
      ))}
    </motion.div>
  )
}

function PhotoCard({ photo, tall }: { photo: Photo; tall?: boolean }) {
  return (
    <figure className="group">
      <Plate
        seed={photo.seed}
        alt={`${photo.title} — ${photo.place}, ${photo.year}`}
        w={tall ? 900 : 880}
        h={tall ? 1300 : 700}
        className={cn("rounded-[2px]", tall ? "aspect-[3/4]" : "aspect-[5/4]")}
        imgClassName="transition-transform [transition-duration:1100ms] ease-out group-hover:scale-[1.05]"
      />
      {/* metadata slides up on hover; statically visible to keyboard focus */}
      <div className="relative mt-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className={cn(serif, "text-[18px] italic text-[#ece5d6]")}>{photo.title}</h3>
          <span className={cn(mono, "shrink-0 text-[9px] text-[#d9603a]")}>{photo.series}</span>
        </div>
        <p className={cn(mono, "mt-1.5 text-[9px] text-[#ece5d6]/50")}>{photo.place} · {photo.year}</p>
        <p
          className={cn(
            mono,
            "mt-1 text-[9px] text-[#ece5d6]/55 transition-all duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100",
          )}
        >
          {photo.spec}
        </p>
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

function Home({ base }: { base: string }) {
  return (
    <div>
      {/* Hero — asymmetric, type-led, single plate to the right */}
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-5 pb-16 pt-14 sm:px-8 md:grid-cols-[1.15fr_0.85fr] md:pt-20">
        <div>
          <Reveal>
            <Eyebrow>Photographs · 2019—2026</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className={cn(display, "mt-6 text-[clamp(2.7rem,8vw,6rem)] font-semibold leading-[0.92] text-[#ece5d6]")}>
              The West,<br />
              held still<br />
              <span className="text-[#d9603a]">on film.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={cn(serif, "mt-7 max-w-md text-[17px] leading-[1.7] text-[#ece5d6]/65")}>
              I'm Reyes Marlow. I make large-format photographs of salt flats, the
              two-lane and the long desert night — one sheet at a time, at the speed
              the place asks for. No bracketing, no second frame.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Cta to={`${base}/work`}>See the work</Cta>
              <NavLink
                to={`${base}/studio`}
                className={cn(serif, "inline-flex items-center gap-1.5 px-2 py-3 text-[15px] text-[#ece5d6]/65 transition-colors duration-200 hover:text-[#ece5d6]")}
              >
                About the studio <ArrowUpRight className="h-4 w-4" />
              </NavLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative">
          <Plate
            seed={photos[0].seed}
            alt={`${photos[0].title} — ${photos[0].place}`}
            w={900}
            h={1150}
            className="aspect-[4/5] rounded-[2px]"
          />
          <div className="absolute -bottom-5 -left-4 hidden border border-[#ece5d6]/15 bg-[#0e0d0b] px-4 py-3 sm:block">
            <Eyebrow>Plate 01</Eyebrow>
            <p className={cn(serif, "mt-1 text-[16px] italic text-[#ece5d6]")}>{photos[0].title}</p>
            <p className={cn(mono, "text-[9px] text-[#ece5d6]/55")}>{photos[0].spec}</p>
          </div>
        </Reveal>
      </section>

      {/* The featured interaction — full-bleed pinned filmstrip */}
      <section className="border-y border-[#ece5d6]/10 bg-[#0b0a08] py-12">
        <Filmstrip items={photos.slice(0, 8)} />
      </section>

      {/* Numbers — set in the photographer's vernacular */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid grid-cols-2 gap-y-10 border-y border-[#ece5d6]/10 py-12 md:grid-cols-4">
          {[
            ["8×10", "primary format"],
            ["1 of 1", "exposures per frame"],
            ["41", "states, so far"],
            ["2,300+", "sheets, archived"],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.06} className="px-2">
              <div className={cn(display, "text-[clamp(2rem,4vw,2.8rem)] font-semibold leading-none text-[#ece5d6]")}>{n}</div>
              <div className={cn(mono, "mt-3 text-[9px] text-[#ece5d6]/50")}>{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Selected — large editorial two-up */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <Eyebrow>Selected</Eyebrow>
            <h2 className={cn(display, "mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[#ece5d6]")}>
              Recent frames
            </h2>
          </div>
          <NavLink
            to={`${base}/work`}
            className={cn(serif, "hidden items-center gap-1.5 text-[15px] text-[#ece5d6]/65 transition-colors hover:text-[#d9603a] sm:inline-flex")}
          >
            All work <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[photos[2], photos[7], photos[9], photos[5]].map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.08}>
              <PhotoCard photo={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote band */}
      <section className="border-t border-[#ece5d6]/10 bg-[#0b0a08]">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <p className={cn(serif, "text-[clamp(1.5rem,3.4vw,2.4rem)] italic leading-[1.4] text-[#ece5d6]")}>
              “A view camera doesn't let you hurry. You set up, you wait for the
              cloud, and the desert decides when the picture is ready.”
            </p>
            <p className={cn(mono, "mt-7 text-[10px] text-[#d9603a]")}>Reyes Marlow · field note, 2024</p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function Work() {
  const [active, setActive] = useState<string>("All")
  const filtered = active === "All" ? photos : photos.filter((p) => p.series === active)
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <PageHead
        kicker="The archive"
        title="Work"
        lede="Twelve plates from the working archive, across four ongoing bodies of work. Hover any frame for its film and lens notes."
      />
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {seriesList.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(s)}
            className={cn(
              mono,
              "rounded-full border px-3.5 py-2 text-[9px] transition-colors duration-200",
              active === s
                ? "border-[#d9603a] bg-[#d9603a] text-[#0e0d0b]"
                : "border-[#ece5d6]/15 text-[#ece5d6]/55 hover:border-[#ece5d6]/40 hover:text-[#ece5d6]",
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <WorkGrid items={filtered} />
    </div>
  )
}

function SeriesIndex({ base }: { base: string }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <PageHead
        kicker="Bodies of work"
        title="Series"
        lede="Each series is a long argument with one place. They overlap, they take years, and none of them are finished."
      />
      <div className="flex flex-col">
        {series.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.05}>
            <article className="group grid items-center gap-7 border-t border-[#ece5d6]/12 py-9 md:grid-cols-[0.42fr_0.58fr]">
              <div className="grid grid-cols-2 gap-3">
                {s.seeds.slice(0, 2).map((seed, j) => (
                  <Plate
                    key={seed}
                    seed={seed}
                    alt={`${s.name} — plate ${j + 1}`}
                    w={560}
                    h={700}
                    className={cn("aspect-[4/5] rounded-[2px]", j === 1 && "mt-6")}
                    imgClassName="transition-transform [transition-duration:1100ms] ease-out group-hover:scale-[1.05]"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <span className={cn(mono, "text-[9px] text-[#d9603a]")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px flex-1 bg-[#ece5d6]/12" />
                  <span className={cn(mono, "text-[9px] text-[#ece5d6]/55")}>{s.years}</span>
                </div>
                <h3 className={cn(display, "mt-4 text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold text-[#ece5d6]")}>
                  {s.name}
                </h3>
                <p className={cn(serif, "mt-2 text-[18px] italic text-[#ece5d6]/70")}>{s.dek}</p>
                <p className={cn(serif, "mt-4 max-w-xl text-[15px] leading-[1.7] text-[#ece5d6]/55")}>{s.body[0]}</p>
                <div className="mt-6 flex items-center gap-5">
                  <span className={cn(mono, "text-[9px] text-[#ece5d6]/55")}>{s.frames} frames</span>
                  <NavLink
                    to={`${base}/work`}
                    className={cn(serif, "inline-flex items-center gap-1.5 text-[15px] text-[#ece5d6] transition-colors hover:text-[#d9603a]")}
                  >
                    View plates <ArrowUpRight className="h-4 w-4" />
                  </NavLink>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Lead essay pulled from the first series */}
      <Reveal>
        <div className="mt-16 border-t border-[#ece5d6]/12 pt-10 md:grid md:grid-cols-[0.3fr_0.7fr] md:gap-10">
          <Eyebrow className="block">On Saltworks</Eyebrow>
          <div className={cn(serif, "mt-4 space-y-5 text-[16px] leading-[1.75] text-[#ece5d6]/65 md:mt-0")}>
            {series[0].body.map((para) => (
              <p key={para.slice(0, 18)}>{para}</p>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

function Studio({ base }: { base: string }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <PageHead
        kicker="The studio"
        title="On working slowly"
        lede="A short note on why everything here is made on sheet film, by hand, at the speed of the place."
      />

      <div className="grid items-start gap-12 md:grid-cols-[0.55fr_0.45fr]">
        <Reveal>
          <div className={cn(serif, "space-y-5 text-[17px] leading-[1.8] text-[#ece5d6]/70")}>
            <p>
              I came to the view camera late and backward — through a darkroom job I
              took to pay rent, not through art school. What hooked me wasn't the
              resolution everyone talks about. It was the pace. A 4×5 forces a kind of
              attention that a phone actively prevents.
            </p>
            <p>
              For the last seven years I've worked almost entirely in the Great Basin
              and the deserts that ring it. I drive an old truck, I sleep near the
              picture, and I usually make fewer than two hundred exposures a year. Each
              sheet is developed by hand, scanned at full resolution, and printed in
              small signed editions.
            </p>
            <p>
              If you've found your way here from an editorial commission, a print
              enquiry or a workshop application — thank you for reading this far.
              That patience is, more or less, the whole job.
            </p>
          </div>
          <div className="mt-8">
            <Cta to={`${base}/contact`}>Work with the studio</Cta>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Plate
            seed="marlow-portrait-truck"
            alt="Reyes Marlow with a field camera beside an old truck at dusk"
            w={760}
            h={950}
            className="aspect-[4/5] rounded-[2px]"
          />
          <div className="mt-6 border border-[#ece5d6]/12 p-5">
            <Eyebrow>The kit</Eyebrow>
            <ul className={cn(mono, "mt-4 space-y-2.5 text-[10px] text-[#ece5d6]/60")}>
              {[
                "Chamonix 8×10 field",
                "Linhof Technika 4×5",
                "Nikkor-W 210 / 300mm",
                "Portra · Ektar · Tri-X · Acros II",
                "Jobo CPP-3 · drum-developed",
              ].map((k) => (
                <li key={k} className="flex items-center gap-2.5">
                  <Plus className="h-3 w-3 text-[#d9603a]" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Exhibitions timeline */}
      <section className="mt-20 border-t border-[#ece5d6]/12 pt-10">
        <Eyebrow>Selected exhibitions & press</Eyebrow>
        <div className="mt-7">
          {exhibitions.map((e, i) => (
            <Reveal key={e.title} delay={(i % 4) * 0.04}>
              <div className="group grid grid-cols-[auto_1fr] items-baseline gap-5 border-b border-[#ece5d6]/10 py-5 sm:grid-cols-[80px_1fr_auto]">
                <span className={cn(mono, "text-[11px] text-[#d9603a]")}>{e.year}</span>
                <span className={cn(serif, "text-[17px] text-[#ece5d6] transition-colors group-hover:text-[#d9603a]")}>
                  {e.title}
                </span>
                <span className={cn(serif, "col-span-2 text-[14px] text-[#ece5d6]/55 sm:col-span-1 sm:text-right")}>
                  {e.venue}, {e.city}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <PageHead
        kicker="Get in touch"
        title="Commissions & prints"
        lede="Tell me about the assignment, the print, or the workshop seat. I read every note myself and reply within a few days."
      />

      <div className="grid gap-12 md:grid-cols-[0.55fr_0.45fr]">
        <Reveal>
          {sent ? (
            <div className="flex h-full min-h-[360px] flex-col items-start justify-center border border-[#d9603a]/40 bg-[#16140f] p-10">
              <Aperture className="h-8 w-8 text-[#d9603a]" strokeWidth={1.25} />
              <h3 className={cn(display, "mt-5 text-[26px] font-semibold text-[#ece5d6]")}>Shutter's open.</h3>
              <p className={cn(serif, "mt-3 max-w-sm text-[16px] leading-relaxed text-[#ece5d6]/65")}>
                Thanks — your note is in. I develop email about as fast as film, so
                expect a reply within a few days.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className={cn(mono, "mt-7 text-[10px] text-[#ece5d6]/60 underline-offset-4 hover:text-[#d9603a] hover:underline")}
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="grid gap-5"
            >
              <Field id="name" label="Your name" placeholder="Jordan Avery" />
              <Field id="email" label="Email" type="email" placeholder="you@studio.com" />
              <div className="grid gap-2">
                <label htmlFor="kind" className={cn(mono, "text-[9px] text-[#ece5d6]/55")}>Enquiry</label>
                <select
                  id="kind"
                  className={cn(serif, "appearance-none rounded-[2px] border border-[#ece5d6]/15 bg-[#16140f] px-4 py-3 text-[15px] text-[#ece5d6] outline-none transition-colors focus:border-[#d9603a]")}
                >
                  <option>Editorial commission</option>
                  <option>Print enquiry</option>
                  <option>Workshop seat</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="msg" className={cn(mono, "text-[9px] text-[#ece5d6]/55")}>Message</label>
                <textarea
                  id="msg"
                  rows={5}
                  placeholder="What are we making, and roughly when?"
                  className={cn(serif, "resize-none rounded-[2px] border border-[#ece5d6]/15 bg-[#16140f] px-4 py-3 text-[15px] text-[#ece5d6] outline-none transition-colors placeholder:text-[#ece5d6]/30 focus:border-[#d9603a]")}
                />
              </div>
              <div>
                <Cta>Send the note</Cta>
              </div>
            </form>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-7">
            {services.map((s) => (
              <div key={s.title} className="border-b border-[#ece5d6]/12 pb-7 last:border-0">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className={cn(display, "text-[20px] font-semibold text-[#ece5d6]")}>{s.title}</h3>
                  <span className={cn(mono, "shrink-0 text-[9px] text-[#d9603a]")}>{s.detail}</span>
                </div>
                <p className={cn(serif, "mt-2 text-[15px] leading-relaxed text-[#ece5d6]/60")}>{s.blurb}</p>
              </div>
            ))}
            <div className="border border-[#ece5d6]/12 p-6">
              <Eyebrow>Studio</Eyebrow>
              <p className={cn(serif, "mt-3 text-[15px] leading-relaxed text-[#ece5d6]/65")}>
                Salt Lake City, Utah — by appointment.<br />
                studio@reyesmarlow.com<br />
                +1 801 555 0148
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Small shared bits
 * ------------------------------------------------------------------ */

function PageHead({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <div className="mb-12 max-w-2xl">
      <Reveal>
        <Eyebrow>{kicker}</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className={cn(display, "mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] font-semibold leading-[0.95] text-[#ece5d6]")}>
          {title}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className={cn(serif, "mt-5 text-[17px] leading-[1.7] text-[#ece5d6]/60")}>{lede}</p>
      </Reveal>
    </div>
  )
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string
  label: string
  placeholder?: string
  type?: string
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className={cn(mono, "text-[9px] text-[#ece5d6]/55")}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(serif, "rounded-[2px] border border-[#ece5d6]/15 bg-[#16140f] px-4 py-3 text-[15px] text-[#ece5d6] outline-none transition-colors placeholder:text-[#ece5d6]/30 focus:border-[#d9603a]")}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Shell + routing
 * ------------------------------------------------------------------ */

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Marlow() {
  const { slug } = useParams()
  const base = `/site/${slug}`
  return (
    <div className={cn(serif, "min-h-screen bg-[#0e0d0b] text-[#ece5d6] antialiased selection:bg-[#d9603a] selection:text-[#0e0d0b]")}>
      <Nav base={base} />
      <main>
        <Routes>
          <Route index element={<Page><Home base={base} /></Page>} />
          <Route path="work" element={<Page><Work /></Page>} />
          <Route path="series" element={<Page><SeriesIndex base={base} /></Page>} />
          <Route path="studio" element={<Page><Studio base={base} /></Page>} />
          <Route path="contact" element={<Page><Contact /></Page>} />
          <Route path="*" element={<Page><Home base={base} /></Page>} />
        </Routes>
      </main>
      <Footer base={base} />
    </div>
  )
}

export const meta: SiteMeta = {
  title: "Reyes Marlow — Large-format photographs of the American West",
  description:
    "Portfolio for a fictional documentary photographer working on sheet film across the Great Basin. Dark gallery palette, Bricolage + Spectral typography, and a horizontal scroll-pinned filmstrip as the featured interaction.",
  date: "2026-06-23",
  type: "Portfolio",
  interaction: "Horizontal scroll-pinned filmstrip (vertical scroll pans a contact sheet) + staggered work grid + magnetic CTAs",
  pages: ["Home", "Work", "Series", "Studio", "Contact"],
}
