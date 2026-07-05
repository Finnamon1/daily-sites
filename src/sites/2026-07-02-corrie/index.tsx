import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { MotionConfig, animate, useInView, useReducedMotion } from "framer-motion"
import * as THREE from "three"
import {
  ArrowUpRight,
  CloudFog,
  CloudRain,
  CloudSnow,
  Mountain,
  Snowflake,
  Sun,
  Wind,
} from "lucide-react"
import { Magnetic } from "@/components/fx/Magnetic"
import { Reveal } from "@/components/fx/Reveal"
import type { SiteMeta } from "../types"

/* ------------------------------------------------------------------ meta */

export const meta: SiteMeta = {
  title: "CORRIE — mountain weather for the Cairngorm plateau",
  description:
    "A specialist forecast service for winter climbers and ski tourers on the Cairngorm plateau. Featured interaction: a three.js weather machine — a low-poly massif with a snowline, a blinking summit station and real weather you drive yourself: drag the sun through 24 hours (the sky, light colour and fog ramp through dawn, noon, dusk and starry night), switch between clear, rain, snow and whiteout particle systems, and crank the wind to lean the precipitation over. The forecast readout (summit temp, wind chill, visibility, freezing level) is derived live from the machine's state. Plus route-condition cards, animated counters and a daily-report signup.",
  date: "2026-07-02",
  type: "Weather service / conditions report",
  interaction:
    "A drivable three.js weather machine — drag the sun through 24 h of sky/light/fog ramps over a low-poly massif, switch clear/rain/snow/whiteout particle systems, crank the wind, and watch the live forecast readout follow. Plus route cards, counters and a signup.",
}

/* --------------------------------------------------------------- palette */
// granite dark UI around a sky that recolours itself; ONE accent: high-vis
// safety orange. Status dots on route cards keep their semantic colours.
const GRANITE = "#101318"
const PANEL = "rgba(13,17,23,0.72)"
const BONE = "#edeff2" // ~15:1 on granite
const MUTE = "#9aa3ad" // ~7:1 on granite
const LINE = "rgba(237,239,242,0.14)"
const ORANGE = "#ff7847" // ~7:1 on granite
const GOOD = "#7fd08f"
const WARN = "#f2c14e"
const BAD = "#f26d5f"

const DISPLAY = "'Space Grotesk', system-ui, sans-serif"
const SANS = "'IBM Plex Sans', system-ui, sans-serif"
const MONO = "'IBM Plex Mono', ui-monospace, monospace"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff7847]"

/* --------------------------------------------------------------- weather */

type WeatherId = "clear" | "rain" | "snow" | "whiteout"

const WEATHERS: { id: WeatherId; name: string; icon: typeof Sun }[] = [
  { id: "clear", name: "Clear", icon: Sun },
  { id: "rain", name: "Rain", icon: CloudRain },
  { id: "snow", name: "Snow", icon: CloudSnow },
  { id: "whiteout", name: "Whiteout", icon: CloudFog },
]

type Machine = { hour: number; weather: WeatherId; wind: number }

/** sky colour keyframes across 24 h */
const SKY_KEYS: [number, number][] = [
  [0, 0x070b18],
  [4.5, 0x0a1226],
  [6, 0x63405c],
  [7.5, 0xc97a55],
  [10, 0x8fb0d1],
  [13, 0x9fc0dd],
  [16, 0x8aa9c9],
  [18, 0xc06a44],
  [19.5, 0x4b3050],
  [21, 0x0d1428],
  [24, 0x070b18],
]

function skyColorAt(hour: number, out: THREE.Color, a = new THREE.Color(), b = new THREE.Color()) {
  for (let i = 0; i < SKY_KEYS.length - 1; i++) {
    const [h0, c0] = SKY_KEYS[i]
    const [h1, c1] = SKY_KEYS[i + 1]
    if (hour >= h0 && hour <= h1) {
      const f = (hour - h0) / Math.max(h1 - h0, 0.001)
      out.copy(a.setHex(c0)).lerp(b.setHex(c1), f)
      return
    }
  }
  out.setHex(SKY_KEYS[0][1])
}

const daylight = (hour: number) => Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI))

/** the readout is derived from the machine — the forecast IS the toy's state */
function readout(m: Machine) {
  const adj = { clear: 2, rain: -1, snow: -5, whiteout: -7 }[m.weather]
  const temp = Math.round(-2 + 8 * daylight(m.hour) + adj)
  const feels = Math.round(temp - m.wind * 0.28)
  const vis = { clear: "40 km", rain: "6 km", snow: "800 m", whiteout: "< 50 m" }[m.weather]
  const freezing = Math.max(0, Math.round(600 + temp * 120))
  return { temp, feels, vis, freezing }
}

const fmtHour = (h: number) => {
  const hh = Math.floor(h) % 24
  const mm = Math.round((h - Math.floor(h)) * 60)
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
}

/* ================================================ THREE: the weather machine
   A hand-shaped low-poly massif (gaussian peaks + ridge noise, vertex-coloured
   with a jittered snowline), a summit station with a blinking beacon, and a
   sky that is entirely a function of the hour slider: sun position/colour,
   hemisphere light, fog colour, stars and moon all follow it. Weather swaps
   particle systems; wind leans them. All atmosphere params ease with
   1-exp(-dt·k) so the machine feels analogue, not switched. */

function WeatherCanvas({ machine, reduced }: { machine: Machine; reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const mRef = useRef(machine)
  mRef.current = machine

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const fog = new THREE.FogExp2(0x9fc0dd, 0.012)
    scene.fog = fog
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200)
    camera.position.set(0, 6.2, 26)
    camera.lookAt(0, 3.2, 0)

    const sun = new THREE.DirectionalLight(0xffffff, 1.5)
    scene.add(sun)
    const hemi = new THREE.HemisphereLight(0x9fc0dd, 0x2a2d33, 0.6)
    scene.add(hemi)

    /* --- terrain: gaussian peaks + ridges, vertex-coloured with a snowline */
    const W = 64
    const D = 40
    const SEGX = 110
    const SEGZ = 66
    const terrGeo = new THREE.PlaneGeometry(W, D, SEGX, SEGZ)
    terrGeo.rotateX(-Math.PI / 2)
    const peaks = [
      { x: -14, z: -6, h: 7.2, r: 9 },
      { x: -2, z: -10, h: 9.4, r: 10 },
      { x: 9, z: -4, h: 6.4, r: 8 },
      { x: 20, z: -9, h: 8.1, r: 11 },
      { x: -22, z: -12, h: 5.6, r: 8 },
    ]
    {
      const p = terrGeo.attributes.position.array as Float32Array
      for (let i = 0; i < p.length; i += 3) {
        const x = p[i]
        const z = p[i + 2]
        let h = 0
        for (const pk of peaks) {
          const d2 = (x - pk.x) ** 2 + (z - pk.z) ** 2
          h += pk.h * Math.exp(-d2 / (pk.r * pk.r))
        }
        h += Math.abs(Math.sin(x * 0.45 + z * 0.3)) * 0.7 // ridge grain
        h += Math.sin(x * 1.7) * Math.cos(z * 1.3) * 0.22 // scree jitter
        h *= 0.55 + 0.45 * Math.min(1, (20 - Math.abs(z + 2)) / 14) // falls to the glens
        p[i + 1] = h
      }
      terrGeo.computeVertexNormals()
      // snowline with a dithered edge
      const colors = new Float32Array(p.length)
      const rock = new THREE.Color(0x4b5058)
      const heather = new THREE.Color(0x3b4438)
      const snowC = new THREE.Color(0xe9eef4)
      const c = new THREE.Color()
      for (let i = 0; i < p.length; i += 3) {
        const y = p[i + 1]
        const jitter = Math.sin(p[i] * 3.1) * Math.cos(p[i + 2] * 2.7) * 0.5
        if (y > 4.6 + jitter) c.copy(snowC)
        else if (y > 2.1 + jitter * 0.7) c.copy(rock)
        else c.copy(heather)
        colors[i] = c.r
        colors[i + 1] = c.g
        colors[i + 2] = c.b
      }
      terrGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    }
    const terrMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 })
    const terrain = new THREE.Mesh(terrGeo, terrMat)
    scene.add(terrain)

    /* --- summit weather station, beacon blinking */
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x2c3138, roughness: 0.6, metalness: 0.4 })
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 2.2, 8), mastMat)
    mast.position.set(-2, 9.6, -10)
    const vaneMat = new THREE.MeshStandardMaterial({ color: 0x8a929c, roughness: 0.5, metalness: 0.5 })
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.1), vaneMat)
    vane.position.set(-2, 10.2, -10)
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff7847 })
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), beaconMat)
    beacon.position.set(-2, 10.75, -10)
    scene.add(mast, vane, beacon)

    /* --- stars + moon (night only) */
    const STAR_N = 650
    const starPos = new Float32Array(STAR_N * 3)
    for (let i = 0; i < STAR_N; i++) {
      const a = Math.random() * Math.PI * 2
      const e = Math.random() * Math.PI * 0.45
      const r = 90
      starPos[i * 3] = Math.cos(a) * Math.cos(e) * r
      starPos[i * 3 + 1] = Math.sin(e) * r + 4
      starPos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r - 30
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xdfe8f5,
      size: 0.55,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    stars.frustumCulled = false
    scene.add(stars)

    const moonMat = new THREE.MeshBasicMaterial({ color: 0xe4eaf2, transparent: true, opacity: 0, fog: false })
    const moon = new THREE.Mesh(new THREE.SphereGeometry(1.6, 18, 18), moonMat)
    scene.add(moon)

    /* --- precipitation: one pool, retargeted per weather */
    const P_N = 1100
    const pPos = new Float32Array(P_N * 3)
    const pSeed = new Float32Array(P_N)
    for (let i = 0; i < P_N; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 52
      pPos[i * 3 + 1] = Math.random() * 18
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 34
      pSeed[i] = Math.random()
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xcfdae6,
      size: 0.12,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const precip = new THREE.Points(pGeo, pMat)
    precip.frustumCulled = false
    scene.add(precip)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      camera.position.z = w < 640 ? 34 : 26
      dirty = true
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    /* --- pointer drift (one lerped source) */
    let tx = 0
    let cx = 0
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
    }
    if (!reduced) window.addEventListener("pointermove", onPointer)

    /* --- eased atmosphere state */
    const sky = new THREE.Color()
    const skyA = new THREE.Color()
    const skyB = new THREE.Color()
    const skyNow = new THREE.Color(0x9fc0dd)
    const sunWarm = new THREE.Color(0xffa25e)
    const sunWhite = new THREE.Color(0xfff4e4)
    const sunNow = new THREE.Color(0xfff4e4)
    let fogNow = 0.012
    let dimNow = 1

    let dirty = true
    let raf = 0
    let running = false
    const clock = new THREE.Clock()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      const m = mRef.current
      const ease = reduced ? 1 : 1 - Math.exp(-dt * 3.2)

      /* sun & sky from the hour */
      const day = daylight(m.hour)
      const az = ((m.hour - 6) / 12) * Math.PI
      sun.position.set(Math.cos(az) * 55, Math.max(Math.sin(((m.hour - 6) / 12) * Math.PI), -0.25) * 42, -18)
      const dimT = { clear: 1, rain: 0.45, snow: 0.55, whiteout: 0.28 }[m.weather]
      dimNow += (dimT - dimNow) * ease
      sun.intensity = (0.12 + 1.5 * day) * dimNow
      sunNow.copy(sunWarm).lerp(sunWhite, Math.min(1, day * 1.6))
      sun.color.copy(sunNow)
      hemi.intensity = (0.12 + 0.55 * day) * (0.4 + 0.6 * dimNow)

      skyColorAt(m.hour, sky, skyA, skyB)
      const grey = { clear: 0, rain: 0.55, snow: 0.5, whiteout: 0.78 }[m.weather]
      sky.lerp(skyA.setHex(0x99a3ad), grey * (0.25 + 0.75 * day))
      skyNow.lerp(sky, ease)
      renderer.setClearColor(skyNow)
      fog.color.copy(skyNow)
      hemi.color.copy(skyNow)

      const fogT = { clear: 0.012, rain: 0.02, snow: 0.028, whiteout: 0.085 }[m.weather]
      fogNow += (fogT - fogNow) * ease
      fog.density = fogNow

      /* night sky */
      const night = Math.max(0, 1 - day * 2.2)
      const starT = night * (m.weather === "clear" ? 0.9 : 0.12)
      starMat.opacity += (starT - starMat.opacity) * ease
      moonMat.opacity += (night * (m.weather === "clear" ? 0.9 : 0.25) - moonMat.opacity) * ease
      moon.position.set(-Math.cos(az) * 60, Math.max(0.25, -Math.sin(((m.hour - 6) / 12) * Math.PI)) * 20 + 5, -55)

      /* beacon blink */
      beaconMat.color.setHex(!reduced && Math.sin(t * 3.2) > 0.55 ? 0xff7847 : 0x5a2c18)

      /* precipitation */
      const active = m.weather !== "clear"
      const pT = active ? (m.weather === "whiteout" ? 0.45 : 0.8) : 0
      pMat.opacity += (pT - pMat.opacity) * ease
      pMat.size = m.weather === "rain" ? 0.09 : 0.16
      if (active && !reduced) {
        const arr = pGeo.attributes.position.array as Float32Array
        const vy = m.weather === "rain" ? 16 : m.weather === "snow" ? 1.6 : 2.4
        const vx = m.wind * (m.weather === "rain" ? 0.16 : 0.11)
        for (let i = 0; i < P_N; i++) {
          let x = arr[i * 3] - (vx + (m.weather !== "rain" ? Math.sin(t * 1.3 + pSeed[i] * 9) * 0.6 : 0)) * dt
          let y = arr[i * 3 + 1] - vy * (0.6 + pSeed[i] * 0.7) * dt
          if (y < 0) y += 18
          if (x < -26) x += 52
          if (x > 26) x -= 52
          arr[i * 3] = x
          arr[i * 3 + 1] = y
        }
        pGeo.attributes.position.needsUpdate = true
        dirty = true
      }

      /* wind vane + camera drift */
      vane.rotation.y += (Math.atan2(1, m.wind * 0.02) - vane.rotation.y) * ease + (reduced ? 0 : Math.sin(t) * 0.002)
      cx += (tx - cx) * (1 - Math.exp(-dt * 2.5))
      camera.position.x = cx * 1.6
      camera.lookAt(0, 3.2, 0)

      if (!reduced) dirty = true // atmosphere keeps easing; cheap scene
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
      if (!reduced) window.removeEventListener("pointermove", onPointer)
      terrGeo.dispose()
      starGeo.dispose()
      pGeo.dispose()
      mast.geometry.dispose()
      vane.geometry.dispose()
      beacon.geometry.dispose()
      moon.geometry.dispose()
      ;[terrMat, mastMat, vaneMat, beaconMat, starMat, moonMat, pMat].forEach((x) => x.dispose())
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [reduced])

  return <div ref={wrap} aria-hidden="true" className="absolute inset-0" />
}

/* ------------------------------------------------------------ small bits */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.28em]" style={{ fontFamily: MONO, color: ORANGE }}>
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

const ROUTES = [
  {
    name: "Aladdin's Couloir",
    grade: "I",
    corrie: "Coire an t-Sneachda",
    status: "IN CONDITION",
    tone: GOOD,
    note: "Complete and firm above the narrows. Early start — it funnels everything the plateau sheds after noon.",
  },
  {
    name: "Fiacaill Ridge",
    grade: "II",
    corrie: "Coire an t-Sneachda",
    status: "LEAN",
    tone: WARN,
    note: "Rock showing on the crest; crampons scratching. Fine for a dry day, miserable in the thaw.",
  },
  {
    name: "The Goat Track",
    grade: "descent",
    corrie: "Coire an t-Sneachda",
    status: "AVOID — CORNICE",
    tone: BAD,
    note: "Heavily corniced entrance and a windslab pocket below it. Walk off by the Fiacaill a' Choire Chais instead.",
  },
  {
    name: "Jacob's Ladder",
    grade: "I",
    corrie: "Coire an Lochain",
    status: "IN CONDITION",
    tone: GOOD,
    note: "Banked out nicely. Watch the exit slope after fresh loading — it's the classic trap on this aspect.",
  },
]

/* ----------------------------------------------------------------- page */

export default function CorrieSite() {
  const reduced = useReducedMotion() ?? false
  const [machine, setMachine] = useState<Machine>({ hour: 9.5, weather: "snow", wind: 35 })
  const r = useMemo(() => readout(machine), [machine])
  const [subscribed, setSubscribed] = useState(false)

  const set = (patch: Partial<Machine>) => setMachine((m) => ({ ...m, ...patch }))

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" style={{ background: GRANITE, color: BONE, fontFamily: SANS }} className="min-h-screen">
        <style>{`
          .corrie-range { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px;
            background: linear-gradient(to right, ${ORANGE} 0%, ${ORANGE} var(--fill, 50%), rgba(237,239,242,0.18) var(--fill, 50%)); }
          .corrie-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
            border-radius: 50%; background: ${ORANGE}; border: 3px solid ${GRANITE}; box-shadow: 0 0 0 1px ${ORANGE}; cursor: ew-resize; }
          .corrie-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${ORANGE};
            border: 3px solid ${GRANITE}; box-shadow: 0 0 0 1px ${ORANGE}; cursor: ew-resize; }
          .corrie-range:focus-visible { outline: 2px solid ${ORANGE}; outline-offset: 4px; }
        `}</style>

        {/* ------------------------------------------------------- header */}
        <header
          className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
          style={{ borderColor: LINE, background: "rgba(16,19,24,0.66)" }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* ml clears the gallery back-chip pinned at left-4 top-4 */}
            <a
              href="#top"
              className={cn("ml-24 flex items-center gap-2.5 no-underline min-[1440px]:ml-0", focusRing)}
              aria-label="Corrie — back to top"
            >
              <Mountain size={20} style={{ color: ORANGE }} aria-hidden="true" />
              <span className="text-lg tracking-[0.12em]" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                CORRIE
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
              {[
                ["Routes", "#routes"],
                ["Method", "#method"],
                ["The report", "#report"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={cn("text-sm no-underline transition-colors duration-200 hover:text-[#ff7847]", focusRing)}
                  style={{ fontFamily: MONO, color: MUTE }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Magnetic strength={0.3}>
              <a
                href="#report"
                className={cn(
                  "hidden items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm no-underline transition-transform duration-200 hover:scale-[1.03] sm:inline-flex",
                  focusRing,
                )}
                style={{ background: ORANGE, color: GRANITE, fontFamily: MONO, fontWeight: 600 }}
              >
                Get the 07:00 report
              </a>
            </Magnetic>
          </div>
        </header>

        <main>
          {/* ------------------------------------------------ the machine */}
          <section className="relative flex min-h-[130vh] flex-col overflow-hidden pt-16 md:min-h-screen">
            <WeatherCanvas machine={machine} reduced={reduced} />
            {/* legibility scrims, top and bottom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-64"
              style={{ background: "linear-gradient(to bottom, rgba(16,19,24,0.8), transparent)" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
              style={{ background: "linear-gradient(to top, rgba(16,19,24,0.9), transparent)" }}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-14 md:pt-20">
              <div className="flex max-w-2xl flex-col gap-5">
                <Reveal>
                  <Eyebrow>Corrie · plateau weather, taken personally</Eyebrow>
                </Reveal>
                <Reveal delay={0.08}>
                  <h1
                    className="text-5xl leading-[1.0] sm:text-6xl md:text-7xl"
                    style={{ fontFamily: DISPLAY, fontWeight: 700, textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
                  >
                    The mountain
                    <br />
                    doesn&rsquo;t care. <span style={{ color: ORANGE }}>We do.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <p
                    className="max-w-xl text-lg leading-relaxed"
                    style={{ color: BONE, textShadow: "0 1px 16px rgba(0,0,0,0.5)" }}
                  >
                    A forecast written by people who were on the plateau
                    yesterday — for climbers, ski tourers and anyone else who
                    walks uphill into bad decisions. Play with the sky below;
                    ours changes just as fast.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* the control deck */}
            <div className="relative z-10 mx-auto mt-auto w-full max-w-6xl px-6 pb-10 pt-16">
              <Reveal delay={0.2}>
                <div
                  className="flex flex-col gap-5 rounded-2xl border p-5 backdrop-blur-md md:p-6"
                  style={{ borderColor: LINE, background: PANEL }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    <p className="text-[11px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: ORANGE }}>
                      The weather machine — drive it
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUTE }}>
                      Cairngorm summit · 1,245 m
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1.3fr_auto_1fr] md:items-center">
                    {/* time of day */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="corrie-hour"
                        className="flex items-center justify-between text-xs"
                        style={{ fontFamily: MONO, color: MUTE }}
                      >
                        <span>Time of day</span>
                        <span style={{ color: BONE }}>{fmtHour(machine.hour)}</span>
                      </label>
                      <input
                        id="corrie-hour"
                        type="range"
                        min={0}
                        max={24}
                        step={0.25}
                        value={machine.hour}
                        onChange={(e) => set({ hour: Number(e.target.value) })}
                        className="corrie-range w-full"
                        style={{ "--fill": `${(machine.hour / 24) * 100}%` } as React.CSSProperties}
                      />
                    </div>

                    {/* weather */}
                    <div role="group" aria-label="Weather" className="flex flex-wrap items-center gap-2">
                      {WEATHERS.map((w) => {
                        const on = machine.weather === w.id
                        const Icon = w.icon
                        return (
                          <button
                            key={w.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => set({ weather: w.id })}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all duration-200",
                              focusRing,
                            )}
                            style={{
                              fontFamily: MONO,
                              color: on ? GRANITE : MUTE,
                              background: on ? ORANGE : "transparent",
                              borderColor: on ? ORANGE : LINE,
                              fontWeight: on ? 600 : 400,
                            }}
                          >
                            <Icon size={13} aria-hidden="true" />
                            {w.name}
                          </button>
                        )
                      })}
                    </div>

                    {/* wind */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="corrie-wind"
                        className="flex items-center justify-between text-xs"
                        style={{ fontFamily: MONO, color: MUTE }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Wind size={13} aria-hidden="true" style={{ color: ORANGE }} /> Wind
                        </span>
                        <span style={{ color: BONE }}>{machine.wind} mph</span>
                      </label>
                      <input
                        id="corrie-wind"
                        type="range"
                        min={0}
                        max={80}
                        step={5}
                        value={machine.wind}
                        onChange={(e) => set({ wind: Number(e.target.value) })}
                        className="corrie-range w-full"
                        style={{ "--fill": `${(machine.wind / 80) * 100}%` } as React.CSSProperties}
                      />
                    </div>
                  </div>

                  {/* derived readout */}
                  <dl
                    className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4"
                    style={{ borderColor: LINE }}
                    aria-live="polite"
                  >
                    {[
                      ["Summit temp", `${r.temp} °C`],
                      ["Feels like", `${r.feels} °C`],
                      ["Visibility", r.vis],
                      ["Freezing level", `${r.freezing.toLocaleString()} m`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-0.5">
                        <dt className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: MUTE }}>
                          {k}
                        </dt>
                        <dd className="text-xl tabular-nums" style={{ fontFamily: MONO, color: BONE }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </section>

          {/* -------------------------------------------------- routes */}
          <section id="routes" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <Reveal>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <Eyebrow>Route conditions · updated 06:58 today</Eyebrow>
                  <h2 className="text-4xl md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                    The corries, this morning.
                  </h2>
                </div>
                <p className="flex max-w-sm items-start gap-2 text-base leading-relaxed" style={{ color: MUTE }}>
                  <Snowflake size={18} className="mt-1 shrink-0" style={{ color: ORANGE }} aria-hidden="true" />
                  Walked, prodded and dug by our own team. Status is our
                  opinion, not a promise — the hill gets the last word.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {ROUTES.map((route, i) => (
                <Reveal key={route.name} delay={i * 0.06}>
                  <article
                    className="flex h-full flex-col gap-3 rounded-2xl border p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff7847]"
                    style={{ borderColor: LINE, background: "rgba(237,239,242,0.03)" }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: MUTE }}>
                        {route.corrie} · grade {route.grade}
                      </span>
                      <span
                        className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
                        style={{ fontFamily: MONO, color: route.tone, borderColor: LINE }}
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: route.tone }}
                        />
                        {route.status}
                      </span>
                    </div>
                    <h3 className="text-2xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                      {route.name}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: MUTE }}>
                      {route.note}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------- method */}
          <section id="method" className="border-t" style={{ borderColor: LINE, background: "#0c0f14" }}>
            <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
              <div className="grid gap-14 md:grid-cols-[1.2fr_1fr]">
                <div className="flex flex-col gap-6">
                  <Reveal>
                    <Eyebrow>Method</Eyebrow>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <h2 className="text-4xl leading-[1.05] md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                      Models forecast air.
                      <br />
                      We forecast <span style={{ color: ORANGE }}>your day.</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="max-w-lg text-lg leading-relaxed" style={{ color: MUTE }}>
                      Every morning we blend the high-resolution models with
                      the thing they can&rsquo;t see: yesterday&rsquo;s boot-level truth.
                      Which slopes loaded. Where the ice actually formed. What
                      the wind did to the Goat Track while the model said
                      &ldquo;breezy&rdquo;. Then we write it in plain speech, with a
                      go/no-go you can argue with over breakfast.
                    </p>
                  </Reveal>
                </div>
                <div className="grid content-center gap-10 sm:grid-cols-2">
                  <Reveal>
                    <Counter value={365} suffix="" label="reports a year, 07:00 sharp" />
                  </Reveal>
                  <Reveal delay={0.06}>
                    <Counter value={14} suffix="" label="winters on this plateau" />
                  </Reveal>
                  <Reveal delay={0.12}>
                    <Counter value={9} suffix="" label="sensor masts we maintain" />
                  </Reveal>
                  <Reveal delay={0.18}>
                    <Counter value={11342} suffix="" label="people read it this January" />
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------- report */}
          <section id="report" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="flex flex-col items-start gap-7">
              <Reveal>
                <Eyebrow>The 07:00 report</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="max-w-2xl text-4xl leading-[1.05] md:text-6xl" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                  In your inbox before your porridge is cool.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="max-w-lg text-lg leading-relaxed" style={{ color: MUTE }}>
                  Free forever for the daily plateau report. £4 a month if you
                  want the route-by-route detail and the 5-day outlook — that&rsquo;s
                  what pays for the sensor masts.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                {subscribed ? (
                  <p
                    className="rounded-xl border px-6 py-4 text-base"
                    style={{ borderColor: LINE, background: "rgba(127,208,143,0.08)", color: GOOD, fontFamily: MONO }}
                    role="status"
                  >
                    You&rsquo;re on the list — first report tomorrow, 07:00.
                  </p>
                ) : (
                  <form
                    className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSubscribed(true)
                    }}
                  >
                    <label htmlFor="corrie-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="corrie-email"
                      type="email"
                      required
                      placeholder="you@lowlands.scot"
                      className={cn("w-full flex-1 rounded-full border bg-transparent px-6 py-3.5 text-base", focusRing)}
                      style={{ borderColor: LINE, color: BONE, fontFamily: MONO }}
                    />
                    <Magnetic strength={0.25}>
                      <button
                        type="submit"
                        className={cn(
                          "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 text-base transition-transform duration-200 hover:scale-[1.03] sm:w-auto",
                          focusRing,
                        )}
                        style={{ background: ORANGE, color: GRANITE, fontFamily: MONO, fontWeight: 600 }}
                      >
                        Sign up <ArrowUpRight size={18} aria-hidden="true" />
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
              <span>© 2026 Corrie Weather CIC — Aviemore</span>
              <span>Not a substitute for judgement · carry a map, not just us</span>
            </div>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}
