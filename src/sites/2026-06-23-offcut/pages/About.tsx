import { Reveal } from "@/components/fx/Reveal"
import { Label } from "../shared"

const TEAM = [
  { name: "Mara Tennent", role: "Editor", seed: "portrait-editor-studio", bio: "Founded OFFCUT on a kitchen table in 2019. Collects broken plane irons." },
  { name: "Bo Greenhalgh", role: "Art director", seed: "portrait-designer-press", bio: "Sets every page by eye, then argues with the printer about kerning." },
  { name: "Lucia Frey", role: "Photo editor", seed: "portrait-photographer-film", bio: "Shoots on a 1962 Rolleiflex. Has opinions about the colour of sawdust." },
]

const TIMELINE: [string, string][] = [
  ["2019", "First issue, 200 copies, stapled in a kitchen in Margate."],
  ["2021", "Moved onto a borrowed Heidelberg. Sold out in nine days."],
  ["2023", "First overseas subscribers. Started numbering by hand."],
  ["2026", "Issue 14 — The Grain. Still no adverts."],
]

export function About() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-16">
      {/* intro */}
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <Label className="text-[#c1351c]">The masthead</Label>
          <h1 className="mt-4 font-['Fraunces'] text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.025em] text-[#191510] sm:text-[4.2rem]">
            A small press with sawdust under its nails.
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-['DM_Sans'] text-lg leading-relaxed text-[#191510]/75 md:pt-6">
            OFFCUT is three people, two presses and a room above a hardware shop.
            We make a magazine we'd want to keep — printed properly, on paper that
            ages well, about work that takes time. We answer every email.
          </p>
        </Reveal>
      </div>

      {/* team */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between border-b border-[#191510]/15 pb-3">
          <Label className="text-[#191510]/70">Who makes it</Label>
          <Label className="text-[#191510]/70">{TEAM.length} hands</Label>
        </div>
        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <figure className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-sm border border-[#191510]/15 bg-[#191510]">
                  <img
                    src={`https://picsum.photos/seed/${m.seed}/600/750`}
                    alt={`${m.name}, ${m.role} at OFFCUT`}
                    width={600}
                    height={750}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <figcaption className="mt-4">
                  <h3 className="font-['Fraunces'] text-xl font-semibold tracking-[-0.01em] text-[#191510]">{m.name}</h3>
                  <Label className="mt-1 block text-[#c1351c]">{m.role}</Label>
                  <p className="mt-2 font-['DM_Sans'] text-[15px] leading-relaxed text-[#191510]/75">{m.bio}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* timeline */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between border-b border-[#191510]/15 pb-3">
          <Label className="text-[#191510]/70">How we got here</Label>
        </div>
        <ol className="space-y-0">
          {TIMELINE.map(([year, text], i) => (
            <Reveal key={year} delay={i * 0.05}>
              <li className="grid grid-cols-[auto_1fr] gap-6 border-b border-[#191510]/10 py-6">
                <span className="font-['Fraunces'] text-2xl font-semibold tabular-nums text-[#c1351c]">{year}</span>
                <p className="max-w-2xl font-['DM_Sans'] text-lg leading-relaxed text-[#191510]/85">{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* colophon */}
      <Reveal>
        <section className="mt-20 rounded-sm border border-[#191510]/20 bg-[#191510] p-8 text-[#f2ede1] sm:p-12">
          <Label className="text-[#c1351c]">Colophon</Label>
          <p className="mt-5 max-w-3xl font-['Fraunces'] text-[1.6rem] leading-[1.3] tracking-[-0.01em]">
            Set in Fraunces and DM Sans. Printed riso-and-offset on 120gsm uncoated.
            Bound, numbered and posted by the three of us, usually on a Friday.
          </p>
          <p className="mt-6 font-['DM_Sans'] text-[15px] text-[#f2ede1]/70">
            Above the hardware shop · 14 Northdown Road, Margate · post@offcut.press
          </p>
        </section>
      </Reveal>
    </div>
  )
}
