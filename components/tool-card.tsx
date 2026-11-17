import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { ToolIcon } from "@/components/tool-icon";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-muted/60 text-foreground transition-colors group-hover:border-brand/40 group-hover:bg-brand/10 group-hover:text-brand">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-[15px] font-medium tracking-tight">{tool.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {tool.category}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/60">
          /{tool.shortName}
        </span>
      </div>
    </Link>
  );
}
