// Shared content for Hush — a CLI secrets manager for small teams.

export const features = [
  {
    key: "history",
    title: "Never hits your shell history",
    body: "hush run wraps your process and injects secrets into its environment for exactly that one invocation. Nothing is written to .bashrc, .env, or ~/.zsh_history.",
    cmd: "hush run -- npm start",
    accent: false,
  },
  {
    key: "scopes",
    title: "Scoped, expiring tokens",
    body: "Grant a teammate read access to the staging vault for 24 hours. The grant evaporates on its own — no Slack message to remember to revoke it later.",
    cmd: "hush grant staging --to amir --ttl 24h",
    accent: true,
  },
  {
    key: "audit",
    title: "An audit log you can read",
    body: "Every read, write, and rotation is one human-readable line: who, what, when, from where. Pipe it to your SIEM or just less it on a Friday afternoon.",
    cmd: "hush log --since 7d",
    accent: false,
  },
  {
    key: "git",
    title: "Lives next to your code",
    body: "Vaults are encrypted files committed to your repo. Reviewable in a pull request, versioned with git blame, restorable with git revert. No new database.",
    cmd: "git add vault.hush && git commit",
    accent: false,
  },
  {
    key: "rotate",
    title: "Rotation that isn't a project",
    body: "Mark a secret as rotatable and Hush rolls it, updates the vault, and reloads dependent services in one command. Quarterly key rotation stops being a quarter.",
    cmd: "hush rotate db/prod --reload api",
    accent: false,
  },
  {
    key: "offline",
    title: "Works on a plane",
    body: "Decryption happens locally with keys held in your OS keychain. No control plane to phone home to, no outage that locks you out of your own credentials.",
    cmd: "hush get db/url   # offline, instant",
    accent: false,
  },
] as const

export const integrations = [
  "Node",
  "Python",
  "Go",
  "Rust",
  "Docker",
  "GitHub Actions",
  "Terraform",
  "Kubernetes",
  "Vercel",
  "Fly.io",
  "1Password",
  "AWS KMS",
] as const

export const tiers = [
  {
    name: "Solo",
    price: "Free",
    cadence: "forever",
    blurb: "For one developer and their side projects.",
    cta: "Install the CLI",
    featured: false,
    points: [
      "Unlimited local vaults",
      "AES-256 + age encryption",
      "OS keychain integration",
      "Full audit log",
      "Community Discord",
    ],
  },
  {
    name: "Team",
    price: "$8",
    cadence: "per dev / month",
    blurb: "Shared vaults, scoped grants, and rotation for a small crew.",
    cta: "Start a 30-day trial",
    featured: true,
    points: [
      "Everything in Solo",
      "Shared & scoped vaults",
      "Expiring access grants",
      "One-command rotation",
      "SSO via your IdP",
      "Priority email support",
    ],
  },
  {
    name: "Foundry",
    price: "Let's talk",
    cadence: "annual",
    blurb: "For teams with auditors, on-prem keys, and compliance to answer to.",
    cta: "Book a call",
    featured: false,
    points: [
      "Everything in Team",
      "Self-hosted key broker",
      "SOC 2 evidence export",
      "SCIM provisioning",
      "Custom data residency",
      "A real human on a shared channel",
    ],
  },
] as const

export const guarantees = [
  {
    title: "Zero-knowledge by construction",
    body: "Secrets are encrypted before they ever leave your machine. Hush, the company, holds no key that can decrypt your vaults — even if subpoenaed, there is nothing to hand over.",
    spec: "age + X25519 · AES-256-GCM",
  },
  {
    title: "Keys stay in the keychain",
    body: "Your identity key lives in macOS Keychain, GNOME Keyring, or a YubiKey — never on disk in plaintext, never in an environment variable, never in our logs.",
    spec: "FIDO2 / PIV hardware keys supported",
  },
  {
    title: "The whole client is auditable",
    body: "The CLI is open source under Apache-2.0 and reproducibly built. Every release is signed and its checksum published. You can read the exact code that touches your secrets.",
    spec: "Apache-2.0 · reproducible builds",
  },
  {
    title: "Breach blast-radius is bounded",
    body: "Scoped, expiring grants mean a leaked laptop exposes one vault for hours, not every secret forever. Rotation is one command, so recovery is measured in minutes.",
    spec: "Per-vault scopes · TTL grants",
  },
] as const

export const threatRows = [
  { threat: "Laptop stolen, disk imaged", answer: "Vault stays encrypted; key is in the hardware keychain, not on disk." },
  { threat: "Secret pasted into a Slack thread", answer: "Grants are short-lived; rotate the value and the leaked copy is dead." },
  { threat: "CI logs print an env var", answer: "hush run masks injected values in stdout and never persists them." },
  { threat: "Hush servers compromised", answer: "Zero-knowledge: we never hold a key that can decrypt your data." },
  { threat: "Ex-teammate keeps a copy", answer: "Revoke their identity; every grant they held stops resolving instantly." },
] as const

export const changelog = [
  { v: "2.4", date: "Jun 2026", note: "YubiKey PIV support and per-vault rotation hooks." },
  { v: "2.3", date: "Apr 2026", note: "Reproducible builds; release checksums now published to the transparency log." },
  { v: "2.2", date: "Feb 2026", note: "hush run output masking and the --reload flag for zero-downtime rotation." },
] as const
