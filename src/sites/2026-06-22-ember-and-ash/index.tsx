import { useRef, useState, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { Flame, Clock, MapPin, Phone, ArrowRight, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/fx/Reveal"
import { Magnetic } from "@/components/fx/Magnetic"
import type { SiteMeta } from "../types"

export const meta: SiteMeta = {
  title: "Ember & Ash — Wood-fired kitchen, Wellington",
  description:
    "Multi-page site for a wood-fire restaurant on Cuba Street. Warm charcoal palette, cursor-following dish reveals on the menu, parallax embers.",
  date: "2026-06-22",
  type: "Restaurant",
  interaction: "Hover image-reveal (cursor-following dish previews)",
  pages: ["Home", "Menu", "Reservations", "Story"],
}

/* ----------------------------------------------------------------- *
 * Shared typography helpers — Fraunces display + DM Sans body.
 * ----------------------------------------------------------------- */
const display = "font-['Fraunces',serif]"
const body = "font-['DM_Sans',sans-serif]"

/* ----------------------------------------------------------------- *
 * Warm-toned image so picsum's random photos read as one menu.
 * ----------------------------------------------------------------- */
function Plate({
  seed,
  alt,
  className = "",
  w = 640,
  h = 800,
}: {
  seed: string
  alt: string
  className?: string
  w?: number
  h?: number
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ filter: "sepia(0.32) saturate(1.15) contrast(1.04) brightness(0.92)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{ background: "linear-gradient(160deg, rgba(232,99,58,0.18), rgba(26,22,20,0.55))" }}
      />
    </div>
  )
}

/* ----------------------------------------------------------------- *
 * Layout — persistent nav + footer on every page.
 * ----------------------------------------------------------------- */
function Layout({ base, children }: { base: string; children: ReactNode }) {
  const links = [
    { to: base, label: "Home", end: true },
    { to: `${base}/menu`, label: "Menu", end: false },
    { to: `${base}/reservations`, label: "Reservations", end: false },
    { to: `${base}/story`, label: "Story", end: false },
  ]

  return (
    <div className={`min-h-screen bg-[#1a1614] text-[#efe7dd] ${body} antialiased`}>
      <header className="sticky top-0 z-50 border-b border-[#efe7dd]/10 bg-[#1a1614]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to={base} end className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#e8633a]" />
            <span className={`text-lg tracking-tight ${display}`}>Ember&nbsp;&amp;&nbsp;Ash</span>
          </NavLink>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `relative py-1 transition-colors hover:text-[#e8633a] ${
                    isActive ? "text-[#e8633a]" : "text-[#efe7dd]/70"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#e8633a]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <Magnetic>
            <Button
              asChild
              className="rounded-full bg-[#e8633a] px-5 text-[#1a1614] hover:bg-[#f0794f]"
            >
              <NavLink to={`${base}/reservations`}>Book a table</NavLink>
            </Button>
          </Magnetic>
        </div>
        {/* compact mobile nav */}
        <nav className="flex items-center justify-center gap-6 border-t border-[#efe7dd]/10 py-2 text-xs md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive ? "text-[#e8633a]" : "text-[#efe7dd]/60"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#efe7dd]/10 bg-[#16110f]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-[#e8633a]" />
              <span className={`text-lg ${display}`}>Ember &amp; Ash</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#efe7dd]/55">
              A single hearth, three native hardwoods, and whatever the coast gave us that
              morning. Everything touches the fire.
            </p>
          </div>
          <div className="text-sm text-[#efe7dd]/70">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#efe7dd]/40">Find us</p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e8633a]" /> 14 Cuba Street, Te Aro,
              Wellington
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#e8633a]" /> 04&nbsp;555&nbsp;0148
            </p>
          </div>
          <div className="text-sm text-[#efe7dd]/70">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#efe7dd]/40">Hours</p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#e8633a]" /> Tue–Sun, 5pm 'til late
            </p>
            <p className="mt-2 text-[#efe7dd]/50">Closed Mondays — the fire rests too.</p>
          </div>
        </div>
        <div className="border-t border-[#efe7dd]/10 px-6 py-5 text-center text-xs text-[#efe7dd]/35">
          © 2026 Ember &amp; Ash. Built around a wood fire, not a gas line.
        </div>
      </footer>
    </div>
  )
}

/* ----------------------------------------------------------------- *
 * Page wrapper — fade + rise transition keyed to the route.
 * ----------------------------------------------------------------- */
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

/* ----------------------------------------------------------------- *
 * HOME
 * ----------------------------------------------------------------- */
function Home({ base }: { base: string }) {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"])
  const yEmber = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-40%"])

  return (
    <Page>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div style={{ y: yImg }} className="absolute inset-0">
          <Plate
            seed="emberfire-hearth"
            alt="Flames licking over a wood-fired grill in a dim kitchen"
            className="h-[120%] w-full"
            w={1600}
            h={1200}
          />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,22,20,0.55) 0%, rgba(26,22,20,0.35) 40%, #1a1614 100%)",
          }}
        />
        {/* drifting embers */}
        <motion.div style={{ y: yEmber }} aria-hidden className="absolute inset-0">
          {!reduce &&
            Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-[#f0794f]"
                style={{ left: `${(i * 37) % 100}%`, bottom: "-5%" }}
                animate={{ y: ["0%", "-820%"], opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 7 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut",
                }}
              />
            ))}
        </motion.div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-6 pb-20 pt-32">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.34em] text-[#e8633a]"
          >
            Wood-fired · Cuba Street · est. 2019
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={`mt-4 max-w-3xl text-balance text-5xl leading-[1.02] tracking-tight md:text-7xl ${display}`}
          >
            Everything here
            <br />
            <span className="italic text-[#e8633a]">touches the fire.</span>
          </motion.h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#efe7dd]/75">
            One hearth, three native hardwoods, and a menu that changes with the catch and the
            season. Pull up a stool at the pass and watch dinner cook.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#e8633a] px-7 text-[#1a1614] hover:bg-[#f0794f]"
              >
                <NavLink to={`${base}/reservations`}>
                  Reserve a table <ArrowRight className="h-4 w-4" />
                </NavLink>
              </Button>
            </Magnetic>
            <NavLink
              to={`${base}/menu`}
              className="text-sm text-[#efe7dd]/70 underline-offset-4 transition-colors hover:text-[#e8633a] hover:underline"
            >
              See tonight's menu
            </NavLink>
          </div>
        </div>
      </section>

      {/* Marquee of ingredients */}
      <div className="overflow-hidden border-y border-[#efe7dd]/10 bg-[#16110f] py-4">
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap text-sm uppercase tracking-[0.25em] text-[#efe7dd]/40"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="flex gap-10">
              {[
                "Mānuka coals",
                "Day-boat snapper",
                "Dry-aged sirloin",
                "Fermented chilli",
                "Burnt honey",
                "Smoked kawakawa",
                "Coastal greens",
                "Native thyme",
              ].map((w) => (
                <span key={w} className="flex items-center gap-10">
                  {w} <Flame className="h-3 w-3 text-[#e8633a]" />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Three-up philosophy — asymmetric, not identical cards */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-end">
          <Reveal>
            <h2 className={`text-4xl leading-tight tracking-tight md:text-5xl ${display}`}>
              We cook the way people did before there were dials.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-[#efe7dd]/70">
              No gas, no induction, no shortcuts. The fire is lit at two and it does everything —
              sears, smokes, roasts the bones for the stock and warms the bread. Heat is a craft
              here, not a setting.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-12">
          {[
            {
              k: "01",
              t: "The hearth",
              b: "A four-metre brick fire we built ourselves. It never fully goes out between service.",
              span: "md:col-span-5",
              seed: "emberhearth-brick",
            },
            {
              k: "02",
              t: "The wood",
              b: "Mānuka for snap, pōhutukawa for the long roasts, oak for a clean, even bed of coals.",
              span: "md:col-span-7",
              seed: "emberwood-logs",
            },
            {
              k: "03",
              t: "The pass",
              b: "Eight stools face the fire. It's the best seat in the house and you can't book it.",
              span: "md:col-span-7",
              seed: "emberpass-chef",
            },
            {
              k: "04",
              t: "The catch",
              b: "We buy what the day boats land, so the menu is printed fresh every afternoon at four.",
              span: "md:col-span-5",
              seed: "embercatch-fish",
            },
          ].map((c, i) => (
            <Reveal key={c.k} delay={i * 0.08} className={c.span}>
              <article className="group h-full overflow-hidden rounded-2xl border border-[#efe7dd]/10 bg-[#16110f]">
                <Plate
                  seed={c.seed}
                  alt={c.t}
                  className="h-44 w-full transition-transform duration-500 group-hover:scale-105"
                  w={800}
                  h={400}
                />
                <div className="p-6">
                  <span className={`text-sm text-[#e8633a] ${display}`}>{c.k}</span>
                  <h3 className={`mt-1 text-2xl ${display}`}>{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#efe7dd]/60">{c.b}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-[#efe7dd]/10 bg-[#16110f]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <h2 className={`max-w-xl text-3xl leading-tight md:text-4xl ${display}`}>
              The fire's lit by five. Come hungry.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#e8633a] px-7 text-[#1a1614] hover:bg-[#f0794f]"
              >
                <NavLink to={`${base}/reservations`}>
                  Book your table <ArrowRight className="h-4 w-4" />
                </NavLink>
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}

/* ----------------------------------------------------------------- *
 * MENU — featured interaction: cursor-following dish reveal.
 * ----------------------------------------------------------------- */
type Dish = { name: string; note: string; price: string; seed: string }

const MENU: { section: string; blurb: string; items: Dish[] }[] = [
  {
    section: "From the coals",
    blurb: "Small plates to share while the fire builds.",
    items: [
      { name: "Wood-roasted oysters", note: "burnt butter, native horopito, lemon", price: "6 ea", seed: "dish-oysters" },
      { name: "Charred sourdough", note: "whipped bone marrow, smoked salt", price: "14", seed: "dish-bread" },
      { name: "Blistered greens", note: "fermented chilli, toasted seed, mānuka honey", price: "18", seed: "dish-greens" },
      { name: "Ember leeks", note: "ash cream, hazelnut, aged sheep's cheese", price: "19", seed: "dish-leeks" },
    ],
  },
  {
    section: "The fire",
    blurb: "Cooked over coals to order. Built to share, or not.",
    items: [
      { name: "Day-boat snapper", note: "whole, salt-baked, kawakawa & brown butter", price: "44", seed: "dish-snapper" },
      { name: "Dry-aged sirloin", note: "300g, 40 days, burnt onion, beef-fat chips", price: "52", seed: "dish-sirloin" },
      { name: "Coal-roast cauliflower", note: "smoked almond cream, capers, raisin", price: "32", seed: "dish-cauliflower" },
      { name: "Pōhutukawa lamb", note: "shoulder, slow-smoked, anchovy, mint", price: "48", seed: "dish-lamb" },
    ],
  },
  {
    section: "Sweet smoke",
    blurb: "Even pudding sees the fire.",
    items: [
      { name: "Burnt honey tart", note: "crème fraîche, toasted oats", price: "16", seed: "dish-tart" },
      { name: "Fire-baked apple", note: "mānuka ice cream, smoked caramel", price: "15", seed: "dish-apple" },
      { name: "Dark chocolate ash", note: "olive oil, sea salt, embered cherry", price: "17", seed: "dish-chocolate" },
    ],
  },
]

function DishRow({
  dish,
  onHover,
}: {
  dish: Dish
  onHover: (seed: string | null) => void
}) {
  return (
    <li
      onMouseEnter={() => onHover(dish.seed)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(dish.seed)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      className="group grid cursor-default grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[#efe7dd]/10 py-5 outline-none transition-colors last:border-0 hover:border-[#e8633a]/40 focus-visible:border-[#e8633a]/60"
    >
      <div className="flex items-start gap-4">
        {/* mobile-only thumbnail (the floating preview is desktop-only) */}
        <Plate
          seed={dish.seed}
          alt={dish.name}
          className="h-14 w-14 shrink-0 rounded-md lg:hidden"
          w={120}
          h={120}
        />
        <div>
          <h4
            className={`text-xl tracking-tight transition-colors group-hover:text-[#e8633a] group-focus-visible:text-[#e8633a] ${display}`}
          >
            {dish.name}
          </h4>
          <p className="mt-1 text-sm text-[#efe7dd]/55">{dish.note}</p>
        </div>
      </div>
      <span className={`text-lg text-[#efe7dd]/80 ${display}`}>{dish.price}</span>
    </li>
  )
}

function Menu() {
  const reduce = useReducedMotion()
  const [seed, setSeed] = useState<string | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 350, damping: 30, mass: 0.4 })
  const y = useSpring(my, { stiffness: 350, damping: 30, mass: 0.4 })

  return (
    <Page>
      <section
        onMouseMove={(e) => {
          mx.set(e.clientX + 24)
          my.set(e.clientY - 110)
        }}
        className="relative mx-auto max-w-5xl px-6 py-20"
      >
        {/* Floating cursor preview — desktop pointer devices only */}
        <motion.div
          aria-hidden
          style={{ x, y }}
          animate={{ opacity: seed && !reduce ? 1 : 0, scale: seed ? 1 : 0.85 }}
          transition={{ opacity: { duration: 0.18 }, scale: { duration: 0.18 } }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden h-56 w-44 -rotate-3 overflow-hidden rounded-xl border border-[#efe7dd]/15 shadow-2xl shadow-black/50 lg:block"
        >
          {seed && <Plate seed={seed} alt="" className="h-full w-full" w={360} h={460} />}
        </motion.div>

        <header className="mb-4">
          <p className="text-xs uppercase tracking-[0.32em] text-[#e8633a]">Printed fresh at 4pm</p>
          <h1 className={`mt-3 text-5xl tracking-tight md:text-6xl ${display}`}>Tonight's menu</h1>
          <p className="mt-4 max-w-md text-[#efe7dd]/65">
            It shifts with the catch and the coals. Hover a dish to see it come off the fire.
          </p>
        </header>

        <div className="mt-14 space-y-16">
          {MENU.map((sec, i) => (
            <Reveal key={sec.section} delay={i * 0.05}>
              <div className="grid gap-x-12 gap-y-2 md:grid-cols-[0.5fr_1fr]">
                <div className="md:sticky md:top-28 md:self-start">
                  <h2 className={`text-3xl text-[#e8633a] ${display}`}>{sec.section}</h2>
                  <p className="mt-2 text-sm text-[#efe7dd]/55">{sec.blurb}</p>
                </div>
                <ul>
                  {sec.items.map((d) => (
                    <DishRow key={d.name} dish={d} onHover={setSeed} />
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-16 max-w-lg text-sm text-[#efe7dd]/60">
          Please tell us about allergies when you book — with a single fire, we plan the night
          around them. A discretionary 12.5% applies to tables of six or more.
        </p>
      </section>
    </Page>
  )
}

/* ----------------------------------------------------------------- *
 * RESERVATIONS — working-feeling form with confirmation state.
 * ----------------------------------------------------------------- */
function Reservations() {
  const [party, setParty] = useState(2)
  const [sent, setSent] = useState(false)
  const [name, setName] = useState("")

  return (
    <Page>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#e8633a]">Tue–Sun · 5pm 'til late</p>
          <h1 className={`mt-3 text-5xl tracking-tight md:text-6xl ${display}`}>Hold a place by the fire</h1>
          <p className="mt-5 max-w-md text-[#efe7dd]/70">
            We keep the eight pass stools for walk-ins — the rest of the room takes bookings.
            Tables run two hours; let us know if you're celebrating and we'll do something with the
            coals.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#efe7dd]/10">
            <Plate
              seed="ember-diningroom"
              alt="Warm candlelit dining room with a glowing open kitchen at the back"
              className="aspect-[4/3] w-full"
              w={900}
              h={675}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#efe7dd]/10 bg-[#16110f] p-7 md:p-9">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex min-h-[420px] flex-col items-start justify-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8633a]/15 text-[#e8633a]">
                <Check className="h-6 w-6" />
              </span>
              <h2 className={`mt-5 text-3xl ${display}`}>You're in{name ? `, ${name}` : ""}.</h2>
              <p className="mt-3 max-w-sm text-[#efe7dd]/65">
                We've pencilled in a table for {party}. Keep an eye on your inbox — we'll confirm
                within the hour and ask about anything the kitchen should know.
              </p>
              <Button
                variant="ghost"
                onClick={() => setSent(false)}
                className="mt-6 px-0 text-[#e8633a] hover:bg-transparent hover:text-[#f0794f]"
              >
                Make another booking
              </Button>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="space-y-5"
            >
              <h2 className={`text-2xl ${display}`}>Request a table</h2>

              <label className="block">
                <span className="mb-1.5 block text-sm text-[#efe7dd]/70">Name</span>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Who's the table under?"
                  className="border-[#efe7dd]/15 bg-[#1a1614] text-[#efe7dd] placeholder:text-[#efe7dd]/30 focus-visible:ring-[#e8633a]"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-[#efe7dd]/70">Date</span>
                  <Input
                    required
                    type="date"
                    className="border-[#efe7dd]/15 bg-[#1a1614] text-[#efe7dd] focus-visible:ring-[#e8633a]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-[#efe7dd]/70">Time</span>
                  <Input
                    required
                    type="time"
                    defaultValue="19:00"
                    className="border-[#efe7dd]/15 bg-[#1a1614] text-[#efe7dd] focus-visible:ring-[#e8633a]"
                  />
                </label>
              </div>

              <div>
                <span className="mb-1.5 block text-sm text-[#efe7dd]/70">Party size</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Fewer guests"
                    onClick={() => setParty((p) => Math.max(1, p - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#efe7dd]/15 text-[#efe7dd]/80 transition-colors hover:border-[#e8633a] hover:text-[#e8633a]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className={`w-8 text-center text-2xl ${display}`}>{party}</span>
                  <button
                    type="button"
                    aria-label="More guests"
                    onClick={() => setParty((p) => Math.min(12, p + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#efe7dd]/15 text-[#efe7dd]/80 transition-colors hover:border-[#e8633a] hover:text-[#e8633a]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-[#efe7dd]/45">
                    {party >= 6 ? "Large table — we'll call to confirm" : "guests"}
                  </span>
                </div>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm text-[#efe7dd]/70">
                  Allergies &amp; notes <span className="text-[#efe7dd]/35">(optional)</span>
                </span>
                <textarea
                  rows={3}
                  placeholder="Anything the kitchen should plan around?"
                  className="w-full rounded-md border border-[#efe7dd]/15 bg-[#1a1614] px-3 py-2 text-sm text-[#efe7dd] placeholder:text-[#efe7dd]/30 focus:outline-none focus:ring-2 focus:ring-[#e8633a]"
                />
              </label>

              <Magnetic strength={0.25}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-[#e8633a] text-[#1a1614] hover:bg-[#f0794f]"
                >
                  Request this table <ArrowRight className="h-4 w-4" />
                </Button>
              </Magnetic>
              <p className="text-center text-xs text-[#efe7dd]/40">
                No card needed — just turn up hungry.
              </p>
            </form>
          )}
        </div>
      </section>
    </Page>
  )
}

/* ----------------------------------------------------------------- *
 * STORY — about, with animated counters.
 * ----------------------------------------------------------------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? to : 0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  return (
    <motion.span
      ref={ref}
      onViewportEnter={() => {
        if (started.current || reduce) return
        started.current = true
        const start = performance.now()
        const dur = 1200
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur)
          setN(Math.round((1 - Math.pow(1 - p, 3)) * to))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }}
      viewport={{ once: true, margin: "-60px" }}
    >
      {n}
      {suffix}
    </motion.span>
  )
}

function Story() {
  return (
    <Page>
      <section className="relative">
        <div className="absolute inset-0 h-72 overflow-hidden">
          <Plate
            seed="ember-chef-portrait"
            alt="Chef tending a wood fire, sparks rising"
            className="h-full w-full"
            w={1600}
            h={600}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(26,22,20,0.35), #1a1614)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 pb-20 pt-44">
          <p className="text-xs uppercase tracking-[0.32em] text-[#e8633a]">Our story</p>
          <h1 className={`mt-3 text-5xl leading-tight tracking-tight md:text-6xl ${display}`}>
            It started with a fire we couldn't put out.
          </h1>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-[#efe7dd]/75">
            <p>
              Hana Whitaker cooked her first wood-fired meal on a beach in the Marlborough Sounds,
              snapper wrapped in leaves and buried in coals. Back in a city kitchen full of dials
              and timers, nothing tasted as alive. So in 2019 she gutted a tired café on Cuba
              Street and built a four-metre brick hearth where the stove used to be.
            </p>
            <p>
              Ember &amp; Ash has cooked over that single fire ever since. There's no gas line.
              What the wood can't do, we don't serve. It makes the kitchen slower, hotter and far
              more honest — and it means no two nights are ever quite the same.
            </p>
            <p className="text-[#efe7dd]/60">
              "Fire forgives nothing and rewards patience. That's the whole philosophy, really." —
              Hana Whitaker, chef &amp; owner
            </p>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 border-y border-[#efe7dd]/10 py-8 text-center">
            {[
              { v: 1, s: "", l: "Fire, always lit" },
              { v: 3, s: "", l: "Native hardwoods" },
              { v: 0, s: "", l: "Gas burners" },
            ].map((stat) => (
              <div key={stat.l}>
                <div className={`text-5xl text-[#e8633a] ${display}`}>
                  <Counter to={stat.v} suffix={stat.s} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[#efe7dd]/60">
                  {stat.l}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            <Plate
              seed="ember-story-coals"
              alt="Close-up of glowing orange coals under a grill"
              className="aspect-[4/5] rounded-xl"
              w={600}
              h={750}
            />
            <Plate
              seed="ember-story-plating"
              alt="Hands plating a charred dish at the pass"
              className="mt-0 aspect-[4/5] rounded-xl sm:mt-10"
              w={600}
              h={750}
            />
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ----------------------------------------------------------------- *
 * ROOT — wires base path, layout, nested routes.
 * ----------------------------------------------------------------- */
export default function EmberAndAsh() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <Layout base={base}>
      <Routes>
        <Route index element={<Home base={base} />} />
        <Route path="menu" element={<Menu />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="story" element={<Story />} />
        <Route path="*" element={<Home base={base} />} />
      </Routes>
    </Layout>
  )
}
