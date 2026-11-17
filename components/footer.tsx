import Link from "next/link";
import { TerminalIcon } from "@/components/icons";

const productLinks = [
  { href: "/tools", label: "All tools" },
  { href: "/about", label: "About us" },
];

const toolLinks = [
  { href: "/tools/json-to-ts", label: "JSON to TS" },
  { href: "/tools/base64", label: "Base64" },
  { href: "/tools/jwt-decoder", label: "JWT Decoder" },
  { href: "/tools/uuid-generator", label: "UUID Generator" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
                <TerminalIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-semibold tracking-tight">
                micro
                <span className="font-mono text-muted-foreground">.tools</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Fast, focused utilities for developers. No accounts, no uploads —
              your payloads stay in your browser.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:flex sm:gap-16">
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Tools" links={toolLinks} />
            <FooterColumn title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Micro Tools. Built for developers.</p>
          <p className="font-mono">
            100% client-side tools · no payload storage
          </p>
        </div>
      </div>
    </footer>
  );
}
