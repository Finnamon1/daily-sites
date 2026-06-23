import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Leaf, Menu, X } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Wildline — a weekly field dispatch on the wild plants of the city",
  description:
    "A paid Sunday newsletter by botanist-essayist June Calloway about the weeds, mosses and bomb-site flowers growing where you already live. Featured interaction: a draggable, inertia-flung issue archive you swipe through, plus magnetic CTAs and scroll reveals.",
  date: "2026-06-23",
  type: "Creator newsletter",
  interaction: "Draggable inertia carousel (swipe the issue archive) + magnetic CTAs + scroll reveals",
  pages: ["Home", "Issues", "Field Guide", "About", "Subscribe"],
}

/* --------------------------------------------------------------- palette */
// paper #f2efe4 · ink #1a2016 · ONE confident botanical green #3c6b34
// chartreuse #cfe27a used only on the dark (#1a2016) panels.
const GREEN = "#3c6b34"

/* ----------------------------------------------------------------- data */

type Issue = {
  no: number
  title: string
  date: string
  dek: string
  seed: string
  tag: string
}

const ISSUES: Issue[] = [
  { no: 47, title: "The Dandelion Conspiracy", date: "Jun 22", tag: "Weeds", seed: "dandelion-field", dek: "Why the most hated flower on your street is also the most generous — and what the lawn-mowers got wrong." },
  { no: 46, title: "Buddleia, the Bomb-Site Flower", date: "Jun 15", tag: "Ruins", seed: "buddleia-purple", dek: "It colonised London's rubble in 1945 and never left. A love letter to the plant that prefers our wreckage." },
  { no: 45, title: "What the Pavement Knows", date: "Jun 8", tag: "Cracks", seed: "moss-pavement", dek: "Seven species I found in a single metre of cracked kerb, and how to read them like a tide line." },
  { no: 44, title: "Nettles & Other Apologies", date: "Jun 1", tag: "Foraging", seed: "green-nettle", dek: "On sting, soup, and the long history of plants we punish for defending themselves." },
  { no: 43, title: "A Field Guide to Doing Nothing", date: "May 25", tag: "Slowness", seed: "meadow-grass", dek: "What grows in the verge a council forgot to cut — and the quiet argument for leaving it be." },
  { no: 42, title: "The Secret Life of Moss", date: "May 18", tag: "Moss", seed: "forest-moss", dek: "Older than trees, smaller than thought. A week spent on my knees on the north side of things." },
  { no: 41, title: "Ivy Will Outlive Us", date: "May 11", tag: "Climbers", seed: "ivy-wall", dek: "The plant we keep trying to scrape off the brick, and why the birds are quietly on its side." },
]

type Plant = {
  name: string
  latin: string
  where: string
  note: string
  seed: string
}

const GUIDE: Plant[] = [
  { name: "Common Dandelion", latin: "Taraxacum officinale", where: "Lawns, kerbs, any crack with light", note: "Every part is edible. The clock-heads are the best wish-delivery system ever evolved.", seed: "dandelion-macro" },
  { name: "Butterfly Bush", latin: "Buddleja davidii", where: "Railway sidings, gutters, old walls", note: "Self-seeds into mortar. By August it's a runway for every red admiral in the postcode.", seed: "buddleia-bush" },
  { name: "Stinging Nettle", latin: "Urtica dioica", where: "Nitrogen-rich edges, allotment fences", note: "Sting fades in minutes; the soup lasts all week. Pick the top four leaves with gloves.", seed: "nettle-green" },
  { name: "Herb Robert", latin: "Geranium robertianum", where: "Shady walls, north-facing steps", note: "Tiny pink stars and a smell people swear keeps mosquitoes off. The jury, charmingly, is out.", seed: "herb-robert-pink" },
  { name: "Wall Pennywort", latin: "Umbilicus rupestris", where: "Damp stone, old harbour walls", note: "Round leaves with a belly-button dimple. Crisp, faintly salty, weirdly delicious.", seed: "pennywort-wall" },
  { name: "Yarrow", latin: "Achillea millefolium", where: "Verges, playing-field edges", note: "Feathery and tough. Roman soldiers packed wounds with it — hence Achillea, for Achilles.", seed: "yarrow-white" },
]

const PHOTO_FILTER: CSSProperties = { filter: "sepia(9%) saturate(116%)" }

/* --------------------------------------------------------------- pieces */

function Mono({
  children,
  className = "",
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.22em] ${className}`} style={style}>
      {children}
    </span>
  )
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-['Fraunces'] text-2xl font-semibold tracking-[-0.02em] ${className}`}>
      <Leaf size={18} className="-rotate-12 text-[#3c6b34]" />
      Wild<span className="italic text-[#3c6b34]">line</span>
    </span>
  )
}

/** Animated count-up that fires once when scrolled into view. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [val, setVal] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

/** FEATURED — draggable / inertia-flung issue archive. */
function IssueArchive({ issues }: { issues: Issue[] }) {
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [bound, setBound] = useState(0)
  const [progress, setProgress] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const measure = () => {
      if (!track.current || !viewport.current) return
      const diff = track.current.scrollWidth - viewport.current.offsetWidth
      setBound(diff > 0 ? diff : 0)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [issues])

  useEffect(() => {
    const unsub = x.on("change", (v) => setProgress(bound ? Math.min(1, Math.max(0, -v / bound)) : 0))
    return () => unsub()
  }, [x, bound])

  const nudge = (dir: 1 | -1) => {
    const next = Math.min(0, Math.max(-bound, x.get() - dir * 340))
    animate(x, next, reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 38 })
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <Mono className="text-[#3c6b34]">Drag · swipe · fling</Mono>
          <h3 className="mt-1 font-['Fraunces'] text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">
            The back issues
          </h3>
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              onClick={() => nudge(d)}
              aria-label={d === -1 ? "Previous issues" : "More issues"}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#1a2016]/20 transition-colors duration-200 hover:bg-[#1a2016] hover:text-[#f2efe4]"
            >
              {d === -1 ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
            </button>
          ))}
        </div>
      </div>

      <div ref={viewport} className="overflow-hidden">
        <motion.div
          ref={track}
          drag="x"
          dragConstraints={{ left: -bound, right: 0 }}
          dragElastic={0.08}
          dragMomentum={!reduce}
          style={{ x }}
          className="flex cursor-grab gap-5 pb-2 active:cursor-grabbing"
        >
          {issues.map((it) => (
            <article key={it.no} className="group relative w-[260px] shrink-0 sm:w-[300px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#1a2016]/12">
                <img
                  src={`https://picsum.photos/seed/${it.seed}/600/750`}
                  alt={`Photograph accompanying issue ${it.no}, ${it.title}`}
                  width={600}
                  height={750}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  style={PHOTO_FILTER}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d120a]/75 via-[#0d120a]/10 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full bg-[#f2efe4]/92 px-2.5 py-1">
                  <Mono>No. {it.no}</Mono>
                </div>
                <div className="absolute inset-x-3 bottom-3 text-[#f2efe4]">
                  <Mono className="opacity-80">{it.tag} · {it.date}</Mono>
                  <h4 className="mt-1 font-['Fraunces'] text-xl font-semibold leading-tight">{it.title}</h4>
                </div>
              </div>
              <p className="mt-3 font-['Spectral'] text-[15px] leading-relaxed text-[#1a2016]/70">{it.dek}</p>
            </article>
          ))}
        </motion.div>
      </div>

      {/* drag progress rail */}
      <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-[#1a2016]/12" role="presentation">
        <motion.div className="h-full rounded-full bg-[#3c6b34]" style={{ width: `${Math.max(12, progress * 100)}%` }} />
      </div>
    </div>
  )
}

function magClasses(variant: "solid" | "ghost") {
  return variant === "solid"
    ? "inline-flex items-center gap-2 rounded-full bg-[#3c6b34] px-6 py-3 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#f2efe4] transition-[transform,filter] duration-200 hover:brightness-110"
    : "inline-flex items-center gap-2 rounded-full border border-[#1a2016]/25 px-6 py-3 font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#1a2016] transition-colors duration-200 hover:bg-[#1a2016] hover:text-[#f2efe4]"
}

/** Magnetic CTA — renders a router link when `to` is set, else a real button. */
function MagButton({
  children,
  onClick,
  to,
  type = "button",
  variant = "solid",
}: {
  children: ReactNode
  onClick?: () => void
  to?: string
  type?: "button" | "submit"
  variant?: "solid" | "ghost"
}) {
  return (
    <Magnetic strength={0.35}>
      {to ? (
        <NavLink to={to} className={magClasses(variant)}>
          {children}
        </NavLink>
      ) : (
        <button type={type} onClick={onClick} className={magClasses(variant)}>
          {children}
        </button>
      )}
    </Magnetic>
  )
}

/* ----------------------------------------------------------------- pages */

function Home({ base }: { base: string }) {
  return (
    <div>
      {/* hero — asymmetric editorial */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 md:grid-cols-[1.15fr_0.85fr] md:items-end md:pt-24">
        <div>
          <Mono className="text-[#3c6b34]">Sundays · since 2024 · issue no. 47</Mono>
          <h1 className="mt-5 font-['Fraunces'] text-[clamp(2.6rem,7vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
            The wild things
            <br />
            growing where
            <br />
            <span className="italic text-[#3c6b34]">you already live.</span>
          </h1>
          <p className="mt-7 max-w-xl font-['Spectral'] text-lg leading-relaxed text-[#1a2016]/78">
            Each Sunday morning, botanist June Calloway sends one letter about a weed,
            a moss, or a bomb-site flower most people walk straight past — and why it's
            worth stopping for. No app to download. Just a careful eye, in your inbox.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagButton to={`${base}/subscribe`}>Read this Sunday <ArrowUpRight size={15} /></MagButton>
            <MagButton to={`${base}/issues`} variant="ghost">Browse the archive</MagButton>
          </div>
        </div>

        {/* featured-issue card, not a centered stock hero */}
        <Reveal>
          <figure className="relative">
            <div className="overflow-hidden rounded-[1.4rem] border border-[#1a2016]/12 shadow-[0_30px_60px_-30px_rgba(26,32,22,0.5)]">
              <img
                src="https://picsum.photos/seed/dandelion-field/760/900"
                alt="A dandelion clock seen against soft morning light"
                width={760}
                height={900}
                loading="eager"
                className="aspect-[4/5] w-full object-cover"
                style={PHOTO_FILTER}
              />
            </div>
            <figcaption className="absolute -bottom-5 left-4 right-4 rounded-xl border border-[#1a2016]/10 bg-[#f2efe4] p-4 shadow-lg">
              <Mono className="text-[#3c6b34]">This Sunday — No. 47</Mono>
              <p className="mt-1 font-['Fraunces'] text-lg font-semibold leading-snug">The Dandelion Conspiracy</p>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* stat strip */}
      <section className="border-y border-[#1a2016]/12 bg-[#1a2016] text-[#f2efe4]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-12 sm:grid-cols-4">
          {[
            { v: <CountUp to={47} />, l: "Letters sent" },
            { v: <CountUp to={9200} suffix="+" />, l: "Sunday readers" },
            { v: <CountUp to={143} />, l: "Species named" },
            { v: <><CountUp to={98} />%</>, l: "Open rate" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div>
                <div className="font-['Fraunces'] text-4xl font-semibold tracking-[-0.02em] text-[#cfe27a]">{s.v}</div>
                <Mono className="mt-2 block opacity-70">{s.l}</Mono>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured draggable archive */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <IssueArchive issues={ISSUES} />
      </section>

      {/* pull quote */}
      <section className="mx-auto max-w-4xl px-5 pb-24">
        <Reveal>
          <blockquote className="border-l-2 border-[#3c6b34] pl-6 font-['Fraunces'] text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.01em]">
            “Wildline is the only newsletter that makes my Sunday walk feel like
            a detective novel. I now know the name of everything in my gutter.”
          </blockquote>
          <Mono className="mt-5 block text-[#1a2016]/60">— Priya Anand, reader since No. 6</Mono>
        </Reveal>
      </section>
    </div>
  )
}

function Issues() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Mono className="text-[#3c6b34]">The archive</Mono>
      <h1 className="mt-3 max-w-3xl font-['Fraunces'] text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
        Forty-seven Sundays, one weed at a time.
      </h1>
      <p className="mt-5 max-w-xl font-['Spectral'] text-lg leading-relaxed text-[#1a2016]/75">
        Drag the strip below, or read the full list. Members can open every issue;
        the three most recent are free for everyone.
      </p>

      <div className="mt-12">
        <IssueArchive issues={ISSUES} />
      </div>

      <ol className="mt-20 divide-y divide-[#1a2016]/10 border-y border-[#1a2016]/10">
        {ISSUES.map((it, i) => (
          <Reveal key={it.no} delay={i * 0.04}>
            <li className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-5 transition-colors duration-200 hover:bg-[#1a2016]/[0.03]">
              <Mono className="text-[#1a2016]/45">No. {it.no}</Mono>
              <div>
                <h3 className="font-['Fraunces'] text-xl font-semibold tracking-[-0.01em] transition-colors duration-200 group-hover:text-[#3c6b34]">
                  {it.title}
                </h3>
                <p className="mt-1 font-['Spectral'] text-[15px] leading-relaxed text-[#1a2016]/65">{it.dek}</p>
              </div>
              <Mono className="hidden text-[#1a2016]/45 sm:block">{it.date}</Mono>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

function Guide() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Mono className="text-[#3c6b34]">A pocket field guide</Mono>
      <h1 className="mt-3 max-w-3xl font-['Fraunces'] text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
        Six things to find on your next walk.
      </h1>
      <p className="mt-5 max-w-xl font-['Spectral'] text-lg leading-relaxed text-[#1a2016]/75">
        Start here. None of these are rare. All of them are within a few minutes
        of wherever you're reading this.
      </p>

      <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDE.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.07}>
            <article className="group">
              <div className="overflow-hidden rounded-2xl border border-[#1a2016]/12">
                <img
                  src={`https://picsum.photos/seed/${p.seed}/520/420`}
                  alt={`${p.name} growing in situ`}
                  width={520}
                  height={420}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  style={PHOTO_FILTER}
                />
              </div>
              <div className="mt-4">
                <h3 className="font-['Fraunces'] text-xl font-semibold tracking-[-0.01em]">{p.name}</h3>
                <p className="font-['Spectral'] text-[15px] italic text-[#1a2016]/55">{p.latin}</p>
                <p className="mt-2 flex items-center gap-2">
                  <Leaf size={13} className="shrink-0 text-[#3c6b34]" />
                  <Mono className="text-[#1a2016]/60">{p.where}</Mono>
                </p>
                <p className="mt-3 font-['Spectral'] text-[15px] leading-relaxed text-[#1a2016]/78">{p.note}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <Reveal>
          <figure>
            <div className="overflow-hidden rounded-[1.4rem] border border-[#1a2016]/12">
              <img
                src="https://picsum.photos/seed/june-portrait-botanist/620/760"
                alt="June Calloway kneeling beside a wall to inspect a plant"
                width={620}
                height={760}
                loading="lazy"
                className="aspect-[5/6] w-full object-cover"
                style={PHOTO_FILTER}
              />
            </div>
            <figcaption className="mt-3"><Mono className="text-[#1a2016]/55">June Calloway · Bristol, UK</Mono></figcaption>
          </figure>
        </Reveal>

        <div>
          <Mono className="text-[#3c6b34]">About</Mono>
          <h1 className="mt-3 font-['Fraunces'] text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            I spent ten years naming plants nobody asked about.
          </h1>
          <div className="mt-6 space-y-4 font-['Spectral'] text-lg leading-relaxed text-[#1a2016]/80">
            <p>
              I trained as a field botanist and spent a decade surveying hedgerows and
              flood plains for an ecology consultancy. The work I loved least — standing
              in a supermarket car park, IDing what grew in the cracks — turned out to be
              the work I couldn't stop doing on my own time.
            </p>
            <p>
              Wildline started as an email to four friends in 2024. The argument is
              simple: the wild isn't somewhere you drive to. It's the buddleia on the
              railway bridge, the moss on the north wall, the dandelion you've been
              stepping over since Tuesday. Once you can name it, you can't unsee it.
            </p>
            <p>
              Every Sunday I pick one plant, walk to find it, and write you a letter.
              No sponsors, no affiliate links to secateurs. Just readers, which is the
              only arrangement I've found that keeps the writing honest.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { k: "BSc Plant Sciences", v: "Univ. of Bristol" },
              { k: "Field surveys", v: "10 years" },
              { k: "Favourite weed", v: "Herb Robert" },
            ].map((b) => (
              <div key={b.k} className="rounded-xl border border-[#1a2016]/12 p-4">
                <Mono className="text-[#1a2016]/50">{b.k}</Mono>
                <p className="mt-1 font-['Fraunces'] text-base font-semibold">{b.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Subscribe() {
  const [email, setEmail] = useState("")
  const [tier, setTier] = useState("members")
  const [sent, setSent] = useState(false)

  const tiers = [
    { id: "free", name: "Sunday Free", price: "£0", per: "", note: "The three latest letters, every week.", feats: ["Latest 3 issues", "Weekly Sunday email", "Cancel anytime (it's free)"] },
    { id: "members", name: "Members", price: "£6", per: "/mo", note: "The whole archive, ad-free, forever.", feats: ["Every back issue", "Full field-guide library", "Monthly reader walk", "Comments & Q&A"] },
    { id: "patron", name: "Patron", price: "£60", per: "/yr", note: "Members, plus you keep the lights on.", feats: ["Everything in Members", "Signed print, twice a year", "Name in the back of every issue"] },
  ]

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Mono className="text-[#3c6b34]">Subscribe</Mono>
      <h1 className="mt-3 max-w-3xl font-['Fraunces'] text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
        One careful letter, every Sunday morning.
      </h1>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {tiers.map((t) => {
          const active = tier === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTier(t.id)}
              aria-pressed={active}
              className="rounded-2xl border p-6 text-left transition-[border-color,transform,box-shadow] duration-200"
              style={{
                borderColor: active ? GREEN : "rgba(26,32,22,0.14)",
                boxShadow: active ? "0 18px 40px -24px rgba(60,107,52,0.7)" : "none",
                transform: active ? "translateY(-3px)" : "none",
              }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-['Fraunces'] text-xl font-semibold">{t.name}</h3>
                {t.id === "members" && <Mono className="text-[#3c6b34]">Popular</Mono>}
              </div>
              <p className="mt-3 font-['Fraunces'] text-3xl font-semibold tracking-[-0.02em]">
                {t.price}
                <span className="font-['Spectral'] text-base font-normal text-[#1a2016]/55">{t.per}</span>
              </p>
              <p className="mt-2 font-['Spectral'] text-[15px] text-[#1a2016]/70">{t.note}</p>
              <ul className="mt-4 space-y-2">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-['Spectral'] text-[15px] text-[#1a2016]/80">
                    <Leaf size={13} className="mt-1 shrink-0 text-[#3c6b34]" /> {f}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-[#1a2016]/12 bg-[#1a2016] p-8 text-[#f2efe4] sm:p-10">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-3">
              <Leaf size={28} className="text-[#cfe27a]" />
              <h3 className="font-['Fraunces'] text-2xl font-semibold">You're on the list.</h3>
              <p className="max-w-md font-['Spectral'] text-lg leading-relaxed text-[#f2efe4]/80">
                Look for No. 48 this Sunday. Until then, go find a dandelion and
                say hello — it's been waiting.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={(e) => {
                e.preventDefault()
                if (email.includes("@")) setSent(true)
              }}
              className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"
            >
              <div>
                <label htmlFor="wl-email" className="mb-2 block">
                  <Mono className="text-[#cfe27a]">Your email · joining {tiers.find((t) => t.id === tier)?.name}</Mono>
                </label>
                <input
                  id="wl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourstreet.com"
                  className="w-full rounded-full border border-[#f2efe4]/25 bg-transparent px-5 py-3 font-['Spectral'] text-lg text-[#f2efe4] outline-none transition-colors placeholder:text-[#f2efe4]/40 focus:border-[#cfe27a]"
                />
              </div>
              <MagButton type="submit">Subscribe <ArrowUpRight size={15} /></MagButton>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- shell */

const NAV = [
  { to: "", label: "Home", end: true },
  { to: "issues", label: "Issues", end: false },
  { to: "guide", label: "Field Guide", end: false },
  { to: "about", label: "About", end: false },
  { to: "subscribe", label: "Subscribe", end: false },
]

function Layout({ children, base }: { children: ReactNode; base: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f2efe4] font-['Spectral'] text-[#1a2016] antialiased selection:bg-[#3c6b34] selection:text-[#f2efe4]">
      <header className="sticky top-0 z-40 border-b border-[#1a2016]/12 bg-[#f2efe4]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <NavLink to={base} end onClick={() => setOpen(false)}>
            <Wordmark />
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to ? `${base}/${n.to}` : base}
                end={n.end}
                className={({ isActive }) =>
                  `relative font-['JetBrains_Mono'] text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 ${
                    isActive ? "text-[#3c6b34]" : "text-[#1a2016]/60 hover:text-[#1a2016]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span layoutId="wl-underline" className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#3c6b34]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-[#1a2016]/20 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#1a2016]/10 md:hidden"
            >
              <div className="flex flex-col px-5 py-2">
                {NAV.map((n) => (
                  <NavLink
                    key={n.label}
                    to={n.to ? `${base}/${n.to}` : base}
                    end={n.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `border-b border-[#1a2016]/10 py-3 font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.16em] last:border-0 ${
                        isActive ? "text-[#3c6b34]" : "text-[#1a2016]/80"
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="mt-10 border-t border-[#1a2016]/12">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs font-['Spectral'] text-[15px] leading-relaxed text-[#1a2016]/65">
              A weekly field dispatch on the wild plants of the city. Written and
              walked by June Calloway. Reader-funded, sponsor-free.
            </p>
          </div>
          <div>
            <Mono className="text-[#1a2016]/45">Read</Mono>
            <ul className="mt-3 space-y-2">
              {NAV.slice(1).map((n) => (
                <li key={n.label}>
                  <NavLink to={`${base}/${n.to}`} className="font-['Spectral'] text-[15px] text-[#1a2016]/75 transition-colors hover:text-[#3c6b34]">
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Mono className="text-[#1a2016]/45">Elsewhere</Mono>
            <ul className="mt-3 space-y-2 font-['Spectral'] text-[15px] text-[#1a2016]/75">
              <li>Instagram · @wildline</li>
              <li>hello@wildline.email</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1a2016]/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <Mono className="text-[#1a2016]/45">© 2026 Wildline · Bristol, UK</Mono>
            <Mono className="text-[#1a2016]/45">Mind the verge.</Mono>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function Wildline() {
  const { slug } = useParams()
  const base = `/site/${slug}`

  return (
    <MotionConfig reducedMotion="user">
      <Layout base={base}>
        <Routes>
          <Route index element={<Page><Home base={base} /></Page>} />
          <Route path="issues" element={<Page><Issues /></Page>} />
          <Route path="guide" element={<Page><Guide /></Page>} />
          <Route path="about" element={<Page><About /></Page>} />
          <Route path="subscribe" element={<Page><Subscribe /></Page>} />
          <Route path="*" element={<Page><Home base={base} /></Page>} />
        </Routes>
      </Layout>
    </MotionConfig>
  )
}
