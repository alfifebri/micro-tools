import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { JsonFormatterClient } from "./json-formatter-client";

const tool = tools.find((item) => item.slug === "json-formatter")!;

export const metadata: Metadata = {
  title: "JSON Formatter",
  description:
    "Beautify, minify, and validate JSON with clear error positions. Copy or download the result — all in your browser.",
};

export default function JsonFormatterPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <JsonFormatterClient />
    </div>
  );
}
