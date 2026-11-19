import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { MarkdownPreviewerClient } from "./markdown-previewer-client";

const tool = tools.find((item) => item.slug === "markdown-previewer")!;

export const metadata: Metadata = {
  title: "Markdown Live Previewer",
  description:
    "Write Markdown and see a clean, safe live preview. Copy the source or rendered HTML, and download your notes as .md — all in your browser.",
};

export default function MarkdownPreviewerPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <MarkdownPreviewerClient />
    </div>
  );
}
