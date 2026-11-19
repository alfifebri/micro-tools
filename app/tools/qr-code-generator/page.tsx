import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { QrCodeGeneratorClient } from "./qr-code-generator-client";

const tool = tools.find((item) => item.slug === "qr-code-generator")!;

export const metadata: Metadata = {
  title: "QR Code Generator",
  description:
    "Generate customizable QR codes from any text or URL. Choose size, colors, and error correction, then download as PNG — all in your browser.",
};

export default function QrCodeGeneratorPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <QrCodeGeneratorClient />
    </div>
  );
}
