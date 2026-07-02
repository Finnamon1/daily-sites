import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { ArrowDownRight, ArrowUpRight, Asterisk } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "Asterisk* — an independent graphic design studio",
  description:
    "Asterisk is a nine-person graphic design studio in Glasgow doing identity, type, motion and digital for brands with something to say. Featured interaction: a three.js hero — a liquid-chrome iridescent 3D asterisk that leans toward your cursor, with satellites parallaxing at different depths off one springed pointer value shared with the DOM layers. Plus a cursor-chasing work preview that leans with pointer velocity (and anchors itself for keyboard & touch), a draw-in SVG process diagram, animated counters, a services marquee and a three.js particle-wave footer.",
  date: "2026-07-02",
  type: "Studio / agency portfolio",
  interaction:
    "Three.js iridescent 3D asterisk hero — chrome PBR mark + orbiting satellites parallax to a single springed pointer value shared with the DOM headline layers. Plus cursor-chasing work previews with velocity lean (keyboard/touch fallbacks), draw-in process diagram, counters, marquee and a WebGL particle-wave footer.",
}

/* --------------------------------------------------------------- palette */
// ink black · bone text · ONE confident accent: acid chartreuse.
// The 3D mark is chrome — its iridescence comes from the environment, not the palette.
const INK = "#0a0a0c"
const PANEL = "#121216"
const LINE = "rgba(238,236,228,0.12)"
const BONE = "#eeece4" // ~17:1 on ink
const MUTE = "#a4a5ae" // ~7:1 on ink
const ACID = "#d7ff3f" // ~16:1 on ink

const DISPLAY = "'Syne', 'Arial Black', sans-serif"
const SANS = "'Space Grotesk', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"
const SERIF = "'Fraunces', Georgia, serif"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7ff3f]"

/* ============================================================ THREE: hero
   The featured element. A chromed 3D asterisk (three crossed capsules) under
   a RoomEnvironment PMREM — metalness 1 + iridescence gives the liquid-metal
   look with zero custom shaders. It reads the SAME springed pointer motion
   values the DOM parallax layers use (design-log: one source, many depths):
   the mark leans, the wireframe shell counters, satellites drift at their own
   factors. Reduced motion renders a single posed frame. */

function AsteriskHero({
  px,
  py,
  reduced,
}: {
  px: MotionValue<number>
  py: MotionValue<number>
  reduced: boolean
}) {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60)
    camera.position.set(0, 0, 8.4)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.06).texture
    scene.environment = envTex

    const root = new THREE.Group()
    scene.add(root)

    // --- the mark: three capsules crossed at 60°
    const chrome = new THREE.MeshPhysicalMaterial({
      color: 0xd8d8de,
      metalness: 1,
      roughness: 0.16,
      iridescence: 0.9,
      iridescenceIOR: 1.7,
      iridescenceThicknessRange: [120, 560],
    })
    const barGeo = new THREE.CapsuleGeometry(0.37, 2.75, 8, 28)
    const mark = new THREE.Group()
    for (let i = 0; i < 3; i++) {
      const bar = new THREE.Mesh(barGeo, chrome)
      bar.rotation.z = (i * Math.PI) / 3
      mark.add(bar)
    }
    root.add(mark)

    // --- faint wireframe shell for depth, counter-rotating
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xeeece4,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    })
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(3.7, 1), shellMat)
    root.add(shell)

    // --- satellites: each orbits AND parallaxes at its own depth factor
    const acidMat = new THREE.MeshBasicMaterial({ color: 0xd7ff3f })
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xeeece4,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    const satGeos = [
      new THREE.IcosahedronGeometry(0.16, 0),
      new THREE.SphereGeometry(0.22, 24, 24),
      new THREE.TetrahedronGeometry(0.3, 0),
      new THREE.TorusGeometry(0.26, 0.075, 12, 40),
    ]
    const sats = [
      { mesh: new THREE.Mesh(satGeos[0], acidMat), r: 2.5, speed: 0.32, phase: 0.4, depth: 0.9, tilt: 0.5 },
      { mesh: new THREE.Mesh(satGeos[1], chrome), r: 3.1, speed: -0.2, phase: 2.4, depth: 0.55, tilt: -0.4 },
      { mesh: new THREE.Mesh(satGeos[2], wireMat), r: 3.5, speed: 0.16, phase: 4.2, depth: 0.3, tilt: 0.8 },
      { mesh: new THREE.Mesh(satGeos[3], chrome), r: 2.15, speed: -0.42, phase: 5.4, depth: 1.25, tilt: 0.2 },
    ]
    sats.forEach((s) => root.add(s.mesh))

    const placeSat = (s: (typeof sats)[number], t: number, cx: number, cy: number) => {
      const a = s.phase + t * s.speed
      s.mesh.position.set(
        Math.cos(a) * s.r + cx * s.depth,
        Math.sin(a) * s.r * 0.55 + Math.sin(a * 0.7) * 0.3 - cy * s.depth * 0.6,
        Math.sin(a + s.tilt) * 1.3,
      )
      s.mesh.rotation.set(a * 0.8, a * 0.5, 0)
    }

    const pose = (t: number, cx: number, cy: number) => {
      mark.rotation.z = 0.35 + t * 0.22
      mark.rotation.y = cx * 0.5 + Math.sin(t * 0.4) * 0.12
      mark.rotation.x = cy * 0.32 + Math.cos(t * 0.5) * 0.08
      mark.position.y = Math.sin(t * 0.6) * 0.12
      shell.rotation.y = -t * 0.05 - cx * 0.1
      shell.rotation.x = t * 0.03
      sats.forEach((s) => placeSat(s, t, cx, cy))
    }

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // desktop: mark sits right of the headline; small screens: above the
      // bottom-anchored text block (white type on light chrome is unreadable)
      root.position.x = w >= 900 ? 2 : 0
      root.position.y = w >= 900 ? 0 : w >= 480 ? 1.7 : 2.05
      root.scale.setScalar(w >= 900 ? 1 : w >= 480 ? 0.55 : 0.44)
      if (reduced) {
        pose(1.8, 0.25, -0.15)
        renderer.render(scene, camera)
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    let raf = 0
    let running = false
    const clock = new THREE.Clock()

    const loop = () => {
      raf = requestAnimationFrame(loop)
      pose(clock.getElapsedTime(), px.get(), py.get())
      renderer.render(scene, camera)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      clock.start()
      loop()
    }
    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    // only burn frames while the hero is actually on screen + tab visible
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0.02,
    })
    io.observe(el)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)

    if (reduced) {
      pose(1.8, 0.25, -0.15)
      renderer.render(scene, camera)
    }

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      barGeo.dispose()
      satGeos.forEach((g) => g.dispose())
      shell.geometry.dispose()
      chrome.dispose()
      shellMat.dispose()
      acidMat.dispose()
      wireMat.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [px, py, reduced])

  return <div ref={wrap} aria-hidden="true" className="absolute inset-0" />
}

/* ==================================================== THREE: footer wave
   A quiet second appearance — a field of acid particles rolling under the
   contact section. Fog fades it into the page ink so it never fights the
   giant email link sitting on top of it. */

function WaveField({ reduced }: { reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(new THREE.Color(INK), 6, 17)
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60)
    camera.position.set(0, 2.4, 9)
    camera.lookAt(0, -0.5, -2)

    const geo = new THREE.PlaneGeometry(38, 20, 110, 54)
    geo.rotateX(-Math.PI / 2)
    const base = (geo.attributes.position.array as Float32Array).slice()
    const mat = new THREE.PointsMaterial({
      color: 0xd7ff3f,
      size: 0.05,
      transparent: true,
      opacity: 0.55,
    })
    const pts = new THREE.Points(geo, mat)
    scene.add(pts)

    const wave = (t: number) => {
      const pos = geo.attributes.position.array as Float32Array
      for (let i = 0; i < pos.length; i += 3) {
        const x = base[i]
        const z = base[i + 2]
        pos[i + 1] = Math.sin(x * 0.5 + t) * 0.42 + Math.cos(z * 0.45 + t * 0.7) * 0.36
      }
      geo.attributes.position.needsUpdate = true
    }

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (reduced) {
        wave(1.4)
        renderer.render(scene, camera)
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    let raf = 0
    let running = false
    const clock = new THREE.Clock()
    const loop = () => {
      raf = requestAnimationFrame(loop)
      wave(clock.getElapsedTime() * 0.7)
      renderer.render(scene, camera)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      loop()
    }
    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0.02,
    })
    io.observe(el)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)

    if (reduced) {
      wave(1.4)
      renderer.render(scene, camera)
    }

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [reduced])

  return <div ref={wrap} aria-hidden="true" className="absolute inset-0" />
}

/* ------------------------------------------------------------------ copy */

type Project = {
  id: string
  name: string
  client: string
  scope: string
  year: string
  poster: "seven" | "arches" | "tandem" | "nightglow" | "softmore" | "knife"
}

const PROJECTS: Project[] = [
  { id: "loud", name: "Loud Numbers", client: "Fintech", scope: "Identity · Motion", year: "2026", poster: "seven" },
  { id: "almost", name: "Museum of Almost", client: "Culture", scope: "Identity · Wayfinding", year: "2025", poster: "arches" },
  { id: "nightglow", name: "NIGHTGLOW", client: "Music festival", scope: "Campaign · Art direction", year: "2026", poster: "nightglow" },
  { id: "tandem", name: "Tandem & Co", client: "Hospitality", scope: "Identity · Packaging", year: "2025", poster: "tandem" },
  { id: "softmore", name: "Softmore", client: "SaaS", scope: "Design system · Digital", year: "2024", poster: "softmore" },
  { id: "knife", name: "Paper Knife", client: "Publishing", scope: "Type family · Editorial", year: "2024", poster: "knife" },
]

const SERVICES = [
  {
    n: "01",
    name: "Identity",
    body: "Marks, systems and guidelines built to survive contact with reality — the tiny favicon, the enormous hoarding, the intern with PowerPoint.",
  },
  {
    n: "02",
    name: "Type",
    body: "Custom typefaces and lettering. When the voice is yours alone, the licence fee is zero and the impersonators are obvious.",
  },
  {
    n: "03",
    name: "Motion",
    body: "Brand motion languages — how the logo arrives, how the numbers count, how it all feels between the frames.",
  },
  {
    n: "04",
    name: "Digital",
    body: "Sites and product surfaces designed and built in the same room, so nothing gets lost in the throw over the wall.",
  },
]

const STEPS = [
  {
    name: "Listen",
    body: "Two weeks of questions before a single sketch. We interview your team, your customers, and at least one person who chose your competitor.",
  },
  {
    name: "Sharpen",
    body: "Strategy on one page, not forty. A position you can say out loud without wincing — that sentence becomes the brief for everything visual.",
  },
  {
    name: "Make",
    body: "Three directions, pushed until they scare us a little. Real applications from day one: no logo floats in white space pretending that's a context.",
  },
  {
    name: "Stress-test",
    body: "We break it on purpose. Smallest size, worst screen, angriest tweet, drunkest photocopy. What survives is the identity.",
  },
  {
    name: "Ship & stay",
    body: "Guidelines, files, typefaces, motion kit — then we stick around for the first campaign, because launch day is where brands actually get made.",
  },
]

const STATS = [
  { value: 9, suffix: "", label: "people, one room" },
  { value: 74, suffix: "", label: "identities shipped" },
  { value: 6, suffix: "", label: "typefaces released" },
  { value: 23, suffix: "", label: "awards in a drawer" },
]

const MARQUEE = [
  "Brand identity",
  "Art direction",
  "Type design",
  "Motion systems",
  "Packaging",
  "Design engineering",
  "Naming",
  "Campaigns",
]

const FOOTNOTES = [
  "Results may include double-takes, screenshots, and competitors quietly updating their logos.",
  "You talk to the people doing the work. We tried account managers once; nobody enjoyed it, including the account manager.",
  "Hand-offs are where good ideas go to become fine ideas. So we don't do them.",
]

/* --------------------------------------------------------------- posters
   No stock photography — a design studio's previews should be designed.
   Each project gets a small poster composed in CSS/SVG. */

function Poster({ kind, className }: { kind: Project["poster"]; className?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: "4 / 3" }}
      aria-hidden="true"
    >
      {kind === "seven" && (
        <div className="absolute inset-0" style={{ background: "#ff5c39" }}>
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(${INK} 1px, transparent 1px)`,
              backgroundSize: "14px 14px",
            }}
          />
          <span
            className="absolute -bottom-8 left-3 leading-none"
            style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "9rem", color: INK }}
          >
            7%
          </span>
          <span
            className="absolute right-3 top-3 text-[10px] tracking-[0.2em]"
            style={{ fontFamily: MONO, color: INK }}
          >
            LOUD/NUM
          </span>
        </div>
      )}
      {kind === "arches" && (
        <div className="absolute inset-0" style={{ background: BONE }}>
          {["#6a5cff", INK, "#6a5cff"].map((c, i) => (
            <div
              key={i}
              className="absolute bottom-0 rounded-t-full"
              style={{
                left: `${8 + i * 26}%`,
                width: "30%",
                height: `${86 - i * 22}%`,
                background: c,
                opacity: i === 2 ? 0.55 : 1,
              }}
            />
          ))}
          <span
            className="absolute left-3 top-3 text-[10px] tracking-[0.2em]"
            style={{ fontFamily: MONO, color: INK }}
          >
            M.O.A. — HALL 2
          </span>
        </div>
      )}
      {kind === "nightglow" && (
        <div className="absolute inset-0" style={{ background: "#050507" }}>
          <div
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: ACID, opacity: 0.5 }}
          />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap leading-none"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "2.1rem",
              color: ACID,
              letterSpacing: "0.06em",
            }}
          >
            NIGHTGLOW
          </span>
          <span
            className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em]"
            style={{ fontFamily: MONO, color: BONE }}
          >
            JUN 12—14 · CLYDESIDE
          </span>
        </div>
      )}
      {kind === "tandem" && (
        <div className="absolute inset-0" style={{ background: "#f2ead9" }}>
          <div
            className="absolute bottom-6 left-6 h-24 w-24 rounded-full border-[6px]"
            style={{ borderColor: INK }}
          />
          <div
            className="absolute bottom-6 right-6 h-24 w-24 rounded-full border-[6px]"
            style={{ borderColor: INK }}
          />
          <div
            className="absolute bottom-[104px] left-1/2 h-1.5 w-28 -translate-x-1/2 -rotate-6"
            style={{ background: "#b8dd2c" }}
          />
          <span
            className="absolute left-1/2 top-4 -translate-x-1/2 text-[10px] tracking-[0.3em]"
            style={{ fontFamily: MONO, color: INK }}
          >
            TANDEM &amp; CO
          </span>
        </div>
      )}
      {kind === "softmore" && (
        <div className="absolute inset-0" style={{ background: "#c9d6ff" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-xl border"
              style={{
                left: `${14 + i * 9}%`,
                top: `${16 + i * 12}%`,
                width: "58%",
                height: "44%",
                background: i === 2 ? INK : "rgba(255,255,255,0.85)",
                borderColor: "rgba(10,10,12,0.2)",
              }}
            >
              {i === 2 && (
                <span
                  className="absolute left-3 top-2.5 text-[10px] tracking-[0.15em]"
                  style={{ fontFamily: MONO, color: ACID }}
                >
                  SOFTMORE/UI
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {kind === "knife" && (
        <div className="absolute inset-0" style={{ background: BONE }}>
          <span
            className="absolute -bottom-10 -left-2 leading-none"
            style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: "11rem", color: INK }}
          >
            Kn
          </span>
          <span
            className="absolute right-3 top-3 text-right text-[10px] leading-relaxed tracking-[0.2em]"
            style={{ fontFamily: MONO, color: INK }}
          >
            PAPER KNIFE
            <br />
            8 STYLES · 2 OPTICAL SIZES
          </span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------ small bits */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[11px] uppercase tracking-[0.28em]"
      style={{ fontFamily: MONO, color: ACID }}
    >
      {children}
    </p>
  )
}

function FootnoteRef({ n }: { n: number }) {
  return (
    <a
      href="#footnotes"
      aria-label={`Footnote ${n}`}
      className={cn("align-super no-underline transition-opacity hover:opacity-70", focusRing)}
      style={{ color: ACID, fontFamily: MONO, fontSize: "0.3em" }}
    >
      *{n}
    </a>
  )
}

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduced = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setN(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduced])

  return (
    <div className="flex flex-col gap-2">
      <span
        ref={ref}
        className="text-5xl leading-none md:text-6xl"
        style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
      >
        {n}
        {suffix}
      </span>
      <span className="text-sm" style={{ fontFamily: MONO, color: MUTE }}>
        {label}
      </span>
    </div>
  )
}

function Marquee() {
  const row = MARQUEE.map((m, i) => (
    <span key={i} className="flex items-center gap-6 pr-6">
      <span
        className="whitespace-nowrap text-2xl md:text-3xl"
        style={{ fontFamily: DISPLAY, fontWeight: 700, color: BONE }}
      >
        {m}
      </span>
      <Asterisk size={22} style={{ color: ACID }} aria-hidden="true" />
    </span>
  ))
  return (
    <div
      className="overflow-hidden border-y py-5"
      style={{ borderColor: LINE }}
      aria-label={`Services: ${MARQUEE.join(", ")}`}
    >
      <div className="ast-marquee flex w-max">
        <div className="flex" aria-hidden="true">
          {row}
        </div>
        <div className="flex" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- work section
   One window pointermove listener drives a single fixed preview card via
   springed x/y; pointer dx is clamped into a springed lean (±9°). Keyboard
   focus anchors the same card to the focused row's rect; touch/small screens
   get an always-visible inline poster. (Design-log lessons, all three.) */

function WorkSection() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<Project | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const lean = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 190, damping: 22 })
  const sy = useSpring(y, { stiffness: 190, damping: 22 })
  const sLean = useSpring(lean, { stiffness: 140, damping: 16 })
  const lastX = useRef(0)

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX.current
      lastX.current = e.clientX
      x.set(e.clientX)
      y.set(e.clientY)
      lean.set(Math.max(-9, Math.min(9, dx * 0.7)))
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [reduced, x, y, lean])

  const anchorToRow = (el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    const w = Math.min(320, window.innerWidth * 0.32)
    x.jump(Math.min(r.right - w * 0.4, window.innerWidth - w * 0.6 - 16))
    y.jump(r.top + r.height / 2)
    lean.jump(0)
  }

  const enter = (p: Project) => (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) anchorToRow(e.currentTarget)
    setActive(p)
  }
  const focus = (p: Project) => (e: React.FocusEvent<HTMLElement>) => {
    anchorToRow(e.currentTarget)
    setActive(p)
  }
  const clear = () => setActive(null)

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Eyebrow>Selected work · 2024—26</Eyebrow>
            <h2
              className="text-4xl md:text-6xl"
              style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
            >
              The proof.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed" style={{ color: MUTE }}>
            Six of seventy-four. Hover a row — or tab through them — and the
            work introduces itself.
          </p>
        </div>
      </Reveal>

      <ul ref={listRef} className="border-t" style={{ borderColor: LINE }}>
        {PROJECTS.map((p, i) => (
          <li key={p.id} className="border-b" style={{ borderColor: LINE }}>
            <a
              href="#contact"
              aria-label={`${p.name} — ${p.client}, ${p.scope}, ${p.year}`}
              onPointerEnter={enter(p)}
              onPointerLeave={clear}
              onFocus={focus(p)}
              onBlur={clear}
              className={cn(
                "group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-3 py-5 no-underline transition-colors duration-200 md:grid-cols-[3rem_1fr_11rem_9.5rem_2rem] md:py-6",
                focusRing,
              )}
            >
              <span className="text-xs" style={{ fontFamily: MONO, color: MUTE }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-2xl transition-transform duration-200 group-hover:translate-x-2 group-focus-visible:translate-x-2 md:text-4xl"
                style={{ fontFamily: DISPLAY, fontWeight: 700, color: BONE }}
              >
                {p.name}
              </span>
              <span className="hidden text-sm md:block" style={{ fontFamily: MONO, color: MUTE }}>
                {p.scope}
              </span>
              <span
                className="text-xs md:justify-self-end md:text-sm"
                style={{ fontFamily: MONO, color: MUTE }}
              >
                {p.client} · {p.year}
              </span>
              <ArrowUpRight
                size={20}
                aria-hidden="true"
                className="hidden opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
                style={{ color: ACID }}
              />
              {/* touch / small screens: the poster is simply there */}
              <div className="col-span-3 md:hidden">
                <Poster kind={p.poster} className="rounded-lg" />
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* the one floating preview node (desktop only) */}
      <div className="pointer-events-none fixed inset-0 z-40 hidden md:block" aria-hidden="true">
        <motion.div style={{ x: sx, y: sy }} className="absolute left-0 top-0">
          <div className="-translate-x-[45%] -translate-y-[55%]">
            <AnimatePresence>
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86 }}
                  transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
                  style={{ rotate: sLean, width: "min(320px, 32vw)" }}
                  className="overflow-hidden rounded-xl shadow-2xl"
                >
                  <Poster kind={active.poster} />
                  <div
                    className="flex items-center justify-between px-3 py-2 text-[11px]"
                    style={{ background: PANEL, fontFamily: MONO, color: MUTE }}
                  >
                    <span style={{ color: BONE }}>{active.name}</span>
                    <span>{active.year}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- process
   Draw-in linework: the route from brief to ship assembles stroke by stroke
   (pathLength 0→1, per-edge delay). Every node is a real button — pointer
   and keyboard share one activate handler. */

function ProcessSection() {
  const [step, setStep] = useState(0)
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  const nodes = [
    { x: 70, y: 210 },
    { x: 280, y: 90 },
    { x: 500, y: 230 },
    { x: 720, y: 80 },
    { x: 930, y: 190 },
  ]

  return (
    <section id="process" className="border-t" style={{ borderColor: LINE, background: PANEL }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <div className="mb-10 flex flex-col gap-4">
            <Eyebrow>Process</Eyebrow>
            <h2
              className="max-w-xl text-4xl md:text-6xl"
              style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
            >
              Five stops. No mystery.
            </h2>
          </div>
        </Reveal>

        <svg
          ref={ref}
          viewBox="0 0 1000 300"
          className="w-full"
          role="group"
          aria-label="Our five-step process. Use tab to explore each step."
        >
          {nodes.slice(0, -1).map((n, i) => (
            <motion.line
              key={i}
              x1={n.x}
              y1={n.y}
              x2={nodes[i + 1].x}
              y2={nodes[i + 1].y}
              stroke={LINE}
              strokeWidth={2}
              strokeDasharray="1 0"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.18, ease: "easeOut" }}
            />
          ))}
          {nodes.map((n, i) => {
            const on = step === i
            return (
              <g key={i}>
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={on ? 13 : 9}
                  fill={on ? ACID : PANEL}
                  stroke={on ? ACID : MUTE}
                  strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.18 }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
                <text
                  x={n.x}
                  y={n.y + (n.y > 150 ? 42 : -30)}
                  textAnchor="middle"
                  fill={on ? BONE : MUTE}
                  style={{ fontFamily: MONO, fontSize: 15, letterSpacing: "0.08em" }}
                >
                  {String(i + 1).padStart(2, "0")} {STEPS[i].name.toUpperCase()}
                </text>
                {/* invisible hotspot: pointer + keyboard drive the same state */}
                <rect
                  x={n.x - 70}
                  y={n.y - 55}
                  width={140}
                  height={110}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`Step ${i + 1}: ${STEPS[i].name}`}
                  aria-pressed={on}
                  className="cursor-pointer focus:outline-none"
                  onPointerEnter={() => setStep(i)}
                  onFocus={() => setStep(i)}
                  onClick={() => setStep(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setStep(i)
                    }
                  }}
                />
              </g>
            )
          })}
        </svg>

        <div
          className="mt-6 min-h-[7rem] max-w-2xl rounded-xl border p-6"
          style={{ borderColor: LINE, background: INK }}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-2 text-sm" style={{ fontFamily: MONO, color: ACID }}>
                {String(step + 1).padStart(2, "0")} — {STEPS[step].name}
              </p>
              <p className="text-base leading-relaxed md:text-lg" style={{ color: BONE }}>
                {STEPS[step].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- studio */

function StudioSection() {
  const reduced = useReducedMotion()
  return (
    <section id="studio" className="relative overflow-hidden border-t" style={{ borderColor: LINE }}>
      {/* morphing blob — organic, never repeats, gated on reduced motion */}
      <motion.div
        aria-hidden="true"
        className="absolute -right-24 top-16 h-96 w-96 blur-3xl"
        style={{
          background: `linear-gradient(135deg, ${ACID}, #3fd0ff)`,
          mixBlendMode: "screen",
          opacity: 0.16,
        }}
        animate={
          reduced
            ? undefined
            : {
                borderRadius: [
                  "62% 38% 42% 58% / 56% 44% 56% 44%",
                  "38% 62% 58% 42% / 44% 56% 44% 56%",
                  "55% 45% 38% 62% / 62% 38% 60% 40%",
                  "62% 38% 42% 58% / 56% 44% 56% 44%",
                ],
                rotate: [0, 25, -15, 0],
                scale: [1, 1.12, 0.94, 1],
              }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-14 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <Eyebrow>The studio</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl leading-[1.05] md:text-6xl"
                style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
              >
                Nine people. One room. No account managers.
                <FootnoteRef n={2} />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-lg text-lg leading-relaxed" style={{ color: MUTE }}>
                Asterisk started in 2017 in a Glasgow tenement with two laptops
                and a Risograph that only printed in one colour. The Riso has
                been forgiven. The principle stuck: small team, senior hands,
                and the person presenting the work is the person who made it.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-2 flex flex-col gap-3">
                {[
                  "We take on eight identity projects a year. Not nine.",
                  "Strategy and design in the same heads — nothing thrown over walls.",
                  "If we're not the right studio, we'll tell you who is.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-base" style={{ color: BONE }}>
                    <Asterisk size={16} className="mt-1 shrink-0" style={{ color: ACID }} aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="grid content-center gap-10 sm:grid-cols-2">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <Counter value={s.value} suffix={s.suffix} label={s.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- page */

export default function AsteriskSite() {
  const reduced = useReducedMotion() ?? false

  // ONE springed pointer source (-1..1); the WebGL scene and every DOM
  // parallax layer subscribe to it at their own depth factor.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spx = useSpring(px, { stiffness: 55, damping: 18 })
  const spy = useSpring(py, { stiffness: 55, damping: 18 })

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1)
      py.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [reduced, px, py])

  // DOM layers: headline moves least, glow moves most (far vs near)
  const headX = useTransform(spx, (v) => v * -7)
  const headY = useTransform(spy, (v) => v * -5)
  const glowX = useTransform(spx, (v) => v * 26)
  const glowY = useTransform(spy, (v) => v * 20)

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ background: INK, color: BONE, fontFamily: SANS }} className="min-h-screen">
        <style>{`
          .ast-marquee { animation: ast-scroll 28s linear infinite; }
          @keyframes ast-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @media (prefers-reduced-motion: reduce) { .ast-marquee { animation: none; } }
          .ast-email:hover, .ast-email:focus-visible { color: ${ACID}; }
        `}</style>

        {/* ------------------------------------------------------- header */}
        <header
          className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
          style={{ borderColor: LINE, background: "rgba(10,10,12,0.72)" }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* ml clears the gallery back-chip SiteView pins at left-4 top-4 */}
            <a
              href="#top"
              className={cn(
                "group ml-24 flex items-center gap-2 no-underline min-[1440px]:ml-0",
                focusRing,
              )}
              aria-label="Asterisk studio — back to top"
            >
              <motion.span
                className="inline-flex"
                whileHover={reduced ? undefined : { rotate: 120 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Asterisk size={22} style={{ color: ACID }} aria-hidden="true" />
              </motion.span>
              <span className="hidden text-lg sm:inline" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                asterisk
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
              {[
                ["Work", "#work"],
                ["Process", "#process"],
                ["Studio", "#studio"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm no-underline transition-colors duration-200 hover:text-[#d7ff3f]",
                    focusRing,
                  )}
                  style={{ fontFamily: MONO, color: MUTE }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Magnetic strength={0.3}>
              <a
                href="#contact"
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm no-underline transition-transform duration-200 hover:scale-[1.03]",
                  focusRing,
                )}
                style={{ background: ACID, color: INK, fontFamily: MONO, fontWeight: 600 }}
              >
                Start a project
              </a>
            </Magnetic>
          </div>
        </header>

        <main id="top">
          {/* -------------------------------------------------------- hero */}
          <section className="relative flex min-h-screen flex-col justify-end overflow-hidden pt-16">
            {/* smooth DOM glow under the canvas (CSS gradients stay buttery) */}
            <motion.div
              aria-hidden="true"
              className="absolute right-[-10%] top-[8%] h-[70vmin] w-[70vmin] rounded-full"
              style={{
                x: glowX,
                y: glowY,
                background: `radial-gradient(circle, rgba(215,255,63,0.14) 0%, rgba(63,208,255,0.07) 40%, transparent 70%)`,
              }}
            />
            <AsteriskHero px={spx} py={spy} reduced={reduced} />
            {/* small screens: ink scrim so type never sits on bare chrome */}
            <div
              aria-hidden="true"
              className="absolute inset-0 md:hidden"
              style={{ background: `linear-gradient(to top, ${INK} 42%, rgba(10,10,12,0.55) 62%, transparent 80%)` }}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-28 md:pb-20">
              <motion.div style={{ x: headX, y: headY }} className="flex max-w-3xl flex-col gap-6">
                <Reveal>
                  <Eyebrow>Asterisk* — graphic design studio · Glasgow &amp; remote</Eyebrow>
                </Reveal>
                <Reveal delay={0.08}>
                  <h1
                    className="text-[13vw] leading-[0.95] sm:text-7xl md:text-8xl"
                    style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
                  >
                    Brands you
                    <br />
                    can&rsquo;t unsee.
                    <FootnoteRef n={1} />
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: MUTE }}>
                    Identity, type, motion and digital for companies that would
                    rather be remembered than liked by everyone.
                  </p>
                </Reveal>
                <Reveal delay={0.24}>
                  <div className="mt-2 flex flex-wrap items-center gap-5">
                    <Magnetic strength={0.35}>
                      <a
                        href="#contact"
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base no-underline transition-transform duration-200 hover:scale-[1.03]",
                          focusRing,
                        )}
                        style={{ background: ACID, color: INK, fontFamily: MONO, fontWeight: 600 }}
                      >
                        Start a project <ArrowUpRight size={18} aria-hidden="true" />
                      </a>
                    </Magnetic>
                    <Magnetic strength={0.25}>
                      <a
                        href="#work"
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-base no-underline transition-colors duration-200 hover:border-[#d7ff3f] hover:text-[#d7ff3f]",
                          focusRing,
                        )}
                        style={{ borderColor: LINE, color: BONE, fontFamily: MONO }}
                      >
                        See the work <ArrowDownRight size={18} aria-hidden="true" />
                      </a>
                    </Magnetic>
                  </div>
                </Reveal>
              </motion.div>

              <Reveal delay={0.3}>
                <div
                  className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t pt-6 text-xs uppercase tracking-[0.2em]"
                  style={{ borderColor: LINE, fontFamily: MONO, color: MUTE }}
                >
                  <span>Est. 2017</span>
                  <span>74 identities shipped</span>
                  <span>8 projects a year, max</span>
                  <span style={{ color: ACID }}>2 slots open for autumn</span>
                </div>
              </Reveal>
            </div>
          </section>

          <Marquee />

          <WorkSection />

          {/* ------------------------------------------------ capabilities */}
          <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
            <Reveal>
              <div className="mb-12 flex flex-col gap-4">
                <Eyebrow>Capabilities</Eyebrow>
                <h2
                  className="max-w-2xl text-4xl md:text-6xl"
                  style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
                >
                  Four crafts, zero hand-offs.
                  <FootnoteRef n={3} />
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2" style={{ borderColor: LINE, background: LINE }}>
              {SERVICES.map((s, i) => (
                <div
                  key={s.n}
                  className="group flex flex-col gap-4 p-8 transition-colors duration-200 md:p-10"
                  style={{ background: i % 3 === 0 ? PANEL : INK }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm" style={{ fontFamily: MONO, color: ACID }}>
                      {s.n}
                    </span>
                    <Asterisk
                      size={18}
                      aria-hidden="true"
                      className="opacity-20 transition-all duration-300 group-hover:rotate-90 group-hover:opacity-100"
                      style={{ color: ACID }}
                    />
                  </div>
                  <h3 className="text-3xl" style={{ fontFamily: DISPLAY, fontWeight: 700, color: BONE }}>
                    {s.name}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: MUTE }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <ProcessSection />

          <StudioSection />

          {/* ----------------------------------------------------- contact */}
          <section id="contact" className="relative overflow-hidden border-t" style={{ borderColor: LINE }}>
            <WaveField reduced={reduced} />
            <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(${INK} 0%, transparent 35%, transparent 75%, ${INK} 100%)` }} aria-hidden="true" />
            <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-28 md:py-40">
              <Reveal>
                <Eyebrow>Contact</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2
                  className="max-w-3xl text-4xl leading-[1.02] md:text-7xl"
                  style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
                >
                  Got something worth saying?
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <Magnetic strength={0.2}>
                  <a
                    href="mailto:hello@asterisk.studio"
                    className={cn(
                      "ast-email break-all text-2xl underline decoration-2 underline-offset-8 transition-colors duration-200 sm:text-4xl md:text-5xl",
                      focusRing,
                    )}
                    style={{ fontFamily: DISPLAY, fontWeight: 700, color: BONE, textDecorationColor: ACID }}
                  >
                    hello@asterisk.studio
                  </a>
                </Magnetic>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="max-w-md text-base leading-relaxed" style={{ color: MUTE }}>
                  Tell us what you make, who it&rsquo;s for, and what&rsquo;s not
                  working. We reply within two working days — usually with
                  questions.
                </p>
              </Reveal>
            </div>
          </section>

          {/* --------------------------------------------------- footnotes */}
          <footer className="border-t" style={{ borderColor: LINE }}>
            <div className="mx-auto max-w-6xl px-6 py-12">
              <ol id="footnotes" aria-label="Footnotes" className="mb-10 flex max-w-2xl flex-col gap-3">
                {FOOTNOTES.map((f, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: MUTE }}>
                    <span style={{ fontFamily: MONO, color: ACID }}>*{i + 1}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ol>
              <div
                className="flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-xs uppercase tracking-[0.18em]"
                style={{ borderColor: LINE, fontFamily: MONO, color: MUTE }}
              >
                <span>© 2026 Asterisk Studio Ltd — Glasgow</span>
                <span className="flex items-center gap-2">
                  Set in Syne &amp; Space Grotesk
                  <Asterisk size={14} style={{ color: ACID }} aria-hidden="true" />
                  Rendered in three.js
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}
