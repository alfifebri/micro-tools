import Link from "next/link";
import { TerminalIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background transition-transform group-hover:-rotate-3">
            <TerminalIcon className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            micro
            <span className="font-mono text-muted-foreground">.tools</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/tools"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
          >
            Tools
          </Link>
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
