/* Hand-built app screens for the Evenly phone mockup. No images — all crafted
   markup so they're crisp at any size and never break. */

const ACCENT = "#e7613a"

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-medium text-[#1c2b23]">
      <span className="font-['IBM_Plex_Mono']">9:41</span>
      <div className="flex items-center gap-1">
        <span className="h-2.5 w-2.5 rounded-full bg-[#1c2b23]/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#1c2b23]/30" />
        <span className="h-2.5 w-3.5 rounded-[3px] bg-[#1c2b23]/70" />
      </div>
    </div>
  )
}

function Row({
  name,
  sub,
  amount,
  positive,
  tint,
}: {
  name: string
  sub: string
  amount: string
  positive?: boolean
  tint: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(28,43,35,0.04)]">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-['Fraunces'] text-sm font-semibold text-[#1c2b23]"
        style={{ background: tint }}
      >
        {name.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-[#1c2b23]">{name}</p>
        <p className="truncate text-[10px] text-[#46554c]">{sub}</p>
      </div>
      <span
        className="font-['IBM_Plex_Mono'] text-[12px] font-medium"
        style={{ color: positive ? "#1f7a52" : ACCENT }}
      >
        {amount}
      </span>
    </div>
  )
}

/** 0 — Balance overview */
export function ScreenBalance() {
  return (
    <div className="flex h-full flex-col bg-[#f3f5ef]">
      <StatusBar />
      <div className="px-5 pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#46554c]">Flat 4 · Cherwell St</p>
        <p className="mt-1 font-['Fraunces'] text-[26px] font-semibold leading-tight text-[#1c2b23]">
          You're owed
        </p>
        <p className="font-['IBM_Plex_Mono'] text-[34px] font-medium" style={{ color: ACCENT }}>
          £42.50
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2 px-4">
        <Row name="Sora" sub="owes you" amount="+£24.00" positive tint="#f3d9cd" />
        <Row name="Mara" sub="owes you" amount="+£18.50" positive tint="#d9e6d2" />
        <Row name="Theo" sub="you owe" amount="−£6.00" tint="#e7e0d2" />
      </div>
    </div>
  )
}

/** 1 — Add an expense */
export function ScreenAdd() {
  return (
    <div className="flex h-full flex-col bg-[#1c2b23]">
      <StatusBar />
      <div className="px-5 pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#9db0a4]">New expense</p>
        <input
          readOnly
          value="Tesco — weekly shop"
          className="mt-2 w-full bg-transparent font-['Fraunces'] text-[20px] font-medium text-[#f3f5ef] outline-none"
        />
      </div>
      <div className="mx-5 mt-4 rounded-2xl bg-white/5 p-4">
        <p className="text-[10px] uppercase tracking-wider text-[#9db0a4]">Amount</p>
        <p className="font-['IBM_Plex_Mono'] text-[30px] font-medium text-white">£61.20</p>
      </div>
      <div className="mt-4 flex gap-2 px-5">
        {["Split equally", "By share", "Exact"].map((t, i) => (
          <span
            key={t}
            className={`rounded-full px-3 py-1.5 text-[10px] font-medium ${
              i === 0 ? "text-[#1c2b23]" : "text-[#9db0a4]"
            }`}
            style={{ background: i === 0 ? ACCENT : "rgba(255,255,255,0.06)" }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto px-5 pb-6">
        <div className="grid place-items-center rounded-full bg-[#e7613a] py-3 text-[13px] font-semibold text-[#1c2b23]">
          Add expense
        </div>
      </div>
    </div>
  )
}

/** 2 — Split breakdown */
export function ScreenSplit() {
  const people = [
    { n: "You", v: "£20.40", w: 100 },
    { n: "Sora", v: "£20.40", w: 100 },
    { n: "Mara", v: "£20.40", w: 100 },
  ]
  return (
    <div className="flex h-full flex-col bg-[#f3f5ef]">
      <StatusBar />
      <div className="px-5 pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#46554c]">Tesco — weekly shop</p>
        <p className="mt-1 font-['Fraunces'] text-[22px] font-semibold text-[#1c2b23]">
          Split three ways
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3 px-5">
        {people.map((p) => (
          <div key={p.n}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#1c2b23]">{p.n}</span>
              <span className="font-['IBM_Plex_Mono'] text-[12px] text-[#46554c]">{p.v}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#1c2b23]/8">
              <div className="h-full rounded-full" style={{ width: `${p.w}%`, background: ACCENT }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mx-5 mt-5 rounded-2xl border border-[#1c2b23]/10 bg-white px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-[#46554c]">Rounded so</p>
        <p className="text-[12px] font-medium text-[#1c2b23]">
          nobody loses a penny — the odd 0.0p lands with you.
        </p>
      </div>
    </div>
  )
}

/** 3 — Settle / activity */
export function ScreenActivity() {
  return (
    <div className="flex h-full flex-col bg-[#f3f5ef]">
      <StatusBar />
      <div className="px-5 pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#46554c]">This week</p>
        <p className="mt-1 font-['Fraunces'] text-[22px] font-semibold text-[#1c2b23]">Activity</p>
      </div>
      <div className="mt-4 flex flex-col gap-2 px-4">
        <Row name="Sora" sub="settled up · Mon" amount="£24.00" positive tint="#f3d9cd" />
        <Row name="Mara" sub="added Broadband" amount="£39.00" tint="#d9e6d2" />
        <Row name="You" sub="added Tesco shop" amount="£61.20" tint="#e7e0d2" />
      </div>
      <div className="mt-auto px-5 pb-6">
        <div className="grid place-items-center rounded-full bg-[#1c2b23] py-3 text-[13px] font-semibold text-[#f3f5ef]">
          Settle up
        </div>
      </div>
    </div>
  )
}

export const SCREENS = [ScreenBalance, ScreenAdd, ScreenSplit, ScreenActivity]
