import type { ReactNode } from "react";

type ContentPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  updated?: string;
  children: ReactNode;
};

export function ContentPage({
  eyebrow = "Legal",
  title,
  description,
  updated,
  children,
}: ContentPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-wider text-brand">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      {updated ? (
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">
          Last updated: {updated}
        </p>
      ) : null}

      <div className="mt-10 space-y-9 border-t border-border pt-9">
        {children}
      </div>
    </div>
  );
}

export function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold tracking-tight sm:text-lg">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  );
}
