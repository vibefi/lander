import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Apple,
  Monitor,
  Terminal,
  Wrench,
  Copy,
  Check,
  ChevronDown,
  Github,
} from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

/* ------------------------------------------------------------------ */
/*  OS detection                                                       */
/* ------------------------------------------------------------------ */

type OS = "macos" | "windows" | "linux";

function detectOS(): OS {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "macos";
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CURL_CMD = `curl -fsSL https://install.vibefi.dev | sh`;

const OS_META: Record<
  OS,
  { label: string; icon: typeof Apple; fileName?: string }
> = {
  macos: { label: "macOS", icon: Apple },
  windows: { label: "Windows", icon: Monitor, fileName: "VibeFi-latest.msi" },
  linux: { label: "Linux", icon: Terminal, fileName: "VibeFi-latest.AppImage" },
};

const DOWNLOAD_SHA256_PLACEHOLDERS = [
  {
    label: "macOS installer script (install.vibefi.dev)",
    sum: "SHA256_PLACEHOLDER_MACOS_INSTALL_SCRIPT",
  },
  {
    label: "Windows installer (VibeFi-latest.msi)",
    sum: "SHA256_PLACEHOLDER_WINDOWS_MSI",
  },
  {
    label: "Linux AppImage (VibeFi-latest.AppImage)",
    sum: "SHA256_PLACEHOLDER_LINUX_APPIMAGE",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Copy button                                                        */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#a8a29e] transition-colors duration-150 hover:bg-[#2e2a27] hover:text-[#d6d3d1]"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  macOS install guide                                                */
/* ------------------------------------------------------------------ */

function MacGuide() {
  return (
    <div className="space-y-4">
      {/* Command block */}
      <div className="overflow-hidden rounded-lg border border-[#2e2a27] bg-[#1c1917]">
        <div className="flex items-center justify-between border-b border-[#2e2a27] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#a8a29e]" />
            <span className="text-[12px] font-medium text-[#a8a29e]">
              Terminal
            </span>
          </div>
          <CopyButton text={CURL_CMD} />
        </div>
        <div className="px-4 py-4">
          <code className="text-[14px] leading-relaxed text-[#d6d3d1]">
            {CURL_CMD}
          </code>
        </div>
      </div>

      {/* Step-by-step for non-technical users */}
      <div className="rounded-lg border border-border bg-surface-alt p-4">
        <p className="text-[14px] font-medium text-teal-accent">
          New to the terminal? Step-by-step guide
        </p>
        <ol className="mt-4 flex flex-col gap-5 border-l-2 border-border pl-6">
          <li>
            <StepNumber n={1} />
            <p className="mt-1 text-[15px] font-medium text-ink">
              Open Terminal
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
              Press{" "}
              <kbd className="rounded border border-border bg-surface-alt px-1.5 py-0.5 font-mono text-[12px] text-ink">
                ⌘ Cmd
              </kbd>{" "}
              +{" "}
              <kbd className="rounded border border-border bg-surface-alt px-1.5 py-0.5 font-mono text-[12px] text-ink">
                Space
              </kbd>{" "}
              to open Spotlight, type{" "}
              <strong className="text-ink">Terminal</strong>, and press Enter.
            </p>
          </li>
          <li>
            <StepNumber n={2} />
            <p className="mt-1 text-[15px] font-medium text-ink">
              Paste the install command
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
              Click the copy button above, then in Terminal press{" "}
              <kbd className="rounded border border-border bg-surface-alt px-1.5 py-0.5 font-mono text-[12px] text-ink">
                ⌘ Cmd
              </kbd>{" "}
              +{" "}
              <kbd className="rounded border border-border bg-surface-alt px-1.5 py-0.5 font-mono text-[12px] text-ink">
                V
              </kbd>{" "}
              to paste.
            </p>
          </li>
          <li>
            <StepNumber n={3} />
            <p className="mt-1 text-[15px] font-medium text-ink">
              Press Enter and wait
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
              The installer downloads and sets up VibeFi. When it finishes, you
              can launch VibeFi from your Applications folder.
            </p>
          </li>
        </ol>
      </div>

      <div className="rounded-lg border border-border bg-surface-alt p-4">
        <p className="text-[14px] font-semibold text-ink">
          Why use{" "}
          <code className="rounded bg-surface px-1 py-0.5 font-mono text-[12px]">
            curl | sh
          </code>{" "}
          on macOS?
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
          VibeFi is DAO-governed. As such we are not able to pay Apple for a
          Gatekeeper signature in order to distribute the app. Given that
          constraint, the install script is the most user-friendly installation
          path we can support today. The script downloads and verifies the hash of the latest release, then installs it to your user specific Applications folder. It does not require admin permissions or make any system changes.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
          If you are a technical user and prefer to avoid this flow, use the{" "}
          <strong className="text-ink">Build from source</strong> option below.
        </p>
      </div>
    </div>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-accent text-[12px] font-semibold text-white">
      {n}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Windows / Linux download card                                      */
/* ------------------------------------------------------------------ */

function BinaryDownload({ os }: { os: "windows" | "linux" }) {
  const meta = OS_META[os];
  const ext = os === "windows" ? ".msi" : ".AppImage";
  const Icon = meta.icon;

  return (
    <div>
      <a
        href={`https://releases.vibefi.dev/latest/${meta.fileName}`}
        className="inline-flex h-12 items-center gap-3 rounded-lg bg-teal-accent px-7 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-teal-accent-hover"
      >
        <Icon size={18} />
        Download {meta.fileName}
      </a>
      <div className="mt-4 rounded-lg border border-border bg-surface-alt p-4">
        <p className="text-[13px] leading-relaxed text-ink-muted">
          {os === "windows" ? (
            <>
              Run the{" "}
              <code className="rounded bg-surface px-1 py-0.5 font-mono text-[12px]">
                {ext}
              </code>{" "}
              installer. Windows may show a SmartScreen warning, click{" "}
              <strong className="text-ink">More info</strong> then{" "}
              <strong className="text-ink">Run anyway</strong>.
            </>
          ) : (
            <>
              Make the file executable:{" "}
              <code className="rounded bg-surface px-1 py-0.5 font-mono text-[12px]">
                chmod +x {meta.fileName}
              </code>{" "}
              then run it. On some distros you may need to install FUSE:{" "}
              <code className="rounded bg-surface px-1 py-0.5 font-mono text-[12px]">
                sudo apt install libfuse2
              </code>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function SourceBuildOption() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expanded}
      >
        <span className="text-[15px] font-semibold text-ink">
          Build from source
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <p className="pt-2 text-[14px] leading-relaxed text-ink-muted">
            Prefer to compile VibeFi yourself? Follow the monorepo setup guide
            and the client build instructions.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/vibefi/monorepo/blob/master/SETUP.md#client"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-[13px] font-medium text-ink transition-colors duration-150 hover:bg-white"
            >
              <Wrench size={16} />
              Build guide
            </a>
            <a
              href="https://github.com/vibefi/monorepo/tree/master/client"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-[13px] font-medium text-ink transition-colors duration-150 hover:bg-white"
            >
              <Github size={16} />
              Client source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadChecksums() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expanded}
      >
        <span className="text-[15px] font-semibold text-ink">
          SHA256 checksums
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <p className="pt-2 text-[14px] leading-relaxed text-ink-muted">
            You can verify the integrity of the downloaded installer by
            comparing the SHA256 checksums below. If you are a technical user,
            we recommend building from source.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {DOWNLOAD_SHA256_PLACEHOLDERS.map((entry) => (
              <li key={entry.label}>
                <p className="text-[13px] text-ink-muted">{entry.label}</p>
                <div className="mt-1 flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
                  <code className="text-[12px] text-ink">{entry.sum}</code>
                  <CopyButton text={entry.sum} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OS tab selector                                                    */
/* ------------------------------------------------------------------ */

function OsTabs({
  current,
  onChange,
}: {
  current: OS;
  onChange: (os: OS) => void;
}) {
  const tabs: OS[] = ["macos", "windows", "linux"];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    function updatePill() {
      const container = containerRef.current;
      if (!container) return;
      const active = container.querySelector<HTMLButtonElement>(
        `button[data-os="${current}"]`,
      );
      if (!active) return;
      setPill({ left: active.offsetLeft, width: active.offsetWidth });
    }

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [current]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex rounded-lg border border-border bg-surface-alt p-1"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1 top-1 rounded-md bg-surface shadow-sm transition-[transform,width,opacity] duration-300 ease-out"
        style={{
          width: pill.width,
          transform: `translateX(${pill.left}px)`,
          opacity: pill.width ? 1 : 0,
        }}
      />
      {tabs.map((os) => {
        const meta = OS_META[os];
        const Icon = meta.icon;
        const active = os === current;
        return (
          <button
            key={os}
            data-os={os}
            onClick={() => onChange(os)}
            className={`relative z-10 inline-flex items-center gap-2 rounded-md px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
              active ? "text-ink" : "text-ink-muted hover:text-ink"
            }`}
            aria-pressed={active}
          >
            <Icon size={15} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function Download() {
  const detected = useMemo(detectOS, []);
  const [os, setOs] = useState<OS>(detected);

  return (
    <>
      <Nav />
      <main className="px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="mx-auto max-w-[700px]">
          <Link
            to="/"
            className="text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            ← Back to home
          </Link>

          <h1 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-ink">
            Download VibeFi
          </h1>
          <p className="mt-4 max-w-[520px] text-[16px] leading-[1.7] text-ink-muted">
            The desktop client fetches governance-approved frontends from IPFS,
            verifies every file, builds locally, and runs them in a sandboxed
            runtime.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Installation
              </p>
              <p className="mt-2 text-[15px] font-medium text-ink">
                Choose your operating system
              </p>
              <div className="mt-4">
                <OsTabs current={os} onChange={setOs} />
              </div>
            </div>
            <div className="space-y-5 px-5 py-6 sm:px-6">
              {os === "macos" && <MacGuide />}
              {os === "windows" && <BinaryDownload os="windows" />}
              {os === "linux" && <BinaryDownload os="linux" />}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface-alt/70 p-5 sm:p-6">
            <h2 className="text-[15px] font-semibold text-ink">
              System requirements
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px] leading-relaxed text-ink-muted">
              {os === "macos" && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-teal-accent" />
                    <span>macOS 12 (Monterey) or later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-teal-accent" />
                    <span>Apple Silicon or Intel</span>
                  </li>
                </>
              )}
              {os === "windows" && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-teal-accent" />
                    <span>Windows 10 (1809) or later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-teal-accent" />
                    <span>
                      WebView2 runtime (included in Windows 11,
                      auto-installed on 10)
                    </span>
                  </li>
                </>
              )}
              {os === "linux" && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-teal-accent" />
                    <span>
                      GTK 3 + WebKitGTK (e.g.{" "}
                      <code className="rounded bg-surface px-1 py-0.5 font-mono text-[12px]">
                        libwebkit2gtk-4.1
                      </code>
                      )
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-teal-accent" />
                    <span>FUSE for AppImage support</span>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-6 space-y-4 border-t border-border/80 pt-6">
              <DownloadChecksums />
              <SourceBuildOption />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
