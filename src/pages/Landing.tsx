import {
  Package,
  Vote,
  ShieldCheck,
  AppWindow,
  FileCheck2,
  ListChecks,
  ShieldAlert,
  Usb,
  WifiOff,
  Smartphone,
} from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

/* ------------------------------------------------------------------ */
/*  Dot grid background                                                */
/* ------------------------------------------------------------------ */

function DotGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#64748b" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
      {/* Fade edges */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-surface to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Architecture diagram SVG (animated)                                */
/* ------------------------------------------------------------------ */

function ArchitectureDiagram() {
  const nodes = [
    { x: 60, label: "Developer", sub: "source" },
    { x: 195, label: "CLI", sub: "validate + pack" },
    { x: 340, label: "IPFS", sub: "rootCid" },
    { x: 485, label: "Governor", sub: "propose → vote" },
    { x: 630, label: "Registry", sub: "onchain CID" },
    { x: 770, label: "Client", sub: "fetch → verify → run" },
  ];

  const lineStart = nodes[0].x;
  const lineEnd = nodes[nodes.length - 1].x;
  const totalLen = lineEnd - lineStart;
  const pulseWidth = 120;
  const pulseDuration = 3;
  const pulseTravel = totalLen + pulseWidth;

  return (
    <div className="mt-14 overflow-x-auto lg:mt-16">
      <svg
        viewBox="0 0 830 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto h-auto w-full max-w-[830px]"
        role="img"
        aria-label="Architecture flow: Developer to CLI to IPFS to Governor to Registry to Client"
      >
        <defs>
          {/* Animated pulse that travels the line */}
          <linearGradient id="pulse-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
            <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background line */}
        <line
          x1={lineStart}
          y1={38}
          x2={lineEnd}
          y2={38}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Animated pulse traveling the line */}
        <rect
          y={36.5}
          width={pulseWidth}
          height={3}
          rx={1.5}
          fill="url(#pulse-grad)"
        >
          <animate
            attributeName="x"
            values={`${lineStart - pulseWidth};${lineEnd}`}
            dur={`${pulseDuration}s`}
            repeatCount="indefinite"
          />
        </rect>

        {/* Arrows between nodes */}
        {nodes.slice(0, -1).map((node, i) => {
          const nextX = nodes[i + 1].x;
          const midX = (node.x + nextX) / 2;
          return (
            <polygon
              key={i}
              points={`${midX - 3.5},33.5 ${midX + 4},38 ${midX - 3.5},42.5`}
              fill="#64748b"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isFirst = i === 0;
          const isLast = i === nodes.length - 1;
          const overlapStart = (node.x - lineStart) / pulseTravel;
          const overlapEnd = (node.x - lineStart + pulseWidth) / pulseTravel;
          const overlapMid = (overlapStart + overlapEnd) / 2;
          const ringPeak = overlapStart + (1 - overlapStart) * 0.35;
          const ringFade = overlapStart + (1 - overlapStart) * 0.65;
          return (
            <g key={node.label}>
              {/* Ping ring on last node */}
              {isLast && (
                <circle cx={node.x} cy={38} r={7} fill="#22C55E" opacity="0">
                  <animate
                    attributeName="r"
                    values="7;7;16;7;7"
                    keyTimes={`0;${overlapStart};${ringPeak};${ringFade};1`}
                    dur={`${pulseDuration}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0;0.3;0;0"
                    keyTimes={`0;${overlapStart};${ringPeak};${ringFade};1`}
                    dur={`${pulseDuration}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={38}
                r={isFirst || isLast ? 7 : 5.5}
                fill={
                  isLast ? "#22C55E" : isFirst ? "#0f172a" : "#f8fbff"
                }
                stroke={isLast ? "#22C55E" : isFirst ? "#0f172a" : "#64748b"}
                strokeWidth={isFirst || isLast ? 0 : 1.5}
              >
                {/* Brief highlight when pulse passes */}
                {!isFirst && !isLast && (
                  <animate
                    attributeName="fill"
                    values="#f8fbff;#f8fbff;#06B6D4;#f8fbff;#f8fbff"
                    keyTimes={`0;${overlapStart};${overlapMid};${overlapEnd};1`}
                    dur={`${pulseDuration}s`}
                    begin="0s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Label */}
              <text
                x={node.x}
                y={66}
                textAnchor="middle"
                className="fill-ink text-[11px] font-semibold"
                style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
              >
                {node.label}
              </text>
              {/* Sublabel */}
              <text
                x={node.x}
                y={80}
                textAnchor="middle"
                className="fill-ink-faint text-[9px]"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {node.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative px-6 pb-24 pt-28 sm:pb-32 sm:pt-36">
      <DotGrid />
      <div className="relative mx-auto max-w-[1152px]">
        <h1 className="mt-5 max-w-[720px] text-[clamp(2.25rem,5.5vw,3.5rem)] font-bold leading-[1.12] tracking-tight text-ink">
          Verified DeFi frontends, governed by the people and agents who use
          them.
        </h1>
        <p className="mt-7 max-w-[560px] text-[16px] leading-[1.7] text-ink-muted">
          Onchain governance decides which frontend versions are approved.
          Content-addressed bundles are fetched from IPFS, verified against a
          manifest, built locally, and served in a sandboxed runtime with zero
          outbound network access. LLMs now accelerate both frontend code
          generation and review, with people and agents shipping changes
          together, so verifiable distribution is no longer optional.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/download"
            className="vf-gradient-button inline-flex h-11 items-center rounded-lg px-6 text-[14px] font-medium transition duration-150"
          >
            Download
          </a>
          <a
            href="https://docs.vibefi.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-[14px] font-medium text-ink-muted transition-colors duration-150 hover:border-ink-faint hover:text-ink"
          >
            Read the docs
          </a>
        </div>

        {/* Architecture diagram */}
        <ArchitectureDiagram />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Problem / Answer                                                   */
/* ------------------------------------------------------------------ */

function Problem() {
  return (
    <section className="border-y border-border bg-surface-alt px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-[1152px] gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
            The problem
          </p>
          <h2 className="mt-3 text-[22px] font-semibold leading-snug text-ink">
            You trust the deploy pipeline more than the code.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Every DeFi frontend runs on a centralized host — Vercel, Cloudflare,
            a dev team's server. A compromised deploy key, a rogue CDN config,
            or a supply-chain attack can swap the interface without touching the
            contracts. People and agents have no way to verify what code their
            clients actually run.
          </p>
        </div>
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wider text-teal-accent">
            VibeFi's answer
          </p>
          <h2 className="mt-3 text-[22px] font-semibold leading-snug text-ink">
            Governance all the way to the frontend.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Source is packaged under strict constraints and published to IPFS. A
            governance proposal (propose → vote → timelock → execute) writes the
            content root onchain. The client fetches by CID, verifies every
            file against a manifest, builds locally, and serves in a sandboxed
            webview with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[13px]">
              connect-src: none
            </code>
            . No outbound HTTP, ever.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Now                                                            */
/* ------------------------------------------------------------------ */

const WHY_NOW_ITEMS = [
  {
    icon: Package,
    title: "Code ships faster",
    desc: "LLMs let teams draft DeFi UI, wallet flows, and integration glue at unprecedented speed.",
  },
  {
    icon: FileCheck2,
    title: "Review ships faster",
    desc: "The same models accelerate review by checking PRs, tracing contract calls, and flagging risky diffs earlier.",
  },
  {
    icon: ShieldAlert,
    title: "Distribution risk grows",
    desc: "When changes move this quickly, centralized deploy pipelines become the weakest link. VibeFi adds governance and verification before people and agents run new code.",
  },
] as const;

function WhyNow() {
  return (
    <section
      id="why-now"
      className="scroll-mt-16 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1152px]">
        <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
          Why now
        </p>
        <h2 className="mt-3 max-w-[760px] text-[26px] font-semibold leading-snug tracking-tight text-ink">
          LLMs changed the release cadence for DeFi frontends.
        </h2>
        <p className="mt-4 max-w-[760px] text-[15px] leading-relaxed text-ink-muted">
          LLMs compress both stages that used to be slow: writing frontend code
          and reviewing it. More releases can ship, more often. VibeFi exists to
          make that new speed governable and verifiable.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {WHY_NOW_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <item.icon size={20} className="text-teal-accent" />
              <h3 className="mt-4 text-[15px] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: Package,
    title: "Package",
    desc: "CLI validates dependencies against an allowlist, scans for forbidden patterns (fetch, WebSocket, HTTP imports), generates a deterministic manifest, and publishes to IPFS.",
  },
  {
    icon: Vote,
    title: "Govern",
    desc: "A governance proposal targets the onchain DappRegistry. Token holders and their agents vote, the proposal queues through a timelock, and execution writes the approved CID.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    desc: "The desktop client fetches the bundle by CID, checks every file against manifest.json byte counts, and builds locally with injected build config.",
  },
  {
    icon: AppWindow,
    title: "Run",
    desc: "Dapps serve over a custom app:// protocol in a sandboxed webview. All chain interaction goes through an injected EIP-1193 provider bridged to Rust.",
  },
] as const;

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1152px]">
        <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
          End-to-end flow
        </p>
        <h2 className="mt-3 text-[26px] font-semibold leading-snug tracking-tight text-ink">
          From source to sandboxed runtime in four steps
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col bg-surface p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-alt text-[13px] font-semibold text-ink-muted">
                  {i + 1}
                </span>
                <step.icon size={18} className="text-teal-accent" />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features                                                           */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: FileCheck2,
    title: "Deterministic builds",
    desc: "Identical source always produces identical IPFS CIDs. Manifests are sorted and stable-serialized.",
  },
  {
    icon: ListChecks,
    title: "Dependency allowlist",
    desc: "Only pinned, audited packages pass validation: React 19, wagmi 3, viem 2, and a handful of build tools.",
  },
  {
    icon: ShieldAlert,
    title: "Security Council",
    desc: "Emergency pause, unpause, and deprecation powers. Veto active proposals before timelock execution.",
  },
  {
    icon: Usb,
    title: "Hardware wallets",
    desc: "Ledger and Trezor auto-detected via the Rust client. No browser extension required.",
  },
  {
    icon: WifiOff,
    title: "No outbound HTTP",
    desc: "CSP enforces connect-src: none. All external data flows through the injected provider → Rust host → RPC.",
  },
  {
    icon: Smartphone,
    title: "WalletConnect",
    desc: "Pair any mobile or desktop wallet via WalletConnect v2 relay. QR code rendered in the wallet selector.",
  },
] as const;

function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-16 border-y border-border bg-surface-alt px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1152px]">
        <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
          Capabilities
        </p>
        <h2 className="mt-3 text-[26px] font-semibold leading-snug tracking-tight text-ink">
          Built for verification, not convenience theater
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <f.icon size={20} className="text-teal-accent" />
              <h3 className="mt-4 text-[15px] font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Technical snippet                                                  */
/* ------------------------------------------------------------------ */

const MANIFEST_EXAMPLE = `{
  "name": "Uniswap V2",
  "version": "0.0.1",
  "constraints": {
    "type": "default",
    "allowedDependencies": {
      "react": "19.2.4",
      "react-dom": "19.2.4",
      "wagmi": "3.4.1",
      "viem": "2.45.0"
    }
  },
  "entry": "index.html",
  "files": [
    { "path": "index.html", "bytes": 542 },
    { "path": "src/App.tsx", "bytes": 1823 },
    { "path": "abis/Router.json", "bytes": 4201 },
    { "path": "addresses.json", "bytes": 312 }
  ]
}`;

function TechnicalSnippet() {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1152px]">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
              Manifest schema
            </p>
            <h2 className="mt-3 text-[22px] font-semibold leading-snug text-ink">
              Every bundle is fully described before it reaches the chain.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              The CLI generates a deterministic{" "}
              <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-[13px]">
                manifest.json
              </code>{" "}
              listing every file and its byte count. The client verifies each
              entry on disk after IPFS fetch. Identical source always produces
              the same manifest — and therefore the same CID.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              Dependencies are pinned to exact versions. The allowlist is stored
              onchain via the ConstraintsRegistry and updatable only through
              governance.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-[#1c1917]">
            <div className="flex items-center gap-2 border-b border-[#1e293b] px-4 py-2.5">
              <span className="text-[12px] font-medium text-[#94a3b8]">
                manifest.json
              </span>
            </div>
            <pre className="overflow-x-auto bg-[#0b1120] p-4 text-[13px] leading-relaxed text-[#e2e8f0]">
              <code>{MANIFEST_EXAMPLE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Band                                                           */
/* ------------------------------------------------------------------ */

function CtaBand() {
  return (
    <section className="border-y border-border bg-surface-alt px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1152px] text-center">
        <h2 className="text-[22px] font-semibold text-ink">
          VibeFi is open source.
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-ink-muted">
          Solidity contracts, Rust client, TypeScript CLI, and example dapps —
          all in one monorepo. Read the code, run the local stack, or start
          contributing as a person or agent.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://docs.vibefi.workers.dev/"
            className="vf-gradient-button inline-flex h-10 items-center rounded-lg px-5 text-[14px] font-medium transition duration-150"
          >
            Read the docs
          </a>
          <a
            href="https://github.com/vibefi/monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-lg border border-border px-5 text-[14px] font-medium text-ink-muted transition-colors duration-150 hover:border-ink-faint hover:text-ink"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function Landing() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-teal-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <WhyNow />
        <HowItWorks />
        <Features />
        <TechnicalSnippet />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
