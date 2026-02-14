import { Link } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <Nav />
      <main className="mx-auto flex min-h-[60vh] max-w-[1152px] flex-col items-center justify-center px-6 py-24">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-3 text-[15px] text-ink-muted">
          This page is coming soon.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-10 items-center rounded-lg border border-border px-5 text-[14px] font-medium text-ink-muted transition-colors duration-150 hover:border-ink-faint hover:text-ink"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
