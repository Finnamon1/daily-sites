import { useEffect, useRef, useState, type ReactNode } from "react"
import { MotionConfig, animate, useInView, useReducedMotion } from "framer-motion"
import * as THREE from "three"
import { ArrowUpRight, Leaf, RotateCcw, Scissors, Sparkles } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "SWARD — lawn care & renovation, Edinburgh",
  description:
    "A heritage lawn-care studio that lets you do the job before you book it. Featured interaction: a three.js lawn of ~7,000 instanced grass blades you mow yourself — hold and drag, and the cut leaves real alternating stripes based on your pass direction, clippings puff up behind you and a live percentage ticks toward a perfect cut. A wave-regrow button undoes it all, and an accessible 'mow it for me' mode sends a little red mower up and down the rows in proper serpentine stripes. Plus a month-by-month care calendar with keyboard-reachable hotspots, service tiers, counters and a booking form.",
  date: "2026-07-02",
  type: "Local business / lawn care studio",
  interaction:
    "Mow-the-lawn hero — ~7,000 instanced 3D grass blades cut under your cursor with direction-based stripes, clipping bursts, a live % meter, wave regrowth, and a self-driving mower mode for keyboard users. Plus a care-calendar hover map, counters and a booking form.",
}

/* --------------------------------------------------------------- palette */
// cream page that blends seamlessly into the scene's sky; ink is a deep
// green-black; ONE accent: mower red. The greens live in the grass itself.
const CREAM = "#f3f0e3"
const CREAM_2 = "#eae6d4"
const INK = "#1c2718" // ~13:1 on cream
const MUTE = "#5f6b58" // ~5.6:1 on cream
const LINE = "rgba(28,39,24,0.16)"
const RED = "#b5341f" // mower red, ~6:1 on cream
const PANEL = "rgba(243,240,227,0.86)"

const DISPLAY = "'Cormorant Garamond', Georgia, serif"
const SANS = "'DM Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b5341f]"

/* =================================================== THREE: the mowable lawn
   ~7,000 grass blades as one InstancedMesh. The pointer is ray-cast onto the
   lawn plane; blades inside the cut radius ease down to stubble and take a
   stripe colour keyed to the pass direction — mow left-to-right and back to
   get real alternating stripes. A spatial hash keeps each cut O(nearby).
   "Mow it for me" drives a little red mower in serpentine rows (also the
   keyboard/reduced-motion path). Regrow sweeps back in as a wave. */

const LAWN_W = 34
const LAWN_D = 19
const BLADES = 6800
const CUT_R = 1.35

type LawnAPI = {
  regrow: () => void
  autoMow: () => void
}

function LawnCanvas({
  reduced,
  onProgress,
  apiRef,
}: {
  reduced: boolean
  onProgress: (pct: number) => void
  apiRef: React.MutableRefObject<LawnAPI | null>
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const cbRef = useRef(onProgress)
  cbRef.current = onProgress

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    renderer.setClearColor(new THREE.Color(CREAM))
    renderer.domElement.style.touchAction = "none"
    renderer.domElement.style.cursor = "crosshair"

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(new THREE.Color(CREAM), 15, 31)
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 10.5, 15.5)
    camera.lookAt(0, 0, -1.5)

    const sun = new THREE.DirectionalLight(0xfff3da, 2.1)
    sun.position.set(-8, 14, 6)
    scene.add(sun)
    scene.add(new THREE.HemisphereLight(0xf3f0e3, 0x2c3d22, 1.0))

    /* --- soil + hedge frame */
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x33421f, roughness: 1 })
    const soil = new THREE.Mesh(new THREE.PlaneGeometry(LAWN_W + 2, LAWN_D + 2), soilMat)
    soil.rotation.x = -Math.PI / 2
    soil.position.y = -0.02
    scene.add(soil)
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x24361d, roughness: 1, flatShading: true })
    const hedgeGeoLong = new THREE.BoxGeometry(LAWN_W + 3.6, 1.5, 1.4)
    const hedgeGeoSide = new THREE.BoxGeometry(1.4, 1.5, LAWN_D + 1)
    const hedgeN = new THREE.Mesh(hedgeGeoLong, hedgeMat)
    hedgeN.position.set(0, 0.7, -LAWN_D / 2 - 1.2)
    const hedgeE = new THREE.Mesh(hedgeGeoSide, hedgeMat)
    hedgeE.position.set(LAWN_W / 2 + 1.5, 0.7, -0.5)
    const hedgeW = new THREE.Mesh(hedgeGeoSide, hedgeMat)
    hedgeW.position.set(-LAWN_W / 2 - 1.5, 0.7, -0.5)
    scene.add(hedgeN, hedgeE, hedgeW)

    /* --- the blades */
    const bladeGeo = new THREE.ConeGeometry(0.045, 1, 3)
    bladeGeo.translate(0, 0.5, 0)
    const bladeMat = new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true })
    const grass = new THREE.InstancedMesh(bladeGeo, bladeMat, BLADES)
    grass.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(grass)

    const px = new Float32Array(BLADES)
    const pz = new Float32Array(BLADES)
    const rotY = new Float32Array(BLADES)
    const baseH = new Float32Array(BLADES)
    const curH = new Float32Array(BLADES)
    const tgtH = new Float32Array(BLADES)
    const regrowAt = new Float32Array(BLADES).fill(-1)
    const isCut = new Uint8Array(BLADES)

    const tall = new THREE.Color(0x4f9f47)
    const tallVar = new THREE.Color(0x6cb457)
    const stripeLight = new THREE.Color(0xa8d48c)
    const stripeDark = new THREE.Color(0x548f3f)
    const cTmp = new THREE.Color()

    // spatial hash for O(nearby) cutting
    const CELL = CUT_R
    const grid = new Map<number, number[]>()
    const cellKey = (x: number, z: number) =>
      (Math.floor((x + LAWN_W / 2) / CELL) << 10) | Math.floor((z + LAWN_D / 2) / CELL)

    const dummy = new THREE.Object3D()
    const writeBlade = (i: number) => {
      dummy.position.set(px[i], 0, pz[i])
      dummy.rotation.set(0, rotY[i], 0)
      dummy.scale.set(1, Math.max(curH[i], 0.02), 1)
      dummy.updateMatrix()
      grass.setMatrixAt(i, dummy.matrix)
    }

    for (let i = 0; i < BLADES; i++) {
      px[i] = (Math.random() - 0.5) * LAWN_W
      pz[i] = (Math.random() - 0.5) * LAWN_D
      rotY[i] = Math.random() * Math.PI
      baseH[i] = 0.65 + Math.random() * 0.5
      curH[i] = baseH[i]
      tgtH[i] = baseH[i]
      writeBlade(i)
      cTmp.copy(tall).lerp(tallVar, Math.random())
      grass.setColorAt(i, cTmp)
      const k = cellKey(px[i], pz[i])
      const arr = grid.get(k)
      if (arr) arr.push(i)
      else grid.set(k, [i])
    }
    grass.instanceMatrix.needsUpdate = true
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true

    /* --- the mower */
    const mower = new THREE.Group()
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb5341f, roughness: 0.5, metalness: 0.15 })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x22271f, roughness: 0.7 })
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.34, 0.6), bodyMat)
    body.position.y = 0.34
    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.62, 12), darkMat)
    roller.rotation.x = Math.PI / 2
    roller.rotation.z = Math.PI / 2
    roller.position.set(0.45, 0.16, 0)
    const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), darkMat)
    handleL.position.set(-0.75, 0.75, -0.18)
    handleL.rotation.z = 0.9
    const handleR = handleL.clone()
    handleR.position.z = 0.18
    mower.add(body, roller, handleL, handleR)
    mower.visible = false
    scene.add(mower)

    /* --- clipping puffs (tiny pooled bursts) */
    const PUFF_N = 26
    const puffs: { pts: THREE.Points; mat: THREE.PointsMaterial; vel: Float32Array; t: number; origin: THREE.Vector3 }[] = []
    for (let p = 0; p < 4; p++) {
      const arr = new Float32Array(PUFF_N * 3)
      const vel = new Float32Array(PUFF_N * 3)
      const g = new THREE.BufferGeometry()
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3))
      const m = new THREE.PointsMaterial({ color: 0x6fae4e, size: 0.09, transparent: true, opacity: 0, depthWrite: false })
      const pts = new THREE.Points(g, m)
      pts.frustumCulled = false
      scene.add(pts)
      puffs.push({ pts, mat: m, vel, t: 9, origin: new THREE.Vector3() })
    }
    let puffIdx = 0
    const firePuff = (x: number, z: number) => {
      const p = puffs[puffIdx]
      puffIdx = (puffIdx + 1) % puffs.length
      p.origin.set(x, 0.25, z)
      p.t = 0
      for (let i = 0; i < PUFF_N; i++) {
        p.vel[i * 3] = (Math.random() - 0.5) * 2.2
        p.vel[i * 3 + 1] = 1.2 + Math.random() * 2
        p.vel[i * 3 + 2] = (Math.random() - 0.5) * 2.2
      }
    }

    /* --- butterflies */
    const flies: { mesh: THREE.Mesh; phase: number }[] = []
    const flyMat = new THREE.MeshBasicMaterial({ color: 0xfdfaef, side: THREE.DoubleSide })
    for (let i = 0; i < 3; i++) {
      const fly = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.16), flyMat)
      flies.push({ mesh: fly, phase: i * 2.4 })
      scene.add(fly)
    }

    /* --- cutting */
    const active = new Set<number>()
    let cutCount = 0
    let lastPct = -1
    const reportProgress = () => {
      const pct = Math.round((cutCount / BLADES) * 100)
      if (pct !== lastPct) {
        lastPct = pct
        cbRef.current(pct)
      }
    }

    let lastCutX = 0
    let hadCut = false
    const cutAt = (x: number, z: number, dirSign: number) => {
      const stripe = dirSign >= 0 ? stripeLight : stripeDark
      let newCuts = 0
      const cx0 = Math.floor((x - CUT_R + LAWN_W / 2) / CELL)
      const cx1 = Math.floor((x + CUT_R + LAWN_W / 2) / CELL)
      const cz0 = Math.floor((z - CUT_R + LAWN_D / 2) / CELL)
      const cz1 = Math.floor((z + CUT_R + LAWN_D / 2) / CELL)
      for (let cx = cx0; cx <= cx1; cx++) {
        for (let cz = cz0; cz <= cz1; cz++) {
          const bucket = grid.get((cx << 10) | cz)
          if (!bucket) continue
          for (const i of bucket) {
            if (isCut[i]) continue
            const dx = px[i] - x
            const dz = pz[i] - z
            if (dx * dx + dz * dz > CUT_R * CUT_R) continue
            isCut[i] = 1
            cutCount++
            newCuts++
            tgtH[i] = 0.16
            regrowAt[i] = -1
            if (reduced) {
              curH[i] = tgtH[i]
              writeBlade(i)
            } else {
              active.add(i)
            }
            grass.setColorAt(i, stripe)
          }
        }
      }
      if (newCuts > 0) {
        if (grass.instanceColor) grass.instanceColor.needsUpdate = true
        if (reduced) grass.instanceMatrix.needsUpdate = true
        if (!reduced && newCuts > 4) firePuff(x, z)
        reportProgress()
        dirty = true
      }
    }

    /* --- pointer mowing */
    const ndc = new THREE.Vector2()
    const rayDir = new THREE.Vector3()
    const hit = new THREE.Vector3()
    let mowing = false
    let mowerIdle = 9
    const pointToLawn = (clientX: number, clientY: number): boolean => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
      rayDir.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize()
      if (rayDir.y >= -0.001) return false
      const t = -camera.position.y / rayDir.y
      hit.copy(camera.position).addScaledVector(rayDir, t)
      return Math.abs(hit.x) <= LAWN_W / 2 + 1 && Math.abs(hit.z) <= LAWN_D / 2 + 1
    }
    const dom = renderer.domElement
    const onDown = (e: PointerEvent) => {
      auto = false
      mowing = true
      dom.setPointerCapture(e.pointerId)
      if (pointToLawn(e.clientX, e.clientY)) {
        lastCutX = hit.x
        hadCut = true
        cutAt(hit.x, hit.z, 1)
        placeMower(hit.x, hit.z, 1)
      }
    }
    const onMove = (e: PointerEvent) => {
      if (!mowing) return
      if (pointToLawn(e.clientX, e.clientY)) {
        const dir = hadCut ? Math.sign(hit.x - lastCutX) || 1 : 1
        cutAt(hit.x, hit.z, dir)
        placeMower(hit.x, hit.z, dir)
        lastCutX = hit.x
        hadCut = true
      }
    }
    const onUp = (e: PointerEvent) => {
      mowing = false
      hadCut = false
      dom.releasePointerCapture(e.pointerId)
    }
    dom.addEventListener("pointerdown", onDown)
    dom.addEventListener("pointermove", onMove)
    dom.addEventListener("pointerup", onUp)
    dom.addEventListener("pointercancel", onUp)

    const placeMower = (x: number, z: number, dir: number) => {
      mower.visible = true
      mower.position.set(x, 0, z)
      mower.rotation.y = dir >= 0 ? 0 : Math.PI
      mowerIdle = 0
    }

    /* --- self-driving mower (also the keyboard path) */
    let auto = false
    let autoX = 0
    let autoZ = 0
    let autoDir = 1
    const AUTO_SPEED = 14
    const ROW = CUT_R * 1.7
    const startAuto = () => {
      auto = true
      autoX = -LAWN_W / 2 + 0.5
      autoZ = -LAWN_D / 2 + 0.9
      autoDir = 1
    }

    /* --- regrow */
    const regrow = () => {
      auto = false
      const t0 = clock.elapsedTime
      for (let i = 0; i < BLADES; i++) {
        if (!isCut[i]) continue
        regrowAt[i] = reduced ? t0 : t0 + ((px[i] + LAWN_W / 2) / LAWN_W) * 1.6 + Math.random() * 0.3
      }
      dirty = true
    }

    apiRef.current = { regrow, autoMow: startAuto }

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      camera.position.z = w < 640 ? 20 : 15.5
      camera.lookAt(0, 0, -1.5)
      dirty = true
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let dirty = true
    let raf = 0
    let running = false
    const clock = new THREE.Clock()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      // auto mower drives serpentine rows
      if (auto) {
        const step = AUTO_SPEED * dt
        autoX += autoDir * step
        if (autoX > LAWN_W / 2 - 0.4 || autoX < -LAWN_W / 2 + 0.4) {
          autoX = THREE.MathUtils.clamp(autoX, -LAWN_W / 2 + 0.4, LAWN_W / 2 - 0.4)
          autoZ += ROW
          autoDir *= -1
          if (autoZ > LAWN_D / 2 - 0.3) auto = false
        }
        cutAt(autoX, autoZ, autoDir)
        placeMower(autoX, autoZ, autoDir)
        dirty = true
      }

      // blades easing to stubble
      if (active.size > 0) {
        const ease = 1 - Math.exp(-dt * 9)
        for (const i of active) {
          curH[i] += (tgtH[i] - curH[i]) * ease
          if (Math.abs(curH[i] - tgtH[i]) < 0.01) {
            curH[i] = tgtH[i]
            active.delete(i)
          }
          writeBlade(i)
        }
        grass.instanceMatrix.needsUpdate = true
        dirty = true
      }

      // regrowth wave
      let regrew = 0
      for (let i = 0; i < BLADES; i++) {
        if (regrowAt[i] >= 0 && t >= regrowAt[i]) {
          regrowAt[i] = -1
          isCut[i] = 0
          cutCount--
          tgtH[i] = baseH[i]
          cTmp.copy(tall).lerp(tallVar, Math.random())
          grass.setColorAt(i, cTmp)
          if (reduced) {
            curH[i] = baseH[i]
            writeBlade(i)
          } else {
            active.add(i)
          }
          regrew++
        }
      }
      if (regrew > 0) {
        if (grass.instanceColor) grass.instanceColor.needsUpdate = true
        if (reduced) grass.instanceMatrix.needsUpdate = true
        reportProgress()
        dirty = true
      }

      // clipping puffs
      for (const p of puffs) {
        if (p.t > 1) continue
        p.t += dt * 1.6
        const arr = p.pts.geometry.attributes.position.array as Float32Array
        for (let i = 0; i < PUFF_N; i++) {
          arr[i * 3] = p.origin.x + p.vel[i * 3] * p.t
          arr[i * 3 + 1] = Math.max(0.02, p.origin.y + p.vel[i * 3 + 1] * p.t - 2.6 * p.t * p.t)
          arr[i * 3 + 2] = p.origin.z + p.vel[i * 3 + 2] * p.t
        }
        p.pts.geometry.attributes.position.needsUpdate = true
        p.mat.opacity = Math.max(0, 0.9 - p.t)
        dirty = true
      }

      // butterflies + mower fade
      if (!reduced) {
        for (const f of flies) {
          const ph = t * 0.5 + f.phase
          f.mesh.position.set(
            Math.sin(ph) * 12 + Math.sin(ph * 2.3) * 2,
            1.5 + Math.sin(ph * 3.1) * 0.5,
            Math.cos(ph * 0.8) * 7 - 1,
          )
          f.mesh.rotation.set(0, ph, Math.sin(t * 14 + f.phase) * 0.8)
        }
        dirty = true
      }
      mowerIdle += dt
      if (mower.visible && mowerIdle > 1.4 && !auto) {
        mower.visible = false
        dirty = true
      }

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
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.02 })
    io.observe(el)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)
    start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      dom.removeEventListener("pointerdown", onDown)
      dom.removeEventListener("pointermove", onMove)
      dom.removeEventListener("pointerup", onUp)
      dom.removeEventListener("pointercancel", onUp)
      apiRef.current = null
      bladeGeo.dispose()
      soil.geometry.dispose()
      hedgeGeoLong.dispose()
      hedgeGeoSide.dispose()
      mower.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose()
      })
      flies.forEach((f) => f.mesh.geometry.dispose())
      puffs.forEach((p) => {
        p.pts.geometry.dispose()
        p.mat.dispose()
      })
      ;[bladeMat, soilMat, hedgeMat, bodyMat, darkMat, flyMat].forEach((m) => m.dispose())
      grass.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
    // the lawn's interactive state lives inside the effect; only the motion
    // preference should rebuild it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      role="img"
      aria-label="An interactive lawn of several thousand grass blades. Hold and drag to mow it; the buttons below can mow it for you or let it regrow."
    />
  )
}

/* ------------------------------------------------------------ small bits */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.28em]" style={{ fontFamily: MONO, color: RED }}>
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
        style={{ fontFamily: DISPLAY, fontWeight: 600, color: INK }}
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

/* ---------------------------------------------------------------- content */

const SERVICES = [
  {
    name: "The Weekly",
    price: "from £48 / visit",
    body: "Cut, edge, blow, gone — same day every week, stripes alternating like we never left. Includes the smug Sunday feeling.",
  },
  {
    name: "The Renovation",
    price: "from £420",
    body: "For lawns that have seen things. Scarify, aerate, topdress, overseed — ugly for three weeks in September, magnificent by May.",
  },
  {
    name: "The Wimbledon",
    price: "by consultation",
    body: "Full rebuild: drainage, laser-levelled rootzone, tournament cultivars, 4 mm summer height. For people who own a cylinder mower and mean it.",
  },
]

const MONTHS = [
  ["Jan", "Stay off it. Frozen grass snaps like glass and prints every footstep till spring."],
  ["Feb", "Sharpen, service, plan. The lawn is asleep; we're not."],
  ["Mar", "First light cut — tops off only. Never scalp in March, whatever the weather says."],
  ["Apr", "Feed, scarify lightly, overseed thin patches. The lawn wakes up hungry."],
  ["May", "Weekly cuts begin. Stripes return. Neighbours begin to notice."],
  ["Jun", "Down to summer height. Water deep and rare, not little and often."],
  ["Jul", "Hold the line: sharp blades, dawn watering, no feeding in a heatwave."],
  ["Aug", "It may brown in drought. It isn't dead — it's resting. Do not panic-water at noon."],
  ["Sep", "Renovation month: aerate, topdress, overseed. The most important four weeks of the year."],
  ["Oct", "Last feeds, leaves off within the week — leaves smother more lawns than frost does."],
  ["Nov", "Final cut, high. Then the mower sleeps indoors, cleaned, like a member of the family."],
  ["Dec", "Leave it be. Read the catalogue. Dream of April."],
] as const

/* ----------------------------------------------------------------- page */

export default function SwardSite() {
  const reduced = useReducedMotion() ?? false
  const [pct, setPct] = useState(0)
  const [month, setMonth] = useState(6)
  const [booked, setBooked] = useState(false)
  const api = useRef<LawnAPI | null>(null)

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" style={{ background: CREAM, color: INK, fontFamily: SANS }} className="min-h-screen">
        {/* ------------------------------------------------------- header */}
        <header
          className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
          style={{ borderColor: LINE, background: PANEL }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* ml clears the gallery back-chip pinned at left-4 top-4 */}
            <a
              href="#top"
              className={cn("ml-24 flex items-baseline gap-2 no-underline min-[1440px]:ml-0", focusRing)}
              aria-label="Sward — back to top"
            >
              <span className="text-2xl" style={{ fontFamily: DISPLAY, fontWeight: 700, color: INK }}>
                Sward
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.22em] sm:inline" style={{ fontFamily: MONO, color: MUTE }}>
                est. 1987
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
              {[
                ["Services", "#services"],
                ["The year", "#calendar"],
                ["Book", "#book"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={cn("text-sm no-underline transition-colors duration-200 hover:text-[#b5341f]", focusRing)}
                  style={{ fontFamily: MONO, color: MUTE }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Magnetic strength={0.3}>
              <a
                href="#book"
                className={cn(
                  "hidden items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm no-underline transition-transform duration-200 hover:scale-[1.03] sm:inline-flex",
                  focusRing,
                )}
                style={{ background: RED, color: CREAM, fontFamily: MONO, fontWeight: 600 }}
              >
                Book a walk-over
              </a>
            </Magnetic>
          </div>
        </header>

        <main>
          {/* ---------------------------------------------------- the lawn */}
          <section className="relative flex min-h-[135vh] flex-col overflow-hidden pt-16 md:min-h-screen">
            <LawnCanvas reduced={reduced} onProgress={setPct} apiRef={api} />
            {/* the sky already matches the page; just soften the text zone */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[56%]"
              style={{ background: `linear-gradient(to bottom, ${CREAM} 26%, rgba(243,240,227,0.55) 64%, transparent 100%)` }}
            />

            <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6 pt-10 md:pt-16">
              <div className="flex max-w-2xl flex-col gap-5">
                <Reveal>
                  <Eyebrow>Sward · lawn care &amp; renovation · Edinburgh</Eyebrow>
                </Reveal>
                <Reveal delay={0.08}>
                  <h1
                    className="text-5xl leading-[1.0] sm:text-6xl md:text-7xl"
                    style={{ fontFamily: DISPLAY, fontWeight: 600, color: INK }}
                  >
                    It&rsquo;s only grass.
                    <br />
                    It&rsquo;s also <em style={{ fontStyle: "italic", color: RED }}>everything.</em>
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="max-w-xl text-lg leading-relaxed" style={{ color: MUTE }}>
                    We keep two hundred-odd Edinburgh lawns dense, level and
                    indecently green. Go on — mow ours. Hold, drag, admire your
                    stripes. Then imagine never having to do it again.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* the groundskeeper's panel */}
            <div className="relative z-10 mx-auto mt-auto w-full max-w-6xl px-6 pb-10">
              <Reveal delay={0.2}>
                <div
                  className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl border p-5 backdrop-blur-sm"
                  style={{ borderColor: LINE, background: PANEL }}
                >
                  <p className="inline-flex items-center gap-2 text-sm" style={{ fontFamily: MONO, color: INK }}>
                    <Scissors size={15} aria-hidden="true" style={{ color: RED }} />
                    hold &amp; drag to mow
                  </p>
                  <div className="flex min-w-40 flex-1 items-center gap-3" aria-hidden="true">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(28,39,24,0.14)" }}>
                      <div
                        className="h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${pct}%`, background: RED }}
                      />
                    </div>
                    <span className="text-sm tabular-nums" style={{ fontFamily: MONO, color: INK }}>
                      {pct}%
                    </span>
                  </div>
                  <p aria-live="polite" className="sr-only">
                    Lawn {pct} percent mowed
                  </p>
                  {pct >= 99 ? (
                    <p className="inline-flex items-center gap-2 text-sm" style={{ fontFamily: MONO, color: RED }}>
                      <Sparkles size={15} aria-hidden="true" /> A perfect cut. You&rsquo;re hired.
                    </p>
                  ) : null}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => api.current?.autoMow()}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200 hover:border-[#b5341f] hover:text-[#b5341f]",
                        focusRing,
                      )}
                      style={{ fontFamily: MONO, color: INK, borderColor: LINE }}
                    >
                      Mow it for me
                    </button>
                    <button
                      type="button"
                      onClick={() => api.current?.regrow()}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200 hover:border-[#b5341f] hover:text-[#b5341f]",
                        focusRing,
                      )}
                      style={{ fontFamily: MONO, color: INK, borderColor: LINE }}
                    >
                      <RotateCcw size={14} aria-hidden="true" /> Regrow
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* -------------------------------------------------- services */}
          <section id="services" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <Reveal>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <Eyebrow>Services · all of Edinburgh, most of the Lothians</Eyebrow>
                  <h2 className="text-4xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                    Three ways to stop worrying.
                  </h2>
                </div>
                <p className="flex max-w-sm items-start gap-2 text-base leading-relaxed" style={{ color: MUTE }}>
                  <Leaf size={18} className="mt-1 shrink-0" style={{ color: RED }} aria-hidden="true" />
                  Every plan starts with a walk-over: we prod it, frown at it
                  professionally, and post a plan through your door.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {SERVICES.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.07}>
                  <article
                    className="flex h-full flex-col gap-4 rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{ borderColor: LINE, background: i === 2 ? INK : CREAM_2 }}
                  >
                    <h3
                      className="text-3xl"
                      style={{ fontFamily: DISPLAY, fontWeight: 600, color: i === 2 ? CREAM : INK }}
                    >
                      {s.name}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: i === 2 ? "#b9c2b0" : MUTE }}>
                      {s.body}
                    </p>
                    <p className="mt-auto pt-2 text-sm" style={{ fontFamily: MONO, color: i === 2 ? "#e8b0a4" : RED }}>
                      {s.price}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------- calendar */}
          <section id="calendar" className="border-t" style={{ borderColor: LINE, background: CREAM_2 }}>
            <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
              <Reveal>
                <div className="mb-10 flex flex-col gap-4">
                  <Eyebrow>The groundskeeper&rsquo;s year</Eyebrow>
                  <h2 className="max-w-xl text-4xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                    Twelve months, one obsession.
                  </h2>
                </div>
              </Reveal>
              <div role="group" aria-label="Month-by-month lawn care" className="mb-6 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-12">
                {MONTHS.map(([name], i) => {
                  const on = month === i
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setMonth(i)}
                      onPointerEnter={() => setMonth(i)}
                      onFocus={() => setMonth(i)}
                      className={cn(
                        "rounded-xl border px-2 py-3 text-sm transition-all duration-200",
                        focusRing,
                        !on && "hover:-translate-y-0.5",
                      )}
                      style={{
                        fontFamily: MONO,
                        color: on ? CREAM : MUTE,
                        background: on ? RED : "transparent",
                        borderColor: on ? RED : LINE,
                        fontWeight: on ? 600 : 400,
                      }}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
              <div
                className="min-h-[6rem] max-w-2xl rounded-2xl border p-6"
                style={{ borderColor: LINE, background: CREAM }}
                aria-live="polite"
              >
                <p className="mb-1.5 text-sm" style={{ fontFamily: MONO, color: RED }}>
                  {MONTHS[month][0]}
                </p>
                <p className="text-lg leading-relaxed md:text-xl" style={{ fontFamily: DISPLAY, fontWeight: 500, color: INK }}>
                  {MONTHS[month][1]}
                </p>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------- numbers */}
          <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="grid gap-14 md:grid-cols-[1.1fr_1fr]">
              <div className="flex flex-col gap-6">
                <Reveal>
                  <Eyebrow>Since 1987</Eyebrow>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="text-4xl leading-[1.05] md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                    Two generations of
                    <br />
                    kneeling on <em style={{ fontStyle: "italic", color: RED }}>wet grass.</em>
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="max-w-lg text-lg leading-relaxed" style={{ color: MUTE }}>
                    Douglas started Sward with a Ransomes he rebuilt in the
                    kitchen; his daughter Ailsa runs it now with nine of the
                    politest obsessives in Scottish horticulture. One client in
                    Morningside was accused by her neighbours of laying
                    artificial turf. It nearly went to mediation. We framed the
                    letter.
                  </p>
                </Reveal>
              </div>
              <div className="grid content-center gap-10 sm:grid-cols-2">
                <Reveal>
                  <Counter value={214} suffix="" label="lawns under our care" />
                </Reveal>
                <Reveal delay={0.06}>
                  <Counter value={38} suffix=" t" label="topdressing spread a year" />
                </Reveal>
                <Reveal delay={0.12}>
                  <Counter value={4} suffix=" mm" label="summer height, The Wimbledon" />
                </Reveal>
                <Reveal delay={0.18}>
                  <Counter value={0} suffix="" label="artificial lawns. Don't ask." />
                </Reveal>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------- booking */}
          <section id="book" className="border-t" style={{ borderColor: LINE, background: CREAM_2 }}>
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-7 px-6 py-24 md:py-32">
              <Reveal>
                <Eyebrow>The walk-over · free, unhurried, slightly judgemental</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="max-w-2xl text-4xl leading-[1.05] md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                  Put the mower down.
                  <br />
                  We&rsquo;ll take it from here.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                {booked ? (
                  <p
                    className="rounded-xl border px-6 py-4 text-base"
                    style={{ borderColor: LINE, background: "rgba(63,143,60,0.1)", color: "#2c6b2a", fontFamily: MONO }}
                    role="status"
                  >
                    Booked. We&rsquo;ll walk it Thursday and post the plan through your door.
                  </p>
                ) : (
                  <form
                    className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
                    onSubmit={(e) => {
                      e.preventDefault()
                      setBooked(true)
                    }}
                  >
                    <label htmlFor="sward-postcode" className="sr-only">
                      Postcode
                    </label>
                    <input
                      id="sward-postcode"
                      required
                      placeholder="EH10 4…"
                      className={cn("w-32 rounded-full border bg-transparent px-5 py-3.5 text-base", focusRing)}
                      style={{ borderColor: LINE, color: INK, fontFamily: MONO }}
                    />
                    <label htmlFor="sward-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="sward-email"
                      type="email"
                      required
                      placeholder="you@morningside.scot"
                      className={cn("w-full flex-1 rounded-full border bg-transparent px-6 py-3.5 text-base", focusRing)}
                      style={{ borderColor: LINE, color: INK, fontFamily: MONO }}
                    />
                    <Magnetic strength={0.25}>
                      <button
                        type="submit"
                        className={cn(
                          "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 text-base transition-transform duration-200 hover:scale-[1.03] sm:w-auto",
                          focusRing,
                        )}
                        style={{ background: RED, color: CREAM, fontFamily: MONO, fontWeight: 600 }}
                      >
                        Book the walk-over <ArrowUpRight size={18} aria-hidden="true" />
                      </button>
                    </Magnetic>
                  </form>
                )}
              </Reveal>
            </div>
          </section>

          {/* ------------------------------------------------------ footer */}
          <footer className="border-t" style={{ borderColor: LINE }}>
            <div
              className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-xs uppercase tracking-[0.18em]"
              style={{ fontFamily: MONO, color: MUTE }}
            >
              <span>© 2026 Sward Ground Care Ltd — Edinburgh</span>
              <span>No artificial turf. We&rsquo;d sooner retrain.</span>
            </div>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}
