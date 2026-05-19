import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-hero text-primary-foreground font-display text-sm font-bold">
            CS
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            CSE<span className="text-accent">.review</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="text-muted-foreground transition hover:text-foreground">
            Home
          </Link>
          <Link to="/topics" activeProps={{ className: "text-foreground" }} className="text-muted-foreground transition hover:text-foreground">
            Topics
          </Link>
          <a href="/#how" className="text-muted-foreground transition hover:text-foreground">How it works</a>
          <a href="/#disclaimer" className="text-muted-foreground transition hover:text-foreground">About</a>
        </nav>
        <Link
          to="/topics"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-secondary"
        >
          Start review
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-semibold">CSE.review</div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            A free, independent Civil Service Examination review platform for Filipino examinees.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-display font-semibold">Study</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/topics" className="hover:text-foreground">All topics</Link></li>
            <li><a href="/#diagnostic" className="hover:text-foreground">Diagnostic quiz</a></li>
            <li><a href="/#how" className="hover:text-foreground">How it works</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-display font-semibold">Disclaimer</div>
          <p className="mt-3 text-muted-foreground">
            Not affiliated with, endorsed by, or connected to the Civil Service Commission. All practice items are original study material.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CSE.review — Free study resource.
      </div>
    </footer>
  );
}
