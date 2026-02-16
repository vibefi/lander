import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { VibeFiLogo } from "./VibeFiLogo";

type NavLink =
  | { label: string; href: string; external?: boolean }
  | { label: string; to: string };

const NAV_LINKS: NavLink[] = [
  { label: "Why Now", href: "/#why-now" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Download", to: "/download" },
  {
    label: "Docs",
    href: "https://docs.vibefi.workers.dev/docs/",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/vibefi/monorepo",
    external: true,
  },
];

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
  return (
    <a
      href={link.href}
      className={className}
      onClick={onClick}
      {...(link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {link.label}
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
      <div className="mx-auto flex h-14 max-w-[1152px] items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[18px] font-semibold tracking-tight text-ink"
        >
          <VibeFiLogo className="h-9 w-9" />
          <span className="vf-gradient-text">VibeFi</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <NavItem
                link={link}
                className="text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
              />
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-md p-2 text-ink-muted hover:text-ink md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
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
