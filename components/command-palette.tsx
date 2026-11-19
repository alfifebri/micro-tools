"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { ToolIcon } from "@/components/tool-icon";
import { tools, type Tool } from "@/lib/tools";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCommand =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k";

      if (isCommand) {
        event.preventDefault();
        if (openRef.current) {
          setOpen(false);
        } else {
          setQuery("");
          setActiveIndex(0);
          setOpen(true);
        }
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;

    return tools.filter((tool) =>
      [
        tool.name,
        tool.description,
        tool.category,
        tool.shortName,
        tool.slug,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`command-item-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, filtered.length]);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  function goTo(tool: Tool) {
    closePalette();
    router.push(tool.href);
  }

  function handleInputKeyDown(
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        filtered.length === 0 ? 0 : (prev + 1) % filtered.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        filtered.length === 0
          ? 0
          : (prev - 1 + filtered.length) % filtered.length,
      );
      return;
    }

    if (event.key === "Enter") {
      const target = filtered[activeIndex];
      if (!target) return;
      event.preventDefault();
      goTo(target);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setActiveIndex(0);
          setOpen(true);
        }}
        aria-label="Search tools (Ctrl+K)"
        aria-keyshortcuts="Control+K Meta+K"
        title="Search tools (Ctrl+K / ⌘K)"
        className="hidden items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:flex"
      >
        <SearchIcon className="h-3.5 w-3.5" />
        <span>Search tools…</span>
      </button>
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setActiveIndex(0);
          setOpen(true);
        }}
        aria-label="Search tools"
        aria-keyshortcuts="Control+K Meta+K"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:hidden"
      >
        <SearchIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-20 backdrop-blur-md sm:pt-28"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePalette();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="animate-fade-up w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-24px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-4">
              <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls="command-palette-results"
                aria-autocomplete="list"
                aria-activedescendant={
                  filtered.length > 0
                    ? `command-item-${activeIndex}`
                    : undefined
                }
                placeholder="Search tools by name, category, or keyword…"
                className="h-[52px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                Esc
              </kbd>
              <button
                type="button"
                onClick={closePalette}
                aria-label="Close command palette"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-8 sm:w-8"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div
              id="command-palette-results"
              role="listbox"
              aria-label="Tools"
              className="flex max-h-[min(60vh,420px)] flex-col gap-1 overflow-y-auto p-3"
            >
              {filtered.length > 0 ? (
                filtered.map((tool, index) => {
                  const active = index === activeIndex;

                  return (
                    <button
                      key={tool.slug}
                      id={`command-item-${index}`}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goTo(tool)}
                      className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                        active
                          ? "border-border bg-muted text-foreground shadow-sm"
                          : "border-transparent text-foreground hover:border-border/70 hover:bg-muted/50"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors ${
                          active
                            ? "border-brand/30 bg-brand/10 text-brand"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        <ToolIcon name={tool.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {tool.name}
                          </span>
                          <span className="shrink-0 rounded-full bg-background/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-border/60">
                            {tool.category}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                          {tool.description}
                        </span>
                      </span>
                      <ArrowRightIcon
                        className={`h-3.5 w-3.5 shrink-0 transition-all ${
                          active
                            ? "translate-x-0 text-foreground opacity-100"
                            : "-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                        }`}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm font-medium">
                    No tools found for “{query}”
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different name, category, or keyword.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveIndex(0);
                    }}
                    className="mt-4 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3 font-mono text-[10px] text-muted-foreground">
              <span aria-live="polite">
                {filtered.length}{" "}
                {filtered.length === 1 ? "result" : "results"}
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden sm:inline">↑↓ navigate</span>
                <span className="hidden sm:inline">↵ open</span>
                <span>esc close</span>
                <Link
                  href="/tools"
                  onClick={closePalette}
                  className="text-foreground underline underline-offset-2"
                >
                  all tools
                </Link>
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
