import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  forceSimulation,
  forceCollide,
  forceX,
  forceY,
} from "d3-force";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import events from "../timeline.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = "frontend-hack" | "shutdown" | "censorship" | "regulatory";

type TimelineEvent = {
  id: string;
  date: string;
  project: string;
  category: Category;
  vector: string;
  summary: string;
  amountLost: number | null;
  amountLostDisplay: string;
  impactScore: number;
};

type SortMode = "date" | "impact";
type ViewMode = "default" | "cards" | "bubbles";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORY_STYLES: Record<Category, { label: string; classes: string }> = {
  "frontend-hack": {
    label: "Frontend Hack",
    classes: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  shutdown: {
    label: "Shutdown",
    classes: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  censorship: {
    label: "Censorship",
    classes: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  },
  regulatory: {
    label: "Regulatory",
    classes: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
};

const CATEGORY_ACCENT: Record<Category, string> = {
  "frontend-hack": "bg-red-500",
  shutdown: "bg-amber-500",
  censorship: "bg-purple-500",
  regulatory: "bg-blue-500",
};

const CATEGORY_TEXT: Record<Category, string> = {
  "frontend-hack": "text-red-400",
  shutdown: "text-amber-400",
  censorship: "text-purple-400",
  regulatory: "text-blue-400",
};

function formatDate(raw: string): string {
  const parts = raw.split("-");
  if (parts.length === 3) {
    const d = new Date(`${raw}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  if (parts.length === 2) {
    const d = new Date(`${raw}-01T00:00:00`);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }
  return raw;
}

function formatDateShort(raw: string): string {
  const parts = raw.split("-");
  if (parts.length === 3) {
    const d = new Date(`${raw}T00:00:00`);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
  }
  if (parts.length === 2) {
    const d = new Date(`${raw}-01T00:00:00`);
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  return raw;
}

function dateSort(a: string, b: string): number {
  const pad = (s: string) => {
    const p = s.split("-");
    if (p.length === 1) return `${p[0]}-12-31`;
    if (p.length === 2) return `${p[0]}-${p[1]}-28`;
    return s;
  };
  return pad(b).localeCompare(pad(a));
}

function formatYear(raw: string): string {
  return raw.split("-")[0];
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                              */
/* ------------------------------------------------------------------ */

function CategoryBadge({ category }: { category: Category }) {
  const style = CATEGORY_STYLES[category];
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-tight ${style.classes}`}
    >
      {style.label}
    </span>
  );
}

function ImpactDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`inline-block h-2 w-2 rounded-full ${
              i < score ? "bg-brand-violet" : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="text-[12px] font-medium text-ink-muted">
        {score}/10
      </span>
    </div>
  );
}

function PillToggle<T extends string>({
  options,
  current,
  onChange,
}: {
  options: { key: T; label: string }[];
  current: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex w-fit flex-wrap gap-1 rounded-lg border border-border bg-surface-alt p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`rounded-md px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
            current === opt.key
              ? "bg-surface text-ink shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
          aria-pressed={current === opt.key}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  VIEW: Default (dossier style, hover-expand)                        */
/* ================================================================== */

const CATEGORY_STAMP: Record<Category, { text: string; color: string }> = {
  "frontend-hack": { text: "COMPROMISED", color: "border-red-500/50 text-red-500" },
  shutdown: { text: "DECOMMISSIONED", color: "border-amber-500/50 text-amber-500" },
  censorship: { text: "RESTRICTED", color: "border-purple-500/50 text-purple-500" },
  regulatory: { text: "ENFORCEMENT", color: "border-blue-500/50 text-blue-500" },
};

const MOBILE_BREAKPOINT = 768; // matches Tailwind `md:`
const AUTO_EXPAND_THRESHOLD = 8; // impact score >= this auto-expands on mobile

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

function DefaultView({ data }: { data: TimelineEvent[] }) {
  const isMobile = useIsMobile();
  // On mobile: track which items are toggled open (tap to expand/collapse)
  const [mobileExpanded, setMobileExpanded] = useState<Set<string>>(() => {
    // Auto-expand high-impact items on mobile
    return new Set(
      data
        .filter((e) => e.impactScore >= AUTO_EXPAND_THRESHOLD)
        .map((e) => e.id),
    );
  });

  function toggleMobile(id: string) {
    setMobileExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mt-10 space-y-3">
      {data.map((event, i) => {
        const stamp = CATEGORY_STAMP[event.category];
        // Desktop: always expanded. Mobile: toggled via tap.
        const isOpen = isMobile ? mobileExpanded.has(event.id) : true;

        return (
          <div
            key={event.id}
            className="relative overflow-hidden rounded-lg border border-border bg-surface font-mono transition-colors duration-150 hover:bg-surface-alt/40"
            onClick={isMobile ? () => toggleMobile(event.id) : undefined}
          >
            {/* Collapsed: single row */}
            <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
              <span className="shrink-0 text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                #{String(i + 1).padStart(3, "0")}
              </span>
              <span
                className={`hidden shrink-0 -rotate-3 rounded border-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] sm:inline-block ${stamp.color}`}
              >
                {stamp.text}
              </span>
              <h3 className="min-w-0 truncate text-[14px] font-bold uppercase tracking-wide text-ink">
                {event.project}
              </h3>
              <span className="ml-auto shrink-0 text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                {formatDate(event.date)}
              </span>
              <div className="hidden shrink-0 gap-[3px] sm:flex">
                {Array.from({ length: 10 }, (_, j) => (
                  <span
                    key={j}
                    className={`inline-block h-2.5 w-2.5 border ${
                      j < event.impactScore
                        ? "border-brand-violet bg-brand-violet"
                        : "border-border bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Expanded: full dossier details */}
            <div
              className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2 border-t border-dashed border-border px-5 py-4 sm:px-6">
                  {/* Stamp on mobile */}
                  <div className="flex items-center gap-2 sm:hidden">
                    <span
                      className={`-rotate-3 rounded border-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${stamp.color}`}
                    >
                      {stamp.text}
                    </span>
                    <div className="flex gap-[3px]">
                      {Array.from({ length: 10 }, (_, j) => (
                        <span
                          key={j}
                          className={`inline-block h-2.5 w-2.5 border ${
                            j < event.impactScore
                              ? "border-brand-violet bg-brand-violet"
                              : "border-border bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.1em] text-ink-faint">
                      Vector
                    </span>
                    <span className="text-[13px] text-ink-muted">
                      {event.vector.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.1em] text-ink-faint">
                      Summary
                    </span>
                    <span className="text-[13px] leading-relaxed text-ink-muted">
                      {event.summary}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.1em] text-ink-faint">
                      Damages
                    </span>
                    <span className="text-[13px] font-medium text-ink">
                      {event.amountLostDisplay === "N/A"
                        ? "No direct loss reported"
                        : event.amountLostDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  VIEW: Cards (impact-hero data visualisation)                       */
/* ================================================================== */

function SignalView({ data }: { data: TimelineEvent[] }) {
  // Group by year for visual breaks
  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const e of data) {
      const yr = formatYear(e.date);
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push(e);
    }
    return map;
  }, [data]);

  return (
    <div className="mt-10 space-y-12">
      {[...grouped.entries()].map(([year, yearEvents]) => (
        <div key={year}>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[28px] font-black tracking-tight text-ink/20">
              {year}
            </span>
            <div className="h-px grow bg-border" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {yearEvents.map((event) => {
              const barWidth = (event.impactScore / 10) * 100;
              return (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-brand-violet/30 hover:shadow-[0_0_20px_rgba(124,58,237,0.06)]"
                >
                  {/* Impact bar background */}
                  <div
                    className={`absolute inset-y-0 left-0 opacity-[0.04] transition-opacity duration-200 group-hover:opacity-[0.08] ${CATEGORY_ACCENT[event.category]}`}
                    style={{ width: `${barWidth}%` }}
                  />

                  <div className="relative">
                    {/* Top row: big score + date */}
                    <div className="flex items-start justify-between">
                      <span className="text-[32px] font-black leading-none tracking-tighter text-brand-violet">
                        {event.impactScore}
                      </span>
                      <div className="text-right">
                        <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${CATEGORY_TEXT[event.category]}`}>
                          {CATEGORY_STYLES[event.category].label}
                        </span>
                        <p className="mt-0.5 text-[11px] text-ink-faint">
                          {formatDateShort(event.date)}
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-3 text-[14px] font-semibold leading-snug text-ink">
                      {event.project}
                    </h3>

                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                      {event.summary.length > 120
                        ? event.summary.slice(0, 120) + "…"
                        : event.summary}
                    </p>

                    {/* Bottom bar */}
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-[12px] font-medium text-ink-muted">
                        {event.amountLostDisplay === "N/A"
                          ? "No direct loss"
                          : event.amountLostDisplay}
                      </span>
                      {/* Mini severity bar */}
                      <div className="flex gap-[2px]">
                        {Array.from({ length: 10 }, (_, j) => (
                          <span
                            key={j}
                            className={`inline-block h-1 w-3 rounded-sm ${
                              j < event.impactScore
                                ? "bg-brand-violet"
                                : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  VIEW 5 — Bubbles (force-packed ball pit)                           */
/* ================================================================== */

const CATEGORY_FILL: Record<Category, string> = {
  "frontend-hack": "#ef4444",
  shutdown: "#f59e0b",
  censorship: "#a855f7",
  regulatory: "#3b82f6",
};

const CATEGORY_FILL_DIM: Record<Category, string> = {
  "frontend-hack": "rgba(239,68,68,0.15)",
  shutdown: "rgba(245,158,11,0.15)",
  censorship: "rgba(168,85,247,0.15)",
  regulatory: "rgba(59,130,246,0.15)",
};

type BubbleNode = TimelineEvent & {
  r: number;
  x: number;
  y: number;
};

function computeRadius(event: TimelineEvent): number {
  const impactBase = event.impactScore / 10; // 0–1
  const amountBonus =
    event.amountLost && event.amountLost > 0
      ? Math.log10(event.amountLost) / Math.log10(1_500_000_000)
      : 0;
  // Amount is 1.5x more influential than before (0.45 vs 0.3)
  const composite = impactBase * 0.55 + amountBonus * 0.45;
  return 28 + composite * 62;
}

/** Clamp a value between min and max. */
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;
const VIRTUAL_SIZE = 1800; // larger canvas so bubbles have room to spread

function BubblesView({ data }: { data: TimelineEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 900, height: 650 });
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const simulationRef = useRef<ReturnType<typeof forceSimulation<BubbleNode>> | null>(null);

  // Pan/zoom state
  const [zoom, setZoom] = useState(0.55);
  const [pan, setPan] = useState(() => ({
    x: 900 / 2 - (VIRTUAL_SIZE / 2) * 0.55,
    y: 650 / 2 - (VIRTUAL_SIZE / 2) * 0.55,
  }));
  const [dragging, setDragging] = useState(false);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  // Measure container and recenter pan
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const height = Math.max(450, Math.min(width * 0.7, 650));
      setViewport({ width, height });
      const z = zoomRef.current;
      setPan({
        x: width / 2 - (VIRTUAL_SIZE / 2) * z,
        y: height / 2 - (VIRTUAL_SIZE / 2) * z,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Run simulation on a large virtual canvas
  useEffect(() => {
    const cx = VIRTUAL_SIZE / 2;
    const cy = VIRTUAL_SIZE / 2;

    const initial: BubbleNode[] = data.map((e) => ({
      ...e,
      r: computeRadius(e),
      x: cx + (Math.random() - 0.5) * VIRTUAL_SIZE * 0.4,
      y: cy + (Math.random() - 0.5) * VIRTUAL_SIZE * 0.4,
    }));

    simulationRef.current?.stop();

    const sim = forceSimulation<BubbleNode>(initial)
      .force("x", forceX<BubbleNode>(cx).strength(0.04))
      .force("y", forceY<BubbleNode>(cy).strength(0.04))
      .force(
        "collide",
        forceCollide<BubbleNode>((d) => d.r + 3)
          .strength(0.9)
          .iterations(4),
      )
      .alphaDecay(0.015)
      .on("tick", () => {
        setNodes([...sim.nodes()]);
      });

    simulationRef.current = sim;
    return () => { sim.stop(); };
  }, [data]);

  // Wheel to zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Cursor position relative to container
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      const newZoom = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM);
      const scale = newZoom / zoom;

      // Zoom toward cursor
      setPan({
        x: mx - (mx - pan.x) * scale,
        y: my - (my - pan.y) * scale,
      });
      setZoom(newZoom);
    },
    [zoom, pan],
  );

  // Mouse drag to pan
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.button !== 1) return;
      isPanning.current = true;
      setDragging(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pan],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
    },
    [],
  );

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
    setDragging(false);
  }, []);

  // Tooltip: position in screen coordinates
  const handleBubbleHover = useCallback(
    (e: React.MouseEvent, id: string) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setHovered(id);
    },
    [],
  );

  const hoveredEvent = hovered
    ? nodes.find((n) => n.id === hovered) ?? null
    : null;

  return (
    <div className="mt-10">
      {/* Legend + controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {(Object.keys(CATEGORY_FILL) as Category[]).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: CATEGORY_FILL[cat] }}
            />
            <span className="text-[12px] text-ink-muted">
              {CATEGORY_STYLES[cat].label}
            </span>
          </div>
        ))}
        <span className="ml-auto text-[11px] text-ink-faint">
          Scroll to zoom &middot; Drag to pan
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-border bg-surface"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg
          width={viewport.width}
          height={viewport.height}
          className="block select-none"
        >
          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
            {/* Subtle radial grid */}
            {[0.2, 0.4, 0.6, 0.8].map((f) => (
              <circle
                key={f}
                cx={VIRTUAL_SIZE / 2}
                cy={VIRTUAL_SIZE / 2}
                r={VIRTUAL_SIZE * f * 0.45}
                fill="none"
                stroke="currentColor"
                className="text-border"
                strokeWidth={1 / zoom}
                strokeDasharray={`${4 / zoom} ${6 / zoom}`}
              />
            ))}

            {nodes.map((node) => {
              const isHovered = hovered === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  onMouseMove={(e) => {
                    e.stopPropagation();
                    handleBubbleHover(e, node.id);
                  }}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}
                >
                  {isHovered && (
                    <circle
                      r={node.r + 4}
                      fill="none"
                      stroke={CATEGORY_FILL[node.category]}
                      strokeWidth={2 / zoom}
                      opacity={0.5}
                    />
                  )}
                  <circle
                    r={node.r}
                    fill={CATEGORY_FILL_DIM[node.category]}
                    stroke={CATEGORY_FILL[node.category]}
                    strokeWidth={(isHovered ? 2 : 1) / zoom}
                    opacity={hovered && !isHovered ? 0.35 : 1}
                    style={{ transition: "opacity 200ms, stroke-width 150ms" }}
                  />
                  <text
                    textAnchor="middle"
                    dy={node.r > 45 ? "-0.3em" : "0em"}
                    fill="currentColor"
                    className="text-ink"
                    fontSize={node.r > 60 ? 12 : node.r > 40 ? 11 : 9}
                    fontWeight={600}
                    pointerEvents="none"
                  >
                    {node.project.length > (node.r > 50 ? 24 : 14)
                      ? node.project.slice(0, node.r > 50 ? 22 : 12) + "…"
                      : node.project}
                  </text>
                  {node.r > 45 && node.amountLostDisplay !== "N/A" && (
                    <text
                      textAnchor="middle"
                      dy="1em"
                      fill="currentColor"
                      className="text-ink-muted"
                      fontSize={10}
                      fontWeight={500}
                      pointerEvents="none"
                    >
                      {node.amountLostDisplay}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Zoom indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-surface/90 px-2.5 py-1 text-[11px] text-ink-muted backdrop-blur-sm">
          <button
            onClick={() => setZoom((z) => clamp(z / 1.2, MIN_ZOOM, MAX_ZOOM))}
            className="px-1 text-[14px] hover:text-ink"
          >
            −
          </button>
          <span className="w-10 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => clamp(z * 1.2, MIN_ZOOM, MAX_ZOOM))}
            className="px-1 text-[14px] hover:text-ink"
          >
            +
          </button>
        </div>

        {/* Hover tooltip */}
        {hoveredEvent && (
          <div
            className="pointer-events-none absolute z-10 w-72 rounded-lg border border-border bg-surface p-4 shadow-lg"
            style={{
              left: clamp(tooltipPos.x + 16, 0, viewport.width - 304),
              top: clamp(tooltipPos.y + 16, 0, viewport.height - 200),
            }}
          >
            <div className="flex items-center gap-2">
              <CategoryBadge category={hoveredEvent.category} />
              <span className="text-[12px] text-ink-muted">
                {formatDate(hoveredEvent.date)}
              </span>
            </div>
            <h3 className="mt-2 text-[14px] font-semibold text-ink">
              {hoveredEvent.project}
            </h3>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
              {hoveredEvent.summary}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              {hoveredEvent.amountLostDisplay !== "N/A" && (
                <span className="text-[12px] font-medium text-ink">
                  Lost: {hoveredEvent.amountLostDisplay}
                </span>
              )}
              <ImpactDots score={hoveredEvent.impactScore} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: "date", label: "By Date" },
  { key: "impact", label: "By Impact" },
];

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "cards", label: "Cards" },
  { key: "bubbles", label: "Bubbles" },
];

export function Timeline() {
  const [sort, setSort] = useState<SortMode>("date");
  const [view, setView] = useState<ViewMode>("default");

  const totalLost = useMemo(() => {
    const sum = (events as TimelineEvent[]).reduce(
      (acc, e) => acc + (e.amountLost ?? 0),
      0,
    );
    if (sum >= 1_000_000_000) return `$${(sum / 1_000_000_000).toFixed(1)}B+`;
    if (sum >= 1_000_000) return `$${Math.round(sum / 1_000_000)}M+`;
    return `$${sum.toLocaleString()}`;
  }, []);

  const sorted = useMemo(() => {
    const data = [...(events as TimelineEvent[])];
    if (sort === "impact") {
      data.sort(
        (a, b) => b.impactScore - a.impactScore || dateSort(a.date, b.date),
      );
    } else {
      data.sort((a, b) => dateSort(a.date, b.date));
    }
    return data;
  }, [sort]);

  return (
    <>
      <Nav />
      <main className="px-6 pb-24 pt-14 sm:pb-32 sm:pt-20">
        <div className="mx-auto max-w-[960px]">
          <Link
            to="/"
            className="text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            ← Back to home
          </Link>

          <h1 className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-ink">
            DeFi Frontend Incident Timeline
          </h1>
          <p className="mt-4 max-w-[640px] text-[16px] leading-[1.7] text-ink-muted">
            We documented {sorted.length} incidents, representing over{" "}
            <strong className="text-ink">{totalLost}</strong> in confirmed
            losses, where users lost funds or access because of compromised,
            censored, or shuttered web frontends: the exact problem VibeFi
            eliminates. Each of these problems has informed the design and
            implementation of VibeFi.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PillToggle options={SORT_OPTIONS} current={sort} onChange={setSort} />
            <PillToggle options={VIEW_OPTIONS} current={view} onChange={setView} />
          </div>

          {view === "default" && <DefaultView data={sorted} />}
          {view === "cards" && <SignalView data={sorted} />}
          {view === "bubbles" && <BubblesView data={sorted} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
