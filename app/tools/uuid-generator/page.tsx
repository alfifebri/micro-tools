import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { UuidGeneratorClient } from "./uuid-generator-client";

const tool = tools.find((item) => item.slug === "uuid-generator")!;

export const metadata: Metadata = {
  title: "UUID Generator",
  description:
    "Generate cryptographically secure UUID v4 values in bulk, entirely in your browser.",
};

export default function UuidGeneratorPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <UuidGeneratorClient />
    </div>
  );
}
