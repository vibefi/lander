import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Why Now", href: "/#why-now" },
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Documentation",
        href: "https://docs.vibefi.workers.dev/docs/",
        external: true,
      },
      { label: "Changelog", to: "/changelog" },
      { label: "Status", to: "/status" },
    ],
  },
  {
    title: "Code",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/vibefi/monorepo",
        external: true,
      },
      {
        label: "Contracts",
        href: "https://github.com/vibefi/monorepo/tree/master/contracts",
        external: true,
      },
      {
        label: "Client",
        href: "https://github.com/vibefi/monorepo/tree/master/client",
        external: true,
      },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-[1152px] px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[15px] font-semibold tracking-tight text-ink">
              VibeFi
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
              Decentralized governance
              <br />
              for DeFi frontends.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] font-medium uppercase tracking-wider text-ink-faint">
                {col.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"to" in link ? (
                      <Link
                        to={link.to}
                        className="text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
                        {...("external" in link
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 border-t border-border pt-6">
          <p className="text-[12px] text-ink-faint">
            &copy; {new Date().getFullYear()} VibeFi contributors. Open source
            under MIT.
          </p>
        </div>
      </div>
    </footer>
  );
}
