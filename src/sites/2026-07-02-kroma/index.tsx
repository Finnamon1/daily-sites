import { useEffect, useRef, useState, type ReactNode } from "react"
import { MotionConfig, animate, useInView, useReducedMotion } from "framer-motion"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { PaintRoller, SprayCan, Sparkles } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "KROMA — graffiti & mural studio, Berlin",
  description:
    "A three-writer graffiti studio that paints murals, shutters and workshops. The hero headline is real 3D bubble graffiti: K-R-O-M-A built from fat tube-stroke throwie letters with black outlines, candy colours and cartoon gleams, bouncing in over a procedurally drawn brick wall. The wall is yours: pick a can and spray it — soft overlapping mist, drips when you linger — then let the council buff it into mismatched grey patches. Letters pop when you hover them and somersault when you click. Plus a services board, crew bios, counters and a commission CTA.",
  date: "2026-07-02",
  type: "Artist collective / mural studio",
  interaction:
    "3D bubble-graffiti headline — procedural tube-stroke throwie letters (black inverted outlines, candy colours, gleams) that bounce in, pop on hover and somersault on click — over a sprayable brick wall with five cans, drips, and a 'council buff' that paints it out in grey patches.",
}

/* --------------------------------------------------------------- palette */
// asphalt-dark UI; ONE ui accent: hot magenta. The candy colours live in the
// letters and the spray cans, not in the interface chrome.
const ASPHALT = "#16131a"
const PANEL = "rgba(18,14,22,0.78)"
const BONE = "#f2eff4" // ~15:1 on asphalt
const MUTE = "#a49dad" // ~7:1 on asphalt
const LINE = "rgba(242,239,244,0.15)"
const MAGENTA = "#ff3ea5" // ~7:1 on asphalt

const DISPLAY = "'Syne', 'Arial Black', sans-serif"
const SANS = "'Space Grotesk', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3ea5]"

/* ------------------------------------------------------------ spray cans */

const CANS = [
  { id: "chrome", name: "Chrome", hex: "#e3e3e6" },
  { id: "pink", name: "Pink", hex: "#ff3ea5" },
  { id: "cyan", name: "Cyan", hex: "#2fd4e8" },
  { id: "yellow", name: "Yellow", hex: "#ffd42a" },
  { id: "black", name: "Ink", hex: "#141216" },
]

/* --------------------------------------------------------------- glyphs
   Bubble throwie letters as fat single strokes: each stroke is a polyline
   smoothed into a CatmullRom curve and skinned with a thick TubeGeometry
   plus sphere end-caps. An identical tube at radius+Δ, black, BackSide,
   is the classic inverted-hull outline. Grid: 2 wide × 3 tall per letter. */

type Stroke = { pts: [number, number][]; closed?: boolean }

const GLYPHS: Record<string, Stroke[]> = {
  K: [
    { pts: [[0.25, 0.1], [0.25, 1.5], [0.25, 2.9]] },
    { pts: [[1.8, 2.95], [0.9, 2.1], [0.42, 1.55]] },
    { pts: [[0.62, 1.7], [1.25, 0.85], [1.85, 0.05]] },
  ],
  R: [
    { pts: [[0.25, 0.1], [0.25, 1.5], [0.25, 2.9]] },
    { pts: [[0.3, 2.85], [1.15, 2.95], [1.7, 2.45], [1.45, 1.85], [0.45, 1.7]] },
    { pts: [[0.95, 1.6], [1.4, 0.85], [1.85, 0.05]] },
  ],
  O: [
    {
      pts: [[1, 2.9], [1.75, 2.2], [1.7, 0.9], [1, 0.1], [0.3, 0.85], [0.28, 2.15]],
      closed: true,
    },
  ],
  M: [
    { pts: [[0.12, 0.05], [0.16, 1.6], [0.2, 2.9], [1, 1.35], [1.8, 2.9], [1.84, 1.55], [1.88, 0.05]] },
  ],
  A: [
    { pts: [[0.15, 0.05], [0.6, 1.55], [1, 2.95], [1.4, 1.5], [1.85, 0.05]] },
    { pts: [[0.5, 1.1], [1, 1.15], [1.5, 1.1]] },
  ],
}

const WORD = "KROMA"
const LETTER_COLORS = [0xff3ea5, 0x2fd4e8, 0xffd42a, 0xff7830, 0xa8e34d]

/* ====================================================== THREE: the wall
   A procedurally painted brick wall (CanvasTexture — bricks, stains and the
   crew's faded old tags drawn in 2D), a transparent spray layer you paint
   into with pointer raycasts (drips when you linger, grey patches when the
   council buffs it), and the 3D throwie word floating in front, lit by a
   PMREM environment so the letters read as vinyl toys. */

type WallAPI = { buff: () => void; setCan: (hex: string) => void }

function GraffitiCanvas({
  reduced,
  apiRef,
}: {
  reduced: boolean
  apiRef: React.MutableRefObject<WallAPI | null>
}) {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    renderer.domElement.style.touchAction = "none"
    renderer.domElement.style.cursor = "crosshair"

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 8, 20)
    camera.lookAt(0, 8, 0)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.05).texture
    scene.environment = envTex
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const key = new THREE.DirectionalLight(0xfff2df, 1.4)
    key.position.set(-6, 14, 12)
    scene.add(key)

    /* --- brick wall drawn in 2D */
    const WALL_W = 44
    const WALL_H = 26
    const wallCanvas = document.createElement("canvas")
    wallCanvas.width = 1280
    wallCanvas.height = 760
    {
      const ctx = wallCanvas.getContext("2d")!
      ctx.fillStyle = "#5e4038"
      ctx.fillRect(0, 0, 1280, 760)
      const BH = 38
      const BW = 92
      for (let row = 0; row * BH < 760; row++) {
        const off = row % 2 === 0 ? 0 : BW / 2
        for (let col = -1; col * BW < 1280 + BW; col++) {
          const x = col * BW + off
          const y = row * BH
          const j = Math.sin(row * 7.3 + col * 13.7) * 0.5 + 0.5
          ctx.fillStyle = `rgb(${104 + j * 22}, ${66 + j * 13}, ${54 + j * 10})`
          ctx.fillRect(x + 3, y + 3, BW - 6, BH - 6)
        }
      }
      // grime + stains
      for (let i = 0; i < 320; i++) {
        ctx.fillStyle = `rgba(24,16,13,${0.02 + Math.random() * 0.04})`
        const r = 5 + Math.random() * 26
        ctx.beginPath()
        ctx.arc(Math.random() * 1280, Math.random() * 760, r, 0, Math.PI * 2)
        ctx.fill()
      }
      // the crew's faded history
      const oldTags: [string, number, number, number][] = [
        ["MOKA", 190, 620, -0.12],
        ["SIEN2", 950, 160, 0.08],
        ["reks was here", 1040, 660, -0.05],
        ["KROMA 2014", 420, 130, 0.1],
      ]
      ctx.textBaseline = "middle"
      for (const [word, x, y, rot] of oldTags) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rot)
        ctx.font = "italic 700 44px cursive"
        ctx.fillStyle = "rgba(235,228,215,0.16)"
        ctx.fillText(word, 0, 0)
        ctx.restore()
      }
    }
    const wallTex = new THREE.CanvasTexture(wallCanvas)
    wallTex.colorSpace = THREE.SRGBColorSpace
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 })
    const wallGeo = new THREE.PlaneGeometry(WALL_W, WALL_H)
    const wall = new THREE.Mesh(wallGeo, wallMat)
    wall.position.set(0, 8, 0)
    scene.add(wall)

    /* --- spray layer */
    const sprayCanvas = document.createElement("canvas")
    sprayCanvas.width = 1280
    sprayCanvas.height = 760
    const sctx = sprayCanvas.getContext("2d")!
    const sprayTex = new THREE.CanvasTexture(sprayCanvas)
    sprayTex.colorSpace = THREE.SRGBColorSpace
    const sprayMat = new THREE.MeshBasicMaterial({ map: sprayTex, transparent: true })
    const sprayGeo = new THREE.PlaneGeometry(WALL_W, WALL_H)
    const sprayPlane = new THREE.Mesh(sprayGeo, sprayMat)
    sprayPlane.position.set(0, 8, 0.06)
    scene.add(sprayPlane)

    let can = CANS[1].hex
    const hexToRgb = (hex: string) => {
      const n = parseInt(hex.slice(1), 16)
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
    }
    const sprayDotPx = (x: number, y: number, big = false) => {
      const [r, g, b] = hexToRgb(can)
      const rad = big ? 30 + Math.random() * 10 : 18 + Math.random() * 7
      const grad = sctx.createRadialGradient(x, y, 1, x, y, rad)
      grad.addColorStop(0, `rgba(${r},${g},${b},0.6)`)
      grad.addColorStop(0.65, `rgba(${r},${g},${b},0.24)`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      sctx.fillStyle = grad
      sctx.beginPath()
      sctx.arc(x, y, rad, 0, Math.PI * 2)
      sctx.fill()
    }
    // pointer events arrive sparsely — lay dots along the whole segment
    const spraySegment = (u0: number, v0: number, u1: number, v1: number, big = false) => {
      const x0 = u0 * 1280
      const y0 = (1 - v0) * 760
      const x1 = u1 * 1280
      const y1 = (1 - v1) * 760
      const dist = Math.hypot(x1 - x0, y1 - y0)
      const steps = Math.max(1, Math.min(24, Math.round(dist / 9)))
      for (let i = 1; i <= steps; i++) {
        const f = i / steps
        sprayDotPx(x0 + (x1 - x0) * f + (Math.random() - 0.5) * 4, y0 + (y1 - y0) * f + (Math.random() - 0.5) * 4, big)
      }
      sprayTex.needsUpdate = true
      dirty = true
    }
    const drip = (u: number, v: number) => {
      const x = u * 1280 + (Math.random() - 0.5) * 8
      const y = (1 - v) * 760
      const [r, g, b] = hexToRgb(can)
      const len = 26 + Math.random() * 60
      const grad = sctx.createLinearGradient(x, y, x, y + len)
      grad.addColorStop(0, `rgba(${r},${g},${b},0.5)`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      sctx.fillStyle = grad
      sctx.fillRect(x - 1.6, y, 3.2, len)
      sprayTex.needsUpdate = true
      dirty = true
    }
    const buff = () => {
      sctx.clearRect(0, 0, 1280, 760)
      // the council never colour-matches
      for (let i = 0; i < 7; i++) {
        const w = 180 + Math.random() * 340
        const h = 110 + Math.random() * 220
        const x = Math.random() * (1280 - w)
        const y = Math.random() * (760 - h)
        const g = 118 + Math.floor(Math.random() * 32)
        sctx.fillStyle = `rgba(${g},${g},${g + 6},0.92)`
        sctx.fillRect(x, y, w, h)
      }
      sprayTex.needsUpdate = true
      dirty = true
    }

    apiRef.current = { buff, setCan: (hex) => (can = hex) }

    /* --- the throwie word */
    type Letter = {
      group: THREE.Group
      baseX: number
      baseY: number
      baseRot: number
      phase: number
      scale: number
      pop: number // eased hover scale bonus
      spin: number // remaining click-spin
      radius: number // for cheap pointer hit tests
    }
    const letters: Letter[] = []
    const wordGroup = new THREE.Group()
    wordGroup.position.set(0, 10.6, 2.8)
    scene.add(wordGroup)

    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[] = []
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x18131c, side: THREE.BackSide })
    mats.push(outlineMat)

    const SPACING = 2.7
    const SCALE = 1.2
    const R_TUBE = 0.34
    const R_OUT = 0.45

    WORD.split("").forEach((ch, li) => {
      const strokes = GLYPHS[ch]
      const group = new THREE.Group()
      const mat = new THREE.MeshStandardMaterial({
        color: LETTER_COLORS[li],
        roughness: 0.32,
        metalness: 0.05,
      })
      mats.push(mat)
      for (const s of strokes) {
        const pts = s.pts.map(
          ([x, y], i) =>
            new THREE.Vector3(
              (x - 1) * SCALE,
              (y - 1.5) * SCALE,
              Math.sin(i * 2.1 + li) * 0.06,
            ),
        )
        const curve = new THREE.CatmullRomCurve3(pts, s.closed ?? false, "catmullrom", 0.8)
        const tubeGeo = new THREE.TubeGeometry(curve, 36, R_TUBE, 14, s.closed ?? false)
        const outGeo = new THREE.TubeGeometry(curve, 36, R_OUT, 14, s.closed ?? false)
        geos.push(tubeGeo, outGeo)
        group.add(new THREE.Mesh(tubeGeo, mat), new THREE.Mesh(outGeo, outlineMat))
        if (!s.closed) {
          for (const end of [pts[0], pts[pts.length - 1]]) {
            const capGeo = new THREE.SphereGeometry(R_TUBE, 14, 12)
            const capOutGeo = new THREE.SphereGeometry(R_OUT, 14, 12)
            geos.push(capGeo, capOutGeo)
            const cap = new THREE.Mesh(capGeo, mat)
            cap.position.copy(end)
            const capOut = new THREE.Mesh(capOutGeo, outlineMat)
            capOut.position.copy(end)
            group.add(cap, capOut)
          }
        }
      }
      // cartoon gleam, seated on the letter's crown stroke
      let crown: [number, number] = [1, 2.9]
      for (const s of strokes)
        for (const p of s.pts) if (p[1] > crown[1]) crown = p
      const gleamMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      mats.push(gleamMat)
      const g1 = new THREE.SphereGeometry(0.13, 10, 8)
      const g2 = new THREE.SphereGeometry(0.075, 10, 8)
      geos.push(g1, g2)
      const gleamA = new THREE.Mesh(g1, gleamMat)
      gleamA.position.set((crown[0] - 1 - 0.1) * SCALE, (crown[1] - 1.5 - 0.28) * SCALE, R_TUBE + 0.08)
      const gleamB = new THREE.Mesh(g2, gleamMat)
      gleamB.position.set((crown[0] - 1 + 0.14) * SCALE, (crown[1] - 1.5 - 0.14) * SCALE, R_TUBE + 0.08)
      group.add(gleamA, gleamB)

      const baseX = (li - (WORD.length - 1) / 2) * SPACING
      const baseY = (li % 2 === 0 ? 0.18 : -0.22) + Math.sin(li * 4.2) * 0.1
      const baseRot = (li % 2 === 0 ? 1 : -1) * (0.05 + Math.random() * 0.05)
      group.position.set(baseX, baseY, 0)
      group.rotation.z = baseRot
      wordGroup.add(group)

      // soft blob shadow on the wall behind
      const shadowGeo = new THREE.CircleGeometry(1.25, 24)
      geos.push(shadowGeo)
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x100b0e, transparent: true, opacity: 0.12 })
      mats.push(shadowMat)
      const shadow = new THREE.Mesh(shadowGeo, shadowMat)
      shadow.position.set(baseX + 0.4, 10.6 + baseY - 0.55, 0.12)
      shadow.scale.set(1, 0.8, 1)
      scene.add(shadow)

      letters.push({ group, baseX, baseY, baseRot, phase: li * 1.7, scale: 1, pop: 0, spin: 0, radius: 2.1 })
    })

    /* --- spray puffs */
    const PUFF_N = 18
    const puffs: { pts: THREE.Points; mat: THREE.PointsMaterial; vel: Float32Array; t: number; o: THREE.Vector3 }[] = []
    for (let i = 0; i < 3; i++) {
      const arr = new Float32Array(PUFF_N * 3)
      const vel = new Float32Array(PUFF_N * 3)
      const g = new THREE.BufferGeometry()
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3))
      const m = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0, depthWrite: false })
      const p = new THREE.Points(g, m)
      p.frustumCulled = false
      scene.add(p)
      puffs.push({ pts: p, mat: m, vel, t: 9, o: new THREE.Vector3() })
    }
    let puffIdx = 0
    const firePuff = (x: number, y: number) => {
      const p = puffs[puffIdx]
      puffIdx = (puffIdx + 1) % puffs.length
      p.o.set(x, y, 0.4)
      p.t = 0
      p.mat.color.set(can)
      for (let i = 0; i < PUFF_N; i++) {
        p.vel[i * 3] = (Math.random() - 0.5) * 3
        p.vel[i * 3 + 1] = (Math.random() - 0.5) * 3
        p.vel[i * 3 + 2] = Math.random() * 2
      }
    }

    /* --- pointer: spray + letter hover/click */
    const ndc = new THREE.Vector2()
    const rayDir = new THREE.Vector3()
    const hit = new THREE.Vector3()
    let spraying = false
    let lastSprayT = 0
    let stillFrames = 0
    let lastU = 0
    let lastV = 0
    let hoverIdx = -1
    let px = 0

    const pointAt = (clientX: number, clientY: number, planeZ: number): boolean => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
      rayDir.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize()
      const t = (planeZ - camera.position.z) / rayDir.z
      if (t <= 0) return false
      hit.copy(camera.position).addScaledVector(rayDir, t)
      return true
    }

    const dom = renderer.domElement
    const onDown = (e: PointerEvent) => {
      dom.setPointerCapture(e.pointerId)
      // click a letter → somersault
      if (pointAt(e.clientX, e.clientY, wordGroup.position.z)) {
        for (const L of letters) {
          const dx = hit.x - (wordGroup.position.x + L.baseX)
          const dy = hit.y - (wordGroup.position.y + L.baseY)
          if (dx * dx + dy * dy < L.radius * L.radius) {
            L.spin += Math.PI * 2
            break // somersault — and the can keeps working underneath
          }
        }
      }
      spraying = true
      stillFrames = 0
      lastSprayT = 0 // fresh stroke — don't join the previous one
      onMove(e)
    }
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1
      // hover pop
      hoverIdx = -1
      if (pointAt(e.clientX, e.clientY, wordGroup.position.z)) {
        for (let i = 0; i < letters.length; i++) {
          const L = letters[i]
          const dx = hit.x - (wordGroup.position.x + L.baseX)
          const dy = hit.y - (wordGroup.position.y + L.baseY)
          if (dx * dx + dy * dy < L.radius * L.radius) {
            hoverIdx = i
            break
          }
        }
      }
      dom.style.cursor = hoverIdx >= 0 ? "pointer" : "crosshair"
      if (!spraying) return
      if (!pointAt(e.clientX, e.clientY, sprayPlane.position.z)) return
      const u = (hit.x + WALL_W / 2) / WALL_W
      const v = (hit.y - 8 + WALL_H / 2) / WALL_H
      if (u < 0 || u > 1 || v < 0 || v > 1) return
      const moved = Math.abs(u - lastU) + Math.abs(v - lastV) > 0.0015
      const fresh = performance.now() - lastSprayT > 250 // new stroke: don't join old point
      spraySegment(fresh ? u : lastU, fresh ? v : lastV, u, v, !moved)
      if (moved) {
        stillFrames = 0
        if (!reduced && Math.random() < 0.25) firePuff(hit.x, hit.y)
      } else if (++stillFrames === 14) {
        drip(u, v)
        stillFrames = 0
      }
      lastU = u
      lastV = v
      lastSprayT = performance.now()
    }
    const onUp = (e: PointerEvent) => {
      if (spraying && performance.now() - lastSprayT < 300 && Math.random() < 0.5) drip(lastU, lastV)
      spraying = false
      dom.releasePointerCapture(e.pointerId)
    }
    dom.addEventListener("pointerdown", onDown)
    dom.addEventListener("pointermove", onMove)
    dom.addEventListener("pointerup", onUp)
    dom.addEventListener("pointercancel", onUp)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      camera.position.z = w < 640 ? 26 : 20
      wordGroup.scale.setScalar(w < 640 ? 0.47 : w < 1024 ? 0.82 : 1)
      dirty = true
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    /* --- loop */
    let cx = 0
    let dirty = true
    let raf = 0
    let running = false
    const clock = new THREE.Clock()
    const bornAt = 0.15 // per-letter entrance stagger

    const easeOutBack = (t: number) => {
      const c1 = 1.70158
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      cx += (px - cx) * (1 - Math.exp(-dt * 3))
      wordGroup.rotation.y = cx * 0.14
      wordGroup.position.x = cx * 0.5

      letters.forEach((L, i) => {
        // entrance
        let s = 1
        if (!reduced) {
          const born = THREE.MathUtils.clamp((t - 0.2 - i * bornAt) / 0.6, 0, 1)
          s = easeOutBack(born)
        }
        // hover pop
        const popT = hoverIdx === i ? 0.16 : 0
        L.pop += (popT - L.pop) * (1 - Math.exp(-dt * 10))
        // click somersault
        if (L.spin > 0.001) {
          const step = Math.min(L.spin, dt * 9)
          L.group.rotation.y += step
          L.spin -= step
          dirty = true
        } else if (L.group.rotation.y !== 0) {
          L.group.rotation.y = 0
        }
        const bob = reduced ? 0 : Math.sin(t * 1.1 + L.phase) * 0.14
        L.group.position.y = L.baseY + bob
        L.group.rotation.z = L.baseRot + (reduced ? 0 : Math.sin(t * 0.8 + L.phase) * 0.03)
        L.group.scale.setScalar(s * (1 + L.pop))
      })
      if (!reduced) dirty = true

      for (const p of puffs) {
        if (p.t > 1) continue
        p.t += dt * 2
        const arr = p.pts.geometry.attributes.position.array as Float32Array
        for (let i = 0; i < PUFF_N; i++) {
          arr[i * 3] = p.o.x + p.vel[i * 3] * p.t
          arr[i * 3 + 1] = p.o.y + p.vel[i * 3 + 1] * p.t
          arr[i * 3 + 2] = p.o.z + p.vel[i * 3 + 2] * p.t
        }
        p.pts.geometry.attributes.position.needsUpdate = true
        p.mat.opacity = Math.max(0, 0.8 - p.t)
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
      geos.forEach((g) => g.dispose())
      mats.forEach((m) => m.dispose())
      puffs.forEach((p) => {
        p.pts.geometry.dispose()
        p.mat.dispose()
      })
      wallGeo.dispose()
      sprayGeo.dispose()
      wallMat.dispose()
      sprayMat.dispose()
      wallTex.dispose()
      sprayTex.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
    // interactive state lives inside the effect; only motion pref rebuilds it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      role="img"
      aria-label="KROMA in 3D bubble graffiti letters floating in front of a brick wall. Hold and drag to spray-paint the wall; click a letter to make it somersault."
    />
  )
}

/* ------------------------------------------------------------ small bits */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.28em]" style={{ fontFamily: MONO, color: MAGENTA }}>
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
      <span ref={ref} className="text-5xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}>
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
    name: "Murals & commissions",
    price: "from €900",
    body: "Gable ends, restaurant interiors, office kitchens that need to stop apologising. Sketch first, wall second, no stencils unless you ask nicely.",
  },
  {
    name: "Shutters & signage",
    price: "from €450",
    body: "Your shopfront is a canvas that closes every night. We paint shutters the neighbourhood photographs instead of ignoring.",
  },
  {
    name: "Workshops",
    price: "from €60 / head",
    body: "Cans, caps, gloves and a legal wall. Schools, birthdays, team days — everyone leaves with a throwie and most of their hearing.",
  },
]

const CREW = [
  {
    tag: "MOKA",
    role: "Letters & colour",
    bio: "Twenty years deep in letterform. Can argue about bar spacing in an R for a full hour and has.",
    hex: "#ff3ea5",
  },
  {
    tag: "SIEN2",
    role: "Characters",
    bio: "Paints faces four storeys tall from a cherry-picker, listening to the same three dancehall tracks since 2011.",
    hex: "#2fd4e8",
  },
  {
    tag: "REKS",
    role: "Production & rollers",
    bio: "Grids, scaffolding, weatherproofing, permits. The reason the murals are straight and nobody has fallen off anything.",
    hex: "#ffd42a",
  },
]

/* ----------------------------------------------------------------- page */

export default function KromaSite() {
  const reduced = useReducedMotion() ?? false
  const [can, setCan] = useState(CANS[1])
  const api = useRef<WallAPI | null>(null)

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" style={{ background: ASPHALT, color: BONE, fontFamily: SANS }} className="min-h-screen">
        {/* ------------------------------------------------------- header */}
        <header
          className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
          style={{ borderColor: LINE, background: PANEL }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* ml clears the gallery back-chip pinned at left-4 top-4 */}
            <a
              href="#top"
              className={cn("ml-24 flex items-center gap-2.5 no-underline min-[1440px]:ml-0", focusRing)}
              aria-label="Kroma — back to top"
            >
              <SprayCan size={20} style={{ color: MAGENTA }} aria-hidden="true" />
              <span className="text-lg tracking-[0.1em]" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                KROMA
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
              {[
                ["Services", "#services"],
                ["Crew", "#crew"],
                ["Commission", "#commission"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={cn("text-sm no-underline transition-colors duration-200 hover:text-[#ff3ea5]", focusRing)}
                  style={{ fontFamily: MONO, color: MUTE }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Magnetic strength={0.3}>
              <a
                href="#commission"
                className={cn(
                  "hidden items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm no-underline transition-transform duration-200 hover:scale-[1.03] sm:inline-flex",
                  focusRing,
                )}
                style={{ background: MAGENTA, color: ASPHALT, fontFamily: MONO, fontWeight: 600 }}
              >
                Commission a wall
              </a>
            </Magnetic>
          </div>
        </header>

        <main>
          {/* ------------------------------------------------- the wall */}
          <section className="relative flex min-h-[135vh] select-none flex-col overflow-hidden pt-16 md:min-h-screen">
            <GraffitiCanvas reduced={reduced} apiRef={api} />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
              style={{ background: `linear-gradient(to top, ${ASPHALT} 8%, transparent 100%)` }}
            />

            <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6 pt-8 md:pt-12">
              <Reveal>
                <Eyebrow>Kroma · graffiti &amp; mural studio · Berlin-Neukölln</Eyebrow>
              </Reveal>
            </div>

            {/* the writer's bench */}
            <div className="pointer-events-none relative z-10 mx-auto mt-auto w-full max-w-6xl px-6 pb-8">
              <Reveal delay={0.15}>
                <p
                  className="mb-5 max-w-xl text-lg leading-relaxed"
                  style={{ color: BONE, textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}
                >
                  Three writers. Twenty years of walls. Murals, shutters and
                  workshops — commissioned, permitted, and still louder than
                  everything around them.
                </p>
                <div
                  className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl border p-5 backdrop-blur-md"
                  style={{ borderColor: LINE, background: PANEL }}
                >
                  <p className="inline-flex items-center gap-2 text-sm" style={{ fontFamily: MONO, color: BONE }}>
                    <SprayCan size={15} aria-hidden="true" style={{ color: MAGENTA }} />
                    grab a can — hold &amp; drag to spray the wall
                  </p>
                  <div role="group" aria-label="Spray can colour" className="flex items-center gap-2">
                    {CANS.map((c) => {
                      const on = can.id === c.id
                      return (
                        <button
                          key={c.id}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${c.name} paint`}
                          onClick={() => {
                            setCan(c)
                            api.current?.setCan(c.hex)
                          }}
                          className={cn("h-8 w-8 rounded-full border-2 transition-transform duration-200 hover:scale-110", focusRing)}
                          style={{
                            background: c.hex,
                            borderColor: on ? BONE : "rgba(242,239,244,0.25)",
                            transform: on ? "scale(1.15)" : undefined,
                          }}
                        />
                      )
                    })}
                  </div>
                  <span className="text-xs" style={{ fontFamily: MONO, color: MUTE }}>
                    linger for drips · click a letter, it shows off
                  </span>
                  <button
                    type="button"
                    onClick={() => api.current?.buff()}
                    className={cn(
                      "ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200 hover:border-[#ff3ea5] hover:text-[#ff3ea5]",
                      focusRing,
                    )}
                    style={{ fontFamily: MONO, color: BONE, borderColor: LINE }}
                  >
                    <PaintRoller size={14} aria-hidden="true" /> The council buffs it
                  </button>
                </div>
              </Reveal>
            </div>
          </section>

          {/* -------------------------------------------------- services */}
          <section id="services" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <Reveal>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <Eyebrow>Services · everything painted by hand</Eyebrow>
                  <h2 className="text-4xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                    Walls we&rsquo;re allowed to hit.
                  </h2>
                </div>
                <p className="flex max-w-sm items-start gap-2 text-base leading-relaxed" style={{ color: MUTE }}>
                  <Sparkles size={18} className="mt-1 shrink-0" style={{ color: MAGENTA }} aria-hidden="true" />
                  Every job starts with a sketch you approve and ends with a
                  wall your neighbours photograph.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {SERVICES.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.07}>
                  <article
                    className="flex h-full flex-col gap-4 rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff3ea5]"
                    style={{ borderColor: LINE, background: "rgba(242,239,244,0.04)" }}
                  >
                    <h3 className="text-2xl" style={{ fontFamily: DISPLAY, fontWeight: 700, color: BONE }}>
                      {s.name}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: MUTE }}>
                      {s.body}
                    </p>
                    <p className="mt-auto pt-2 text-sm" style={{ fontFamily: MONO, color: MAGENTA }}>
                      {s.price}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------ crew */}
          <section id="crew" className="border-t" style={{ borderColor: LINE, background: "#120f16" }}>
            <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
              <Reveal>
                <div className="mb-12 flex flex-col gap-4">
                  <Eyebrow>The crew · est. 2006, legal since 2014</Eyebrow>
                  <h2 className="max-w-2xl text-4xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                    Three names, one wall at a time.
                  </h2>
                </div>
              </Reveal>
              <div className="mb-16 grid gap-6 md:grid-cols-3">
                {CREW.map((m, i) => (
                  <Reveal key={m.tag} delay={i * 0.07}>
                    <article
                      className="flex h-full flex-col gap-3 rounded-2xl border p-8"
                      style={{ borderColor: LINE, background: "rgba(242,239,244,0.03)" }}
                    >
                      <span
                        className="text-4xl"
                        style={{
                          fontFamily: DISPLAY,
                          fontWeight: 800,
                          color: m.hex,
                          textShadow: "2.5px 2.5px 0 #18131c",
                        }}
                      >
                        {m.tag}
                      </span>
                      <p className="text-xs uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: MUTE }}>
                        {m.role}
                      </p>
                      <p className="text-base leading-relaxed" style={{ color: MUTE }}>
                        {m.bio}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <Reveal>
                  <Counter value={340} suffix="" label="walls painted" />
                </Reveal>
                <Reveal delay={0.06}>
                  <Counter value={4800} suffix="" label="cans emptied (recycled, relax)" />
                </Reveal>
                <Reveal delay={0.12}>
                  <Counter value={26} suffix="" label="workshops a year" />
                </Reveal>
                <Reveal delay={0.18}>
                  <Counter value={0} suffix="" label="arrests since 2014. We're proud-ish." />
                </Reveal>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------ commission */}
          <section id="commission" className="mx-auto flex max-w-6xl flex-col items-start gap-7 px-6 py-24 md:py-32">
            <Reveal>
              <Eyebrow>Commission · sketch within a week</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="max-w-3xl text-4xl leading-[1.02] md:text-7xl" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                Got a boring wall?
                <br />
                <span style={{ color: MAGENTA }}>Our condolences.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <Magnetic strength={0.15}>
                <a
                  href="mailto:paint@kroma.berlin"
                  className={cn(
                    "break-all text-3xl underline decoration-4 underline-offset-8 transition-colors duration-200 hover:text-[#ff3ea5] sm:text-5xl",
                    focusRing,
                  )}
                  style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE, textDecorationColor: MAGENTA }}
                >
                  paint@kroma.berlin
                </a>
              </Magnetic>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="max-w-md text-base leading-relaxed" style={{ color: MUTE }}>
                Send a photo of the wall, roughly where it lives, and anything
                you never want to see on it. We reply with a sketch, a price
                and a weather-dependent date.
              </p>
            </Reveal>
          </section>

          {/* ------------------------------------------------------ footer */}
          <footer className="border-t" style={{ borderColor: LINE }}>
            <div
              className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-xs uppercase tracking-[0.18em]"
              style={{ fontFamily: MONO, color: MUTE }}
            >
              <span>© 2026 Kroma GbR — Berlin-Neukölln</span>
              <span>Paint pens in the shop · sorry about 2009</span>
            </div>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}
