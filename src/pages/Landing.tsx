import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Vote,
  AppWindow,
  FileCheck2,
  ListChecks,
  ShieldAlert,
  Usb,
  WifiOff,
  Smartphone,
  EyeOff,
  ArrowRight,
  Globe,
  Infinity,
  Landmark,
  Briefcase,
  Bot,
} from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { cn } from "../lib/cn";

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
  const flowNodes = [
    { label: "Developer", sub: "source" },
    { label: "CLI", sub: "validate + pack" },
    { label: "IPFS", sub: "rootCid" },
    { label: "Governor", sub: "propose → vote" },
    { label: "Registry", sub: "onchain CID" },
    { label: "Client", sub: "fetch → verify → run" },
  ];
  const pulseDuration = 3;

  const desktopNodes = flowNodes.map((node, i) => ({
    ...node,
    x: [60, 195, 340, 485, 630, 770][i],
  }));
  const desktopLineStart = desktopNodes[0].x;
  const desktopLineEnd = desktopNodes[desktopNodes.length - 1].x;
  const desktopPulseWidth = 120;
  const desktopPulseTravel =
    desktopLineEnd - desktopLineStart + desktopPulseWidth;

  const mobileNodes = flowNodes.map((node, i) => ({
    ...node,
    y: 36 + i * 58,
  }));
  const mobileX = 28;
  const mobileLineStart = mobileNodes[0].y;
  const mobileLineEnd = mobileNodes[mobileNodes.length - 1].y;
  const mobilePulseHeight = 88;
  const mobilePulseTravel =
    mobileLineEnd - mobileLineStart + mobilePulseHeight;

  return (
    <>
      <div className="mt-10 md:hidden">
        <svg
          viewBox="0 0 360 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          role="img"
          aria-label="Architecture flow: Developer to CLI to IPFS to Governor to Registry to Client"
        >
          <defs>
            <linearGradient id="pulse-grad-vertical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
              <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={mobileX}
            y1={mobileLineStart}
            x2={mobileX}
            y2={mobileLineEnd}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          <rect
            x={mobileX - 1.5}
            width={3}
            height={mobilePulseHeight}
            rx={1.5}
            fill="url(#pulse-grad-vertical)"
          >
            <animate
              attributeName="y"
              values={`${mobileLineStart - mobilePulseHeight};${mobileLineEnd}`}
              dur={`${pulseDuration}s`}
              repeatCount="indefinite"
            />
          </rect>

          {mobileNodes.slice(0, -1).map((node, i) => {
            const nextY = mobileNodes[i + 1].y;
            const midY = (node.y + nextY) / 2;
            return (
              <polygon
                key={i}
                points={`${mobileX - 4},${midY - 3.5} ${mobileX},${midY + 4} ${mobileX + 4},${midY - 3.5}`}
                fill="#64748b"
              />
            );
          })}

          {mobileNodes.map((node, i) => {
            const isFirst = i === 0;
            const isLast = i === mobileNodes.length - 1;
            const overlapStart = (node.y - mobileLineStart) / mobilePulseTravel;
            const overlapEnd =
              (node.y - mobileLineStart + mobilePulseHeight) / mobilePulseTravel;
            const overlapMid = (overlapStart + overlapEnd) / 2;
            const ringPeak = overlapStart + (1 - overlapStart) * 0.35;
            const ringFade = overlapStart + (1 - overlapStart) * 0.65;
            return (
              <g key={node.label}>
                {isLast && (
                  <circle cx={mobileX} cy={node.y} r={7} fill="#22C55E" opacity="0">
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
                <circle
                  cx={mobileX}
                  cy={node.y}
                  r={isFirst || isLast ? 7 : 5.5}
                  fill={isLast ? "#22C55E" : isFirst ? "#0f172a" : "#f8fbff"}
                  stroke={isLast ? "#22C55E" : isFirst ? "#0f172a" : "#64748b"}
                  strokeWidth={isFirst || isLast ? 0 : 1.5}
                >
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
                <text
                  x={mobileX + 16}
                  y={node.y - 2}
                  textAnchor="start"
                  className="fill-ink text-[12px] font-semibold"
                  style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                >
                  {node.label}
                </text>
                <text
                  x={mobileX + 16}
                  y={node.y + 12}
                  textAnchor="start"
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

      <div className="mt-14 hidden overflow-x-auto md:block lg:mt-16">
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
            <linearGradient id="pulse-grad-horizontal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
              <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background line */}
          <line
            x1={desktopLineStart}
            y1={38}
            x2={desktopLineEnd}
            y2={38}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Animated pulse traveling the line */}
          <rect
            y={36.5}
            width={desktopPulseWidth}
            height={3}
            rx={1.5}
            fill="url(#pulse-grad-horizontal)"
          >
            <animate
              attributeName="x"
              values={`${desktopLineStart - desktopPulseWidth};${desktopLineEnd}`}
              dur={`${pulseDuration}s`}
              repeatCount="indefinite"
            />
          </rect>

          {/* Arrows between nodes */}
          {desktopNodes.slice(0, -1).map((node, i) => {
            const nextX = desktopNodes[i + 1].x;
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
          {desktopNodes.map((node, i) => {
            const isFirst = i === 0;
            const isLast = i === desktopNodes.length - 1;
            const overlapStart = (node.x - desktopLineStart) / desktopPulseTravel;
            const overlapEnd =
              (node.x - desktopLineStart + desktopPulseWidth) / desktopPulseTravel;
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
    </>
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
          Build and run verified DeFi mini apps, governed by people and agents.
        </h1>
        <p className="mt-7 max-w-[560px] text-[16px] leading-[1.7] text-ink-muted">
          VibeFi is a crowd-sourced frontend network where people and AI agents
          review code, vote on releases, and run verified DeFi apps safely.
          Bundles are fetched from IPFS, verified by manifest, built locally,
          and run in a sandbox with no outbound network access.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/download"
            className="vf-gradient-button inline-flex h-11 items-center rounded-lg px-6 text-[14px] font-medium transition duration-150"
          >
            Download
          </a>
          <a
            href="https://docs.vibefi.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-white px-6 text-[14px] font-medium text-ink-muted transition-colors duration-150 hover:border-ink-faint hover:text-ink"
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
            You trust the infrastructure more than the code.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Every DeFi frontend runs on a centralized host: Vercel, Cloudflare,
            a dev team's server. A compromised deploy key, rogue CDN config,
            or supply-chain attack can swap the interface without touching
            contracts. Users have no way to verify what code their
            clients run. This isn't just hypothetical. We've documented{" "}
            <Link
              to="/history"
              className="font-medium text-ink-muted underline decoration-ink-faint/80 underline-offset-2 transition-colors duration-150 hover:text-ink hover:decoration-ink"
            >
              $1.6B in losses from compromised frontends
            </Link>
            .
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
/*  Value Props — Privacy, Censorship Resistance, Permanence           */
/* ------------------------------------------------------------------ */

const VALUE_PROPS = [
  {
    icon: EyeOff,
    headline: "Your wallet, your business.",
    body: "No analytics scripts, no fingerprinting, no tracking pixels. Dapps run in a sandboxed webview with zero outbound HTTP. The only external calls are the RPC requests you choose to make.",
  },
  {
    icon: Globe,
    headline: "No domain to seize, no server to block.",
    body: "Approved source lives on IPFS and is referenced by an onchain CID. There is no DNS, no hosting provider, and no single point of takedown. If Ethereum and IPFS are reachable, so is your frontend.",
  },
  {
    icon: Infinity,
    headline: "Frontends that outlive their teams.",
    body: "When a project winds down, its centralized frontend goes with it, sometimes while the contracts still hold your funds. VibeFi dapps are immutable, content-addressed, and available as long as a single IPFS node pins them.",
  },
] as const;

const VALUE_PROP_STAGGER_MS = 800;
const VALUE_PROP_BODY_FADE_MS = 500;
const CTA_REVEAL_DELAY_MS =
  (VALUE_PROPS.length - 1) * VALUE_PROP_STAGGER_MS +
  VALUE_PROPS[VALUE_PROPS.length - 1].headline.length * 40 +
  100 +
  VALUE_PROP_BODY_FADE_MS;

/* Ticker / typewriter reveal */
function TypewriterHeadline({ text, trigger }: { text: string; trigger: boolean }) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (!trigger || done) return;
    const id = setTimeout(() => setCount((c) => c + 1), 40);
    return () => clearTimeout(id);
  }, [trigger, count, done, text.length]);

  return (
    <span className="font-mono">
      {text.slice(0, count)}
      {!done && trigger && (
        <span className="inline-block w-[2px] animate-pulse bg-teal-accent">
          &nbsp;
        </span>
      )}
    </span>
  );
}

function ValuePropsContent({ visible }: { visible: boolean }) {
  return (
    <div className="space-y-12">
      {VALUE_PROPS.map((prop, i) => {
        const delay = i * VALUE_PROP_STAGGER_MS;
        return (
          <TickerItem
            key={prop.headline}
            prop={prop}
            visible={visible}
            delay={delay}
          />
        );
      })}
    </div>
  );
}

function TickerItem({
  prop,
  visible,
  delay,
}: {
  prop: (typeof VALUE_PROPS)[number];
  visible: boolean;
  delay: number;
}) {
  const [started, setStarted] = useState(false);
  const [headlineDone, setHeadlineDone] = useState(false);
  const textLen = prop.headline.length;

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(id);
  }, [visible, delay]);

  useEffect(() => {
    if (!started) return;
    const id = setTimeout(() => setHeadlineDone(true), textLen * 40 + 100);
    return () => clearTimeout(id);
  }, [started, textLen]);

  return (
    <div className="border-t border-border pt-8">
      <h3 className="text-[24px] font-bold leading-snug text-ink">
        <TypewriterHeadline text={prop.headline} trigger={started} />
      </h3>
      <p
        className={cn(
          "mt-4 text-[15px] leading-relaxed text-ink-muted transition-opacity duration-500",
          headlineDone ? "opacity-100" : "opacity-0",
        )}
      >
        {prop.body}
      </p>
    </div>
  );
}

function ValueProps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="border-b border-border px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1152px]">
        <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
          What this means for you
        </p>
        <h2 className="mt-3 max-w-[760px] text-[26px] font-semibold leading-snug tracking-tight text-ink">
          Privacy, censorship resistance, and permanence, by default.
        </h2>
        <p className="mt-4 max-w-[760px] text-[15px] leading-relaxed text-ink-muted">
          VibeFi doesn't just verify frontends. It changes what's possible when
          there's no centralized server in the loop.
        </p>

        <div ref={sectionRef} className="mt-10">
          <ValuePropsContent visible={visible} />
        </div>
        <HistoryCta visible={visible} />
      </div>
    </section>
  );
}

function HistoryCta({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "mt-10 rounded-lg border border-border bg-surface-alt px-5 py-7 text-center transition-all duration-500 sm:px-8",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
      style={{ transitionDelay: `${CTA_REVEAL_DELAY_MS}ms` }}
    >
      <p className="mx-auto max-w-[700px] text-[14px] leading-relaxed text-ink-muted">
        Understand the risks VibeFi is designed to prevent before they reach
        your wallet.
      </p>
      <Link
        to="/history"
        className={cn(
          "group mt-5 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-alt",
          "border border-ink/20 bg-ink text-surface hover:border-ink hover:bg-ink/90",
        )}
      >
        <span>Browse DeFi Incident History</span>
        <ArrowRight
          size={16}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Now                                                            */
/* ------------------------------------------------------------------ */

const WHY_NOW_ITEMS = [
  {
    icon: Package,
    title: "Code velocity is compounding",
    desc: "LLMs let teams and power users draft DeFi mini apps, wallet flows, and integration glue at unprecedented speed.",
  },
  {
    icon: FileCheck2,
    title: "Agent review is now practical",
    desc: "Teams can run multi-model review with ChatGPT, Claude, Kimi, and GLM to catch risky diffs before release.",
  },
  {
    icon: ShieldAlert,
    title: "Distribution risk keeps growing",
    desc: "When releases move this quickly, centralized deploy pipelines become the weakest link. VibeFi adds governance and verification before people and agents run new code.",
  },
] as const;

function WhyNow() {
  return (
    <section
      id="why-now"
      className="scroll-mt-16 border-b border-border px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1152px]">
        <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
          Why now
        </p>
        <h2 className="mt-3 max-w-[760px] text-[26px] font-semibold leading-snug tracking-tight text-ink">
          LLMs changed the release cadence for DeFi interfaces.
        </h2>
        <p className="mt-4 max-w-[760px] text-[15px] leading-relaxed text-ink-muted">
          LLMs compress both stages that used to be slow: writing app code and
          reviewing it. More releases can ship, more often. VibeFi exists to
          make that new speed governable and verifiable for people and agents.
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
    title: "Submit",
    desc: "Developers package a DeFi mini app with deterministic manifests and strict dependency constraints, then publish source to IPFS.",
  },
  {
    icon: FileCheck2,
    title: "Review",
    desc: "People and AI agents review proposed code changes, trace contract interactions, and surface risky behavior before release.",
  },
  {
    icon: Vote,
    title: "Vote",
    desc: "A governance proposal targets the onchain DappRegistry. Token holders and their agents vote, then execution writes the approved CID.",
  },
  {
    icon: AppWindow,
    title: "Run",
    desc: "The client fetches the approved bundle by CID, verifies each file, builds locally, and runs it in a sandboxed app runtime.",
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
          From submission to agent-reviewed runtime in four steps
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
    title: "People + agent governance",
    desc: "Review and release decisions can be made by token holders and autonomous agents participating in the same governance flow.",
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
    title: "Crowd-sourced frontends",
    desc: "DeFi mini apps can evolve through open contribution, structured review, and governance-approved distribution.",
  },
] as const;

function FeaturesOrbitalDesktop() {
  const [active, setActive] = useState<number | null>(null);
  const activeFeature = active !== null ? FEATURES[active] : null;

  // Ellipse radii — wide landscape oval
  const rx = 480;
  const ry = 200;
  // Inner decorative ellipse
  const irx = 240;
  const iry = 100;
  // SVG dimensions to contain the ellipse
  const svgW = (rx + 10) * 2;
  const svgH = (ry + 10) * 2;
  const cx0 = svgW / 2;
  const cy0 = svgH / 2;

  return (
    <div className="hidden md:block">
      <div
        className="relative mx-auto"
        style={{ height: 480, maxWidth: 1152 }}
      >
        {/* Central hub */}
        <div className="absolute left-1/2 top-1/2 z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-border bg-surface shadow-lg">
          {/* Default state */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300",
              activeFeature ? "opacity-0" : "opacity-100",
            )}
          >
            <span className="vf-gradient-text text-[13px] font-bold tracking-wider">
              VibeFi
            </span>
            <span className="mt-1 text-[10px] text-ink-faint">
              Security
            </span>
          </div>
          {/* Active feature state — render all, only show the active one */}
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300",
                active === i ? "opacity-100" : "opacity-0",
              )}
            >
              <f.icon size={22} className="text-teal-accent" />
              <span className="mt-2 max-w-[100px] text-center text-[12px] font-semibold leading-tight text-ink">
                {f.title}
              </span>
            </div>
          ))}
        </div>

        {/* Orbit rings */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
        >
          {/* Outer dashed ellipse */}
          <ellipse
            cx={cx0}
            cy={cy0}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.4"
          />
          {/* Inner subtle ellipse */}
          <ellipse
            cx={cx0}
            cy={cy0}
            rx={irx}
            ry={iry}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.5"
            strokeDasharray="2 8"
            opacity="0.3"
          />
          {/* Animated dot traveling the outer ellipse */}
          <circle r="3.5" fill="#06b6d4" opacity="0.7">
            <animateMotion
              dur="14s"
              repeatCount="indefinite"
              path={`M${cx0},${cy0 - ry} A${rx},${ry} 0 1,1 ${cx0 - 0.01},${cy0 - ry}`}
            />
          </circle>
          {/* Second dot, opposite phase */}
          <circle r="2.5" fill="#7c3aed" opacity="0.5">
            <animateMotion
              dur="14s"
              begin="-7s"
              repeatCount="indefinite"
              path={`M${cx0},${cy0 - ry} A${rx},${ry} 0 1,1 ${cx0 - 0.01},${cy0 - ry}`}
            />
          </circle>
          {/* Connector lines from center to each node */}
          {FEATURES.map((_, i) => {
            const angle = ((i * 60 - 90) * Math.PI) / 180;
            const x2 = cx0 + Math.cos(angle) * rx;
            const y2 = cy0 + Math.sin(angle) * ry;
            return (
              <line
                key={i}
                x1={cx0}
                y1={cy0}
                x2={x2}
                y2={y2}
                stroke="#cbd5e1"
                strokeWidth="0.5"
                opacity={active === i ? 0.6 : 0.15}
                className="transition-opacity duration-300"
              />
            );
          })}
        </svg>

        {/* Orbiting feature cards */}
        {FEATURES.map((f, i) => {
          const angle = ((i * 60 - 90) * Math.PI) / 180;
          const px = Math.cos(angle) * rx;
          const py = Math.sin(angle) * ry;
          const isActive = active === i;

          return (
            <button
              key={f.title}
              onClick={() => setActive(isActive ? null : i)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                "absolute left-1/2 top-1/2 z-20 cursor-pointer rounded-xl border bg-surface text-left transition-all duration-300",
                isActive
                  ? "shadow-lg"
                  : "shadow-sm hover:shadow-md",
              )}
              style={{
                transform: `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${isActive ? 1.08 : 1})`,
                borderColor: isActive ? "#06b6d4" : "#cbd5e1",
                width: isActive ? 220 : 180,
              }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2.5">
                  <f.icon
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors duration-300",
                      isActive ? "text-teal-accent" : "text-ink-faint",
                    )}
                  />
                  <h3 className="text-[13px] font-semibold leading-tight text-ink">
                    {f.title}
                  </h3>
                </div>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isActive
                      ? "mt-2.5 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-[12px] leading-relaxed text-ink-muted">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FeaturesOrbitalMobile() {
  const [active, setActive] = useState<number | null>(0);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-cycle through features until the user taps one
  useEffect(() => {
    if (userInteracted) return;
    const interval = setInterval(() => {
      setActive((prev) => ((prev ?? -1) + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [userInteracted]);

  function handleTap(i: number) {
    setUserInteracted(true);
    setActive(active === i ? null : i);
  }

  return (
    <div className="md:hidden">
      {/* Tap hint — fades out once user interacts */}
      <div
        className={cn(
          "mb-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-faint transition-opacity duration-500",
          userInteracted ? "opacity-0" : "opacity-100",
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 11V5a3 3 0 0 0-6 0v6" />
          <path d="M18 11a6 6 0 0 1-12 0" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
        Tap to explore
      </div>
      {/* Two-column grid */}
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((f, i) => {
          const isActive = active === i;
          return (
            <button
              key={f.title}
              onClick={() => handleTap(i)}
              className={cn(
                "cursor-pointer rounded-xl border bg-surface p-4 text-left transition-all duration-300",
                isActive
                  ? "border-teal-accent shadow-md"
                  : "border-border",
              )}
            >
              <f.icon
                size={18}
                className={cn(
                  "transition-colors duration-300",
                  isActive ? "text-teal-accent" : "text-ink-faint",
                )}
              />
              <h3 className="mt-2.5 text-[13px] font-semibold leading-tight text-ink">
                {f.title}
              </h3>
              <p
                className={cn(
                  "text-[12px] leading-relaxed text-ink-muted transition-all duration-300",
                  isActive
                    ? "mt-2 max-h-40 opacity-100"
                    : "mt-0 max-h-0 overflow-hidden opacity-0",
                )}
              >
                {f.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-16 border-y border-border bg-surface-alt px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1152px]">
        <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
          Security
        </p>
        <h2 className="mt-3 text-[26px] font-semibold leading-snug tracking-tight text-ink">
          Built for verification, not convenience theater
        </h2>

        <div className="mt-14">
          <FeaturesOrbitalDesktop />
          <FeaturesOrbitalMobile />
        </div>
      </div>
    </section>
  );
}

const USE_CASES = [
  {
    icon: Landmark,
    title: "Treasury management",
    desc: "Ship internal or public dashboards for rebalancing, allocations, and execution workflows with governance-controlled releases.",
  },
  {
    icon: Briefcase,
    title: "Fund manager tooling",
    desc: "Coordinate power-user interfaces for portfolio ops where every frontend change is reviewable and vote-approved.",
  },
  {
    icon: Bot,
    title: "Agentic strategy interfaces",
    desc: "Run multi-model review pipelines and deploy apps that both humans and agents can trust to execute.",
  },
] as const;

function UseCases() {
  return (
    <section className="border-b border-border bg-[#f4f8ff] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1152px]">
        <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
          Use cases
        </p>
        <h2 className="mt-3 max-w-[760px] text-[26px] font-semibold leading-snug tracking-tight text-ink">
          A DeFi power-user tool for teams and agents
        </h2>
        <p className="mt-4 max-w-[760px] text-[15px] leading-relaxed text-ink-muted">
          VibeFi is built for high-trust execution surfaces where updates move
          quickly and review depth matters.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {USE_CASES.map((item) => (
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
    { "path": "vibefi.json", "bytes": 612 }
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
              Each vapp defines source properties in{" "}
              <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-[13px]">
                vibefi.json
              </code>{" "}
              (addresses plus optional capabilities). The CLI then generates a deterministic{" "}
              <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-[13px]">
                manifest.json
              </code>{" "}
              listing every file and its byte count. The client verifies each
              entry on disk after IPFS fetch. Identical source always produces
              the same manifest, and therefore the same CID.
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
          Crowd-sourced frontends for DeFi.
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-ink-muted">
          Solidity contracts, Rust client, TypeScript CLI, and example mini
          apps all in one monorepo. Read the code, run the local stack, or
          contribute as a person or agent.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            to="/download"
            className="vf-gradient-button inline-flex h-10 items-center rounded-lg px-5 text-[14px] font-medium transition duration-150"
          >
            Download
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://docs.vibefi.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-white px-5 text-[14px] font-medium text-ink-muted transition-colors duration-150 hover:border-ink-faint hover:text-ink"
            >
              Read the docs
            </a>
            <a
              href="https://github.com/vibefi/monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-white px-5 text-[14px] font-medium text-ink-muted transition-colors duration-150 hover:border-ink-faint hover:text-ink"
            >
              View on GitHub
            </a>
          </div>
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
        <ValueProps />
        <WhyNow />
        <HowItWorks />
        <Features />
        <UseCases />
        <TechnicalSnippet />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
