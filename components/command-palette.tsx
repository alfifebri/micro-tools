"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";
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
        className="hidden items-center gap-2 rounded-lg border border-border bg-muted/30 py-1.5 pl-2.5 pr-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
      >
        <SearchIcon className="h-3.5 w-3.5" />
        <span>Search tools…</span>
        <kbd className="ml-4 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
          Ctrl K
        </kbd>
      </button>
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setActiveIndex(0);
          setOpen(true);
        }}
        aria-label="Search tools"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
      >
        <SearchIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-sm sm:pt-28"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePalette();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
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
                className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                Esc
              </kbd>
            </div>

            <div
              id="command-palette-results"
              role="listbox"
              aria-label="Tools"
              className="max-h-[min(60vh,420px)] overflow-y-auto p-2"
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
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "bg-muted text-foreground"
                          : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-background text-muted-foreground">
                        <ToolIcon name={tool.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {tool.name}
                          </span>
                          <span className="shrink-0 rounded-full border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                            {tool.category}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {tool.description}
                        </span>
                      </span>
                      <ArrowRightIcon
                        className={`h-3.5 w-3.5 shrink-0 transition-opacity ${
                          active
                            ? "text-foreground opacity-100"
                            : "text-muted-foreground opacity-0"
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

            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
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
