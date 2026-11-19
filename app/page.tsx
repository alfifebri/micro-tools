import Link from "next/link";
import {
  ArrowRightIcon,
  CodeIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
} from "@/components/icons";
import { ToolExplorer } from "@/components/tool-explorer";
import { UsageFaq } from "@/components/usage-faq";

const features = [
  {
    icon: ShieldIcon,
    title: "Private by default",
    description:
      "Every tool runs entirely in your browser. Your payloads never leave this device.",
  },
  {
    icon: ZapIcon,
    title: "Zero friction",
    description:
      "No accounts, no paywalls, no loading spinners. Open a tool and get to work.",
  },
  {
    icon: CodeIcon,
    title: "Built for developers",
    description:
      "Keyboard-friendly interfaces, monospace output, and copy-ready results.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="hero-grid absolute inset-0 -z-10" />
        <div className="hero-glow absolute inset-0 -z-10" />

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pb-28 sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Open source utilities for developers
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">
            <span className="text-gradient">Developer tools that</span>
            <br />
            stay out of your way.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A growing collection of focused micro-tools for everyday
            development. Fast, private, and free — right in your browser.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="#tools"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Browse tools
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background/60 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <SparklesIcon className="h-4 w-4 text-muted-foreground" />
              View all utilities
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span>8 tools</span>
            <span className="h-3 w-px bg-border" />
            <span>no sign-up</span>
            <span className="h-3 w-px bg-border" />
            <span>0 bytes uploaded</span>
          </div>
        </div>
      </section>

      <section
        id="tools"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-brand">
              The toolbox
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need, nothing you don&apos;t.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Pick a tool and start using it immediately. No configuration, no
            onboarding.
          </p>
        </div>

        <ToolExplorer />
      </section>

      <section
        id="about"
        className="scroll-mt-20 border-t border-border bg-muted/30 dark:bg-muted/10"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-wider text-brand">
              Why micro.tools
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Small surface area. Sharp edges.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Each tool does one thing well. No dashboards to manage, no data to
              hand over, and no reason to bookmark anything else.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-muted/60 text-foreground">
                  <feature.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-sm font-medium">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <UsageFaq />
    </>
  );
}
