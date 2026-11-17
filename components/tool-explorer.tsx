"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/tools";

export function ToolExplorer() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;

    return tools.filter((tool) =>
      [tool.name, tool.description, tool.category, tool.shortName]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools…"
          aria-label="Search tools"
          className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-16 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
          {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <p className="text-sm font-medium">No tools match “{query}”</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try searching for conversion, encoding, security, or generators.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            Clear search
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        More utilities are on the way. Have an idea? It belongs here.
      </div>
    </div>
  );
}
