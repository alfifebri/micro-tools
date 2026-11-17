import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { JwtDecoderClient } from "./jwt-decoder-client";

const tool = tools.find((item) => item.slug === "jwt-decoder")!;

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode and inspect JWT headers, payloads, and claims locally in your browser.",
};

export default function JwtDecoderPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <JwtDecoderClient />
    </div>
  );
}
