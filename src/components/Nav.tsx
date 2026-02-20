import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Menu, X as CloseIcon } from "lucide-react";
import { VibeFiLogo } from "./VibeFiLogo";

type NavLink =
  | {
      label: string;
      href: string;
      external?: boolean;
      icon?: "github" | "x";
      iconOnly?: boolean;
    }
  | { label: string; to: string };

const NAV_WORD_LINKS: NavLink[] = [
  { label: "Why Now", href: "/#why-now" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Download", to: "/download" },
  { label: "History", to: "/history" },
  {
    label: "Docs",
    href: "https://docs.vibefi.dev/",
    external: true,
  },
];

const NAV_SOCIAL_LINKS: NavLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/vibefi",
    external: true,
    icon: "github",
    iconOnly: true,
  },
  {
    label: "X",
    href: "https://x.com/vibefi_dev",
    external: true,
    icon: "x",
    iconOnly: true,
  },
];

const NAV_MOBILE_LINKS: NavLink[] = [
  ...NAV_WORD_LINKS,
  { label: "GitHub", href: "https://github.com/vibefi", external: true },
  { label: "X", href: "https://x.com/vibefi_dev", external: true },
];

function XBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M5 3h3.6l4.4 6.1L18 3h2.8l-6.5 7.9L21 21h-3.6l-4.9-6.8L6.9 21H4l7-8.5L5 3z"
      />
    </svg>
  );
}

function NavItem({
  link,
  className,
  onClick,
}: {
  link: NavLink;
  className: string;
  onClick?: () => void;
}) {
  if ("to" in link) {
    return (
      <Link to={link.to} className={className} onClick={onClick}>
        {link.label}
      </Link>
    );
  }
  const icon =
    link.icon === "github" ? (
      <Github size={16} aria-hidden="true" />
    ) : link.icon === "x" ? (
      <XBrandIcon className="h-4 w-4" />
    ) : null;
  return (
    <a
      href={link.href}
      className={`${className}${icon ? " inline-flex items-center justify-center" : ""}`}
      onClick={onClick}
      aria-label={link.iconOnly ? link.label : undefined}
      {...(link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {icon ?? link.label}
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm"
    >
      <div className="border-b border-border/80 bg-surface-alt px-6 py-1.5 text-center">
        <Link
          to="/download"
          className="text-[11px] font-medium tracking-[0.08em] text-ink-muted transition-colors duration-150 hover:text-ink"
        >
          VibeFi is live on Sepolia Testnet →
        </Link>
      </div>
      <div className="mx-auto flex h-14 max-w-[1152px] items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[18px] font-semibold tracking-tight text-ink"
        >
          <VibeFiLogo className="h-9 w-9" />
          <span className="vf-gradient-text">VibeFi</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center md:flex">
          <ul className="flex items-center gap-8">
            {NAV_WORD_LINKS.map((link) => (
              <li key={link.label}>
                <NavItem
                  link={link}
                  className="text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
                />
              </li>
            ))}
          </ul>
          <ul className="ml-5 flex items-center gap-2 border-l border-border pl-4">
            {NAV_SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <NavItem
                  link={link}
                  className="h-7 w-7 text-ink-muted transition-colors duration-150 hover:text-ink"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-md p-2 text-ink-muted hover:text-ink md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <CloseIcon size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_MOBILE_LINKS.map((link) => (
              <li key={link.label}>
                <NavItem
                  link={link}
                  className="text-[14px] text-ink-muted hover:text-ink"
                  onClick={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
