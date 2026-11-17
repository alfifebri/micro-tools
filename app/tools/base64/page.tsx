import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { Base64Client } from "./base64-client";

const tool = tools.find((item) => item.slug === "base64")!;

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder",
  description:
    "Encode and decode Base64 with Unicode support and URL-safe output.",
};

export default function Base64Page() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <Base64Client />
    </div>
  );
}
