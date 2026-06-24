import { Reveal } from "@/components/fx/Reveal"
import { CodeBlock, Cmd, Eyebrow } from "../ui"

const steps = [
  {
    id: "install",
    n: "01",
    title: "Install the CLI",
    body: (
      <>
        Hush is a single static binary. Install it with Homebrew, or grab the signed release
        for your platform. There is no daemon and no account to create first.
      </>
    ),
    code: {
      label: "shell",
      lines: [
        { sigil: "❯", text: "brew install hush" },
        { sigil: "❯", text: "hush --version" },
        { text: "hush 2.4.0 (reproducible, signed)", dim: true },
      ],
    },
  },
  {
    id: "init",
    n: "02",
    title: "Create a vault",
    body: (
      <>
        A vault is an encrypted file that lives in your repo. <Cmd>hush init</Cmd> generates an
        identity key in your OS keychain and writes an empty, committable{" "}
        <Cmd>vault.hush</Cmd>.
      </>
    ),
    code: {
      label: "shell",
      lines: [
        { sigil: "❯", text: "hush init" },
        { text: "→ identity created in macOS Keychain", dim: true },
        { text: "→ wrote vault.hush (safe to commit)", dim: true },
      ],
    },
  },
  {
    id: "add",
    n: "03",
    title: "Add a secret",
    body: (
      <>
        Add values one at a time, or import an existing <Cmd>.env</Cmd> wholesale. Input is read
        from a hidden prompt, never from your command — so it stays out of your history.
      </>
    ),
    code: {
      label: "shell",
      lines: [
        { sigil: "❯", text: "hush add db/url" },
        { text: "value (hidden): ••••••••••••••", dim: true },
        { sigil: "❯", text: "hush import .env --prefix app/" },
        { text: "✓ encrypted 7 keys to vault.hush", dim: false },
      ],
    },
  },
  {
    id: "run",
    n: "04",
    title: "Run with secrets injected",
    body: (
      <>
        Wrap any command with <Cmd>hush run</Cmd>. Secrets land in that process's environment and
        nowhere else — they're masked in output and gone the instant it exits.
      </>
    ),
    code: {
      label: "shell",
      lines: [
        { sigil: "❯", text: "hush run -- npm start" },
        { text: "injecting 7 secrets (masked) …", dim: true },
        { text: "✓ api ready on :3000", dim: false },
      ],
    },
  },
]

export function Docs() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal>
        <Eyebrow>Quickstart</Eyebrow>
        <h1 className="mt-3 max-w-2xl font-['Bricolage_Grotesque'] text-4xl font-bold leading-[1.02] tracking-[-0.02em] text-[#16181a] md:text-[3.2rem]">
          From zero to a vault in four commands.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#17191b]/75">
          This is the whole getting-started flow. If you can run a package manager, you can run
          Hush. Total time, start to finish, is about ninety seconds.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[200px_1fr]">
        {/* sticky sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 border-l border-[#17191b]/12 pl-4">
            {steps.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block py-1.5 font-['IBM_Plex_Mono'] text-[13px] text-[#17191b]/70 transition-colors hover:text-[#0a5a4b]"
              >
                <span className="text-[#0c6e5d]/50">{s.n}</span> {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-16">
          {steps.map((s) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-24 grid gap-6 md:grid-cols-2 md:items-start">
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-sm text-[#0c6e5d]">{s.n}</span>
                  <h2 className="mt-2 font-['Bricolage_Grotesque'] text-2xl font-bold tracking-[-0.01em] text-[#16181a]">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#17191b]/75">{s.body}</p>
                </div>
                <CodeBlock label={s.code.label} lines={s.code.lines} />
              </section>
            </Reveal>
          ))}

          <Reveal>
            <div className="rounded-2xl border border-[#0c6e5d]/25 bg-[#0c6e5d]/8 p-7">
              <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#0a4f42]">
                That's it — you're running.
              </h3>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#17191b]/75">
                Commit <Cmd>vault.hush</Cmd> like any other file. Your teammates run{" "}
                <Cmd>hush init --join</Cmd>, you grant them a scope, and they're in. Next up:
                grants, rotation, and CI — all in <span className="font-semibold">man hush</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
