import type { Metadata } from "next";
import { ToolExplorer } from "@/components/tool-explorer";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Browse the full collection of Micro Tools utilities for developers.",
};

export default function ToolsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-brand">
          {tools.length} utilities and counting
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          The toolbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Focused developer utilities that run entirely in your browser. Pick
          one and start working — nothing to install.
        </p>
      </div>

      <ToolExplorer />
    </div>
  );
}
