import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { JsonToTsClient } from "./json-to-ts-client";

const tool = tools.find((item) => item.slug === "json-to-ts")!;

export const metadata: Metadata = {
  title: "JSON to TypeScript",
  description:
    "Convert JSON into TypeScript types instantly. Everything runs locally in your browser.",
};

export default function JsonToTsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <JsonToTsClient />
    </div>
  );
}
