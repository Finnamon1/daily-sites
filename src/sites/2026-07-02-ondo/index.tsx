import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { ArrowUpRight, Flame, Hand, MoveHorizontal } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "ONDO — wheel-thrown stoneware, fired slow",
  description:
    "A two-kiln ceramics studio in Porto selling wheel-thrown stoneware in small series. Featured interaction: a persistent three.js pottery stage — one vessel, built from a custom lathe geometry, morphs between four thrown forms as you scroll (profiles lerped vertex-by-vertex), spins on the wheel with drag inertia (arrow keys work too), and re-glazes live as you pick from five cone-10 glazes with real PBR material changes. Plus a draw-in kiln firing-curve chart with keyboard-reachable stages, animated counters and scroll reveals.",
  date: "2026-07-02",
  type: "Craft e-commerce / ceramics studio",
  interaction:
    "Scroll-driven three.js pottery stage — one custom-lathe vessel morphs between four thrown forms as you scroll, drag (or arrow-key) to spin with inertia, and swap five cone-10 glazes as live PBR materials. Plus a draw-in firing-curve chart, counters and reveals.",
}

/* --------------------------------------------------------------- palette */
// warm paper, near-black clay ink, ONE accent: terracotta. Chart line uses the
// accent (validated ≥3:1 on the surface); glazes live in the 3D material only.
const PAPER = "#f4efe6"
const PAPER_2 = "#ece5d6"
const INK = "#241d17" // ~13:1 on paper
const MUTE = "#6b6155" // ~5.4:1 on paper
const LINE = "rgba(36,29,23,0.16)"
const TERRA = "#a34a24" // accent, ~5:1 on paper

const DISPLAY = "'Fraunces', Georgia, serif"
const SANS = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a34a24]"

/* ------------------------------------------------------------- profiles
   Every form is 12 control radii from foot (t=0) to lip (t=1), smoothed with
   Catmull-Rom and sampled once at module load. The SAME data draws the 3D
   vessel (lathe rings) and the 2D silhouettes in the collection — one source
   of truth for every shape on the page. */

const ROWS = 72
const SEGS = 64
const BODY_H = 2.6

function sampleProfile(ctrl: number[]): number[] {
  const n = ctrl.length - 1
  const out: number[] = []
  for (let i = 0; i <= ROWS; i++) {
    const t = (i / ROWS) * n
    const k = Math.min(Math.floor(t), n - 1)
    const u = t - k
    const p0 = ctrl[Math.max(k - 1, 0)]
    const p1 = ctrl[k]
    const p2 = ctrl[k + 1]
    const p3 = ctrl[Math.min(k + 2, n)]
    out.push(
      0.5 *
        (2 * p1 +
          (-p0 + p2) * u +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
          (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u),
    )
  }
  return out
}

type Form = {
  id: string
  name: string
  dims: string
  price: string
  blurb: string
  hScale: number
  radii: number[]
}

const FORMS: Form[] = [
  {
    id: "carafe",
    name: "Carafe No. 7",
    dims: "H 26 cm · 900 ml",
    price: "€140",
    blurb:
      "Our first form and still the hardest to throw well. The belly holds a litre of anything; the neck is turned to pour without a drip. Seventh revision in nine years.",
    hScale: 1,
    radii: sampleProfile([0.5, 0.74, 0.94, 1.04, 1.0, 0.84, 0.6, 0.38, 0.27, 0.24, 0.26, 0.34]),
  },
  {
    id: "bowl",
    name: "Breakfast Bowl",
    dims: "Ø 15 cm · H 8 cm",
    price: "€55",
    blurb:
      "Thrown forty at a time so no two are identical and none are strangers. A high foot keeps knuckles off hot porridge; the curve is calibrated to the last spoonful.",
    hScale: 0.52,
    radii: sampleProfile([0.42, 0.58, 0.78, 0.95, 1.08, 1.17, 1.23, 1.27, 1.29, 1.3, 1.3, 1.29]),
  },
  {
    id: "moonjar",
    name: "Moon Jar",
    dims: "Ø 32 cm · H 34 cm",
    price: "€480",
    blurb:
      "Two thrown hemispheres joined at the equator, the old Korean way. The seam stays faintly visible — the point is that it was made by hands, not a mould.",
    hScale: 1.05,
    radii: sampleProfile([0.42, 0.72, 0.98, 1.14, 1.22, 1.24, 1.19, 1.06, 0.85, 0.62, 0.45, 0.42]),
  },
  {
    id: "budvase",
    name: "Bud Vase",
    dims: "H 30 cm · one stem",
    price: "€85",
    blurb:
      "A vase for people who think one stem is enough. The neck is thrown to a pencil's width; the counterweight belly means the cat has to really try.",
    hScale: 1.15,
    radii: sampleProfile([0.4, 0.54, 0.62, 0.63, 0.58, 0.46, 0.32, 0.22, 0.17, 0.15, 0.14, 0.18]),
  },
]

/* ---------------------------------------------------------------- glazes */

type Glaze = {
  id: string
  name: string
  note: string
  swatch: string
  color: number
  roughness: number
  clearcoat: number
}

const GLAZES: Glaze[] = [
  { id: "nuka", name: "Nuka", note: "rice-straw ash · warm white", swatch: "#e6e0d0", color: 0xe6e0d0, roughness: 0.42, clearcoat: 0.5 },
  { id: "celadon", name: "Celadon", note: "iron in reduction · pale jade", swatch: "#a9c0ae", color: 0xa9c0ae, roughness: 0.28, clearcoat: 0.7 },
  { id: "tenmoku", name: "Tenmoku", note: "iron-saturated · near black", swatch: "#38261c", color: 0x38261c, roughness: 0.18, clearcoat: 1 },
  { id: "indigo", name: "Indigo", note: "cobalt wash · deep sea", swatch: "#33506e", color: 0x33506e, roughness: 0.32, clearcoat: 0.6 },
  { id: "raw", name: "Raw clay", note: "unglazed · bare stoneware", swatch: "#b1714f", color: 0xb1714f, roughness: 0.95, clearcoat: 0 },
]

/* ===================================================== THREE: the stage
   One canvas carries the whole top of the page. A custom lathe mesh whose
   ring radii are lerped toward the active form's profile every frame (normals
   recomputed only while actually morphing), sitting on a slowly turning
   throwing wheel. Drag or arrow keys spin it with inertia; glazes are live
   MeshPhysicalMaterial changes. Reduced motion: no auto-spin, instant morphs,
   render-on-demand instead of a hot loop. */

type StageState = { form: number; glaze: Glaze }

function VesselStage({
  stage,
  reduced,
}: {
  stage: StageState
  reduced: boolean
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const stageRef = useRef(stage)
  stageRef.current = stage

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    el.appendChild(renderer.domElement)
    renderer.domElement.style.touchAction = "pan-y"
    renderer.domElement.style.cursor = "grab"

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60)
    camera.position.set(0, 0.9, 7)
    camera.lookAt(0, -0.1, 0)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.05).texture
    scene.environment = envTex
    scene.environmentIntensity = 0.75

    const key = new THREE.DirectionalLight(0xfff0dd, 1.9)
    key.position.set(4, 6, 3)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xdfe8f0, 0.5)
    fill.position.set(-5, 2, -2)
    scene.add(fill)

    const root = new THREE.Group()
    scene.add(root)

    // --- vessel: indexed rings, no seam, fan-capped foot
    const vertCount = (ROWS + 1) * SEGS + 1
    const positions = new Float32Array(vertCount * 3)
    const indices: number[] = []
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < SEGS; j++) {
        const a = i * SEGS + j
        const b = i * SEGS + ((j + 1) % SEGS)
        const c = (i + 1) * SEGS + j
        const d = (i + 1) * SEGS + ((j + 1) % SEGS)
        indices.push(a, b, c, b, d, c)
      }
    }
    const centerIdx = (ROWS + 1) * SEGS
    for (let j = 0; j < SEGS; j++) indices.push(centerIdx, j, (j + 1) % SEGS)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setIndex(indices)

    const writeVessel = (radii: number[], hScale: number) => {
      const pos = geo.attributes.position.array as Float32Array
      for (let i = 0; i <= ROWS; i++) {
        const y = (i / ROWS - 0.42) * BODY_H * hScale
        const r = Math.max(radii[i], 0.02)
        for (let j = 0; j < SEGS; j++) {
          const a = (j / SEGS) * Math.PI * 2
          const k = (i * SEGS + j) * 3
          pos[k] = Math.cos(a) * r
          pos[k + 1] = y
          pos[k + 2] = Math.sin(a) * r
        }
      }
      const ck = centerIdx * 3
      pos[ck] = 0
      pos[ck + 1] = -0.42 * BODY_H * hScale
      pos[ck + 2] = 0
      geo.attributes.position.needsUpdate = true
      geo.computeVertexNormals()
    }

    const startGlaze = GLAZES[0]
    const mat = new THREE.MeshPhysicalMaterial({
      color: startGlaze.color,
      roughness: startGlaze.roughness,
      clearcoat: startGlaze.clearcoat,
      clearcoatRoughness: 0.35,
      side: THREE.DoubleSide,
    })
    const vessel = new THREE.Mesh(geo, mat)
    root.add(vessel)

    // --- the wheel it sits on
    const wheelGeo = new THREE.CylinderGeometry(1.85, 1.95, 0.16, 64)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x8d8378, roughness: 0.85, metalness: 0.1 })
    const wheel = new THREE.Mesh(wheelGeo, wheelMat)
    const rimGeo = new THREE.TorusGeometry(1.9, 0.035, 10, 72)
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x5e564c, roughness: 0.6 })
    const rim = new THREE.Mesh(rimGeo, rimMat)
    rim.rotation.x = Math.PI / 2
    root.add(wheel, rim)

    // --- morph + spin + glaze state
    const cur = FORMS[0].radii.slice()
    let curH = FORMS[0].hScale
    let rot = 0.4
    let vel = reduced ? 0 : 0.3 // rad/s baseline
    const AUTO = reduced ? 0 : 0.3
    const targetColor = new THREE.Color(startGlaze.color)
    let dirty = true

    writeVessel(cur, curH)

    const layout = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      root.position.x = w >= 900 ? 1.55 : 0
      root.position.y = w >= 900 ? -0.35 : w >= 480 ? 0.95 : 1.25
      root.scale.setScalar(w >= 900 ? 1 : w >= 480 ? 0.58 : 0.48)
      dirty = true
    }
    const ro = new ResizeObserver(layout)
    ro.observe(el)
    layout()

    // drag / keys → spin with inertia
    let dragging = false
    let lastX = 0
    let lastT = 0
    const dom = renderer.domElement
    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastT = performance.now()
      dom.setPointerCapture(e.pointerId)
      dom.style.cursor = "grabbing"
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dx = e.clientX - lastX
      const dt = Math.max(now - lastT, 8) / 1000
      rot += dx * 0.008
      vel = (dx * 0.008) / dt
      lastX = e.clientX
      lastT = now
      dirty = true
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      dom.releasePointerCapture(e.pointerId)
      dom.style.cursor = "grab"
    }
    dom.addEventListener("pointerdown", onDown)
    dom.addEventListener("pointermove", onMove)
    dom.addEventListener("pointerup", onUp)
    dom.addEventListener("pointercancel", onUp)

    const nudge = (dir: number) => {
      vel = dir * 2.4
      dirty = true
    }
    ;(el as HTMLDivElement & { __nudge?: (d: number) => void }).__nudge = nudge

    const clock = new THREE.Clock()
    let raf = 0
    let running = false

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const s = stageRef.current
      const form = FORMS[s.form]

      // morph rings toward the active profile
      const ease = reduced ? 1 : Math.min(dt * 5, 1)
      let maxD = 0
      for (let i = 0; i <= ROWS; i++) {
        const d = form.radii[i] - cur[i]
        if (Math.abs(d) > maxD) maxD = Math.abs(d)
        cur[i] += d * ease
      }
      const dH = form.hScale - curH
      curH += dH * ease
      if (maxD > 0.0006 || Math.abs(dH) > 0.0006) {
        writeVessel(cur, curH)
        dirty = true
      }
      // the wheel stays under the foot, whatever height the form is
      const footY = -0.42 * BODY_H * curH
      wheel.position.y = footY - 0.09
      rim.position.y = footY - 0.09

      // glaze: live material lerp, time-based so low framerates still converge
      const gEase = reduced ? 1 : 1 - Math.exp(-dt * 6)
      targetColor.set(s.glaze.color)
      if (!mat.color.equals(targetColor)) {
        mat.color.lerp(targetColor, gEase)
        dirty = true
      }
      const rD = s.glaze.roughness - mat.roughness
      const cD = s.glaze.clearcoat - mat.clearcoat
      if (Math.abs(rD) > 0.002 || Math.abs(cD) > 0.002) {
        mat.roughness += rD * gEase
        mat.clearcoat += cD * gEase
        dirty = true
      }

      // spin with inertia, settling back to the wheel's own speed
      if (!dragging) vel += (AUTO - vel) * Math.min(dt * 1.2, 1)
      if (Math.abs(vel) > 0.0001) {
        rot += vel * dt
        if (Math.abs(vel - AUTO) > 0.001 || AUTO !== 0) dirty = true
      }
      vessel.rotation.y = rot
      wheel.rotation.y = rot * 0.85

      if (dirty) {
        renderer.render(scene, camera)
        dirty = false
      }
    }
    const start = () => {
      if (running) return
      running = true
      clock.start()
      tick()
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

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      dom.removeEventListener("pointerdown", onDown)
      dom.removeEventListener("pointermove", onMove)
      dom.removeEventListener("pointerup", onUp)
      dom.removeEventListener("pointercancel", onUp)
      geo.dispose()
      wheelGeo.dispose()
      rimGeo.dispose()
      mat.dispose()
      wheelMat.dispose()
      rimMat.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
    // stage flows through stageRef so the scene never tears down on step change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div
      ref={wrap}
      tabIndex={0}
      role="img"
      aria-label={`Interactive 3D vessel: ${FORMS[stage.form].name} in ${stage.glaze.name} glaze. Drag, or press the left and right arrow keys, to spin it on the wheel.`}
      className={cn("absolute inset-0", focusRing)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault()
          const nudge = (wrap.current as (HTMLDivElement & { __nudge?: (d: number) => void }) | null)?.__nudge
          nudge?.(e.key === "ArrowLeft" ? -1 : 1)
        }
      }}
    />
  )
}

/* -------------------------------------------------- 2D silhouettes (SVG)
   Drawn from the same profile arrays as the 3D mesh. */

function silhouettePath(form: Form, w = 150, h = 150): string {
  const half = w / 2
  const bodyH = h * 0.82 * form.hScale
  const y0 = h - (h - bodyH) / 2
  const maxR = Math.max(...form.radii)
  const step = Math.max(1, Math.floor(ROWS / 36))
  const pts: [number, number][] = []
  for (let i = 0; i <= ROWS; i += step) {
    const t = i / ROWS
    const r = (form.radii[i] / maxR) * half * 0.86
    pts.push([half + r, y0 - t * bodyH])
  }
  const right = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  const left = pts
    .slice()
    .reverse()
    .map(([x, y]) => `L${(w - x).toFixed(1)},${y.toFixed(1)}`)
    .join(" ")
  return `${right} ${left} Z`
}

/* ------------------------------------------------------------ small bits */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.26em]" style={{ fontFamily: MONO, color: TERRA }}>
      {children}
    </p>
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
    const c = animate(0, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value, reduced])
  return (
    <div className="flex flex-col gap-1.5">
      <span
        ref={ref}
        className="text-5xl md:text-6xl"
        style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK, fontVariationSettings: "'opsz' 72" }}
      >
        {n.toLocaleString()}
        {suffix}
      </span>
      <span className="text-sm" style={{ fontFamily: MONO, color: MUTE }}>
        {label}
      </span>
    </div>
  )
}

/* -------------------------------------------------------- stage + steps */

const STEP_FORM = [0, 1, 2, 3, 2] // last step (glazes) keeps the moon jar up

function StageSection() {
  const reduced = useReducedMotion() ?? false
  const [step, setStep] = useState(0)
  const [glaze, setGlaze] = useState<Glaze>(GLAZES[0])
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = stepsRef.current
    if (!root) return
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    )
    panels.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [])

  const activeForm = FORMS[STEP_FORM[step]]

  return (
    <section id="forms" className="relative">
      {/* the persistent stage */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* warm kiln glow + contact shadow — DOM gradients stay smooth */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-y-1/2 rounded-full md:left-[62%] md:-translate-x-1/3"
          style={{ background: "radial-gradient(circle, rgba(217,123,41,0.16) 0%, rgba(163,74,36,0.06) 45%, transparent 70%)", transform: "translate(-50%,-50%)" }}
        />
        <VesselStage stage={{ form: STEP_FORM[step], glaze }} reduced={reduced} />
        {/* small screens: paper scrim so hero type never sits on the vessel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: `linear-gradient(to top, ${PAPER} 34%, rgba(244,239,230,0.6) 52%, transparent 68%)` }}
        />
        {/* form name chip, bottom of stage */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center md:flex">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeForm.id + (step === 4 ? glaze.id : "")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: MONO, color: MUTE, borderColor: LINE, background: "rgba(244,239,230,0.8)" }}
            >
              {activeForm.name}
              {step === 4 ? ` — ${glaze.name}` : ""}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* the scroll track laid over it */}
      <div ref={stepsRef} className="pointer-events-none relative z-10 -mt-[100vh]">
        {/* step 0 — hero */}
        <div data-step={0} className="mx-auto flex min-h-screen max-w-6xl items-end px-6 pb-24 md:items-center md:pb-0">
          <div className="pointer-events-auto flex max-w-xl flex-col gap-6">
            <Reveal>
              <Eyebrow>Ondo — 温度 · a ceramics studio in Porto</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                className="text-5xl leading-[1.02] sm:text-6xl md:text-7xl"
                style={{ fontFamily: DISPLAY, fontWeight: 480, color: INK, fontVariationSettings: "'opsz' 120" }}
              >
                Vessels
                <br />
                fired <em style={{ fontStyle: "italic", color: TERRA }}>slow.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="max-w-md text-lg leading-relaxed" style={{ color: MUTE }}>
                Wheel-thrown stoneware from a two-kiln studio, made in small
                series and fired to cone 10. Sold when they&rsquo;re ready —
                never before.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex flex-wrap items-center gap-5">
                <Magnetic strength={0.3}>
                  <a
                    href="#collection"
                    className={cn(
                      "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 text-base no-underline transition-transform duration-200 hover:scale-[1.03]",
                      focusRing,
                    )}
                    style={{ background: INK, color: PAPER, fontFamily: SANS, fontWeight: 600 }}
                  >
                    The collection <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </Magnetic>
                <span className="inline-flex items-center gap-2 text-sm" style={{ fontFamily: MONO, color: MUTE }}>
                  <Hand size={16} aria-hidden="true" style={{ color: TERRA }} />
                  drag the vessel — it spins
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* steps 1–3 — the forms */}
        {[1, 2, 3].map((s) => {
          const f = FORMS[STEP_FORM[s]]
          return (
            <div key={f.id} data-step={s} className="mx-auto flex min-h-[92vh] max-w-6xl items-end px-6 pb-24 md:items-center md:pb-0">
              <div
                className="pointer-events-auto max-w-md rounded-2xl border p-8 backdrop-blur-sm"
                style={{ borderColor: LINE, background: "rgba(244,239,230,0.86)" }}
              >
                <p className="mb-3 text-xs uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: TERRA }}>
                  Form {String(s).padStart(2, "0")} / 04 · {f.dims}
                </p>
                <h2
                  className="mb-4 text-4xl"
                  style={{ fontFamily: DISPLAY, fontWeight: 520, color: INK, fontVariationSettings: "'opsz' 72" }}
                >
                  {f.name}
                </h2>
                <p className="text-base leading-relaxed" style={{ color: MUTE }}>
                  {f.blurb}
                </p>
                <p className="mt-5 text-lg" style={{ fontFamily: MONO, color: INK }}>
                  {f.price}
                </p>
              </div>
            </div>
          )
        })}

        {/* step 4 — glazes */}
        <div data-step={4} className="mx-auto flex min-h-[96vh] max-w-6xl items-end px-6 pb-24 md:items-center md:pb-0">
          <div
            className="pointer-events-auto max-w-md rounded-2xl border p-8 backdrop-blur-sm"
            style={{ borderColor: LINE, background: "rgba(244,239,230,0.88)" }}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: TERRA }}>
              Five glazes · mixed in-house
            </p>
            <h2
              className="mb-4 text-4xl"
              style={{ fontFamily: DISPLAY, fontWeight: 520, color: INK, fontVariationSettings: "'opsz' 72" }}
            >
              Choose the weather.
            </h2>
            <p className="mb-6 text-base leading-relaxed" style={{ color: MUTE }}>
              Every form comes in five glazes, all fired in the same reduction
              atmosphere. Try them on the jar —
            </p>
            <div role="group" aria-label="Choose a glaze" className="flex flex-col gap-2">
              {GLAZES.map((g) => {
                const on = glaze.id === g.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setGlaze(g)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all duration-200",
                      focusRing,
                      on ? "shadow-sm" : "hover:translate-x-1",
                    )}
                    style={{
                      borderColor: on ? TERRA : LINE,
                      background: on ? "rgba(163,74,36,0.08)" : "transparent",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0 rounded-full border"
                      style={{ background: g.swatch, borderColor: "rgba(36,29,23,0.25)" }}
                    />
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold" style={{ color: INK }}>
                        {g.name}
                      </span>
                      <span className="text-xs" style={{ fontFamily: MONO, color: MUTE }}>
                        {g.note}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- firing curve
   One series (accent on paper, validated), recessive grid, selective direct
   labels, and the hover/focus layer: each firing stage is a keyboard-reachable
   hotspot that drives an aria-live detail panel with the real numbers. */

const CURVE: [number, number][] = [
  [0, 20],
  [2, 110],
  [6, 600],
  [9, 980],
  [12, 1305],
  [14, 1305],
  [20, 640],
  [36, 60],
]

const FIRE_STAGES = [
  { name: "Candling", span: "0–2 h", temp: "20→110 °C", from: 0, to: 2, body: "Barely warm overnight. Any water still hiding in the clay leaves politely instead of exploding." },
  { name: "The climb", span: "2–9 h", temp: "110→980 °C", from: 2, to: 9, body: "Steady 100°C an hour, easing off around 573°C — quartz inversion — where careless kilns crack pots." },
  { name: "Reduction", span: "9–12 h", temp: "980→1305 °C", from: 9, to: 12, body: "We starve the flame of oxygen so it pulls it from the glazes instead. This is where celadon turns jade and tenmoku goes black." },
  { name: "Peak · cone 10", span: "12–14 h", temp: "1305 °C held", from: 12, to: 14, body: "Two hours at white heat while cone 10 bends in the spy hole. The glaze is liquid glass; the kiln sings." },
  { name: "The long cool", span: "14–36 h", temp: "1305→60 °C", from: 14, to: 36, body: "Twenty-two hours of doing absolutely nothing. Opening early is how you meet your work as shards." },
]

function FiringSection() {
  const [stage, setStage] = useState(2)
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(svgRef, { once: true, margin: "-100px" })

  const W = 1000
  const H = 340
  const PAD = { l: 64, r: 24, t: 28, b: 40 }
  const xs = (h: number) => PAD.l + (h / 36) * (W - PAD.l - PAD.r)
  const ys = (t: number) => H - PAD.b - (t / 1400) * (H - PAD.t - PAD.b)
  const path = CURVE.map(([h, t], i) => `${i === 0 ? "M" : "L"}${xs(h).toFixed(1)},${ys(t).toFixed(1)}`).join(" ")
  const st = FIRE_STAGES[stage]

  return (
    <section id="firing" className="border-t" style={{ borderColor: LINE, background: PAPER_2 }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Eyebrow>The firing · 36 hours, twice a month</Eyebrow>
              <h2
                className="text-4xl md:text-6xl"
                style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK, fontVariationSettings: "'opsz' 96" }}
              >
                A day and a half of heat.
              </h2>
            </div>
            <p className="flex max-w-sm items-start gap-2 text-base leading-relaxed" style={{ color: MUTE }}>
              <Flame size={18} className="mt-1 shrink-0" style={{ color: TERRA }} aria-hidden="true" />
              Every piece rides this exact curve. Hover or tab across it to see
              what each stage does.
            </p>
          </div>
        </Reveal>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="group"
          aria-label="Kiln firing schedule: temperature over 36 hours. Use tab to explore the five stages."
        >
          {/* recessive grid + axis labels */}
          {[400, 800, 1200].map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={ys(t)} y2={ys(t)} stroke={LINE} strokeWidth={1} />
              <text x={PAD.l - 10} y={ys(t) + 4} textAnchor="end" fill={MUTE} style={{ fontFamily: MONO, fontSize: 12 }}>
                {t}°
              </text>
            </g>
          ))}
          {[0, 6, 12, 18, 24, 30, 36].map((h) => (
            <text key={h} x={xs(h)} y={H - PAD.b + 24} textAnchor="middle" fill={MUTE} style={{ fontFamily: MONO, fontSize: 12 }}>
              {h}h
            </text>
          ))}
          <line x1={PAD.l} x2={W - PAD.r} y1={ys(0)} y2={ys(0)} stroke={MUTE} strokeWidth={1} opacity={0.5} />

          {/* active stage band */}
          <rect
            x={xs(st.from)}
            y={PAD.t}
            width={xs(st.to) - xs(st.from)}
            height={H - PAD.t - PAD.b}
            fill={TERRA}
            opacity={0.07}
          />

          {/* the curve draws itself in */}
          <motion.path
            d={path}
            fill="none"
            stroke={TERRA}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          {/* selective direct labels */}
          <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.2, duration: 0.4 }}>
            <circle cx={xs(12)} cy={ys(1305)} r={5} fill={TERRA} stroke={PAPER_2} strokeWidth={2} />
            <text x={xs(13)} y={ys(1305) - 14} textAnchor="middle" fill={INK} style={{ fontFamily: MONO, fontSize: 13 }}>
              1305 °C · cone 10
            </text>
            <circle cx={xs(9)} cy={ys(980)} r={5} fill={TERRA} stroke={PAPER_2} strokeWidth={2} />
            <text x={xs(9) - 12} y={ys(980) - 12} textAnchor="end" fill={MUTE} style={{ fontFamily: MONO, fontSize: 12 }}>
              reduction begins
            </text>
          </motion.g>

          {/* stage hotspots: pointer + keyboard share one handler */}
          {FIRE_STAGES.map((s, i) => (
            <rect
              key={s.name}
              x={xs(s.from)}
              y={PAD.t}
              width={xs(s.to) - xs(s.from)}
              height={H - PAD.t - PAD.b}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`Firing stage ${i + 1}: ${s.name}, ${s.span}, ${s.temp}`}
              aria-pressed={stage === i}
              className="cursor-pointer focus:outline-none"
              onPointerEnter={() => setStage(i)}
              onFocus={() => setStage(i)}
              onClick={() => setStage(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setStage(i)
                }
              }}
            />
          ))}
        </svg>

        <div
          className="mt-6 flex min-h-[7.5rem] max-w-2xl flex-col gap-2 rounded-2xl border p-6"
          style={{ borderColor: LINE, background: PAPER }}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-1.5 text-sm" style={{ fontFamily: MONO, color: TERRA }}>
                {String(stage + 1).padStart(2, "0")} · {st.name} — {st.span} · {st.temp}
              </p>
              <p className="text-base leading-relaxed md:text-lg" style={{ color: INK }}>
                {st.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ collection */

function CollectionSection() {
  return (
    <section id="collection" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Eyebrow>The collection · summer firing</Eyebrow>
            <h2
              className="text-4xl md:text-6xl"
              style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK, fontVariationSettings: "'opsz' 96" }}
            >
              Four forms, five glazes.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed" style={{ color: MUTE }}>
            The silhouettes below are drawn from the same profile curves that
            shape the 3D vessel above — nothing here is decoration.
          </p>
        </div>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FORMS.map((f, i) => (
          <Reveal key={f.id} delay={i * 0.06}>
            <a
              href="mailto:studio@ondo.pt?subject=Enquiry"
              aria-label={`Enquire about ${f.name}, ${f.price}`}
              className={cn(
                "group flex h-full flex-col gap-4 rounded-2xl border p-6 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                focusRing,
              )}
              style={{ borderColor: LINE, background: PAPER_2 }}
            >
              <svg viewBox="0 0 150 150" className="w-full" aria-hidden="true">
                <path
                  d={silhouettePath(f)}
                  fill={INK}
                  className="transition-colors duration-300 group-hover:fill-[#a34a24] group-focus-visible:fill-[#a34a24]"
                />
              </svg>
              <div className="mt-auto flex items-baseline justify-between gap-2">
                <span className="text-xl" style={{ fontFamily: DISPLAY, fontWeight: 550, color: INK }}>
                  {f.name}
                </span>
                <span className="text-sm" style={{ fontFamily: MONO, color: MUTE }}>
                  {f.price}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm" style={{ fontFamily: MONO, color: TERRA }}>
                Enquire <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- studio */

function StudioSection() {
  return (
    <section id="studio" className="border-t" style={{ borderColor: LINE, background: PAPER_2 }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-14 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <Eyebrow>The studio</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl leading-[1.05] md:text-6xl"
                style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK, fontVariationSettings: "'opsz' 96" }}
              >
                Two kilns, three wheels,
                <br />
                one <em style={{ fontStyle: "italic", color: TERRA }}>rule.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-lg text-lg leading-relaxed" style={{ color: MUTE }}>
                Mara Ito trained in Mashiko and set up Ondo in a former tile
                factory on Rua do Almada in 2017. The rule: nothing leaves the
                studio that we wouldn&rsquo;t eat from, pour from, or keep. Seconds
                get smashed into the grog bucket and thrown again — clay
                forgives, eventually.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base" style={{ fontFamily: MONO, color: MUTE }}>
                Open studio: last Saturday of every month, 10:00–17:00.
                <br />
                Rua do Almada 143, Porto.
              </p>
            </Reveal>
          </div>
          <div className="grid content-center gap-10 sm:grid-cols-2">
            <Reveal>
              <Counter value={1305} suffix="°C" label="peak, every firing" />
            </Reveal>
            <Reveal delay={0.06}>
              <Counter value={36} suffix="h" label="per firing, twice a month" />
            </Reveal>
            <Reveal delay={0.12}>
              <Counter value={5} suffix="" label="glazes, mixed in-house" />
            </Reveal>
            <Reveal delay={0.18}>
              <Counter value={40} suffix="" label="bowls to a batch" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- page */

export default function OndoSite() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        style={{
          background: PAPER,
          color: INK,
          fontFamily: SANS,
          backgroundImage: "radial-gradient(rgba(36,29,23,0.045) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        className="min-h-screen"
      >
        {/* ------------------------------------------------------- header */}
        <header
          className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
          style={{ borderColor: LINE, background: "rgba(244,239,230,0.78)" }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* ml clears the gallery back-chip pinned at left-4 top-4 */}
            <a
              href="#top"
              className={cn("ml-24 flex items-baseline gap-2 no-underline min-[1440px]:ml-0", focusRing)}
              aria-label="Ondo — back to top"
            >
              <span className="text-xl" style={{ fontFamily: DISPLAY, fontWeight: 600, color: INK }}>
                ondo
              </span>
              <span className="hidden text-xs sm:inline" style={{ fontFamily: MONO, color: TERRA }}>
                温度
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
              {[
                ["Forms", "#forms"],
                ["Firing", "#firing"],
                ["Collection", "#collection"],
                ["Studio", "#studio"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={cn("text-sm no-underline transition-colors duration-200 hover:text-[#a34a24]", focusRing)}
                  style={{ fontFamily: SANS, fontWeight: 500, color: MUTE }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Magnetic strength={0.3}>
              <a
                href="mailto:studio@ondo.pt"
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm no-underline transition-transform duration-200 hover:scale-[1.03]",
                  focusRing,
                )}
                style={{ background: TERRA, color: PAPER, fontFamily: SANS, fontWeight: 600 }}
              >
                Visit the studio
              </a>
            </Magnetic>
          </div>
        </header>

        <main id="top">
          <StageSection />

          {/* wheel hint strip */}
          <div className="border-y" style={{ borderColor: LINE, background: PAPER }}>
            <div
              className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 py-4 text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: MONO, color: MUTE }}
            >
              <span className="inline-flex items-center gap-2">
                <MoveHorizontal size={14} aria-hidden="true" style={{ color: TERRA }} />
                drag or arrow-key the vessel to spin it
              </span>
              <span>stoneware · cone 10 · reduction</span>
              <span>ships worldwide, packed in last month&rsquo;s newspaper</span>
            </div>
          </div>

          <FiringSection />
          <CollectionSection />
          <StudioSection />

          {/* ------------------------------------------------------ footer */}
          <footer className="border-t" style={{ borderColor: LINE }}>
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 md:py-28">
              <Reveal>
                <Eyebrow>Wholesale · commissions · stubborn questions</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <Magnetic strength={0.15}>
                  <a
                    href="mailto:studio@ondo.pt"
                    className={cn(
                      "break-all text-3xl underline decoration-2 underline-offset-8 transition-colors duration-200 hover:text-[#a34a24] sm:text-5xl md:text-6xl",
                      focusRing,
                    )}
                    style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK, textDecorationColor: TERRA, fontVariationSettings: "'opsz' 96" }}
                  >
                    studio@ondo.pt
                  </a>
                </Magnetic>
              </Reveal>
              <div
                className="flex w-full flex-wrap items-center justify-between gap-4 border-t pt-6 text-xs uppercase tracking-[0.18em]"
                style={{ borderColor: LINE, fontFamily: MONO, color: MUTE }}
              >
                <span>© 2026 Ondo Cerâmica Lda — Porto</span>
                <span>Set in Fraunces &amp; Hanken Grotesk · thrown in three.js</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}
