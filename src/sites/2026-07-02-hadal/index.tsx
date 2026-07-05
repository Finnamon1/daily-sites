import { useEffect, useRef, useState, type ReactNode } from "react"
import { MotionConfig, animate, useInView, useReducedMotion } from "framer-motion"
import * as THREE from "three"
import { Anchor, ArrowDown, ArrowUpRight, Radio, ShieldCheck, Waves } from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "HADAL — crewed descents to the deep ocean",
  description:
    "An expedition company flying three-person submersible dives to 6,000 m. The whole page is one continuous three.js ocean: scrolling descends the camera through a 6 km water column — sunbeams give way to a swarm of procedurally animated jellyfish, then a bioluminescent plankton field, until the abyssal seafloor and its hydrothermal vent arrive, with DSV Persephone running beside you under her own headlights. Marine snow parallaxes past, clicking the dark sets off plankton bursts, and a live gauge tracks depth, pressure and temperature the whole way down. Plus magnetic CTAs, animated counters and scroll reveals.",
  date: "2026-07-02",
  type: "Expedition travel / booking",
  interaction:
    "Scroll-driven WebGL ocean descent — the camera sinks through a real 6 km water column past sunbeams, pulsing jellyfish, plankton fields and a companion submersible to the vented seafloor, with a live depth/pressure/temperature gauge, click-to-flash bioluminescence and marine snow throughout.",
}

/* --------------------------------------------------------------- palette */
// abyss ink · bone text · ONE accent: bioluminescent cyan. The amber of the
// vent and the sub's windows lives only inside the 3D scene.
const ABYSS = "#020a12"
const BONE = "#e9f1f2" // ~15:1 on abyss
const MUTE = "#93a7b4" // ~7:1 on abyss
const LINE = "rgba(110,232,240,0.16)"
const CYAN = "#6ee8f0" // ~11:1 on abyss
const PANEL = "rgba(3,14,24,0.72)"

const DISPLAY = "'Bricolage Grotesque', 'Arial Black', sans-serif"
const SANS = "'DM Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6ee8f0]"

/* ------------------------------------------------------------ depth maths
   1 world unit = 100 m. The page's scroll position maps to depth: 0 at the
   top, 6,000 m when the #hadal section reaches the viewport, clamped there
   so the booking sections below all sit "on the seafloor". */

const MAX_DEPTH = 6000
const U = 100 // metres per world unit

// piecewise: each zone panel, when centred in the viewport, pins its depth
const WAYPOINTS: [string, number][] = [
  ["twilight", 600],
  ["midnight", 2500],
  ["hadal", 6000],
]

function depthFromScroll(): number {
  const vh = window.innerHeight
  const y = window.scrollY
  let prevPos = 0
  let prevD = 0
  for (const [id, d] of WAYPOINTS) {
    const el = document.getElementById(id)
    if (!el) return 0
    const pos = el.offsetTop + el.offsetHeight / 2 - vh / 2
    if (y <= pos) {
      const f = (y - prevPos) / Math.max(pos - prevPos, 1)
      return Math.max(0, prevD + f * (d - prevD))
    }
    prevPos = pos
    prevD = d
  }
  return MAX_DEPTH
}

const ZONES = [
  { until: 200, name: "Sunlight zone" },
  { until: 1000, name: "Twilight zone" },
  { until: 4000, name: "Midnight zone" },
  { until: 6000, name: "Abyssal zone" },
  { until: Infinity, name: "Hadal zone" },
]
const zoneAt = (d: number) => ZONES.find((z) => d < z.until) ?? ZONES[ZONES.length - 1]

/* ================================================== THREE: the water column
   One fixed canvas behind the whole page. Everything lives at its true depth
   in a 60-unit-tall world; scroll just moves the camera down through it.
   Marine snow wraps around the camera, jellyfish pulse in the twilight band,
   plankton sheets twinkle in the midnight band, and the floor — hills, a
   vent, rising embers — waits at the bottom. Reduced motion: creatures hold
   still and frames render only when depth or pointer actually change. */

function OceanCanvas({ reduced }: { reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const fog = new THREE.FogExp2(0x0d5c74, 0.05)
    scene.fog = fog
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 80)

    const surf = new THREE.Color(0x0d5c74)
    const deep = new THREE.Color(0x010409)
    const bg = new THREE.Color()

    const sun = new THREE.DirectionalLight(0xcfefff, 1.3)
    sun.position.set(2, 10, 3)
    scene.add(sun)
    const amb = new THREE.AmbientLight(0x8fb8c9, 0.35)
    scene.add(amb)

    /* --- sunbeams (top 400 m) */
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xbfeaff,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const beamGeo = new THREE.PlaneGeometry(2.4, 16)
    const beams: THREE.Mesh[] = []
    for (let i = 0; i < 5; i++) {
      const b = new THREE.Mesh(beamGeo, beamMat)
      b.position.set(-6 + i * 3 + Math.sin(i * 7) * 1.2, -2, -6 - (i % 3))
      b.rotation.z = 0.22 + Math.sin(i * 3) * 0.1
      b.rotation.y = i * 0.7
      beams.push(b)
      scene.add(b)
    }

    /* --- marine snow, wraps vertically around the camera */
    const SNOW = 1700
    const snowPos = new Float32Array(SNOW * 3)
    for (let i = 0; i < SNOW; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * 26
      snowPos[i * 3 + 1] = -Math.random() * 70
      snowPos[i * 3 + 2] = -Math.random() * 18 - 1
    }
    const snowGeo = new THREE.BufferGeometry()
    snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPos, 3))
    const snowMat = new THREE.PointsMaterial({
      color: 0xbfd8e2,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    })
    const snow = new THREE.Points(snowGeo, snowMat)
    snow.frustumCulled = false
    scene.add(snow)

    /* --- jellyfish swarm, 250–950 m */
    type Jelly = {
      group: THREE.Group
      dome: THREE.Mesh
      tentacles: { line: THREE.Line; base: Float32Array }[]
      phase: number
      baseY: number
      drift: number
    }
    const domeGeo = new THREE.SphereGeometry(0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2)
    const jellyMat = new THREE.MeshBasicMaterial({
      color: 0x8fe3ff,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const jellyCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff9ecf,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const tentMat = new THREE.LineBasicMaterial({
      color: 0x9feaff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const jellies: Jelly[] = []
    for (let i = 0; i < 8; i++) {
      const group = new THREE.Group()
      const dome = new THREE.Mesh(domeGeo, jellyMat)
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), jellyCoreMat)
      core.position.y = 0.05
      group.add(dome, core)
      const tentacles: Jelly["tentacles"] = []
      for (let t = 0; t < 6; t++) {
        const pts = new Float32Array(10 * 3)
        const a = (t / 6) * Math.PI * 2
        for (let k = 0; k < 10; k++) {
          pts[k * 3] = Math.cos(a) * 0.2
          pts[k * 3 + 1] = -k * 0.13
          pts[k * 3 + 2] = Math.sin(a) * 0.2
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute("position", new THREE.BufferAttribute(pts.slice(), 3))
        const line = new THREE.Line(g, tentMat)
        group.add(line)
        tentacles.push({ line, base: pts })
      }
      const baseY = -(2.5 + Math.random() * 7)
      group.position.set((Math.random() - 0.5) * 16, baseY, -3 - Math.random() * 9)
      const s = 0.6 + Math.random() * 0.9
      group.scale.setScalar(s)
      jellies.push({ group, dome, tentacles, phase: Math.random() * 9, baseY, drift: Math.random() * 2 })
      scene.add(group)
    }

    /* --- plankton sheets, 1,000–4,500 m: three clouds twinkling in phase groups */
    const planktonClouds: { pts: THREE.Points; mat: THREE.PointsMaterial; phase: number }[] = []
    for (let c = 0; c < 3; c++) {
      const N = 420
      const arr = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 24
        arr[i * 3 + 1] = -10 - Math.random() * 35
        arr[i * 3 + 2] = -Math.random() * 16 - 1
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3))
      const m = new THREE.PointsMaterial({
        color: c === 1 ? 0x8ff2da : 0x6ee8f0,
        size: 0.034,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const p = new THREE.Points(g, m)
      p.frustumCulled = false
      planktonClouds.push({ pts: p, mat: m, phase: c * 2.1 })
      scene.add(p)
    }

    /* --- DSV Persephone, running beside you below ~600 m */
    const subGroup = new THREE.Group()
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xdce3e8, roughness: 0.45, metalness: 0.35 })
    const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.8, 6, 18), hullMat)
    hull.rotation.z = Math.PI / 2
    const sail = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.26, 14), hullMat)
    sail.position.y = 0.36
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffc46b })
    const win = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), winMat)
    win.position.set(0.62, 0, 0)
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff5f45 })
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), beaconMat)
    beacon.position.y = 0.55
    const lightConeMat = new THREE.MeshBasicMaterial({
      color: 0xcfe9ff,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const beam1 = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.2, 16, 1, true), lightConeMat)
    beam1.position.set(0.95, -1.5, 0)
    beam1.rotation.z = 0.25
    const subLight = new THREE.PointLight(0xbfe3ff, 6, 7)
    subLight.position.set(0.3, 0.9, 0.6)
    subGroup.add(hull, sail, win, beacon, beam1, subLight)
    subGroup.position.set(3.1, -8, -4.5)
    subGroup.visible = false
    scene.add(subGroup)

    /* --- the seafloor at 6,000 m: hills, a vent, rising embers */
    const floorGeo = new THREE.PlaneGeometry(70, 36, 90, 46)
    floorGeo.rotateX(-Math.PI / 2)
    {
      const p = floorGeo.attributes.position.array as Float32Array
      for (let i = 0; i < p.length; i += 3) {
        const x = p[i]
        const z = p[i + 2]
        p[i + 1] =
          Math.sin(x * 0.32) * 0.5 + Math.sin(z * 0.47 + 1.7) * 0.4 + Math.sin((x + z) * 0.13) * 0.8
      }
      floorGeo.computeVertexNormals()
    }
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x11202c, roughness: 1, flatShading: true })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.position.y = -MAX_DEPTH / U - 2.4
    scene.add(floor)

    const vent = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 1.6, 10, 1),
      new THREE.MeshStandardMaterial({ color: 0x1c2833, roughness: 1, flatShading: true }),
    )
    vent.position.set(1.6, -MAX_DEPTH / U - 1.6, -5)
    scene.add(vent)
    const ventLight = new THREE.PointLight(0xff7a2f, 14, 12)
    ventLight.position.set(1.6, -MAX_DEPTH / U - 0.6, -5)
    scene.add(ventLight)

    const EMB = 130
    const embPos = new Float32Array(EMB * 3)
    const embSeed = new Float32Array(EMB)
    for (let i = 0; i < EMB; i++) {
      embPos[i * 3] = 1.6 + (Math.random() - 0.5) * 0.7
      embPos[i * 3 + 1] = -MAX_DEPTH / U - 0.8 + Math.random() * 4
      embPos[i * 3 + 2] = -5 + (Math.random() - 0.5) * 0.7
      embSeed[i] = Math.random()
    }
    const embGeo = new THREE.BufferGeometry()
    embGeo.setAttribute("position", new THREE.BufferAttribute(embPos, 3))
    const embMat = new THREE.PointsMaterial({
      color: 0xffa04d,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const embers = new THREE.Points(embGeo, embMat)
    embers.frustumCulled = false
    scene.add(embers)

    /* --- bioluminescent click-bursts (a small pool of point shells) */
    type Burst = { pts: THREE.Points; mat: THREE.PointsMaterial; dirs: Float32Array; origin: THREE.Vector3; t: number }
    const bursts: Burst[] = []
    for (let b = 0; b < 3; b++) {
      const N = 46
      const arr = new Float32Array(N * 3)
      const dirs = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
        dirs[i * 3] = v.x
        dirs[i * 3 + 1] = v.y
        dirs[i * 3 + 2] = v.z
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3))
      const m = new THREE.PointsMaterial({
        color: 0x9ff5ea,
        size: 0.07,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const pts = new THREE.Points(g, m)
      pts.visible = false
      pts.frustumCulled = false
      scene.add(pts)
      bursts.push({ pts, mat: m, dirs, origin: new THREE.Vector3(), t: 2 })
    }
    let burstIdx = 0
    const ndc = new THREE.Vector2()
    const rayDir = new THREE.Vector3()
    const fireBurst = (clientX: number, clientY: number) => {
      if (camera.position.y > -8) return // needs the dark
      const b = bursts[burstIdx]
      burstIdx = (burstIdx + 1) % bursts.length
      ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1)
      rayDir.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize()
      b.origin.copy(camera.position).addScaledVector(rayDir, 6)
      b.t = 0
      b.pts.visible = true
    }
    const onTap = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("a,button,input,[data-solid]")) return
      fireBurst(e.clientX, e.clientY)
    }
    window.addEventListener("pointerdown", onTap)

    /* --- pointer sway: one lerped source for camera drift */
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (!reduced) window.addEventListener("pointermove", onPointer)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      dirty = true
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    /* --- the loop */
    let camY = 0
    let dirty = true
    let raf = 0
    let running = false
    const clock = new THREE.Clock()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      const depth = depthFromScroll()
      const targetY = -depth / U

      const ease = reduced ? 1 : 1 - Math.exp(-dt * 4.5)
      if (Math.abs(targetY - camY) > 0.0004) {
        camY += (targetY - camY) * ease
        dirty = true
      }
      cx += (tx - cx) * (1 - Math.exp(-dt * 3))
      cy += (ty - cy) * (1 - Math.exp(-dt * 3))

      camera.position.set(cx * 0.5, camY, 6.4)
      // ease the nose down as the floor arrives
      const tilt = Math.min(1, Math.max(0, (depth - 5300) / 700)) * 0.24
      camera.rotation.set(-cy * 0.04 - tilt, -cx * 0.06, 0)

      // atmosphere by depth
      const k = Math.pow(Math.min(depth / 1200, 1), 0.75)
      bg.copy(surf).lerp(deep, k)
      renderer.setClearColor(bg)
      fog.color.copy(bg)
      sun.intensity = 1.3 * (1 - k)
      amb.intensity = 0.35 - 0.22 * k
      beamMat.opacity = 0.07 * Math.max(0, 1 - depth / 450)

      if (!reduced) {
        // snow drifts and wraps around the camera
        const sp = snowGeo.attributes.position.array as Float32Array
        for (let i = 0; i < SNOW; i++) {
          let y = sp[i * 3 + 1] + dt * 0.06 // gentle rise = you are sinking
          if (y > camY + 10) y -= 20
          if (y < camY - 10) y += 20
          sp[i * 3 + 1] = y
        }
        snowGeo.attributes.position.needsUpdate = true

        // jellyfish pulse + tentacle wave
        for (const j of jellies) {
          const ph = t * 1.7 + j.phase
          const pulse = 1 + Math.sin(ph) * 0.13
          j.dome.scale.set(1 / Math.sqrt(pulse), pulse, 1 / Math.sqrt(pulse))
          j.group.position.y = j.baseY + Math.sin(t * 0.4 + j.phase) * 0.5
          j.group.position.x += Math.sin(t * 0.13 + j.drift) * dt * 0.12
          for (let ti = 0; ti < j.tentacles.length; ti++) {
            const { line, base } = j.tentacles[ti]
            const arr = line.geometry.attributes.position.array as Float32Array
            for (let k2 = 0; k2 < 10; k2++) {
              const sway = Math.sin(ph * 0.9 + k2 * 0.55 + ti) * 0.045 * k2
              arr[k2 * 3] = base[k2 * 3] + sway
              arr[k2 * 3 + 2] = base[k2 * 3 + 2] + Math.cos(ph * 0.8 + k2 * 0.5 + ti) * 0.03 * k2
            }
            line.geometry.attributes.position.needsUpdate = true
          }
        }

        // plankton twinkle in three phase groups
        for (const c of planktonClouds) c.mat.opacity = 0.28 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.1 + c.phase))

        // embers rise from the vent
        const ep = embGeo.attributes.position.array as Float32Array
        for (let i = 0; i < EMB; i++) {
          let y = ep[i * 3 + 1] + dt * (0.35 + embSeed[i] * 0.5)
          if (y > -MAX_DEPTH / U + 3.6) y = -MAX_DEPTH / U - 0.9
          ep[i * 3 + 1] = y
        }
        embGeo.attributes.position.needsUpdate = true
        dirty = true
      }

      // companion sub below ~600 m
      const showSub = depth > 600
      if (subGroup.visible !== showSub) {
        subGroup.visible = showSub
        dirty = true
      }
      if (showSub && !reduced) {
        subGroup.position.y = camY - 1.3 + Math.sin(t * 0.5) * 0.25
        subGroup.position.x = 3.1 + Math.sin(t * 0.22) * 0.4
        subGroup.rotation.y = Math.sin(t * 0.18) * 0.25
        beaconMat.color.setScalar(0)
        beaconMat.color.setHex(Math.sin(t * 4) > 0.4 ? 0xff5f45 : 0x431410)
      } else if (showSub) {
        subGroup.position.y = camY - 1.3
      }

      // bursts
      for (const b of bursts) {
        if (b.t >= 1.3) {
          if (b.pts.visible) {
            b.pts.visible = false
            dirty = true
          }
          continue
        }
        b.t += dt
        const r = 0.4 + b.t * 2.1
        const arr = b.pts.geometry.attributes.position.array as Float32Array
        for (let i = 0; i < arr.length / 3; i++) {
          arr[i * 3] = b.origin.x + b.dirs[i * 3] * r
          arr[i * 3 + 1] = b.origin.y + b.dirs[i * 3 + 1] * r
          arr[i * 3 + 2] = b.origin.z + b.dirs[i * 3 + 2] * r
        }
        b.pts.geometry.attributes.position.needsUpdate = true
        b.mat.opacity = Math.max(0, 1 - b.t / 1.3)
        dirty = true
      }

      if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001) dirty = true
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
    start()
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)

    return () => {
      stop()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("pointerdown", onTap)
      if (!reduced) window.removeEventListener("pointermove", onPointer)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Line) {
          o.geometry.dispose()
        }
      })
      ;[beamMat, snowMat, jellyMat, jellyCoreMat, tentMat, hullMat, winMat, beaconMat, lightConeMat, floorMat, embMat].forEach((m) => m.dispose())
      bursts.forEach((b) => b.mat.dispose())
      planktonClouds.forEach((c) => c.mat.dispose())
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [reduced])

  return <div ref={wrap} aria-hidden="true" className="fixed inset-0" />
}

/* ------------------------------------------------------------- the gauge */

function DepthGauge() {
  const [depth, setDepth] = useState(0)
  useEffect(() => {
    let raf = 0
    let last = -1
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const d = Math.round(depthFromScroll())
      if (d !== last) {
        last = d
        setDepth(d)
      }
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  const zone = zoneAt(depth)
  const pressure = Math.round(1 + depth / 10)
  const temp = Math.max(2, Math.round(22 - depth * 0.03))

  return (
    <div
      aria-hidden="true"
      data-solid
      className="pointer-events-none fixed bottom-4 right-4 z-40 rounded-xl border px-4 py-3 backdrop-blur-md"
      style={{ borderColor: LINE, background: PANEL, fontFamily: MONO }}
    >
      <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: MUTE }}>
        {zone.name}
      </p>
      <p className="text-2xl tabular-nums" style={{ color: CYAN }}>
        {depth.toLocaleString().padStart(5, " ")} m
      </p>
      <p className="text-[11px] tabular-nums" style={{ color: MUTE }}>
        {pressure.toLocaleString()} atm · {temp} °C
      </p>
    </div>
  )
}

/* --------------------------------------------------------------- zone nav */

const ZONE_STOPS = [
  { label: "0 m", target: "top" },
  { label: "200 m", target: "twilight" },
  { label: "1000 m", target: "midnight" },
  { label: "6000 m", target: "hadal" },
  { label: "Base", target: "expeditions" },
]

function ZoneRail() {
  return (
    <nav
      aria-label="Descent shortcuts"
      data-solid
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 lg:flex"
    >
      {ZONE_STOPS.map((z) => (
        <a
          key={z.target}
          href={`#${z.target}`}
          className={cn(
            "rounded-md px-2 py-1 text-[11px] no-underline transition-colors duration-200 hover:text-[#6ee8f0]",
            focusRing,
          )}
          style={{ fontFamily: MONO, color: MUTE }}
        >
          — {z.label}
        </a>
      ))}
    </nav>
  )
}

/* ------------------------------------------------------------ small bits */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.28em]" style={{ fontFamily: MONO, color: CYAN }}>
      {children}
    </p>
  )
}

function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-solid
      className={cn("max-w-xl rounded-2xl border p-8 backdrop-blur-md md:p-10", className)}
      style={{ borderColor: LINE, background: PANEL }}
    >
      {children}
    </div>
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
    const c = animate(0, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value, reduced])
  return (
    <div className="flex flex-col gap-1.5">
      <span ref={ref} className="text-5xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 700, color: BONE }}>
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

const EXPEDITIONS = [
  {
    name: "Cayman Trough",
    depth: "3,780 m",
    detail: "Lost-City-class hydrothermal field · 9 days · 3 dives",
    when: "Jun–Aug 2027",
    price: "from $38,000",
    seats: "5 seats left",
  },
  {
    name: "Horizon Deep Shoulder",
    depth: "6,250 m",
    detail: "Tonga Trench · 12 days · 2 hadal descents",
    when: "Oct 2027",
    price: "from $65,000",
    seats: "2 seats left",
  },
  {
    name: "Monterey Canyon by night",
    depth: "1,850 m",
    detail: "Bioluminescence survey with MBARI scientists · 5 days",
    when: "Monthly",
    price: "from $19,500",
    seats: "Open",
  },
]

const SPECS = [
  ["Personnel sphere", "Titanium, Ø 2.1 m, 3 crew"],
  ["Rated depth", "6,500 m (tested to 7,150 m)"],
  ["Life support", "96 h × 3 crew, fully redundant"],
  ["Lighting", "10 kW LED array — the only light for 4,000 m"],
  ["Descent rate", "30 m/min; 3.5 h to the hadal floor"],
  ["Support vessel", "RV Palliser, 64 m, moon-pool launch"],
]

/* ----------------------------------------------------------------- page */

export default function HadalSite() {
  const reduced = useReducedMotion() ?? false

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" style={{ background: ABYSS, color: BONE, fontFamily: SANS }} className="min-h-screen">
        <OceanCanvas reduced={reduced} />
        <DepthGauge />
        <ZoneRail />

        {/* ------------------------------------------------------- header */}
        <header
          data-solid
          className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
          style={{ borderColor: LINE, background: "rgba(2,10,18,0.6)" }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* ml clears the gallery back-chip pinned at left-4 top-4 */}
            <a
              href="#top"
              className={cn("ml-24 flex items-center gap-2.5 no-underline min-[1440px]:ml-0", focusRing)}
              aria-label="Hadal — back to the surface"
            >
              <Waves size={20} style={{ color: CYAN }} aria-hidden="true" />
              <span className="text-lg tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                HADAL
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
              {[
                ["The descent", "#twilight"],
                ["Vessel", "#vessel"],
                ["Expeditions", "#expeditions"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={cn("text-sm no-underline transition-colors duration-200 hover:text-[#6ee8f0]", focusRing)}
                  style={{ fontFamily: MONO, color: MUTE }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Magnetic strength={0.3}>
              <a
                href="#expeditions"
                className={cn(
                  "hidden items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm no-underline transition-transform duration-200 hover:scale-[1.03] sm:inline-flex",
                  focusRing,
                )}
                style={{ background: CYAN, color: ABYSS, fontFamily: MONO, fontWeight: 600 }}
              >
                Reserve a descent
              </a>
            </Magnetic>
          </div>
        </header>

        <main className="relative z-10">
          {/* -------------------------------------------------- surface */}
          <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-16">
            <div className="flex max-w-2xl flex-col gap-6">
              <Reveal>
                <Eyebrow>Hadal Expeditions · crewed submersible descents</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h1
                  className="text-5xl leading-[0.98] sm:text-7xl md:text-8xl"
                  style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE }}
                >
                  Go where light
                  <br />
                  gives up.
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: MUTE }}>
                  Three seats, one titanium sphere, six kilometres of water.
                  We fly scientists and the incurably curious to the deep
                  ocean — the twilight zone, the midnight zone, and the floor
                  itself.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="flex flex-wrap items-center gap-5">
                  <Magnetic strength={0.3}>
                    <a
                      href="#expeditions"
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 text-base no-underline transition-transform duration-200 hover:scale-[1.03]",
                        focusRing,
                      )}
                      style={{ background: CYAN, color: ABYSS, fontFamily: MONO, fontWeight: 600 }}
                    >
                      Reserve a descent <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </Magnetic>
                  <span className="inline-flex items-center gap-2 text-sm" style={{ fontFamily: MONO, color: MUTE }}>
                    <ArrowDown size={16} aria-hidden="true" style={{ color: CYAN }} />
                    scroll — the page is the water column
                  </span>
                </div>
              </Reveal>
            </div>
          </section>

          {/* -------------------------------------------------- twilight */}
          <section id="twilight" className="mx-auto flex min-h-[150vh] max-w-6xl items-center px-6">
            <Reveal className="ml-auto">
              <GlassPanel>
                <Eyebrow>200 – 1,000 m · mesopelagic</Eyebrow>
                <h2 className="mb-4 mt-3 text-4xl md:text-5xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                  The twilight zone
                </h2>
                <p className="text-base leading-relaxed md:text-lg" style={{ color: MUTE }}>
                  The last blue light fades around you and the largest animal
                  migration on Earth begins — billions of creatures rising to
                  feed under cover of dusk. Siphonophores longer than buses.
                  Jellies that switch on when the sun switches off. This is
                  where most passengers stop talking mid-sentence.
                </p>
              </GlassPanel>
            </Reveal>
          </section>

          {/* -------------------------------------------------- midnight */}
          <section id="midnight" className="mx-auto flex min-h-[160vh] max-w-6xl items-center px-6">
            <Reveal>
              <GlassPanel>
                <Eyebrow>1,000 – 4,000 m · bathypelagic</Eyebrow>
                <h2 className="mb-4 mt-3 text-4xl md:text-5xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                  The midnight zone
                </h2>
                <p className="mb-4 text-base leading-relaxed md:text-lg" style={{ color: MUTE }}>
                  No sunlight has ever reached this water. Ninety percent of
                  the animals here make their own — flashes, lures and alarms
                  in a language older than eyes. We cut the thrusters, kill
                  the cabin lights, and let the dark introduce itself.
                </p>
                <p className="text-sm" style={{ fontFamily: MONO, color: CYAN }}>
                  Try it now — click anywhere in the dark water.
                </p>
              </GlassPanel>
            </Reveal>
          </section>

          {/* ------------------------------------------------ the numbers */}
          <section className="mx-auto max-w-6xl px-6 py-24">
            <Reveal>
              <GlassPanel className="max-w-none">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  <Counter value={217} suffix="" label="crewed descents flown" />
                  <Counter value={6412} suffix=" m" label="deepest — Horizon Deep, 2025" />
                  <Counter value={96} suffix=" h" label="life support per dive" />
                  <Counter value={0} suffix="" label="incidents. We plan to keep it." />
                </div>
              </GlassPanel>
            </Reveal>
          </section>

          {/* ---------------------------------------------------- hadal */}
          <section id="hadal" className="mx-auto flex min-h-[140vh] max-w-6xl items-center px-6">
            <Reveal className="ml-auto">
              <GlassPanel>
                <Eyebrow>6,000 m · the floor</Eyebrow>
                <h2 className="mb-4 mt-3 text-4xl md:text-5xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                  Touchdown.
                </h2>
                <p className="text-base leading-relaxed md:text-lg" style={{ color: MUTE }}>
                  Grey hills that have never seen weather. A hydrothermal vent
                  smoking quietly in the headlights, hosting animals that run
                  on chemistry instead of sunlight. More people have stood on
                  the Moon than have hovered here. You&rsquo;ll have four hours,
                  and they will not be enough.
                </p>
              </GlassPanel>
            </Reveal>
          </section>

          {/* --------------------------------------------------- vessel */}
          <section id="vessel" className="mx-auto max-w-6xl px-6 py-24">
            <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start">
              <Reveal>
                <div className="flex flex-col gap-5">
                  <Eyebrow>The vessel</Eyebrow>
                  <h2 className="text-4xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                    DSV Persephone
                  </h2>
                  <p className="max-w-md text-base leading-relaxed md:text-lg" style={{ color: MUTE }}>
                    Named for the one who commutes to the underworld. Built in
                    Bremen, certified by DNV, flown by pilots with a thousand
                    hours in the dark. She is small, unglamorous and
                    absurdly over-engineered — exactly what you want six
                    kilometres under the launch ship.
                  </p>
                  <div className="flex items-center gap-6 text-sm" style={{ fontFamily: MONO, color: MUTE }}>
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck size={16} style={{ color: CYAN }} aria-hidden="true" /> DNV classed
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Radio size={16} style={{ color: CYAN }} aria-hidden="true" /> 24/7 acoustic link
                    </span>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <GlassPanel className="max-w-none">
                  <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    {SPECS.map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1 border-l-2 pl-4" style={{ borderColor: LINE }}>
                        <dt className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: CYAN }}>
                          {k}
                        </dt>
                        <dd className="text-sm leading-relaxed" style={{ color: BONE }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </GlassPanel>
              </Reveal>
            </div>
          </section>

          {/* ----------------------------------------------- expeditions */}
          <section id="expeditions" className="mx-auto max-w-6xl px-6 py-24">
            <Reveal>
              <div className="mb-10 flex flex-col gap-4">
                <Eyebrow>2027 season · three seats per dive</Eyebrow>
                <h2 className="text-4xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 800 }}>
                  Pick your depth.
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {EXPEDITIONS.map((x, i) => (
                <Reveal key={x.name} delay={i * 0.07}>
                  <a
                    href="mailto:dive@hadal.earth?subject=Reservation"
                    aria-label={`Reserve: ${x.name}, ${x.depth}, ${x.price}`}
                    data-solid
                    className={cn(
                      "group flex h-full flex-col gap-4 rounded-2xl border p-7 no-underline backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-[#6ee8f0]",
                      focusRing,
                    )}
                    style={{ borderColor: LINE, background: PANEL }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: CYAN }}>
                        {x.depth}
                      </span>
                      <span
                        className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
                        style={{ fontFamily: MONO, color: MUTE, borderColor: LINE }}
                      >
                        {x.seats}
                      </span>
                    </div>
                    <h3 className="text-2xl" style={{ fontFamily: DISPLAY, fontWeight: 700, color: BONE }}>
                      {x.name}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: MUTE }}>
                      {x.detail}
                    </p>
                    <div className="mt-auto flex items-baseline justify-between pt-3">
                      <span className="text-sm" style={{ fontFamily: MONO, color: MUTE }}>
                        {x.when}
                      </span>
                      <span className="text-base" style={{ fontFamily: MONO, color: BONE }}>
                        {x.price}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm" style={{ fontFamily: MONO, color: CYAN }}>
                      Reserve
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------ footer */}
          <footer className="border-t" style={{ borderColor: LINE }}>
            <div
              data-solid
              className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 backdrop-blur-sm md:py-28"
            >
              <Reveal>
                <Eyebrow>Questions first, deposits later</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <Magnetic strength={0.15}>
                  <a
                    href="mailto:dive@hadal.earth"
                    className={cn(
                      "break-all text-3xl underline decoration-2 underline-offset-8 transition-colors duration-200 hover:text-[#6ee8f0] sm:text-5xl md:text-6xl",
                      focusRing,
                    )}
                    style={{ fontFamily: DISPLAY, fontWeight: 800, color: BONE, textDecorationColor: CYAN }}
                  >
                    dive@hadal.earth
                  </a>
                </Magnetic>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="flex max-w-md items-start gap-2 text-base leading-relaxed" style={{ color: MUTE }}>
                  <Anchor size={18} className="mt-1 shrink-0" style={{ color: CYAN }} aria-hidden="true" />
                  Every expedition carries a working scientist at no charge.
                  If your dive maps a new vent field, it gets your name.
                </p>
              </Reveal>
              <div
                className="flex w-full flex-wrap items-center justify-between gap-4 border-t pt-6 text-xs uppercase tracking-[0.18em]"
                style={{ borderColor: LINE, fontFamily: MONO, color: MUTE }}
              >
                <span>© 2026 Hadal Expeditions Ltd — Wellington &amp; Ponta Delgada</span>
                <span>Depth rendered honestly · 1 px ≈ 1 fathom</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}
