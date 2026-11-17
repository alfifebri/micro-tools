import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ToolIcon } from "@/components/tool-icon";
import type { Tool } from "@/lib/tools";

export function ToolPageHeader({ tool }: { tool: Tool }) {
  return (
    <div className="mb-8">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
        All tools
      </Link>

      <div className="mt-5 flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-muted/60 text-foreground">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {tool.name}
            </h1>
            <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {tool.category}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
        </div>
      </div>
    </div>
  );
}
