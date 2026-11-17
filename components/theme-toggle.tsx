"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const next =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;

    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage can be unavailable in private browsing contexts.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <SunIcon className="h-4 w-4 dark:hidden" />
      <MoonIcon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
