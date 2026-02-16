import { useId } from "react";

export function VibeFiLogo({ className = "", label = "VibeFi logo (V-forward waveform)" }: { className?: string; label?: string }) {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="132 208 252 144"
      role="img"
      aria-label={label}
      className={className}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="90"
          y1="60"
          x2="430"
          y2="460"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="0.5" stopColor="#06B6D4" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          pathLength="100"
          stroke={`url(#${gradientId})`}
          strokeWidth="28"
          opacity="1"
          d="M152 240 C176 220, 198 220, 214 240 L256 340 L292 262 L316 292 L368 236"
        />
      </g>
    </svg>
  );
}
